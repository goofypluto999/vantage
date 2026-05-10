import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, GitCompareArrows, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/cover-letter-compare -- side-by-side scoring of two cover
 * letter drafts. Pure client-side, deterministic scoring, no LLM.
 *
 * Drafted 2026-05-10. 8th free tool. Captures search traffic from
 * "compare cover letters", "which cover letter is better", and
 * pairs with the existing /roast tool (single letter feedback) for
 * users who already have two drafts and want to pick.
 */

interface LetterScores {
  wordCount: number;
  openingStrength: number; // 0-100
  metricCount: number;
  fillerCount: number;
  passiveVerbCount: number;
  pronounRatio: number; // I/me/my count vs total
  specificityScore: number; // 0-100
  paragraphCount: number;
  totalScore: number; // 0-100
}

const FILLER = [
  /excellent (?:communication|interpersonal|written) skills/gi,
  /(?:cross[- ]?functional )?team[- ]?player/gi,
  /detail[- ]?oriented/gi,
  /self[- ]?starter/gi,
  /go[- ]?getter/gi,
  /passionate about/gi,
  /proven track record/gi,
  /results[- ]?driven/gi,
  /strong (?:knowledge|understanding|background) (?:of|in)/gi,
  /\bI am writing to (?:apply|express|inquire)/gi,
  /\bdear (?:hiring manager|sir or madam|to whom it may concern)/gi,
];

const WEAK_OPENINGS = [
  /^I am writing/i,
  /^I am applying/i,
  /^I am excited/i,
  /^My name is/i,
  /^Hi,? my name/i,
  /^Dear (?:hiring|sir|madam)/i,
];

const PASSIVE_VERBS = /\b(?:was|were|had been|has been|have been|is being|are being|been)\s+\w+(?:ed|en)\b/gi;

function scoreLetter(text: string): LetterScores {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const paragraphCount = trimmed.split(/\n\n+/).filter((p) => p.trim().length > 30).length || 1;

  // Opening strength
  let openingStrength = 100;
  for (const re of WEAK_OPENINGS) {
    if (re.test(trimmed)) {
      openingStrength = 30;
      break;
    }
  }
  // Boost: opening with a hook (number, question, named person)
  const firstSentence = trimmed.split(/[.!?]/)[0];
  if (/\d/.test(firstSentence) || /^["'"]/.test(firstSentence) || /\?$/.test(firstSentence)) {
    openingStrength = Math.min(100, openingStrength + 30);
  }

  // Metric count (numbers, %, currency, time)
  const metricMatches = trimmed.match(/\d[\d,]*(?:\s*(?:%|m|M|k|K|x|X|hours?|days?|weeks?|months?|years?|users?|customers?|engineers?|deals?|leads?|requests?|queries?|TPS|RPS|QPS|GB|TB|\$|£|€))/g) || [];
  const metricCount = metricMatches.length;

  // Filler count
  let fillerCount = 0;
  for (const re of FILLER) {
    fillerCount += (trimmed.match(re) || []).length;
  }

  // Passive verbs
  const passiveVerbCount = (trimmed.match(PASSIVE_VERBS) || []).length;

  // Pronoun ratio (I/me/my)
  const pronouns = (trimmed.match(/\b(?:I|me|my|mine|myself)\b/gi) || []).length;
  const pronounRatio = wordCount > 0 ? pronouns / wordCount : 0;

  // Specificity score: rewards proper nouns, %s, named technologies, numbers
  let specificityScore = 30; // baseline
  // Proper nouns (Capitalised mid-sentence words excluding common starts)
  const properNounCount = (trimmed.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g) || []).length;
  if (wordCount > 0) {
    const properNounRatio = properNounCount / wordCount;
    specificityScore += Math.min(30, properNounRatio * 200);
  }
  specificityScore += Math.min(40, metricCount * 8);
  specificityScore = Math.min(100, Math.round(specificityScore));

  // Total score (weighted)
  let totalScore = 0;
  totalScore += openingStrength * 0.20;
  totalScore += Math.min(100, metricCount * 25) * 0.20;
  totalScore += Math.max(0, 100 - fillerCount * 22) * 0.15;
  totalScore += Math.max(0, 100 - passiveVerbCount * 12) * 0.10;
  totalScore += Math.max(0, 100 - Math.max(0, pronounRatio * 100 - 8) * 8) * 0.10;
  totalScore += specificityScore * 0.15;
  // Length: ideal 200-350 words
  const lengthScore = wordCount < 100 ? 20 : wordCount < 200 ? 50 : wordCount <= 350 ? 100 : wordCount <= 500 ? 70 : 30;
  totalScore += lengthScore * 0.10;
  totalScore = Math.round(Math.max(0, Math.min(100, totalScore)));

  return {
    wordCount,
    openingStrength,
    metricCount,
    fillerCount,
    passiveVerbCount,
    pronounRatio: Math.round(pronounRatio * 1000) / 10, // percentage with 1 decimal
    specificityScore,
    paragraphCount,
    totalScore,
  };
}

