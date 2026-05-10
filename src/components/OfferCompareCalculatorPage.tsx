import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Calculator, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/offer-compare -- side-by-side 4-year total comp calculator
 * for comparing 2 job offers honestly. Pure client-side. No LLM.
 *
 * Drafted 2026-05-10. Captures the "compare job offers" / "offer
 * calculator" search-traffic surface AND directly addresses a high-
 * intent moment (someone with 2 offers is in the buying window).
 *
 * Deliberately conservative: discounts public-co RSU for stock-price
 * risk, discounts private-co RSU more heavily (illiquidity premium
 * + 409A vs FMV gap), separates base from bonus from equity so user
 * sees where each offer is leaning.
 */

type Currency = 'gbp' | 'usd' | 'eur';
type EquityType = 'public' | 'private' | 'none';

interface Offer {
  label: string;
  company: string;
  base: number;
  bonusPct: number; // % of base
  sign: number;
  equityType: EquityType;
  rsuTotal: number; // 4y total grant value at offer
  vestingMonths: number; // typical 48
  cliffMonths: number; // typical 12 for new grants
  refreshPct: number; // expected annual refresh, % of original grant
  pto: number; // days/year
  remote: 'remote' | 'hybrid' | 'office';
}

interface Inputs {
  currency: Currency;
  offerA: Offer;
  offerB: Offer;
  growthAssumption: 'flat' | 'conservative' | 'bullish';
}

const SYMBOL: Record<Currency, string> = { gbp: '£', usd: '$', eur: '€' };

const emptyOffer = (label: string): Offer => ({
  label,
  company: '',
  base: 0,
  bonusPct: 0,
  sign: 0,
  equityType: 'public',
  rsuTotal: 0,
  vestingMonths: 48,
  cliffMonths: 12,
  refreshPct: 0,
  pto: 25,
  remote: 'hybrid',
});

function formatMoney(n: number, c: Currency, opts?: { compact?: boolean }): string {
  if (!isFinite(n)) return '-';
  if (opts?.compact && Math.abs(n) >= 1000) {
    return `${SYMBOL[c]}${(n / 1000).toFixed(0)}k`;
  }
  return `${SYMBOL[c]}${Math.round(n).toLocaleString('en-GB')}`;
}

// Per-year equity vest given linear vesting after cliff
function equityVestPerYear(o: Offer, growth: number): number[] {
  // 4-year breakdown
  const years: number[] = [0, 0, 0, 0];
  if (o.equityType === 'none' || o.rsuTotal <= 0) return years;
  const monthly = o.rsuTotal / o.vestingMonths;
  let monthsVested = 0;
  for (let y = 0; y < 4; y++) {
    let monthsThisYear = 0;
    for (let m = 1; m <= 12; m++) {
      monthsVested++;
      if (monthsVested <= o.cliffMonths) {
        // cliff: nothing vests this month, but it accrues for cliff payout
        continue;
      }
      // After cliff, monthly vests. The cliff month itself pays out the
      // accumulated cliff-amount.
      if (monthsVested === o.cliffMonths + 1) {
        monthsThisYear += o.cliffMonths + 1;
      } else {
        monthsThisYear += 1;
      }
    }
    years[y] = monthly * monthsThisYear * Math.pow(1 + growth, y);
  }
  return years;
}

// Refresh grants typically arrive at year-end and vest over next 4 years.
// We simplify and assume refresh value is realised pro-rata 1/4 per future year.
function refreshGrantPerYear(o: Offer, growth: number): number[] {
  const years: number[] = [0, 0, 0, 0];
  if (o.equityType === 'none' || o.refreshPct <= 0 || o.rsuTotal <= 0) return years;
  const refreshAnnual = (o.rsuTotal / 4) * (o.refreshPct / 100);
  // Refresh at end of Y1 -> vests Y2,Y3,Y4 (we assume 1y cliff carries; pragmatic 1/4 per year over 4y but only counts within our 4y window)
  for (let y = 1; y < 4; y++) {
    // refresh granted at end of year y, vests over next 4y; within our 4-year window, only (4 - y) years of vest applies
    const yearsRemaining = 4 - y;
    if (yearsRemaining <= 0) continue;
    const refreshThisYear = (refreshAnnual * yearsRemaining) / 4;
    years[y] += refreshThisYear * Math.pow(1 + growth, y);
  }
  return years;
}

