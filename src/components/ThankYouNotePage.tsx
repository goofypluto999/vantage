import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Mail, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/thank-you-note -- post-interview thank-you note generator.
 * Pure client-side, deterministic templates. No LLM.
 *
 * Drafted 2026-05-10. 10th free tool. Captures the high-intent
 * "interview thank you note" search-traffic surface. Recruiters do
 * notice thank-you notes; the wrong tone (sycophantic / generic)
 * actively harms the candidate.
 */

type Tone = 'warm' | 'direct' | 'specific';
type RoundType = 'recruiter' | 'hiring_manager' | 'technical' | 'panel' | 'final';
type Sentiment = 'positive' | 'neutral' | 'concerned';

interface Inputs {
  recipientName: string;
  company: string;
  role: string;
  roundType: RoundType;
  topicDiscussed: string;
  myBestMoment: string;
  followUpQuestion: string;
  tone: Tone;
  sentiment: Sentiment;
  hoursSinceCall: number;
}

const ROUND_LABEL: Record<RoundType, string> = {
  recruiter: 'recruiter screen',
  hiring_manager: 'hiring manager round',
  technical: 'technical interview',
  panel: 'panel interview',
  final: 'final round',
};

function buildNote(i: Inputs): { subject: string; body: string; tips: string[] } {
  const recipient = i.recipientName.trim() || '[Name]';
  const company = i.company.trim() || '[Company]';
  const role = i.role.trim() || 'the role';
  const topic = i.topicDiscussed.trim();
  const myMoment = i.myBestMoment.trim();
  const followUp = i.followUpQuestion.trim();

  // Subject — keep it short and concrete
  const subject = `Following up — ${role} ${i.roundType === 'final' ? 'final round' : 'interview'}`;

  // Opening
  let opening: string;
  if (i.tone === 'warm') {
    opening = `Hi ${recipient},\n\nThanks for the time today. I really enjoyed our conversation about ${role} at ${company}.`;
  } else if (i.tone === 'direct') {
    opening = `${recipient},\n\nQuick follow-up after today's ${ROUND_LABEL[i.roundType]} for ${role}.`;
  } else {
    // specific
    opening = `Hi ${recipient},\n\nThanks for walking me through ${ROUND_LABEL[i.roundType]} for ${role} today. ${topic ? `Our discussion of ${topic} was particularly useful — ` : ''}I left the call thinking about ${i.roundType === 'technical' ? 'how to apply that approach' : 'the team and the work'}.`;
  }

  // Middle — anchor on a specific moment + sentiment
  let middle = '';
  if (myMoment) {
    middle += `\n\nReflecting on what we covered, ${myMoment}.`;
  }
  if (i.sentiment === 'concerned') {
    middle += `\n\nIf there's anything from the conversation that left you uncertain — happy to address it directly. I'd rather you have full information when you make the call than discover something afterwards that I could have explained.`;
  } else if (i.sentiment === 'positive') {
    middle += `\n\n${role} is a strong fit for what I want to be doing next, and ${company}'s ${i.roundType === 'final' ? 'team' : 'approach'} maps closely to where I think I can have the most impact. I'd be glad to be considered seriously.`;
  } else {
    // neutral
    middle += `\n\nIf you have any follow-up questions or need any clarifications, I'm happy to dig in.`;
  }

  // Follow-up question
  if (followUp) {
    middle += `\n\nOne thing I wanted to ask: ${followUp}.`;
  }

  // Closing
  let closing: string;
  if (i.tone === 'warm') {
    closing = '\n\nThanks again — looking forward to hearing about next steps.\n\n[Your name]';
  } else if (i.tone === 'direct') {
    closing = '\n\nLet me know what comes next.\n\n[Your name]';
  } else {
    closing = '\n\nLooking forward to next steps.\n\n[Your name]';
  }

  const body = opening + middle + closing;

  // Tips
  const tips: string[] = [];
  if (i.hoursSinceCall > 24) {
    tips.push(`You're past the 24-hour window. Send the note now anyway — late thank-you is better than no thank-you. Open with "Apologies for the delay" if it bothers you, but most recruiters don't track timing strictly.`);
  } else if (i.hoursSinceCall > 4) {
    tips.push('You\'re in the sweet spot (4-24h after the call). Send within the next few hours.');
  } else {
    tips.push('Same-day notes are fine but not required. If anything, sleeping on it makes the note less reactive and more considered.');
  }
  if (!topic) {
    tips.push('Add at least one specific topic from the conversation. Generic thank-you notes that could have been written before the call read as templated and hurt more than they help.');
  }
  if (!myMoment) {
    tips.push('Reference one moment in the conversation where you said something interesting. This is the strongest signal that you actually engaged vs went through motions.');
  }
  if (i.tone === 'warm' && i.roundType === 'technical') {
    tips.push('Warm tone for a technical interview can read as performative. Consider switching to direct or specific tone.');
  }
  if (i.sentiment === 'concerned' && i.roundType !== 'final') {
    tips.push('Addressing concerns proactively is the strongest signal of mature judgment. Most candidates avoid this; the few who do it well stand out.');
  }
  tips.push('Send to your direct interviewer. If you had multiple interviewers, send a separate (slightly different) note to each. Same template, different specific topic each.');
  tips.push('Do not CC HR / recruiter unless they ran the round. Direct relationships matter more than visibility.');
  tips.push('If you want to follow up on a specific question (like compensation, timeline, or scope), that is a separate email a week later — never bundle it with the thank-you note.');

  return { subject, body, tips };
}

