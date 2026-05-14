import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Linkedin, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/linkedin-about -- LinkedIn About / headline rewriter.
 * Pure client-side. Deterministic templates branched on inputs.
 *
 * Drafted 2026-05-10. 11th free tool. Captures massive search-volume
 * "linkedin about template" + "linkedin headline rewrite" + "linkedin
 * open to work" queries. Pairs naturally with the rest of the surface.
 *
 * Most LinkedIn About sections are dead weight: third-person platitudes
 * ("seasoned professional with 10+ years"), a values list, no anchor on
 * one specific story, no call-to-action. This tool diagnoses + rewrites.
 */

type Mode = 'headline' | 'about';
type Stance = 'open_to_work' | 'employed_passive' | 'building' | 'consulting';

interface Inputs {
  mode: Mode;
  stance: Stance;
  currentRole: string;
  yearsExperience: number;
  superpower: string; // one-sentence "what I do better than most"
  proudMoment: string; // single concrete story
  targetCompanies: string;
  contactPreference: string; // "DM me", "email at X", "open to call"
  recentLayoffCompany: string; // optional
}

interface Output {
  variants: { label: string; text: string; why: string }[];
  diagnosis: string[];
  tips: string[];
}

const HEADLINE_VARIANTS = (i: Inputs): Output => {
  const role = i.currentRole.trim() || '[role]';
  const sp = i.superpower.trim();
  const layoff = i.recentLayoffCompany.trim();
  const yrs = i.yearsExperience;

  const variants: Output['variants'] = [];

  // Variant 1: outcome-led
  if (sp) {
    variants.push({
      label: 'Outcome-led (recommended)',
      text: i.stance === 'open_to_work'
        ? `${role} | ${sp} | Open to ${i.targetCompanies.trim() || 'next role'}`
        : `${role} | ${sp}`,
      why: 'Recruiters skim headlines in 3 seconds. Outcome-led ("ship X for Y") beats title-led ("Senior Engineer at Acme"). The Open-to clause makes you searchable for that intent.',
    });
  }

  // Variant 2: stance-explicit
  if (i.stance === 'open_to_work' && layoff) {
    variants.push({
      label: 'Cohort-explicit',
      text: `Ex-${layoff} ${role} | ${sp || 'available now'} | UK-remote / hybrid`,
      why: `The "Ex-[Company]" badge has signal value for ~6 months post-layoff. Recruiters at peer companies actively search this string. Use it while it is hot.`,
    });
  }

  // Variant 3: building / consulting variants
  if (i.stance === 'building') {
    variants.push({
      label: 'Builder-mode',
      text: `Building [your project] | ${role} background | ${yrs}+ yrs ${sp || ''}`.trim(),
      why: 'If you are building something on the side, leading with that flips the narrative. Recruiters who reach out know you are not desperate; founders who reach out see signal.',
    });
  } else if (i.stance === 'consulting') {
    variants.push({
      label: 'Consulting-mode',
      text: `${role} consultant | ${yrs}+ yrs | Helping [niche] ship [outcome]`,
      why: 'Consultants need niche + outcome explicitly. "10+ yrs experience" alone is commodity; "Helping fintech ship payments-compliance reviews" is bookable.',
    });
  }

  // Variant 4: minimalist
  variants.push({
    label: 'Minimalist',
    text: i.currentRole.trim() || '[role]',
    why: 'Goes against most advice but works for senior+ profiles where the rest of the profile carries weight. Nothing to misread.',
  });

  const diagnosis: string[] = [];
  if (!sp) {
    diagnosis.push('No "superpower" provided. Headlines without a specific outcome ("ship X for Y") read as commodity.');
  }
  if (i.stance === 'open_to_work' && !layoff && !i.targetCompanies.trim()) {
    diagnosis.push('"Open to work" with no specific direction makes you invisible to targeted recruiter searches. Add either ex-[company] or target-companies/role to be findable.');
  }

  const tips: string[] = [
    'LinkedIn truncates headlines at ~120 chars on most surfaces. Keep yours under that or the most important word gets cut.',
    'Headline variants you should A/B test for 2 weeks each: outcome-led vs cohort-explicit. Track inbound recruiter messages per week.',
    'Do NOT use emojis in headlines if you are targeting traditional industries (finance, legal). Tech/startup is fine.',
    'The headline is one of the few places "Ex-[Company]" still helps you in 2026 — recruiters search this string during cohort waves.',
  ];

  return { variants, diagnosis, tips };
};

