import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Link as LinkIcon, FileText, Loader2, Sparkles, ChevronRight,
  LogOut, CreditCard, Zap, Crown, Star, Settings, Check,
  Mic, BookOpen, Lock, RefreshCw, ClipboardPaste, Type,
  Twitter, Linkedin, Copy, AlertTriangle, Mail, DollarSign, Download, Briefcase,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '../App';
import { useCurrency } from '../contexts/CurrencyContext';
import { supabase, getCreditsRemaining, hasCredits } from '../lib/supabase';
import { analyzeJob, createStripeCheckout, syncSubscription, rewriteTone, fetchAnalysisHistory, uploadCvSummary } from '../services/api';
import { sweepDraftsForUser } from '../lib/useFormDraft';
import { sweepHistoryForUser } from '../lib/useResultHistory';
import { sweepTrackerForUser, useApplicationTracker } from '../lib/useApplicationTracker';
import { buildAnalysisMarkdown, downloadMarkdown } from '../lib/exportMarkdown';
import AIInterviewSession from './AIInterviewSession';
import AtsScannerSection from './AtsScannerSection';
import { useFocusTrap } from '../lib/useFocusTrap';
// Lazy-loaded — only fires for first-time dashboard visitors via the demo
// popup. ~10KB+ of motion sequences shouldn't be in the critical chunk.
const LiveDemoReel = React.lazy(() => import('./LiveDemoReel'));
// Lazy-loaded follow-up composer — modal opens only when user clicks the
// "Generate follow-up email" button on the results section. Its form +
// validation logic don't touch the initial Dashboard bundle.
const FollowupComposer = React.lazy(() => import('./FollowupComposer'));
const NegotiationComposer = React.lazy(() => import('./NegotiationComposer'));
const ApplicationTracker = React.lazy(() => import('./ApplicationTracker'));
const JobSearchSection = React.lazy(() => import('./JobSearchSection'));
const DashboardSideNav = React.lazy(() => import('./DashboardSideNav'));

/**
 * ProcessingStages — animated pipeline indicator shown during the 60-90s
 * analysis run. Stages cycle on a time-based schedule that approximates the
 * real backend pipeline (we don't stream true progress events from the API,
 * so this is a UX guide, not a precise progress bar — clearly labeled as such).
 *
 * Total cycle = 90s. The last stage stays "active" until the parent unmounts
 * the processing screen (i.e. results land OR an error fires).
 */
