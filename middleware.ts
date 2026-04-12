// Vercel Edge Middleware — rate limiting for API routes
// In-memory sliding window. Resets on cold starts but protects against abuse.
// For production at scale, replace with Upstash Redis.

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

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/api/')) return undefined;
  if (url.pathname.startsWith('/api/stripe/webhook')) return undefined;

  const limit = getLimit(url.pathname);
  if (!limit) return undefined;

  cleanup();

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
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
  matcher: '/api/:path*',
};
