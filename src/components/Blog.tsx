import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Star, X, Rss } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { blogPosts } from '../data/blogPosts';

// Companies that have a deep-dive interview guide. Order = display order
// in the filter pill row. Tag name must match the post tags array exactly.
const COMPANY_FILTERS = [
  'Stripe',
  'Anthropic',
  'OpenAI',
  'DeepMind',
  'Cloudflare',
  'Datadog',
  'Notion',
  'Figma',
  'Spotify',
  'Revolut',
  'GitLab',
  'Linear',
  'Vercel',
  'Klarna',
  'Canva',
  'Airtable',
  'Monzo',
  'Wise',
  'Octopus Energy',
  'Apple',
  'Microsoft',
  'Amazon',
  'Snowflake',
  'Databricks',
  'Hugging Face',
  'Shopify',
  'Atlassian',
  'ServiceNow',
  'Cursor',
  'Replit',
  'Modal',
  'Mistral',
  'xAI',
  'Perplexity',
  'Google',
  'Meta',
  'Salesforce',
  'Tesla',
  'Netflix',
  'Coinbase',
  'Adobe',
  'Uber',
  'Booking.com',
  'IBM',
  'Reddit',
  'Plaid',
  'Goldman Sachs',
  'Jane Street',
  'Bloomberg',
  'Nvidia',
  'Arm',
  'TikTok',
  'Sentry',
  'Roblox',
  'Twilio',
  'Block',
  'Discord',
  'Pinterest',
  'DoorDash',
  'Workday',
  'Etsy',
  'Lyft',
  'Slack',
  'MongoDB',
] as const;

type CompanyFilter = typeof COMPANY_FILTERS[number];

