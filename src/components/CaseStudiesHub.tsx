import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { caseStudies } from '../data/caseStudies';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /case-studies — hub page listing all case studies, both live and
 * coming-soon. Honesty discipline: placeholders are clearly marked.
 */
export default function CaseStudiesHub() {
  const { t } = useTheme();
  const path = '/case-studies';

  const live = caseStudies.filter((c) => c.status === 'live');
  const upcoming = caseStudies.filter((c) => c.status === 'coming-soon');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}${path}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vantage case studies',
    numberOfItems: live.length, // only count live entries to avoid misleading Google
    itemListElement: live.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/case-studies/${c.slug}`,
      name: c.title,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Case studies — real Vantage usage stories"
        description="Real case studies from Vantage's launch. The founder's own dogfooding journey, plus customer stories as they happen. No fabricated case studies — placeholder URLs are clearly marked."
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-12">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Case studies · Real usage
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            How Vantage gets used
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} max-w-2xl mx-auto leading-relaxed`}>
            We do not publish fabricated case studies. Live entries below are real
            stories with verifiable details. Upcoming entries are URLs reserved for
            real customer stories — they say "coming soon" plainly until the story
            exists.
          </p>
        </header>

        {live.length > 0 && (
          <section className="mb-16">
            <h2 className={`text-xl font-bold ${t.text} mb-5 flex items-center gap-2`}>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Live case studies
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {live.map((c) => (
                <Link
                  key={c.slug}
                  to={`/case-studies/${c.slug}`}
                  className={`${t.glass} rounded-2xl p-6 hover:border-violet-400/40 transition group block`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                      {c.timeline}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                      Live
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold ${t.text} group-hover:text-violet-500 transition leading-tight`}>
                    {c.title}
                  </h3>
                  <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>{c.subtitle}</p>
                  <div className={`mt-4 pt-4 border-t border-white/5 text-xs ${t.textMuted}`}>
                    <span className={t.text}>{c.persona.role}</span> · {c.persona.industry}
                  </div>
                  <div className={`mt-3 flex items-center gap-1 text-xs ${t.textMuted} group-hover:text-violet-400 transition`}>
                    Read full story <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className={`text-xl font-bold ${t.text} mb-5 flex items-center gap-2`}>
              <Clock className="w-5 h-5 text-amber-500" /> Coming soon — URLs reserved for real stories
            </h2>
            <p className={`text-sm ${t.textSub} mb-5 leading-relaxed max-w-3xl`}>
              These slots are reserved for real customer case studies as they happen.
              We do not write fictional stories to fill the gap. In the meantime,
              the public <Link to="/sample/anthropic-senior-pm" className="text-violet-400 hover:underline">sample analyses</Link>{' '}
              show what a complete Vantage output looks like for real job postings.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {upcoming.map((c) => (
                <Link
                  key={c.slug}
                  to={`/case-studies/${c.slug}`}
                  className={`${t.cardInner} rounded-2xl p-5 hover:border-violet-400/40 transition group block opacity-80`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                      Expected {c.expectedAt}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold">
                      Coming soon
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} group-hover:text-violet-500 transition leading-tight`}>
                    {c.title}
                  </h3>
                  <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>{c.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className={`mt-12 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Want to be the next case study?</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            If Vantage helps you land a role and you're willing to share the story,
            we'd love to feature it (anonymised if needed). Three free analyses on
            signup, no card required.
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
