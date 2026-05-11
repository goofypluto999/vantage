/**
 * AtsScannerSection — compact, free, client-side ATS preview.
 *
 * Reads the CV file the user already uploaded to Vantage, extracts plain
 * text (DOCX via lazy mammoth, PDF via lazy pdfjs-dist, TXT via direct
 * read), and runs the same heuristics that power CV Mirror. Renders 5
 * vendor pills with pass/issue counts and a one-line top issue.
 *
 * Self-contained:
 *   - Pure additive component (no shared state with Dashboard's flow)
 *   - mammoth + pdfjs-dist are lazy-imported so they don't bloat the
 *     initial bundle. The PDF worker is loaded from the same chunk via
 *     the ?url import suffix.
 *   - Failure modes: silent pass — if extraction fails, the section stays
 *     hidden rather than disrupting the page.
 *
 * PDF support added 2026-05-11 — the previous "Upload DOCX/TXT" message
 * confused users because the main /api/analyze flow accepts PDFs already.
 * Now this preview accepts the same formats.
 *
 * Removing this section: delete the import + render block in Dashboard.tsx
 * and delete this file plus src/lib/atsLint.ts. Two lines of revert in
 * Dashboard, two file deletions. No knock-on effects.
 */

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import { analyzeText, passCount, type VendorReport, type Severity } from '../lib/atsLint';

interface Props {
  cvFile: File | null;
}

type ScanState =
  | { kind: 'idle' }
  | { kind: 'extracting' }
  | { kind: 'unsupported'; reason: string }
  | { kind: 'too-thin'; words: number }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; reports: VendorReport[]; wordCount: number };

const SEVERITY_TONES: Record<Severity, { bg: string; text: string; border: string; icon: typeof AlertTriangle }> = {
  error: {
    bg: 'bg-red-500/10',
    text: 'text-red-300',
    border: 'border-red-500/30',
    icon: AlertTriangle,
  },
  warn: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-300',
    border: 'border-sky-500/30',
    icon: Info,
  },
};

