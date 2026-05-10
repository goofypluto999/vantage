import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Star, Shield, Zap, FileSearch, MessageSquare, Target, Users, Briefcase, Calculator, Activity, ScanLine, Search, Sparkles, Calendar, GitCompareArrows, Mail, Linkedin, Inbox, Send, Layers } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools — hub page listing every free tool built by Giovanni Sizino Ennes
 * under the Vantage AI project umbrella (informally "Vantage Labs", not a
 * registered company).
 * Currently features CV Mirror (free ATS scanner). Designed to be
 * extended with future free tools by appending entries to the TOOLS array.
 */
export default function ToolsPage() {
  const { t } = useTheme();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free job search tools by Vantage AI',
    numberOfItems: 9,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        url: 'https://cv-mirror-web.vercel.app/',
        name: 'CV Mirror — Free ATS Resume Checker',
      },
      {
        '@type': 'ListItem',
        position: 2,
        url: `${SITE_URL}/roast`,
        name: 'Cover Letter Roast — Free AI Feedback',
      },
      {
        '@type': 'ListItem',
        position: 3,
        url: `${SITE_URL}/decode-rejection`,
        name: 'Rejection Email Decoder — Free AI Translation',
      },
      {
        '@type': 'ListItem',
        position: 4,
        url: `${SITE_URL}/ghost-job-check`,
        name: 'Ghost Job Detector — Free AI Listing Score',
      },
      {
        '@type': 'ListItem',
        position: 5,
        url: `${SITE_URL}/ats/scanner`,
        name: 'Free ATS Keyword Scanner — In-Browser, No Signup',
      },
      {
        '@type': 'ListItem',
        position: 6,
        url: `${SITE_URL}/tools/jd-decoder`,
        name: 'JD Decoder — Read Between the Lines of Any Job Description',
      },
      {
        '@type': 'ListItem',
        position: 7,
        url: `${SITE_URL}/tools/no-interviews-diagnostic`,
        name: 'No Interviews Diagnostic — Free 60-Second Verdict',
      },
      {
        '@type': 'ListItem',
        position: 8,
        url: `${SITE_URL}/tools/jobscan-cost-calculator`,
        name: 'Job Tool Cost Calculator — Jobscan vs Vantage',
      },
      {
        '@type': 'ListItem',
        position: 9,
        url: `${SITE_URL}/tools/bullet-rewriter`,
        name: 'CV Bullet Rewriter — Diagnose Weak Bullets, Get 3 Rewrites',
      },
      {
        '@type': 'ListItem',
        position: 10,
        url: `${SITE_URL}/tools/layoff-playbook`,
        name: '30-Day Post-Layoff Playbook Generator',
      },
      {
        '@type': 'ListItem',
        position: 11,
        url: `${SITE_URL}/tools/cover-letter-compare`,
        name: 'Cover Letter A/B Comparator',
      },
      {
        '@type': 'ListItem',
        position: 12,
        url: `${SITE_URL}/tools/negotiation-script`,
        name: 'Salary Negotiation Script Generator',
      },
      {
        '@type': 'ListItem',
        position: 13,
        url: `${SITE_URL}/tools/offer-compare`,
        name: 'Job Offer Comparison Calculator',
      },
      {
        '@type': 'ListItem',
        position: 14,
        url: `${SITE_URL}/tools/thank-you-note`,
        name: 'Post-Interview Thank-You Note Generator',
      },
      {
        '@type': 'ListItem',
        position: 15,
        url: `${SITE_URL}/tools/linkedin-about`,
        name: 'LinkedIn Headline + About Rewriter',
      },
      {
        '@type': 'ListItem',
        position: 16,
        url: `${SITE_URL}/tools/recruiter-reply`,
        name: 'Recruiter Cold-DM Reply Generator',
      },
      {
        '@type': 'ListItem',
        position: 17,
        url: `${SITE_URL}/tools/cold-email-hiring-manager`,
        name: 'Cold Email to Hiring Manager Generator',
      },
      {
        '@type': 'ListItem',
        position: 18,
        url: `${SITE_URL}/tools/star-story-builder`,
        name: 'STAR Story Builder',
      },
      {
        '@type': 'ListItem',
        position: 19,
        url: `${SITE_URL}/interview-prep`,
        name: 'Interview Prep Packs by Company',
      },
      {
        '@type': 'ListItem',
        position: 20,
        url: `${SITE_URL}/interview-questions`,
        name: 'Interview Questions by Role',
      },
      {
        '@type': 'ListItem',
        position: 21,
        url: `${SITE_URL}/laid-off`,
        name: 'Layoff Recovery Guide (April-May 2026 cohort)',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${SITE_URL}/tools` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Job Search AI Tools — Cover Letter Roast, Rejection Decoder, Ghost Job Detector"
        description="Five free AI tools by Vantage AI: ATS resume checker (CV Mirror), cover letter roast, rejection email decoder, ghost-job detector, interview prep by company / role, layoff recovery guide. No signup, no upsell wall."
        path="/tools"
        jsonLd={[itemListSchema, breadcrumbSchema]}
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
        {/* Header */}
        <header className="text-center mb-16">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            Vantage AI · Free tools
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            Free tools for job seekers
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Standalone tools we built and gave away. No signup, no upsell wall.
            Use them on their own, or as the front-end of a full Vantage analysis.
          </p>
        </header>

        {/* CV Mirror feature card — full width, hero treatment */}
        <article className={`${t.glass} rounded-3xl overflow-hidden`}>
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <div className="p-8 sm:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] uppercase tracking-widest font-bold text-emerald-500`}>
                  ● Free · Open · No signup
                </span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${t.text}`}>
                CV Mirror
              </h2>
              <p className={`mt-2 text-lg ${t.textSub} font-medium`}>
                See exactly what 5 ATS parsers do to your CV.
              </p>
              <p className={`mt-5 ${t.textSub} leading-relaxed`}>
                Drop your CV. Watch Workday, Greenhouse, Lever, Taleo, and iCIMS
                parse it side by side. Reading-order overlay on the actual PDF.
                Vendor-specific lint with documented quirks. No fake score, no
                signup, nothing uploads — your CV bytes never leave your browser.
              </p>

              <ul className={`mt-6 space-y-2 text-sm ${t.textSub}`}>
                <li className="flex gap-2">
                  <FileSearch className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span>Multi-vendor parse view — same CV, 5 simulated parsers</span>
                </li>
                <li className="flex gap-2">
                  <Zap className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span>Reading-order overlay shows literal text-extraction order</span>
                </li>
                <li className="flex gap-2">
                  <Shield className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span>100% client-side — privacy by architecture, not policy</span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://cv-mirror-web.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
                >
                  Open CV Mirror <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://cv-mirror-web.vercel.app/how-it-works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full ${t.cardInner} ${t.text} font-semibold transition`}
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Visual side */}
            <div
              className="hidden md:flex items-center justify-center p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(16,185,129,0.05))',
              }}
            >
              <div className="relative">
                <div className={`${t.cardInner} rounded-2xl p-6 shadow-xl text-sm w-72`}>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} mb-3`}>5 parsers, 1 CV</div>
                  <div className="space-y-2">
                    {['Workday', 'Greenhouse', 'Lever', 'Taleo', 'iCIMS'].map((p, i) => (
                      <div key={p} className="flex items-center justify-between">
                        <span className={`${t.text} font-mono text-xs`}>{p}</span>
                        <span className="text-emerald-500 text-xs">●●●●○</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#7C3AED' }}
                >
                  &lt;5 sec
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Keyword-mirror cards: capture searches like "ATS resume checker",
            "free cover letter feedback", "interview prep tools" by exposing
            the same navigation surface competitors do. Every card is real;
            no thin content. */}
        <section className="mt-16">
          <h2 className={`text-2xl sm:text-3xl font-bold ${t.text} mb-2`}>
            What are you trying to do?
          </h2>
          <p className={`${t.textSub} mb-6`}>
            Pick the tool that matches your job-search task. All free, no signup.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://cv-mirror-web.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    ATS Resume Checker
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Drop your CV. See how 5 real ATS systems (Workday, Greenhouse, Lever, Taleo, iCIMS) parse it side by side. Nothing uploads.
                  </p>
                </div>
                <FileSearch className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </a>
            <Link
              to="/roast"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Cover Letter Feedback (Roast)
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Savage but useful AI roast of your cover letter. Quotes your worst lines, names the cliché, gives the better swap. 10 seconds.
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/decode-rejection"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Rejection Email Decoder
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Paste a job rejection email — AI tells you what the recruiter actually meant + your concrete next move. 10 verdicts: ghosted, ATS-filtered, salary mismatch, experience gap, internal hire, etc.
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/ghost-job-check"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Ghost Job Detector
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Paste a job listing — AI scores how likely it's a ghost (0-100). Flags clichés, suspiciously wide salary bands, missing concrete deliverables. Saves you the wasted application.
                  </p>
                </div>
                <Target className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/ats/scanner"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · In-browser
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    ATS Keyword Scanner
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Paste your CV and a job description — see matched and missing keywords, with a real (not invented) coverage percentage. Runs entirely in your browser. Nothing uploaded.
                  </p>
                </div>
                <ScanLine className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/jd-decoder"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · In-browser
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    JD Decoder
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Paste any job description — get hidden seniority signals, ghost-job risk, remote-vs-hybrid camouflage, scope red flags, and the interview rounds you should expect. Every flag links to its source phrase.
                  </p>
                </div>
                <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/bullet-rewriter"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · In-browser
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    CV Bullet Rewriter
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Paste one CV bullet — diagnose 7 failure modes (weak verbs, missing metrics, filler phrases, "responsible for" framing, acronym density, pronouns, length) and get 3 stronger rewrite templates with examples.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/layoff-playbook"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · Markdown export
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    30-Day Layoff Playbook
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Pick role, country, severance, visa — get a personalised day-by-day plan for the first 30 days post-layoff. Branches on H-1B 60-day clock, UK Skilled Worker, EU citizen. Markdown export so you can paste into Notion / Obsidian.
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/cover-letter-compare"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · In-browser
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Cover Letter A/B Comparator
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Paste two cover letter drafts — get side-by-side scoring across 8 dimensions (opening strength, metrics, filler, passive voice, pronouns, specificity, length, total). Pick the winner with confidence.
                  </p>
                </div>
                <GitCompareArrows className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/negotiation-script"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · Highest-leverage moment
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Salary Negotiation Script
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Plug in offer details + target asks (base, signing, RSU). Get a personalised email or phone-call script branched on tone (collaborative / firm) plus 7 talking points that win negotiations. The 10-minute conversation that moves base salary £10k+.
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/offer-compare"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · 4-year side-by-side
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Job Offer Comparison Calculator
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Compare 2 offers across 4 years: base + bonus + signing + RSU + refresh + PTO + remote. Discounts public RSU for stock-price risk, private equity for illiquidity. Pure client-side. No data leaves your browser.
                  </p>
                </div>
                <Calculator className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/thank-you-note"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · Tone-calibrated
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Post-Interview Thank-You Note
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Pick tone, round type, sentiment, hours since call. Get a calibrated note that anchors on a specific topic from your conversation, plus 7 sending tips. The wrong thank-you note actively harms candidates; the right one moves the needle.
                  </p>
                </div>
                <Mail className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/linkedin-about"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · 2-3 variants
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    LinkedIn Headline + About Rewriter
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Pick stance (open-to-work / employed-passive / building / consulting). Get 2-3 rewrite variants with rationale + diagnosis of weak signals + 7 LinkedIn-specific tips. Branches on layoff status, target companies, years experience.
                  </p>
                </div>
                <Linkedin className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/recruiter-reply"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · High-frequency moment
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Recruiter Cold-DM Reply
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    A recruiter just slid into your DMs. Pick intent (interested / not now / not a fit / not sure) and seniority alignment, get calibrated reply variants plus 7 tips on what to ask back. Never burn the bridge; never reply too fast.
                  </p>
                </div>
                <Inbox className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/cold-email-hiring-manager"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · ATS-bypass move
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Cold Email to Hiring Manager
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Bypassing the ATS is the highest-leverage single move in 2026 hiring. Pick a hook (mutual connection / recent post / product use / shared history / public artefact / cold) and stage. Get 2-3 calibrated email variants plus 8 sending tips.
                  </p>
                </div>
                <Send className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/star-story-builder"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · 16 principles
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    STAR Story Builder
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Per the 2026 hiring report, you need 8-10 stories with REAL FAILURES. Plug Situation / Task / Action / Result + pick a principle (Ownership / Bias for Action / 14 more). Get 3 calibrated variants (Classic STAR, 45-second, Principle-calibrated) + 7 rehearsal tips.
                  </p>
                </div>
                <Layers className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/interview-prep"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free guides · 20 companies
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Interview Prep by Company
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Google, Meta, Amazon, Stripe, OpenAI, Anthropic and 14 more. Each pack: signature interview pattern, 12 likely questions, common mistakes.
                  </p>
                </div>
                <Target className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/interview-questions"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free guides · 13 roles
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Interview Questions by Role
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Software Engineer, PM, Data Scientist, Frontend, DevOps, Marketing Manager, and more. 12 most-asked questions per role.
                  </p>
                </div>
                <Briefcase className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/no-interviews-diagnostic"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · 60s · No signup
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    "No Interviews" Diagnostic
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    200 applications, zero interviews? 5-question diagnostic routes you to one of 7 failure modes
                    (ATS filter / positioning / targeting / proof / market / overqualified) with a concrete next move.
                    Computed in your browser — no signup, no LLM call.
                  </p>
                </div>
                <Activity className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/tools/jobscan-cost-calculator"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free · No signup · Calculator
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Job Tool Cost Calculator
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    What a year of Jobscan, Resume Worded, Final Round AI, Teal, and LiveCareer would actually cost
                    — versus Vantage's £5 one-time top-up. Drag the sliders and see the spread for yourself.
                  </p>
                </div>
                <Calculator className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/laid-off"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free guide · 5 companies
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    Layoff Recovery Playbook
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    Specifically for the April-May 2026 wave (Oracle, Meta, ASML, Snap, Nike, Cloudflare). What to fix on your CV first, what to do in week 1, when to apply.
                  </p>
                </div>
                <Users className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
            <Link
              to="/playbook"
              className={`${t.glass} rounded-xl p-5 hover:border-violet-400/40 transition group block`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs uppercase tracking-widest ${t.textMuted} font-bold`}>
                    Free PDF playbook
                  </div>
                  <h3 className={`text-lg font-bold ${t.text} mt-1 group-hover:text-violet-500 transition`}>
                    The Vantage Playbook
                  </h3>
                  <p className={`text-sm ${t.textSub} mt-2 leading-relaxed`}>
                    The exact 6-step routine I used when applying to 50 jobs a week. CV format, parse-test, application prep, mock interview, follow-up.
                  </p>
                </div>
                <Zap className="w-5 h-5 text-violet-400 flex-shrink-0" />
              </div>
            </Link>
          </div>
        </section>

        {/* Recommended workflow callout */}
        <section className={`mt-12 ${t.cardInner} rounded-2xl p-6 sm:p-8`}>
          <h3 className={`text-xl font-bold ${t.text}`}>Recommended workflow</h3>
          <p className={`mt-2 ${t.textSub}`}>
            For the highest hit-rate on applications:
          </p>
          <ol className={`mt-3 space-y-2 ${t.textSub} list-decimal pl-6`}>
            <li>
              Run your CV through{' '}
              <a
                href="https://cv-mirror-web.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:underline font-semibold"
              >
                CV Mirror
              </a>
              {' '}— fix any parse issues a real ATS would have.
            </li>
            <li>
              Open <Link to="/" className="text-violet-500 hover:underline font-semibold">Vantage</Link>,
              upload the (now ATS-clean) CV, paste the job link.
            </li>
            <li>
              90 seconds later you have a full prep pack: company brief, tailored cover letter, mock interview questions, CV fit score, and a 5-minute interview pitch outline.
            </li>
          </ol>
        </section>

        {/* CTA */}
        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Ready for the full pack?</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            CV Mirror gets your CV past the parser. Vantage gets you ready for the interview.
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
