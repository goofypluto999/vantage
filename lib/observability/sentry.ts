/**
 * Server-only Sentry init + safe error reporter.
 *
 * Lives OUTSIDE /api/ so Vercel doesn't deploy it as a function. Consumed
 * via static imports from api/* handlers.
 *
 * ═══════════════════════════════════════════════════════════════════════
 * 2026-05-17: REWRITTEN.
 * ═══════════════════════════════════════════════════════════════════════
 * Previous version used `require('@sentry/node')` inside initSentry() for
 * lazy cold-start perf. That broke Vercel's NFT (Node File Trace) bundler
 * because:
 *   - repo's package.json declares `"type": "module"` (everything ESM)
 *   - CommonJS `require()` inside a function body is not statically
 *     analyzable by esbuild
 *   - NFT tracked the static `import { initSentry, ... } from
 *     '../../lib/observability/sentry'` from each consumer correctly,
 *     but emitted the helper bundle with an unresolvable reference,
 *     producing ERR_MODULE_NOT_FOUND at request time
 *   - Vercel deploy marked "Ready" because compile succeeded; the crash
 *     only manifested when the handler ran
 *   - Result: every /api/analyze, /api/interview/*, /api/rewrite-tone,
 *     /api/stripe/* request returned 500 (HTML, not JSON) for 2 days.
 *     Caught only when a real user hit it. Sentry itself silent because
 *     Sentry was the bug.
 *
 * Fix: top-of-file static `import * as Sentry from '@sentry/node'`. Pays
 * ~30-50ms cold-start cost loading the SDK even when SENTRY_DSN is unset.
 * Trade-off: tiny cold-start latency vs. reliable bundling. We accept it.
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Init is idempotent and ENV-GATED. Without SENTRY_DSN the SDK never
 * initializes — every helper is a no-op. Means we can keep this code
 * deployed even when DSN is rotated or missing.
 *
 * `beforeSend` strips 4xx-tagged events (intentional validation surfaces,
 * not Sentry-worthy noise) + known scanner / abort patterns. Per-fingerprint
 * dedupe (60s window, 200-entry ceiling) protects the 5K-event free tier
 * from bad-deploy spam loops.
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

import * as Sentry from '@sentry/node';
import type { ErrorEvent, EventHint } from '@sentry/node';

let initialized = false;

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
  Sentry.init({
    dsn: DSN,
    environment: ENVIRONMENT,
    release: RELEASE,
    // tracesSampleRate intentionally 0 — Sentry Performance has its own
    // monthly quota (10K spans free) and @sentry/node v8+ auto-instruments
    // every fetch() call. Even modest webhook traffic burns it fast.
    // Errors are what we actually need.
    tracesSampleRate: 0,
    beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
      // Drop 4xx HTTPException-style noise. These are intentional
      // validation surfaces — surfacing them as "errors" floods the
      // dashboard and trains the operator to ignore alerts.
      const status = (event.extra as Record<string, unknown> | undefined)?.status as number | undefined;
      if (typeof status === 'number' && status >= 400 && status < 500) return null;

      // Drop common bot/scanner traceback noise. Add patterns here rather
      // than letting them eat the free-tier quota.
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
 * If a bad deploy starts erroring on every request, a tight loop would burn
 * the monthly quota in hours. We hold an in-memory map of
 * "error-fingerprint → last-sent-ms" and drop any duplicate within
 * DEDUPE_WINDOW_MS. Per-warm-lambda; cold starts reset (acceptable — a new
 * cold start is itself a new signal).
 *
 * Fingerprint is route + first 120 chars of error message. Tight enough to
 * detect spam loops, loose enough that distinct failures still report.
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
  if (!initialized) return;
  if (!shouldSend(fingerprint(err, context))) return;
  try {
    Sentry.withScope((scope) => {
      if (context) {
        for (const [k, v] of Object.entries(context)) {
          scope.setExtra(k, v as never);
        }
      }
      Sentry.captureException(err);
    });
  } catch {
    // Sentry reporter itself errored — don't propagate.
  }
}

/**
 * Report a structured message (info/warning/error). Useful for
 * non-exception-shaped failures we still want to track.
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'warning',
  context?: Record<string, unknown>,
): void {
  if (!initialized) return;
  try {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      if (context) {
        for (const [k, v] of Object.entries(context)) {
          scope.setExtra(k, v as never);
        }
      }
      Sentry.captureMessage(message);
    });
  } catch {
    // swallow
  }
}
