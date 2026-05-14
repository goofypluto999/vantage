import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2 } from 'lucide-react';

/**
 * /open-cv — landing route for PWA file_handlers manifest entry.
 *
 * When a user has AimVantage installed as a PWA and uses the OS's "Open
 * with…" menu on a CV file (.pdf / .docx / .txt), the browser launches
 * AimVantage at this route and exposes the file via window.launchQueue.
 *
 * What we do: set up a launchQueue consumer, grab the first FileSystem-
 * Handle, read the file into a Blob, store a base64 representation in
 * sessionStorage under `vantage:pendingCv`, then redirect to the
 * dashboard which already knows how to consume that key (or, if the
 * key doesn't yet exist, it's a no-op).
 *
 * Edge cases:
 * - Browser doesn't support launchQueue (most non-Chromium): we just
 *   show a friendly message and a button to navigate manually.
 * - File is too large (>5MB): we reject and tell the user.
 * - File is the wrong type: we reject.
 *
 * Privacy: the file IS read into a base64 string in sessionStorage so
 * it can be picked up by the dashboard. sessionStorage is per-tab, dies
 * with the tab, and is not persisted to disk on most browsers. The file
 * is NOT sent to any server until the user clicks Run.
 */

const MAX_BYTES = 5 * 1024 * 1024; // 5MB — matches Dashboard.tsx limit
const ACCEPT = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

interface LaunchParams {
  files?: FileSystemFileHandle[];
}

interface LaunchQueue {
  setConsumer: (consumer: (params: LaunchParams) => void) => void;
}

declare global {
  interface Window {
    launchQueue?: LaunchQueue;
  }
}

async function fileHandleToBase64(handle: FileSystemFileHandle): Promise<{ name: string; mime: string; b64: string } | null> {
  const file = await handle.getFile();
  if (file.size > MAX_BYTES) return null;
  if (!ACCEPT.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|docx|txt)$/)) return null;
  const buf = await file.arrayBuffer();
  // Convert to base64. ArrayBuffer → string via Uint8Array → btoa.
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return { name: file.name, mime: file.type || 'application/octet-stream', b64: btoa(binary) };
}

export default function PwaOpenCv() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'waiting' | 'ok' | 'unsupported' | 'too-large' | 'wrong-type' | 'error'>('waiting');

  useEffect(() => {
    if (!('launchQueue' in window) || !window.launchQueue) {
      setStatus('unsupported');
      return;
    }
    window.launchQueue.setConsumer(async (params: LaunchParams) => {
      if (!params.files || params.files.length === 0) {
        setStatus('unsupported');
        return;
      }
      try {
        const result = await fileHandleToBase64(params.files[0]);
        if (!result) {
          // Determine which check failed
          const f = await params.files[0].getFile();
          if (f.size > MAX_BYTES) setStatus('too-large');
          else setStatus('wrong-type');
          return;
        }
        try {
          sessionStorage.setItem('vantage:pendingCv', JSON.stringify(result));
        } catch { /* ignore — proceed without prefill */ }
        setStatus('ok');
        navigate('/dashboard?source=open-cv', { replace: true });
      } catch {
        setStatus('error');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0b1e] px-6">
      <div className="text-center max-w-md">
        <FileText className="w-10 h-10 text-violet-400 mx-auto mb-4" />
        {status === 'waiting' && (
          <>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-violet-400" />
            <p className="text-white/80 text-base font-semibold">Opening your CV in AimVantage…</p>
          </>
        )}
        {status === 'unsupported' && (
          <>
            <p className="text-white/80 text-base font-semibold mb-2">This browser doesn't support the file-handler API.</p>
            <p className="text-white/50 text-sm mb-4">Open AimVantage normally and upload your CV from the dashboard.</p>
            <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold">Go to dashboard</button>
          </>
        )}
        {status === 'too-large' && (
          <>
            <p className="text-white/80 text-base font-semibold mb-2">CV is over 5MB.</p>
            <p className="text-white/50 text-sm mb-4">Save a smaller PDF or DOCX and try again.</p>
            <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold">Go to dashboard</button>
          </>
        )}
        {status === 'wrong-type' && (
          <>
            <p className="text-white/80 text-base font-semibold mb-2">AimVantage accepts PDF, DOCX, or TXT only.</p>
            <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold">Go to dashboard</button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-white/80 text-base font-semibold mb-2">Couldn't read that file.</p>
            <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold">Go to dashboard</button>
          </>
        )}
      </div>
    </div>
  );
}
