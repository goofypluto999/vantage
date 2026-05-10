import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MessageCircle, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/why-leaving-framer -- "Why are you leaving your current job?" framer.
 * Pure client-side. No LLM. Deterministic templates branched on
 * reason category + tenure + initiated-by-employee + register.
 *
 * Drafted 2026-05-10. 20th free tool. Captures the "why are you leaving"
 * search-traffic surface. Every interview asks it. Most candidates either:
 * 1) overshare and trash their current employer (red flag), or
 * 2) say "looking for new challenges" (signal-less filler).
 * Neither lands offers.
 */

type ReasonCategory =
  | 'capped-growth'
  | 'layoff'
  | 'manager'
  | 'compensation'
  | 'culture-shift'
  | 'company-trajectory'
  | 'role-mismatch'
  | 'commute-or-location'
  | 'returning-from-break';

type Tenure = 'under-1' | '1-2' | '2-5' | '5-plus';

type Register = 'formal' | 'direct' | 'warm';

interface Inputs {
  reason: ReasonCategory;
  tenure: Tenure;
  initiatedByMe: boolean;
  currentCompany: string;
  actualPainPoint: string; // free text — the real thing
  register: Register;
}

const REASON_LABELS: Record<ReasonCategory, string> = {
  'capped-growth': 'Growth or scope is capped (no path up or sideways)',
  layoff: 'I was laid off (not performance-related)',
  manager: 'Manager / leadership issue',
  compensation: 'Compensation below market or unfair',
  'culture-shift': 'Culture or company values shifted',
  'company-trajectory': 'Company trajectory (financials, layoffs, strategy) is concerning',
  'role-mismatch': "The role I do isn't the role I was hired for",
  'commute-or-location': 'Commute / location / RTO change',
  'returning-from-break': "I've been on a break (parental, health, sabbatical, caring)",
};

const TENURE_LABELS: Record<Tenure, string> = {
  'under-1': 'Under 1 year',
  '1-2': '1-2 years',
  '2-5': '2-5 years',
  '5-plus': '5+ years',
};

const REGISTER_LABELS: Record<Register, string> = {
  formal: 'Formal (banking, consulting, legal, FAANG senior)',
  direct: 'Direct (startup, mid-stage tech, EU style)',
  warm: 'Warm (mission-led, brand-driven, US-startup style)',
};

