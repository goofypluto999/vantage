// Vercel Edge Middleware — rate limiting + geo country cookie + 404 enforcement.
// In-memory sliding window. Resets on cold starts but protects against abuse.
// For production at scale, replace with Upstash Redis.

import { next } from '@vercel/edge';

/**
 * Known SPA routes — anything not matching returns 404 instead of
 * silently rewriting to / (which served a 200 even for nonsense URLs).
 *
 * Codex audit HIGH-05 (2026-05-14): the prior vercel.json catch-all
 * rewrite sent ANY non-API non-asset path to /, giving crawlers and
 * scanners soft-200s for garbage URLs. This middleware now returns a
 * real 404 before the SPA fallback runs.
 *
 * KEEP IN SYNC with App.tsx <Route path="..." /> declarations.
 * Source of truth lives there; this is a denylist-style firewall.
 */
const STATIC_ROUTES = new Set<string>([
  '/', '/about', '/account', '/admin', '/alternatives', '/announcements',
  '/api-docs', '/ats', '/big-interview-alternative', '/blog', '/case-studies',
  '/case-study', '/changelog', '/compare', '/cookies', '/cover-letter-roast',
  '/dashboard', '/decode', '/decode-my-rejection', '/decode-rejection',
  '/demo-preview', '/docs/api', '/enhancv-alternative', '/example', '/faq',
  '/final-round-ai-alternative', '/find-jobs', '/forgot-password', '/founder',
  '/ghost-job', '/ghost-job-check', '/ghost-job-detector', '/handle', '/help',
  '/huntr-alternative', '/interview-prep', '/interview-questions',
  '/is-this-a-ghost-job', '/jobs', '/jobscan-alternative',
  '/jobscan-cost-calculator', '/job-tool-cost-calculator', '/just-laid-off',
  '/kickresume-alternative', '/laid-off', '/laid-off-2026', '/layoff-playbook',
  '/linkedin', '/linkedin-optimization', '/linkedin-profile', '/login',
  '/media', '/news', '/no-interviews', '/open-cv', '/operator', '/playbook',
  '/press', '/press-releases', '/pricing', '/privacy', '/questions',
  '/receipts', '/refer', '/register', '/rejection-decoder', '/release-notes',
  '/reset-password', '/resume-worded-alternative', '/roast',
  '/roast-my-cover-letter', '/salaries', '/salary', '/search', '/search-jobs',
  '/share-target', '/skills', '/sources', '/state-of-2026',
  '/teal-alternative', '/terms', '/tools', '/transparency', '/trust',
  '/vendor-sources', '/vs', '/whats-new', '/who-we-are', '/why-no-interviews',
  '/yoodli-alternative', '/ats/scanner', '/30-60-90', '/cv-mirror',
  '/cost-calculator', '/glassdoor-decoder', '/linkedin-about',
  '/reference-call-brief', '/cover-letter-compare', '/refund-policy',
  '/sample-analysis', '/security', '/status', '/robots.txt', '/sitemap.xml',
  '/manifest.json', '/llms.txt', '/llms-full.txt', '/404',
]);

// Param-route prefixes — any URL starting with one of these is allowed.
// Mirror the App.tsx wildcard routes like /blog/:slug, /tools/*, etc.
const PARAM_ROUTE_PREFIXES: string[] = [
  '/alternatives/', '/ats/', '/blog/', '/case-studies/', '/example/',
  '/interview-prep/', '/interview-questions/', '/laid-off/', '/press-releases/',
  '/salary/', '/sample/', '/tools/', '/vs/',
];

function isKnownRoute(pathname: string): boolean {
  // Exact match against the static set
  if (STATIC_ROUTES.has(pathname)) return true;
  // Param-route prefix match
  for (const prefix of PARAM_ROUTE_PREFIXES) {
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

// Asset / build paths that must always pass through without 404 enforcement.
function isAssetPath(pathname: string): boolean {
  if (pathname.startsWith('/assets/')) return true;
  if (pathname.startsWith('/frames/')) return true;
  if (pathname.startsWith('/markdown/')) return true;
  if (pathname.startsWith('/postman/')) return true;
  if (pathname === '/favicon.ico' || pathname === '/favicon.svg') return true;
  if (pathname.endsWith('.webmanifest')) return true;
  if (pathname.endsWith('.txt') || pathname.endsWith('.xml') || pathname.endsWith('.json')) {
    // Catch /robots.txt etc — already in STATIC_ROUTES but defensive
    return true;
  }
  if (/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|map|js|css)$/i.test(pathname)) return true;
  return false;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateBucket>();

let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, bucket] of store) {
    if (bucket.resetAt < now) store.delete(key);
  }
}

