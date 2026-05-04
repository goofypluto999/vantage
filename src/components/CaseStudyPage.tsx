import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { getCaseStudy, type CaseStudySection } from '../data/caseStudies';

const SITE_URL = 'https://aimvantage.uk';

function RenderSection({
  section,
  t,
}: {
  section: CaseStudySection;
  t: ReturnType<typeof useTheme>['t'];
}) {
  switch (section.type) {
    case 'h2':
      return <h2 className={`text-2xl sm:text-3xl font-bold ${t.text} mt-10 mb-3`}>{section.text}</h2>;
    case 'h3':
      return <h3 className={`text-xl font-bold ${t.text} mt-6 mb-2`}>{section.text}</h3>;
    case 'p':
      return <p className={`${t.textSub} leading-relaxed text-base sm:text-lg`}>{section.text}</p>;
    case 'ul':
      return (
        <ul className={`list-disc pl-6 space-y-2 ${t.textSub} text-base sm:text-lg`}>
          {section.items?.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol className={`list-decimal pl-6 space-y-2 ${t.textSub} text-base sm:text-lg`}>
          {section.items?.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className={`border-l-4 border-violet-500/40 pl-5 italic ${t.text} text-lg`}>
          {section.text}
          {section.cite && <footer className={`mt-2 text-sm ${t.textMuted} not-italic`}>— {section.cite}</footer>}
        </blockquote>
      );
    case 'callout':
      return (
        <aside className={`${t.cardInner} rounded-2xl p-5 border-l-4 border-violet-500 ${t.text}`}>
          {section.text}
        </aside>
      );
    case 'metric':
      return (
        <div className="grid sm:grid-cols-3 gap-3 my-6">
          {section.metrics?.map((m, i) => (
            <div key={i} className={`${t.cardInner} rounded-xl p-5 text-center`}>
              <div className={`text-3xl font-bold ${t.text} font-mono`}>{m.value}</div>
              <div className={`text-sm ${t.textSub} mt-1 font-semibold`}>{m.label}</div>
              {m.subtext && <div className={`text-xs ${t.textMuted} mt-1`}>{m.subtext}</div>}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function CaseStudyPage() {
  const { t } = useTheme();
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <Navigate to="/case-studies" replace />;
  const study = getCaseStudy(slug);
  if (!study) return <Navigate to="/case-studies" replace />;

  const path = `/case-studies/${study.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/case-studies` },
      { '@type': 'ListItem', position: 3, name: study.title, item: `${SITE_URL}${path}` },
    ],
  };

  // Only emit Article schema for live case studies. Coming-soon entries
  // get only the BreadcrumbList — claiming Article + datePublished for
  // an unwritten case study would be the same fake-schema trap we rejected.
  const articleSchema =
    study.status === 'live'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: study.title,
          description: study.subtitle,
          author: { '@type': 'Person', name: 'Gio' },
          datePublished: study.publishedAt,
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
          publisher: {
            '@type': 'Organization',
            name: 'Vantage',
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
          },
          image: `${SITE_URL}/og-image.png`,
        }
      : null;

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={study.title}
        description={study.subtitle}
        path={path}
        type="article"
        noindex={study.status === 'coming-soon'}
        jsonLd={articleSchema ? [breadcrumbSchema, articleSchema] : [breadcrumbSchema]}
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <Link
          to="/case-studies"
          className={`inline-flex items-center gap-2 text-sm ${t.textMuted} hover:text-violet-400 mb-6 transition`}
        >
          <ArrowLeft className="w-4 h-4" /> All case studies
        </Link>

        {study.status === 'coming-soon' && (
          <aside className={`mb-8 ${t.cardInner} rounded-2xl p-5 border-l-4 border-amber-500/60 flex items-start gap-3`}>
            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-semibold ${t.text}`}>Case study coming {study.expectedAt}</p>
              <p className={`mt-1 text-sm ${t.textSub} leading-relaxed`}>
                This URL is reserved for a real customer story. We do not publish
                fictional case studies — the page below describes the slot, not a
                fake outcome.
              </p>
            </div>
          </aside>
        )}

        <header className="mb-8">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Case study · {study.timeline}
          </span>
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            {study.title}
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} leading-relaxed`}>{study.subtitle}</p>

          <div className={`mt-6 grid sm:grid-cols-3 gap-3 text-sm`}>
            <div className={`${t.cardInner} rounded-xl p-4`}>
              <p className={`text-xs ${t.textMuted} mb-1`}>Persona</p>
              <p className={`${t.text} font-semibold`}>{study.persona.role}</p>
            </div>
            <div className={`${t.cardInner} rounded-xl p-4`}>
              <p className={`text-xs ${t.textMuted} mb-1`}>Industry</p>
              <p className={`${t.text} font-semibold`}>{study.persona.industry}</p>
            </div>
            <div className={`${t.cardInner} rounded-xl p-4`}>
              <p className={`text-xs ${t.textMuted} mb-1`}>Situation</p>
              <p className={`${t.text} font-semibold text-xs`}>{study.persona.situation}</p>
            </div>
          </div>
        </header>

        <aside className={`mb-10 ${t.glass} rounded-2xl p-6 border-l-4 border-violet-500`}>
          <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            Outcome
          </div>
          <p className={`${t.text} text-base leading-relaxed`}>{study.outcome}</p>
        </aside>

        <article className="space-y-5">
          {study.sections.map((section, i) => (
            <RenderSection key={i} section={section} t={t} />
          ))}
        </article>

        {study.status === 'live' && (
          <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
            <h3 className={`text-2xl font-bold ${t.text}`}>Want to be the next case study?</h3>
            <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
              Three free analyses on signup. No card. If Vantage helps you land
              a role, we'd love to feature your story (anonymised if needed).
            </p>
            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              Try Vantage free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {study.status === 'coming-soon' && (
          <div className={`mt-16 ${t.cardInner} rounded-2xl p-8 text-center`}>
            <h3 className={`text-xl font-bold ${t.text}`}>See live examples while this one is in progress</h3>
            <div className={`mt-4 grid sm:grid-cols-2 gap-3 max-w-lg mx-auto`}>
              <Link to="/sample/anthropic-senior-pm" className={`${t.glass} rounded-xl p-4 text-sm hover:border-violet-400/40 transition`}>
                <div className={`font-semibold ${t.text}`}>→ Anthropic Senior PM</div>
                <div className={`text-xs ${t.textMuted} mt-1`}>Sample analysis</div>
              </Link>
              <Link to="/sample/stripe-staff-pm" className={`${t.glass} rounded-xl p-4 text-sm hover:border-violet-400/40 transition`}>
                <div className={`font-semibold ${t.text}`}>→ Stripe Staff PM</div>
                <div className={`text-xs ${t.textMuted} mt-1`}>Sample analysis</div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
