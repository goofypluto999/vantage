import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Inbox, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/recruiter-reply -- recruiter cold-DM response generator.
 * Pure client-side. Deterministic templates branched on inputs.
 *
 * Drafted 2026-05-10. 12th free tool. Recruiter cold-DMs are a
 * high-frequency moment most candidates handle badly: either ignore
 * (lose the optionality), reply too eagerly (signal desperation),
 * or send a generic "thanks, can you tell me more" that wastes
 * everyone's time.
 *
 * This tool generates calibrated replies branched on intent
 * (interested / not-now / not-fit) and seniority signal alignment.
 */

type Intent = 'interested' | 'not_now' | 'not_fit' | 'not_sure';
type Seniority = 'over' | 'match' | 'under';

interface Inputs {
  recruiterName: string;
  company: string;
  pitchedRole: string;
  intent: Intent;
  seniority: Seniority;
  hasCompetingActivity: boolean;
  whatYouWantInstead: string;
}

interface OutputVariant {
  label: string;
  text: string;
  why: string;
}

function generateReplies(i: Inputs): { variants: OutputVariant[]; tips: string[] } {
  const recruiter = i.recruiterName.trim() || 'Hi there';
  const company = i.company.trim() || 'your company';
  const role = i.pitchedRole.trim() || 'the role';
  const wantInstead = i.whatYouWantInstead.trim();
  const variants: OutputVariant[] = [];

  // INTERESTED branch
  if (i.intent === 'interested') {
    variants.push({
      label: 'Interested + ask for specifics (recommended)',
      text: `Hi ${recruiter},

Thanks for reaching out — ${role} at ${company} could be interesting.

Before we book a call, three quick things that would help me decide if it's worth your time and mine:

1. Compensation range for the level you're picturing me at?
2. Hybrid / remote / in-office expectation?
3. What would the first 90 days actually look like?

Happy to share my CV after that. Either reply here or send a Calendly if it's faster.

[Your name]`,
      why: 'Interested-but-qualifying signals seniority. Recruiters expect questions; bad recruiters dodge them. Asking for the comp range upfront filters out the bottom 30% of pitches without wasting either side\'s time.',
    });

    if (i.hasCompetingActivity) {
      variants.push({
        label: 'Interested + competing leverage',
        text: `Hi ${recruiter},

Thanks — ${role} sounds aligned. Quick context: I'm in [late-stage interview / final round / about to sign] with another company. Timeline is [X weeks].

Before I lean in: what's the compensation range for the level you'd put me at, and what's your typical end-to-end process timeline? If both align, happy to fast-track.

[Your name]`,
        why: 'Mentioning competing activity sets pace. Recruiters move faster when they know there is competition. Be honest about your stage; do not invent a competing offer that does not exist.',
      });
    }
  }

  // NOT_NOW branch
  if (i.intent === 'not_now') {
    variants.push({
      label: 'Not now + keep door open (recommended)',
      text: `Hi ${recruiter},

Thanks for reaching out. Not actively looking right now, but ${role} at ${company} sounds interesting on paper.

Could you keep me in mind for ${wantInstead || `senior ${role.toLowerCase()} roles`} that come up in the next 6 months? Happy to be a passive candidate.

If it's easier, you could also drop me on the team's "we'd love to talk in 6 months" list with a reminder.

[Your name]`,
      why: 'Refusing without closing the door is the asymmetric play. Recruiters tag candidates in their CRM; "passive but interested in 6 months" tags become inbound 6 months later. Costs you nothing, optionality compounds.',
    });
  }

  // NOT_FIT branch — never burn bridges
  if (i.intent === 'not_fit') {
    variants.push({
      label: 'Polite no + redirect (recommended)',
      text: `Hi ${recruiter},

Thanks for reaching out. ${role} isn't quite a fit for me — ${
        i.seniority === 'over'
          ? 'the level reads more junior than where I am right now'
          : i.seniority === 'under'
          ? 'looks like a stretch level for where I am right now, but I appreciate the consideration'
          : `I'm focused on ${wantInstead || 'a different domain right now'}`
      }.

If you ever have ${wantInstead || `more senior ${role.toLowerCase()} roles`} come up, I'd love to be in your reach-out queue.

[Your name]`,
      why: 'The polite-no-with-redirect is the standard response. Never ghost a recruiter — the same recruiter rotates through 3-5 companies over a 5-year career; today\'s recruiter is tomorrow\'s in-house at the company you actually want.',
    });
  }

  // NOT_SURE branch
  if (i.intent === 'not_sure') {
    variants.push({
      label: 'Hold-and-investigate (recommended)',
      text: `Hi ${recruiter},

Thanks for reaching out — could you share the JD or a job link before we go further? I want to read the specifics before deciding whether ${role} at ${company} is right for me.

Also helpful: compensation range for the level, and remote / hybrid / in-office expectation.

Once I have that I can give you a fast yes or no.

[Your name]`,
      why: 'Most cold pitches lack the specifics needed to decide. Asking for the JD upfront filters out the recruiters who are spray-and-praying. If they cannot send the JD, the role is not as concrete as the pitch suggests.',
    });
  }

  // Universal "want to know more" variant (always include)
  variants.push({
    label: 'Quick acknowledgment (use if you need 24h)',
    text: `Hi ${recruiter},

Thanks for the message — saw it. Let me look at this properly tonight and reply tomorrow.

[Your name]`,
    why: 'Buys 24 hours without ghosting. Recruiters expect ~24h response; immediate replies signal availability bias. Sleeping on it produces a better second message.',
  });

  // Tips
  const tips: string[] = [];
  tips.push('Never reply within 30 minutes unless you literally have nothing else going on. Immediate replies anchor the recruiter on "this candidate is available", which softens negotiation later.');
  tips.push('Always ask for the JD upfront. ~40% of cold pitches have no JD because the role does not exist as the recruiter described it.');
  tips.push('Always ask for compensation range early. Recruiters who refuse to share before a call are wasting your time.');
  if (i.seniority === 'over') {
    tips.push('Pitched at a level below yours: politely flag the mismatch but DO ask if they have a more senior role open. The same recruiter usually has multiple openings; the cold pitch was a low-friction first contact.');
  }
  if (i.seniority === 'under') {
    tips.push('Pitched above your level: do not lie about your level, but do ask what they specifically liked about your profile. Sometimes the recruiter saw a real signal you can build on.');
  }
  tips.push('Keep records: note recruiter name + company + date + role + your reply category. The same recruiters re-emerge across different companies — your CRM is their CRM in reverse.');
  tips.push('Do not paste competing offer numbers in writing on a first reply. The leverage move is "I am in late-stage with another"; the SPECIFIC number is for the negotiation phase.');
  tips.push('If the pitch is generic ("hi, your background looks great"), the recruiter has not read your profile. Treat it as low-priority. The good recruiters reference something specific in your profile.');

  return { variants, tips };
}

export default function RecruiterReplyPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    recruiterName: '',
    company: '',
    pitchedRole: '',
    intent: 'interested',
    seniority: 'match',
    hasCompetingActivity: false,
    whatYouWantInstead: '',
  });
  const [generated, setGenerated] = useState<ReturnType<typeof generateReplies> | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerated(generateReplies(i));
    setTimeout(() => {
      const el = document.getElementById('recruiter-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2200);
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
      { '@type': 'ListItem', position: 3, name: 'Recruiter Reply', item: `${SITE_URL}/tools/recruiter-reply` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Recruiter Cold-DM Reply Generator — Calibrated Templates"
        description="Pick intent (interested / not now / not a fit / not sure) and seniority alignment, get calibrated replies plus 7 tips. Pure client-side."
        path="/tools/recruiter-reply"
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
            Recruiter cold-DM reply
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            A recruiter just slid into your DMs. Pick intent + seniority alignment, get a calibrated
            reply plus 7 tips on what to ask back. Most candidates either ignore (lose optionality),
            reply too fast (signal availability), or send a generic "tell me more". This fixes that.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Recruiter name</label>
              <input
                type="text"
                value={i.recruiterName}
                onChange={(e) => setI({ ...i, recruiterName: e.target.value })}
                placeholder="Sarah"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Company they pitched</label>
              <input
                type="text"
                value={i.company}
                onChange={(e) => setI({ ...i, company: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Role pitched</label>
              <input
                type="text"
                value={i.pitchedRole}
                onChange={(e) => setI({ ...i, pitchedRole: e.target.value })}
                placeholder="Senior Software Engineer"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Your intent</label>
              <select
                value={i.intent}
                onChange={(e) => setI({ ...i, intent: e.target.value as Intent })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="interested">Interested</option>
                <option value="not_now">Not actively looking but open</option>
                <option value="not_fit">Not a fit (level / domain / company)</option>
                <option value="not_sure">Not sure — need more info</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Seniority alignment</label>
              <select
                value={i.seniority}
                onChange={(e) => setI({ ...i, seniority: e.target.value as Seniority })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="match">Matches my level</option>
                <option value="over">Pitched below my level</option>
                <option value="under">Pitched above my level</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Optional: what would you actually want?</label>
              <input
                type="text"
                value={i.whatYouWantInstead}
                onChange={(e) => setI({ ...i, whatYouWantInstead: e.target.value })}
                placeholder="Staff-level Rust roles at infra companies"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`inline-flex items-center gap-2 text-sm ${t.text} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={i.hasCompetingActivity}
                  onChange={(e) => setI({ ...i, hasCompetingActivity: e.target.checked })}
                />
                I have competing interview activity (late-stage / final round / pending offer)
              </label>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Inbox className="w-4 h-4" /> Generate reply
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="recruiter-results"
            className="scroll-mt-24 space-y-4"
          >
            <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Your replies</h2>
            {generated.variants.map((v, idx) => (
              <div key={idx} className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className={`text-xs font-bold uppercase tracking-widest text-violet-500`}>
                    Variant {idx + 1} · {v.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(v.text, idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                      copiedIndex === idx
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                    }`}
                  >
                    {copiedIndex === idx ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed mt-3 ${t.cardInner} rounded-lg p-3`}>{v.text}</pre>
                <p className={`mt-3 text-xs ${t.textMuted}`}>
                  <strong className={t.textSub}>Why this works:</strong> {v.why}
                </p>
              </div>
            ))}

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Tips</p>
              <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                {generated.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Got a real interview from this? Run the prep in 90 seconds.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV + the actual job link, drafts a tailored cover letter,
                generates likely interview questions, and builds a 5-min pitch outline. 10 free
                packs on signup.
              </p>
              <Link
                to="/register?source=recruiter-reply"
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
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Bullet rewriter</Link>
            <Link to="/tools/layoff-playbook" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Layoff playbook</Link>
            <Link to="/tools/cover-letter-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Cover letter compare</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation</Link>
            <Link to="/tools/thank-you-note" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Thank-you note</Link>
            <Link to="/tools/linkedin-about" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>LinkedIn About</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
