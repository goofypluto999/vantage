import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingDown, ArrowRight, Info, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { taskStarted, recordTaskCompletion, armExitFastDetector } from '../lib/track';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/jobscan-cost-calculator — GOLDEN GOSPEL Tactic 4 (2026-05-08).
 *
 * Cold visitors arrive convinced "all job-prep tools cost $20-50/mo so I'll
 * subscribe somewhere." This page does the math for them. It surfaces what a
 * year of Jobscan / Resume Worded / Final Round AI / Teal actually costs at
 * their search duration, and contrasts it against Vantage's £5 one-time
 * top-up (£0.25/analysis). The number is so far apart it stops being an
 * arithmetic question and becomes a "wait — really?" question.
 *
 * SEO target: "Jobscan alternative cheaper", "Jobscan worth it", "is Jobscan
 * worth the money", "Resume Worded vs Jobscan", "Final Round AI cost".
 *
 * Honest competitor pricing as of 2026-05-08 (best public-page sources):
 *   - Jobscan Premium:      $49.95 / mo (or $89.85 / 3mo, $239.40 / yr)
 *   - Resume Worded Pro:    $19    / mo (or $96 / 3mo)
 *   - Final Round AI Premium:$148  / mo (interview copilot)
 *   - Teal+:                $9     / wk billed weekly (~$39 / mo)
 *   - LiveCareer:           $24.95 / mo
 * If a vendor changes pricing, update PRICING_TABLE below and re-deploy.
 */
const PRICING_TABLE = [
  {
    name: 'Jobscan Premium',
    monthly: 49.95,
    currency: 'USD',
    coverage: 'ATS keyword match only',
    sourceUrl: 'https://www.jobscan.co/pricing',
  },
  {
    name: 'Resume Worded Pro',
    monthly: 19,
    currency: 'USD',
    coverage: 'CV scoring + LinkedIn review',
    sourceUrl: 'https://resumeworded.com/pricing',
  },
  {
    name: 'Final Round AI Premium',
    monthly: 148,
    currency: 'USD',
    coverage: 'Live interview copilot',
    sourceUrl: 'https://www.finalroundai.com/pricing',
  },
  {
    name: 'Teal+',
    monthly: 39,
    currency: 'USD',
    coverage: 'Tracker + AI editor (billed weekly)',
    sourceUrl: 'https://www.tealhq.com/pricing',
  },
  {
    name: 'LiveCareer',
    monthly: 24.95,
    currency: 'USD',
    coverage: 'CV builder + cover letter templates',
    sourceUrl: 'https://www.livecareer.com/pricing',
  },
];

// Approx GBP rate as of 2026-05-08. Updated annually; the spread is small
// enough that a stale rate doesn't change the conclusion (Vantage is still
// 50-300x cheaper). If GBP/USD moves >20%, refresh.
const USD_TO_GBP = 0.79;

// Vantage's actual cost-per-analysis at the £5/20-token top-up.
const VANTAGE_COST_PER_ANALYSIS_GBP = 0.25;

