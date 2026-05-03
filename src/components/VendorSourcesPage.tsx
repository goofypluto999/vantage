import { Link } from 'react-router-dom';
import { ExternalLink, BookOpen, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

interface SourceEntry {
  vendor: string;
  slug: string;
  category: 'docs' | 'help' | 'changelog' | 'spec' | 'wiki';
  title: string;
  url: string;
  notes: string;
  lastVerified: string;
}

const SOURCES: SourceEntry[] = [
  // Workday
  { vendor: 'Workday', slug: 'workday', category: 'docs', title: 'Workday HCM Documentation Hub', url: 'https://doc.workday.com/', notes: 'Canonical doc index for the entire Workday HCM platform. Recruiting / talent docs nested.', lastVerified: '2026-05-01' },
  { vendor: 'Workday', slug: 'workday', category: 'help', title: 'Workday Community (login required)', url: 'https://community.workday.com/', notes: 'Customer community with detailed configuration discussions. Most useful pages cited via secondary sources.', lastVerified: '2026-05-01' },

  // Greenhouse
  { vendor: 'Greenhouse', slug: 'greenhouse', category: 'help', title: 'Greenhouse Support Center', url: 'https://support.greenhouse.io/', notes: 'Canonical reference for Greenhouse parser behaviour, resume formatting, and section parsing rules.', lastVerified: '2026-05-01' },
  { vendor: 'Greenhouse', slug: 'greenhouse', category: 'docs', title: 'Greenhouse Developer Documentation', url: 'https://developers.greenhouse.io/', notes: 'API and webhook documentation. Includes resume-parsing endpoint shape.', lastVerified: '2026-05-01' },

  // Lever
  { vendor: 'Lever', slug: 'lever', category: 'help', title: 'Lever Help Center', url: 'https://help.lever.co/', notes: 'Resume parsing behaviour, file format support, header/footer handling all documented here.', lastVerified: '2026-05-01' },
  { vendor: 'Lever', slug: 'lever', category: 'docs', title: 'Lever API Documentation', url: 'https://hire.lever.co/developer/documentation', notes: 'API surface including the candidate.parsedResume field shape.', lastVerified: '2026-05-01' },

  // Taleo (Oracle)
  { vendor: 'Taleo', slug: 'taleo', category: 'docs', title: 'Oracle Talent Acquisition Cloud Documentation', url: 'https://docs.oracle.com/en/cloud/saas/talent-management/', notes: 'Taleo is part of Oracle Talent Management Cloud. Resume parsing config + customer-tenant variability documented here.', lastVerified: '2026-05-01' },

  // iCIMS
  { vendor: 'iCIMS', slug: 'icims', category: 'docs', title: 'iCIMS Talent Cloud Documentation', url: 'https://www.icims.com/customer-resources/', notes: 'Customer-facing documentation hub. Resume parser is highly configurable per tenant.', lastVerified: '2026-05-01' },

  // Wikipedia anchors
  { vendor: 'General', slug: 'general', category: 'wiki', title: 'Wikipedia: Applicant Tracking System', url: 'https://en.wikipedia.org/wiki/Applicant_tracking_system', notes: 'Encyclopaedic overview of ATS history, market, and parsing approaches. Useful as a top-level citation.', lastVerified: '2026-05-01' },
  { vendor: 'General', slug: 'general', category: 'wiki', title: 'Wikipedia: Résumé', url: 'https://en.wikipedia.org/wiki/R%C3%A9sum%C3%A9', notes: 'Format conventions, regional differences (US résumé vs UK CV), and historical context.', lastVerified: '2026-05-01' },
  { vendor: 'General', slug: 'general', category: 'wiki', title: 'Wikipedia: Workday, Inc.', url: 'https://en.wikipedia.org/wiki/Workday,_Inc.', notes: 'Market position, customer count, recent acquisitions. Useful for "why Workday matters" framing.', lastVerified: '2026-05-01' },

  // Standards / specs
  { vendor: 'General', slug: 'general', category: 'spec', title: 'JSON Resume open standard', url: 'https://jsonresume.org/', notes: 'Open standard for résumé JSON. No major ATS imports it natively but it\'s the closest thing to a portable format.', lastVerified: '2026-05-01' },
  { vendor: 'General', slug: 'general', category: 'spec', title: 'HR Open Standards Consortium', url: 'https://hropenstandards.org/', notes: 'XML standards for HR data interchange (HR-XML). Older but still referenced in enterprise integrations.', lastVerified: '2026-05-01' },
];

const CATEGORY_LABELS: Record<SourceEntry['category'], string> = {
  docs: 'Official documentation',
  help: 'Help center / customer-facing',
  changelog: 'Changelog / release notes',
  spec: 'Standard / specification',
  wiki: 'Wikipedia / encyclopaedic',
};

const CATEGORY_ORDER: SourceEntry['category'][] = ['docs', 'help', 'spec', 'wiki', 'changelog'];

/**
 * /vendor-sources — public-source citation hub for the ATS Guide cluster.
 *
 * Rationale: pages that link to authoritative third-party sources (research
 * showed 2-5 outbound links boost LLM citation rate). This hub serves both
 * as a useful resource (researchers / journalists need it) and as a topical
 * authority signal for the /ats cluster.
 *
 * Targets queries: "ATS documentation links", "workday parser docs",
 * "greenhouse api docs", and acts as a backlink magnet.
 */
export default function VendorSourcesPage() {
  const { t } = useTheme();

  // Group sources by vendor for the page render
  const byVendor = SOURCES.reduce<Record<string, SourceEntry[]>>((acc, s) => {
    if (!acc[s.vendor]) acc[s.vendor] = [];
    acc[s.vendor].push(s);
    return acc;
  }, {});

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ATS Guide', item: `${SITE_URL}/ats` },
      { '@type': 'ListItem', position: 3, name: 'Vendor Sources', item: `${SITE_URL}/vendor-sources` },
    ],
  };

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'ATS Vendor Documentation Index',
    description: 'A curated list of canonical public documentation, help-center articles, and Wikipedia entries for the 5 major Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, iCIMS).',
    url: `${SITE_URL}/vendor-sources`,
    keywords: 'ATS, Workday, Greenhouse, Lever, Taleo, iCIMS, resume parsing, recruiting',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      name: 'Vantage Labs',
      url: SITE_URL,
    },
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="ATS vendor documentation — canonical source index"
        description="Public documentation, help centers, and Wikipedia entries for the 5 major Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, iCIMS). Use these as primary sources when researching ATS parsing behaviour."
        path="/vendor-sources"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/laid-off" className="text-[#4F46E5] font-semibold hover:underline">Just laid off?</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <div className="text-xs text-[#4F46E5] font-semibold mb-3">
          <Link to="/ats" className="hover:underline">ATS Guide</Link> / Vendor Sources
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          ATS vendor sources —
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">canonical documentation index.</span>
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed mb-3`}>
          Every claim about ATS parsing behaviour on this site cites a public source. This page collects them. Use it as a primary research index when writing about Workday, Greenhouse, Lever, Taleo, or iCIMS — these are the canonical URLs.
        </p>
        <p className={`text-sm ${t.textMuted}`}>
          We verify each link quarterly. Last full audit: 2026-05-01. If a link rots, email <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="text-[#4F46E5] hover:underline">giovanni.sizino.ennes@hotmail.co.uk</a> and we'll fix.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        {Object.entries(byVendor).map(([vendor, entries]) => (
          <div key={vendor} className="mb-10">
            <h2 className={`text-2xl font-bold ${t.text} mb-1`}>{vendor}</h2>
            {vendor !== 'General' && (
              <Link to={`/ats/${entries[0].slug}`} className="text-sm text-[#4F46E5] hover:underline mb-4 inline-block">
                See our parser breakdown for {vendor} →
              </Link>
            )}
            <div className="space-y-4 mt-4">
              {CATEGORY_ORDER.flatMap((cat) =>
                entries.filter((e) => e.category === cat).map((e) => (
                  <div key={e.url} className={`${t.glass} rounded-xl p-5`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-base font-semibold ${t.text} hover:text-[#4F46E5] inline-flex items-center gap-2`}
                        >
                          {e.title} <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className={`text-xs ${t.textMuted} mt-1`}>
                          {CATEGORY_LABELS[e.category]}
                        </p>
                      </div>
                      <span className={`text-xs ${t.textMuted} font-mono whitespace-nowrap`}>
                        verified {e.lastVerified}
                      </span>
                    </div>
                    <p className={`text-sm ${t.textSub}`}>{e.notes}</p>
                    <p className="text-xs text-[#888] mt-2 break-all font-mono">{e.url}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className={`${t.glass} rounded-2xl p-6`}>
          <BookOpen className="w-6 h-6 text-[#4F46E5] mb-3" />
          <h2 className={`text-xl font-bold ${t.text} mb-2`}>Why this page exists</h2>
          <p className={`text-sm ${t.textSub} mb-3`}>
            Most ATS-related blog content makes claims like "Workday strips emoji" without citing a source. The claims may even be true, but the lack of sourcing makes them harder to use in serious research.
          </p>
          <p className={`text-sm ${t.textSub} mb-3`}>
            We maintain this index because every claim on the <Link to="/ats" className="text-[#4F46E5] hover:underline">ATS Guide</Link> derives from one of these sources. If you're writing a paper, a journalist piece, or a comparison guide, start here.
          </p>
          <p className={`text-sm ${t.textSub}`}>
            We don't claim ownership of the documentation — these are external links to vendor sites and Wikipedia. Use them as you would any primary source: read with skepticism, cross-reference, and check the publication date.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-6 text-center`}>
          <ShieldCheck className="w-8 h-8 text-[#4F46E5] mx-auto mb-3" />
          <h2 className={`text-xl font-bold ${t.text} mb-2`}>Want to fix or add a source?</h2>
          <p className={`text-sm ${t.textSub} max-w-xl mx-auto mb-4`}>
            We accept PRs to the underlying data file at <code className={`${t.cardInner} px-1 rounded text-xs`}>src/components/VendorSourcesPage.tsx</code>. Email if you don't have a GitHub workflow set up.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk?subject=Vendor%20Sources%20%E2%80%94%20suggestion"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-full text-sm font-semibold hover:-translate-y-0.5 transition-all"
          >
            Email a suggestion
          </a>
        </div>
      </section>
    </div>
  );
}
