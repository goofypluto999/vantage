import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { Upload, Link as LinkIcon, FileText, Check, ChevronRight, X, Sparkles, Play, Pause } from 'lucide-react';

interface DemoWalkthroughProps {
  onClose?: () => void;
  onStartReal?: () => void;
}

const DEMO_STEPS = [
  {
    id: 1,
    title: 'Upload Your CV',
    description: 'Drop your CV (PDF, DOCX, or TXT) and we\'ll extract your experience, skills, and achievements automatically.',
    highlight: 'upload-zone',
    icon: Upload,
  },
  {
    id: 2,
    title: 'Add the Job URL',
    description: 'Paste the job listing URL and we\'ll research the company — mission, culture, recent news, everything.',
    highlight: 'job-url',
    icon: LinkIcon,
  },
  {
    id: 3,
    title: 'Choose Your Outputs',
    description: 'Select what you need: Strategic Brief, Cover Letter, Interview Pack, and more.',
    highlight: 'outputs',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Generate Intelligence',
    description: 'Our AI analyses and aligns everything — delivering your personalized preparation package.',
    highlight: 'generate',
    icon: Sparkles,
  },
  {
    id: 5,
    title: 'Get Results',
    description: 'Company intel, CV match score, cover letter in your chosen tone, interview flashcards, and more.',
    highlight: 'results',
    icon: Check,
  },
];

export default function DemoWalkthrough({ onClose, onStartReal }: DemoWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [currentStep]);

  useEffect(() => {
    if (!autoAdvance || !isPlaying) return;
    
    const timer = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentStep, autoAdvance, isPlaying]);

  const step = DEMO_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" style={{ backdropFilter: 'blur(20px)', background: 'rgba(20,18,48,0.85)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#1a1635] to-[#0d0b1e] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="flex-1 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest mb-4">
                  <Play className="w-3 h-3" /> Demo Mode
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                  {step.title}
                </h2>
                <p className="text-lg text-white/60 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div ref={stepRef} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-violet-500/30 flex items-center justify-center">
                    <StepIcon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Step {step.id} of {DEMO_STEPS.length}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={onStartReal}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-violet-500/30"
                >
                  <Sparkles className="w-5 h-5" />
                  Try it for real
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white/5 border-l border-white/5 p-6">
            <div className="space-y-3">
              {DEMO_STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    i === currentStep
                      ? 'bg-violet-500/20 border border-violet-500/30'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    i === currentStep ? 'bg-violet-500/50' : 'bg-white/10'
                  }`}>
                    {i < currentStep ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className={`text-xs font-bold ${i === currentStep ? 'text-white' : 'text-white/40'}`}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${i === currentStep ? 'text-white' : 'text-white/50'}`}>
                      {s.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Progress</span>
                <span className="text-xs font-mono text-violet-400">{Math.round((currentStep + 1) / DEMO_STEPS.length * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}