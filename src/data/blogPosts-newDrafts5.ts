// 3 UK-targeted long-tail interview-guide posts -- batch 5, drafted 2026-05-10
// UK fintech + utilities. Lower SEO competition than US tech. Aligned with
// Gio's UK indie-founder authority + the laid-off-Brit ICP.

import type { BlogPost } from './blogPosts';

export const newBlogPosts5: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) MONZO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'monzo-software-engineer-interview-uk-2026',
    title: 'Monzo software engineer interview: the UK fintech 2026 loop',
    description: 'The Monzo software engineer interview in 2026 -- five stages, the IPO-track context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Monzo', 'Software Engineer Interview', 'UK Fintech', 'Distributed Systems', 'Interview Prep', 'London', 'Tech Hiring'],
    excerpt: 'Monzo crossed 11M+ customers in early 2026 and is on an IPO-track timeline. The engineering loop has tightened around microservices reasoning, on-call rigour, and a real opinion on the Cocoa monolith breakup that defined Monzo\'s engineering identity.',
    hook: 'Monzo runs more than 2,800 microservices in production. The engineering interview now tests whether you can reason about that complexity without cheating with hand-wavey enterprise-talk.',
    sections: [
      { type: 'p', text: 'Monzo is profitable, has 11M+ UK customers as of early 2026, and is in late-stage IPO prep. The engineering team is hiring across platform, banking, and AI -- but the bar has tightened. Microservices everywhere, Go-heavy stack, on-call rotations, and a culture that values disagreement out loud. The interview reflects that. Most candidates stumble on the same thing: the systems round expects you to reason about real Monzo-scale traffic without leaning on textbook patterns.' },

      { type: 'h2', text: 'The Monzo engineering process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Monzo, why now. They will probe whether you have used the app and have an opinion on it.',
        'Coding pairing -- 60 minutes. Live Go (or your strongest language). Moderate problem -- not leetcode-hard. They are watching how you think out loud and how you write tests.',
        'System design -- 60 minutes. Real Monzo-shaped scenarios. "Design the payment routing layer for a new card scheme." "Walk me through how a faster payments transfer settles end-to-end." "Design the on-call alerting threshold for the deposits service."',
        'Behavioural / values -- 45-60 minutes. Disagreement, on-call, written communication, and the famous "give me an example of when you were wrong" round.',
        'Onsite or final loop -- 2 rounds: deeper coding or design, plus an exec / VP-level culture round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"You are paged at 03:14 because the deposits service p99 is over 800ms. First three actions?"',
        '"Walk me through how Monzo settles a faster payments transfer at peak load. Where is the contention?"',
        '"Design the AI agent that we would use to triage 50,000 inbound customer chat messages per day. Where do you draw the human-in-the-loop line?"',
        '"You disagree with a senior engineer on whether to ship a banking feature behind a flag or with a shadow rollout. Argue your side for 5 minutes."',
        '"What is wrong with our Monzo app right now? Be specific. We can pull it up."',
        '"Tell me about a production incident where you owned the RCA. What did the postmortem look like?"',
        '"Why Monzo and not Revolut, Starling, or a US fintech?"',
        '"Pick a Monzo product surface. Tell me what the next 6 months of roadmap should be. Defend each call."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is the single biggest thing wrong with how the team you would be joining operates? Take a guess."',
      ] },

      { type: 'h2', text: 'What kills candidates at Monzo specifically' },
      { type: 'ol', items: [
        'No microservices reasoning. Monzo runs 2,800+ services. If your design answer reaches for "build a monolith with three services" you have already lost the room. Be ready to reason about service boundaries, observability, and on-call cost at that scale.',
        'No real opinion on the app. Monzo expects engineers to use the product seriously. "I downloaded it last week" gets flagged. Have an account, use it for current-account banking, hold a calibrated take on the most recent app update.',
        'Underestimating the values round. Monzo runs a strong values-driven culture. "Default to action." "Disagree out loud." "Customer obsession." Be ready to tie a real story to each value -- not generic "I tried hard" answers.',
        'Over-polished STAR stories. Monzo interviewers are direct and read polish as evasion. "I led the project" gets follow-up grilling. "I screwed up the timeline by two weeks because I underestimated the migration cost; here is what I changed" gets respect.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open the Monzo app. Use it on a real banking task. Note three friction points and three things you respect.',
        '15-30 min: Read the most recent two posts on monzo.com/blog/engineering. Write down two opinions you have on each.',
        '30-50 min: System design. Pick one of -- payment routing, faster payments settlement, on-call alerting threshold, AI triage agent. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '50-65 min: Story drill. Three engineering stories tied to Monzo values -- default to action, disagree out loud, customer obsession. 200 words each.',
        '65-75 min: Stack and on-call refresher. Go basics, distributed tracing concepts, p99 vs p50 reasoning, on-call escalation patterns.',
        '75-80 min: Close. One opinion on the IPO-track context, one specific Monzo decision you would change, one question for the hiring manager that proves you read the engineering blog.',
      ] },

      { type: 'h2', text: 'On the IPO context' },
      { type: 'p', text: 'You will probably want to ask about IPO timing. Do, but ask it like an adult. "What does the eng team look like in 6 months under public-company rigour?" lands fine. "When is the IPO and what is my equity worth?" sounds desperate. They are open about the trajectory -- the right register is curious and pragmatic.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Monzo remote in 2026?' },
      { type: 'p', text: 'Hybrid. London HQ presence at least 2 days a week for most engineering roles. Some staff and principal roles open to fully remote within UK. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of London market. Below SF/NYC. Equity is meaningful given IPO-track timing -- typically vests over 4 years.' },
      { type: 'h3', text: 'Will they sponsor a UK visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm specifics at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including UK fintech with shifting bars like Monzo. Free at aimvantage.uk.' },

      { type: 'p', text: 'Monzo hires engineers who can reason about real microservices scale, hold a calibrated opinion on the app, and operate with on-call rigour. Prep the systems angle, the values stories, and a real take on the IPO trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) WISE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'wise-software-engineer-interview-uk-2026',
    title: 'Wise software engineer interview: the listed-fintech 2026 loop',
    description: 'The Wise (formerly TransferWise) software engineer interview in 2026 -- five stages, the listed-company rigour, real questions, four traps, and a 75-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Wise', 'Software Engineer Interview', 'UK Fintech', 'Cross-border Payments', 'Interview Prep', 'London', 'Tech Hiring'],
    excerpt: 'Wise has been LSE-listed since 2021, profitable, and operating at scale across 50+ currencies. The engineering loop now filters for whether you can reason about cross-border payments at production traffic without falling back to fintech buzzwords.',
    hook: 'Wise moves over GBP 100B per year across borders. The engineering bar in 2026 is high but the pattern is consistent: hire for production-traffic reasoning, not fintech vocabulary.',
    sections: [
      { type: 'p', text: 'Wise is publicly listed (LSE: WISE), profitable, and processing GBP 100B+ in cross-border payments per year. The engineering team has been hiring through 2026 across platform, payments, and AI infrastructure -- but selectively. The bar has tightened around production-traffic reasoning. Most candidates underestimate two things: the depth they will need to go on cross-border payments fundamentals, and how seriously Wise takes the values round.' },

      { type: 'h2', text: 'The Wise engineering process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Wise, why now. They will probe whether you have used the product internationally.',
        'Technical screen -- 60 minutes. Live coding (Java is the strong default; Kotlin and Go also accepted). Moderate problem with a payments flavour -- idempotency, retry semantics, partial failure.',
        'System design -- 60 minutes. Real Wise-shaped scenarios. "Design the FX rate engine for 50+ currencies under 200ms p99." "Walk me through how a SWIFT vs SEPA vs faster payments rail comparison should surface to a user." "Design the AML transaction-monitoring pipeline at 10M txns/day."',
        'Behavioural / values -- 45-60 minutes. Customer focus, ownership, written communication. Wise runs the values round seriously -- it is not a tick-box.',
        'Onsite or final loop -- 2 rounds: deeper system design or coding, plus a leadership / cross-functional round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a UK user sends GBP 1,000 to USD. Where does the money actually move and when is the FX locked?"',
        '"Design the FX rate engine. 50 currencies, 200ms p99, daily volume in tens of millions."',
        '"You are paged at 02:30 because cross-border txns are failing into a specific corridor. First three actions?"',
        '"Design the AML transaction-monitoring pipeline at 10M txns per day. Latency budget is 5 seconds. Where do you draw the human-in-the-loop line?"',
        '"What is wrong with our Wise app right now? Be specific. We can pull it up."',
        '"Tell me about a production incident in payments where you owned the RCA. What did the postmortem look like?"',
        '"Why Wise and not Revolut, Klarna, or PayPal?"',
        '"You disagree with a senior engineer on whether to ship a feature behind a flag or as a percentage rollout. Defend your side for 5 minutes."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"Pick a Wise product surface. Tell me three things you would change. Defend each."',
      ] },

      { type: 'h2', text: 'What kills candidates at Wise specifically' },
      { type: 'ol', items: [
        'No cross-border payments domain reasoning. You do not need 5 years in fintech, but you need to be able to reason about FX, settlement, idempotency, and SWIFT vs SEPA vs faster payments at a level that holds up to follow-up grilling. Read the public Wise quarterly report for the corridor breakdown.',
        'Generic AI takes. Wise has shipped specific AI features -- AML triage, customer support automation, fraud detection. "AI is going to change everything" is not an answer. "I would not let AI auto-decline a transaction below confidence X because the false-positive cost on a legitimate corridor is too high" is a calibrated answer.',
        'Underestimating the values round. Customer focus, ownership, courageous behaviour. They will press hard if your stories sound rehearsed. Have specific failure stories where the lesson is concrete.',
        'Missing the listed-company register. Wise is publicly traded. Stories about how you ran 12-person committees do not land. Stories about how you shipped end-to-end as the only owner do.',
      ] },

      { type: 'h2', text: 'The 75-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open the Wise app. Send a small amount to a corridor you are unfamiliar with (or simulate the journey). Note three friction points and three things you respect.',
        '15-30 min: Cross-border fundamentals. FX spread vs interchange, SWIFT vs SEPA vs faster payments, idempotency in payments, dual-currency reconciliation. Two minutes per concept.',
        '30-50 min: System design. Pick one of -- FX rate engine, AML pipeline, retry-and-reconciliation flow. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '50-65 min: Story drill. Three engineering stories tied to Wise values -- customer focus, ownership, courageous behaviour. 200 words each.',
        '65-75 min: Close. One opinion on AI in payments, one specific Wise decision you would change, one question for the hiring manager that proves you read the latest investor update.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Wise remote in 2026?' },
      { type: 'p', text: 'Hybrid. London HQ for most engineering roles, with smaller hubs in Tallinn, Singapore, Austin. Some staff+ roles open to fully remote within EMEA. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of London market. Below SF/NYC. Listed equity is liquid -- vests over 4 years.' },
      { type: 'h3', text: 'Will they sponsor a UK visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm specifics at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role. Useful for listed UK fintech where the JD does not tell you how seriously they take the values round. Free at aimvantage.uk.' },

      { type: 'p', text: 'Wise hires engineers who can reason about cross-border payments at production traffic, hold a real opinion on AI in fintech, and operate with listed-company rigour. Prep the corridor fundamentals, the values stories, and a calibrated take on AML.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) OCTOPUS ENERGY SOFTWARE ENGINEER (KRAKEN PLATFORM)
  // -------------------------------------------------------------------
  {
    slug: 'octopus-energy-kraken-software-engineer-interview-2026',
    title: 'Octopus Energy / Kraken software engineer interview: the climate-tech 2026 loop',
    description: 'The Octopus Energy and Kraken software engineer interview in 2026 -- five stages, the platform-licensing context, real questions, four traps, and a 75-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Octopus Energy', 'Kraken', 'Software Engineer Interview', 'Climate Tech', 'UK Tech Hiring', 'Interview Prep', 'Python'],
    excerpt: 'Octopus Energy now serves 7M+ UK customers and licenses Kraken to 60M+ accounts globally. The engineering loop tests for Python craft, climate-tech mission alignment, and a real opinion on grid-flex tariffs.',
    hook: 'Kraken now bills more energy customers than British Gas. The engineering team has been hiring at speed and the loop filters for one specific thing: whether you can ship Python at scale without trying to introduce 7 design patterns into every PR.',
    sections: [
      { type: 'p', text: 'Octopus Energy is private, profitable, and operating at climate-tech scale. The Kraken platform -- their licensing arm -- now serves 60M+ accounts globally including E.ON Next, Origin Energy, and several US utility partners. The engineering team is hiring across consumer, operations, and Kraken platform. The bar is high but the register is specific: pragmatic Python, end-to-end ownership, and a real connection to the climate mission.' },

      { type: 'h2', text: 'The Octopus / Kraken engineering process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Octopus, the climate-mission filter (this is real, not decoration).',
        'Technical screen -- 60 minutes. Live Python pairing on a moderate problem. They watch how you think out loud, write tests, and how you handle ambiguous requirements.',
        'Take-home or async exercise -- some teams. Roughly 4-6 hours. Usually a small Django or FastAPI service that integrates with a stub external API.',
        'System design -- 60 minutes. Real Octopus-shaped scenarios. "Design the smart-meter ingestion pipeline at 1M reads per minute." "Walk me through how a half-hourly settlement billing run reconciles." "Design the AI agent that triages 100,000 customer chats per day."',
        'Onsite or final loop -- 3 rounds: behavioural, cross-functional, and a leadership round (often a Director or VP).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Why Octopus and not British Gas, EDF, or a SaaS company?"',
        '"Walk me through how a half-hourly settlement billing run reconciles for a customer on the Agile tariff. Where is the contention?"',
        '"Design the smart-meter ingestion pipeline at 1M reads per minute. Sub-1-second p99. Walk me through the architecture."',
        '"You are paged at 03:00 because billing is failing for ~12,000 accounts. First three actions?"',
        '"What is wrong with the Octopus app right now? Be specific. We can pull it up."',
        '"You disagree with a senior engineer on whether to ship a feature using Django ORM or raw SQL for performance. Argue your side for 5 minutes."',
        '"Tell me about a time you simplified something a colleague had over-engineered."',
        '"How would you explain the cost of an Agile tariff to a customer who only sees their bill once a month?"',
        '"Pick an Octopus product surface. Tell me three things you would change. Defend each."',
        '"What is your real opinion on AI in customer support? Where do you draw the line at a regulated utility?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Octopus specifically' },
      { type: 'ol', items: [
        'No real opinion on the climate mission. Octopus is one of the few companies where the mission filter is enforced, not decoration. "I want to work on AI" without a connection to renewables, grid flex, or decarbonisation gets flagged. Be honest if it is genuinely not your driver -- they would rather you self-select out.',
        'Over-engineered code. Octopus engineering culture is pragmatic Python. If your take-home introduces 7 design patterns and a custom DI framework for a 200-line service, you have signalled you are not a culture match. Ship simple, readable, well-tested code.',
        'Underestimating the regulated-utility register. Stories about how you "moved fast and broke things" do not land at Octopus the way they would at a startup. They want engineers who can ship at speed without breaking customer-facing billing.',
        'No reasoning on grid-flex tariffs. Agile, Tracker, Outgoing, Saving Sessions -- you should know roughly what each does. They are not just product names; they shape the engineering work in the consumer team.',
      ] },

      { type: 'h2', text: 'The 75-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open the Octopus app. Look at your tariff (or simulate). Note three things you respect and three you would change.',
        '15-30 min: Tariff drill. Agile, Tracker, Outgoing, Saving Sessions. One sentence each on what they do and why they exist.',
        '30-50 min: System design. Pick one of -- smart-meter ingestion, half-hourly settlement reconciliation, customer chat triage. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '50-65 min: Story drill. Three stories -- end-to-end ownership, simplification, customer focus. 200 words each.',
        '65-75 min: Close. One real climate-mission connection (genuine, not rehearsed), one specific Octopus decision you would change, one question for the hiring manager that proves you have used the product.',
      ] },

      { type: 'h2', text: 'On Kraken vs consumer' },
      { type: 'p', text: 'Kraken (the licensing platform) hires for slightly different things than the consumer Octopus team. Kraken work skews heavier on multi-tenant architecture, internationalisation, and integrating with utility partners. Consumer work skews more toward Django app craft and customer-facing flows. Pick the right register at the recruiter screen.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Octopus remote in 2026?' },
      { type: 'p', text: 'Hybrid. London HQ for most engineering roles. Manchester and Brighton smaller hubs. Some senior roles open to fully remote within UK. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-to-top of London market. Below SF and below the highest-paying UK fintech (Wise, Monzo) but with strong equity in a high-growth private company.' },
      { type: 'h3', text: 'Will they sponsor a UK visa?' },
      { type: 'p', text: 'Selectively for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including mission-driven UK shops like Octopus where the JD undersells how seriously they enforce the mission filter. Free at aimvantage.uk.' },

      { type: 'p', text: 'Octopus hires engineers who can ship pragmatic Python at climate-tech scale, hold a real opinion on grid flex, and operate with regulated-utility rigour. Prep the tariff fundamentals, the system-design slice that matches the team you are interviewing for, and a genuine mission connection.' },
    ],
  },
];
