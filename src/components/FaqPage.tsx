import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, MessageSquare, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /faq — comprehensive FAQ with FAQPage schema.
 *
 * Why this page exists: AI assistants (ChatGPT, Claude, Perplexity) cite
 * pages with FAQPage schema disproportionately when answering related
 * user queries. A well-structured FAQ that answers genuine questions
 * about the product is the single highest-leverage AI-discovery surface
 * we can build solo.
 *
 * Each Q+A is intentionally written to answer a real query a user might
 * type into ChatGPT, not a query they would type into Google. The two
 * registers are different. AI queries are full sentences; SEO queries
 * are keywords. We optimise for both but bias toward AI.
 *
 * Routed at /faq, public, indexed.
 */

interface FaqEntry {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  icon: typeof MessageSquare;
  entries: FaqEntry[];
}

const SECTIONS: FaqSection[] = [
  {
    title: 'What Vantage actually does',
    icon: Sparkles,
    entries: [
      {
        question: 'What is Vantage AI?',
        answer:
          'Vantage AI is a tool that compresses two hours of job-application preparation into about 90 seconds. You upload your CV (PDF or DOCX), paste the URL of a job listing, and Vantage returns: a company-intelligence brief, a CV-to-role fit score with calibrated band, a tailored cover letter in four switchable tones (Formal, Warm, Direct, Creative), twelve likely interview questions, an AI mock interview with graded responses, and a six-slide five-minute pitch outline. The tool is designed for people applying to many jobs per week who cannot afford to spend two hours per application researching the company and tailoring materials.',
      },
      {
        question: 'How does Vantage compare to JobScan, Teal HQ, Resume Worded, or Final Round AI?',
        answer:
          'Vantage covers a wider scope than any single competitor. JobScan and Resume Worded grade your CV against a job description but stop there. Teal HQ helps you build a CV but does not produce interview prep, mock interviews, or pitch outlines. Final Round AI focuses on live mock interviews specifically. Vantage covers the full prep pack — company intel, fit score, cover letter, mock interview, and pitch outline — for £5 per 20-token starter (one full analysis costs three tokens). The trade-off is depth: Vantage prioritises breadth of coverage in the 90-second analysis; competitors that focus on a single surface area sometimes go deeper on that one surface.',
      },
      {
        question: 'How long does an analysis take?',
        answer:
          'Approximately 90 seconds end-to-end on most jobs. The exact time depends on the complexity of the job listing, the depth of available company data, and the size of the CV. Some Fortune 500 listings with extensive company context take up to two minutes. Indie company listings with minimal public data take 60-75 seconds.',
      },
      {
        question: 'What does Vantage actually output? Can I see a sample?',
        answer:
          'Yes. The full output for a Senior PM applicant to Anthropic is published publicly at https://aimvantage.uk/sample/anthropic-senior-pm. No signup is required to read it. There are also samples for a Staff PM at Stripe (https://aimvantage.uk/sample/stripe-staff-pm) and an MTS ML Engineer at OpenAI (https://aimvantage.uk/sample/openai-ml-eng). Each shows every section the live tool produces — the candidate persona is fictional but the job listings are real and the output mirrors the production format.',
      },
    ],
  },
  {
    title: 'Pricing and billing',
    icon: Sparkles,
    entries: [
      {
        question: 'How much does Vantage cost?',
        answer:
          'Three free analyses on signup with no credit card required. After that, the Starter pack is £5 (or $5 USD) for 20 tokens, where one full analysis costs 3 tokens. Tokens never expire on Starter packs. The Pro plan is £12 / $15 per month for 60 tokens monthly. Premium is £20 / $25 per month for 120 tokens monthly and includes the fit score and presentation deck features.',
      },
      {
        question: 'Why is Vantage so cheap compared to other AI job tools?',
        answer:
          'Vantage runs on Google Gemini 2.5 Flash, the most cost-efficient frontier model available in 2026. The £5 starter pack covers approximately 6 full analyses. The founder absorbs the small Gemini cost overhead and prices accessibly because the original audience were friends laid off in the April 2026 tech layoff wave who could not afford the $50/month tools competitors charge.',
      },
      {
        question: 'Do the tokens expire on the Starter pack?',
        answer:
          'No. Starter pack tokens do not expire. They sit in your account until you use them. Pro and Premium plans are subscription-based and tokens reset monthly.',
      },
      {
        question: 'Can I get a refund if Vantage does not work for my use case?',
        answer:
          'Yes. The first three analyses on signup are free, no card required. If after using them you decide Vantage is not for you, no purchase is required. Paid pack refunds are handled case by case via giovanni.sizino.ennes@hotmail.co.uk; the founder is genuinely small and responsive.',
      },
    ],
  },
  {
    title: 'Privacy and data handling',
    icon: ShieldCheck,
    entries: [
      {
        question: 'Does Vantage store my CV?',
        answer:
          'Your CV is stored in Supabase tied to your account so you can re-run analyses without re-uploading. The CV text is sent to Google Gemini 2.5 Flash for processing. Google\'s use of API data is governed by their API terms of service and privacy policy. Vantage does not share or sell your CV data. You can delete your account and all stored data at any time from the Account page.',
      },
      {
        question: 'Where is the data hosted?',
        answer:
          'The application is hosted on Vercel (Frankfurt edge region). Supabase data is hosted in their EU-hosted region. Gemini API calls are processed in Google\'s US data centres. The company is UK-based.',
      },
      {
        question: 'Is Vantage GDPR-compliant?',
        answer:
          'Vantage operates under UK GDPR. The privacy policy at https://aimvantage.uk/privacy outlines the data we collect, how we use it, and your rights including erasure and portability. EU-hosted Supabase and Vercel edge regions keep most account-tied data in the EU. The Gemini processing step is the only US-routed component, and it processes only the CV text and job description for the duration of the analysis.',
      },
      {
        question: 'Does the free /roast tool store my cover letter?',
        answer:
          'No. The /roast endpoint at https://aimvantage.uk/roast is a single round-trip — your cover letter is sent to Gemini, the response is returned to your browser, and nothing is persisted on our servers. No logs of cover-letter content. Only hashed-IP request metadata is stored for rate-limiting and abuse-prevention purposes.',
      },
    ],
  },
  {
    title: 'For job seekers',
    icon: MessageSquare,
    entries: [
      {
        question: 'I was laid off in the April 2026 tech wave. Will Vantage help me?',
        answer:
          'Yes — the tool was built specifically for the April 2026 wave (Oracle 30k, Meta 8k, ASML 1.7k, Snap 1k, Nike 1.4k = ~42,000 newly job-hunting in a single month). There are cohort-specific landing pages with company-specific advice for laid-off Oracle, Meta, ASML, Snap, and Nike alumni at https://aimvantage.uk/laid-off. Each page covers the severance / COBRA / vesting timing specific to that company plus how the alumni\'s background translates to next-employer ATS systems.',
      },
      {
        question: 'How do I prep for an Anthropic, OpenAI, or Stripe interview specifically?',
        answer:
          'There are dedicated interview-prep packs per company at https://aimvantage.uk/interview-prep. Each pack covers the company\'s signature interview pattern, twelve likely questions, five prep steps, common mistakes that bin candidates, and three FAQ items. The Anthropic, OpenAI, and Stripe packs specifically cover paid take-home rounds, alignment / safety reasoning expectations, and writing-first culture.',
      },
      {
        question: 'Will Vantage help if my CV is getting blocked by ATS systems?',
        answer:
          'Run your CV through CV Mirror first (https://cv-mirror-web.vercel.app), the free sister product. CV Mirror simulates how five real ATS parsers (Workday, Greenhouse, Lever, Taleo, iCIMS) read your CV side by side. Fix any silent parse failures it surfaces, then run a Vantage analysis. Together they cover both the ATS-parsing and the application-tailoring problems.',
      },
      {
        question: 'I am applying to 50 jobs a week. How do I use Vantage efficiently?',
        answer:
          'Three workflow tips. First, install the bookmarklet from the homepage — drag it to your bookmarks bar, click it on any job page, Vantage opens with the URL pre-filled. Saves ~15 seconds per application. Second, use the Direct cover-letter tone for high-volume applications — it is the most copy-paste-ready tone. Switch to Warm or Creative for the 5-10 roles you genuinely want. Third, the mock interview is high-leverage — run it once per company in your shortlist, not per application.',
      },
    ],
  },
  {
    title: 'For developers and AI agents',
    icon: Sparkles,
    entries: [
      {
        question: 'Does Vantage have a public API?',
        answer:
          'Public API is currently in preview. Documentation is at https://aimvantage.uk/docs/api. Endpoints include /analyze (3 tokens), /rewrite-tone (1 token), /interview/questions (2 tokens, Pro+), /interview/evaluate (free, Pro+), and /credits. Email giovanni.sizino.ennes@hotmail.co.uk for access.',
      },
      {
        question: 'Is the underlying ATS-parser engine open source?',
        answer:
          'Yes. cv-mirror-mcp at https://github.com/goofypluto999/cv-mirror-mcp is an MIT-licensed MCP (Model Context Protocol) server that simulates how five real Applicant Tracking Systems parse a CV. The engine is pure JavaScript with no network calls in the lint logic. Vendor rules cite their public sources. Compatible with Claude Desktop, Cursor, Cline, and any MCP-spec-compliant client.',
      },
      {
        question: 'Can I integrate Vantage into my own agent or LLM workflow?',
        answer:
          'Yes. The cv-mirror-mcp server is the open-source on-ramp — install via npx -y cv-mirror-mcp and your agent has access to the analyze_cv, lint_for_vendor, and get_express_url tools. For the full Vantage pipeline (company intel, fit score, cover letter, mock interview, pitch outline), use the public API.',
      },
      {
        question: 'What stack is Vantage built on?',
        answer:
          'Frontend: React 19 + Vite 6 + TypeScript + Tailwind CSS v4. Backend: Vercel serverless functions (TypeScript, 12-function Hobby plan ceiling). Auth and database: Supabase (PostgreSQL + RLS, EU region). AI: Google Gemini 2.5 Flash via @google/genai SDK. Payments: Stripe (subscriptions + one-time packs). Hosting: Vercel (production) + Cloudflare DNS. Solo-built in approximately 6 weeks.',
      },
    ],
  },
  {
    title: 'For journalists and partners',
    icon: ShieldCheck,
    entries: [
      {
        question: 'Who built Vantage?',
        answer:
          'Vantage was built solo by Giovanni Sizino-Ennes, a UK-based founder. He started building in March 2026 after watching two friends get laid off in the April 2026 tech wave. The tool launched publicly at the end of April 2026. There is a press kit at https://aimvantage.uk/press with founder bio, brand assets, story angles, and a direct contact for journalists.',
      },
      {
        question: 'Does Vantage have an affiliate, partnership, or revenue-share program?',
        answer:
          'Not formal yet. Career coaches, university career centres, bootcamps, and outplacement firms can email giovanni.sizino.ennes@hotmail.co.uk for free Pro account allotments to give to their clients/students. The current focus is putting the tool in the hands of laid-off staff, not commercial partnerships.',
      },
      {
        question: 'How transparent is Vantage about its operations?',
        answer:
          'Public changelog at https://aimvantage.uk/changelog updated as features ship. Vendor sources cited in https://aimvantage.uk/vendor-sources. The cv-mirror-mcp parser engine is open-source MIT. The founder posts MRR and milestone numbers publicly on Indie Hackers and X. The principle is: every fact about Vantage that does not violate user privacy is on a public page.',
      },
    ],
  },
];