// Risk discount applied to equity (public: stock-price risk; private: illiquidity)
function equityDiscount(equityType: EquityType, growthAssumption: Inputs['growthAssumption']): number {
  // discount applied AFTER growth assumption
  if (equityType === 'none') return 1;
  if (equityType === 'public') {
    if (growthAssumption === 'flat') return 0.90; // small discount for vol
    if (growthAssumption === 'conservative') return 0.85;
    return 0.80; // bullish assumption already inflated; discount more to hedge optimism
  }
  // private
  if (growthAssumption === 'flat') return 0.65; // illiquidity, no liquidity event guaranteed
  if (growthAssumption === 'conservative') return 0.55;
  return 0.45; // bullish: private equity bullishness is the riskiest; heavy hedge
}

function growthRate(g: Inputs['growthAssumption']): number {
  if (g === 'flat') return 0;
  if (g === 'conservative') return 0.05;
  return 0.15;
}

function computeOfferTotals(o: Offer, growthAssumption: Inputs['growthAssumption']) {
  const growth = growthRate(growthAssumption);
  const discount = equityDiscount(o.equityType, growthAssumption);
  const baseYears = [0, 1, 2, 3].map((y) => o.base * Math.pow(1 + growth, y));
  const bonusYears = baseYears.map((b) => b * (o.bonusPct / 100));
  const initialEquityYears = equityVestPerYear(o, growth).map((v) => v * discount);
  const refreshYears = refreshGrantPerYear(o, growth).map((v) => v * discount);
  const signYears = [o.sign, 0, 0, 0];
  const totalPerYear = baseYears.map((b, idx) =>
    b + bonusYears[idx] + initialEquityYears[idx] + refreshYears[idx] + signYears[idx]
  );
  return {
    baseYears,
    bonusYears,
    initialEquityYears,
    refreshYears,
    signYears,
    totalPerYear,
    total4yr: totalPerYear.reduce((a, b) => a + b, 0),
  };
}

interface OfferResult {
  baseYears: number[];
  bonusYears: number[];
  initialEquityYears: number[];
  refreshYears: number[];
  signYears: number[];
  totalPerYear: number[];
  total4yr: number;
}

