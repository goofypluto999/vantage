import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { getSalaryProfile, formatCurrency, salaryProfiles } from '../data/salaryData';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /salary/:role — single role salary page.
 *
 * Schema: BreadcrumbList + Dataset (Google rich-results-eligible for
 * salary data) + FAQPage. Each profile is sourced — no fabricated
 * precision. Cross-links to /interview-questions/[slug] and
 * /interview-prep so traffic flows toward conversion pages.
 */
export default function SalaryPage() {
  const { t } = useTheme();
  const { role } = useParams<{ role: string }>();

  if (!role) return <Navigate to="/salary" replace />;
  const profile = getSalaryProfile(role);
  if (!profile) return <Navigate to="/salary" replace />;

  const path = `/salary/${profile.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Salary by role', item: `${SITE_URL}/salary` },
      { '@type': 'ListItem', position: 3, name: `${profile.role} salary`, item: `${SITE_URL}${path}` },
    ],
  };

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${profile.role} salary data 2026 — UK and US`,
    description: `Median, 25th, 75th, and 90th percentile compensation for ${profile.role} roles in the UK and US, sourced from public salary data.`,
    creator: {
      '@type': 'Organization',
      name: 'Vantage',
      url: SITE_URL,
    },
    distribution: [
      {
        '@type': 'DataDownload',
        contentUrl: `${SITE_URL}${path}`,
        encodingFormat: 'text/html',
      },
    ],
    spatialCoverage: ['United Kingdom', 'United States'],
    temporalCoverage: '2024/2026',
    keywords: [profile.role, 'salary', '2026', 'UK', 'US', 'compensation', 'median'].join(', '),
    citation: `${profile.uk.source}; ${profile.us.source}`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How accurate is this 2026 ${profile.role} salary data?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The UK figures are sourced from ${profile.uk.source} (${profile.uk.asOf}). The US figures are sourced from ${profile.us.source} (${profile.us.asOf}). We do not invent precision — every number on this page comes from a public source. Use the medians as a baseline, the percentiles to understand the band, and the role-specific factors to position yourself within the band.`,
        },
      },
      {
        '@type': 'Question',
        name: `Should I negotiate my ${profile.role} offer based on these numbers?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — but with three caveats. First, normalise to your specific company tier (FAANG, mid-tier tech, traditional industry). Second, factor in cost-of-living for cross-city comparisons. Third, the variable / equity components matter as much as base for senior+ roles. The median here is a starting reference, not a target.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where does this data come from?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `UK: ${profile.uk.source}. US: ${profile.us.source}. We adjusted 2024 source data conservatively for typical wage growth into 2026 where the official 2026 number was not yet published. Every source on this site is public — no paywalled or proprietary data.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={`${profile.role} salary 2026 — UK and US comparison`}
        description={`${profile.role} salary in the UK and US for 2026: median, 25th, 75th, and 90th percentile data plus the factors that move compensation. Sourced from ${profile.uk.source} and ${profile.us.source}.`}
        path={path}
        jsonLd={[breadcrumbSchema, datasetSchema, faqSchema]}
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
          to="/salary"
          className={`inline-flex items-center gap-2 text-sm ${t.textMuted} hover:text-violet-400 mb-6 transition`}
        >
          <ArrowLeft className="w-4 h-4" /> All salary pages
        </Link>

        <header className="mb-10">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Salary · 2026
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            {profile.role} salary in 2026
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} leading-relaxed`}>
            {profile.description}
          </p>
        </header>

        <section className="mb-10 grid md:grid-cols-2 gap-5">
          <article className={`${t.glass} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${t.text}`}>United Kingdom</h2>
              <span className={`text-xs ${t.textMuted}`}>GBP</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>Median (50th)</span>
                <span className={`font-mono text-2xl font-bold ${t.text}`}>
                  {formatCurrency(profile.uk.median, 'GBP')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>25th percentile</span>
                <span className={`font-mono text-base ${t.text}`}>
                  {formatCurrency(profile.uk.p25, 'GBP')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>75th percentile</span>
                <span className={`font-mono text-base ${t.text}`}>
                  {formatCurrency(profile.uk.p75, 'GBP')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>90th percentile</span>
                <span className={`font-mono text-base ${t.text}`}>
                  {formatCurrency(profile.uk.p90, 'GBP')}
                </span>
              </div>
            </div>
            <p className={`mt-4 pt-4 border-t border-white/5 text-xs ${t.textMuted} leading-relaxed`}>
              Source: {profile.uk.source}. {profile.uk.asOf}.
            </p>
          </article>

          <article className={`${t.glass} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${t.text}`}>United States</h2>
              <span className={`text-xs ${t.textMuted}`}>USD</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>Median (50th)</span>
                <span className={`font-mono text-2xl font-bold ${t.text}`}>
                  {formatCurrency(profile.us.median, 'USD')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>25th percentile</span>
                <span className={`font-mono text-base ${t.text}`}>
                  {formatCurrency(profile.us.p25, 'USD')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>75th percentile</span>
                <span className={`font-mono text-base ${t.text}`}>
                  {formatCurrency(profile.us.p75, 'USD')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${t.textSub}`}>90th percentile</span>
                <span className={`font-mono text-base ${t.text}`}>
                  {formatCurrency(profile.us.p90, 'USD')}
                </span>
              </div>
            </div>
            <p className={`mt-4 pt-4 border-t border-white/5 text-xs ${t.textMuted} leading-relaxed`}>
              Source: {profile.us.source}. {profile.us.asOf}.
            </p>
          </article>
        </section>

        <section className="mb-10">
          <h2 className={`text-2xl font-bold ${t.text} mb-4 flex items-center gap-2`}>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Factors that move {profile.role} salary
          </h2>
          <ul className="space-y-3">
            {profile.factors.map((factor, i) => (
              <li
                key={i}
                className={`${t.cardInner} rounded-xl p-4 text-sm ${t.textSub} leading-relaxed flex gap-3`}
              >
                <span className="text-violet-400 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className={`text-2xl font-bold ${t.text} mb-4 flex items-center gap-2`}>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Negotiation pitfalls specific to this role
          </h2>
          <ul className="space-y-3">
            {profile.pitfalls.map((pitfall, i) => (
              <li
                key={i}
                className={`${t.cardInner} rounded-xl p-4 text-sm ${t.textSub} leading-relaxed border-l-4 border-amber-500/40 flex gap-3`}
              >
                <span className="text-amber-500 font-bold flex-shrink-0">!</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`mb-10 ${t.glass} rounded-2xl p-6 sm:p-8`}>
          <h2 className={`text-xl font-bold ${t.text} mb-3`}>Use Vantage to position yourself within the band</h2>
          <p className={`${t.textSub} leading-relaxed mb-4`}>
            Knowing the median is the easy part. The harder question — which percentile of the band
            does your CV justify for the specific role you're applying for? Vantage analyses your CV
            against the actual job posting and tells you the gaps to close first. Pair it with the
            data above to walk in knowing exactly what to ask for.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Run a free CV analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mb-10">
          <h2 className={`text-xl font-bold ${t.text} mb-4`}>Related</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Link
              to={`/interview-questions/${profile.slug}`}
              className={`${t.cardInner} rounded-xl p-4 hover:border-violet-400/40 transition group`}
            >
              <div className={`font-semibold ${t.text} group-hover:text-violet-500 transition`}>
                → {profile.role} interview questions
              </div>
              <p className={`mt-1 text-xs ${t.textMuted}`}>
                12 most-asked questions, 5-step prep routine, common mistakes
              </p>
            </Link>
            <Link
              to="/interview-prep"
              className={`${t.cardInner} rounded-xl p-4 hover:border-violet-400/40 transition group`}
            >
              <div className={`font-semibold ${t.text} group-hover:text-violet-500 transition`}>
                → Interview prep by company
              </div>
              <p className={`mt-1 text-xs ${t.textMuted}`}>
                Google, Meta, Stripe, OpenAI, Anthropic and 15 more
              </p>
            </Link>
            {profile.relatedRoles.map((slug) => {
              const related = salaryProfiles.find((p) => p.slug === slug);
              if (!related) return null;
              return (
                <Link
                  key={slug}
                  to={`/salary/${slug}`}
                  className={`${t.cardInner} rounded-xl p-4 hover:border-violet-400/40 transition group`}
                >
                  <div className={`font-semibold ${t.text} group-hover:text-violet-500 transition`}>
                    → {related.role} salary
                  </div>
                  <p className={`mt-1 text-xs ${t.textMuted}`}>
                    UK median {formatCurrency(related.uk.median, 'GBP')} · US median{' '}
                    {formatCurrency(related.us.median, 'USD')}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className={`${t.cardInner} rounded-2xl p-5 text-xs ${t.textMuted} leading-relaxed`}>
          <p>
            <strong className={t.text}>About this data.</strong> All figures sourced from public
            salary data: ONS ASHE (UK official), BLS Occupational Employment Statistics (US official),
            ITJobsWatch (UK IT roles), Levels.fyi (US tech crowdsourced), and industry-specific
            compensation reports cited inline. Where 2026 official data was not yet published, we
            applied conservative wage-growth adjustments to 2024 source data and flagged the
            adjustment in the source note. We do not use paywalled or proprietary data.{' '}
            <a
              href="https://www.bls.gov/oes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              BLS OES <ExternalLink className="w-3 h-3" />
            </a>
            {' · '}
            <a
              href="https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              ONS ASHE <ExternalLink className="w-3 h-3" />
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
