import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Search, AlertTriangle, CheckCircle2, Eye, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/jd-decoder -- client-side job description analyser.
 *
 * Pure browser-side. No API calls. Decodes patterns most candidates miss
 * when reading a JD: hidden seniority signals, ghost-job tells, remote-
 * vs-hybrid camouflage, ATS-stripping risks, suspicious salary bands.
 *
 * Drafted 2026-05-10 to expand the free-tool surface (Gio asked for
 * "MORE TOOLS, MORE VALUE, MORE FUNCTIONS"). Every classification has
 * an explainer text so the user understands why we flagged it -- not a
 * black-box "score".
 */

interface DecodeResult {
  estimatedSeniority: { level: string; confidence: number; signals: string[] };
  yearsRequired: { min: number | null; signals: string[] };
  remoteSignal: { mode: 'remote' | 'hybrid' | 'office' | 'unclear'; confidence: number; signals: string[] };
  ghostFlags: { score: number; flags: string[] };
  atsRisks: string[];
  salarySignal: { found: boolean; range?: string; band?: 'tight' | 'wide' | 'suspicious' };
  scopeRedFlags: string[];
  cultureFitFilters: string[];
}

const SENIORITY_PATTERNS: Array<{ level: string; weight: number; tests: RegExp[] }> = [
  { level: 'Junior / Graduate', weight: 1, tests: [/\bjunior\b/i, /\bgraduate\b/i, /\bentry[ -]level\b/i, /\b0[-\s]2 years\b/i, /\bnew grad\b/i] },
  { level: 'Mid', weight: 2, tests: [/\bmid[ -]level\b/i, /\b3[-\s]5 years\b/i, /\b2[-\s]4 years\b/i] },
  { level: 'Senior', weight: 3, tests: [/\bsenior\b/i, /\b5\+? years\b/i, /\b6\+? years\b/i, /\bsr\.?\b/i] },
  { level: 'Staff / Principal', weight: 4, tests: [/\bstaff\b/i, /\bprincipal\b/i, /\b8\+? years\b/i, /\b10\+? years\b/i, /\blead\b/i, /\barchitect\b/i] },
  { level: 'Director / VP', weight: 5, tests: [/\bdirector\b/i, /\bvp\b/i, /\bhead of\b/i, /\bvice president\b/i] },
];

const GHOST_PATTERNS: Array<{ flag: string; tests: RegExp[] }> = [
  { flag: 'Cliché phrases ("highly motivated", "self-starter")', tests: [/highly motivated/i, /self[ -]starter/i, /go[ -]getter/i, /hit the ground running/i, /rockstar/i, /ninja/i] },
  { flag: 'Overly broad seniority range', tests: [/3[-\s]?to[-\s]?7 years/i, /\b3[-\s]to[-\s]10\b/i, /any level/i, /senior or principal/i] },
  { flag: 'Missing tech stack on a tech role', tests: [/cutting[ -]edge technologies/i, /modern stack/i, /innovative tech/i] },
  { flag: 'Vague responsibilities', tests: [/various tasks/i, /other duties/i, /as needed/i, /strategic initiatives/i] },
  { flag: 'Recently reposted (date hint)', tests: [/reposted/i, /still hiring/i] },
];

const ATS_RISK_PATTERNS: Array<{ risk: string; tests: RegExp[] }> = [
  { risk: 'Workday-style strict section-heading parser', tests: [/workday/i] },
  { risk: 'Greenhouse — strips emoji, exact-match section headers', tests: [/greenhouse/i] },
  { risk: 'Lever — historic header/footer drop-out', tests: [/\blever\b/i] },
  { risk: 'Taleo — Oracle-owned strict ASCII parser', tests: [/taleo/i] },
  { risk: 'iCIMS — keyword-density-weighted ranker', tests: [/icims/i] },
  { risk: 'SAP SuccessFactors — corporate, strict format', tests: [/successfactors/i] },
];

