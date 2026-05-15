// /api/<publicTool> — catch-all for small unauthenticated public endpoints.
//
// Vercel routes any /api/<x> request to this dispatcher UNLESS a more
// specific handler exists (e.g. /api/analyze → api/analyze/index.ts wins,
// /api/roast → api/roast/index.ts wins, /api/admin/X → api/admin/[action]
// wins, etc.). Dynamic segment lands in `request.query.publicTool`.
//
// Currently dispatches:
//   - search-suggest  → OpenSearch suggestions JSON
//   - webmention      → W3C Webmention receiver
//
// Both endpoints are anonymous, public, and small. Consolidating them
// into a single function file reclaims 1 slot toward Vercel Hobby's
// 12-function-per-deployment limit. To add another small public
// endpoint: register a route in PUBLIC_TOOLS and add a handler.

import { createHash } from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SITE_HOST = 'aimvantage.uk';

// =============================================================================
// search-suggest
// =============================================================================
interface SuggestionEntry {
  match: string[];
  label: string;
  description: string;
  url: string;
}

const SUGGESTIONS: SuggestionEntry[] = [
  { match: ['cover', 'letter', 'roast'], label: 'Cover letter roast', description: 'Free AI roast of your cover letter (10s)', url: 'https://aimvantage.uk/roast' },
  { match: ['no', 'interview', 'interviews', 'diagnostic'], label: 'Why no interviews? — 60s diagnostic', description: '5-question deterministic diagnostic, 7 verdicts', url: 'https://aimvantage.uk/tools/no-interviews-diagnostic' },
  { match: ['decode', 'rejection', 'email'], label: 'Decode rejection email', description: 'AI translation of recruiter rejection language', url: 'https://aimvantage.uk/decode-rejection' },
  { match: ['ghost', 'job', 'fake'], label: 'Ghost job detector', description: 'Score how likely a job listing is a ghost (0-100)', url: 'https://aimvantage.uk/ghost-job-check' },
  { match: ['jobscan', 'cost', 'calculator', 'vs'], label: 'Jobscan vs Vantage cost calculator', description: '12-month cost comparison vs Vantage', url: 'https://aimvantage.uk/tools/jobscan-cost-calculator' },
  { match: ['ats', 'workday', 'parser', 'cv', 'mirror'], label: 'CV Mirror — free ATS scanner', description: 'See how Workday/Greenhouse/Lever/Taleo/iCIMS parse your CV', url: 'https://cv-mirror-web.vercel.app/' },
  { match: ['pricing', 'price', 'cost', 'plan'], label: 'Pricing', description: '£5 starter pack (20 prep packs, never expires) or monthly subscription', url: 'https://aimvantage.uk/pricing' },
  { match: ['receipts', 'trust', 'safe', 'legit', 'real'], label: 'Receipts (trust audit)', description: 'Single-page audit of every Vantage trust claim', url: 'https://aimvantage.uk/receipts' },
  { match: ['about', 'operator', 'founder', 'who'], label: 'About the operator', description: 'Giovanni Sizino Ennes, UK independent founder', url: 'https://aimvantage.uk/about' },
  { match: ['interview', 'prep', 'company'], label: 'Interview prep by company', description: 'Google, Meta, Amazon, Stripe, OpenAI, Anthropic, +14 more', url: 'https://aimvantage.uk/interview-prep' },
  { match: ['interview', 'questions', 'role', 'engineer', 'pm', 'data'], label: 'Interview questions by role', description: 'SWE, PM, DS, Frontend, DevOps, Marketing, +more', url: 'https://aimvantage.uk/interview-questions' },
  { match: ['layoff', 'laid', 'off', 'redundant', 'fired'], label: 'Just laid off? 2026 playbook', description: 'Cohort-specific layoff playbook + free AI tools', url: 'https://aimvantage.uk/laid-off' },
  { match: ['blog', 'article', 'guide'], label: 'Blog', description: 'Long-form guides on AI job prep', url: 'https://aimvantage.uk/blog' },
  { match: ['sample', 'example', 'demo'], label: 'Sample analyses', description: 'Real example outputs (no signup)', url: 'https://aimvantage.uk/sample/anthropic-senior-pm' },
  { match: ['tools', 'free'], label: 'All free tools', description: 'Hub of every free Vantage tool', url: 'https://aimvantage.uk/tools' },
  { match: ['changelog', 'release', 'updates'], label: 'Changelog', description: 'Public release log including bug history', url: 'https://aimvantage.uk/changelog' },
  { match: ['faq', 'help'], label: 'FAQ', description: 'Honest answers about what Vantage does', url: 'https://aimvantage.uk/faq' },
];

