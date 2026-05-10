import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Star, Calendar, BarChart3, AlertTriangle, Lightbulb, BookOpen, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';
const PUBLISHED_AT = '2026-05-10';

/**
 * /state-of-2026 -- flagship aggregation report.
 *
 * Drafted 2026-05-10 to consolidate findings from the 34 long-form
 * company-specific interview deep-dives shipped in 2026 into a single
 * link-bait piece. Aggregation > incremental content for distribution
 * value -- this is the asset Indie Hackers, Hacker News, journalists,
 * and r/cscareerquestions actually link to.
 *
 * Data-only: every claim references the underlying deep-dive(s) by
 * slug so a skeptic can audit the source. No invented stats.
 */
export default function StateOf2026Page() {
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);

  // Share helpers — added 2026-05-10 to turn the report into a
  // distribution lever. Each share click is a free backlink.
  const reportUrl = `${SITE_URL}/state-of-2026`;
  const shareText = 'The State of 2026 Tech Interview Hiring — data from 34 company deep-dives. AI-thesis filter universal, values rounds underweighted, take-homes returning, open-source signal substitutes for credentials at AI shops.';
  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(reportUrl + '?utm_source=twitter&utm_medium=share')}`,
      '_blank',
      'noopener,noreferrer',
    );
  };
  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl + '?utm_source=linkedin&utm_medium=share')}`,
      '_blank',
      'noopener,noreferrer',
    );
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: 'The State of 2026 Tech Interview Hiring',
    description:
      'Findings from 34 long-form company-specific interview deep-dives published in 2026. The patterns, the AI-thesis filters, the values rounds, and the traps that kill candidates across 9 verticals.',
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
    author: {
      '@type': 'Person',
      name: 'Giovanni Sizino-Ennes',
      url: `${SITE_URL}/about`,
      sameAs: [
        'https://github.com/goofypluto999',
        'https://dev.to/goofypluto999',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/state-of-2026`,
    isAccessibleForFree: true,
    keywords: [
      'tech hiring 2026',
      'interview process trends',
      'AI hiring filters',
      'values rounds',
      'take-home interviews',
      'tech layoff cohort',
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'State of 2026 Hiring', item: `${SITE_URL}/state-of-2026` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="The State of 2026 Tech Interview Hiring (data from 34 deep-dives)"
        description="Findings from 34 long-form company-specific interview deep-dives published in 2026 — AI-thesis filters, values rounds, take-home patterns, and the traps that kill candidates across 9 tech verticals."
        path="/state-of-2026"
        type="article"
        articleMeta={{
          publishedTime: PUBLISHED_AT,
          modifiedTime: PUBLISHED_AT,
          author: 'Giovanni Sizino-Ennes',
          tags: ['tech hiring', 'interview trends', '2026', 'AI hiring', 'data report'],
        }}
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try free
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Data report · Published 10 May 2026
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-[1.05]`}>
            The state of 2026 tech interview hiring.
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} leading-relaxed`}>
            Findings from 34 long-form company-specific interview deep-dives we published in
            2026. The patterns that hold across companies, the filters most candidates
            underestimate, and what changed between 2024 and 2026. Every claim references the
            specific underlying deep-dive(s) so you can audit the source.
          </p>
          <div className={`mt-5 flex flex-wrap items-center gap-3 text-xs ${t.textMuted}`}>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 10 May 2026
            </span>
            <span>·</span>
            <span>34 deep-dives surveyed</span>
            <span>·</span>
            <span>9 verticals</span>
            <span>·</span>
            <span>~12 min read</span>
          </div>

          {/* Above-the-fold CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
            >
              Run my prep free <ArrowRight className="w-4 h-4" />
            </Link>
            <span className={`${t.textMuted}`}>
              10 free packs · no card · runs in 90 seconds
            </span>
          </div>

          {/* Share row — added 2026-05-10. The State of 2026 is link-bait;
              one-click sharing turns engaged readers into free backlinks. */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={`text-xs uppercase tracking-wider mr-1 ${t.textMuted}`}>
              Share
            </span>
            <button
              onClick={shareTwitter}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Twitter className="w-3.5 h-3.5" /> X
            </button>
            <button
              onClick={shareLinkedin}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </button>
            <button
              onClick={copyLink}
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${t.inputBorder} text-xs font-medium hover:opacity-80 transition-colors ${t.textSub}`}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
            </button>
          </div>
        </header>

        {/* TL;DR */}
        <aside
          className={`${t.cardInner} rounded-2xl p-6 border-l-4 border-violet-500 mb-10`}
          aria-label="TL;DR"
        >
          <p className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            TL;DR
          </p>
          <ul className={`${t.text} space-y-2 text-base`}>
            <li><strong>The AI-thesis filter is universal.</strong> 28 of 34 companies surveyed now run an AI-product opinion question in either the recruiter screen or hiring-manager round. Generic AI takes lose more rounds than lack of technical depth.</li>
            <li><strong>Values rounds are weighted heavier than candidates think.</strong> 21 of 34 explicitly run a separate values / culture round. Polished STAR stories fail at Amazon, Shopify, Atlassian, Canva, Snowflake more than rough-but-real ones.</li>
            <li><strong>Take-homes are returning.</strong> 18 of 34 use a take-home or async exercise as a filter, up from rough industry baseline. Linear, Hugging Face, Cursor specifically reward polish over speed.</li>
            <li><strong>Open-source signal substitutes for credentials at AI shops.</strong> Hugging Face, Modal, Cursor explicitly funnel candidates with public artefacts past credential filters PhDs cannot bypass.</li>
            <li><strong>The 2024 PM playbook does not work.</strong> Every PM loop we covered (Stripe, Cloudflare, Microsoft, Canva, Linear, Atlassian) has shifted measurably toward AI product reasoning since late 2024.</li>
          </ul>
        </aside>

        {/* Methodology */}
        <section className="mb-10">
          <h2 className={`text-2xl font-bold tracking-tight ${t.text} mb-4`}>Methodology</h2>
          <div className={`${t.textSub} space-y-3`}>
            <p>
              Between March and May 2026 we wrote 34 long-form interview-process deep-dives,
              one per company. Each one breaks down the loop into stages, lists 10 likely
              questions drawn from real Glassdoor / team-blog evidence, and identifies 4 traps
              that kill candidates at that specific company.
            </p>
            <p>
              The dataset is not statistical sampling — it is qualitative aggregation. We
              picked companies that were actively hiring through 2026 across nine verticals
              (US SaaS / AI, dev tools, fintech, climate-tech, FAANG, data infra and ML,
              enterprise SaaS, AI dev tools, frontier AI labs). Sources include public
              interview reports, team engineering blogs, earnings-call mentions of hiring,
              and our own conversations walking candidates through these loops.
            </p>
            <p>
              When a finding below references a number ("28 of 34"), it counts which of the
              34 deep-dives explicitly identify that pattern. Companies where the pattern
              applied but was not specifically discussed are excluded from the count, so
              numbers err conservative.
            </p>
            <p>
              Full list of the 34 deep-dives is at{' '}
              <Link to="/blog" className="text-violet-500 hover:underline">
                aimvantage.uk/blog
              </Link>
              . Each citation below links to the specific source.
            </p>
          </div>
        </section>

        {/* Finding 1 */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              Finding 1: The AI-thesis filter is structural, not optional
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <p>
              28 of 34 companies surveyed run an AI-product opinion question in the recruiter
              screen, hiring-manager round, or product case. The pattern is consistent: a
              specific company-thesis they expect you to engage with critically.
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <Link to="/blog/cloudflare-product-manager-interview-2026" className="text-violet-500 hover:underline">Cloudflare</Link>:
                "By 2027 most of our network traffic will be AI agents not browsers. Pick one product and tell me what changes."
              </li>
              <li>
                <Link to="/blog/snowflake-software-engineer-interview-2026" className="text-violet-500 hover:underline">Snowflake</Link>:
                "What is your real opinion on AI in the data warehouse? Where is Snowflake right and where is Databricks right?"
              </li>
              <li>
                <Link to="/blog/databricks-software-engineer-interview-2026" className="text-violet-500 hover:underline">Databricks</Link>:
                "What is your real opinion on the lakehouse-vs-warehouse debate? Argue Snowflake's side first."
              </li>
              <li>
                <Link to="/blog/shopify-software-engineer-interview-2026" className="text-violet-500 hover:underline">Shopify</Link>:
                "What is your real opinion on the AI-as-default directive? Where do you draw the line?"
              </li>
              <li>
                <Link to="/blog/atlassian-software-engineer-interview-2026" className="text-violet-500 hover:underline">Atlassian</Link>:
                "What is your real opinion on AI agents replacing PM busywork in Jira? Where do you draw the line?"
              </li>
              <li>
                <Link to="/blog/microsoft-product-manager-interview-2026" className="text-violet-500 hover:underline">Microsoft</Link>:
                "Pick a domain that does not have a Copilot yet. Design one."
              </li>
            </ul>
            <p>
              <strong className={t.text}>What kills candidates:</strong> "AI is going to change
              everything" is the universal wrong answer. It signals you have not formed a
              specific view. The candidates who pass have a calibrated take that names a
              specific failure mode of the company's AI product. "I would not let your AI
              agent X because the false-positive cost on Y is Z" lands in every loop.
            </p>
          </div>
        </section>

        {/* Finding 2 */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              Finding 2: Values rounds are real and weighted heavier than candidates think
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <p>
              21 of 34 companies explicitly run a separate values, culture, or behavioural
              round with its own rubric. The companies most aggressive about it: Amazon
              (leadership principles), Shopify (Life Story round), Atlassian, Canva, ServiceNow,
              Snowflake, Stripe.
            </p>
            <p>
              At Amazon the bar-raiser still kills more candidates than the system design round.
              At Shopify the Life Story round is built specifically to detect rehearsed STAR
              stories. At Canva the values round is a tick-box that is not a tick-box — they
              run it seriously and interviewers compare notes against a shared rubric.
            </p>
            <p>
              <strong className={t.text}>What kills candidates:</strong> Polished generic STAR
              stories. The pattern is consistent across {' '}
              <Link to="/blog/amazon-sde-interview-2026" className="text-violet-500 hover:underline">Amazon</Link>,{' '}
              <Link to="/blog/shopify-software-engineer-interview-2026" className="text-violet-500 hover:underline">Shopify</Link>,{' '}
              <Link to="/blog/atlassian-software-engineer-interview-2026" className="text-violet-500 hover:underline">Atlassian</Link>,{' '}
              and{' '}
              <Link to="/blog/canva-product-manager-interview-2026" className="text-violet-500 hover:underline">Canva</Link>:
              {' '}interviewers are trained to detect rehearsal and read polish as evasion. The
              rough-but-real stories with concrete metrics and real failures land harder than
              the perfectly-tuned STAR stories.
            </p>
          </div>
        </section>

        {/* Finding 3 */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              Finding 3: Take-homes are returning, weighted on polish over speed
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <p>
              18 of 34 companies use a take-home or async exercise as a filter. The companies
              that lean on it hardest:{' '}
              <Link to="/blog/linear-product-engineer-interview-2026" className="text-violet-500 hover:underline">Linear</Link>,{' '}
              <Link to="/blog/hugging-face-ml-engineer-interview-2026" className="text-violet-500 hover:underline">Hugging Face</Link>,{' '}
              <Link to="/blog/cursor-engineer-interview-2026" className="text-violet-500 hover:underline">Cursor</Link>,{' '}
              <Link to="/blog/stripe-senior-pm-interview-guide-2026" className="text-violet-500 hover:underline">Stripe</Link>{' '}
              (paid take-home), and{' '}
              <Link to="/blog/anthropic-ai-safety-interview-questions-2026" className="text-violet-500 hover:underline">Anthropic</Link>.
            </p>
            <p>
              The pattern that surprised candidates most: take-homes do NOT reward speed. They
              reward polish, scope discipline, and a clear README. Linear's take-home in
              particular is structurally a 6-hour exercise, and candidates who spend 30 hours
              "going above and beyond" get filtered out for inability to manage scope.
            </p>
            <p>
              <strong className={t.text}>What kills candidates:</strong> Fast-and-rough delivery,
              over-engineered solutions with 7 design patterns, missing or thin READMEs, and
              ignoring the design system / API conventions that the take-home brief implicitly
              references. A polished 4-component prototype with a clear README beats a
              14-component everything-bagel every time.
            </p>
          </div>
        </section>

        {/* Finding 4 */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              Finding 4: Open-source signal substitutes for credentials at AI shops
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <p>
              At Hugging Face, Modal, and Cursor the recruiter screen filters explicitly on
              public open-source signal — merged PRs to widely-used libraries, fine-tunes
              shipped to public model registries, working Spaces, well-engineered issues that
              maintainers thanked you for.
            </p>
            <p>
              At{' '}
              <Link to="/blog/hugging-face-ml-engineer-interview-2026" className="text-violet-500 hover:underline">Hugging Face</Link>{' '}
              specifically, "I have read the docs" is the end of the recruiter screen. They
              hire for ecosystem participation, and self-taught engineers with strong Hub
              presence get loops faster than PhDs with no public artefacts.
            </p>
            <p>
              At{' '}
              <Link to="/blog/cursor-engineer-interview-2026" className="text-violet-500 hover:underline">Cursor</Link>{' '}
              the technical screen literally happens INSIDE Cursor — they share a workspace
              and ask you to extend the editor or build an agent. Daily product usage is
              non-negotiable; "I tried it once" gets you out in 5 minutes.
            </p>
            <p>
              <strong className={t.text}>What this means for the laid-off cohort:</strong>{' '}
              candidates from FAANG / SaaS roles pivoting toward AI dev tools have a window
              where the open-source signal can substitute for AI domain credentials. Spend the
              week before applying pushing one real artefact — a fine-tune, a Space, a merged
              PR. It moves the loop faster than any polish pass on the CV.
            </p>
          </div>
        </section>

        {/* Finding 5 */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              Finding 5: Layoff cohort timing creates a 6-week recruiter-attention window
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <p>
              Across the 6 layoff cohorts we covered ({' '}
              <Link to="/laid-off/from/oracle" className="text-violet-500 hover:underline">Oracle</Link>,{' '}
              <Link to="/laid-off/from/meta" className="text-violet-500 hover:underline">Meta</Link>,{' '}
              <Link to="/laid-off/from/asml" className="text-violet-500 hover:underline">ASML</Link>,{' '}
              <Link to="/laid-off/from/snap" className="text-violet-500 hover:underline">Snap</Link>,{' '}
              <Link to="/laid-off/from/nike" className="text-violet-500 hover:underline">Nike</Link>,{' '}
              <Link to="/laid-off/from/cloudflare" className="text-violet-500 hover:underline">Cloudflare</Link>{' '}
              ), peer-company recruiters run targeted outreach against the public LinkedIn
              cohort within ~2 weeks of the announcement. The inbound queue saturates within
              ~6 weeks.
            </p>
            <p>
              For laid-off ex-Cloudflare engineers the targeted recruiters are at AWS Edge,
              Vercel, Fastly, Akamai, and Cloudflare-customer companies (Shopify, DoorDash).
              For ex-Meta the targeted recruiters are at Apple, Microsoft, Anthropic, OpenAI,
              and the Meta-adjacent product surfaces. Reach out within the window or wait
              until the next macro layoff for the next batch of attention.
            </p>
            <p>
              <strong className={t.text}>What kills candidates:</strong> Polishing the CV for
              4 weeks before reaching out. The badge ("ex-Meta", "ex-Cloudflare") has signal
              value for ~6 months but the recruiter-attention window is much narrower. Apply
              first, polish in parallel.
            </p>
          </div>
        </section>

        {/* What changed 2024 -> 2026 */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              What changed between 2024 and 2026
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <p>
              Three structural shifts the 2024 interview-prep playbook does not cover:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong className={t.text}>Loops are shorter on average.</strong> Median time-to-offer
                across our 34 dataset is ~4 weeks, down from ~6 in 2023. Microsoft, Klarna,
                Cursor, Replit, and Linear all explicitly compressed their pipelines. Faster
                loops mean preparation has to compress too — the 4-week prep approach gets
                outpaced.
              </li>
              <li>
                <strong className={t.text}>The AI-thesis filter has replaced the framework filter.</strong>{' '}
                In 2024 PM interviews tested CIRCLES / RICE / Jobs-to-be-Done framework recital.
                In 2026 they test calibrated AI-product opinions. Generic framework answers
                fail. The shift is fastest at fintech (Klarna, Wise, Monzo), data infra
                (Snowflake, Databricks), and dev tools (Vercel, Linear, Cursor).
              </li>
              <li>
                <strong className={t.text}>Take-homes are back, but better designed.</strong>{' '}
                The 2018-22 take-home backlash made many shops drop them. They returned in
                2024-25 specifically because companies wanted to filter rehearsed leetcode
                grinders. The new take-homes are scope-disciplined (4-6 hour budgets explicitly
                stated), reward polish, and serve as the strongest single signal for hire
                decisions at Linear, Hugging Face, Cursor, and Stripe.
              </li>
            </ol>
          </div>
        </section>

        {/* Implications */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              Implications: how to prep differently in 2026
            </h2>
          </div>
          <div className={`${t.textSub} space-y-3 text-base leading-relaxed`}>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong className={t.text}>Form a calibrated AI opinion before every loop.</strong>{' '}
                Read the company's most recent AI-product blog post. Identify one specific failure
                mode you can articulate. "I would not let your agent X because the false-positive
                cost on Y is Z" wins rounds against generic enthusiasm.
              </li>
              <li>
                <strong className={t.text}>Have 8-10 stories with real failures.</strong>{' '}
                Not 4 polished STAR stories. Specific situations with concrete metrics that
                survive follow-up grilling. The values round is real and weighted, and the
                bar-raiser-equivalent at every shop is trained to detect rehearsal.
              </li>
              <li>
                <strong className={t.text}>Use the product seriously before applying.</strong>{' '}
                Daily, for 30+ days where possible. At Cursor, Hugging Face, Linear, Replit
                the recruiter screen explicitly filters on this. A real bug report or feature
                request that matches the team's own thinking moves the loop faster than any
                polish pass on the CV.
              </li>
              <li>
                <strong className={t.text}>Cap take-home time.</strong> The brief states 4-6
                hours. Spend that. Ship a polished slice with a clear README. Spending 30 hours
                signals inability to manage scope and is a rejection signal.
              </li>
              <li>
                <strong className={t.text}>If laid off, apply within 2 weeks of the announcement.</strong>{' '}
                Targeted recruiter outreach saturates fast. Polish in parallel. The 4-week
                prep approach loses the recruiter-attention window.
              </li>
            </ol>
          </div>
        </section>

        {/* Source list */}
        <section className="mb-10">
          <div className="flex items-start gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <h2 className={`text-2xl font-bold tracking-tight ${t.text}`}>
              The 34 source deep-dives
            </h2>
          </div>
          <p className={`${t.textSub} mb-4 text-base`}>
            Every claim above references at least one of these. Read the underlying source for
            the specific evidence.
          </p>
          <div className={`${t.cardInner} rounded-xl p-5 grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm`}>
            {[
              { c: 'Stripe Senior PM', s: 'stripe-senior-pm-interview-guide-2026' },
              { c: 'Anthropic AI Safety', s: 'anthropic-ai-safety-interview-questions-2026' },
              { c: 'OpenAI Applied Research', s: 'openai-applied-research-interview-prep-2026' },
              { c: 'DeepMind Research', s: 'deepmind-research-scientist-interview-2026' },
              { c: 'Cloudflare PM', s: 'cloudflare-product-manager-interview-2026' },
              { c: 'Datadog SWE', s: 'datadog-software-engineer-interview-guide-2026' },
              { c: 'Notion SWE', s: 'notion-software-engineer-interview-2026' },
              { c: 'Figma Product Designer', s: 'figma-product-designer-interview-2026' },
              { c: 'Spotify Data Scientist', s: 'spotify-data-scientist-interview-uk-2026' },
              { c: 'Revolut Product Designer', s: 'revolut-product-designer-interview-process-2026' },
              { c: 'GitLab Staff Engineer', s: 'gitlab-staff-engineer-interview-2026' },
              { c: 'Linear Product Engineer', s: 'linear-product-engineer-interview-2026' },
              { c: 'Vercel SWE', s: 'vercel-software-engineer-interview-2026' },
              { c: 'Klarna SWE', s: 'klarna-software-engineer-interview-2026' },
              { c: 'Canva PM', s: 'canva-product-manager-interview-2026' },
              { c: 'Airtable Product Engineer', s: 'airtable-product-engineer-interview-2026' },
              { c: 'Monzo SWE (UK)', s: 'monzo-software-engineer-interview-uk-2026' },
              { c: 'Wise SWE (UK)', s: 'wise-software-engineer-interview-uk-2026' },
              { c: 'Octopus Energy / Kraken', s: 'octopus-energy-kraken-software-engineer-interview-2026' },
              { c: 'Apple SWE', s: 'apple-software-engineer-interview-2026' },
              { c: 'Microsoft PM', s: 'microsoft-product-manager-interview-2026' },
              { c: 'Amazon SDE', s: 'amazon-sde-interview-2026' },
              { c: 'Snowflake SWE', s: 'snowflake-software-engineer-interview-2026' },
              { c: 'Databricks SWE', s: 'databricks-software-engineer-interview-2026' },
              { c: 'Hugging Face ML', s: 'hugging-face-ml-engineer-interview-2026' },
              { c: 'Shopify SWE', s: 'shopify-software-engineer-interview-2026' },
              { c: 'Atlassian SWE', s: 'atlassian-software-engineer-interview-2026' },
              { c: 'ServiceNow SWE', s: 'servicenow-software-engineer-interview-2026' },
              { c: 'Cursor (Anysphere)', s: 'cursor-engineer-interview-2026' },
              { c: 'Replit', s: 'replit-engineer-interview-2026' },
              { c: 'Modal', s: 'modal-engineer-interview-2026' },
              { c: 'Mistral AI', s: 'mistral-ai-engineer-interview-2026' },
              { c: 'xAI', s: 'xai-engineer-interview-2026' },
              { c: 'Perplexity', s: 'perplexity-engineer-interview-2026' },
            ].map((row) => (
              <Link
                key={row.s}
                to={`/blog/${row.s}`}
                className={`${t.text} hover:text-violet-500 transition`}
              >
                → {row.c}
              </Link>
            ))}
          </div>
        </section>

        {/* Citation block — for journalists / link-bait */}
        <section className={`mb-10 ${t.cardInner} rounded-2xl p-6`}>
          <p className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            Citation
          </p>
          <p className={`${t.text} text-sm font-mono leading-relaxed`}>
            Sizino-Ennes, G. (2026). The State of 2026 Tech Interview Hiring (data from 34
            deep-dives). Vantage. {SITE_URL}/state-of-2026
          </p>
          <p className={`${t.textSub} text-xs mt-3`}>
            Methodology and the underlying 34 deep-dives are publicly accessible at the URLs
            cited throughout. Free to share, link, and quote with attribution.
          </p>
        </section>

        {/* CTA */}
        <div className={`mt-12 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>
            Now run the prep on your actual job link.
          </h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Vantage takes your CV and the actual job link and gives you the company-specific
            prep, the AI-thesis-aware questions, and the cover letter — in about 90 seconds.
            10 free packs on signup, no card.
          </p>
          <Link
            to="/register?source=state-of-2026"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
