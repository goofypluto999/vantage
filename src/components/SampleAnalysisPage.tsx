import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, Building2, FileText, Lightbulb, Mic, Sparkles, Target, CheckCircle2, AlertTriangle, Lock, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { getSampleAnalysis, type SampleAnalysis } from '../data/sampleAnalyses';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /sample/:slug — full public read-only Vantage outputs.
 *
 * Conversion lever: the #1 reason new visitors don't sign up is "I don't
 * know what I get." This page shows the full output — every section the
 * paid product produces — for a real, currently-listed job. Skeptics can
 * read the entire 90-second analysis without registering, share the URL,
 * link in DMs.
 *
 * Routed publicly. SEO-tuned. Article + JSON-LD attached.
 */
export default function SampleAnalysisPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTheme();
  const sample = slug ? getSampleAnalysis(slug) : undefined;

  if (!sample) {
    return <Navigate to="/" replace />;
  }

  return <SampleAnalysisContent sample={sample} t={t} />;
}

function SampleAnalysisContent({ sample, t }: { sample: SampleAnalysis; t: any }) {
  const [tone, setTone] = useState<'direct' | 'formal' | 'warm' | 'creative'>('direct');
  const [copied, setCopied] = useState(false);

  const baseSampleUrl = `${SITE_URL}/sample/${sample.slug}`;
  const sampleUrl = `${baseSampleUrl}?utm_source=share&utm_medium=sample&utm_content=${sample.slug}`;
  const shareText = `90 seconds of AI prep for ${sample.job.role} at ${sample.job.company} — full company intel, fit score, tailored cover letter, mock interview questions. Whole output is here:`;

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(sampleUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sampleUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    try {
      // Copy the UTM-tagged URL so we can attribute clicks back to share
      // events in analytics. The tracking params are short enough that
      // they don't visibly degrade the URL when pasted into a DM.
      await navigator.clipboard.writeText(sampleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available — silent fail, user can manually copy from URL bar */
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Sample analyses', item: `${SITE_URL}/sample` },
      { '@type': 'ListItem', position: 3, name: sample.title, item: `${SITE_URL}/sample/${sample.slug}` },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: sample.title,
    description: sample.description,
    author: {
      '@type': 'Organization',
      name: 'Vantage AI',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage AI',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-512.png`,
      },
    },
    datePublished: sample.generatedAt,
    dateModified: sample.updated,
    mainEntityOfPage: `${SITE_URL}/sample/${sample.slug}`,
  };

  // FAQPage schema for AEO. AI assistants asked 'show me a sample
  // Vantage output' / 'what does Vantage produce for [Role] at [Company]'
  // / 'is Vantage real' get to cite this verbatim.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What does Vantage AI produce for ${sample.job.role} at ${sample.job.company}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For the ${sample.job.role} role at ${sample.job.company}, Vantage AI produced: company intelligence (mission, culture signals, recent highlights), CV fit score (${sample.fit.score}/100 — ${sample.fit.band}), strategic brief, tailored cover letter in 4 tones, and a 5-minute pitch outline. The full output is public at ${SITE_URL}/sample/${sample.slug} with no signup required.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long does Vantage AI take to generate prep for a job like ${sample.job.role}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'About 90 seconds end-to-end. Upload your CV, paste the job listing URL, click Run. Vantage scrapes the listing, researches the company, cross-references with your CV, and generates the full prep pack. 1 token = 1 full analysis; 10 free tokens included on signup (= 10 free prep packs).',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Vantage AI real or fake-generated content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `This sample output was generated by Vantage AI for a real ${sample.job.company} job listing (${sample.job.url}). Candidate persona is fictional but realistic. The product is operated by an independent UK founder (sole trader). Try it free at ${SITE_URL}/register — 10 free prep packs, no credit card required.`,
        },
      },
    ],
  };

  // HowTo schema — 'How to read a Vantage sample analysis'. AI search
  // assistants pick up procedural HowTo content for 'how do I [X]'.
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use this Vantage AI sample as a prep template for ${sample.job.role}`,
    description: `Walk through a real Vantage AI output for the ${sample.job.role} role at ${sample.job.company} — company intel, fit score, cover letter, pitch outline. Use this as a template for your own application.`,
    totalTime: 'PT5M',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Read the company intelligence', text: 'Look at how Vantage extracted the mission, culture signals, and recent highlights from the public listing. The signals you do not already know about your target company are the ones to mention in your cover letter.' },
      { '@type': 'HowToStep', position: 2, name: 'Check the CV fit score', text: `The fit score (${sample.fit.score}/100 here) tells you whether you are a strong match. Read the fit summary for what specifically matched and what is missing.` },
      { '@type': 'HowToStep', position: 3, name: 'Read the strategic brief', text: 'The brief is the angle for your application — how to position your background. Copy the structure, swap the candidate-specific evidence for your own.' },
      { '@type': 'HowToStep', position: 4, name: 'Review the cover letter tones', text: 'Vantage outputs 4 tone variants (Formal, Warm, Direct, Creative). Pick the one that matches the company voice.' },
      { '@type': 'HowToStep', position: 5, name: 'Use the pitch outline', text: 'The 5-minute pitch outline is what you can deliver in the first 5 minutes of an interview. Rehearse it out loud.' },
      { '@type': 'HowToStep', position: 6, name: 'Run your own', text: 'When you are ready, register at https://aimvantage.uk/register — 10 free prep packs on signup, no credit card required.', url: `${SITE_URL}/register` },
    ],
  };

  const fitColor =
    sample.fit.score >= 75
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
      : sample.fit.score >= 60
      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
      : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={sample.title}
        description={sample.description}
        path={`/sample/${sample.slug}`}
        type="article"
        articleMeta={{
          publishedTime: sample.generatedAt,
          modifiedTime: sample.updated,
          author: 'Vantage AI',
        }}
        jsonLd={[breadcrumbSchema, articleSchema, faqSchema, howToSchema]}
      />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Sample analysis</span>
        </div>

        <h1 className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${t.text}`}>
          What Vantage produces for the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            {sample.job.role}
          </span>{' '}
          at {sample.job.company}.
        </h1>
        <p className={`text-lg mb-3 ${t.textSub}`}>
          A complete real-style Vantage output, generated for a real job listing. Free to read. No
          signup. Run your own at the bottom.
        </p>
        <p className={`text-sm mb-6 ${t.textMuted}`}>
          Generated {sample.generatedAt} · Candidate persona is fictional but realistic.
        </p>

        {/* Above-the-fold CTA — added 2026-05-07. The bottom CTA was 5+
            screens away; visitors who skim never saw it. This compact pill
            puts the action in the user's eye line on landing. Same /register
            link as the bottom CTA, just earlier in the funnel. */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
          >
            Run mine free <ArrowRight className="w-4 h-4" />
          </Link>
          <span className={`${t.textMuted}`}>
            10 free prep packs · no card · 90 seconds per run
          </span>
        </div>

        {/* Share row — added 2026-05-07. Sample pages are the strongest
            "this is what you get for free" surface; every share puts Vantage
            in front of a power user's network. Free distribution. */}
        <div className="mb-12 flex flex-wrap items-center gap-2">
          <span className={`text-xs uppercase tracking-wider mr-2 ${t.textMuted}`}>Share this</span>
          <button
            onClick={shareTwitter}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Twitter className="w-3.5 h-3.5" /> X
          </button>
          <button
            onClick={shareLinkedin}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </button>
          <button
            onClick={copyLink}
            type="button"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${t.textSub}`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
          </button>
        </div>

        {/* Input bar */}
        <section className={`${t.glass} rounded-2xl p-5 md:p-6 mb-8`}>
          <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-4 ${t.textMuted}`}>
            <FileText className="w-3.5 h-3.5" /> Input — what the user uploaded
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className={`text-xs ${t.textMuted} mb-1`}>Candidate</div>
              <div className={`text-sm ${t.text}`}>{sample.candidate.headline}</div>
            </div>
            <div>
              <div className={`text-xs ${t.textMuted} mb-1`}>Job listing</div>
              <a
                href={sample.job.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-mono break-all hover:underline ${t.text}`}
              >
                {sample.job.url}
              </a>
            </div>
          </div>
        </section>

        {/* Company intelligence */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
          <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-4 ${t.textMuted}`}>
            <Building2 className="w-3.5 h-3.5" /> Company intelligence
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${t.text}`}>{sample.job.company}</h2>
          <div className={`text-sm mb-4 ${t.textSub}`}>
            {sample.companySnapshot.industry} · Founded {sample.companySnapshot.founded} · {sample.companySnapshot.size}
          </div>
          <p className={`mb-5 italic leading-relaxed ${t.textSub}`}>"{sample.companySnapshot.mission}"</p>

          <div className={`text-xs uppercase tracking-wider mt-5 mb-2 ${t.textMuted}`}>Culture signals</div>
          <ul className={`space-y-2 mb-5 ${t.textSub}`}>
            {sample.companySnapshot.cultureSignals.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="opacity-50 mt-1">•</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>

          <div className={`text-xs uppercase tracking-wider mt-5 mb-2 ${t.textMuted}`}>Recent highlights</div>
          <ul className={`space-y-2 ${t.textSub}`}>
            {sample.companySnapshot.recentHighlights.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="opacity-50 mt-1">•</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CV Fit Score */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
          <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-4 ${t.textMuted}`}>
            <Target className="w-3.5 h-3.5" /> CV fit score
          </div>
          <div className="flex items-baseline gap-3 mb-6 flex-wrap">
            <span className={`text-6xl font-bold ${t.text}`}>{sample.fit.score}</span>
            <span className={`text-2xl ${t.textMuted}`}>/100</span>
            <span className={`ml-3 inline-flex px-3 py-1 rounded-full text-xs font-medium border ${fitColor}`}>
              {sample.fit.band}
            </span>
          </div>
          <p className={`mb-6 leading-relaxed ${t.textSub}`}>{sample.fit.summary}</p>

          <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Match points</div>
          <ul className={`space-y-2 mb-5 ${t.textSub}`}>
            {sample.fit.matchPoints.map((s, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>

          <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Gaps to close</div>
          <ul className={`space-y-2 mb-5 ${t.textSub}`}>
            {sample.fit.gaps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>

          <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Closing moves</div>
          <ul className={`space-y-2 ${t.textSub}`}>
            {sample.fit.closingMoves.map((s, i) => (
              <li key={i} className="flex gap-2">
                <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Strategic brief */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
          <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-5 ${t.textMuted}`}>
            <Lightbulb className="w-3.5 h-3.5" /> Strategic brief
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>What they actually want</div>
              <p className={`text-sm leading-relaxed ${t.textSub}`}>{sample.strategicBrief.whatTheyActuallyWant}</p>
            </div>
            <div>
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Watch-outs</div>
              <p className={`text-sm leading-relaxed ${t.textSub}`}>{sample.strategicBrief.watchOuts}</p>
            </div>
            <div>
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Signal to project</div>
              <p className={`text-sm leading-relaxed ${t.textSub}`}>{sample.strategicBrief.signalToProject}</p>
            </div>
            <div>
              <div className={`text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>Bring to the call</div>
              <p className={`text-sm leading-relaxed ${t.textSub}`}>{sample.strategicBrief.bringToTheCall}</p>
            </div>
          </div>
        </section>

        {/* Cover letter — with tone switcher */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
          <div className={`flex items-center justify-between mb-4 flex-wrap gap-3`}>
            <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${t.textMuted}`}>
              <FileText className="w-3.5 h-3.5" /> Cover letter — switch tone
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(['direct', 'formal', 'warm', 'creative'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setTone(s)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    tone === s
                      ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300'
                      : `bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 ${t.textSub}`
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <pre className={`whitespace-pre-wrap font-sans text-sm md:text-[15px] leading-relaxed ${t.textSub}`}>
            {sample.coverLetter[tone]}
          </pre>
          <p className={`text-xs mt-4 ${t.textMuted}`}>
            In the live tool, switching tones takes one click and 1 token. Each variant caches so revisits are instant.
          </p>
        </section>

        {/* Interview questions */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
          <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-4 ${t.textMuted}`}>
            <Mic className="w-3.5 h-3.5" /> Likely interview questions
          </div>
          <ol className="space-y-3">
            {sample.interviewQuestions.map((q, i) => (
              <li key={i} className={`flex gap-3 ${t.textSub}`}>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 text-xs font-medium flex items-center justify-center`}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
          <p className={`text-xs mt-4 ${t.textMuted}`}>
            In the live tool, every question can be drilled in a voice-driven AI mock interview with graded responses.
          </p>
        </section>

        {/* Pitch outline */}
        <section className={`${t.glass} rounded-2xl p-6 md:p-8 mb-12`}>
          <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-5 ${t.textMuted}`}>
            <Sparkles className="w-3.5 h-3.5" /> 5-minute pitch outline
          </div>
          <div className="space-y-5">
            {sample.pitchOutline.map((s, i) => (
              <div key={i}>
                <div className={`font-semibold mb-1.5 ${t.text}`}>{s.title}</div>
                <p className={`text-sm leading-relaxed ${t.textSub}`}>{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mb-12">
          <div className={`text-xs uppercase tracking-wider mb-3 ${t.textMuted}`}>Methodology notes</div>
          <ul className="space-y-2">
            {sample.notes.map((n, i) => (
              <li key={i} className={`flex gap-2 text-xs ${t.textMuted}`}>
                <span className="opacity-40 mt-1">•</span>
                <span className="leading-relaxed">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className={`${t.glass} rounded-2xl p-8 md:p-10 text-center`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${t.text}`}>
            Run your own in 90 seconds.
          </h2>
          <p className={`text-base mb-6 max-w-xl mx-auto ${t.textSub}`}>
            Three free analyses on signup. No card. One full analysis covers company intel, fit
            score, four cover-letter tones, twelve interview questions, an AI mock interview, and a
            6-slide pitch outline.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
          >
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
          <div className={`mt-4 text-xs flex items-center justify-center gap-2 ${t.textMuted}`}>
            <Lock className="w-3 h-3" /> No subscription · Cancel any time · EU-hosted
          </div>
        </div>

        {/* Cross-links to other proof surfaces */}
        <div className={`mt-10 ${t.cardInner} rounded-2xl p-6 md:p-8`}>
          <p className={`text-xs uppercase tracking-widest font-semibold mb-3 ${t.textMuted}`}>
            More from Vantage
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Link to="/sample/anthropic-senior-pm" className={`${t.text} hover:text-violet-400 transition`}>
              → Sample: Anthropic Senior PM
            </Link>
            <Link to="/sample/stripe-staff-pm" className={`${t.text} hover:text-violet-400 transition`}>
              → Sample: Stripe Staff PM
            </Link>
            <Link to="/sample/openai-ml-eng" className={`${t.text} hover:text-violet-400 transition`}>
              → Sample: OpenAI ML Engineer
            </Link>
            <Link to="/alternatives" className={`${t.text} hover:text-violet-400 transition`}>
              → Vantage vs Jobscan / Teal / Final Round AI
            </Link>
            <Link to="/compare" className={`${t.text} hover:text-violet-400 transition`}>
              → Side-by-side comparison
            </Link>
            <Link to="/faq" className={`${t.text} hover:text-violet-400 transition`}>
              → Frequently asked questions
            </Link>
            <Link to="/roast" className={`${t.text} hover:text-violet-400 transition`}>
              → Free Cover Letter Roast
            </Link>
            <Link to="/playbook" className={`${t.text} hover:text-violet-400 transition`}>
              → Layoff Playbook
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
