import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, AlertTriangle, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/bullet-rewriter -- client-side CV bullet improver.
 *
 * Pure browser-side. No API calls. Diagnoses the most common CV-bullet
 * failure modes (passive verbs, missing metrics, jargon-stuffed,
 * responsibility-list framing) and produces 3 rewritten variants
 * using deterministic templates. Drafted 2026-05-10 to expand the
 * free-tool surface to 6.
 *
 * The rewrites are template-driven, NOT AI-driven. We don't fake
 * intelligence -- the user fills in the [METRIC] and [IMPACT] slots
 * themselves. The tool's value is the diagnosis + the structural
 * template, not invented content.
 */

interface Diagnosis {
  problems: string[];
  strengths: string[];
}

interface RewriteVariant {
  label: string;
  template: string;
  example: string;
  why: string;
}

// Weak / passive / vague verb patterns
const WEAK_VERBS = new Set([
  'helped', 'assisted', 'supported', 'worked', 'participated', 'involved',
  'responsible', 'duties', 'tasks', 'handled', 'managed', 'oversaw',
  'contributed', 'collaborated', 'coordinated', 'facilitated', 'engaged',
  'communicated', 'utilised', 'utilized', 'leveraged', 'partnered',
]);

// Strong / impact verbs (positive signal)
const STRONG_VERBS = new Set([
  'shipped', 'launched', 'built', 'designed', 'architected', 'led', 'drove',
  'reduced', 'increased', 'cut', 'grew', 'doubled', 'tripled', 'saved',
  'recovered', 'eliminated', 'fixed', 'rebuilt', 'migrated', 'automated',
  'created', 'delivered', 'scaled', 'optimised', 'optimized', 'shipped',
  'unblocked', 'rescued', 'consolidated', 'replaced', 'introduced',
]);

const FILLER_PHRASES = [
  /strong (?:knowledge|understanding|background|skills?) (?:of|in|with)/i,
  /excellent (?:communication|interpersonal|written) skills/i,
  /(?:cross[- ]?functional )?team[- ]?player/i,
  /detail[- ]?oriented/i,
  /self[- ]?starter/i,
  /go[- ]?getter/i,
  /passionate about/i,
  /proven track record/i,
  /results[- ]?driven/i,
  /strategic thinker/i,
  /innovative thinker/i,
  /thought leader/i,
];

function diagnose(text: string): Diagnosis {
  const problems: string[] = [];
  const strengths: string[] = [];
  const lower = text.toLowerCase();
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';

  // Verb diagnosis
  if (WEAK_VERBS.has(firstWord)) {
    problems.push(`Opens with weak verb "${firstWord}" — recruiter eyes glaze on weak verbs in the first word.`);
  } else if (STRONG_VERBS.has(firstWord)) {
    strengths.push(`Strong opening verb "${firstWord}" — keeps recruiter attention.`);
  }

  // Metric check (digits, percentages, currency, time)
  const hasMetric = /\d/.test(text) && /(%|\$|£|€|\d+\s?[kKmMbB](?![a-zA-Z])|\d+\s?(?:hours?|days?|weeks?|months?|years?|users?|customers?|engineers?|deals?|leads?|requests?|queries?|TPS|RPS|QPS|GB|TB))/.test(text);
  if (!hasMetric) {
    problems.push('No metric. Recruiters skim for numbers — every bullet should answer "by how much / for how many / over what period".');
  } else {
    strengths.push('Contains a measurable outcome.');
  }

  // Length check
  if (text.length < 40) {
    problems.push('Very short. The strongest bullets are 15-25 words and contain action + scope + outcome.');
  } else if (text.length > 220) {
    problems.push('Very long. Bullets longer than ~30 words get truncated by ATS parsers and skipped by recruiters.');
  }

  // Filler check
  for (const re of FILLER_PHRASES) {
    if (re.test(text)) {
      const match = text.match(re);
      if (match) {
        problems.push(`Filler phrase: "${match[0]}". These read as boilerplate and get filtered by both ATS keyword-density rankers and recruiter skim.`);
      }
    }
  }

  // Pronoun check
  if (/\b(?:I|me|my|mine)\b/i.test(text)) {
    problems.push('First-person pronoun. CV bullets should start with the verb, not "I" — implicit subject convention.');
  }

  // Responsibility-list framing
  if (/^(?:responsible for|in charge of|owned the|tasked with)/i.test(text.trim())) {
    problems.push('"Responsible for" framing. This describes a job description, not an outcome. Replace with action + result.');
  }

  // Jargon density
  const acronyms = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
  const words = text.split(/\s+/).length;
  if (words > 0 && acronyms / words > 0.15) {
    problems.push(`High acronym density (${acronyms} in ${words} words). Acronyms read fluent only to the same-domain reader; CVs are skimmed by generalist recruiters first.`);
  }

  // Year-old reference
  if (/(?:in|over)\s+\d+\s+years?\s+(?:I|of)/i.test(text)) {
    strengths.push('Specific time period — adds credibility.');
  }

  return { problems, strengths };
}

