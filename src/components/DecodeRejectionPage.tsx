import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, AlertTriangle, ArrowRight, Copy, Check, Twitter, Linkedin, Loader2,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

interface DecodeResult {
  verdict: string;
  severity: number;
  translation: string;
  specificClues: string[];
  nextMove: string;
}

const VERDICT_LABEL: Record<string, string> = {
  ghosted_template: 'Boilerplate ghosting',
  soft_no_with_room: 'Soft no — keep the door open',
  explicit_no: 'Specific feedback (valuable)',
  saved_for_other_role: '"On file" — polite no',
  ats_filtered: 'ATS-filtered (no human read it)',
  internal_hire: 'Internal hire / freeze',
  headcount_frozen: 'Headcount frozen',
  fit_concern: 'Fit concern',
  experience_gap: 'Experience-level mismatch',
  salary_misaligned: 'Salary expectations off',
  invalid: 'Not a real rejection',
};

const SEVERITY_LABEL: Record<number, string> = {
  1: 'Genuine — rare and valuable',
  2: 'Polite no, room to come back',
  3: 'Standard ghosting',
  4: 'Mechanical — never reached a human',
  5: 'You dodged a bullet',
};

const SEVERITY_COLOR: Record<number, string> = {
  1: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  2: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  3: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  4: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
  5: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

export default function DecodeRejectionPage() {
  const { t } = useTheme();
  const [rejectionEmail, setRejectionEmail] = useState('');
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDecode = async () => {
    setError('');
    if (rejectionEmail.length < 50) {
      setError('Paste at least 50 characters of an actual rejection email.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/decode-rejection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionEmail: rejectionEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Decode failed. Try again.');
      } else {
        setResult(data as DecodeResult);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${SITE_URL}/decode-rejection?utm_source=share&utm_medium=decode`;
  const shareText = result
    ? `Got my rejection email decoded by Vantage AI. Verdict: ${VERDICT_LABEL[result.verdict] || result.verdict}. Severity ${result.severity}/5. Free tool — paste yours:`
    : `Paste your job rejection email, get the brutal-honesty translation. Free, no signup. Built by Vantage AI:`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const copyResult = async () => {
    if (!result) return;
    try {
      const text = `Vantage AI Rejection Decoder\nVerdict: ${VERDICT_LABEL[result.verdict] || result.verdict}\nSeverity: ${result.severity}/5\n\nTranslation:\n${result.translation}\n\nClues:\n${result.specificClues.map(c => `  - ${c}`).join('\n')}\n\nNext move:\n${result.nextMove}\n\nTry it: ${shareUrl}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Rejection Email Decoder', item: `${SITE_URL}/decode-rejection` },
    ],
  };
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vantage AI — Rejection Email Decoder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Free AI tool that decodes job-rejection emails. Paste the email, get the brutal-honesty translation of what the recruiter actually meant + your concrete next move.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is the Rejection Email Decoder free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes — fully free, no signup, no credit card. Built by Vantage AI as a viral-loop tool. Vantage absorbs the AI cost.' },
      },
      {
        '@type': 'Question',
        name: 'Does Vantage store my rejection email?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. The email text is sent to the decode endpoint, processed by Gemini 2.5 Flash, and the response is returned to your browser. Nothing is persisted on Vantage servers.' },
      },
      {
        '@type': 'Question',
        name: 'How accurate is the decoder?',
        acceptedAnswer: { '@type': 'Answer', text: 'It pattern-matches against 10 common rejection-email shapes (boilerplate ghosting, ATS-filtered, salary misaligned, experience gap, etc.) and quotes the specific phrases that gave each verdict away. It is honest about what it does NOT know — it never invents the recruiter name, company, or role beyond what you paste.' },
      },
      {
        '@type': 'Question',
        name: 'What does Vantage AI do beyond this tool?',
        acceptedAnswer: { '@type': 'Answer', text: 'Vantage AI is a paid AI job preparation tool: upload your CV + paste a job link, get a full prep pack in 90 seconds (company intel, tailored cover letter, mock interview questions, fit score, 5-minute pitch outline). 10 free analyses on signup. £5 starter pack for 20 more, never expires.' },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Rejection Email Decoder — what your recruiter actually meant"
        description="Free AI tool. Paste your job rejection email, get the brutal-honesty translation. Identifies ghosting, ATS filters, salary misalignment, experience gaps. Plus your concrete next move. No signup."
        path="/decode-rejection"
        jsonLd={[breadcrumbSchema, softwareSchema, faqSchema]}
      />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/roast" className={`${t.textSub} hover:${t.text}`}>Cover letter roast</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">
              3 free analyses
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Rejection Email Decoder</span>
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${t.text}`}>
          What did the recruiter <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">actually mean?</span>
        </h1>
        <p className={`text-lg mb-3 ${t.textSub}`}>
          Paste the rejection email you got. The AI translates it from corporate boilerplate into what the recruiter was really thinking — plus your concrete next move.
        </p>
        <p className={`text-sm mb-10 ${t.textMuted}`}>
          Free · no signup · nothing stored · runs once per minute, 30 per day per IP
        </p>

        {/* Input */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-6`}>
          <label className={`block text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-3`}>
            Paste the rejection email
          </label>
          <textarea
            value={rejectionEmail}
            onChange={(e) => setRejectionEmail(e.target.value)}
            rows={8}
            maxLength={4000}
            placeholder="Hi [name], thank you for your interest in the [Role] position at [Company]. After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs..."
            className={`w-full p-4 rounded-xl bg-white/5 border border-white/10 ${t.text} placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors text-sm leading-relaxed resize-y`}
          />
          <div className={`mt-2 text-xs ${t.textMuted} flex justify-between`}>
            <span>{rejectionEmail.length} / 4000</span>
            <span>Min 50 chars</span>
          </div>

          <button
            type="button"
            onClick={handleDecode}
            disabled={loading || rejectionEmail.length < 50}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Decoding…</> : <>Decode it <ArrowRight className="w-4 h-4" /></>}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${t.textMuted}`}>
                <Mail className="w-3.5 h-3.5" /> Decoded
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${SEVERITY_COLOR[result.severity] || SEVERITY_COLOR[3]}`}>
                Severity {result.severity}/5 · {SEVERITY_LABEL[result.severity] || 'Standard'}
              </span>
            </div>

            <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>Verdict</div>
            <h2 className={`text-2xl font-bold mb-5 ${t.text}`}>
              {VERDICT_LABEL[result.verdict] || result.verdict}
            </h2>

            <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>What they actually meant</div>
            <p className={`text-base leading-relaxed mb-6 ${t.text}`}>
              {result.translation}
            </p>

            {result.specificClues.length > 0 && (
              <>
                <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>The phrases that gave it away</div>
                <ul className={`space-y-2 mb-6 ${t.textSub}`}>
                  {result.specificClues.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-violet-400 mt-1">→</span>
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>Your next move</div>
            <p className={`text-base leading-relaxed mb-6 ${t.text}`}>
              {result.nextMove}
            </p>

            {/* Share + copy */}
            <div className="flex flex-wrap gap-2 mb-6">
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Twitter className="w-3.5 h-3.5" /> Share on X
              </a>
              <a
                href={liUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
              <button
                type="button"
                onClick={copyResult}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy decode</>}
              </button>
            </div>

            {/* Conversion CTA */}
            <div className="pt-6 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Now write the cover letter that wins the next one</div>
              <p className={`text-sm mb-4 ${t.textSub}`}>
                Vantage takes your CV + a job link and produces the full prep pack — company intel, tailored cover letter (4 tones), mock interview questions, fit score, 5-minute pitch — in 90 seconds. 10 free analyses on signup, no card.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
              >
                Run my prep pack free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Empty-state hint */}
        {!result && !loading && (
          <div className={`${t.glass} rounded-2xl p-6 md:p-7 mb-8`}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${t.textMuted}`}>What you'll get</div>
            <ul className={`space-y-2 text-sm ${t.textSub}`}>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                A verdict from 10 categories: ghosted, ATS-filtered, salary mismatch, experience gap, internal hire, etc.
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                A 2-3 sentence translation in the recruiter's first-person voice — what they actually meant.
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                The specific phrases in the email that gave the verdict away (quoted).
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                One concrete next move tailored to the verdict (not generic "keep applying" advice).
              </li>
            </ul>
          </div>
        )}

        {/* Trust */}
        <div className={`text-xs ${t.textMuted} text-center mt-12`}>
          Your rejection email is sent to Gemini 2.5 Flash for the decode and not persisted on our servers.{' '}
          <Link to="/privacy" className="underline">Privacy policy</Link> · Built by{' '}
          <Link to="/about" className="underline">Giovanni Sizino Ennes</Link>, UK independent founder.
        </div>
      </div>
    </div>
  );
}
