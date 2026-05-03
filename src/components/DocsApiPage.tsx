import { Link } from 'react-router-dom';
import { Code, Lock, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /docs/api — public API documentation page.
 *
 * Stub for the planned API key feature. Documents the eventual public surface
 * (analyse, rewrite-tone, interview-questions, etc.) so the URL is indexable
 * and discoverable. Real auth + endpoints land in a future release.
 */
export default function DocsApiPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'API documentation', item: `${SITE_URL}/docs/api` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Vantage API documentation"
        description="Public API for the Vantage AI job-prep engine. Endpoint surface, authentication, rate limits, request shapes for /analyze, /rewrite-tone, /interview-questions."
        path="/docs/api"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/skills" className={`${t.textSub} hover:${t.text}`}>Skills</Link>
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">3 free analyses</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">API documentation · v1 preview</p>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          Vantage API
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed`}>
          The Vantage analysis engine, exposed as a public REST API. Currently in preview — issuing API keys
          to existing paid users on request. Full self-serve API key management ships in v1.0.
        </p>
        <div className={`mt-6 ${t.glass} rounded-xl p-4 flex items-start gap-3`}>
          <Lock className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
          <div>
            <p className={`${t.text} font-semibold text-sm`}>Preview status</p>
            <p className={`text-sm ${t.textSub}`}>
              The endpoints below are documented but not yet open for public registration. Email
              <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" className="text-[#4F46E5] hover:underline">{' '}giovanni.sizino.ennes@hotmail.co.uk</a> if you want preview access.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Endpoints</h2>

        <div className="space-y-5">
          {[
            {
              method: 'POST',
              path: '/api/v1/analyze',
              cost: '3 tokens',
              description: 'Run a full job intelligence analysis. Input: CV file + job URL. Output: company snapshot, fit score, tailored cover letter, mock interview Qs, presentation outline.',
            },
            {
              method: 'POST',
              path: '/api/v1/rewrite-tone',
              cost: '1 token',
              description: 'Rewrite an existing cover letter in a different tone (Professional / Warm / Direct / Creative).',
            },
            {
              method: 'POST',
              path: '/api/v1/interview/questions',
              cost: '2 tokens',
              description: 'Generate likely interview questions for a job description with model answers.',
            },
            {
              method: 'POST',
              path: '/api/v1/interview/evaluate',
              cost: 'free',
              description: 'Submit an answer to an interview question. Get back grading + improvement notes. Free for paid users.',
            },
            {
              method: 'GET',
              path: '/api/v1/credits',
              cost: 'free',
              description: 'Get the current token balance for the authenticated key.',
            },
          ].map((ep, i) => (
            <div key={i} className={`${t.glass} rounded-xl p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-[#4F46E5]/20 text-[#4F46E5] rounded text-xs font-mono font-bold">{ep.method}</span>
                <code className={`text-sm ${t.text} font-mono`}>{ep.path}</code>
                <span className={`text-xs ${t.textMuted} ml-auto`}>{ep.cost}</span>
              </div>
              <p className={`text-sm ${t.textSub}`}>{ep.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Authentication</h2>
        <div className={`${t.glass} rounded-xl p-5`}>
          <p className={`text-sm ${t.textSub} mb-3`}>
            All authenticated endpoints expect an <code className={`${t.cardInner} px-1 rounded`}>Authorization: Bearer &lt;key&gt;</code> header.
            Keys are scoped to your Vantage account and inherit your token balance.
          </p>
          <pre className={`${t.cardInner} rounded-md p-3 text-xs ${t.text} overflow-x-auto`}>
{`curl -X POST https://aimvantage.uk/api/v1/analyze \\
  -H "Authorization: Bearer vntg_..." \\
  -F "cv=@cv.pdf" \\
  -F "jobUrl=https://example.com/jobs/123"`}
          </pre>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <h2 className={`text-2xl font-bold ${t.text} mb-4`}>Rate limits</h2>
        <div className={`${t.glass} rounded-xl p-5 text-sm ${t.textSub} space-y-2`}>
          <p>10 requests / minute per API key during preview.</p>
          <p>200 requests / day per key during preview.</p>
          <p>No hard daily cap on tokens consumed beyond your account balance.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <Code className="w-10 h-10 text-[#4F46E5] mx-auto mb-3" />
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Request preview API access</h2>
          <p className={`${t.textSub} max-w-xl mx-auto mb-5`}>
            Email with your use case and we'll provision a key. Existing paid Vantage users get priority.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk?subject=API%20preview%20access"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Request access <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
