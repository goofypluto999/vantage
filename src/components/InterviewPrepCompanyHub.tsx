import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { companyPacks } from '../data/companyPacks';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * Hub page at /interview-prep — pillar of the company-prep cluster.
 */
export default function InterviewPrepCompanyHub() {
  const { t } = useTheme();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Company-specific interview prep packs',
    numberOfItems: companyPacks.length,
    itemListElement: companyPacks.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/interview-prep/${c.slug}`,
      name: `${c.company} Interview Prep`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Interview Prep', item: `${SITE_URL}/interview-prep` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Company Interview Prep Packs — Google, Meta, Amazon, Stripe + more"
        description="Company-specific interview prep packs for the top tech, finance, and consulting employers. 12 most-asked questions per company, prep routine, common mistakes, FAQ. Updated for 2026."
        path="/interview-prep"
        jsonLd={[itemListSchema, breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try free
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            Interview Prep by Company
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Company-specific prep packs for the highest-volume employers in tech, finance, and
            consulting. 12 most-asked questions, the company-specific prep routine, common
            mistakes, and FAQ — all updated for 2026 hiring.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyPacks.map((c) => (
            <Link
              key={c.slug}
              to={`/interview-prep/${c.slug}`}
              className={`${t.glass} rounded-xl p-5 block hover:-translate-y-0.5 transition`}
            >
              <h3 className={`font-bold ${t.text}`}>{c.company}</h3>
              <p className={`mt-2 text-sm ${t.textSub} line-clamp-3`}>{c.intro}</p>
              <span className={`mt-3 inline-flex items-center gap-1 text-xs ${t.textMuted}`}>
                Read prep pack <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Want it personalised?</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Generic question lists are a starting point. Vantage takes your CV and the actual job
            link and generates the questions, the gaps, the cover letter, and a mock interview —
            in about 90 seconds.
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
