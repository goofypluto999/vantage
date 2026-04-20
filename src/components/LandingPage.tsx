import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ShieldAlert, ShieldCheck, FileText, Lock,
  Upload, Link as LinkIcon, Download, CheckCircle, Eye, Menu, X,
  BrainCircuit, Trophy, Clock3, BarChart2, User, Play
} from 'lucide-react';
import * as THREE from 'three';
import Waitlist from './Waitlist';
import DemoWalkthrough from './DemoWalkthrough';
import { useCurrency } from '../contexts/CurrencyContext';

// ============================================================================
// 3D: DOT-MATRIX GLOBE  (fibonacci sphere of points + orbital rings)
// ============================================================================
function DotGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Fibonacci sphere — evenly-distributed points on a sphere surface
  const positions = useMemo(() => {
    const count = 1800;
    const arr = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      arr[i * 3]     = Math.cos(theta) * r * 4.8;
      arr[i * 3 + 1] = y * 4.8;
      arr[i * 3 + 2] = Math.sin(theta) * r * 4.8;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 0.7 : 0.14);
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Dot cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#ffffff"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.8, 0.012, 8, 200]} />
        <meshBasicMaterial color="#A8E6CF" transparent opacity={0.55} />
      </mesh>

      {/* Tilted ring 1 */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <torusGeometry args={[5.4, 0.009, 8, 200]} />
        <meshBasicMaterial color="#A1C9F1" transparent opacity={0.35} />
      </mesh>

      {/* Tilted ring 2 */}
      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[5.9, 0.007, 8, 200]} />
        <meshBasicMaterial color="#FFB7B2" transparent opacity={0.25} />
      </mesh>

      {/* Soft inner glow */}
      <mesh>
        <sphereGeometry args={[4.7, 32, 32]} />
        <meshBasicMaterial color="#4F46E5" transparent opacity={0.06} />
      </mesh>

      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

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
    body: "Vantage cuts through the noise. We analyse the company's latest goals, financials, and mission — aligning them precisely with your exact experience.",
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
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">The Vantage Story</p>
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

  const links = ['Features', 'How It Works', 'Pricing', 'FAQ'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/30 backdrop-blur-[28px] border-b border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-[800] text-[#2D2B4E] text-lg tracking-tight uppercase">
            Vantage
          </span>
        </motion.div>

        {/* Desktop nav */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center gap-1"
        >
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="px-4 py-2 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] hover:bg-white/30 rounded-full transition-all"
            >
              {link}
            </a>
          ))}
        </motion.nav>

        {/* Desktop CTA */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex items-center gap-2"
        >
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
            onClick={onStart}
            className="px-5 py-2.5 bg-[#4F46E5] text-white text-sm font-bold rounded-full hover:bg-[#6366F1] hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)] active:scale-95 transition-all"
          >
            Get Started →
          </button>
        </motion.div>

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
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-[#3B3A5C] hover:text-[#4F46E5] rounded-xl hover:bg-white/40 transition-all"
                >
                  {link}
                </a>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onStart(); }}
                className="mt-2 px-5 py-3 bg-[#4F46E5] text-white text-sm font-bold rounded-full hover:bg-[#6366F1] transition-all"
              >
                Get Started →
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
      desc: 'Vantage searches the web for the company, cross-references your CV against the role, and builds your complete intelligence package.',
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
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(20,18,50,0.88)', backdropFilter: 'blur(16px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 flex-shrink-0">
        <div>
          <div className="text-[10px] font-bold text-[#A8A5E6] uppercase tracking-widest mb-1">Product Overview</div>
          <h2 className="text-2xl font-display font-bold text-white">How Vantage Works</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStart}
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
              onClick={onStart}
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
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Strategic Brief', 'Cover Letter', 'Interview Pack', 'Presentation Deck'];

  return (
    <div className="bg-gradient-to-br from-[#A8A5E6] via-[#C2C0F0] to-[#E6E5F8] text-[#2D2B4E] min-h-screen font-body selection:bg-white/50 overflow-x-hidden">

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

      <Navbar onStart={onStart} showLogin={showLogin} />

      {/* ================================================================
          HERO — dot-matrix globe behind the headline
      ================================================================ */}
      <section id="features" className="relative h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay">
        {/* 3D canvas */}
        <div className="absolute inset-0 z-0 pointer-events-auto bg-[#A8A5E6]">
          <React.Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 7] }}>
              <ambientLight intensity={1.6} />
              <directionalLight position={[8, 10, 5]} intensity={2} color="#ffffff" />
              <pointLight position={[-5, -5, 5]} intensity={0.8} color="#A1C9F1" />
              <pointLight position={[5, 5, -5]} intensity={0.6} color="#FFB7B2" />

              <DotGlobe />

              <Sparkles count={120} scale={18} size={1.8} speed={0.15} opacity={0.5} color="#ffffff" />
              <Sparkles count={60}  scale={14} size={2.5} speed={0.3}  opacity={0.4} color="#A8E6CF" />
              <Sparkles count={60}  scale={14} size={2.5} speed={0.25} opacity={0.4} color="#A1C9F1" />
            </Canvas>
          </React.Suspense>
        </div>

        {/* Hero text */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="z-10 text-center max-w-5xl px-6 pointer-events-none mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/30 backdrop-blur-[20px] border border-white/50 text-[#2D2B4E] text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
            Vantage Intelligence System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="text-7xl md:text-8xl lg:text-[96px] font-display font-[800] tracking-[-0.04em] leading-[1.05] drop-shadow-sm"
          >
            Clarity in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
              Chaos.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-6 text-xl text-[#3B3A5C] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The ultimate unfair advantage — perfectly packaged. Transform your raw experience
            into a hyper-targeted, undeniable strategic narrative.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-12 pointer-events-auto flex flex-col items-center gap-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onStart}
                className="group inline-flex items-center gap-2 px-10 py-4 bg-[#4F46E5] text-white rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
              >
                Access Workspace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/35 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] rounded-full font-semibold text-base hover:bg-white/55 hover:-translate-y-1 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4" /> Watch Demo
              </button>
              <button
                onClick={() => setShowHowItWorks(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/35 backdrop-blur-[20px] border border-white/55 text-[#2D2B4E] rounded-full font-semibold text-base hover:bg-white/55 hover:-translate-y-1 active:scale-95 transition-all"
              >
                See How It Works
              </button>
            </div>
            <p className="text-xs text-[#3B3A5C] uppercase tracking-widest flex items-center gap-2 font-bold">
              <Lock className="w-3 h-3" /> 100% Private &amp; Secure
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6B6B8D]"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#6B6B8D]/60 to-transparent" />
        </motion.div>
      </section>

      {/* ================================================================
          TRUST BAR
      ================================================================ */}
      <section className="relative z-10 w-full px-4 -mt-10 max-w-5xl mx-auto">
        <GlassCard className="!rounded-[24px] !p-6 flex justify-between items-center bg-white/40 max-md:grid max-md:grid-cols-2 max-md:gap-4 md:flex-row">
          <div className="flex items-center gap-3"><ShieldAlert className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">No Auto-Apply</span></div>
          <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">No Fabrication</span></div>
          <div className="flex items-center gap-3"><Lock className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">No Hidden Scraping</span></div>
          <div className="flex items-center gap-3"><Eye className="w-5 h-5 text-[#4F46E5]" /><span className="text-sm font-bold text-[#3B3A5C]">Human Review Always</span></div>
        </GlassCard>
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
      </section>

      {/* ================================================================
          BENEFITS
      ================================================================ */}
      <section className="py-12 px-6 max-w-6xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">Why Vantage</p>
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
      </section>

      {/* ================================================================
          PRICING
      ================================================================ */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3">Transparent</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2D2B4E]">Simple Pricing.</h2>
          <p className="text-[#6B6B8D] mt-3 font-medium">Pay only for what you use. No subscriptions.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 lg:gap-8">
          <GlassCard className="flex-1 flex flex-col items-center !p-10 md:mt-6">
            <h3 className="font-display font-bold text-xl text-[#3B3A5C]">Starter</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-[#6B6B8D]">{symbol}</span>
              <span className="text-6xl font-mono font-bold text-[#2D2B4E]">{prices.starter}</span>
            </div>
            <span className="bg-white/50 text-[#4F46E5] font-mono text-xs px-3 py-1 rounded-full mt-3 font-bold border border-white">100 Credits</span>
            <ul className="mt-8 space-y-3 w-full flex-grow text-sm text-[#3B3A5C] font-medium">
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Strategic Brief + Cover Letter</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> 2 Full Generations</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Basic Interview Pack</li>
            </ul>
            <button onClick={onStart} className="w-full py-3.5 mt-8 rounded-full bg-white/50 hover:bg-white text-[#4F46E5] font-bold border border-white hover:shadow-md transition-all">
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
            <span className="bg-white/50 text-[#4F46E5] font-mono text-xs px-3 py-1 rounded-full mt-3 font-bold border border-white">300 Credits</span>
            <ul className="mt-8 space-y-3 w-full flex-grow text-sm text-[#3B3A5C] font-medium">
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Everything in Starter</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Full Interview Workspace</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Mock Interview Drill</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Timed Practice Mode</li>
            </ul>
            <button onClick={onStart} className="w-full py-3.5 mt-8 rounded-full bg-[#4F46E5] text-white font-bold hover:bg-[#6366F1] shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:-translate-y-1 transition-all">
              Upgrade to Pro
            </button>
          </GlassCard>

          <GlassCard className="flex-1 flex flex-col items-center !p-10 md:mt-6">
            <h3 className="font-display font-bold text-xl text-[#3B3A5C]">Premium</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-[#6B6B8D]">{symbol}</span>
              <span className="text-6xl font-mono font-bold text-[#2D2B4E]">{prices.premium}</span>
            </div>
            <span className="bg-white/50 text-[#4F46E5] font-mono text-xs px-3 py-1 rounded-full mt-3 font-bold border border-white">500 Credits</span>
            <ul className="mt-8 space-y-3 w-full flex-grow text-sm text-[#3B3A5C] font-medium">
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Everything in Pro</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Presentation Deck Generator</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> Priority Human Review</li>
              <li className="flex gap-3"><CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" /> CV Fit Score Analysis</li>
            </ul>
            <button onClick={onStart} className="w-full py-3.5 mt-8 rounded-full bg-white/50 hover:bg-white text-[#4F46E5] font-bold border border-white hover:shadow-md transition-all">
              Go Premium
            </button>
          </GlassCard>
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
            { q: "How long does it take?",            a: "Under 5 minutes from upload to full brief. The AI does the heavy research while you review the output." },
            { q: "Do I need any experience with AI?", a: "None. Upload your CV, paste a job URL, and click generate. It handles everything else." },
            { q: "Is my CV data private?",            a: "Completely. Your data is never stored, never used for training, and never shared. Each session is ephemeral." },
            { q: "Can I use it multiple times?",      a: "Yes — credits work per generation. One generation = one full output pack. Use them whenever you need them — they do not expire." },
            { q: "What if the output is not right?",  a: "You can regenerate or refine with additional context. Your credits are only consumed on successful generations." },
          ].map(({ q, a }) => (
            <FaqItem key={q} question={q} answer={a} />
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
              onClick={onStart}
              className="mt-10 relative z-10 inline-flex items-center gap-3 px-12 py-5 bg-[#4F46E5] text-white rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.45)] active:scale-95 transition-all"
            >
              Initialize Vantage <ChevronRight className="w-5 h-5" />
            </button>
            <p className="mt-5 text-sm text-[#6B6B8D] font-medium relative z-10">
              Start with 10 tokens for just {symbol}{prices.starter}. No subscription. No commitment.
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
                <span className="font-display font-[800] text-xl text-[#2D2B4E] tracking-tight uppercase">Vantage</span>
              </div>
              <p className="text-[#6B6B8D] font-medium text-sm">Clarity in the Chaos.</p>
            </div>

            <div className="flex-1 flex gap-12 text-sm font-bold text-[#3B3A5C]">
              <div className="flex flex-col gap-3">
                <a href="#features" className="hover:text-[#4F46E5] transition-colors">Product</a>
                <a href="#pricing" className="hover:text-[#4F46E5] transition-colors">Pricing</a>
                <a href="#upcoming" className="hover:text-[#4F46E5] transition-colors">Upcoming</a>
              </div>
              <div className="flex flex-col gap-3">
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

          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-[#6B6B8D] mt-8 font-bold tracking-wider gap-3">
            <span>© 2026 VANTAGE. ALL RIGHTS RESERVED.</span>
            <span className="text-center">ALL OUTPUTS ARE AI-GENERATED | <Link to="/terms" className="underline hover:text-[#4F46E5]">TERMS APPLY</Link></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 backdrop-blur-[20px] border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-[24px] overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <button className="w-full text-left flex items-center justify-between gap-4 p-6">
        <span className="font-display font-bold text-[#2D2B4E] text-base">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#4F46E5] font-bold text-2xl leading-none flex-shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
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