export default function AtsScannerSection({ cvFile }: Props) {
  const [state, setState] = useState<ScanState>({ kind: 'idle' });
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cvFile) {
        setState({ kind: 'idle' });
        return;
      }
      setState({ kind: 'extracting' });
      setExpanded(null);

      const fileName = cvFile.name.toLowerCase();
      let text = '';

      try {
        if (fileName.endsWith('.docx') || cvFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Lazy-import mammoth — already loaded elsewhere in Dashboard so no
          // additional bundle cost the second time.
          const mammoth = await import('mammoth');
          const buffer = await cvFile.arrayBuffer();
          const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
          text = value || '';
        } else if (fileName.endsWith('.pdf') || cvFile.type === 'application/pdf') {
          // Lazy-import pdfjs-dist + its worker. Worker URL is resolved
          // via Vite's ?url suffix at build time so the worker bundles
          // alongside but doesn't load until first PDF.
          const pdfjs = await import('pdfjs-dist');
          // Vite-supplied worker URL. The ?url suffix makes Vite emit
          // the worker as a separate asset + return its public URL.
          const pdfWorkerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
          pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
          const buffer = await cvFile.arrayBuffer();
          const doc = await pdfjs.getDocument({ data: buffer }).promise;
          const pageTexts: string[] = [];
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            // Each item is a TextItem with `.str`. Join with spaces so
            // adjacent layout cells don't fuse into compound tokens.
            pageTexts.push(content.items.map((it: any) => it.str || '').join(' '));
          }
          text = pageTexts.join('\n');
        } else if (fileName.endsWith('.txt') || cvFile.type === 'text/plain') {
          text = await cvFile.text();
        } else {
          if (!cancelled) setState({
            kind: 'unsupported',
            reason: 'Unsupported format. The instant ATS preview supports PDF, DOCX, and TXT.',
          });
          return;
        }

        const words = (text.match(/\b\w+\b/g) || []).length;
        if (words < 60) {
          if (!cancelled) setState({ kind: 'too-thin', words });
          return;
        }

        const reports = analyzeText(text, cvFile.size);
        if (!cancelled) setState({ kind: 'ready', reports, wordCount: words });
      } catch (err) {
        if (!cancelled) {
          setState({
            kind: 'error',
            message: err instanceof Error ? err.message : 'Could not read the CV for the instant preview.',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cvFile]);

  // Hide entirely when idle (no CV) — Dashboard already gates rendering on cvFile,
  // but we double-check here so the component is safe to mount unconditionally too.
  if (state.kind === 'idle') return null;

  return (
    <section className="mt-4 p-5 rounded-2xl bg-white/5 border border-white/10">
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <h3 className="text-sm font-bold text-white truncate">
            Free ATS preview
            <span className="ml-2 text-xs font-normal text-white/40">5 systems · client-side · no token cost</span>
          </h3>
        </div>
      </header>

      {state.kind === 'extracting' && (
        <p className="text-xs text-white/50">Reading CV…</p>
      )}

      {state.kind === 'unsupported' && (
        <p className="text-xs text-white/50">{state.reason}</p>
      )}

      {state.kind === 'too-thin' && (
        <p className="text-xs text-white/50">
          Only {state.words} words detected. The preview needs ≥60 words to be reliable —
          this could mean an image-based file or empty extraction. Your full Vantage analysis is unaffected.
        </p>
      )}

      {state.kind === 'error' && (
        <p className="text-xs text-amber-300/80">
          Couldn't run the preview ({state.message}). Your full Vantage analysis still works.
        </p>
      )}

      {state.kind === 'ready' && (
        <ReadyView
          reports={state.reports}
          wordCount={state.wordCount}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      )}
    </section>
  );
}

function ReadyView({
  reports,
  wordCount,
  expanded,
  setExpanded,
}: {
  reports: VendorReport[];
  wordCount: number;
  expanded: string | null;
  setExpanded: (v: string | null) => void;
}) {
  const passes = passCount(reports);

  return (
    <>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-white">{passes}<span className="text-white/40 text-base">/5</span></span>
        <span className="text-xs text-white/50">systems clean · {wordCount} words read</span>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {reports.map((r) => {
          const isClean = r.errors === 0 && r.warns === 0;
          const tone =
            r.errors > 0 ? SEVERITY_TONES.error :
            r.warns > 0 ? SEVERITY_TONES.warn :
            SEVERITY_TONES.info;
          const Icon = isClean ? CheckCircle2 : tone.icon;
          const iconClass = isClean ? 'text-emerald-400' : tone.text;
          const labelClass = isClean ? 'text-emerald-400' : tone.text;
          const isOpen = expanded === r.vendor;
          return (
            <button
              key={r.vendor}
              type="button"
              onClick={() => setExpanded(isOpen ? null : r.vendor)}
              className={`group flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-left
                ${isClean
                  ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                  : `${tone.bg} ${tone.border} hover:brightness-110`}
                ${isOpen ? 'ring-2 ring-violet-500/40' : ''}`}
              aria-expanded={isOpen}
            >
              <Icon className={`w-4 h-4 ${iconClass}`} />
              <span className="text-[11px] font-semibold text-white/80 truncate w-full text-center">{r.name}</span>
              <span className={`text-[10px] ${labelClass}`}>
                {isClean ? 'Clean' : `${r.errors + r.warns} issue${(r.errors + r.warns) === 1 ? '' : 's'}`}
              </span>
            </button>
          );
        })}
      </div>

      {expanded && (() => {
        const r = reports.find((x) => x.vendor === expanded);
        if (!r) return null;
        if (r.findings.length === 0) {
          return (
            <div className="rounded-lg p-3 bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300/90">
              <strong>{r.name}:</strong> No issues detected for this vendor. Your CV format is compatible.
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {r.findings.map((f) => {
              const tone = SEVERITY_TONES[f.severity];
              const Icon = tone.icon;
              return (
                <div key={f.code} className={`rounded-lg p-3 ${tone.bg} border ${tone.border}`}>
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tone.text}`} />
                    <div className="min-w-0">
                      <p className="text-xs text-white/85 leading-relaxed">{f.message}</p>
                      <p className="text-[11px] text-white/55 mt-1.5"><strong className={tone.text}>Fix:</strong> {f.fix}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {!expanded && (
        <p className="text-[11px] text-white/40 mt-1 inline-flex items-center gap-1">
          <ChevronDown className="w-3 h-3" /> Tap a system to see findings + fixes
        </p>
      )}
    </>
  );
}
