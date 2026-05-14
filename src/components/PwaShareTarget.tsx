import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * /share-target — landing route for PWA share_target manifest entry.
 *
 * When a user has AimVantage installed as a PWA on Android (or ChromeOS) and
 * shares text/url/title from another app to AimVantage, the OS sends them
 * here with the share data in URL params (because we declared method:
 * "GET" in site.webmanifest's share_target).
 *
 * What we do: pull the URL/title/text out of the params, prefer a
 * recognizable job URL if any, store it in sessionStorage under the
 * existing `vantage:pendingJob` key (mirrors the bookmarklet handoff
 * pattern from App.tsx), then redirect to /register or /dashboard.
 *
 * The URL-extraction logic is conservative: if the share payload includes
 * an explicit `url` param, use that. Otherwise scan `text` for the first
 * http(s) URL. Otherwise fall through to the dashboard with no prefill.
 *
 * No CV file ingestion here — the manifest is GET-only for now (POST
 * multipart would need a serverless handler). File ingestion lives at
 * /open-cv via the file_handlers + launchQueue API.
 */

function extractFirstUrl(s: string | null): string | null {
  if (!s) return null;
  const m = s.match(/https?:\/\/[^\s<>"]+/);
  return m ? m[0] : null;
}

export default function PwaShareTarget() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const url = params.get('url');
      const text = params.get('text');
      const candidate = url && /^https?:\/\//i.test(url)
        ? url
        : extractFirstUrl(text);

      if (candidate) {
        try {
          sessionStorage.setItem('vantage:pendingJob', candidate);
        } catch { /* sessionStorage may be disabled — proceed */ }
      }
    } catch { /* ignore */ }
    // Always navigate; let the auth gate decide register vs dashboard.
    navigate('/dashboard?source=share-target', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0b1e]">
      <div className="text-center text-white/70 text-sm">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-violet-400" />
        Capturing the shared job link…
      </div>
    </div>
  );
}
