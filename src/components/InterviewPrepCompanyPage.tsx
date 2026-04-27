import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Sparkles, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCompanyPack, companyPacks } from '../data/companyPacks';
import SEO from './SEO';

const SITE_URL = 'https://vantage-livid.vercel.app';

/**
 * Programmatic SEO: /interview-prep/<company>
 * Targets "[company] interview questions" / "[company] interview prep" / etc.
 */
export default function InterviewPrepCompanyPage() {
  const { company: companySlug } = useParams<{ company: string }>();
  const { t } = useTheme();

  if (!companySlug) return <Navigate to="/interview-prep" replace />;
  const pack = getCompanyPack(companySlug);
  if (!pack) return <Navigate to="/interview-prep" replace />;

  const path = `/interview-prep/${pack.slug}`;
  const title = `${pack.company} Interview Questions & Prep (2026)`;
  const description = pack.tldr.length > 158 ? pack.tldr.slice(0, 155) + '…' : pack.tldr;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Interview Prep', item: `${SITE_URL}/interview-prep` },
      { '@type': 'ListItem', position: 3, name: pack.company, item: `${SITE_URL}${path}` },
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
    name: `How to prep for a ${pack.company} interview`,
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

  const otherCompanies = companyPacks.filter((c) => c.slug !== pack.slug).slice(0, 6);

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
          tags: [pack.company, 'Interview Questions', 'Job Search', 'Career'],
        }}
        jsonLd={[articleSchema, breadcrumbSchema, faqSchema, howToSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link
            to="/interview-prep"
            className={`inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            All companies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <nav className={`text-xs ${t.textMuted} mb-4`} aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/interview-prep" className="hover:underline">Interview Prep</Link>
          <span className="mx-2">/</span>
          <span>{pack.company}</span>
        </nav>

        <header>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            {pack.company} Interview Questions & Prep (2026)
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>{pack.intro}</p>
        </header>

        <aside
          className={`mt-8 ${t.cardInner} rounded-2xl p-5 border-l-4 border-violet-500`}
          aria-label="Quick answer"
        >
          <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            Quick answer
          </div>
          <p className={`${t.text} text-base leading-relaxed`}>{pack.tldr}</p>
        </aside>

        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            What makes a {pack.company} interview different
          </h2>
          <ul className={`space-y-3 ${t.textSub} leading-relaxed list-disc pl-6`}>
            {pack.signature.map((s, i) => (
              <li key={i} className="pl-2">{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            12 most-asked {pack.company} interview questions
          </h2>
          <ol className={`space-y-3 ${t.textSub} leading-relaxed list-decimal pl-6`}>
            {pack.questions.map((q, i) => (
              <li key={i} className="pl-2">{q}</li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            How to prep — the routine that works
          </h2>
          <ol className={`space-y-3 ${t.textSub} leading-relaxed list-decimal pl-6`}>
            {pack.prepSteps.map((step, i) => (
              <li key={i} className="pl-2">{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>
            Common mistakes that bin candidates at {pack.company}
          </h2>
          <ul className={`space-y-3 ${t.textSub} leading-relaxed list-disc pl-6`}>
            {pack.mistakes.map((m, i) => (
              <li key={i} className="pl-2">{m}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} mb-4`}>FAQ</h2>
          <div className="space-y-4">
            {pack.faq.map((f, i) => (
              <details key={i} className={`${t.cardInner} rounded-xl p-4`}>
                <summary className={`font-semibold ${t.text} cursor-pointer`}>{f.q}</summary>
                <p className={`mt-2 ${t.textSub} leading-relaxed`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Free tool callout */}
        <aside className={`mt-12 ${t.cardInner} rounded-2xl p-5 border-l-4 border-emerald-500`}>
          <div className={`text-xs uppercase tracking-widest font-bold text-emerald-500 mb-2`}>
            Before you apply
          </div>
          <p className={`${t.text} text-base leading-relaxed`}>
            Run your CV through{' '}
            <a
              href="https://cv-mirror-web.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-500 hover:underline font-semibold inline-flex items-center gap-1"
            >
              CV Mirror <ExternalLink className="w-3 h-3" />
            </a>
            {' '}— free, no signup. It simulates how 5 real ATS systems parse a CV. Fix
            parse issues before you apply to {pack.company}.
          </p>
        </aside>

        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <Sparkles className="w-8 h-8 text-violet-500 mx-auto mb-2" />
          <h3 className={`text-2xl font-bold ${t.text}`}>
            Want this prep tailored to a specific {pack.company} role?
          </h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Vantage takes your CV + a real {pack.company} job link and generates the
            company-specific prep, the cover letter, mock interview, fit score, and a
            5-minute pitch outline — all in 90 seconds.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <section className="mt-16">
          <h3 className={`text-sm uppercase tracking-widest ${t.textMuted} mb-4`}>
            More company prep packs
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherCompanies.map((c) => (
              <Link
                key={c.slug}
                to={`/interview-prep/${c.slug}`}
                className={`${t.cardInner} rounded-xl p-4 block hover:-translate-y-0.5 transition`}
              >
                <h4 className={`font-bold ${t.text}`}>{c.company} interview questions</h4>
                <p className={`mt-1 text-xs ${t.textMuted}`}>12 questions, prep routine, common mistakes.</p>
              </Link>
            ))}
          </div>
          <Link
            to="/interview-prep"
            className={`mt-6 inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            <ArrowLeft className="w-4 h-4" /> All companies
          </Link>
        </section>
      </article>
    </div>
  );
}
