import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Link as LinkIcon, FileText, Download, ShieldAlert,
  ChevronRight, Loader2, File as FileIcon, ArrowLeft, Check,
  RefreshCcw, Mic, User, Target, Crown, Star, Zap, Lock,
  BrainCircuit, BarChart2, Sparkles, AlertCircle, Building2,
  Users, Calendar, Globe, ChevronDown, ChevronUp, Lightbulb,
  TrendingUp, CheckCircle2, XCircle, Briefcase, MessageSquare,
  ArrowRight, Sun, Moon
} from 'lucide-react';
import {
  generateJobIntelligence, JobIntelligence, rewriteCoverLetterTone
} from './services/ai';
import LandingPage from './components/LandingPage';
import InterviewPrep from './components/InterviewPrep';
import { ThemeProvider, useTheme, Theme } from './contexts/ThemeContext';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type Plan = 'starter' | 'pro' | 'premium';

const PLANS: Record<Plan, { name: string; price: number; credits: number; color: string; icon: any; features: string[]; }> = {
  starter: { name: 'Starter', price: 5, credits: 100, color: '#6B6B8D', icon: Zap, features: ['Strategic Brief', 'Cover Letter', 'Interview Pack', 'Flashcards', '5-Min Drill', 'Company/Role Analysis'] },
  pro: { name: 'Pro', price: 12, credits: 300, color: '#4F46E5', icon: Star, features: ['Everything in Starter', 'AI Mock Interview (voice + score)', 'Interview Stories (STAR)', 'Timed Practice', 'Mock Interview Drill'] },
  premium: { name: 'Premium', price: 20, credits: 500, color: '#7C3AED', icon: Crown, features: ['Everything in Pro', 'Presentation Deck', 'CV Fit Score Analysis', 'Beta Features Early Access', 'Priority processing'] },
};

const COST_MAP = { brief: 20, letter: 30, pack: 25, deck: 35 };

function planCanAccess(plan: Plan, feature: 'pack' | 'deck' | 'aiInterview' | 'fitScore'): boolean {
  if (feature === 'pack') return true;
  if (feature === 'deck') return plan === 'premium';
  if (feature === 'aiInterview') return plan === 'pro' || plan === 'premium';
  if (feature === 'fitScore') return plan === 'premium';
  return false;
}

// ============================================================================
// THEME PICKER MODAL
// ============================================================================
function ThemePicker({ onSelect }: { onSelect: (t: Theme) => void }) {
  const [selected, setSelected] = useState<Theme>('light');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(20,18,48,0.55)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-white/85 backdrop-blur-2xl border border-white/70 rounded-[32px] p-10 max-w-sm w-full shadow-2xl text-center"
      >
        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center mx-auto mb-5 shadow-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <p className="text-[10px] font-bold text-[#9B99B7] uppercase tracking-widest mb-2">Welcome to Vantage</p>
        <h2 className="text-2xl font-display font-bold text-[#2D2B4E] mb-1">Choose Your Experience</h2>
        <p className="text-sm text-[#6B6B8D] font-medium mb-8 leading-relaxed">How would you like Vantage to appear?<br />You can always change this in the toolbar.</p>

        {/* Toggle slider */}
        <div className="relative flex items-center bg-gray-100 rounded-full p-1.5 mx-auto max-w-[220px] mb-6">
          <motion.div
            className="absolute top-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-white rounded-full shadow-md"
            animate={{ left: selected === 'light' ? '6px' : 'calc(50% + 0px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <button
            onClick={() => setSelected('light')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-colors ${selected === 'light' ? 'text-[#2D2B4E]' : 'text-gray-400'}`}
          >
            <Sun className="w-3.5 h-3.5" /> Light
          </button>
          <button
            onClick={() => setSelected('dark')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-colors ${selected === 'dark' ? 'text-[#2D2B4E]' : 'text-gray-400'}`}
          >
            <Moon className="w-3.5 h-3.5" /> Dark
          </button>
        </div>

        {/* Preview */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-20 rounded-2xl mb-8 flex items-center justify-center gap-2 px-4 border transition-all"
          style={{
            background: selected === 'dark'
              ? 'linear-gradient(135deg, #0d0b1e, #091220)'
              : 'linear-gradient(135deg, #edeaff, #e8f4ff)',
            borderColor: selected === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.5)',
          }}
        >
          {[80, 110, 70].map((w, i) => (
            <div key={i} className="rounded-xl flex-shrink-0 border" style={{
              width: w, height: 40,
              background: selected === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.65)',
              borderColor: selected === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.5)',
            }} />
          ))}
        </motion.div>

        <button
          onClick={() => onSelect(selected)}
          className="w-full py-4 bg-[#4F46E5] text-white rounded-full font-bold text-base hover:bg-[#6366F1] transition-all hover:shadow-[0_8px_24px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:scale-95"
        >
          Continue →
        </button>
      </motion.div>
    </div>
  );
}

// ============================================================================
// THEME TOGGLE BUTTON (for nav)
// ============================================================================
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 border"
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light'
        ? <Moon className="w-3.5 h-3.5 text-[#6B6B8D]" />
        : <Sun className="w-3.5 h-3.5 text-[#A8A5E6]" />}
    </button>
  );
}

