import { Link } from 'react-router-dom';
import { Calendar, GitCommit, Sparkles, Wrench, ShieldCheck, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://vantage-livid.vercel.app';

type EntryKind = 'feature' | 'fix' | 'security' | 'content';

interface ChangelogEntry {
  date: string;
  kind: EntryKind;
  title: string;
  body: string;
  links?: { label: string; href: string }[];
}

const KIND_LABEL: Record<EntryKind, string> = {
  feature: 'New',
  fix: 'Fix',
  security: 'Security',
  content: 'Content',
};

const KIND_ICON: Record<EntryKind, typeof Sparkles> = {
  feature: Sparkles,
  fix: Wrench,
  security: ShieldCheck,
  content: BookOpen,
};

const KIND_COLOR: Record<EntryKind, string> = {
  feature: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
  fix: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  security: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  content: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
};

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-05-01',
    kind: 'content',
    title: 'ATS Guide expanded to 7 vendors',
    body: 'Added SmartRecruiters and SAP SuccessFactors to the ATS Guide. Each vendor page documents the parser\'s real-world quirks with public-source citations and a fix list.',
    links: [
      { label: '/ats/smartrecruiters', href: '/ats/smartrecruiters' },
      { label: '/ats/sap-successfactors', href: '/ats/sap-successfactors' },
    ],
  },
  {
    date: '2026-05-01',
    kind: 'content',
    title: 'Three new role-specific interview prep packs',
    body: 'DevOps engineer, engineering manager, and account executive packs added to the interview-questions cluster. 12 likely questions, 5 prep steps, common mistakes, and FAQ each.',
    links: [
      { label: '/interview-questions/devops-engineer', href: '/interview-questions/devops-engineer' },
      { label: '/interview-questions/engineering-manager', href: '/interview-questions/engineering-manager' },
      { label: '/interview-questions/account-executive', href: '/interview-questions/account-executive' },
    ],
  },
  {
    date: '2026-05-01',
    kind: 'feature',
    title: 'cv-mirror-mcp listed in awesome-mcp-servers',
    body: 'Filed pull requests against the three largest awesome-mcp-servers lists (punkpeye, wong2, appcypher) to add cv-mirror-mcp to the public MCP server registry.',
    links: [
      { label: 'cv-mirror-mcp on GitHub', href: 'https://github.com/goofypluto999/cv-mirror-mcp' },
    ],
  },
  {
    date: '2026-05-01',
    kind: 'fix',
    title: 'Top announcement bar no longer overlaps navbar',
    body: 'The "Got laid off this month?" announcement bar is now correctly fixed at the top of the viewport with the main navbar offset below it.',
  },
  {
    date: '2026-05-01',
    kind: 'security',
    title: 'Hardened secret-scanning gitignore patterns',
    body: 'Expanded .gitignore to catch all gitleaks scan outputs, npm audit reports, and operational SQL files so local forensic-tool output cannot be accidentally committed.',
  },
  {
    date: '2026-04-30',
    kind: 'content',
    title: 'Layoff cohort pages for April 2026 wave',
    body: 'Cohort-targeted advice pages for Oracle, Meta, ASML, Snap, and Nike alumni — 42,000 newly job-hunting in a single month. Severance / COBRA / vesting timing covered per company.',
    links: [{ label: '/laid-off', href: '/laid-off' }],
  },
  {
    date: '2026-04-30',
    kind: 'content',
    title: 'Company interview prep cluster grew to 20',
    body: 'Added Microsoft, OpenAI, Anthropic, Tesla, Salesforce, Uber, DoorDash, Spotify, Snowflake, and Databricks to the company interview prep cluster. Each pack ships with FAQPage + Article schema.',
    links: [{ label: '/interview-prep', href: '/interview-prep' }],
  },
  {
    date: '2026-04-29',
    kind: 'feature',
    title: 'AI agent ecosystem hub at /skills',
    body: 'Curated registry of MCP servers and Claude Skills that pair with the Vantage workflow. Includes the open-source cv-mirror-mcp.',
    links: [{ label: '/skills', href: '/skills' }],
  },
  {
    date: '2026-04-28',
    kind: 'content',
    title: 'Public API documentation',
    body: 'Documented the analyze, rewrite-tone, interview/questions, interview/evaluate, and credits endpoints. Currently in preview — access by request.',
    links: [{ label: '/docs/api', href: '/docs/api' }],
  },
  {
    date: '2026-04-27',
    kind: 'feature',
    title: 'Referral program for Pro and Premium subscribers',
    body: 'Authenticated users can share a unique referral link from /refer. Referees get a discount and the referrer gets bonus tokens.',
  },
  {
    date: '2026-04-26',
    kind: 'content',
    title: 'Press kit + founder bio',
    body: 'Standard PR kit: founder bio, brand assets, story angles, and direct contact for journalists.',
    links: [{ label: '/press', href: '/press' }],
  },
  {
    date: '2026-04-25',
    kind: 'feature',
    title: 'Atom 1.0 + JSON Feed 1.1 alongside RSS',
    body: 'Multiple feed formats for compatibility with newsreaders, archival tools, and AI ingestion pipelines.',
    links: [
      { label: 'RSS', href: '/rss.xml' },
      { label: 'Atom', href: '/atom.xml' },
      { label: 'JSON Feed', href: '/feed.json' },
    ],
  },
  {
    date: '2026-04-24',
    kind: 'content',
    title: 'Programmatic SEO for ATS vendors',
    body: 'Vendor-specific guides (Workday, Greenhouse, Lever, Taleo, iCIMS) detailing parse quirks and fixes. FAQPage + SoftwareApplication schema attached.',
    links: [{ label: '/ats', href: '/ats' }],
  },
  {
    date: '2026-04-23',
    kind: 'feature',
    title: 'Live AI mock interview',
    body: 'Voice-driven mock interview with question generation, response evaluation, and scoring. Pro and Premium plans.',
  },
  {
    date: '2026-04-20',
    kind: 'feature',
    title: 'Cover letter tone switching',
    body: 'Generated cover letters can be rewritten in Formal, Warm, Direct, or Creative tone with a single click. Results cached so revisits are instant.',
  },
  {
    date: '2026-04-15',
    kind: 'feature',
    title: 'Token wallet system',
    body: 'Tokens never expire on Starter packs. Pro and Premium plans top up monthly. One full analysis costs 3 tokens.',
    links: [{ label: '/pricing', href: '/pricing' }],
  },
  {
    date: '2026-04-10',
    kind: 'feature',
    title: 'Public launch',
    body: 'Vantage AI launched. Upload a CV, paste a job link, get a complete prep pack — company intel, tailored cover letter, mock interview questions, fit score, and a 5-minute pitch outline — in approximately 90 seconds.',
  },
];