export default function Blog() {
  const { t } = useTheme();
  const [activeCompany, setActiveCompany] = useState<CompanyFilter | null>(null);

  // Newest first
  const allPosts = useMemo(
    () => [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    []
  );

  const posts = useMemo(() => {
    if (!activeCompany) return allPosts;
    return allPosts.filter((p) => p.tags.includes(activeCompany));
  }, [allPosts, activeCompany]);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      {/* Nav */}
      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>
      </nav>

      {/* Header — no motion entrance (defensive vs tab-visibility throttling
          stuck-at-opacity bug pattern, fixed elsewhere today). */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
          The Vantage Blog
        </h1>
        <p className={`mt-3 text-lg ${t.textSub} max-w-2xl`}>
          Guides on AI job application prep, interview strategy, ATS-friendly CVs, cover letters,
          and job fit analysis. Written by the team building Vantage, for the people using it.
        </p>

        {/* Above-the-fold CTA — added 2026-05-07 (same pattern as
            /sample, /blog/:slug, /faq, /interview-prep/:company,
            /interview-questions/:role). Blog index gets organic traffic
            from broad queries; visitors who skim post titles need a
            direct path to /register. */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
          >
            Run mine free <ArrowRight className="w-4 h-4" />
          </Link>
          <span className={`${t.textMuted}`}>
            10 free prep packs · no card · 90 seconds per run
          </span>
        </div>

        {/* Flagship report callout — added 2026-05-10. /blog visitors
            arriving from a single specific search query are unlikely to
            scroll all 34 post cards. Surface the aggregation report as
            a one-line callout so they have a "synthesis" path. */}
        <div className={`mt-5 ${t.cardInner} rounded-xl p-4 border-l-4 border-violet-500`}>
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-1">
            New · Flagship report
          </p>
          <Link
            to="/state-of-2026"
            className={`text-base font-semibold ${t.text} hover:text-violet-500 transition inline-flex items-center gap-1.5`}
          >
            The State of 2026 Tech Interview Hiring &mdash; data from 34 deep-dives
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className={`mt-1 text-sm ${t.textSub}`}>
            5 findings. What changed between 2024 and 2026. Implications for prep. Free to cite.
          </p>
        </div>

        {/* Subscribe row — added 2026-05-10. The audience for these
            interview-prep posts skews tech-employed, AI-adjacent, and
            still uses RSS readers (Reeder, NetNewsWire, Feedbin). The
            feeds are already generated by scripts/generate-feeds.mjs
            but the /blog header never surfaced them. Adding small
            subscribe links here lets engaged readers follow new posts
            without an email-list ask -- friction Gio doesn't want. */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
          <span className={`${t.textMuted} font-semibold uppercase tracking-widest`}>
            Subscribe
          </span>
          <a
            href="/rss.xml"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${t.inputBorder} ${t.textSub} hover:opacity-80 transition`}
          >
            <Rss className="w-3 h-3" aria-hidden="true" /> RSS
          </a>
          <a
            href="/atom.xml"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${t.inputBorder} ${t.textSub} hover:opacity-80 transition`}
          >
            <Rss className="w-3 h-3" aria-hidden="true" /> Atom
          </a>
          <a
            href="/feed.json"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${t.inputBorder} ${t.textSub} hover:opacity-80 transition`}
          >
            <Rss className="w-3 h-3" aria-hidden="true" /> JSON Feed
          </a>
        </div>
      </header>

      {/* Company filter — added 2026-05-10. 10 long-tail interview-guide
          posts ship simultaneously; visitors arriving from "<company>
          interview" Google searches need a 1-click way to jump to their
          target company's guide. Pill row, not a dropdown — pills are
          higher signal in topic-cluster SEO and AEO surfaces. */}
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 pb-2"
        aria-labelledby="blog-company-filter-heading"
      >
        <h2 id="blog-company-filter-heading" className="sr-only">
          Filter by company
        </h2>
        <div
          role="toolbar"
          aria-label="Filter posts by company interview guide"
          className="flex flex-wrap items-center gap-2"
        >
          <span
            className={`text-xs font-medium uppercase tracking-wide ${t.textMuted} mr-1`}
            aria-hidden="true"
          >
            Jump to:
          </span>
          {COMPANY_FILTERS.map((company) => {
            const active = activeCompany === company;
            return (
              <button
                key={company}
                type="button"
                onClick={() => setActiveCompany(active ? null : company)}
                aria-pressed={active}
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  active
                    ? 'bg-violet-600 text-white border-violet-600'
                    : `${t.cardInner} ${t.textSub} border-transparent hover:border-violet-400/50`
                }`}
              >
                {company}
              </button>
            );
          })}
          {activeCompany && (
            <button
              type="button"
              onClick={() => setActiveCompany(null)}
              className={`inline-flex items-center gap-1 text-xs sm:text-sm px-3 py-1.5 rounded-full ${t.textSub} hover:opacity-80 underline-offset-2 hover:underline`}
              aria-label="Clear company filter"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
        <p
          className={`mt-3 text-sm ${t.textMuted}`}
          aria-live="polite"
        >
          {activeCompany
            ? `Showing ${posts.length} ${posts.length === 1 ? 'post' : 'posts'} tagged ${activeCompany}.`
            : `Showing all ${allPosts.length} posts. Filter by company for a direct interview guide.`}
        </p>
      </section>

      {/* Posts */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {posts.length === 0 ? (
          <div className={`${t.glass} rounded-2xl p-8 text-center`}>
            <p className={`${t.text} font-semibold`}>
              No posts yet for {activeCompany}.
            </p>
            <p className={`mt-2 ${t.textSub}`}>
              We're still writing this one. In the meantime, run your CV against the live job link
              for a 90-second tailored prep pack.
            </p>
            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              Run mine free <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setActiveCompany(null)}
              className={`mt-4 block mx-auto text-sm ${t.textSub} underline-offset-2 hover:underline`}
            >
              Show all posts
            </button>
          </div>
        ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="block group">
                <motion.article
                  whileHover={{ y: -2 }}
                  className={`${t.glass} rounded-2xl overflow-hidden transition`}
                >
                  <div className="p-6 sm:p-8">
                    <div className={`flex flex-wrap items-center gap-3 text-xs ${t.textMuted} mb-3`}>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime}
                      </span>
                      <span>·</span>
                      <span>{post.author}</span>
                    </div>
                    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} group-hover:text-violet-500 transition`}>
                      {post.title}
                    </h2>
                    <p className={`mt-3 ${t.textSub}`}>{post.excerpt}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-full ${t.cardInner} ${t.textSub}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-500`}>
                      Read the post <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            </li>
          ))}
        </ul>
        )}

        {/* CTA */}
        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>
            Stop prepping job applications by hand.
          </h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            One upload. One job link. Full prep pack in about 90 seconds — company intel, cover
            letter, mock interview questions, CV fit score.
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
