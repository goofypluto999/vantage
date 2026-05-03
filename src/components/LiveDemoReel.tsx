/**
 * LiveDemoReel — 22-second animated walkthrough of the Vantage product.
 *
 * Built to mirror the REAL dashboard exactly:
 * - Same card markup (`p-6 rounded-2xl bg-white/5 border border-white/10`)
 * - Same brand gradient (#4F46E5 → #7C3AED)
 * - Same fit-score gauge (SVG, stroke-dasharray, threshold colors)
 * - Same tone-switcher pill style
 * - Same field labels ("Mission", "Industry", "Size", "Founded")
 * - Real pricing references (3 tokens free = 1 analysis on signup)
 *
 * Designed as a hero asset for the landing page. Self-contained, no external
 * deps beyond what's already in the stack (motion/react). Loops indefinitely
 * unless paused.
 *
 * Render-only — no interactive state that talks to the API.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  Mic,
  ArrowRight,
  FileText,
  Loader2,
  Play,
  Pause,
} from 'lucide-react';

// ─── Beat timeline ────────────────────────────────────────────────────────
const BEATS_MS = [
  2000, // 0  hook
  2000, // 1  upload
  2200, // 2  job url paste
  1500, // 3  analyze button + progress
  3000, // 4  company intel reveal
  2500, // 5  fit score gauge
  3500, // 6  cover letter + tone switch
  2000, // 7  mock interview
  2000, // 8  pitch outline
  1500, // 9  done + CTA
] as const;

const TOTAL_MS = BEATS_MS.reduce((a, b) => a + b, 0);

// ─── Sample data — chosen to match a believable real run ──────────────────
const SAMPLE = {
  filename: 'Giovanni_CV.pdf',
  jobUrl: 'stripe.com/jobs/listing/senior-pm-billing/SR-12345',
  company: {
    name: 'Stripe',
    industry: 'Payments infrastructure',
    size: '8,000+ employees',
    founded: '2010',
    mission: 'Increase the GDP of the internet.',
  },
  fitScore: 84,
  coverLetterOriginal:
    'Dear Stripe Hiring Team, I am writing to express my interest in the Senior PM role on Billing. With my background in payments and product, I believe I can contribute to your mission and help drive the next phase of growth.',
  coverLetterDirect:
    'Stripe Billing\'s problems — multi-currency reconciliation, marketplace payouts, tax compliance — are exactly the infrastructure work I want to do. I rebuilt a 40,000-subscription billing system at my last role and shipped 99.997% accuracy. I want this role.',
  interviewQuestion: 'Walk me through a billing system you rebuilt. What did you not migrate, and why?',
  pitchSlides: ['Opening hook', 'Why Stripe', 'My 3 proof points', 'First 90 days', 'A question for you'],
};

// ─── Inline typewriter ────────────────────────────────────────────────────
function Typewriter({ text, speedMs = 28, start = true }: { text: string; speedMs?: number; start?: boolean }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (!start) {
      setShown('');
      return;
    }
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs, start]);
  return <>{shown}</>;
}

// ─── Animated count-up ───────────────────────────────────────────────────
function CountUp({ to, durationMs = 1500 }: { to: number; durationMs?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);
  return <>{v}</>;
}

// ─── Card primitive — matches Dashboard exactly ──────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 md:p-7 rounded-2xl bg-white/5 border border-white/10 ${className}`}>{children}</div>
  );
}

// ─── Fit Score gauge — exact replica of Dashboard.tsx:752 ────────────────
function FitScoreGauge({ score }: { score: number }) {
  const dashFull = 264;
  const ringColor = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dashFull}
          initial={{ strokeDashoffset: dashFull }}
          animate={{ strokeDashoffset: dashFull - (score / 100) * dashFull }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
        <CountUp to={score} durationMs={1400} />
      </span>
    </div>
  );
}

// ─── Tone pills — matches Dashboard.tsx:839 ──────────────────────────────
const TONES = ['Original', 'Formal', 'Warm', 'Direct', 'Creative'] as const;

function TonePills({ activeTone, animateActive }: { activeTone: string; animateActive: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TONES.map((tone) => {
        const active = tone === activeTone;
        return (
          <motion.span
            key={tone}
            initial={animateActive && active ? { scale: 0.9 } : false}
            animate={animateActive && active ? { scale: 1 } : {}}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
              active ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50'
            }`}
          >
            {tone}
          </motion.span>
        );
      })}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────
interface Props {
  /** When true, plays automatically and loops. */
  autoplay?: boolean;
  /**
   * Desktop aspect ratio width:height. Defaults to 16:10 for a hero feel.
   * On screens narrower than 768px we override to a taller 4:5 ratio so
   * card content has room to breathe on phones.
   */
  aspectRatio?: string;
}

