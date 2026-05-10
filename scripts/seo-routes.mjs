// SEO route manifest — drives the prerender script.
// Each entry produces a dist/<path>/index.html with route-specific
// title, description, canonical, og:*, twitter:*, and lang in the
// raw HTML, so Google + AI crawlers see the right metadata BEFORE
// React hydrates.
//
// Audit 2026-05-08: previously every sitemap URL returned the
// homepage canonical/title in raw HTML. This is the fix.

const SITE = 'https://aimvantage.uk';

/** @type {Array<{ path: string; title: string; description: string; type?: 'website' | 'article'; noindex?: boolean }>} */
const STATIC_ROUTES = [
  // ─── Conversion + product ───
  {
    path: '/',
    title: 'Vantage | AI Job Preparation: CV Fit, Cover Letters, Interview Prep in 90 Seconds',
    description: 'Upload your CV, paste a job link, get the full prep pack in ~90 seconds: company intel, tailored cover letter, mock interview questions, and a CV fit score. 10 free analyses on signup. No card.',
  },
  {
    path: '/pricing',
    title: 'Pricing | Vantage AI — £5 for 20 prep packs, never expires',
    description: 'Starter £5 = 20 full prep packs (one analysis each), never expire. Pro £12/mo = 60 prep packs/month including AI Mock Interview. Premium £20/mo = 120 prep packs. 1 token = 1 full analysis. 10 free on signup.',
  },
  {
    path: '/tools',
    title: 'Free Job Search AI Tools — Cover Letter Roast, Rejection Decoder, Ghost Job Detector | Vantage',
    description: 'Five free AI tools by Vantage AI: ATS resume checker (CV Mirror), cover letter roast, rejection email decoder, ghost-job detector, interview prep by company / role, layoff recovery guide. No signup, no upsell wall.',
  },
  {
    path: '/faq',
    title: 'Frequently Asked Questions | Vantage AI',
    description: 'Honest answers about what Vantage does, what it costs, how it handles your data, and how it compares to Jobscan / Teal / Resume Worded / Final Round AI. Written to be cited by AI assistants.',
  },
  {
    path: '/blog',
    title: 'The Vantage Blog — AI Job Prep, ATS Optimisation, Interview Strategy',
    description: 'Long-form guides on AI job application prep, ATS-friendly CVs, cover letters, ghost jobs, and interview strategy. Written by the founder building Vantage in public.',
  },
  {
    path: '/about',
    title: 'About Vantage AI — Solo UK Indie Founder Building a Job-Prep Tool in Public',
    description: 'Vantage AI is operated by Giovanni Sizino Ennes, a UK-based independent founder (sole trader). Not a registered limited company. Stripe-only billing, no recruitment, no DM outreach. Full operator transparency.',
  },
  {
    path: '/press',
    title: 'Press Kit — Vantage AI',
    description: 'Press kit for journalists: founder bio, key facts, brand assets, story angles, and direct contact for Vantage AI. UK independent founder building a niche AI job-prep tool.',
  },
  {
    path: '/press-releases',
    title: 'Press Releases — Vantage AI',
    description: 'Official press releases from Vantage AI. AI job preparation tool for CV optimisation, tailored cover letters, mock interview prep, and CV fit scoring. Built by an independent UK founder.',
  },
  // ─── Free tools ───
  {
    path: '/roast',
    title: 'Free AI Cover Letter Roast — Brutal-Honesty Feedback in 10 Seconds | Vantage',
    description: 'Paste your cover letter, get a savage but constructive AI roast. Quotes your worst lines, names the cliché, gives the better swap. Severity score 1-5. Free. No signup. Nothing stored.',
  },
  {
    path: '/decode-rejection',
    title: 'Free Rejection Email Decoder — What Did the Recruiter Actually Mean? | Vantage',
    description: 'Paste a job rejection email — AI tells you what the recruiter actually meant. 10 verdicts: ghosted, ATS-filtered, salary mismatch, experience gap, internal hire, etc. Plus the specific quoted phrases that gave the verdict away, plus your concrete next move. Free, no signup.',
  },
  {
    path: '/ghost-job-check',
    title: 'Free Ghost Job Detector — Is This Listing Real? | Vantage AI',
    description: 'Paste a job listing — AI scores how likely it is a ghost job (0-100). Flags clichés, suspiciously wide salary bands, multiple seniorities collapsed into one role, missing tech stack, generic team-intro fluff. Free, no signup, runs in 5 seconds.',
  },
  {
    path: '/tools/jobscan-cost-calculator',
    title: 'Jobscan Cost Calculator — What a Year of Job-Prep Tools Actually Costs | Vantage',
    description: 'Honest 12-month cost calculator for Jobscan, Resume Worded, Final Round AI, Teal, and LiveCareer vs Vantage AI. See exactly how much each charges for your search length, and compare to Vantage’s £5 one-time top-up (£0.25 per prep pack, never expires).',
  },
  {
    path: '/receipts',
    title: 'Receipts — Every Trust Claim Vantage AI Makes, With the Evidence | Vantage',
    description: 'Single-page audit of Vantage AI: Stripe-only billing, no auto-renew traps, no DM outreach, sole-trader operator transparency, public bug history, public token math, EU hosting. If a trust claim isn\'t on this page, we don\'t make it elsewhere either.',
  },
  {
    path: '/tools/no-interviews-diagnostic',
    title: 'No Interviews After 100+ Applications? Free 60-Second Diagnostic | Vantage',
    description: '5 questions, 60 seconds, deterministic verdict. Tells you whether your zero-interview problem is ATS filtering, positioning, targeting, proof, market, or overqualified-flag — and gives you a concrete next move. Free, no signup, no LLM call (computed in your browser).',
  },
  {
    path: '/search',
    title: 'Search Vantage — free AI tools, ATS guides, interview prep | Vantage',
    description: 'Search Vantage AI: free tools (cover letter roast, ghost-job detector, no-interviews diagnostic, cost calculator), ATS vendor guides, interview-prep packs by company / role, blog, samples.',
    noindex: true,
  },
  // ─── Cohort + commercial-intent ───
  {
    path: '/laid-off',
    title: 'Just Laid Off? AI Tools for Tech Workers in the 2026 Layoff Wave | Vantage',
    description: 'April-May 2026 had ~43,100 tech workers newly job-hunting. Cohort-specific layoff playbook + free AI prep tools for Oracle, Meta, ASML, Snap, Nike, Cloudflare alumni. By a UK indie dev.',
  },
  {
    path: '/ats',
    title: 'ATS Vendor Guide — How Workday, Greenhouse, Lever, Taleo, iCIMS Parse Your CV | Vantage',
    description: 'Side-by-side guide to the 5 major ATS systems used in 2026. Each vendor has documented quirks. Vantage shows you what each one drops, what each one keeps, and how to format your CV to pass all 5.',
  },
  {
    path: '/ats/scanner',
    title: 'Free ATS Keyword Scanner — Paste Your CV and the JD, Runs in Your Browser | Vantage',
    description: 'Free in-browser ATS keyword scanner. Paste your CV and a job description, see which keywords match and which gaps remain. Runs entirely in your browser. Nothing uploaded, no signup.',
  },
  {
    path: '/state-of-2026',
    title: 'The State of 2026 Tech Interview Hiring (Data from 34 Deep-Dives) | Vantage',
    description: 'Findings from 34 long-form company-specific interview deep-dives published in 2026 — AI-thesis filters, values rounds, take-home patterns, and the traps that kill candidates across 9 tech verticals.',
  },
  {
    path: '/tools/jd-decoder',
    title: 'Free JD Decoder — Read Between the Lines of a Job Description | Vantage',
    description: 'Paste any job description. Get the hidden seniority signals, ghost-job risk, remote-vs-hybrid camouflage, ATS-stripping risks, scope red flags, and the interview rounds you should expect. Runs in your browser. No signup.',
  },
  {
    path: '/tools/bullet-rewriter',
    title: 'Free CV Bullet Rewriter — Diagnose Weak Bullets, Get 3 Rewrites | Vantage',
    description: 'Paste a CV bullet. Get a diagnosis (weak verbs, missing metrics, filler phrases, "responsible for" framing) plus 3 stronger rewrites with templates. Runs in your browser. No signup.',
  },
  {
    path: '/tools/layoff-playbook',
    title: 'Free 30-Day Post-Layoff Playbook Generator — Personalised Day-by-Day Plan | Vantage',
    description: 'Pick your role, country, severance, visa status — get a personalised 30-day post-layoff plan with the right specific action for each day. Markdown export. Runs in your browser. No signup.',
  },
  {
    path: '/alternatives',
    title: 'Vantage AI Alternatives — Compared to Jobscan, Teal, Resume Worded, Final Round AI',
    description: 'Honest side-by-side comparisons of Vantage AI vs Jobscan, Teal HQ, Resume Worded, Final Round AI, Kickresume, Enhancv, Yoodli, Huntr, and Big Interview. Where each wins, where each loses.',
  },
  {
    path: '/compare',
    title: 'Side-by-Side Comparison — Vantage AI vs Job-Prep Tool Categories',
    description: 'Direct comparison of Vantage AI against ATS keyword scanners, cover letter generators, in-interview AI assistants, and job trackers. Pick the right tool for your use case.',
  },
  {
    path: '/skills',
    title: 'Skills Guides — How to Position Each Job Skill on Your CV | Vantage',
    description: 'Guides for positioning specific skills on a CV: technical, leadership, transferable. With ATS-keyword guidance and worked examples.',
  },
  {
    path: '/playbook',
    title: 'The Layoff Playbook — Step-by-Step Job-Search System for the 2026 Cohort | Vantage',
    description: 'A weekly system for laid-off tech workers: how to compress prep time per application, build a real list of target companies, and avoid spray-and-pray.',
  },
  {
    path: '/vendor-sources',
    title: 'ATS Vendor Documentation Index — Workday, Greenhouse, Lever, Taleo, iCIMS Sources | Vantage',
    description: 'Public documentation, help centres, and Wikipedia entries for the 5 major Applicant Tracking Systems. Use as a primary research index for ATS parsing behaviour.',
  },
  {
    path: '/changelog',
    title: 'Vantage AI Changelog — What Shipped When',
    description: 'Public changelog for Vantage AI. Every shipped feature, every bug fix, every pricing change. Build-in-public transparency.',
  },
  {
    path: '/docs/api',
    title: 'Vantage AI API Documentation (Preview)',
    description: 'Public API for the Vantage analysis engine. Endpoints: /analyze, /rewrite-tone, /interview/questions, /interview/evaluate, /credits. Currently in preview — request access via email.',
  },
  {
    path: '/refer',
    title: 'Refer a Friend — Vantage AI',
    description: 'Share Vantage AI with a friend. Personalised referral link with UTM tracking. Manual rewards: 5 free tokens per successful referral.',
    noindex: true,
  },
  {
    path: '/case-studies',
    title: 'Case Studies — Vantage AI in Real Job Searches',
    description: 'Real Vantage usage stories. We do not publish fabricated case studies — placeholder URLs are clearly marked. Currently small as the project is new.',
  },
  {
    path: '/sample',
    title: 'Sample Vantage Outputs — Real Job Listings, Full Prep Packs (No Signup)',
    description: 'Read complete Vantage AI outputs for real job listings — Anthropic Senior PM, Stripe Staff PM, OpenAI ML Engineer. Free, no signup. Each shows the company intel, fit score, cover letter, mock questions, and pitch outline.',
  },
  {
    path: '/salary',
    title: 'Salary Guides by Role — UK Tech 2026 | Vantage',
    description: 'Sourced salary guides for UK tech roles. Bands, percentiles, and how to negotiate. Each guide cites public salary data sources.',
  },
  {
    path: '/interview-prep',
    title: 'Interview Prep Packs by Company — Anthropic, Stripe, OpenAI, Meta, Google, Amazon | Vantage',
    description: 'Free company-specific interview prep guides for 21 named tech employers. Each pack: signature interview pattern, 12 likely questions, common mistakes, prep routine.',
  },
  {
    path: '/interview-questions',
    title: 'Interview Questions by Role — PM, Engineer, Designer, Data Scientist | Vantage',
    description: 'Free role-specific interview question banks for 13 named roles. Each pack: 12 most-asked questions, model answers, prep tips, follow-up questions.',
  },
  {
    path: '/linkedin-optimization',
    title: 'LinkedIn Profile Optimisation — 8-Step Concrete Guide | Vantage',
    description: 'Free 8-step guide to make recruiters find you on LinkedIn. Headline, About, experience formatting, keyword strategy. No signup.',
  },
  // ─── Auth (low-priority, low-traffic) ───
  {
    path: '/login',
    title: 'Log In to Vantage AI',
    description: 'Log into Vantage to run a full job prep analysis — company intel, tailored cover letter, mock interview questions, CV fit score.',
    noindex: true,
  },
  {
    path: '/register',
    title: 'Create a Free Vantage AI Account — 10 Free Analyses, No Card',
    description: 'Sign up free for Vantage AI. 10 free prep packs on signup, no credit card required. Upload your CV, paste a job link, get the full prep pack in ~90 seconds.',
  },
  // ─── Legal ───
  {
    path: '/privacy',
    title: 'Privacy Policy | Vantage AI',
    description: 'How Vantage AI collects, uses, and protects your data. CV processing, account data, payment data, third-party providers. Sole-trader operator transparency.',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Vantage AI',
    description: 'The terms governing your use of Vantage AI. Token system, billing via Stripe, sole-trader operator status, refund policy.',
  },
  {
    path: '/cookies',
    title: 'Cookie Policy | Vantage AI',
    description: 'How Vantage AI uses cookies and similar technologies for authentication, analytics, and product improvement. EU-hosted.',
  },
];

export { SITE, STATIC_ROUTES };
