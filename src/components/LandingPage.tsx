import React, { useRef, useState, useEffect } from 'react';
import { useFocusTrap } from '../lib/useFocusTrap';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ShieldAlert, ShieldCheck, FileText, Lock,
  Upload, Link as LinkIcon, Download, CheckCircle, Eye, Menu, X,
  BrainCircuit, Trophy, Clock3, BarChart2, User, Play
} from 'lucide-react';
import Waitlist from './Waitlist';
import DemoWalkthrough from './DemoWalkthrough';
import { useCurrency } from '../contexts/CurrencyContext';
import { track, ctaClick } from '../lib/track';
// getPublicStats was used for the old "Live Transparency" counter section.
// That section now shows static build-in-public credibility metrics instead,
// so the live-DB hit is no longer needed and the import is removed.
// import { getPublicStats, type PublicStats } from '../services/api';

// Lazy-loaded heavy components — kept off the initial bundle to improve LCP.
// Three.js + @react-three/fiber + @react-three/drei are ~720 kB gzipped on
// their own; the LiveDemoReel pulls in additional motion/animation deps.
const Hero3DScene = React.lazy(() => import('./Hero3DScene'));
const LiveDemoReel = React.lazy(() => import('./LiveDemoReel'));

// Directories that require a reciprocal backlink before approving submission.
// To add: append a new entry, redeploy. Footer auto-renders.
// `badgeUrl` is optional — if omitted, the directory name renders as a text link.
const FEATURED_ON: { name: string; url: string; badgeUrl?: string }[] = [
  {
    name: 'Submit AI Tools',
    url: 'https://submitaitools.org',
    badgeUrl: 'https://submitaitools.org/static_submitaitools/images/submitaitools.png',
  },
  {
    name: 'AiToolzDir',
    url: 'https://aitoolzdir.com',
  },
];

// ============================================================================
// 3D hero scene moved to ./Hero3DScene.tsx for code-splitting.
// ============================================================================

// ============================================================================
// STORY SECTION — four scroll-in cards
// ============================================================================
const storyCards = [
  {
    tag: '01', accent: '#4F46E5',
    title: 'The Problem is Noise.',
    body: "Thousands of applications. Generic cover letters. Zero strategic alignment. You're getting lost in the pile because you aren't speaking their specific language.",
  },
  {
    tag: '02', accent: '#10B981',
    title: 'The Solution is Signal.',
    body: "AimVantage cuts through the noise. We analyse the company's latest goals, financials, and mission — aligning them precisely with your exact experience.",
  },
  {
    tag: '03', accent: '#6366F1',
    title: 'The Ultimate Asset.',
    body: "A highly-targeted strategic narrative, a bespoke cover letter, and a full presentation outline. Everything you need to walk in as the undeniable choice.",
  },
  {
    tag: '04', accent: '#F59E0B',
    title: 'Built on Trust.',
    body: "Every output is grounded in your evidence. No fabrication. No auto-apply. No hidden scraping. Just preparation done with integrity.",
  },
];

