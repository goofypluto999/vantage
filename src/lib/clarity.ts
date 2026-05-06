/**
 * Microsoft Clarity loader — env-gated, idempotent.
 *
 * Reads the project ID from VITE_CLARITY_PROJECT_ID. If unset, no-op.
 * If set, injects the standard Clarity tag exactly once and starts
 * recording heatmaps + session replays.
 *
 * Privacy notes:
 *  - Clarity respects Do Not Track and our cookie-consent state (we
 *    only call this after the user has not opted out).
 *  - All recordings are masked by default (form inputs, password fields,
 *    text content under data-clarity-mask attributes).
 *  - No PII is captured by default.
 *
 * To activate:
 *  1. Sign up at https://clarity.microsoft.com
 *  2. Create a project for aimvantage.uk and copy the project ID
 *     (looks like a 10-character lowercase alphanumeric string)
 *  3. Add it to Vercel env vars as VITE_CLARITY_PROJECT_ID
 *  4. Redeploy (or wait for the next push)
 *
 * To deactivate: remove the env var. The script will not be injected
 * on subsequent builds.
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

let injected = false;

export function initClarity(projectId: string | undefined): void {
  if (typeof window === 'undefined') return;
  // Trim whitespace and newlines — env vars added via `echo` or copy-paste
  // can carry trailing \n which corrupts the CDN URL.
  const id = (projectId ?? '').trim();
  if (!id || injected) return;
  if (window.clarity) {
    injected = true;
    return;
  }

  // Honour Do Not Track — ethical default.
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
    return;
  }

  // Standard Microsoft Clarity install snippet, transcribed from
  // https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
  // (function(c,l,a,r,i,t,y){
  //   c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  //   t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  //   y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  // })(window, document, "clarity", "script", "PROJECT_ID");
  type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
  const clarityFn: ClarityFn =
    (window.clarity as ClarityFn) ||
    function (...args: unknown[]) {
      (clarityFn.q = clarityFn.q || []).push(args);
    };
  window.clarity = clarityFn;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
  injected = true;
}
