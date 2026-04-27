import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Star, Shield, Zap, FileSearch } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://vantage-livid.vercel.app';

/**
 * /tools — hub page that lists every free Vantage Labs tool.
 * Currently features CV Mirror (free ATS scanner). Designed to be
 * extended with future free tools by appending entries to the TOOLS array.
 */
export default function ToolsPage() {
  const { t } = useTheme();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free job search tools by Vantage Labs',
    numberOfItems: 1,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        url: 'https://cv-mirror-web.vercel.app/',
        name: 'CV Mirror — Free ATS Scanner',
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
        title="Free Tools by Vantage Labs"
        description="Free job search and CV tools by Vantage Labs. CV Mirror — a free, fully client-side ATS scanner that simulates how 5 real applicant tracking systems parse your CV. No signup."
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
            Vantage Labs
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
