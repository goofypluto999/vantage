// jobSources — pluggable source-adapter pattern for the AI Job Search
// feature. Imported by api/interview/[action].ts (the `jobsearch`
// action). Lives at project-root /lib/ so Vercel's function counter
// (which walks /api/) doesn't count this file. Vercel bundles
// transitive imports into the function it's imported by.
//
// Built 2026-05-11 as part of the "tool → service" milestone.
//
// Each adapter implements JobSource. The dispatcher fetches from all
// configured sources in parallel with per-source timeout + dedup.
// Adapters NEVER throw — they return empty arrays + log on failure so
// one bad source doesn't take down the whole search.

import { createHash } from 'crypto';

// ─── Shared types ─────────────────────────────────────────────────────

export type WorkMode = 'remote' | 'hybrid' | 'on-site' | 'any';
export type PostedWithinDays = 1 | 3 | 7 | 14 | 30 | 90;

/** Country codes Adzuna supports (free key covers all 20). */
export const ADZUNA_COUNTRIES = [
  'gb', 'us', 'ca', 'au', 'de', 'fr', 'es', 'it',
  'nl', 'pl', 'sg', 'in', 'br', 'mx', 'ru', 'za',
  'nz', 'ch', 'at', 'be',
] as const;
export type AdzunaCountry = typeof ADZUNA_COUNTRIES[number];

export interface JobSearchParams {
  /** Free-text keywords (role, company, skill). May be empty. */
  keywords: string;
  /** City / region / postcode. May be empty. */
  location: string;
  /** ISO 3166 country code, lowercase. Default 'gb'. */
  country: AdzunaCountry;
  /** Work mode filter. 'any' = no filter. */
  workMode: WorkMode;
  /** Min salary in country-local currency. 0 = unset. */
  salaryMin?: number;
  /** Posted-within filter in days. */
  postedWithin: PostedWithinDays;
  /** Hard cap on raw results requested per source. */
  perSourceLimit: number;
}

/** Normalized raw job after source adapter; AI scorer consumes this. */
export interface RawJob {
  /** Stable id from source (URL hash if missing). Used for dedup. */
  id: string;
  title: string;
  company: string;
  /** City / region. May be empty. */
  location: string;
  /** Original posting URL. */
  url: string;
  /** Source-specific description (plain text or HTML — adapter normalizes). */
  description: string;
  /** ISO date of posting. May be empty if source doesn't provide. */
  postedAt: string;
  /** Salary as-listed by source. May be undefined. */
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  /** Source name (for analytics + UI source-of-truth badge). */
  source: 'adzuna' | 'remotive' | 'mock';
  /** Work mode if known (remote-anywhere from Remotive, else inferred). */
  workMode?: WorkMode;
}

export interface JobSource {
  name: 'adzuna' | 'remotive' | 'mock';
  /** Returns RawJob[] or []. NEVER throws. */
  fetch(params: JobSearchParams): Promise<RawJob[]>;
}

// ─── Helpers ──────────────────────────────────────────────────────────

/** Sanitize a string for safe storage + display. Strips control chars
 * and caps length so a hostile source can't blow up the prompt. */
export function safeText(s: any, maxLen = 4000): string {
  if (typeof s !== 'string') return '';
  // Strip HTML tags (Adzuna sometimes returns HTML in descriptions).
  const stripped = s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
  // Collapse whitespace + control chars.
  // eslint-disable-next-line no-control-regex
  const cleaned = stripped.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, maxLen);
}

/** Dedup key: lowercase title + company + location, hashed. */
export function dedupKey(job: RawJob): string {
  const k = `${(job.title || '').toLowerCase().trim()}|${(job.company || '').toLowerCase().trim()}|${(job.location || '').toLowerCase().trim()}`;
  return createHash('sha1').update(k).digest('hex').slice(0, 16);
}

/** Stable URL hash — fallback id when source doesn't provide one. */
export function urlHash(url: string): string {
  return createHash('sha1').update(url || '').digest('hex').slice(0, 16);
}

/** Apply uniform fetch timeout to any adapter. */
async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Adzuna adapter ───────────────────────────────────────────────────
// https://developer.adzuna.com/docs/search
// Free tier: ~1000 calls/day. Upgrade path: €99/mo for 100k.
//
// Endpoint: GET /v1/api/jobs/<country>/search/1
//   ?app_id=…&app_key=…&results_per_page=20&what=<kw>&where=<loc>
//   &salary_min=<n>&max_days_old=<n>&content-type=application/json

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '';

