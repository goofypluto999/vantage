import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Briefcase, ShieldCheck, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { getCompanyBySlug, laidOffCompanies } from '../data/laidOffCompanies';
import { atsVendors } from '../data/atsVendors';

const SITE_URL = 'https://vantage-livid.vercel.app';

/**
 * /laid-off/from/:company — programmatic pages for each company in the
 * April 2026 layoff wave.
 *
 * Targets ultra-specific queries:
 * - "oracle layoff april 2026"
 * - "meta layoff what to do next"
 * - "asml redundancy advice"
 * - "snap layoff career advice"
 * - "nike layoff next steps"
 *
 * Each page personalises the layoff cohort landing for the specific company:
 * affected count, common roles, company-specific advice, ATSes likely at the
 * next employer.
 */
export default function LaidOffFromCompanyPage() {
  const { company: companySlug } = useParams<{ company: string }>();
  const { t } = useTheme();
  const company = companySlug ? getCompanyBySlug(companySlug) : undefined;

  if (!company) {
    return <Navigate to="/laid-off" replace />;
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Just Laid Off?', item: `${SITE_URL}/laid-off` },
      { '@type': 'ListItem', position: 3, name: `From ${company.name}`, item: `${SITE_URL}/laid-off/from/${company.slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many people did ${company.name} lay off in 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${company.name} (${company.legalName}) cut ${company.affectedCount} employees, announced in ${company.announcedDate}${company.effectiveDate ? `, effective ${company.effectiveDate}` : ''}. ${company.context}`,
        },
      },
      {
        '@type': 'Question',
        name: `What roles were most affected at ${company.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Common roles in the ${company.name} 2026 layoffs: ${company.commonRoles.join(', ')}. Specific exposure varied by team and division.`,
        },
      },
      {
        '@type': 'Question',
        name: `What ATS will my next employer most likely use after ${company.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${company.name} alumni typically move to companies running ${company.likelyNextATSes.join(', ')}. Each parses CVs differently — ${company.likelyNextATSes[0]} in particular has specific quirks worth knowing about. CV Mirror (cv-mirror-web.vercel.app) simulates all five major ATSes side by side, free.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={`Just laid off from ${company.name}? Career advice for ${company.announcedDate} cohort.`}
        description={`Specific advice for ${company.name} employees affected by the ${company.announcedDate} layoffs (${company.affectedCount} cut). CV format, ATS preparation, common roles, next-employer guidance.`}
        path={`/laid-off/from/${company.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Nav */}
      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/laid-off" className={`${t.textSub} hover:${t.text}`}>All cohorts</Link>
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/blog" className={`${t.textSub} hover:${t.text}`}>Blog</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">
              3 free analyses
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="text-xs text-[#4F46E5] font-semibold mb-3">
          <Link to="/laid-off" className="hover:underline">Layoff Guide</Link> / From {company.name}
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          Just laid off from {company.name}?
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            Read this before you apply.
          </span>
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed mb-2`}>
          {company.context}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`https://cv-mirror-web.vercel.app?utm_source=vantage-laidoff-from&utm_medium=${company.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Free ATS scan (60 sec) <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/register"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 border-[#4F46E5]/30 ${t.text} hover:bg-[#4F46E5]/10`}
          >
            3 free Vantage analyses
          </Link>
        </div>
      </section>

      {/* Quick stats */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`${t.glass} rounded-xl p-5`}>
            <Users className="w-5 h-5 text-[#4F46E5] mb-2" />
            <div className={`text-2xl font-bold ${t.text}`}>{company.affectedCount}</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>Employees affected</div>
          </div>
          <div className={`${t.glass} rounded-xl p-5`}>
            <Calendar className="w-5 h-5 text-[#4F46E5] mb-2" />
            <div className={`text-base font-bold ${t.text}`}>{company.announcedDate}</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>
              {company.effectiveDate ? `Effective ${company.effectiveDate}` : 'Announced'}
            </div>
          </div>
          <div className={`${t.glass} rounded-xl p-5`}>
            <Briefcase className="w-5 h-5 text-[#4F46E5] mb-2" />
            <div className={`text-base font-bold ${t.text}`}>{company.commonRoles.length}+ roles</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>Common impacted roles</div>
          </div>
        </div>
      </section>

      {/* Specific advice */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-2`}>What's specific to {company.name} alumni</h2>
        <p className={`${t.textSub} mb-8`}>Not generic layoff advice. Things specific to your situation.</p>
        <div className="space-y-4">
          {company.specificAdvice.map((a, i) => (
            <div key={i} className={`${t.glass} rounded-xl p-6`}>
              <h3 className={`font-semibold ${t.text} mb-2`}>{a.title}</h3>
              <p className={`text-sm ${t.textSub} leading-relaxed`}>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common roles */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-5`}>Roles most commonly affected at {company.name}</h2>
        <div className="flex flex-wrap gap-2">
          {company.commonRoles.map((role) => (
            <span
              key={role}
              className={`${t.cardInner} rounded-full px-4 py-2 text-sm ${t.text}`}
            >
              {role}
            </span>
          ))}
        </div>
        <p className={`text-sm ${t.textMuted} mt-4`}>
          Each of these has a dedicated <Link to="/interview-questions" className="text-[#4F46E5] hover:underline">interview-prep pack</Link> on Vantage with the 12 most-asked questions and a 5-step prep routine.
        </p>
      </section>

      {/* ATS guidance */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold ${t.text} mb-3`}>ATSes you'll meet at your next employer</h2>
        <p className={`${t.textSub} mb-6`}>
          Companies that hire ex-{company.name} talent typically run these systems. Each parses CVs differently. Knowing which one matters before you submit.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {company.likelyNextATSes.map((atsName) => {
            const vendor = atsVendors.find((v) => v.name === atsName);
            if (!vendor) {
              return (
                <div key={atsName} className={`${t.cardInner} rounded-lg p-5`}>
                  <div className={`font-semibold ${t.text}`}>{atsName}</div>
                </div>
              );
            }
            return (
              <Link
                key={vendor.slug}
                to={`/ats/${vendor.slug}`}
                className={`${t.glass} rounded-lg p-5 hover:-translate-y-0.5 transition-all block`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`font-semibold ${t.text}`}>{vendor.name}</div>
                  <ArrowRight className="w-4 h-4 text-[#4F46E5]" />
                </div>
                <p className={`text-xs ${t.textSub}`}>{vendor.parserBehavior.split('.')[0]}.</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <ShieldCheck className="w-10 h-10 text-[#4F46E5] mx-auto mb-3" />
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>
            We built this for the moment you're in
          </h2>
          <p className={`${t.textSub} max-w-xl mx-auto mb-6`}>
            CV Mirror gets your CV past the parser (free). Vantage compresses cover-letter +
            interview prep + fit score into ~90 seconds per application (3 free, no card).
            Built solo, in 60 days, by someone who burned out twice from job-hunting at scale.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://cv-mirror-web.vercel.app?utm_source=vantage-laidoff-from&utm_medium=cta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-full text-sm font-semibold hover:-translate-y-0.5 transition-all"
            >
              Run free CV scan
            </a>
            <Link
              to="/register"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-[#4F46E5]/30 ${t.text} hover:bg-[#4F46E5]/10`}
            >
              3 free analyses
            </Link>
          </div>
        </div>
      </section>

      {/* Related cohorts */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h3 className={`text-lg font-bold ${t.text} mb-4`}>Other April 2026 cohorts</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {laidOffCompanies
            .filter((c) => c.slug !== company.slug)
            .map((c) => (
              <Link
                key={c.slug}
                to={`/laid-off/from/${c.slug}`}
                className={`${t.cardInner} rounded-lg p-4 hover:-translate-y-0.5 transition-all`}
              >
                <div className={`font-semibold ${t.text}`}>{c.name}</div>
                <div className={`text-xs ${t.textMuted} mt-1`}>{c.affectedCount} affected</div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
