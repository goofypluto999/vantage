import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MessageSquare, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/negotiation-script -- salary negotiation script generator.
 * Pure client-side. No LLM. Deterministic templates branched on the
 * specific offer + asks.
 *
 * Drafted 2026-05-10. 9th free tool. Captures the "negotiation script"
 * + "counter-offer template" search-traffic surface. The negotiation
 * moment is THE highest-leverage single point in a job search:
 * a 10-minute negotiation can move base salary by GBP 10k+ at senior
 * levels, refresh equity by 25%+, or shift remote/hybrid policy.
 */

type Currency = 'gbp' | 'usd' | 'eur';
type Channel = 'email' | 'phone';
type Tone = 'collaborative' | 'firm';

interface Inputs {
  currency: Currency;
  recruiterName: string;
  company: string;
  role: string;
  baseOffered: number;
  baseTarget: number;
  signOffered: number;
  signTarget: number;
  rsuOffered: number;
  rsuTarget: number;
  pto: 'none' | 'unlimited' | 'fixed';
  hasCompetingOffer: boolean;
  competingCompany: string;
  preferredChannel: Channel;
  tone: Tone;
}

const SYMBOL: Record<Currency, string> = { gbp: '£', usd: '$', eur: '€' };

function formatMoney(n: number, c: Currency): string {
  if (!n) return '';
  return `${SYMBOL[c]}${n.toLocaleString('en-GB')}`;
}

function buildScript(i: Inputs): { subject: string; body: string; talkingPoints: string[]; warnings: string[] } {
  const recruiter = i.recruiterName.trim() || '[Recruiter]';
  const company = i.company.trim() || '[Company]';
  const role = i.role.trim() || 'the role';
  const baseDelta = i.baseTarget - i.baseOffered;
  const signDelta = i.signTarget - i.signOffered;
  const rsuDelta = i.rsuTarget - i.rsuOffered;
  const hasBaseAsk = baseDelta > 0;
  const hasSignAsk = signDelta > 0;
  const hasRsuAsk = rsuDelta > 0;

  const warnings: string[] = [];
  if (i.baseTarget > 0 && i.baseOffered > 0 && i.baseTarget / i.baseOffered > 1.5) {
    warnings.push(`Asking for ${Math.round(((i.baseTarget / i.baseOffered) - 1) * 100)}% above base is aggressive. Most successful base-only negotiations land at +5% to +18%. Consider lowering the base ask and shifting the gap into signing or RSU instead — recruiters have more flex on those.`);
  }
  if (!i.hasCompetingOffer && (hasBaseAsk || hasSignAsk || hasRsuAsk)) {
    warnings.push(`No competing offer named. Negotiations without a stated competing offer succeed less often. If you have ANY active interview pipeline, you can honestly reference it (without lying about a specific number) — "I have other conversations active and want to make sure we're aligned" is usable.`);
  }
  if (i.signTarget > 50000 && i.currency === 'gbp') {
    warnings.push('Signing bonuses over GBP 50k are unusual outside of FAANG / hedge fund / ex-FAANG counter-offers. Confirm this is realistic for the company before opening with it.');
  }

  const subject = `${role} offer — quick discussion`;

  const greeting = i.preferredChannel === 'email'
    ? `Hi ${recruiter},\n\n`
    : `${recruiter}, thanks for taking my call. `;

  // Opening — anchor + appreciation
  let opening: string;
  if (i.tone === 'collaborative') {
    opening = `Thanks for the offer for ${role} at ${company}. I'm genuinely excited about the team and the work, and I want to be transparent about what would let me say yes confidently.`;
  } else {
    opening = `I appreciate the offer for ${role} at ${company}. Before I sign, I want to align on a few specifics.`;
  }

  // Asks
  const askLines: string[] = [];
  if (hasBaseAsk) {
    askLines.push(`On base: the offer is ${formatMoney(i.baseOffered, i.currency)}; my target for this level is ${formatMoney(i.baseTarget, i.currency)}. The ${formatMoney(baseDelta, i.currency)} delta closes the gap with my expectations / market data / current package.`);
  }
  if (hasSignAsk) {
    askLines.push(`On signing: ${formatMoney(i.signOffered, i.currency)} is offered; ${formatMoney(i.signTarget, i.currency)} would help me bridge the transition. Recruiters typically have more flex on signing than base.`);
  }
  if (hasRsuAsk) {
    askLines.push(`On RSU / equity: ${formatMoney(i.rsuOffered, i.currency)} grant offered; ${formatMoney(i.rsuTarget, i.currency)} would put the package in line with my level expectations. I'm flexible on whether that comes as initial grant size or a refresh schedule.`);
  }

  // Competing-offer leverage
  let leverage = '';
  if (i.hasCompetingOffer) {
    const compName = i.competingCompany.trim() || 'another company';
    leverage = `\n\nQuick context: I have an active offer from ${compName}. I'd prefer ${company} on fit, but I need to give them an answer in the next [X] days.`;
  } else {
    leverage = '\n\nQuick context: I have other active conversations and want to make sure we\'re aligned before I commit, since this is meaningful to my decision.';
  }

  // PTO
  let ptoLine = '';
  if (i.pto === 'fixed') {
    ptoLine = `\n\nOne more — could you confirm the PTO policy and whether there's flex on the starting allowance? Coming from somewhere with [X] days, going below that would be a step back.`;
  } else if (i.pto === 'unlimited') {
    ptoLine = '\n\nFor PTO: I noted unlimited. Could you share the team\'s actual median? "Unlimited" varies a lot in practice and I want to plan around what\'s real.';
  }

  // Closing
  const closing = i.tone === 'collaborative'
    ? `\n\nI'd love to find a path forward that works for both of us. Happy to jump on a call to talk this through if easier than email.\n\nThanks,\n[Your name]`
    : `\n\nLet me know what's possible. Happy to discuss on a call.\n\nBest,\n[Your name]`;

  let body = greeting + opening + '\n\n' + askLines.map((l) => `- ${l}`).join('\n') + leverage + ptoLine + closing;

  // Phone variant — strip email format
  if (i.preferredChannel === 'phone') {
    body = `[OPEN]: "${greeting}I want to walk through three things before I sign."

[ASKS, in order, pause after each]:
${askLines.map((l, idx) => `${idx + 1}. ${l}`).join('\n')}

[LEVERAGE]: "${leverage.trim()}"

[CLOSE]: "What flex do you have on those three?"

[IF THEY PUSH BACK ON ALL THREE]: "OK, which one has the most flex right now?" — then negotiate on that ONE.

[IF THEY OFFER PARTIAL]: "Thanks. I'd like to think about it overnight and confirm tomorrow." — never accept on the call. Buy 24h.`;
  }

  // Talking points the user should remember
  const talkingPoints: string[] = [];
  talkingPoints.push('NEVER accept the first counter-offer on the call. Always ask for 24h.');
  talkingPoints.push('If they push back on all three asks, ask: "which one has the most flex?" and negotiate on that.');
  talkingPoints.push('Silence after stating an ask is a tactic. Do not fill the silence. Wait.');
  if (i.hasCompetingOffer) {
    talkingPoints.push(`Do NOT lie about ${i.competingCompany.trim() || 'the competing offer'}'s number. Recruiters check. If you do not know, say "around X" with a number you can defend.`);
  }
  talkingPoints.push('"Best and final" is not always best and final. It is OK to push once after that — politely.');
  talkingPoints.push('PTO, start date, remote/hybrid, equity refresh schedule, sabbatical eligibility — all negotiable. Do not focus only on base.');
  talkingPoints.push('After they agree to anything, say: "Could you put that in writing?" before celebrating. Verbal agreements break.');

  return { subject, body, talkingPoints, warnings };
}

