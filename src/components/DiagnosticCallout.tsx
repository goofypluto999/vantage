import { Link } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { track } from '../lib/track';

/**
 * <DiagnosticCallout source="..." />
 *
 * Reusable conversion callout that promotes the free 60-second No
 * Interviews diagnostic on any page. Drop it anywhere — the diagnostic
 * is the lowest-friction onramp Vantage offers (no signup, no upload,
 * no LLM call) and most cold visitors arrive frustrated by their
 * job-search bottleneck, which is exactly what the diagnostic
 * pinpoints.
 *
 * Each placement passes a `source` string that propagates to the
 * diagnostic page via ?source=<source>. Combined with the in-page
 * Clarity event 'diagnostic_callout_click', we can attribute
 * downstream conversions back to which surface drove them.
 *
 * Variants:
 *   - "default" (purple) — works on any background
 *   - "emerald" — for pages with a primarily green/teal palette
 *   - "compact" — minimal inline link, good for mid-content callouts
 */
type Variant = 'default' | 'emerald' | 'compact';

interface DiagnosticCalloutProps {
  /** UTM-compatible source slug (e.g. 'ats-vendor', 'interview-prep-openai'). Lowercase, kebab-case, no spaces. */
  source: string;
  /** Optional context line shown above the CTA. Tone: 'wait, you should run this first'. */
  prelude?: string;
  /** Optional override for the button label. Defaults to 'Run the free 60-second diagnostic →'. */
  cta?: string;
  variant?: Variant;
  className?: string;
}

const DEFAULT_PRELUDE =
  'Not sure ATS / positioning / proof / market is your real bottleneck? Run the free 60-second diagnostic — 5 deterministic questions, returns one of 7 verdicts, no signup, no LLM call.';

const DEFAULT_CTA = 'Run the free 60-second diagnostic';

export default function DiagnosticCallout({
  source,
  prelude = DEFAULT_PRELUDE,
  cta = DEFAULT_CTA,
  variant = 'default',
  className = '',
}: DiagnosticCalloutProps) {
  const { t } = useTheme();
  const safeSource = encodeURIComponent(source.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 64));
  const href = `/tools/no-interviews-diagnostic?source=${safeSource}`;

  if (variant === 'compact') {
    return (
      <p className={`text-sm ${t.textSub} ${className}`}>
        <Activity className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-emerald-400" />
        <Link
          to={href}
          onClick={() => track('diagnostic_callout_click', { source, variant: 'compact' })}
          className="text-emerald-400 hover:text-emerald-300 underline font-semibold"
        >
          Run the free 60-second diagnostic
        </Link>
        {' '}— pinpoints the bottleneck (ATS / positioning / proof / market), no signup.
      </p>
    );
  }

  const palette =
    variant === 'emerald'
      ? {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          accent: 'text-emerald-300',
          btn:
            'bg-emerald-500 hover:bg-emerald-400 text-white',
        }
      : {
          bg: 'bg-violet-500/10',
          border: 'border-violet-500/30',
          accent: 'text-violet-300',
          btn:
            'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:opacity-95',
        };

  return (
    <div className={`rounded-2xl ${palette.bg} ${palette.border} border p-5 md:p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15 ${palette.accent} flex-shrink-0`}>
          <Activity className="w-4 h-4" />
        </span>
        <div className="flex-1">
          <div className={`text-xs uppercase tracking-wider mb-1 ${palette.accent}`}>Free · 60 seconds · no signup</div>
          <p className={`text-sm leading-relaxed ${t.textSub} mb-3`}>
            {prelude}
          </p>
          <Link
            to={href}
            onClick={() => track('diagnostic_callout_click', { source, variant })}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${palette.btn}`}
          >
            {cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
