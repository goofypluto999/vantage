import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import DiagnosticCallout from './DiagnosticCallout';
import { atsVendors } from '../data/atsVendors';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /ats — hub page linking to each ATS vendor sub-page.
 *
 * Internal-link target for the per-vendor pages. Helps Google understand
 * the topical authority cluster.
 */
export default function AtsHubPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ATS Guide', item: `${SITE_URL}/ats` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="ATS Parser Guide + Free ATS Keyword Scanner — Workday, Greenhouse, Lever, Taleo, iCIMS"
        description="Specific parse behavior for each major ATS in 2026 plus a free in-browser ATS keyword scanner. How Workday handles multi-column CVs, why Greenhouse strips emoji, what Lever does with PDF headers, and more. Free, no signup, runs in your browser."
        path="/ats"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Nav */}
      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>AimVantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/blog" className={`${t.textSub} hover:${t.text}`}>Blog</Link>
            <Link to="/laid-off" className="text-[#4F46E5] font-semibold hover:underline">Just laid off?</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">
              10 free prep packs
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-4">
          ATS Parser Guide · 2026
        </p>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          How each major ATS
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            actually reads your CV.
          </span>
        </h1>
        <p className={`text-lg ${t.textSub} max-w-2xl mx-auto leading-relaxed mb-8`}>
          Every "ATS scanner" online gives you a single 0–100 score. That number is invented.
          Different parsers extract different fields. Here's the per-vendor truth — Workday,
          Greenhouse, Lever, Taleo, and iCIMS — and the specific fixes for each.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/ats/scanner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Free ATS keyword scanner <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://cv-mirror-web.vercel.app?utm_source=vantage-ats&utm_medium=hub"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold border transition ${t.textSub} hover:opacity-80 ${t.inputBorder}`}
          >
            Multi-parser test (cv-mirror) <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="max-w-2xl mx-auto mt-10 text-left">
          <DiagnosticCallout
            source="ats-hub"
            variant="emerald"
            prelude="Not sure ATS is even your bottleneck? Run the free 60-second diagnostic FIRST. ATS is just 1 of 7 failure modes — if your verdict comes back 'positioning' or 'targeting' or 'overqualified-flag', no parser fix will help. 5 questions, deterministic verdict, runs in your browser."
          />
        </div>
      </section>

      {/* Vendor cards */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-5">
          {atsVendors.map((v) => (
            <Link
              key={v.slug}
              to={`/ats/${v.slug}`}
              className={`${t.glass} rounded-2xl p-6 hover:-translate-y-1 transition-all block`}
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className={`text-xl font-bold ${t.text}`}>{v.name}</h2>
                <ArrowRight className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div className={`text-xs ${t.textMuted} mb-3`}>{v.parentCompany || 'ATS'}</div>
              <p className={`text-sm ${t.textSub} mb-3`}>{v.parserBehavior}</p>
              <div className={`text-xs ${t.textMuted}`}>{v.marketShare}</div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className={`text-xs ${t.textMuted} mb-2`}>Top quirk:</div>
                <div className={`text-sm font-medium ${t.text}`}>{v.quirks[0].title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why this matters */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8`}>
          <ShieldCheck className="w-10 h-10 text-[#4F46E5] mb-3" />
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Why this matters in 2026</h2>
          <p className={`${t.textSub} mb-3 leading-relaxed`}>
            April-May 2026 has been the worst stretch for tech layoffs since 2023. ~43,100 people
            newly job-hunting from Oracle, Meta, ASML, Snap, Nike, and Cloudflare alone. The
            recruiters are buried. The ATSes are slower than usual. Your CV is competing harder
            than it was 6 months ago.
          </p>
          <p className={`${t.textSub} mb-5 leading-relaxed`}>
            But the system rejecting you is still the same dumb parser. Most parse failures are
            silent. People send 100 applications, get 2 replies, assume the market, when usually
            it's that Workday is reading their multi-column CV in interleaved order.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/laid-off"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-full text-sm font-semibold hover:bg-[#3F36D5]"
            >
              Just laid off? Read this first <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/blog/just-laid-off-april-2026-cv-fix"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-[#4F46E5]/30 ${t.text} hover:bg-[#4F46E5]/10`}
            >
              The 3 things to fix <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