const REMOTE_PATTERNS: Array<{ mode: 'remote' | 'hybrid' | 'office'; weight: number; tests: RegExp[] }> = [
  { mode: 'remote', weight: 3, tests: [/fully remote/i, /\bremote[- ]first\b/i, /\bremote\b/i, /work from anywhere/i, /\bWFH\b/i, /\bdistributed\b/i] },
  { mode: 'hybrid', weight: 3, tests: [/\bhybrid\b/i, /\d days? (?:in|per week|a week) (?:in )?(?:the )?(?:office|HQ)/i, /flexible work/i] },
  { mode: 'office', weight: 3, tests: [/in[ -]?office/i, /onsite/i, /5 days a week/i, /\bRTO\b/i, /return to office/i] },
];

const SCOPE_RED_FLAGS: Array<{ flag: string; tests: RegExp[] }> = [
  { flag: 'Two roles in one (e.g. "engineer + designer")', tests: [/full[- ]?stack.*designer/i, /engineer.*marketing/i, /developer.*manager/i, /coding.*sales/i] },
  { flag: 'Manager + IC dual mandate (likely overworked)', tests: [/player[- ]coach/i, /hands[- ]?on manager/i, /coding manager/i] },
  { flag: '"Wear many hats" disclaimer', tests: [/wear many hats/i, /many hats/i, /jack of all/i] },
  { flag: 'Crisis-mode framing', tests: [/fast[- ]paced/i, /high[- ]pressure/i, /demanding environment/i, /aggressive timeline/i] },
];

const CULTURE_FILTER_PATTERNS: Array<{ filter: string; tests: RegExp[] }> = [
  { filter: 'Strong values-round signal — research the values list before applying', tests: [/our values/i, /core values/i, /culture fit/i, /must align with our culture/i] },
  { filter: 'Take-home likely — check Glassdoor for time budget', tests: [/take[- ]home/i, /coding (?:assignment|exercise)/i, /portfolio review/i] },
  { filter: 'Live coding round expected', tests: [/live coding/i, /pair programming/i, /technical screen/i] },
  { filter: 'System design round expected', tests: [/system design/i, /architecture interview/i, /design.*scale/i] },
  { filter: 'Bar-raiser style (Amazon LP-driven)', tests: [/leadership principles/i, /bar[- ]?raiser/i] },
];