export default function NegotiationScriptPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    currency: 'gbp',
    recruiterName: '',
    company: '',
    role: '',
    baseOffered: 0,
    baseTarget: 0,
    signOffered: 0,
    signTarget: 0,
    rsuOffered: 0,
    rsuTarget: 0,
    pto: 'none',
    hasCompetingOffer: false,
    competingCompany: '',
    preferredChannel: 'email',
    tone: 'collaborative',
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildScript> | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = i.baseOffered > 0 && i.baseTarget > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerated(buildScript(i));
    setTimeout(() => {
      const el = document.getElementById('script-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async () => {
    if (!generated) return;
    const text = i.preferredChannel === 'email'
      ? `Subject: ${generated.subject}\n\n${generated.body}`
      : generated.body;
    try {
      await navigator.clipboard.writeText(text);
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
      { '@type': 'ListItem', position: 3, name: 'Negotiation Script', item: `${SITE_URL}/tools/negotiation-script` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Salary Negotiation Script Generator — Email or Phone"
        description="Free in-browser salary negotiation script generator. Plug in your offer + target asks (base, signing, RSU). Get a personalised script in email or phone format, plus the 7 talking points that win negotiations. Pure client-side."
        path="/tools/negotiation-script"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">AimVantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            10 free prep packs
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Salary negotiation script
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Plug in your offer + target asks (base, signing, RSU). Get a personalised script in email
            or phone format, plus the 7 talking points that win negotiations. Pure client-side, no
            data leaves your browser.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          {/* Basic info */}
          <h2 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted} mb-3`}>Offer details</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="currency" className={`block text-xs font-semibold ${t.text} mb-1`}>Currency</label>
              <select
                id="currency"
                value={i.currency}
                onChange={(e) => setI({ ...i, currency: e.target.value as Currency })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="gbp">GBP (£)</option>
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
              </select>
            </div>
            <div>
              <label htmlFor="recruiter" className={`block text-xs font-semibold ${t.text} mb-1`}>Recruiter name</label>
              <input
                id="recruiter"
                type="text"
                value={i.recruiterName}
                onChange={(e) => setI({ ...i, recruiterName: e.target.value })}
                placeholder="Sarah"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label htmlFor="company" className={`block text-xs font-semibold ${t.text} mb-1`}>Company</label>
              <input
                id="company"
                type="text"
                value={i.company}
                onChange={(e) => setI({ ...i, company: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label htmlFor="role" className={`block text-xs font-semibold ${t.text} mb-1`}>Role title</label>
              <input
                id="role"
                type="text"
                value={i.role}
                onChange={(e) => setI({ ...i, role: e.target.value })}
                placeholder="Senior Product Manager"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>

          {/* Asks */}
          <h2 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted} mb-3 mt-2`}>Your asks</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Base offered</label>
              <input
                type="number"
                value={i.baseOffered || ''}
                onChange={(e) => setI({ ...i, baseOffered: Number(e.target.value) })}
                placeholder="120000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Base target</label>
              <input
                type="number"
                value={i.baseTarget || ''}
                onChange={(e) => setI({ ...i, baseTarget: Number(e.target.value) })}
                placeholder="135000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Signing offered</label>
              <input
                type="number"
                value={i.signOffered || ''}
                onChange={(e) => setI({ ...i, signOffered: Number(e.target.value) })}
                placeholder="0"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Signing target</label>
              <input
                type="number"
                value={i.signTarget || ''}
                onChange={(e) => setI({ ...i, signTarget: Number(e.target.value) })}
                placeholder="15000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>RSU offered (4y total)</label>
              <input
                type="number"
                value={i.rsuOffered || ''}
                onChange={(e) => setI({ ...i, rsuOffered: Number(e.target.value) })}
                placeholder="0"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>RSU target (4y total)</label>
              <input
                type="number"
                value={i.rsuTarget || ''}
                onChange={(e) => setI({ ...i, rsuTarget: Number(e.target.value) })}
                placeholder="80000"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>

          {/* Context */}
          <h2 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted} mb-3 mt-2`}>Context</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>PTO offered</label>
              <select
                value={i.pto}
                onChange={(e) => setI({ ...i, pto: e.target.value as Inputs['pto'] })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="none">Don't ask about PTO</option>
                <option value="fixed">Fixed (want to confirm/negotiate days)</option>
                <option value="unlimited">"Unlimited" (want clarity on actual norm)</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className={`inline-flex items-center gap-2 text-sm ${t.text} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={i.hasCompetingOffer}
                  onChange={(e) => setI({ ...i, hasCompetingOffer: e.target.checked })}
                />
                I have a competing offer
              </label>
            </div>
            {i.hasCompetingOffer && (
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>Competing company</label>
                <input
                  type="text"
                  value={i.competingCompany}
                  onChange={(e) => setI({ ...i, competingCompany: e.target.value })}
                  placeholder="Anthropic"
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
            )}
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Channel</label>
              <select
                value={i.preferredChannel}
                onChange={(e) => setI({ ...i, preferredChannel: e.target.value as Channel })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="email">Email (written)</option>
                <option value="phone">Phone / video call</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Tone</label>
              <select
                value={i.tone}
                onChange={(e) => setI({ ...i, tone: e.target.value as Tone })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="collaborative">Collaborative (relationship-first)</option>
                <option value="firm">Firm (transactional)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
              <MessageSquare className="w-4 h-4" /> Generate script
            </button>
            {!canGenerate && (
              <span className={`text-xs ${t.textMuted}`}>
                Fill in base offered + base target to generate.
              </span>
            )}
          </div>
        </div>

        {generated && (
          <section
            id="script-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="results-heading" className={`text-2xl font-bold ${t.text}`}>
                Your script
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
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>

            {generated.warnings.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-amber-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h3 className={`font-bold ${t.text}`}>Heads up before you send</h3>
                </div>
                <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                  {generated.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            )}

            {i.preferredChannel === 'email' && (
              <div className={`${t.glass} rounded-2xl p-5`}>
                <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-2`}>Subject</p>
                <p className={`text-sm font-semibold ${t.text}`}>{generated.subject}</p>
              </div>
            )}

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-2`}>
                {i.preferredChannel === 'email' ? 'Email body' : 'Phone script'}
              </p>
              <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed`}>{generated.body}</pre>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>
                7 talking points to remember
              </p>
              <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                {generated.talkingPoints.map((p, idx) => <li key={idx}>{p}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Need to prep for the next interview before you negotiate?
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your CV and the actual job link, gives you the company-specific
                interview prep + cover letter + fit score. 90 seconds. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=negotiation-script"
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
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast my cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection email</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job detector</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS keyword scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>CV bullet rewriter</Link>
            <Link to="/tools/layoff-playbook" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Layoff playbook</Link>
            <Link to="/tools/cover-letter-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Cover letter compare</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
