import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Home, FileText, Sparkles, Wrench } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

/**
 * /404 — real not-found page replacing the silent <Navigate to="/" replace />
 * fallback. Two reasons:
 *
 * 1. SEO: Google and AI crawlers see a soft-404 (200 + redirect) as duplicate
 *    content of /, which dilutes ranking signals. A real noindex page tells
 *    crawlers "this URL doesn't exist" and they drop it from the index
 *    cleanly.
 * 2. UX: typo'd or shared-but-deprecated URLs silently dumping users on /
 *    is confusing. They wonder if they're in the right place, or if the
 *    feature they wanted was removed. Explanatory page with 4-5 destination
 *    links is a 30-second fix.
 *
 * Used as the catch-all <Route path="*"> in App.tsx and as the fallback for
 * SampleAnalysisPage / BlogPost when slug is invalid.
 */
export default function NotFoundPage() {
  const { t } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Page not found"
        description="The page you're looking for doesn't exist on Vantage AI."
        path={location.pathname}
        noindex
      />

      <main id="main" className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <div className={`${t.glass} rounded-2xl p-8 md:p-12 text-center`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/30 mb-6">
            <Search className="w-7 h-7 text-violet-500" aria-hidden="true" />
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold ${t.text} mb-3`}>
            Page not found
          </h1>
          <p className={`${t.textSub} text-lg max-w-xl mx-auto mb-2`}>
            The page at <code className="px-2 py-1 rounded bg-white/10 text-sm">{location.pathname}</code> doesn't exist —
            either the URL was mistyped or the page was moved.
          </p>
          <p className={`${t.textMuted} text-sm`}>
            If you got here from a link inside Vantage that's broken, please email{' '}
            <a href="mailto:hello@aimvantage.uk?subject=Broken%20link" className="underline">
              hello@aimvantage.uk
            </a>{' '}
            so we can fix it.
          </p>
        </div>

        {/* Most-likely destinations — covers >90% of mistyped/lost-link cases. */}
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <Link
            to="/"
            className={`${t.glass} rounded-xl p-5 hover:opacity-90 transition-opacity flex items-start gap-3`}
          >
            <Home className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className={`${t.text} font-semibold`}>Home</div>
              <div className={`${t.textMuted} text-sm`}>The Vantage AI landing page</div>
            </div>
          </Link>
          <Link
            to="/pricing"
            className={`${t.glass} rounded-xl p-5 hover:opacity-90 transition-opacity flex items-start gap-3`}
          >
            <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className={`${t.text} font-semibold`}>Pricing</div>
              <div className={`${t.textMuted} text-sm`}>£5 starter, never expires + monthly plans</div>
            </div>
          </Link>
          <Link
            to="/sample/anthropic-senior-pm"
            className={`${t.glass} rounded-xl p-5 hover:opacity-90 transition-opacity flex items-start gap-3`}
          >
            <FileText className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className={`${t.text} font-semibold`}>Sample output</div>
              <div className={`${t.textMuted} text-sm`}>What a full prep pack looks like (no signup)</div>
            </div>
          </Link>
          <Link
            to="/tools"
            className={`${t.glass} rounded-xl p-5 hover:opacity-90 transition-opacity flex items-start gap-3`}
          >
            <Wrench className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className={`${t.text} font-semibold`}>Free tools</div>
              <div className={`${t.textMuted} text-sm`}>Roast, decode rejection, ghost-job detector</div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-500 hover:text-violet-400"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
