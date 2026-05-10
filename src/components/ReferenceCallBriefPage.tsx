import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Phone, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/reference-brief -- reference call brief generator.
 * Pure client-side. No LLM. Deterministic templates branched on
 * relationship type + role + key strengths the candidate wants surfaced.
 *
 * Drafted 2026-05-10. 18th free tool. Captures the "what to send my
 * references" / "reference call prep" search-traffic surface. Final-
 * stage candidates (post-onsite, pre-offer or post-offer) are in the
 * highest conversion-intent window: they've already spent weeks
 * interviewing and care about closing the loop well.
 */

type Relationship =
  | 'manager-current'
  | 'manager-past'
  | 'peer-current'
  | 'peer-past'
  | 'report-direct'
  | 'client-vendor'
  | 'cross-functional';

interface Reference {
  id: string;
  name: string;
  relationship: Relationship;
  whenWorked: string; // e.g. "2022-2024"
  contextLine: string; // 1 line: what they specifically saw
  strengthsToSurface: string; // free-text, comma-separated
}

interface Inputs {
  candidateFirstName: string;
  candidateTargetRole: string;
  candidateTargetCompany: string;
  whyMoving: string;
  references: Reference[];
}

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  'manager-current': 'Current manager',
  'manager-past': 'Past manager',
  'peer-current': 'Current peer / colleague',
  'peer-past': 'Past peer / colleague',
  'report-direct': 'Direct report (managed by me)',
  'client-vendor': 'Client / vendor / external partner',
  'cross-functional': 'Cross-functional partner (PM, design, eng, sales, etc.)',
};