const ABOUT_TEMPLATE = (i: Inputs): Output => {
  const role = i.currentRole.trim() || '[role]';
  const sp = i.superpower.trim();
  const moment = i.proudMoment.trim();
  const layoff = i.recentLayoffCompany.trim();
  const targets = i.targetCompanies.trim();
  const contact = i.contactPreference.trim() || 'DM me';

  const variants: Output['variants'] = [];

  // Variant 1: Hook-led "I" voice (most modern)
  variants.push({
    label: 'Hook-led "I" voice (recommended)',
    text: [
      sp ? `I ${sp.toLowerCase().startsWith('i ') ? sp.toLowerCase().slice(2) : sp.toLowerCase()}.` : `I am a ${role}.`,
      '',
      moment ? `The thing I am most proud of: ${moment}.` : `Recent work: [specific shipped thing with a metric].`,
      '',
      i.stance === 'open_to_work'
        ? `Right now I am ${layoff ? `ex-${layoff} and ` : ''}looking for ${targets ? `roles at ${targets}` : 'the next role where I can do more of the above'}. Specifically: [specific role types]. Specifically not: [filter — too small, too generic, no path forward].`
        : i.stance === 'building'
        ? `Right now I am building [your project]. If you are working on something adjacent — [reasons to talk] — let's swap notes.`
        : i.stance === 'consulting'
        ? `Right now I take on 1-2 consulting engagements per quarter. Best fit: [niche client profile]. Worst fit: [explicit anti-fit].`
        : `Right now I am at [current company] and watching the market. Best place to reach me: ${contact}.`,
      '',
      `${contact}.`,
    ].join('\n'),
    why: 'First-person "I" voice is the 2024+ standard. Third-person ("seasoned professional with...") was pre-2020. Hook with the superpower as the FIRST sentence wins more recruiter clicks than any other pattern.',
  });

  // Variant 2: Story-led
  if (moment) {
    variants.push({
      label: 'Story-led',
      text: [
        `${moment}.`,
        '',
        `That story is the shape of how I ${sp ? sp.toLowerCase() : 'work'}. ${role} for ${i.yearsExperience}+ years.`,
        '',
        i.stance === 'open_to_work'
          ? `Now: ${layoff ? `ex-${layoff}, ` : ''}looking for the next ${targets ? `at companies like ${targets}` : 'role where the next chapter rhymes with the story above'}.`
          : `Now: at [current], curious about adjacent moves.`,
        '',
        contact,
      ].join('\n'),
      why: 'Opening with a specific story is the rarest pattern in About sections (most lead with "I am a..."). It gets read 3x more often than the average open. Works for senior+ candidates with at least one shippable story.',
    });
  }

  // Variant 3: Specific-niche
  if (sp && targets) {
    variants.push({
      label: 'Niche-explicit',
      text: [
        `${role} who ${sp.toLowerCase()}. ${i.yearsExperience}+ years.`,
        '',
        `Companies whose work I want to be inside: ${targets}.`,
        `Why: [1 specific reason — not "I love their mission" — something about the technical / product / strategy choice they have made that you have an opinion on].`,
        '',
        `If you are a recruiter or hiring manager at one of those, ${contact}. I will respond fast.`,
        moment ? `\nProud moment: ${moment}.` : '',
        '',
        `Anti-fit: companies that ${i.stance === 'open_to_work' ? '[the things you do not want — be specific. "Crypto" or "ad tech" or "agencies" — niche-explicit beats vague]' : '[anti-fit specifics]'}.`,
      ].join('\n'),
      why: 'Listing target companies BY NAME makes you findable by their hiring managers via LinkedIn search. Listing anti-fit signals discrimination + decisiveness, which senior recruiters prefer over generic enthusiasm.',
    });
  }

  const diagnosis: string[] = [];
  if (!sp) {
    diagnosis.push('No specific "what I do better than most" sentence. About sections without this read as resume bullet recital.');
  }
  if (!moment) {
    diagnosis.push('No proud-moment story. The single hardest gap to fix; most candidates do not have one written down. Spend 20 minutes on it before publishing.');
  }
  if (i.stance === 'open_to_work' && !targets) {
    diagnosis.push('"Open to work" without specific target companies is invisible to LinkedIn search. Pick 5-10 companies; list them.');
  }
  if (i.yearsExperience < 3) {
    diagnosis.push('Under 3 years experience: lead with a project / contribution rather than years. "I shipped X for Y" outranks "1 year of Z experience" at this level.');
  }

  const tips: string[] = [
    'LinkedIn About is shown TRUNCATED at ~365 characters in most surfaces. The first 365 chars need to do the work alone.',
    'Bullet points are allowed but read as templated. Prose-with-line-breaks reads as written-by-a-human and converts better.',
    'No third-person ("Sarah is a seasoned..."). First-person "I" only.',
    'Include your contact preference at the end. Most About sections end without one and lose the inbound conversion.',
    'Update About when status changes (layoff, new project, target shift). Stale About = stale signal.',
    'Anti-tactic: "DM me to learn more" without saying what. People do not click to read more about a stranger. Tell them what they will get.',
    'If you have an external blog / newsletter, link it from About. LinkedIn allows links and they do not get penalized.',
  ];

  return { variants, diagnosis, tips };
};

