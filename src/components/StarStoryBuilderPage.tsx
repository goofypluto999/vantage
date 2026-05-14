import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Layers, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/star-story-builder -- STAR (Situation/Task/Action/Result) and
 * variant story builder. Pure client-side, deterministic templates.
 *
 * Drafted 2026-05-10. 14th free tool. Captures the massive search-
 * volume "STAR method examples" / "behavioural interview answer"
 * surface. Per the State of 2026 report, candidates need 8-10 STAR
 * stories with REAL FAILURES — not 4 polished ones. This builder
 * forces specificity and outputs three story shapes.
 */

type Principle =
  | 'ownership'
  | 'bias_for_action'
  | 'customer_obsession'
  | 'disagree_commit'
  | 'deliver_results'
  | 'invent_simplify'
  | 'earn_trust'
  | 'frugality'
  | 'are_right_a_lot'
  | 'learn_curious'
  | 'highest_standards'
  | 'think_big'
  | 'leadership'
  | 'failure_recovery'
  | 'cross_functional'
  | 'ambiguous_decision';

interface Inputs {
  situationContext: string;
  taskOwnership: string;
  actionsTaken: string;
  resultMetric: string;
  whatYouLearned: string;
  principle: Principle;
  storyType: 'success' | 'failure_recovered' | 'still_unresolved';
}

interface Variant {
  label: string;
  text: string;
  why: string;
  charCount: number;
}

const PRINCIPLE_LABEL: Record<Principle, string> = {
  ownership: 'Ownership',
  bias_for_action: 'Bias for Action',
  customer_obsession: 'Customer Obsession',
  disagree_commit: 'Have Backbone; Disagree and Commit',
  deliver_results: 'Deliver Results',
  invent_simplify: 'Invent and Simplify',
  earn_trust: 'Earn Trust',
  frugality: 'Frugality',
  are_right_a_lot: 'Are Right, A Lot',
  learn_curious: 'Learn and Be Curious',
  highest_standards: 'Insist on Highest Standards',
  think_big: 'Think Big',
  leadership: 'Leadership / managing without authority',
  failure_recovery: 'Failure recovery',
  cross_functional: 'Cross-functional collaboration',
  ambiguous_decision: 'Ambiguous decision with incomplete data',
};

