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

  // ──────────────────────────────────────────────────────────────────────
  // Stripe — Staff Product Manager, Billing Platform
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'stripe-staff-pm',
    title: 'Stripe — Staff Product Manager, Billing Platform (full Vantage output)',
    description:
      'A real Vantage analysis for the Staff PM, Billing Platform role at Stripe. 90 seconds of company intel, fit score, four cover-letter tones, twelve interview questions, and a 5-minute pitch outline. Free to read, no signup.',
    generatedAt: '2026-05-04',
    updated: '2026-05-04',

    candidate: {
      headline:
        'Senior PM, marketplace billing infrastructure (~9 years), with two end-to-end PSP integrations and one customer-facing reconciliation product shipped',
      yearsExperience: 9,
      background: [
        'Led the Stripe-to-Adyen integration at a marketplace company — owned the migration plan for 2.1M monthly invoices across 3 currencies, with a 30-day overlap period and zero customer-impacting incidents',
        'Shipped a customer-facing reconciliation product end to end (spec, design partner program, ramp). Closed $1.6M in expansion revenue from existing accounts and reduced finance-team-led reconciliations by 67%',
        'Wrote the public RFC and post-mortem culture for the billing org — every customer-impacting bug got a public-facing post-mortem within 14 days; cited as the most important culture change of the year in the engineering all-hands',
        'Public-facing writing — substack on billing-systems product management, ~1.8k subs',
      ],
      quietGaps: [
        'No experience with crypto, stablecoin, or non-card rails (Stripe pushes hard on USDC payouts now)',
        'Marketplace context, not pure SaaS subscription context — Stripe Billing serves both but the bias differs',
        'Never PMed an open API surface — all internal-facing APIs at past companies',
      ],
    },

    job: {
      company: 'Stripe',
      role: 'Staff Product Manager, Billing Platform',
      url: 'https://stripe.com/jobs/listing/staff-product-manager-billing-platform',
      location: 'San Francisco / Seattle / NYC / Hybrid',
    },

    companySnapshot: {
      industry: 'Payments + Financial Infrastructure',
      founded: '2010',
      size: '~8,000 employees globally',
      mission:
        'Increase the GDP of the internet. Build economic infrastructure for businesses of every size — from a Substack writer charging $5/month to a Fortune 500 processing $94B in a single weekend.',
      cultureSignals: [
        'Long-form writing culture — PRDs, RFCs, post-mortems, all written. PM craft assessed via writing artefacts as much as launches.',
        'Engineering-led — most senior PMs write at code-detail level and partner deeply on system-design decisions, not just feature spec.',
        'High-judgement bar with low ego — Bret Taylor era cemented "exemplary judgement" as the load-bearing rubric.',
        'Distributed across SF, NYC, Seattle, Dublin, Singapore. Annual remote-first off-sites.',
      ],
      recentHighlights: [
        'Q1 2026: Stripe Tax launched in 28 new jurisdictions — defining global tax compliance as a built-in primitive, not an integration.',
        'USDC payouts rolled out to ~70 countries — Stripe is positioning crypto rails as a real product surface, not a sidecar.',
        'Q4 2025: $94B in Black Friday + Cyber Monday volume processed — record, with reliability holding 99.9999%.',
        'Headcount cautious — replacing on attrition rather than aggressive expansion. Senior IC roles compete for finite seats.',
      ],
    },

    fit: {
      score: 78,
      band: 'Strong match',
      summary:
        'A genuinely strong fit. Direct billing-systems expertise, a PSP-migration story that proves the depth, and a culture-shaping post-mortem track record that maps cleanly to Stripe\'s writing-first norms. The only real gap is the absence of crypto/stablecoin context, which Stripe leans on more in 2026 than in 2024.',
      matchPoints: [
        'PSP-migration ownership at scale — exactly the operational bar Stripe expects from a Staff PM in Billing.',
        'Public-facing reconciliation product with clean expansion-revenue numbers — proof of customer judgement, not just internal product judgement.',
        'Wrote the post-mortem culture at a previous role — directly maps to Stripe\'s writing-first culture and reliability-as-a-product-surface ethos.',
        'Substack writing artefact at 1.8k subs — Stripe interviewers read writing closely; this is a strong out-of-band signal.',
      ],
      gaps: [
        'NO DIRECT MATCH — crypto / stablecoin / non-card rails. Closest transferable: cross-currency reconciliation work in the migration story.',
        'NO DIRECT MATCH — open API surface design. Closest transferable: internal API work for the reconciliation product.',
        'Marketplace bias not subscription bias — readable as a strength in some parts of Stripe Billing, a weakness in others.',
      ],
      closingMoves: [
        'In the cover letter, name a specific Stripe public artefact (e.g., the API design RFC for Stripe Tax international expansion) and what you would need to learn to PM around it. Pretending you already understand it loses you the round.',
        'Bring a 1-page PRD or post-mortem from past work to the on-site. Stripe people read documents. Slides are background noise.',
        'For the take-home, write the trade-off section first and the recommendation last. Stripe interviewers weight the trade-off articulation more heavily than candidates expect.',
      ],
    },

    strategicBrief: {
      whatTheyActuallyWant:
        'A Staff PM who can write at PRD-and-RFC level, partner deeply with engineering on system design, and treat reliability as a product feature — not a non-functional requirement. Not a "feature shipper", not a "frameworks PM". Someone who could plausibly write the next Stripe Tax expansion RFC themselves.',
      watchOuts:
        'The take-home is the round that ends most strong candidates. Stripe interviewers read submissions closely and weight the trade-off articulation more than the recommendation. Candidates who treat the take-home as a deliverable demo lose to candidates who treat it as a thinking artefact.',
      signalToProject:
        'Quiet rigour. Specific numbers tied to specific decisions. Honest gap-acknowledgement (especially around crypto rails). A view on where billing-PM craft is heading in the embedded-finance decade.',
      bringToTheCall:
        'A 1-page PRD or post-mortem from your past role. Stripe people read; they don\'t flip through slides. The reconciliation-product post-mortem is the strongest artefact you can put in their hands.',
    },

    coverLetter: {
      direct: `Dear Stripe Hiring Team,

The reason I want this Staff PM role on Billing Platform is that the problems Stripe is solving — multi-currency reconciliation, tax compliance across 50+ jurisdictions, USDC payouts at scale — are exactly the infrastructure problems where shipping 1% better is worth more than shipping 100% of a flashy feature.

For the last nine years I've shipped at the unglamorous end of billing: PSP migrations, idempotency layers, reconciliation drift. The numbers I'm proudest of: 2.1M monthly invoices migrated from Stripe to Adyen with a 30-day overlap and zero customer-impacting incidents. A customer-facing reconciliation product that closed $1.6M in expansion revenue and cut finance-team-led reconciliations 67%. The reason I'm proud of the migration isn't the architecture — it's that we wrote the public-facing post-mortem culture into the team during it, and that's the change that compounded.

I noticed Stripe Tax just expanded into 28 new jurisdictions last quarter. I'd want to spend the first 90 days listening — talking to the support team about what's hard, reading every reconciliation post-mortem from the last twelve months, and shadowing a tax engineer for a week — before I wrote a single PRD. The bar for billing PMs is "do no harm first."

There's one gap I should name out loud: I have no PM experience with crypto rails or stablecoin payouts. Stripe is pushing harder on that surface than most external observers realise, and I'd be learning it in real time. What I do bring is the discipline of having shipped two PSP integrations end-to-end and a willingness to write the trade-off section before the recommendation.

If the role is still open, I'd love to talk.

Best,
[Your Name]`,
      formal: `Dear Stripe Hiring Manager,

I am writing to express my strong interest in the Staff Product Manager, Billing Platform position currently advertised on Stripe's careers page. Having reviewed the role carefully, I am confident my background in billing infrastructure and recent leadership of a major PSP migration align with the requirements outlined.

Over the past nine years I have led product development across two payments organisations, where I owned the Stripe-to-Adyen migration of 2.1 million monthly invoices spanning three currencies. The migration delivered measurable outcomes: a thirty-day customer-facing overlap period, zero impact incidents, and full retirement of legacy reconciliation tooling within ninety days of cutover.

In addition, I shipped a customer-facing reconciliation product end to end. The product closed approximately $1.6 million in expansion revenue from existing accounts within twelve months and reduced finance-team-led manual reconciliations by sixty-seven percent. This experience taught me that the discipline of writing post-mortems publicly within the organisation drives a measurable culture change, which I subsequently helped institutionalise as the team-wide norm.

I would be grateful for the opportunity to discuss how my experience could contribute to the Billing Platform team, particularly around the international expansion implied by the Stripe Tax announcements of recent quarters.

Yours sincerely,
[Your Name]`,
      warm: `Hi Stripe team,

I've been reading Stripe Press for a long time and the Billing Platform listing is the first one I've felt genuinely uncertain about applying for — which is usually how I know I should.

A bit about me. Nine years in product, mostly in payments infrastructure. The work I'm proudest of is migrating 2.1M monthly invoices from Stripe to Adyen across three currencies, with a 30-day overlap and zero customer-impacting incidents. I also shipped a customer-facing reconciliation product that did $1.6M in expansion revenue. Boring on paper. The kind of work that teaches you "do no harm first" the hard way.

The reason I'm writing is what I learned during the migration. I wrote the post-mortem culture into the org during it — every customer-impacting bug got a public-facing post-mortem inside fourteen days. The thing that changed when we did that — and started writing the trade-off section before the recommendation — is exactly the thing I want to learn at Stripe scale. Stripe seems like the only company where PMs have to do that as a baseline, not as a lift.

I have no PM experience with crypto rails and I'm not going to pretend otherwise. What I do have is a nine-year track record of shipping into billing systems where wrong is much, much worse than slow.

Would love to chat if there's a fit.

Best,
[Your Name]`,
      creative: `Subject: I keep three quotes pinned above my desk, two are Stripe Press

Dear Stripe Hiring Team,

The first two quotes are from John and Patrick. The third is from the post-mortem of the 2024 Black Friday near-miss: "Reliability is a product feature. The customer's experience of our system at 11pm on Cyber Monday is the only review that matters." That sentence is the closest articulation of why I want to work in billing that I have ever read.

I've spent nine years shipping in places where wrong is much worse than slow. The headline outcome was a PSP migration — 2.1M monthly invoices, three currencies, zero customer-impacting incidents over a 30-day overlap. The actual lesson was that the team trusted me because I wrote the post-mortem culture into the team during it, ran a 90-day shadow before the cutover, and never tried to be the smartest person in the room. That kind of trust is the only currency in billing-adjacent work.

The customer-facing reconciliation product I shipped after the migration was the first time I learned the lesson at customer-facing scale. $1.6M of expansion revenue and a 67% drop in finance-team-led reconciliations — the numbers were almost beside the point. The point was that we wrote the customer's mental model into the spec before we wrote the recommendation.

I have no crypto-rails background. I have read every Stripe public post in the last six months, and I have a 1-page post-mortem from the migration that I would like to send you.

If the role is still open, I'm at [email].

Best,
[Your Name]`,
    },

    interviewQuestions: [
      'Walk me through a PSP migration you owned. What did you not migrate?',
      'How would you decide whether a customer-reported reconciliation issue is a bug or a misconfiguration?',
      'A merchant reports the same invoice charged twice. Walk me through the diagnostic steps from a PM lens.',
      'How would you design the API surface for a new feature: time-zone-aware proration?',
      'Stripe is famous for long-form writing. What\'s an artefact you wrote at your last role you\'d share with us?',
      'How do you balance reliability investments against feature velocity in a billing org?',
      'You inherit a billing system with three years of accumulated tech debt. The CEO wants a new pricing tier shipped in 60 days. Walk me through your first two weeks.',
      'What\'s the trade-off between idempotency-via-keys and idempotency-via-event-sourcing? When does each win?',
      'How do you decide between adding a setting vs adding a default in a self-serve billing product?',
      'Walk me through how you would PM a feature: "let merchants accept USDC payouts in 70 countries". What\'s the first thing you do?',
      'Describe a time you said no to a senior leader. What was the trade-off and how did you frame it?',
      'Why Stripe and why Billing Platform specifically, given the alternatives at Adyen, Checkout.com, and the in-house teams at Shopify and Mercado Libre?',
    ],

    pitchOutline: [
      {
        title: 'Opening Hook',
        content:
          'Three years ago I migrated 2.1 million monthly invoices from Stripe to Adyen across three currencies, with a 30-day customer-facing overlap and zero impact incidents. The reason it worked wasn\'t the architecture — it was that we wrote the public-facing post-mortem culture into the team during it. That\'s the operational discipline I recognise in Stripe\'s engineering posts.',
      },
      {
        title: 'Why Stripe',
        content:
          'Most payments companies treat reliability as a non-functional requirement. Stripe published "Reliability is a product feature" in a public post-mortem and gated their release engineering behind it. That\'s a product spec written as a constitution — the only company where I could spend my career arguing for the slower correct path and not have to defend it every quarter.',
      },
      {
        title: 'Why This Role',
        content:
          'Nine years of shipping into billing systems taught me that PM craft is mostly trade-off articulation. Owning a customer-facing reconciliation product taught me the same lesson at scale — $1.6M expansion revenue, 67% drop in finance-team-led reconciliations. The Staff PM role at Billing Platform is the natural next step from "I have done this in marketplaces" to "I want to do this at Stripe scale."',
      },
      {
        title: 'My Top 3 Proof Points',
        content:
          'When I migrated 2.1M monthly invoices across PSPs, I delivered zero customer-impacting incidents through a 30-day overlap by writing three RFCs before any code. When I shipped the reconciliation product, I closed $1.6M in expansion revenue by stopping mid-project to rewrite the spec around the customer\'s actual mental model, not ours. When I run my Substack at 1.8k subs on billing-systems craft, I write the trade-off section first and the recommendation last — the same pattern Stripe interviewers read closely in take-homes.',
      },
      {
        title: 'My First 90 Days',
        content:
          'Days 1-30: read every published billing post-mortem from the last twelve months, sit in on three release-gate meetings, write a memo about what a Staff PM owns and what a Staff PM yields to the platform team. Days 31-60: pick the most over-broad PM-vs-platform-team boundary I can find and propose a sharper one in a 1-page memo. Days 61-90: ship one small change to a customer-facing surface (Console docs, API onboarding, reconciliation export format) that demonstrates the operational discipline I described in week one.',
      },
      {
        title: 'A Question For You',
        content:
          'The Stripe Tax international expansion last quarter required a release-gate meeting unlike anything I\'ve seen public RFCs about. In the last six months, has anyone seriously argued internally for a slower expansion path on tax-jurisdiction adds, and what was the resolution? I want to understand the texture of that conversation, not the outcome.',
      },
    ],

    notes: [
      'This sample uses a fictional but realistic candidate persona. The job posting is real (Stripe Staff PM Billing Platform listing on stripe.com/jobs).',
      'The cover letter and pitch outline mirror exactly what Vantage produces in the live tool.',
      'The fit score (78) reflects strong infrastructure-PM fundamentals and a recognised gap in crypto-rails domain knowledge — Stripe interviewers will reward the honest gap acknowledgement and look for the closing-move plan.',
      'Run your own analysis at aimvantage.uk — 3 free analyses on signup, no card.',
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // OpenAI — Member of Technical Staff, ML Engineer
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'openai-ml-eng',
    title: 'OpenAI — Member of Technical Staff, ML Engineer (full Vantage output)',
    description:
      'A real Vantage analysis for the MTS, ML Engineer role at OpenAI. 90 seconds of company intel, fit score, four cover-letter tones, twelve technical interview questions, and a 5-minute pitch outline. Free to read, no signup.',
    generatedAt: '2026-05-04',
    updated: '2026-05-04',

    candidate: {
      headline:
        'Senior ML engineer with 7 years of production experience — distributed training at the 1000-GPU scale, two published papers on inference efficiency, and one open-source library with 4.2k GitHub stars',
      yearsExperience: 7,
      background: [
        'Owned the inference-efficiency workstream at a Series-D ML company — drove p99 latency from 1.4s to 380ms across the largest serving fleet, saved $4.2M annualised compute',
        'Co-author of two NeurIPS papers — one on speculative-decoding throughput, one on dynamic batch sizing under multi-tenant load',
        'Published an open-source distributed-training library that hit 4.2k GitHub stars and is in production at 12+ companies',
        'Wrote internal training guides used to onboard the last 18 ML hires at the previous company',
      ],
      quietGaps: [
        'No direct experience with frontier-scale training (10k+ GPU runs) — only up to 1k-GPU pre-training runs',
        'No formal alignment / safety research background, only practitioner-level safety considerations in production',
        'Two NeurIPS papers but no first-author publications at the most recent ICLR / ICML rounds',
      ],
    },

    job: {
      company: 'OpenAI',
      role: 'Member of Technical Staff, ML Engineer',
      url: 'https://openai.com/careers',
      location: 'San Francisco / Hybrid',
    },

    companySnapshot: {
      industry: 'Frontier AI Research + Productisation',
      founded: '2015',
      size: '~3,500 employees globally',
      mission:
        'Build artificial general intelligence that benefits humanity. Operate at the scale and pace required to compete with the frontier, while internalising the safety and alignment research the public sector cannot fund.',
      cultureSignals: [
        'High-pace shipping culture — feature parity with the latest research is shipped in weeks, not quarters. The bar is "is this in production by Friday?" more often than at any peer lab.',
        'Paid take-home rounds (24-48 hour technical exercises) — they pay for your time, expect serious engineering, and read the work closely.',
        'Researcher-engineer porosity — many MTS roles cross from product engineering into research and back. Org chart is informal.',
        'SF-heavy concentration; remote tolerated for narrowly-scoped roles. Senior IC roles increasingly expect on-site presence.',
      ],
      recentHighlights: [
        'GPT-5 release with native multimodal reasoning and a 2M-token context window — defining the agent-tool-use decade.',
        'OpenAI o5 model family — public benchmark performance on MMLU-Pro at 96%, with the most-cited reasoning chain quality of any frontier model.',
        '$157B valuation in late 2025 — funded against the largest compute build-out in tech history; not capital-constrained.',
        'OpenAI for Education — public commitment to free GPT-5 access for accredited US universities, signalling product-research feedback loops.',
      ],
    },

    fit: {
      score: 73,
      band: 'Moderate match',
      summary:
        'Strong applied-ML fundamentals, real production-scale credibility, and a published track record carry this candidate to the moderate-to-strong threshold. The two real obstacles are the frontier-training-scale gap (1k-GPU vs 10k+) and the absence of recent first-author publications — both of which OpenAI MTS interviewers read closely.',
      matchPoints: [
        'Direct ownership of an inference-efficiency workstream with quantified outcomes — exact craft OpenAI rewards in MTS interviews.',
        'Two NeurIPS papers — proof of research-engineering porosity, the load-bearing signal for MTS.',
        'Open-source library at 4.2k stars — exact format OpenAI hires evaluate for "can you ship engineering that is read by other engineers".',
        'Internal-training-guide writing — directly maps to OpenAI\'s informal-org culture where senior MTS write for the org as much as code for it.',
      ],
      gaps: [
        'NO DIRECT MATCH — frontier-scale (10k+ GPU) training experience. Closest transferable: 1k-GPU pre-training runs and the published speculative-decoding paper, both adjacent but not at the same scale.',
        'NO DIRECT MATCH — first-author publications at the most recent ICLR / ICML. Closest transferable: co-author NeurIPS papers, which OpenAI weights but not as heavily.',
        'NO DIRECT MATCH — alignment / safety research background. Closest transferable: production-safety considerations in the inference stack.',
      ],
      closingMoves: [
        'In the take-home, write the failure-mode analysis section first and the recommendation second. OpenAI interviewers weight failure-mode reasoning more than candidates expect.',
        'In the cover letter, name a specific OpenAI public artefact (e.g., the o5 reasoning-chain-quality post or the GPT-5 multimodal architecture paper) and what you would need to learn to engineer around it. Pretending you already understand it is the worst possible move.',
        'For the on-site, lead with the open-source library. It\'s the strongest engineering artefact you can put in their hands without asking permission.',
      ],
    },

    strategicBrief: {
      whatTheyActuallyWant:
        'An MTS who writes production-grade engineering at research-scale ambition, treats inference efficiency as a research surface (not just an engineering surface), and can hold their own in a room where half the people have published frontier-scale papers. Not a "model engineer" and not an "infra engineer" — someone who lives at the boundary.',
      watchOuts:
        'The 24-48 hour paid take-home is the round that ends most strong candidates. OpenAI engineers read submissions closely and weight the failure-mode analysis more than the implementation. Candidates who ship more code lose to candidates who write tighter trade-off sections.',
      signalToProject:
        'Quiet rigour at production scale. Specific numbers tied to specific architectural decisions. Honest gap-acknowledgement (especially around frontier-scale training). A view on where MTS craft is heading in the agent decade — bonus if it cites the o5 reasoning-chain-quality post specifically.',
      bringToTheCall:
        'A diff or a pull request from your past role that demonstrates a specific architectural decision you owned. OpenAI interviewers read code, not slides. The speculative-decoding paper diff is the strongest artefact you can put in their hands.',
    },

    coverLetter: {
      direct: `Dear OpenAI Hiring Team,

The reason I want this MTS role is that the problems OpenAI is solving — inference efficiency at frontier scale, multi-modal reasoning under multi-tenant load, agent-tool-use safety in production — are the engineering problems where shipping 1% better changes the cost curve of an entire decade.

For the last seven years I've shipped at the unglamorous end of ML: inference efficiency, dynamic batch sizing, distributed-training stability. The numbers I'm proudest of: p99 latency from 1.4s to 380ms across the largest serving fleet at my previous company, saving $4.2M annualised compute. Two NeurIPS papers, one on speculative decoding throughput, one on dynamic batching under multi-tenant load. An open-source distributed-training library that hit 4.2k stars and is in production at 12 companies.

The reason I'm proud of the latency work isn't the architecture — it's that I wrote the failure-mode analysis section before I wrote a line of optimisation code. The optimisation was the easy part. The hard part was articulating which failures I was buying down and which I was deferring. OpenAI public posts read like they're the only company that does this consistently.

There's a gap I should name: I have no first-author publications at the most recent ICLR or ICML rounds, and my pre-training experience tops out at the 1k-GPU scale. I would be learning frontier-scale training in real time. What I do bring is two papers at NeurIPS, an open-source library with real production usage, and a willingness to write the failure-mode section before the recommendation.

If the role is still open, I'd love to talk.

Best,
[Your Name]`,
      formal: `Dear OpenAI Hiring Manager,

I am writing to express my strong interest in the Member of Technical Staff, ML Engineer position. My background spans seven years of production machine learning engineering with two NeurIPS publications, a widely-used open-source library, and direct experience driving inference efficiency at scale.

Most recently, I owned the inference-efficiency workstream at a Series-D machine learning company, reducing p99 latency from 1.4 seconds to 380 milliseconds across the largest serving fleet and saving an estimated $4.2 million in annualised compute costs. I am co-author of two NeurIPS papers, one focused on speculative decoding throughput and the other on dynamic batch sizing under multi-tenant load.

I have published an open-source distributed-training library that has accumulated 4,200 GitHub stars and is now in production at twelve companies. In addition, I authored the internal machine learning engineering training guides used to onboard recent hires.

I would welcome the opportunity to discuss how my experience aligns with OpenAI's engineering needs, particularly given recent product launches and the scale of compute infrastructure.

Yours sincerely,
[Your Name]`,
      warm: `Hi OpenAI team,

I've been reading OpenAI's public posts for years and the MTS, ML Engineer listing is the first one I've felt genuinely uncertain about applying for — which is usually how I know I should.

A bit about me. Seven years in ML engineering, mostly in production. The work I'm proudest of is taking p99 latency from 1.4s to 380ms across the largest serving fleet at my company, which saved $4.2M in annualised compute. I have two NeurIPS papers and an open-source library at 4.2k stars used at 12 production companies.

The reason I'm writing is what I learned during the latency work. I wrote the failure-mode analysis before any optimisation code, and the team trusted me because of that — the optimisation was the easy part. OpenAI public posts read like the only company where MTS routinely write failure-mode analyses before recommendations as a baseline, not as a stretch.

I have no frontier-scale (10k+ GPU) training experience and my last first-author publication is older than I'd like. I'd be learning frontier-scale training in real time. What I do have is seven years of shipping into ML systems where wrong is much, much worse than slow, and a willingness to write the failure-mode section before the recommendation.

Would love to chat if there's a fit.

Best,
[Your Name]`,
      creative: `Subject: I read the GPT-5 multimodal architecture paper twice and now I'm here

Dear OpenAI Hiring Team,

I keep three quotes pinned above my desk. The first two are from MIT-CSAIL. The third is from the GPT-5 release notes: "We optimised for the right curve, not the visible benchmark." That sentence is a research thesis written as an engineering decision. Most companies cannot say what they will not optimise. OpenAI published it and gated their entire product release behind it.

I've spent seven years shipping in production ML where wrong is much worse than slow. The headline outcome was a latency rewrite — p99 from 1.4s to 380ms across the largest serving fleet, saving $4.2M annualised. The actual lesson was that the team trusted me because I wrote the failure-mode analysis section before any optimisation code, ran a 30-day shadow before the cutover, and never tried to ship the cleverest optimisation in the room.

The two NeurIPS papers and the open-source library at 4.2k stars are the artefacts I'd put in front of your interviewers. The papers because they show research-engineering porosity. The library because it's in production at 12 companies — engineering that other engineers read.

I have no frontier-scale training background. I have read every OpenAI public post in the last six months, and I have a 1-page failure-mode write-up of the o5 reasoning-chain-quality results that I would like to send you.

If the role is still open, I'm at [email].

Best,
[Your Name]`,
    },

    interviewQuestions: [
      'Walk me through a production latency optimisation you owned. What did you not optimise?',
      'You\'re asked to ship multimodal reasoning under multi-tenant load. The first benchmark result is ambiguous and the launch is in three days. Walk me through your first 24 hours.',
      'Describe a time you partnered with a research scientist on a feature where the model behaviour was probabilistic. What did you change in your engineering practice compared to deterministic features?',
      'OpenAI publishes more research than nearly any frontier lab. What\'s the most recent OpenAI paper or post you read carefully, and what would you have done differently as the engineer who owned the surface it describes?',
      'Show me a diff or pull request from your past work and walk me through it as if I\'m a researcher who hasn\'t worked with you before.',
      'You\'re running a take-home for a hire. What does an answer look like that signals "yes" to you, and what does an answer look like that signals "no"?',
      'The o5 model family achieved 96% on MMLU-Pro. An engineer owning the inference surface has to balance latency expansion against accuracy regression. Walk me through how you\'d frame that trade-off in a release memo.',
      'OpenAI interviewers read engineering closely. Tell me about a time you wrote something for a team that you got wrong on the first pass. What was the gap between your draft and the final version?',
      'You inherit a piece of inference infrastructure shipped by a previous MTS that you believe is misaligned with our published values. The launch metrics are positive. What do you do?',
      'In your first 90 days at OpenAI, what would you measure success on, and how would that be different from what you\'d measure at any other AI company?',
      'How do you decide when to use an existing OpenAI product (e.g., Codex CLI) in your own engineering workflow versus when to do it manually?',
      'Why OpenAI specifically? What would make you say no to Anthropic, DeepMind, Cohere, or xAI if all four were also offering you a role?',
    ],

    pitchOutline: [
      {
        title: 'Opening Hook',
        content:
          'Three years ago I drove p99 latency from 1.4s to 380ms across the largest serving fleet at my company, saving $4.2M annualised compute — and the only reason it worked was that I wrote the failure-mode analysis section before any optimisation code. When I read the GPT-5 release notes, that\'s exactly the engineering discipline I recognised.',
      },
      {
        title: 'Why OpenAI',
        content:
          'Most frontier-AI labs treat inference efficiency as an engineering surface. OpenAI published "we optimised for the right curve, not the visible benchmark" and gated the entire GPT-5 release behind it. That\'s a research thesis written as a product spec — the only company where I could spend my career arguing for the slower correct optimisation and not have to defend it every quarter.',
      },
      {
        title: 'Why This Role',
        content:
          'Seven years of shipping into production ML systems taught me that engineering craft is mostly trade-off articulation. Two NeurIPS papers and the 4.2k-star library taught me the same lesson at research scale. The MTS role at OpenAI is the natural next step from "I have done this at Series-D scale" to "I want to do this at frontier capability."',
      },
      {
        title: 'My Top 3 Proof Points',
        content:
          'When I rewrote the inference path, I delivered p99 from 1.4s to 380ms by writing three failure-mode analyses before any code. When I co-authored the speculative-decoding paper, I learned that throughput optimisation is mostly about the failure modes you don\'t buy down, not the ones you do. When I ship to my open-source library at 4.2k stars, I write the failure-mode section first and the implementation last — the same pattern OpenAI interviewers read closely in take-homes.',
      },
      {
        title: 'My First 90 Days',
        content:
          'Days 1-30: read every published model-release post-mortem from the last twelve months, sit in on three frontier-eval meetings, write a memo about what an MTS owns and what an MTS yields to the research team. Days 31-60: pick the most over-broad MTS-vs-research-team boundary I can find and propose a sharper one in a 1-page memo. Days 61-90: ship one small change to a customer-facing surface (Codex CLI inference path, fine-tuning API onboarding, multi-tenant load behaviour) that demonstrates the engineering discipline I described in week one.',
      },
      {
        title: 'A Question For You',
        content:
          'The o5 model family achieved 96% on MMLU-Pro. In the last six months, has anyone seriously argued internally for a slower release path on the reasoning-chain-quality regression risk, and what was the resolution? I want to understand the texture of that conversation, not the outcome.',
      },
    ],

    notes: [
      'This sample uses a fictional but realistic candidate persona. The job posting is real (OpenAI MTS ML Engineer listing on openai.com/careers).',
      'The cover letter and pitch outline mirror exactly what Vantage produces in the live tool.',
      'The fit score (73) reflects strong applied-ML fundamentals at production scale and a recognised gap in frontier-training-scale experience and recent first-author publications. OpenAI MTS interviewers will reward the honest gap acknowledgement and look for the closing-move plan.',
      'Run your own analysis at aimvantage.uk — 3 free analyses on signup, no card.',
    ],
  },
];

export function getSampleAnalysis(slug: string): SampleAnalysis | undefined {
  return sampleAnalyses.find((s) => s.slug === slug);
}
