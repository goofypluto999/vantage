// JobSearchPage — thin Dashboard-themed wrapper around JobSearchSection.
//
// The Dashboard.tsx page is the PRIMARY surface for the job search
// (user explicit feedback: "should be a dropdown in the dashboard,
// not a separate section"). This /jobs route exists for deep-link +
// SEO compatibility, and renders the same JobSearchSection component
// against the SAME hardcoded dark gradient the Dashboard uses, so
// users hitting /jobs get the same visual treatment as the in-Dashboard
// section.
//
// Previous version used `t.pageBg` which on the light Vantage landing
// theme rendered the dark-themed form text invisibly ("nothing loads").
// Fixed by hardcoding the dark gradient matching Dashboard.tsx exactly.

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../App';
import SEO from './SEO';
import JobSearchSection from './JobSearchSection';

export default function JobSearchPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  // Anonymous users get bounced to /register with a return path.
  useEffect(() => {
    if (user === null) {
      navigate('/register?return=/jobs');
    } else if (user !== undefined) {
      setAuthChecked(true);
    }
  }, [user, navigate]);

  if (!authChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto mb-3" aria-hidden="true" />
          <p className="text-white/70 text-sm">
            {user === null ? 'Redirecting you to sign in…' : 'Checking your account…'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}
    >
      <SEO
        title="AI Job Search — find roles that fit you"
        description="Vantage AI searches 20+ countries and scores every result against your CV. Ghost-job filtered. Salary-transparent. Save to tracker. First scan free."
        path="/jobs"
      />

      {/* Top nav strip — matches Dashboard's compact header */}
      <nav
        className="sticky top-0 z-30 backdrop-blur border-b border-white/5"
        style={{ background: 'rgba(13,11,30,0.92)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-bold tracking-tight text-white">Vantage</Link>
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-violet-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/dashboard" className="text-white/70 hover:text-white transition sm:hidden">Dashboard</Link>
            <Link to="/pricing" className="text-white/70 hover:text-white transition">Pricing</Link>
            <span className="text-xs text-white/50">{profile?.token_balance ?? 0} tokens</span>
          </div>
        </div>
      </nav>

      <main id="main" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <JobSearchSection embedded={false} />

        {/* Footer hint pointing back to the integrated Dashboard surface */}
        <p className="text-center text-xs text-white/40 mt-8">
          AI Job Search is also available directly inside your{' '}
          <Link to="/dashboard" className="underline hover:text-violet-300">Dashboard</Link>{' '}
          as an expandable section.
        </p>
      </main>
    </div>
  );
}