function buildFramings(i: Inputs): {
  primary: string;
  alt1: string;
  alt2: string;
  warnings: string[];
  neverSay: string[];
  followupAnswers: { q: string; a: string }[];
} {
  const company = i.currentCompany.trim() || '[current employer]';
  const pain = i.actualPainPoint.trim();

  const warnings: string[] = [];

  // Tenure-based warnings
  if (i.tenure === 'under-1' && !['layoff', 'returning-from-break', 'culture-shift'].includes(i.reason)) {
    warnings.push("Tenure is under 1 year. Most interviewers see <1-year tenure as a yellow flag. Lead with what you learned + what you contributed, NOT with what was wrong. A short tenure narrative that focuses on the company's problems reads as 'this candidate is the problem'.");
  }
  if (i.tenure === '5-plus' && i.reason === 'capped-growth') {
    warnings.push("5+ years is plenty of time to grow. The 'capped growth' framing is plausible at this tenure but requires evidence: what did you ask for / try / build before deciding it was capped? Be ready for the follow-up.");
  }

  // Reason-specific warnings
  if (i.reason === 'manager') {
    warnings.push("Manager-related reasons are the highest-risk to frame. NEVER name your manager negatively. NEVER lead with the conflict. Frame around what you needed from the role + what was missing, not around a person.");
  }
  if (i.reason === 'compensation') {
    warnings.push("Compensation-only reasons read as mercenary if you lead with money. Always pair compensation with one other reason (scope, growth, fit) and let comp be #2 in the answer, not #1.");
  }
  if (i.reason === 'culture-shift' || i.reason === 'company-trajectory') {
    warnings.push("Culture / trajectory framings can read as gossip. Stay factual + observable. 'The strategy shifted away from where I have impact' beats 'leadership lost the plot'.");
  }

  // Build framings by reason × register
  let primary = '';
  let alt1 = '';
  let alt2 = '';

  if (i.reason === 'capped-growth') {
    if (i.register === 'formal') {
      primary = `I've had a strong run at ${company}, and the work has stretched me in important ways. What's brought me to this conversation is the next layer of scope — the kind of problems and span that would naturally come next in my path. That next layer is hard to engineer at ${company} right now, and I'd rather lean into building it somewhere with the right shape than wait for it to appear.`;
      alt1 = `I'm proud of what I've built at ${company}, but the role has reached its natural scope. I'm looking for a step that lets me own a wider problem end-to-end, and that step is clearer outside than inside.`;
      alt2 = `Performance at ${company} has gone well. The question I've been asking myself isn't whether I can keep doing the role — it's whether the next twelve months meaningfully grow me. Honestly, the answer is no, and that's prompted this search.`;
    } else if (i.register === 'direct') {
      primary = `${company} has been good to me, but the role is capped — the scope above me isn't opening, the org isn't growing into new shapes, and I've done the natural version of this job. I'd rather take on something with real growth in it than ride out another year here.`;
      alt1 = `Honestly: I've outgrown the role. There's nothing wrong at ${company} — I've just done the version of this job that exists there, and the next version doesn't exist there. So I'm looking.`;
      alt2 = `At ${company} I'm at a ceiling. Not a promotion ceiling — a scope ceiling. The problems I want to work on next aren't on the table. So I'm in the market.`;
    } else {
      primary = `${company} taught me a huge amount and I'm grateful for it. Where I am now: I've grown into the role, and the next layer of growth — both in scope and in the kind of work — needs to come from a different environment. I'm looking for that environment intentionally, not running from anything.`;
      alt1 = `I love the team at ${company}. The role has been a great fit for the version of me I was when I joined. I've grown out of it now, and the right next step isn't waiting around there — it's stepping into something bigger.`;
      alt2 = `Three years in at ${company} and the truth is: I've done what I came to do. I want a next chapter that stretches me again, and that means a new environment.`;
    }
  } else if (i.reason === 'layoff') {
    primary = `I was caught in the ${i.tenure === 'under-1' ? 'recent' : ''} reduction at ${company} — it was a structural cut, not performance. I'm using this as a chance to be intentional about the next chapter rather than rushing the first thing. What I want from this next role is [scope / mission / craft] — and I think that's worth talking about specifically.`;
    alt1 = `My role at ${company} was made redundant in a recent restructure. I'm not bitter — the math made sense. What I'm focused on now is finding a role where the work is what I actually want to deepen on, which is why I'm here.`;
    alt2 = `Layoff caught me at ${company}. Cleanly, no performance angle. I've decided to treat this as an opportunity to find the right next role rather than the fastest next role.`;
  } else if (i.reason === 'manager') {
    if (i.register === 'formal') {
      primary = `${company} has been a good chapter overall. The pattern in my current team is that the management style and what I need to do my best work have diverged enough that the right answer is a different environment. I prefer to frame it that way because nothing useful comes from naming individuals.`;
      alt1 = `I've grown a lot at ${company} and respect what I learned there. The day-to-day reality is that my current setup isn't designed for the way I do my best work, and after trying to make it work for a while, I think a fresh environment serves me better.`;
      alt2 = `Without going into specifics about people: the fit between my management situation at ${company} and the conditions I work best in has degraded over the past few months. I'd rather invest that energy in a new opportunity.`;
    } else if (i.register === 'direct') {
      primary = `Honest answer: management has changed at ${company} and the new direction doesn't fit how I work best. I've tried to make it work, and I respect why my manager makes the calls they do — they're just different calls than the ones that make me effective.`;
      alt1 = `Reorg at ${company} put me under a new manager whose style and mine don't combine well. Not their fault and not mine — just not a fit. I'm going to look rather than stay and complain.`;
      alt2 = `The management I have now and the management I work best with aren't the same thing. I've tried; it's not converging. So I'm looking.`;
    } else {
      primary = `${company} has been good to me. What's prompted me to look is that the relationship between my management and how I do my best work isn't quite there. I want to be in a setup where my manager and I are building together, not negotiating, and that's worth a search.`;
      alt1 = `I learned a lot from my current manager and I'm grateful for it. We've reached a point where the kind of feedback + working style I need to thrive isn't what they're set up to give. So I'm looking for a new fit.`;
      alt2 = `Honestly: I want a manager I can really learn from in this next chapter. I'm not getting that at ${company} anymore — through no fault of anyone — and that matters enough that I'm looking.`;
    }
  } else if (i.reason === 'compensation') {
    primary = `Two things drew me to this conversation. The work itself — [specific scope thing] — is what I really care about and isn't on the table at ${company}. Compensation is a secondary factor: my package at ${company} has fallen behind market, and that matters at this stage of my career, but the scope question is what brought me here first.`;
    alt1 = `I'm looking for a step up in both scope and compensation. ${company} has been good to me, but on both dimensions I've outgrown what they can offer at the moment, and that's prompted this search.`;
    alt2 = `Honestly: the work I'd want next isn't available inside ${company}, and the compensation gap with market makes staying harder to justify. Both feed into me being here.`;
  } else if (i.reason === 'culture-shift') {
    primary = `${company} has changed in a way that's pulled it away from what made me join. The day-to-day work I do is the same, but the surrounding context — [specific observable thing: priorities, RTO, leadership change, layoffs cadence, etc.] — has shifted. I'd rather invest the next chapter in a place whose direction I'm genuinely aligned with.`;
    alt1 = `The reason I joined ${company} and the reason I'd stay aren't quite the same anymore. The product, mission, and people are still good — the operating context has shifted enough that I'm intentional about the next chapter.`;
    alt2 = `${company} that I joined and ${company} today are meaningfully different. Not better or worse universally — just different from what I signed up for. Being honest with myself about that, the next chapter is elsewhere.`;
  } else if (i.reason === 'company-trajectory') {
    primary = `I want to be honest about ${company}: the recent [layoffs / strategy shift / funding context / commercial trajectory] is a real factor in my thinking. The work I do is going well, but the surrounding signals affect what the role can grow into, and I'd rather be intentional about the next environment than wait it out.`;
    alt1 = `${company} is going through a tough chapter, and while my role within it is stable, my read on the next 12-24 months suggests the scope I want isn't going to materialise in time. So I'm looking now.`;
    alt2 = `Honest read on ${company}: the runway, the strategy, and where the resources are going don't suggest the kind of next role I want is going to exist there in time. Better to look than to wait and hope.`;
  } else if (i.reason === 'role-mismatch') {
    primary = `The role I do at ${company} day-to-day isn't the role I was hired for. That happens — orgs evolve. The work I'm actually doing is [the actual work] and the work I want to be doing is [target work]. ${company} has tried to make the bridge work; the simplest path is a role that's actually shaped like what I do best, which is what brings me here.`;
    alt1 = `What I was hired to do at ${company} and what the role became aren't the same. I've made it work, but I'd rather be in a role that's designed for what I'm here to do, rather than continually reshape one to fit.`;
    alt2 = `My role at ${company} drifted from the original brief. The work I do now isn't the work I want to deepen on. So I'm looking for a role aligned with what I actually want my next 2-3 years to be.`;
  } else if (i.reason === 'commute-or-location') {
    primary = `The recent [RTO mandate / office relocation / commute change] at ${company} doesn't work for my situation in a sustainable way. That alone wouldn't prompt me to move, but it's pushed me to think about what I want next, and the answer is to be intentional about the next role rather than commute-grind through a job that's already at a natural stopping point.`;
    alt1 = `${company}'s policy shift on [location / RTO] is the proximate cause. The deeper reason is that it gave me the prompt to ask "is this the right next role for me?" and the answer is no — I want to look at what else is out there.`;
    alt2 = `Honest answer: the [RTO / commute / location] change at ${company} is the practical trigger. It's also forced me to admit that I've been ready for the next step for a while.`;
  } else { // returning-from-break
    primary = `I've been on a [parental / health / sabbatical / caring] break since [approximate date]. Now I'm returning, and I want to be deliberate about the role I come back to — not just take the first thing. What I'm looking for is [scope / domain / impact / pace], and that's why this conversation is on my list.`;
    alt1 = `I took a planned break for [reason] and I'm now ready to come back. I'm being intentional about the role rather than rushing — I want the next chapter to fit what I want to do for the next 3-5 years, not just for now.`;
    alt2 = `I've been on a break and I'm returning. The thing I'm most focused on is finding a role I can really invest in. ${REASON_LABELS['returning-from-break']} answers tend to read better when they're confident and forward-looking, so I'm leading with what I want to do, not what I've been doing.`;
  }

  // What to never say — universal + reason-specific
  const neverSay: string[] = [
    `"I hated my last job." (Why you're leaving is fine. Hating is not.)`,
    `"My manager was terrible." (Even if true. Especially if true.)`,
    `"They don't appreciate me." (Reads as victim mindset. You either deliver and get rewarded, or you leave — not both.)`,
    `"It's a toxic environment." (Word is overused. Be specific or don't say it.)`,
    `"Just looking for new challenges." (Empty filler. Every interviewer hears this 50x a year.)`,
    `"I want to make more money." (Even when it's true, don't lead with it. And never make it the only reason.)`,
  ];
  if (i.reason === 'layoff') {
    neverSay.push(`"They restructured because [conspiracy / personal]." (Stick to "the role was eliminated, not performance.")`);
  }
  if (i.reason === 'manager') {
    neverSay.push(`Naming the manager. Or even gendered pronouns that identify them. Stay abstract.`);
  }

  // Likely follow-up questions + suggested answers
  const followupAnswers: { q: string; a: string }[] = [
    {
      q: 'What did you do to try to change the situation first?',
      a: pain
        ? `"Before deciding to look, I [briefly: one thing you actually did — asked for the scope change, raised the concern, tried to influence the new direction]. The honest read is that what I wanted wasn't going to materialise in a timeframe that worked for me, which is why I'm here."`
        : `"Before deciding to look, I had the conversation [with my manager / with leadership] explicitly and asked for [the specific change I wanted]. The honest read is that what I wanted wasn't going to materialise in a timeframe that worked for me, which is why I'm here."`,
    },
    {
      q: 'How long have you been looking?',
      a: `"A few weeks — I've been deliberate about who I talk to rather than spraying applications. Quality conversations beat volume at this stage in my career."`,
    },
    {
      q: 'Why now specifically?',
      a:
        i.reason === 'layoff'
          ? `"The layoff forced the timing, but honestly I'd been weighing this for a while. The cut was the prompt; the readiness was already there."`
          : i.reason === 'commute-or-location'
          ? `"The [RTO / office change] was the prompt, but I was already at a natural stopping point in the role."`
          : `"I'm at a natural milestone in my current work — what I'm doing has shipped or stabilised — so this is a clean inflection point rather than a forced one."`,
    },
    {
      q: 'Does your manager know?',
      a:
        i.tenure === 'under-1'
          ? `"Not yet — given my tenure, I want to be sure about the next step before I open that conversation. I'd want this to be a clean transition, and that means having a clear answer first."`
          : `"My manager knows I'm exploring. We've had a direct conversation about [scope / fit / direction]. If this opportunity materialises, I'd give appropriate notice and run a clean handoff."`,
    },
  ];

  return { primary, alt1, alt2, warnings, neverSay, followupAnswers };
}

