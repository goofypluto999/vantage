import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Star, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /compare — comparison page targeting "vs" queries.
 *
 * "Vantage vs Teal" / "Vantage vs Jobscan" / "Vantage vs Resume.io" — all high
 * commercial intent. The visitor is researching to buy. This page is built for
 * that moment.
 *
 * SEO bonus: comparison pages rank fast because the queries are long-tail and
 * existing comparisons rarely cover all 4 alternatives in one place.
 */
export default function ComparePage() {
  const { t } = useTheme();

  // -------- Comparison matrix --------
  const competitors = [
    { name: 'Vantage', us: true },
    { name: 'Teal', us: false },
    { name: 'Resume.io', us: false },
    { name: 'Jobscan', us: false },
  ];

  type Cell = boolean | string;
  const features: { name: string; values: Cell[] }[] = [
    { name: 'Free account', values: [true, true, true, true] },
    { name: 'Tailored cover letter', values: [true, true, true, false] },
    { name: 'Cover letter tone switcher (4 tones)', values: [true, false, false, false] },
    { name: 'Company intelligence brief from job URL', values: [true, false, false, false] },
    { name: 'AI-generated mock interview questions', values: [true, false, false, false] },
    { name: 'AI-graded mock interview practice', values: [true, false, false, false] },
    { name: 'CV-vs-role fit score', values: [true, false, false, true] },
    { name: '5-minute interview pitch outline', values: [true, false, false, false] },
    { name: 'Free ATS scanner (CV Mirror)', values: [true, false, false, false] },
    { name: 'Multi-vendor ATS parse view', values: [true, false, false, false] },
    { name: 'No CV upload (client-side ATS scan)', values: [true, false, false, false] },
    { name: 'Pay-per-use option (no subscription)', values: ['£5 / 20 tokens', false, false, false] },
    { name: 'Lowest paid plan', values: ['£5 one-time', '$9/mo', '$2.95 (3-day trial)', '$49.95/mo'] },
  ];

  const renderCell = (v: Cell): React.ReactNode => {
    if (v === true) return <Check className="w-5 h-5 text-emerald-500 mx-auto" />;
    if (v === false) return <X className="w-4 h-4 text-red-400/60 mx-auto" />;
    return <span className={`text-sm font-medium ${t.text}`}>{v}</span>;
  };

  // -------- Schema --------
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between Vantage and Teal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Teal is primarily a CV builder and job tracker — you organise your CV and applications inside it. Vantage is an AI prep tool — you upload your existing CV and a job URL, and Vantage generates company intel, a tailored cover letter, mock interview questions, a fit score, and a 5-minute pitch outline. Different problem space. Use Teal to build the CV; use Vantage to prepare to apply with it.',
        },
      },
      {
        '@type': 'Question',
        name: 'Vantage vs Jobscan — which is better?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jobscan is a paid CV-vs-JD keyword matcher with a $49.95/month plan. Vantage covers the same use case (CV-vs-role fit) but adds the rest of the prep pack — cover letter, mock interview, presentation outline — and lets you start at £5 one-time, no subscription. We also ship a separate free tool, CV Mirror, which gives you the multi-vendor ATS parse view Jobscan does not.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Vantage cheaper than Resume.io?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Resume.io leads with a $2.95 7-day trial that converts to ~$24.95/month. Vantage starts at £5 / $5 for 20 tokens that never expire — pay once, use until exhausted. There are also monthly plans (Pro £12, Premium £20) for heavy users.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Vantage include an ATS scanner?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — we built CV Mirror as the free ATS scanner. It is a separate, fully client-side tool at cv-mirror-web.vercel.app that simulates how 5 real ATS systems (Workday, Greenhouse, Lever, Taleo, iCIMS) parse a CV. Free, no signup, nothing uploads. Vantage focuses on the rest of the application prep flow.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Vantage vs Teal vs Resume.io vs Jobscan — feature comparison"
        description="Side-by-side comparison of Vantage with Teal, Resume.io, and Jobscan across cover letter, mock interview, fit score, ATS scan, and pricing. Updated 2026."
        path="/compare"
        jsonLd={[breadcrumbSchema, faqSchema]}
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
        <header className="text-center mb-12">
          <span className={`inline-block text-xs uppercase tracking-widest ${t.textMuted} font-semibold mb-3`}>
            How Vantage compares
          </span>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            Vantage vs Teal vs Resume.io vs Jobscan
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Honest side-by-side. We make Vantage. We're not pretending the
            alternatives are bad — they all do something useful. We're showing
            you what each one optimises for, and where Vantage wins.
          </p>
        </header>

        {/* Matrix */}
        <div className={`${t.glass} rounded-2xl overflow-hidden overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`${t.cardInner} border-b border-white/5`}>
                <th className={`text-left p-4 ${t.text} font-semibold`}>Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`p-4 text-center ${
                      c.us ? 'text-violet-500 font-bold' : `${t.textSub} font-semibold`
                    }`}
                  >
                    {c.name}
                    {c.us && <span className="block text-[10px] font-normal text-violet-400 mt-0.5">us</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f.name} className={i % 2 === 0 ? '' : t.cardInner}>
                  <td className={`p-4 ${t.text}`}>{f.name}</td>
                  {f.values.map((v, ci) => (
                    <td key={ci} className="p-4 text-center">
                      {renderCell(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Honest take */}
        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <article className={`${t.cardInner} rounded-xl p-6`}>
            <h3 className={`text-lg font-bold ${t.text}`}>When Teal wins</h3>
            <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>
              Teal is the best tool here for organising a long-running job
              search — application tracker, CV builder, multiple CV variants.
              If you live in your job tracker, Teal is the right home for it.
            </p>
          </article>
          <article className={`${t.cardInner} rounded-xl p-6`}>
            <h3 className={`text-lg font-bold ${t.text}`}>When Resume.io wins</h3>
            <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>
              Resume.io is a pure CV builder. If you do not yet have a polished
              CV and want a templated one fast, that is what they do well. They
              do not cover the application or interview side at all.
            </p>
          </article>
          <article className={`${t.cardInner} rounded-xl p-6`}>
            <h3 className={`text-lg font-bold ${t.text}`}>When Jobscan wins</h3>
            <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>
              Jobscan's keyword-match score is well-known and trusted by
              recruiters. If your only job is "is my CV keyword-matched to
              this JD?" Jobscan is the safe pick. But the score is invented
              and you pay $49.95/month for what is essentially keyword diff.
            </p>
          </article>
          <article className={`${t.glass} rounded-xl p-6 border-2 border-violet-500/40`}>
            <h3 className={`text-lg font-bold ${t.text}`}>When Vantage wins</h3>
            <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>
              When you want the whole application prep done in 90 seconds, not
              broken into four tools. Vantage covers company intel, cover
              letter, mock interview, fit score, and pitch outline in one
              flow. Plus we ship a free ATS scanner (CV Mirror) for the
              parser side. Lowest barrier to entry: £5 once, no subscription.
            </p>
          </article>
        </section>

        {/* Free tool callout */}
        <section className={`mt-12 ${t.cardInner} rounded-2xl p-6 sm:p-8 border-l-4 border-emerald-500`}>
          <span className={`text-[10px] uppercase tracking-widest font-bold text-emerald-500`}>
            Bonus
          </span>
          <h3 className={`text-2xl font-bold ${t.text} mt-2`}>
            Want to test ATS-readiness for free, with no signup?
          </h3>
          <p className={`mt-2 ${t.textSub}`}>
            We built <strong className={t.text}>CV Mirror</strong> — a fully
            client-side ATS scanner that simulates how 5 real ATS systems
            (Workday, Greenhouse, Lever, Taleo, iCIMS) parse your CV. Side
            by side. No fake score. Nothing uploads. Free forever.
          </p>
          <a
            href="https://cv-mirror-web.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-violet-500 font-semibold hover:underline"
          >
            Try CV Mirror free <ExternalLink className="w-4 h-4" />
          </a>
        </section>

        {/* CTA */}
        <div className={`mt-12 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Try Vantage on a real job link</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            One upload. One paste. Full prep pack in 90 seconds. £5 starter, no subscription.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
