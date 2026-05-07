import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Link as LinkIcon, FileText, Loader2, Sparkles, ChevronRight,
  LogOut, CreditCard, Zap, Crown, Star, Settings, Check,
  Mic, BookOpen, Lock, RefreshCw, ClipboardPaste, Type,
  Twitter, Linkedin, Copy
} from 'lucide-react';
import { useAuth } from '../App';
import { useCurrency } from '../contexts/CurrencyContext';
import { supabase, getCreditsRemaining, hasCredits } from '../lib/supabase';
import { analyzeJob, createStripeCheckout, syncSubscription, rewriteTone, fetchAnalysisHistory } from '../services/api';
import AIInterviewSession from './AIInterviewSession';
import AtsScannerSection from './AtsScannerSection';

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
              <p className={`text-xs leading-relaxed ${current ? 'text-white/70' : done ? 'text-emerald-300/60' : 'text-white/30'}`}>
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
    <div className="mt-8">
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
              <span className="text-white/30 text-xs">
                {new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex-shrink-0 ml-3">
              {loadingId === a.id ? (
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/30" />
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
  const { currency, symbol } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Sync subscription state from Stripe on every mount, then refresh profile
  useEffect(() => {
    if (user && !profile) {
      refreshProfile();
    }
    if (user && profile?.stripe_subscription_id) {
      syncSubscription().then(() => refreshProfile()).catch(() => {});
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle post-checkout return — sync from Stripe then refresh profile
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setCheckoutSuccess(true);
      setSearchParams({}, { replace: true });
      // Give webhook a moment, then force-sync from Stripe as fallback
      const timer = setTimeout(async () => {
        await syncSubscription();
        await refreshProfile();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  // Bookmarklet handoff: if the user installed the bookmark and clicked it on
  // a job page, App.tsx stored the URL in sessionStorage. Pre-fill it once,
  // then clear so we don't keep re-using stale state on revisit.
  const [jobUrl, setJobUrl] = useState(() => {
    try {
      const pending = sessionStorage.getItem('vantage:pendingJob');
      if (pending && /^https?:\/\//i.test(pending)) {
        sessionStorage.removeItem('vantage:pendingJob');
        return pending;
      }
    } catch { /* ignore */ }
    return '';
  });
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [jobDescText, setJobDescText] = useState('');
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

  const creditsRemaining = profile ? getCreditsRemaining(profile) : 0;
  const canAnalyze = hasCredits(profile, 3);
  const isPro = profile?.plan === 'pro' || profile?.plan === 'premium';

  const handleStart = async () => {
    if (!cvFile) { setError('Please upload your CV'); return; }
    if (!jobUrl) { setError('Please add a job URL'); return; }
    if (cvFile.size > 5 * 1024 * 1024) { setError('CV file is too large (max 5MB)'); return; }
    if (!canAnalyze) {
      setError('Not enough tokens. Buy more to continue!');
      return;
    }

    // Pre-flight check: warn if user is about to spend tokens on a URL that's
    // likely to fail (known-blocked sites with no JD provided). Saves wasted
    // tokens + the disappointment of a thin analysis. Mirrors the inline amber
    // warning rendered below the Job URL field, but at the moment of submit
    // it's a confirm dialog so the user can't accidentally ignore it. If the
    // URL is fine OR the JD is provided, this is a no-op.
    try {
      const host = new URL(jobUrl).hostname.toLowerCase().replace(/^www\./, '');
      const blocked = ['indeed.com', 'indeed.co.uk', 'linkedin.com', 'reed.co.uk', 'glassdoor.com', 'glassdoor.co.uk', 'totaljobs.com', 'cwjobs.co.uk', 'monster.com'];
      const isBlockedHost = blocked.some((d) => host === d || host.endsWith('.' + d));
      const hasJdProvided = (jdMode === 'file' && !!jobDescFile) ||
                            (jdMode === 'text' && jobDescText.trim().length > 50);
      if (isBlockedHost && !hasJdProvided) {
        const proceed = window.confirm(
          `${host} typically blocks automated readers, so the job page may come back empty.\n\n` +
          `Without the job description pasted in Step 2, the AI will only have the URL to work from — your analysis will likely be thin and your 3 tokens will still be charged.\n\n` +
          `Do you want to:\n` +
          `  • Cancel this run and paste the JD into Step 2 first (recommended)\n` +
          `  • Or continue anyway?\n\n` +
          `OK = continue · Cancel = stop and add the JD first`
        );
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
      setError('Not enough tokens to rewrite tone (1 token)');
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-sm font-bold text-emerald-400">{profile ? creditsRemaining : '--'} Tokens</span>
            </div>

            {profile?.plan && (
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
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

      {/* Subscription Banner — hidden for fresh users (≥7 free tokens, never paid)
          so the upload form is the first thing they see. They get the cards back
          once they've spent some tokens or come back as a returning user. This
          single conditional was the biggest dashboard friction observed in the
          UX walk: pricing cards above the upload form felt like a paywall to
          users who hadn't tried the product yet. */}
      {!checkoutSuccess && (() => {
        const tokens = profile?.token_balance ?? 0;
        const everPaid = !!(profile?.stripe_customer_id && profile.stripe_customer_id.length > 0);
        const isFreshUser = !everPaid && tokens >= 7;
        return !isFreshUser;
      })() && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20">
            {(() => {
              const tokens = profile?.token_balance ?? 0;
              const analyses = Math.floor(tokens / 3);
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

              if (tokens >= 3 && !everPaid) {
                return (
                  <>
                    <h2 className="text-lg font-display font-bold text-white mb-1">
                      You have {tokens} free tokens — that's {analyses} full {analysesWord} on us.
                    </h2>
                    <p className="text-white/50 text-sm mb-5">
                      Upload your CV + paste a job link below to run one. Top up only if you want more after that.
                    </p>
                  </>
                );
              }

              if (tokens >= 3) {
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
                  <p className="text-white/50 text-sm mb-5">Each analysis costs 3 tokens. Pick a plan to continue.</p>
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
                      <span className="text-sm text-white/40 font-normal">{plan.isTopup ? '' : '/mo'}</span>
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
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
                  const analyses = Math.floor(tokens / 3);
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

              {!canAnalyze && (
                <div className="mb-6 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-300 font-semibold text-base">You're out of free analyses.</p>
                      <p className="text-amber-100/80 text-sm mt-1 leading-relaxed">
                        £5 unlocks <strong className="text-white">6 more prep packs</strong> (CV fit score, tailored cover letter, mock interview questions, pitch outline). One-time top-up. Tokens never expire — pay once, use any time you apply.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-8">
                    <button
                      onClick={() => navigate('/pricing')}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors"
                    >
                      £5 — get 6 more prep packs
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

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
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
                        <p className="text-white/40 text-[11px] mt-1">Click to swap for a different CV</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <p className="text-white font-semibold text-sm">Upload your CV</p>
                        <p className="text-white/40 text-xs mt-1">Drop or click — PDF, DOCX, or TXT</p>
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
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${jdMode === 'text' ? 'bg-violet-600/30 text-violet-300' : 'text-white/40 hover:text-white/60'}`}
                    >
                      <Type className="w-3 h-3" /> Paste text
                    </button>
                    <button
                      onClick={() => setJdMode('file')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${jdMode === 'file' ? 'bg-violet-600/30 text-violet-300' : 'text-white/40 hover:text-white/60'}`}
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
                          <FileText className="w-6 h-6 text-white/30 mx-auto mb-1" />
                          <p className="text-white/50 text-xs">Click to upload JD file</p>
                          <p className="text-white/30 text-[10px] mt-0.5">PDF, DOCX, or TXT</p>
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
                  <p className="mt-2 text-[11px] text-white/40 leading-relaxed">
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
                <span className="text-white/70 text-sm font-normal ml-1">· uses 3 of your {profile?.token_balance ?? 0} tokens</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Explain why the button is disabled — silent disabled state was confusing
                  users who didn't realise CV + Job URL were both required. */}
              {(!cvFile || !jobUrl) && canAnalyze && (
                <p className="mt-2 text-center text-xs text-white/40">
                  {!cvFile && !jobUrl
                    ? 'Add your CV and a job posting URL above to enable.'
                    : !cvFile
                    ? 'Upload your CV above to enable.'
                    : 'Add a job posting URL above to enable.'}
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
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-white">Results</h1>
                <button
                  onClick={() => { setStep('input'); setCvFile(null); setJobUrl(''); setResults(null); }}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10"
                >
                  New Analysis
                </button>
              </div>

              {/* Company Snapshot */}
              {results.companySnapshot && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Company Intelligence</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 uppercase">Mission</p>
                      <p className="text-white">{results.companySnapshot.mission}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {results.companySnapshot.name && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Company</p>
                          <p className="text-white font-semibold">{results.companySnapshot.name}</p>
                        </div>
                      )}
                      {results.companySnapshot.industry && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Industry</p>
                          <p className="text-white">{results.companySnapshot.industry}</p>
                        </div>
                      )}
                      {results.companySnapshot.size && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Size</p>
                          <p className="text-white">{results.companySnapshot.size}</p>
                        </div>
                      )}
                      {results.companySnapshot.founded && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Founded</p>
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
                    <span className="text-[11px] uppercase tracking-wider text-white/40 mr-1">Share this score</span>
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
                        <span className="text-white/30 text-xs ml-1">1 token per tone</span>
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
                      disabled={!hasCredits(profile, 2)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      Start Interview (2 tokens)
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/pricing')}
                      className="px-4 py-2 rounded-lg bg-white/5 text-white/50 font-semibold text-sm hover:bg-white/10 transition-colors"
                    >
                      Upgrade to Unlock
                    </button>
                  )}
                </div>
                <p className="text-white/40 text-sm mt-2">
                  Practice with AI-generated questions, voice recording, timed responses, and detailed evaluation with scores.
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
                const analysesLeft = Math.floor(tokens / 3);
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
                          Top up at £5 for 6 more prep packs (20 tokens, never expires). Or
                          {' '}<button onClick={() => navigate('/pricing')} className="text-violet-300 underline hover:text-violet-200">
                            subscribe to Pro
                          </button>{' '}
                          for 18/month and AI Mock Interview.
                        </p>
                      </div>
                      <button
                        onClick={() => handleCheckout('starter')}
                        disabled={checkoutLoading !== null}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex-shrink-0"
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
      </main>
    </div>
  );
}