export default function LiveDemoReel({ autoplay = true, aspectRatio = '16/10' }: Props) {
  const [beat, setBeat] = useState(0);
  const [paused, setPaused] = useState(!autoplay);
  const beatStartRef = useRef<number>(performance.now());

  useEffect(() => {
    if (paused) return;
    const dur = BEATS_MS[beat];
    beatStartRef.current = performance.now();
    const id = setTimeout(() => {
      setBeat((b) => (b + 1) % BEATS_MS.length);
    }, dur);
    return () => clearTimeout(id);
  }, [beat, paused]);

  // Progress bar across the whole reel
  const totalElapsedMs = BEATS_MS.slice(0, beat).reduce((a, b) => a + b, 0);
  const progressPct = (totalElapsedMs / TOTAL_MS) * 100;

  // Mobile gets a taller aspect so the card content has room. We use a CSS
  // variable + media query approach via a style block since Tailwind doesn't
  // do dynamic aspect-ratio breakpoints inline.
  return (
    <div className="relative w-full max-w-[1500px] mx-auto">
      {/* Outer violet glow so the panel pops off the lavender background */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 md:-inset-16 rounded-[48px] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 50%, rgba(124,58,237,0.40) 0%, rgba(79,70,229,0.20) 35%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      <div
        className="reel-shell relative w-full rounded-[28px] md:rounded-[32px] overflow-hidden border border-white/15 shadow-[0_30px_80px_-20px_rgba(79,70,229,0.55),0_8px_30px_-10px_rgba(0,0,0,0.4)]"
        style={{
          background:
            'radial-gradient(circle at 20% 0%, rgba(124,58,237,0.18) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(79,70,229,0.18) 0%, transparent 50%), #0a0817',
          ['--reel-ar' as any]: aspectRatio,
          aspectRatio: 'var(--reel-ar)',
        }}
      >
      <style>{`
        @media (max-width: 767px) {
          .reel-shell { aspect-ratio: 4 / 5 !important; }
        }
      `}</style>
      {/* Top chrome — fake browser bar to anchor product context */}
      <div className="absolute top-0 left-0 right-0 h-10 md:h-11 px-4 md:px-5 flex items-center gap-2 bg-black/40 border-b border-white/5 z-10">
        <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rose-400/80" />
        <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-400/80" />
        <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-400/80" />
        <div className="ml-3 flex-1 h-5 md:h-6 rounded-md bg-white/5 px-2.5 flex items-center text-[10px] md:text-xs text-white/40 font-mono">
          vantage-livid.vercel.app/dashboard
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="text-white/40 hover:text-white/80 transition-colors"
          aria-label={paused ? 'Play' : 'Pause'}
        >
          {paused ? <Play className="w-4 h-4 md:w-5 md:h-5" /> : <Pause className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </div>

      {/* Stage */}
      <div className="absolute inset-0 pt-10 md:pt-11 pb-4 md:pb-6 px-5 md:px-10 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {/* BEAT 0 — HOOK */}
            {beat === 0 && (
              <motion.div
                key="hook"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p className="text-[11px] md:text-sm uppercase tracking-[0.2em] text-violet-300/80 mb-3 md:mb-5">
                  Vantage AI
                </p>
                <h2 className="text-2xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                  From CV to interview-ready
                  <br />
                  <span className="bg-gradient-to-r from-[#A78BFA] to-[#6366F1] bg-clip-text text-transparent">
                    in 90 seconds.
                  </span>
                </h2>
              </motion.div>
            )}

            {/* BEAT 1 — UPLOAD */}
            {beat === 1 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[480px] md:max-w-[640px]"
              >
                <p className="text-xs md:text-sm text-white/50 mb-2 md:mb-3 uppercase tracking-wider">Step 1</p>
                <GlassCard className="border-dashed">
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.div
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 20 }}
                      className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0"
                    >
                      <FileText className="w-5 h-5 md:w-7 md:h-7 text-violet-300" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-lg text-white font-semibold truncate">{SAMPLE.filename}</p>
                      <p className="text-[10px] md:text-sm text-white/40">
                        2 pages · parsed instantly
                      </p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7 text-emerald-400" />
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 2 — JOB URL PASTE */}
            {beat === 2 && (
              <motion.div
                key="url"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[520px] md:max-w-[720px]"
              >
                <p className="text-xs md:text-sm text-white/50 mb-2 md:mb-3 uppercase tracking-wider">Step 2</p>
                <GlassCard>
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <LinkIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-300" />
                    <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/40">Job URL</span>
                  </div>
                  <p className="font-mono text-sm md:text-lg text-white/90 break-all min-h-[20px] leading-relaxed">
                    <Typewriter text={SAMPLE.jobUrl} speedMs={32} />
                    <span className="inline-block w-1.5 h-4 md:h-5 bg-violet-300 ml-0.5 animate-pulse align-middle" />
                  </p>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 3 — ANALYZE */}
            {beat === 3 && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[480px] md:max-w-[640px] flex flex-col items-center"
              >
                <motion.button
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 0.96, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.4, 1] }}
                  className="px-7 md:px-10 py-3 md:py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold text-sm md:text-lg flex items-center gap-2 md:gap-3 shadow-lg shadow-violet-500/30 mb-5 md:mb-7"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  Analyze
                </motion.button>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-base text-white/60 mb-2 md:mb-3">
                  <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin text-violet-300" />
                  Reading job page · researching company · scoring fit
                </div>
                <div className="w-full h-1 md:h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: BEATS_MS[3] / 1000, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                  />
                </div>
              </motion.div>
            )}

            {/* BEAT 4 — COMPANY INTEL */}
            {beat === 4 && (
              <motion.div
                key="company"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[540px] md:max-w-[760px]"
              >
                <GlassCard>
                  <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-5">Company Intelligence</h3>
                  <p className="text-[10px] md:text-xs text-white/40 uppercase mb-1">Mission</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-white text-sm md:text-lg mb-4 md:mb-6"
                  >
                    {SAMPLE.company.mission}
                  </motion.p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[
                      ['Company', SAMPLE.company.name, 0.4],
                      ['Industry', SAMPLE.company.industry, 0.55],
                      ['Size', SAMPLE.company.size, 0.7],
                      ['Founded', SAMPLE.company.founded, 0.85],
                    ].map(([label, value, delay]) => (
                      <motion.div
                        key={label as string}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: delay as number, duration: 0.4 }}
                      >
                        <p className="text-[10px] md:text-xs text-white/40 uppercase">{label}</p>
                        <p className="text-white text-sm md:text-base font-semibold">{value as string}</p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 5 — FIT SCORE */}
            {beat === 5 && (
              <motion.div
                key="fit"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[500px] md:max-w-[680px]"
              >
                <GlassCard>
                  <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-5">CV Fit Score</h3>
                  <div className="flex items-center gap-5 md:gap-10">
                    <div className="md:scale-[1.75] md:origin-left">
                      <FitScoreGauge score={SAMPLE.fitScore} />
                    </div>
                    <div className="flex-1">
                      <p className="text-emerald-300 text-xs md:text-base font-bold uppercase tracking-wide mb-1 md:mb-3">
                        Strong fit
                      </p>
                      <p className="text-white/70 text-xs md:text-base leading-relaxed">
                        Direct billing-systems experience, exact stakeholder profile.
                        One gap: no multi-currency tax exposure.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 6 — COVER LETTER + TONE SWITCH */}
            {beat === 6 && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[560px] md:max-w-[820px]"
              >
                <GlassCard>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-sm md:text-xl font-bold text-white">Cover Letter</h3>
                  </div>
                  <div className="mb-3 md:mb-5">
                    <TonePills activeTone="Direct" animateActive={true} />
                  </div>
                  <motion.p
                    key="letter-direct"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-white/75 text-xs md:text-base font-serif leading-relaxed"
                  >
                    <Typewriter text={SAMPLE.coverLetterDirect} speedMs={14} />
                  </motion.p>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 7 — MOCK INTERVIEW */}
            {beat === 7 && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, rotateX: -8, y: 12 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[520px] md:max-w-[760px]"
                style={{ perspective: '1200px' }}
              >
                <GlassCard>
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <h3 className="text-sm md:text-xl font-bold text-white">AI Mock Interview</h3>
                    <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-violet-500/20 text-violet-300 text-[9px] md:text-[11px] uppercase tracking-wider">
                      Pro
                    </span>
                  </div>
                  <p className="text-white/85 text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
                    "{SAMPLE.interviewQuestion}"
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center"
                    >
                      <Mic className="w-4 h-4 md:w-5 md:h-5 text-rose-300" />
                    </motion.div>
                    <span className="text-xs md:text-sm text-white/50">Recording your answer…</span>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 8 — PITCH OUTLINE */}
            {beat === 8 && (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[560px] md:max-w-[820px]"
              >
                <GlassCard>
                  <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-5">5-Minute Pitch Outline</h3>
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {SAMPLE.pitchSlides.map((title, i) => (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 12, rotate: -2 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.1 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="aspect-[3/4] rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500/15 to-indigo-500/10 border border-violet-500/20 p-2 md:p-3 flex flex-col justify-between"
                      >
                        <span className="text-[8px] md:text-[11px] text-violet-300/70 uppercase tracking-wider font-mono">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] md:text-sm text-white/85 font-semibold leading-tight">
                          {title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BEAT 9 — DONE + CTA */}
            {beat === 9 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-emerald-300/80 mb-2 md:mb-3">
                  Done
                </p>
                <p className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-white tabular-nums leading-none mb-2 tracking-tight">
                  1<span className="text-white/40">:</span>32
                </p>
                <p className="text-xs md:text-lg text-white/50 mb-6 md:mb-10">Average time per analysis</p>
                <motion.button
                  initial={{ boxShadow: '0 0 0 0 rgba(124,58,237,0)' }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(124,58,237,0)',
                      '0 0 0 16px rgba(124,58,237,0.15)',
                      '0 0 0 0 rgba(124,58,237,0)',
                    ],
                  }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-7 md:px-9 py-3 md:py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold text-sm md:text-base"
                >
                  Try Vantage free
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
                <p className="text-[10px] md:text-xs text-white/40 mt-3 md:mt-4">
                  3 free analyses on signup · no card
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom progress strip */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
            />
          </div>
          <span className="text-[9px] text-white/30 font-mono tabular-nums">
            {String(beat + 1).padStart(2, '0')} / {BEATS_MS.length}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
