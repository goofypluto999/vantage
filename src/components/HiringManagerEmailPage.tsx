import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Send, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/cold-email-hiring-manager -- direct-to-hiring-manager
 * cold email generator. Pure client-side, deterministic templates.
 *
 * Drafted 2026-05-10. 13th free tool. Captures search-volume around
 * "cold email hiring manager" + "how to email recruiter" + "skip the
 * ATS" queries. The ATS-bypass move is the highest-leverage single
 * action in 2026 hiring.
 *
 * Most laid-off engineers don't know how to write this email. They
 * either send a CV with no context, write a 500-word "personal
 * journey" email, or copy a generic LinkedIn DM. All fail.
 */

type Hook =
  | 'mutual_connection'
  | 'recent_post'
  | 'specific_product_use'
  | 'shared_company_history'
  | 'public_artefact'
  | 'cold';

type Stage = 'open_to_apply' | 'after_silent_application' | 'after_rejection';

interface Inputs {
  managerName: string;
  managerCompany: string;
  managerRole: string;
  yourRoleTitle: string;
  yourSuperpower: string;
  hook: Hook;
  hookDetail: string;
  stage: Stage;
  cvLink: string;
}

interface Variant {
  label: string;
  subject: string;
  body: string;
  why: string;
}

function buildHookSentence(i: Inputs): string {
  const company = i.managerCompany.trim() || 'your company';
  const detail = i.hookDetail.trim();

  switch (i.hook) {
    case 'mutual_connection':
      return detail
        ? `${detail} mentioned you might be the right person to talk to about ${i.yourRoleTitle.toLowerCase() || 'roles like this'}.`
        : `[Mutual connection name] suggested I reach out.`;
    case 'recent_post':
      return detail
        ? `Read your post about ${detail} — particularly the part about [ONE SPECIFIC SENTENCE FROM THE POST]. It's the same problem I've been working on at my last role.`
        : `Saw your recent post on [topic] — it lined up with what I've been working on.`;
    case 'specific_product_use':
      return detail
        ? `I've been using ${detail} daily for the last [N] months. The thing I'd want to fix first is [ONE SPECIFIC PRODUCT FRICTION POINT]. Happy to walk you through the bug repro if useful.`
        : `I've been using ${company}'s product seriously for months and have specific opinions about where it could improve.`;
    case 'shared_company_history':
      return detail
        ? `${detail} — same place we both worked. I noticed you joined ${company} in [year]; I'd love to understand the move.`
        : `Saw we both worked at the same place earlier in our careers.`;
    case 'public_artefact':
      return detail
        ? `Saw your ${detail} — particularly the [SPECIFIC POINT]. I've been thinking about the same trade-off in my own work.`
        : `Saw your public work on [specific] — wanted to reach out.`;
    case 'cold':
    default:
      return `I haven't met you before, but ${company} is one of three companies I'm specifically targeting for my next role.`;
  }
}

