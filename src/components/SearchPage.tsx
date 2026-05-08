import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /search?q=... — landing target for the OpenSearch provider.
 *
 * No backend search index. Filters a hand-curated list of high-value
 * destination URLs by keyword overlap. The OpenSearch description's
 * Url template points here, so any browser that has Vantage installed
 * as a search provider lands the user on this page when they type a
 * query in the address bar.
 *
 * Why static / no backend: search-suggest endpoints + a real index
 * would be the next step (and require a serverless function with a
 * lightweight in-memory index). For now, the simpler win is making
 * /search?q work at all so the OpenSearch link tag isn't orphaned.
 */

interface Hit {
  title: string;
  url: string;
  description: string;
  tags: string[];
  type: 'tool' | 'sample' | 'guide' | 'product' | 'reference';
}

const HITS: Hit[] = [
  // Free tools
  { title: 'Cover Letter Roast', url: '/roast', description: 'Free AI roast of your cover letter. Quotes your worst lines, names the cliché, gives the better swap. 10 seconds.', tags: ['cover letter', 'roast', 'feedback', 'free', 'cliché'], type: 'tool' },
  { title: 'Why no interviews? 60-second diagnostic', url: '/tools/no-interviews-diagnostic', description: 'Free 5-question deterministic diagnostic. Routes you to one of 7 failure modes (ATS / positioning / targeting / proof / market / overqualified) with a concrete next move.', tags: ['no interviews', 'diagnostic', 'rejection', 'ats filter', 'job search'], type: 'tool' },
  { title: 'Decode Rejection Email', url: '/decode-rejection', description: 'Free AI translation of a rejection email. Tells you what the recruiter actually meant, plus the next move.', tags: ['rejection', 'email', 'recruiter', 'decode', 'free'], type: 'tool' },
  { title: 'Ghost Job Detector', url: '/ghost-job-check', description: 'Free AI score (0-100) on whether a job listing is a ghost job. Flags clichés, salary-band tells, vague deliverables.', tags: ['ghost job', 'fake job', 'detector', 'job listing', 'free'], type: 'tool' },
  { title: 'Job Tool Cost Calculator', url: '/tools/jobscan-cost-calculator', description: 'What a year of Jobscan, Resume Worded, Final Round AI, Teal, and LiveCareer would actually cost vs Vantage.', tags: ['jobscan', 'cost', 'calculator', 'comparison', 'price', 'vs'], type: 'tool' },
  { title: 'CV Mirror — Free ATS Scanner', url: 'https://cv-mirror-web.vercel.app/', description: 'Free, fully client-side ATS scanner. Shows you exactly how Workday, Greenhouse, Lever, Taleo, and iCIMS each parse your CV.', tags: ['ats', 'cv mirror', 'parser', 'workday', 'greenhouse', 'lever', 'free'], type: 'tool' },
  { title: 'All free tools', url: '/tools', description: 'Hub of every free tool we ship.', tags: ['tools', 'free'], type: 'tool' },

  // Product / pricing
  { title: 'Pricing', url: '/pricing', description: 'Starter £5 = 20 prep packs (one-time, never expires). Pro £12/mo = 60 prep packs/mo. Premium £20/mo = 120 prep packs/mo. 10 free on signup, no card.', tags: ['pricing', 'cost', 'plan', 'subscription', 'free'], type: 'product' },
  { title: 'Receipts (trust audit)', url: '/receipts', description: 'Single-page audit of every trust claim Vantage makes — Stripe-only billing, no auto-renew traps, no DM outreach, sole-trader operator transparency, EU hosting.', tags: ['trust', 'receipts', 'safe', 'legit', 'real'], type: 'reference' },
  { title: 'About the operator', url: '/about', description: 'Vantage AI is operated by Giovanni Sizino Ennes, a UK-based independent founder (sole trader). One person, build-in-public, full disclosure.', tags: ['about', 'operator', 'founder', 'gio', 'giovanni'], type: 'reference' },
  { title: 'FAQ', url: '/faq', description: 'Honest answers about what Vantage does, what it costs, how it handles your data.', tags: ['faq', 'help', 'questions'], type: 'reference' },
  { title: 'Changelog', url: '/changelog', description: 'Public release log including bug history. We do not retroactively edit history.', tags: ['changelog', 'release', 'updates', 'history'], type: 'reference' },

  // Cohort / vertical pages
  { title: 'Just laid off? 2026 layoff playbook', url: '/laid-off', description: 'April 2026 had ~42,000 tech workers newly job-hunting. Cohort-specific layoff playbook + free AI prep tools.', tags: ['laid off', 'layoff', 'redundant', 'fired', 'recovery'], type: 'guide' },
  { title: 'ATS Vendor Guide (Workday, Greenhouse, Lever, Taleo, iCIMS)', url: '/ats', description: 'How major ATS systems parse your CV — vendor by vendor breakdown.', tags: ['ats', 'workday', 'greenhouse', 'lever', 'taleo', 'icims', 'parser'], type: 'guide' },
  { title: 'Interview Prep by Company', url: '/interview-prep', description: 'Free interview-prep packs: Google, Meta, Amazon, Stripe, OpenAI, Anthropic, and 14 more.', tags: ['interview', 'prep', 'company', 'google', 'meta', 'amazon', 'stripe', 'openai', 'anthropic'], type: 'guide' },
  { title: 'Interview Questions by Role', url: '/interview-questions', description: 'Software Engineer, PM, Data Scientist, Frontend, DevOps, Marketing Manager, and more.', tags: ['interview', 'questions', 'role', 'engineer', 'pm', 'data', 'frontend', 'devops'], type: 'guide' },
  { title: 'Sample analyses', url: '/sample/anthropic-senior-pm', description: 'Read a complete real example output (no signup).', tags: ['sample', 'example', 'demo', 'anthropic', 'pm'], type: 'sample' },

  // Blog
  { title: 'Blog', url: '/blog', description: 'Long-form guides on AI job application prep, ATS-friendly CVs, cover letters, ghost jobs, interview strategy.', tags: ['blog', 'guides', 'articles'], type: 'guide' },
];

