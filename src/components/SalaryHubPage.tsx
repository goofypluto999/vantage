import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { salaryProfiles, formatCurrency } from '../data/salaryData';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /salary — hub page listing all 13 role salary profiles.
 *
 * Built for "[role] salary" SERP intent. Each card surfaces UK + US
 * median to make the page useful at a glance — searchers shouldn't have
 * to click into each role just to compare bands.
 */
export default function SalaryHubPage() {
  const { t } = useTheme();
  const path = '/salary';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Salary by role', item: `${SITE_URL}${path}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Salary data by role — UK and US, 2026',
    numberOfItems: salaryProfiles.length,
    itemListElement: salaryProfiles.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/salary/${p.slug}`,
      name: `${p.role} salary 2026`,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Salary by role — UK and US comparison data, 2026"
        description="Median, 25th, 75th, and 90th percentile salary data for 13 tech and business roles in the UK and US. Real public-source citations (BLS, ONS, ITJobsWatch, Levels.fyi). No paywalled data."
        path={path}
        jsonLd={[breadcrumbSchema, itemListSchema]}
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-12">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Salary data · 2026
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            Real salary data for 13 roles
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} max-w-2xl mx-auto leading-relaxed`}>
            UK and US compensation bands by role, sourced from public ONS, BLS, ITJobsWatch, and Levels.fyi data.
            No paywalls, no fabricated precision, every number cited.
          </p>
        </header>

        <section className={`mb-10 ${t.cardInner} rounded-2xl p-6 sm:p-8 border-l-4 border-emerald-500/60`}>
          <h2 className={`text-lg font-bold ${t.text} mb-2`}>How we sourced these numbers</h2>
          <p className={`text-sm ${t.textSub} leading-relaxed`}>
            UK figures combine ONS ASHE survey medians with ITJobsWatch
            percentile data for tech roles. US figures combine BLS
            Occupational Employment Statistics with Levels.fyi crowdsourced
            tech-hub compensation. Each role page lists the specific source
            and data year. We adjusted 2024 source data conservatively for
            typical 2-3% wage growth into 2026 and flagged any directional
            estimates explicitly.
          </p>
        </section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salaryProfiles.map((p) => (
            <Link
              key={p.slug}
              to={`/salary/${p.slug}`}
              className={`${t.glass} rounded-2xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Salary · 2026
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    {p.role}
                  </h3>
                </div>
                <TrendingUp className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className={`text-xs ${t.textMuted} mb-1`}>UK median</p>
                  <p className={`font-mono font-bold ${t.text}`}>
                    {formatCurrency(p.uk.median, p.uk.currency)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${t.textMuted} mb-1`}>US median</p>
                  <p className={`font-mono font-bold ${t.text}`}>
                    {formatCurrency(p.us.median, p.us.currency)}
                  </p>
                </div>
              </div>
              <div className={`mt-3 text-xs ${t.textMuted} flex items-center gap-1 group-hover:text-violet-400 transition`}>
                See full breakdown <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-16">
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Why role-specific salary matters</h2>
          <p className={`${t.textSub} leading-relaxed mb-3`}>
            "Software engineer" covers everything from a £30k entry-level role outside London to a $700k
            staff engineer at a US-headquartered AI lab. Median figures are useful as a baseline; they
            are not a target. The factors that move salary are role-specific.
          </p>
          <p className={`${t.textSub} leading-relaxed`}>
            Each role page lists the 4-5 factors that materially move compensation for that specific
            role, plus the 2-3 negotiation pitfalls common to the role. Use the page that matches
            your specific situation, not the role-name closest to it.
          </p>
        </section>

        <div className={`mt-12 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Going for a specific role?</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Vantage analyses your CV against the actual job posting and tells you the gaps to close
            before the interview. Paired with the salary data here, you walk in knowing exactly
            what you bring and what to ask for.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