export default function WhyLeavingFramerPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    reason: 'capped-growth',
    tenure: '2-5',
    initiatedByMe: true,
    currentCompany: '',
    actualPainPoint: '',
    register: 'direct',
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildFramings> | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerated(buildFramings(i));
    setTimeout(() => {
      const el = document.getElementById('framer-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2200);
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
      { '@type': 'ListItem', position: 3, name: 'Why Are You Leaving Framer', item: `${SITE_URL}/tools/why-leaving-framer` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title='Free "Why Are You Leaving Your Current Job?" Answer Framer — 3 Variants Per Reason'
        description="Free in-browser framer for the universal interview question 'Why are you leaving your current job?'. Pick reason (9 categories), tenure, register (formal / direct / warm). Get 3 framings + what to never say + likely follow-ups with calibrated answers. Pure client-side."
        path="/tools/why-leaving-framer"
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
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            "Why are you leaving?" framer
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Every interview asks it. Most candidates either trash their current employer (red flag)
            or give "looking for new challenges" (signal-less filler). Neither lands offers.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Why are you actually leaving?</label>
              <select
                value={i.reason}
                onChange={(e) => setI({ ...i, reason: e.target.value as ReasonCategory })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {Object.entries(REASON_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Tenure at current employer</label>
              <select
                value={i.tenure}
                onChange={(e) => setI({ ...i, tenure: e.target.value as Tenure })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {Object.entries(TENURE_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Register</label>
              <select
                value={i.register}
                onChange={(e) => setI({ ...i, register: e.target.value as Register })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {Object.entries(REGISTER_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Current company (optional — for inline use)</label>
              <input
                type="text"
                value={i.currentCompany}
                onChange={(e) => setI({ ...i, currentCompany: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>The actual specific thing (for your follow-up only — never used verbatim in the framing)</label>
              <input
                type="text"
                value={i.actualPainPoint}
                onChange={(e) => setI({ ...i, actualPainPoint: e.target.value })}
                placeholder="e.g. asked twice for the L6 promo path, got a vague 'soon'"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <MessageCircle className="w-4 h-4" /> Generate framings
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="framer-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className={`text-2xl font-bold ${t.text}`}>
              Your framings
            </h2>

            {generated.warnings.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-amber-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h3 className={`font-bold ${t.text}`}>Calibration notes before you use these</h3>
                </div>
                <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                  {generated.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            )}

            {[
              { label: 'Primary (recommended)', text: generated.primary, key: 'primary' },
              { label: 'Alt 1 (shorter)', text: generated.alt1, key: 'alt1' },
              { label: 'Alt 2 (more candid)', text: generated.alt2, key: 'alt2' },
            ].map((f) => (
              <div key={f.key} className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className={`text-xs font-bold uppercase tracking-widest text-violet-500`}>{f.label}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(f.text, f.key)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      copied === f.key
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                    }`}
                  >
                    {copied === f.key ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
                <p className={`text-sm ${t.text} leading-relaxed`}>{f.text}</p>
              </div>
            ))}

            <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-red-500`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-red-500 mb-3`}>What to never say</p>
              <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                {generated.neverSay.map((n, idx) => <li key={idx}>{n}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Likely follow-up questions + calibrated answers</p>
              <div className="space-y-3">
                {generated.followupAnswers.map((f, idx) => (
                  <div key={idx} className={`${t.cardInner} rounded-xl p-3`}>
                    <p className={`text-xs font-bold ${t.text}`}>{f.q}</p>
                    <p className={`text-sm ${t.textSub} mt-1 leading-relaxed`}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Ready to nail the rest of the interview too?
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV and the actual job link, gives you the company-specific
                interview prep + cover letter + fit score. 90 seconds. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=why-leaving-framer"
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
            <Link to="/tools/30-60-90-plan" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>30/60/90 day plan</Link>
            <Link to="/tools/reference-brief" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Reference call brief</Link>
            <Link to="/tools/offer-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Offer comparison</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation script</Link>
            <Link to="/tools/star-story-builder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>STAR story builder</Link>
            <Link to="/tools/thank-you-note" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Thank-you note</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS scanner</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
