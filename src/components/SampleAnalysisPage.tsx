import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, Building2, FileText, Lightbulb, Mic, Sparkles, Target, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { getSampleAnalysis, type SampleAnalysis } from '../data/sampleAnalyses';

const SITE_URL = 'https://vantage-livid.vercel.app';

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
        jsonLd={[breadcrumbSchema, articleSchema]}
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
        <p className={`text-sm mb-12 ${t.textMuted}`}>
          Generated {sample.generatedAt} · Candidate persona is fictional but realistic.
        </p>

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
      </div>
    </div>
  );
}
