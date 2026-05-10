import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanLine, Star, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /ats/scanner -- client-side ATS keyword scanner.
 *
 * Pure browser-side. No API calls. No keys. The user's CV and JD never
 * leave their device. Drafted 2026-05-10 to convert the misleading
 * "Free scanner included" line on /ats into actual truth + add a 4th
 * free tool that captures "ATS scanner" search-query traffic.
 *
 * Algorithm:
 * 1. Tokenize both texts (lowercase, split on non-word chars).
 * 2. Drop stopwords + 1-2 char tokens + pure numeric tokens.
 * 3. Count frequency in JD; keep tokens with freq >= 1.
 * 4. Multi-word phrase detection for common ATS keyword patterns
 *    (capitalized 2-grams in JD that appear together).
 * 5. Match: token / phrase appears in CV text.
 * 6. Score = (sum of matched JD-frequencies) / (sum of all JD-frequencies).
 *
 * The "score" is a real coverage number, not invented. We tell the user
 * exactly that.
 */

// Tight stopword set tuned for English JDs / CVs. Doesn't strip
// industry terms. Includes pronouns, articles, prepositions, common
// JD filler ("looking", "team", "role" etc.).
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
  'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'to', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'shall', 'this', 'that', 'these',
  'those', 'it', 'its', 'as', 'so', 'we', 'you', 'your', 'yours',
  'our', 'us', 'they', 'them', 'their', 'theirs', 'i', 'me', 'my',
  'mine', 'he', 'she', 'his', 'hers', 'who', 'whom', 'which', 'what',
  'where', 'why', 'how', 'all', 'any', 'each', 'every', 'no', 'not',
  'only', 'own', 'same', 'than', 'too', 'very', 's', 'd', 'll', 'm',
  'o', 're', 've', 'y', 'now', 'just', 'also', 'about', 'after', 'before',
  'between', 'during', 'over', 'under', 'through', 'while', 'within',
  // common JD filler
  'role', 'team', 'work', 'working', 'looking', 'seeking', 'candidate',
  'candidates', 'experience', 'experienced', 'years', 'year', 'job',
  'jobs', 'opportunity', 'company', 'companies', 'business', 'businesses',
  'help', 'helping', 'helps', 'helped', 'including', 'include', 'includes',
  'across', 'around', 'such', 'other', 'some', 'more', 'most', 'good',
  'great', 'best', 'new', 'one', 'two', 'three', 'four', 'five',
  'first', 'second', 'third', 'last', 'next', 'previous', 'well',
  'able', 'ability', 'ideally', 'preferably', 'plus', 'bonus',
  'requirements', 'requirement', 'responsibilities', 'responsibility',
  'duties', 'duty', 'will', 'must', 'should', 'preferred', 'required',
  'minimum', 'maximum', 'least', 'desire', 'desired', 'want', 'wants',
  'need', 'needs', 'needed', 'use', 'using', 'used', 'uses', 'make',
  'makes', 'making', 'made', 'take', 'takes', 'taking', 'taken',
  'become', 'becomes', 'becoming', 'became', 'get', 'gets', 'getting',
  'got', 'gotten', 'go', 'goes', 'going', 'went', 'gone', 'come',
  'comes', 'coming', 'came', 'see', 'sees', 'seeing', 'saw', 'seen',
  'know', 'knows', 'knowing', 'knew', 'known', 'think', 'thinks',
  'thinking', 'thought', 'find', 'finds', 'finding', 'found',
  'environment', 'environments', 'environmental',
  'people', 'person', 'individual', 'individuals',
  'plus', 'across', 'multiple', 'various', 'different', 'similar',
  // weak verbs
  'support', 'supporting', 'supports', 'supported',
  'provide', 'provides', 'providing', 'provided',
  'ensure', 'ensures', 'ensuring', 'ensured',
  'manage', 'manages', 'managing', 'managed', 'management',
  'handle', 'handles', 'handling', 'handled',
  // formatting
  'etc', 'eg', 'ie', 'vs', 'us', 'uk', 'eu',
]);

interface ScanResult {
  matchedKeywords: Array<{ keyword: string; freq: number }>;
  missingKeywords: Array<{ keyword: string; freq: number }>;
  matchedPhrases: string[];
  missingPhrases: string[];
  scorePercent: number;
  totalKeywords: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#\s.\-/]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.\-/]+|[.\-/]+$/g, ''))
    .filter((w) => {
      if (!w) return false;
      if (w.length < 3) return false;
      if (/^\d+$/.test(w)) return false;
      if (STOPWORDS.has(w)) return false;
      return true;
    });
}