function generateRewrites(text: string): RewriteVariant[] {
  const trimmed = text.trim();
  return [
    {
      label: 'Action + scope + outcome',
      template: '[STRONG VERB] [WHAT] [SCOPE NUMBERS] [OUTCOME WITH METRIC]',
      example: 'Rebuilt the checkout flow for a 1.4M-user e-commerce platform; reduced cart abandonment from 68% to 41% in 3 months.',
      why: 'This is the strongest single template for CV bullets. Every recruiter rubric weighs it the same way: action verb tells me what you DID, scope numbers tell me the SIZE of the problem, outcome with metric tells me the IMPACT.',
    },
    {
      label: 'Problem + intervention + measurable change',
      template: 'Problem: [BUSINESS PROBLEM]. [WHAT YOU DID] [HOW]. Resulted in [METRIC CHANGE].',
      example: 'Problem: warehouse picking error rate at 4.2%. Redesigned the scan-and-confirm step in the picker mobile app. Resulted in a drop to 0.8% over 90 days.',
      why: 'Strong for senior+ levels where you are evaluated on judgment. Tells the reader what you SAW, what you TRIED, and what HAPPENED. Most candidates skip the "problem" framing and the bullet reads like a feature shipped instead of a business decision made.',
    },
    {
      label: 'Lead with the metric',
      template: '[BIG METRIC NUMBER] [WHAT THE METRIC IS]: [STRONG VERB] [WHAT YOU DID].',
      example: '$2.3M annual savings on AWS spend: rearchitected the batch-job scheduler to use spot instances + in-region failover.',
      why: 'High signal for VPs and director-level reviewers who read 20 bullets a minute. The number anchors first; the explanation lives second. Use this for your single biggest accomplishment, sparingly — every bullet leading with a number reads gimmicky.',
    },
  ];
  void trimmed;
}