function buildAnalysis(i: Inputs): {
  resA: OfferResult;
  resB: OfferResult;
  winner: 'A' | 'B' | 'tie';
  deltaPct: number;
  warnings: string[];
  insights: string[];
} {
  const resA = computeOfferTotals(i.offerA, i.growthAssumption);
  const resB = computeOfferTotals(i.offerB, i.growthAssumption);
  const winner: 'A' | 'B' | 'tie' = resA.total4yr === resB.total4yr ? 'tie' : (resA.total4yr > resB.total4yr ? 'A' : 'B');
  const high = Math.max(resA.total4yr, resB.total4yr);
  const low = Math.min(resA.total4yr, resB.total4yr);
  const deltaPct = low > 0 ? ((high - low) / low) * 100 : 0;

  const warnings: string[] = [];
  const insights: string[] = [];

  // Base-heavy vs equity-heavy analysis
  const equityShareA = resA.total4yr > 0
    ? (resA.initialEquityYears.reduce((a, b) => a + b, 0) + resA.refreshYears.reduce((a, b) => a + b, 0)) / resA.total4yr
    : 0;
  const equityShareB = resB.total4yr > 0
    ? (resB.initialEquityYears.reduce((a, b) => a + b, 0) + resB.refreshYears.reduce((a, b) => a + b, 0)) / resB.total4yr
    : 0;

  if (equityShareA > 0.4 && i.offerA.equityType === 'private') {
    warnings.push(`Offer A (${i.offerA.company || 'A'}) leans heavily on private-company equity (${Math.round(equityShareA * 100)}% of total). The calculation already discounts heavily, but if no liquidity event happens, this becomes paper.`);
  }
  if (equityShareB > 0.4 && i.offerB.equityType === 'private') {
    warnings.push(`Offer B (${i.offerB.company || 'B'}) leans heavily on private-company equity (${Math.round(equityShareB * 100)}% of total). The calculation already discounts heavily, but if no liquidity event happens, this becomes paper.`);
  }
  if (i.offerA.cliffMonths >= 12 && i.offerA.rsuTotal > 0) {
    insights.push(`Offer A has a ${i.offerA.cliffMonths}-month cliff. If you leave inside ${i.offerA.cliffMonths} months, you walk away with zero equity from A.`);
  }
  if (i.offerB.cliffMonths >= 12 && i.offerB.rsuTotal > 0) {
    insights.push(`Offer B has a ${i.offerB.cliffMonths}-month cliff. If you leave inside ${i.offerB.cliffMonths} months, you walk away with zero equity from B.`);
  }

  // Sign-bonus volatility
  if (i.offerA.sign > 50000) {
    insights.push(`Offer A has a ${formatMoney(i.offerA.sign, i.currency)} signing bonus — high. Confirm the clawback period (usually 1-2 years).`);
  }
  if (i.offerB.sign > 50000) {
    insights.push(`Offer B has a ${formatMoney(i.offerB.sign, i.currency)} signing bonus — high. Confirm the clawback period (usually 1-2 years).`);
  }

  // Refresh missing
  if (i.offerA.rsuTotal > 0 && i.offerA.refreshPct === 0) {
    warnings.push(`Offer A shows zero refresh % — this is the default but unusual at public companies. Ask "what's the typical refresh cadence and band?" before deciding.`);
  }
  if (i.offerB.rsuTotal > 0 && i.offerB.refreshPct === 0) {
    warnings.push(`Offer B shows zero refresh % — this is the default but unusual at public companies. Ask "what's the typical refresh cadence and band?" before deciding.`);
  }

  // PTO + remote tradeoffs
  if (i.offerA.pto - i.offerB.pto >= 5) {
    insights.push(`Offer A gives ${i.offerA.pto - i.offerB.pto} more PTO days than B. Worth ~${Math.round(((i.offerA.pto - i.offerB.pto) / 250) * 100)}% of base salary in time-value alone.`);
  } else if (i.offerB.pto - i.offerA.pto >= 5) {
    insights.push(`Offer B gives ${i.offerB.pto - i.offerA.pto} more PTO days than A. Worth ~${Math.round(((i.offerB.pto - i.offerA.pto) / 250) * 100)}% of base salary in time-value alone.`);
  }

  if (i.offerA.remote === 'office' && i.offerB.remote === 'remote') {
    insights.push(`Offer B is remote vs A in-office. The commute + lunch + clothes cost difference is often £3-6k/year of unmeasured value swinging to B.`);
  } else if (i.offerB.remote === 'office' && i.offerA.remote === 'remote') {
    insights.push(`Offer A is remote vs B in-office. The commute + lunch + clothes cost difference is often £3-6k/year of unmeasured value swinging to A.`);
  }

  if (deltaPct < 5) {
    insights.push(`The 4-year total difference is under 5% — close enough that team / manager / growth trajectory / your gut should decide, not the number.`);
  }

  return { resA, resB, winner, deltaPct, warnings, insights };
}

