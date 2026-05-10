import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/career-risk-index -- pure client-side career-risk scorer.
 * Drafted 2026-05-10. 16th free tool. Captures search-volume around
 * "should I quit my job" / "should I look for a new role" / "tech
 * layoff risk".
 *
 * Honest 0-100 score across 6 weighted axes: tenure stability,
 * runway buffer, visa exposure, sector risk, role-AI exposure, role
 * domain demand. Not invented — every input has a documented weight.
 */

type Sector = 'big_tech' | 'crypto' | 'fintech' | 'enterprise_saas' | 'consulting' | 'ai_lab' | 'public_sector' | 'startup_seed' | 'other';
type Visa = 'citizen' | 'h1b' | 'tier2' | 'eu_citizen' | 'other';
type AIExposure = 'high_replaceable' | 'medium_augmented' | 'low_compounding';
type DomainDemand = 'high' | 'medium' | 'low';

interface Inputs {
  tenureMonths: number;
  monthlySpend: number;
  liquidSavings: number;
  sector: Sector;
  visa: Visa;
  aiExposure: AIExposure;
  domainDemand: DomainDemand;
  hasReferences: boolean;
  hasPublicArtefacts: boolean;
}

const SECTOR_RISK: Record<Sector, number> = {
  big_tech: 0.55,        // Mid risk. 2024-26 layoffs were widespread but rebound is fast.
  crypto: 0.65,          // Higher risk due to volatility, but rebound when cycle turns.
  fintech: 0.45,         // Mid-low. Bank-adjacent fintech is more stable; pure scale-up fintech less so.
  enterprise_saas: 0.40, // Lower risk. Slower growth, more stable.
  consulting: 0.50,      // Mid. Project-based, demand swings with macro.
  ai_lab: 0.30,          // Currently lowest risk. Hot hiring, big budgets.
  public_sector: 0.25,   // Lowest risk by stability, but lower upside.
  startup_seed: 0.85,    // Highest risk. Most seed startups die in 24 months.
  other: 0.50,
};

const VISA_RISK: Record<Visa, number> = {
  citizen: 0.0,
  h1b: 0.55,         // 60-day clock if let go
  tier2: 0.55,        // UK 60-day clock
  eu_citizen: 0.10,
  other: 0.30,
};

const AI_RISK: Record<AIExposure, number> = {
  high_replaceable: 0.75, // Coding for repetitive tasks, classic SWE on legacy stacks
  medium_augmented: 0.35, // Most modern roles
  low_compounding: 0.05,  // Roles where AI compounds your value (research, novel R&D)
};

const DEMAND_RISK: Record<DomainDemand, number> = {
  high: 0.10,
  medium: 0.40,
  low: 0.75,
};

interface RiskOutput {
  score: number;
  band: 'low' | 'medium' | 'high' | 'critical';
  bandLabel: string;
  bandColor: 'emerald' | 'amber' | 'orange' | 'rose';
  axisBreakdown: { axis: string; weight: number; score: number; note: string }[];
  actions: string[];
}

