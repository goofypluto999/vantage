import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * /handle?payload=<encoded-url> — landing route for the
 * web+vantage://… protocol handler.
 *
 * Per the manifest's protocol_handlers entry, when a user clicks a
 * web+vantage: link AND has AimVantage installed as a PWA, the OS
 * routes them here with the original URL placed in the `payload`
 * query string parameter (URL-encoded).
 *
 * Supported payloads (only the first is in use today; the others are
 * documented for forward compatibility):
 *   - web+vantage:job?url=<job-url>     → set as pendingJob, go to dashboard
 *   - web+vantage:roast                  → go to /roast
 *   - web+vantage:diagnose               → go to /tools/no-interviews-diagnostic
 *
 * Any unrecognized payload falls through to /dashboard.
 *
 * Attack surface considerations:
 *   - The payload is user-controlled and could be a phishing redirect.
 *     We ONLY accept job= URLs that are http(s); we never follow them
 *     server-side. We just store the URL in sessionStorage; the
 *     dashboard later renders it in the URL field for the user to
 *     review before submitting.
 *   - We do NOT eval, evaluate, or fetch the payload.
 *   - We do NOT navigate to absolute URLs from the payload — only
 *     internal route names.
 */

function parsePayload(payload: string): { route: string; jobUrl?: string } {
  // Decode + sanitize. payload looks like 'web+vantage:job?url=https%3A%2F%2F...'
  // The browser already URL-decodes ?payload= once, but the inner
  // '?url=' is still encoded if the source provided it that way.
  try {
    const decoded = decodeURIComponent(payload);
    // Strip the protocol prefix.
    const stripped = decoded.replace(/^web\+vantage:/i, '');
    if (stripped.startsWith('job')) {
      const q = stripped.split('?')[1] || '';
      const params = new URLSearchParams(q);
      const url = params.get('url');
      if (url && /^https?:\/\//i.test(url)) {
        return { route: '/dashboard?source=protocol-handler', jobUrl: url };
      }
      return { route: '/dashboard?source=protocol-handler' };
    }
    if (stripped.startsWith('roast')) {
      return { route: '/roast?source=protocol-handler' };
    }
    if (stripped.startsWith('diagnose') || stripped.startsWith('diagnostic')) {
      return { route: '/tools/no-interviews-diagnostic?source=protocol-handler' };
    }
    return { route: '/dashboard?source=protocol-handler' };
  } catch {
    return { route: '/dashboard?source=protocol-handler' };
  }
}

export default function PwaHandle() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const payload = params.get('payload') || '';
      const { route, jobUrl } = parsePayload(payload);
      if (jobUrl) {
        try {
          sessionStorage.setItem('vantage:pendingJob', jobUrl);
        } catch { /* ignore */ }
      }
      navigate(route, { replace: true });
    } catch {
      navigate('/dashboard?source=protocol-handler', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0b1e]">
      <div className="text-center text-white/70 text-sm">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-violet-400" />
        Routing your AimVantage link…
      </div>
    </div>
  );
}
