import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { getVendorBySlug, atsVendors } from '../data/atsVendors';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /ats/:vendor — programmatic SEO pages for each major ATS.
 *
 * Targets long-tail queries: "workday resume parser", "greenhouse ats format",
 * "lever cv tips", "taleo cv requirements", "icims resume format" — high-intent,
 * low-competition queries.
 *
 * Heavy schema (FAQPage + BreadcrumbList + SoftwareApplication) for AEO —
 * Answer Engine Optimization. Aim: be cited by Claude / ChatGPT / Gemini when
 * users ask LLMs about ATS parsing.
 */
export default function AtsVendorPage() {
  const { vendor: vendorSlug } = useParams<{ vendor: string }>();
  const { t } = useTheme();
  const vendor = vendorSlug ? getVendorBySlug(vendorSlug) : undefined;

  if (!vendor) {
    return <Navigate to="/ats" replace />;
  }

  // Schema — FAQPage + BreadcrumbList + SoftwareApplication
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ATS Guide', item: `${SITE_URL}/ats` },
      { '@type': 'ListItem', position: 3, name: vendor.name, item: `${SITE_URL}/ats/${vendor.slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vendor.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: vendor.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Cloud',
    description: `${vendor.name} is an applicant tracking system (ATS). ${vendor.parserBehavior}`,
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={`${vendor.name} resume parser: how it reads your CV (and what to fix)`}
        description={`How the ${vendor.name} ATS parses CVs in 2026. Specific parse quirks, common failures, and the fixes that actually work. Free multi-vendor scanner included.`}
        path={`/ats/${vendor.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* Nav */}
      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/blog" className={`${t.textSub} hover:${t.text}`}>Blog</Link>
            <Link to="/laid-off" className="text-[#4F46E5] font-semibold hover:underline">Just laid off?</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">
              3 free analyses
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <div className="text-xs text-[#4F46E5] font-semibold mb-3">
          <Link to="/ats" className="hover:underline">ATS Guide</Link> / {vendor.name}
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          {vendor.name} resume parser:
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            how it reads your CV (and what to fix).
          </span>
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed mb-2`}>
          {vendor.parserBehavior}
        </p>
        <p className={`text-sm ${t.textMuted}`}>
          <strong>Market share:</strong> {vendor.marketShare}{vendor.parentCompany ? ` · Parent: ${vendor.parentCompany}` : ''}
        </p>
        <div className="mt-6">
          <a
            href={`https://cv-mirror-web.vercel.app?utm_source=vantage-ats&utm_medium=${vendor.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Test your CV against {vendor.name} (free, 60s) <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Quirks */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-2`}>How {vendor.name} parses CVs</h2>
        <p className={`${t.textSub} mb-8`}>The specific behaviors you need to know about, with concrete examples.</p>
        <div className="space-y-4">
          {vendor.quirks.map((q, i) => (
            <div key={i} className={`${t.glass} rounded-xl p-6`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className={`font-semibold ${t.text} mb-1`}>{q.title}</h3>
                  <p className={`text-sm ${t.textSub}`}>{q.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fixes */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-2`}>The fixes that actually work for {vendor.name}</h2>
        <p className={`${t.textSub} mb-8`}>Specific changes, not generic CV tips.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {vendor.fixes.map((f, i) => (
            <div key={i} className={`${t.cardInner} rounded-lg p-5`}>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className={`font-semibold ${t.text} text-sm mb-1`}>{f.title}</h3>
                  <p className={`text-xs ${t.textSub}`}>{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-6`}>Frequently asked questions about {vendor.name}</h2>
        <div className="space-y-4">
          {vendor.faqs.map((faq, i) => (
            <div key={i} className={`${t.glass} rounded-xl p-6`}>
              <h3 className={`font-semibold ${t.text} mb-2`}>{faq.question}</h3>
              <p className={`text-sm ${t.textSub} leading-relaxed`}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Test CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <ShieldCheck className="w-10 h-10 text-[#4F46E5] mx-auto mb-3" />
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>
            See exactly how {vendor.name} parses your CV
          </h2>
          <p className={`${t.textSub} max-w-xl mx-auto mb-6`}>
            CV Mirror simulates {vendor.name} alongside the other 4 major ATSes —
            Workday, Greenhouse, Lever, Taleo, iCIMS — side by side. Free, runs
            in your browser, nothing uploads.
          </p>
          <a
            href={`https://cv-mirror-web.vercel.app?utm_source=vantage-ats&utm_medium=${vendor.slug}-cta`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Run free scan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Sources */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h3 className={`text-sm font-semibold uppercase tracking-widest ${t.textMuted} mb-3`}>Sources</h3>
        <ul className={`${t.textSub} space-y-1 text-sm`}>
          {vendor.sources.map((s, i) => (
            <li key={i}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] hover:underline inline-flex items-center gap-1">
                {s.name} <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Related vendors */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h3 className={`text-lg font-bold ${t.text} mb-4`}>Other ATS parsers covered</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {atsVendors
            .filter((v) => v.slug !== vendor.slug)
            .map((v) => (
              <Link
                key={v.slug}
                to={`/ats/${v.slug}`}
                className={`${t.cardInner} rounded-lg p-4 hover:-translate-y-0.5 transition-all`}
              >
                <div className={`font-semibold ${t.text}`}>{v.name}</div>
                <div className={`text-xs ${t.textMuted} mt-1`}>{v.primaryUse.split('(')[0].trim()}</div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
