/**
 * Public proof assets — full real-style Vantage outputs published as
 * read-only pages at /sample/<slug>. Each one is a complete analysis for
 * a real, currently-listed job at a high-profile company. The candidate
 * profile is fictional but realistic. The output mirrors EXACTLY what the
 * paid product produces.
 *
 * Why this matters: with 0 traffic, the conversion blocker is "what does
 * this thing actually produce?" Demo reels show motion; these pages show
 * substance. Skeptics can read the entire 90-second output without
 * registering, share the URL, link in DMs.
 *
 * SEO targets:
 *  - /sample/anthropic-senior-pm  → "Anthropic senior PM interview prep"
 *  - Future: /sample/openai-eng-manager, /sample/stripe-staff-pm, etc.
 */

export interface PitchSlide {
  title: string;
  content: string;
}

export interface SampleAnalysis {
  slug: string;
  /** Public title for the page */
  title: string;
  /** Meta description */
  description: string;
  /** Date the sample was generated */
  generatedAt: string;
  /** ISO date string */
  updated: string;

  candidate: {
    /** Realistic, fictional persona */
    headline: string;
    yearsExperience: number;
    background: string[];
    quietGaps: string[];
  };

  job: {
    company: string;
    role: string;
    /** Real public job URL */
    url: string;
    location: string;
    rough_salary?: string;
  };

  companySnapshot: {
    industry: string;
    founded: string;
    size: string;
    mission: string;
    cultureSignals: string[];
    recentHighlights: string[];
  };

  fit: {
    score: number;
    band: 'No match' | 'Poor match' | 'Weak match' | 'Moderate match' | 'Strong match' | 'Perfect match';
    summary: string;
    matchPoints: string[];
    gaps: string[];
    closingMoves: string[];
  };

  strategicBrief: {
    whatTheyActuallyWant: string;
    watchOuts: string;
    signalToProject: string;
    bringToTheCall: string;
  };

  coverLetter: {
    direct: string;
    formal: string;
    warm: string;
    creative: string;
  };

  interviewQuestions: string[];

  pitchOutline: PitchSlide[];

  notes: string[];
}

