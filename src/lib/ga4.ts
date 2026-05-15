/**
 * Google Analytics 4 (gtag.js) loader — env-gated, idempotent.
 *
 * Reads the measurement ID from VITE_GA_MEASUREMENT_ID (format: G-XXXXXXXXXX).
 * If unset, no-op (gracefully degrades to "no tracking", useful in local dev
 * and preview environments where you don't want test data polluting GA4).
 *
 * Privacy notes:
 *  - Honours Do Not Track. If `navigator.doNotTrack === '1'`, no script
 *    is injected and gtag never runs.
 *  - IP anonymisation is enabled by default (anonymize_ip: true).
 *  - Cross-site cookies are NOT set; respects SameSite-Lax + Secure flags.
 *  - No personally identifying information is sent in events by default.
 *  - Compatible with the cookie consent flow in CookieConsent.tsx — only
 *    initialise after the user has not opted out.
 *
 * To activate:
 *  1. Go to https://analytics.google.com
 *  2. Admin → Create → Account ("AimVantage" or your master account)
 *  3. Create property named "AimVantage" (eu-west-1 region for EU GDPR)
 *  4. Set up a Data Stream → Web → enter https://aimvantage.uk
 *  5. Copy the Measurement ID (G-XXXXXXXXXX)
 *  6. Add to Vercel env vars as VITE_GA_MEASUREMENT_ID for all environments
 *  7. Redeploy (or wait for the next push) — tracking starts on the next page load
 *
 * To deactivate: remove the env var. The script will not be injected on
 * subsequent builds.
 *
 * Multi-property setup: if you later add Foresay or Wadda Play to GA4,
 * create separate properties under the same Account. Each gets its own
 * VITE_GA_MEASUREMENT_ID and lives in its own Vercel project's env vars.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: unknown[]) => void;
  }
}

let injected = false;

export function initGA4(measurementId: string | undefined): void {
  if (typeof window === 'undefined') return;
  // Trim whitespace and newlines — env vars added via `echo` or copy-paste
  // can carry trailing \n which corrupts the loader URL.
  const id = (measurementId ?? '').trim();
  if (!id || injected) return;
  // Sanity check the ID shape: must start with "G-" and be alphanumeric.
  // GA4 IDs are typically G- followed by 10 uppercase alphanumerics.
  if (!/^G-[A-Z0-9]{6,12}$/i.test(id)) {
    // Don't throw — silently skip to avoid breaking the app if the env var
    // is malformed. The developer console gets a helpful breadcrumb only.
    if (typeof console !== 'undefined') {
      console.warn('[ga4] VITE_GA_MEASUREMENT_ID looks malformed, expected G-XXXXXXXXXX, got:', id.slice(0, 4) + '…');
    }
    return;
  }
  if (window.gtag) {
    injected = true;
    return;
  }

  // Honour Do Not Track — ethical default. Browser DNT signal trumps everything.
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
    return;
  }

  // Standard Google gtag.js install snippet, transcribed from
  // https://developers.google.com/analytics/devguides/collection/ga4/install
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag as (...args: unknown[]) => void;

  // Time-zero marker — required by gtag protocol.
  gtag('js', new Date());

  // Initial config. IP anonymisation enabled for GDPR-friendly defaults.
  // send_page_view: true means we count the initial page load; subsequent
  // SPA route changes are tracked via the trackPageView() helper below
  // (called from App.tsx on react-router-dom location changes).
  gtag('config', id, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
  injected = true;
}

/**
 * Track a single page view. Call after each SPA route change so GA4 sees
 * client-side navigation events (gtag's auto-pageview only fires on the
 * very first load — SPA route changes don't reload the page).
 *
 * Safe to call even if GA4 is not initialised — falls back to a no-op.
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim();
  if (!measurementId) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.origin + path,
  });
}

/**
 * Track a custom event (e.g. signup, prep_pack_started, plan_upgrade).
 * Safe to call even if GA4 is not initialised.
 *
 * @param eventName Lowercase snake_case (e.g. "signup", "prep_pack_run")
 * @param params Optional key-value pairs; values must be strings/numbers/bools
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params || {});
}
