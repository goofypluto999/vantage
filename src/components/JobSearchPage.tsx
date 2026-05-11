// JobSearchPage — the big-ticket "tool → service" feature.
//
// Built 2026-05-11. Multi-source AI-curated job search with refresh-
// proof daily-free-scan gate. Pure presentation component — all
// server logic lives in api/interview/[action].ts (jobsearch action)
// + lib/jobSources.ts.
//
// UX pillars (decided with user):
//   - Anonymous users routed to /register first (no anonymous scans).
//   - First scan in any 24h window is free; don't market the reset.
//   - 20-country Adzuna coverage + global remote via Remotive — no
//     "beta" framing; just a country dropdown.
//   - Staged loading skeleton (Framer Motion) — feels intentional.
//   - Animated match-score circles (count-up) on result cards.
//   - Inline expand for full details + ghost-prob + skill matches/gaps.
//   - "Save to tracker" wires to useApplicationTracker (already live).
//   - "Apply via Vantage" → /dashboard?prefillUrl=... (Phase 2 reads this).
//   - Lazy-loaded via React.lazy from App.tsx route.

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, Search, MapPin, Filter, Loader2, ExternalLink, Bookmark,
  Sparkles, AlertTriangle, ChevronDown, ChevronUp, Ghost, Clock, Target,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../App';
import SEO from './SEO';
import {
  searchJobs,
  type ScoredJob,
  type JobSearchCountry,
  type JobSearchWorkMode,
  type JobSearchPostedWithin,
  type JobSearchResponse,
  type JobSourceReport,
} from '../services/api';
import { useApplicationTracker } from '../lib/useApplicationTracker';

const COUNTRIES: { code: JobSearchCountry; label: string; flag: string }[] = [
  { code: 'gb', label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'us', label: 'United States', flag: '🇺🇸' },
  { code: 'ca', label: 'Canada', flag: '🇨🇦' },
  { code: 'au', label: 'Australia', flag: '🇦🇺' },
  { code: 'de', label: 'Germany', flag: '🇩🇪' },
  { code: 'fr', label: 'France', flag: '🇫🇷' },
  { code: 'es', label: 'Spain', flag: '🇪🇸' },
  { code: 'it', label: 'Italy', flag: '🇮🇹' },
  { code: 'nl', label: 'Netherlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Poland', flag: '🇵🇱' },
  { code: 'sg', label: 'Singapore', flag: '🇸🇬' },
  { code: 'in', label: 'India', flag: '🇮🇳' },
  { code: 'br', label: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', label: 'Mexico', flag: '🇲🇽' },
  { code: 'nz', label: 'New Zealand', flag: '🇳🇿' },
  { code: 'ch', label: 'Switzerland', flag: '🇨🇭' },
  { code: 'at', label: 'Austria', flag: '🇦🇹' },
  { code: 'be', label: 'Belgium', flag: '🇧🇪' },
  { code: 'za', label: 'South Africa', flag: '🇿🇦' },
  { code: 'ru', label: 'Russia', flag: '🇷🇺' },
];

const WORK_MODES: { value: JobSearchWorkMode; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'On-site' },
];

const POSTED_WITHIN: { value: JobSearchPostedWithin; label: string }[] = [
  { value: 1, label: '24 hours' },
  { value: 3, label: '3 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
];

const LOADING_STAGES = [
  'Fetching from sources…',
  'Deduplicating results…',
  'Filtering ghost jobs…',
  'Scoring against your CV…',
  'Ranking top 10…',
];

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-300 border-emerald-400/40';
  if (score >= 60) return 'text-violet-300 border-violet-400/40';
  if (score >= 40) return 'text-amber-300 border-amber-400/40';
  return 'text-rose-300 border-rose-400/40';
}

function safeHref(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? url : undefined;
  } catch { return undefined; }
}