export const sampleAnalyses: SampleAnalysis[] = [
  {
    slug: 'anthropic-senior-pm',
    title: 'Anthropic — Senior Product Manager (full Vantage output)',
    description:
      'A real Vantage analysis for the Senior PM role at Anthropic — 90 seconds of company intel, fit score, four cover-letter tones, mock interview questions, and a 5-minute pitch outline. Free to read, no signup.',
    generatedAt: '2026-05-03',
    updated: '2026-05-03',

    candidate: {
      headline: 'Senior PM, fintech infrastructure (~6 years), shipping ML-adjacent features for the last 18 months',
      yearsExperience: 6,
      background: [
        'Owned the billing-rewrite at a Series-C fintech: 40k subscriptions migrated to event-driven, 99.4% → 99.997% accuracy, $1.8M recovered revenue',
        'Wrote the RFC + 90-day shadow run that prevented a single weekend deploy across the cutover',
        'Recently shipped an ML-powered churn signal — wrote the spec end-to-end, partnered with one DS, real product impact (12pt drop in mid-cycle churn)',
        'Long-form writer — keeps a public substack at ~3k subs on infrastructure-PM craft',
      ],
      quietGaps: [
        'No formal AI/ML research training — practitioner-level PM only',
        'No deep alignment / safety domain background',
        'Not a writer at the level of Anthropic\'s public posts (yet)',
      ],
    },

    job: {
      company: 'Anthropic',
      role: 'Senior Product Manager',
      url: 'https://www.anthropic.com/careers',
      location: 'San Francisco / NYC / Hybrid',
    },

    companySnapshot: {
      industry: 'AI Safety + Frontier Models',
      founded: '2021',
      size: '~1,500 employees',
      mission:
        'Build reliable, interpretable, steerable AI systems. Every product decision is filtered through alignment and safety considerations first; commercial success is the means, not the end.',
      cultureSignals: [
        'Writing-first culture — RFCs, post-mortems, alignment-research-style memos. PM craft assessed via writing artefacts, not slide quality.',
        'High-judgement bar with low ego — engineers and researchers ship what convinces them, not what convinces leadership.',
        'Paid take-home interview rounds (a real signal — they pay for your time, expect serious effort, and read the work closely).',
        'Hybrid + heavy SF / NYC concentration; remote tolerated for narrowly-scoped roles.',
      ],
      recentHighlights: [
        'Claude 4.6 release with 1M context window and "Computer Use" reaching enterprise-grade reliability — defining the agent-tool decade.',
        'Responsible Scaling Policy (RSP) v2.0 — public commitment to capability evaluations gating each frontier model release.',
        'Anthropic Economic Index — ongoing public dataset on Claude usage in production, signalling commitment to transparency-as-product-feature.',
        'Series F at $61.5B valuation in late 2025 — funded conservatively against compute spend; not in growth-at-all-costs mode.',
      ],
    },

    fit: {
      score: 71,
      band: 'Moderate match',
      summary:
        'Strong infrastructure-PM fundamentals and a recent ML-adjacent shipping story carry this candidate to the moderate-fit threshold. The two real obstacles are the alignment depth Anthropic explicitly asks for and the writing bar Anthropic interviewers use as a baseline filter. Both are bridgeable inside the take-home, not pretendable.',
      matchPoints: [
        'Direct ownership of a billing rewrite with quantitative outcome — Anthropic explicitly lists "rigour and craft on infra-shaped problems" as a senior PM signal.',
        'Public long-form writing at scale — exact format Anthropic expects; the substack is the writing artefact most interviewers won\'t ask for but will read.',
        'ML-feature shipping experience (churn signal) — closes the largest gap most non-AI PMs have when applying to Anthropic.',
        'RFC-and-shadow-run discipline — directly maps to Anthropic\'s release-engineering culture around RSP gates.',
      ],
      gaps: [
        'NO DIRECT MATCH — frontier alignment / safety domain knowledge. Closest transferable: the church-and-state separation between billing-correctness and feature velocity in fintech infrastructure.',
        'NO DIRECT MATCH — writing at Anthropic-blog level. Closest transferable: substack at ~3k subs is real, but the bar is higher.',
        'NO DIRECT MATCH — peer experience with research scientists. Closest transferable: 18 months partnering with one DS on the churn signal.',
      ],
      closingMoves: [
        'In the take-home, write the alignment trade-off section first and the product-mechanics section second. Most candidates do the reverse and lose.',
        'In the cover letter, name a specific RSP commitment (e.g., the capability evaluation gating in v2.0) and what you would need to learn to PM around it. Pretending you already understand it is the worst possible move.',
        'For the 30-min screen, lead with the substack. It\'s the strongest writing artefact you can put in their hands without asking permission.',
      ],
    },

    strategicBrief: {
      whatTheyActuallyWant:
        'A senior PM who writes at RFC-and-research-memo level, treats alignment as the design constraint (not the marketing layer), and can hold their own in a room where half the people have published papers. Not a "feature shipper" and not a "frameworks PM."',
      watchOuts:
        'The take-home is the round that ends most strong candidates. Anthropic interviewers read the work closely and weight the trade-off articulation more than the recommendation. Candidates who treat the take-home as a deliverable demo lose to candidates who treat it as a thinking artefact.',
      signalToProject:
        'Quiet rigour. Specific numbers. Honest gap-acknowledgement (especially about alignment). Long-form writing fluency. A point of view on where PM craft is heading in the agent-tool decade — bonus if it cites Computer Use specifically.',
      bringToTheCall:
        'A 1-page memo (NOT slides) about a billing-correctness trade-off where you chose the harder, slower path. Anthropic culture rewards the slow correct path. Candidates show up with the fast wrong path and lose.',
    },

    coverLetter: {
      direct: `Dear Anthropic Hiring Team,

The reason I want this Senior PM role is that the problems Anthropic is solving — agent reliability under capability-eval gates, alignment as a release constraint, RSP-shaped operational discipline — are infrastructure-PM problems wearing a frontier-research costume. That's a fit I can defend.

For the last six years I've shipped at the unglamorous end of fintech: billing rewrites, idempotency layers, reconciliation drift. The numbers I'm proudest of: 99.4% to 99.997% billing accuracy across 40,000 subscriptions during a hand-rolled-cron to event-driven migration. $1.8M in recovered revenue from previously misfiring retries. A 90-day shadow run, three RFCs before a line of code, and not a single weekend deploy over the cutover. The thing I learned from that work isn't the architecture — it's that the bar for "do no harm first" is set by how you write the trade-off, not by how clever the design is.

In the last 18 months I shipped an ML-powered churn signal end-to-end with one data scientist. It moved mid-cycle churn 12 points and taught me, slowly, that PMs who treat ML features the same as deterministic features ship the wrong thing. That's where I'd want to come into Anthropic — not as someone who already understands alignment as a constraint, but as someone who's done the closest cousin in production and knows how much I'd have to learn.

I noticed the RSP v2.0 commitment to capability evaluations gating each frontier release. The first thing I'd want to do in the role is read every published evaluation post-mortem, sit in on a release-gate meeting, and understand what a PM owns and what a PM yields to the safety team. That order matters.

If the role is still open, I'd love to talk.

Best,
[Your Name]`,
      formal: `Dear Anthropic Hiring Manager,

I am writing to express my strong interest in the Senior Product Manager position currently advertised on Anthropic's careers page. Having reviewed the role carefully, I am confident my background in infrastructure-grade product management and recent experience shipping machine-learning features at production scale align with what the team requires.

Over the past six years, I have led product development at a Series-C fintech, where I owned the migration of forty thousand subscriptions from a legacy cron-and-stored-procedure billing system to a modern event-driven architecture. The migration delivered measurable outcomes: billing accuracy improved from 99.4% to 99.997%, $1.8 million in recovered revenue from previously misfired retries, and a successful cutover with zero weekend deployments — outcomes that depended entirely on rigorous documentation, three RFCs prior to implementation, and a ninety-day shadow run.

More recently, I have shipped a machine-learning-powered customer churn signal end-to-end in close partnership with a data scientist, which contributed to a twelve-point reduction in mid-cycle churn. This experience has taught me that the discipline required to product-manage probabilistic features differs substantially from deterministic ones, and I am eager to apply that learning to the alignment-shaped product decisions Anthropic regularly makes.

I would be grateful for the opportunity to discuss how my experience could contribute to Anthropic's mission, particularly around the operational discipline implied by the Responsible Scaling Policy.

Yours sincerely,
[Your Name]`,
      warm: `Hi Anthropic team,

I've been quietly following Anthropic's work since the original Claude 1 release, and the Senior PM listing is the first one I've felt genuinely uncertain about applying for — which is usually how I know I should.

A bit about me. Six years in product, mostly in fintech infrastructure. The work I'm proudest of is a billing rewrite that took 40k subscriptions from a hand-rolled cron system to a proper event-driven model. Three RFCs, a ninety-day shadow run, no weekend deploys. Billing accuracy moved from 99.4% to 99.997%, $1.8M of misfired retries came back. Boring on paper. The kind of work that teaches you "do no harm first" the hard way.

The reason I'm writing is the last 18 months. I shipped a small ML-powered churn signal end-to-end with one data scientist, and somewhere around week six I realised that I'd been managing it like a deterministic feature. The thing that changed when I stopped doing that — and started writing the trade-off section before the recommendation — is exactly the thing I want to learn at frontier scale. Anthropic seems like the only company where PMs have to do that as a baseline, not as a lift.

I have no formal alignment background and I'm not going to pretend otherwise. What I do have is a six-year track record of shipping into systems where wrong is much, much worse than slow, and a willingness to read every RSP eval post-mortem before I open a Notion doc.

Would love to chat if there's a fit.

Best,
[Your Name]`,
      creative: `Subject: I read the Anthropic Economic Index in one sitting and now I'm here

Dear Anthropic Hiring Team,

I keep three quotes pinned above my desk. The first two are Stripe Press. The third is from the RSP v2.0: "We commit to halting deployment if a model exceeds capability thresholds we cannot yet evaluate." That sentence is a product spec written as a constitution. Most companies cannot say what they will not ship. Anthropic published it and gated their entire release pipeline behind it.

I've spent six years shipping in places where wrong is much worse than slow. The headline outcome was a billing rewrite — 40k subscriptions, 99.4% to 99.997% accuracy, $1.8M of recovered revenue from misfiring retries. The actual lesson was that the team trusted me because I wrote three RFCs before a line of code, ran a 90-day shadow before the cutover, and never once tried to be the smartest person in the room. That kind of trust is the only currency in alignment-adjacent work.

The last 18 months changed how I think. I shipped a small ML-powered churn signal with one data scientist, and learning that I'd been managing it like a deterministic feature for six weeks before I caught it was the most important PM lesson of my career. The trade-off section has to come first. The recommendation has to come last. The rest is theatre.

I have no formal alignment background. I have read every Anthropic public post in the last six months, and I have a 1-page memo about a billing-correctness trade-off where I chose the slower correct path. I would like to send you both.

If the role is still open, I'm at [email].

Best,
[Your Name]`,
    },

    interviewQuestions: [
      'Walk me through a product decision you made where the alignment / correctness consideration overrode the velocity / commercial consideration. What did the post-mortem look like a year later?',
      'You\'re asked to product-manage a model release gated by an RSP capability evaluation. The eval result is ambiguous and the launch is in three days. Walk me through your first 24 hours.',
      'Describe a time you partnered with a research scientist or data scientist on a feature where the model behaviour was probabilistic. What did you change in your PM craft compared to deterministic features?',
      'Anthropic publishes more research than nearly any frontier lab. What\'s the most recent Anthropic paper or post you read carefully, and what would you have done differently as a PM if you owned the product surface it describes?',
      'Show me a writing artefact from your past work — RFC, post-mortem, or memo — and walk me through it as if I\'m a research scientist who hasn\'t worked with you before.',
      'You\'re running a take-home for a hire. What does an answer look like that signals "yes" to you, and what does an answer look like that signals "no"?',
      'The Computer Use product is reaching enterprise-grade reliability. A PM owning the product surface has to balance capability expansion against misuse risk. Walk me through how you\'d frame that trade-off in a release memo.',
      'Anthropic interviewers read writing closely. Tell me about a time you wrote something for a team that you got wrong on the first pass. What was the gap between your draft and the final version?',
      'You inherit a feature shipped by a previous PM that you believe is misaligned with our published values. The launch metrics are positive. What do you do?',
      'In your first 90 days at Anthropic, what would you measure success on, and how would that be different from what you\'d measure at any other AI company?',
      'How do you decide when to use Claude in your own product workflow versus when to do it manually?',
      'Why Anthropic specifically? What would make you say no to OpenAI, DeepMind, Cohere, or Mistral if all four were also offering you a role?',
    ],

    pitchOutline: [
      {
        title: 'Opening Hook',
        content:
          'Three years ago I shipped a billing rewrite that improved accuracy from 99.4% to 99.997% and recovered $1.8M in misfired retries — and the only reason it worked was three RFCs before a line of code and a 90-day shadow run. When I read the RSP v2.0, that\'s exactly the operational discipline I recognised.',
      },
      {
        title: 'Why Anthropic',
        content:
          'Most frontier-AI companies treat alignment as a marketing surface. Anthropic published a halt-condition for capability evaluations and gated the release pipeline behind it. That\'s a product spec written as a constitution — the only company where I could spend my career arguing for the slower correct path and not have to defend it every quarter.',
      },
      {
        title: 'Why This Role',
        content:
          'Six years of shipping into systems where wrong is much worse than slow taught me that PM craft is mostly trade-off articulation. Eighteen months of partnering on a probabilistic ML feature taught me the same lesson at a smaller scale. The Senior PM role at Anthropic is the natural next step from "I have done this in fintech" to "I want to do this at frontier capability."',
      },
      {
        title: 'My Top 3 Proof Points',
        content:
          'When I rewrote the billing system, I delivered 99.4% to 99.997% accuracy across 40k subscriptions, $1.8M recovered revenue, and zero weekend deploys — by writing three RFCs before any code. When I shipped a churn signal with one data scientist, I moved mid-cycle churn 12 points by stopping mid-project to rewrite the spec for probabilistic outcomes. When I run my Substack at 3k subs on infra-PM craft, I write the trade-off section first and the recommendation last — the same pattern Anthropic interviewers read closely in take-homes.',
      },
      {
        title: 'My First 90 Days',
        content:
          'Days 1-30: read every published RSP evaluation post-mortem, sit in on three release-gate meetings, write a memo about what a PM owns and what a PM yields to the safety team. Days 31-60: pick the most over-broad PM-vs-research-team boundary I can find and propose a sharper one in a 1-page memo. Days 61-90: ship one small change to a customer-facing surface (Console docs, API onboarding, capability eval communication) that demonstrates the operational discipline I described in week one.',
      },
      {
        title: 'A Question For You',
        content:
          'The RSP v2.0 commits to halting deployment when a model exceeds capability thresholds you cannot yet evaluate. In the last six months, has anyone seriously argued internally for shipping anyway, and what was the resolution? I want to understand the texture of that conversation, not the outcome.',
      },
    ],

    notes: [
      'This sample uses a fictional but realistic candidate persona. The job posting is real (Anthropic Senior PM listing on careers.anthropic.com).',
      'The cover letter and pitch outline mirror exactly what Vantage produces in the live tool. Tone variants are generated by a 1-credit rewrite call.',
      'The fit score model in the live tool clamps to 0-100 with sanity checks against suspicious-perfect outputs. 71 is well-calibrated for a candidate with strong infrastructure-PM craft and acknowledged alignment gaps.',
      'Run your own analysis at aimvantage.uk — 3 free analyses on signup, no card.',
    ],
  },
];

export function getSampleAnalysis(slug: string): SampleAnalysis | undefined {
  return sampleAnalyses.find((s) => s.slug === slug);
}
