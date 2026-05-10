import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Calendar, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/layoff-playbook -- client-side 30-day post-layoff plan
 * generator. Pure browser-side. No API calls.
 *
 * Drafted 2026-05-10 to expand the free-tool surface (now 7 tools)
 * and capture layoff-cohort search traffic ("just got laid off plan",
 * "what to do after layoff 30 days"). Output is a copy-paste-able
 * markdown playbook personalised to the user's role + situation.
 */

type Role = 'engineer' | 'pm' | 'designer' | 'data' | 'sales' | 'marketing' | 'manager' | 'other';
type Country = 'uk' | 'us' | 'eu';
type Severance = 'yes_3plus' | 'yes_under3' | 'no';
type Visa = 'citizen' | 'h1b' | 'tier2' | 'eu_citizen' | 'other';

interface PlaybookInput {
  company: string;
  role: Role;
  country: Country;
  severance: Severance;
  visa: Visa;
  hasReferences: boolean;
}

interface DayEntry {
  day: number;
  title: string;
  blurb: string;
  tools?: { label: string; href: string }[];
}

const ROLE_LABEL: Record<Role, string> = {
  engineer: 'Software Engineer',
  pm: 'Product Manager',
  designer: 'Designer',
  data: 'Data / ML',
  sales: 'Sales',
  marketing: 'Marketing',
  manager: 'Engineering Manager',
  other: 'Other',
};

const COUNTRY_LABEL: Record<Country, string> = { uk: 'UK', us: 'US', eu: 'EU' };

