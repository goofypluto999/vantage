import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Linkedin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /linkedin-optimization — fills a competitor SERP gap.
 *
 * Resume Worded ranks for "LinkedIn profile review" and "LinkedIn
 * optimization" — Vantage previously had no surface for those queries.
 * This page pairs Vantage's CV-fit logic with a concrete LinkedIn
 * audit checklist that's actually useful, not generic.
 */
export default function LinkedinOptimizationPage() {
  const { t } = useTheme();
  const path = '/linkedin-optimization';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'LinkedIn Optimization', item: `${SITE_URL}${path}` },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to optimize a LinkedIn profile for recruiter search in 2026',
    description: 'Eight-step LinkedIn audit covering headline, About section, experience entries, skills, custom URL, photos, recommendations, and search signals.',
    totalTime: 'PT45M',
    step: [
      { '@type': 'HowToStep', name: 'Headline', text: 'Replace job title with a value-line that names role + outcome + audience.' },
      { '@type': 'HowToStep', name: 'About section', text: 'First three lines must hook in the LinkedIn mobile preview. Lead with a specific result, not a career summary.' },
      { '@type': 'HowToStep', name: 'Experience entries', text: 'For each role, lead bullets with a metric. Two bullets max per role for older positions.' },
      { '@type': 'HowToStep', name: 'Skills section', text: 'Pin three skills that match the job titles you want recruiters to find you for.' },
      { '@type': 'HowToStep', name: 'Custom URL', text: 'Set linkedin.com/in/yourname — generic random URL flags older accounts.' },
      { '@type': 'HowToStep', name: 'Profile + banner photo', text: 'Profile photo at 400x400px minimum. Banner photo conveys industry context, not a stock template.' },
      { '@type': 'HowToStep', name: 'Recommendations', text: 'Three specific recommendations from former managers or peers beat ten generic ones.' },
      { '@type': 'HowToStep', name: 'Open To Work', text: 'Set it on, recruiters-only mode if your current role is sensitive. Public mode if you are openly searching.' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Does LinkedIn optimization actually move the needle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For roles where recruiters source candidates (most non-junior tech, sales, marketing, legal, finance), yes — significantly. Recruiters use LinkedIn Recruiter\'s search filters to build candidate lists. If your headline, skills, and recent experience match the search terms they enter, you appear. If they do not, you are invisible regardless of how good your CV is. For roles where you only ever apply through job boards, LinkedIn matters less.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I keep the green Open To Work frame?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use the in-product setting (Settings → Open to Work), pick "recruiters only" if your current employer should not see it, "all LinkedIn members" if you are openly searching. The visible green frame is a stronger signal but can also signal desperation in some senior roles. Test both for a week each.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is LinkedIn ranking different from Google ranking?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LinkedIn search is a closed system tuned for recruiter queries. The signals are: title-keyword match, skills-pin match, recency of activity, location, mutual connections, and profile completeness. Google search ignores all of these. Optimize them separately.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do Vantage tools optimize LinkedIn directly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vantage does not edit your LinkedIn profile. It analyzes a CV against a job posting and produces a fit score, cover letter, and prep pack. The CV-vs-role fit score from Vantage is the right input for an Experience-section bullet rewrite — once you know the gap between your CV and a target role, the same gap exists on your LinkedIn. Use the Vantage gap analysis as the diff and apply it to both.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="LinkedIn Profile Optimization for Recruiter Search in 2026"
        description="Eight concrete steps to make your LinkedIn profile findable by recruiters. Headline, About, experience, skills, custom URL, photos, recommendations. Free guide, no signup."
        path={path}
        jsonLd={[breadcrumbSchema, howToSchema, faqSchema]}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <span className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted}`}>
              LinkedIn optimization · Free guide
            </span>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            How to make recruiters find you on LinkedIn in 2026
          </h1>
          <p className={`mt-5 text-lg ${t.textSub} leading-relaxed`}>
            Eight specific changes to your LinkedIn profile, in priority order. The
            top three move the needle the most. Each one takes 5–10 minutes. None of
            them require a paid LinkedIn Premium account.
          </p>
        </header>

        <section className={`${t.cardInner} rounded-2xl p-6 sm:p-8 mb-10 border-l-4 border-[#0A66C2]/60`}>
          <h2 className={`text-lg font-bold ${t.text} mb-2`}>The brutal truth about LinkedIn search</h2>
          <p className={`text-sm ${t.textSub} leading-relaxed`}>
            Recruiters do not "browse." They run searches in LinkedIn Recruiter with
            specific filters: <code className="font-mono text-xs">title:"product manager" AND skills:"SQL" AND location:"London"</code>.
            If your profile does not match the exact filter combination, you are
            invisible. Optimization is not about looking good — it is about being
            findable by the queries recruiters actually type.
          </p>
        </section>

        <section className="space-y-8">
          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>1. Headline — the highest-leverage 220 characters</h2>
            <p className={`${t.textSub} mb-3 leading-relaxed`}>
              The default headline is your current job title. That is a wasted ranking opportunity. Replace it with: <strong className={t.text}>[Role keywords] · [Specific outcome] · [Audience]</strong>.
            </p>
            <div className={`${t.cardInner} rounded-xl p-4 mb-3`}>
              <p className={`text-xs ${t.textMuted} font-semibold mb-2`}>BEFORE</p>
              <p className={`text-sm font-mono ${t.text}`}>Senior Product Manager at Acme</p>
            </div>
            <div className={`${t.cardInner} rounded-xl p-4 border border-emerald-500/30`}>
              <p className={`text-xs text-emerald-500 font-semibold mb-2`}>AFTER</p>
              <p className={`text-sm font-mono ${t.text}`}>Senior PM, B2B SaaS · 0→1 product launches at scale · ex-Acme</p>
            </div>
            <p className={`mt-3 text-sm ${t.textMuted}`}>
              The "after" version contains four searchable terms (Senior PM, B2B SaaS,
              0→1, ex-Acme) recruiters actually type. The "before" version contains zero.
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>2. About — first three lines must hook on mobile</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              On mobile, LinkedIn truncates the About section after about 220 characters
              with a "see more" link. Most people never click it. Lead with a specific
              result, not a career summary.
            </p>
            <div className={`mt-3 ${t.cardInner} rounded-xl p-4 border border-emerald-500/30`}>
              <p className={`text-xs text-emerald-500 font-semibold mb-2`}>HOOK PATTERN</p>
              <p className={`text-sm ${t.textSub}`}>
                "I lead [type of work] at [type of company]. Last year I [specific
                outcome with a number]. I'm currently focused on [thing]."
              </p>
            </div>
            <p className={`mt-3 ${t.textMuted} text-sm`}>
              Three sentences, ~180 characters, ends with a hook that makes "see more"
              earn the click.
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>3. Experience — lead every bullet with a metric</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              For your most recent two roles: every bullet starts with a number.
              Revenue, percent improvement, team size, deal size, throughput,
              latency. For roles older than 5 years: collapse to two bullets per role.
              Recruiters do not read your 2018 work in detail.
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>4. Skills section — pin three matching what you want next</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              LinkedIn lets you pin three skills at the top of the section. Those
              three appear in search filters and on the profile preview. Pin the
              skills that match <em>the job you want next</em>, not what you do
              today. Recruiter searches are forward-looking.
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>5. Custom URL — set it now</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              Default LinkedIn URLs include a random 8-character suffix
              (<code className="font-mono text-xs">/in/yourname-1a2b3c4</code>).
              Custom URL <code className="font-mono text-xs">/in/yourname</code> ranks
              fractionally higher and looks substantially more professional in CV
              footers and email signatures. Five-second change, permanent benefit.
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>6. Profile + banner photos</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              Profile photo: 400×400 pixels minimum, face fills 60% of the frame,
              direct eye contact, neutral background. Banner photo: avoid the LinkedIn
              stock library — use something that signals industry context (your
              workspace, an event you spoke at, a relevant data visualisation). Do not
              upload a quote graphic. Recruiters parse banners as "is this person
              serious," not as "is this quote inspiring."
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>7. Recommendations — three specific beats ten generic</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              Reach out to three former managers or close peers. Ask for a
              recommendation that names: a specific project, a specific outcome,
              and one trait you uniquely brought. A recommendation that says "X is
              a great team player" is worse than no recommendation at all.
            </p>
          </article>

          <article>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>8. Open To Work — the right way</h2>
            <p className={`${t.textSub} leading-relaxed`}>
              Settings → Career interests → "Let recruiters know you're open." Pick:
            </p>
            <ul className={`mt-3 space-y-2 ${t.textSub} text-sm`}>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong className={t.text}>"Recruiters only"</strong> if your current employer should not see it. LinkedIn's algorithm hides the signal from people at your current company. Not 100% reliable but close.</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong className={t.text}>"All LinkedIn members"</strong> if you are openly searching — adds the green #OpenToWork frame, most strongly visible signal LinkedIn offers.</span>
              </li>
            </ul>
            <p className={`mt-3 ${t.textMuted} text-sm`}>
              In senior roles, the green frame is sometimes read as "desperate." A/B
              test both for a week and check which one drives more InMails.
            </p>
          </article>
        </section>

        <section className={`mt-12 ${t.glass} rounded-2xl p-8`}>
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Use Vantage's gap analysis to rewrite your LinkedIn</h2>
          <p className={`${t.textSub} leading-relaxed mb-4`}>
            Once you have a target role, run a Vantage analysis to get the
            CV-vs-role fit score and the specific gaps to close. The gaps Vantage
            identifies in your CV are the same gaps your LinkedIn has — fix both
            with the same edits, in one pass.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Run a free analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className={`mt-10 ${t.cardInner} rounded-2xl p-6`}>
          <h2 className={`text-lg font-bold ${t.text} mb-4`}>Related</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Link to="/blog/the-30-second-cv-review-recruiters-actually-run" className={`${t.text} hover:text-violet-400`}>→ The 30-second CV review test recruiters actually run</Link>
            <Link to="/blog/what-ats-actually-checks-in-2026" className={`${t.text} hover:text-violet-400`}>→ What ATS screening actually checks in 2026</Link>
            <Link to="/blog/the-4-cover-letter-tones-and-when-to-use-each" className={`${t.text} hover:text-violet-400`}>→ The 4 cover letter tones and when each one wins</Link>
            <Link to="/playbook" className={`${t.text} hover:text-violet-400`}>→ The Vantage Playbook</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