export default function JobSearchPage() {
  const { t } = useTheme();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  // Derive isSaved from the live tracker entries (review MED) so the
  // button reflects reality even if the user un-tracks via Dashboard.
  const { entries: trackerEntries, add: addToTracker } = useApplicationTracker({ userScope: user?.id });

  // Filter state
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState<JobSearchCountry>('gb');
  const [workMode, setWorkMode] = useState<JobSearchWorkMode>('any');
  const [postedWithin, setPostedWithin] = useState<JobSearchPostedWithin>(30);
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [hideGhost, setHideGhost] = useState(true);

  // Result state
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [needsTopUp, setNeedsTopUp] = useState(false);
  const [results, setResults] = useState<ScoredJob[] | null>(null);
  const [meta, setMeta] = useState<{
    sources?: Record<string, number>;
    sourceReport?: Record<string, JobSourceReport>;
    fetched?: number;
    deduped?: number;
    was_free?: boolean;
    tokenBalance?: number;
  }>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoursToFreeReset, setHoursToFreeReset] = useState<number | undefined>();
  const inFlightRef = useRef(false);
  const allStagesCompleteRef = useRef(false);

  // Tracker-derived saved-job ids (review MED). Reacts live to changes
  // in the tracker (add/remove from any source) instead of stale local
  // state. Key fragment: company+role lowercased — same heuristic the
  // tracker uses for dedup.
  const savedKeys = useMemo(() => {
    const s = new Set<string>();
    for (const e of trackerEntries) {
      s.add(`${e.company.toLowerCase()}|${e.role.toLowerCase()}`);
    }
    return s;
  }, [trackerEntries]);

  function isJobSaved(job: ScoredJob): boolean {
    return savedKeys.has(`${job.company.toLowerCase()}|${job.title.toLowerCase()}`);
  }

  // Anonymous users get bounced.
  useEffect(() => {
    if (user === null) {
      navigate('/register?return=/jobs');
    }
  }, [user, navigate]);

  // Loading-stage cycler — feels intentional, not opaque. Review MED
  // flagged that if the real search is faster/slower than the cycler,
  // stages either skip or sit stuck. We mark all stages complete when
  // results arrive (allStagesCompleteRef), and the visible state
  // respects that.
  useEffect(() => {
    if (!loading) {
      setLoadingStage(0);
      allStagesCompleteRef.current = false;
      return;
    }
    const stages = LOADING_STAGES.length;
    const interval = setInterval(() => {
      setLoadingStage((s) => Math.min(s + 1, stages - 1));
    }, 1400);
    return () => clearInterval(interval);
  }, [loading]);

  const visibleResults = useMemo(() => {
    if (!results) return null;
    if (!hideGhost) return results;
    return results.filter((j) => j.ghostProbability < 75);
  }, [results, hideGhost]);

  const hiddenGhostCount = useMemo(() => {
    if (!results || !hideGhost) return 0;
    return results.filter((j) => j.ghostProbability >= 75).length;
  }, [results, hideGhost]);

  async function handleSearch() {
    if (inFlightRef.current) return;
    if (!keywords.trim() && !location.trim()) {
      setError('Add at least keywords or a location to search.');
      return;
    }
    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    setNeedsTopUp(false);
    setHoursToFreeReset(undefined);
    setResults(null);
    allStagesCompleteRef.current = false;
    try {
      const res: JobSearchResponse = await searchJobs({
        keywords: keywords.trim().slice(0, 200),
        location: location.trim().slice(0, 100),
        country,
        workMode,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        postedWithin,
      });
      if (!res.success || !res.jobs) {
        setError(res.error || 'Search failed. Try again.');
        if (res.needsTopUp) setNeedsTopUp(true);
        if (typeof res.hoursToFreeReset === 'number') setHoursToFreeReset(res.hoursToFreeReset);
        return;
      }
      // Mark all loading stages complete so the skeleton shows ✓-✓-✓-✓-✓
      // instead of stopping mid-cycle.
      allStagesCompleteRef.current = true;
      setLoadingStage(LOADING_STAGES.length);
      setResults(res.jobs);
      setMeta({
        sources: res.sources,
        sourceReport: res.source_report,
        fetched: res.fetched,
        deduped: res.deduped,
        was_free: res.was_free,
        tokenBalance: res.token_balance,
      });
      if (res.jobs.length === 0 && res.message) {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message?.toLowerCase().includes('network') ? 'Network error — try again.' : 'Search failed. Try again.');
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  function saveJobToTracker(job: ScoredJob) {
    if (isJobSaved(job)) return; // idempotent
    addToTracker({
      company: job.company,
      role: job.title,
      status: 'saved',
      sourceUrl: safeHref(job.url),
      location: job.location,
      salaryBand: job.salaryEstimate || (job.salaryMin || job.salaryMax
        ? `${job.salaryMin ?? '?'}-${job.salaryMax ?? '?'} ${job.salaryCurrency || ''}`.trim()
        : undefined),
      notes: job.fitOneLiner,
    });
    // No local state to update — the trackerEntries dep will refresh
    // savedKeys automatically.
  }

  function applyViaVantage(job: ScoredJob) {
    const href = safeHref(job.url);
    if (!href) return;
    // Pass JD URL to Dashboard via querystring AND location.state so
    // the Dashboard can render a visible "Pre-filled from job search"
    // banner (review HIGH — was silent navigation, no feedback). The
    // querystring is also kept for deep-link / share-link compat.
    navigate(`/dashboard?prefillUrl=${encodeURIComponent(href)}`, {
      state: {
        prefilledFromJobSearch: {
          title: job.title,
          company: job.company,
        },
      },
    });
  }

  if (!user) {
    // Distinct loading state for the auth-check / redirect-in-flight
    // window (review HIGH — was a bare spinner with no text).
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: t.pageBg }} role="status" aria-live="polite">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto mb-3" aria-hidden="true" />
          <p className={`${t.textSub} text-sm`}>
            {user === null ? 'Redirecting you to sign in…' : 'Checking your account…'}
          </p>
        </div>
      </div>
    );
  }

  // Token preflight (review MED). If user has 0 tokens AND has used
  // their free scan this window, disable the Run-scan button + change
  // the CTA label so the user doesn't click into a failure.
  const tokensAvailable = (profile?.token_balance ?? 0) > 0;
  const canRunScan = !loading && (keywords.trim() || location.trim()) && (tokensAvailable || !meta.was_free);
  // Hero copy adapts (review MED): the "first scan free" line is only
  // honest on the very first visit. If the user has already run a
  // scan this session, switch to the value-prop copy.
  const isFirstVisit = !results && !meta.was_free;

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="AI Job Search — find roles that fit you"
        description="Vantage AI searches 20+ countries and scores every result against your CV. Ghost-job filtered. Salary-transparent. Save to tracker. First scan free."
        path="/jobs"
      />

      {/* Top nav strip */}
      <nav className={`${t.nav} sticky top-0 z-30 backdrop-blur`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text} font-bold tracking-tight`}>
            Vantage
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/dashboard" className={`${t.textSub} hover:opacity-80`}>Dashboard</Link>
            <Link to="/pricing" className={`${t.textSub} hover:opacity-80`}>Pricing</Link>
            <span className={`text-xs ${t.textMuted}`}>{profile?.token_balance ?? 0} tokens</span>
          </div>
        </div>
      </nav>

      <main id="main" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-violet-400" aria-hidden="true" />
            <span className={`text-xs uppercase tracking-widest font-semibold ${t.textSub}`}>AI Job Search</span>
          </div>
          <h1 className={`text-3xl sm:text-5xl font-bold ${t.text} mb-3 max-w-3xl`}>
            Find roles that actually fit you. <span className="text-violet-400">Curated, scored, ghost-filtered.</span>
          </h1>
          <p className={`${t.textSub} max-w-2xl text-lg`}>
            {isFirstVisit
              ? 'We search 20 countries plus global remote, run every result against your CV, hide the ghost jobs, and rank the top 10 by fit. Your first scan is free.'
              : 'Multi-country search + AI scoring against your CV. Ghost-filtered. Salary-transparent. Save to tracker. Apply via Vantage.'}
          </p>
        </header>

        {/* Search form */}
        <section
          aria-label="Search filters"
          className={`${t.glass} rounded-2xl p-5 md:p-6 mb-6`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="js-keywords" className="block text-xs font-semibold text-white/70 mb-1">
                <Search className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                Keywords (role, skills, company)
              </label>
              <input
                id="js-keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value.slice(0, 200))}
                placeholder="Senior PM, payments, fintech"
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label htmlFor="js-location" className="block text-xs font-semibold text-white/70 mb-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                Location (city, region, postcode)
              </label>
              <input
                id="js-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value.slice(0, 100))}
                placeholder="London / Manchester / SF / Remote"
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label htmlFor="js-country" className="block text-xs font-semibold text-white/70 mb-1">Country</label>
              <select
                id="js-country"
                value={country}
                onChange={(e) => setCountry(e.target.value as JobSearchCountry)}
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <span id="js-workmode-label" className="block text-xs font-semibold text-white/70 mb-1">Work mode</span>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="js-workmode-label">
                {WORK_MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setWorkMode(m.value)}
                    aria-pressed={workMode === m.value}
                    className={`inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                      workMode === m.value
                        ? 'bg-violet-500/15 text-violet-200 border-violet-400/40'
                        : 'bg-white/[0.02] text-white/50 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="js-posted" className="block text-xs font-semibold text-white/70 mb-1">Posted within</label>
              <select
                id="js-posted"
                value={postedWithin}
                onChange={(e) => setPostedWithin(Number(e.target.value) as JobSearchPostedWithin)}
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
              >
                {POSTED_WITHIN.map((p) => (
                  <option key={p.value} value={p.value}>Last {p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="js-salary" className="block text-xs font-semibold text-white/70 mb-1">
                Min salary <span className="text-white/40">(optional, local currency)</span>
              </label>
              <input
                id="js-salary"
                type="number"
                min={0}
                max={10_000_000}
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="70000"
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={hideGhost}
                onChange={(e) => setHideGhost(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
              />
              <Ghost className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Hide likely ghost jobs (recommended)
            </label>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!canRunScan}
              aria-busy={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Searching…
                </>
              ) : !tokensAvailable && meta.was_free ? (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Top up to scan
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {meta.was_free === false ? 'Run scan (1 token)' : 'Run scan (free)'}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Animated loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              role="status"
              aria-live="polite"
              className={`${t.glass} rounded-2xl p-6 mb-6`}
            >
              <div className="space-y-2">
                {LOADING_STAGES.map((s, i) => (
                  <div
                    key={s}
                    className={`flex items-center gap-2 text-sm transition-opacity ${
                      i <= loadingStage ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    {i < loadingStage ? (
                      <span className="text-emerald-400">✓</span>
                    ) : i === loadingStage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" aria-hidden="true" />
                    ) : (
                      <span className="text-white/30">•</span>
                    )}
                    <span className={i <= loadingStage ? t.text : t.textMuted}>{s}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Error / top-up state */}
        {error && !loading && (
          <div role="alert" className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p>{error}</p>
              {needsTopUp && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition min-h-[36px]"
                  >
                    Top up tokens →
                  </Link>
                  {typeof hoursToFreeReset === 'number' && hoursToFreeReset > 0 && (
                    <span className="text-xs text-rose-200/80">
                      …or your free daily scan resets in {hoursToFreeReset}h.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Source-not-configured banner: surface honestly when Adzuna
            keys aren't in Vercel env yet so users know it's coverage-
            partial, not "no jobs match." Review MED. */}
        {meta.sourceReport && meta.sourceReport.adzuna?.state === 'not-configured' && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Multi-country search (Adzuna) is not yet configured on this deploy. You're seeing global remote results only (via Remotive). UK/US/EU coverage coming online soon.
            </p>
          </div>
        )}

        {/* Results */}
        {visibleResults && !loading && (
          <section aria-label="Search results">
            {/* Result meta strip */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4 text-xs">
              <p className={t.textMuted}>
                {meta.fetched ?? 0} fetched · {meta.deduped ?? 0} deduplicated · top {visibleResults.length} curated
                {hiddenGhostCount > 0 && <> · <button type="button" onClick={() => setHideGhost(false)} className="underline hover:text-amber-300">{hiddenGhostCount} ghost hidden</button></>}
              </p>
              <p className={t.textMuted}>
                {meta.was_free ? <span className="text-emerald-400 font-semibold">Free scan used</span> : <span>1 token spent · {meta.tokenBalance ?? 0} left</span>}
              </p>
            </div>

            {visibleResults.length === 0 ? (
              <div className={`${t.glass} rounded-2xl p-8 text-center`}>
                <p className={`${t.textSub}`}>No matches. Try relaxing keywords, expanding to UK-wide, or unchecking the ghost filter.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence initial={true}>
                  {visibleResults.map((job, idx) => {
                    const isExpanded = expandedId === job.id;
                    const isSaved = isJobSaved(job);
                    const href = safeHref(job.url);
                    const ghostHigh = job.ghostProbability >= 75;
                    const ghostMid = job.ghostProbability >= 50 && job.ghostProbability < 75;
                    return (
                      <motion.li
                        key={job.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`${t.glass} rounded-2xl overflow-hidden`}
                      >
                        {/* Card head */}
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                            {/* Match score badge — role=meter so SRs
                                announce "Match score 87 out of 100"
                                instead of just "87". (Review HIGH.) */}
                            <div
                              role="meter"
                              aria-label={`Match score ${job.matchScore} out of 100`}
                              aria-valuenow={job.matchScore}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              className={`flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold ${scoreColor(job.matchScore)}`}
                            >
                              {job.matchScore}
                            </div>
                            {/* Title row */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline flex-wrap gap-x-2">
                                <h3 className={`text-lg font-bold ${t.text} truncate`}>{job.title}</h3>
                                <span className={`text-sm ${t.textSub}`}>at {job.company}</span>
                              </div>
                              <p className={`text-xs ${t.textMuted} mt-0.5`}>
                                {job.location}
                                {(job.salaryMin || job.salaryMax || job.salaryEstimate) && (
                                  <> · {
                                    job.salaryMin || job.salaryMax
                                      ? `${job.salaryMin ?? '?'}-${job.salaryMax ?? '?'} ${job.salaryCurrency || ''}`.trim()
                                      : <span className="text-violet-300">{job.salaryEstimate}</span>
                                  }</>
                                )}
                                {job.postedAt && <> · {new Date(job.postedAt).toLocaleDateString()}</>}
                                {' · '}<span className="text-white/40">{job.source}</span>
                              </p>
                              <p className={`text-sm mt-2 ${t.textSub}`}>{job.fitOneLiner}</p>
                            </div>
                          </div>

                          {/* Action row — bumped to min-h-[44px] for
                              WCAG 2.5.5 touch-target compliance.
                              Ghost badge color tiered (review MED). */}
                          <div className="flex items-center gap-2 mt-4 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : job.id)}
                              aria-expanded={isExpanded}
                              aria-controls={`job-body-${job.id}`}
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              {isExpanded ? 'Less' : 'More'}
                            </button>
                            <button
                              type="button"
                              onClick={() => saveJobToTracker(job)}
                              disabled={isSaved}
                              className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px] ${
                                isSaved
                                  ? 'bg-emerald-500/15 text-emerald-300 cursor-default'
                                  : 'bg-white/5 hover:bg-white/10 text-white/80'
                              }`}
                              aria-label={isSaved ? 'Already saved to tracker' : `Save ${job.company} ${job.title} to tracker`}
                            >
                              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                              {isSaved ? 'Saved' : 'Save to tracker'}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyViaVantage(job)}
                              disabled={!href}
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]"
                            >
                              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                              Apply via Vantage
                            </button>
                            {href && (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-semibold text-white/70 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]"
                              >
                                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Original
                              </a>
                            )}
                            {(ghostHigh || ghostMid) && (
                              <span
                                role="img"
                                aria-label={`${ghostHigh ? 'Likely ghost job' : 'Possible ghost job'}, ${job.ghostProbability}% probability`}
                                className={`ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
                                  ghostHigh
                                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                <Ghost className="w-3 h-3" aria-hidden="true" /> {ghostHigh ? 'Likely ghost' : `${job.ghostProbability}% ghost`}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expanded body */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              id={`job-body-${job.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-white/10"
                            >
                              <div className="p-4 sm:p-5 space-y-4">
                                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-violet-400" aria-hidden="true" />
                                    <span className={t.textSub}>ATS pass: <strong className={t.text}>{job.atsPassLikelihood}</strong></span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-violet-400" aria-hidden="true" />
                                    <span className={t.textSub}>{job.timeToApply}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Ghost className="w-4 h-4 text-violet-400" aria-hidden="true" />
                                    <span className={t.textSub}>Ghost probability: <strong className={t.text}>{job.ghostProbability}%</strong></span>
                                  </div>
                                </div>

                                {job.skillMatches.length > 0 && (
                                  <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${t.textMuted} mb-1.5`}>Skill matches</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {job.skillMatches.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">{s}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {job.skillGaps.length > 0 && (
                                  <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${t.textMuted} mb-1.5`}>Skill gaps</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {job.skillGaps.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30">{s}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <p className={`text-[10px] font-bold uppercase tracking-widest ${t.textMuted} mb-1.5`}>Description (excerpt)</p>
                                  <p className={`text-sm ${t.textSub} whitespace-pre-wrap line-clamp-6`}>{job.description}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </section>
        )}

        {/* Initial empty hero (before first search) */}
        {!loading && !results && !error && (
          <div className={`${t.glass} rounded-2xl p-8 text-center`}>
            <Filter className="w-8 h-8 text-violet-400 mx-auto mb-3" aria-hidden="true" />
            <p className={`${t.textSub}`}>Set your filters and tap <strong className={t.text}>Run scan</strong>. Your first scan today is free.</p>
          </div>
        )}
      </main>
    </div>
  );
}
