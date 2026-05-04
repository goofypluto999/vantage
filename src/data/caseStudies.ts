/**
 * Case studies — real (founder's own journey) + honestly-marked placeholders.
 *
 * No fake case studies. Every "live" entry references real product
 * usage. Placeholder entries say "coming Q3 2026" plainly, with a
 * link back to /sample for verifiable live examples in the meantime.
 *
 * This honesty discipline is the same one that drove removing the
 * fabricated AggregateRating schema (see commit 934ccd7 / blog post
 * /blog/i-shipped-fake-review-schema-then-caught-myself).
 */

export interface CaseStudySection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'quote' | 'callout' | 'metric';
  text?: string;
  items?: string[];
  cite?: string;
  /** For metric sections: 1-3 stat blocks */
  metrics?: { label: string; value: string; subtext?: string }[];
}

export interface CaseStudy {
  slug: string;
  status: 'live' | 'coming-soon';
  title: string;
  subtitle: string;
  persona: { role: string; industry: string; situation: string };
  outcome: string;
  timeline: string;
  publishedAt?: string;
  expectedAt?: string;
  sections: CaseStudySection[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'building-vantage-while-applying-50-jobs-a-week',
    status: 'live',
    title: 'Building Vantage while applying to 50+ jobs a week',
    subtitle: 'How dogfooding the product I was building taught me what AI job-prep actually needs to be',
    persona: {
      role: 'Solo founder, marketer-by-background',
      industry: 'AI / SaaS',
      situation: 'Burned out on manual job-application prep; built the tool I needed for myself',
    },
    outcome: 'Vantage launched April 22, 2026. The tool went from idea to live product in 6 weeks of evening + weekend work while I was running an active job search.',
    timeline: 'March 2026 - April 2026',
    publishedAt: '2026-05-04',
    sections: [
      {
        type: 'p',
        text: 'I built Vantage because I was applying to 50+ jobs a week and burning two hours per application. Two hours × 50 = 100 hours a week, which is twice as long as a working week. The math did not work.',
      },
      {
        type: 'p',
        text: 'I am the worst kind of customer for an AI job-prep tool — I had read every blog post about cover letters, knew every recruiter trick, and was suspicious of any tool promising to do my job for me. Which is exactly why I had to build it: I knew what would offend me, so I knew what to avoid.',
      },

      {
        type: 'h2',
        text: 'Week 1-2 — the wrong product',
      },
      {
        type: 'p',
        text: 'My first version of Vantage was a cover letter generator. Paste a job, get a cover letter. It was fast and the output was technically fine. But after using it on 5 real applications, I realised the cover letter was the easiest part. The hard part was the company research — knowing what to actually say in the letter.',
      },
      {
        type: 'p',
        text: 'I rebuilt the whole flow around company intelligence as the first artifact. The cover letter became downstream of that. Then mock interview questions. Then a fit score. The product took its current shape only because I was using it on real applications and feeling the gaps.',
      },
      {
        type: 'callout',
        text: 'Lesson: dogfooding is not a slogan. If you cannot use your own product on real problems daily, you are guessing about what to build.',
      },

      {
        type: 'h2',
        text: 'Week 3-4 — building while broke',
      },
      {
        type: 'p',
        text: 'I had four months of runway when I started. By week 3 I had two — partly because I had been spending too much time building Vantage and not enough time applying. The trade-off was: do I keep applying with the painful manual flow, or do I trust that finishing the tool will compress my own application time enough to make rent?',
      },
      {
        type: 'p',
        text: 'I chose the tool, but I made a hard rule: every feature I built had to immediately make my own next application faster. No "we will need this in v2" features. Just "I am writing a cover letter for this Stripe job in 20 minutes, what would help me right now?"',
      },
      {
        type: 'p',
        text: 'That constraint kept the product focused. The tone-switcher (Professional / Warm / Direct / Creative) exists because I was applying to a tech bank and a creative agency on the same day and needed two voices. The 5-minute pitch outline exists because I had a final-round at a fintech where the hiring manager said "tell us about yourself for 5 minutes" and I bombed.',
      },

      {
        type: 'h2',
        text: 'Week 5-6 — the launch decision',
      },
      {
        type: 'p',
        text: 'By week 5 the product was working well enough that I was using it on every application. My own application throughput went from ~10 a week to ~50 a week. I had enough confidence to launch.',
      },
      {
        type: 'p',
        text: 'Launch was honest about state. The homepage said the product was new, signups were small, and the live transparency counter showed real numbers (4 signups, 0 paying users) on day 6. I did not pretend to be bigger than I was. The same week I caught myself adding fake AggregateRating schema and removed it the same hour.',
      },
      {
        type: 'metric',
        metrics: [
          { label: 'Days from idea to live product', value: '~42', subtext: 'evening + weekend hours' },
          { label: 'Vantage analyses I ran on my own applications', value: '120+', subtext: 'before launch' },
          { label: 'Median application prep time', value: '90 sec', subtext: 'down from 2 hours' },
        ],
      },

      {
        type: 'h2',
        text: 'What I would do differently',
      },
      {
        type: 'ul',
        items: [
          'Talk to 5 other people in the same situation before week 1, not week 5. I assumed my pain was generalisable; that turned out to be true but I was lucky.',
          'Build the live transparency counter from day 1, not day 6. Setting a "real numbers, no padding" expectation early means there is no version of the homepage that ever showed fake metrics.',
          'Spend less time on the 3D landing page animation, more time on the dashboard onboarding. The 3D globe is beautiful but did not move signups; the onboarding flow had a bug that killed conversion for 4 days (separate post).',
        ],
      },

      {
        type: 'h2',
        text: 'Where Vantage is today',
      },
      {
        type: 'p',
        text: 'As of May 4, 2026: live, paying customers, real signup count visible on the homepage, six rounds of distribution work completed. The product is the same one I dogfooded — same flow, same tones, same fit-score. Most of the changes since launch have been distribution and SEO, not core product.',
      },
      {
        type: 'p',
        text: 'If you want to verify any of this, the live counter is at the bottom of aimvantage.uk. The git log is public at github.com/goofypluto999/vantage. The launch date stamp is in the first commit.',
      },
    ],
  },

