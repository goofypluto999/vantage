import { Link } from 'react-router-dom';
import { Mail, Download, ExternalLink, Calendar, Briefcase, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /press — press kit page for journalists.
 *
 * Standard PR-kit format: founder bio, company facts, brand assets, story
 * angles, contact. Targets queries like "vantage ai press kit", "vantage labs
 * founder", and gets discovered when journalists Google the company.
 */
export default function PressPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Press', item: `${SITE_URL}/press` },
    ],
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vantage Labs',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-512.png`,
    foundingDate: '2026-02',
    founder: {
      '@type': 'Person',
      name: 'Giovanni Sizino-Ennes',
      jobTitle: 'Founder',
    },
    description: 'AI job preparation tool. Compresses 2 hours of application prep into 90 seconds. Built solo in 60 days.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'press',
      email: 'giovanni.sizino.ennes@hotmail.co.uk',
    },
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Press kit — Vantage Labs"
        description="Press kit for journalists covering Vantage AI and CV Mirror. Founder bio, key facts, brand assets, story angles, and direct contact."
        path="/press"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      {/* Nav */}
      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/blog" className={`${t.textSub} hover:${t.text}`}>Blog</Link>
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/laid-off" className="text-[#4F46E5] font-semibold hover:underline">Just laid off?</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">For journalists</p>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} mb-6`}>
          Press kit
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed`}>
          Vantage Labs is a UK solo-founder AI tools company. We make Vantage AI (paid job
          application prep tool) and CV Mirror (free open-source ATS scanner). Below is
          everything a journalist or analyst needs in one page.
        </p>
      </section>

      {/* Quick facts */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        <div className={`${t.glass} rounded-2xl p-8`}>
          <h2 className={`text-xl font-bold ${t.text} mb-4`}>Quick facts</h2>
          <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Company</dt>
              <dd className={`text-sm ${t.text}`}>Vantage Labs</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Founder</dt>
              <dd className={`text-sm ${t.text}`}>Giovanni Sizino-Ennes (solo)</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>HQ</dt>
              <dd className={`text-sm ${t.text}`}>United Kingdom</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Founded</dt>
              <dd className={`text-sm ${t.text}`}>February 2026</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Product launch</dt>
              <dd className={`text-sm ${t.text}`}>April 2026 (60 days build)</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Funding</dt>
              <dd className={`text-sm ${t.text}`}>Self-funded · No VC</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Team size</dt>
              <dd className={`text-sm ${t.text}`}>1 (solo)</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Tech stack</dt>
              <dd className={`text-sm ${t.text}`}>React, Vite, Supabase, Stripe, Gemini 2.5</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Open source</dt>
              <dd className={`text-sm ${t.text}`}>cv-mirror-mcp (MIT)</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Press contact</dt>
              <dd className={`text-sm ${t.text}`}>
                <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="text-[#4F46E5] hover:underline">
                  giovanni.sizino.ennes@hotmail.co.uk
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* What we make */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-5`}>What we make</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className={`${t.glass} rounded-2xl p-6`}>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-[#4F46E5]" />
              <h3 className={`font-bold ${t.text}`}>Vantage AI</h3>
            </div>
            <p className={`text-sm ${t.textSub} mb-3`}>
              Paid AI job application prep tool. Upload CV, paste job link, get back the full
              prep pack: company brief, tailored cover letter (4 tones), mock interview
              questions, fit score, 5-minute pitch outline. ~90 seconds per application.
            </p>
            <p className={`text-xs ${t.textMuted} mb-3`}>
              Pricing: 3 free analyses on signup, no card. £5 starter pack for 20 tokens (~6
              analyses), no subscription.
            </p>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#4F46E5] hover:underline"
            >
              aimvantage.uk <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className={`${t.glass} rounded-2xl p-6`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#4F46E5]" />
              <h3 className={`font-bold ${t.text}`}>CV Mirror</h3>
            </div>
            <p className={`text-sm ${t.textSub} mb-3`}>
              Free, fully client-side ATS scanner. Simulates how 5 real ATS systems
              (Workday, Greenhouse, Lever, Taleo, iCIMS) parse a CV — side by side. No
              signup, nothing uploads. Open-sourced as an MCP server too.
            </p>
            <p className={`text-xs ${t.textMuted} mb-3`}>
              Pricing: Free, forever. Open source under MIT.
            </p>
            <div className="flex flex-col gap-1">
              <a href="https://cv-mirror-web.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#4F46E5] hover:underline">
                cv-mirror-web.vercel.app <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://github.com/goofypluto999/cv-mirror-mcp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#4F46E5] hover:underline">
                github.com/goofypluto999/cv-mirror-mcp <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Story angles */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-5`}>Story angles we can speak to</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Why every "ATS score" tool online is making up the number',
              detail: 'Different ATSes parse CVs differently. There is no single ATS score to give. Most parse failures are silent.',
            },
            {
              title: 'The April 2026 layoff wave and what 42,000 people don\'t know about ATS parsers',
              detail: 'Oracle, Meta, ASML, Snap, Nike all cut in a single month. Most of those people will fire 100 applications without realising their multi-column CV is being scrambled by Workday.',
            },
            {
              title: 'Solo founder, 60 days build, refused to fake reviews',
              detail: 'Indie SaaS launch story with the angle that we declined to fabricate AggregateRating schema (which is increasingly common and increasingly Google-penalty-prone).',
            },
            {
              title: 'Open-sourcing the engine behind a paid product',
              detail: 'CV Mirror MCP is the open-source engine that powers the paid Vantage AI product. The decision to open-source the part that should be free, and paywall the part that costs real compute.',
            },
            {
              title: 'AI tools for laid-off employees in 2026',
              detail: 'How AI compresses the multi-hour-per-application job search workflow into something usable when you\'re applying to 30 a week.',
            },
          ].map((s, i) => (
            <div key={i} className={`${t.glass} rounded-xl p-5`}>
              <h3 className={`font-semibold ${t.text} mb-1`}>{s.title}</h3>
              <p className={`text-sm ${t.textSub}`}>{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder bio */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-5`}>Founder bio</h2>
        <div className={`${t.glass} rounded-2xl p-6`}>
          <h3 className={`text-lg font-bold ${t.text} mb-2`}>Giovanni Sizino-Ennes</h3>
          <p className={`text-sm ${t.textSub} mb-3`}>
            Solo founder of Vantage Labs. Built Vantage AI and CV Mirror in 60 days of evenings
            after burning out twice from manually applying to 30+ jobs a week. Based in the UK.
          </p>
          <p className={`text-sm ${t.textSub}`}>
            Background: technical builder, with prior experience in AI tooling, web development,
            and growth. Available for interviews, podcasts, written commentary, and quotes.
          </p>
        </div>
      </section>

      {/* Brand assets */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-5`}>Brand assets</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/logo-512.png"
            download
            className={`${t.cardInner} rounded-lg p-5 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center`}
          >
            <Download className="w-6 h-6 text-[#4F46E5] mb-2" />
            <div className={`font-semibold ${t.text} text-sm`}>Logo (512px PNG)</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>Square mark</div>
          </a>
          <a
            href="/og-image.png"
            download
            className={`${t.cardInner} rounded-lg p-5 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center`}
          >
            <Download className="w-6 h-6 text-[#4F46E5] mb-2" />
            <div className={`font-semibold ${t.text} text-sm`}>OG Image</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>1200×630, social</div>
          </a>
          <a
            href="/favicon.svg"
            download
            className={`${t.cardInner} rounded-lg p-5 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center`}
          >
            <Download className="w-6 h-6 text-[#4F46E5] mb-2" />
            <div className={`font-semibold ${t.text} text-sm`}>Favicon (SVG)</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>Vector</div>
          </a>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <Mail className="w-10 h-10 text-[#4F46E5] mx-auto mb-3" />
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Press inquiries</h2>
          <p className={`${t.textSub} max-w-xl mx-auto mb-5`}>
            Direct line to the founder. Same-day response on weekdays. Happy to do calls,
            quotes on the record, dataset shares, or written Q&amp;A. UK time zone.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk?subject=Press%20inquiry%20%E2%80%94%20Vantage"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            <Mail className="w-4 h-4" /> Email Gio directly
          </a>
          <p className={`mt-4 text-xs ${t.textMuted} flex items-center justify-center gap-2`}>
            <Calendar className="w-3 h-3" /> UK time · Same-day reply weekdays
          </p>
        </div>
      </section>
    </div>
  );
}