// Detect 2-word phrases in the JD that are CAPITALIZED at least once
// in the source. These are usually proper-noun tech / framework / cert
// phrases ("Google Cloud", "React Native", "Power BI", "Six Sigma").
function detectPhrases(rawText: string): Set<string> {
  const phrases = new Set<string>();
  // Capture sequences of 2-3 capitalized words (allow lowercase 'of', 'and', etc).
  const re = /\b([A-Z][a-zA-Z0-9+#]+(?:\s+(?:of|and|in|for|de|von)\s+|\s+)[A-Z][a-zA-Z0-9+#]+)\b/g;
  let match;
  while ((match = re.exec(rawText)) !== null) {
    const phrase = match[1].toLowerCase().trim();
    if (phrase.length >= 6 && phrase.length <= 40) {
      phrases.add(phrase);
    }
  }
  // Also: known acronym / tool patterns (lowercase-ok if all letters)
  const acronymRe = /\b([A-Z]{2,5}(?:\s+[A-Z]{2,5})?)\b/g;
  let acronymMatch;
  while ((acronymMatch = acronymRe.exec(rawText)) !== null) {
    const a = acronymMatch[1].toLowerCase().trim();
    if (a.length >= 2 && a.length <= 12 && !STOPWORDS.has(a)) {
      phrases.add(a);
    }
  }
  return phrases;
}

function scan(cvText: string, jdText: string): ScanResult {
  const cvLower = ` ${cvText.toLowerCase()} `;

  // Token-level scan
  const jdTokens = tokenize(jdText);
  const jdFreq = new Map<string, number>();
  for (const tok of jdTokens) {
    jdFreq.set(tok, (jdFreq.get(tok) || 0) + 1);
  }
  const matched: Array<{ keyword: string; freq: number }> = [];
  const missing: Array<{ keyword: string; freq: number }> = [];
  let matchedWeight = 0;
  let totalWeight = 0;
  for (const [tok, freq] of jdFreq.entries()) {
    totalWeight += freq;
    // match if the token (with word boundaries) appears in CV text
    const re = new RegExp(`(?<![a-z0-9])${escapeRegExp(tok)}(?![a-z0-9])`, 'i');
    if (re.test(cvText)) {
      matched.push({ keyword: tok, freq });
      matchedWeight += freq;
    } else {
      missing.push({ keyword: tok, freq });
    }
  }

  // Phrase-level scan
  const phrases = detectPhrases(jdText);
  const matchedPhrases: string[] = [];
  const missingPhrases: string[] = [];
  for (const phrase of phrases) {
    if (cvLower.includes(` ${phrase} `) || cvLower.includes(` ${phrase}.`) || cvLower.includes(` ${phrase},`)) {
      matchedPhrases.push(phrase);
    } else {
      missingPhrases.push(phrase);
    }
  }

  // Sort missing by frequency desc (most-mentioned gaps first)
  missing.sort((a, b) => b.freq - a.freq);
  matched.sort((a, b) => b.freq - a.freq);

  const scorePercent = totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);

  return {
    matchedKeywords: matched.slice(0, 40),
    missingKeywords: missing.slice(0, 40),
    matchedPhrases: matchedPhrases.slice(0, 20),
    missingPhrases: missingPhrases.slice(0, 20),
    scorePercent,
    totalKeywords: jdFreq.size,
  };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function AtsKeywordScannerPage() {
  const { t } = useTheme();
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);

  const canScan = cvText.trim().length >= 100 && jdText.trim().length >= 100;

  const handleScan = () => {
    if (!canScan) return;
    setResult(scan(cvText, jdText));
    // Scroll results into view
    setTimeout(() => {
      const el = document.getElementById('scan-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleClear = () => {
    setCvText('');
    setJdText('');
    setResult(null);
  };

  const scoreBand = useMemo(() => {
    if (!result) return null;
    const p = result.scorePercent;
    if (p >= 70) return { label: 'Strong match', tone: 'emerald' as const };
    if (p >= 50) return { label: 'Workable match', tone: 'amber' as const };
    if (p >= 30) return { label: 'Weak match', tone: 'orange' as const };
    return { label: 'Poor match', tone: 'rose' as const };
  }, [result]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ATS Guide', item: `${SITE_URL}/ats` },
      { '@type': 'ListItem', position: 3, name: 'Free ATS Scanner', item: `${SITE_URL}/ats/scanner` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free ATS Keyword Scanner — paste your CV and the JD, no signup"
        description="Free in-browser ATS keyword scanner. Paste your CV and a job description, see which keywords match and which gaps remain. Runs entirely in your browser. Nothing uploaded, no signup."
        path="/ats/scanner"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/ats" className={`${t.textSub} hover:opacity-80`}>ATS Guide</Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              10 free prep packs
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Free ATS keyword scanner
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Paste your CV. Paste the job description. See which keywords match and which gaps you
            need to close before you apply. The scan runs entirely in your browser — nothing
            uploaded, nothing logged, no signup.
          </p>
        </header>

        {/* Why this is honest, unlike most "ATS scanners" */}
        <aside
          className={`${t.cardInner} rounded-xl p-4 mb-8 border-l-4 border-violet-500 text-sm ${t.textSub}`}
          aria-label="Why this scanner is different"
        >
          <p className={`font-semibold ${t.text} mb-1`}>Why this is honest:</p>
          <p>
            Most "ATS scanners" output a single 0-100 score that is invented. There is no universal
            ATS score — Workday, Greenhouse, Lever, Taleo, and iCIMS all parse differently. What
            this tool gives you is a real, verifiable coverage number: how many of the
            JD's recurring keywords appear in your CV. That is the only thing every ATS shares.
          </p>
        </aside>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cv-text" className={`block text-sm font-semibold ${t.text} mb-2`}>
              Paste your CV text
            </label>
            <textarea
              id="cv-text"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste the full text of your CV here. Include the work experience section — the Skills bullets are not enough on their own."
              rows={12}
              className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
            />
            <p className={`mt-1 text-xs ${t.textMuted}`}>
              {cvText.length} characters {cvText.length >= 100 ? '· OK' : `· need ${100 - cvText.length} more`}
            </p>
          </div>
          <div>
            <label htmlFor="jd-text" className={`block text-sm font-semibold ${t.text} mb-2`}>
              Paste the job description
            </label>
            <textarea
              id="jd-text"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description text. The Requirements / Responsibilities sections matter most — copy them in full."
              rows={12}
              className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
            />
            <p className={`mt-1 text-xs ${t.textMuted}`}>
              {jdText.length} characters {jdText.length >= 100 ? '· OK' : `· need ${100 - jdText.length} more`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleScan}
            disabled={!canScan}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              canScan
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/40'
            }`}
          >
            <ScanLine className="w-4 h-4" /> Scan keywords
          </button>
          <button
            type="button"
            onClick={handleClear}
            className={`text-sm ${t.textSub} hover:opacity-80 underline-offset-2 hover:underline`}
          >
            Clear
          </button>
          {!canScan && (
            <span className={`text-xs ${t.textMuted}`}>
              Paste at least 100 characters in each box.
            </span>
          )}
        </div>

        {/* Results */}
        {result && scoreBand && (
          <section
            id="scan-results"
            className="mt-12 scroll-mt-24"
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className={`text-2xl font-bold ${t.text} mb-4`}>
              Your scan results
            </h2>

            {/* Score band */}
            <div
              className={`${t.glass} rounded-2xl p-6 flex items-center gap-5 mb-6 border-l-4 ${
                scoreBand.tone === 'emerald'
                  ? 'border-emerald-500'
                  : scoreBand.tone === 'amber'
                  ? 'border-amber-500'
                  : scoreBand.tone === 'orange'
                  ? 'border-orange-500'
                  : 'border-rose-500'
              }`}
            >
              <div
                className={`text-5xl font-extrabold tracking-tight ${
                  scoreBand.tone === 'emerald'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : scoreBand.tone === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : scoreBand.tone === 'orange'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {result.scorePercent}%
              </div>
              <div>
                <p className={`text-lg font-semibold ${t.text}`}>{scoreBand.label}</p>
                <p className={`text-sm ${t.textSub} mt-1`}>
                  {result.matchedKeywords.length} of {result.totalKeywords} unique JD keywords matched.
                  {result.matchedPhrases.length > 0 && ` ${result.matchedPhrases.length} multi-word phrases matched.`}
                </p>
              </div>
            </div>

            {/* Missing keywords (top priority) */}
            {result.missingKeywords.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-6 mb-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h3 className={`text-lg font-bold ${t.text}`}>
                    Missing keywords ({result.missingKeywords.length})
                  </h3>
                </div>
                <p className={`text-sm ${t.textSub} mb-4`}>
                  Sorted by JD frequency. The ones at the top are the highest-priority gaps to
                  close. The number in brackets is how many times the JD mentions the term.
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <span
                      key={kw.keyword}
                      className="text-xs px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    >
                      {kw.keyword} {kw.freq > 1 && <span className="opacity-60">×{kw.freq}</span>}
                    </span>
                  ))}
                </div>
                {result.missingPhrases.length > 0 && (
                  <>
                    <p className={`mt-4 mb-2 text-sm font-semibold ${t.text}`}>Missing phrases:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingPhrases.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-3 py-1.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Matched */}
            {result.matchedKeywords.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-6 mb-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  <h3 className={`text-lg font-bold ${t.text}`}>
                    Matched keywords ({result.matchedKeywords.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map((kw) => (
                    <span
                      key={kw.keyword}
                      className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    >
                      {kw.keyword} {kw.freq > 1 && <span className="opacity-60">×{kw.freq}</span>}
                    </span>
                  ))}
                </div>
                {result.matchedPhrases.length > 0 && (
                  <>
                    <p className={`mt-4 mb-2 text-sm font-semibold ${t.text}`}>Matched phrases:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedPhrases.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Conversion CTA tied to result */}
            <div className={`${t.glass} rounded-2xl p-8 text-center mt-8`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Want a cover letter that closes those gaps?
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV and the actual job link, scores the fit, drafts a tailored
                cover letter that addresses your top missing keywords, and generates likely
                interview questions. 90 seconds. 10 free prep packs on signup. No card.
              </p>
              <Link
                to="/register"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run my full prep <ArrowRight className="w-4 h-4" />
              </Link>
              <p className={`mt-4 text-xs ${t.textMuted}`}>
                The scan above ran entirely in your browser. Nothing uploaded.
              </p>
            </div>
          </section>
        )}

        {/* How it works (when no result yet) */}
        {!result && (
          <section className={`mt-16 ${t.cardInner} rounded-2xl p-6`} aria-labelledby="how-heading">
            <h2 id="how-heading" className={`text-xl font-bold ${t.text} mb-3`}>
              How this scanner works
            </h2>
            <ul className={`${t.textSub} space-y-2 text-sm list-disc pl-5`}>
              <li>
                Tokenizes both texts (lowercase, drops stopwords + 1-2 char tokens + pure numbers).
              </li>
              <li>
                Counts how often each unique keyword appears in the JD. Sorts the gaps by JD
                frequency so the top of the missing list is the most-mentioned keyword you do
                not have.
              </li>
              <li>
                Detects 2-3 word capitalized phrases ("React Native", "Power BI", "Six Sigma")
                and acronyms (AWS, GCP, SAP) and matches them separately.
              </li>
              <li>
                Outputs a real coverage percentage = matched-JD-frequencies divided by
                total-JD-frequencies. Not invented.
              </li>
              <li>
                Runs entirely client-side. Your CV and JD never leave the browser. No tracking,
                no logs, no fingerprint.
              </li>
            </ul>
          </section>
        )}

        {/* Privacy + footer cluster */}
        <section className="mt-12 grid sm:grid-cols-2 gap-4">
          <div className={`${t.cardInner} rounded-xl p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" aria-hidden="true" />
              <h3 className={`font-bold ${t.text}`}>Your data never leaves your device</h3>
            </div>
            <p className={`text-sm ${t.textSub}`}>
              No upload, no API call, no logs. The scan happens in JavaScript running in your
              browser. Source on GitHub:{' '}
              <a
                href="https://github.com/goofypluto999/vantage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:underline"
              >
                vantage repo
              </a>{' '}
              (see <code className="text-xs bg-violet-500/10 px-1 rounded">AtsKeywordScannerPage.tsx</code>).
            </p>
          </div>
          <div className={`${t.cardInner} rounded-xl p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <X className="w-5 h-5 text-rose-500" aria-hidden="true" />
              <h3 className={`font-bold ${t.text}`}>What this won't tell you</h3>
            </div>
            <p className={`text-sm ${t.textSub}`}>
              An invented 0-100 ATS score. A guarantee you will pass Workday or Greenhouse. The
              correct cover letter wording. For all of those, run a full Vantage prep pack -- which
              uses Gemini 2.5 Flash to read context, not just match keywords.
            </p>
          </div>
        </section>

        {/* Cross-link to vendor pages */}
        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>
            Want to know how each ATS actually parses your CV?
          </p>
          <Link
            to="/ats"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-violet-500 hover:bg-violet-500/10 transition"
          >
            Read the per-vendor ATS guide <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
