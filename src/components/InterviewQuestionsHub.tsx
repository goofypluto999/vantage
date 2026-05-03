import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { rolePacks } from '../data/interviewQuestions';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * Hub page (pillar) at /interview-questions — links out to every role pack.
 * Internal links from this page to all spokes is the topical cluster pattern.
 */
export default function InterviewQuestionsHub() {
  const { t } = useTheme();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Interview Questions by Role',
    numberOfItems: rolePacks.length,
    itemListElement: rolePacks.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/interview-questions/${r.slug}`,
      name: `${r.role} Interview Questions`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Interview Questions', item: `${SITE_URL}/interview-questions` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Interview Questions by Role — 2026 Prep Packs"
        description="Role-specific interview question packs for software engineers, product managers, data scientists, designers, marketers, and more. 12 most-asked questions, prep routine, and common mistakes."
        path="/interview-questions"
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
            Interview Questions by Role
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Pick your role. Get the 12 most-asked questions, the 5-step prep routine, and the
            mistakes that bin candidates. Updated for 2026 hiring.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolePacks.map((r) => (
            <Link
              key={r.slug}
              to={`/interview-questions/${r.slug}`}
              className={`${t.glass} rounded-xl p-5 block hover:-translate-y-0.5 transition`}
            >
              <h3 className={`font-bold ${t.text}`}>{r.role}</h3>
              <p className={`mt-2 text-sm ${t.textSub} line-clamp-3`}>{r.intro}</p>
              <span className={`mt-3 inline-flex items-center gap-1 text-xs ${t.textMuted}`}>
                Read prep pack <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Get a personalised prep pack instead</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Generic question lists are a starting point. Vantage takes your CV and the actual job
            link and gives you the questions, the gaps, the cover letter, and a mock interview —
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