// ============================================================================
// PLAN PICKER
// ============================================================================
function PlanPicker({ onSelect }: { onSelect: (p: Plan) => void }) {
  const { t } = useTheme();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-display font-bold ${t.text}`}>Choose Your Plan</h1>
        <p className={`${t.textSub} mt-2 font-medium`}>During testing, all plans are free. Pick one to continue.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {(Object.entries(PLANS) as [Plan, typeof PLANS.starter][]).map(([key, plan]) => {
          const Icon = plan.icon;
          const isRecommended = key === 'pro';
          return (
            <motion.button
              key={key}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(key)}
              className={`relative text-left ${t.glass} rounded-[24px] border-2 p-8 hover:shadow-xl transition-all`}
              style={{ borderColor: isRecommended ? '#4F46E580' : undefined }}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">Most Popular</div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: plan.color + '20' }}>
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className={`font-display font-bold ${t.text}`}>{plan.name}</h3>
                  <span className={`text-xs ${t.textMuted} font-medium`}>{plan.credits} credits</span>
                </div>
                <div className="ml-auto">
                  <span className={`text-2xl font-mono font-bold ${t.text}`}>£{plan.price}</span>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${t.textSub} font-medium`}>
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className={`mt-6 w-full py-3 rounded-full text-sm font-bold text-center transition-colors ${isRecommended ? 'bg-[#4F46E5] text-white shadow-[0_4px_16px_rgba(79,70,229,0.4)]' : 'bg-white/20 text-current hover:bg-white/30'}`}>
                Start with {plan.name} →
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// UPGRADE MODAL
// ============================================================================
function UpgradeModal({ targetFeature, onUpgrade, onClose }: {
  targetFeature: 'aiInterview' | 'fitScore' | 'deck';
  onUpgrade: (plan: Plan) => void;
  onClose: () => void;
}) {
  const { t } = useTheme();
  const featureInfo = {
    aiInterview: { title: 'AI Mock Interview', desc: 'Record voice answers to role-specific questions and get an instant AI evaluation with scores, strengths, and improvement tips.', icon: Mic, requiredPlan: 'pro' as Plan },
    fitScore: { title: 'CV Fit Score Analysis', desc: 'Get a precise 0–100 alignment score showing exactly how well your CV matches this role.', icon: TrendingUp, requiredPlan: 'premium' as Plan },
    deck: { title: 'Presentation Deck', desc: 'A 6-slide positioning deck for final-stage interviews.', icon: BarChart2, requiredPlan: 'premium' as Plan },
  };
  const info = featureInfo[targetFeature];
  const FeatureIcon = info.icon;
  const plansThatUnlock: Plan[] = info.requiredPlan === 'pro' ? ['pro', 'premium'] : ['premium'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: t.overlayBg, backdropFilter: 'blur(12px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`${t.glass} rounded-[28px] p-8 max-w-lg w-full`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/15 flex items-center justify-center">
            <FeatureIcon className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className={`font-display font-bold text-xl ${t.text}`}>{info.title}</h3>
            <p className={`text-xs ${t.textMuted} font-medium`}>Requires {info.requiredPlan === 'pro' ? 'Pro or Premium' : 'Premium'} plan</p>
          </div>
          <button onClick={onClose} className={`ml-auto p-2 hover:bg-white/10 rounded-full ${t.textMuted} transition-colors`}>✕</button>
        </div>
        <p className={`text-sm ${t.textSub} font-medium leading-relaxed mb-6`}>{info.desc}</p>
        <div className="space-y-3 mb-6">
          {plansThatUnlock.map(planKey => {
            const plan = PLANS[planKey];
            const PlanIcon = plan.icon;
            return (
              <div key={planKey} className={`${t.cardInner} rounded-2xl p-4 flex items-center gap-4`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: plan.color + '20' }}>
                  <PlanIcon className="w-4 h-4" style={{ color: plan.color }} />
                </div>
                <div className="flex-grow">
                  <div className={`font-bold ${t.text} text-sm`}>{plan.name} — £{plan.price}/mo</div>
                  <div className={`text-xs ${t.textMuted}`}>{plan.credits} credits</div>
                </div>
                <button onClick={() => { onUpgrade(planKey); onClose(); }} className="px-5 py-2 rounded-full text-xs font-bold text-white shadow-md" style={{ backgroundColor: plan.color }}>
                  Activate Free
                </button>
              </div>
            );
          })}
        </div>
        <div className="bg-amber-50/20 border border-amber-400/20 rounded-2xl px-4 py-3 text-xs text-amber-400 font-medium flex items-center gap-2">
          <span>🔓</span>
          <span>Testing Mode — upgrades are free. Stripe billing activates on launch.</span>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// TOOL WORKSPACE
// ============================================================================
function ToolWorkspace({ onBack }: { onBack: () => void }) {
  const { theme, setTheme, t } = useTheme();
  const [showThemePicker, setShowThemePicker] = useState(() => !localStorage.getItem('vantage-theme'));
  const [step, setStep] = useState<'plan' | 'input' | 'processing' | 'results'>('plan');
  const [userPlan, setUserPlan] = useState<Plan>('pro');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [results, setResults] = useState<JobIntelligence | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingJD, setIsDraggingJD] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);
  const [outputs, setOutputs] = useState({ brief: true, letter: true, pack: true, deck: false });

  const totalCost = (outputs.brief ? COST_MAP.brief : 0) + (outputs.letter ? COST_MAP.letter : 0) + (outputs.pack ? COST_MAP.pack : 0) + (outputs.deck ? COST_MAP.deck : 0);

  const handlePlanSelect = (plan: Plan) => {
    setUserPlan(plan);
    setOutputs({ brief: true, letter: true, pack: true, deck: plan === 'premium' });
    setStep('input');
  };

  const handleStart = async () => {
    if (!cvFile) { setError('Please upload your CV.'); return; }
    if (!jobUrl && !jobDescFile) { setError('Please add a job URL or upload a job description.'); return; }
    if (totalCost === 0) { setError('Please select at least one output.'); return; }
    setError('');
    setStep('processing');
    try {
      const data = await generateJobIntelligence(cvFile, jobUrl, jobDescFile, userPlan === 'premium');
      setResults(data);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Check your API key and try again.');
      setStep('input');
    }
  };

  const planInfo = PLANS[userPlan];
  const PlanIcon = planInfo?.icon ?? Zap;

  const blobOpacity = theme === 'dark' ? 0.35 : 0.25;

  return (
    <div className="min-h-screen font-body flex flex-col relative overflow-hidden" style={{ background: t.pageBg }}>
      {/* Background blobs */}
      <div className="absolute top-[-180px] left-[-180px] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${t.blobColors[0]}, transparent 70%)`, opacity: blobOpacity }} />
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${t.blobColors[1]}, transparent 70%)`, opacity: blobOpacity * 0.8 }} />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${t.blobColors[2]}, transparent 70%)`, opacity: blobOpacity * 0.6 }} />

      {/* THEME PICKER OVERLAY */}
      <AnimatePresence>
        {showThemePicker && (
          <ThemePicker onSelect={(picked) => { setTheme(picked); setShowThemePicker(false); }} />
        )}
      </AnimatePresence>

      {/* NAV */}
      <nav className={`${t.nav} px-6 py-3 flex justify-between items-center z-50 sticky top-0`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className={`w-4 h-4 ${t.textMuted}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md">
              <BrainCircuit className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight uppercase text-[#4F46E5]">Vantage</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          {(['plan', 'input', 'processing', 'results'] as const).map((s, i) => {
            const labels = ['Plan', 'Intake', 'Processing', 'Results'];
            const order = ['plan', 'input', 'processing', 'results'];
            const isCurrent = step === s;
            const isPast = order.indexOf(step) > order.indexOf(s);
            return (
              <React.Fragment key={s}>
                {i > 0 && <div className={`w-5 h-px ${isPast ? 'bg-[#4F46E5]' : 'bg-white/20'}`} />}
                <span className={`px-3 py-1 rounded-full transition-colors ${isCurrent ? 'bg-[#4F46E5] text-white shadow-md' : isPast ? 'text-[#4F46E5]' : t.textMuted}`}>{labels[i]}</span>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {step !== 'plan' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold" style={{ borderColor: planInfo.color + '40', color: planInfo.color, backgroundColor: planInfo.color + '15' }}>
              <PlanIcon className="w-3 h-3" />
              {planInfo.name}
            </div>
          )}
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{step === 'plan' ? '—' : planInfo.credits} Credits</span>
          </div>
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <User className={`w-4 h-4 ${t.textMuted}`} />
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-grow flex flex-col items-center justify-start py-10 px-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <PlanPicker onSelect={handlePlanSelect} />
            </motion.div>
          )}

          {step === 'input' && (
            <motion.section key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="w-full max-w-5xl space-y-6">
              <div className="text-center mb-8">
                <h1 className={`text-4xl font-display font-bold ${t.text}`}>High-Stakes Role Preparation</h1>
                <p className={`${t.textSub} mt-2`}>Define your parameters. We will extract the signal.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <UploadZone label="Your CV" sublabel="PDF, DOCX, TXT" icon={Upload} file={cvFile} isDragging={isDragging} accept=".pdf,.doc,.docx,.txt" inputRef={fileInputRef} onDragOver={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) setCvFile(e.dataTransfer.files[0]); }} onChange={(e) => { if (e.target.files?.[0]) setCvFile(e.target.files[0]); }} accentColor="#4F46E5" required />
                <UploadZone label="Job Description" sublabel="Optional — PDF, DOCX" icon={FileText} file={jobDescFile} isDragging={isDraggingJD} accept=".pdf,.doc,.docx,.txt" inputRef={jdInputRef} onDragOver={() => setIsDraggingJD(true)} onDragLeave={() => setIsDraggingJD(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingJD(false); if (e.dataTransfer.files?.[0]) setJobDescFile(e.dataTransfer.files[0]); }} onChange={(e) => { if (e.target.files?.[0]) setJobDescFile(e.target.files[0]); }} accentColor="#10B981" />
                <div className={`${t.glass} rounded-[24px] p-7 flex flex-col justify-between min-h-[200px]`}>
                  <div>
                    <label className={`text-xs font-bold ${t.textMuted} uppercase tracking-widest mb-3 flex items-center gap-1.5`}>
                      <LinkIcon className="w-3.5 h-3.5" /> Company / Role URL
                    </label>
                    <input type="text" placeholder="https://careers.apple.com/role" className={`w-full border-b-2 ${t.inputBorder} py-2 font-medium focus:border-[#4F46E5] outline-none transition-colors text-sm bg-transparent ${t.text} placeholder-gray-500 mt-2`} value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} />
                  </div>
                  <p className={`text-xs ${t.textMuted} mt-3 leading-relaxed`}>We research the company's mission, news, culture, headcount, and brand voice automatically from the URL.</p>
                </div>
              </div>

              <OutputSelector outputs={outputs} setOutputs={setOutputs} totalCost={totalCost} userPlan={userPlan} />

              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium px-5 py-4 rounded-2xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <div className={`flex flex-col items-center pt-4 border-t ${t.divider}`}>
                <button onClick={handleStart} disabled={!cvFile || (!jobUrl && !jobDescFile) || totalCost === 0} className="bg-[#4F46E5] text-white px-14 py-4 rounded-full font-bold text-base hover:bg-[#6366F1] transition-all hover:shadow-[0_8px_32px_rgba(79,70,229,0.45)] hover:-translate-y-1 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 shadow-lg">
                  <Sparkles className="w-4 h-4" /> Generate Intelligence <ChevronRight className="w-4 h-4" />
                </button>
                <span className={`text-xs ${t.textMuted} mt-3 font-mono font-bold uppercase tracking-widest`}>Total Cost: {totalCost} Credits</span>
              </div>
            </motion.section>
          )}

          {step === 'processing' && <ProcessingView key="processing" />}

          {step === 'results' && results && (
            <ResultsView key="results" results={results} outputs={outputs} userPlan={userPlan} setUserPlan={setUserPlan} roleContext={jobUrl || 'the target role'} onReset={() => { setStep('input'); setCvFile(null); setJobDescFile(null); setJobUrl(''); setResults(null); setError(''); }} />
          )}
        </AnimatePresence>
      </main>

      <footer className={`relative z-10 backdrop-blur-md border-t px-6 py-3 flex justify-between items-center text-[10px] ${t.textMuted} font-bold tracking-widest ${t.footer}`}>
        <span className="flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-[#4F46E5]" /> © VANTAGE AI | USER ASSUMES LIABILITY FOR ALL USAGE</span>
        <span>SESSIONS EXPIRE IN 24H</span>
      </footer>
    </div>
  );
}