export default function OfferCompareCalculatorPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    currency: 'gbp',
    offerA: emptyOffer('A'),
    offerB: emptyOffer('B'),
    growthAssumption: 'conservative',
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildAnalysis> | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = i.offerA.base > 0 && i.offerB.base > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerated(buildAnalysis(i));
    setTimeout(() => {
      const el = document.getElementById('compare-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async () => {
    if (!generated) return;
    const summary = [
      `OFFER COMPARISON — ${i.offerA.company || 'Offer A'} vs ${i.offerB.company || 'Offer B'}`,
      ``,
      `Growth assumption: ${i.growthAssumption}`,
      ``,
      `Offer A 4-year total: ${formatMoney(generated.resA.total4yr, i.currency)}`,
      `Offer B 4-year total: ${formatMoney(generated.resB.total4yr, i.currency)}`,
      ``,
      `Winner on number: ${generated.winner === 'tie' ? 'Tie' : (generated.winner === 'A' ? (i.offerA.company || 'A') : (i.offerB.company || 'B'))} by ${generated.deltaPct.toFixed(1)}%`,
      ``,
      `Warnings:`,
      ...generated.warnings.map((w) => `- ${w}`),
      ``,
      `Insights:`,
      ...generated.insights.map((s) => `- ${s}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Offer Comparison', item: `${SITE_URL}/tools/offer-compare` },
    ],
  }), []);

  const renderOfferInputs = (which: 'A' | 'B') => {
    const o = which === 'A' ? i.offerA : i.offerB;
    const setOffer = (next: Offer) => {
      if (which === 'A') setI({ ...i, offerA: next });
      else setI({ ...i, offerB: next });
    };
    return (
      <div className={`${t.glass} rounded-2xl p-5`}>
        <h3 className={`text-lg font-bold ${t.text} mb-3`}>Offer {which}</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={`block text-xs font-semibold ${t.text} mb-1`}>Company</label>
            <input
              type="text"
              value={o.company}
              onChange={(e) => setOffer({ ...o, company: e.target.value })}
              placeholder={which === 'A' ? 'Stripe' : 'Anthropic'}
              className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Base salary</label>
              <input
                type="number"
                value={o.base || ''}
                onChange={(e) => setOffer({ ...o, base: Number(e.target.value) })}
                placeholder="120000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Bonus % of base</label>
              <input
                type="number"
                value={o.bonusPct || ''}
                onChange={(e) => setOffer({ ...o, bonusPct: Number(e.target.value) })}
                placeholder="15"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Signing bonus</label>
              <input
                type="number"
                value={o.sign || ''}
                onChange={(e) => setOffer({ ...o, sign: Number(e.target.value) })}
                placeholder="15000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Equity type</label>
              <select
                value={o.equityType}
                onChange={(e) => setOffer({ ...o, equityType: e.target.value as EquityType })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="public">Public RSU</option>
                <option value="private">Private equity / options</option>
                <option value="none">No equity</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>RSU total (4y)</label>
              <input
                type="number"
                value={o.rsuTotal || ''}
                onChange={(e) => setOffer({ ...o, rsuTotal: Number(e.target.value) })}
                placeholder="200000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Vesting (months)</label>
              <input
                type="number"
                value={o.vestingMonths || ''}
                onChange={(e) => setOffer({ ...o, vestingMonths: Number(e.target.value) })}
                placeholder="48"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Cliff (months)</label>
              <input
                type="number"
                value={o.cliffMonths || ''}
                onChange={(e) => setOffer({ ...o, cliffMonths: Number(e.target.value) })}
                placeholder="12"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Annual refresh %</label>
              <input
                type="number"
                value={o.refreshPct || ''}
                onChange={(e) => setOffer({ ...o, refreshPct: Number(e.target.value) })}
                placeholder="25"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>PTO (days)</label>
              <input
                type="number"
                value={o.pto || ''}
                onChange={(e) => setOffer({ ...o, pto: Number(e.target.value) })}
                placeholder="25"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Remote / Hybrid / Office</label>
              <select
                value={o.remote}
                onChange={(e) => setOffer({ ...o, remote: e.target.value as Offer['remote'] })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="office">In-office</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Job Offer Comparison Calculator — 4-Year Total Comp Side-by-Side"
        description="Free in-browser calculator that compares 2 job offers across 4 years. Base + bonus + signing + RSU + refresh grants + PTO + remote. Discounts public RSU for stock-price risk and private equity for illiquidity. Pure client-side, no data leaves your browser."
        path="/tools/offer-compare"
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Job offer comparison calculator
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Compare 2 offers across 4 years. Base + bonus + signing + RSU + refresh + PTO + remote.
            Discounts public RSU for stock-price risk, private equity for illiquidity. Pure client-side.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-4`}>
          <div>
            <label className={`block text-xs font-semibold ${t.text} mb-1`}>Currency</label>
            <select
              value={i.currency}
              onChange={(e) => setI({ ...i, currency: e.target.value as Currency })}
              className={`rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
            >
              <option value="gbp">GBP (£)</option>
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold ${t.text} mb-1`}>Growth assumption (base + equity)</label>
            <select
              value={i.growthAssumption}
              onChange={(e) => setI({ ...i, growthAssumption: e.target.value as Inputs['growthAssumption'] })}
              className={`rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
            >
              <option value="flat">Flat (0% / year)</option>
              <option value="conservative">Conservative (5% / year)</option>
              <option value="bullish">Bullish (15% / year)</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {renderOfferInputs('A')}
          {renderOfferInputs('B')}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              canGenerate
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/40'
            }`}
          >
            <Calculator className="w-4 h-4" /> Compare offers
          </button>
          {!canGenerate && (
            <span className={`text-xs ${t.textMuted}`}>
              Fill in base salary for both offers to compare.
            </span>
          )}
        </div>

        {generated && (
          <section
            id="compare-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="results-heading" className={`text-2xl font-bold ${t.text}`}>
                The numbers
              </h2>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                }`}
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy summary</>}
              </button>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>4-year total comp (risk-adjusted)</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`${t.cardInner} rounded-xl p-4 ${generated.winner === 'A' ? 'border-2 border-emerald-500/40' : ''}`}>
                  <p className={`text-xs ${t.textMuted}`}>{i.offerA.company || 'Offer A'}</p>
                  <p className={`text-2xl font-extrabold ${t.text}`}>{formatMoney(generated.resA.total4yr, i.currency)}</p>
                </div>
                <div className={`${t.cardInner} rounded-xl p-4 ${generated.winner === 'B' ? 'border-2 border-emerald-500/40' : ''}`}>
                  <p className={`text-xs ${t.textMuted}`}>{i.offerB.company || 'Offer B'}</p>
                  <p className={`text-2xl font-extrabold ${t.text}`}>{formatMoney(generated.resB.total4yr, i.currency)}</p>
                </div>
              </div>
              <p className={`text-sm ${t.textSub}`}>
                {generated.winner === 'tie'
                  ? 'Both offers come out equal on number.'
                  : `${generated.winner === 'A' ? (i.offerA.company || 'Offer A') : (i.offerB.company || 'Offer B')} wins on number by ${generated.deltaPct.toFixed(1)}%.`}
              </p>
            </div>

            <div className={`${t.glass} rounded-2xl p-5 overflow-x-auto`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Year-by-year breakdown</p>
              <table className={`w-full text-sm ${t.text}`}>
                <thead>
                  <tr className={`text-left ${t.textMuted} text-xs uppercase tracking-wider border-b ${t.divider}`}>
                    <th className="py-2 pr-2">Component</th>
                    <th className="py-2 pr-2 text-right">Y1</th>
                    <th className="py-2 pr-2 text-right">Y2</th>
                    <th className="py-2 pr-2 text-right">Y3</th>
                    <th className="py-2 pr-2 text-right">Y4</th>
                    <th className="py-2 pr-2 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b ${t.divider}`}>
                    <td colSpan={6} className={`py-2 text-xs font-bold ${t.textMuted} uppercase`}>{i.offerA.company || 'Offer A'}</td>
                  </tr>
                  {[
                    { label: 'Base', vals: generated.resA.baseYears },
                    { label: 'Bonus', vals: generated.resA.bonusYears },
                    { label: 'Initial equity (vest, discounted)', vals: generated.resA.initialEquityYears },
                    { label: 'Refresh grants', vals: generated.resA.refreshYears },
                    { label: 'Signing', vals: generated.resA.signYears },
                  ].map((row) => (
                    <tr key={`A-${row.label}`} className={`border-b ${t.divider}`}>
                      <td className={`py-1.5 pr-2 ${t.textSub}`}>{row.label}</td>
                      {row.vals.map((v, idx) => (
                        <td key={idx} className={`py-1.5 pr-2 text-right ${t.text}`}>{v > 0 ? formatMoney(v, i.currency) : '-'}</td>
                      ))}
                      <td className={`py-1.5 pr-2 text-right font-semibold ${t.text}`}>{formatMoney(row.vals.reduce((a, b) => a + b, 0), i.currency)}</td>
                    </tr>
                  ))}
                  <tr className={`font-bold border-b-2 ${t.divider}`}>
                    <td className="py-1.5 pr-2">Total</td>
                    {generated.resA.totalPerYear.map((v, idx) => (
                      <td key={idx} className="py-1.5 pr-2 text-right">{formatMoney(v, i.currency)}</td>
                    ))}
                    <td className="py-1.5 pr-2 text-right">{formatMoney(generated.resA.total4yr, i.currency)}</td>
                  </tr>
                  <tr className={`border-b ${t.divider}`}>
                    <td colSpan={6} className={`py-2 text-xs font-bold ${t.textMuted} uppercase`}>{i.offerB.company || 'Offer B'}</td>
                  </tr>
                  {[
                    { label: 'Base', vals: generated.resB.baseYears },
                    { label: 'Bonus', vals: generated.resB.bonusYears },
                    { label: 'Initial equity (vest, discounted)', vals: generated.resB.initialEquityYears },
                    { label: 'Refresh grants', vals: generated.resB.refreshYears },
                    { label: 'Signing', vals: generated.resB.signYears },
                  ].map((row) => (
                    <tr key={`B-${row.label}`} className={`border-b ${t.divider}`}>
                      <td className={`py-1.5 pr-2 ${t.textSub}`}>{row.label}</td>
                      {row.vals.map((v, idx) => (
                        <td key={idx} className={`py-1.5 pr-2 text-right ${t.text}`}>{v > 0 ? formatMoney(v, i.currency) : '-'}</td>
                      ))}
                      <td className={`py-1.5 pr-2 text-right font-semibold ${t.text}`}>{formatMoney(row.vals.reduce((a, b) => a + b, 0), i.currency)}</td>
                    </tr>
                  ))}
                  <tr className={`font-bold`}>
                    <td className="py-1.5 pr-2">Total</td>
                    {generated.resB.totalPerYear.map((v, idx) => (
                      <td key={idx} className="py-1.5 pr-2 text-right">{formatMoney(v, i.currency)}</td>
                    ))}
                    <td className="py-1.5 pr-2 text-right">{formatMoney(generated.resB.total4yr, i.currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {generated.warnings.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-amber-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h3 className={`font-bold ${t.text}`}>What this doesn't capture</h3>
                </div>
                <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                  {generated.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            )}

            {generated.insights.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Insights</p>
                <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                  {generated.insights.map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
            )}

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Got the offer? Prep the next interview before you negotiate harder.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV and the actual job link, gives you the company-specific
                interview prep + cover letter + fit score. 90 seconds. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=offer-compare"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run the prep <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>Other free tools, no signup:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation script generator</Link>
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast my cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection email</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job detector</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS keyword scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>CV bullet rewriter</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
