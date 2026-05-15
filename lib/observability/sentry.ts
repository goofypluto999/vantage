/**
 * Server-only Sentry init + safe error reporter.
 *
 * Lives OUTSIDE /api/ so Vercel doesn't deploy it as a function.
 *
 * Init is idempotent and ENV-GATED. Without SENTRY_DSN the SDK never
 * initializes — every helper is a no-op. Means we can ship this code
 * before the operator creates a Sentry project, and it activates the
 * moment the env var lands without further code changes.
 *
 * Why @sentry/node (not @sentry/serverless/@sentry/nextjs):
 *   - We're a plain Vercel TS function setup, not Next.js.
 *   - @sentry/node v8+ uses the native Node integration and works fine
 *     on Vercel cold starts. We init it lazily inside the first call.
 *
 * before_send filter strips 4xx HTTPException noise — those are
 * intentional validation surfaces (insufficient tokens, rate-limited,
 * unauthenticated, etc.), not Sentry-worthy. Throttling alert volume
 * to "actually exceptional" is the difference between Sentry being
 * useful and Sentry being ignored.
 *
 * Use:
 *   import { initSentry, captureError } from '../../lib/observability/sentry';
 *   initSentry();                  // call once at top of handler
 *   ...
 *   try { ... } catch (err) {
 *     captureError(err, { route: '/api/analyze', userId, jobUrl });
 *     throw err;                   // re-throw — Sentry is observation, not handling
 *   }
 */

import type { ErrorEvent, EventHint } from '@sentry/node';

let initialized = false;
// Lazy-loaded SDK reference. Imported on first init() call so we don't
// pay the require cost on every cold-start of every function.
type SentryNs = typeof import('@sentry/node');
let SDK: SentryNs | null = null;

const DSN = (process.env.SENTRY_DSN || '').trim();
const ENVIRONMENT = (process.env.VERCEL_ENV || process.env.NODE_ENV || 'development').trim();
const RELEASE = (process.env.VERCEL_GIT_COMMIT_SHA || 'unknown').slice(0, 12);

/**
 * Initialize Sentry once per warm lambda. No-op if SENTRY_DSN unset.
 * Safe to call from every handler — guarded by `initialized` flag.
 */
export function initSentry(): void {
  if (initialized) return;
  if (!DSN) return;
  // Lazy require so cold starts without SENTRY_DSN never pay the cost.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  SDK = require('@sentry/node') as SentryNs;
  SDK.init({
    dsn: DSN,
    environment: ENVIRONMENT,
    release: RELEASE,
    // tracesSampleRate intentionally 0 — Sentry Performance has its own
    // monthly quota (10K spans free) and @sentry/node v8+ auto-instruments
    // every fetch() call, so even modest webhook traffic burns it fast.
    // Errors are what we actually need. Bump this only if you specifically
    // want performance traces and have looked at the quota.
    tracesSampleRate: 0,
    // Default integrations are fine; don't auto-add Express/HTTP because
    // we're not on a long-running server, and the @sentry/node default
    // already covers what serverless handlers need.
    beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
      // Drop 4xx HTTPException-style noise. These are intentional
      // validation surfaces — surfacing them as "errors" floods the
      // dashboard and trains the operator to ignore alerts.
      const status = (event.extra as Record<string, unknown> | undefined)?.status as number | undefined;
      if (typeof status === 'number' && status >= 400 && status < 500) return null;

      // Drop common bot/scanner traceback noise. If you see new patterns,
      // add them here rather than letting them eat the free-tier quota.
      const msg = String(event.message || event.exception?.values?.[0]?.value || '');
      if (/aborted: timed out/i.test(msg)) return null;
      if (/Invalid token: not in valid range/i.test(msg)) return null;

      return event;
    },
  });
  initialized = true;
}

/**
 * Per-fingerprint dedupe to protect the 5K-event free-tier quota.
 *
 * If a bad deploy starts erroring on every request, a tight loop would
 * burn the monthly quota in hours. We hold an in-memory map of
 * "error-fingerprint → last-sent-ms" and drop any duplicate within
 * DEDUPE_WINDOW_MS. Per-warm-lambda; cold starts reset (acceptable —
 * a new cold start is itself a new signal).
 *
 * Fingerprint is route + first 120 chars of error message. Tight enough
 * to detect spam loops, loose enough that distinct failures still report.
 */
const DEDUPE_WINDOW_MS = 60_000;
const sentSeen = new Map<string, number>();

function fingerprint(err: unknown, context?: Record<string, unknown>): string {
  const route = (context?.route as string | undefined) || 'unknown';
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : (() => {
            try {
              return JSON.stringify(err);
            } catch {
              return String(err);
            }
          })();
  return `${route}:${msg.slice(0, 120)}`;
}

function shouldSend(fp: string): boolean {
  const now = Date.now();
  const last = sentSeen.get(fp);
  if (last && now - last < DEDUPE_WINDOW_MS) return false;
  sentSeen.set(fp, now);
  // Bounded — periodically prune so the map can't grow unbounded if every
  // request has a unique fingerprint. 200-entry ceiling is plenty for a
  // warm lambda's lifetime.
  if (sentSeen.size > 200) {
    const cutoff = now - DEDUPE_WINDOW_MS;
    for (const [k, t] of sentSeen) {
      if (t < cutoff) sentSeen.delete(k);
    }
  }
  return true;
}

/**
 * Report an error with structured context. No-op if Sentry not initialized
 * or if the same fingerprint fired within the last 60s.
 * Always safe to call — never throws, never blocks the caller.
 */
export function captureError(err: unknown, context?: Record<string, unknown>): void {
  if (!SDK || !initialized) return;
  if (!shouldSend(fingerprint(err, context))) return;
  try {
    SDK.withScope((scope) => {
      if (context) {
        for (const [k, v] of Object.entries(context)) {
          scope.setExtra(k, v as never);
        }
      }
      SDK!.captureException(err);
    });
  } catch {
    // Sentry reporter itself errored — don't propagate.
  }
}

/**
 * Report a structured message (info/warning/error). Useful for
 * non-exception-shaped failures we still want to track.
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'warning', context?: Record<string, unknown>): void {
  if (!SDK || !initialized) return;
  try {
    SDK.withScope((scope) => {
      scope.setLevel(level);
      if (context) {
        for (const [k, v] of Object.entries(context)) {
          scope.setExtra(k, v as never);
        }
      }
      SDK!.captureMessage(message);
    });
  } catch {
    // swallow
  }
}