// ============================================================================
// UPLOAD ZONE
// ============================================================================
function UploadZone({ label, sublabel, icon: Icon, file, isDragging, accept, inputRef, onDragOver, onDragLeave, onDrop, onChange, accentColor, required = false }: {
  label: string; sublabel: string; icon: any; file: File | null; isDragging: boolean; accept: string; inputRef: React.RefObject<HTMLInputElement>;
  onDragOver: () => void; onDragLeave: () => void; onDrop: (e: React.DragEvent) => void; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accentColor: string; required?: boolean;
}) {
  const { t } = useTheme();
  return (
    <div className={`relative border-2 border-dashed rounded-[24px] p-7 transition-all cursor-pointer flex flex-col items-center justify-center group min-h-[200px] ${t.uploadZone}`} style={{ borderColor: isDragging ? accentColor + 'AA' : 'rgba(255,255,255,0.15)' }} onDragOver={(e) => { e.preventDefault(); onDragOver(); }} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => inputRef.current?.click()}>
      <input type="file" ref={inputRef} className="hidden" accept={accept} onChange={onChange} />
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border transition-all" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }}>
        <Icon className={`w-6 h-6 ${t.textMuted} group-hover:text-[#4F46E5] transition-colors`} style={{ color: isDragging ? accentColor : undefined }} />
      </div>
      <div className="flex items-center gap-1 mb-0.5">
        <span className={`text-xs font-bold ${t.textMuted} uppercase tracking-widest`}>{label}</span>
        {required && <span className="text-red-400 text-xs">*</span>}
      </div>
      {file ? (
        <span className="text-xs font-bold px-3 py-1 rounded-full max-w-full truncate mt-1" style={{ backgroundColor: accentColor + '20', color: accentColor }}>{file.name}</span>
      ) : (
        <span className={`text-xs ${t.textMuted} mt-1`}>{sublabel}</span>
      )}
    </div>
  );
}