function rankSuggestions(query: string): SuggestionEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return SUGGESTIONS
    .map((s) => {
      const labelLower = s.label.toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (labelLower.includes(tok)) score += 5;
        if (s.match.some((m) => m.includes(tok) || tok.includes(m))) score += 3;
      }
      if (labelLower.includes(q)) score += 10;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.s);
}

async function handleSearchSuggest(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const raw = req.query?.q;
  const q = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : '';
  const safeQ = (q || '').slice(0, 200);
  const matches = rankSuggestions(safeQ);
  const body: [string, string[], string[], string[]] = [
    safeQ,
    matches.map((m) => m.label),
    matches.map((m) => m.description),
    matches.map((m) => m.url),
  ];
  res.setHeader('Content-Type', 'application/x-suggestions+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(JSON.stringify(body));
}

// =============================================================================
// webmention
// =============================================================================
const MAX_URL_LEN = 2000;
const RATE_BUCKET = new Map<string, { count: number; first: number }>();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;
const SPAM_PATTERNS = [
  /casino/i, /poker/i, /viagra/i, /cialis/i, /porn/i, /xxx/i,
  /loan/i, /payday/i, /bitcoin\s*-?\s*(?:double|invest)/i,
  /\.ru\/.*-(?:viagra|loan|porn)/i, /\.tk\//i, /\.ml\//i,
  /telegram\.me.*sell/i, /buy-followers/i, /seo-?backlinks?/i,
];

function getClientIp(req: any): string {
  const xv = req.headers['x-vercel-forwarded-for'];
  if (typeof xv === 'string' && xv) return xv.trim();
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string') {
    const parts = xff.split(',').map((s: string) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return 'unknown';
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_BUCKET.get(ip);
  if (!bucket || now - bucket.first > RATE_WINDOW_MS) {
    RATE_BUCKET.set(ip, { count: 1, first: now });
    return true;
  }
  if (bucket.count >= RATE_MAX) return false;
  bucket.count += 1;
  return true;
}

function isHttpUrl(s: string): boolean {
  if (!s || s.length > MAX_URL_LEN) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isOurTarget(target: string): boolean {
  try {
    const u = new URL(target);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    return host === SITE_HOST;
  } catch {
    return false;
  }
}

function looksLikeSpam(source: string): boolean {
  return SPAM_PATTERNS.some((re) => re.test(source));
}

async function persistPending(source: string, target: string, ip: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/webmentions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates',
      },
      body: JSON.stringify({
        source,
        target,
        ip_hash: ip === 'unknown' ? null : createHash('sha256').update(ip).digest('hex').slice(0, 64),
        status: 'pending',
        received_at: new Date().toISOString(),
      }),
    });
  } catch { /* best-effort */ }
}

async function handleWebmention(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(
      'AimVantage Webmention endpoint.\n' +
      'POST application/x-www-form-urlencoded with source= and target=.\n' +
      'Spec: https://www.w3.org/TR/webmention/\n'
    );
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST, GET');
    res.json({ error: 'Method not allowed.' });
    return;
  }

  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    res.status(429).setHeader('Retry-After', '60');
    res.json({ error: 'Rate limit exceeded — 5/min/IP.' });
    return;
  }

  let source = '';
  let target = '';
  try {
    if (req.body && typeof req.body === 'object') {
      source = String((req.body as any).source || '').trim();
      target = String((req.body as any).target || '').trim();
    } else if (typeof req.body === 'string') {
      const parsed = new URLSearchParams(req.body);
      source = (parsed.get('source') || '').trim();
      target = (parsed.get('target') || '').trim();
    }
  } catch { /* fall through */ }

  if (!isHttpUrl(source)) return res.status(400).json({ error: 'Invalid source URL.' });
  if (!isHttpUrl(target)) return res.status(400).json({ error: 'Invalid target URL.' });
  if (source === target) return res.status(400).json({ error: 'source and target must differ.' });
  if (!isOurTarget(target)) return res.status(400).json({ error: 'target must be on aimvantage.uk.' });
  if (looksLikeSpam(source)) {
    res.status(202).setHeader('Location', 'https://aimvantage.uk/mentions/pending');
    res.send('');
    return;
  }
  await persistPending(source, target, ip);
  res.status(202).setHeader('Location', 'https://aimvantage.uk/mentions/pending');
  res.send('');
}

