import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, FileText, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { pressReleases, getPressReleaseBySlug, type PressRelease } from '../data/pressReleases';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /press-releases — hub of all published press releases.
 * /press-releases/[slug] — individual release with NewsArticle JSON-LD.
 *
 * Each release becomes a permanent link-equity surface that journalists,
 * AI search assistants, and aggregators can link to. NewsArticle schema
 * makes them eligible for Google News surfacing.
 *
 * Adding a new release: append an entry to src/data/pressReleases.ts and
 * the route picks it up automatically. Sitemap is regenerated on build.
 */

// ---------------------------------------------------------- Hub page ---

export function PressReleasesHub() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Press releases', item: `${SITE_URL}/press-releases` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vantage AI press releases',
    itemListElement: pressReleases.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/press-releases/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Press releases — Vantage AI"
        description="Official Vantage AI press releases. Product launches, milestones, and announcements from Giovanni Sizino Ennes (UK independent founder, sole trader)."
        path="/press-releases"
        jsonLd={[breadcrumbSchema, itemListSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try Vantage free
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="mb-10">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            For journalists and aggregators
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            Press releases
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl`}>
            Every published announcement from Vantage AI. Each release lists verifiable facts at the bottom — feel free to
            cite, syndicate, or fact-check directly. Operator transparency at <Link to="/about" className="text-violet-400 underline">/about</Link>.
          </p>
        </header>

        {pressReleases.length === 0 ? (
          <p className={`text-sm ${t.textMuted}`}>No releases published yet.</p>
        ) : (
          <div className="space-y-4">
            {pressReleases.map((p) => (
              <Link
                key={p.slug}
                to={`/press-releases/${p.slug}`}
                className={`${t.glass} rounded-2xl p-6 block hover:border-violet-400/40 transition group`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className={`flex items-center gap-2 text-xs ${t.textMuted} mb-2`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                    </div>
                    <h2 className={`text-lg font-bold ${t.text} group-hover:text-violet-500 transition leading-snug`}>
                      {p.title}
                    </h2>
                    <p className={`mt-2 text-sm ${t.textSub} line-clamp-2`}>{p.subheadline}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`text-[11px] px-2 py-0.5 rounded-full ${t.cardInner} ${t.textMuted}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <section className={`mt-12 ${t.cardInner} rounded-2xl p-6`}>
          <h3 className={`text-base font-bold ${t.text} mb-2 flex items-center gap-2`}>
            <FileText className="w-4 h-4 text-violet-400" /> Press contact
          </h3>
          <p className={`text-sm ${t.textSub} leading-relaxed`}>
            Direct line to the founder:{' '}
            <a
              href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
              className="text-violet-400 underline hover:text-violet-300"
            >
              giovanni.sizino.ennes@hotmail.co.uk
            </a>
            . Full press kit at <Link to="/press" className="text-violet-400 underline">/press</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------- Detail page ---

export default function PressReleasePage() {
  const { t } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const release = slug ? getPressReleaseBySlug(slug) : undefined;

  if (!release) {
    return <Navigate to="/press-releases" replace />;
  }

  const url = `${SITE_URL}/press-releases/${release.slug}`;

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: release.title,
    description: release.description,
    datePublished: release.publishedAt,
    dateModified: release.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino Ennes',
      url: `${SITE_URL}/about`,
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}/og-image.png`,
    articleSection: 'Press',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Press releases', item: `${SITE_URL}/press-releases` },
      { '@type': 'ListItem', position: 3, name: release.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={`${release.title} — Vantage AI press release`}
        description={release.description}
        path={`/press-releases/${release.slug}`}
        jsonLd={[newsArticleSchema, breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try Vantage free
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <Link
          to="/press-releases"
          className={`inline-flex items-center gap-2 text-sm ${t.textMuted} mb-6 hover:text-violet-400`}
        >
          <ArrowLeft className="w-4 h-4" /> All press releases
        </Link>

        <article>
          <header className="mb-8">
            <p className={`text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
              {release.dateline}
            </p>
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${t.text} leading-tight`}>
              {release.title}
            </h1>
            <p className={`mt-4 text-lg ${t.textSub} leading-relaxed`}>{release.subheadline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {release.tags.map((tag) => (
                <span key={tag} className={`text-[11px] px-2 py-0.5 rounded-full ${t.cardInner} ${t.textMuted}`}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className={`${t.glass} rounded-2xl p-6 sm:p-8 space-y-4`}>
            {release.body.map((section, i) => {
              switch (section.type) {
                case 'h2':
                  return (
                    <h2 key={i} className={`text-xl font-bold ${t.text} pt-3`}>
                      {section.text}
                    </h2>
                  );
                case 'p':
                  return (
                    <p key={i} className={`text-sm ${t.textSub} leading-relaxed`}>
                      {section.text}
                    </p>
                  );
                case 'ul':
                  return (
                    <ul key={i} className={`text-sm ${t.textSub} space-y-2 list-disc list-inside`}>
                      {section.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  );
                case 'quote':
                  return (
                    <blockquote
                      key={i}
                      className="border-l-4 border-violet-400/60 pl-4 py-2 italic"
                    >
                      <p className={`text-sm ${t.text}`}>"{section.text}"</p>
                      <footer className={`mt-2 text-xs ${t.textMuted} not-italic`}>— {section.cite}</footer>
                    </blockquote>
                  );
                case 'callout':
                  return (
                    <aside
                      key={i}
                      className={`rounded-xl p-4 ${t.cardInner} border-l-4 border-emerald-400/50`}
                    >
                      <p className={`text-sm ${t.text}`}>{section.text}</p>
                    </aside>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* Verifiable facts */}
          <section className={`mt-8 ${t.cardInner} rounded-2xl p-6`}>
            <h3 className={`text-base font-bold ${t.text} mb-3 flex items-center gap-2`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verifiable facts (for fact-checkers)
            </h3>
            <ul className="space-y-2">
              {release.factCheck.map((f) => (
                <li key={f.fact} className="text-xs leading-relaxed">
                  <span className={t.textSub}>{f.fact} — </span>
                  <a
                    href={f.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 underline hover:text-violet-300 inline-flex items-center gap-1"
                  >
                    source <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className={`mt-8 ${t.glass} rounded-2xl p-6 text-center`}>
            <h3 className={`text-base font-bold ${t.text} mb-2`}>Want to cover this story?</h3>
            <p className={`text-sm ${t.textSub} mb-4`}>
              Direct line to the founder. No PR agency, no embargo, no flack.
            </p>
            <a
              href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
            >
              giovanni.sizino.ennes@hotmail.co.uk
            </a>
          </section>
        </article>
      </main>
    </div>
  );
}

// ---------------------------------------------------- helpers ---

function formatDate(iso: string): string {
  // Stable, locale-independent format that matches the dateline style.
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Suppress unused-imports lint when minor types referenced from interface only
export type { PressRelease };