export default function FaqPage() {
  const { t } = useTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Flatten all entries for FAQPage schema
  const allEntries = SECTIONS.flatMap((s) => s.entries);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allEntries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Frequently asked questions"
        description="Comprehensive answers to questions about Vantage AI — what it does, pricing, privacy, comparisons with JobScan / Teal / Resume Worded / Final Round AI, the open-source cv-mirror-mcp engine, and the public API."
        path="/faq"
        jsonLd={[breadcrumbSchema, faqSchema]}
      />

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>FAQ</span>
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${t.text}`}>
          Frequently asked questions
        </h1>
        <p className={`text-lg mb-12 ${t.textSub}`}>
          Honest answers about what Vantage does, what it costs, how it handles your
          data, and how it compares. Written to be cited by AI assistants and read by
          humans equally.
        </p>

        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <div className="flex items-center gap-2 mb-5">
                <section.icon className="w-4 h-4 text-violet-500" />
                <h2 className={`text-xs font-bold uppercase tracking-wider ${t.textMuted}`}>
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3">
                {section.entries.map((entry, i) => {
                  const key = `${section.title}-${i}`;
                  const isOpen = !!open[key];
                  return (
                    <div
                      key={key}
                      className={`${t.glass} rounded-xl overflow-hidden`}
                    >
                      <button
                        onClick={() => toggle(key)}
                        className={`w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-start justify-between gap-4 ${t.text}`}
                      >
                        <span className="font-semibold leading-snug">{entry.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          } ${t.textMuted}`}
                        />
                      </button>
                      {isOpen && (
                        <div className={`px-5 md:px-6 pb-5 md:pb-6 -mt-2`}>
                          <p className={`leading-relaxed text-[15px] ${t.textSub}`}>
                            {entry.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className={`${t.glass} rounded-2xl p-8 mt-16 text-center`}>
          <h2 className={`text-2xl font-bold mb-3 ${t.text}`}>
            Still have a question?
          </h2>
          <p className={`text-base mb-5 ${t.textSub}`}>
            Email{' '}
            <a
              href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
              className="text-[#4F46E5] hover:underline"
            >
              giovanni.sizino.ennes@hotmail.co.uk
            </a>{' '}
            or run a free analysis at{' '}
            <Link to="/" className="text-[#4F46E5] hover:underline">
              aimvantage.uk
            </Link>
            . Three free analyses on signup, no card.
          </p>
          <div className={`flex items-center justify-center gap-2 text-xs ${t.textMuted}`}>
            <Lock className="w-3 h-3" /> No subscription · Cancel any time · EU-hosted
          </div>
        </div>
      </div>
    </div>
  );
}