interface ComparisonRow {
  metric: string;
  a: string;
  b: string;
  winner: 'a' | 'b' | 'tie';
  better: 'higher' | 'lower';
  context: string;
}

function compareScores(a: LetterScores, b: LetterScores): ComparisonRow[] {
  return [
    {
      metric: 'Total score',
      a: `${a.totalScore} / 100`,
      b: `${b.totalScore} / 100`,
      winner: a.totalScore > b.totalScore ? 'a' : a.totalScore < b.totalScore ? 'b' : 'tie',
      better: 'higher',
      context: 'Weighted blend of all sub-metrics. Higher = more landable.',
    },
    {
      metric: 'Opening strength',
      a: `${a.openingStrength} / 100`,
      b: `${b.openingStrength} / 100`,
      winner: a.openingStrength > b.openingStrength ? 'a' : a.openingStrength < b.openingStrength ? 'b' : 'tie',
      better: 'higher',
      context: 'Recruiters skim the first sentence. "I am writing to apply for…" scores 30. Number / question / named person opens score 100.',
    },
    {
      metric: 'Metric mentions',
      a: String(a.metricCount),
      b: String(b.metricCount),
      winner: a.metricCount > b.metricCount ? 'a' : a.metricCount < b.metricCount ? 'b' : 'tie',
      better: 'higher',
      context: 'Numbers, %, currency, time periods, scope (M/k users, deals, etc.). Cover letters with 3+ metrics convert at higher rates than zero-metric letters.',
    },
    {
      metric: 'Filler phrases',
      a: String(a.fillerCount),
      b: String(b.fillerCount),
      winner: a.fillerCount < b.fillerCount ? 'a' : a.fillerCount > b.fillerCount ? 'b' : 'tie',
      better: 'lower',
      context: '"Team player", "detail-oriented", "passionate about", "proven track record" — these get filtered both by ATS keyword-density rankers and recruiter skim.',
    },
    {
      metric: 'Passive-voice verbs',
      a: String(a.passiveVerbCount),
      b: String(b.passiveVerbCount),
      winner: a.passiveVerbCount < b.passiveVerbCount ? 'a' : a.passiveVerbCount > b.passiveVerbCount ? 'b' : 'tie',
      better: 'lower',
      context: '"Was promoted", "had been responsible" — passive constructions hide who did what. Active voice converts better.',
    },
    {
      metric: 'I/me/my ratio',
      a: `${a.pronounRatio}%`,
      b: `${b.pronounRatio}%`,
      winner: a.pronounRatio < b.pronounRatio ? 'a' : a.pronounRatio > b.pronounRatio ? 'b' : 'tie',
      better: 'lower',
      context: 'Cover letters that lean too hard on "I" feel self-centred. Best letters keep first-person pronoun ratio under 8% by mixing in company-focused sentences.',
    },
    {
      metric: 'Specificity',
      a: `${a.specificityScore} / 100`,
      b: `${b.specificityScore} / 100`,
      winner: a.specificityScore > b.specificityScore ? 'a' : a.specificityScore < b.specificityScore ? 'b' : 'tie',
      better: 'higher',
      context: 'Rewards specific company names, technologies, products, numbers. Generic letters score low.',
    },
    {
      metric: 'Word count',
      a: String(a.wordCount),
      b: String(b.wordCount),
      winner: 'tie',
      better: 'higher',
      context: 'Ideal: 200-350 words. Under 100 = vague. Over 500 = recruiter skips. Both should be in the sweet spot.',
    },
  ];
}