export default function ChangelogPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Changelog', item: `${SITE_URL}/changelog` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: ENTRIES.map((e, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: e.title,
      description: e.body,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Changelog — what shipped recently"
        description="Vantage AI changelog. New features, fixes, security updates, and content additions. Updated weekly."
        path="/changelog"
        jsonLd={[breadcrumbSchema, itemListSchema]}
      />

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-3 text-xs uppercase tracking-wider opacity-70">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Changelog</span>
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${t.text}`}>Changelog</h1>
        <p className={`text-lg mb-12 ${t.textSub}`}>
          What's shipped on Vantage. Public log, updated as we ship — no marketing fluff.
        </p>

        <div className="space-y-6">
          {ENTRIES.map((entry, idx) => {
            const Icon = KIND_ICON[entry.kind];
            return (
              <article
                key={idx}
                className={`${t.glass} rounded-2xl p-6 md:p-7 border`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${KIND_COLOR[entry.kind]}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {KIND_LABEL[entry.kind]}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs ${t.textMuted}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={entry.date}>{entry.date}</time>
                  </span>
                </div>

                <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${t.text}`}>{entry.title}</h2>
                <p className={`leading-relaxed ${t.textSub}`}>{entry.body}</p>

                {entry.links && entry.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.links.map((l) =>
                      l.href.startsWith('http') ? (
                        <a
                          key={l.href}
                          href={l.href}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitCommit className="w-3 h-3" />
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          key={l.href}
                          to={l.href}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <GitCommit className="w-3 h-3" />
                          {l.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          <Link to="/" className={`${t.glass} rounded-xl p-5 hover:scale-[1.02] transition-transform`}>
            <div className={`text-xs uppercase tracking-wider mb-1 ${t.textMuted}`}>Home</div>
            <div className={`font-semibold ${t.text}`}>Vantage AI</div>
          </Link>
          <Link to="/playbook" className={`${t.glass} rounded-xl p-5 hover:scale-[1.02] transition-transform`}>
            <div className={`text-xs uppercase tracking-wider mb-1 ${t.textMuted}`}>Playbook</div>
            <div className={`font-semibold ${t.text}`}>Layoff playbook</div>
          </Link>
          <a
            href="/rss.xml"
            className={`${t.glass} rounded-xl p-5 hover:scale-[1.02] transition-transform block`}
          >
            <div className={`text-xs uppercase tracking-wider mb-1 ${t.textMuted}`}>Subscribe</div>
            <div className={`font-semibold ${t.text}`}>RSS feed</div>
          </a>
        </div>
      </div>
    </div>
  );
}