export default function BulletRewriterPage() {
  const { t } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ diagnosis: Diagnosis; rewrites: RewriteVariant[] } | null>(null);

  const canAnalyse = text.trim().length >= 20;

  const handleAnalyse = () => {
    if (!canAnalyse) return;
    setResult({
      diagnosis: diagnose(text),
      rewrites: generateRewrites(text),
    });
    setTimeout(() => {
      const el = document.getElementById('bullet-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const overallBand = useMemo(() => {
    if (!result) return null;
    const p = result.diagnosis.problems.length;
    const s = result.diagnosis.strengths.length;
    if (p === 0) return { label: 'This bullet is already strong', tone: 'emerald' as const };
    if (p <= 1 && s >= 1) return { label: 'Workable, one fix', tone: 'amber' as const };
    if (p <= 2) return { label: 'Needs rewriting', tone: 'orange' as const };
    return { label: 'Multiple problems — rewrite from scratch', tone: 'rose' as const };
  }, [result]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'CV Bullet Rewriter', item: `${SITE_URL}/tools/bullet-rewriter` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free CV Bullet Rewriter — Diagnose Weak Bullets, Get 3 Rewrites"
        description="Paste a CV bullet. Get a diagnosis (weak verbs, missing metrics, filler phrases, responsibility-list framing) plus 3 stronger rewrites with templates. Runs in your browser. No signup."
        path="/tools/bullet-rewriter"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">AimVantage</span>
          </Link>
          <Link
            to="/register"
            className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
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
            Rewrite your weak CV bullets
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Paste one bullet. Get a diagnosis (weak verbs, missing metrics, filler phrases,
            "responsible for" framing) and three stronger rewrites with templates you can fill
            in.
          </p>
        </header>

        <div className="mb-4">
          <label htmlFor="bullet-text" className={`block text-sm font-semibold ${t.text} mb-2`}>
            Paste one CV bullet
          </label>
          <textarea
            id="bullet-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder='e.g. "Helped the marketing team manage social media accounts."'
            className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
          />
          <p className={`mt-1 text-xs ${t.textMuted}`}>
            {text.length} characters {canAnalyse ? '· OK' : `· need ${20 - text.length} more`}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyse}
            disabled={!canAnalyse}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              canAnalyse
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/40'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Analyse + rewrite
          </button>
          <button
            type="button"
            onClick={() => { setText(''); setResult(null); }}
            className={`text-sm ${t.textSub} hover:opacity-80 underline-offset-2 hover:underline`}
          >
            Clear
          </button>
        </div>

        {result && overallBand && (
          <section
            id="bullet-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className={`text-2xl font-bold ${t.text} mb-3`}>
              Diagnosis + rewrites
            </h2>

            <div
              className={`${t.glass} rounded-2xl p-5 border-l-4 ${
                overallBand.tone === 'emerald'
                  ? 'border-emerald-500'
                  : overallBand.tone === 'amber'
                  ? 'border-amber-500'
                  : overallBand.tone === 'orange'
                  ? 'border-orange-500'
                  : 'border-rose-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.diagnosis.problems.length === 0 ? (
                  <Check className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 ${
                    overallBand.tone === 'emerald'
                      ? 'text-emerald-500'
                      : overallBand.tone === 'amber'
                      ? 'text-amber-500'
                      : overallBand.tone === 'orange'
                      ? 'text-orange-500'
                      : 'text-rose-500'
                  }`} aria-hidden="true" />
                )}
                <h3 className={`font-bold ${t.text}`}>{overallBand.label}</h3>
              </div>
              {result.diagnosis.problems.length > 0 && (
                <>
                  <p className={`text-sm font-semibold ${t.text} mt-3 mb-1`}>What's broken:</p>
                  <ul className={`text-sm ${t.textSub} space-y-1.5 list-disc pl-5`}>
                    {result.diagnosis.problems.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </>
              )}
              {result.diagnosis.strengths.length > 0 && (
                <>
                  <p className={`text-sm font-semibold ${t.text} mt-4 mb-1`}>What's working:</p>
                  <ul className={`text-sm ${t.textSub} space-y-1.5 list-disc pl-5`}>
                    {result.diagnosis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </>
              )}
            </div>

            <h3 className={`text-xl font-bold ${t.text} mt-8 mb-3`}>
              3 rewrite templates
            </h3>
            {result.rewrites.map((r, i) => (
              <div key={i} className={`${t.glass} rounded-2xl p-5`}>
                <div className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">
                  Template {i + 1} · {r.label}
                </div>
                <p className={`text-sm font-mono ${t.text} mb-3 px-3 py-2 rounded ${t.cardInner}`}>
                  {r.template}
                </p>
                <p className={`text-sm font-semibold ${t.text} mb-1`}>Example:</p>
                <p className={`text-sm ${t.textSub} italic mb-3`}>{r.example}</p>
                <p className={`text-xs ${t.textMuted}`}>
                  <strong className={t.textSub}>Why this works:</strong> {r.why}
                </p>
              </div>
            ))}

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Now run the full prep on your CV.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your full CV and a job link, scores fit across every bullet, drafts
                a tailored cover letter, and generates likely interview questions. 90 seconds.
                10 free packs on signup, no card.
              </p>
              <Link
                to="/register?source=bullet-rewriter"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run my full prep <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {!result && (
          <section className={`mt-10 ${t.cardInner} rounded-2xl p-6`} aria-labelledby="how-heading">
            <h2 id="how-heading" className={`text-xl font-bold ${t.text} mb-3`}>
              What this tool checks
            </h2>
            <ul className={`${t.textSub} space-y-2 text-sm list-disc pl-5`}>
              <li><strong>Opening verb.</strong> Weak ("helped", "supported", "responsible for") vs strong ("shipped", "rebuilt", "reduced").</li>
              <li><strong>Metric presence.</strong> Recruiters skim for numbers. Every bullet should have one — by how much, for how many, over what period.</li>
              <li><strong>Length.</strong> Strongest bullets are 15-25 words. Too short = vague. Too long = ATS truncates and recruiters skim past.</li>
              <li><strong>Filler phrases.</strong> "Strong communication skills", "team player", "detail-oriented", "passionate about" — these get filtered by both ATS keyword-density rankers and recruiter skim.</li>
              <li><strong>First-person pronouns.</strong> CV bullets imply subject; "I led" should be "Led".</li>
              <li><strong>Responsibility-list framing.</strong> "Responsible for X" describes a job description; recruiters want outcomes, not duties.</li>
              <li><strong>Acronym density.</strong> High acronym ratio reads fluent only to same-domain readers. Generalist recruiters skip acronym-heavy bullets.</li>
            </ul>
            <p className={`text-xs ${t.textMuted} mt-4`}>
              All client-side. Your bullet never leaves your browser. No tracking, no logs.
            </p>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>Other free tools, no signup:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast my cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection email</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job detector</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS keyword scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