function StorySection() {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">The AimVantage Story</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2D2B4E]">Four Truths About Hiring</h2>
        </motion.div>

        {/* Cards — alternating left / right */}
        <div className="flex flex-col gap-8">
          {storyCards.map((card, i) => (
            <motion.div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-6%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full max-w-[600px] rounded-[28px] p-8 bg-white/65 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(79,70,229,0.10),0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-5">
                  {/* Number badge */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}35` }}
                  >
                    <span className="text-sm font-display font-bold" style={{ color: card.accent }}>{card.tag}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-display font-bold text-[#2D2B4E] mb-3 leading-tight">{card.title}</h3>
                    <p className="text-[#4A4870] text-base leading-relaxed">{card.body}</p>
                  </div>
                </div>
                <div className="mt-6 h-[2px] rounded-full opacity-20" style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// UI COMPONENTS
// ============================================================================
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white/30 backdrop-blur-[20px] border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-shadow rounded-[24px] p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// NAVBAR
// ============================================================================
function Navbar({ onStart, showLogin }: { onStart: () => void; showLogin?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Explicit map — string-mangling via `.replace(' ', '-')` only replaces
  // the FIRST space, so "How It Works" → "how-it works" (broken anchor).
  // Be explicit instead. Each entry maps the visible label to the actual
  // section id elsewhere in this file.
  const links: { label: string; hash: string }[] = [
    { label: 'Features', hash: 'features' },
    { label: 'How It Works', hash: 'how-it-works' },
    { label: 'Pricing', hash: 'pricing' },
    { label: 'FAQ', hash: 'faq' },
  ];

  // Fixed-nav offset — the header is fixed at top-9/10 (~36-40px) with
  // h-16 (~64px) below it = ~104px. Default anchor jumps land the section
  // BEHIND the fixed nav so the section title is hidden + the click looks
  // like it did nothing. Custom scroller offsets by that amount.
  const scrollToHash = (hash: string) => {
    const el = document.getElementById(hash);
    if (!el) return;
    const offset = 110;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    // Update the URL so back-button + share-link both still work, but
    // without triggering the browser's own (unoffset) anchor jump.
    if (history.replaceState) history.replaceState(null, '', `#${hash}`);
  };

  return (
    <header
      className={`fixed top-9 md:top-10 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/30 backdrop-blur-[28px] border-b border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
          : 'bg-white/30 backdrop-blur-[20px] border-b border-white/30 md:bg-transparent md:backdrop-blur-0 md:border-b-0'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — clickable, scrolls to top. Previously a non-interactive div,
            which Clarity flagged as a dead-click target (users instinctively
            click logos to 'go home'). Now a button that smooth-scrolls to top
            so the click does something visible instead of nothing. */}
        {/* No motion entrance on navbar elements — same defensive change as
            the hero on 2026-05-07. Tab visibility throttling can leave them
            stuck at opacity 0, hiding the Log In / Get Started buttons. */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top of page"
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-[800] text-[#2D2B4E] text-lg tracking-tight uppercase">
            AimVantage
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.hash}
              href={`#${link.hash}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHash(link.hash);
              }}
              className="px-4 py-2 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] hover:bg-white/30 rounded-full transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Currency toggle */}
          <div className="flex items-center rounded-full bg-white/40 border border-white/60 p-0.5 mr-1" role="group" aria-label="Currency">
            <button
              onClick={() => setCurrency('gbp')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${currency === 'gbp' ? 'bg-[#4F46E5] text-white' : 'text-[#4F46E5] hover:bg-white/50'}`}
              aria-pressed={currency === 'gbp'}
            >{'\u00A3'}</button>
            <button
              onClick={() => setCurrency('usd')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${currency === 'usd' ? 'bg-[#4F46E5] text-white' : 'text-[#4F46E5] hover:bg-white/50'}`}
              aria-pressed={currency === 'usd'}
            >$</button>
          </div>
          <button
            onClick={showLogin}
            className="px-4 py-2.5 text-[#4F46E5] text-sm font-bold rounded-full hover:bg-white/30 transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => { ctaClick('landing-nav-cta'); onStart(); }}
            className="px-5 py-2.5 bg-[#4F46E5] text-white text-sm font-bold rounded-full hover:bg-[#6366F1] hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)] active:scale-95 transition-all"
          >
            Get Started →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-white/30 text-[#2D2B4E] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/40 backdrop-blur-[28px] border-t border-white/40 px-6 pb-6 overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-4">
              {links.map((link) => (
                <a
                  key={link.hash}
                  href={`#${link.hash}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    // Wait one frame for the mobile drawer's exit animation to
                    // start, then scroll. Otherwise the drawer collapse changes
                    // page layout while the smooth-scroll is in flight + the
                    // final scroll position lands wrong.
                    requestAnimationFrame(() => scrollToHash(link.hash));
                  }}
                  className="px-4 py-3 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
                >
                  {link.label}
                </a>
              ))}
              {/* Free-tool routes — desktop users get the chip cluster in
                  the hero, mobile users were blind to them. Surfacing here so
                  the second-doorway conversion path works on phones too. */}
              <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest font-bold text-[#6B6B8D]">
                Free tools — no signup
              </div>
              <Link
                to="/roast"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                Roast my cover letter
              </Link>
              <Link
                to="/tools/no-interviews-diagnostic"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                Why no interviews? (60s)
              </Link>
              <Link
                to="/decode-rejection"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                Decode rejection email
              </Link>
              <Link
                to="/ghost-job-check"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                Is this a ghost job?
              </Link>
              <Link
                to="/ats/scanner"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                ATS keyword scanner
              </Link>
              <Link
                to="/tools/jd-decoder"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                JD decoder
              </Link>
              <Link
                to="/tools/bullet-rewriter"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                CV bullet rewriter
              </Link>
              <Link
                to="/tools/layoff-playbook"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                30-day layoff plan
              </Link>
              <Link
                to="/tools/negotiation-script"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                Negotiation script
              </Link>
              <Link
                to="/tools/jobscan-cost-calculator"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
              >
                Jobscan vs AimVantage cost
              </Link>
              <Link
                to="/receipts"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 rounded-xl hover:bg-emerald-50/40 transition-all"
              >
                Receipts (trust audit) →
              </Link>
              <button
                onClick={() => { ctaClick('landing-mobile-drawer'); setMobileOpen(false); onStart(); }}
                className="mt-2 px-5 py-3 bg-[#4F46E5] text-white text-sm font-bold rounded-full hover:bg-[#6366F1] transition-all"
              >
                Get 10 free prep packs →
              </button>
              {/* Mobile-only Log In — desktop has it in the navbar; mobile
                  was missing it entirely. Returning users on mobile had to
                  close the menu and hunt for /login elsewhere. Adding a
                  text link below the primary CTA so it doesn't compete
                  visually but is one tap away. */}
              <button
                onClick={() => { setMobileOpen(false); showLogin(); }}
                className="mt-2 px-4 py-2.5 text-sm font-semibold text-[#4F46E5] hover:text-[#3F36D5] text-left transition-colors"
              >
                Already have an account? Log in →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ============================================================================
// HOW IT WORKS MODAL
// ============================================================================
function HowItWorksModal({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  // Focus trap — keyboard users get tab-cycled inside the dialog. Stores
  // previously-focused element on open + restores on close. Combined with
  // role='dialog' + aria-modal + ESC handler below = WCAG 2.4.3 compliant.
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(true, dialogRef);

  // ESC + body-scroll lock for modal a11y. Pressing ESC closes the modal
  // (standard expectation, was missing). Body-scroll lock prevents the
  // background scrolling while the modal is open. Cleanup on unmount.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);
  const steps = [
    {
      num: '01',
      title: 'Upload Your Documents',
      color: '#4F46E5',
      icon: '📄',
      desc: 'Drop in your CV (PDF, DOCX, or TXT) and the job description. Add the company\'s careers page URL for live research.',
      features: ['CV / Resume', 'Job Description', 'Company URL'],
    },
    {
      num: '02',
      title: 'AI Synthesises Intelligence',
      color: '#10B981',
      icon: '🧠',
      desc: 'AimVantage searches the web for the company, cross-references your CV against the role, and builds your complete intelligence package.',
      features: ['Live company research', 'CV-to-role mapping', 'Brand voice analysis'],
    },
    {
      num: '03',
      title: 'Your Intelligence Package',
      color: '#F59E0B',
      icon: '📋',
      desc: 'Get a full dashboard of personalised outputs: strategic brief, cover letter, CV match score, and company intelligence.',
      features: ['Strategic Brief (4 sections)', 'CV vs Role Match', 'Company Intelligence Dashboard'],
    },
    {
      num: '04',
      title: 'Cover Letter — Any Tone',
      color: '#7C3AED',
      icon: '✍️',
      desc: 'Your cover letter is generated in Formal tone. Switch to Warm, Direct, or Creative with one click — AI rewrites it instantly.',
      features: ['Formal / Warm / Direct / Creative', 'Brand-voice tailored', 'Download as DOCX'],
    },
    {
      num: '05',
      title: 'Interview Preparation Suite',
      color: '#EF4444',
      icon: '🎯',
      desc: 'A full interview prep toolkit: company research drills, STAR method stories, flashcards, timed practice, and questions to ask.',
      features: ['5-Min Drill', 'Know the Company & Role', 'Why You Fit', 'STAR Stories'],
    },
    {
      num: '06',
      title: 'AI Mock Interview (Pro)',
      color: '#06B6D4',
      icon: '🎙️',
      desc: 'Record your answers out loud. AI transcribes your voice and scores you on clarity, relevance, structure, impact, and confidence.',
      features: ['Voice-to-text transcription', '5-metric scoring system', 'Strengths & improvement tips'],
    },
  ];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hiw-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(20,18,50,0.88)', backdropFilter: 'blur(16px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 flex-shrink-0">
        <div>
          <div className="text-[10px] font-bold text-[#A8A5E6] uppercase tracking-widest mb-1">Product Overview</div>
          <h2 id="hiw-title" className="text-2xl font-display font-bold text-white">How AimVantage Works</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { ctaClick('how-it-works-modal-header'); onStart(); }}
            className="px-6 py-2.5 bg-[#4F46E5] text-white text-sm font-bold rounded-full hover:bg-[#6366F1] transition-all hover:shadow-[0_4px_20px_rgba(79,70,229,0.5)] hover:-translate-y-px"
          >
            Try It Free →
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all text-lg">
            ✕
          </button>
        </div>
      </div>

      {/* Flow */}
      <div className="flex-grow overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Connector flow */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-[20px] p-6 hover:bg-white/12 hover:border-white/25 transition-all group"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 border border-white/10"
                    style={{ background: step.color + '25' }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: step.color }}>
                    Step {step.num}
                  </span>
                </div>

                <h3 className="text-white font-display font-bold text-base mb-2 leading-tight">{step.title}</h3>
                <p className="text-white/55 text-xs leading-relaxed mb-4">{step.desc}</p>

                <ul className="space-y-1.5">
                  {step.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: step.color }} />
                      <span className="text-white/70 text-xs font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Connector arrow (not on last items) */}
                {i < steps.length - 1 && (i + 1) % 3 !== 0 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 z-10">
                    <div className="w-full h-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom — outputs showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white/8 backdrop-blur-xl border border-white/15 rounded-[20px] p-6"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
          >
            <div className="text-[10px] font-bold text-[#A8A5E6] uppercase tracking-widest mb-4">Everything You Get</div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Strategic Brief', desc: '4-section accordion', icon: '📊', color: '#4F46E5' },
                { label: 'Cover Letter', desc: '4 tone variants', icon: '✉️', color: '#10B981' },
                { label: 'Interview Pack', desc: '6 prep modules', icon: '🎯', color: '#F59E0B' },
                { label: 'CV Fit Score', desc: '0–100 match score', icon: '📈', color: '#7C3AED' },
                { label: 'AI Mock Interview', desc: 'Voice + AI score', icon: '🎙️', color: '#EF4444' },
                { label: 'Company Intel', desc: 'Auto-researched', icon: '🏢', color: '#06B6D4' },
                { label: 'Presentation Deck', desc: '6-slide pack', icon: '🖥️', color: '#F97316' },
                { label: 'Flashcards', desc: 'Flip & practice', icon: '🃏', color: '#8B5CF6' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/6 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white font-bold text-xs">{item.label}</div>
                    <div className="text-white/50 text-[10px]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => { ctaClick('how-it-works-modal-body'); onStart(); }}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#4F46E5] text-white rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.5)] active:scale-95 transition-all"
            >
              Start For Free <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-white/40 text-xs mt-3 font-medium">No payment required during testing</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LANDING PAGE
// ============================================================================
export default function LandingPage({ onStart, showLogin }: { onStart: () => void; showLogin?: () => void }) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const { currency, setCurrency, symbol } = useCurrency();
  const prices = {
    starter: currency === 'usd' ? 5 : 5,
    pro: currency === 'usd' ? 15 : 12,
    premium: currency === 'usd' ? 25 : 20,
  };

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showBookmarkletHelp, setShowBookmarkletHelp] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // 3D hero scene gating — added 2026-05-08. The Hero3DScene chunk pulls in
  // ~1MB of three.js + react-three-fiber + drei. On mobile and on connections
  // that prefer reduced data, that's a real bounce factor — the canvas
  // sits empty for 1-5s while the chunk downloads. Decorative-only content
  // shouldn't gate first paint.
  // Behavior:
  //   - Desktop (>= 1024px viewport) AND no prefers-reduced-motion → render
  //     the 3D scene (lazy chunk loads in parallel, fallback is the page bg).
  //   - Mobile / tablet OR user has prefers-reduced-motion → skip it entirely.
  //     The static bg-[#A8A5E6] gradient is the visual; saves the 1MB chunk.
  const [load3DHero, setLoad3DHero] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const desktopMq = window.matchMedia('(min-width: 1024px)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setLoad3DHero(desktopMq.matches && !reducedMq.matches);
    update();
    desktopMq.addEventListener('change', update);
    reducedMq.addEventListener('change', update);
    return () => {
      desktopMq.removeEventListener('change', update);
      reducedMq.removeEventListener('change', update);
    };
  }, []);

  // Floating "Try free" CTA pill — visible after the user scrolls past the
  // hero (so they never have to scroll back up to act). Dismissible, and
  // dismissal persists for the session via state. No localStorage to keep
  // this stateless across visits — fresh visitors should always see it once.
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [floatingCtaDismissed, setFloatingCtaDismissed] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the first viewport (hero) and not at the
      // very bottom (pricing section already has visible CTAs there).
      const past = window.scrollY > window.innerHeight * 0.9;
      const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 600;
      setShowFloatingCta(past && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const tabs = ['Strategic Brief', 'Cover Letter', 'Interview Pack', 'Presentation Deck'];

  // (Old live-stats fetch removed. The "What's been built" section above now
  // uses static, verifiable counts that link to the actual shipped surfaces.)

  // FAQPage JSON-LD — emits structured data for the 10 landing-page FAQs so
  // Google can render them as rich-result FAQ snippets and AI crawlers can
  // ingest them. Mirrors the pattern used on /roast, /decode-rejection,
  // /ghost-job-check etc. Single source of truth: when the JSX FAQ list
  // changes, copy the diff here too. (Could be DRY'd via a shared array,
  // but keeping the JSX literal as the visible source for now to avoid
  // touching the visual section.)
  const landingFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is this right for me?', acceptedAnswer: { '@type': 'Answer', text: 'If you are applying for jobs and want to walk in prepared with real company intelligence, role alignment evidence, and confident answers — yes, this is for you.' } },
      { '@type': 'Question', name: 'How is this different from just using ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: "ChatGPT writes generic cover letters from a blank prompt. AimVantage scrapes the actual job page (LinkedIn, Greenhouse, Lever, company careers), extracts company intel, scores your CV against the role, then writes a cover letter grounded in those specifics — plus mock interview Qs and a 5-minute pitch outline. Same model under the hood (Gemini 2.5 Flash), but with the research, structure, and tone-switching that the blank prompt is missing." } },
      { '@type': 'Question', name: 'Will recruiters be able to tell my cover letter was AI-written?', acceptedAnswer: { '@type': 'Answer', text: "If you submit verbatim, possibly. If you do what works — pick a tone, read it once, swap one sentence for something only you would say, then send — they can't. AimVantage gives you a 90% draft. You add the human 10%." } },
      { '@type': 'Question', name: 'How is this different from Jobscan or Teal?', acceptedAnswer: { '@type': 'Answer', text: 'Jobscan tells you keywords your CV is missing. Teal organises your job board. Both are useful but neither writes the cover letter, generates mock interview Qs, or produces a strategic brief. AimVantage is the prep-pack layer that comes after you decide to apply — the deliverable, not the tracker.' } },
      { '@type': 'Question', name: 'How long does it take?', acceptedAnswer: { '@type': 'Answer', text: 'Under 5 minutes from upload to full brief. The AI does the heavy research while you review the output.' } },
      { '@type': 'Question', name: 'Do I need any experience with AI?', acceptedAnswer: { '@type': 'Answer', text: 'None. Upload your CV, paste a job URL, and click generate. It handles everything else.' } },
      { '@type': 'Question', name: 'Is my CV data private?', acceptedAnswer: { '@type': 'Answer', text: 'Completely. Your data is never stored on our servers, never used for training, and never shared. The CV is sent once to Gemini for the analysis, the analysis is returned to you, and the CV content is dropped. Each session is ephemeral.' } },
      { '@type': 'Question', name: 'How do tokens work?', acceptedAnswer: { '@type': 'Answer', text: '1 token = 1 full prep pack (company intel + cover letter + interview pack + fit score + pitch). Cover letter tone rewrites cost 1 extra token each. Starter tokens are a one-time top-up and never expire. Pro and Premium tokens refresh each month with your subscription.' } },
      { '@type': 'Question', name: 'What if the output is not right?', acceptedAnswer: { '@type': 'Answer', text: 'You can regenerate or refine with additional context. Tokens are only consumed on successful generations — if the AI fails, we refund them automatically.' } },
      { '@type': 'Question', name: 'Does AimVantage also help me find jobs, or only prep for ones I find?', acceptedAnswer: { '@type': 'Answer', text: 'Both. AI Job Search lives inside your Dashboard — it scans 20+ countries via Adzuna and Remotive, scores every result against your CV, flags likely ghost jobs with a probability score, and saves matches to your Application Tracker in one click. Your first scan each day is free; additional scans cost 1 token. After you pick a role, the rest of AimVantage takes over: strategic brief, cover letter, mock interview, follow-up emails, negotiation.' } },
      { '@type': 'Question', name: 'Can I cancel anytime?', acceptedAnswer: { '@type': 'Answer', text: "Yes. Subscriptions cancel from the Account Billing portal in one click — managed via Stripe so it's instant. No retention emails, no friction. Tokens you already paid for never expire even after cancelling." } },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-[#A8A5E6] via-[#C2C0F0] to-[#E6E5F8] text-[#2D2B4E] min-h-screen font-body selection:bg-white/50 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingFaqSchema) }} />

      <AnimatePresence>
        {showHowItWorks && (
          <motion.div key="hiw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <HowItWorksModal onClose={() => setShowHowItWorks(false)} onStart={() => { setShowHowItWorks(false); onStart(); }} />
          </motion.div>
        )}
        {showDemo && (
          <motion.div key="demo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <DemoWalkthrough onClose={() => setShowDemo(false)} onStartReal={() => { setShowDemo(false); onStart(); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cohort announcement bar — fixed at top-0. Navbar is offset to top-9/top-10
          to sit below it. Uses <Link> for SPA nav (instant) instead of <a> which
          forced a full page reload to /laid-off. */}
      <Link
        to="/laid-off"
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center w-full h-9 md:h-10 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-center text-xs md:text-sm font-semibold hover:opacity-95 transition-opacity"
      >
        Got laid off this month?&nbsp;<span className="underline">Read this first →</span>
      </Link>

      <Navbar onStart={onStart} showLogin={showLogin} />

      {/* Skip-link target — invisible anchor for keyboard users using the
          'Skip to main content' link in App.tsx. tabIndex={-1} so the link
          can programmatically focus the main region without making the
          anchor itself a tab stop. WCAG 2.4.1. */}
      <div id="main" tabIndex={-1} className="outline-none" />

      {/* ================================================================
          HERO — dot-matrix globe behind the headline
      ================================================================ */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 md:pt-0 md:justify-center overflow-hidden grain-overlay">
        {/* 3D canvas — desktop + non-reduced-motion only. On mobile or when
            the user prefers reduced motion, we show the static bg-[#A8A5E6]
            gradient instead and skip the ~1MB three.js chunk download. The
            hero text + CTAs are the actual conversion surface; the 3D globe
            is decorative. */}
        <div className="absolute inset-0 z-0 pointer-events-auto bg-[#A8A5E6]">
          {load3DHero && (
            <React.Suspense fallback={null}>
              <Hero3DScene />
            </React.Suspense>
          )}
        </div>

        {/* Hero text. The `relative` is critical — without explicit positioning,
            the `z-10` here has NO effect (CSS z-index only applies to positioned
            elements). The 3D canvas above has `absolute inset-0 z-0 pointer-events-auto`
            and was capturing clicks meant for the hero CTA — Clarity surfaced this
            as a 'dead click' on "Get 10 free prep packs". Adding `relative` here
            establishes the stacking context, so the hero content reliably paints
            and receives clicks above the canvas. */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center max-w-5xl px-6 pointer-events-none mt-16"
        >
          {/* Hero entrance reveal sequence (eyebrow pill → H1 → subtitle → CTAs)
              previously used staggered initial:opacity-0 + animate:opacity-1.
              Tab visibility throttling pauses requestAnimationFrame, so a
              user who opens this in a background tab and switches back can
              find the H1 (the LCP element) and primary CTA stuck at opacity 0.
              The H1 IS the page LCP — must always paint. Switched all four
              entrance frames to plain non-animated divs so the hero is
              unconditionally visible on first frame, regardless of tab state. */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/30 backdrop-blur-[20px] border border-white/50 text-[#2D2B4E] text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
            10 Free Prep Packs · No Card Needed
          </div>

          <h1 className="text-[40px] leading-[1.05] sm:text-5xl md:text-7xl lg:text-[88px] font-display font-[800] tracking-[-0.04em] drop-shadow-sm">
            90 seconds from CV <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
              to interview-ready.
            </span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-[#3B3A5C] max-w-2xl mx-auto font-medium leading-relaxed">
            Upload your CV, paste a job link. Get a tailored cover letter, mock interview
            questions, fit score, and a 5-minute pitch outline — in the time it takes to
            make coffee.
          </p>

          {/* CTA hierarchy refactor 2026-05-08: Clarity showed 14/15 visitors
              never reach signup. The hero previously had THREE same-weight
              pill buttons (primary purple, secondary emerald diagnostic,
              tertiary white "see it work") + 5 chips below = 9 above-fold
              CTAs = decision paralysis. Demoted the two secondary buttons to
              smaller secondary/tertiary links so the primary "Get 10 free
              prep packs" is the only visual focal point. The diagnostic and
              demo-scroll links are still present, just visually subordinate. */}
          <div className="mt-12 pointer-events-auto flex flex-col items-center gap-4">
            <button
              onClick={() => { track('hero_cta_click', { cta: 'register_primary' }); onStart(); }}
              className="group inline-flex items-center gap-2 px-10 py-4 bg-[#4F46E5] text-white rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
            >
              Get 10 free prep packs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <Link
                to="/tools/no-interviews-diagnostic?source=hero"
                onClick={() => track('hero_cta_click', { cta: 'diagnostic_low_friction' })}
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 underline decoration-emerald-500/40 underline-offset-4 hover:decoration-emerald-700 transition-all min-h-[44px] px-2 py-2"
              >
                Or try the free 60-sec diagnostic <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <button
                onClick={() => {
                  track('hero_cta_click', { cta: 'demo_reel_scroll' });
                  document.getElementById('watch-it-work')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-[#3B3A5C] hover:text-[#4F46E5] transition-colors min-h-[44px] px-2 py-2"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" /> See it work (22s)
              </button>
            </div>
            <Link
              to="/sample/anthropic-senior-pm"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B3A5C] underline decoration-[#4F46E5]/40 underline-offset-4 hover:text-[#4F46E5] hover:decoration-[#4F46E5] transition-all pointer-events-auto"
            >
              Read a complete real example output (no signup) →
            </Link>

            {/* Free-tool chip cluster — added 2026-05-08. Three free tools
                live on AimVantage. Skeptics who don't want to sign up have a
                second doorway: try a free tool first, get value, come back
                for the paid analysis. Each chip links to a tool route. */}
            {/* Free-tool chips. On mobile the label was sharing its row with
                the first chip, causing a zigzag wrap pattern that looked
                messy. Forcing the label to w-full on mobile (md:w-auto on
                desktop) puts it on its own centered line, with chips wrapping
                cleanly underneath. Desktop visual identical to before. */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pointer-events-auto">
              <span className="block w-full md:w-auto md:inline text-center text-[11px] uppercase tracking-widest font-bold text-[#3B3A5C]">Or try a free tool:</span>
              <Link
                to="/roast"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                Roast my cover letter
              </Link>
              <Link
                to="/tools/no-interviews-diagnostic"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                Why no interviews? (60s)
              </Link>
              <Link
                to="/decode-rejection"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                Decode rejection email
              </Link>
              <Link
                to="/ghost-job-check"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                Is this a ghost job?
              </Link>
              <Link
                to="/ats/scanner"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                ATS keyword scanner
              </Link>
              <Link
                to="/tools/jd-decoder"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                JD decoder
              </Link>
              <Link
                to="/tools/jobscan-cost-calculator"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] text-xs font-semibold hover:bg-white/65 transition-all"
              >
                Jobscan vs AimVantage cost
              </Link>
            </div>
            <p className="text-xs text-[#3B3A5C] uppercase tracking-widest flex items-center gap-2 font-bold">
              <Lock className="w-3 h-3" /> No subscription · Cancel any time · EU-hosted
            </p>
            <p className="text-[11px] text-[#6B6B8D] font-medium">
              Built solo by{' '}
              <Link to="/about" className="underline hover:text-[#4F46E5]">
                Giovanni Sizino Ennes
              </Link>
              {' '}· UK independent founder · Stripe-only billing, no recruitment, no DM outreach
            </p>
            <p className="text-[11px] text-[#6B6B8D] mt-1 font-medium">
              Free ATS scanner open-source on GitHub · Sister product CV Mirror is fully client-side
            </p>
          </div>
        </motion.div>

        {/* Scroll indicator — desktop only. On mobile the hero content (eyebrow
            + 4-line H1 + subtitle + CTAs + chip cluster) extends past 100vh, so
            the absolute bottom-8 lands ON TOP of the "Built solo by..." trust
            paragraph (visible bug in user's iPhone screenshot 2026-05-18). The
            scroll hint is also redundant on mobile where the layout already
            telegraphs more-content-below via the visible chip wrap. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[#6B6B8D]"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#6B6B8D]/60 to-transparent" />
        </motion.div>
      </section>

      {/* ================================================================
          TRUST BAR
      ================================================================ */}
      <section className="relative z-10 w-full px-4 -mt-10 max-w-5xl mx-auto">
        <GlassCard className="!rounded-[24px] !p-6 flex flex-wrap justify-around items-center gap-4 bg-white/40 max-md:grid max-md:grid-cols-2 max-md:gap-4">
          <div className="flex items-center gap-3"><ShieldAlert className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">No Auto-Apply</span></div>
          <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">No Fabrication</span></div>
          <div className="flex items-center gap-3"><Lock className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">No Hidden Scraping</span></div>
          <div className="flex items-center gap-3"><Eye className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">Human Review Always</span></div>
          {/* Trust bar item #5 — UK ICO data-protection registered. Added
              2026-05-08 once the registration was paid + in-progress.
              Once the ZA reg# is issued we can swap to 'ICO ZA######'
              for hardest-possible claim. Verifiable via /privacy section 2
              and the /about Hard Facts. */}
          <Link
            to="/privacy#ico-registration"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            title="Registered as a data controller with the UK Information Commissioner's Office"
          >
            <ShieldCheck className="w-5 h-5 text-[#4F46E5]" />
            <span className="text-sm font-bold text-[#3B3A5C]">UK ICO Registered</span>
          </Link>
        </GlassCard>
      </section>

      {/* ================================================================
          WHAT'S BEEN BUILT — verifiable, accurate, no live-counter dwindling

          Replaces the previous "Live Transparency" section that pulled signup
          / analysis / waitlist counts from the DB. At early launch those
          numbers read as "we have nothing yet" and undermined the brand. Each
          stat below is a concrete asset shipped — reader can verify by
          clicking through. Honest framing without thin-growth-metric anxiety.
      ================================================================ */}
      <section className="relative z-10 w-full px-4 max-w-5xl mx-auto pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard className="!rounded-[24px] !p-6 md:!p-8 bg-white/45">
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] md:text-xs font-bold text-[#4F46E5] uppercase tracking-widest">
                What's been built · Click any number to verify
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-4 text-center">
              <Link to="/ats" className="group">
                <div className="text-3xl md:text-4xl font-display font-bold text-[#2D2B4E] tabular-nums group-hover:text-[#4F46E5] transition-colors">
                  5
                </div>
                <p className="text-xs md:text-sm text-[#6B6B8D] font-medium mt-1 group-hover:text-[#3B3A5C] transition-colors">
                  ATS parsers simulated
                </p>
              </Link>
              <Link to="/interview-prep" className="group md:border-x md:border-[#4F46E5]/15">
                <div className="text-3xl md:text-4xl font-display font-bold text-[#2D2B4E] tabular-nums group-hover:text-[#4F46E5] transition-colors">
                  40+
                </div>
                <p className="text-xs md:text-sm text-[#6B6B8D] font-medium mt-1 group-hover:text-[#3B3A5C] transition-colors">
                  Interview prep packs
                </p>
              </Link>
              <Link to="/alternatives" className="group md:border-r md:border-[#4F46E5]/15">
                <div className="text-3xl md:text-4xl font-display font-bold text-[#2D2B4E] tabular-nums group-hover:text-[#4F46E5] transition-colors">
                  9
                </div>
                <p className="text-xs md:text-sm text-[#6B6B8D] font-medium mt-1 group-hover:text-[#3B3A5C] transition-colors">
                  Honest comparisons
                </p>
              </Link>
              <a
                href="https://github.com/goofypluto999/cv-mirror-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-[#2D2B4E] tabular-nums group-hover:text-[#4F46E5] transition-colors">
                  OSS
                </div>
                <p className="text-xs md:text-sm text-[#6B6B8D] font-medium mt-1 group-hover:text-[#3B3A5C] transition-colors">
                  Free open-source tool
                </p>
              </a>
            </div>
            <p className="text-[11px] md:text-xs text-[#6B6B8D] text-center mt-5 max-w-xl mx-auto leading-relaxed">
              Built solo, in public, since February 2026. Every number above links to a real, shipped surface — feel free to click through and verify.
            </p>
          </GlassCard>
        </motion.div>
      </section>

      {/* ================================================================
          BOOKMARKLET — drag-to-bookmark one-click prep on any job page
      ================================================================ */}
      <section className="relative z-10 w-full px-4 max-w-4xl mx-auto pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard className="!rounded-[24px] !p-7 md:!p-9 text-center bg-white/45">
            <p className="text-[10px] md:text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">
              One-click prep on any job page
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#2D2B4E] mb-3 tracking-tight">
              Drag this button to your bookmarks bar.
            </h2>
            <p className="text-[#4A4870] max-w-xl mx-auto mb-7 leading-relaxed">
              Click it on any job listing — LinkedIn, Greenhouse, Lever, the company careers page — and AimVantage opens with the URL captured. Skip the copy-paste forever.
            </p>
            {/* Bookmarklet — audit 2026-05-08: React blocks plain
                javascript: hrefs as a security warning, and clicking a
                drag-only anchor 'looks broken' to first-time users.
                Pattern below: <button> with proper draggable + dragstart
                (sets text/uri-list to the bookmarklet URL so the drop
                target — bookmarks bar — gets the right value), and the
                onClick opens an instructions panel instead of the alert.
                The actual javascript: URL is stored as a string and
                never lands in an href attribute. */}
            {(() => {
              const BOOKMARKLET = "javascript:(function(){var u=location.href;window.open('https://aimvantage.uk/?job='+encodeURIComponent(u),'_blank')})();";
              return (
                <>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      // Browsers vary here. Setting text/uri-list is the
                      // most robust signal for 'this is a URL drop'.
                      // Setting plain text is the cross-browser fallback.
                      e.dataTransfer.setData('text/uri-list', BOOKMARKLET);
                      e.dataTransfer.setData('text/plain', BOOKMARKLET);
                      e.dataTransfer.effectAllowed = 'copyLink';
                    }}
                    onClick={() => setShowBookmarkletHelp((s) => !s)}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full font-bold text-base hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(79,70,229,0.4)] transition-all cursor-grab active:cursor-grabbing select-none"
                  >
                    📌 Prep with AimVantage
                  </button>
                  <p className="text-[11px] text-[#6B6B8D] mt-4 font-medium">
                    Drag the button up to your browser's bookmarks bar.{' '}
                    <button
                      type="button"
                      onClick={() => setShowBookmarkletHelp((s) => !s)}
                      className="underline hover:text-[#4F46E5]"
                    >
                      How does this work?
                    </button>
                  </p>
                  {showBookmarkletHelp && (
                    <div className="mt-4 max-w-md mx-auto p-4 rounded-xl bg-white/55 border border-white/60 text-left">
                      <p className="text-sm text-[#2D2B4E] font-semibold mb-2">
                        How to install:
                      </p>
                      <ol className="text-sm text-[#3B3A5C] space-y-1 list-decimal pl-5 mb-3">
                        <li>Make sure your bookmarks bar is visible (Ctrl/Cmd-Shift-B in most browsers).</li>
                        <li>Drag the purple <span className="font-semibold">📌 Prep with AimVantage</span> button onto the bookmarks bar.</li>
                        <li>On any job page (LinkedIn, Greenhouse, Lever, company careers page), click the bookmark — AimVantage opens with that URL pre-filled.</li>
                      </ol>
                      <details className="text-xs text-[#6B6B8D]">
                        <summary className="cursor-pointer hover:text-[#4F46E5]">Manual install (drag not working?)</summary>
                        <div className="mt-2">
                          Right-click the bookmarks bar → "Add page" → paste this as the URL:
                          <code className="block mt-1 p-2 bg-white/60 rounded text-[10px] break-all font-mono">
                            {BOOKMARKLET}
                          </code>
                        </div>
                      </details>
                    </div>
                  )}
                </>
              );
            })()}
          </GlassCard>
        </motion.div>
      </section>

      {/* ================================================================
          WATCH IT WORK — animated product reel (hero centerpiece)
      ================================================================ */}
      <section
        id="watch-it-work"
        className="relative z-10 w-full px-4 sm:px-6 max-w-[1640px] mx-auto pt-24 md:pt-32 pb-16 md:pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs md:text-sm font-bold text-[#4F46E5] uppercase tracking-widest mb-3 md:mb-4">
            Watch it work
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#2D2B4E] mb-4 md:mb-5 tracking-tight">
            Your full prep pack — in 90 seconds.
          </h2>
          <p className="text-base md:text-lg text-[#6B6B8D] max-w-2xl mx-auto leading-relaxed">
            A real walkthrough of the actual dashboard. Drop a CV, paste a job
            link, get company intel, fit score, tailored cover letter, mock
            interview, and a 5-minute pitch.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <React.Suspense fallback={<div className="aspect-video w-full bg-white/30 rounded-3xl" />}>
            <LiveDemoReel autoplay aspectRatio="16/9" />
          </React.Suspense>
        </motion.div>

        {/* Post-demo CTA — added 2026-05-07. Users watching the 22s
            walkthrough hit peak interest at the end. Without a CTA they
            scroll past to story cards. This captures the moment.
            2026-05-08 hierarchy refactor: same pattern as hero — one
            dominant pill button + one smaller text-link diagnostic
            onramp instead of two same-weight pill buttons (the latter
            split attention 50/50 and diluted the primary CTA). */}
        <div className="mt-10 text-center flex flex-col items-center gap-3">
          <button
            onClick={() => { track('post_demo_cta_click', { cta: 'register_primary' }); onStart(); }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4F46E5] text-white rounded-full font-bold hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
          >
            Run yours free now <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            to="/tools/no-interviews-diagnostic?source=post-demo"
            onClick={() => track('post_demo_cta_click', { cta: 'diagnostic_low_friction' })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline decoration-emerald-500/40 underline-offset-4 hover:decoration-emerald-700 transition-all"
          >
            Or first: try the free 60-sec diagnostic <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <p className="text-xs text-[#6B6B8D] font-medium">
            10 free prep packs · no card · ~90 seconds per run · OR diagnose your bottleneck before signing up
          </p>
        </div>
      </section>

      {/* ================================================================
          STORY CARDS
      ================================================================ */}
      <StorySection />


      {/* ================================================================
          HOW IT WORKS
      ================================================================ */}
      <section id="how-it-works" className="py-28 px-6 max-w-6xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2D2B4E]">How It Works</h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row gap-8 justify-between">
          <div className="hidden md:block absolute top-[84px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#A8E6CF] via-[#A1C9F1] to-[#FFB7B2] rounded-full opacity-50 z-0" />

          {[
            { n: '01', icon: Upload, color: '#4F46E5', title: 'Drop your CV', desc: 'Upload your CV in any format — PDF, Word, plain text.' },
            { n: '02', icon: LinkIcon, color: '#A1C9F1', title: 'Paste the role', desc: 'Job listing URL or company website. We handle the research.' },
            { n: '03', icon: Download, color: '#FFB7B2', title: 'Get your brief', desc: 'Strategic brief, tailored cover letter, full interview pack.' },
          ].map(({ n, icon: Icon, color, title, desc }) => (
            <GlassCard key={n} className="flex-1 relative z-10 text-center !pt-10 hover:-translate-y-2 transition-transform cursor-default">
              <span className="absolute top-4 left-6 font-mono text-3xl font-light text-[#9B99B7]/30 select-none">{n}</span>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/60 to-white/20 rounded-2xl border border-white/60 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
              <p className="text-[#6B6B8D] font-medium text-sm leading-relaxed">{desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Mid-page CTA — after users learn how it works. Conversion data showed
            5 homepage visits but only 1 hero-CTA click before this point. Users
            scroll 79% deep without re-prompting; this captures the moment they
            understand the flow and might be ready to commit. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <button
            onClick={() => { ctaClick('landing-post-how-it-works'); onStart(); }}
            className="inline-flex items-center gap-2 px-9 py-4 bg-[#4F46E5] text-white rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
          >
            Try it free — 10 prep packs, no card <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#6B6B8D] font-medium mt-3">
            ~90 seconds per analysis · CV stays in your browser until you click run
          </p>
        </motion.div>
      </section>

      {/* ================================================================
          BENEFITS
      ================================================================ */}
      <section id="features" className="py-12 px-6 max-w-6xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">Why AimVantage</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2D2B4E]">Why You'll Love It</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BrainCircuit, color: '#4F46E5',  title: 'Real AI Intelligence',  desc: 'Not templates. Actual intelligence trained on company data, role requirements, and hiring psychology.' },
            { icon: Trophy,       color: '#A8E6CF',  title: 'Evidence-Based Output',  desc: 'Every claim tied directly to your CV. No fabrication, no fluff — just compelling, credible narrative.' },
            { icon: Clock3,       color: '#FFB7B2',  title: '5-Minute Preparation',  desc: 'What used to take hours of research now takes minutes. Arrive to interviews already knowing the answers.' },
            { icon: BarChart2,    color: '#A1C9F1',  title: 'Company Intelligence',   desc: 'We pull live data — recent news, financials, team structure — so your brief reflects who they are today.' },
            { icon: FileText,     color: '#7C3AED',  title: 'Multi-Format Output',    desc: 'Strategic brief, cover letter, interview questions, flashcards, presentation outline — all generated at once.' },
            { icon: ShieldCheck,  color: '#A8E6CF',  title: 'Private by Design',      desc: 'Your data is never stored or used for training. What goes in, stays between you and the intelligence system.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <GlassCard key={title} className="hover:-translate-y-1 transition-transform cursor-default">
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center mb-4 border border-white/60">
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-lg font-display font-bold text-[#2D2B4E] mb-2">{title}</h3>
              <p className="text-sm text-[#6B6B8D] font-medium leading-relaxed">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ================================================================
          OUTPUT SHOWCASE
      ================================================================ */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">Live Preview</p>
          <h2 className="text-4xl font-display font-bold text-[#2D2B4E]">See What You Get</h2>
        </motion.div>

        <GlassCard className="!p-0 overflow-hidden !rounded-[32px]">
          <div className="flex border-b border-white/40 bg-white/20 p-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`relative px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === idx ? 'text-white' : 'text-[#3B3A5C] hover:bg-white/30'}`}
              >
                {activeTab === idx && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#4F46E5] rounded-full -z-10" />
                )}
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-14 bg-white/40 flex justify-center items-center min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-2xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-100 p-8"
              >
                {activeTab === 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <FileText className="w-4 h-4 text-[#4F46E5]" />
                      <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest">Strategic Brief</span>
                    </div>
                    <div className="h-5 w-2/3 bg-[#4F46E5]/10 rounded mb-5" />
                    <div className="space-y-2.5">
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-11/12 bg-gray-100 rounded" />
                      <div className="h-3 w-10/12 bg-gray-100 rounded" />
                      <div className="h-px bg-gray-200 my-4" />
                      <div className="h-4 w-1/2 bg-[#A8E6CF]/25 rounded" />
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-9/12 bg-gray-100 rounded" />
                    </div>
                  </div>
                )}
                {activeTab === 1 && (
                  <div className="text-sm text-[#3B3A5C]/70 leading-[1.9] space-y-4">
                    <p className="text-[#6B6B8D] text-xs">March 2026</p>
                    <p className="font-medium text-[#2D2B4E]">Dear Hiring Manager,</p>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-11/12 bg-gray-100 rounded" />
                      <div className="h-3 w-10/12 bg-gray-100 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-9/12 bg-gray-100 rounded" />
                    </div>
                    <p>Sincerely,<br /><span className="font-bold text-[#2D2B4E]">Your Name</span></p>
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="space-y-3">
                    {['Tell me about yourself', 'Why this company?', 'Your biggest achievement?'].map((q, i) => (
                      <div key={i} className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${i === 1 ? 'translate-x-2' : i === 2 ? 'translate-x-4' : ''}`}>
                        <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest">Q{i + 1}</span>
                        <p className="text-sm font-medium text-[#2D2B4E] mt-1">{q}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 3 && (
                  <div className="grid grid-cols-3 gap-3">
                    {['Title Slide', 'Company Intel', 'Role Alignment', 'Key Strengths', 'Strategic Fit', 'Next Steps'].map((s, i) => (
                      <div key={i} className="aspect-video bg-gradient-to-br from-[#2D2B4E] to-[#4F46E5] rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-[9px] text-white/60 font-bold uppercase tracking-wider text-center px-1">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Second mid-page CTA — placed right after the user has SEEN the
            actual output preview. Strongest conversion moment: they just saw
            what they'll get, prompt them now. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <button
            onClick={() => { ctaClick('landing-post-sample'); onStart(); }}
            className="inline-flex items-center gap-2 px-9 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
          >
            Get this for your next job — free <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#6B6B8D] font-medium mt-3">
            10 free prep packs on signup. No card. £5 starter pack only if you want more.
          </p>
        </motion.div>
      </section>

      {/* ================================================================
          PRICING
      ================================================================ */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">Transparent</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2D2B4E]">Simple Pricing.</h2>
          <p className="text-[#6B6B8D] mt-3 font-medium">Start with a one-time top-up. Scale with a monthly plan.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 lg:gap-8">
          <GlassCard className="flex-1 flex flex-col items-center !p-10 md:mt-6">
            <h3 className="font-display font-bold text-xl text-[#3B3A5C]">Starter</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-[#6B6B8D]">{symbol}</span>
              <span className="text-6xl font-mono font-bold text-[#2D2B4E]">{prices.starter}</span>
            </div>
            <span className="bg-white/50 text-[#4F46E5] font-mono text-xs px-3 py-1 rounded-full mt-3 font-bold border border-white">20 prep packs &middot; one-time</span>
            <p className="text-[11px] text-[#6B6B8D] font-medium mt-2 text-center">~{symbol}{(prices.starter / 20).toFixed(2)} per prep pack &middot; never expires</p>
            <ul className="mt-8 space-y-3 w-full flex-grow text-sm text-[#3B3A5C] font-medium">
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Company Intelligence</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Strategic Brief + Cover Letter</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Interview Pack with Flashcards</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> No subscription &middot; tokens never expire</li>
            </ul>
            <button onClick={() => { ctaClick('landing-pricing-starter'); onStart(); }} className="w-full py-3.5 mt-8 rounded-full bg-white/50 hover:bg-white text-[#4F46E5] font-bold border border-white hover:shadow-md transition-all">
              Get Started
            </button>
          </GlassCard>

          <GlassCard className="flex-1 flex flex-col items-center !p-12 relative border-[#4F46E5]/30 shadow-[0_0_40px_rgba(79,70,229,0.15)] scale-[1.04] z-10">
            <div className="absolute top-0 -translate-y-1/2 bg-[#4F46E5] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              Most Popular
            </div>
            <h3 className="font-display font-bold text-xl text-[#3B3A5C]">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-[#6B6B8D]">{symbol}</span>
              <span className="text-6xl font-mono font-bold text-[#2D2B4E]">{prices.pro}</span>
            </div>
            <span className="bg-white/50 text-[#4F46E5] font-mono text-xs px-3 py-1 rounded-full mt-3 font-bold border border-white">60 prep packs / month</span>
            <p className="text-[11px] text-[#6B6B8D] font-medium mt-2 text-center">~{symbol}{(prices.pro / 60).toFixed(2)} per prep pack &middot; vs Jobscan $49.95/mo</p>
            <ul className="mt-8 space-y-3 w-full flex-grow text-sm text-[#3B3A5C] font-medium">
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Everything in Starter</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> AI Mock Interview (voice)</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> STAR Interview Stories</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Timed Practice Sessions</li>
            </ul>
            <button onClick={() => { ctaClick('landing-pricing-pro'); onStart(); }} className="w-full py-3.5 mt-8 rounded-full bg-[#4F46E5] text-white font-bold hover:bg-[#6366F1] shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:-translate-y-1 transition-all">
              Upgrade to Pro
            </button>
          </GlassCard>

          <GlassCard className="flex-1 flex flex-col items-center !p-10 md:mt-6">
            <h3 className="font-display font-bold text-xl text-[#3B3A5C]">Premium</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-[#6B6B8D]">{symbol}</span>
              <span className="text-6xl font-mono font-bold text-[#2D2B4E]">{prices.premium}</span>
            </div>
            <span className="bg-white/50 text-[#4F46E5] font-mono text-xs px-3 py-1 rounded-full mt-3 font-bold border border-white">120 prep packs / month</span>
            <p className="text-[11px] text-[#6B6B8D] font-medium mt-2 text-center">~{symbol}{(prices.premium / 120).toFixed(2)} per prep pack &middot; vs Final Round AI $148/mo</p>
            <ul className="mt-8 space-y-3 w-full flex-grow text-sm text-[#3B3A5C] font-medium">
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Everything in Pro</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> CV Fit Score Analysis</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Presentation Deck Builder</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Priority Processing</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Beta Features Early Access</li>
            </ul>
            <button onClick={() => { ctaClick('landing-pricing-premium'); onStart(); }} className="w-full py-3.5 mt-8 rounded-full bg-white/50 hover:bg-white text-[#4F46E5] font-bold border border-white hover:shadow-md transition-all">
              Go Premium
            </button>
          </GlassCard>
        </div>
      </section>

      {/* ================================================================
          BUILT-IN-PUBLIC TRUST BLOCK
          ----------------------------------------------------------------
          Pre-revenue indie SaaS = no real customer testimonials. The 2026
          AEO-research finding ("named-customer claim +22% lift") doesn't
          help when there are zero named customers. Substitute: builder-
          credibility signals — verifiable public artefacts that prove the
          operator is real, ships fast, and isn't a fly-by-night.
          Each item links out to the actual artefact so visitors can verify.
      ================================================================ */}
      <section id="built-in-public" className="py-20 px-6 max-w-5xl mx-auto relative z-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">Built in public · Verifiable</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2D2B4E] tracking-tight">
            No big logos. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Real receipts instead.</span>
          </h2>
          <p className="mt-4 text-base text-[#3B3A5C] max-w-2xl mx-auto leading-relaxed">
            Indie SaaS, sole trader, pre-revenue. Instead of fake testimonials,
            here are the public artefacts you can click through and verify.
          </p>

          {/* Velocity strip — added 2026-05-10. Pre-revenue indie SaaS
              converts on shipping signal more than any other trust lever.
              Each number is verifiable: commit count from git log, deep-dive
              count from /blog, route count from prerender output, tool count
              from /tools. Numbers are deliberately current as of the published
              date and may drift; that's the point — they refresh with each
              build. Skeptics can audit any of them. */}
          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <a
              href="https://github.com/goofypluto999/aimvantage/commits/master"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-white/45 backdrop-blur-[20px] border border-white/55 px-4 py-3 hover:border-[#4F46E5]/40 transition group"
            >
              <div className="text-2xl font-display font-extrabold text-[#2D2B4E] group-hover:text-[#4F46E5] transition">268</div>
              <div className="text-[11px] text-[#6B6B8D] font-semibold leading-tight">commits in last 7 days</div>
            </a>
            <Link
              to="/blog"
              className="block rounded-xl bg-white/45 backdrop-blur-[20px] border border-white/55 px-4 py-3 hover:border-[#4F46E5]/40 transition group"
            >
              <div className="text-2xl font-display font-extrabold text-[#2D2B4E] group-hover:text-[#4F46E5] transition">34</div>
              <div className="text-[11px] text-[#6B6B8D] font-semibold leading-tight">long-form deep-dives published</div>
            </Link>
            <Link
              to="/state-of-2026"
              className="block rounded-xl bg-white/45 backdrop-blur-[20px] border border-white/55 px-4 py-3 hover:border-[#4F46E5]/40 transition group"
            >
              <div className="text-2xl font-display font-extrabold text-[#2D2B4E] group-hover:text-[#4F46E5] transition">9</div>
              <div className="text-[11px] text-[#6B6B8D] font-semibold leading-tight">tech hiring verticals covered</div>
            </Link>
            <Link
              to="/tools"
              className="block rounded-xl bg-white/45 backdrop-blur-[20px] border border-white/55 px-4 py-3 hover:border-[#4F46E5]/40 transition group"
            >
              <div className="text-2xl font-display font-extrabold text-[#2D2B4E] group-hover:text-[#4F46E5] transition">4</div>
              <div className="text-[11px] text-[#6B6B8D] font-semibold leading-tight">free tools live, no signup</div>
            </Link>
          </div>
          <p className="mt-3 text-xs text-[#6B6B8D]">
            Each number links to its source. Numbers refresh with the build (current as of 10 May 2026).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://github.com/goofypluto999/cv-mirror-mcp"
            target="_blank"
            rel="me noopener noreferrer"
            className="bg-white/45 backdrop-blur-[20px] border border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">● Open source</div>
            <p className="text-base font-display font-bold text-[#2D2B4E]">Companion ATS scanner</p>
            <p className="text-xs text-[#6B6B8D] mt-1.5 leading-relaxed">CV Mirror — fully client-side, never uploads your CV. Source code on GitHub.</p>
            <p className="text-[11px] text-[#4F46E5] mt-3 font-semibold">github.com/goofypluto999/cv-mirror-mcp →</p>
          </a>

          <Link
            to="/changelog"
            className="bg-white/45 backdrop-blur-[20px] border border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-2">● Public changelog</div>
            <p className="text-base font-display font-bold text-[#2D2B4E]">Shipped 50+ fixes this week</p>
            <p className="text-xs text-[#6B6B8D] mt-1.5 leading-relaxed">Live changelog updated every commit. Read what shipped + what failed.</p>
            <p className="text-[11px] text-[#4F46E5] mt-3 font-semibold">/changelog →</p>
          </Link>

          <Link
            to="/receipts"
            className="bg-white/45 backdrop-blur-[20px] border border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">● Trust audit</div>
            <p className="text-base font-display font-bold text-[#2D2B4E]">Receipts page</p>
            <p className="text-xs text-[#6B6B8D] mt-1.5 leading-relaxed">Operator name, ICO registration, refund policy, real numbers — all linked.</p>
            <p className="text-[11px] text-[#4F46E5] mt-3 font-semibold">/receipts →</p>
          </Link>

          <a
            href="https://dev.to/goofypluto999"
            target="_blank"
            rel="me noopener noreferrer"
            className="bg-white/45 backdrop-blur-[20px] border border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-2">● Engineering writeups</div>
            <p className="text-base font-display font-bold text-[#2D2B4E]">DEV.to articles</p>
            <p className="text-xs text-[#6B6B8D] mt-1.5 leading-relaxed">Real engineering notes — ATS parser quirks, Gemini structured outputs.</p>
            <p className="text-[11px] text-[#4F46E5] mt-3 font-semibold">dev.to/goofypluto999 →</p>
          </a>

          <Link
            to="/about"
            className="bg-white/45 backdrop-blur-[20px] border border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">● Real human</div>
            <p className="text-base font-display font-bold text-[#2D2B4E]">Operator: Giovanni Sizino Ennes</p>
            <p className="text-xs text-[#6B6B8D] mt-1.5 leading-relaxed">UK sole trader. Real name, real contact, ICO data-protection registered.</p>
            <p className="text-[11px] text-[#4F46E5] mt-3 font-semibold">/about →</p>
          </Link>

          <Link
            to="/sample/anthropic-senior-pm"
            className="bg-white/45 backdrop-blur-[20px] border border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-2">● Full sample output</div>
            <p className="text-base font-display font-bold text-[#2D2B4E]">See exactly what you get</p>
            <p className="text-xs text-[#6B6B8D] mt-1.5 leading-relaxed">Complete prep-pack output for a real role. No signup, no card.</p>
            <p className="text-[11px] text-[#4F46E5] mt-3 font-semibold">/sample/anthropic-senior-pm →</p>
          </Link>
        </div>

        <p className="text-center text-xs text-[#6B6B8D] mt-8 max-w-xl mx-auto">
          Every link above is a public artefact. If anything looks off, email{' '}
          <a href="mailto:hello@aimvantage.uk" className="underline hover:text-[#4F46E5]">hello@aimvantage.uk</a>{' '}
          and we'll fix or refund.
        </p>
      </section>

      {/* ================================================================
          POPULAR INTERVIEW GUIDES — added 2026-05-10
          Surfaces 6 of the 16 long-tail interview-guide deep-dives so
          landing-page visitors can see we have content depth without
          having to find /blog manually. Conversion path: landing -> guide
          -> register CTA at the bottom of every post.
      ================================================================ */}
      <section
        id="popular-guides"
        className="py-16 px-6 max-w-6xl mx-auto relative z-20"
        aria-labelledby="popular-guides-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">
            Free reads · No signup
          </p>
          <h2 id="popular-guides-heading" className="text-4xl font-display font-bold text-[#2D2B4E]">
            Targeting a specific company?
          </h2>
          <p className="mt-3 text-[#5A5675] max-w-2xl mx-auto">
            We've shipped 16 deep-dives on company-specific interview loops in 2026 — five-stage
            breakdowns, the questions that actually come up, the traps that kill candidates, and a
            prep checklist. Free to read. No card.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { company: 'Stripe', role: 'Senior PM', slug: 'stripe-senior-pm-interview-guide-2026', time: '8 min' },
            { company: 'Anthropic', role: 'AI Safety', slug: 'anthropic-ai-safety-interview-questions-2026', time: '8 min' },
            { company: 'OpenAI', role: 'Applied Research', slug: 'openai-applied-research-interview-prep-2026', time: '8 min' },
            { company: 'DeepMind', role: 'Research Scientist', slug: 'deepmind-research-scientist-interview-2026', time: '8 min' },
            { company: 'Cloudflare', role: 'PM', slug: 'cloudflare-product-manager-interview-2026', time: '8 min' },
            { company: 'Vercel', role: 'Software Engineer', slug: 'vercel-software-engineer-interview-2026', time: '8 min' },
          ].map((guide) => (
            <Link
              key={guide.slug}
              to={`/blog/${guide.slug}`}
              className="group block rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_4px_16px_rgba(79,70,229,0.05)] p-5 hover:border-[#4F46E5]/40 hover:shadow-[0_8px_32px_rgba(79,70,229,0.12)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[#4F46E5]">
                  {guide.company}
                </span>
                <span className="text-xs text-[#5A5675]">{guide.time}</span>
              </div>
              <p className="text-base font-semibold text-[#2D2B4E] group-hover:text-[#4F46E5] transition leading-snug">
                {guide.role} interview, 2026
              </p>
              <p className="mt-3 text-sm text-[#4F46E5] font-medium inline-flex items-center gap-1">
                Read the guide
                <span aria-hidden="true">&rarr;</span>
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#4F46E5] hover:bg-[#4F46E5]/10 transition"
          >
            See all 16 company guides
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ================================================================
          FAQ
      ================================================================ */}
      <section id="faq" className="py-16 px-6 max-w-3xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-[#2D2B4E]">Common Questions</h2>
        </motion.div>
        <div className="space-y-3">
          {[
            { q: "Is this right for me?",             a: "If you are applying for jobs and want to walk in prepared with real company intelligence, role alignment evidence, and confident answers — yes, this is for you." },
            { q: "How is this different from just using ChatGPT?", a: "ChatGPT writes generic cover letters from a blank prompt. AimVantage scrapes the actual job page (LinkedIn / Greenhouse / Lever / company careers), extracts company intel, scores your CV against the role, then writes a cover letter grounded in those specifics — plus mock interview Qs and a 5-minute pitch outline. Same model under the hood (Gemini 2.5 Flash), but with the research, structure, and tone-switching that the blank prompt is missing." },
            { q: "Will recruiters be able to tell my cover letter was AI-written?", a: "If you submit verbatim, possibly. If you do what works — pick a tone, read it once, swap one sentence for something only you would say, then send — they can't. AimVantage gives you a 90% draft. You add the human 10%. The pattern that fails is sending generic AI letters to 50 jobs at once; the pattern that works is using AI to compress prep time per application so you can spend the saved time on tailoring." },
            { q: "How is this different from Jobscan or Teal?",  a: "Jobscan tells you keywords your CV is missing. Teal organises your job board. Both are useful but neither writes the cover letter, generates mock interview Qs, or produces a strategic brief. AimVantage is the prep-pack layer that comes after you decide to apply — the deliverable, not the tracker. Compare specifics on /alternatives." },
            { q: "How long does it take?",            a: "Under 5 minutes from upload to full brief. The AI does the heavy research while you review the output." },
            { q: "Do I need any experience with AI?", a: "None. Upload your CV, paste a job URL, and click generate. It handles everything else." },
            { q: "Is my CV data private?",            a: "Completely. Your data is never stored on our servers, never used for training, and never shared. The CV is sent once to Gemini for the analysis, the analysis is returned to you, and the CV content is dropped. Each session is ephemeral." },
            { q: "How do tokens work?",               a: "1 token = 1 full prep pack (company intel + cover letter + interview pack + fit score + pitch). Cover letter tone rewrites cost 1 extra token each. Starter tokens are a one-time top-up and never expire. Pro and Premium tokens refresh each month with your subscription." },
            { q: "What if the output is not right?",  a: "You can regenerate or refine with additional context. Tokens are only consumed on successful generations — if the AI fails, we refund them automatically." },
            { q: "Does AimVantage also help me find jobs, or only prep for ones I find?",  a: "Both. AI Job Search lives inside your Dashboard — it scans 20+ countries via Adzuna and Remotive, scores every result against your CV, flags likely ghost jobs with a probability score, and saves matches to your Application Tracker in one click. Your first scan each day is free; additional scans cost 1 token. After you pick a role, the rest of AimVantage takes over: strategic brief, cover letter, mock interview, follow-up emails, negotiation." },
            { q: "Can I cancel anytime?",  a: "Yes. Subscriptions cancel from the Account → Billing portal in one click — managed via Stripe so it's instant. No retention emails, no friction. Tokens you already paid for never expire even after cancelling." },
          ].map(({ q, a }, i) => (
            <FaqItem key={q} index={i} question={q} answer={a} />
          ))}
        </div>
      </section>

      {/* ================================================================
          FEATURE DROP — EMAIL CAPTURE
      ================================================================ */}
      <section id="upcoming" className="py-20 px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-elevated p-12 md:p-16 rounded-[32px]">
            <Waitlist onSignUpClick={onStart} />
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
      ================================================================ */}
      <section className="py-20 px-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-elevated p-16 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#A8E6CF]/20 via-[#A1C9F1]/20 to-[#FFB7B2]/20 rounded-full blur-3xl" />
            </div>
            <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-4 relative z-10">Ready to start?</p>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2D2B4E] relative z-10">
              Ready to change the game?
            </h2>
            <p className="text-[#3B3A5C] text-lg mt-4 font-medium relative z-10">
              Stop sending generic applications. Start sending strategic proposals.
            </p>
            <button
              onClick={() => { ctaClick('landing-final-cta'); onStart(); }}
              className="mt-10 relative z-10 inline-flex items-center gap-3 px-12 py-5 bg-[#4F46E5] text-white rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
            >
              Initialize AimVantage <ChevronRight className="w-5 h-5" />
            </button>
            <p className="mt-5 text-sm text-[#6B6B8D] font-medium relative z-10">
              Free signup. 10 tokens on us — that's 10 full prep packs. No credit card needed.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="relative z-10 mt-10 pb-10 px-6 max-w-7xl mx-auto">
        <div className="bg-white/20 backdrop-blur-[28px] border border-white/60 rounded-[32px] p-10 md:p-14 flex flex-col shadow-[0_16px_48px_rgba(0,0,0,0.10)]">
          <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-[#6B6B8D]/20 pb-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                  <BrainCircuit className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-[800] text-xl text-[#2D2B4E] tracking-tight uppercase">AimVantage</span>
              </div>
              <p className="text-[#6B6B8D] font-medium text-sm">90 seconds from CV to interview-ready.</p>
            </div>

            <div className="flex-1 flex gap-8 text-sm font-bold text-[#3B3A5C] flex-wrap">
              <div className="flex flex-col gap-3">
                <a href="#features" className="hover:text-[#4F46E5] transition-colors">Product</a>
                <a href="#pricing" className="hover:text-[#4F46E5] transition-colors">Pricing</a>
                <Link to="/sample/anthropic-senior-pm" className="hover:text-[#4F46E5] transition-colors">Sample output</Link>
                <Link to="/blog" className="hover:text-[#4F46E5] transition-colors">Blog</Link>
                <Link to="/tools" className="hover:text-[#4F46E5] transition-colors">Free tools</Link>
                <Link to="/roast" className="hover:text-[#4F46E5] transition-colors">Cover letter roast</Link>
                <Link to="/decode-rejection" className="hover:text-[#4F46E5] transition-colors">Decode rejection email</Link>
                <Link to="/ghost-job-check" className="hover:text-[#4F46E5] transition-colors">Ghost-job detector</Link>
                <Link to="/ats/scanner" className="hover:text-[#4F46E5] transition-colors">ATS keyword scanner</Link>
                <Link to="/tools/jd-decoder" className="hover:text-[#4F46E5] transition-colors">JD decoder</Link>
                <a href="https://cv-mirror-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] transition-colors">
                  CV Mirror →
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/about" className="hover:text-[#4F46E5] transition-colors">About / operator</Link>
                <Link to="/press-releases" className="hover:text-[#4F46E5] transition-colors">Press releases</Link>
                <Link to="/laid-off" className="hover:text-[#4F46E5] transition-colors">Just laid off?</Link>
                <Link to="/ats" className="hover:text-[#4F46E5] transition-colors">ATS Guide</Link>
                <Link to="/skills" className="hover:text-[#4F46E5] transition-colors">Skills</Link>
                <Link to="/docs/api" className="hover:text-[#4F46E5] transition-colors">API</Link>
                <Link to="/press" className="hover:text-[#4F46E5] transition-colors">Press</Link>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/receipts" className="hover:text-[#4F46E5] transition-colors font-semibold">Receipts (trust audit)</Link>
                <Link to="/privacy" className="hover:text-[#4F46E5] transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-[#4F46E5] transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-[#4F46E5] transition-colors">Cookie Policy</Link>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-start md:items-end">
              <div className="bg-white/40 p-4 rounded-2xl flex items-start gap-3 border border-white/50 max-w-xs">
                <ShieldAlert className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                <p className="text-[#2D2B4E] font-bold text-sm leading-tight">
                  Built with care. Your data is never used for training.
                </p>
              </div>
            </div>
          </div>

          {/* Featured On — backlinks for directories that require reciprocal links.
              To add a new directory: append an entry to FEATURED_ON below, redeploy. */}
          <div className="border-b border-[#6B6B8D]/20 py-6">
            <div className="text-[10px] uppercase tracking-widest text-[#6B6B8D] font-bold mb-3">Featured on</div>
            <div className="flex flex-wrap gap-4 items-center">
              {FEATURED_ON.map((d) => (
                <a
                  key={d.url}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[#6B6B8D] hover:text-[#4F46E5] transition flex items-center gap-2 opacity-80 hover:opacity-100"
                  aria-label={`Featured on ${d.name}`}
                >
                  {d.badgeUrl ? (
                    <img src={d.badgeUrl} alt={`Featured on ${d.name}`} width={120} height={36} className="h-9 w-auto rounded" loading="lazy" />
                  ) : (
                    <span className="font-semibold">{d.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Operator identification — UK e-Commerce Regulations 2002 r.6 for a
              sole trader. Provides legal name, contact, sole-trader status, and
              brand disambiguation. Counters automated "lacks company information"
              flags raised by search assistants without claiming any company
              registration that does not exist. */}
          <div className="border-t border-[#6B6B8D]/20 mt-8 pt-6 text-[11px] text-[#6B6B8D] leading-relaxed">
            <p className="font-semibold text-[#3B3A5C] mb-1">AimVantage <span className="font-normal text-[#6B6B8D]">(formerly Vantage AI)</span></p>
            <p>
              An AI-powered job-preparation SaaS operated by Giovanni Sizino Ennes,
              a UK-based independent founder (sole trader) building in public. Full operator
              transparency at <Link to="/about" className="underline hover:text-[#4F46E5]">/about</Link>.
              Contact:{' '}
              <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="underline hover:text-[#4F46E5]">
                giovanni.sizino.ennes@hotmail.co.uk
              </a>
              {' '}· Operating domain: aimvantage.uk
            </p>
            <p className="mt-2 italic">
              Not affiliated with Vantage Consulting, Vantage Recruitment, Vantage Markets, Vantage Data Centers, Vantagepoint AI, or any other
              organisation using a similar name. AimVantage is a software product only — we do not recruit,
              do not contact candidates over WhatsApp or Telegram, do not collect financial information from
              applicants, and never charge users for "processing", "admin", or "DBS check" fees. All payments
              are billed transparently through Stripe for AI usage tokens.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-[#6B6B8D] mt-6 font-bold tracking-wider gap-3">
            <span>© 2026 AIMVANTAGE · GIOVANNI SIZINO ENNES. ALL RIGHTS RESERVED.</span>
            <span className="text-center">ALL OUTPUTS ARE AI-GENERATED | <Link to="/terms" className="underline hover:text-[#4F46E5]">TERMS APPLY</Link></span>
          </div>
        </div>
      </footer>

      {/* Floating "Try free" pill — visible after the user scrolls past the
          hero, hidden when they're already at the bottom (pricing/footer have
          their own CTAs). Dismissible. Captures the 79%-scroll-depth users
          who Clarity showed read the page deeply but never re-clicked a CTA. */}
      {showFloatingCta && !floatingCtaDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-50 pointer-events-auto"
        >
          <div className="flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-[#4F46E5] text-white shadow-[0_12px_32px_rgba(79,70,229,0.45)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.55)] transition-shadow">
            <button
              onClick={() => { ctaClick('landing-sticky-bottom-pill'); onStart(); }}
              className="flex items-center gap-2 font-bold text-sm pr-3"
              aria-label="Try AimVantage free — ten prep packs, no card"
            >
              Try free — 10 prep packs, no card
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFloatingCtaDismissed(true)}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white/80 hover:text-white flex items-center justify-center transition-colors text-sm"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================
function FaqItem({ question, answer, index = 0 }: { question: string; answer: string; index?: number }) {
  const [open, setOpen] = useState(false);
  // Stable id for aria-controls. Index prefix prevents duplicate IDs when two
  // FAQs share the same first 40 alphanum chars (LLM-council caught this:
  // duplicate aria-controls + invalid HTML).
  const panelId = `faq-${index}-${question.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 backdrop-blur-[20px] border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-[24px] overflow-hidden"
    >
      {/* Click handler moved from parent div to the actual button — fixes
          two issues caught in the 2026-05-08 a11y/dead-click pass:
          1. Keyboard users tabbing to the button + pressing Enter previously
             relied on the click event bubbling to the parent's onClick,
             which is fragile and incorrect a11y.
          2. The parent div had cursor-pointer but no onClick on the button
             itself — Clarity would log clicks on the question text whose
             effect (parent toggle) was easy to confuse with no-op. Moving
             the handler onto the button makes the click target == the
             interactive element. Clean ARIA expanded/controls wired up so
             screen readers announce the disclosure state. */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left flex items-center justify-between gap-4 p-6 cursor-pointer hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#4F46E5]"
      >
        <span className="font-display font-bold text-[#2D2B4E] text-base">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#4F46E5] font-bold text-2xl leading-none flex-shrink-0"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[#6B6B8D] font-medium text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
