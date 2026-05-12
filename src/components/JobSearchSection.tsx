// JobSearchSection — the AI Job Search core UI as a SECTION component.
//
// Designed to be mounted in TWO places:
//   1. Inside Dashboard.tsx as an expandable section (the user's
//      "dropdown in the dashboard" — primary surface)
//   2. As the full-page /jobs route wrapped in a Dashboard-themed shell
//      (for SEO + deep-link compatibility)
//
// Theme: hardcoded dark to match Dashboard.tsx exactly
// (`linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)` ambient). All
// text/borders use white/X opacity tokens that work on dark, not
// theme-aware `t.glass`-style tokens (those proved to render
// invisibly on the light Vantage landing theme).
//
// Built 2026-05-11 as the third refinement of the Job Search milestone.

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, Search, MapPin, Filter, Loader2, ExternalLink, Bookmark,
  Sparkles, AlertTriangle, ChevronDown, ChevronUp, Ghost, Clock, Target,
} from 'lucide-react';
import { useAuth } from '../App';
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
import { useFormDraft } from '../lib/useFormDraft';

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
  { value: 1, label: '24 hours' }, { value: 3, label: '3 days' },
  { value: 7, label: '7 days' }, { value: 14, label: '14 days' },
  { value: 30, label: '30 days' }, { value: 90, label: '90 days' },
];

const LOADING_STAGES = [
  'Fetching from sources…',
  'Deduplicating results…',
  'Filtering ghost jobs…',
  'Scoring against your CV…',
  'Ranking top 10…',
];

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-300 border-emerald-400/50 bg-emerald-500/10';
  if (score >= 60) return 'text-violet-300 border-violet-400/50 bg-violet-500/10';
  if (score >= 40) return 'text-amber-300 border-amber-400/50 bg-amber-500/10';
  return 'text-rose-300 border-rose-400/50 bg-rose-500/10';
}

function safeHref(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? url : undefined;
  } catch { return undefined; }
}

/** User-facing source labels (keys match perSourceReport keys returned by the API). */
const SOURCE_DISPLAY_NAMES: Record<string, string> = {
  adzuna: 'Adzuna',
  remotive: 'Remotive',
  mock: 'Test source',
};

/** Human-readable "in Xh" / "in Xm" string from an ISO timestamp.
 * Returns null if the timestamp is invalid, in the past, or somehow >30 days out. */
function formatNextFree(iso: string | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  const diff = ms - Date.now();
  if (diff <= 0) return 'now';
  if (diff > 30 * 24 * 60 * 60 * 1000) return null;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours >= 1) return `${hours}h`;
  const minutes = Math.max(1, Math.ceil(diff / (60 * 1000)));
  return `${minutes}m`;
}

interface Props {
  /** When true, render in compact embedded mode (Dashboard section) —
   * skips the big hero header. When false, render as a full page. */
  embedded?: boolean;
  /** Optional class extension. */
  className?: string;
}

