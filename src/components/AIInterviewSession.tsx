import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mic,
  MicOff,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Clock,
  Loader2,
  TrendingUp,
  Award,
  BarChart2,
} from 'lucide-react';
import { generateInterviewQuestions, evaluateAnswer } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AIInterviewSessionProps {
  roleContext: string;
  onClose: () => void;
}

type Category = 'behavioural' | 'technical' | 'situational' | 'motivational';

interface InterviewQuestion {
  question: string;
  category: Category;
  hint: string;
}

interface EvaluationMetrics {
  clarity: number;
  relevance: number;
  structure: number;
  impact: number;
  confidence: number;
}

interface Evaluation {
  overallScore: number;
  grade: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  metrics: EvaluationMetrics;
}

type TimerDuration = 60 | 90 | 120;

type SessionPhase =
  | 'loading'
  | 'question-list'
  | 'interview'
  | 'evaluating'
  | 'evaluation'
  | 'summary'
  | 'error';

// ─── Category colours ─────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; label: string }> = {
  behavioural: { bg: 'bg-[#4F46E5]/10', text: 'text-[#4F46E5]', label: 'Behavioural' },
  technical: { bg: 'bg-[#A1C9F1]/20', text: 'text-[#3B5A8A]', label: 'Technical' },
  situational: { bg: 'bg-[#A8E6CF]/20', text: 'text-[#1A6B4A]', label: 'Situational' },
  motivational: { bg: 'bg-[#FFB7B2]/20', text: 'text-[#B5473E]', label: 'Motivational' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

function gradeColor(score: number): { bg: string; text: string } {
  if (score >= 75) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (score >= 50) return { bg: 'bg-amber-100', text: 'text-amber-700' };
  return { bg: 'bg-red-100', text: 'text-red-700' };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Circular SVG score ring */
function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  const cx = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 absolute inset-0"
      >
        <circle cx={cx} cy={cx} r={r} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{ strokeDasharray: circ }}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center z-10">
        <span className="font-mono font-bold text-2xl text-[#2D2B4E]" style={{ lineHeight: 1 }}>
          {score}
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          /100
        </span>
      </div>
    </div>
  );
}

/** Animated metric bar */
function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B6B8D] capitalize">{label}</span>
        <span className="text-xs font-mono font-bold text-[#2D2B4E]">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#A1C9F1]"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  );
}

