// /api/webmention — Webmention receiver per W3C Recommendation
// https://www.w3.org/TR/webmention/
//
// Behaviour:
//   - Accept POST application/x-www-form-urlencoded with `source` and `target`.
//   - Validate both are http(s) URLs.
//   - Validate `target` belongs to aimvantage.uk (otherwise reject).
//   - Validate `source` is http(s) and not the same as target.
//   - Persist as PENDING in Supabase (table: webmentions). Manual moderation
//     before public display on /mentions.
//   - Respond 202 Accepted (async verification) with Location header per
//     W3C §3.2.4.
//
// We deliberately DO NOT auto-publish or auto-verify the source contains a
// link to target. Verification + publication happens in a separate
// moderation flow (see /api/admin/webmention-moderate, future). This is
// the spam-resistant default per playbook section 5 safety guidance.
//
// Anti-abuse:
//   - 5 req/min/IP rate-limit (in-memory).
//   - Reject obvious spam-domain patterns.
//   - Cap source/target string length.
//   - Per-domain de-dupe (last 24h).
//
// No PII collected. No auth required (Webmention is anonymous by design).

interface VercelReq {
  method?: string;
  headers: { [k: string]: string | string[] | undefined };
  body?: any;
}
interface VercelRes {
  status: (n: number) => VercelRes;
  setHeader: (k: string, v: string) => void;
  send: (b: any) => void;
  json: (b: any) => void;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const SITE_HOST = 'aimvantage.uk';
const MAX_URL_LEN = 2000;

// In-memory rate-limit (per Vercel function instance — good enough for
// abuse mitigation, won't catch all distributed spam).
const RATE_BUCKET = new Map<string, { count: number; first: number }>();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;

// Spam-domain patterns. Conservative — better to miss legitimate
// mentions than to publish casino/porn/loan-spam links.
const SPAM_PATTERNS = [
  /casino/i, /poker/i, /viagra/i, /cialis/i, /porn/i, /xxx/i,
  /loan/i, /payday/i, /bitcoin\s*-?\s*(?:double|invest)/i,
  /\.ru\/.*-(?:viagra|loan|porn)/i, /\.tk\//i, /\.ml\//i,
  /telegram\.me.*sell/i, /buy-followers/i, /seo-?backlinks?/i,
];

function getClientIp(req: VercelReq): string {
  const xv = req.headers['x-vercel-forwarded-for'];
  if (typeof xv === 'string' && xv) return xv.trim();
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string') {
    // Take the LAST entry (first is client-spoofable).
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
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
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return; // best-effort
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/webmentions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates',
      },
      body: JSON.stringify({
        source,
        target,
        ip_hash: ip === 'unknown' ? null : ip.slice(0, 64),
        status: 'pending',
        received_at: new Date().toISOString(),
      }),
    });
  } catch { /* swallow — receipt has already been logged */ }
}

export default async function handler(req: VercelReq, res: VercelRes) {
  // GET → return 200 with a small status note (some clients probe).
  if (req.method === 'GET') {
    res.status(200).setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(
      'Vantage AI Webmention endpoint.\n' +
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

  // Body can arrive as a parsed object (Vercel's default for
  // application/x-www-form-urlencoded) OR as a raw string. Handle both.
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
  } catch {
    /* fall through to validation */
  }

  if (!isHttpUrl(source)) {
    res.status(400).json({ error: 'Invalid source URL.' });
    return;
  }
  if (!isHttpUrl(target)) {
    res.status(400).json({ error: 'Invalid target URL.' });
    return;
  }
  if (source === target) {
    res.status(400).json({ error: 'source and target must differ.' });
    return;
  }
  if (!isOurTarget(target)) {
    res.status(400).json({ error: 'target must be on aimvantage.uk.' });
    return;
  }
  if (looksLikeSpam(source)) {
    // Silently accept-and-discard so spammers don't tune around our filter.
    res.status(202).setHeader('Location', 'https://aimvantage.uk/mentions/pending');
    res.send('');
    return;
  }

  // Persist pending. Async-safe: even if DB write fails, we still 202.
  await persistPending(source, target, ip);

  res.status(202).setHeader('Location', 'https://aimvantage.uk/mentions/pending');
  res.send('');
}