export default function LinkedInAboutPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    mode: 'about',
    stance: 'open_to_work',
    currentRole: '',
    yearsExperience: 5,
    superpower: '',
    proudMoment: '',
    targetCompanies: '',
    contactPreference: 'DM me',
    recentLayoffCompany: '',
  });
  const [generated, setGenerated] = useState<Output | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerated(i.mode === 'headline' ? HEADLINE_VARIANTS(i) : ABOUT_TEMPLATE(i));
    setTimeout(() => {
      const el = document.getElementById('linkedin-results');
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
      { '@type': 'ListItem', position: 3, name: 'LinkedIn Headline / About Rewriter', item: `${SITE_URL}/tools/linkedin-about` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free LinkedIn Headline + About Rewriter — 3-Variant Templates"
        description="Free in-browser LinkedIn headline + About rewriter. Pick stance (open-to-work / employed-passive / building / consulting), get 2-3 variants with rationale plus diagnosis + 7 tips. Pure client-side, no signup."
        path="/tools/linkedin-about"
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
            LinkedIn headline + About rewriter
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Most LinkedIn About sections are dead weight: third-person platitudes, no specific
            story, no call-to-action. This tool diagnoses what's broken and gives you 2-3 rewrite
            variants with rationale. Pure client-side.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          {/* Mode toggle */}
          <div className="mb-4">
            <label className={`block text-xs font-semibold ${t.text} mb-2`}>What are you rewriting?</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setI({ ...i, mode: 'about' })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  i.mode === 'about'
                    ? 'bg-violet-600 text-white'
                    : `${t.cardInner} ${t.textSub}`
                }`}
              >
                About section
              </button>
              <button
                type="button"
                onClick={() => setI({ ...i, mode: 'headline' })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  i.mode === 'headline'
                    ? 'bg-violet-600 text-white'
                    : `${t.cardInner} ${t.textSub}`
                }`}
              >
                Headline (~120 chars)
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Your stance</label>
              <select
                value={i.stance}
                onChange={(e) => setI({ ...i, stance: e.target.value as Stance })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                <option value="open_to_work">Open to work</option>
                <option value="employed_passive">Employed but watching the market</option>
                <option value="building">Building something on the side</option>
                <option value="consulting">Consulting / freelance</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Current role title</label>
              <input
                type="text"
                value={i.currentRole}
                onChange={(e) => setI({ ...i, currentRole: e.target.value })}
                placeholder="Senior Software Engineer"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Years experience</label>
              <input
                type="number"
                value={i.yearsExperience || ''}
                onChange={(e) => setI({ ...i, yearsExperience: Number(e.target.value) })}
                min={0}
                max={40}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Your "superpower" — what you do better than most (one sentence)</label>
              <input
                type="text"
                value={i.superpower}
                onChange={(e) => setI({ ...i, superpower: e.target.value })}
                placeholder='Ship payments features for fintech under regulatory pressure'
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            {i.mode === 'about' && (
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>One concrete proud moment (story, not list)</label>
                <input
                  type="text"
                  value={i.proudMoment}
                  onChange={(e) => setI({ ...i, proudMoment: e.target.value })}
                  placeholder="rebuilt the checkout flow at [company], cut cart abandonment from 68% to 41%"
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
            )}
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Target companies (if known)</label>
              <input
                type="text"
                value={i.targetCompanies}
                onChange={(e) => setI({ ...i, targetCompanies: e.target.value })}
                placeholder="Stripe, Klarna, Wise"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Recently laid off from (if applicable)</label>
              <input
                type="text"
                value={i.recentLayoffCompany}
                onChange={(e) => setI({ ...i, recentLayoffCompany: e.target.value })}
                placeholder="Cloudflare"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            {i.mode === 'about' && (
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold ${t.text} mb-1`}>Contact preference (closing line)</label>
                <input
                  type="text"
                  value={i.contactPreference}
                  onChange={(e) => setI({ ...i, contactPreference: e.target.value })}
                  placeholder="DM me here. Open to a 20-min call."
                  className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
                />
              </div>
            )}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Linkedin className="w-4 h-4" /> Generate variants
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="linkedin-results"
            className="scroll-mt-24 space-y-4"
          >
            <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Variants</h2>

            {generated.diagnosis.length > 0 && (
              <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-amber-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h3 className={`font-bold ${t.text}`}>Before you publish</h3>
                </div>
                <ul className={`text-sm ${t.textSub} space-y-2 list-disc pl-5`}>
                  {generated.diagnosis.map((d, idx) => <li key={idx}>{d}</li>)}
                </ul>
              </div>
            )}

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
                {generated.tips.map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Now run the full prep pack on your actual job links.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your CV + a job link, generates a tailored cover letter (4 tones),
                interview questions, fit score, and 5-min pitch outline. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=linkedin-about"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Try AimVantage free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>Other free tools, no signup:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/roast" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Roast cover letter</Link>
            <Link to="/decode-rejection" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Decode rejection</Link>
            <Link to="/ghost-job-check" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Ghost-job detector</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS scanner</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/tools/bullet-rewriter" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Bullet rewriter</Link>
            <Link to="/tools/layoff-playbook" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Layoff playbook</Link>
            <Link to="/tools/cover-letter-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Cover letter compare</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation</Link>
            <Link to="/tools/thank-you-note" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Thank-you note</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