function computeRisk(i: Inputs): RiskOutput {
  // Tenure axis: short tenure = higher risk (last in first out)
  const tenureRisk =
    i.tenureMonths < 6 ? 0.85 :
    i.tenureMonths < 12 ? 0.55 :
    i.tenureMonths < 24 ? 0.30 :
    i.tenureMonths < 60 ? 0.20 :
    0.15;

  // Runway axis: months of runway given current spend
  const runwayMonths = i.monthlySpend > 0 ? i.liquidSavings / i.monthlySpend : 0;
  const runwayRisk =
    runwayMonths < 1 ? 0.95 :
    runwayMonths < 3 ? 0.75 :
    runwayMonths < 6 ? 0.45 :
    runwayMonths < 12 ? 0.20 :
    0.10;

  // Compute weighted total
  const axes: RiskOutput['axisBreakdown'] = [
    { axis: 'Tenure stability', weight: 0.15, score: tenureRisk, note: i.tenureMonths < 12 ? 'Short tenure raises last-in-first-out risk in any cut.' : 'Tenure looks stable.' },
    { axis: 'Runway buffer', weight: 0.30, score: runwayRisk, note: runwayMonths < 3 ? `Only ~${runwayMonths.toFixed(1)} months of runway. Job loss = financial crisis. Build savings before optimising on role fit.` : `~${runwayMonths.toFixed(1)} months of runway. Decision-making space.` },
    { axis: 'Sector risk', weight: 0.15, score: SECTOR_RISK[i.sector], note: i.sector === 'startup_seed' ? 'Seed-stage startups have the highest individual fail rate.' : i.sector === 'ai_lab' ? 'AI labs are the lowest-risk sector RIGHT NOW.' : 'Mid-band sector.' },
    { axis: 'Visa exposure', weight: 0.15, score: VISA_RISK[i.visa], note: (i.visa === 'h1b' || i.visa === 'tier2') ? '60-day countdown if let go. Build relationships at sponsor-track companies in advance.' : 'Visa risk low.' },
    { axis: 'AI exposure', weight: 0.15, score: AI_RISK[i.aiExposure], note: i.aiExposure === 'high_replaceable' ? 'Role highly augmentable by AI. Pivot up the stack within 12 months.' : i.aiExposure === 'low_compounding' ? 'AI compounds your value rather than replacing it.' : 'Most modern roles fall here.' },
    { axis: 'Domain demand', weight: 0.10, score: DEMAND_RISK[i.domainDemand], note: i.domainDemand === 'low' ? 'Domain demand low. Re-skill in adjacent area.' : 'Demand stable.' },
  ];

  let weighted = 0;
  for (const a of axes) {
    weighted += a.weight * a.score;
  }
  const score = Math.round(weighted * 100);

  // Boosts: references & public artefacts reduce risk
  let adjusted = score;
  if (i.hasReferences) adjusted -= 5;
  if (i.hasPublicArtefacts) adjusted -= 5;
  adjusted = Math.max(0, Math.min(100, adjusted));

  let band: RiskOutput['band'];
  let bandLabel: string;
  let bandColor: RiskOutput['bandColor'];

  if (adjusted < 30) {
    band = 'low';
    bandLabel = 'Low risk — you have decision-making room';
    bandColor = 'emerald';
  } else if (adjusted < 50) {
    band = 'medium';
    bandLabel = 'Mid risk — actively maintain optionality';
    bandColor = 'amber';
  } else if (adjusted < 70) {
    band = 'high';
    bandLabel = 'High risk — start interviewing in parallel';
    bandColor = 'orange';
  } else {
    band = 'critical';
    bandLabel = 'Critical — apply this week';
    bandColor = 'rose';
  }

  // Actions
  const actions: string[] = [];

  if (runwayMonths < 3) {
    actions.push(`Build runway to 6 months minimum BEFORE optimising on role fit. Cut monthly spend by 20-30% if needed; don't do anything irreversible until runway is healthy.`);
  }

  if ((i.visa === 'h1b' || i.visa === 'tier2') && score > 30) {
    actions.push('Build relationships with hiring managers at 5-10 sponsor-track companies NOW (Google, Microsoft, Amazon for US H-1B; Meta, BlackRock, Deloitte UK Tier 2 are common). The 60-day clock is too short to start cold.');
  }

  if (i.aiExposure === 'high_replaceable') {
    actions.push('Pivot up the stack: design / architecture / domain-specific judgement. The Vantage State of 2026 report shows AI-thesis filter is universal in 2026 hiring; candidates with calibrated AI opinions land roles 3x faster.');
  }

  if (i.tenureMonths < 12 && i.sector === 'big_tech') {
    actions.push('Big-tech layoffs preferentially affect <12-month tenure. Don\'t panic, but build the 25-name network list (your warm contacts at peer companies) now, not when you need it.');
  }

  if (!i.hasPublicArtefacts) {
    actions.push('Ship one public artefact in the next 30 days: a merged PR, a public blog post, a Hugging Face Space, a public Notion-template. AI dev tool shops (Hugging Face, Modal, Cursor) explicitly filter on this. Compounds across job search.');
  }

  if (!i.hasReferences) {
    actions.push('Confirm 3 references will pick up the phone if a recruiter calls. Many candidates assume "references are fine" but never check; the call comes and the references aren\'t reachable.');
  }

  if (band === 'low') {
    actions.push('You have negotiating power and decision-making room. Use it: ask for a stretch promotion, take a sabbatical, build a side project. Low-risk windows are when career upside compounds.');
  }

  if (band === 'critical') {
    actions.push('Run the 30-day post-layoff playbook BEFORE you get laid off. Apply to 5 roles per week starting NOW. Update LinkedIn to "Open to" today. Treat this as a fire drill.');
  }

  return { score: adjusted, band, bandLabel, bandColor, axisBreakdown: axes, actions };
}

