import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getRolePack, rolePacks } from '../data/interviewQuestions';
import SEO from './SEO';

const SITE_URL = 'https://vantage-livid.vercel.app';

/**
 * Programmatic SEO landing page: /interview-questions/<role>
 *
 * Targets "[role] interview questions" + tail terms.
 * Bundles answers + FAQ + HowTo schema + breadcrumbs.
 * Each page is structurally identical so Google groups them as a content cluster.
 */
export default function InterviewQuestionsPage() {
  const { role } = useParams<{ role: string }>();
  const { t } = useTheme();

  if (!role) return <Navigate to="/interview-questions" replace />;
  const pack = getRolePack(role);
  if (!pack) return <Navigate to="/interview-questions" replace />;

  const path = `/interview-questions/${pack.slug}`;
  const title = `${pack.role} Interview Questions (2026 Prep Pack)`;
  const description = pack.tldr.length > 158 ? pack.tldr.slice(0, 155) + '…' : pack.tldr;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Interview Questions', item: `${SITE_URL}/interview-questions` },
      { '@type': 'ListItem', position: 3, name: pack.role, item: `${SITE_URL}${path}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pack.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to prep for a ${pack.role} interview in 2026`,
    description: pack.tldr,
    step: pack.prepSteps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text: step,
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Person', name: 'Vantage' },
    datePublished: pack.updated,
    dateModified: pack.updated,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    image: `${SITE_URL}/og-image.png`,
  };

  // Other roles for the "more prep packs" footer block (internal linking)
  const otherRoles = rolePacks.filter((r) => r.slug !== pack.slug).slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={title}
        description={description}
        path={path}
        type="article"
        articleMeta={{
          publishedTime: pack.updated,
          modifiedTime: pack.updated,
          author: 'Vantage',
          tags: [pack.role, 'Interview Questions', 'Job Search', 'Career'],
        }}
        jsonLd={[articleSchema, breadcrumbSchema, faqSchema, howToSchema]}
      />

      {/* Nav */}
      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link
            to="/blog"
            className={`inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            Blog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Breadcrumb */}
        <nav className={`text-xs ${t.textMuted} mb-4`} aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <span className="mx-2">/</span>
          <span>{pack.role}</span>
        </nav>

        {/* Header */}
        <header>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            {pack.role} Interview Questions (2026)
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>{pack.intro}</p>
        </header>

        {/* AEO TL;DR — direct answer block for AI crawlers */}
        <aside
          className={`mt-8 ${t.cardInner} rounded-2xl p-5 border-l-4 border-violet-500`}
          aria-label="Quick answer"
        >
          <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            Quick answer
          </div>
          <p className={`${t.text} text-base leading-relaxed`}>{pack.tldr}</p>
        </aside>

        {/* Questions */}
        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            12 most-asked {pack.role} interview questions
          </h2>
          <ol className={`space-y-3 ${t.textSub} leading-relaxed list-decimal pl-6`}>
            {pack.questions.map((q, i) => (
              <li key={i} className="pl-2">{q}</li>
            ))}
          </ol>
        </section>

        {/* Prep steps */}
        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            How to prep — the 5-step routine
          </h2>
          <ol className={`space-y-3 ${t.textSub} leading-relaxed list-decimal pl-6`}>
            {pack.prepSteps.map((step, i) => (
              <li key={i} className="pl-2">{step}</li>
            ))}
          </ol>
        </section>

        {/* Mistakes */}
        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            Common mistakes that bin candidates
          </h2>
          <ul className={`space-y-3 ${t.textSub} leading-relaxed list-disc pl-6`}>
            {pack.mistakes.map((m, i) => (
              <li key={i} className="pl-2">{m}</li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            FAQ
          </h2>
          <div className="space-y-4">
            {pack.faq.map((f, i) => (
              <details key={i} className={`${t.cardInner} rounded-xl p-4`}>
                <summary className={`font-semibold ${t.text} cursor-pointer`}>{f.q}</summary>
                <p className={`mt-2 ${t.textSub} leading-relaxed`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <Sparkles className="w-8 h-8 text-violet-500 mx-auto mb-2" />
          <h3 className={`text-2xl font-bold ${t.text}`}>
            Skip the manual prep. Get a personalised pack.
          </h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Upload your CV, paste the job link, and Vantage generates the company brief, your
            CV-to-role fit, the likely questions, and a mock interview — in about 90 seconds.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* More role packs (internal linking) */}
        <section className="mt-16">
          <h3 className={`text-sm uppercase tracking-widest ${t.textMuted} mb-4`}>
            More interview prep packs
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherRoles.map((r) => (
              <Link
                key={r.slug}
                to={`/interview-questions/${r.slug}`}
                className={`${t.cardInner} rounded-xl p-4 block hover:-translate-y-0.5 transition`}
              >
                <h4 className={`font-bold ${t.text}`}>{r.role} interview questions</h4>
                <p className={`mt-1 text-xs ${t.textMuted}`}>12 questions, prep routine, common mistakes.</p>
              </Link>
            ))}
          </div>
          <Link
            to="/blog"
            className={`mt-6 inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </section>
      </article>
    </div>
  );
}
