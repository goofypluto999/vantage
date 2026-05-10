import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/glassdoor-decoder -- Glassdoor review red-flag decoder.
 * Pure client-side, regex pattern detection. No LLM.
 *
 * Drafted 2026-05-10. 15th free tool. Captures search-volume around
 * "is X a good company to work at" / "glassdoor review red flags" /
 * "should I take this job offer". Most candidates skim Glassdoor
 * reviews and miss the patterns that matter — coded language for
 * burnout, micromanagement, layoff risk, comp suppression.
 */

interface FlagPattern {
  flag: string;
  severity: 'low' | 'medium' | 'high';
  category: 'culture' | 'compensation' | 'leadership' | 'workload' | 'stability' | 'positive';
  tests: RegExp[];
  context: string;
}

const PATTERNS: FlagPattern[] = [
  // BURNOUT / WORKLOAD
  { flag: 'Burnout language', severity: 'high', category: 'workload',
    tests: [/burn(?:ed|t)\s?out/i, /work[- ]life\s?balance.*(?:non[- ]?existent|terrible|bad|poor)/i, /60\s?\+?\s?hours? (?:per |a )?week/i, /weekend(?:s|ing)/i, /always on call/i],
    context: 'Direct burnout mentions are the strongest single predictor of bad culture. If 3+ reviews mention it, the workload pattern is structural — no individual can fix it.' },
  { flag: '"Fast-paced" warning', severity: 'medium', category: 'workload',
    tests: [/fast[- ]paced/i, /high[- ]pressure/i, /demanding environment/i, /aggressive timeline/i, /move fast/i],
    context: '"Fast-paced" is HR-coded language for "we work nights and weekends without admitting it". Not always a red flag, but cross-reference with hours mentions.' },

  // MICROMANAGEMENT / LEADERSHIP
  { flag: 'Micromanagement', severity: 'high', category: 'leadership',
    tests: [/micro[- ]?management/i, /micromanage/i, /no autonomy/i, /every decision (?:needs|requires) approval/i],
    context: 'If multiple reviews mention micromanagement, your specific manager will not save you — it is the culture. Filter hard.' },
  { flag: 'Bad leadership signal', severity: 'high', category: 'leadership',
    tests: [/leadership (?:has |is |are )(?:no clue|incompetent|out of touch|disconnected)/i, /(?:CEO|leadership) (?:does not|doesn'?t) (?:listen|care|understand)/i, /favoritism/i, /favouritism/i],
    context: 'Leadership criticism in 3+ reviews is structural. The company won\'t fix this — it\'s why people are reviewing.' },
  { flag: 'High turnover signal', severity: 'high', category: 'stability',
    tests: [/(?:high|huge|massive) turnover/i, /people (?:are )?leaving/i, /everyone (?:is )?(?:leaving|quitting)/i, /senior (?:people|engineers|managers) (?:are )?leaving/i],
    context: 'When the people who know what they\'re doing are leaving, the burden falls on whoever stays. Three or more reviews mentioning departures is a strong filter.' },

  // COMPENSATION
  { flag: 'Comp below market', severity: 'medium', category: 'compensation',
    tests: [/below market/i, /under[- ]?paid/i, /salaries (?:are )?(?:low|stagnant)/i, /(?:no |poor )(?:raises|salary increases)/i, /comp(?:ensation)? (?:has not|hasn'?t) kept up/i],
    context: 'Comp criticism is harder to fix than culture criticism — it\'s usually structural budget. Cross-reference with Levels.fyi for actual numbers before reading too much into review language.' },
  { flag: 'Layoff history', severity: 'high', category: 'stability',
    tests: [/layoffs?/i, /(?:rounds? of )?(?:redundancies|restructur)/i, /risk of being (?:laid off|let go)/i, /performance review (?:as )?(?:disguised |hidden )?(?:layoffs|firings)/i],
    context: 'Multiple layoff mentions = systemic instability. Cross-reference with public news (TechCrunch / Crunchbase) for specifics.' },

  // CULTURE / DEI
  { flag: 'Toxic culture markers', severity: 'high', category: 'culture',
    tests: [/toxic/i, /bro culture/i, /clique/i, /old boys/i, /hostile work environment/i, /bullying/i],
    context: 'Toxic culture mentions are stronger signals than they look — most people self-censor in reviews. If someone uses the word, the lived reality is worse.' },
  { flag: 'No DEI / gender imbalance', severity: 'medium', category: 'culture',
    tests: [/no women/i, /(?:no |lack of )diversity/i, /(?:all |mostly )(?:white |male )/i, /no minorities/i],
    context: 'If you\'re from an under-represented group, this is a stronger filter for you specifically. Cross-reference with the team page on the company website.' },

  // POSITIVE SIGNALS
  { flag: 'Strong learning culture', severity: 'low', category: 'positive',
    tests: [/(?:great |strong |amazing )(?:learning|growth|mentorship|development)/i, /senior engineers (?:are )?(?:helpful|generous|approachable)/i, /(?:learned|grew) (?:a lot|so much)/i],
    context: 'Learning culture mentions across multiple roles indicates a place where you genuinely level up.' },
  { flag: 'Genuine flexibility', severity: 'low', category: 'positive',
    tests: [/(?:truly |genuinely |actually )(?:flexible|remote|hybrid)/i, /(?:trust|treat) (?:you |us )(?:like adults|professionally)/i, /no clock[- ]?watch/i],
    context: 'Genuine flexibility is rare in 2026. Many companies say "flexible" but mean "after the 40 mandatory hours". Multiple reviews mentioning real flexibility = real flexibility.' },
  { flag: 'Reasonable comp', severity: 'low', category: 'positive',
    tests: [/(?:above market|competitive comp|fair (?:pay|compensation|salary))/i, /(?:annual |yearly )(?:raises|salary increase)/i],
    context: 'Cross-reference with Levels.fyi + Glassdoor salaries section. "Fair pay" in narrative reviews often means just-okay in real numbers.' },

  // META
  { flag: 'Old reviews only', severity: 'medium', category: 'stability',
    tests: [/(?:202[01234])/], // years 2020-2024
    context: 'If the most recent reviews are 12+ months old, the company may have lost reviewer momentum, OR moderation is removing recent ones. Either way, the data is stale.' },
];

interface DecodeResult {
  byCategory: Record<string, { flag: string; severity: 'low' | 'medium' | 'high'; matches: string[]; context: string }[]>;
  riskScore: number; // 0-100, lower = better
  positiveScore: number; // 0-100, higher = better
  topFlags: { flag: string; severity: string }[];
}

function decodeReviews(text: string): DecodeResult {
  const byCategory: DecodeResult['byCategory'] = {};
  let riskWeight = 0;
  let totalNegativeWeight = 0;
  let positiveWeight = 0;
  const topFlags: DecodeResult['topFlags'] = [];

  const SEVERITY_WEIGHT = { low: 1, medium: 3, high: 6 };

  for (const p of PATTERNS) {
    const matches: string[] = [];
    for (const re of p.tests) {
      const m = text.match(re);
      if (m) matches.push(m[0]);
    }
    if (matches.length === 0) continue;

    const cat = p.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ flag: p.flag, severity: p.severity, matches, context: p.context });

    const weight = SEVERITY_WEIGHT[p.severity] * Math.min(matches.length, 5);
    if (cat === 'positive') {
      positiveWeight += weight;
    } else {
      riskWeight += weight;
      totalNegativeWeight += weight;
      if (p.severity === 'high') {
        topFlags.push({ flag: p.flag, severity: p.severity });
      }
    }
  }

  const riskScore = Math.min(100, Math.round((riskWeight / 60) * 100));
  const positiveScore = Math.min(100, Math.round((positiveWeight / 30) * 100));

  return { byCategory, riskScore, positiveScore, topFlags: topFlags.slice(0, 5) };
}

export default function GlassdoorDecoderPage() {
  const { t } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState<DecodeResult | null>(null);

  const canDecode = text.trim().length >= 200;

  const handleDecode = () => {
    if (!canDecode) return;
    setResult(decodeReviews(text));
    setTimeout(() => {
      const el = document.getElementById('gd-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const verdict = useMemo(() => {
    if (!result) return null;
    const net = result.riskScore - result.positiveScore;
    if (net > 50) return { label: 'High caution — multiple structural red flags', tone: 'rose' as const };
    if (net > 20) return { label: 'Moderate concerns — investigate before signing', tone: 'amber' as const };
    if (net > 0) return { label: 'Mixed — typical company, decide on fit', tone: 'orange' as const };
    return { label: 'Looks reasonable — usual checks still apply', tone: 'emerald' as const };
  }, [result]);

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Glassdoor Review Decoder', item: `${SITE_URL}/tools/glassdoor-decoder` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Glassdoor Review Decoder — Spot Red Flags Most Candidates Miss"
        description="Paste Glassdoor reviews. Get pattern-matched flags across burnout, micromanagement, leadership, layoff risk, comp suppression, toxic culture, plus positive signals (learning, flexibility, fair comp). Pure client-side. No signup."
        path="/tools/glassdoor-decoder"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
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
            Glassdoor review decoder
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Most candidates skim Glassdoor reviews and miss the coded language for burnout,
            micromanagement, layoff risk, and comp suppression. Paste 5-10 reviews. Get
            pattern-matched flags across 11 categories plus positive-signal surface. Pure
            client-side.
          </p>
        </header>

        <div className="mb-4">
          <label htmlFor="reviews" className={`block text-sm font-semibold ${t.text} mb-2`}>
            Paste 5-10 Glassdoor reviews (more text = better signal)
          </label>
          <textarea
            id="reviews"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            placeholder="Paste each review's pros + cons + advice-to-management text. Don't worry about formatting — the decoder reads pattern matches across the whole text."
            className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
          />
          <p className={`mt-1 text-xs ${t.textMuted}`}>
            {text.length} chars {canDecode ? '· OK' : `· need ${200 - text.length} more`}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDecode}
            disabled={!canDecode}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              canDecode
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/40'
            }`}
          >
            <Eye className="w-4 h-4" /> Decode reviews
          </button>
          <button
            type="button"
            onClick={() => { setText(''); setResult(null); }}
            className={`text-sm ${t.textSub} hover:opacity-80 underline-offset-2 hover:underline`}
          >
            Clear
          </button>
        </div>

        {result && verdict && (
          <section
            id="gd-results"
            className="scroll-mt-24 space-y-4"
          >
            <div
              className={`${t.glass} rounded-2xl p-6 border-l-4 ${
                verdict.tone === 'emerald'
                  ? 'border-emerald-500'
                  : verdict.tone === 'orange'
                  ? 'border-orange-500'
                  : verdict.tone === 'amber'
                  ? 'border-amber-500'
                  : 'border-rose-500'
              }`}
            >
              <p className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
                Overall verdict
              </p>
              <h2 className={`text-2xl font-extrabold ${t.text} mb-3`}>{verdict.label}</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className={`${t.textSub}`}>
                  Risk signal: <strong className={`${verdict.tone === 'rose' ? 'text-rose-600 dark:text-rose-400' : verdict.tone === 'amber' ? 'text-amber-600 dark:text-amber-400' : t.text}`}>{result.riskScore}/100</strong>
                </span>
                <span className={`${t.textSub}`}>
                  Positive signal: <strong className="text-emerald-600 dark:text-emerald-400">{result.positiveScore}/100</strong>
                </span>
              </div>
              {result.topFlags.length > 0 && (
                <div className="mt-3">
                  <p className={`text-xs ${t.textMuted} mb-1`}>Top high-severity flags:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.topFlags.map((f, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300">
                        {f.flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {Object.entries(result.byCategory).map(([category, flags]) => (
              <div key={category} className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  {category === 'positive' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${
                      flags.some((f) => f.severity === 'high') ? 'text-rose-500' : flags.some((f) => f.severity === 'medium') ? 'text-amber-500' : 'text-violet-500'
                    }`} aria-hidden="true" />
                  )}
                  <h3 className={`font-bold ${t.text} capitalize`}>{category}</h3>
                </div>
                <div className="space-y-3">
                  {flags.map((f, idx) => (
                    <div key={idx} className={`${t.cardInner} rounded-lg p-3`}>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className={`text-sm font-semibold ${t.text}`}>{f.flag}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          f.severity === 'high'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                            : f.severity === 'medium'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : f.severity === 'low' && category === 'positive'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                        }`}>
                          {f.severity}
                        </span>
                      </div>
                      <p className={`text-xs ${t.textSub} mb-2`}>
                        Phrases matched: {f.matches.slice(0, 3).map((m, i) => (
                          <span key={i} className="italic mr-1">"{m}"</span>
                        ))}
                      </p>
                      <p className={`text-xs ${t.textMuted}`}>
                        <strong className={t.textSub}>Why this matters:</strong> {f.context}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(result.byCategory).length === 0 && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <p className={`${t.textSub}`}>
                  No common red-flag patterns detected. That doesn't mean the company is great —
                  it means the reviews you pasted don't surface the standard patterns. Try
                  pasting more reviews (5-10), or look at the most recent 6 months specifically.
                </p>
              </div>
            )}

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Decided to apply? Run the prep on the actual job link.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV + job link, scores fit, drafts a tailored cover letter,
                generates likely interview questions, and builds a 5-min pitch. 10 free packs on
                signup, no card.
              </p>
              <Link
                to="/register?source=glassdoor-decoder"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run my prep <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {!result && (
          <section className={`${t.cardInner} rounded-2xl p-6`}>
            <h2 className={`text-xl font-bold ${t.text} mb-3`}>What this checks</h2>
            <ul className={`${t.textSub} space-y-2 text-sm list-disc pl-5`}>
              <li><strong>Burnout language:</strong> "burnt out", "60+ hour weeks", "always on call", weekend mentions.</li>
              <li><strong>"Fast-paced" warning:</strong> HR-coded language for nights+weekends. Not always bad, cross-reference with hour mentions.</li>
              <li><strong>Micromanagement:</strong> Direct mentions, "no autonomy", "every decision needs approval".</li>
              <li><strong>Bad leadership signal:</strong> Leadership criticism, favouritism, "out of touch".</li>
              <li><strong>High turnover:</strong> "people leaving", senior departures, "everyone is quitting".</li>
              <li><strong>Comp below market:</strong> "underpaid", stagnant raises, comp criticism.</li>
              <li><strong>Layoff history:</strong> Multiple layoff mentions = systemic instability.</li>
              <li><strong>Toxic culture:</strong> "toxic", "bro culture", "hostile environment", bullying mentions.</li>
              <li><strong>No DEI / gender imbalance:</strong> Stronger filter for under-represented candidates.</li>
              <li><strong>Positive: learning culture, real flexibility, reasonable comp:</strong> Cross-referenced for net signal.</li>
            </ul>
            <p className={`text-xs ${t.textMuted} mt-4`}>
              Pattern-matched, not LLM-graded. Deterministic. All client-side. Your text never
              leaves your browser.
            </p>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>14 other free tools, no signup:</p>
          <Link to="/tools" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-violet-500 hover:bg-violet-500/10 transition`}>
            Browse all 15 tools <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
