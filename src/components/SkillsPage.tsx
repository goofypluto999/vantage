import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Terminal, Wrench } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

interface ToolEntry {
  name: string;
  type: 'mcp-server' | 'claude-skill' | 'cli';
  description: string;
  url: string;
  github?: string;
  install?: string;
  free: boolean;
  ourTeam?: boolean;
}

const TOOLS: ToolEntry[] = [
  {
    name: 'cv-mirror-mcp',
    type: 'mcp-server',
    description: 'MCP server that lints a CV against 5 real ATS parsers (Workday, Greenhouse, Lever, Taleo, iCIMS). Pure JS engine, MIT licensed, no network calls in the lint logic.',
    url: 'https://github.com/goofypluto999/cv-mirror-mcp',
    github: 'goofypluto999/cv-mirror-mcp',
    install: 'npx -y cv-mirror-mcp',
    free: true,
    ourTeam: true,
  },
  {
    name: 'CV Mirror (web)',
    type: 'cli',
    description: 'Browser-based version of the same engine. No signup, fully client-side, nothing uploads. Drop a PDF and see what 5 ATSes do to it side by side.',
    url: 'https://cv-mirror-web.vercel.app',
    free: true,
    ourTeam: true,
  },
  {
    name: 'filesystem-mcp',
    type: 'mcp-server',
    description: 'Read, write, search files in your project from inside any MCP-capable agent. The MCP ecosystem starting point for most workflows.',
    url: 'https://github.com/modelcontextprotocol/servers',
    free: true,
  },
  {
    name: 'github-mcp',
    type: 'mcp-server',
    description: 'Operate on GitHub issues, PRs, and repos through MCP. Useful for "summarise the open PRs" / "comment on issue #N" workflows.',
    url: 'https://github.com/github/github-mcp-server',
    free: true,
  },
  {
    name: 'brave-search-mcp',
    type: 'mcp-server',
    description: 'Web search inside MCP-capable agents. Useful for company research as part of a job-application orchestration agent.',
    url: 'https://github.com/modelcontextprotocol/servers',
    free: true,
  },
];

/**
 * /skills — directory of MCP servers and Claude Skills relevant to the
 * Vantage / job-prep audience.
 *
 * Targets the searches "best mcp servers for job search", "mcp ats lint",
 * "claude skills for cv". Underexploited keyword cluster.
 */
export default function SkillsPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Skills', item: `${SITE_URL}/skills` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: TOOLS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        description: tool.description,
        url: tool.url,
      },
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="MCP servers and Claude Skills for job search and CV prep"
        description="A curated list of Model Context Protocol servers and Claude Skills that integrate with Vantage's job-application workflow. cv-mirror-mcp, filesystem-mcp, github-mcp, and more."
        path="/skills"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/laid-off" className="text-[#4F46E5] font-semibold hover:underline">Just laid off?</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">3 free analyses</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">MCP servers + Claude Skills</p>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          Tools that pair well with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">your job-prep agent.</span>
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed`}>
          A curated list of Model Context Protocol servers and adjacent agent tools that work with Claude Desktop,
          Cursor, Cline, or any MCP-capable agent. Useful for orchestrating a job-application workflow.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <div key={tool.name} className={`${t.glass} rounded-2xl p-6`}>
              <div className="flex items-start justify-between mb-3 gap-4">
                <div className="flex items-start gap-3">
                  {tool.type === 'mcp-server' ? (
                    <Wrench className="w-5 h-5 text-[#4F46E5] mt-1" />
                  ) : (
                    <Terminal className="w-5 h-5 text-[#4F46E5] mt-1" />
                  )}
                  <div>
                    <h2 className={`text-xl font-bold ${t.text}`}>
                      {tool.name}
                      {tool.ourTeam && <span className="ml-2 text-xs uppercase tracking-widest text-[#4F46E5]">our team</span>}
                    </h2>
                    <p className={`text-xs ${t.textMuted} uppercase tracking-widest mt-1`}>
                      {tool.type === 'mcp-server' ? 'MCP server' : tool.type === 'claude-skill' ? 'Claude Skill' : 'Web tool / CLI'}
                      {tool.free && <span className="ml-2 text-emerald-500">free</span>}
                    </p>
                  </div>
                </div>
              </div>
              <p className={`${t.textSub} mb-4`}>{tool.description}</p>
              {tool.install && (
                <div className={`${t.cardInner} rounded-md px-3 py-2 mb-3 font-mono text-xs ${t.text}`}>
                  <span className={`${t.textMuted}`}>$ </span>{tool.install}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:underline"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
                {tool.github && (
                  <a
                    href={`https://github.com/${tool.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm ${t.textSub} hover:${t.text}`}
                  >
                    <Github className="w-3 h-3" /> {tool.github}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Got a tool we should add?</h2>
          <p className={`${t.textSub} max-w-xl mx-auto mb-5`}>
            We curate this list manually. If you've built or use an MCP server / Claude Skill that fits the
            job-search or CV-prep workflow, drop a line.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk?subject=Skills%20list%20%E2%80%94%20suggestion"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Email a suggestion <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