function buildEmail(i: Inputs): { variants: Variant[]; tips: string[]; warnings: string[] } {
  const manager = i.managerName.trim() || '[Hiring manager]';
  const company = i.managerCompany.trim() || '[Company]';
  const role = i.yourRoleTitle.trim() || 'a relevant role';
  const sp = i.yourSuperpower.trim();
  const cvLink = i.cvLink.trim();
  const hookSentence = buildHookSentence(i);

  const variants: Variant[] = [];

  // Variant 1: classic 3-paragraph
  let stageContext = '';
  if (i.stage === 'after_silent_application') {
    stageContext = ` I applied through your careers page two weeks ago for the ${role} role and didn't hear back, which is normal — applications get filtered before they reach hiring managers.`;
  } else if (i.stage === 'after_rejection') {
    stageContext = ` I applied for the ${role} role earlier and got an automated rejection. I think there's a mismatch worth a 5-minute conversation rather than a 30-second filter.`;
  }

  variants.push({
    label: 'Classic 3-paragraph (recommended)',
    subject: `${role} at ${company} — quick intro`,
    body: `Hi ${manager},

${hookSentence}${stageContext}

Quick context on me: ${sp || `I'm a ${role}`}. The single most-relevant thing I've shipped: [ONE SPECIFIC RESULT WITH A METRIC — e.g. "rebuilt checkout for a 1.4M-user e-commerce platform; cut cart abandonment from 68% to 41% in 3 months"].

I'd love 15 minutes to learn what you're hiring for and whether it's a fit. ${cvLink ? `CV here for context: ${cvLink}` : 'CV available on request.'}

Worst case: you say no, and I've read up on ${company} for nothing. Best case: short call.

[Your name]`,
    why: 'Classic structure: hook (1 sentence), self (1 sentence + metric), ask (1 sentence). The "worst case / best case" close is a soft permission-granter that lets the recipient say no without awkwardness — which paradoxically makes them more likely to say yes.',
  });

  // Variant 2: Project-led (best when you have a real public artefact)
  if (i.hook === 'specific_product_use' || i.hook === 'public_artefact') {
    variants.push({
      label: 'Project-led (when you have a real artefact)',
      subject: `Re: ${i.hookDetail.trim() || `${company}'s [thing]`}`,
      body: `Hi ${manager},

[Open with the SPECIFIC thing you noticed, in 2 sentences. Don't introduce yourself yet.]

I've been working on the same problem from a different angle. ${sp || 'My background is [role]'}. Specifically: [ONE SHIPPED RESULT WITH A METRIC tied to the same problem].

Would you be open to a 15-minute call? I have specific opinions on [the specific problem] and I'd want to know whether ${company}'s ${role} role is the right fit for that conversation.

${cvLink ? `Background: ${cvLink}` : 'CV on request.'}

[Your name]`,
      why: 'Lead with the problem, not yourself. Hiring managers reading 30 cold emails a week skim past "I am a senior engineer with 10 years experience". They stop on "I noticed your team is hitting [specific issue] — I have an opinion on that". Project-led inverts the standard cold-email shape and gets read.',
    });
  }

  // Variant 3: Short / punchy (when no strong hook exists)
  variants.push({
    label: 'Short and punchy',
    subject: `${role} — 2-line intro`,
    body: `Hi ${manager},

${sp || `Senior ${role}`}, ${i.hook === 'cold' ? `${company} is on my target list because [1 specific reason — not "great culture"; something about a technical / product / strategy choice]` : hookSentence}

Are you the right person to talk to about ${role} roles, or should I find someone else on the team? Happy to be redirected.

${cvLink ? `${cvLink}` : ''}

[Your name]`,
    why: 'Most people overwrite cold emails. Hiring managers reading 30/week prefer short. The "are you the right person, or should I find someone else" close reframes the rejection cost — saying "no, talk to X" is easier than saying "no, go away" — which paradoxically gets you a referral 30% of the time.',
  });

  // Tips
  const tips: string[] = [];
  tips.push('Find the email address via Hunter.io / Apollo / RocketReach (free trial tier on each). Pattern: firstname.lastname@company.com works for ~70% of companies. Verify with email-validator.io before sending.');
  tips.push('Send Tuesday or Thursday morning, 9-10am their local time. NOT Monday morning (full inbox), NOT Friday afternoon (already mentally on weekend), NOT before 8am (smells of automated send).');
  tips.push('Subject line under 60 chars. Mobile clients truncate at ~60. The subject IS the open-rate driver, not the body.');
  tips.push('Plain text > HTML. HTML emails from strangers smell like spam. Plain text reads as written by a human.');
  tips.push('Sign with your real name, not a title. "[Your name]" not "[Your name] | Senior Engineer | Open to Work". The latter signals desperation; the former signals confidence.');
  tips.push('NO follow-up for 7 days. After 7 days: ONE follow-up only, max 30 words, polite. After that: stop. Repeated follow-ups burn reputation.');
  tips.push('Track responses by hook type. Mutual-connection hooks usually get 30-40% response. Cold hooks usually get 5-10%. Use the data to allocate effort.');
  if (i.hook === 'cold') {
    tips.push('Cold-cold has the lowest response rate (~5%). Before sending, spend 10 minutes finding ONE specific reason ("I noticed your team uses X"). Spending 10 min researching beats sending 10 generic emails.');
  }

  // Warnings
  const warnings: string[] = [];
  if (!sp) {
    warnings.push('No "superpower" filled in. Cold emails without a specific value-prop sentence read as job-application-bait. Hiring managers skip them in 3 seconds.');
  }
  if (i.hook === 'cold' && !i.hookDetail.trim()) {
    warnings.push('Cold hook with no detail. The recommended template falls back to "[Company] is on my target list because [reason]" — fill in a real reason before sending.');
  }
  if (i.stage === 'after_rejection' && !sp) {
    warnings.push('Re-pinging after a rejection requires extra signal. The recipient already filtered you once; the email needs to surface a specific reason the filter was wrong (e.g., a result that wasn\'t on the CV).');
  }
  if (cvLink && !/^https?:\/\//.test(cvLink)) {
    warnings.push('CV link doesn\'t look like a URL. Use a public link (Notion, Google Drive view-only, personal site, LinkedIn) — never a CV-as-attachment, which marks email as "uses attachments" and softly downranks the sender reputation.');
  }

  return { variants, tips, warnings };
}

export default function HiringManagerEmailPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    managerName: '',
    managerCompany: '',
    managerRole: '',
    yourRoleTitle: '',
    yourSuperpower: '',
    hook: 'cold',
    hookDetail: '',
    stage: 'open_to_apply',
    cvLink: '',
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildEmail> | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerated(buildEmail(i));
    setTimeout(() => {
      const el = document.getElementById('email-results');
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
      { '@type': 'ListItem', position: 3, name: 'Cold Email Hiring Manager', item: `${SITE_URL}/tools/cold-email-hiring-manager` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Cold Email to Hiring Manager Generator — 3 Variants + ATS-Bypass Move"
        description="Free in-browser cold email to hiring manager generator. Pick hook (mutual connection / recent post / product use / shared history / public artefact / cold), stage (open application / after silent / after rejection). Get 2-3 variants + 8 sending tips. Pure client-side."
        path="/tools/cold-email-hiring-manager"
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
            Free tool · No signup · ATS-bypass
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            Cold email to hiring manager
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Bypassing the ATS is the highest-leverage single move in 2026 hiring. Most candidates
            don't know how to email a hiring manager directly. Pick hook, stage, fill in your
            value prop. Get 2-3 calibrated variants plus 8 sending tips. Pure client-side.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Hiring manager name</label>
              <input
                type="text"
                value={i.managerName}
                onChange={(e) => setI({ ...i, managerName: e.target.value })}
                placeholder="Jamie"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Their company</label>
              <input
                type="text"
                value={i.managerCompany}
                onChange={(e) => setI({ ...i, managerCompany: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Their role / team (optional)</label>
              <input
                type="text"
                value={i.managerRole}
                onChange={(e) => setI({ ...i, managerRole: e.target.value })}
                placeholder="VP Engineering, Payments"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>The role you want</label>
              <input
                type="text"
                value={i.yourRoleTitle}
                onChange={(e) => setI({ ...i, yourRoleTitle: e.target.value })}
                placeholder="Senior Software Engineer"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Your superpower (one sentence — what you do better than most)</label>
              <input
                type="text"
                value={i.yourSuperpower}
                onChange={(e) => setI({ ...i, yourSuperpower: e.target.value })}
                placeholder='Ship payments features for fintech under regulatory pressure'
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Hook (your reason for reaching out)</label>
              <select
                value={i.hook}
                onChange={(e) => setI({ ...i, hook: e.target.value as Hook })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="mutual_connection">Mutual connection introduced us</option>
                <option value="recent_post">Recent post they wrote</option>
                <option value="specific_product_use">I use their product seriously</option>
                <option value="shared_company_history">Shared company history (same alma mater)</option>
                <option value="public_artefact">Their public artefact (talk, paper, OSS)</option>
                <option value="cold">Cold — no prior context</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Application stage</label>
              <select
                value={i.stage}
                onChange={(e) => setI({ ...i, stage: e.target.value as Stage })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="open_to_apply">Haven't applied yet</option>
                <option value="after_silent_application">Applied 2+ weeks ago, no response</option>
                <option value="after_rejection">Got auto-rejection, want to re-pitch</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Hook detail (specific to your hook above)</label>
              <input
                type="text"
                value={i.hookDetail}
                onChange={(e) => setI({ ...i, hookDetail: e.target.value })}
                placeholder='e.g. "your post about idempotency in retries" or "Sarah Smith introduced us"'
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>CV link (Notion, Google Drive view-only, personal site, LinkedIn)</label>
              <input
                type="url"
                value={i.cvLink}
                onChange={(e) => setI({ ...i, cvLink: e.target.value })}
                placeholder="https://linkedin.com/in/yourname"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
              <p className={`mt-1 text-xs ${t.textMuted}`}>
                Never use an attachment. Public link only — attachments downrank sender reputation.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Send className="w-4 h-4" /> Generate emails
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="email-results"
            className="scroll-mt-24 space-y-4"
          >
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

            <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Email variants</h2>

            {generated.variants.map((v, idx) => (
              <div key={idx} className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className={`text-xs font-bold uppercase tracking-widest text-violet-500`}>
                    Variant {idx + 1} · {v.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(`Subject: ${v.subject}\n\n${v.body}`, idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                      copiedIndex === idx
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                    }`}
                  >
                    {copiedIndex === idx ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <p className={`text-xs ${t.textMuted} mb-1 mt-3`}>Subject:</p>
                <p className={`text-sm font-semibold ${t.text} ${t.cardInner} rounded p-2 mb-3`}>{v.subject}</p>
                <p className={`text-xs ${t.textMuted} mb-1`}>Body:</p>
                <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed ${t.cardInner} rounded-lg p-3`}>{v.body}</pre>
                <p className={`mt-3 text-xs ${t.textMuted}`}>
                  <strong className={t.textSub}>Why this works:</strong> {v.why}
                </p>
              </div>
            ))}

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>Sending tips</p>
              <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                {generated.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                If they reply yes, prep for the call in 90 seconds.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes their company + role and gives you a 90-second prep pack: company
                brief, fit score, likely interview questions, 5-min pitch. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=cold-email-hiring-manager"
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
            <Link to="/tools/recruiter-reply" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Recruiter reply</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