function ProcessingStages() {
  const STAGES = [
    { label: 'Reading your CV', detail: 'Parsing achievements, scope, and proof points.' },
    { label: 'Researching the company', detail: 'Mission, recent news, culture signals, hiring posture.' },
    { label: 'Mapping CV ↔ role', detail: 'Where you match, where the gaps are, what to flag.' },
    { label: 'Drafting your cover letter', detail: 'Three paragraphs, evidence-backed, peer-to-peer tone.' },
    { label: 'Generating mock interview questions', detail: 'Behavioural, technical, situational, motivational mix.' },
    { label: 'Composing your 5-minute pitch', detail: 'Speaker-ready slides for the opening of the interview.' },
  ];
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const intervals: number[] = [];
    // Stages 1-5 fire on a rough 12s cadence; stage 5 (last) sticks.
    for (let i = 1; i < STAGES.length; i++) {
      const id = window.setTimeout(() => setActive(i), i * 12000);
      intervals.push(id);
    }
    return () => intervals.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ol className="space-y-3 text-left">
      {STAGES.map((s, i) => {
        const done = i < active;
        const current = i === active;
        const upcoming = i > active;
        return (
          <li
            key={s.label}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              current ? 'bg-violet-500/10 border-violet-500/30' :
              done ? 'bg-emerald-500/5 border-emerald-500/20' :
              'bg-white/[0.02] border-white/5'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                current ? 'bg-violet-500' :
                done ? 'bg-emerald-500' :
                'bg-white/10'
              }`}
            >
              {done && <Check className="w-3.5 h-3.5 text-white" />}
              {current && <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />}
              {upcoming && <span className="w-1.5 h-1.5 rounded-full bg-white/30" />}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${current ? 'text-white' : done ? 'text-emerald-300' : 'text-white/50'}`}>
                {s.label}
              </p>
              <p className={`text-xs leading-relaxed ${current ? 'text-white/70' : done ? 'text-emerald-300/60' : 'text-white/55'}`}>
                {s.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function AnalysisHistory({ onLoad }: { onLoad: (data: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysisHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch(`/api/analyses?id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const { analysis } = await res.json();
        if (analysis?.results_json) onLoad(analysis.results_json);
      }
    } catch { /* ignore */ }
    finally { setLoadingId(null); }
  };

  if (loading) return null;
  if (history.length === 0) return null;

  return (
    <div id="past-analyses" className="mt-8 scroll-mt-20">
      <h3 className="text-lg font-display font-bold text-white mb-3">Past Analyses</h3>
      <div className="space-y-2">
        {history.slice(0, 10).map((a: any) => (
          <button
            key={a.id}
            onClick={() => handleLoad(a.id)}
            disabled={loadingId !== null}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left disabled:opacity-50"
          >
            <div className="min-w-0 flex-1">
              <span className="text-white text-sm font-medium truncate block">{a.company_name || 'Unknown Company'}</span>
              <span className="text-white/55 text-xs">
                {new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex-shrink-0 ml-3">
              {loadingId === a.id ? (
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/55" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const PLANS = [
  { name: 'Starter', gbp: 5, usd: 5, tokens: 20, color: '#6B6B8D', icon: Zap, isTopup: true, features: ['20 tokens (one-time)', 'Strategic Brief', 'Cover Letter', 'Interview Pack'] },
  { name: 'Pro', gbp: 12, usd: 15, tokens: 60, color: '#4F46E5', icon: Star, isTopup: false, features: ['60 tokens/month', 'AI Mock Interview', 'STAR Stories', 'Everything in Starter'] },
  { name: 'Premium', gbp: 20, usd: 25, tokens: 120, color: '#7C3AED', icon: Crown, isTopup: false, features: ['120 tokens/month', 'CV Fit Score', 'Presentation Deck', 'Priority', 'Everything in Pro'] },
];

export default function Dashboard() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  // Tracker hook so the analyzer can offer 'Save to tracker' on the
  // results page — closes the loop between "I analysed this role"
  // and "now I want to follow up". Without this, users had to scroll
  // up, find the same job in search results, click Save, then come
  // back — major flow break.
  const { entries: trackerEntriesForAnalyzer, add: addAnalysisToTracker } = useApplicationTracker({ userScope: user?.id });
  const [analysisTrackerToast, setAnalysisTrackerToast] = useState<null | { mode: 'saved' | 'error' | 'duplicate'; company: string; role: string }>(null);
  useEffect(() => {
    if (!analysisTrackerToast) return;
    const t = setTimeout(() => setAnalysisTrackerToast(null), 5000);
    return () => clearTimeout(t);
  }, [analysisTrackerToast]);
  const { currency, symbol } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutCancelled, setCheckoutCancelled] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  // True while the post-checkout poll is running. Drives a 'Syncing…'
  // indicator on the token chip so the user doesn't think the purchase
  // failed when the chip briefly shows the pre-purchase balance.
  const [tokenSyncing, setTokenSyncing] = useState(false);
  // First-login demo popup. Shows the 22s LiveDemoReel as a modal once,
  // for first-time users only (localStorage flag), to teach them what
  // the dashboard does before they stare at empty upload zones. Skipped
  // if they've already run an analysis (history.length > 0) or already
  // dismissed (vantage-demo-shown). Per LLM-council a11y standard:
  // ESC + click-outside + role=dialog + body-scroll lock + close button.
  const [showDemoPopup, setShowDemoPopup] = useState(false);

  // Sync subscription state from Stripe on every mount, then refresh profile
  useEffect(() => {
    if (user && !profile) {
      refreshProfile();
    }
    if (user && profile?.stripe_subscription_id) {
      syncSubscription().then(() => refreshProfile()).catch(() => {});
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // First-login demo popup — fires once per browser. Skipped if user has
  // dismissed it before, or if URL has ?success=true/cancelled=true (don't
  // stack a popup on top of a Stripe-return banner).
  useEffect(() => {
    if (!user) return;
    const seen = typeof localStorage !== 'undefined'
      ? localStorage.getItem('vantage-demo-popup-seen')
      : null;
    const hasReturnFlag =
      searchParams.get('success') === 'true' ||
      searchParams.get('cancelled') === 'true' ||
      searchParams.get('canceled') === 'true' ||
      searchParams.get('checkout_error') === 'true';
    if (!seen && !hasReturnFlag) {
      // Slight delay so the dashboard paints first; popup is supplementary
      // not blocking. Mirror the Suspense fallback latency.
      const t = setTimeout(() => setShowDemoPopup(true), 800);
      return () => clearTimeout(t);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismissDemoPopup = () => {
    setShowDemoPopup(false);
    try {
      localStorage.setItem('vantage-demo-popup-seen', '1');
    } catch { /* private mode — fine, popup re-shows once on next session */ }
  };

  // Focus trap on the demo popup — keyboard users get tab-cycled inside
  // the dialog (close button + Got-it + See-sample). Restores previously-
  // focused element on dismiss.
  const demoDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(showDemoPopup, demoDialogRef);

  // ESC + body-scroll lock for demo popup (matches modal-a11y pattern
  // from commit 4dad92d). Body scroll restored on dismiss.
  useEffect(() => {
    if (!showDemoPopup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissDemoPopup();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showDemoPopup]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle post-checkout return — sync from Stripe then refresh profile.
  // Both ?success=true and ?cancelled=true are set by api/stripe/[action].ts
  // as Stripe Checkout success_url / cancel_url targets.
  //
  // Sync strategy: poll with backoff instead of a single 2s wait. Stripe
  // webhook latency varies wildly (50ms in dev, up to 30s in some prod
  // failure cases). The poll watches profile.token_balance — when it
  // exceeds the pre-purchase snapshot, the new tokens have landed and we
  // stop. Bounded to 8 attempts over ~20s total; if we run out the user
  // still sees a successful banner (their tokens WILL land via the
  // webhook even if we miss it).
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setCheckoutSuccess(true);
      setSearchParams({}, { replace: true });
      const preBalance = typeof profile?.token_balance === 'number' ? profile.token_balance : 0;
      let cancelled = false;
      setTokenSyncing(true);
      const attempt = async (delayMs: number, remaining: number) => {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, delayMs));
        if (cancelled) return;
        try { await syncSubscription(); } catch { /* webhook may already have run */ }
        if (cancelled) return;
        const fresh = await refreshProfile();
        const newBalance = typeof fresh?.token_balance === 'number' ? fresh.token_balance : preBalance;
        if (newBalance > preBalance || remaining <= 0) {
          if (!cancelled) setTokenSyncing(false);
          return;
        }
        // Backoff: 500ms, 1s, 2s, 3s, 4s, 5s, ~5s (sum ~20s total)
        const nextDelay = Math.min(5000, delayMs * 1.6 + 200);
        attempt(nextDelay, remaining - 1);
      };
      attempt(500, 7);
      return () => { cancelled = true; setTokenSyncing(false); };
    }
    if (searchParams.get('cancelled') === 'true' || searchParams.get('canceled') === 'true') {
      setCheckoutCancelled(true);
      setSearchParams({}, { replace: true });
    }
    if (searchParams.get('checkout_error') === 'true') {
      setCheckoutError(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  // PWA file_handler handoff: when /open-cv was used as the entry point
  // (user did "Open with Vantage" on a CV file from their OS), the
  // PwaOpenCv component reads the file via launchQueue, base64-encodes
  // it, and stores it in sessionStorage. We re-hydrate that into a real
  // File object here so the rest of the dashboard logic (which expects
  // a File) is unchanged. Cleared on read so revisits don't keep
  // pre-loading stale state.
  const [cvFile, setCvFile] = useState<File | null>(() => {
    try {
      const raw = sessionStorage.getItem('vantage:pendingCv');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { name?: string; mime?: string; b64?: string };
      sessionStorage.removeItem('vantage:pendingCv');
      if (!parsed.b64 || !parsed.name) return null;
      const binary = atob(parsed.b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new File([bytes], parsed.name, { type: parsed.mime || 'application/octet-stream' });
    } catch { /* bad payload — skip the prefill */ }
    return null;
  });
  // Bookmarklet handoff: if the user installed the bookmark and clicked it on
  // a job page, App.tsx stored the URL in sessionStorage. Pre-fill it once,
  // then clear so we don't keep re-using stale state on revisit.
  const [jobUrl, setJobUrl] = useState(() => {
    // Strict scheme guard via new URL() instead of regex.
    const isHttpsOrHttp = (raw: string): boolean => {
      try {
        const u = new URL(raw);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch { return false; }
    };
    try {
      // Job-search handoff: /jobs sends users here via ?prefillUrl=…
      const qs = new URLSearchParams(window.location.search);
      const fromQuery = qs.get('prefillUrl');
      if (fromQuery && isHttpsOrHttp(fromQuery)) return fromQuery;
      const pending = sessionStorage.getItem('vantage:pendingJob');
      if (pending && isHttpsOrHttp(pending)) {
        sessionStorage.removeItem('vantage:pendingJob');
        return pending;
      }
    } catch { /* ignore */ }
    return '';
  });
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [jobDescText, setJobDescText] = useState('');
  // Roast handoff (GOLDEN GOSPEL Tactic 3 — 2026-05-08): if the user came in
  // through /roast and clicked "Continue with this letter", RoastPage stored
  // the letter + verdict in sessionStorage before navigating to /register.
  // Once they're authenticated and land here, surface a banner that nudges
  // them to upload their CV + paste a job URL so we can rewrite the letter
  // against the actual application. Cleared on first read to avoid surfacing
  // again on dashboard revisit.
  const [pendingRoast, setPendingRoast] = useState<{
    coverLetter: string;
    roast: string;
    severityScore: number;
    capturedAt: number;
  } | null>(() => {
    try {
      const raw = sessionStorage.getItem('vantage:pendingRoast');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      sessionStorage.removeItem('vantage:pendingRoast');
      // Validate shape — typeof guards before we trust this in render.
      if (
        parsed &&
        typeof parsed.coverLetter === 'string' &&
        typeof parsed.roast === 'string' &&
        typeof parsed.severityScore === 'number'
      ) {
        return parsed;
      }
    } catch { /* ignore — bad JSON, just skip the handoff */ }
    return null;
  });
  // Default to 'text' (paste) — paste-from-clipboard is the fastest way to get
  // a JD into the form. File mode is still available via the toggle. Was 'file'
  // before — switched after observing real users hesitate at the file-picker
  // because they don't have JDs as files; they have them as web-page text.
  const [jdMode, setJdMode] = useState<'file' | 'text'>('text');
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  // Cover letter tone
  const [activeTone, setActiveTone] = useState<string>('original');
  const [toneLoading, setToneLoading] = useState(false);
  const [displayLetter, setDisplayLetter] = useState<string>('');
  const toneCache = useRef<Record<string, string>>({});

  // Interview
  const [showInterview, setShowInterview] = useState(false);
  const [showPrepCards, setShowPrepCards] = useState(false);
  // Follow-up email composer (post-analysis tool, added 2026-05-11). Lazy-
  // loaded so the modal + its form code don't bloat the initial Dashboard
  // bundle until the user actually wants to compose a follow-up.
  const [showFollowup, setShowFollowup] = useState(false);
  // AI Job Search — expandable inline section inside Dashboard.
  // User feedback 2026-05-11: should be a dropdown/option WITHIN
  // Dashboard, not a separate page. Standalone /jobs route still
  // exists for deep-link/SEO but the primary surface is here.
  // Collapsed/expanded state persists per-user across reloads so
  // someone who likes it open doesn't have to click 'Find new jobs'
  // every visit.
  const [showJobSearch, setShowJobSearch] = useState<boolean>(false);
  // Re-read the persisted preference once the user has loaded. We can't
  // do this in the lazy initializer because `user` may still be null on
  // first render — auth loads asynchronously. Two ref gates:
  //   * skipPersistRef stops the save effect from immediately wiping
  //     the value the load effect just wrote.
  //   * hasUserToggledRef stops the load effect from overwriting a
  //     user's click that happens before auth loads (rare race flagged
  //     by council review — user toggles button between mount and
  //     user.id arrival; without this, their click would be clobbered).
  const skipPersistRef = useRef(true);
  const hasUserToggledRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !user?.id) return;
    if (hasUserToggledRef.current) return; // user already chose — don't overwrite
    try {
      const key = `vantage-jobsearch-open:${user.id}`;
      const stored = window.localStorage.getItem(key) === '1';
      skipPersistRef.current = true;
      setShowJobSearch(stored);
    } catch {
      // localStorage unavailable — leave default state.
    }
  }, [user?.id]);
  // Persist on user-driven change. user-scoped so different accounts on a
  // shared device keep their own preference. Skip the first run after a
  // user-load so we don't clobber the just-loaded value.
  useEffect(() => {
    if (typeof window === 'undefined' || !user?.id) return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    try {
      const key = `vantage-jobsearch-open:${user.id}`;
      if (showJobSearch) {
        window.localStorage.setItem(key, '1');
      } else {
        window.localStorage.removeItem(key);
      }
    } catch {
      // localStorage may be unavailable (private mode, quota, blocked) —
      // just skip persistence; in-session state still works.
    }
  }, [showJobSearch, user?.id]);
  // AI Job Search handoff banner.
  const location = useLocation();
  // Hash-fragment scroller. React Router v6 doesn't auto-scroll to
  // anchors on hash navigation — when something links to e.g.
  // /dashboard#application-tracker we manually locate the element and
  // smooth-scroll it into view. retries-with-RAF guards against the
  // element being lazy-mounted (Suspense) — by the time the second
  // animation frame fires the lazy chunk is usually resolved.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let frame = 0;
    let raf1 = 0;
    let raf2 = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      frame += 1;
      if (frame < 30) {
        raf2 = window.requestAnimationFrame(tryScroll);
      }
    };
    raf1 = window.requestAnimationFrame(tryScroll);
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [location.hash]);
  // prefilledFromJobSearch + showPrefillBanner are state (not derived) because
  // the user can navigate to /dashboard via 'Apply via Vantage' WHILE the
  // Dashboard is already mounted (embedded Job Search case). useState
  // initialisers don't re-run on subsequent renders, so we need a useEffect
  // (below) to watch location.state changes and update both the banner state
  // AND the jobUrl prefill. This was the root cause of the 'Apply via Vantage
  // does nothing' bug reported 2026-05-12.
  const [prefilledFromJobSearch, setPrefilledFromJobSearch] = useState<
    { title: string; company: string } | undefined
  >((location.state as any)?.prefilledFromJobSearch);
  const [showPrefillBanner, setShowPrefillBanner] = useState(
    !!(location.state as any)?.prefilledFromJobSearch
  );

  // CV-upload state for the auto-extract → save flow. When the user
  // drops a CV file, we client-extract text (PDF / DOCX / TXT) and POST
  // it to /api/user?endpoint=cv-upload immediately. No token spend.
  // Resolves user complaint 2026-05-12: 'forces user to waste a token
  // first before being able to use the tool with the job search'.
  type CvUploadStage = 'idle' | 'extracting' | 'saving' | 'done' | 'error' | 'unsupported';
  const [cvUploadStage, setCvUploadStage] = useState<CvUploadStage>(() => (profile?.cv_summary ? 'done' : 'idle'));
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const cvUploadFileRef = useRef<File | null>(null);

  // Keep stage in sync with profile.cv_summary — if a refresh comes in
  // and reveals existing cv_summary, mark done.
  useEffect(() => {
    if (profile?.cv_summary && cvUploadStage === 'idle') {
      setCvUploadStage('done');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.cv_summary]);

  // Watch cvFile + auto-extract + save. Throttled: each new file replaces
  // the in-flight job via cvUploadFileRef. PDF / DOCX / TXT supported
  // (same matrix as AtsScannerSection).
  useEffect(() => {
    if (!cvFile) return;
    cvUploadFileRef.current = cvFile;
    let cancelled = false;
    setCvUploadStage('extracting');
    setCvUploadError(null);

    (async () => {
      try {
        const fileName = cvFile.name.toLowerCase();
        let text = '';
        if (fileName.endsWith('.docx') || cvFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const mammoth = await import('mammoth');
          const buffer = await cvFile.arrayBuffer();
          const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
          text = value || '';
        } else if (fileName.endsWith('.pdf') || cvFile.type === 'application/pdf') {
          const pdfjs = await import('pdfjs-dist');
          const pdfWorkerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
          (pdfjs as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
          const buffer = await cvFile.arrayBuffer();
          const doc = await (pdfjs as any).getDocument({ data: buffer }).promise;
          const pageTexts: string[] = [];
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            pageTexts.push(content.items.map((it: any) => it.str || '').join(' '));
          }
          text = pageTexts.join('\n');
        } else if (fileName.endsWith('.txt') || cvFile.type === 'text/plain') {
          text = await cvFile.text();
        } else {
          if (!cancelled && cvUploadFileRef.current === cvFile) {
            setCvUploadStage('unsupported');
            setCvUploadError('Unsupported format. Use PDF, DOCX, or TXT.');
          }
          return;
        }

        if (cancelled || cvUploadFileRef.current !== cvFile) return;
        if (text.trim().length < 60) {
          setCvUploadStage('error');
          setCvUploadError('CV is too short or unreadable.');
          return;
        }

        setCvUploadStage('saving');
        const result = await uploadCvSummary(text);
        if (cancelled || cvUploadFileRef.current !== cvFile) return;
        if (!result.success) {
          setCvUploadStage('error');
          setCvUploadError(result.error || 'Could not save CV summary.');
          return;
        }
        // Pull fresh profile so cv_summary lands in client state — flips
        // Job Search's amber banner to green confirmation automatically.
        await refreshProfile();
        if (!cancelled) setCvUploadStage('done');
      } catch (err: any) {
        if (!cancelled) {
          setCvUploadStage('error');
          setCvUploadError(err?.message || 'CV extraction failed.');
        }
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvFile]);

  // Watch the URL + router state for incoming 'Apply via Vantage' handoffs.
  // Fires whenever location.search or location.state changes (e.g. user clicks
  // a job's Apply button while already on /dashboard with the embedded Job
  // Search expanded). Guards against double-fire by checking if jobUrl already
  // matches the incoming value. Clears the query param + state after consuming
  // so a page refresh doesn't re-trigger.
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const fromQuery = qs.get('prefillUrl');
    const fromState = (location.state as any)?.prefilledFromJobSearch as
      | { title: string; company: string } | undefined;
    // JD text passed alongside Apply-via-Vantage so we don't have to
    // re-scrape (Adzuna/LinkedIn/Indeed block our scraper). The JD was
    // already fetched + paid for during the scan; reusing it here means
    // the user's prep-pack analysis 'just works' without a scrape failure.
    const fromStateJD = (location.state as any)?.prefilledJobDescription as string | undefined;
    const isHttpsOrHttp = (raw: string | null): boolean => {
      if (!raw) return false;
      try {
        const u = new URL(raw);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch { return false; }
    };

    if (fromQuery && isHttpsOrHttp(fromQuery) && fromQuery !== jobUrl) {
      setJobUrl(fromQuery);
      // Smooth-scroll the analysis form into view so users see what happened.
      window.requestAnimationFrame(() => {
        const el = document.querySelector('[data-analysis-form]');
        if (el && 'scrollIntoView' in el) {
          (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
    if (typeof fromStateJD === 'string' && fromStateJD.trim().length > 0 && fromStateJD !== jobDescText) {
      setJobDescText(fromStateJD.slice(0, 50000));
    }
    if (fromState && (!prefilledFromJobSearch ||
        prefilledFromJobSearch.title !== fromState.title ||
        prefilledFromJobSearch.company !== fromState.company)) {
      setPrefilledFromJobSearch(fromState);
      setShowPrefillBanner(true);
    }

    // Consume: strip ?prefillUrl from URL and clear router state so refresh
    // doesn't re-trigger the prefill.
    if ((fromQuery && isHttpsOrHttp(fromQuery)) || fromState) {
      const cleanedSearch = (() => {
        const next = new URLSearchParams(location.search);
        next.delete('prefillUrl');
        const s = next.toString();
        return s ? `?${s}` : '';
      })();
      navigate(`/dashboard${cleanedSearch}${location.hash}`, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.state]);
  // Salary negotiation brief composer (post-analysis tool, added 2026-05-11).
  // 2 tokens. Returns email + phone script + talking points + warnings.
  // Lazy-loaded so its bundle only arrives if the user opens the modal.
  const [showNegotiation, setShowNegotiation] = useState(false);

  const creditsRemaining = profile ? getCreditsRemaining(profile) : 0;
  // BUG FIX 2026-05-13: was hasCredits(profile, 3) — a hangover from the
  // pre-2026-05-08 pricing era when analysis cost 3 tokens. The backend
  // dropped to 1 token per analysis but this frontend gate stayed at 3,
  // so users with 1-2 tokens saw the Run-my-prep-pack button disabled
  // even though they had enough to run an analysis. Now matches the
  // backend's COST_PER_ANALYSIS=1.
  const canAnalyze = hasCredits(profile, 1);
  const isPro = profile?.plan === 'pro' || profile?.plan === 'premium';

  const handleStart = async () => {
    if (!cvFile) { setError('Please upload your CV'); return; }
    if (!jobUrl) { setError('Please add a job URL'); return; }
    if (cvFile.size > 5 * 1024 * 1024) { setError('CV file is too large (max 5MB)'); return; }
    if (!canAnalyze) {
      const tokens = profile?.token_balance ?? 0;
      setError(`You have 0 tokens. Each analysis costs 1. Top up below — £5 for 20 more prep packs (never expires).`);
      return;
    }

    // Pre-flight check: warn if user is about to spend a token on a job URL
    // that is likely to come back thin. Two cases:
    //
    //   1. Known-blocked sites (Indeed, LinkedIn, etc.) with no JD pasted →
    //      hard warning ("this URL almost certainly fails"). Pre-existing.
    //
    //   2. Any other host with no JD pasted → soft warning ("having the JD
    //      gives a much better analysis. Continue without it?"). Added
    //      2026-05-08 per dashboard-ux-plan-2026-05-06 Tier 2 / C5 — the
    //      original "Required" label was scaring people without a JD on
    //      hand into closing the tab. Soft warn at submit-time educates
    //      without blocking the happy path.
    //
    // If the JD is provided in either mode, this whole block is a no-op.
    try {
      const host = new URL(jobUrl).hostname.toLowerCase().replace(/^www\./, '');
      const blocked = ['indeed.com', 'indeed.co.uk', 'linkedin.com', 'reed.co.uk', 'glassdoor.com', 'glassdoor.co.uk', 'totaljobs.com', 'cwjobs.co.uk', 'monster.com'];
      const isBlockedHost = blocked.some((d) => host === d || host.endsWith('.' + d));
      const hasJdProvided = (jdMode === 'file' && !!jobDescFile) ||
                            (jdMode === 'text' && jobDescText.trim().length > 50);
      if (!hasJdProvided) {
        // Stronger copy for blocked hosts (the JD is essential there); softer
        // copy for everyone else (the analysis often works fine, but the
        // tailoring quality is meaningfully better with a JD).
        const message = isBlockedHost
          ? `${host} typically blocks automated readers, so the job page may come back empty.\n\n` +
            `Without the job description pasted in Step 2, the AI will only have the URL to work from — your analysis will likely be thin and your token will still be charged.\n\n` +
            `Do you want to:\n` +
            `  • Cancel this run and paste the JD into Step 2 first (recommended)\n` +
            `  • Or continue anyway?\n\n` +
            `OK = continue · Cancel = stop and add the JD first`
          : `Heads up: you haven't pasted the job description in Step 2.\n\n` +
            `The AI will fetch ${host} and read what it can from the page, which usually works — but the prep pack is meaningfully better when the JD is pasted directly.\n\n` +
            `OK = continue with URL only · Cancel = paste the JD first`;
        const proceed = window.confirm(message);
        if (!proceed) return;
      }
    } catch { /* invalid URL — let the regular flow handle it */ }

    setError('');
    setStep('processing');

    try {
      // Smart file extraction: PDF → base64 (Gemini parses natively), DOCX → mammoth, TXT → raw text
      const fileName = cvFile.name.toLowerCase();
      let cvTextContent: string | undefined;
      let cvBase64: string | undefined;
      let cvMimeType: string | undefined;

      if (fileName.endsWith('.pdf') || cvFile.type === 'application/pdf') {
        const buffer = await cvFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        cvBase64 = btoa(binary);
        cvMimeType = 'application/pdf';
      } else if (fileName.endsWith('.docx') || cvFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const buffer = await cvFile.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
        cvTextContent = value;
      } else {
        cvTextContent = await cvFile.text();
      }

      let jdText: string | undefined;
      if (jdMode === 'file' && jobDescFile) {
        const jdName = jobDescFile.name.toLowerCase();
        if (jdName.endsWith('.docx') || jobDescFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const mammoth = await import('mammoth');
          const buffer = await jobDescFile.arrayBuffer();
          const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
          jdText = value;
        } else {
          jdText = await jobDescFile.text();
        }
      } else if (jdMode === 'text' && jobDescText.trim()) {
        jdText = jobDescText.trim();
      }

      const result = await analyzeJob(
        {
          cvText: cvTextContent,
          cvBase64,
          cvMimeType,
          jobUrl,
          jobDescText: jdText,
          includeFitScore: true,
        },
        (msg) => console.log(msg)
      );

      if (result.success) {
        setResults(result.data);
        setStep('results');
        refreshProfile();
      } else {
        setError(result.error || 'Analysis failed');
        setStep('input');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStep('input');
    }
  };

  const handleSignOut = async () => {
    // Sweep this user's drafts + result history + tracker from
    // localStorage BEFORE the auth context clears, so we still have
    // the user.id. Critical for shared-device privacy.
    const userId = user?.id;
    sweepDraftsForUser(userId);
    sweepHistoryForUser(userId);
    sweepTrackerForUser(userId);
    await signOut();
    navigate('/');
  };

  const handleToneSwitch = async (tone: string) => {
    if (tone === 'original') {
      setActiveTone('original');
      setDisplayLetter(results?.coverLetter || '');
      return;
    }
    if (toneCache.current[tone]) {
      setActiveTone(tone);
      setDisplayLetter(toneCache.current[tone]);
      return;
    }
    if (!hasCredits(profile, 1)) {
      setError('Tone rewrites cost 1 token, and your balance is 0. Top up at £5 for 20 more.');
      return;
    }
    setToneLoading(true);
    try {
      const roleContext = results?.companySnapshot?.name
        ? `${results.companySnapshot.name} — ${results.keyRequirements?.join(', ') || ''}`
        : '';
      const result = await rewriteTone(results.coverLetter, tone, roleContext);
      if (result.success && result.coverLetter) {
        toneCache.current[tone] = result.coverLetter;
        setActiveTone(tone);
        setDisplayLetter(result.coverLetter);
        refreshProfile();
      } else {
        setError(result.error || 'Failed to rewrite cover letter');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setToneLoading(false);
    }
  };

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const { url } = await createStripeCheckout(plan, currency);
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout');
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
      {/* First-login demo popup — 22s LiveDemoReel walkthrough so visitors
          understand the dashboard before staring at empty fields. Fires
          ONCE per browser (localStorage flag), skips if returning from
          Stripe (?success/?cancelled), dismisses via ESC + click-outside
          + close button. Body-scroll locked while open. */}
      {showDemoPopup && (
        <div
          ref={demoDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-popup-title"
          onClick={(e) => { if (e.target === e.currentTarget) dismissDemoPopup(); }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(13,11,30,0.92)', backdropFilter: 'blur(16px)' }}
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1a1635] border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={dismissDemoPopup}
              aria-label="Close demo"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors text-lg"
            >
              ✕
            </button>
            <div className="p-6 md:p-8 pt-12">
              <div className="text-center mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
                  Welcome — 22-second walkthrough
                </p>
                <h2 id="demo-popup-title" className="text-2xl md:text-3xl font-display font-bold text-white">
                  Here's what Vantage does in 90 seconds.
                </h2>
                <p className="text-sm text-white/60 mt-2">
                  Quick visual tour. Press ESC or click outside to skip.
                </p>
              </div>
              <React.Suspense fallback={
                <div className="aspect-[16/9] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <LiveDemoReel autoplay aspectRatio="16/9" />
              </React.Suspense>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={dismissDemoPopup}
                  className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors"
                >
                  Got it — let me try
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissDemoPopup();
                    window.open('https://aimvantage.uk/sample/anthropic-senior-pm', '_blank', 'noopener,noreferrer');
                  }}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-semibold transition-colors"
                >
                  See a full sample output
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              title={tokenSyncing ? 'Syncing your new tokens from Stripe — this usually takes a few seconds.' : undefined}
            >
              <div className={`w-2 h-2 bg-emerald-400 rounded-full ${tokenSyncing ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-bold text-emerald-400">
                {profile ? creditsRemaining : '--'} Tokens
                {tokenSyncing && <span className="text-emerald-400/70 font-normal ml-1.5">· syncing…</span>}
              </span>
            </div>

            {profile?.plan && (
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                {profile.plan}
              </span>
            )}

            {profile?.subscription_status === 'inactive' && profile?.plan === 'starter' && (
              <button
                onClick={() => navigate('/pricing')}
                className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30 transition-colors"
              >
                Upgrade
              </button>
            )}

            {/* Refer link — surfaces a hidden conversion lever. Existing users
                are the cheapest acquisition source; a one-click link in the
                nav makes referring zero-friction. Manual rewards (5 free
                tokens per signup) per /refer page. */}
            <button
              onClick={() => navigate('/refer')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              title="Refer a friend — 5 free tokens"
            >
              Refer · +5 tokens
            </button>

            <button
              onClick={() => navigate('/account')}
              className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Analyser → tracker save toast. Bottom-right, auto-dismisses 5s.
          Mirrors the JobSearchSection toast pattern for consistency. */}
      <AnimatePresence>
        {analysisTrackerToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            role="status"
            aria-live="polite"
            className={`fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] p-4 rounded-2xl backdrop-blur-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] flex items-start gap-3 ${
              analysisTrackerToast.mode === 'saved'
                ? 'bg-emerald-500/20 border-2 border-emerald-500/60'
                : analysisTrackerToast.mode === 'duplicate'
                ? 'bg-amber-500/20 border-2 border-amber-500/60'
                : 'bg-rose-500/20 border-2 border-rose-500/60'
            }`}
          >
            {analysisTrackerToast.mode === 'saved'
              ? <Bookmark className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-300" aria-hidden="true" />
              : analysisTrackerToast.mode === 'duplicate'
              ? <Bookmark className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-300" aria-hidden="true" />
              : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-300" aria-hidden="true" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white mb-0.5">
                {analysisTrackerToast.mode === 'saved'
                  ? 'Saved to tracker'
                  : analysisTrackerToast.mode === 'duplicate'
                  ? 'Already in tracker'
                  : 'Couldn\'t save to tracker'}
              </p>
              <p className="text-xs text-white/80">
                {analysisTrackerToast.mode === 'saved'
                  ? <>{analysisTrackerToast.role} at {analysisTrackerToast.company}</>
                  : analysisTrackerToast.mode === 'duplicate'
                  ? <>{analysisTrackerToast.role} at {analysisTrackerToast.company} is already saved. Find it in the tracker to update the status or add notes.</>
                  : <>Browser storage may be full or blocked. Try again from the tracker section directly.</>}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAnalysisTrackerToast(null)}
              aria-label="Dismiss notification"
              className="text-white/50 hover:text-white text-xl leading-none flex-shrink-0"
            >
              <span aria-hidden="true">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Success Banner — fires after Stripe redirect with ?success=true.
          The post-purchase moment is the MOST positively-primed instant in the
          user journey. Surface the referral link here — friends-and-family
          referrals are 5-10× higher-converting than cold outreach. */}
      {checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3 flex-1 min-w-[260px]">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-semibold">Payment confirmed.</p>
                <p className="text-emerald-400/70 text-sm">Your tokens have been added.{' '}
                  <button
                    onClick={() => navigate('/refer')}
                    className="underline hover:text-emerald-300"
                  >
                    Refer a friend → +5 free tokens
                  </button>
                </p>
              </div>
            </div>
            <button onClick={() => setCheckoutSuccess(false)} className="text-emerald-400/50 hover:text-emerald-400 text-sm flex-shrink-0">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Checkout Error Banner — fires when api/stripe/checkout creation
          itself failed before Stripe took over (network error, missing
          price ID, Stripe API hiccup). Previously the user was redirected
          to /dashboard?checkout_error=true but the dashboard had no handler,
          so they saw a silent dashboard load with no acknowledgement. Now
          a red banner with email-Gio fallback. */}
      {checkoutError && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div role="alert" className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3 flex-1 min-w-[260px]">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-red-300 font-semibold">Checkout couldn't start.</p>
                <p className="text-red-200/80 text-sm mt-0.5">
                  No charge to your card. Try again, or{' '}
                  <a
                    href="mailto:hello@aimvantage.uk?subject=Stripe%20checkout%20error"
                    className="underline text-red-200 hover:text-red-100"
                  >
                    email Gio
                  </a>
                  {' '}— he replies within a few hours.
                </p>
              </div>
            </div>
            <button onClick={() => setCheckoutError(false)} className="text-red-400/60 hover:text-red-300 text-sm flex-shrink-0">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Checkout Cancelled Banner — fires after Stripe redirects back with
          ?cancelled=true (user clicked Back, closed the tab, or hit any
          cancel control in Stripe Checkout). Previously this query param
          was just stranded with no UX acknowledgement. Now: non-judgmental
          notice that no charge happened, with two soft re-engagement paths
          (run the free analyses they already have, or ping Gio for help). */}
      {checkoutCancelled && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3 flex-1 min-w-[260px]">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <p className="text-white font-semibold">No charge — picking up where you left off.</p>
                <p className="text-white/60 text-sm mt-0.5">
                  You can keep using your free prep packs below.{' '}
                  <a
                    href="mailto:hello@aimvantage.uk?subject=Stripe%20checkout%20question"
                    className="underline text-white/80 hover:text-white"
                  >
                    Question about pricing? Email Gio
                  </a>
                  {' '}— he replies within a few hours.
                </p>
              </div>
            </div>
            <button onClick={() => setCheckoutCancelled(false)} className="text-white/60 hover:text-white/70 text-sm flex-shrink-0">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Subscription Banner — shown to ALL signed-in users so the
          pricing/plan view is consistent across accounts (user feedback
          2026-05-12: 'hotmail login has it, gmail does not — they
          should be the same'). The previous fresh-user gate hid the
          banner for ≥7-token never-paid accounts to avoid feeling
          paywall-y, but the inconsistency between accounts was worse
          UX than the paywall vibe. */}
      {!checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20">
            {(() => {
              const tokens = profile?.token_balance ?? 0;
              const analyses = tokens; // 1 token = 1 analysis as of 2026-05-08
              const analysesWord = analyses === 1 ? 'analysis' : 'analyses';
              const hasActiveSub = profile?.subscription_status === 'active' || profile?.subscription_status === 'cancelling';
              // "Free / on us" wording is only honest for users who have NEVER paid.
              // stripe_customer_id is set the first time the user opens a checkout
              // session — once it's set, they've at least intended to pay, so the
              // celebratory "free" copy stops being right.
              const everPaid = !!(profile?.stripe_customer_id && profile.stripe_customer_id.length > 0);

              if (hasActiveSub) {
                return (
                  <>
                    <h2 className="text-lg font-display font-bold text-white mb-1">Your Plan</h2>
                    <p className="text-white/50 text-sm mb-5">
                      {profile?.subscription_status === 'cancelling'
                        ? 'Your subscription will end at the end of the billing period. Tokens are kept.'
                        : 'Manage your subscription or buy more tokens.'}
                    </p>
                  </>
                );
              }

              // Threshold updated 2026-05-08 from `>= 3` to `>= 1` to match
              // the new 1-token-per-analysis pricing. Previously a user with
              // 1-2 tokens fell through to the "buy more" copy, even though
              // they still had 1-2 prep packs available.
              if (tokens >= 1 && !everPaid) {
                return (
                  <>
                    <h2 className="text-lg font-display font-bold text-white mb-1">
                      You have {tokens} free {tokens === 1 ? 'token' : 'tokens'} — that's {analyses} full {analysesWord} on us.
                    </h2>
                    <p className="text-white/50 text-sm mb-5">
                      Upload your CV + paste a job link below to run one. Top up only if you want more after that.
                    </p>
                  </>
                );
              }

              if (tokens >= 1) {
                return (
                  <>
                    <h2 className="text-lg font-display font-bold text-white mb-1">
                      You have {tokens} tokens — ready when you are.
                    </h2>
                    <p className="text-white/50 text-sm mb-5">
                      That's {analyses} full {analysesWord}. Top up below or subscribe for monthly tokens.
                    </p>
                  </>
                );
              }

              return (
                <>
                  <h2 className="text-lg font-display font-bold text-white mb-1">Top up to keep going</h2>
                  <p className="text-white/50 text-sm mb-5">Each analysis costs 1 token. Pick a plan to continue.</p>
                </>
              );
            })()}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLANS.map((plan) => {
                const hasActiveSub = profile?.subscription_status === 'active' || profile?.subscription_status === 'cancelling';
                const isCurrentPlan = !plan.isTopup && profile?.plan === plan.name.toLowerCase() && hasActiveSub;
                return (
                  <div
                    key={plan.name}
                    className={`p-4 rounded-xl flex flex-col items-center text-center relative ${
                      isCurrentPlan
                        ? 'bg-emerald-500/10 border-2 border-emerald-500/40'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Current Plan
                      </div>
                    )}
                    <plan.icon className="w-6 h-6 mb-2 mt-1" style={{ color: isCurrentPlan ? '#34d399' : plan.color }} />
                    <div className={`font-bold ${isCurrentPlan ? 'text-emerald-400' : 'text-white'}`}>{plan.name}</div>
                    <div className="text-2xl font-bold text-white my-1">
                      {symbol}{currency === 'usd' ? plan.usd : plan.gbp}
                      <span className="text-sm text-white/60 font-normal">{plan.isTopup ? '' : '/mo'}</span>
                    </div>
                    <div className="text-xs text-white/50 mb-3">
                      {plan.isTopup ? `${plan.tokens} tokens (one-time)` : `${plan.tokens} tokens/month`}
                    </div>
                    {isCurrentPlan ? (
                      profile?.subscription_status === 'cancelling' ? (
                        <div className="w-full py-2 rounded-lg text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-1.5">
                          Cancelling
                        </div>
                      ) : (
                        <div className="w-full py-2 rounded-lg text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" />
                          Subscribed
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan.name.toLowerCase())}
                        disabled={checkoutLoading !== null}
                        className="w-full py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                        style={{ background: plan.color, color: '#fff' }}
                      >
                        {checkoutLoading === plan.name.toLowerCase() ? 'Redirecting...' :
                         plan.isTopup ? 'Buy Tokens' :
                         hasActiveSub ? 'Switch Plan' : 'Subscribe'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Magnify-on-proximity side nav (desktop only — md:flex). Lazy
          loaded so the chunk only arrives once Dashboard is mounted.
          Anchored to: #dashboard-jobsearch-panel, #application-tracker,
          #run-analysis, #past-analyses. Plus a 'Top' shortcut. */}
      <React.Suspense fallback={null}>
        <DashboardSideNav />
      </React.Suspense>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        {showPrefillBanner && prefilledFromJobSearch && (
          <div role="status" aria-live="polite"
            className="mb-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-200 text-sm flex items-center gap-3 flex-wrap">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-violet-300" aria-hidden="true" />
            <p className="flex-1">
              Pre-filled from your AI Job Search: <strong>{prefilledFromJobSearch.title}</strong> at <strong>{prefilledFromJobSearch.company}</strong>. Add your CV and run the full prep analysis below.
            </p>
            <button type="button" onClick={() => setShowPrefillBanner(false)}
              className="px-3 py-1 rounded text-xs font-semibold text-violet-200/80 hover:text-white hover:bg-white/5 transition min-h-[36px]"
              aria-label="Dismiss prefill banner">Dismiss</button>
          </div>
        )}

        {/* AI Job Search — expandable inline section, persistent across
            input + results views (moved out of the results-gated block
            on 2026-05-12 after a user reported they couldn't find it).
            This is the primary surface for the feature. Standalone /jobs
            route still exists for deep-link/SEO but Dashboard is where
            users naturally flow from prep → search → save → analyze.
            Lazy-loaded — chunk only arrives if user expands. */}
        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-violet-400" />
              AI Job Search
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold ml-2">New</span>
            </h3>
            <button
              onClick={() => {
                // Flag this as a deliberate user action so the load effect
                // can't subsequently overwrite the click if auth happens
                // to finish loading right after this toggle.
                hasUserToggledRef.current = true;
                setShowJobSearch((v) => {
                  const next = !v;
                  if (next) {
                    window.requestAnimationFrame(() => {
                      const el = document.getElementById('dashboard-jobsearch-panel');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                  }
                  return next;
                });
              }}
              aria-expanded={showJobSearch}
              aria-controls="dashboard-jobsearch-panel"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all flex items-center gap-2 min-h-[44px]"
            >
              {showJobSearch ? (
                <><ChevronRight className="w-4 h-4 rotate-90" /> Hide search</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Find new jobs</>
              )}
            </button>
          </div>
          <p className="text-white/60 text-sm mt-2">
            Search 20 countries + global remote, AI-scored against your CV, ghost-filtered, salary-transparent. <strong className="text-white/80">First scan today is free</strong>, then 1 token per scan. Save results to your tracker or click "Apply via Vantage" to drop the JD URL straight into the analyzer.
          </p>
          <AnimatePresence>
            {showJobSearch && (
              <motion.div
                id="dashboard-jobsearch-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-5"
              >
                <React.Suspense fallback={
                  <div className="p-6 text-center text-white/50 text-sm flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Loading search…
                  </div>
                }>
                  <JobSearchSection embedded={true} />
                </React.Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Application Tracker — moved out of the results-step gate on
            2026-05-12 (user reported: 'click View tracker → does nothing').
            Root cause: it was nested inside {step === 'results' && ...} so
            on the default input view the #application-tracker anchor didn't
            exist, breaking every scroll-to-tracker button (the toast 'View
            tracker →' link, the 'Tracker · N saved' pill, the 'N saved →'
            inline link in scan results). Now persistent — always available
            for save/view actions, regardless of analysis state. */}
        <div className="mb-6">
          <React.Suspense fallback={null}>
            <ApplicationTracker userScope={user?.id} />
          </React.Suspense>
        </div>

        <AnimatePresence mode="wait">
          {step === 'input' && (
            // initial={false} — skip entrance animation (mirrors Pricing/Auth
            // fix from 2026-05-07). Animation framework was stalling at
            // opacity ~0.2 in some Vercel deploys, hiding the upload form.
            // exit transition kept so step → step transitions still feel
            // connected.
            <motion.div
              key="input"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              id="run-analysis"
              data-analysis-form
              className="scroll-mt-20"
            >
              <div className="mb-8">
                {/* Welcome strip for fresh users — replaces the pricing cards we
                    hid above. Confirms balance + reassures it's free + sets up
                    the 3-step expectation. */}
                {(() => {
                  const tokens = profile?.token_balance ?? 0;
                  const everPaid = !!(profile?.stripe_customer_id && profile.stripe_customer_id.length > 0);
                  const isFreshUser = !everPaid && tokens >= 7;
                  if (!isFreshUser) return null;
                  const analyses = tokens; // 1 token = 1 analysis as of 2026-05-08
                  return (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <p className="text-emerald-100/90">
                        <strong className="text-emerald-300">{tokens} free tokens — that's {analyses} full analyses on us.</strong>
                        {' '}No card needed. Just upload your CV and paste a job URL below.
                      </p>
                    </div>
                  );
                })()}
                <h1 className="text-2xl font-display font-bold text-white mb-2">Run a new analysis</h1>
                <p className="text-white/50">
                  Three quick steps: upload your CV → drop a job posting URL → click run. ~90 seconds, fully private — your CV never leaves your browser until you click run.
                </p>
              </div>

              {/* Pending roast handoff banner — GOLDEN GOSPEL Tactic 3 (2026-05-08).
                  User came in via /roast and clicked "Continue with this letter".
                  Confirm we still have their letter and tell them what to do
                  next: drop CV + job URL, hit run. The /api/analyze pipeline
                  will use their CV against the job, and the rewritten cover
                  letter that comes out is the "winning version" they were
                  promised on the roast page. */}
              {pendingRoast && (
                <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/30">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-emerald-200 font-semibold text-base">We've got your roasted cover letter.</p>
                      <p className="text-white/70 text-sm mt-1 leading-relaxed">
                        Severity {pendingRoast.severityScore}/5 · {pendingRoast.coverLetter.length.toLocaleString()} characters preserved.
                        Drop your CV in Step 1 and paste the job URL in Step 2 — Vantage will rewrite that letter
                        against your actual CV and the role, with company intel + fit score + mock interview included.
                      </p>
                    </div>
                  </div>
                  <div className="ml-8 flex flex-wrap items-center gap-2">
                    <details className="text-xs text-white/60">
                      <summary className="cursor-pointer hover:text-white/80 select-none">View the original letter you brought</summary>
                      <div className="mt-2 p-3 rounded-lg bg-black/30 border border-white/5 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-white/70">
                        {pendingRoast.coverLetter}
                      </div>
                    </details>
                    <button
                      type="button"
                      onClick={() => setPendingRoast(null)}
                      className="text-xs text-white/60 hover:text-white/70 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {!canAnalyze && (
                <div className="mb-6 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-300 font-semibold text-base">You're out of free analyses.</p>
                      <p className="text-amber-100/80 text-sm mt-1 leading-relaxed">
                        £5 unlocks <strong className="text-white">20 more prep packs</strong> (CV fit score, tailored cover letter, mock interview questions, pitch outline). One-time top-up. Tokens never expire — pay once, use any time you apply.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-8">
                    <button
                      onClick={() => navigate('/pricing')}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors"
                    >
                      £5 — get 20 more prep packs
                    </button>
                    <button
                      onClick={() => window.open('https://aimvantage.uk/sample/anthropic-senior-pm', '_blank')}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-sm transition-colors"
                    >
                      See what a prep pack looks like →
                    </button>
                  </div>
                </div>
              )}

              {error && (() => {
                // Validation errors (please upload, please add, file too large,
                // 0 tokens) are user-fixable, not failures — render as amber
                // notice. API / network errors render as red with a reassurance
                // about token refund + retry hint.
                // role='alert' + aria-live='assertive' so screen readers
                // announce the error the moment it appears (it's a dynamic
                // post-submit state, otherwise silent for SR users).
                const isValidation =
                  /please upload|please add|too large|too long|0 tokens|don't have/i.test(error) ||
                  /Top up below/i.test(error);
                if (isValidation) {
                  return (
                    <div role="alert" aria-live="polite" className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
                      {error}
                    </div>
                  );
                }
                return (
                  <div role="alert" aria-live="assertive" className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <p>{error}</p>
                    <p className="text-red-300/70 text-xs mt-2 leading-relaxed">
                      Tokens are only consumed on successful analyses. If the AI failed before completing, your balance was automatically refunded — you can try again at no cost. If the same error repeats, paste the JD into Step 2 directly (some sites block automated reading).
                    </p>
                  </div>
                );
              })()}

              {/* Step progress indicator (C6 from dashboard-ux-plan-2026-05-06).
                  Three pills horizontally: filled (emerald) when the field has
                  a value, muted otherwise. Reduces "what do I do?" anxiety by
                  giving users a sense of progress while filling the form.
                  Each card already has its own corner Step label — this row is
                  the OVERVIEW so users know there are 3 steps total. */}
              {(() => {
                const cvDone = !!cvFile;
                const jdDone = (jdMode === 'file' && !!jobDescFile) ||
                               (jdMode === 'text' && jobDescText.trim().length > 50);
                const urlDone = !!jobUrl.trim();
                const completed = [cvDone, jdDone, urlDone].filter(Boolean).length;
                const Pill = ({ n, label, done }: { n: number; label: string; done: boolean }) => (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      done
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 border border-white/10 text-white/45'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                        done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {done ? '✓' : n}
                    </span>
                    {label}
                  </div>
                );
                return (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Pill n={1} label="CV" done={cvDone} />
                    <span className="text-white/20 text-xs">→</span>
                    <Pill n={2} label="Job description" done={jdDone} />
                    <span className="text-white/20 text-xs">→</span>
                    <Pill n={3} label="Job URL" done={urlDone} />
                    <span className="ml-auto text-[11px] text-white/60 font-medium">
                      {completed}/3 filled
                    </span>
                  </div>
                );
              })()}

              {/* CV upload status: extract→save animation + green confirmation
                  once cv_summary is on the profile. Renders only when cvFile
                  has been touched OR profile already has cv_summary. Bridges
                  the user complaint that there was no signal the CV had been
                  saved for AI Job Search (2026-05-12). */}
              {(cvFile || profile?.cv_summary) && (
                <div className={`mb-4 p-3 rounded-xl border-2 flex items-center gap-3 ${
                  cvUploadStage === 'done' ? 'bg-emerald-500/15 border-emerald-500/50' :
                  cvUploadStage === 'error' || cvUploadStage === 'unsupported' ? 'bg-rose-500/15 border-rose-500/50' :
                  'bg-violet-500/15 border-violet-500/50'
                }`}>
                  {cvUploadStage === 'done' ? (
                    <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" aria-hidden="true" />
                  ) : cvUploadStage === 'error' || cvUploadStage === 'unsupported' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-300 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-violet-300 animate-spin flex-shrink-0" aria-hidden="true" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">
                      {cvUploadStage === 'extracting' && 'Reading your CV…'}
                      {cvUploadStage === 'saving' && 'Saving CV profile…'}
                      {cvUploadStage === 'done' && 'CV ready ✓ — AI Job Search will now score against your profile'}
                      {cvUploadStage === 'error' && 'Could not save CV'}
                      {cvUploadStage === 'unsupported' && 'Unsupported file type'}
                      {cvUploadStage === 'idle' && cvFile && 'CV loaded — ready to analyse'}
                    </p>
                    {(cvUploadStage === 'extracting' || cvUploadStage === 'saving') && (
                      <p className="text-xs text-white/70 mt-0.5">
                        {cvUploadStage === 'extracting' ? 'Extracting skills, experience, and qualifications…' : 'Locking your CV into your profile so every tool uses it…'}
                      </p>
                    )}
                    {cvUploadStage === 'error' && cvUploadError && (
                      <p className="text-xs text-rose-200/80 mt-0.5">{cvUploadError}</p>
                    )}
                    {cvUploadStage === 'unsupported' && (
                      <p className="text-xs text-rose-200/80 mt-0.5">{cvUploadError || 'Please use PDF, DOCX, or TXT.'}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-5 mb-6">
                {/* CV Upload */}
                <div
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer relative ${
                    isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) setCvFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-violet-300/70">Step 1 · Required</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setCvFile(e.target.files[0])}
                  />
                  <div className="text-center">
                    {cvFile ? (
                      <>
                        <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-white font-semibold text-sm truncate">{cvFile.name}</p>
                        <p className="text-white/60 text-[11px] mt-1">Click to swap for a different CV</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white/55 mx-auto mb-2" />
                        <p className="text-white font-semibold text-sm">Upload your CV</p>
                        <p className="text-white/60 text-xs mt-1">Drop or click — PDF, DOCX, or TXT</p>
                        {/* Sample CV escape hatch — clicking this fetches public/sample-cv.txt
                            and creates a File object so the user can run a real analysis
                            with our example. Removes the biggest blocker for first-time
                            users who don't have a CV file ready on their machine. The
                            sample is a public asset, content is fictional but realistic. */}
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const res = await fetch('/sample-cv.txt');
                              if (!res.ok) return;
                              const blob = await res.blob();
                              const file = new File([blob], 'sample-cv-sarah-mitchell.txt', { type: 'text/plain' });
                              setCvFile(file);
                              // ONE-click full demo: also pre-fill a sample job URL
                              // and JD text if those fields are empty. Real Stripe
                              // job posting (public). User can replace with their
                              // own role at any time. We do NOT overwrite if the
                              // user has already typed something — respect their work.
                              if (!jobUrl) {
                                setJobUrl('https://stripe.com/jobs/listing/staff-product-manager-payments/7819059');
                              }
                              if (!jobDescText && !jobDescFile) {
                                setJobDescText(
                                  'Stripe — Staff Product Manager, Payments\n\n' +
                                  'About the team: The Payments team owns the core money-movement primitives behind Stripe — Charges, Payment Intents, Setup Intents, and the merchant-of-record flows that thousands of businesses depend on. We are looking for a Staff PM to lead the next chapter of how merchants accept payments globally.\n\n' +
                                  'You will: define the strategy for the Payments product line, partner with engineering leadership on infrastructure trade-offs, work with risk and compliance on regulatory rollouts, and translate ambiguous user pain into shipped product.\n\n' +
                                  'We are looking for: 8+ years of PM experience including 3+ at Staff/Principal level, deep payments or fintech background, comfort with technical ambiguity, history of shipping at scale (>$10M revenue impact), and demonstrated cross-functional leadership across engineering, design, and GTM.\n\n' +
                                  'Bonus: experience with global payment methods (SEPA, BACS, ACH), regulatory frameworks (PSD2, Reg E), or open-banking integrations.'
                                );
                                setJdMode('text');
                              }
                            } catch { /* ignore — sample fetch is best-effort */ }
                          }}
                          className="mt-3 text-[11px] text-violet-400 hover:text-violet-300 underline-offset-2 hover:underline transition-colors"
                        >
                          No CV ready? Try the full demo (sample CV + job) →
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Job Description — Paste (default) or File. Paste-from-clipboard
                    is the fastest path: copy job posting text → paste → done. The
                    File mode is still available for users who saved the JD as a
                    document. Visually labelled "Step 2 · Recommended" rather than
                    "Optional" — most users skip optional fields, but quality drops
                    sharply without a JD on URL-protected sites. */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 relative">
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">Step 2 · Recommended</span>
                  <div className="flex items-center gap-1 mb-3 mt-5">
                    <button
                      onClick={() => setJdMode('text')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${jdMode === 'text' ? 'bg-violet-600/30 text-violet-300' : 'text-white/60 hover:text-white/60'}`}
                    >
                      <Type className="w-3 h-3" /> Paste text
                    </button>
                    <button
                      onClick={() => setJdMode('file')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${jdMode === 'file' ? 'bg-violet-600/30 text-violet-300' : 'text-white/60 hover:text-white/60'}`}
                    >
                      <Upload className="w-3 h-3" /> Or upload file
                    </button>
                  </div>
                  {jdMode === 'file' ? (
                    <div
                      className="cursor-pointer text-center"
                      onClick={() => jdInputRef.current?.click()}
                    >
                      <input
                        ref={jdInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setJobDescFile(e.target.files[0])}
                      />
                      {jobDescFile ? (
                        <>
                          <FileText className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                          <p className="text-white font-semibold text-xs truncate">{jobDescFile.name}</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-6 h-6 text-white/55 mx-auto mb-1" />
                          <p className="text-white/50 text-xs">Click to upload JD file</p>
                          <p className="text-white/55 text-[10px] mt-0.5">PDF, DOCX, or TXT</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={jobDescText}
                        onChange={(e) => setJobDescText(e.target.value)}
                        placeholder="Paste the full job description here — the more detail, the better the AI's tailoring..."
                        className="w-full h-24 bg-transparent text-white placeholder-white/40 outline-none text-xs resize-none leading-relaxed"
                      />
                      <button
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setJobDescText(text);
                          } catch { /* clipboard access denied */ }
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 text-xs transition-all"
                      >
                        <ClipboardPaste className="w-3 h-3" /> Paste from clipboard
                      </button>
                    </div>
                  )}
                </div>

                {/* Job posting URL */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative">
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-violet-300/70">Step 3 · Required</span>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3 mt-5">
                    Job posting URL
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://company.com/careers/role-id"
                    className="w-full bg-transparent text-white placeholder-white/30 outline-none text-sm"
                  />
                  <p className="mt-2 text-[11px] text-white/60 leading-relaxed">
                    Paste the link from the careers page. Works with most company sites + Indeed, LinkedIn, Reed, Greenhouse, Lever. Some sites block scrapers — if so, paste the JD text in Step 2 too.
                  </p>
                </div>
              </div>

              {/* Pre-emptive warning for URLs that commonly block automated readers.
                  Without this, users paste an Indeed URL, get a useless analysis,
                  and bounce. Showing this BEFORE submission saves tokens + trust. */}
              {(() => {
                if (!jobUrl) return null;
                let host = '';
                try { host = new URL(jobUrl).hostname.toLowerCase().replace(/^www\./, ''); }
                catch { return null; }
                const blocked = ['indeed.com', 'indeed.co.uk', 'linkedin.com', 'reed.co.uk', 'glassdoor.com', 'glassdoor.co.uk', 'totaljobs.com', 'cwjobs.co.uk', 'monster.com'];
                const matched = blocked.find(d => host === d || host.endsWith('.' + d));
                if (!matched) return null;
                const hasJd = (jdMode === 'file' && jobDescFile) || (jdMode === 'text' && jobDescText.trim().length > 50);
                if (hasJd) return null;
                return (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-amber-300 font-semibold">Heads up — {matched} often blocks automated readers</p>
                      <p className="text-amber-200/70 mt-1">
                        For best results, also paste the job description text into the Job Description box above
                        (or upload it as a file). Without it, the analysis will likely fail and your tokens won't be charged.
                      </p>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={handleStart}
                disabled={!cvFile || !jobUrl || !canAnalyze}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Run my prep pack
                <span className="text-white/70 text-sm font-normal ml-1">· uses 1 of your {profile?.token_balance ?? 0} tokens</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Explain why the button is disabled — silent disabled state was confusing
                  users who didn't realise CV + Job URL were both required.
                  Also surface the no-tokens case (canAnalyze=false), previously
                  unexplained: button greyed with no hint that tokens were the
                  blocker. */}
              {(!cvFile || !jobUrl) && canAnalyze && (
                <p className="mt-2 text-center text-xs text-white/60">
                  {!cvFile && !jobUrl
                    ? 'Add your CV and a job posting URL above to enable.'
                    : !cvFile
                    ? 'Upload your CV above to enable.'
                    : 'Add a job posting URL above to enable.'}
                </p>
              )}
              {!canAnalyze && cvFile && jobUrl && (
                <p className="mt-2 text-center text-xs text-amber-300/90">
                  Out of tokens.{' '}
                  <Link to="/pricing" className="underline font-semibold hover:text-amber-200">
                    Top up at /pricing
                  </Link>
                  {' '}to run another prep pack.
                </p>
              )}

              {/* === ATS scanner (additive, free, client-side). Removing this and the
                   import line restores the previous behaviour entirely. === */}
              {cvFile && <AtsScannerSection cvFile={cvFile} />}
              {/* === END ATS scanner === */}

              {/* Analysis History */}
              <AnalysisHistory onLoad={(data: any) => { setResults(data); setStep('results'); }} />
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Building your prep pack…</h2>
              <p className="text-white/50 mb-8">Usually 60-90 seconds. Don't refresh or navigate away — your tokens are reserved during the run.</p>

              {/* Animated stage indicator. Transitions are time-based (rough
                  approximation of the real backend pipeline) since we don't
                  stream progress from the API. Each stage stays visible until
                  the next becomes "active" — gives the user a clear sense
                  that work is happening even though the server is silent. */}
              <ProcessingStages />
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-display font-bold text-white">Results</h1>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download whole prep pack as text — added 2026-05-07. The
                      analysis is the user's interview prep dossier; they
                      should be able to take it offline (print it, paste into
                      Notes, share with a coach) without losing structure. */}
                  <button
                    onClick={() => {
                      const company = results.companySnapshot?.name || 'company';
                      const lines: string[] = [];
                      lines.push(`VANTAGE AI — PREP PACK`);
                      lines.push(`Company: ${company}`);
                      if (results.cvFitScore != null) lines.push(`Fit score: ${results.cvFitScore}/100`);
                      lines.push(`\n--- COMPANY INTELLIGENCE ---`);
                      if (results.companySnapshot?.mission) lines.push(`Mission: ${results.companySnapshot.mission}`);
                      if (results.companySnapshot?.cultureSignals?.length) {
                        lines.push(`Culture signals:`);
                        results.companySnapshot.cultureSignals.forEach((s: string) => lines.push(`  - ${s}`));
                      }
                      if (results.companySnapshot?.recentHighlights?.length) {
                        lines.push(`Recent highlights:`);
                        results.companySnapshot.recentHighlights.forEach((s: string) => lines.push(`  - ${s}`));
                      }
                      if (results.cvFitSummary) {
                        lines.push(`\n--- FIT SUMMARY ---`);
                        lines.push(results.cvFitSummary);
                      }
                      if (results.strategicBrief) {
                        lines.push(`\n--- STRATEGIC BRIEF ---`);
                        lines.push(results.strategicBrief);
                      }
                      if (results.coverLetter) {
                        lines.push(`\n--- COVER LETTER (${activeTone}) ---`);
                        lines.push(displayLetter || results.coverLetter);
                      }
                      if (results.presentation?.length) {
                        lines.push(`\n--- 5-MIN PITCH OUTLINE ---`);
                        results.presentation.forEach((slide: { title: string; content: string }, i: number) => {
                          lines.push(`\n${i + 1}. ${slide.title}`);
                          lines.push(slide.content);
                        });
                      }
                      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `vantage-prep-${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10"
                    aria-label="Download prep pack as plain text file"
                    title="Download the whole prep pack as a .txt file"
                  >
                    <FileText className="w-4 h-4" /> Download .txt
                  </button>
                  {/* Download .md — same data, Markdown-formatted with
                      headings + lists for clean paste into Notion /
                      Obsidian / interview prep notes. Same shared helper
                      as the public AI tools' export. Added 2026-05-11. */}
                  <button
                    onClick={() => {
                      const company = results.companySnapshot?.name || 'company';
                      const ts = new Date().toISOString().slice(0, 10);
                      // Fallback to 'company' if slug collapses to empty
                      // (e.g. company name with only non-alphanumeric
                      // chars — review LOW #3).
                      const rawSlug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      const slug = rawSlug || 'company';
                      const filename = `vantage-prep-${slug}-${ts}.md`;
                      const md = buildAnalysisMarkdown({
                        companySnapshot: results.companySnapshot,
                        cvFitScore: results.cvFitScore,
                        cvFitSummary: results.cvFitSummary,
                        cvMatchPoints: results.cvMatchPoints,
                        keyRequirements: results.keyRequirements,
                        strategicBrief: results.strategicBrief,
                        coverLetter: results.coverLetter,
                        presentation: results.presentation,
                        displayedCoverLetter: displayLetter,
                        coverLetterTone: activeTone,
                      });
                      downloadMarkdown(filename, md);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10"
                    aria-label="Download prep pack as Markdown file for Notion or Obsidian"
                    title="Save for Notion / Obsidian / archive — Markdown file"
                  >
                    {/* Different icon than the .txt button so the two
                        choices are visually distinguishable for low-
                        vision users without screen reader. */}
                    <Download className="w-4 h-4" /> Download .md
                  </button>
                  {/* Save-to-tracker — closes the analyse→follow-up loop.
                      Pre-fills company from the analysis output and role
                      from the JobSearch hand-off (if user came via Apply
                      via Vantage). Falls back to prompt() asking for the
                      role title when not available. Source URL is the
                      analysed jobUrl. Status defaults to 'saved' so the
                      user can update to 'applied' once they actually
                      submit. Disabled when companySnapshot.name is
                      generic ('Unknown — could not identify employer')
                      so we don't pollute the tracker with bad data. */}
                  {(() => {
                    const company = results.companySnapshot?.name || '';
                    const companyOk = company && !company.startsWith('Unknown') && !company.includes('may be incorrect');
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          if (!companyOk) return;
                          // Prefer the role title we already know from
                          // an Apply-via-Vantage hand-off; otherwise ask.
                          let role = prefilledFromJobSearch?.title?.trim() || '';
                          if (!role) {
                            const typed = window.prompt(`Save "${company}" to your application tracker — what's the role title?`, '');
                            if (typed === null) return; // user cancelled
                            role = typed.trim();
                          }
                          if (!role) {
                            setAnalysisTrackerToast({ mode: 'error', company, role: '' });
                            return;
                          }
                          // Duplicate guard — same company + role already
                          // in the tracker (case-insensitive). Stops users
                          // accidentally creating multiple entries by
                          // clicking the button twice.
                          const dup = trackerEntriesForAnalyzer.some((e) =>
                            e.company.toLowerCase() === company.toLowerCase() &&
                            e.role.toLowerCase() === role.toLowerCase()
                          );
                          if (dup) {
                            setAnalysisTrackerToast({ mode: 'duplicate', company, role });
                            return;
                          }
                          const newId = addAnalysisToTracker({
                            company: company.slice(0, 200),
                            role: role.slice(0, 200),
                            status: 'saved',
                            sourceUrl: jobUrl || undefined,
                            notes: results.cvFitSummary ? results.cvFitSummary.slice(0, 1000) : undefined,
                          });
                          if (!newId) {
                            setAnalysisTrackerToast({ mode: 'error', company, role });
                          } else {
                            setAnalysisTrackerToast({ mode: 'saved', company, role });
                          }
                        }}
                        disabled={!companyOk}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={companyOk
                          ? `Save ${company} to your application tracker`
                          : 'Save to tracker disabled because the company name could not be reliably identified'}
                        title={companyOk
                          ? `Add ${company} to your application tracker so you can follow up after applying. Role title is auto-filled if you came via Apply-via-Vantage, otherwise you'll be asked.`
                          : 'Company name could not be reliably identified — save manually from the tracker instead.'}
                      >
                        <Bookmark className="w-4 h-4" /> Save to tracker
                      </button>
                    );
                  })()}
                  {/* "Same CV, new job" — preserves the uploaded CV so users
                      applying to multiple roles don't have to re-drop the
                      file every time. Habit-forming: typical job-seeker
                      runs 5-10 analyses against the same CV.
                      "New Analysis" clears everything for a fresh start. */}
                  <button
                    onClick={() => {
                      setStep('input'); setJobUrl(''); setJobDescText(''); setJobDescFile(null); setResults(null);
                      // Scroll user to the analysis form — without this they sit
                      // at the bottom of the page where results used to be,
                      // confusing 'where did the form go?'.
                      window.requestAnimationFrame(() => {
                        document.getElementById('run-analysis')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 font-semibold text-sm hover:bg-violet-600/30"
                    title="Keep your CV, swap the job URL for the next role"
                  >
                    Same CV, new job
                  </button>
                  <button
                    onClick={() => {
                      setStep('input'); setCvFile(null); setJobUrl(''); setJobDescText(''); setJobDescFile(null); setResults(null);
                      window.requestAnimationFrame(() => {
                        document.getElementById('run-analysis')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10"
                  >
                    New Analysis
                  </button>
                </div>
              </div>

              {/* Company Snapshot */}
              {results.companySnapshot && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Company Intelligence</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/60 uppercase">Mission</p>
                      <p className="text-white">{results.companySnapshot.mission}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {results.companySnapshot.name && (
                        <div>
                          <p className="text-xs text-white/60 uppercase">Company</p>
                          <p className="text-white font-semibold">{results.companySnapshot.name}</p>
                        </div>
                      )}
                      {results.companySnapshot.industry && (
                        <div>
                          <p className="text-xs text-white/60 uppercase">Industry</p>
                          <p className="text-white">{results.companySnapshot.industry}</p>
                        </div>
                      )}
                      {results.companySnapshot.size && (
                        <div>
                          <p className="text-xs text-white/60 uppercase">Size</p>
                          <p className="text-white">{results.companySnapshot.size}</p>
                        </div>
                      )}
                      {results.companySnapshot.founded && (
                        <div>
                          <p className="text-xs text-white/60 uppercase">Founded</p>
                          <p className="text-white">{results.companySnapshot.founded}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CV Fit Score */}
              {results.cvFitScore != null && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">CV Fit Score</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={results.cvFitScore >= 70 ? '#34d399' : results.cvFitScore >= 40 ? '#fbbf24' : '#f87171'}
                          strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${(results.cvFitScore / 100) * 264} 264`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                        {results.cvFitScore}
                      </span>
                    </div>
                    {results.cvFitSummary && (
                      <p className="text-white/70 flex-1">{results.cvFitSummary}</p>
                    )}
                  </div>

                  {/* Share my fit score — viral mechanic added 2026-05-07.
                      Tweet text intentionally has NO PII (no user name, no
                      CV detail) — only the score, role, company, and a
                      Vantage shoutout. Every share = social proof + free
                      traffic from the user's network. */}
                  <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-white/60 mr-1">Share this score</span>
                    {(() => {
                      const role = results.keyRequirements?.[0]
                        ? `the ${(results.companySnapshot?.industry || 'role').toLowerCase()} role`
                        : 'this role';
                      const company = results.companySnapshot?.name || 'the company';
                      // No @-handle — Vantage AI doesn't have a verified Twitter account
                      // yet; an @-tag pointing at a non-existent or squatted handle would
                      // break the share. Plain brand name reads cleanly either way.
                      const shareText = `Just got a ${results.cvFitScore}/100 CV fit score for ${role} at ${company} using Vantage AI's free 90-second analysis — full company intel + tailored cover letter + interview pack. Try it:`;
                      const shareUrl = 'https://aimvantage.uk/?utm_source=share&utm_medium=fitscore';
                      return (
                        <>
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                          >
                            <Twitter className="w-3.5 h-3.5" /> Share on X
                          </a>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                          >
                            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                              } catch { /* clipboard unavailable */ }
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-xs font-medium text-white/70 hover:bg-white/5 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Free ATS preview inside results (Gio-requested 2026-05-07).
                  Same component already rendered on the input step — adding
                  it here too means users see their CV's ATS-parser pass/fail
                  RIGHT NEXT TO their fit score. Cross-sell of value: 'fit
                  score 78/100 · also: Workday parsed 12 fields, Greenhouse
                  flagged 2 issues'. Free, client-side, no extra tokens. */}
              {cvFile && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-1">Free ATS preview</h3>
                  <p className="text-xs text-white/60 mb-4">
                    What 5 real ATS parsers (Workday / Greenhouse / Lever / Taleo / iCIMS)
                    will see when you upload this CV. Runs locally in your browser, free,
                    no extra tokens.
                  </p>
                  <AtsScannerSection cvFile={cvFile} />
                </div>
              )}

              {/* Key Requirements & CV Match */}
              {results.keyRequirements?.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Role Match Analysis</h3>
                  <div className="space-y-3">
                    {results.keyRequirements.map((req: string, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                          <p className="text-xs text-violet-400 font-bold uppercase mb-1">Requirement</p>
                          <p className="text-white/80 text-sm">{req}</p>
                        </div>
                        {results.cvMatchPoints?.[i] && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Your Match</p>
                            <p className="text-white/80 text-sm">{results.cvMatchPoints[i]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Brief */}
              {results.briefSections ? (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Strategic Brief</h3>
                  <div className="space-y-4">
                    {results.briefSections.companyContext && (
                      <div>
                        <p className="text-xs text-violet-400 font-bold uppercase mb-1">Company Context</p>
                        <p className="text-white/70 text-sm leading-relaxed">{results.briefSections.companyContext}</p>
                      </div>
                    )}
                    {results.briefSections.roleRequirements && (
                      <div>
                        <p className="text-xs text-violet-400 font-bold uppercase mb-1">Role Requirements</p>
                        <p className="text-white/70 text-sm leading-relaxed">{results.briefSections.roleRequirements}</p>
                      </div>
                    )}
                    {results.briefSections.cvAlignment && (
                      <div>
                        <p className="text-xs text-violet-400 font-bold uppercase mb-1">CV Alignment</p>
                        <p className="text-white/70 text-sm leading-relaxed">{results.briefSections.cvAlignment}</p>
                      </div>
                    )}
                    {results.briefSections.narrativeAngle && (
                      <div>
                        <p className="text-xs text-violet-400 font-bold uppercase mb-1">Narrative Angle</p>
                        <p className="text-white/70 text-sm leading-relaxed">{results.briefSections.narrativeAngle}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : results.strategicBrief && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Strategic Brief</h3>
                  <p className="text-white/70 whitespace-pre-wrap">{results.strategicBrief}</p>
                </div>
              )}

              {/* Cover Letter with Tone Switcher */}
              {results.coverLetter && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Cover Letter</h3>
                    <div className="flex items-center gap-2">
                      {['original', 'Formal', 'Warm', 'Direct', 'Creative'].map((tone) => (
                        <button
                          key={tone}
                          onClick={() => handleToneSwitch(tone)}
                          disabled={toneLoading}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            activeTone === tone
                              ? 'bg-violet-600 text-white'
                              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                          } ${toneLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {tone === 'original' ? 'Original' : tone}
                        </button>
                      ))}
                      {activeTone !== 'original' && (
                        <span className="text-white/55 text-xs ml-1">1 token per tone</span>
                      )}
                    </div>
                  </div>
                  {toneLoading && (
                    <div className="flex items-center gap-2 mb-3 text-violet-400 text-sm">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Rewriting in {activeTone} tone...
                    </div>
                  )}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/70 whitespace-pre-wrap font-serif leading-relaxed">
                      {displayLetter || results.coverLetter}
                    </p>
                  </div>

                  {/* Copy cover letter + ATS character-fit hints.
                      The cover letter is the most-actioned output (users
                      paste it into the job application immediately). The
                      character count exposes ATS limits BEFORE the paste:
                        * LinkedIn Easy Apply: 2000 chars
                        * Workday default: 4000 chars
                        * Typical recommended: 250-400 words
                      Without this, users paste a 4500-char letter into
                      LinkedIn, see it truncated, and have to ask the AI
                      to rewrite shorter — wasting a token. */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(displayLetter || results.coverLetter);
                          // visual confirmation via temporary text swap
                          const btn = document.activeElement as HTMLButtonElement | null;
                          if (btn) {
                            const original = btn.innerText;
                            btn.innerText = 'Copied to clipboard';
                            setTimeout(() => { if (btn) btn.innerText = original; }, 2000);
                          }
                        } catch { /* clipboard unavailable */ }
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-xs font-medium text-white/70 hover:bg-white/5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy cover letter
                    </button>
                    {(() => {
                      const text = displayLetter || results.coverLetter || '';
                      const chars = text.length;
                      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
                      // Three-tier fit hint:
                      //   <= 2000: fits everywhere (LinkedIn Easy Apply too)
                      //   2001-4000: fits Workday and most others, NOT LinkedIn
                      //   > 4000: may need trimming for any ATS form
                      let fit: { label: string; tone: 'good' | 'warn' | 'bad' };
                      if (chars <= 2000) {
                        fit = { label: 'fits LinkedIn Easy Apply', tone: 'good' };
                      } else if (chars <= 4000) {
                        fit = { label: 'over LinkedIn limit (2000) · fits Workday', tone: 'warn' };
                      } else {
                        fit = { label: 'over 4000 — may need trimming for ATS forms', tone: 'bad' };
                      }
                      const toneClass =
                        fit.tone === 'good' ? 'text-emerald-300' :
                        fit.tone === 'warn' ? 'text-amber-300' :
                        'text-rose-300';
                      return (
                        <p
                          className="text-xs text-white/50"
                          title={`Character counts shown so you know if the letter fits common ATS paste limits. ${chars} characters / ${words} words.`}
                        >
                          <strong className="text-white/70">{words}</strong> words · <strong className="text-white/70">{chars.toLocaleString()}</strong> chars · <span className={toneClass}>{fit.label}</span>
                        </p>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Presentation Deck */}
              {results.presentation?.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Presentation Outline</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.presentation.map((slide: { title: string; content: string }, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <p className="text-white font-semibold text-sm">{slide.title}</p>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">{slide.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Prep Cards */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-violet-400" />
                    Interview Prep
                  </h3>
                  <button
                    onClick={() => setShowPrepCards(!showPrepCards)}
                    className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 font-semibold text-sm hover:bg-violet-500/30 transition-colors"
                  >
                    {showPrepCards ? 'Hide Cards' : 'Show Revision Cards'}
                  </button>
                </div>
                {showPrepCards && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {results.companySnapshot && (
                      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <p className="text-xs text-violet-400 font-bold uppercase mb-2">Know the Company</p>
                        <p className="text-white font-semibold">{results.companySnapshot.name}</p>
                        <p className="text-white/60 text-sm mt-1">{results.companySnapshot.mission}</p>
                        {results.companySnapshot.cultureSignals?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {results.companySnapshot.cultureSignals.map((s: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {results.briefSections?.roleRequirements && (
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-400 font-bold uppercase mb-2">Know the Role</p>
                        <p className="text-white/70 text-sm">{results.briefSections.roleRequirements}</p>
                      </div>
                    )}
                    {results.briefSections?.cvAlignment && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 font-bold uppercase mb-2">Why You Fit</p>
                        <p className="text-white/70 text-sm">{results.briefSections.cvAlignment}</p>
                      </div>
                    )}
                    {results.briefSections?.narrativeAngle && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-400 font-bold uppercase mb-2">Your Narrative</p>
                        <p className="text-white/70 text-sm">{results.briefSections.narrativeAngle}</p>
                      </div>
                    )}
                    {results.keyRequirements?.length > 0 && (
                      <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 sm:col-span-2">
                        <p className="text-xs text-pink-400 font-bold uppercase mb-2">Key Talking Points</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {results.keyRequirements.map((req: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                              <span className="text-white/70 text-sm">{req}{results.cvMatchPoints?.[i] ? ` — ${results.cvMatchPoints[i]}` : ''}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI Mock Interview */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-violet-400" />
                    AI Mock Interview
                    {!isPro && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold ml-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Pro / Premium
                      </span>
                    )}
                  </h3>
                  {isPro ? (
                    <button
                      onClick={() => setShowInterview(true)}
                      disabled={!hasCredits(profile, 1)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                    >
                      <Mic className="w-4 h-4" />
                      Start Interview (1 token)
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/pricing')}
                      className="px-4 py-2 rounded-lg bg-white/5 text-white/50 font-semibold text-sm hover:bg-white/10 transition-colors min-h-[44px]"
                    >
                      Upgrade to Unlock
                    </button>
                  )}
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Practice with AI-generated questions, voice recording, timed responses, and detailed evaluation with scores.
                </p>
              </div>

              {/* Follow-up Email Composer — post-analysis tool added 2026-05-11.
                  Most candidates don't follow up after an application or interview
                  even though follow-ups materially lift response rates. This
                  surfaces a 1-token tool right when the user has the company
                  context fresh + the application has just been submitted. */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-violet-400" />
                    Follow-up Email
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold ml-2">New</span>
                  </h3>
                  <button
                    onClick={() => setShowFollowup(true)}
                    disabled={!hasCredits(profile, 1)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                    aria-label="Open follow-up email composer"
                  >
                    <Mail className="w-4 h-4" />
                    Compose follow-up (1 token)
                  </button>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Generate a calibrated follow-up email after your application or interview. Pick the stage (post-application / phone-screen / on-site / final-round / offer received), pick urgency, get a short, sharp email back. Subject + body, ready to copy + send.
                </p>
              </div>

              {/* Salary Negotiation Brief — post-analysis tool added 2026-05-11.
                  This is the highest-leverage moment in a job search and most
                  candidates wing it or accept first offers. 2 tokens, returns
                  email + phone script + 5–7 in-conversation talking points +
                  risk warnings about the asks. Multi-agent reviewed before
                  ship. Not Pro-gated — every offer deserves a real strategy. */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Salary Negotiation Brief
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold ml-2">New</span>
                  </h3>
                  <button
                    onClick={() => setShowNegotiation(true)}
                    disabled={!hasCredits(profile, 2)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                    aria-label="Open salary negotiation brief composer"
                  >
                    <DollarSign className="w-4 h-4" />
                    Build negotiation brief (2 tokens)
                  </button>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Got an offer? Don't wing it. Enter what they offered + what you want (base, signing, RSU, bonus %, PTO, remote policy). Returns: a calibrated email back to the recruiter, a 60–90 second phone script, 5–7 in-conversation talking points, and warnings if any of your asks look risky for your level.
                </p>
              </div>

              {/* Post-analysis upgrade nudge — added 2026-05-07. Shown to
                  unpaid users after they've burned at least one analysis
                  worth of tokens. Concrete: 'you have X left = N more
                  analyses. Top up £5 for 6 more (never expires).'  Built
                  right under the results so it's at the natural decision
                  point ('did I get value? what next?'). */}
              {(() => {
                const tokens = profile?.token_balance ?? 0;
                const everPaid = !!(profile?.stripe_customer_id && profile.stripe_customer_id.length > 0);
                if (everPaid) return null;
                if (tokens >= 10) return null; // hasn't burned anything yet
                const analysesLeft = tokens; // 1 token = 1 analysis as of 2026-05-08
                return (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/15 to-purple-600/15 border border-violet-500/30">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {analysesLeft > 0
                            ? `${tokens} tokens left = ${analysesLeft} more ${analysesLeft === 1 ? 'analysis' : 'analyses'}`
                            : 'You\'re out of free tokens'}
                        </h3>
                        <p className="text-white/70 text-sm">
                          Top up at £5 for 20 more prep packs (never expires). Or
                          {' '}<button onClick={() => navigate('/pricing')} className="text-violet-300 underline hover:text-violet-200">
                            subscribe to Pro
                          </button>{' '}
                          for 60/month and AI Mock Interview.
                        </p>
                      </div>
                      <button
                        onClick={() => handleCheckout('starter')}
                        disabled={checkoutLoading !== null}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex-shrink-0 min-h-[44px]"
                      >
                        {checkoutLoading === 'starter' ? 'Redirecting…' : 'Top up £5'}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Interview Modal */}
        {showInterview && results && (
          <AIInterviewSession
            roleContext={`${results.companySnapshot?.name || ''} — ${results.keyRequirements?.join(', ') || ''}`}
            onClose={() => { setShowInterview(false); refreshProfile(); }}
          />
        )}

        {/* Follow-up Composer Modal — lazy-loaded so its bundle only
            arrives when the user actually opens it. Closes via onClose
            with the post-generation token balance so the parent profile
            stays in sync without a full /credits round-trip. */}
        {showFollowup && (
          <React.Suspense fallback={null}>
            <FollowupComposer
              defaultCompanyName={results?.companySnapshot?.name || ''}
              // Leave roleName blank — the analysis schema doesn't capture
              // the role title as a discrete field. User types it (it's
              // a single short field they remember from the job URL).
              defaultRoleName={''}
              defaultUserName={profile?.full_name || ''}
              userScope={user?.id}
              hasTokens={hasCredits(profile, 1)}
              onClose={(_newBalance) => {
                setShowFollowup(false);
                // Always refresh after close — server may have deducted +
                // refunded which we can't model client-side perfectly.
                refreshProfile();
              }}
            />
          </React.Suspense>
        )}

        {/* Negotiation Composer Modal — lazy-loaded. Same close-and-refresh
            pattern as Followup. 2-token cost; server handles atomic deduct
            + refund-on-failure so client-side balance can drift briefly. */}
        {showNegotiation && (
          <React.Suspense fallback={null}>
            <NegotiationComposer
              defaultCompanyName={results?.companySnapshot?.name || ''}
              defaultRoleName={''}
              defaultUserName={profile?.full_name || ''}
              userScope={user?.id}
              hasTokens={hasCredits(profile, 2)}
              onClose={(_newBalance) => {
                setShowNegotiation(false);
                refreshProfile();
              }}
            />
          </React.Suspense>
        )}
      </main>
    </div>
  );
}