function buildStories(i: Inputs): { variants: Variant[]; tips: string[]; warnings: string[] } {
  const sit = i.situationContext.trim();
  const task = i.taskOwnership.trim();
  const actions = i.actionsTaken.trim();
  const result = i.resultMetric.trim();
  const learned = i.whatYouLearned.trim();
  const principleLabel = PRINCIPLE_LABEL[i.principle];

  const variants: Variant[] = [];

  // Variant 1: Classic STAR (90-second answer)
  const v1 = [
    `Situation: ${sit || '[CONTEXT — when and where did this happen, who was involved]'}.`,
    `Task: ${task || '[YOUR SPECIFIC OWNERSHIP — what were YOU on the hook for, not the team]'}.`,
    `Action: ${actions || '[2-3 SPECIFIC THINGS YOU DID — verbs first, decisions made, trade-offs you committed to]'}.`,
    `Result: ${result || '[METRIC + TIME — by how much, for how many, in what period]'}${i.storyType === 'failure_recovered' ? '. The recovery alone took us from [Z] to [Y].' : i.storyType === 'still_unresolved' ? '. We did not fully resolve it; six months later [HONEST STATUS].' : ''}.`,
    learned ? `What I learned: ${learned}.` : '',
  ].filter(Boolean).join('\n\n');

  variants.push({
    label: 'Classic STAR (90-second answer)',
    text: v1,
    why: 'The interviewer rubric expects this shape. Most candidates skip Task ("what was YOUR ownership specifically") and conflate it with Situation. Calling out Task explicitly signals seniority.',
    charCount: v1.length,
  });

  // Variant 2: Hook-led / Problem-led (45-second variant)
  const v2 = [
    `${sit || '[ONE SENTENCE: the problem in plain language]'}. The thing on the line was ${result ? `[${result.split(/\s+/).slice(0, 5).join(' ')}…]` : '[the specific stake]'}.`,
    '',
    `I owned ${task || '[your slice]'}. My move was: ${actions || '[the 2-3 specific things you did, in order]'}.`,
    '',
    `Outcome: ${result || '[metric]'}.${learned ? ` What changed in how I work since then: ${learned}.` : ''}`,
  ].join('\n');

  variants.push({
    label: 'Problem-led (45-second variant — for follow-ups)',
    text: v2,
    why: 'Tighter version for when the interviewer says "give me a quick example" or follows up after another question. Same content, removed throat-clearing. Hits all four S/T/A/R beats in 4 short paragraphs.',
    charCount: v2.length,
  });

  // Variant 3: Specifically calibrated to the principle
  let principleFraming = '';
  switch (i.principle) {
    case 'ownership':
      principleFraming = 'Mid-action paragraph should explicitly include "no one else was going to do it" or "I picked it up because [reason]" — the principle is filtering for whether you take ownership without permission.';
      break;
    case 'bias_for_action':
      principleFraming = 'Result paragraph needs a SHORT TIMELINE explicitly. Days, not months. The principle is filtering for action speed, not action quality.';
      break;
    case 'customer_obsession':
      principleFraming = 'Insert a "the customer was telling us X but their behaviour showed Y" detail. The principle is filtering for whether you read between the lines of customer feedback.';
      break;
    case 'disagree_commit':
      principleFraming = 'Action paragraph needs an explicit "I disagreed with [X], said so in [forum], lost the argument, then committed". The principle is filtering for the COMMIT half — not just the disagree half.';
      break;
    case 'deliver_results':
      principleFraming = 'Result needs a HARD METRIC AND a peer comparison. "Cut load time 60%" alone is fine; "Cut load time 60% — the next-best team in our org cut 18%" is calibrated.';
      break;
    case 'failure_recovery':
      principleFraming = 'The story IS the failure. Lead with what broke. Resist the urge to soften with "we were trying to" framing — interviewers see through it.';
      break;
    case 'ambiguous_decision':
      principleFraming = 'Action paragraph must include "I committed to [X] because [Y, with explicit acknowledgement of unknowns]". The principle is filtering for whether you decide under uncertainty without paralysis.';
      break;
    default:
      principleFraming = 'Tie the action paragraph explicitly to the principle name. The interviewer is grading against a rubric and will mark "did not surface principle" if the connection isn\'t obvious.';
  }

  const v3 = [
    `Targeting principle: ${principleLabel}.`,
    '',
    `${sit || '[Situation]'}.`,
    '',
    `My ownership: ${task || '[Task]'}.`,
    '',
    `Action: ${actions || '[Action — and: ' + principleFraming + ']'}.`,
    '',
    `Result: ${result || '[Result with metric]'}.`,
    learned ? `\nReflecting: ${learned}.` : '',
  ].filter(Boolean).join('\n');

  variants.push({
    label: `Principle-calibrated (${principleLabel})`,
    text: v3,
    why: principleFraming,
    charCount: v3.length,
  });

  // Tips
  const tips: string[] = [];
  tips.push('Time the story spoken-out-loud. 90 seconds = ~225 words. If your answer is over 350 words you are losing the interviewer mid-Action paragraph.');
  tips.push('Lead with the metric in the Situation when possible. "We had a 23% week-over-week churn spike" is more gripping than "I worked on retention".');
  tips.push('Never use "we" in the Action paragraph. The interviewer is grading YOUR contribution; "we" reads as inability to claim individual credit.');
  tips.push('Failure stories beat success stories at senior+ levels. A clean "I shipped X and it worked" story scores lower than "I shipped X, the first launch broke Y, here is how I recovered".');
  tips.push('Always end with What-I-Learned. Even success stories. The reflection paragraph is the single biggest signal of seniority — junior candidates skip it; senior candidates ALWAYS include it.');
  tips.push('Interviewers ask follow-ups. Have ready: "what would you do differently?", "who disagreed?", "what was the alternative you rejected?". The follow-ups are where rehearsed stories fall apart.');
  if (i.storyType === 'success') {
    tips.push('Success-only stories at staff+ level read suspicious. Pair this story with a failure-recovery story in your prep deck.');
  }

  // Warnings
  const warnings: string[] = [];
  if (!result) {
    warnings.push('No metric in Result. The single most important thing in a STAR answer. "Improved performance" without a number scores 30/100; "Cut p99 from 800ms to 90ms in 6 weeks" scores 90/100.');
  }
  if (!task || task.length < 15) {
    warnings.push('Task / ownership paragraph is missing or thin. The most-skipped beat in STAR. Be explicit: what were YOU on the hook for, not the team?');
  }
  if (actions.length > 0 && /\bwe\b/i.test(actions)) {
    warnings.push('"We" detected in Action paragraph. Replace with "I" — the interviewer is grading individual contribution, not team output.');
  }
  if (i.storyType === 'success' && i.principle === 'failure_recovery') {
    warnings.push('Story type "success" + principle "failure recovery" is contradictory. Either the failure-recovery is the principle (in which case this is not a success story), or you should pick a different principle.');
  }

  return { variants, tips, warnings };
}

