import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, Github, Globe, ExternalLink, AlertTriangle, FileCheck2, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /about — operator transparency page.
 *
 * Built to address the Gemini-style "lacks mandatory company information" /
 * "unverified ownership" / "phishing risk" framing that hits any new domain
 * with a similar name to a more-established brand. Discloses everything we
 * truthfully can: real legal name, sole-trader status, contact email,
 * public engineering record, and the specific scam patterns we are NOT.
 *
 * Nothing on this page is invented. There is no Ltd company, no fake
 * Companies House number, no fabricated "team". One real human, building
 * in public.
 */
export default function AboutPage() {
  const { t } = useTheme();

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Giovanni Sizino Ennes',
    alternateName: 'Gio',
    jobTitle: 'Independent founder · AimVantage',
    description:
      'UK-based independent founder (sole trader) building AI tools for job seekers. Operates AimVantage (formerly Vantage AI, paid SaaS) and CV Mirror (free open-source ATS scanner).',
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/logo-512.png`,
    nationality: 'United Kingdom',
    sameAs: [
      'https://dev.to/goofypluto999',
      'https://github.com/goofypluto999',
      'https://aimvantage.uk',
      'https://cv-mirror-web.vercel.app/',
      'https://www.youtube.com/channel/UCuZxrV6LaJfGHsEvztsaB4Q',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'general',
      email: 'giovanni.sizino.ennes@hotmail.co.uk',
      availableLanguage: 'English',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="About AimVantage — Giovanni Sizino Ennes, UK independent founder"
        description="AimVantage (formerly Vantage AI) is operated by Giovanni Sizino Ennes, a UK-based independent founder (sole trader). Real name, real contact, build-in-public engineering record. Not affiliated with Vantage Recruitment, Vantage Consulting, or any other similarly named organisation."
        path="/about"
        jsonLd={[breadcrumbSchema, personSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <span className="font-bold tracking-tight">AimVantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            Try AimVantage free
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="mb-10">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            About the operator
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            One person built this.
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} leading-relaxed`}>
            AimVantage is not a faceless company. It is a single UK-based independent founder
            (sole trader), building two job-seeker tools in public. The whole operation,
            verified and contactable, is on this page.
          </p>
        </header>

        {/* Hard facts */}
        <section className={`${t.glass} rounded-2xl p-6 sm:p-8 mb-8`}>
          <h2 className={`text-xl font-bold ${t.text} mb-4 flex items-center gap-2`}>
            <FileCheck2 className="w-5 h-5 text-emerald-500" /> Hard facts (verifiable)
          </h2>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Operator (legal name)</dt>
              <dd className={t.text}>Giovanni Sizino Ennes</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Country</dt>
              <dd className={t.text}>United Kingdom</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Legal status</dt>
              <dd className={t.text}>Sole trader (no limited company)</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Direct contact</dt>
              <dd>
                <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="text-violet-400 underline hover:text-violet-300">
                  giovanni.sizino.ennes@hotmail.co.uk
                </a>
              </dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Trading name</dt>
              <dd className={t.text}>AimVantage (formerly Vantage AI, operating domain: aimvantage.uk)</dd>
            </div>
            <div>
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Founded</dt>
              <dd className={t.text}>February 2026</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>UK ICO data-protection registration</dt>
              <dd className={t.text}>
                Registered as a data controller with the UK Information Commissioner's Office
                (annual fee paid via direct debit, registration in progress as of 2026-05-08).
                {' '}<a
                  href="https://ico.org.uk/ESDWebPages/Search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 underline hover:text-violet-300 text-xs"
                >
                  Verify on the ICO public register →
                </a>
              </dd>
            </div>
          </dl>
        </section>

        {/* Public proof */}
        <section className={`${t.glass} rounded-2xl p-6 sm:p-8 mb-8`}>
          <h2 className={`text-xl font-bold ${t.text} mb-4 flex items-center gap-2`}>
            <Globe className="w-5 h-5 text-violet-500" /> Public proof (cross-checkable)
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Github className={`w-4 h-4 mt-0.5 ${t.textMuted}`} />
              <div>
                <p className={t.text}>Open-source companion tool (CV Mirror)</p>
                {/* rel="me" tells crawlers / IndieWeb / AI assistants that this
                    GitHub account is the SAME identity as the one operating
                    aimvantage.uk. Bidirectional verification is achieved when
                    the GitHub profile also links back here (see /about copy). */}
                <a
                  href="https://github.com/goofypluto999/cv-mirror-mcp"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline text-xs inline-flex items-center gap-1"
                >
                  github.com/goofypluto999/cv-mirror-mcp <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Globe className={`w-4 h-4 mt-0.5 ${t.textMuted}`} />
              <div>
                <p className={t.text}>Public engineering write-ups (DEV.to)</p>
                <a
                  href="https://dev.to/goofypluto999"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline text-xs inline-flex items-center gap-1"
                >
                  dev.to/goofypluto999 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Globe className={`w-4 h-4 mt-0.5 ${t.textMuted}`} />
              <div>
                <p className={t.text}>Free in-browser ATS keyword scanner (on-domain)</p>
                <Link
                  to="/ats/scanner"
                  className="text-violet-400 hover:text-violet-300 underline text-xs inline-flex items-center gap-1"
                >
                  aimvantage.uk/ats/scanner
                </Link>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Globe className={`w-4 h-4 mt-0.5 ${t.textMuted}`} />
              <div>
                <p className={t.text}>Free multi-parser ATS scan (companion site)</p>
                <a
                  href="https://cv-mirror-web.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline text-xs inline-flex items-center gap-1"
                >
                  cv-mirror-web.vercel.app <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className={`w-4 h-4 mt-0.5 ${t.textMuted}`} />
              <div>
                <p className={t.text}>31 long-form interview-prep deep-dives published in 2026</p>
                <Link
                  to="/blog"
                  className="text-violet-400 hover:text-violet-300 underline text-xs inline-flex items-center gap-1"
                >
                  aimvantage.uk/blog
                </Link>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Globe className={`w-4 h-4 mt-0.5 ${t.textMuted}`} />
              <div>
                <p className={t.text}>AimVantage YouTube channel</p>
                <a
                  href="https://www.youtube.com/channel/UCuZxrV6LaJfGHsEvztsaB4Q"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline text-xs inline-flex items-center gap-1"
                >
                  YouTube channel <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
          </ul>
        </section>

        {/* Microformat h-card — IndieWeb / agent-readable identity card.
            This is in ADDITION to the JSON-LD Person schema above; some
            agents and IndieWeb crawlers prefer microformats2. The class
            names are the contract — do not rename them. The visible copy
            is intentionally short (this is not a bio section) so it
            doesn't bloat the page; the rich bio lives in the visible
            sections above. */}
        <section className="h-card sr-only" aria-hidden="true">
          <span className="p-name">Giovanni Sizino Ennes</span>
          <span className="p-nickname">Gio</span>
          <span className="p-job-title">Independent founder · AimVantage</span>
          <span className="p-note">UK-based independent founder (sole trader) building AI tools for job seekers.</span>
          <a className="u-url p-name" href="https://aimvantage.uk/">AimVantage</a>
          <a className="u-email" href="mailto:hello@aimvantage.uk">hello@aimvantage.uk</a>
          <a className="u-url" rel="me" href="https://github.com/goofypluto999">GitHub</a>
          <a className="u-url" rel="me" href="https://dev.to/goofypluto999">DEV.to</a>
          <a className="u-url" rel="me" href="https://www.youtube.com/channel/UCuZxrV6LaJfGHsEvztsaB4Q">YouTube</a>
          <span className="p-country-name">United Kingdom</span>
        </section>

        {/* What we are NOT */}
        <section className={`${t.glass} rounded-2xl p-6 sm:p-8 mb-8 border-l-4 border-amber-400/50`}>
          <h2 className={`text-xl font-bold ${t.text} mb-4 flex items-center gap-2`}>
            <AlertTriangle className="w-5 h-5 text-amber-500" /> What AimVantage is <em>not</em>
          </h2>
          <p className={`${t.textSub} text-sm mb-4 leading-relaxed`}>
            Search assistants sometimes confuse this domain with similarly named UK businesses.
            For the record:
          </p>
          <ul className="space-y-2 text-sm">
            {[
              'We are NOT Vantage Recruitment, Vantage Consulting, AI-Vantage Training, or Vantagepoint AI.',
              'We are NOT a recruiter. We do not source candidates, contact employers on your behalf, or place anyone in a role.',
              'We do NOT contact users on WhatsApp, Telegram, SMS, or any unsolicited DM channel.',
              'We do NOT charge applicants for "processing", "admin", "DBS check", "background check", or "reservation" fees.',
              'We do NOT collect bank details, ID documents, or financial information directly. All payments run through Stripe Checkout.',
              'We do NOT send unsolicited job offers. We do not have access to job listings other than the URLs users paste in themselves.',
            ].map((line, i) => (
              <li key={i} className={`flex items-start gap-2 ${t.textSub}`}>
                <span className="text-amber-400 flex-shrink-0">✕</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What we ARE */}
        <section className={`${t.glass} rounded-2xl p-6 sm:p-8 mb-8 border-l-4 border-emerald-400/50`}>
          <h2 className={`text-xl font-bold ${t.text} mb-4 flex items-center gap-2`}>
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> What AimVantage <em>is</em>
          </h2>
          <ul className="space-y-2 text-sm">
            {[
              'A self-serve AI tool that takes your CV plus a job link and returns a tailored prep pack: company intel, fit score, cover letter, mock interview questions, and pitch outline.',
              'Billed transparently through Stripe Checkout: £5 one-time starter pack (20 tokens, never expires) or £12/£20/month subscription tiers. No upfront "processing" fees.',
              'Operated as a single-person UK sole-trader project — no team, no investors, no marketing budget. Building in public on a tight personal budget.',
              'Open about its limitations: outputs are AI-generated and require human review, not a substitute for genuine preparation.',
              'Privacy-first: see /privacy for what we collect, why, and how to delete it.',
            ].map((line, i) => (
              <li key={i} className={`flex items-start gap-2 ${t.textSub}`}>
                <span className="text-emerald-400 flex-shrink-0">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Direct contact CTA */}
        <section className={`${t.cardInner} rounded-2xl p-6 sm:p-8 text-center`}>
          <Mail className="w-6 h-6 text-violet-400 mx-auto mb-3" />
          <h3 className={`text-lg font-bold ${t.text} mb-2`}>Anything to flag, dispute, or ask?</h3>
          <p className={`text-sm ${t.textSub} mb-4`}>
            Email goes directly to me. No support team buffer. No script. No upsell.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
          >
            <Mail className="w-4 h-4" /> giovanni.sizino.ennes@hotmail.co.uk
          </a>
          <p className={`mt-4 text-xs ${t.textMuted}`}>
            <Link to="/privacy" className="underline hover:text-violet-400">Privacy policy</Link>
            {' · '}
            <Link to="/terms" className="underline hover:text-violet-400">Terms</Link>
            {' · '}
            <Link to="/press" className="underline hover:text-violet-400">Press kit</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
