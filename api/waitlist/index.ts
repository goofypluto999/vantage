// API endpoint for waitlist signup
// Vercel serverless function
//
// Security posture (added 2026-05-11 after security-sweep-2026-05-11.md):
// - Origin/Referer allowlist on POST (prevents drive-by signups from
//   arbitrary domains that scrape the endpoint URL)
// - Per-IP sliding-window rate limit (best-effort, in-memory): 3 per
//   minute + 20 per day. Mirrors the pattern from /api/roast at lower
//   thresholds since the waitlist surface needs less throughput.
// Persistent (Supabase-backed) rate limit deliberately NOT added — the
// in-memory layer is sufficient to block casual abuse, and the waitlist
// table itself has a UNIQUE(email) constraint that hard-caps duplicates.

interface WaitlistBody {
  email: string;
  name?: string;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// ─── Origin allowlist ────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://aimvantage.uk',
  'https://www.aimvantage.uk',
  'http://localhost:3000',
  'http://localhost:5173',
];

function isOriginAllowed(origin: string | undefined, referer: string | undefined): boolean {
  if (origin && ALLOWED_ORIGINS.some((o) => origin === o)) return true;
  if (referer) {
    try {
      const url = new URL(referer).origin;
      if (ALLOWED_ORIGINS.some((o) => url === o)) return true;
    } catch { /* invalid referer URL */ }
  }
  return false;
}

// ─── In-memory sliding-window rate limit ─────────────────────────────────
// Keyed by IP. Per-Vercel-function-instance only — at this volume that's
// fine. If we ever hit it from real traffic, drop in the same persistent
// layer used by /api/roast.
const ipHits = new Map<string, number[]>();
const MIN_WINDOW_MS = 60_000;
const MIN_MAX = 3; // 3 signups/min/IP
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAY_MAX = 20; // 20 signups/day/IP

function getClientIp(req: any): string {
  // Vercel sets x-vercel-forwarded-for (unspoofable from outside) and
  // x-forwarded-for (spoofable). Prefer the Vercel one when present.
  const vff = req.headers['x-vercel-forwarded-for'];
  if (vff && typeof vff === 'string') return vff.split(',')[0].trim();
  const xff = req.headers['x-forwarded-for'];
  if (xff && typeof xff === 'string') return xff.split(',')[0].trim();
  return 'unknown';
}

function checkRateLimit(ip: string, windowMs: number, max: number, keyPrefix: string): boolean {
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (ipHits.get(key) || []).filter((t) => t > cutoff);
  if (hits.length >= max) {
    ipHits.set(key, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(key, hits);
  return true;
}

async function fetchCount(table: string): Promise<number> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact',
      },
    });
    const header = res.headers.get('content-range');
    return header ? parseInt(header.split('/')[1]) || 0 : 0;
  } catch {
    return 0;
  }
}

export default async function handler(request: any, response: any) {
  // GET: return waitlist count, or full transparency stats if ?type=stats
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const type = url.searchParams.get('type');

      // Public transparency stats — signups, analyses run, waitlist size.
      // Cached at the edge for 10 minutes so the homepage hit is cheap.
      if (type === 'stats') {
        const [signups, analyses, waitlist] = await Promise.all([
          fetchCount('profiles'),
          fetchCount('analyses'),
          fetchCount('waitlist'),
        ]);
        response.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');
        return response.status(200).json({ signups, analyses, waitlist });
      }

      const total = await fetchCount('waitlist');
      return response.status(200).json({ count: total });
    } catch {
      return response.status(200).json({ count: 0 });
    }
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // ─── Origin allowlist ─────────────────────────────────────────────────
  // Reject requests not from aimvantage.uk (or its localhost variants).
  // Stops scrapers + drive-by abuse where the endpoint URL is discovered
  // but the attacker is not actually running in a browser on our domain.
  const origin = (request.headers.origin as string) || undefined;
  const referer = (request.headers.referer as string) || undefined;
  if (!isOriginAllowed(origin, referer)) {
    return response.status(403).json({ success: false, error: 'Origin not allowed' });
  }

  // ─── Per-IP rate limit ────────────────────────────────────────────────
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp, MIN_WINDOW_MS, MIN_MAX, 'min')) {
    response.setHeader('Retry-After', '60');
    return response.status(429).json({ success: false, error: 'Too many requests. Try again in a minute.' });
  }
  if (!checkRateLimit(clientIp, DAY_WINDOW_MS, DAY_MAX, 'day')) {
    return response.status(429).json({ success: false, error: 'Daily signup limit reached. Try again tomorrow.' });
  }

  const { email, name } = request.body as WaitlistBody;

  if (!email || !email.includes('@')) {
    return response.status(400).json({ success: false, error: 'Valid email required' });
  }
  // Reject obviously oversize emails to keep payload small + DB clean.
  if (email.length > 254 || (name && name.length > 200)) {
    return response.status(400).json({ success: false, error: 'Email or name too long' });
  }

  try {
    // Use anon key with return=minimal — RLS INSERT policy allows public inserts
    // but no SELECT policy exists, so return=representation fails
    const insertKey = SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': insertKey,
        'Authorization': `Bearer ${insertKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        name: name?.trim() || null,
        source: 'website',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorData: any = {};
      try { errorData = JSON.parse(errorText); } catch {}
      console.error('Supabase insert error:', errorText, 'Status:', res.status);
      if (errorData.code === '23505') {
        return response.status(409).json({ success: false, error: 'Email already on waitlist' });
      }
      return response.status(500).json({ success: false, error: 'Failed to add to waitlist' });
    }

    // Count uses service key to bypass RLS (no SELECT policy on waitlist)
    const total = await fetchCount('waitlist');

    return response.status(201).json({ success: true, position: total });
  } catch (error: any) {
    console.error('Waitlist error');
    return response.status(500).json({ success: false, error: 'Internal server error' });
  }
}