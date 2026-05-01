import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShieldCheck, FileText, Briefcase, Clock, Users, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { laidOffCompanies } from '../data/laidOffCompanies';

const SITE_URL = 'https://vantage-livid.vercel.app';

/**
 * /laid-off — cohort-targeted landing page for April 2026 layoff wave.
 *
 * Targets long-tail queries: "just laid off CV", "Oracle layoff resume",
 * "Meta layoff what to do next", "tech layoff job search 2026".
 *
 * Distinct from / hero: empathetic-first, action-second, ATS angle hard
 * because that's the immediate cohort pain point.
 *
 * Copy is calibrated to the 42k+ tech employees laid off in April 2026
 * (Oracle 30k, Meta 8k, ASML 1.7k, Snap 1k, Nike 1.4k).
 */
export default function LaidOffPage() {
  const { t } = useTheme();

  // Schema — JobSeeker / SpecialAnnouncement / FAQPage
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Just Laid Off?', item: `${SITE_URL}/laid-off` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'I just got laid off. What is the single most important thing to fix on my CV before I apply to anything?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Run your CV through every major ATS parser. Workday, Greenhouse, Lever, Taleo, and iCIMS each read PDFs differently. Multi-column CVs get scrambled by Workday. Greenhouse strips emoji. Lever historically drops PDF header text. Most parse failures are silent — you only find out after sending 100 applications and getting 2 replies. Fix the parse first, then fix the content. CV Mirror does the parse check free, in your browser, no signup.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the job market in 2026 actually broken?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. April 2026 has been the worst month for tech layoffs since 2023, with ~42,000 people newly job-hunting from Oracle, Meta, ASML, Snap, and Nike alone. The market is congested but not broken. The reason most laid-off employees feel "ghosted" after sending 100 applications is usually silent ATS parse failures, not a broken hiring market.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long should I expect the job search to take after a tech layoff?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Median time to next role for laid-off tech workers in 2026 is 3-6 months. Faster if you compress prep time per application (current average is 1+ hour per application, manual). Vantage AI compresses that to ~90 seconds per application, which is why people applying to 30+ jobs a week use it.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Just laid off? Read this before you apply to a single job."
        description="Practical advice for tech employees laid off in April 2026 (Oracle, Meta, ASML, Snap, Nike). Free ATS scanner, 90-second job application prep, and the 3 things to fix on your CV before you apply."
        path="/laid-off"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Nav */}
      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4">
            <Link to="/blog" className={`text-sm ${t.textSub} hover:${t.text}`}>Blog</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full text-sm font-semibold hover:bg-[#3F36D5] transition-all">
              3 free analyses
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-4">
          April 2026 layoff wave · Read this first
        </p>
        <h1 className={`text-5xl md:text-6xl font-bold tracking-tight ${t.text} leading-[1.05] mb-6`}>
          Just laid off?
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            Read this before you apply.
          </span>
        </h1>
        <p className={`text-lg md:text-xl ${t.textSub} max-w-2xl mx-auto leading-relaxed mb-10`}>
          ~42,000 tech employees were laid off in April 2026. Oracle, Meta, ASML, Snap, Nike.
          You're not alone. And the system that's about to filter your applications is dumber
          than you think.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://cv-mirror-web.vercel.app?utm_source=vantage-laidoff&utm_medium=hero"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4F46E5] text-white rounded-full font-bold hover:-translate-y-0.5 transition-all"
          >
            Run free ATS scan (60 sec) <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/register"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold border-2 border-[#4F46E5]/30 ${t.text} hover:bg-[#4F46E5]/10 transition-all`}
          >
            3 free Vantage analyses
          </Link>
        </div>
        <p className={`mt-6 text-xs ${t.textMuted} flex items-center justify-center gap-2`}>
          <Lock className="w-3 h-3" /> No signup for ATS scan · No card needed for Vantage trial
        </p>
      </section>

      {/* The reality bar */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className={`${t.glass} rounded-2xl p-8 md:p-10`}>
          <h2 className={`text-2xl font-bold ${t.text} mb-4`}>
            What actually happened in April 2026
          </h2>
          <p className={`${t.textSub} mb-6`}>
            April 2026 has been the worst month for tech layoffs since the 2023 correction. The
            numbers are public — click through for company-specific advice for each cohort:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {laidOffCompanies.map((c) => (
              <Link
                key={c.slug}
                to={`/laid-off/from/${c.slug}`}
                className={`${t.cardInner} rounded-lg p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all`}
              >
                <div className="text-2xl font-bold text-[#4F46E5]">{c.affectedCount}</div>
                <div className="flex-1">
                  <div className={`font-semibold ${t.text} flex items-center gap-2`}>
                    {c.name} <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className={`text-xs ${t.textMuted}`}>{c.context.split('.')[0]}</div>
                </div>
              </Link>
            ))}
            <div className={`${t.cardInner} rounded-lg p-4 flex items-center gap-4`}>
              <div className="text-2xl font-bold text-[#4F46E5]">~5,000+</div>
              <div>
                <div className={`font-semibold ${t.text}`}>Many more</div>
                <div className={`text-xs ${t.textMuted}`}>Smaller tech companies, less press</div>
              </div>
            </div>
          </div>
          <p className={`mt-6 text-sm ${t.textMuted}`}>
            That's roughly 42,000 people newly searching at the same time. The recruiters know.
            The ATSes are full. Your CV is competing harder than it was 6 months ago — but the
            system rejecting you is still the same dumb parser.
          </p>
        </div>
      </section>

      {/* The 3 fixes */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className={`text-3xl font-bold ${t.text} mb-3`}>
          The 3 things to fix before you apply to a single job
        </h2>
        <p className={`${t.textSub} mb-10`}>
          Not "tips". Specific things that change the outcome of the next 100 applications.
        </p>

        <div className="space-y-6">
          {/* Fix 1 */}
          <div className={`${t.glass} rounded-2xl p-8`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] font-bold">1</div>
              <div>
                <h3 className={`text-xl font-bold ${t.text} mb-2`}>
                  Run your CV through every major ATS parser
                </h3>
                <p className={`${t.textSub} mb-4`}>
                  Workday, Greenhouse, Lever, Taleo, and iCIMS each read PDFs differently.
                  Workday reads top-to-bottom — multi-column CVs get scrambled into nonsense.
                  Greenhouse strips emoji codepoints. Lever historically drops PDF header
                  content. Most parse failures are silent. You won't know until you've sent 100
                  applications and gotten 2 replies.
                </p>
                <a
                  href="https://cv-mirror-web.vercel.app?utm_source=vantage-laidoff&utm_medium=fix1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:underline"
                >
                  Free 60-second multi-vendor scan → <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Fix 2 */}
          <div className={`${t.glass} rounded-2xl p-8`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] font-bold">2</div>
              <div>
                <h3 className={`text-xl font-bold ${t.text} mb-2`}>
                  Strip the formatting until it's boring
                </h3>
                <p className={`${t.textSub} mb-2`}>
                  Every "creative" template you bought from Etsy or downloaded from Canva is a
                  parse risk. The CV that gets parsed correctly across all 5 major ATSes is
                  visually boring:
                </p>
                <ul className={`${t.textSub} space-y-1 mt-3 ml-5 list-disc`}>
                  <li>Single column. Always.</li>
                  <li>Standard section names ("Summary", "Experience", "Education", "Skills")</li>
                  <li>Reverse chronological</li>
                  <li>No tables, no images, no icons in section headers</li>
                  <li>Plain font (Calibri, Helvetica, Arial). Save as PDF (text-searchable, not image)</li>
                </ul>
                <p className={`text-sm ${t.textMuted} mt-3`}>
                  Keep your designed CV for the human round. Submit the boring one to the ATS.
                </p>
              </div>
            </div>
          </div>

          {/* Fix 3 */}
          <div className={`${t.glass} rounded-2xl p-8`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] font-bold">3</div>
              <div>
                <h3 className={`text-xl font-bold ${t.text} mb-2`}>
                  Use the JD's exact words, not synonyms
                </h3>
                <p className={`${t.textSub} mb-2`}>
                  ATSes do basic stemming, but exact-match wins. If the JD says "React",
                  don't write "ReactJS". If it says "stakeholder management", don't write
                  "cross-functional alignment". The mistake here is keyword-stuffing — instead,
                  use their exact terminology in your bullets, naturally. One CV, customized
                  5% per application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Vantage does */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 md:p-12 text-center`}>
          <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">
            After you fix the parse
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold ${t.text} mb-4`}>
            Then you have to write the cover letter, prep the interview, score the fit.
          </h2>
          <p className={`${t.textSub} max-w-2xl mx-auto mb-8`}>
            That's another hour per application. At 30 applications a week, that's your whole
            weekend. Vantage compresses it to ~90 seconds per application: company brief,
            tailored cover letter (4 tones), mock interview Qs with model answers, fit score,
            5-minute pitch outline.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mb-8 text-left">
            {[
              { icon: FileText, t: 'Cover letter', d: '4 tones, JD-tailored' },
              { icon: Briefcase, t: 'Company brief', d: 'Auto-extracted from URL' },
              { icon: Users, t: 'Mock interview', d: 'AI-graded answers' },
              { icon: Clock, t: 'In ~90 seconds', d: 'Per application' },
            ].map((f, i) => (
              <div key={i} className={`${t.cardInner} rounded-lg p-4`}>
                <f.icon className="w-5 h-5 text-[#4F46E5] mb-2" />
                <div className={`font-semibold ${t.text} text-sm`}>{f.t}</div>
                <div className={`text-xs ${t.textMuted}`}>{f.d}</div>
              </div>
            ))}
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F46E5] text-white rounded-full font-bold hover:-translate-y-0.5 transition-all"
          >
            Get 3 free Vantage analyses <ArrowRight className="w-4 h-4" />
          </Link>
          <p className={`mt-4 text-xs ${t.textMuted}`}>
            No card. £5 starter pack if you want more. No subscription.
          </p>
        </div>
      </section>

      {/* Honest close */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <ShieldCheck className="w-10 h-10 text-[#4F46E5] mx-auto mb-4" />
        <h2 className={`text-2xl font-bold ${t.text} mb-4`}>
          Genuinely sorry to anyone caught in this month's cuts.
        </h2>
        <p className={`${t.textSub} leading-relaxed`}>
          The volume is real, the pain is real, and the system is dumber than it should be.
          We built CV Mirror free because the parser-check should never cost money. We built
          Vantage paid because the rest of the prep takes real compute. If neither helps,
          that's fine. If they do, it took 60 days of evenings to ship and we'd love your
          honest feedback.
        </p>
        <p className={`mt-4 text-sm ${t.textMuted}`}>— Gio, Vantage Labs (solo, building in public)</p>
      </section>
    </div>
  );
}