// ============================================================================
// OUTPUT SELECTOR
// ============================================================================
function OutputSelector({ outputs, setOutputs, totalCost, userPlan }: {
  outputs: { brief: boolean; letter: boolean; pack: boolean; deck: boolean };
  setOutputs: React.Dispatch<React.SetStateAction<typeof outputs>>;
  totalCost: number; userPlan: Plan;
}) {
  const { t } = useTheme();
  const items = [
    { key: 'brief' as const, label: 'Strategic Brief', cost: COST_MAP.brief, plan: 'starter' as Plan, desc: 'Company intel + CV alignment' },
    { key: 'letter' as const, label: 'Cover Letter', cost: COST_MAP.letter, plan: 'starter' as Plan, desc: 'Tailored to brand voice' },
    { key: 'pack' as const, label: 'Interview Pack', cost: COST_MAP.pack, plan: 'starter' as Plan, desc: 'Questions, STAR, flashcards' },
    { key: 'deck' as const, label: 'Presentation Deck', cost: COST_MAP.deck, plan: 'premium' as Plan, desc: '6-slide positioning deck' },
  ];
  const planOrder: Plan[] = ['starter', 'pro', 'premium'];

  return (
    <div className={`${t.glass} rounded-[24px] p-7`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`font-display font-bold ${t.text}`}>Select Outputs</h3>
        <span className={`text-xs ${t.textMuted} font-mono font-bold`}>{totalCost} credits total</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(({ key, label, cost, plan, desc }) => {
          const isLocked = planOrder.indexOf(userPlan) < planOrder.indexOf(plan);
          const isChecked = outputs[key] && !isLocked;
          return (
            <label key={key} className={`relative flex flex-col p-4 rounded-2xl border-2 transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : isChecked ? 'border-[#4F46E5]/50 bg-[#4F46E5]/10 cursor-pointer' : `${t.selectorItem} border-2 hover:border-white/30 cursor-pointer`}`}>
              {isLocked && <div className="absolute top-2 right-2"><Lock className={`w-3 h-3 ${t.textMuted}`} /></div>}
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mb-3 transition-colors ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'bg-white/10 border-white/20'}`}>
                {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </div>
              <span className={`font-bold text-sm ${isChecked ? 'text-[#4F46E5]' : t.text}`}>{label}</span>
              <span className={`text-xs ${t.textMuted} mt-0.5 font-medium`}>{desc}</span>
              <span className={`text-xs font-mono font-bold ${t.textMuted} mt-2`}>{cost} cr</span>
              {isLocked && <span className="text-[9px] font-bold uppercase tracking-wider text-[#7C3AED] mt-1">{plan} only</span>}
              <input type="checkbox" className="hidden" checked={isChecked} disabled={isLocked} onChange={(e) => !isLocked && setOutputs(prev => ({ ...prev, [key]: e.target.checked }))} />
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PROCESSING VIEW
// ============================================================================
function ProcessingView() {
  const { t } = useTheme();
  const tips = ['Scanning company mission, recent news, and brand voice...', 'Mapping your CV evidence to role requirements...', 'Drafting your strategic narrative...', 'Composing your tailored cover letter...', 'Almost there — finalising your intelligence package...'];
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => { const int = setInterval(() => setTipIndex(i => (i + 1) % tips.length), 3500); return () => clearInterval(int); }, []);

  return (
    <motion.section key="processing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg py-10">
      <div className={`${t.glass} rounded-[32px] p-12 flex flex-col items-center`}>
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-10 border border-white/20" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div className="h-full bg-gradient-to-r from-[#4F46E5] via-[#A1C9F1] to-[#10B981]" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 18, ease: 'linear' }} />
        </div>
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} className="absolute inset-0 border-[3px] border-dashed border-[#A8E6CF]/40 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 12, ease: 'linear' }} className="absolute inset-2 border-[3px] border-dashed border-[#A1C9F1]/40 rounded-full" />
          <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(79,70,229,0.4)]">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
        <h3 className={`text-2xl font-display font-bold ${t.text}`}>Synthesising Intelligence</h3>
        <div className="mt-6 h-8 flex items-center overflow-hidden w-full text-center">
          <AnimatePresence mode="wait">
            <motion.p key={tipIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`text-sm ${t.textSub} font-medium w-full`}>{tips[tipIndex]}</motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================================
// RESULTS VIEW
// ============================================================================
function ResultsView({ results, outputs, userPlan, setUserPlan, roleContext, onReset }: {
  results: JobIntelligence; outputs: { brief: boolean; letter: boolean; pack: boolean; deck: boolean };
  userPlan: Plan; setUserPlan: (p: Plan) => void; roleContext: string; onReset: () => void;
}) {
  const { t } = useTheme();
  const [showAIInterview, setShowAIInterview] = useState(false);
  const [upgradeFor, setUpgradeFor] = useState<'aiInterview' | 'fitScore' | 'deck' | null>(null);
  const canAIInterview = planCanAccess(userPlan, 'aiInterview');
  const canFitScore = planCanAccess(userPlan, 'fitScore');

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl flex flex-col gap-6 lg:flex-row items-start">
      {/* LEFT */}
      <div className="flex-grow w-full space-y-6 min-w-0">
        {canFitScore && results.cvFitScore != null ? <FitScoreCard score={results.cvFitScore} summary={results.cvFitSummary ?? ''} /> : <LockedFeatureTeaser title="CV Fit Score Analysis" desc="Get a precise 0–100 compatibility score for this role." icon={TrendingUp} planLabel="Premium" onUnlock={() => setUpgradeFor('fitScore')} />}
        {results.companySnapshot && <CompanyIntelligenceCard snapshot={results.companySnapshot} />}
        {results.keyRequirements && results.cvMatchPoints && <RoleMatchCard requirements={results.keyRequirements} matches={results.cvMatchPoints} />}
        {outputs.brief && <StrategicBriefCard briefSections={results.briefSections} fallback={results.strategicBrief} />}
        {outputs.letter && <CoverLetterCard letter={results.coverLetter} />}
        {outputs.pack && (
          <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
            <div className={t.glassHeader}>
              <div className={`flex items-center gap-2 text-xs font-bold ${t.text} uppercase tracking-widest`}><Mic className="w-4 h-4 text-[#4F46E5]" /> Interview Pack</div>
              {canAIInterview
                ? <button onClick={() => setShowAIInterview(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-full hover:bg-[#6366F1] transition-colors shadow-md"><Star className="w-3 h-3" /> AI Mock Interview</button>
                : <button onClick={() => setUpgradeFor('aiInterview')} className="flex items-center gap-2 text-xs text-[#7C3AED] font-bold hover:text-[#4F46E5] transition-colors group"><Lock className="w-3 h-3 group-hover:hidden" /><Zap className="w-3 h-3 hidden group-hover:block" /> Pro feature — Unlock <ArrowRight className="w-3 h-3" /></button>}
            </div>
            <div className="p-6"><InterviewPrep /></div>
          </div>
        )}
        {outputs.deck && results.presentation?.length > 0 && <PresentationDeckCard slides={results.presentation} />}
      </div>

      {/* RIGHT sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4 lg:sticky top-20">
        {results.companySnapshot?.cultureSignals?.length > 0 && (
          <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
            <div className={t.glassHeader}>
              <div className="flex items-center gap-2"><Target className="w-4 h-4 text-[#4F46E5]" /><h4 className={`font-bold ${t.text} text-sm`}>Interview Signals</h4></div>
            </div>
            <div className="p-5 space-y-4">
              {results.companySnapshot.cultureSignals.map((signal, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]' : i === 1 ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]' : 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]'}`} />
                    <h5 className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider`}>Signal {i + 1}</h5>
                  </div>
                  <p className={`text-xs ${t.textSub} font-medium leading-relaxed p-3 rounded-xl ${t.cardInner}`}>{signal}</p>
                </div>
              ))}
              {results.companySnapshot.recentHighlights?.[0] && (
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.7)] flex-shrink-0" />
                    <h5 className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider`}>Latest News</h5>
                  </div>
                  <p className={`text-xs ${t.textSub} font-medium leading-relaxed p-3 rounded-xl ${t.cardInner}`}>{results.companySnapshot.recentHighlights[0]}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className={`${t.glass} rounded-[24px] p-5 space-y-3`}>
          <h4 className={`font-bold ${t.text} text-sm`}>Downloads</h4>
          {outputs.brief && <DownloadBtn label="Strategic Brief" format="PDF" />}
          {outputs.letter && <DownloadBtn label="Cover Letter" format="DOCX" />}
          {outputs.deck && <DownloadBtn label="Presentation Deck" format="PPTX" />}
        </div>
        <button onClick={onReset} className={`w-full py-3.5 rounded-2xl border-2 border-dashed ${t.textSub} font-bold hover:border-[#4F46E5]/60 hover:text-[#4F46E5] transition-colors flex items-center justify-center gap-2 text-sm backdrop-blur-sm`} style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
          <RefreshCcw className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {showAIInterview && <AIInterviewModal roleContext={roleContext} onClose={() => setShowAIInterview(false)} />}
      {upgradeFor && <UpgradeModal targetFeature={upgradeFor} onUpgrade={(plan) => setUserPlan(plan)} onClose={() => setUpgradeFor(null)} />}
    </motion.section>
  );
}