const LIMITS: { pattern: RegExp; maxRequests: number; windowMs: number }[] = [
  { pattern: /^\/api\/stripe\/webhook/, maxRequests: 100, windowMs: 60_000 },
  { pattern: /^\/api\/analyze/, maxRequests: 10, windowMs: 60_000 },
  { pattern: /^\/api\/rewrite-tone/, maxRequests: 20, windowMs: 60_000 },
  { pattern: /^\/api\/interview/, maxRequests: 20, windowMs: 60_000 },
  { pattern: /^\/api\/stripe\/checkout/, maxRequests: 10, windowMs: 60_000 },
  { pattern: /^\/api\/admin/, maxRequests: 30, windowMs: 60_000 },
  { pattern: /^\/api\/waitlist/, maxRequests: 5, windowMs: 60_000 },
  { pattern: /^\/api\//, maxRequests: 60, windowMs: 60_000 },
];

function getLimit(pathname: string) {
  for (const limit of LIMITS) {
    if (limit.pattern.test(pathname)) return limit;
  }
  return null;
}

// Set a geo country cookie on non-API page loads so the frontend can
// default currency based on real IP geolocation (not browser language).
function geoCookieResponse(request: Request): Response {
  const country = request.headers.get('x-vercel-ip-country') || '';
  const response = next();
  if (country) {
    // 30-day cookie, readable by client JS so CurrencyContext can use it.
    // Secure flag added 2026-05-11 (Codex audit P2 finding). HttpOnly is
    // intentionally NOT set — CurrencyContext reads this cookie in the
    // browser to default currency. The cookie is non-authenticating and
    // contains only an ISO country code, so JS readability is acceptable
    // (see SECURITY-AUDIT.md).
    response.headers.append(
      'Set-Cookie',
      `vantage-geo=${country}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`
    );
  }
  return response;
}

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);

  // Non-API routes: enforce real 404 for unknown paths BEFORE the SPA
  // fallback rewrite turns them all into 200. (Codex audit HIGH-05.)
  if (!url.pathname.startsWith('/api/')) {
    if (!isAssetPath(url.pathname) && !isKnownRoute(url.pathname)) {
      return new Response(
        `<!doctype html><meta charset="utf-8"><title>404 — Not found</title>
<style>body{font-family:system-ui,sans-serif;background:#0d0b1e;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:20px}.box{max-width:480px;text-align:center}.code{font-size:5rem;font-weight:800;background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0}.msg{color:#a0a0b0;font-size:1.1rem;margin:0.5rem 0 2rem}a{color:#a78bfa;text-decoration:none;font-weight:600;padding:.75rem 1.5rem;border:1px solid #6d28d9;border-radius:8px;display:inline-block}</style>
<div class="box"><p class="code">404</p><p class="msg">This page doesn't exist on Vantage.</p><a href="/">Go home</a></div>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        }
      );
    }
    return geoCookieResponse(request);
  }
  if (url.pathname.startsWith('/api/stripe/webhook')) return undefined;

  const limit = getLimit(url.pathname);
  if (!limit) return undefined;

  cleanup();

  // SECURITY (HIGH-02 from Codex audit 2026-05-14):
  // Prefer x-vercel-forwarded-for (unspoofable, written by Vercel edge).
  // Fall back to x-forwarded-for's LAST entry (closest verified proxy hop)
  // rather than the first (attacker-controllable). x-real-ip last.
  const vercelXff = request.headers.get('x-vercel-forwarded-for');
  let ip = 'unknown';
  if (vercelXff && vercelXff.length > 0) {
    ip = vercelXff.split(',')[0]!.trim();
  } else {
    const xff = request.headers.get('x-forwarded-for');
    if (xff && xff.length > 0) {
      const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
      ip = parts[parts.length - 1] || 'unknown';
    } else {
      ip = request.headers.get('x-real-ip') || 'unknown';
    }
  }
  const routeKey = url.pathname.split('/').slice(0, 3).join('/');
  const key = `${ip}:${routeKey}`;

  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + limit.windowMs };
    store.set(key, bucket);
  }

  bucket.count++;

  if (bucket.count > limit.maxRequests) {
    const resetSeconds = Math.ceil((bucket.resetAt - now) / 1000);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again shortly.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(resetSeconds),
          'X-RateLimit-Limit': String(limit.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(bucket.resetAt),
        },
      }
    );
  }

  // Pass through — return undefined to let Vercel continue to the origin
  return undefined;
}

export const config = {
  // Match everything EXCEPT static assets, favicons, and source maps
  matcher: ['/', '/((?!_next/|assets/|favicon|robots|sitemap|.*\\.).*)', '/api/:path*'],
};
