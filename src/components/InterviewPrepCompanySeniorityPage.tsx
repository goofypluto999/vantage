import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Building2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import {
  getCompanySeniorityVariant,
  companySeniorityPacks,
  type SenioritySlug,
} from '../data/companySeniorityPacks';
import { companyPacks } from '../data/companyPacks';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /interview-prep/[company]/[seniority] — depth tier on top of the
 * existing /interview-prep/[company] base pages.
 *
 * Schema: BreadcrumbList (4 levels) + FAQPage (3 Q+A) + Article.
 * Each cell has substantively unique content sourced from public
 * material so this is not a doorway-page concern.
 */
export default function InterviewPrepCompanySeniorityPage() {
  const { t } = useTheme();
  const { company, seniority } = useParams<{ company: string; seniority: string }>();

  if (!company || !seniority) return <Navigate to="/interview-prep" replace />;
  const found = getCompanySeniorityVariant(company, seniority);
  if (!found) return <Navigate to={`/interview-prep/${company}`} replace />;

  const { variant } = found;
  const companyData = companyPacks.find((c) => c.slug === company);
  const companyName = companyData?.company || company;
  const path = `/interview-prep/${company}/${seniority}`;

  // Find related cells: other seniorities at the same company + same
  // seniority at other companies (max 4 of each)
  const otherSeniorities =
    companySeniorityPacks
      .find((p) => p.companySlug === company)
      ?.variants.filter((v) => v.slug !== seniority) || [];
  const otherCompaniesAtSameSeniority = companySeniorityPacks
    .filter((p) => p.companySlug !== company)
    .map((p) => ({
      companySlug: p.companySlug,
      companyName: companyPacks.find((c) => c.slug === p.companySlug)?.company || p.companySlug,
      variant: p.variants.find((v) => v.slug === (seniority as SenioritySlug)),
    }))
    .filter((x) => x.variant)
    .slice(0, 4);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Interview Prep', item: `${SITE_URL}/interview-prep` },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${companyName} Interview`,
        item: `${SITE_URL}/interview-prep/${company}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: variant.label,
        item: `${SITE_URL}${path}`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What's different about ${companyName} ${variant.label} interviews vs. other levels?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: variant.levelRubric,
        },
      },
      {
        '@type': 'Question',
        name: `What's the comp range for ${companyName} ${variant.label}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Approximate compensation band: ${variant.compRange.usd} (US) / ${variant.compRange.gbp} (UK). ${variant.compRange.note || ''}. Total comp varies significantly by hub location and team. See /salary for role-level percentile data.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the most common reasons ${companyName} ${variant.label} candidates fail the loop?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The three most common gaps: ${variant.commonGaps.join(' / ')}.`,
        },
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${companyName} ${variant.titleSuffix}`,
    description: `Specific prep guide for ${companyName} ${variant.label} interviews — interview pattern, likely questions, level rubric, comp range, and common gaps.`,
    author: { '@type': 'Person', name: 'Gio' },
    datePublished: '2026-05-04',
    dateModified: '2026-05-04',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    image: `${SITE_URL}/og-image.png`,
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={`${companyName} ${variant.titleSuffix} — prep guide`}
        description={`How ${companyName} interviews ${variant.label}. Interview pattern, ${variant.likelyQuestions.length} likely questions, level rubric, comp range (${variant.compRange.usd} US / ${variant.compRange.gbp} UK), and common gaps. Sourced from public Levels.fyi data and company hiring blogs.`}
        path={path}
        type="article"
        jsonLd={[breadcrumbSchema, faqSchema, articleSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try Vantage free
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <Link
          to={`/interview-prep/${company}`}
          className={`inline-flex items-center gap-2 text-sm ${t.textMuted} hover:text-violet-400 mb-6 transition`}
        >
          <ArrowLeft className="w-4 h-4" /> All {companyName} interview prep
        </Link>

        <header className="mb-10">
          <div className={`flex items-center gap-2 mb-3 text-xs uppercase tracking-widest ${t.textMuted} font-semibold`}>
            <Building2 className="w-4 h-4" />
            <span>{companyName} · {variant.label} · {variant.yearsExp}</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            {companyName} {variant.titleSuffix}
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} leading-relaxed`}>
            How {companyName} interviews {variant.label} candidates in 2026 — pattern, questions, level rubric, comp band, and common gaps.
          </p>
        </header>

        <aside className={`mb-10 ${t.glass} rounded-2xl p-6 border-l-4 border-violet-500`}>
          <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            Level rubric
          </div>
          <p className={`${t.text} text-base leading-relaxed`}>{variant.levelRubric}</p>
        </aside>

        <section className="mb-10">
          <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Interview pattern</h2>
          <ul className="space-y-2">
            {variant.interviewPattern.map((item, i) => (
              <li
                key={i}
                className={`${t.cardInner} rounded-xl p-4 text-sm ${t.textSub} leading-relaxed flex gap-3`}
              >
                <span className="text-violet-400 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Likely questions</h2>
          <ol className="space-y-2">
            {variant.likelyQuestions.map((q, i) => (
              <li
                key={i}
                className={`${t.cardInner} rounded-xl p-4 text-sm ${t.text} leading-relaxed flex gap-3`}
              >
                <span className={`${t.textMuted} font-mono flex-shrink-0`}>{(i + 1).toString().padStart(2, '0')}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10 grid md:grid-cols-2 gap-5">
          <article className={`${t.glass} rounded-2xl p-6`}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className={`text-lg font-bold ${t.text}`}>Compensation band</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-baseline">
                <span className={t.textMuted}>UK</span>
                <span className={`font-mono ${t.text} font-semibold`}>{variant.compRange.gbp}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={t.textMuted}>US</span>
                <span className={`font-mono ${t.text} font-semibold`}>{variant.compRange.usd}</span>
              </div>
            </div>
            {variant.compRange.note && (
              <p className={`mt-3 pt-3 border-t border-white/5 text-xs ${t.textMuted} leading-relaxed`}>
                {variant.compRange.note}
              </p>
            )}
          </article>

          <article className={`${t.glass} rounded-2xl p-6 border-l-4 border-amber-500/40`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className={`text-lg font-bold ${t.text}`}>Common gaps</h2>
            </div>
            <ul className={`space-y-2 text-sm ${t.textSub}`}>
              {variant.commonGaps.map((gap, i) => (
                <li key={i} className="leading-relaxed flex gap-2">
                  <span className="text-amber-500 font-bold flex-shrink-0">!</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className={`mb-10 ${t.glass} rounded-2xl p-6 sm:p-8`}>
          <h2 className={`text-xl font-bold ${t.text} mb-3`}>Run a calibrated prep pack on your real CV</h2>
          <p className={`${t.textSub} leading-relaxed mb-4`}>
            Knowing the rubric is the easy part. Vantage analyses your CV against the actual {companyName}
            job posting and tells you which {variant.label}-band gaps to close before the loop. Pair it
            with the questions above for the full prep pass.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Run a free analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mb-10">
          <h2 className={`text-xl font-bold ${t.text} mb-4`}>Other {companyName} levels</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherSeniorities.map((other) => (
              <Link
                key={other.slug}
                to={`/interview-prep/${company}/${other.slug}`}
                className={`${t.cardInner} rounded-xl p-4 hover:border-violet-400/40 transition group`}
              >
                <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold mb-1`}>
                  {other.yearsExp}
                </div>
                <div className={`font-semibold ${t.text} group-hover:text-violet-500 transition`}>
                  → {other.label}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {otherCompaniesAtSameSeniority.length > 0 && (
          <section className="mb-10">
            <h2 className={`text-xl font-bold ${t.text} mb-4`}>
              {variant.label} at other companies
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {otherCompaniesAtSameSeniority.map((other) => (
                <Link
                  key={other.companySlug}
                  to={`/interview-prep/${other.companySlug}/${seniority}`}
                  className={`${t.cardInner} rounded-xl p-4 hover:border-violet-400/40 transition group`}
                >
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold mb-1`}>
                    {other.companyName}
                  </div>
                  <div className={`font-semibold ${t.text} group-hover:text-violet-500 transition`}>
                    → {other.variant!.label}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={`${t.cardInner} rounded-2xl p-5 text-xs ${t.textMuted} leading-relaxed`}>
          <p>
            <strong className={t.text}>About this guide.</strong> Sourced from public Levels.fyi level
            mappings and comp data, company engineering and hiring blogs, and public interview reports.
            We do not use proprietary or paywalled data. Compensation figures are 2024-2025 base
            adjusted conservatively for typical wage growth into 2026; total comp varies materially by
            hub location, team, and individual negotiation. See{' '}
            <Link to="/salary" className="text-violet-400 hover:underline">/salary</Link> for
            role-level percentile data.
          </p>
        </section>
      </main>
    </div>
  );
}