export default function StarStoryBuilderPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    situationContext: '',
    taskOwnership: '',
    actionsTaken: '',
    resultMetric: '',
    whatYouLearned: '',
    principle: 'ownership',
    storyType: 'success',
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildStories> | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerated(buildStories(i));
    setTimeout(() => {
      const el = document.getElementById('star-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'STAR Story Builder', item: `${SITE_URL}/tools/star-story-builder` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free STAR Story Builder — Calibrated to 16 Behavioural Principles"
        description="Free in-browser STAR (Situation / Task / Action / Result) story builder. Pick principle (Ownership / Bias for Action / Customer Obsession / 13 more) + story type. Get 3 calibrated variants (Classic STAR, Problem-led 45-second, Principle-calibrated) plus 7 tips. Pure client-side. No signup."
        path="/tools/star-story-builder"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">AimVantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            10 free prep packs
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            STAR story builder
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Per the 2026 hiring report, you need 8-10 stories with REAL FAILURES — not 4 polished
            ones. Plug in Situation / Task / Action / Result, pick a principle, get 3 calibrated
            variants. Pure client-side.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Story type</label>
              <select
                value={i.storyType}
                onChange={(e) => setI({ ...i, storyType: e.target.value as Inputs['storyType'] })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="success">Success (worked end-to-end)</option>
                <option value="failure_recovered">Failure I recovered from</option>
                <option value="still_unresolved">Still unresolved (showing self-awareness)</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Principle to target</label>
              <select
                value={i.principle}
                onChange={(e) => setI({ ...i, principle: e.target.value as Principle })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {(Object.keys(PRINCIPLE_LABEL) as Principle[]).map((p) => (
                  <option key={p} value={p}>{PRINCIPLE_LABEL[p]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Situation (the context — when, where, what was at stake)</label>
              <textarea
                rows={2}
                value={i.situationContext}
                onChange={(e) => setI({ ...i, situationContext: e.target.value })}
                placeholder="Q3 2024: our checkout p99 spiked from 600ms to 2.4s overnight; we were 8 days from Black Friday."
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Task (YOUR ownership — not the team's)</label>
              <textarea
                rows={2}
                value={i.taskOwnership}
                onChange={(e) => setI({ ...i, taskOwnership: e.target.value })}
                placeholder="As tech lead, I owned root-cause + fix-rollout + write-up. The team had ramped down for the holiday."
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Action (what you did — verbs first, 2-3 specific moves)</label>
              <textarea
                rows={3}
                value={i.actionsTaken}
                onChange={(e) => setI({ ...i, actionsTaken: e.target.value })}
                placeholder="Pulled traces from the previous 24h. Found a deploy that flipped a feature flag for a slow N+1 query path. Rolled the flag back, pushed a query-batching patch, ran p99 trend monitoring for 48h."
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Result (with a HARD METRIC)</label>
              <textarea
                rows={2}
                value={i.resultMetric}
                onChange={(e) => setI({ ...i, resultMetric: e.target.value })}
                placeholder="p99 back to 580ms within 6 hours. Black Friday hit 2.1x prior-year traffic at p99 < 700ms."
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>What you learned (the seniority signal)</label>
              <textarea
                rows={2}
                value={i.whatYouLearned}
                onChange={(e) => setI({ ...i, whatYouLearned: e.target.value })}
                placeholder="Feature flags need a documented rollback owner per flag, not just a flag-creator. Now part of our deploy checklist."
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Layers className="w-4 h-4" /> Generate 3 variants
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="star-results"
            className="scroll-mt-24 space-y-4"
          >
            {generated.warnings.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-amber-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h3 className={`font-bold ${t.text}`}>Heads up before rehearsing</h3>
                </div>
                <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                  {generated.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            )}

            <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Story variants</h2>

            {generated.variants.map((v, idx) => (
              <div key={idx} className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className={`text-xs font-bold uppercase tracking-widest text-violet-500`}>
                    Variant {idx + 1} · {v.label} · ~{Math.round(v.charCount / 4.5)} words
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(v.text, idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                      copiedIndex === idx
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                    }`}
                  >
                    {copiedIndex === idx ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed mt-3 ${t.cardInner} rounded-lg p-3`}>{v.text}</pre>
                <p className={`mt-3 text-xs ${t.textMuted}`}>
                  <strong className={t.textSub}>Why this works:</strong> {v.why}
                </p>
              </div>
            ))}

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Rehearsal tips</p>
              <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                {generated.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Build 8-10 of these. Then run the full prep on your job link.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your CV + a job link, drafts a tailored cover letter, generates likely
                interview questions, and builds a 5-min pitch outline. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=star-story-builder"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run my prep <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>Other free tools, no signup:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Bullet rewriter</Link>
            <Link to="/tools/layoff-playbook" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Layoff playbook</Link>
            <Link to="/tools/cover-letter-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Cover letter compare</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation</Link>
            <Link to="/tools/thank-you-note" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Thank-you note</Link>
            <Link to="/tools/linkedin-about" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>LinkedIn About</Link>
            <Link to="/tools/recruiter-reply" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Recruiter reply</Link>
            <Link to="/tools/cold-email-hiring-manager" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Hiring-manager email</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