// ============================================================================
// RESULT COMPONENTS (all use useTheme)
// ============================================================================

function CompanyIntelligenceCard({ snapshot }: { snapshot: { name?: string; industry?: string; founded?: string; size?: string; mission: string; cultureSignals: string[]; recentHighlights: string[] } }) {
  const { t } = useTheme();
  return (
    <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
      <div className="bg-gradient-to-r from-[#2D2B4E]/80 to-[#4F46E5]/70 backdrop-blur-sm px-6 py-4 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-white/70" /><h3 className="text-xs font-bold text-white uppercase tracking-widest">Company Intelligence</h3>
      </div>
      <div className="p-6 space-y-5">
        <div className="bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-2xl px-5 py-4">
          <div className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest mb-1.5">Mission</div>
          <p className={`text-sm font-medium ${t.text} leading-relaxed italic`}>"{snapshot.mission}"</p>
        </div>
        {(snapshot.name || snapshot.industry || snapshot.size || snapshot.founded) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              snapshot.name && { icon: Building2, label: 'Company', val: snapshot.name },
              snapshot.industry && { icon: Briefcase, label: 'Industry', val: snapshot.industry },
              snapshot.size && { icon: Users, label: 'Size', val: snapshot.size },
              snapshot.founded && { icon: Calendar, label: 'Founded', val: snapshot.founded },
            ].filter(Boolean).map((item: any, i) => (
              <div key={i} className={`rounded-xl p-3 ${t.cardInner}`}>
                <div className="flex items-center gap-1.5 mb-1"><item.icon className={`w-3 h-3 ${t.textMuted}`} /><span className={`text-[9px] font-bold ${t.textMuted} uppercase tracking-widest`}>{item.label}</span></div>
                <span className={`text-xs font-bold ${t.text}`}>{item.val}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <div className={`text-[10px] font-bold ${t.textMuted} uppercase tracking-widest mb-2.5`}>Culture Signals</div>
          <div className="flex flex-wrap gap-2">
            {snapshot.cultureSignals.map((signal, i) => (
              <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full border" style={{ backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'][i % 3] + '18', borderColor: ['#4F46E5', '#10B981', '#F59E0B'][i % 3] + '35', color: ['#4F46E5', '#10B981', '#F59E0B'][i % 3] }}>{signal}</span>
            ))}
          </div>
        </div>
        {snapshot.recentHighlights?.length > 0 && (
          <div>
            <div className={`text-[10px] font-bold ${t.textMuted} uppercase tracking-widest mb-2.5`}>Recent Highlights</div>
            <div className="space-y-2">
              {snapshot.recentHighlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#4F46E5]/15 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#4F46E5]/20"><TrendingUp className="w-2.5 h-2.5 text-[#4F46E5]" /></div>
                  <p className={`text-xs ${t.textSub} font-medium leading-relaxed`}>{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleMatchCard({ requirements, matches }: { requirements: string[]; matches: string[] }) {
  const { t } = useTheme();
  const pct = Math.round((matches.filter(Boolean).length / requirements.length) * 100);
  return (
    <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
      <div className={t.glassHeader}>
        <div className={`flex items-center gap-2 text-xs font-bold ${t.text} uppercase tracking-widest`}><CheckCircle2 className="w-4 h-4 text-emerald-500" /> CV vs Role Match</div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 rounded-full overflow-hidden border border-white/20" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-[#4F46E5]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <span className="text-xs font-mono font-bold text-[#4F46E5]">{pct}% aligned</span>
        </div>
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className={`flex items-center gap-2 mb-3`}><XCircle className={`w-4 h-4 ${t.textMuted}`} /><span className={`text-xs font-bold ${t.textMuted} uppercase tracking-widest`}>What They Need</span></div>
            <div className="space-y-2">{requirements.map((req, i) => (
              <div key={i} className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ${t.cardInner}`}><span className={`text-xs font-bold ${t.textMuted} mt-0.5 font-mono`}>{i + 1}</span><span className={`text-sm ${t.text} font-medium`}>{req}</span></div>
            ))}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">What You Have</span></div>
            <div className="space-y-2">{matches.map((match, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-emerald-500/8 rounded-xl px-4 py-3 border border-emerald-500/15"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className={`text-sm ${t.text} font-medium`}>{match}</span></div>
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrategicBriefCard({ briefSections, fallback }: { briefSections?: { companyContext: string; roleRequirements: string; cvAlignment: string; narrativeAngle: string }; fallback: string }) {
  const { t } = useTheme();
  const [open, setOpen] = useState<string>('companyContext');
  const sections = [
    { key: 'companyContext', label: 'Company Context', icon: Globe, color: '#4F46E5', desc: 'Market position, goals, culture' },
    { key: 'roleRequirements', label: 'Role Decoded', icon: Briefcase, color: '#10B981', desc: 'What the role truly needs' },
    { key: 'cvAlignment', label: 'CV Alignment', icon: CheckCircle2, color: '#F59E0B', desc: 'Your specific evidence mapped' },
    { key: 'narrativeAngle', label: 'Narrative Angle', icon: MessageSquare, color: '#7C3AED', desc: 'The story to lead with' },
  ] as const;

  return (
    <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
      <div className={t.glassHeader}>
        <div className={`flex items-center gap-2 text-xs font-bold ${t.text} uppercase tracking-widest`}><FileText className="w-4 h-4 text-[#4F46E5]" /> Strategic Brief</div>
        <button className="text-[#4F46E5] flex items-center gap-1 text-xs font-bold hover:underline"><Download className="w-3 h-3" /> PDF</button>
      </div>
      {!briefSections ? (
        <div className="p-7"><p className={`${t.text} leading-relaxed whitespace-pre-wrap text-sm`}>{fallback}</p></div>
      ) : (
        <div className={`divide-y ${t.divider}`}>
          {sections.map(({ key, label, icon: SectionIcon, color, desc }) => {
            const isOpen = open === key;
            return (
              <div key={key}>
                <button onClick={() => setOpen(isOpen ? '' : key)} className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10" style={{ backgroundColor: color + '18' }}>
                    <SectionIcon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-grow">
                    <div className={`font-bold text-sm ${t.text}`}>{label}</div>
                    <div className={`text-xs ${t.textMuted}`}>{desc}</div>
                  </div>
                  {isOpen ? <ChevronUp className={`w-4 h-4 ${t.textMuted}`} /> : <ChevronDown className={`w-4 h-4 ${t.textMuted}`} />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-6 pb-6 pt-1 pl-[76px]">
                        <p className={`text-sm ${t.text} leading-[1.85] whitespace-pre-wrap`}>{briefSections[key]}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CoverLetterCard({ letter }: { letter: string }) {
  const { t } = useTheme();
  const [tone, setTone] = useState<'Formal' | 'Warm' | 'Direct' | 'Creative'>('Formal');
  const [displayLetter, setDisplayLetter] = useState(letter);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const cache = useRef<Map<string, string>>(new Map([['Formal', letter]]));

  const handleToneChange = async (newTone: typeof tone) => {
    if (newTone === tone || isRegenerating) return;
    setTone(newTone);
    if (cache.current.has(newTone)) { setDisplayLetter(cache.current.get(newTone)!); return; }
    setIsRegenerating(true);
    try {
      const rewritten = await rewriteCoverLetterTone(letter, newTone);
      cache.current.set(newTone, rewritten);
      setDisplayLetter(rewritten);
    } catch { setDisplayLetter(letter); } finally { setIsRegenerating(false); }
  };

  return (
    <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
      <div className={t.glassHeader}>
        <div className={`flex items-center gap-2 text-xs font-bold ${t.text} uppercase tracking-widest`}><FileIcon className="w-4 h-4 text-[#4F46E5]" /> Cover Letter</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/20 text-[10px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {(['Formal', 'Warm', 'Direct', 'Creative'] as const).map(t2 => (
              <button key={t2} onClick={() => handleToneChange(t2)} disabled={isRegenerating} className={`px-2 py-0.5 rounded-full transition-colors font-bold ${tone === t2 ? 'bg-[#4F46E5] text-white shadow-md' : `${t.textMuted} hover:bg-white/10`} disabled:opacity-60`}>{t2}</button>
            ))}
          </div>
          <button className="text-[#4F46E5] flex items-center gap-1 text-xs font-bold hover:underline"><Download className="w-3 h-3" /> DOCX</button>
        </div>
      </div>
      <div className="p-7">
        {isRegenerating ? (
          <div className="flex items-center justify-center gap-3 py-12"><Loader2 className="w-5 h-5 text-[#4F46E5] animate-spin" /><span className={`text-sm ${t.textSub} font-medium`}>Rewriting in {tone} tone...</span></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tone} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className={`rounded-2xl border p-7 ${t.cardInner}`}>
                <p className={`text-sm ${t.text} whitespace-pre-wrap font-serif leading-[1.9]`}>{displayLetter}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function LockedFeatureTeaser({ title, desc, icon: Icon, planLabel, onUnlock }: { title: string; desc: string; icon: any; planLabel: string; onUnlock: () => void }) {
  const { t } = useTheme();
  return (
    <motion.div className={`${t.glass} rounded-[24px] p-7 border-2 border-dashed border-[#7C3AED]/30 flex items-center gap-6`}>
      <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/15 flex items-center justify-center flex-shrink-0 border border-[#7C3AED]/20"><Icon className="w-7 h-7 text-[#7C3AED]" /></div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1"><Lock className="w-3 h-3 text-[#7C3AED]" /><span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest">{planLabel} Feature</span></div>
        <h4 className={`font-display font-bold ${t.text} mb-1`}>{title}</h4>
        <p className={`text-sm ${t.textSub} font-medium`}>{desc}</p>
      </div>
      <button onClick={onUnlock} className="flex-shrink-0 px-5 py-2.5 bg-[#7C3AED] text-white text-xs font-bold rounded-full hover:bg-[#6D28D9] transition-colors shadow-md whitespace-nowrap">Unlock →</button>
    </motion.div>
  );
}

function PresentationDeckCard({ slides }: { slides: { title: string; content: string }[] }) {
  const { t } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <div className={`${t.glass} rounded-[24px] overflow-hidden`}>
      <div className={t.glassHeader}>
        <div className={`flex items-center gap-2 text-xs font-bold ${t.text} uppercase tracking-widest`}><BarChart2 className="w-4 h-4 text-[#7C3AED]" /> Presentation Deck</div>
        <button className="text-[#4F46E5] flex items-center gap-1 text-xs font-bold hover:underline"><Download className="w-3 h-3" /> PPTX</button>
      </div>
      <div className="p-7">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-shrink-0">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)} className={`w-20 h-12 rounded-lg flex items-center justify-center text-[9px] font-bold uppercase tracking-wider border transition-all ${i === activeSlide ? 'bg-[#2D2B4E] text-white border-[#2D2B4E]/50 shadow-md' : 'bg-white/8 text-gray-500 border-white/12 hover:border-white/25'}`}>{i + 1}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeSlide} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex-grow bg-gradient-to-br from-[#2D2B4E]/90 to-[#4F46E5]/80 rounded-2xl p-8 min-h-[200px] border border-white/10">
              <h3 className="text-white font-display font-bold text-lg mb-3">{slides[activeSlide]?.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{slides[activeSlide]?.content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FitScoreCard({ score, summary }: { score: number; summary: string }) {
  const { t } = useTheme();
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className={`${t.glass} rounded-[24px] p-7 flex items-center gap-7 border border-[#7C3AED]/20`}>
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.15)" strokeWidth="10" fill="none" />
          <motion.circle cx="60" cy="60" r="52" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" style={{ strokeDasharray: circumference }} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-mono font-bold ${t.text}`}>{score}</span>
          <span className={`text-xs ${t.textMuted} font-bold`}>/ 100</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2"><Crown className="w-4 h-4 text-[#7C3AED]" /><span className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest">CV Fit Score — Premium</span></div>
        <h3 className={`font-display font-bold ${t.text} text-xl mb-2`}>{score >= 85 ? 'Excellent Match' : score >= 70 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Needs Strengthening'}</h3>
        <p className={`text-sm ${t.textSub} font-medium leading-relaxed max-w-sm`}>{summary}</p>
      </div>
    </div>
  );
}

function DownloadBtn({ label, format }: { label: string; format: string }) {
  const { t } = useTheme();
  return (
    <button className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-colors text-sm font-bold ${t.text} hover:text-[#4F46E5] ${t.cardInner} hover:border-[#4F46E5]/40`}>
      <span>{label}</span>
      <span className={`text-xs font-mono ${t.textMuted} flex items-center gap-1`}><Download className="w-3 h-3" />{format}</span>
    </button>
  );
}

// ============================================================================
// AI INTERVIEW MODAL
// ============================================================================
function AIInterviewModal({ roleContext, onClose }: { roleContext: string; onClose: () => void }) {
  const { t } = useTheme();
  const [AIInterviewSession, setAIInterviewSession] = useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => { import('./components/AIInterviewSession').then(m => setAIInterviewSession(() => m.default)).catch(() => setLoadError(true)); }, []);

  if (loadError) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: t.overlayBg, backdropFilter: 'blur(12px)' }}>
      <div className={`${t.glass} rounded-[28px] p-10 max-w-md text-center`}>
        <Star className="w-10 h-10 text-[#4F46E5] mx-auto mb-4" />
        <h3 className={`font-display font-bold text-2xl ${t.text} mb-3`}>AI Mock Interview</h3>
        <p className={`${t.textSub} font-medium mb-6`}>This feature is being built. Check back shortly.</p>
        <button onClick={onClose} className="px-8 py-3 bg-[#4F46E5] text-white rounded-full font-bold hover:bg-[#6366F1] transition-colors shadow-md">Close</button>
      </div>
    </div>
  );

  if (!AIInterviewSession) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: t.overlayBg, backdropFilter: 'blur(12px)' }}>
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    </div>
  );

  return <AIInterviewSession roleContext={roleContext} onClose={onClose} />;
}

// ============================================================================
// APP ROOT
// ============================================================================
class ErrorBoundary extends React.Component<{ children: any }, { hasError: boolean; error: any }> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #edeaff, #e8f4ff)' }}>
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-10 max-w-md text-center shadow-xl">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-[#2D2B4E] mb-2">Something went wrong</h2>
          <p className="text-sm text-[#6B6B8D] font-mono">{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-bold text-sm shadow-md">Reload</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage onStart={() => setView('workspace')} />
            </motion.div>
          ) : (
            <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ToolWorkspace onBack={() => setView('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