export default function CoverLetterComparePage() {
  const { t } = useTheme();
  const [letterA, setLetterA] = useState('');
  const [letterB, setLetterB] = useState('');
  const [result, setResult] = useState<{ a: LetterScores; b: LetterScores; rows: ComparisonRow[] } | null>(null);

  const canCompare = letterA.trim().length >= 100 && letterB.trim().length >= 100;

  const handleCompare = () => {
    if (!canCompare) return;
    const a = scoreLetter(letterA);
    const b = scoreLetter(letterB);
    setResult({ a, b, rows: compareScores(a, b) });
    setTimeout(() => {
      const el = document.getElementById('compare-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const verdict = useMemo(() => {
    if (!result) return null;
    const aWins = result.rows.filter((r) => r.winner === 'a').length;
    const bWins = result.rows.filter((r) => r.winner === 'b').length;
    if (aWins > bWins) return { winner: 'A', margin: aWins - bWins };
    if (bWins > aWins) return { winner: 'B', margin: bWins - aWins };
    return { winner: 'tie', margin: 0 };
  }, [result]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Cover Letter Compare', item: `${SITE_URL}/tools/cover-letter-compare` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Cover Letter A/B Comparator — Score Two Drafts Side by Side"
        description="Paste two cover letter drafts. Get a side-by-side score across 8 dimensions: opening strength, metrics, filler phrases, passive voice, I/me/my ratio, specificity, length. Pick the winner. Runs in your browser. No signup."
        path="/tools/cover-letter-compare"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            10 free prep packs
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Compare two cover letters
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Paste two drafts. Score side-by-side across 8 dimensions: opening strength, metrics,
            filler phrases, passive voice, I/me/my ratio, specificity, length. Pick the winner.
            Deterministic scoring, no LLM, no data leaves your browser.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="letter-a" className={`block text-sm font-semibold ${t.text} mb-2`}>
              Cover Letter A
            </label>
            <textarea
              id="letter-a"
              value={letterA}
              onChange={(e) => setLetterA(e.target.value)}
              rows={14}
              placeholder="Paste your first draft here. Ideally 200-350 words."
              className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
            />
            <p className={`mt-1 text-xs ${t.textMuted}`}>
              {letterA.trim().split(/\s+/).filter(Boolean).length} words {letterA.trim().length >= 100 ? '· OK' : `· need ${100 - letterA.trim().length} more chars`}
            </p>
          </div>
          <div>
            <label htmlFor="letter-b" className={`block text-sm font-semibold ${t.text} mb-2`}>
              Cover Letter B
            </label>
            <textarea
              id="letter-b"
              value={letterB}
              onChange={(e) => setLetterB(e.target.value)}
              rows={14}
              placeholder="Paste your second draft here. Same role, different angle."
              className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
            />
            <p className={`mt-1 text-xs ${t.textMuted}`}>
              {letterB.trim().split(/\s+/).filter(Boolean).length} words {letterB.trim().length >= 100 ? '· OK' : `· need ${100 - letterB.trim().length} more chars`}
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCompare}
            disabled={!canCompare}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              canCompare
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/40'
            }`}
          >
            <GitCompareArrows className="w-4 h-4" /> Score both
          </button>
          <button
            type="button"
            onClick={() => { setLetterA(''); setLetterB(''); setResult(null); }}
            className={`text-sm ${t.textSub} hover:opacity-80 underline-offset-2 hover:underline`}
          >
            Clear
          </button>
        </div>

        {result && verdict && (
          <section
            id="compare-results"
            className="scroll-mt-24"
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className={`text-2xl font-bold ${t.text} mb-4`}>
              Comparison
            </h2>

            <div className={`${t.glass} rounded-2xl p-6 mb-6 text-center`}>
              <p className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
                Verdict
              </p>
              {verdict.winner === 'tie' ? (
                <h3 className={`text-3xl font-extrabold ${t.text}`}>It's a tie</h3>
              ) : (
                <h3 className={`text-3xl font-extrabold ${t.text}`}>
                  Letter {verdict.winner} is stronger
                  <span className={`block text-sm font-normal ${t.textSub} mt-1`}>
                    by {verdict.margin} of 8 dimensions
                  </span>
                </h3>
              )}
              <p className={`mt-3 text-sm ${t.textSub} max-w-md mx-auto`}>
                The winner has the higher score on more sub-metrics. Use the table below to see
                exactly which dimensions to copy across to the loser.
              </p>
            </div>

            <div className={`${t.glass} rounded-2xl overflow-hidden mb-6`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${t.cardInner}`}>
                    <tr>
                      <th className={`text-left px-4 py-3 font-semibold ${t.text}`}>Metric</th>
                      <th className={`text-center px-4 py-3 font-semibold ${t.text}`}>Letter A</th>
                      <th className={`text-center px-4 py-3 font-semibold ${t.text}`}>Letter B</th>
                      <th className={`text-left px-4 py-3 font-semibold ${t.text} hidden md:table-cell`}>Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} className={`border-t ${t.divider}`}>
                        <td className={`px-4 py-3 font-medium ${t.text}`}>{row.metric}</td>
                        <td className={`px-4 py-3 text-center ${row.winner === 'a' ? 'font-bold text-emerald-600 dark:text-emerald-400' : t.textSub}`}>
                          {row.a}
                          {row.winner === 'a' && <Check className="w-3.5 h-3.5 inline ml-1.5" aria-hidden="true" />}
                        </td>
                        <td className={`px-4 py-3 text-center ${row.winner === 'b' ? 'font-bold text-emerald-600 dark:text-emerald-400' : t.textSub}`}>
                          {row.b}
                          {row.winner === 'b' && <Check className="w-3.5 h-3.5 inline ml-1.5" aria-hidden="true" />}
                        </td>
                        <td className={`px-4 py-3 text-xs ${t.textMuted} hidden md:table-cell`}>
                          {row.context}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Or skip the A/B step and let Vantage write it.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV and the actual job link, drafts the cover letter in 4 tones
                (formal / warm / direct / creative), and lets you switch between them in one click.
                90 seconds. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=cover-letter-compare"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Try Vantage free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {!result && (
          <section className={`${t.cardInner} rounded-2xl p-6`} aria-labelledby="how-heading">
            <h2 id="how-heading" className={`text-xl font-bold ${t.text} mb-3`}>
              What gets scored
            </h2>
            <ul className={`${t.textSub} space-y-2 text-sm list-disc pl-5`}>
              <li><strong>Opening strength.</strong> "I am writing to apply..." scores 30. Number / question / named person scores 100.</li>
              <li><strong>Metric count.</strong> Numbers, %, currency, time periods. 3+ metrics = strong; 0 = weak.</li>
              <li><strong>Filler phrases.</strong> "Team player", "detail-oriented", "passionate about" — counted and penalised.</li>
              <li><strong>Passive voice.</strong> "Was promoted", "had been responsible" — active voice converts better.</li>
              <li><strong>I/me/my ratio.</strong> Best letters keep this under 8% by mixing in company-focused sentences.</li>
              <li><strong>Specificity.</strong> Proper nouns, technologies, products, numbers all boost the score.</li>
              <li><strong>Length.</strong> 200-350 words is the sweet spot.</li>
              <li><strong>Total score.</strong> Weighted blend of all the above.</li>
            </ul>
            <p className={`text-xs ${t.textMuted} mt-4`}>
              All client-side. No data leaves your browser. No tracking, no logs.
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
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>CV bullet rewriter</Link>
            <Link to="/tools/layoff-playbook" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Layoff playbook</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
