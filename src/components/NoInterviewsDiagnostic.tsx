import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, AlertTriangle, Target, FileSearch,
  Compass, TrendingDown, MessageSquare, Briefcase, RotateCcw,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { taskStarted, recordTaskCompletion, armExitFastDetector, track } from '../lib/track';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/no-interviews-diagnostic — GOLDEN GOSPEL Tactic 6 (2026-05-08).
 *
 * Pre-conversion engagement loop for the "200 applications, 0 interviews"
 * cohort. They arrive in pure frustration, feel stuck, and need a
 * verdict more than they need another tool to subscribe to. This is a
 * pure-frontend self-diagnostic (no API call) that takes 5 inputs and
 * routes them to one of 5 verdicts:
 *
 *   1. POSITIONING — generic CV / cover letter, not tailored to role
 *   2. ATS-FILTER — CV is failing the parser before a human reads it
 *   3. TARGETING — applying too broadly or to wrong-seniority roles
 *   4. PROOF — JD-aligned achievements aren't visible enough on the CV
 *   5. MARKET — the role-and-region combination is genuinely cold right now
 *
 * Each verdict points to a concrete Vantage tool (or external when honest).
 * SEO target: "I have 200 applications and no interviews", "no interviews
 * after 100 applications", "why am I not getting interviews".
 *
 * The verdict logic is deterministic (no LLM call, no privacy concern,
 * no token cost). The user gets the answer in 0 seconds and the tool
 * loads in <100ms.
 */