export const adzunaSource: JobSource = {
  name: 'adzuna',
  async fetch(params): Promise<RawJob[]> {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      // Quiet fail — keys not configured yet (will be when Gio adds them).
      return [];
    }
    if (!(ADZUNA_COUNTRIES as readonly string[]).includes(params.country)) {
      return [];
    }
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${params.country}/search/1`);
    url.searchParams.set('app_id', ADZUNA_APP_ID);
    url.searchParams.set('app_key', ADZUNA_APP_KEY);
    url.searchParams.set('results_per_page', String(Math.min(50, Math.max(10, params.perSourceLimit))));
    url.searchParams.set('content-type', 'application/json');
    if (params.keywords?.trim()) url.searchParams.set('what', params.keywords.trim().slice(0, 200));
    if (params.location?.trim()) url.searchParams.set('where', params.location.trim().slice(0, 100));
    if (params.salaryMin && params.salaryMin > 0) url.searchParams.set('salary_min', String(params.salaryMin));
    url.searchParams.set('max_days_old', String(params.postedWithin));
    // Adzuna doesn't have a remote/hybrid filter — we filter client-side
    // after fetch using keyword heuristics + AI scoring.

    try {
      const res = await fetchWithTimeout(url.toString(), {}, 5000);
      if (!res.ok) {
        console.warn(`adzuna: ${res.status} ${res.statusText}`);
        return [];
      }
      const data: any = await res.json();
      const results: any[] = Array.isArray(data?.results) ? data.results : [];
      return results.map((r: any): RawJob => {
        const u = safeText(r?.redirect_url || r?.adref || '', 2000);
        return {
          id: r?.id ? String(r.id) : urlHash(u),
          title: safeText(r?.title, 200),
          company: safeText(r?.company?.display_name || r?.company?.name || '', 200),
          location: safeText(r?.location?.display_name || '', 200),
          url: u,
          description: safeText(r?.description, 4000),
          postedAt: safeText(r?.created || '', 50),
          salaryMin: typeof r?.salary_min === 'number' ? r.salary_min : undefined,
          salaryMax: typeof r?.salary_max === 'number' ? r.salary_max : undefined,
          salaryCurrency: undefined, // Adzuna returns numeric only; currency inferred from country
          source: 'adzuna',
        };
      });
    } catch (err: any) {
      console.warn(`adzuna fetch error: ${err?.message || 'unknown'}`);
      return [];
    }
  },
};

// ─── Remotive adapter ─────────────────────────────────────────────────
// https://remotive.com/api-documentation
// No API key required. Free, generous rate limits.
//
// Endpoint: GET https://remotive.com/api/remote-jobs
//   ?search=<keywords>&limit=<n>&category=<optional>

export const remotiveSource: JobSource = {
  name: 'remotive',
  async fetch(params): Promise<RawJob[]> {
    // Only return remote jobs when user wants remote-or-any. Skip
    // entirely for on-site or hybrid filters (Remotive is remote-only).
    if (params.workMode === 'on-site' || params.workMode === 'hybrid') return [];
    const url = new URL('https://remotive.com/api/remote-jobs');
    if (params.keywords?.trim()) url.searchParams.set('search', params.keywords.trim().slice(0, 200));
    url.searchParams.set('limit', String(Math.min(50, Math.max(5, params.perSourceLimit))));

    try {
      const res = await fetchWithTimeout(url.toString(), {
        headers: { 'Accept': 'application/json' },
      }, 5000);
      if (!res.ok) {
        console.warn(`remotive: ${res.status} ${res.statusText}`);
        return [];
      }
      const data: any = await res.json();
      const jobs: any[] = Array.isArray(data?.jobs) ? data.jobs : [];
      return jobs.map((j: any): RawJob => {
        const u = safeText(j?.url || '', 2000);
        return {
          id: j?.id ? String(j.id) : urlHash(u),
          title: safeText(j?.title, 200),
          company: safeText(j?.company_name, 200),
          location: safeText(j?.candidate_required_location || 'Remote', 200),
          url: u,
          description: safeText(j?.description, 4000),
          postedAt: safeText(j?.publication_date || '', 50),
          salaryMin: undefined,
          salaryMax: undefined,
          salaryCurrency: undefined,
          source: 'remotive',
          workMode: 'remote',
        };
      });
    } catch (err: any) {
      console.warn(`remotive fetch error: ${err?.message || 'unknown'}`);
      return [];
    }
  },
};

// ─── Mock adapter (dev/test only) ─────────────────────────────────────
// Loaded only when env JOBSEARCH_MOCK === 'true'. Returns realistic
// fixture data so the full pipeline can be tested locally + multi-
// agent reviewed without needing the Adzuna key in place.

const MOCK_FIXTURES: RawJob[] = [
  {
    id: 'mock-1',
    title: 'Senior Product Manager, Billing Platform',
    company: 'Stripe',
    location: 'London, United Kingdom',
    url: 'https://stripe.com/jobs',
    description: 'Lead the billing platform team. Ship pricing experiments. Build the API surface for invoicing automation. Stack: TypeScript, Ruby, GCP. Looking for 8+yrs PM experience, ideally B2B SaaS.',
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    salaryMin: 130000,
    salaryMax: 160000,
    salaryCurrency: 'GBP',
    source: 'mock',
  },
  {
    id: 'mock-2',
    title: 'Staff Software Engineer (Remote, EU)',
    company: 'Linear',
    location: 'Remote, EU',
    url: 'https://linear.app/careers',
    description: 'Help build the issue tracker that fast-moving teams love. Strong systems engineering background. TypeScript + Postgres. Async culture.',
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: 'EUR',
    source: 'mock',
    workMode: 'remote',
  },
  {
    id: 'mock-3',
    title: 'Product Lead, AI Infrastructure',
    company: 'Anthropic',
    location: 'London, United Kingdom (Hybrid)',
    url: 'https://anthropic.com/careers',
    description: 'Define product strategy for Claude infrastructure. PM + technical depth. 10+yrs experience preferred. Hybrid 3 days in London office.',
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    salaryMin: 180000,
    salaryMax: 240000,
    salaryCurrency: 'GBP',
    source: 'mock',
  },
  {
    id: 'mock-4',
    title: 'Senior Engineer — Self-starter rockstar ninja!!',
    company: 'CryptoQuantumAI Inc',
    location: 'Remote',
    url: 'https://example.invalid/job-456',
    description: 'Highly motivated self-starter to join our world-class team. Passionate about innovation. Wear many hats. Junior/Mid/Senior — we are flexible on level.',
    postedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    salaryMin: 30000,
    salaryMax: 200000,
    salaryCurrency: 'GBP',
    source: 'mock',
  },
  {
    id: 'mock-5',
    title: 'Group Product Manager, Payments',
    company: 'Shopify',
    location: 'Remote (Worldwide)',
    url: 'https://shopify.com/careers',
    description: 'Lead a team of 4 PMs across payments. Drive merchant payment infrastructure for 5M+ merchants. Experience scaling B2B SaaS payments required.',
    postedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    salaryMin: 160000,
    salaryMax: 220000,
    salaryCurrency: 'USD',
    source: 'mock',
    workMode: 'remote',
  },
];

export const mockSource: JobSource = {
  name: 'mock',
  async fetch(params): Promise<RawJob[]> {
    // Double-gate: BOTH the explicit env opt-in AND a non-production
    // NODE_ENV must be true. Multi-agent review (MED) flagged that a
    // single accidental `JOBSEARCH_MOCK=true` in Vercel would ship
    // fixtures to real users. With both gates we'd need someone to set
    // NODE_ENV away from 'production' AND the opt-in — extremely hard
    // to do by accident.
    if (process.env.JOBSEARCH_MOCK !== 'true') return [];
    if (process.env.NODE_ENV === 'production') return [];
    // Simple keyword filter so the mock feels somewhat responsive to
    // user input during dev testing.
    const kw = (params.keywords || '').toLowerCase().trim();
    if (!kw) return MOCK_FIXTURES;
    return MOCK_FIXTURES.filter((j) =>
      `${j.title} ${j.company} ${j.description}`.toLowerCase().includes(kw),
    );
  },
};

// ─── Orchestrator ─────────────────────────────────────────────────────

/** Per-source state surfaced to the UI so the user can tell the
 * difference between "no Adzuna key configured" vs "Adzuna returned
 * 0 hits" vs "Adzuna errored out." Multi-agent review (MED) caught
 * that the previous count-only signal was misleading. */
export type SourceState = 'configured' | 'not-configured' | 'errored';
export interface SourceReport {
  count: number;
  state: SourceState;
}

/** Fetch from all configured sources in parallel, dedup, return raw
 * list to the dispatcher. AI scoring happens in the dispatcher (so
 * the dispatcher controls Gemini cost). */
export async function fetchAllSources(params: JobSearchParams): Promise<{
  rawJobs: RawJob[];
  perSourceCounts: Record<string, number>;
  perSourceReport: Record<string, SourceReport>;
  fetched: number;
  deduped: number;
}> {
  const sources: JobSource[] = [adzunaSource, remotiveSource, mockSource];
  const results = await Promise.allSettled(sources.map((s) => s.fetch(params)));

  const perSourceCounts: Record<string, number> = {};
  const perSourceReport: Record<string, SourceReport> = {};
  const all: RawJob[] = [];
  for (let i = 0; i < sources.length; i += 1) {
    const s = sources[i];
    const r = results[i];
    if (r.status === 'fulfilled') {
      perSourceCounts[s.name] = r.value.length;
      // Determine state: if zero results AND known to be unconfigured
      // (Adzuna keys missing, mock disabled), report 'not-configured'.
      let state: SourceState = 'configured';
      if (s.name === 'adzuna' && (!ADZUNA_APP_ID || !ADZUNA_APP_KEY)) {
        state = 'not-configured';
      } else if (s.name === 'mock' && process.env.JOBSEARCH_MOCK !== 'true') {
        state = 'not-configured';
      }
      perSourceReport[s.name] = { count: r.value.length, state };
      all.push(...r.value);
    } else {
      perSourceCounts[s.name] = 0;
      perSourceReport[s.name] = { count: 0, state: 'errored' };
      console.warn(`source ${s.name} rejected: ${String((r as PromiseRejectedResult).reason).slice(0, 200)}`);
    }
  }

  // Dedup by (title+company+location)
  const seen = new Set<string>();
  const deduped: RawJob[] = [];
  for (const job of all) {
    const k = dedupKey(job);
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(job);
  }

  return {
    rawJobs: deduped,
    perSourceCounts,
    perSourceReport,
    fetched: all.length,
    deduped: deduped.length,
  };
}