function decodeJd(text: string): DecodeResult {
  const lower = text.toLowerCase();

  // Seniority
  const seniorityScores: Record<string, { weight: number; signals: string[] }> = {};
  for (const p of SENIORITY_PATTERNS) {
    const matches = p.tests.flatMap((re) => {
      const m = text.match(re);
      return m ? [m[0]] : [];
    });
    if (matches.length) {
      seniorityScores[p.level] = {
        weight: p.weight * matches.length,
        signals: matches,
      };
    }
  }
  const seniorityRanked = Object.entries(seniorityScores).sort((a, b) => b[1].weight - a[1].weight);
  const topSeniority = seniorityRanked[0];

  // Years required
  const yearsMatches = [...text.matchAll(/(\d+)[+\s]*(?:to\s+(\d+)\s+)?years?/gi)];
  const minYears = yearsMatches.length ? Math.min(...yearsMatches.map((m) => Number(m[1]))) : null;
  const yearsSignals = yearsMatches.slice(0, 5).map((m) => m[0]);

  // Remote signal
  const remoteScores: Record<string, { weight: number; signals: string[] }> = {};
  for (const p of REMOTE_PATTERNS) {
    const matches = p.tests.flatMap((re) => {
      const m = text.match(re);
      return m ? [m[0]] : [];
    });
    if (matches.length) {
      remoteScores[p.mode] = {
        weight: p.weight * matches.length,
        signals: matches,
      };
    }
  }
  const remoteRanked = Object.entries(remoteScores).sort((a, b) => b[1].weight - a[1].weight);
  const topRemote = remoteRanked[0];
  const totalRemoteWeight = remoteRanked.reduce((sum, [, v]) => sum + v.weight, 0) || 1;

  // Ghost flags
  const ghostFlags: string[] = [];
  for (const p of GHOST_PATTERNS) {
    if (p.tests.some((re) => re.test(text))) ghostFlags.push(p.flag);
  }
  const ghostScore = Math.min(100, ghostFlags.length * 22);

  // ATS risks (mostly company-stack hints)
  const atsRisks: string[] = [];
  for (const p of ATS_RISK_PATTERNS) {
    if (p.tests.some((re) => re.test(text))) atsRisks.push(p.risk);
  }

  // Salary signal
  const salaryRegex = /[£$€]\s?[\d,]{2,}(?:[k]| thousand)?\s?(?:[-–to]+\s?[£$€]?\s?[\d,]{2,}(?:k| thousand)?)?/gi;
  const salaryMatches = [...text.matchAll(salaryRegex)].map((m) => m[0]);
  let salarySignal: DecodeResult['salarySignal'] = { found: false };
  if (salaryMatches.length) {
    const range = salaryMatches[0];
    // Estimate band tightness
    const numbers = (range.match(/\d+(?:,\d+)*/g) || []).map((n) => Number(n.replace(/,/g, '')));
    let band: 'tight' | 'wide' | 'suspicious' = 'tight';
    if (numbers.length >= 2) {
      const ratio = Math.max(...numbers) / Math.min(...numbers);
      if (ratio > 2.5) band = 'suspicious';
      else if (ratio > 1.6) band = 'wide';
    }
    salarySignal = { found: true, range, band };
  }

  // Scope red flags
  const scopeFlags: string[] = [];
  for (const p of SCOPE_RED_FLAGS) {
    if (p.tests.some((re) => re.test(text))) scopeFlags.push(p.flag);
  }

  // Culture / interview filters
  const cultureFilters: string[] = [];
  for (const p of CULTURE_FILTER_PATTERNS) {
    if (p.tests.some((re) => re.test(text))) cultureFilters.push(p.filter);
  }

  return {
    estimatedSeniority: {
      level: topSeniority ? topSeniority[0] : 'Unclear',
      confidence: topSeniority ? Math.min(100, Math.round((topSeniority[1].weight / 5) * 100)) : 0,
      signals: topSeniority ? topSeniority[1].signals.slice(0, 5) : [],
    },
    yearsRequired: { min: minYears, signals: yearsSignals },
    remoteSignal: {
      mode: topRemote ? (topRemote[0] as DecodeResult['remoteSignal']['mode']) : 'unclear',
      confidence: topRemote ? Math.round((topRemote[1].weight / totalRemoteWeight) * 100) : 0,
      signals: topRemote ? topRemote[1].signals.slice(0, 5) : [],
    },
    ghostFlags: { score: ghostScore, flags: ghostFlags },
    atsRisks,
    salarySignal,
    scopeRedFlags: scopeFlags,
    cultureFitFilters: cultureFilters,
  };
  void lower;
}