// =============================================================================
// health-deep — multi-probe operational status
// =============================================================================
// Probes each external dependency we can't live without, with a tight per-
// probe timeout. ALWAYS returns HTTP 200 with a status field — even if a
// probe fails — so keyword-style uptime monitors (UptimeRobot etc.) stay
// meaningful (they alert when `"status":"ok"` is absent from the body).
//
// Probe taxonomy:
//   - supabase   : AUTHORITATIVE. GET /auth/v1/health with apikey header
//                  returns 200 + JSON when healthy. If this is down, our
//                  product is meaningfully down.
//   - stripe     : ADVISORY (reachability only). HEAD on the API host —
//                  401/404 is "edge is up", real call would need our
//                  secret key + cost cycles for no extra signal.
//   - resend     : ADVISORY (reachability only). Same.
//   - gemini     : ADVISORY (reachability only). Same.
//
// Top-level `status` is 'ok' iff the AUTHORITATIVE probes are ok. Advisory
// probes have an `ok` flag but don't down the rollup — they're operator
// breadcrumbs ("internet path to Stripe is up") not health signals.
//
// In-memory result cache (30s TTL) protects against amplification abuse:
// unauthenticated endpoint × 4 outbound fetches per call is exactly the
// shape a bot would target to burn our Vercel egress. UptimeRobot polls
// every 1-5 min anyway so 30s cache costs nothing operationally.
//
// Each probe is capped at 4s. Full handler bounded by Promise.all.
type ProbeResult = { name: string; ok: boolean; ms: number; status?: number; error?: string; authoritative: boolean };

async function probe(name: string, url: string, authoritative: boolean, opts: { method?: 'HEAD' | 'GET'; headers?: Record<string, string>; okStatus?: (s: number) => boolean; timeoutMs?: number } = {}): Promise<ProbeResult> {
  const { method = 'HEAD', headers = {}, okStatus = (s) => s < 400, timeoutMs = 4000 } = opts;
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { method, headers, signal: controller.signal });
    clearTimeout(timer);
    return { name, ok: okStatus(r.status), ms: Date.now() - started, status: r.status, authoritative };
  } catch (e: any) {
    clearTimeout(timer);
    return { name, ok: false, ms: Date.now() - started, error: e?.name === 'AbortError' ? 'timeout' : String(e?.message || 'unknown').slice(0, 120), authoritative };
  }
}

// In-memory cache. Survives within a single warm lambda instance; cold start
// will re-probe. That's acceptable — abuse vector is sustained spam to a
// single warm function, not first-of-N cold invocations.
const HEALTH_CACHE_TTL_MS = 30_000;
let healthCache: { at: number; body: any } | null = null;

async function handleHealthDeep(_req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (healthCache && Date.now() - healthCache.at < HEALTH_CACHE_TTL_MS) {
    return res.status(200).json({ ...healthCache.body, cached: true });
  }

  // Reachability-only probes for Stripe / Resend / Gemini. We can't make
  // authoritative calls without burning a real API quota call. Treat all
  // <500 as "reachable" — 401/404 still proves we hit their edge.
  const advisoryOk = (s: number) => s < 500;

  const probes = await Promise.all<ProbeResult>([
    // AUTHORITATIVE: Supabase /auth/v1/health with apikey returns 200 JSON.
    // Without the apikey it 401s — which is also <500 but doesn't prove the
    // auth service is actually healthy. Use the anon key here (same one
    // baked into the client bundle, no secret risk).
    SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)
      ? probe('supabase', `${SUPABASE_URL}/auth/v1/health`, true, {
          method: 'GET',
          headers: { apikey: (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) as string },
        })
      : Promise.resolve<ProbeResult>({ name: 'supabase', ok: false, ms: 0, error: 'not_configured', authoritative: true }),
    // ADVISORY:
    probe('stripe', 'https://api.stripe.com/', false, { okStatus: advisoryOk }),
    probe('resend', 'https://api.resend.com/', false, { okStatus: advisoryOk }),
    probe('gemini', 'https://generativelanguage.googleapis.com/', false, { okStatus: advisoryOk }),
  ]);

  // Top-level status only considers AUTHORITATIVE probes. Advisory probes
  // failing surface in the breakdown but don't down the rollup.
  const authoritative = probes.filter((p) => p.authoritative);
  const allAuthOk = authoritative.length > 0 && authoritative.every((p) => p.ok);
  const body = {
    status: allAuthOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    probes,
  };
  healthCache = { at: Date.now(), body };
  return res.status(200).json(body);
}

// =============================================================================
// health — minimal "is the function alive" probe
// =============================================================================
// No external calls. Returns immediately. Useful for the cheapest possible
// keyword monitor that confirms Vercel is serving requests at all.
function handleHealth(_req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}

// =============================================================================
// Dispatcher
// =============================================================================
export default async function handler(req: any, res: any) {
  const raw = req.query?.publicTool;
  const tool = String(Array.isArray(raw) ? raw[0] : raw || '').toLowerCase();
  switch (tool) {
    case 'search-suggest':
      return handleSearchSuggest(req, res);
    case 'webmention':
      return handleWebmention(req, res);
    case 'health':
      return handleHealth(req, res);
    case 'health-deep':
      return handleHealthDeep(req, res);
    default:
      return res.status(404).json({ error: `Unknown public endpoint: ${tool || '<empty>'}` });
  }
}
