import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Twitter, Linkedin, Copy, ArrowRight, Loader2, AlertTriangle, Wand2, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { taskStarted, recordTaskCompletion, armExitFastDetector, track } from '../lib/track';
import { fetchWithTimeout, classifyAiToolError } from '../lib/fetchWithTimeout';
import { useResultHistory } from '../lib/useResultHistory';
import { buildRoastMarkdown, downloadMarkdown } from '../lib/exportMarkdown';

const SITE_URL = 'https://aimvantage.uk';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const MIN_CHARS = 80;
const MAX_CHARS = 8000;

const SEVERITY_LABEL: Record<number, string> = {
  0: 'Not enough to roast',
  1: 'Genuinely strong',
  2: 'Decent, fixable',
  3: 'Mid',
  4: 'Rough',
  5: 'LinkedIn fever-dream',
};

const SEVERITY_COLOR: Record<number, string> = {
  0: 'bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/30',
  1: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  2: 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border-lime-500/30',
  3: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  4: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  5: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

const SAMPLE_LETTERS = [
  {
    label: 'Mid LinkedIn-influencer letter',
    text: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Product Manager position at your esteemed organization. With over 5 years of dynamic experience in fast-paced environments, I am a passionate, results-driven professional who is eager to leverage my synergistic skill set to drive innovative solutions.

Throughout my career journey, I have consistently demonstrated a tireless work ethic and an unwavering commitment to excellence. I am a strategic thinker with a growth mindset who thrives at the intersection of business and technology. My passion for empowering cross-functional teams to deliver value at scale has been the cornerstone of my success.

I would love to bring my unique blend of skills to your world-class team. I am confident that my passion, dedication, and out-of-the-box thinking would make me a valuable asset to your organization. I look forward to the opportunity to discuss how I can contribute to your continued success.

Thank you for your consideration.

Best regards,
[Your Name]`,
  },
];

interface RoastResponse {
  roast: string;
  severityScore: number;
  error?: string;
  retryAfterMs?: number;
}

export default function RoastPage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState<RoastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  // Recent results — last 5 in localStorage, 30-day TTL. Lets users
  // revisit a roast without re-running and re-spending the rate-limit
  // budget. Added 2026-05-11 for user value (history is free, the API
  // call isn't). See src/lib/useResultHistory.ts.
  const { entries: history, push: pushHistory, remove: removeHistory, clear: clearHistory } =
    useResultHistory<RoastResponse>('vantage-roast-history-v1');

  const charCount = letter.length;
  const charCountColor =
    charCount < MIN_CHARS
      ? 'text-amber-600 dark:text-amber-400'
      : charCount > MAX_CHARS
      ? 'text-rose-600 dark:text-rose-400'
      : t.textMuted;

  useEffect(() => {
    if (roast && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Result appearing on screen IS the task completion for /roast.
      recordTaskCompletion('/roast', 'roast_result_returned');
    }
  }, [roast]);

  // Arm exit-fast detector once on mount. If the user leaves /roast within
  // 10s without ever getting a result, that's a strong "page didn't end
  // their job" signal we want to capture for the satisfaction funnel.
  useEffect(() => {
    const cleanup = armExitFastDetector('/roast', 10);
    return cleanup;
  }, []);

  async function handleRoast() {
    setError(null);
    setRoast(null);
    if (charCount < MIN_CHARS) {
      setError(`Paste at least ${MIN_CHARS} characters of your cover letter.`);
      return;
    }
    if (charCount > MAX_CHARS) {
      setError(`Cover letter is too long (max ${MAX_CHARS} characters).`);
      return;
    }
    setLoading(true);
    taskStarted('/roast', 'roast_request_submitted');
    let res: Response | null = null;
    let json: RoastResponse | null = null;
    try {
      // 30s hard timeout — server maxDuration is 20s, gives 10s headroom
      // for slow networks before we cut the request and ask the user to
      // retry. Added 2026-05-11 after Codex audit found stuck-loading UI.
      res = await fetchWithTimeout(`${API_BASE}/roast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverLetter: letter }),
        timeoutMs: 30_000,
      });
      try {
        json = (await res.json()) as RoastResponse;
      } catch {
        json = null;
      }
      if (!res.ok || !json) {
        const info = classifyAiToolError(undefined, res, json);
        setError(info.retryHint ? `${info.message} ${info.retryHint}` : info.message);
      } else {
        setRoast(json);
        // Persist this successful result so the user can revisit.
        // ID = hash of severity + timestamp; label is the user-facing
        // line shown in the Past Results list. We never persist the
        // user's raw cover letter — only the AI output.
        // ISO-style date for unambiguous labels (review MED). Seconds
        // included so two saves in the same minute don't collide.
        const now = new Date();
        const label = `Severity ${json.severityScore ?? '?'}/5 — ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        pushHistory({
          id: `roast-${now.getTime()}-${json.severityScore ?? 0}`,
          label,
          result: json,
        });
      }
    } catch (err) {
      const info = classifyAiToolError(err, res, json);
      setError(info.retryHint ? `${info.message} ${info.retryHint}` : info.message);
    } finally {
      setLoading(false);
    }
  }

  function loadSample(text: string) {
    setLetter(text);
    setRoast(null);
    setError(null);
  }

  function copyRoast() {
    if (!roast) return;
    const shareText = `My cover letter just got roasted by AimVantage:\n\n${roast.roast}\n\nGet yours roasted at ${SITE_URL}/roast`;
    navigator.clipboard.writeText(shareText).catch(() => {});
  }

  function shareTwitter() {
    if (!roast) return;
    // Keep the roast short enough to fit; X gives ~280 chars excluding URL
    const verdictLine = roast.roast.split('\n')[0].slice(0, 200);
    const text = `My cover letter just got roasted by AimVantage:\n\n"${verdictLine}"\n\nGet yours roasted →`;
    const url = `${SITE_URL}/roast`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  }

  function shareLinkedin() {
    const url = `${SITE_URL}/roast`;
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer');
  }

  function exportRoast() {
    if (!roast) return;
    const sev = typeof roast.severityScore === 'number' ? `sev${roast.severityScore}` : 'sev-unknown';
    const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    downloadMarkdown(`vantage-roast-${sev}-${ts}.md`, buildRoastMarkdown(roast));
  }

  // GOLDEN GOSPEL Tactic 3 (2026-05-08): the roast itself doesn't convert
  // anyone — getting savaged ends the user's day. The fix is to preserve the
  // roasted letter + the verdict and hand it through signup so the dashboard
  // can prompt: "you got roasted, now drop your CV + a job link and AimVantage
  // writes the version that wins". Single-click path from public free tool to
  // signed-up user with intent. Stored in sessionStorage (not localStorage)
  // so it dies with the browser tab — no persistent state leakage.
  function continueWithRewrite() {
    if (!roast) return;
    try {
      const payload = {
        coverLetter: letter,
        roast: roast.roast,
        severityScore: roast.severityScore,
        capturedAt: Date.now(),
      };
      sessionStorage.setItem('vantage:pendingRoast', JSON.stringify(payload));
    } catch { /* sessionStorage may be disabled — proceed anyway */ }
    track('roast_to_register_clicked', { severity: roast.severityScore });
    navigate('/register?source=roast&intent=cover-letter-rewrite');
  }

  // SEO + schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Cover Letter Roast', item: `${SITE_URL}/roast` },
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AimVantage Cover Letter Roast',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    description: 'Free AI tool that roasts your cover letter — savage but constructive feedback in 10 seconds. No signup.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    url: `${SITE_URL}/roast`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is the cover letter roast tool free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. The cover letter roast is fully free, with no signup required. AimVantage runs the roast on Gemini 2.5 Flash and absorbs the cost.' },
      },
      {
        '@type': 'Question',
        name: 'Does AimVantage store my cover letter?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. The cover letter is sent to the roast endpoint, processed by the AI model, and the response is returned to your browser. Nothing is persisted on our servers.' },
      },
      {
        '@type': 'Question',
        name: 'Will the roast actually help me write a better cover letter?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. The roast names specific clichés in your letter and gives you the better swap. It is funny, but every fix is real and applicable.' },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="AI Cover Letter Roast — savage, free, no signup"
        description="Paste your cover letter, get a savage but constructive roast in 10 seconds. Free, no signup. Built by AimVantage."
        path="/roast"
        jsonLd={[breadcrumbSchema, softwareSchema, faqSchema]}
      />

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Cover letter roast</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
            <Flame className="w-6 h-6" />
          </span>
          <div>
            <div className={`text-xs uppercase tracking-wider ${t.textMuted}`}>Free · no signup</div>
            <h1 className={`text-3xl md:text-5xl font-bold ${t.text}`}>Roast my cover letter.</h1>
          </div>
        </div>

        <p className={`text-base md:text-lg mb-8 ${t.textSub}`}>
          Paste your cover letter. Get a savage, specific, share-worthy roast in 10 seconds.
          Every roast quotes your actual lines and tells you the better swap. Nothing stored.
        </p>

        {/* Input */}
        <div className={`${t.glass} rounded-2xl p-5 md:p-6 mb-4`}>
          <label htmlFor="cover-letter" className={`block text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>
            Your cover letter
          </label>
          <textarea
            id="cover-letter"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            placeholder="Paste your cover letter here…"
            rows={12}
            className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 text-sm md:text-base font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            disabled={loading}
            maxLength={MAX_CHARS + 200} // Hard cap with small buffer for paste
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className={`text-xs ${charCountColor}`}>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
              {charCount < MIN_CHARS && charCount > 0 && (
                <span className="ml-2">· need at least {MIN_CHARS}</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {SAMPLE_LETTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => loadSample(s.text)}
                  className={`text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
                  type="button"
                >
                  Try a sample
                </button>
              ))}
              <button
                onClick={handleRoast}
                disabled={loading || charCount < MIN_CHARS || charCount > MAX_CHARS}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
                type="button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Roasting…
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    Roast it
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className={`flex items-start gap-2 p-4 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm`}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>{error}</div>
          </div>
        )}

        {/* Past results — show only when at least one saved entry AND
            no current roast on screen. Lets users revisit recent runs
            without paying a new rate-limit slot. Drop-in click restores
            into the same `roast` state. Clear button per-entry. */}
        {history.length > 0 && !roast && !loading && (
          <div className={`${t.glass} rounded-2xl p-5 md:p-6 mb-6`}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className={`text-sm font-semibold ${t.text}`}>
                Past roasts <span className={`text-xs font-normal ${t.textMuted}`}>({history.length} saved on this device)</span>
              </p>
              <div className="flex items-center gap-3">
                <p className={`text-xs ${t.textMuted}`}>Tap to reload — no AI cost.</p>
                <button
                  type="button"
                  onClick={clearHistory}
                  className={`text-xs underline ${t.textSub} hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-rose-400/50 rounded`}
                >
                  Clear all
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {history.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => entry.result && typeof entry.result === 'object' ? setRoast(entry.result) : removeHistory(entry.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm ${t.text} transition focus:outline-none focus:ring-2 focus:ring-violet-400/50`}
                  >
                    {entry.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHistory(entry.id)}
                    aria-label={`Remove past roast: ${entry.label}`}
                    className={`px-2.5 py-2 rounded-lg text-sm ${t.textSub} hover:bg-rose-500/15 hover:text-rose-400 transition focus:outline-none focus:ring-2 focus:ring-rose-400/50`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Result */}
        {roast && (
          <div ref={resultRef} className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${t.textMuted}`}>
                <Flame className="w-3.5 h-3.5" /> The roast
              </div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${SEVERITY_COLOR[roast.severityScore] || SEVERITY_COLOR[3]}`}
              >
                Severity {roast.severityScore} · {SEVERITY_LABEL[roast.severityScore] || 'Mid'}
              </span>
            </div>

            <div className={`whitespace-pre-wrap leading-relaxed text-[15px] md:text-base ${t.text}`}>
              {roast.roast}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={shareTwitter}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/90 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                type="button"
              >
                <Twitter className="w-4 h-4" aria-hidden="true" /> Share on X
              </button>
              <button
                onClick={shareLinkedin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                type="button"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" /> Share on LinkedIn
              </button>
              <button
                onClick={copyRoast}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
                type="button"
              >
                <Copy className="w-4 h-4" aria-hidden="true" /> Copy roast
              </button>
              <button
                onClick={exportRoast}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
                type="button"
                aria-label="Download this roast as a Markdown file for Notion or Obsidian"
                title="Save for Notion / Obsidian / archive — Markdown file"
              >
                <Download className="w-4 h-4" aria-hidden="true" /> Download (.md)
              </button>
            </div>

            {/* Conversion CTA — GOLDEN GOSPEL Tactic 3 (2026-05-08).
                Primary path: keep this letter, hand it through signup, and
                let the dashboard offer to rewrite it against the user's
                actual CV + a job URL. Secondary path: plain register link for
                people who don't want to keep this letter. */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Now write the better one</div>
              <p className={`text-sm mb-4 ${t.textSub}`}>
                The roast tells you what's broken. AimVantage writes the version that wins — tailored to the company,
                with company intel, fit score, mock interview, and 5-minute pitch. 90 seconds. 10 free tokens on signup
                (1 token = 1 full analysis, no card needed).
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={continueWithRewrite}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-95 transition-opacity"
                >
                  <Wand2 className="w-4 h-4" />
                  Continue with this letter — rewrite using my CV
                </button>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/80 font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Start fresh <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <p className={`text-[11px] mt-2 ${t.textMuted}`}>
                Your letter and roast travel with you to your dashboard so you can pick up exactly where you are.
              </p>
            </div>
          </div>
        )}

        {/* Empty-state — what to expect */}
        {!roast && !loading && (
          <div className={`${t.glass} rounded-2xl p-6 md:p-7 mb-8`}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${t.textMuted}`}>What you'll get</div>
            <ul className={`space-y-2 text-sm ${t.textSub}`}>
              <li className="flex gap-2">
                <span className="text-rose-500">→</span>
                A one-line verdict that quotes the worst tic in your letter (the share-worthy line).
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500">→</span>
                Three numbered roasts, each calling out a specific clich&eacute; in your text and giving the better swap.
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500">→</span>
                A severity score from 1 (genuinely strong) to 5 (LinkedIn fever-dream).
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500">→</span>
                One closing line of slightly-too-honest advice. Land the plane.
              </li>
            </ul>
          </div>
        )}

        {/* Trust + nothing stored */}
        <div className={`text-xs ${t.textMuted} text-center mt-12`}>
          Your cover letter is sent to Gemini 2.5 Flash for the roast and not persisted on our servers.{' '}
          <Link to="/privacy" className="underline">Privacy policy</Link> · Built by{' '}
          <Link to="/" className="underline">AimVantage</Link>.
        </div>
      </div>
    </div>
  );
}
