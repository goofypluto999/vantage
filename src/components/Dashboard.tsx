import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Link as LinkIcon, FileText, Loader2, Sparkles, ChevronRight,
  LogOut, CreditCard, Zap, Crown, Star, Settings, Check,
  Mic, BookOpen, Lock, RefreshCw, ClipboardPaste, Type
} from 'lucide-react';
import { useAuth } from '../App';
import { useCurrency } from '../contexts/CurrencyContext';
import { supabase, getCreditsRemaining, hasCredits } from '../lib/supabase';
import { analyzeJob, createStripeCheckout, syncSubscription, rewriteTone, fetchAnalysisHistory } from '../services/api';
import AIInterviewSession from './AIInterviewSession';

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
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [jobDescText, setJobDescText] = useState('');
  const [jdMode, setJdMode] = useState<'file' | 'text'>('file');
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

      {/* Checkout Success Banner */}
      {checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-semibold">Payment confirmed!</p>
                <p className="text-emerald-400/70 text-sm">Your tokens have been added to your balance.</p>
              </div>
            </div>
            <button onClick={() => setCheckoutSuccess(false)} className="text-emerald-400/50 hover:text-emerald-400 text-sm">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Subscription Banner */}
      {!checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20">
            {profile?.subscription_status === 'active' || profile?.subscription_status === 'cancelling' ? (
              <>
                <h2 className="text-lg font-display font-bold text-white mb-1">Your Plan</h2>
                <p className="text-white/50 text-sm mb-5">
                  {profile?.subscription_status === 'cancelling'
                    ? 'Your subscription will end at the end of the billing period. Tokens are kept.'
                    : 'Manage your subscription or buy more tokens.'}
                </p>
              </>
            ) : (profile?.token_balance ?? 0) >= 3 ? (
              <>
                <h2 className="text-lg font-display font-bold text-white mb-1">
                  You have {profile?.token_balance} free tokens — that's {Math.floor((profile?.token_balance ?? 0) / 3)} full {Math.floor((profile?.token_balance ?? 0) / 3) === 1 ? 'analysis' : 'analyses'} on us.
                </h2>
                <p className="text-white/50 text-sm mb-5">
                  Upload your CV + paste a job link below to run one. Top up only if you want more after that.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-display font-bold text-white mb-1">Top up to keep going</h2>
                <p className="text-white/50 text-sm mb-5">Each analysis costs 3 tokens. Pick a plan to continue.</p>
              </>
            )}
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
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-display font-bold text-white mb-2">New Analysis</h1>
                <p className="text-white/50">Upload your CV and add a job URL to get started</p>
              </div>

              {!canAnalyze && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-amber-400 font-semibold">Not enough tokens</p>
                    <p className="text-amber-400/70 text-sm">Each analysis costs 3 tokens. Buy more tokens to continue.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold text-sm"
                  >
                    Upgrade
                  </button>
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
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
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
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <p className="text-white/50 text-sm">Upload CV</p>
                        <p className="text-white/30 text-xs">PDF, DOCX, TXT</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Job Description — File or Paste */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-white/10 bg-white/5">
                  <div className="flex items-center gap-1 mb-3">
                    <button
                      onClick={() => setJdMode('file')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${jdMode === 'file' ? 'bg-violet-600/30 text-violet-300' : 'text-white/40 hover:text-white/60'}`}
                    >
                      <Upload className="w-3 h-3" /> File
                    </button>
                    <button
                      onClick={() => setJdMode('text')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${jdMode === 'text' ? 'bg-violet-600/30 text-violet-300' : 'text-white/40 hover:text-white/60'}`}
                    >
                      <Type className="w-3 h-3" /> Paste
                    </button>
                    <span className="text-white/20 text-xs ml-auto">Optional</span>
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
                          <p className="text-white/50 text-xs">Upload Job Description</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={jobDescText}
                        onChange={(e) => setJobDescText(e.target.value)}
                        placeholder="Paste job description here..."
                        className="w-full h-20 bg-transparent text-white placeholder-white/30 outline-none text-xs resize-none"
                      />
                      <button
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setJobDescText(text);
                          } catch { /* clipboard access denied */ }
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/70 text-xs transition-all"
                      >
                        <ClipboardPaste className="w-3 h-3" /> Paste
                      </button>
                    </div>
                  )}
                </div>

                {/* Job URL */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    Job URL
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-transparent text-white placeholder-white/30 outline-none text-sm"
                  />
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
                Generate Intelligence
                <span className="text-white/60 text-sm font-normal ml-1">(3 tokens)</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Analysis History */}
              <AnalysisHistory onLoad={(data: any) => { setResults(data); setStep('results'); }} />
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Analyzing...</h2>
              <p className="text-white/50">This usually takes 30-60 seconds</p>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
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