export default function CostCalculatorPage() {
  const { t } = useTheme();
  const [monthsSearching, setMonthsSearching] = useState(4);
  const [appsPerWeek, setAppsPerWeek] = useState(5);

  // Page entry = task started. Sliding sliders = engagement (handled
  // implicitly by recordTaskCompletion the first time a slider moves).
  useEffect(() => {
    taskStarted('/tools/jobscan-cost-calculator', 'calculator_loaded');
    const cleanup = armExitFastDetector('/tools/jobscan-cost-calculator', 8);
    return cleanup;
  }, []);

  // First non-default slider movement = task completed (the user
  // engaged with the cost comparison and saw the spread).
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    if (hasInteracted) return;
    if (monthsSearching !== 4 || appsPerWeek !== 5) {
      setHasInteracted(true);
      recordTaskCompletion('/tools/jobscan-cost-calculator', 'slider_engaged');
    }
  }, [monthsSearching, appsPerWeek, hasInteracted]);

  // Total Vantage spend = 1 analysis per app, plus the initial 10-token
  // freebie that lasts the first ~10 apps.
  const totalApps = useMemo(() => Math.max(0, appsPerWeek * 4 * monthsSearching), [appsPerWeek, monthsSearching]);
  const billableApps = Math.max(0, totalApps - 10); // first 10 are free
  const vantageSpendGBP = billableApps * VANTAGE_COST_PER_ANALYSIS_GBP;

  const competitorRows = useMemo(() => {
    return PRICING_TABLE.map((vendor) => {
      const totalUSD = vendor.monthly * monthsSearching;
      const totalGBP = totalUSD * USD_TO_GBP;
      const ratio = vantageSpendGBP > 0 ? totalGBP / vantageSpendGBP : Infinity;
      return { ...vendor, totalUSD, totalGBP, ratio };
    });
  }, [monthsSearching, vantageSpendGBP]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Job Tool Cost Calculator', item: `${SITE_URL}/tools/jobscan-cost-calculator` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does Jobscan cost over a typical job search?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jobscan Premium is $49.95/month. Most UK job hunts last 4-6 months. That puts the bill at $200-300 (roughly £158-237) for ATS keyword matching alone — no cover letter rewrite, no interview prep, no fit score.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is Vantage so much cheaper than Jobscan or Resume Worded?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vantage runs on Gemini 2.5 Flash (one of the cheapest commercial models per token) and is operated as a sole trader from the UK. There is no sales team, no enterprise tier, no marketing department. £5 buys 20 full prep packs, with the first 10 free on signup. The marginal cost per analysis is pennies.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the cost calculator include hidden fees?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Vantage tokens do not expire and there are no auto-renew traps. The £5 top-up is one-time. Competitor pricing on this page is taken from each vendor’s public pricing page; click through to verify before subscribing anywhere.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Jobscan Cost Calculator — what a year of job-prep tools actually costs"
        description="Honest 12-month cost calculator for Jobscan, Resume Worded, Final Round AI, Teal, and LiveCareer vs Vantage's one-time £5 top-up. No subscriptions, no upsells — just the math."
        path="/tools/jobscan-cost-calculator"
        markdownAlternate="/markdown/jobscan-alternative.md"
        jsonLd={[breadcrumbSchema, faqSchema]}
      />

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/tools" className="hover:underline">Free tools</Link>
          <span className="mx-2">/</span>
          <span>Cost calculator</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
            <Calculator className="w-6 h-6" aria-hidden="true" />
          </span>
          <div>
            <div className={`text-xs uppercase tracking-wider ${t.textMuted}`}>Free · no signup</div>
            <h1 className={`text-3xl md:text-5xl font-bold ${t.text}`}>What a year of job-prep tools actually costs.</h1>
          </div>
        </div>

        <p className={`text-base md:text-lg mb-8 ${t.textSub}`}>
          Tell us how long you'll be hunting and how many apps you send per week. We'll show what
          Jobscan, Resume Worded, Final Round AI, Teal and LiveCareer would charge — versus what
          Vantage charges for the same thing (and more).
        </p>

        <div className={`${t.glass} rounded-2xl p-6 md:p-8 mb-6`}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cost-months-searching" className={`block text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>
                How long is your search?
              </label>
              <input
                id="cost-months-searching"
                type="range"
                min={1}
                max={12}
                value={monthsSearching}
                onChange={(e) => setMonthsSearching(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              <div className={`flex justify-between text-xs mt-1 ${t.textMuted}`}>
                <span>1 month</span>
                <span className={`font-semibold ${t.text}`}>{monthsSearching} {monthsSearching === 1 ? 'month' : 'months'}</span>
                <span>12 months</span>
              </div>
            </div>

            <div>
              <label htmlFor="cost-apps-per-week" className={`block text-xs uppercase tracking-wider mb-2 ${t.textMuted}`}>
                Apps per week
              </label>
              <input
                id="cost-apps-per-week"
                type="range"
                min={1}
                max={25}
                value={appsPerWeek}
                onChange={(e) => setAppsPerWeek(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              <div className={`flex justify-between text-xs mt-1 ${t.textMuted}`}>
                <span>1/week</span>
                <span className={`font-semibold ${t.text}`}>{appsPerWeek} {appsPerWeek === 1 ? 'app' : 'apps'}/week</span>
                <span>25/week</span>
              </div>
            </div>
          </div>
          <div className={`mt-4 text-sm ${t.textSub}`}>
            That's <strong className={t.text}>{totalApps.toLocaleString()} applications</strong> over the search.
            With Vantage you'd run a tailored prep pack for each one.
          </div>
        </div>

        {/* Headline number */}
        <div className="rounded-2xl p-6 md:p-8 mb-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
          <div className="flex items-start gap-3 mb-3">
            <TrendingDown className="w-6 h-6 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className={`text-xs uppercase tracking-wider mb-1 text-emerald-300/80`}>
                Vantage total over {monthsSearching} {monthsSearching === 1 ? 'month' : 'months'}
              </div>
              <div className={`text-4xl md:text-5xl font-bold ${t.text}`}>
                £{vantageSpendGBP.toFixed(2)}
              </div>
              <div className={`text-sm mt-2 ${t.textSub}`}>
                {totalApps <= 10 ? (
                  <>Your first 10 prep packs are free on signup, so the {totalApps} apps in your search are <strong className="text-emerald-300">all free</strong>. £0.</>
                ) : (
                  <>10 free on signup ({totalApps} - 10 = {billableApps} billable) × £{VANTAGE_COST_PER_ANALYSIS_GBP.toFixed(2)} per pack = £{vantageSpendGBP.toFixed(2)}. One-time top-ups, never expire.</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8 overflow-hidden`}>
          <div className={`text-xs uppercase tracking-wider mb-4 ${t.textMuted}`}>What a competitor would charge for {monthsSearching} {monthsSearching === 1 ? 'month' : 'months'}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left text-xs uppercase tracking-wider ${t.textMuted} border-b border-white/10`}>
                  <th className="pb-3">Tool</th>
                  <th className="pb-3">What it covers</th>
                  <th className="pb-3 text-right">Their cost</th>
                  <th className="pb-3 text-right">vs Vantage</th>
                </tr>
              </thead>
              <tbody>
                {competitorRows.map((row) => (
                  <tr key={row.name} className="border-b border-white/5 last:border-0">
                    <td className={`py-3 ${t.text} font-semibold`}>
                      <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {row.name}
                      </a>
                    </td>
                    <td className={`py-3 ${t.textSub} text-xs`}>{row.coverage}</td>
                    <td className={`py-3 ${t.text} text-right font-mono tabular-nums`}>
                      ${row.totalUSD.toFixed(0)}
                      <span className={`block text-[11px] ${t.textMuted}`}>≈ £{row.totalGBP.toFixed(0)}</span>
                    </td>
                    <td className="py-3 text-right">
                      {Number.isFinite(row.ratio) ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {row.ratio.toFixed(0)}× more
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ∞ more
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`mt-4 flex items-start gap-2 text-xs ${t.textMuted}`}>
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>
              Pricing pulled from each vendor's public pricing page on 2026-05-08. USD shown as their list price; GBP converted at 0.79 (review against your bank's actual rate). Vendors change pricing — click each name to verify before subscribing anywhere.
            </p>
          </div>
        </div>

        {/* What you actually get for £5 */}
        <div className={`${t.glass} rounded-2xl p-6 md:p-8 mb-8`}>
          <h2 className={`text-xl md:text-2xl font-bold ${t.text} mb-2`}>What £5 of Vantage actually buys</h2>
          <p className={`text-sm mb-4 ${t.textSub}`}>
            Each of the 20 prep packs in a £5 top-up includes everything below. No tier walls, no upsells.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {[
              'Company intelligence brief (mission, culture signals, recent moves)',
              'CV ↔ role fit score (where you match, where the gaps are)',
              'Tailored cover letter (4 tones: Formal / Warm / Direct / Creative)',
              '8–12 likely interview questions, generated from the JD',
              '5-minute pitch outline ready to rehearse out loud',
              'Free ATS preview against 5 major resume parsers',
              'Mock interview session with AI follow-ups',
              'Downloadable .txt prep pack to reference offline',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className={t.textSub}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-6 md:p-8 mb-8 bg-gradient-to-br from-violet-600/15 to-purple-600/15 border border-violet-500/30">
          <h2 className={`text-xl md:text-2xl font-bold ${t.text} mb-2`}>Try it before you decide.</h2>
          <p className={`text-sm mb-4 ${t.textSub}`}>
            10 free prep packs on signup. No card. If Vantage doesn't deliver, you've spent nothing.
            If it does, £5 covers the next 20.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
          >
            Start with 10 free prep packs <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Trust */}
        <div className={`text-xs ${t.textMuted} text-center mt-12 leading-relaxed`}>
          Built solo by Giovanni Sizino Ennes — sole trader, UK. Stripe-only billing. No recruitment fees.
          See the <Link to="/receipts" className="underline">receipts</Link>{' '}or the
          <Link to="/about" className="underline ml-1">operator page</Link>{' '}for full transparency.
        </div>
      </div>
    </div>
  );
}