export default function ThankYouNotePage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    recipientName: '',
    company: '',
    role: '',
    roundType: 'hiring_manager',
    topicDiscussed: '',
    myBestMoment: '',
    followUpQuestion: '',
    tone: 'specific',
    sentiment: 'positive',
    hoursSinceCall: 4,
  });
  const [generated, setGenerated] = useState<ReturnType<typeof buildNote> | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerated(buildNote(i));
    setTimeout(() => {
      const el = document.getElementById('note-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async () => {
    if (!generated) return;
    const text = `Subject: ${generated.subject}\n\n${generated.body}`;
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
      { '@type': 'ListItem', position: 3, name: 'Thank-you note', item: `${SITE_URL}/tools/thank-you-note` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free Post-Interview Thank-You Note Generator — Tone-Calibrated Templates"
        description="Free in-browser post-interview thank-you note generator. Pick tone, round type, sentiment, hours since call. Get a calibrated note that anchors on specific topics from your conversation. Plus 7 sending tips. No signup, runs in your browser."
        path="/tools/thank-you-note"
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
            Post-interview thank-you note
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            The right thank-you note moves the needle. The wrong one (generic, sycophantic, late)
            actively harms you. Pick tone + round + sentiment, anchor on a specific topic from
            your conversation, get a calibrated note plus 7 sending tips. Pure client-side.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Interviewer name</label>
              <input
                type="text"
                value={i.recipientName}
                onChange={(e) => setI({ ...i, recipientName: e.target.value })}
                placeholder="Sarah"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Company</label>
              <input
                type="text"
                value={i.company}
                onChange={(e) => setI({ ...i, company: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Role title</label>
              <input
                type="text"
                value={i.role}
                onChange={(e) => setI({ ...i, role: e.target.value })}
                placeholder="Senior PM"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Round</label>
              <select
                value={i.roundType}
                onChange={(e) => setI({ ...i, roundType: e.target.value as RoundType })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="recruiter">Recruiter screen</option>
                <option value="hiring_manager">Hiring manager</option>
                <option value="technical">Technical / system design</option>
                <option value="panel">Panel</option>
                <option value="final">Final round</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>One specific topic you discussed</label>
              <input
                type="text"
                value={i.topicDiscussed}
                onChange={(e) => setI({ ...i, topicDiscussed: e.target.value })}
                placeholder="how Stripe handles idempotency on retries"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
              <p className={`mt-1 text-xs ${t.textMuted}`}>
                Be specific. Generic ("the role", "the company") signals you're recycling.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>One thing you said well in the call</label>
              <input
                type="text"
                value={i.myBestMoment}
                onChange={(e) => setI({ ...i, myBestMoment: e.target.value })}
                placeholder='"my answer about the X tradeoff was the most representative of how I think"'
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Optional: a follow-up question</label>
              <input
                type="text"
                value={i.followUpQuestion}
                onChange={(e) => setI({ ...i, followUpQuestion: e.target.value })}
                placeholder="how the team handles week-1 onboarding for new hires"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Tone</label>
              <select
                value={i.tone}
                onChange={(e) => setI({ ...i, tone: e.target.value as Tone })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="warm">Warm (relationship-first)</option>
                <option value="direct">Direct (transactional)</option>
                <option value="specific">Specific (anchored on the topic)</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Sentiment</label>
              <select
                value={i.sentiment}
                onChange={(e) => setI({ ...i, sentiment: e.target.value as Sentiment })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="positive">It went well — express interest</option>
                <option value="neutral">Could go either way — neutral</option>
                <option value="concerned">Worried about a specific moment — address it</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Hours since the call</label>
              <input
                type="number"
                value={i.hoursSinceCall}
                onChange={(e) => setI({ ...i, hoursSinceCall: Number(e.target.value) })}
                min={0}
                max={120}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Mail className="w-4 h-4" /> Generate the note
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="note-results"
            className="scroll-mt-24 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className={`text-2xl font-bold ${t.text}`}>Your note</h2>
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

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-2`}>Subject</p>
              <p className={`text-sm font-semibold ${t.text}`}>{generated.subject}</p>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-2`}>Body</p>
              <pre className={`text-sm ${t.text} whitespace-pre-wrap font-mono leading-relaxed`}>{generated.body}</pre>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-3`}>
                Sending tips
              </p>
              <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                {generated.tips.map((p, idx) => <li key={idx}>{p}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                One round done. Prepare the next one in 90 seconds.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your CV and the actual job link, generates likely interview questions
                for the next round, drafts a tailored cover letter (4 tones), and builds a 5-minute
                pitch outline. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=thank-you-note"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Prep the next round <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>Other free tools, no signup:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast my cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job detector</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>CV bullet rewriter</Link>
            <Link to="/tools/layoff-playbook" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Layoff playbook</Link>
            <Link to="/tools/cover-letter-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Cover letter compare</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation script</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