export default function JobSearchSection({ embedded = false, className = '' }: Props) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { entries: trackerEntries, add: addToTracker, remove: removeFromTracker } = useApplicationTracker({ userScope: user?.id });

  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState<JobSearchCountry>('gb');
  const [workMode, setWorkMode] = useState<JobSearchWorkMode>('any');
  const [postedWithin, setPostedWithin] = useState<JobSearchPostedWithin>(30);
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [hideGhost, setHideGhost] = useState(true);

  // Persist the search-filter inputs (keywords/location/country/workMode/
  // postedWithin/salaryMin) per-user across navigations so repeat scans
  // don't require re-typing. Auto-saved 500ms after the last keystroke,
  // TTL 7 days, user-scoped storage key (sweepDraftsForUser clears on
  // logout via the `vantage-` prefix). Only the 6 filter fields persist
  // — never results, error state, or ephemeral UI toggles.
  const searchDraft = useMemo(
    () => ({ keywords, location, country, workMode, postedWithin, salaryMin }),
    [keywords, location, country, workMode, postedWithin, salaryMin],
  );
  const { loadDraft: loadSearchDraft, clearDraft: clearSearchDraft } = useFormDraft(
    'vantage-jobsearch-filters-v1',
    searchDraft,
    // Only persist for authenticated users — the /jobs route bounces
    // anonymous visitors to /register, and the Dashboard embedded mount
    // is gated by auth too. Explicit `enabled` flag prevents any brief
    // pre-auth render from writing to the unscoped global key.
    { userScope: user?.id, enabled: !!user?.id },
  );

  // Reset all 6 persisted filter fields back to defaults AND wipe the
  // saved draft so the cleared state is what stays after the next mount.
  // Doesn't touch results/hideGhost (those aren't persisted).
  // Order matters: clearDraft() suppresses the next auto-save, then we
  // call the setters, so the post-reset render won't immediately
  // re-persist the defaults (no-op, but cleaner).
  function resetFilters() {
    clearSearchDraft();
    setKeywords('');
    setLocation('');
    setCountry('gb');
    setWorkMode('any');
    setPostedWithin(30);
    setSalaryMin('');
  }
  // On mount only: silently restore the last search if one exists.
  // No prompt — search filters are utility data, not a sensitive draft.
  // A defensive whitelist guards against schema drift across versions.
  useEffect(() => {
    const saved = loadSearchDraft();
    if (!saved) return;
    if (typeof saved.keywords === 'string') setKeywords(saved.keywords.slice(0, 200));
    if (typeof saved.location === 'string') setLocation(saved.location.slice(0, 100));
    if (typeof saved.country === 'string' && COUNTRIES.some((c) => c.code === saved.country)) {
      setCountry(saved.country as JobSearchCountry);
    }
    if (saved.workMode === 'any' || saved.workMode === 'remote' || saved.workMode === 'hybrid' || saved.workMode === 'on-site') {
      setWorkMode(saved.workMode);
    }
    if (saved.postedWithin === 1 || saved.postedWithin === 3 || saved.postedWithin === 7 || saved.postedWithin === 14 || saved.postedWithin === 30 || saved.postedWithin === 90) {
      setPostedWithin(saved.postedWithin);
    }
    if (typeof saved.salaryMin === 'string') setSalaryMin(saved.salaryMin.slice(0, 12));
    // Deliberately not in deps: this runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [needsTopUp, setNeedsTopUp] = useState(false);
  const [hoursToFreeReset, setHoursToFreeReset] = useState<number | undefined>();
  const [results, setResults] = useState<ScoredJob[] | null>(null);
  const [meta, setMeta] = useState<{
    sources?: Record<string, number>;
    sourceReport?: Record<string, JobSourceReport>;
    fetched?: number;
    deduped?: number;
    was_free?: boolean;
    tokenBalance?: number;
    nextFreeAt?: string;
  }>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inFlightRef = useRef(false);

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

  useEffect(() => {
    if (!loading) { setLoadingStage(0); return; }
    const interval = setInterval(() => {
      setLoadingStage((s) => Math.min(s + 1, LOADING_STAGES.length - 1));
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
    try {
      const res: JobSearchResponse = await searchJobs({
        keywords: keywords.trim().slice(0, 200),
        location: location.trim().slice(0, 100),
        country, workMode,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        postedWithin,
      });
      if (!res.success || !res.jobs) {
        setError(res.error || 'Search failed. Try again.');
        if (res.needsTopUp) setNeedsTopUp(true);
        if (typeof res.hoursToFreeReset === 'number') setHoursToFreeReset(res.hoursToFreeReset);
        return;
      }
      setLoadingStage(LOADING_STAGES.length);
      setResults(res.jobs);
      setMeta({
        sources: res.sources, sourceReport: res.source_report,
        fetched: res.fetched, deduped: res.deduped,
        was_free: res.was_free, tokenBalance: res.token_balance,
        nextFreeAt: res.next_free_at,
      });
      if (res.jobs.length === 0 && res.message) setError(res.message);
    } catch (err: any) {
      setError(err?.message?.toLowerCase().includes('network') ? 'Network error — try again.' : 'Search failed. Try again.');
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  function saveJobToTracker(job: ScoredJob) {
    // Click-to-unsave: if already saved, remove instead of no-op.
    if (isJobSaved(job)) {
      const existing = trackerEntries.find((e) =>
        e.company.toLowerCase() === job.company.toLowerCase() &&
        e.role.toLowerCase() === job.title.toLowerCase()
      );
      if (existing) {
        removeFromTracker(existing.id);
        setToast({ title: job.title, company: job.company, mode: 'removed', entryKey: null });
      }
      return;
    }
    const newId = addToTracker({
      company: job.company, role: job.title, status: 'saved',
      sourceUrl: safeHref(job.url), location: job.location,
      salaryBand: job.salaryEstimate || (job.salaryMin || job.salaryMax
        ? `${job.salaryMin ?? '?'}-${job.salaryMax ?? '?'} ${job.salaryCurrency || ''}`.trim()
        : undefined),
      notes: job.fitOneLiner,
    });
    // Toast carries the entry key so 'Undo' can remove the right row.
    setToast({ title: job.title, company: job.company, mode: 'saved', entryKey: newId || null });
  }

  // Toast for save-to-tracker feedback. Bigger now, 6s duration (was 4s —
  // user reported 3s felt too fast), with Undo + View Tracker actions.
  const [toast, setToast] = useState<
    | { title: string; company: string; mode: 'saved' | 'removed'; entryKey: string | null }
    | null
  >(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  function scrollToTracker() {
    // ApplicationTracker now persistently rendered on Dashboard (out of the
    // results-step gate as of 2026-05-12) so this always has a target on
    // the Dashboard route. On the standalone /jobs route, no tracker exists
    // — navigate the user back to /dashboard#application-tracker.
    const el = document.getElementById('application-tracker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/dashboard#application-tracker');
    }
  }
  function undoLastSave() {
    if (!toast || toast.mode !== 'saved' || !toast.entryKey) return;
    removeFromTracker(toast.entryKey);
    setToast(null);
  }

  function applyViaVantage(job: ScoredJob) {
    const href = safeHref(job.url);
    if (!href) return;
    // Pass the JD description text along so the analyzer can skip the
    // scrape entirely (sites like Adzuna / LinkedIn / Indeed block our
    // scraper). The user reported this failure mode 2026-05-12.
    // The job.description was already fetched + paid for by the scan —
    // re-using it here saves a token AND eliminates the scrape failure.
    navigate(`/dashboard?prefillUrl=${encodeURIComponent(href)}`, {
      state: {
        prefilledFromJobSearch: { title: job.title, company: job.company },
        prefilledJobDescription: job.description || '',
      },
    });
  }

  const tokensAvailable = (profile?.token_balance ?? 0) > 0;
  const canRunScan = !loading && (keywords.trim() || location.trim()) && (tokensAvailable || !meta.was_free);

  // Dashboard-matching dark-glass styles. Reused across all internal
  // cards/inputs so the section is visually cohesive with the rest of
  // the Dashboard chrome.
  const glassCard = 'bg-[#181530]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';
  const inputCls = 'w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 px-3 py-2 text-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30';

  return (
    <div className={className}>
      {!embedded && (
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-violet-400" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest font-semibold text-violet-300">AI Job Search</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Find roles that actually fit you.
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl">
            We search 20 countries plus global remote, run every result against your CV, hide the ghost jobs, and rank the top 10 by fit. Your first scan is free.
          </p>
        </header>
      )}

      {/* Tracker shortcut pill — visible whenever the user has saved any jobs.
          Click jumps them to their Application Tracker section. Bridges the
          'Save to Tracker → where did it go?' UX gap reported 2026-05-12. */}
      {trackerEntries.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={scrollToTracker}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-200 border border-violet-500/30 hover:bg-violet-500/25 transition min-h-[36px]"
            aria-label={`Open your application tracker (${trackerEntries.length} saved)`}
          >
            <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
            Tracker · {trackerEntries.length} saved
          </button>
        </div>
      )}

      {/* Save-to-tracker confirmation toast. Bottom-right, auto-dismisses
          after 4s. Surfaces because users were saving jobs with no feedback
          and didn't know where they went. */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            role="status"
            aria-live="polite"
            className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] p-4 rounded-2xl backdrop-blur-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] flex items-start gap-3 ${
              toast.mode === 'saved'
                ? 'bg-emerald-500/20 border-2 border-emerald-500/60'
                : 'bg-amber-500/20 border-2 border-amber-500/60'
            }`}
          >
            <Bookmark className={`w-5 h-5 flex-shrink-0 mt-0.5 ${toast.mode === 'saved' ? 'text-emerald-300' : 'text-amber-300'}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white mb-0.5">
                {toast.mode === 'saved' ? 'Saved to tracker' : 'Removed from tracker'}
              </p>
              <p className="text-sm text-white/80 line-clamp-2 mb-2" title={`${toast.title} at ${toast.company}`}>
                {toast.title} <span className="text-white/60">at</span> {toast.company}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => { setToast(null); scrollToTracker(); }}
                  className="px-3 py-1.5 rounded-md text-sm font-semibold bg-white/15 text-white hover:bg-white/25 transition min-h-[36px]"
                >
                  View tracker →
                </button>
                {toast.mode === 'saved' && toast.entryKey && (
                  <button
                    type="button"
                    onClick={undoLastSave}
                    className="text-sm font-semibold text-white/70 hover:text-white underline-offset-2 hover:underline transition min-h-[36px]"
                  >
                    Undo
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="text-white/50 hover:text-white text-2xl leading-none transition flex-shrink-0 -mt-1"
            >
              <span aria-hidden="true">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV-status banner. Without a saved CV summary on the profile (i.e.
          the user hasn't run their first prep-pack analysis yet), the AI
          scoring falls back to keyword + salary + filters only — which
          produces results that look real but aren't matched against the
          candidate's real profile. Surface this loud-and-clear so users
          understand the score quality is degraded, with a one-click
          'Upload CV →' CTA that scrolls them to the analysis form.
          When cv_summary IS present, show a quieter green confirmation. */}
      {profile && !profile.cv_summary && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold text-amber-100 mb-1">No CV on file yet</p>
            <p className="text-amber-200/85 mb-2">
              You can still run a scan, but results will be scored by keyword + salary + filters only — not against your actual CV. <strong className="text-amber-100">Upload your CV in the analyzer below first</strong> for proper match scoring.
            </p>
            <button
              type="button"
              onClick={() => {
                const el = document.querySelector('[data-analysis-form]');
                if (el && 'scrollIntoView' in el) {
                  (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-xs font-semibold text-amber-100 hover:text-white underline"
            >
              Take me to the analyzer →
            </button>
          </div>
        </div>
      )}
      {profile && profile.cv_summary && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
          <Target className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>Matching against your CV ✓ — results are scored against your saved profile.</span>
        </div>
      )}

      <section aria-label="Search filters" className={`${glassCard} rounded-2xl p-5 md:p-6 mb-5`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="js-keywords" className="block text-xs font-semibold text-white/80 mb-1.5">
              <Search className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> Keywords (role, skills, company)
            </label>
            <input id="js-keywords" type="text" value={keywords}
              onChange={(e) => setKeywords(e.target.value.slice(0, 200))}
              placeholder="Senior PM, payments, fintech"
              className={inputCls} />
          </div>
          <div>
            <label htmlFor="js-location" className="block text-xs font-semibold text-white/80 mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> Location
            </label>
            <input id="js-location" type="text" value={location}
              onChange={(e) => setLocation(e.target.value.slice(0, 100))}
              placeholder="London / Manchester / SF / Remote"
              className={inputCls} />
          </div>
          <div>
            <label htmlFor="js-country" className="block text-xs font-semibold text-white/80 mb-1.5">Country</label>
            <select id="js-country" value={country} onChange={(e) => setCountry(e.target.value as JobSearchCountry)}
              className={inputCls}>
              {COUNTRIES.map((c) => (<option key={c.code} value={c.code} className="bg-[#181530]">{c.flag} {c.label}</option>))}
            </select>
          </div>
          <div>
            <span id="js-workmode-label" className="block text-xs font-semibold text-white/80 mb-1.5">Work mode</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="js-workmode-label">
              {WORK_MODES.map((m) => (
                <button key={m.value} type="button" onClick={() => setWorkMode(m.value)} aria-pressed={workMode === m.value}
                  className={`inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                    workMode === m.value
                      ? 'bg-violet-500/20 text-violet-100 border-violet-400/60 shadow-[0_0_0_1px_rgba(167,139,250,0.3)]'
                      : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.07] hover:text-white/80'
                  }`}>{m.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="js-posted" className="block text-xs font-semibold text-white/80 mb-1.5">Posted within</label>
            <select id="js-posted" value={postedWithin}
              onChange={(e) => setPostedWithin(Number(e.target.value) as JobSearchPostedWithin)}
              className={inputCls}>
              {POSTED_WITHIN.map((p) => (<option key={p.value} value={p.value} className="bg-[#181530]">Last {p.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="js-salary" className="block text-xs font-semibold text-white/80 mb-1.5">
              Min salary <span className="text-white/40">(optional, local currency)</span>
            </label>
            <input id="js-salary" type="number" min={0} max={10_000_000} value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)} placeholder="70000"
              className={inputCls} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <label
            className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer"
            title="Ghost jobs are listings that look real but have no actual role behind them — old roles posted to inflate hiring funnels, ATS test posts, or résumé harvesting. Vantage scores each result for ghost probability (0-100) using posting age, vague requirements, missing salary, and reposting patterns. With this on, listings scoring ≥75% are hidden from view."
          >
            <input type="checkbox" checked={hideGhost} onChange={(e) => setHideGhost(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500" />
            <Ghost className="w-4 h-4 text-amber-400" aria-hidden="true" />
            Hide likely ghost jobs (recommended)
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {(keywords || location || salaryMin || country !== 'gb' || workMode !== 'any' || postedWithin !== 30) && (
              <button
                type="button"
                onClick={resetFilters}
                disabled={loading}
                className="text-xs text-white/50 hover:text-white/80 underline-offset-2 hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition px-2 py-1 min-h-[36px]"
                aria-label="Reset all search filters to defaults"
                title="Clear keywords, location, country, work mode, salary, and posted-within filters"
              >
                Reset filters
              </button>
            )}
            <button type="button" onClick={handleSearch} disabled={!canRunScan} aria-busy={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]">
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Searching…</>)
                : !tokensAvailable && meta.was_free ? (<><Sparkles className="w-4 h-4" aria-hidden="true" /> Top up to scan</>)
                : (<><Sparkles className="w-4 h-4" aria-hidden="true" /> {meta.was_free === false ? 'Run scan (1 token)' : 'Run scan (free)'}</>)}
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {loading && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            role="status" aria-live="polite" className={`${glassCard} rounded-2xl p-6 mb-5`}>
            <div className="space-y-2">
              {LOADING_STAGES.map((s, i) => (
                <div key={s} className={`flex items-center gap-2 text-sm transition-opacity ${i <= loadingStage ? 'opacity-100' : 'opacity-30'}`}>
                  {i < loadingStage ? <span className="text-emerald-400">✓</span>
                    : i === loadingStage ? <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" aria-hidden="true" />
                    : <span className="text-white/30">•</span>}
                  <span className={i <= loadingStage ? 'text-white/90' : 'text-white/40'}>{s}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {error && !loading && (
        <div role="alert" className="mb-5 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p>{error}</p>
            {needsTopUp && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Link to="/pricing" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition min-h-[36px]">
                  Top up tokens →
                </Link>
                {typeof hoursToFreeReset === 'number' && hoursToFreeReset > 0 && (
                  <span className="text-xs text-rose-200/80">…or your free daily scan resets in {hoursToFreeReset}h.</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {meta.sourceReport && meta.sourceReport.adzuna?.state === 'not-configured' && (
        <div className="mb-5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p>Multi-country search (Adzuna) is not configured. Showing global remote results only.</p>
        </div>
      )}

      {(() => {
        if (!meta.sourceReport) return null;
        const erroredSources = Object.entries(meta.sourceReport)
          .filter(([, r]) => r?.state === 'errored')
          .map(([name]) => SOURCE_DISPLAY_NAMES[name] ?? name);
        if (erroredSources.length === 0) return null;
        const list = erroredSources.length === 1
          ? erroredSources[0]
          : `${erroredSources.slice(0, -1).join(', ')} and ${erroredSources[erroredSources.length - 1]}`;
        return (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p>{list} {erroredSources.length === 1 ? 'had an error' : 'had errors'} fetching results. You may see fewer matches than usual — try again in a minute.</p>
          </div>
        );
      })()}

      {visibleResults && !loading && (
        <section aria-label="Search results">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 text-xs">
            <p className="text-white/50">
              {meta.fetched ?? 0} fetched · {meta.deduped ?? 0} deduplicated · top {visibleResults.length} curated
              {hiddenGhostCount > 0 && <> · <button type="button" onClick={() => setHideGhost(false)} className="underline hover:text-amber-300">{hiddenGhostCount} ghost hidden</button></>}
              {trackerEntries.length > 0 && (
                <>
                  {' · '}
                  {embedded ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Smooth-scroll to the ApplicationTracker section already
                        // mounted further down on the Dashboard page.
                        const el = document.getElementById('application-tracker');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="underline text-violet-300 hover:text-violet-200"
                      aria-label={`View your ${trackerEntries.length} saved application${trackerEntries.length === 1 ? '' : 's'} in the tracker`}
                    >
                      {trackerEntries.length} saved →
                    </button>
                  ) : (
                    <Link
                      to="/dashboard#application-tracker"
                      className="underline text-violet-300 hover:text-violet-200"
                      aria-label={`View your ${trackerEntries.length} saved application${trackerEntries.length === 1 ? '' : 's'} in the tracker`}
                    >
                      {trackerEntries.length} saved →
                    </Link>
                  )}
                </>
              )}
            </p>
            <p className="text-white/50">
              {meta.was_free ? <span className="text-emerald-400 font-semibold">Free scan used</span> : <span>1 token spent · {meta.tokenBalance ?? 0} left</span>}
              {(() => {
                const next = formatNextFree(meta.nextFreeAt);
                if (!next) return null;
                return (
                  <span className="text-white/40">
                    {' · '}Next free scan {next === 'now' ? 'available now' : `in ${next}`}
                  </span>
                );
              })()}
            </p>
          </div>
          {visibleResults.length === 0 ? (
            <div className={`${glassCard} rounded-2xl p-8 text-center`}>
              <p className="text-white/70">No matches. Try relaxing keywords or unchecking the ghost filter.</p>
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
                    <motion.li key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: idx * 0.04 }} className={`${glassCard} rounded-2xl overflow-hidden`}>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                          <div role="meter" aria-label={`Match score ${job.matchScore} out of 100`}
                            aria-valuenow={job.matchScore} aria-valuemin={0} aria-valuemax={100}
                            title={`AI match score — your CV summary weighed against the role's title, requirements, salary, and posting freshness. ${job.matchScore} of 100.`}
                            className={`flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold ${scoreColor(job.matchScore)}`}>
                            {job.matchScore}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline flex-wrap gap-x-2">
                              <h3 className="text-lg font-bold text-white truncate" title={job.title}>{job.title}</h3>
                              <span className="text-sm text-white/70">at {job.company}</span>
                            </div>
                            <p className="text-xs text-white/50 mt-0.5">
                              {job.location}
                              {(job.salaryMin || job.salaryMax || job.salaryEstimate) && (
                                <> · {job.salaryMin || job.salaryMax
                                    ? `${job.salaryMin ?? '?'}-${job.salaryMax ?? '?'} ${job.salaryCurrency || ''}`.trim()
                                    : <span className="text-violet-300">{job.salaryEstimate}</span>}</>
                              )}
                              {job.postedAt && <> · {new Date(job.postedAt).toLocaleDateString()}</>}
                              {' · '}<span className="text-white/40">{job.source}</span>
                            </p>
                            <p className="text-sm mt-2 text-white/80">{job.fitOneLiner}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          <button type="button" onClick={() => setExpandedId(isExpanded ? null : job.id)}
                            aria-expanded={isExpanded} aria-controls={`job-body-${job.id}`}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {isExpanded ? 'Less' : 'More'}
                          </button>
                          <button type="button" onClick={() => saveJobToTracker(job)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px] border ${
                              isSaved
                                ? 'bg-emerald-500/25 text-emerald-100 border-emerald-500/60 hover:bg-rose-500/25 hover:text-rose-100 hover:border-rose-500/60'
                                : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/15'
                            }`}
                            aria-label={isSaved ? `Saved — click to remove ${job.company} ${job.title} from tracker` : `Save ${job.company} ${job.title} to tracker`}>
                            <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                            {isSaved ? 'Saved ✓' : 'Save to tracker'}
                          </button>
                          <button type="button" onClick={() => applyViaVantage(job)} disabled={!href}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]">
                            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Apply via Vantage
                          </button>
                          {href && (
                            <a href={href} target="_blank" rel="noopener noreferrer nofollow"
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-xs font-semibold text-white/60 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]">
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Original
                            </a>
                          )}
                          {(ghostHigh || ghostMid) && (
                            <span role="img" aria-label={`${ghostHigh ? 'Likely ghost job' : 'Possible ghost job'}, ${job.ghostProbability}% probability`}
                              title={`Ghost-job probability ${job.ghostProbability}% — based on posting age, vague requirements, no salary disclosure, and reposting patterns. ${ghostHigh ? 'High risk of no real role behind this listing.' : 'Apply with awareness; less confidence than green-flagged listings.'}`}
                              className={`ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
                                ghostHigh ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              }`}>
                              <Ghost className="w-3 h-3" aria-hidden="true" /> {ghostHigh ? 'Likely ghost' : `${job.ghostProbability}% ghost`}
                            </span>
                          )}
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div id={`job-body-${job.id}`} initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/10">
                            <div className="p-4 sm:p-5 space-y-4">
                              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                                <div className="flex items-center gap-2"><Target className="w-4 h-4 text-violet-400" aria-hidden="true" /><span className="text-white/70">ATS pass: <strong className="text-white">{job.atsPassLikelihood}</strong></span></div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-violet-400" aria-hidden="true" /><span className="text-white/70">{job.timeToApply}</span></div>
                                <div className="flex items-center gap-2"><Ghost className="w-4 h-4 text-violet-400" aria-hidden="true" /><span className="text-white/70">Ghost: <strong className="text-white">{job.ghostProbability}%</strong></span></div>
                              </div>
                              {job.skillMatches.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5">Skill matches</p>
                                  <div className="flex flex-wrap gap-1.5">{job.skillMatches.map((s, i) => (<span key={i} className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">{s}</span>))}</div>
                                </div>
                              )}
                              {job.skillGaps.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5">Skill gaps</p>
                                  <div className="flex flex-wrap gap-1.5">{job.skillGaps.map((s, i) => (<span key={i} className="px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30">{s}</span>))}</div>
                                </div>
                              )}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5">Description (excerpt)</p>
                                <p className="text-sm text-white/70 whitespace-pre-wrap line-clamp-6">{job.description}</p>
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

      {!loading && !results && !error && !embedded && (
        <div className={`${glassCard} rounded-2xl p-8 text-center`}>
          <Filter className="w-8 h-8 text-violet-400 mx-auto mb-3" aria-hidden="true" />
          <p className="text-white/70">Set your filters and tap <strong className="text-white">Run scan</strong>. Your first scan today is free.</p>
        </div>
      )}
    </div>
  );
}