function buildBriefFor(ref: Reference, i: Inputs): {
  brief: string;
  likelyQuestions: string[];
  storyPrompts: string[];
  emailDraft: string;
} {
  const cand = i.candidateFirstName.trim() || '[your first name]';
  const role = i.candidateTargetRole.trim() || '[the target role]';
  const company = i.candidateTargetCompany.trim() || '[target company]';
  const why = i.whyMoving.trim() || '[the brief why-moving line you want me to use]';
  const refName = ref.name.trim() || '[Reference]';
  const when = ref.whenWorked.trim() || '[dates we worked together]';
  const context = ref.contextLine.trim() || '[the context line about what you actually saw me do]';
  const strengths = ref.strengthsToSurface
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Likely questions by relationship type — these are the questions ACTUALLY
  // asked in 90% of reference calls.
  const baseQuestions: string[] = [
    `What's your relationship to ${cand}, and when did you work together?`,
    `In your own words, what's ${cand}'s strongest area?`,
    `What's an area where ${cand} has had to grow, or is still developing?`,
    `Would you hire / work with ${cand} again? Why or why not?`,
    `Anything else we should know before extending an offer?`,
  ];

  const relationshipSpecific: Record<Relationship, string[]> = {
    'manager-current': [
      `Does ${cand} know they listed you, or is this a confidential reference?`,
      `How did ${cand} respond to direct feedback when you gave it?`,
      `Has ${cand} had to manage upwards or push back on you? How was that handled?`,
      `Walk me through ${cand}'s most recent big project. What was their actual contribution vs. the team's?`,
    ],
    'manager-past': [
      `When ${cand} left, was the team better off than when they joined? In what specific way?`,
      `Were there any performance concerns during ${cand}'s tenure?`,
      `Would you have promoted ${cand} if they'd stayed?`,
      `Walk me through one project where ${cand} struggled. What happened?`,
    ],
    'peer-current': [
      `How does ${cand} handle disagreement with peers?`,
      `Is ${cand} the person you go to when something needs to ship, or when something needs to be thought through? Both?`,
      `Have you seen ${cand} take on something outside their lane? What happened?`,
    ],
    'peer-past': [
      `How did you and ${cand} handle the highest-stress moment you worked through together?`,
      `What's something ${cand} did better than you, that you respected?`,
      `Did anyone struggle to work with ${cand}? Why?`,
    ],
    'report-direct': [
      `How did ${cand} handle giving you difficult feedback?`,
      `What's the most useful thing ${cand} taught you?`,
      `Did ${cand} advocate for you (promotion, scope, raise) when it mattered?`,
      `Were there moments where ${cand}'s management style didn't work for the team?`,
    ],
    'client-vendor': [
      `Did ${cand} keep commitments? What happened the one time something slipped?`,
      `How did ${cand} handle the relationship when it got tense or political?`,
      `Would you choose to work with ${cand} again on a future engagement?`,
    ],
    'cross-functional': [
      `How did ${cand} handle a disagreement on priorities between your function and theirs?`,
      `Did ${cand} understand your function deeply, or did they need to be educated repeatedly?`,
      `Did ${cand} make your job easier or harder? Specifically how?`,
    ],
  };

  const likelyQuestions = [...baseQuestions, ...(relationshipSpecific[ref.relationship] || [])];

  // Story prompts — the 3 specific stories the reference should be primed to tell.
  const storyPrompts: string[] = [];
  if (strengths.length > 0) {
    strengths.slice(0, 2).forEach((s, idx) => {
      storyPrompts.push(`Story ${idx + 1}: a specific moment that shows me being ${s.toLowerCase()}. Concrete situation, what I did, what changed. 90 seconds.`);
    });
  }
  if (storyPrompts.length === 0) {
    storyPrompts.push(`Story 1: a specific moment that shows my strongest professional quality. Concrete situation, what I did, what changed. 90 seconds.`);
    storyPrompts.push(`Story 2: a time I had to manage a hard situation (deadline crash, conflict, customer escalation, etc.). What I actually did. 90 seconds.`);
  }
  storyPrompts.push(`Story 3: an honest growth area — not a humblebrag. Something I genuinely had to learn or work on. ${ref.relationship === 'manager-current' || ref.relationship === 'manager-past' ? 'Bonus: how you saw me improve.' : 'Bonus: how you saw me work on it.'} 60 seconds.`);

  const brief = [
    `REFERENCE CALL BRIEF — ${refName}`,
    `For: ${cand} → ${role} at ${company}`,
    `Worked together: ${when}`,
    ``,
    `WHAT THEY SAW ME DO`,
    context,
    ``,
    `WHY I'M MOVING (the one-line version)`,
    why,
    ``,
    `STRENGTHS I'D LIKE YOU TO ANCHOR ON`,
    strengths.length > 0
      ? strengths.map((s) => `- ${s}`).join('\n')
      : `- [Add 2-3 specific strengths in the input above so this section gets populated]`,
    ``,
    `THE THREE STORIES TO HAVE READY`,
    storyPrompts.map((p, idx) => `${idx + 1}. ${p}`).join('\n'),
    ``,
    `WHAT THEY'LL ASK (likely questions)`,
    likelyQuestions.map((q) => `- ${q}`).join('\n'),
    ``,
    `WHAT NOT TO SAY`,
    `- Avoid generic adjectives ("smart", "hard-working", "great team player"). Use specifics with a number / date / outcome.`,
    `- If asked about my weakness, don't say "perfectionist" or "I work too hard". Pick something real but bounded, and pair with how I worked on it.`,
    `- Don't be vague on the why-moving — use my one-liner above.`,
    `- If you don't know the answer to something, "I don't have visibility on that" is better than guessing.`,
    ``,
    `LOGISTICS`,
    `- The call will be 20-30 minutes.`,
    `- Recruiter will email or call from ${company || '[company name]'}.`,
    `- You can ask them what role / level they're considering me for if it helps.`,
    `- Confirm the recruiter's identity before sharing anything sensitive (they should email from a verifiable company address first).`,
  ].join('\n');

  // The email draft I send to the reference 1-2 days before the call.
  const emailDraft = [
    `Subject: ${cand} → ${company || 'target company'} reference call — quick brief`,
    ``,
    `Hi ${refName.split(' ')[0]},`,
    ``,
    `Thanks again for being willing to take this reference call. I really appreciate it.`,
    ``,
    `Quick context so you're prepped:`,
    ``,
    `- Role: ${role} at ${company}`,
    `- Why I'm moving: ${why}`,
    `- They'll likely call/email you in the next ~1-3 days. Should take 20-30 min.`,
    ``,
    `If it's useful, I've written up a short brief with the strengths I'm hoping you can anchor on, three specific moments worth being ready to talk about, and the likely questions they'll ask. No pressure to read it all — but it's there if you want context.`,
    ``,
    `[Attach or paste the brief from this tool here]`,
    ``,
    `If anything feels off or you'd rather not take the call, just say — no awkwardness, I'll route them elsewhere.`,
    ``,
    `Thanks again,`,
    `${cand}`,
  ].join('\n');

  return { brief, likelyQuestions, storyPrompts, emailDraft };
}

function newReference(): Reference {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: '',
    relationship: 'manager-past',
    whenWorked: '',
    contextLine: '',
    strengthsToSurface: '',
  };
}