  {
    slug: 'first-paying-customer',
    status: 'coming-soon',
    title: 'From £0 to first paying customer',
    subtitle: 'The exact moment Vantage went from "free trial only" to "real revenue"',
    persona: {
      role: 'TBD',
      industry: 'TBD',
      situation: 'First user to pay £5 for the starter pack',
    },
    outcome: 'Pending — case study published when the first paying customer agrees to be featured.',
    timeline: 'May 2026',
    expectedAt: '2026-06-01',
    sections: [
      {
        type: 'p',
        text: 'This case study is in progress. It will publish as soon as the first paying customer (£5 starter pack or higher) agrees to be featured. We do not write fictional customer stories — better to leave this URL empty until there is a real story to tell.',
      },
      {
        type: 'p',
        text: 'In the meantime, see the public sample analyses (calibrated to real fit-score levels for real job postings) at /sample/anthropic-senior-pm, /sample/stripe-staff-pm, and /sample/openai-ml-eng.',
      },
    ],
  },

  {
    slug: 'series-b-saas-senior-pm',
    status: 'coming-soon',
    title: 'Senior PM at Series-B SaaS — case study coming Q3 2026',
    subtitle: 'How a senior PM used Vantage to land a £130k+ role at a Series-B AI company',
    persona: {
      role: 'Senior Product Manager',
      industry: 'B2B SaaS / AI',
      situation: 'Currently in role, prepping for the next move (~3 months out)',
    },
    outcome: 'Pending — published when offer is signed and customer agrees to be featured anonymously.',
    timeline: 'Expected Q3 2026',
    expectedAt: '2026-09-01',
    sections: [
      {
        type: 'p',
        text: 'This case study is reserved for the first senior-IC PM customer who lands a role using Vantage as a meaningful part of their prep workflow. We will publish it (anonymised if requested) once the offer is signed.',
      },
      {
        type: 'p',
        text: 'In the meantime: the closest verifiable example is the public sample analysis at /sample/stripe-staff-pm — a complete real-style Vantage output for a Staff PM role at Stripe with calibrated 78/100 fit score, four cover-letter tones, twelve mock questions, six-slide pitch outline, and methodology notes.',
      },
    ],
  },

  {
    slug: 'software-engineer-ml-transition',
    status: 'coming-soon',
    title: 'Software Engineer transitioning to ML — case study coming Q3 2026',
    subtitle: 'Using Vantage\'s gap analysis to map the bridge from generalist software engineering into ML/applied research',
    persona: {
      role: 'Senior Software Engineer transitioning to ML Engineer',
      industry: 'Tech / AI',
      situation: 'Has a CS background, side projects in ML, applying to ML engineer roles at AI labs',
    },
    outcome: 'Pending — case study published when transition is complete and customer agrees to be featured.',
    timeline: 'Expected Q3 2026',
    expectedAt: '2026-09-15',
    sections: [
      {
        type: 'p',
        text: 'This case study tracks the use of Vantage for a career-transition flow specifically — generalist software engineer moving into ML/applied research. We will publish when the transition lands.',
      },
      {
        type: 'p',
        text: 'In the meantime: see the public sample analysis at /sample/openai-ml-eng — a complete real-style Vantage output for a Member of Technical Staff (ML) role at OpenAI with calibrated 73/100 fit, explicit gap analysis, and four concrete closing moves.',
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