/** Timer ring */
function TimerRing({
  timeLeft,
  total,
  size = 200,
}: {
  timeLeft: number;
  total: number;
  size?: number;
}) {
  const sw = 10;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? timeLeft / total : 0;
  const offset = circ - progress * circ;
  let color = '#10B981';
  if (progress <= 0.25) color = '#EF4444';
  else if (progress <= 0.5) color = '#F59E0B';
  const cx = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 absolute inset-0"
      >
        <circle cx={cx} cy={cx} r={r} stroke="#f3f4f6" strokeWidth={sw} fill="none" />
        <motion.circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={color}
          strokeWidth={sw}
          fill="none"
          strokeLinecap="round"
          style={{ strokeDasharray: circ, strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'linear' }}
        />
      </svg>
      <span className="font-mono font-bold text-4xl text-[#2D2B4E] z-10">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

/** Loading spinner */
function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <motion.div
        className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm font-semibold text-[#6B6B8D] font-body">{label}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIInterviewSession({ roleContext, onClose }: AIInterviewSessionProps) {
  // Phase & questions
  const [phase, setPhase] = useState<SessionPhase>('loading');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Timer
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(90);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [timerActive, setTimerActive] = useState(false);
  const [timerChosen, setTimerChosen] = useState(false);

  // Speech / transcript
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const interimRef = useRef('');

  // Hints
  const [hintVisible, setHintVisible] = useState(false);

  // Evaluations
  const [evaluations, setEvaluations] = useState<(Evaluation | null)[]>([]);
  const [currentEval, setCurrentEval] = useState<Evaluation | null>(null);

  // ── Speech recognition detection ──────────────────────────────────────────
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // ── Question generation ───────────────────────────────────────────────────
  useEffect(() => {
    generateQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateQuestions() {
    setPhase('loading');
    try {
      const result = await generateInterviewQuestions(roleContext);
      if (!result.success || !result.questions) {
        throw new Error(result.error || 'Failed to generate questions');
      }
      const parsed: InterviewQuestion[] = result.questions.slice(0, 5);
      setQuestions(parsed);
      setEvaluations(new Array(parsed.length).fill(null));
      setPhase('question-list');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to generate questions. Please try again.');
      setPhase('error');
    }
  }

  // ── Timer logic ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  function startTimer(duration: TimerDuration) {
    setTimerDuration(duration);
    setTimeLeft(duration);
    setTimerChosen(true);
    setTimerActive(true);
  }

  // ── Recording logic ───────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    interimRef.current = '';

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      interimRef.current = interim;
      setTranscript(final + interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  // ── Reset per question ────────────────────────────────────────────────────
  function resetForQuestion() {
    setTranscript('');
    setHintVisible(false);
    setTimerChosen(false);
    setTimerActive(false);
    setTimeLeft(timerDuration);
    setCurrentEval(null);
    if (isRecording) stopRecording();
  }

  // ── Start interview ───────────────────────────────────────────────────────
  function startInterview() {
    setCurrentIndex(0);
    resetForQuestion();
    setPhase('interview');
  }

  // ── Submit answer for evaluation ──────────────────────────────────────────
  async function submitAnswer() {
    if (!transcript.trim()) return;
    setTimerActive(false);
    if (isRecording) stopRecording();
    setPhase('evaluating');

    const q = questions[currentIndex];

    try {
      const result = await evaluateAnswer(roleContext, q.question, q.category, transcript);
      if (!result.success || !result.evaluation) {
        throw new Error(result.error || 'Failed to evaluate answer');
      }
      const evaluation: Evaluation = result.evaluation;
      setCurrentEval(evaluation);

      const updated = [...evaluations];
      updated[currentIndex] = evaluation;
      setEvaluations(updated);

      setPhase('evaluation');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to evaluate answer. Please try again.');
      setPhase('error');
    }
  }

  // ── Next question ─────────────────────────────────────────────────────────
  function nextQuestion() {
    if (currentIndex >= questions.length - 1) {
      setPhase('summary');
    } else {
      setCurrentIndex((i) => i + 1);
      resetForQuestion();
      setPhase('interview');
    }
  }

  // ── Session summary data ──────────────────────────────────────────────────
  const completedEvals = evaluations.filter(Boolean) as Evaluation[];
  const avgScore =
    completedEvals.length > 0
      ? Math.round(completedEvals.reduce((s, e) => s + e.overallScore, 0) / completedEvals.length)
      : 0;

  const allStrengths = completedEvals.flatMap((e) => e.strengths);
  const allImprovements = completedEvals.flatMap((e) => e.improvements);

  // Deduplicate by taking first occurrence up to 3
  const topStrengths = [...new Set(allStrengths)].slice(0, 3);
  const topImprovements = [...new Set(allImprovements)].slice(0, 3);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-[28px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-xl text-[#2D2B4E]">AI Mock Interview</h2>
            <p className="text-xs text-[#6B6B8D] font-body mt-0.5 line-clamp-1">{roleContext}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Spinner label="Generating personalised questions…" />
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5 py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#2D2B4E] mb-1">Something went wrong</h3>
                  <p className="text-sm text-[#6B6B8D] font-body max-w-sm">{errorMsg}</p>
                </div>
                <button
                  onClick={generateQuestions}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#6366F1] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </motion.div>
            )}

            {phase === 'question-list' && (
              <motion.div key="question-list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <QuestionList
                  questions={questions}
                  onStart={startInterview}
                />
              </motion.div>
            )}

            {phase === 'interview' && (
              <motion.div key={`interview-${currentIndex}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <InterviewStep
                  question={questions[currentIndex]}
                  questionIndex={currentIndex}
                  totalQuestions={questions.length}
                  timerChosen={timerChosen}
                  timerDuration={timerDuration}
                  timeLeft={timeLeft}
                  timerActive={timerActive}
                  onChooseTimer={startTimer}
                  transcript={transcript}
                  setTranscript={setTranscript}
                  isRecording={isRecording}
                  speechSupported={speechSupported}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  hintVisible={hintVisible}
                  onToggleHint={() => setHintVisible((v) => !v)}
                  onSubmit={submitAnswer}
                />
              </motion.div>
            )}

            {phase === 'evaluating' && (
              <motion.div key="evaluating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Spinner label="Evaluating your answer…" />
              </motion.div>
            )}

            {phase === 'evaluation' && currentEval && (
              <motion.div key={`eval-${currentIndex}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <EvaluationStep
                  evaluation={currentEval}
                  questionIndex={currentIndex}
                  totalQuestions={questions.length}
                  onNext={nextQuestion}
                />
              </motion.div>
            )}

            {phase === 'summary' && (
              <motion.div key="summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <SummaryStep
                  questions={questions}
                  evaluations={evaluations}
                  avgScore={avgScore}
                  topStrengths={topStrengths}
                  topImprovements={topImprovements}
                  onPracticeAgain={() => {
                    setEvaluations(new Array(questions.length).fill(null));
                    startInterview();
                  }}
                  onClose={onClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step: Question List ──────────────────────────────────────────────────────

function QuestionList({
  questions,
  onStart,
}: {
  questions: InterviewQuestion[];
  onStart: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display font-bold text-lg text-[#2D2B4E]">Your Interview Questions</h3>
        <p className="text-sm text-[#6B6B8D] font-body mt-1">
          5 personalised questions have been generated for your role. Review them, then start the interview.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const cat = CATEGORY_STYLES[q.category] ?? CATEGORY_STYLES.behavioural;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono font-bold text-[#9B99B7]/50 text-sm flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0 ${cat.bg} ${cat.text}`}
                >
                  {cat.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#2D2B4E] font-body leading-relaxed">
                {q.question}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4F46E5] hover:bg-[#6366F1] text-white rounded-2xl font-semibold font-body transition-colors shadow-lg shadow-[#4F46E5]/25"
        >
          Start Interview <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step: Interview ──────────────────────────────────────────────────────────

function InterviewStep({
  question,
  questionIndex,
  totalQuestions,
  timerChosen,
  timerDuration,
  timeLeft,
  timerActive,
  onChooseTimer,
  transcript,
  setTranscript,
  isRecording,
  speechSupported,
  onStartRecording,
  onStopRecording,
  hintVisible,
  onToggleHint,
  onSubmit,
}: {
  question: InterviewQuestion;
  questionIndex: number;
  totalQuestions: number;
  timerChosen: boolean;
  timerDuration: TimerDuration;
  timeLeft: number;
  timerActive: boolean;
  onChooseTimer: (d: TimerDuration) => void;
  transcript: string;
  setTranscript: (t: string) => void;
  isRecording: boolean;
  speechSupported: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  hintVisible: boolean;
  onToggleHint: () => void;
  onSubmit: () => void;
}) {
  const cat = CATEGORY_STYLES[question.category] ?? CATEGORY_STYLES.behavioural;
  const canSubmit = transcript.trim().length > 0 && !isRecording;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#6B6B8D] uppercase tracking-widest font-body">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
          {cat.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full">
        <motion.div
          className="h-full bg-[#4F46E5] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-[#4F46E5]/5 to-[#A1C9F1]/10 rounded-2xl p-6 border border-[#4F46E5]/10">
        <p className="font-display font-bold text-lg text-[#2D2B4E] leading-snug">{question.question}</p>
      </div>

      {/* Hint */}
      <div>
        <button
          onClick={onToggleHint}
          className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5] hover:text-[#6366F1] transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {hintVisible ? 'Hide hint' : 'Show hint'}
        </button>
        <AnimatePresence>
          {hintVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-body font-medium leading-relaxed">{question.hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timer */}
      {!timerChosen ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6B6B8D]" />
            <span className="text-sm font-semibold text-[#6B6B8D] font-body">Choose response time:</span>
          </div>
          <div className="flex gap-3">
            {([60, 90, 120] as TimerDuration[]).map((d) => (
              <button
                key={d}
                onClick={() => onChooseTimer(d)}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#4F46E5]/20 text-sm font-bold text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all font-body"
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <TimerRing timeLeft={timeLeft} total={timerDuration} size={160} />
        </div>
      )}

      {/* Recording */}
      <div className="space-y-3">
        {speechSupported ? (
          <div className="flex items-center gap-3">
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all font-body ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-[#4F46E5] hover:bg-[#6366F1] text-white shadow-lg shadow-[#4F46E5]/25'
              }`}
            >
              {isRecording ? (
                <>
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <Mic className="w-4 h-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4" />
                  Record Answer
                </>
              )}
            </button>
            {isRecording && (
              <motion.span
                className="text-xs font-semibold text-red-500 font-body"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Recording…
              </motion.span>
            )}
          </div>
        ) : (
          <p className="text-xs text-amber-600 font-body font-medium bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            Voice recording is not supported in this browser. Please type your answer below.
          </p>
        )}

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your answer will appear here as you speak, or type directly…"
          rows={5}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-body text-[#2D2B4E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]/40 transition"
        />
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-3.5 rounded-2xl font-semibold font-body text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-[#4F46E5] hover:bg-[#6366F1] text-white shadow-lg shadow-[#4F46E5]/25 disabled:shadow-none"
      >
        Submit Answer <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step: Evaluation ─────────────────────────────────────────────────────────

function EvaluationStep({
  evaluation,
  questionIndex,
  totalQuestions,
  onNext,
}: {
  evaluation: Evaluation;
  questionIndex: number;
  totalQuestions: number;
  onNext: () => void;
}) {
  const gc = gradeColor(evaluation.overallScore);
  const isLast = questionIndex >= totalQuestions - 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-[#2D2B4E]">Answer Evaluation</h3>
        <span className="text-xs font-bold text-[#6B6B8D] font-body">
          Q{questionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Score + grade */}
      <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <ScoreRing score={evaluation.overallScore} size={120} strokeWidth={10} />
        <div className="space-y-2">
          <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${gc.bg} ${gc.text}`}>
            {evaluation.grade}
          </span>
          <p className="text-sm font-body text-[#3B3A5C] leading-relaxed max-w-sm">{evaluation.summary}</p>
        </div>
      </div>

      {/* Strengths & improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 space-y-3">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Strengths</h4>
          <ul className="space-y-2">
            {evaluation.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body text-[#2D2B4E] font-medium">
                <CheckCircle className="w-4 h-4 text-[#A8E6CF] flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 space-y-3">
          <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest">Areas to Improve</h4>
          <ul className="space-y-2">
            {evaluation.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body text-[#2D2B4E] font-medium">
                <TrendingUp className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Metric bars */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
        <h4 className="text-xs font-bold text-[#6B6B8D] uppercase tracking-widest flex items-center gap-2">
          <BarChart2 className="w-3.5 h-3.5" /> Detailed Metrics
        </h4>
        <div className="space-y-3">
          {(Object.entries(evaluation.metrics) as [string, number][]).map(([key, val]) => (
            <MetricBar key={key} label={key} value={val} />
          ))}
        </div>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-2xl font-semibold font-body text-sm bg-[#4F46E5] hover:bg-[#6366F1] text-white shadow-lg shadow-[#4F46E5]/25 transition-colors flex items-center justify-center gap-2"
      >
        {isLast ? (
          <>
            <Award className="w-4 h-4" /> View Session Summary
          </>
        ) : (
          <>
            Next Question <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Step: Summary ────────────────────────────────────────────────────────────

function SummaryStep({
  questions,
  evaluations,
  avgScore,
  topStrengths,
  topImprovements,
  onPracticeAgain,
  onClose,
}: {
  questions: InterviewQuestion[];
  evaluations: (Evaluation | null)[];
  avgScore: number;
  topStrengths: string[];
  topImprovements: string[];
  onPracticeAgain: () => void;
  onClose: () => void;
}) {
  const gc = gradeColor(avgScore);

  return (
    <div className="space-y-7">
      <div className="text-center space-y-2">
        <h3 className="font-display font-bold text-2xl text-[#2D2B4E]">Session Complete</h3>
        <p className="text-sm text-[#6B6B8D] font-body">Here's how you performed across all 5 questions.</p>
      </div>

      {/* Overall score */}
      <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-[#4F46E5]/5 to-[#A1C9F1]/10 rounded-2xl p-8 border border-[#4F46E5]/10">
        <ScoreRing score={avgScore} size={140} strokeWidth={12} />
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${gc.bg} ${gc.text}`}>
          Overall Score
        </span>
      </div>

      {/* Breakdown table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#6B6B8D] uppercase tracking-widest">Question Breakdown</h4>
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm font-body">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#6B6B8D] uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#6B6B8D] uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-[#6B6B8D] uppercase tracking-wider">Score</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-[#6B6B8D] uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {questions.map((q, i) => {
                const ev = evaluations[i];
                const cat = CATEGORY_STYLES[q.category] ?? CATEGORY_STYLES.behavioural;
                return (
                  <tr key={i} className="bg-white">
                    <td className="px-4 py-3 font-mono font-bold text-[#9B99B7]/60 text-xs">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                        {cat.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#2D2B4E]">
                      {ev ? `${ev.overallScore}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ev ? (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${gradeColor(ev.overallScore).bg} ${gradeColor(ev.overallScore).text}`}>
                          {ev.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top strengths + improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topStrengths.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Top Strengths</h4>
            <ul className="space-y-2">
              {topStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-body text-[#2D2B4E] font-medium">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {topImprovements.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 space-y-3">
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest">Focus Areas</h4>
            <ul className="space-y-2">
              {topImprovements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-body text-[#2D2B4E] font-medium">
                  <TrendingUp className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onPracticeAgain}
          className="flex-1 py-3.5 rounded-2xl font-semibold font-body text-sm bg-[#4F46E5] hover:bg-[#6366F1] text-white shadow-lg shadow-[#4F46E5]/25 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Practice Again
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl font-semibold font-body text-sm bg-white hover:bg-gray-50 text-[#2D2B4E] border border-gray-200 shadow-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