function generatePlaybook(input: PlaybookInput): DayEntry[] {
  const { company, role, country, severance, visa, hasReferences } = input;
  const days: DayEntry[] = [];
  const c = company.trim() || 'your company';

  // ──────────────────── Week 1: stabilise ────────────────────
  days.push({
    day: 1,
    title: 'Stabilise. Do nothing job-related.',
    blurb: 'You will not job-hunt today. Sleep. Eat. Walk. The first 24 hours are for cortisol to come down. Decisions made today are bad decisions. The recruiter window is 6 weeks; you do not lose anything by taking 1 day.',
  });
  days.push({
    day: 2,
    title: 'Severance + benefits paperwork',
    blurb: severance === 'yes_3plus'
      ? `Confirm in writing the ${c} severance terms (number of weeks, equity acceleration, ${country === 'us' ? 'COBRA' : 'private health continuation'}, references clause, non-compete clause). Do NOT sign anything in the first 48 hours — every laid-off cohort has at least one person who signed away statutory rights under emotional duress.`
      : severance === 'yes_under3'
      ? `Confirm the short severance terms in writing. Most importantly: ${country === 'us' ? 'when does health insurance end (COBRA election deadline is 60 days but premium is high)' : country === 'uk' ? 'whether the package exceeds statutory redundancy minimum (1.5 weeks per year over 22, 1 week per year 22-40, 0.5 weeks per year under 22; capped at £719/week as of 2026)' : 'EU member state minimum (varies — Germany 0.5 month/year, France 1/4 to 1/3 month/year)'}. Do not sign anything in the first 48 hours.`
      : `No formal severance — confirm in writing whether ${c} will pay any notice period or accrued PTO. ${country === 'us' ? 'File for unemployment THIS WEEK — there is a 1-week waiting period in most states.' : country === 'uk' ? 'Check JSA / Universal Credit eligibility; you can claim from day one.' : 'Check national unemployment-benefit eligibility — most EU systems require registration within 7 days.'}`,
  });
  days.push({
    day: 3,
    title: 'Lock down email + phone + LinkedIn',
    blurb: `Forward your work email contacts to a personal Gmail/ProtonMail. Save personal mobile numbers from work phone if access is closing. Update LinkedIn: change title to "Open to Work — ${ROLE_LABEL[role]}". Do NOT activate the green "Open to Work" frame yet (it depresses recruiter response by ~20%); we'll trigger it strategically on day 8.`,
    tools: [
      { label: 'Free CV bullet rewriter', href: '/tools/bullet-rewriter' },
    ],
  });
  days.push({
    day: 4,
    title: 'CV refresh — strip Vantage Lab acronyms, add metrics',
    blurb: `Open your latest CV. For every bullet: (1) remove company-internal acronyms a non-${c} reader will not understand, (2) add a metric (by how much, for how many, over what period), (3) replace any "responsible for" with action+outcome. The CV bullet rewriter linked below diagnoses each bullet in 5 seconds.`,
    tools: [
      { label: 'CV bullet rewriter', href: '/tools/bullet-rewriter' },
      { label: 'ATS keyword scanner', href: '/ats/scanner' },
    ],
  });
  days.push({
    day: 5,
    title: 'Network audit — list 25 specific names',
    blurb: `Open LinkedIn. List 25 specific people you would feel OK DM-ing — not "post about being laid off and pray". Categorise: (a) ex-${c} colleagues at peer companies, (b) people you delivered something for, (c) recruiters who reached out in the last 12 months. This list is your inbound channel for week 2.`,
  });
  days.push({
    day: 6,
    title: 'Pick 3 target companies. Read their interview deep-dives.',
    blurb: `Pick 3 companies you would actually want to work at. Read each company's specific interview deep-dive (we have 34 covering Stripe, Anthropic, OpenAI, Apple, Microsoft, Amazon, Stripe, Cursor, Replit, Modal, etc.). The single biggest lever is matching your prep to the company's specific filter — most candidates run generic prep and fail the AI-thesis question.`,
    tools: [
      { label: 'Browse 34 company deep-dives', href: '/blog' },
      { label: 'State of 2026 Hiring report', href: '/state-of-2026' },
    ],
  });
  days.push({
    day: 7,
    title: 'Rest. Long walk. No screens after 6pm.',
    blurb: 'Day 7 is non-negotiable rest. Job search is a marathon. Burnout in week 1 = 3 lost weeks downstream. Sleep, walk, see one person you like.',
  });

  // ──────────────────── Week 2: launch ────────────────────
  days.push({
    day: 8,
    title: 'Activate "Open to Work" green frame on LinkedIn',
    blurb: `Now that the CV is tight and the network list exists, turn on the green frame. Recruiters search for it. Pair it with a 3-line "${c} just cut N people, here is what I built and what I'm looking for" post. Specific > vague. Do NOT cry-post; the cohort is already crying enough.`,
  });
  days.push({
    day: 9,
    title: 'DM 5 people from your network list',
    blurb: 'Specific ask, not "let me know if anything comes up". Examples: "are you still hiring on the X team", "could you intro me to your hiring manager for Y", "can you spare 20 min for a virtual coffee about Z transition". Targeted > broadcast.',
  });
  days.push({
    day: 10,
    title: 'Apply to 5 roles. With Vantage prep packs.',
    blurb: `Pick 5 roles from your 3 target companies. For each, run a Vantage prep pack (90 seconds each = 8 minutes total) so the cover letter is tailored to the actual JD. Generic cover letters from a laid-off candidate read as desperate; tailored ones read as deliberate.`,
    tools: [
      { label: 'Run a free prep pack', href: '/register?source=playbook-day10' },
    ],
  });
  days.push({
    day: 11,
    title: 'DM 5 more people. Different category from day 9.',
    blurb: 'If day 9 was ex-colleagues, day 11 is recruiters who reached out in the past year. Reactivate dormant relationships with a specific update.',
  });
  days.push({
    day: 12,
    title: 'Apply to 5 more roles. Track in spreadsheet.',
    blurb: 'Spreadsheet columns: company, role, applied date, JD link, outcome, follow-up date. The follow-up date is the unsexy lever that wins — most applications die because nobody nudges at day 7.',
  });
  days.push({
    day: 13,
    title: 'Read 1 book on negotiation. Or watch 2 hours of YT on it.',
    blurb: '"Never Split the Difference" by Chris Voss is the standard. The negotiation phase is where ex-FAANG/big-tech engineers leave the most money — Severance + signing bonus + RSU refresh + remote/hybrid policy are all negotiable when you have an offer. Prepare now.',
  });
  days.push({
    day: 14,
    title: 'Rest. Review. Adjust.',
    blurb: 'Look at the spreadsheet. How many applications? How many DMs? How many replies? If reply rate < 5%, the CV or cover letter is not landing — go back to bullet rewriter + ATS scanner before doubling down.',
  });

  // ──────────────────── Week 3: scale ────────────────────
  days.push({
    day: 15,
    title: 'Hit 30 applications cumulative',
    blurb: 'Most laid-off candidates apply to 5 then plateau because "nothing is replying". Reply rate at week 2 is meaningless. Push through to 30 applications with tailored prep before evaluating signal.',
    tools: [
      { label: 'Run prep packs faster', href: '/register?source=playbook-day15' },
    ],
  });
  days.push({
    day: 16,
    title: 'First-round prep: study 1 company in depth',
    blurb: 'If you have a recruiter screen scheduled, spend 90 minutes the day before on company-specific research. Not generic interview prep; the company-specific deep-dive (we have 34 of them).',
    tools: [
      { label: 'Browse company deep-dives', href: '/interview-prep' },
    ],
  });
  days.push({
    day: 17,
    title: 'DM 5 more — second-degree connections',
    blurb: 'Reach out to second-degree connections at your 3 target companies via your first-degree warm-introducers. The 30-second template: "Hi [warm contact], I am interviewing at [target company] for [role]. I noticed [target person] works there. Could you make a quick intro?" 90% say yes.',
  });
  days.push({
    day: 18,
    title: 'Refresh the CV. Iterate from week 2 feedback.',
    blurb: 'You now have data. Which bullets got positive recruiter calls? Which JDs returned silence? Iterate the CV based on signal, not vibes.',
    tools: [
      { label: 'CV bullet rewriter', href: '/tools/bullet-rewriter' },
    ],
  });
  days.push({
    day: 19,
    title: 'Apply to 5 more. Cumulative target: 35.',
    blurb: 'Push through to 35. The recruiter-attention window is 6 weeks; you are halfway through. If a target company has not opened your application, send a follow-up DM to a referral on day 21.',
  });
  days.push({
    day: 20,
    title: 'Side-project hour. Public, verifiable.',
    blurb: `Spend 1 hour on a small public artefact: an open-source PR, a Hub model, a Space, a public Notion. ${role === 'engineer' || role === 'data' ? 'Hugging Face, Modal, Cursor explicitly filter on public artefacts.' : role === 'pm' || role === 'designer' ? 'A Linear-quality public spec or a Figma file shared publicly.' : 'A LinkedIn post that frames your domain expertise concretely.'} This compounds across the entire job search.`,
  });
  days.push({
    day: 21,
    title: 'Rest. Review week 3.',
    blurb: 'Reply rate should now be 8-15% if the CV + cover letter loop is working. Below 5% = something is broken. Run the No Interviews Diagnostic.',
    tools: [
      { label: 'Why no interviews diagnostic', href: '/tools/no-interviews-diagnostic' },
    ],
  });

  // ──────────────────── Week 4: convert ────────────────────
  days.push({
    day: 22,
    title: 'Onsite prep mode',
    blurb: 'For any company that has invited you to onsite or final-round, lock in 90 minutes/day for company-specific prep until the loop. Stop applying for new roles for the 5 days leading up to the loop — focus beats volume here.',
  });
  days.push({
    day: 23,
    title: 'Mock 3 likely interview questions out loud',
    blurb: 'The single biggest gap between candidates who pass onsites and those who do not: rehearsing answers OUT LOUD before the loop. Pick 3 likely questions from the company-specific deep-dive and time them.',
  });
  days.push({
    day: 24,
    title: 'Negotiation prep — your numbers',
    blurb: 'Even if no offer yet, know your numbers: target base, acceptable base, equity expectations, RSU refresh, signing bonus, remote/hybrid stance. Write them down. The first time someone offers you 80k and you have not pre-decided 95k is acceptable, you accept 80k.',
  });
  days.push({
    day: 25,
    title: 'Apply to 3 stretch roles',
    blurb: 'Aim 1 level above where you applied in week 1. Two-thirds will silently filter you out; one might say "you would be a fit for X-1, interested?" That conversation is more valuable than the 5 lateral applications you skipped.',
  });
  days.push({
    day: 26,
    title: 'DM 5 more — public-thread engagers',
    blurb: 'Reach out to anyone who liked or commented on your day-8 launch post. They self-identified as paying attention.',
  });
  days.push({
    day: 27,
    title: 'Visa / location reality check',
    blurb: visa === 'h1b'
      ? 'You have 60 days from termination to find a new H-1B sponsor. By day 27 you should have at least one company in active conversation. If not, broaden to companies with proven H-1B transfer track records (Google, Microsoft, Amazon, Meta, IBM, Deloitte) regardless of role attractiveness.'
      : visa === 'tier2'
      ? 'You have 60 days on the UK Skilled Worker visa to find a new sponsor. Start filtering target list to companies with a published sponsor licence (gov.uk has the public list).'
      : visa === 'eu_citizen'
      ? 'EU citizenship gives you flexibility — broaden to remote roles across the EU + UK if local market is congested.'
      : visa === 'citizen'
      ? 'No visa pressure. The constraint is your runway, not your geography.'
      : 'Confirm visa runway exactly. Most candidates underestimate how fast 60 days passes when ego is bruised.',
  });
  days.push({
    day: 28,
    title: 'Apply to 5 more — final push of week 4',
    blurb: 'Cumulative target: 50 applications by day 28. If you have less than 3 active conversations at this point, the issue is filter-stage (CV + ATS + cover letter), not pipeline volume.',
  });
  days.push({
    day: 29,
    title: 'Refresh your spreadsheet. Schedule week 5+.',
    blurb: 'For applications older than 14 days with no response, send a final follow-up via referral and then close them. For applications in interview pipeline, schedule the next round prep. Build the week 5 plan based on what is alive.',
  });
  days.push({
    day: 30,
    title: 'Take stock. Adjust strategy. Or start week 5.',
    blurb: severance === 'yes_3plus'
      ? 'You have runway. Do NOT panic-accept a bad offer in week 5 just because the cohort hype has faded. The recruiter-attention window is closing but money in the bank means time to choose.'
      : 'Runway pressure rises from here. If you have an offer in pipeline by day 30, lean toward closing it cleanly. If you have nothing, this is the moment to lower title bar by 1 step (NOT compensation bar) and re-target.',
  });

  // References note
  if (!hasReferences) {
    days[5].blurb += ' Also today: line up 3 references — old manager, peer, direct report. Confirm they will pick up the phone if a recruiter calls. Most candidates assume references are fine; many are not.';
  }

  return days;
}