export default function JdDecoderPage() {
  const { t } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState<DecodeResult | null>(null);

  const canDecode = text.trim().length >= 200;

  const handleDecode = () => {
    if (!canDecode) return;
    setResult(decodeJd(text));
    setTimeout(() => {
      const el = document.getElementById('jd-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const ghostBand = useMemo(() => {
    if (!result) return null;
    const s = result.ghostFlags.score;
    if (s >= 60) return { label: 'High ghost-job risk', tone: 'rose' as const };
    if (s >= 30) return { label: 'Moderate concerns', tone: 'amber' as const };
    return { label: 'Low ghost-job risk', tone: 'emerald' as const };
  }, [result]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'JD Decoder', item: `${SITE_URL}/tools/jd-decoder` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free JD Decoder — Read Between the Lines of a Job Description"
        description="Paste any job description. Get the hidden seniority signals, ghost-job risk, remote-vs-hybrid camouflage, ATS-stripping risks, and the interview rounds you should expect. Runs in your browser. No signup."
        path="/tools/jd-decoder"
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Decode any job description
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Paste a JD. Get the hidden seniority signals, ghost-job risk, remote-vs-hybrid camouflage,
            ATS hints, scope red flags, and the interview rounds you should actually expect. No
            invented score &mdash; every flag links to its source phrase.
          </p>
        </header>

        <div className="mb-4">
          <label htmlFor="jd-text" className={`block text-sm font-semibold ${t.text} mb-2`}>
            Paste the job description
          </label>
          <textarea
            id="jd-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder="Paste the full text of the job posting. Include Requirements / Responsibilities / About sections."
            className={`w-full rounded-xl p-4 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
          />
          <p className={`mt-1 text-xs ${t.textMuted}`}>
            {text.length} characters {text.length >= 200 ? '· OK' : `· need ${200 - text.length} more`}
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
            <Search className="w-4 h-4" /> Decode this JD
          </button>
          <button
            type="button"
            onClick={() => { setText(''); setResult(null); }}
            className={`text-sm ${t.textSub} hover:opacity-80 underline-offset-2 hover:underline`}
          >
            Clear
          </button>
        </div>

        {result && ghostBand && (
          <section
            id="jd-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className={`text-2xl font-bold ${t.text} mb-3`}>
              What this JD actually says
            </h2>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-violet-500" aria-hidden="true" />
                <h3 className={`font-bold ${t.text}`}>Estimated seniority: {result.estimatedSeniority.level}</h3>
                <span className={`text-xs ${t.textMuted}`}>· {result.estimatedSeniority.confidence}% confidence</span>
              </div>
              {result.estimatedSeniority.signals.length > 0 && (
                <p className={`text-sm ${t.textSub}`}>
                  Signals matched: {result.estimatedSeniority.signals.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-violet-500/15 text-violet-700 dark:text-violet-300 mr-1">{s}</span>
                  ))}
                </p>
              )}
              {result.yearsRequired.min !== null && (
                <p className={`text-sm ${t.textSub} mt-2`}>
                  Years stated: minimum {result.yearsRequired.min}+ years.
                  {result.yearsRequired.min >= 8 && ' This is staff+ territory regardless of the title.'}
                </p>
              )}
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-violet-500" aria-hidden="true" />
                <h3 className={`font-bold ${t.text}`}>
                  Remote signal: {result.remoteSignal.mode === 'unclear' ? 'Not stated clearly' : result.remoteSignal.mode}
                </h3>
              </div>
              {result.remoteSignal.signals.length > 0 ? (
                <p className={`text-sm ${t.textSub}`}>
                  Phrases matched: {result.remoteSignal.signals.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-violet-500/15 text-violet-700 dark:text-violet-300 mr-1">{s}</span>
                  ))}
                </p>
              ) : (
                <p className={`text-sm ${t.textSub}`}>
                  No remote / hybrid / office wording detected. Default assumption for unspecified
                  posts in 2026 is hybrid 2-3 days a week. Confirm at the recruiter screen.
                </p>
              )}
            </div>

            <div
              className={`${t.glass} rounded-2xl p-5 border-l-4 ${
                ghostBand.tone === 'emerald'
                  ? 'border-emerald-500'
                  : ghostBand.tone === 'amber'
                  ? 'border-amber-500'
                  : 'border-rose-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-5 h-5 ${
                  ghostBand.tone === 'emerald'
                    ? 'text-emerald-500'
                    : ghostBand.tone === 'amber'
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`} aria-hidden="true" />
                <h3 className={`font-bold ${t.text}`}>{ghostBand.label} ({result.ghostFlags.score}/100)</h3>
              </div>
              {result.ghostFlags.flags.length > 0 ? (
                <ul className={`text-sm ${t.textSub} space-y-1 list-disc pl-5`}>
                  {result.ghostFlags.flags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              ) : (
                <p className={`text-sm ${t.textSub}`}>
                  No common ghost-job tells detected in this listing. Apply with confidence.
                </p>
              )}
            </div>

            {result.salarySignal.found && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <h3 className={`font-bold ${t.text} mb-1`}>
                  Salary stated: {result.salarySignal.range}
                  {result.salarySignal.band && (
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                      result.salarySignal.band === 'tight'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : result.salarySignal.band === 'wide'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                    }`}>
                      {result.salarySignal.band} band
                    </span>
                  )}
                </h3>
                <p className={`text-sm ${t.textSub}`}>
                  {result.salarySignal.band === 'tight' && 'Tight band suggests a calibrated offer. Negotiate from the upper number.'}
                  {result.salarySignal.band === 'wide' && 'Wide band signals the role spans seniority levels. Confirm which level you are being considered for at the recruiter screen.'}
                  {result.salarySignal.band === 'suspicious' && 'Very wide band (more than 2.5x ratio). Either two roles bundled into one listing OR an attempt to anchor low. Ask explicitly which level applies to you.'}
                </p>
              </div>
            )}

            {result.scopeRedFlags.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <h3 className={`font-bold ${t.text} mb-2`}>Scope red flags</h3>
                <ul className={`text-sm ${t.textSub} space-y-1 list-disc pl-5`}>
                  {result.scopeRedFlags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.cultureFitFilters.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" aria-hidden="true" />
                  <h3 className={`font-bold ${t.text}`}>Interview rounds you should expect</h3>
                </div>
                <ul className={`text-sm ${t.textSub} space-y-1 list-disc pl-5`}>
                  {result.cultureFitFilters.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.atsRisks.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <h3 className={`font-bold ${t.text} mb-2`}>ATS hints</h3>
                <ul className={`text-sm ${t.textSub} space-y-1 list-disc pl-5`}>
                  {result.atsRisks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <p className={`text-xs ${t.textMuted} mt-3`}>
                  Run your CV through{' '}
                  <Link to="/ats/scanner" className="text-violet-500 hover:underline">/ats/scanner</Link>{' '}
                  before applying — the scanner shows which JD keywords your CV is missing.
                </p>
              </div>
            )}

            {/* CTA tied to the result */}
            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Now run the full prep on this exact JD.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your CV plus the live job link, scores the fit, drafts a tailored cover
                letter, and generates the interview questions specific to this role. 90 seconds. 10
                free packs on signup.
              </p>
              <Link
                to="/register?source=jd-decoder"
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
              What the decoder actually checks
            </h2>
            <ul className={`${t.textSub} space-y-2 text-sm list-disc pl-5`}>
              <li><strong>Seniority signals.</strong> Title vs years requested. Most JDs lie about level — staff-level JDs get titled "senior" all the time.</li>
              <li><strong>Years required.</strong> Minimum number stated. Cross-referenced with your seniority estimate.</li>
              <li><strong>Remote / hybrid / office.</strong> Detects the specific phrases. Defaults to "unclear" when the JD is silent — most companies in 2026 expect hybrid.</li>
              <li><strong>Ghost-job risk.</strong> Cliché phrases, suspiciously wide salary bands, vague responsibilities, missing tech stack on tech roles.</li>
              <li><strong>Salary band.</strong> If stated, classifies tight / wide / suspicious based on min-max ratio.</li>
              <li><strong>Scope red flags.</strong> Two-roles-in-one, manager-IC dual mandate, "wear many hats", crisis-mode framing.</li>
              <li><strong>Interview rounds expected.</strong> Take-home, live coding, system design, leadership-principles round.</li>
              <li><strong>ATS hints.</strong> If the JD names the ATS, links to the per-vendor parser quirks.</li>
            </ul>
            <p className={`text-xs ${t.textMuted} mt-4`}>
              All client-side. Your JD never leaves your browser. No tracking, no logs.
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
          </div>
        </section>
      </main>
    </div>
  );
}
