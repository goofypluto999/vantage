// Shared fetch wrapper with timeout + retry primitives, added 2026-05-11
// in response to the Codex production audit finding that AI tool UIs
// could get stuck on "Roasting..." / "Decoding..." indefinitely when an
// upstream response stalled.
//
// Two named exports:
//   fetchWithTimeout(url, init, timeoutMs)  — AbortController-backed fetch
//   classifyAiToolError(error, status, json) — uniform error → user-friendly
//                                              message + retry hint for
//                                              public AI tools.
//
// Both are intentionally framework-agnostic: no React, no Supabase, no
// services/api.ts dependency. They live in /lib so /components and any
// future MDX islands can import without circular-dep risk.

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Request timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

export interface FetchWithTimeoutOptions extends RequestInit {
  /** Hard timeout in ms. Defaults to 30000 (30s). */
  timeoutMs?: number;
}

/**
 * fetch() with a hard client-side timeout via AbortController.
 *
 * Why 30s default: public AI tool endpoints have `maxDuration: 20s` on
 * Vercel (see vercel.json). 30s on the client gives the server its full
 * 20s plus 10s headroom for slow networks before we cut the connection
 * and tell the user to retry. Anything longer and the UI feels broken;
 * anything shorter and we'll abort live requests that would have
 * succeeded.
 *
 * Throws:
 *   TimeoutError — if `timeoutMs` elapses before the response arrives.
 *   The native fetch error — for network failures.
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const { timeoutMs = 30_000, signal: externalSignal, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Chain external signals (so callers can still cancel manually) onto
  // the timeout controller.
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    const response = await fetch(url, { ...rest, signal: controller.signal });
    return response;
  } catch (err: any) {
    // AbortError from our own controller → TimeoutError. AbortError from
    // an external signal → keep as-is so callers can distinguish.
    if (err?.name === 'AbortError' && !externalSignal?.aborted) {
      throw new TimeoutError(timeoutMs);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface AiToolErrorInfo {
  /** User-facing message — never raw network strings or stack traces. */
  message: string;
  /** Optional "Try again in Xs/m/h" hint extracted from 429 Retry-After. */
  retryHint?: string;
  /** When true, the UI should re-enable controls and show a Retry button. */
  recoverable: boolean;
}

/**
 * Map a network/HTTP/JSON-parse error into a user-friendly message + retry hint.
 *
 * Inputs (any can be undefined):
 *   error: thrown by fetchWithTimeout (TimeoutError, TypeError, AbortError…)
 *   response: the Response from a non-OK request
 *   json: the parsed JSON body if the response had one
 *
 * Behavior:
 *   - TimeoutError (or AbortError) → "took too long, try again"
 *   - Network/TypeError → "Network error — check connection"
 *   - 429 with retryAfterMs or Retry-After → adds a retry hint
 *   - 500/502/503 → upstream failure message
 *   - 4xx (other) → use server-provided error text
 */
export function classifyAiToolError(
  error?: unknown,
  response?: Response | null,
  json?: { error?: string; retryAfterMs?: number } | null,
): AiToolErrorInfo {
  // Timeout / abort → recoverable
  if (error instanceof TimeoutError || (error as any)?.name === 'AbortError') {
    return {
      message: 'This is taking too long. The AI service may be busy — try again.',
      recoverable: true,
    };
  }

  // Pure network failure (fetch throws TypeError on DNS / offline / etc.)
  if (error && !response) {
    return {
      message: 'Network error. Check your connection and try again.',
      recoverable: true,
    };
  }

  if (response) {
    const status = response.status;
    const retryAfterMs =
      (json?.retryAfterMs && Number.isFinite(json.retryAfterMs) ? json.retryAfterMs : 0) ||
      ((parseInt(response.headers.get('Retry-After') || '0', 10) || 0) * 1000);

    if (status === 429) {
      const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
      const human =
        seconds < 60
          ? `${seconds}s`
          : seconds < 3600
          ? `${Math.ceil(seconds / 60)}m`
          : `${Math.ceil(seconds / 3600)}h`;
      return {
        message: json?.error || 'Too many requests — give it a minute.',
        retryHint: `Try again in ${human}.`,
        recoverable: true,
      };
    }

    if (status >= 500) {
      return {
        message: json?.error || 'The AI service hit an error. Try again in a minute.',
        recoverable: true,
      };
    }

    if (status === 415) {
      return {
        message: 'Request format was rejected. Refresh the page and try again.',
        recoverable: false,
      };
    }

    if (status === 413) {
      return {
        message: json?.error || 'Input is too large. Trim it down and try again.',
        recoverable: false,
      };
    }

    if (status >= 400) {
      return {
        message: json?.error || 'The request was invalid. Adjust your input and retry.',
        recoverable: false,
      };
    }
  }

  return {
    message: 'Something went wrong. Try again.',
    recoverable: true,
  };
}
