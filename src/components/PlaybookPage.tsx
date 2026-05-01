import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, FileText, Users, Briefcase, Mail, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://vantage-livid.vercel.app';

interface Step {
  day: string;
  title: string;
  duration: string;
  icon: typeof CheckCircle2;
  description: string;
  actions: string[];
}

const STEPS: Step[] = [
  {
    day: 'Day 0',
    title: 'Don\'t apply to anything for 48 hours',
    duration: '48 hours',
    icon: Clock,
    description: 'The first 48 hours after a layoff are emotionally loaded and the CV you put together in that window is going to be worse than the one you write on Tuesday. Use these hours for foundation only.',
    actions: [
      'Confirm severance, COBRA / EI, vesting cliff, return-of-equipment dates',
      'Inform 5 closest contacts privately (no LinkedIn post yet)',
      'Save Slack / Notion / drive content you legitimately have rights to retain',
      'Block 2 hours each day next week for active job search',
    ],
  },
  {
    day: 'Day 1',
    title: 'Run your CV through 5 ATS parsers',
    duration: '60-90 min',
    icon: FileText,
    description: 'Workday, Greenhouse, Lever, Taleo, and iCIMS — these power most enterprise hiring. Each parses PDFs differently. Most parse failures are silent. You only find out after sending 100 applications and getting 2 replies.',
    actions: [
      'Use cv-mirror-web.vercel.app — free, browser-based, no upload',
      'Fix any silent parse failures before applying anywhere',
      'Strip multi-column layouts, icons, tables — single column always',
      'Use standard section names (Summary / Experience / Education / Skills)',
    ],
  },
  {
    day: 'Day 2',
    title: 'Update LinkedIn carefully',
    duration: '30-60 min',
    icon: Users,
    description: 'Turn on "Open to Work" frame. Update headline to read like a target role, not your last title. Write one short post acknowledging the layoff. Layoff posts in 2026 routinely hit 15,000 likes and 700 comments because the algorithm rewards them and people genuinely want to help.',
    actions: [
      'Update headline to target role (e.g. "Senior Product Manager")',
      'Add "Open to Work" frame on profile photo',
      'Write a short layoff post: 1 sentence acknowledging, 1 sentence target role, 1 sentence specific ask',
      'No long career retrospective — save that for week 3',
    ],
  },
  {
    day: 'Day 3',
    title: 'Reach out to your strongest 10 contacts',
    duration: '60 min',
    icon: Mail,
    description: 'Not 100. Ten. The people who would absolutely take your call. Specific ask: "I\'m looking at [type of role]. Three companies on my list are X, Y, Z. Do you know anyone in any of those?" A specific ask gets a specific answer.',
    actions: [
      'List your 10 strongest professional contacts',
      'Send each a personal note with: layoff fact, target role, 3 specific company names',
      'Follow up after 3 working days if no response',
      'Track responses in a sheet (who, when, status)',
    ],
  },
  {
    day: 'Day 4-5',
    title: 'Build the application system',
    duration: '~2 hours',
    icon: Briefcase,
    description: 'Once you start applying, the bottleneck is prep time per application. Manually it\'s about an hour: company research, cover letter, interview Qs, fit check. At 30 applications a week, that\'s your whole weekend. Compress this with tooling.',
    actions: [
      'Bookmark Vantage AI for the prep automation (90 sec / application)',
      'Set up your "boring" CV optimised for ATS parse',
      'Decide on 3-5 cover letter templates by tone (Professional / Warm / Direct / Creative)',
      'Pick a daily applications target (10-15 is sustainable; 30+ burns out)',
    ],
  },
  {
    day: 'Day 6+',
    title: 'Run the system',
    duration: 'ongoing',
    icon: Calendar,
    description: 'Median time to next role for laid-off tech workers in 2026 is 3-6 months. Faster if you compress prep time per application and tighter if you have a strong network. Slower if you spray-and-pray.',
    actions: [
      'Apply 10-15 jobs / day at quality, not 50 / day at panic',
      'Reply to recruiter messages within 4 hours during business hours',
      'Schedule 1 networking conversation per week (former colleague, ex-manager, alum)',
      'Review pipeline weekly: how many applications → screens → interviews → offers',
    ],
  },
];

/**
 * /playbook — week-1 layoff tactical playbook.
 *
 * Distillation of the /laid-off cohort page into a step-by-step weekly
 * checklist. Different audience — searchers who already know they're laid
 * off and want a structured plan, not the 'is this happening' framing.
 *
 * Targets queries: "layoff week 1 plan", "what to do after layoff",
 * "post-layoff job search checklist".
 */
export default function PlaybookPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Playbook', item: `${SITE_URL}/playbook` },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Week-one layoff playbook',
    description: 'A step-by-step plan for the first week after being laid off. Foundation work in the first 48 hours, then ATS parse fix, LinkedIn updates, network activation, and application system setup.',
    totalTime: 'P7D',
    step: STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: `${s.day}: ${s.description}`,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Week-one layoff playbook: a step-by-step tactical plan"
        description="Step-by-step plan for the first week after being laid off. Foundation work in the first 48 hours, then ATS parse fix, LinkedIn updates, network activation, application system setup."
        path="/playbook"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/laid-off" className={`${t.textSub} hover:${t.text}`}>Cohort guide</Link>
            <Link to="/ats" className={`${t.textSub} hover:${t.text}`}>ATS Guide</Link>
            <Link to="/register" className="px-4 py-2 bg-[#4F46E5] text-white rounded-full font-semibold hover:bg-[#3F36D5]">3 free analyses</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-bold tracking-widest uppercase text-[#4F46E5] mb-3">Week-one tactical playbook</p>
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${t.text} leading-[1.05] mb-5`}>
          The first 7 days after a layoff,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">step by step.</span>
        </h1>
        <p className={`text-lg ${t.textSub} max-w-3xl leading-relaxed mb-6`}>
          Median time to next role for tech workers laid off in 2026 is 3-6 months. The gap between fast and slow is mostly about the
          first week. This is what to do, day by day, foundation first.
        </p>
        <p className={`text-sm ${t.textMuted}`}>
          For company-specific advice, see the <Link to="/laid-off" className="text-[#4F46E5] hover:underline">cohort landing page</Link>.
          For the technical CV-format breakdown, see the <Link to="/ats" className="text-[#4F46E5] hover:underline">ATS guide</Link>.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className={`${t.glass} rounded-2xl p-6`}>
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">{step.day}</span>
                    <span className={`text-xs ${t.textMuted}`}>· {step.duration}</span>
                  </div>
                  <h2 className={`text-xl font-bold ${t.text} mt-1 mb-2`}>{step.title}</h2>
                  <p className={`${t.textSub} mb-4`}>{step.description}</p>
                  <ul className="space-y-2">
                    {step.actions.map((a, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className={`text-sm ${t.text}`}>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${t.glass} rounded-2xl p-8 text-center`}>
          <h2 className={`text-2xl font-bold ${t.text} mb-3`}>Ready to start the system?</h2>
          <p className={`${t.textSub} max-w-xl mx-auto mb-6`}>
            Vantage compresses cover letter + interview prep + fit score into ~90 seconds per application. 3 free analyses on signup, no card.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-full font-semibold hover:-translate-y-0.5 transition-all"
          >
            Get 3 free analyses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
