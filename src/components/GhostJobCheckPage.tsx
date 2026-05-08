import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ghost, AlertTriangle, ArrowRight, Copy, Check, Twitter, Linkedin, Loader2,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

interface GhostResult {
  ghostProbability: number;
  verdict: string;
  summary: string;
  tells: string[];
  yourMove: string;
}

const VERDICT_LABEL: Record<string, string> = {
  real_job: 'Real job — apply confidently',
  probably_real: 'Probably real — worth applying',
  uncertain: 'Uncertain — apply, but cap prep time',
  probably_ghost: 'Probably a ghost — be selective',
  almost_certainly_ghost: 'Almost certainly a ghost',
  invalid: 'Not enough to score',
};

function probColor(p: number): string {
  if (p >= 75) return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
  if (p >= 50) return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30';
  if (p >= 25) return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
  return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
}

export default function GhostJobCheckPage() {
  const { t } = useTheme();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<GhostResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCheck = async () => {
    setError('');
    if (jobDescription.length < 100) {
      setError('Paste at least 100 characters of an actual job description.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ghost-job-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobDescription.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Check failed. Try again.');
      } else {
        setResult(data as GhostResult);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${SITE_URL}/ghost-job-check?utm_source=share&utm_medium=ghost`;
  const shareText = result
    ? `AI told me this job listing is ${result.ghostProbability}% likely to be a ghost. Free tool, paste any JD: `
    : `Free tool: paste a job listing, AI tells you how likely it's a ghost job. No signup. Built by Vantage AI:`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const copyResult = async () => {
    if (!result) return;
    try {
      const text = `Vantage AI Ghost-Job Check\nGhost probability: ${result.ghostProbability}%\nVerdict: ${VERDICT_LABEL[result.verdict] || result.verdict}\n\nSummary:\n${result.summary}\n\nTells:\n${result.tells.map(tt => `  - ${tt}`).join('\n')}\n\nYour move:\n${result.yourMove}\n\nTry it: ${shareUrl}`;
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
      { '@type': 'ListItem', position: 2, name: 'Ghost-Job Detector', item: `${SITE_URL}/ghost-job-check` },
    ],
  };
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vantage AI — Ghost Job Detector',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Free AI tool that scores job listings on ghost-job probability (0-100). Paste the JD, get a verdict + the specific tells + your concrete next move. No signup.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a ghost job?',
        acceptedAnswer: { '@type': 'Answer', text: 'A ghost job is a publicly-posted role that will not actually result in a hire. Common patterns: the role is already filled internally, the company is collecting CVs for a future opening, the listing is reposted month after month, or the description is so vague the role does not really exist as advertised.' },
      },
      {
        '@type': 'Question',
        name: 'How does the Ghost Job Detector work?',
        acceptedAnswer: { '@type': 'Answer', text: 'Paste the JD text. Vantage runs it through Gemini 2.5 Flash with a strict pattern-matching prompt that scores against known ghost-job tells: cliche phrases (highly motivated, self-starter), suspiciously wide salary bands, multiple seniority levels in one role, no concrete deliverables or tech stack, generic team-introduction copy. Returns a 0-100 probability + the specific phrases that informed the score.' },
      },
      {
        '@type': 'Question',
        name: 'Is the Ghost Job Detector free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes — fully free, no signup, no credit card. Built by Vantage AI as a viral-loop tool. Vantage absorbs the AI cost.' },
      },
      {
        '@type': 'Question',
        name: 'Does Vantage store the job description I paste?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. The text is sent to the check endpoint, processed by Gemini, and the response is returned to your browser. Nothing is persisted on Vantage servers.' },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Ghost Job Detector — is this listing real?"
        description="Free AI tool. Paste a job description, get the ghost-probability score (0-100). Identifies cliché phrases, vague deliverables, suspicious salary bands, reposted listings. Plus your concrete next move. No signup."
        path="/ghost-job-check"
        jsonLd={[breadcrumbSchema, softwareSchema, faqSchema]}
      />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/roast" className={`${t.textSub} hover:${t.text}`}>Roast cover letter</Link>
            <Link to="/decode-rejection" className={`${t.textSub} hover:${t.text}`}>Decode rejection</Link>
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
          <span>Ghost-Job Detector</span>
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${t.text}`}>
          Is this job <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">a ghost?</span>
        </h1>
        <p className={`text-lg mb-3 ${t.textSub}`}>
          Paste the JD. The AI scores how likely the listing will actually result in a hire — based on cliché patterns, vague deliverables, suspicious salary bands, and the reposting tells.
        </p>
        <p className={`text-sm mb-10 ${t.textMuted}`}>
          Free · no signup · nothing stored · runs once per minute, 30 per day per IP
        </p>

        {/* Input */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-6`}>
          <label className={`block text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-3`}>
            Paste the job description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            maxLength={6000}
            placeholder="Senior Product Manager — [Company]. We are looking for a highly motivated, results-driven product leader to join our growing team. The ideal candidate will be a self-starter who thrives in ambiguity..."
            className={`w-full p-4 rounded-xl bg-white/5 border border-white/10 ${t.text} placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors text-sm leading-relaxed resize-y`}
          />
          <div className={`mt-2 text-xs ${t.textMuted} flex justify-between`}>
            <span>{jobDescription.length} / 6000</span>
            <span>Min 100 chars</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCheck}
              disabled={loading || jobDescription.length < 100}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking…</> : <>Check it <ArrowRight className="w-4 h-4" /></>}
            </button>
            {/* Sample loaders — added 2026-05-08. Three realistic JDs
                spanning ghost / mixed / real shapes so visitors can see
                the calibration with one click. */}
            <button
              type="button"
              onClick={() => setJobDescription(`Senior Product Manager — TechCorp\n\nWe are looking for a highly motivated, results-driven Senior Product Manager to join our growing team. The ideal candidate will be a self-starter who thrives in ambiguity and is passionate about building great products.\n\nResponsibilities:\n- Drive product strategy and roadmap\n- Work cross-functionally with engineering, design, and marketing\n- Be a team player and wear many hats\n\nRequirements:\n- 3-15 years of product management experience\n- Strong communication skills\n- Bachelor's degree preferred\n\nSalary: £40,000 - £120,000 depending on experience.\nHybrid: 2-3 days in office (London).`)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
            >
              Sample 1: high-ghost
            </button>
            <button
              type="button"
              onClick={() => setJobDescription(`Staff Product Manager — Stripe Payments\n\nThe Payments team owns the core money-movement primitives behind Stripe — Charges, Payment Intents, Setup Intents. You'll lead the next chapter of how merchants accept payments globally.\n\nYou will:\n- Define strategy for the Payments product line, partnering with eng leadership on infrastructure trade-offs\n- Work with risk and compliance on regulatory rollouts (PSD2, Reg E)\n- Translate ambiguous user pain into shipped product\n\nWe're looking for:\n- 8+ years of PM experience including 3+ at Staff/Principal level\n- Deep payments or fintech background\n- Track record of shipping at scale ($10M+ revenue impact)\n\nReports to: VP Product, Payments. Manages: 6-engineer + 2-designer team.\nSalary band: £155K - £180K base + equity.`)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
            >
              Sample 2: real job
            </button>
            <button
              type="button"
              onClick={() => setJobDescription(`Marketing Manager — Various levels\n\nDynamic role at a fast-growing startup. We need a passionate marketing rockstar who can wear many hats and drive results. The ideal candidate is self-motivated and ready to make an impact.\n\nResponsibilities include marketing activities, campaign management, and other duties as assigned. Must be comfortable with ambiguity.\n\nLevel: Junior / Mid / Senior depending on candidate.\nSalary: Competitive.\n\nLocation: Hybrid.\nReports to: TBD.\n\nApply if you're hungry for an opportunity to grow with us.`)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
            >
              Sample 3: textbook ghost
            </button>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-2 p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {result && (
          <div className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${t.textMuted}`}>
                <Ghost className="w-3.5 h-3.5" /> Ghost-job check
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${probColor(result.ghostProbability)}`}>
                {result.ghostProbability}% ghost probability
              </span>
            </div>

            <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>Verdict</div>
            <h2 className={`text-2xl font-bold mb-5 ${t.text}`}>
              {VERDICT_LABEL[result.verdict] || result.verdict}
            </h2>

            <p className={`text-base leading-relaxed mb-6 ${t.text}`}>
              {result.summary}
            </p>

            {result.tells.length > 0 && (
              <>
                <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>The tells</div>
                <ul className={`space-y-2 mb-6 ${t.textSub}`}>
                  {result.tells.map((tt, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-violet-400 mt-1">→</span>
                      <span className="leading-relaxed">{tt}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>Your move</div>
            <p className={`text-base leading-relaxed mb-6 ${t.text}`}>
              {result.yourMove}
            </p>

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
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy result</>}
              </button>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>For real jobs, win them properly</div>
              <p className={`text-sm mb-4 ${t.textSub}`}>
                If the listing IS real, don't waste it on a generic application. Vantage takes your CV + the job link and produces the full prep pack — company intel, tailored cover letter (4 tones), mock interview questions, fit score, 5-minute pitch — in 90 seconds. 10 free analyses on signup, no card.
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

        {!result && !loading && (
          <div className={`${t.glass} rounded-2xl p-6 md:p-7 mb-8`}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${t.textMuted}`}>What you'll get</div>
            <ul className={`space-y-2 text-sm ${t.textSub}`}>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                A 0–100 ghost probability score with strict calibration.
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                A verdict from 5 categories: real / probably-real / uncertain / probably-ghost / almost-certain-ghost.
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                The specific cliché phrases or red flags from the JD that informed the score (quoted).
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">→</span>
                One concrete next move tailored to the verdict (skip / cap prep / apply confidently).
              </li>
            </ul>
          </div>
        )}

        <div className={`text-xs ${t.textMuted} text-center mt-12`}>
          The job description is sent to Gemini 2.5 Flash for the check and not persisted on our servers.{' '}
          <Link to="/privacy" className="underline">Privacy policy</Link> · Built by{' '}
          <Link to="/about" className="underline">Giovanni Sizino Ennes</Link>, UK independent founder.
        </div>
      </div>
    </div>
  );
}
