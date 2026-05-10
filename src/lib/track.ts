/**
 * track() — thin wrapper over Microsoft Clarity's custom-event API.
 *
 * Per docs/aimvantage-tactical-deploy-playbook-2026-05-08.md section 10:
 * the ranking signal we want to optimize for is "did this landing page
 * end the user's job?" — i.e., did they use a tool, copy a checklist,
 * download a template, start a draft, register, OR did they return to
 * search quickly?
 *
 * track() is the surface for measuring those task-completion events. It
 * is a no-op when Clarity is not loaded (env-gated, DNT-respecting), so
 * call sites don't need to defensive-check.
 *
 * Calls forward to:
 *   - Clarity custom event (window.clarity('event', name)) — appears in
 *     the Clarity dashboard's "Custom events" panel and can drive
 *     funnels.
 *   - Clarity custom tag (window.clarity('set', key, value)) — for
 *     dimensioning recordings (e.g., source=opensearch, intent=
 *     cover-letter-rewrite).
 *
 * No PII. The payload values must be enums or short strings — never
 * email, name, full URL with query params, or anything user-generated
 * that could leak identity.
 */

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

function safeClarity(): ClarityFn | null {
  if (typeof window === 'undefined') return null;
  return window.clarity ?? null;
}

/**
 * Dynamic-import Vercel Analytics's track() so the parallel-forward is
 * fully optional. If the package is removed or fails to load (ad-block,
 * privacy extension), Clarity tracking still works. Lazy-loaded so the
 * first call pays the resolution cost, never the initial bundle.
 */
let vercelTrackPromise: Promise<((event: string, props?: Record<string, string | number | boolean | null>) => void) | null> | null = null;
function getVercelTrack(): Promise<((event: string, props?: Record<string, string | number | boolean | null>) => void) | null> {
  if (!vercelTrackPromise) {
    vercelTrackPromise = import('@vercel/analytics')
      .then((m) => (m && typeof m.track === 'function' ? m.track : null))
      .catch(() => null);
  }
  return vercelTrackPromise;
}

/**
 * Fire a Clarity custom event. Use for action verbs (button clicks,
 * task starts/completes, exits).
 */
export function track(eventName: string, attrs?: Record<string, string | number | boolean>): void {
  // Clarity (custom event + session-tag dimensioning) — primary surface
  // for funnel + replay analysis.
  const c = safeClarity();
  if (c) {
    try {
      c('event', eventName);
      if (attrs) {
        for (const [k, v] of Object.entries(attrs)) {
          c('set', k, String(v));
        }
      }
    } catch { /* swallow — analytics never crash the app */ }
  }

  // Vercel Analytics custom event — secondary surface for the Vercel
  // dashboard's Events tab (good for aggregate funnel + which page +
  // which UTM source drove the action). Lazy-loaded; no-op if package
  // resolution fails.
  getVercelTrack().then((vtrack) => {
    if (!vtrack) return;
    try {
      vtrack(eventName, attrs ?? undefined);
    } catch { /* swallow */ }
  });
}

/**
 * Set a Clarity custom tag (a session-level dimension). Use for
 * stateful info: source channel, intent, plan tier, theme.
 */
export function tag(key: string, value: string | number | boolean): void {
  const c = safeClarity();
  if (!c) return;
  try {
    c('set', key, String(value));
  } catch { /* swallow */ }
}

/**
 * Convenience helpers that match the playbook's task-completion event
 * vocabulary. Use these instead of bare track() so the event names stay
 * consistent across the site and we can build clean funnels in Clarity.
 */

export function taskStarted(route: string, taskType: string): void {
  track('content_task_started', { route, task_type: taskType });
}

export function taskCompleted(route: string, taskType: string): void {
  track('content_task_completed', { route, task_type: taskType });
}

export function templateDownloaded(route: string, templateId: string): void {
  track('template_downloaded', { route, template_id: templateId });
}

export function checklistCopied(route: string, checklistId: string): void {
  track('checklist_copied', { route, checklist_id: checklistId });
}

export function draftAnalysisStarted(route: string, source: string): void {
  track('draft_analysis_started', { route, source });
}

export function pageExitFast(route: string, secondsVisible: number): void {
  track('page_exit_fast', { route, seconds_visible: secondsVisible });
}

/**
 * Auto-arm a "page exit fast" detector. Call once per landing page.
 * Fires `page_exit_fast` if the user leaves before `thresholdSec` AND
 * before any `taskCompleted` was recorded for the page.
 */
export function armExitFastDetector(route: string, thresholdSec = 10): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const start = Date.now();
  let completed = false;
  const onComplete = () => { completed = true; };
  // Listen for any same-route task completion.
  const ignore = (e: CustomEvent) => {
    if (e?.detail?.route === route) onComplete();
  };
  window.addEventListener('vantage:task_completed' as any, ignore as EventListener);

  const onUnload = () => {
    const elapsed = (Date.now() - start) / 1000;
    if (!completed && elapsed < thresholdSec) {
      pageExitFast(route, Math.round(elapsed));
    }
  };
  window.addEventListener('pagehide', onUnload, { once: true });
  window.addEventListener('beforeunload', onUnload, { once: true });

  return () => {
    window.removeEventListener('vantage:task_completed' as any, ignore as EventListener);
    window.removeEventListener('pagehide', onUnload);
    window.removeEventListener('beforeunload', onUnload);
  };
}

/**
 * Helper to broadcast a task completion locally (so armExitFastDetector
 * stops counting) AND track to Clarity in one call.
 */
export function recordTaskCompletion(route: string, taskType: string): void {
  taskCompleted(route, taskType);
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('vantage:task_completed', { detail: { route, taskType } }));
    } catch { /* ignore */ }
  }
}

/**
 * CTA-click attribution. Call from any clickable that leads toward
 * registration / signup / a hard conversion. The `source` describes
 * WHERE the click happened ("blog-post-top", "blog-post-mid",
 * "blog-post-bottom", "tools-page-hero", "landing-hero", "tools-card-X").
 * The `props` carry the WHAT (post slug, tool slug, plan tier, etc.).
 *
 * Fires:
 *   - cta_click event in Clarity + Vercel Analytics
 *   - cta_source session-tag in Clarity (for replay dimensioning)
 *
 * Designed so a single line at the click site (or onClick={() => ctaClick(...)})
 * is enough — no per-call setup. PII rules from track() apply.
 */
export function ctaClick(source: string, props?: Record<string, string | number | boolean>): void {
  track('cta_click', { source, ...(props ?? {}) });
  // Promote source to a session-level tag so subsequent recordings
  // are dimensioned by which CTA the user came from.
  tag('last_cta_source', source);
}

/**
 * Content-share attribution. Call from share buttons (X, LinkedIn,
 * copy-link) so the dashboard can see which posts get shared + via
 * which channel. Free distribution intelligence.
 */
export function contentShare(channel: 'x' | 'linkedin' | 'copy-link', slug: string): void {
  track('content_share', { channel, slug });
}