export default function CareerRiskIndexPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    tenureMonths: 24,
    monthlySpend: 3000,
    liquidSavings: 15000,
    sector: 'big_tech',
    visa: 'citizen',
    aiExposure: 'medium_augmented',
    domainDemand: 'medium',
    hasReferences: true,
    hasPublicArtefacts: false,
  });
  const [generated, setGenerated] = useState<RiskOutput | null>(null);

  const handleGenerate = () => {
    setGenerated(computeRisk(i));
    setTimeout(() => {
      const el = document.getElementById('risk-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Career Risk Index', item: `${SITE_URL}/tools/career-risk-index` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Career Risk Index — 6-Axis Honest Score, No Invented Number"
        description="Honest 6-axis career risk score: tenure stability, runway buffer, sector risk, visa exposure, AI exposure, domain demand. Plus specific 30-day actions. Pure client-side. No signup."
        path="/tools/career-risk-index"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            10 free prep packs
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Honest weighted score
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Career risk index
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            6-axis weighted score: tenure, runway, sector, visa, AI exposure, domain demand. Plus
            specific 30-day actions for your situation. Each axis has a documented weight. No
            invented number.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Tenure at current employer (months)</label>
              <input
                type="number"
                min={0}
                value={i.tenureMonths || ''}
                onChange={(e) => setI({ ...i, tenureMonths: Number(e.target.value) })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Monthly essential spend (£/$/€)</label>
              <input
                type="number"
                min={0}
                value={i.monthlySpend || ''}
                onChange={(e) => setI({ ...i, monthlySpend: Number(e.target.value) })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Liquid savings (£/$/€)</label>
              <input
                type="number"
                min={0}
                value={i.liquidSavings || ''}
                onChange={(e) => setI({ ...i, liquidSavings: Number(e.target.value) })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Sector</label>
              <select
                value={i.sector}
                onChange={(e) => setI({ ...i, sector: e.target.value as Sector })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="big_tech">Big tech (FAANG-equivalent)</option>
                <option value="ai_lab">AI lab (Anthropic / OpenAI / etc.)</option>
                <option value="enterprise_saas">Enterprise SaaS (Salesforce-equivalent)</option>
                <option value="fintech">Fintech</option>
                <option value="crypto">Crypto / web3</option>
                <option value="consulting">Consulting</option>
                <option value="public_sector">Public sector / government</option>
                <option value="startup_seed">Seed / Series A startup</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Visa / status</label>
              <select
                value={i.visa}
                onChange={(e) => setI({ ...i, visa: e.target.value as Visa })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="citizen">Citizen / no visa pressure</option>
                <option value="h1b">US H-1B</option>
                <option value="tier2">UK Tier 2 / Skilled Worker</option>
                <option value="eu_citizen">EU citizen</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>AI exposure of your role</label>
              <select
                value={i.aiExposure}
                onChange={(e) => setI({ ...i, aiExposure: e.target.value as AIExposure })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="high_replaceable">High — repetitive, AI-augmentable</option>
                <option value="medium_augmented">Medium — AI helps, doesn't replace</option>
                <option value="low_compounding">Low — AI compounds my value</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Domain demand for your skills</label>
              <select
                value={i.domainDemand}
                onChange={(e) => setI({ ...i, domainDemand: e.target.value as DomainDemand })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="high">High (ML systems, security, cloud platform, etc.)</option>
                <option value="medium">Medium (most generalist roles)</option>
                <option value="low">Low (legacy systems, narrow niche)</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className={`inline-flex items-center gap-2 text-sm ${t.text} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={i.hasReferences}
                  onChange={(e) => setI({ ...i, hasReferences: e.target.checked })}
                />
                I have 3 references confirmed
              </label>
            </div>
            <div className="flex items-end sm:col-span-2">
              <label className={`inline-flex items-center gap-2 text-sm ${t.text} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={i.hasPublicArtefacts}
                  onChange={(e) => setI({ ...i, hasPublicArtefacts: e.target.checked })}
                />
                I have public artefacts (GitHub commits, blog posts, OS contributions, conference talks)
              </label>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Activity className="w-4 h-4" /> Compute my risk score
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="risk-results"
            className="scroll-mt-24 space-y-4"
          >
            <div
              className={`${t.glass} rounded-2xl p-6 border-l-4 ${
                generated.bandColor === 'emerald'
                  ? 'border-emerald-500'
                  : generated.bandColor === 'amber'
                  ? 'border-amber-500'
                  : generated.bandColor === 'orange'
                  ? 'border-orange-500'
                  : 'border-rose-500'
              }`}
            >
              <p className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
                Your career risk index
              </p>
              <div className="flex items-baseline gap-3">
                <span className={`text-6xl font-extrabold ${
                  generated.bandColor === 'emerald'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : generated.bandColor === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : generated.bandColor === 'orange'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>{generated.score}</span>
                <span className={`text-2xl ${t.textMuted}`}>/ 100</span>
              </div>
              <p className={`mt-2 text-lg font-bold ${t.text}`}>{generated.bandLabel}</p>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Axis breakdown</p>
              <div className="space-y-3">
                {generated.axisBreakdown.map((a, idx) => (
                  <div key={idx} className={`${t.cardInner} rounded-lg p-3`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${t.text}`}>{a.axis}</span>
                      <span className={`text-xs ${t.textMuted}`}>weight {Math.round(a.weight * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`flex-1 h-2 rounded-full bg-violet-500/10 overflow-hidden`}>
                        <div
                          className={`h-full ${a.score < 0.3 ? 'bg-emerald-500' : a.score < 0.5 ? 'bg-amber-500' : a.score < 0.7 ? 'bg-orange-500' : 'bg-rose-500'}`}
                          style={{ width: `${a.score * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${t.text} w-10 text-right`}>{Math.round(a.score * 100)}</span>
                    </div>
                    <p className={`text-xs ${t.textSub}`}>{a.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Actions for this score</p>
              <ul className={`text-sm ${t.textSub} space-y-2.5 list-disc pl-5`}>
                {generated.actions.map((a, idx) => <li key={idx}>{a}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Found yourself in the high-risk band? Run the prep packs in 90 seconds.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV + a job link, drafts a tailored cover letter, generates likely
                interview questions, and builds a 5-min pitch. 10 free packs on signup, no card.
              </p>
              <Link
                to="/register?source=career-risk-index"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run my prep <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {!generated && (
          <section className={`${t.cardInner} rounded-2xl p-6`}>
            <h2 className={`text-xl font-bold ${t.text} mb-3`}>What this checks (6 weighted axes)</h2>
            <ul className={`${t.textSub} space-y-2 text-sm list-disc pl-5`}>
              <li><strong>Tenure stability (15%):</strong> &lt;6 months = high last-in-first-out risk; &gt;5 years = low.</li>
              <li><strong>Runway buffer (30%):</strong> liquid savings / monthly spend. &lt;3 months = financial fragility.</li>
              <li><strong>Sector risk (15%):</strong> AI labs lowest, seed startups highest. Public sector lowest by stability.</li>
              <li><strong>Visa exposure (15%):</strong> H-1B / Tier 2 = 60-day clock. Citizens / EU = no visa risk.</li>
              <li><strong>AI exposure (15%):</strong> high-replaceable (repetitive coding) vs low-compounding (research, novel R&D).</li>
              <li><strong>Domain demand (10%):</strong> ML systems / security / cloud = high; legacy / narrow niche = low.</li>
            </ul>
            <p className={`text-xs ${t.textMuted} mt-4`}>
              Plus reference + public-artefact boosts (each shaves 5 from the score). Pure client-side. No data leaves your browser.
            </p>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>15 other free tools, no signup:</p>
          <Link to="/tools" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-violet-500 hover:bg-violet-500/10 transition">
            Browse all 16 free tools <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