function score(query: string, hit: Hit): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const titleLower = hit.title.toLowerCase();
  const descLower = hit.description.toLowerCase();
  const tagsJoined = hit.tags.join(' ').toLowerCase();
  let s = 0;
  // Tokenize so multi-word queries get partial matches.
  const tokens = q.split(/\s+/).filter(Boolean);
  for (const tok of tokens) {
    if (titleLower.includes(tok)) s += 5;
    if (tagsJoined.includes(tok)) s += 3;
    if (descLower.includes(tok)) s += 1;
  }
  // Exact phrase bonus.
  if (titleLower.includes(q)) s += 10;
  return s;
}

export default function SearchPage() {
  const { t } = useTheme();
  const [params] = useSearchParams();
  const initial = params.get('q') || '';
  const source = params.get('source') || 'direct';
  const [query, setQuery] = useState(initial);

  // If the user came via OpenSearch, flag for analytics (no PII).
  useEffect(() => {
    try {
      if (source === 'opensearch' && typeof window !== 'undefined') {
        sessionStorage.setItem('vantage:source', 'opensearch');
      }
    } catch { /* ignore */ }
  }, [source]);

  const ranked = useMemo(() => {
    if (!query.trim()) return [] as Hit[];
    return HITS
      .map((h) => ({ h, s: score(query, h) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.h);
  }, [query]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Search', item: `${SITE_URL}/search` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={query ? `Search: ${query} | Vantage` : 'Search Vantage'}
        description="Search across Vantage's free tools, pricing, ATS guides, interview prep packs, and trust audit."
        path="/search"
        jsonLd={[breadcrumbSchema]}
        noindex={true}
      />

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Search</span>
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold ${t.text} mb-6`}>Search Vantage</h1>

        <div className={`${t.glass} rounded-2xl p-4 md:p-5 mb-6 flex items-center gap-3`}>
          <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. workday parser, jobscan vs vantage, openai interview…"
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-base"
            autoFocus
            aria-label="Search Vantage"
          />
        </div>

        {!query.trim() && (
          <div className={`${t.glass} rounded-2xl p-5 mb-8`}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${t.textMuted}`}>Popular searches</div>
            <div className="flex flex-wrap gap-2">
              {['workday parser', 'jobscan vs vantage', 'openai interview', 'cover letter roast', 'no interviews', 'ghost job', 'pricing', 'receipts'].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className={`text-xs px-3 py-1.5 rounded-full border border-white/15 ${t.textSub} hover:bg-black/5 dark:hover:bg-white/5`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && ranked.length === 0 && (
          <div className={`${t.glass} rounded-2xl p-6 mb-8 text-center`}>
            <p className={`text-base ${t.text} mb-2`}>No matches for "{query}".</p>
            <p className={`text-sm ${t.textSub} mb-4`}>
              Try a broader term, or jump straight to the tools or pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/tools" className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:bg-black/5 dark:hover:bg-white/5">All free tools</Link>
              <Link to="/pricing" className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:bg-black/5 dark:hover:bg-white/5">Pricing</Link>
              <Link to="/receipts" className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:bg-black/5 dark:hover:bg-white/5">Trust audit</Link>
            </div>
          </div>
        )}

        {ranked.length > 0 && (
          <ul className="space-y-3 mb-12">
            {ranked.map((hit) => {
              const isExternal = hit.url.startsWith('http');
              const Wrap: any = isExternal ? 'a' : Link;
              const props = isExternal
                ? { href: hit.url, target: '_blank', rel: 'noopener noreferrer' }
                : { to: hit.url };
              return (
                <li key={hit.url} className={`${t.glass} rounded-xl p-4 hover:border-violet-400/40 transition-colors`}>
                  <Wrap {...props} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${t.textMuted}`}>{hit.type}</div>
                        <h2 className={`text-base font-bold ${t.text} mb-1`}>{hit.title}</h2>
                        <p className={`text-xs ${t.textSub} leading-relaxed`}>{hit.description}</p>
                        <div className={`text-[11px] ${t.textMuted} mt-1.5 truncate`}>aimvantage.uk{hit.url.startsWith('http') ? hit.url.replace(SITE_URL, '') : hit.url}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                    </div>
                  </Wrap>
                </li>
              );
            })}
          </ul>
        )}

        <div className={`text-xs ${t.textMuted} text-center mt-8`}>
          Tip: add Vantage as a browser search provider so you can search from the address bar.
        </div>
      </div>
    </div>
  );
}
