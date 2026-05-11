// jobSources — pluggable source-adapter pattern for the AI Job Search
// feature. Imported by api/interview/[action].ts (the `jobsearch`
// action) via the relative path `'../_lib/jobSources'`.
//
// Vercel-bundling note (2026-05-11 incident recovery):
// Earlier attempt (commit 106a0bf) put this file at top-level
// `lib/jobSources.ts`; Vercel's serverless bundler did NOT include it
// in the function bundle, causing a runtime crash that took down the
// entire /api/interview/[action].ts dispatcher (followup + negotiation
// + AI mock interview ALL went 500). Lesson: helper modules MUST live
// inside api/, in an underscore-prefixed dir so Vercel's function-
// counter ignores them as routes but still bundles them as transitive
// imports. The preflight check `api-no-escaping-imports` (added in
// commit 903122e) now blocks any future `../../lib/...` import from
// inside api/ pre-push.
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

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '';

export const adzunaSource: JobSource = {
  name: 'adzuna',
  async fetch(params): Promise<RawJob[]> {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
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

    try {
      const res = await fetchWithTimeout(url.toString(), {}, 5000);
      if (!res.ok) {
        console.warn(`adzuna: ${res.status} ${res.statusText}`);
        return [];
      }
      const data: any = await res.json();
      const results: any[] = Array.isArray(data?.results) ? data.results : [];
      return results.map((r: any): RawJob => {
        const u = safeText(r?.redirect_url || '', 2000);
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
          salaryCurrency: undefined,
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
// https://remotive.com/api-documentation — no API key.

export const remotiveSource: JobSource = {
  name: 'remotive',
  async fetch(params): Promise<RawJob[]> {
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

// ─── Mock adapter (dev-only, double-gated) ────────────────────────────
// Multi-agent review MED: gated on BOTH JOBSEARCH_MOCK=true AND
// NODE_ENV !== 'production', so a single accidental env-var setting
// can't ship fixtures to real users.

const MOCK_FIXTURES: RawJob[] = [
  {
    id: 'mock-1',
    title: 'Senior Product Manager, Billing Platform',
    company: 'Stripe',
    location: 'London, United Kingdom',
    url: 'https://stripe.com/jobs',
    description: 'Lead the billing platform team. Ship pricing experiments. Build the API surface for invoicing automation. Stack: TypeScript, Ruby, GCP.',
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    salaryMin: 130000, salaryMax: 160000, salaryCurrency: 'GBP', source: 'mock',
  },
  {
    id: 'mock-2',
    title: 'Staff Software Engineer (Remote, EU)',
    company: 'Linear',
    location: 'Remote, EU',
    url: 'https://linear.app/careers',
    description: 'Help build the issue tracker that fast-moving teams love. TypeScript + Postgres. Async culture.',
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    salaryMin: 140000, salaryMax: 180000, salaryCurrency: 'EUR', source: 'mock', workMode: 'remote',
  },
];

export const mockSource: JobSource = {
  name: 'mock',
  async fetch(params): Promise<RawJob[]> {
    if (process.env.JOBSEARCH_MOCK !== 'true') return [];
    if (process.env.NODE_ENV === 'production') return [];
    const kw = (params.keywords || '').toLowerCase().trim();
    if (!kw) return MOCK_FIXTURES;
    return MOCK_FIXTURES.filter((j) =>
      `${j.title} ${j.company} ${j.description}`.toLowerCase().includes(kw),
    );
  },
};

// ─── Per-source state reporting (review MED) ──────────────────────────

export type SourceState = 'configured' | 'not-configured' | 'errored';
export interface SourceReport {
  count: number;
  state: SourceState;
}

// ─── Orchestrator ─────────────────────────────────────────────────────

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