function buildMarkdown(input: PlaybookInput, days: DayEntry[]): string {
  const c = input.company.trim() || 'your company';
  const lines: string[] = [];
  lines.push(`# 30-day post-layoff playbook — ${ROLE_LABEL[input.role]} from ${c}`);
  lines.push('');
  lines.push(`Generated by Vantage at https://aimvantage.uk/tools/layoff-playbook · ${COUNTRY_LABEL[input.country]} · ${input.severance === 'yes_3plus' ? '3+ months severance' : input.severance === 'yes_under3' ? '<3 months severance' : 'no severance'}.`);
  lines.push('');
  for (const d of days) {
    lines.push(`## Day ${d.day}: ${d.title}`);
    lines.push('');
    lines.push(d.blurb);
    if (d.tools && d.tools.length > 0) {
      lines.push('');
      lines.push('Tools: ' + d.tools.map((t) => `[${t.label}](https://aimvantage.uk${t.href})`).join(' · '));
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('Run a full prep pack at https://aimvantage.uk/register — 10 free packs, no card.');
  return lines.join('\n');
}

export default function LayoffPlaybookPage() {
  const { t } = useTheme();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<Role>('engineer');
  const [country, setCountry] = useState<Country>('uk');
  const [severance, setSeverance] = useState<Severance>('yes_3plus');
  const [visa, setVisa] = useState<Visa>('citizen');
  const [hasReferences, setHasReferences] = useState(true);
  const [generated, setGenerated] = useState<DayEntry[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const days = generatePlaybook({ company, role, country, severance, visa, hasReferences });
    setGenerated(days);
    setTimeout(() => {
      const el = document.getElementById('playbook-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const markdown = useMemo(() => {
    if (!generated) return '';
    return buildMarkdown({ company, role, country, severance, visa, hasReferences }, generated);
  }, [generated, company, role, country, severance, visa, hasReferences]);

  const handleCopyMd = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Layoff Playbook', item: `${SITE_URL}/tools/layoff-playbook` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free 30-Day Post-Layoff Playbook Generator — Personalised Day-by-Day Plan"
        description="Free in-browser 30-day post-layoff plan generator. Pick your role, country, severance, visa status — get a personalised day-by-day playbook with the right action for each day. Runs in your browser. No signup. Markdown export."
        path="/tools/layoff-playbook"
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
            30-day post-layoff playbook
          </h1>
          <p className={`mt-4 text-lg ${t.textSub}`}>
            Pick your situation. Get a personalised day-by-day plan with the right specific action
            for each day. Markdown export so you can paste it into Notion / Obsidian / a sticky note
            on your laptop. No signup. No data leaves your browser.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-8`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className={`block text-sm font-semibold ${t.text} mb-2`}>
                Company you got laid off from
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Cloudflare"
                className={`w-full rounded-lg p-2.5 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
            </div>
            <div>
              <label htmlFor="role" className={`block text-sm font-semibold ${t.text} mb-2`}>Your role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className={`w-full rounded-lg p-2.5 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
              >
                {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                  <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="country" className={`block text-sm font-semibold ${t.text} mb-2`}>Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
                className={`w-full rounded-lg p-2.5 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
              >
                <option value="uk">United Kingdom</option>
                <option value="us">United States</option>
                <option value="eu">European Union</option>
              </select>
            </div>
            <div>
              <label htmlFor="severance" className={`block text-sm font-semibold ${t.text} mb-2`}>Severance status</label>
              <select
                id="severance"
                value={severance}
                onChange={(e) => setSeverance(e.target.value as Severance)}
                className={`w-full rounded-lg p-2.5 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
              >
                <option value="yes_3plus">3+ months</option>
                <option value="yes_under3">Less than 3 months</option>
                <option value="no">No severance</option>
              </select>
            </div>
            <div>
              <label htmlFor="visa" className={`block text-sm font-semibold ${t.text} mb-2`}>Visa / status</label>
              <select
                id="visa"
                value={visa}
                onChange={(e) => setVisa(e.target.value as Visa)}
                className={`w-full rounded-lg p-2.5 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder} focus:outline-none focus:ring-2 focus:ring-violet-500`}
              >
                <option value="citizen">Citizen / no visa pressure</option>
                <option value="h1b">US H-1B holder</option>
                <option value="tier2">UK Skilled Worker visa</option>
                <option value="eu_citizen">EU citizen / freedom of movement</option>
                <option value="other">Other / unsure</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className={`inline-flex items-center gap-2 text-sm ${t.text} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={hasReferences}
                  onChange={(e) => setHasReferences(e.target.checked)}
                  className="rounded"
                />
                I already have 3 references lined up
              </label>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
            >
              <Calendar className="w-4 h-4" /> Generate my 30-day plan
            </button>
          </div>
        </div>

        {generated && (
          <section
            id="playbook-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 id="results-heading" className={`text-2xl font-bold ${t.text}`}>
                Your 30-day plan
              </h2>
              <button
                type="button"
                onClick={handleCopyMd}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                }`}
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied as markdown</> : <><Copy className="w-3.5 h-3.5" /> Copy as markdown</>}
              </button>
            </div>

            <div className="space-y-3">
              {generated.map((d) => (
                <div key={d.day} className={`${t.glass} rounded-xl p-4`}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-violet-500 flex-shrink-0">
                      Day {d.day}
                    </span>
                    <h3 className={`font-bold ${t.text}`}>{d.title}</h3>
                  </div>
                  <p className={`mt-2 text-sm ${t.textSub} leading-relaxed`}>{d.blurb}</p>
                  {d.tools && d.tools.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {d.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          to={tool.href}
                          className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 hover:bg-violet-500/25 transition"
                        >
                          {tool.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Save your hours back. Run prep packs in 90 seconds.
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                Day 10 onwards in this plan tells you to apply to 5 roles a day with tailored cover
                letters. Manually that is 5 hours. With Vantage that is 8 minutes. 10 free packs on
                signup, no card.
              </p>
              <Link
                to="/register?source=playbook-generated"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run prep packs free <ArrowRight className="w-4 h-4" />
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
          </div>
        </section>
      </main>
    </div>
  );
}