type Q = {
  id: string;
  question: string;
  helper?: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Q[] = [
  {
    id: 'apps',
    question: 'How many applications have you sent in the last 8 weeks?',
    options: [
      { value: 'under20', label: 'Under 20' },
      { value: '20to50', label: '20 to 50' },
      { value: '50to150', label: '50 to 150' },
      { value: 'over150', label: 'Over 150' },
    ],
  },
  {
    id: 'interviews',
    question: 'How many of those have led to a first interview (any stage)?',
    options: [
      { value: 'zero', label: 'Zero' },
      { value: 'one', label: 'One' },
      { value: 'twoToFour', label: '2 to 4' },
      { value: 'fivePlus', label: '5 or more' },
    ],
  },
  {
    id: 'tailoring',
    question: 'How often do you tailor your CV and cover letter to the specific role?',
    helper: 'Be honest — most people tailor much less than they think.',
    options: [
      { value: 'never', label: 'Never — I send the same one every time' },
      { value: 'cover', label: 'Cover letter only' },
      { value: 'lightCv', label: 'Cover letter + small CV tweaks' },
      { value: 'fullEach', label: 'Full rewrite for each application' },
    ],
  },
  {
    id: 'seniority',
    question: 'How does the role seniority compare to your last job?',
    options: [
      { value: 'down', label: 'I\'m applying to roles BELOW my last title' },
      { value: 'lateral', label: 'Roughly the same level' },
      { value: 'oneUp', label: 'One step up (e.g., senior → staff)' },
      { value: 'twoUp', label: 'Two or more steps up' },
    ],
  },
  {
    id: 'market',
    question: 'What\'s your role + market?',
    helper: 'Be honest about how active your field is right now.',
    options: [
      { value: 'hot', label: 'Hot field with lots of openings (AI, infra, ML, sales)' },
      { value: 'normal', label: 'Normal — openings exist but not abundant' },
      { value: 'cold', label: 'Cold — recent layoffs, hiring freezes, or shrinking sector' },
      { value: 'unsure', label: 'Honestly not sure' },
    ],
  },
];

type Answers = Record<string, string>;

type Verdict = {
  key: string;
  primary: string;     // headline diagnosis
  body: string;        // explanation
  fix: string;         // concrete next move
  cta: { to: string; label: string; external?: boolean };
  icon: typeof Target;
  color: string;       // tailwind color stem
};

function diagnose(a: Answers): Verdict {
  const apps = a.apps;
  const interviews = a.interviews;
  const tailoring = a.tailoring;
  const seniority = a.seniority;
  const market = a.market;

  // 1. ATS-filter: high apps, zero interviews, very little tailoring or
  //    seniority mismatch. The classic 200-applications-0-interviews case.
  if (
    (apps === 'over150' || apps === '50to150') &&
    interviews === 'zero' &&
    (tailoring === 'never' || tailoring === 'cover')
  ) {
    return {
      key: 'ats',
      primary: 'You\'re likely getting filtered before a human reads anything.',
      body:
        'Volume + zero interviews + minimal tailoring is the signature of an ATS filter problem. ' +
        'The keyword bar in 2026 is brutal — Workday, Greenhouse, and Taleo dump CVs that don\'t echo the JD\'s exact phrasing into a "low match" pile that no recruiter ever opens. ' +
        'You don\'t have a writing problem; you have a parser problem.',
      fix:
        'Run your CV through CV Mirror (the free ATS checker we built). ' +
        'It shows you exactly how Workday, Greenhouse, Lever, Taleo, and iCIMS each parse your CV — including the reading order, the keyword density, and the lint warnings each parser raises. Fix those first, then come back for tailored prep packs.',
      cta: { to: 'https://cv-mirror-web.vercel.app/', label: 'Open CV Mirror →', external: true },
      icon: FileSearch,
      color: 'rose',
    };
  }

  // 2. Targeting / seniority mismatch: applying 2+ steps up.
  if (seniority === 'twoUp' && interviews === 'zero') {
    return {
      key: 'targeting',
      primary: 'Targeting mismatch — you\'re skipping the rung the market wants.',
      body:
        'Two-step jumps (e.g., senior → director, IC → head-of) almost never happen at first-look. ' +
        'Hiring managers rarely take the risk on someone they have to "level up" two notches. ' +
        'A flat-out rejection at this level usually means the door isn\'t closed forever — the door is one rung lower.',
      fix:
        'Mix in roles one level up too. Use the Ghost Job Detector to filter the listings that say "senior+" but actually want a director (a real pattern in 2026). ' +
        'When you find a true one-step-up role, tailor the prep pack hard with the company-specific brief.',
      cta: { to: '/ghost-job-check', label: 'Open Ghost Job Detector →' },
      icon: Compass,
      color: 'amber',
    };
  }

  // 3. Cold market: high apps, low interviews, market is cold.
  if (market === 'cold' && (interviews === 'zero' || interviews === 'one')) {
    return {
      key: 'market',
      primary: 'It\'s not (just) you. The market for your role is cold right now.',
      body:
        'When the market is cold, even strong candidates sit at sub-1% interview-conversion. ' +
        'Standard advice ("just apply more") is the worst advice — it accelerates burnout without changing the math. ' +
        'You need to switch from volume to extreme tailoring on a small number of high-fit roles, AND start working warm-intro channels in parallel.',
      fix:
        'Cut your volume in half. For each application, write a fully-tailored prep pack (Vantage does the heavy lifting in 90 seconds). ' +
        'Read the layoff playbook for the cohort approach to warm-intro outreach.',
      cta: { to: '/playbook', label: 'Layoff playbook (warm-intro tactics) →' },
      icon: TrendingDown,
      color: 'sky',
    };
  }

  // 4. Positioning: you tailor, but it's surface-level (cover letter only)
  //    AND you have moderate volume with zero interviews.
  if (
    tailoring === 'cover' &&
    (apps === '20to50' || apps === '50to150') &&
    interviews === 'zero'
  ) {
    return {
      key: 'positioning',
      primary: 'You\'re tailoring the cover letter, but the CV is the bottleneck.',
      body:
        'The cover letter is read by 15% of recruiters; the CV is read by 100% of them. ' +
        'When the CV stays generic, the recruiter reads "applicable but not specifically suited" and moves on. ' +
        'Cover-only tailoring also scores badly with most ATS systems because the CV is the document that gets keyword-scored.',
      fix:
        'Run a full Vantage prep pack on your next application. The fit-score card tells you exactly which CV bullets are below the JD\'s required-keyword bar before you submit. Fix those, then write the cover.',
      cta: { to: '/register', label: 'Try Vantage free (10 prep packs) →' },
      icon: Target,
      color: 'violet',
    };
  }

  // 5. Proof: you tailor properly but still get nothing — likely missing
  //    JD-aligned proof points, or applying down (which signals desperate).
  if (
    (tailoring === 'lightCv' || tailoring === 'fullEach') &&
    interviews === 'zero' &&
    seniority !== 'twoUp'
  ) {
    return {
      key: 'proof',
      primary: 'You tailor — but the proof points aren\'t loud enough.',
      body:
        'When tailoring is solid and seniority is right but interviews stay at zero, it\'s usually because the JD-aligned achievements on the CV are buried, vague, or don\'t carry numbers. ' +
        'Recruiters scan in 6 seconds — if the right proof isn\'t in the top third, it doesn\'t exist to them.',
      fix:
        'Get a brutal-honest read on the cover letter (free roast tool — quotes your actual lines and gives the better swap), then run a full prep pack to align CV bullets to the JD\'s top 5 requirements.',
      cta: { to: '/roast', label: 'Get a free cover-letter roast →' },
      icon: MessageSquare,
      color: 'orange',
    };
  }

  // 6. Applying down (often signals overqualified red flag).
  if (seniority === 'down' && interviews === 'zero') {
    return {
      key: 'down',
      primary: 'Applying below your last title triggers an "overqualified" flag.',
      body:
        'Recruiters auto-reject candidates one full level above the role on the assumption they\'ll leave for a better offer in 6 months. ' +
        'If you genuinely want the down-level role, you have to address it directly in the cover letter — and your CV needs to NOT scream "former senior" at the top.',
      fix:
        'Use Vantage to write a cover letter with the "Direct" tone selected — it lets you address the level question head-on. ' +
        'Pair it with a re-framed CV that leads with the role-relevant work, not the title.',
      cta: { to: '/register', label: 'Try Vantage free (10 prep packs) →' },
      icon: Briefcase,
      color: 'pink',
    };
  }

  // 7. Healthy: low volume + some interviews + good tailoring.
  if (
    interviews !== 'zero' &&
    (tailoring === 'lightCv' || tailoring === 'fullEach') &&
    (apps === 'under20' || apps === '20to50')
  ) {
    return {
      key: 'healthy',
      primary: 'You\'re actually doing fine. Don\'t panic-apply.',
      body:
        'Conversion is real, you tailor properly, and your volume is reasonable. ' +
        'The biggest risk in your spot is panic-applying to weak-fit roles, which dilutes the signal recruiters get from your applications. ' +
        'Keep your hit-rate high; don\'t chase volume.',
      fix:
        'Sharpen interview prep on the roles you ARE getting. The Vantage interview pack generates 8-12 likely questions from the JD plus a 5-minute pitch you can rehearse out loud.',
      cta: { to: '/interview-prep', label: 'Interview prep packs →' },
      icon: Activity,
      color: 'emerald',
    };
  }

  // Fallback: insufficient signal — generic.
  return {
    key: 'unclear',
    primary: 'Hard to give one verdict — you have a mix of signals.',
    body:
      'Your inputs don\'t cluster cleanly into a single failure mode. The most likely path forward is to test where the leak actually is: parser, positioning, or proof. The fastest way to tell is to run one application end-to-end with a tailored prep pack and compare against your standard one.',
    fix:
      'Run one full Vantage prep pack on a high-fit role this week. If you still get filtered, the bottleneck is ATS — not writing.',
    cta: { to: '/register', label: 'Try Vantage free (10 prep packs) →' },
    icon: AlertTriangle,
    color: 'violet',
  };
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-300',    icon: 'text-rose-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-300',   icon: 'text-amber-400' },
  sky:     { bg: 'bg-sky-500/10',     border: 'border-sky-500/30',     text: 'text-sky-300',     icon: 'text-sky-400' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-300',  icon: 'text-violet-400' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-300',  icon: 'text-orange-400' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    text: 'text-pink-300',    icon: 'text-pink-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', icon: 'text-emerald-400' },
};

export default function NoInterviewsDiagnostic() {
  const { t } = useTheme();
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);

  const allAnswered = QUESTIONS.every((q) => !!answers[q.id]);
  const verdict = useMemo(() => (allAnswered ? diagnose(answers) : null), [answers, allAnswered]);

  // Mount: arm exit-fast detector + tag the start of the diagnostic task.
  useEffect(() => {
    taskStarted('/tools/no-interviews-diagnostic', 'diagnostic_started');
    const cleanup = armExitFastDetector('/tools/no-interviews-diagnostic', 15);
    return cleanup;
  }, []);

  // Verdict shown = task complete.
  useEffect(() => {
    if (verdict) {
      recordTaskCompletion('/tools/no-interviews-diagnostic', 'verdict_shown');
      track('diagnostic_verdict', { verdict_key: verdict.key });
    }
  }, [verdict]);
  const colors = verdict ? COLOR_MAP[verdict.color] : null;

  function answer(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'No Interviews Diagnostic', item: `${SITE_URL}/tools/no-interviews-diagnostic` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'I sent 200 applications and have zero interviews — what does that mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '200 applications with zero interviews almost always means an ATS filter problem (your CV is being dumped into a low-match pile by Workday, Greenhouse, or Taleo before any human sees it) OR a targeting problem (you\'re applying for roles 2 steps above your last title). The Vantage diagnostic asks 5 questions and tells you which of 7 likely failure modes is yours, with a concrete next step.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does the diagnostic take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'About 60 seconds. 5 multiple-choice questions, no signup, no email collection. The verdict is computed locally in your browser — there is no server call.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="No Interviews After 100 Applications? Free 60-Second Diagnostic | Vantage"
        description="200 applications, zero interviews? Run the free Vantage diagnostic. 5 questions, 60 seconds, deterministic verdict — ATS filter, positioning, targeting, proof, market, or overqualified. No signup. Built by a UK indie founder."
        path="/tools/no-interviews-diagnostic"
        jsonLd={[breadcrumbSchema, faqSchema]}
      />

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/tools" className="hover:underline">Free tools</Link>
          <span className="mx-2">/</span>
          <span>No interviews diagnostic</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white">
            <Activity className="w-6 h-6" />
          </span>
          <div>
            <div className={`text-xs uppercase tracking-wider ${t.textMuted}`}>Free · 60 seconds · no signup</div>
            <h1 className={`text-3xl md:text-5xl font-bold ${t.text}`}>Why aren’t you getting interviews?</h1>
          </div>
        </div>

        <p className={`text-base md:text-lg mb-8 ${t.textSub}`}>
          Five quick questions. Deterministic verdict. No email collection, no LLM call — the diagnosis is computed in your browser.
          You’ll land on one of seven failure modes, with a concrete next move.
        </p>

        {!verdict && (
          <div className={`${t.glass} rounded-2xl p-5 md:p-7 mb-8`}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${t.textMuted}`}>
              Question {step + 1} of {QUESTIONS.length}
            </div>
            <h2 className={`text-xl md:text-2xl font-bold ${t.text} mb-2`}>
              {QUESTIONS[step].question}
            </h2>
            {QUESTIONS[step].helper && (
              <p className={`text-sm mb-5 ${t.textSub}`}>{QUESTIONS[step].helper}</p>
            )}
            <div className="grid sm:grid-cols-2 gap-2">
              {QUESTIONS[step].options.map((opt) => {
                const selected = answers[QUESTIONS[step].id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => answer(QUESTIONS[step].id, opt.value)}
                    className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                      selected
                        ? 'border-violet-500/50 bg-violet-500/15 text-white'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 ' + t.text
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep(Math.max(0, step - 1))}
                className={`underline disabled:opacity-30 ${t.textMuted}`}
              >
                ← Back
              </button>
              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === step ? 'bg-violet-400' : i < step ? 'bg-violet-700' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {verdict && colors && (
          <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6 md:p-8 mb-8`}>
            <div className="flex items-start gap-3 mb-3">
              <verdict.icon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <div className="flex-1">
                <div className={`text-xs uppercase tracking-wider mb-1 ${colors.text}`}>Diagnosis</div>
                <h2 className={`text-xl md:text-2xl font-bold ${t.text}`}>
                  {verdict.primary}
                </h2>
              </div>
            </div>
            <p className={`text-sm md:text-base mb-4 leading-relaxed ${t.textSub}`}>
              {verdict.body}
            </p>
            <div className={`mt-5 pt-5 border-t border-white/10`}>
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>What to do next</div>
              <p className={`text-sm md:text-base mb-4 leading-relaxed ${t.text}`}>
                {verdict.fix}
              </p>
              <div className="flex flex-wrap gap-2">
                {verdict.cta.external ? (
                  <a
                    href={verdict.cta.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('diagnostic_primary_cta_click', { verdict: verdict.key })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
                  >
                    {verdict.cta.label}
                  </a>
                ) : (
                  <Link
                    to={verdict.cta.to}
                    onClick={() => track('diagnostic_primary_cta_click', { verdict: verdict.key })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
                  >
                    {verdict.cta.label}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 ${t.textSub} font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Re-run with different answers
                </button>
              </div>
              {/* Secondary path: every verdict points the user at the SPECIFIC
                  matching Vantage tool, but the full Vantage prep pack solves
                  most of these failure modes (ATS via CV Mirror integration,
                  positioning/proof via tailored cover letter + fit score,
                  targeting via company intelligence). The full prep pack is
                  the broader fix, so always offer it as a secondary onramp
                  with the verdict carried as a UTM param so we can attribute
                  signups back to which diagnostic verdict drove them. */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className={`text-xs ${t.textMuted}`}>
                  Or run a full Vantage prep pack against your next application:{' '}
                  <Link
                    to={`/register?source=diagnostic&verdict=${encodeURIComponent(verdict.key)}`}
                    onClick={() => track('diagnostic_secondary_register_click', { verdict: verdict.key })}
                    className="text-violet-400 hover:text-violet-300 underline font-semibold"
                  >
                    10 free prep packs on signup, no card →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Method note */}
        <div className={`text-xs ${t.textMuted} leading-relaxed mb-8`}>
          <strong className={t.textSub}>How this works:</strong> the diagnosis is computed entirely client-side from
          your 5 answers using a deterministic decision tree. No data is sent to any server, no LLM is called,
          nothing is logged. The seven failure-mode patterns are based on observed signals from job-search
          coaching frameworks plus 2026 ATS-vendor parser behavior. Last reviewed 2026-05-08.
        </div>

        {/* Trust + cross-link */}
        <div className={`text-xs ${t.textMuted} text-center mt-12`}>
          Built by Vantage AI · See <Link to="/receipts" className="underline">receipts</Link> for the
          full trust audit · <Link to="/tools" className="underline ml-1">All free tools</Link>
        </div>

        {/* Bottom CTA */}
        {!verdict && (
          <div className={`${t.glass} rounded-2xl p-5 mt-8 flex items-start gap-3`}>
            <ArrowRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
            <p className={`text-sm ${t.textSub}`}>
              Already know your bottleneck? Skip ahead to{' '}
              <Link to="/register" className="underline text-violet-400">10 free prep packs on signup</Link> — no card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