export default function ReferenceCallBriefPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    candidateFirstName: '',
    candidateTargetRole: '',
    candidateTargetCompany: '',
    whyMoving: '',
    references: [newReference()],
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildBriefFor>[] | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const canGenerate =
    i.candidateFirstName.trim().length > 0 &&
    i.references.length > 0 &&
    i.references.every((r) => r.name.trim().length > 0);

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerated(i.references.map((r) => buildBriefFor(r, i)));
    setTimeout(() => {
      const el = document.getElementById('brief-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async (idx: number, kind: 'brief' | 'email') => {
    if (!generated) return;
    const text = kind === 'brief' ? generated[idx].brief : generated[idx].emailDraft;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx * 2 + (kind === 'brief' ? 0 : 1));
      setTimeout(() => setCopiedIdx(null), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const addReference = () => {
    if (i.references.length >= 5) return;
    setI({ ...i, references: [...i.references, newReference()] });
  };

  const removeReference = (id: string) => {
    if (i.references.length <= 1) return;
    setI({ ...i, references: i.references.filter((r) => r.id !== id) });
  };

  const updateReference = (id: string, patch: Partial<Reference>) => {
    setI({
      ...i,
      references: i.references.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Reference Call Brief', item: `${SITE_URL}/tools/reference-brief` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Reference Call Brief Generator — Prep Your References Before They're Called"
        description="Free in-browser reference call brief generator. Add your references, get a 1-page brief for each: strengths to anchor on, 3 specific stories to have ready, likely questions, plus an email template to send them 1-2 days before the call. Pure client-side. No data leaves your browser."
        path="/tools/reference-brief"
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Reference call brief generator
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Your references will be called in 1-3 days. Most candidates send "thanks" and let them
            wing it. The candidates who land offers send a 1-page brief: strengths to anchor on,
            three stories to have ready, likely questions, what not to say.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-6`}>
          <h2 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted} mb-3`}>About you</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Your first name</label>
              <input
                type="text"
                value={i.candidateFirstName}
                onChange={(e) => setI({ ...i, candidateFirstName: e.target.value })}
                placeholder="Alex"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Target role</label>
              <input
                type="text"
                value={i.candidateTargetRole}
                onChange={(e) => setI({ ...i, candidateTargetRole: e.target.value })}
                placeholder="Senior Product Manager"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Target company</label>
              <input
                type="text"
                value={i.candidateTargetCompany}
                onChange={(e) => setI({ ...i, candidateTargetCompany: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Why you're moving (1 line, written for them to repeat)</label>
              <input
                type="text"
                value={i.whyMoving}
                onChange={(e) => setI({ ...i, whyMoving: e.target.value })}
                placeholder="Ready to move from team lead to a scope where I own a product line end-to-end."
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>
        </div>

        {i.references.map((ref) => (
          <div key={ref.id} className={`${t.glass} rounded-2xl p-6 mb-4`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted}`}>Reference</h3>
              {i.references.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReference(ref.id)}
                  className={`inline-flex items-center gap-1 text-xs ${t.textMuted} hover:text-red-500 transition`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>Name</label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                  placeholder="Sarah Chen"
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>Relationship</label>
                <select
                  value={ref.relationship}
                  onChange={(e) => updateReference(ref.id, { relationship: e.target.value as Relationship })}
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                >
                  {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>When you worked together</label>
                <input
                  type="text"
                  value={ref.whenWorked}
                  onChange={(e) => updateReference(ref.id, { whenWorked: e.target.value })}
                  placeholder="2022-2024 at Acme"
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>Strengths to surface (comma-separated)</label>
                <input
                  type="text"
                  value={ref.strengthsToSurface}
                  onChange={(e) => updateReference(ref.id, { strengthsToSurface: e.target.value })}
                  placeholder="Decisive under ambiguity, calm in production fires, mentors junior engs"
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>One line on what they actually saw you do</label>
                <input
                  type="text"
                  value={ref.contextLine}
                  onChange={(e) => updateReference(ref.id, { contextLine: e.target.value })}
                  placeholder="They saw me lead the migration from monolith to microservices and ship under deadline pressure."
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3 mb-8">
          {i.references.length < 5 && (
            <button
              type="button"
              onClick={addReference}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.cardInner} ${t.text} border ${t.inputBorder} hover:opacity-80 transition`}
            >
              <Plus className="w-4 h-4" /> Add another reference
            </button>
          )}
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
            <Phone className="w-4 h-4" /> Generate briefs
          </button>
          {!canGenerate && (
            <span className={`text-xs ${t.textMuted}`}>
              Add your first name + each reference's name to generate.
            </span>
          )}
        </div>

        {generated && (
          <section
            id="brief-results"
            className="scroll-mt-24 space-y-6"
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className={`text-2xl font-bold ${t.text}`}>
              Your reference briefs
            </h2>

            {generated.map((g, idx) => {
              const ref = i.references[idx];
              return (
                <div key={ref.id} className="space-y-4">
                  <div className={`${t.glass} rounded-2xl p-5`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className={`text-xl font-bold ${t.text}`}>
                        Brief for {ref.name || 'Reference'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleCopy(idx, 'brief')}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          copiedIdx === idx * 2
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                            : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                        }`}
                      >
                        {copiedIdx === idx * 2 ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy brief</>}
                      </button>
                    </div>
                    <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed`}>{g.brief}</pre>
                  </div>

                  <div className={`${t.glass} rounded-2xl p-5`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className={`text-xs font-bold uppercase tracking-widest text-violet-500`}>
                        Email to send 1-2 days before the call
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(idx, 'email')}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          copiedIdx === idx * 2 + 1
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                            : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                        }`}
                      >
                        {copiedIdx === idx * 2 + 1 ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy email</>}
                      </button>
                    </div>
                    <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed`}>{g.emailDraft}</pre>
                  </div>
                </div>
              );
            })}

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                References done. Now nail the final round.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Vantage takes your CV and the actual job link, gives you the company-specific
                interview prep + cover letter + fit score. 90 seconds. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=reference-brief"
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
            <Link to="/tools/offer-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Offer comparison calculator</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation script</Link>
            <Link to="/tools/thank-you-note" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Thank-you note generator</Link>
            <Link to="/tools/star-story-builder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>STAR story builder</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>CV bullet rewriter</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS keyword scanner</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
