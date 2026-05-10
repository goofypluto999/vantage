// 3 high-volume interview-guide posts -- batch 12, drafted 2026-05-10
// Tesla, Netflix, Coinbase. Massive search volume + ICP fit.

import type { BlogPost } from './blogPosts';

export const newBlogPosts12: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) TESLA SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'tesla-software-engineer-interview-2026',
    title: 'Tesla software engineer interview: the move-fast 2026 loop',
    description: 'The Tesla software engineer interview in 2026 -- five stages, the FSD-era technical bar, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Tesla', 'Software Engineer Interview', 'FSD', 'Autopilot', 'Real-time Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Tesla\'s SWE bar in 2026 still leans hard on raw systems chops + ship-tempo + a real opinion on the FSD direction. Generic FAANG prep loses to Tesla-specific prep.',
    hook: 'Tesla ships at a tempo that feels reckless from outside and disciplined from inside. The interview filters that signal in or out.',
    sections: [
      { type: 'p', text: 'Tesla (NASDAQ: TSLA) hires across Autopilot / FSD, Optimus, Dojo, manufacturing software, energy, vehicle infotainment, and the Robotaxi platform. The engineering culture is famously direct, ship-fast, and ego-flat. The bar in 2026 is high but specific: raw systems chops, comfort with C++ and CUDA at depth, FSD-era reasoning about real-time perception + planning latency, and a calibrated opinion on the FSD direction. Polish-without-substance fails fast.' },

      { type: 'h2', text: 'The Tesla SWE process -- 5 stages, ~3-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Tesla, why this team. They will probe whether you have a real opinion on the company direction (not "I admire Elon").',
        'Phone screen -- 60 minutes. Hard coding problem (often C++ or CUDA-flavoured for FSD/Dojo roles). Edge cases expected. No autocomplete in interviews.',
        'Onsite -- 4-5 rounds: 2-3x coding (live, often pair-programming), 1x system design, 1x behavioural / leadership.',
        'System design -- emphasis on real-time / safety-critical reasoning. "Design the perception-to-planning data path with sub-100ms p99." "Walk me through how Dojo trains a 70B-parameter FSD model with on-prem distributed compute."',
        'Director or Elon-adjacent round (sometimes). Direct, terse, expect challenge to your every position. State opinions crisply. Do not dodge.',
      ] },
      { type: 'p', text: 'Tesla loops are fast — 3-5 weeks total when everyone moves. They are explicit about wanting to compress timeline.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Code: implement an LRU cache. C++. Thread-safe. Now extend for lock-free using atomics."',
        '"Design the FSD perception-to-planning pipeline at 30Hz with sub-100ms p99 budget."',
        '"You inherit a CUDA kernel that is 40% slower than expected on H100. First three things you investigate?"',
        '"Walk me through how Dojo schedules a multi-week training run on custom silicon. Where is the bottleneck?"',
        '"Tell me about the most ambitious thing you have shipped solo. From idea to production. With dates."',
        '"You disagree with a senior engineer on whether to ship a safety-critical feature behind a flag or as canary on 1% of fleet. Argue your side for 5 minutes."',
        '"What is your real opinion on the FSD direction? Where is Tesla right? Where is Tesla wrong?"',
        '"Pick a Tesla product surface. Tell me three things you would change. Defend each."',
        '"You have one weekend and an exec mandate. Build something the team has been blocked on for 3 months. What do you ship?"',
        '"Why Tesla and not [Waymo / Cruise / Apple Car / Wayve]?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Tesla specifically' },
      { type: 'ol', items: [
        'No real systems depth. Tesla is a hardcore systems shop. If your background is application-layer engineering with no real C++, CUDA, or real-time systems experience, the technical screen will go shallow fast. Be honest with yourself about whether Tesla is the right fit.',
        'Polish-without-substance. Tesla interviewers read polished STAR stories as evasion. Stories with concrete metrics + real failures + ship-fast tempo > polished generic.',
        'Generic AI takes on FSD. "Self-driving is going to change everything" is not an answer. "I would not trust the V13 stack on unprotected lefts at night because the perception confidence on dim oncoming headlights is X% and the failure mode is catastrophic" is calibrated.',
        'Tone-deaf in the founders/director round. Stating opinions crisply wins; hedging loses; sycophancy loses faster. Direct disagreement with confidence is rewarded if you have the engineering depth to back it up.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent Tesla AI blog post + the most recent shareholder letter. Identify three specific opinions you have about FSD / Optimus / Dojo direction.',
        '15-35 min: Stack drill. C++ idioms (RAII, move semantics, lock-free patterns), CUDA kernel optimisation basics (occupancy, memory coalescing), real-time scheduling, distributed training primitives. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- FSD perception-to-planning pipeline, Dojo training-run scheduling, fleet-wide OTA rollout strategy. Write a one-page memo with real-time latency budgets.',
        '55-70 min: Story drill. Three engineering stories where you shipped FAST without losing rigour. 200 words each. Drill out loud.',
        '70-78 min: FSD audit. Use the FSD beta if you have access; or watch 5 publicly-recorded sessions. Identify ONE specific failure mode you can articulate.',
        '78-80 min: Close. One opinion on FSD direction, one specific Tesla decision you would change, one question for the founders/director round.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Tesla remote in 2026?' },
      { type: 'p', text: 'Mostly in-person. Austin, Palo Alto, Reno (Dojo), Berlin major hubs. Some senior+ roles open to remote within US, but rare. Tesla\'s RTO mandate is one of the strictest in big tech.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market. Equity-heavy comp structure means total comp can swing significantly with stock price. Cash competitive with FAANG mid-tier.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ engineering roles. Confirm specifics at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including hardcore systems shops like Tesla. Free at aimvantage.uk.' },

      { type: 'p', text: 'Tesla hires engineers who can ship at hardware-tempo speed without losing rigour, hold a calibrated FSD opinion, and survive the founders round by being direct. Prep the systems depth, the operating-tempo stories, and the FSD register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) NETFLIX SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'netflix-software-engineer-interview-2026',
    title: 'Netflix software engineer interview: the senior-only 2026 loop',
    description: 'The Netflix software engineer interview in 2026 -- five stages, the senior-only hiring bar, the "Keeper Test" framing, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Netflix', 'Software Engineer Interview', 'Senior Engineer', 'Distributed Systems', 'Streaming', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Netflix hires almost exclusively senior+. The loop tests for whether you can operate without management and survive the Keeper Test. Most candidates fail the same trap.',
    hook: 'Netflix doesn\'t hire juniors. The whole interview is calibrated for whether you can operate without a manager.',
    sections: [
      { type: 'p', text: 'Netflix (NASDAQ: NFLX) hires almost exclusively senior+ engineers. The famous Reed Hastings memo / culture deck framing — "we hire only senior people, treat you as adults, and run the Keeper Test quarterly" — is not marketing. It is the operating model. The loop reflects that. Generic FAANG prep loses; Netflix-specific prep that engages with the high-autonomy / high-bar / Keeper-Test framing wins.' },

      { type: 'h2', text: 'The Netflix SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Netflix, why this team. They will probe whether you have read the culture deck and whether you have a real opinion on it.',
        'Hiring manager interview -- 60 minutes. Past work at senior+ scope, autonomy track record, technical leadership without authority.',
        'Technical screen -- 60-90 minutes. Live coding (Java is the strong default; some teams use Go or Python). Hard problem with system trade-offs.',
        'Onsite -- 4 rounds, 60 minutes each: 1x deeper coding, 1x system design (always streaming-shaped), 1x cross-functional, 1x leadership / culture.',
        'Director or VP-level conversation. Always happens. The Keeper Test framing comes up here — "would I fight to keep you in 6 months?". Direct, opinion-driven conversation.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through Netflix\'s streaming architecture for a viewer in [region] watching a 4K show at peak hours."',
        '"Design the recommendation pipeline at 280M global subscribers. Real-time vs batch trade-offs."',
        '"Code: implement a thread-safe consistent hashing ring. Now extend it to handle node failures gracefully."',
        '"You are paged at 03:00 because European playback success rate dropped 15% in 5 minutes. First three actions?"',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"You disagree with a senior engineer on whether to ship a feature behind a flag or as a percentage rollout. Argue your side for 5 minutes."',
        '"Tell me about a time you operated without a manager for an extended period. What did you do?"',
        '"What is your real opinion on the Netflix culture deck? Where is it right? Where is it wrong?"',
        '"Why Netflix and not [Disney+ / HBO Max / Spotify / FAANG]?"',
        '"Tell me about a peer you would NOT pass the Keeper Test on. How would you give them that feedback?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Netflix specifically' },
      { type: 'ol', items: [
        'Junior signal in your stories. Netflix does not hire mid-level. If your stories sound like "I worked under [senior engineer] who told me what to do", you are filtered. Stories must demonstrate INDEPENDENT senior-level decision-making.',
        'Not having read the culture deck. The culture deck framing is structural. Coming in without having read + formed opinions on it is treated as not-doing-the-homework.',
        'Generic STAR stories. Netflix interviewers compare notes against a clear rubric. "I worked well with the team" scores 30/100. "When [senior engineer] retired mid-project, I picked up the architectural review process and rebuilt our incident classification rubric from scratch over 6 weeks" scores 90.',
        'Hedging on the Keeper Test peer question. The "tell me about a peer you would not pass on" is real and has a specific right answer pattern: name a real situation, give honest feedback you actually delivered, and what changed. Hedging signals you cannot do the high-autonomy / high-bar work the company runs on.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-25 min: Read the Netflix culture deck cover to cover. Identify three things you genuinely agree with, two you disagree with. Articulate WHY for each.',
        '25-45 min: Stack drill. Netflix-specific architecture (microservices, Hystrix / resilience patterns, Cassandra usage, EVCache, Mantis stream processing, OpenConnect CDN). Two minutes per concept.',
        '45-65 min: System design. Pick one of -- streaming pipeline at peak, recommendation real-time vs batch, global CDN failover. Write a one-page memo with real Netflix-stack primitives.',
        '65-78 min: Story drill. Three SENIOR-level autonomy stories. 200 words each. Practice in the Netflix register (no "we", concrete metrics, decision under uncertainty).',
        '78-83 min: Keeper Test prep. One real peer-feedback story you have lived. The specific feedback you delivered, how you delivered it, what changed.',
        '83-85 min: Close. One opinion on the culture deck, one specific Netflix product decision you would change, one question for the director / VP round.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Netflix remote in 2026?' },
      { type: 'p', text: 'Hybrid. Los Gatos HQ + LA expansion + smaller Amsterdam, Tokyo, Singapore offices. Most senior engineering roles want 2-3 days in office. Some staff+ roles fully remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of the market by total cash. Famously cash-heavy comp structure (less RSU than FAANG; you get cash equivalent). Very competitive on base salary at L4/L5/L6 equivalents.' },
      { type: 'h3', text: 'Do they hire mid-level engineers?' },
      { type: 'p', text: 'Almost never. The hiring bar is "could you operate as a manager-of-yourself in this role". If your CV reads "L4-equivalent", you will be filtered at the recruiter screen even if technically excellent.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including senior-only shops like Netflix. Free at aimvantage.uk.' },

      { type: 'p', text: 'Netflix hires senior engineers who can operate without management, hold opinions on the culture deck, and survive the Keeper Test framing. Generic prep loses; Netflix-specific prep that engages with the autonomy + Keeper-Test framing wins.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) COINBASE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'coinbase-software-engineer-interview-2026',
    title: 'Coinbase software engineer interview: the post-correction 2026 loop',
    description: 'The Coinbase software engineer interview in 2026 -- five stages, the post-correction efficiency mandate, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Coinbase', 'Software Engineer Interview', 'Crypto', 'Fintech', 'Distributed Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Coinbase rebuilt its engineering team after the 2022-23 correction. The 2026 loop tests for blockchain reasoning at production scale + a real opinion on the regulatory landscape.',
    hook: 'Coinbase rebuilt its engineering team after the 2022-23 correction. The 2026 hiring bar reflects that — they\'re hiring engineers who can ship at lower-headcount + operate in a regulated environment.',
    sections: [
      { type: 'p', text: 'Coinbase (NASDAQ: COIN) is public, has been hiring deliberately since 2024 after the 2022-23 layoff correction, and operates in one of the most heavily regulated tech adjacencies. The engineering team is hiring across exchange (matching engine, custody), Base (the L2 chain), wallet, and the developer-platform team. The bar in 2026: blockchain reasoning at production scale, comfort with regulatory constraints (SEC + global), and a calibrated opinion on the crypto-meets-regulation landscape post-2024.' },

      { type: 'h2', text: 'The Coinbase SWE process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Coinbase, why this team. They will probe blockchain familiarity (you do not need to be a deep on-chain dev unless applying to Base specifically).',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-correction efficiency register.',
        'Coding -- 60 minutes. Live coding (Go is the strong default for backend; TypeScript for frontend). Moderate-to-hard problem.',
        'System design -- 60 minutes. Real Coinbase-shaped scenarios. "Design the matching engine for spot trading at 1M orders/sec." "Walk me through how the wallet handles a chain reorg gracefully." "Design Base\'s sequencer fail-over with sub-second recovery."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Design the matching engine for spot trading at 1M orders/sec, p99 under 5ms."',
        '"Walk me through how the wallet handles a chain reorg. What goes wrong if a user submitted a transaction during the affected blocks?"',
        '"Design Base\'s sequencer fail-over with sub-second recovery. Where is the contention?"',
        '"You disagree with a senior engineer on whether to ship a feature with full SEC disclosure or under the existing exemption. Argue your side for 5 minutes."',
        '"Walk me through the most subtle bug you have hit in a distributed system."',
        '"Pick a Coinbase product surface. Tell me three things you would change."',
        '"You inherit a transaction-monitoring service with 0.4% false-positive rate that\'s costing the team 30 customer-support hours per week. Six month plan?"',
        '"What is your real opinion on the post-2024 US regulatory environment for crypto? Where do you agree with Coinbase\'s position? Where do you not?"',
        '"Tell me about a production incident in payments or financial systems you owned end-to-end. What did the postmortem look like?"',
        '"Why Coinbase and not [Kraken / Binance / a TradFi bank moving into crypto]?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Coinbase specifically' },
      { type: 'ol', items: [
        'No regulatory awareness. Coinbase operates under heavy SEC + global regulator scrutiny. "I just want to ship code" answers signal you don\'t understand the operating constraint. Have a calibrated take on the regulatory environment.',
        'Generic crypto takes. "Crypto is going to change everything" is not an answer. "I think L2s like Base will compress the cost of on-chain transactions enough to enable [specific use case], but the chain-abstraction problem is still unsolved at the wallet UX layer" is calibrated.',
        'Underestimating financial-systems complexity. Coinbase is fundamentally a regulated exchange. If you cannot reason about idempotency, settlement vs authorisation, double-spend prevention, and audit-trail requirements, the system design round goes shallow.',
        'Missing the post-correction register. Coinbase rebuilt its eng team after the 2022-23 layoffs. Stories about how you ran 12-person committees do not land. Stories about how you shipped end-to-end as the only owner do.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent Coinbase blog post on Base + the most recent earnings call summary. Identify three opinions you have on the regulatory landscape and the L2 strategy.',
        '15-35 min: Stack drill. Matching engine architecture, order book data structures, chain-reorg handling, sequencer architecture for L2s, custody key-management primitives. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- matching engine at scale, wallet reorg handling, Base sequencer failover. Write a one-page memo with real Coinbase-stack reasoning.',
        '55-70 min: Story drill. Three engineering stories with concrete metrics. 200 words each. Frame in the post-correction efficiency register.',
        '70-78 min: Regulatory primer. SEC Howey test basics, the post-2024 regulatory framework changes, the Coinbase v SEC outcome, BlackRock + traditional finance entry into crypto. You will not be quizzed; you will be busted if you cannot lean on these.',
        '78-80 min: Close. One opinion on regulation, one specific Coinbase decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Coinbase remote in 2026?' },
      { type: 'p', text: 'Coinbase has been remote-first since 2020. Most engineering roles are fully remote within US. Some staff+ roles open globally. Confirm specifics at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the public crypto space. Mix of cash + RSU + crypto-denominated compensation in some roles. Total comp swings with COIN stock price.' },
      { type: 'h3', text: 'Do you need to be a deep on-chain developer?' },
      { type: 'p', text: 'For Base team and the developer-platform team, yes. For exchange / wallet / infrastructure roles, blockchain familiarity is enough; deep on-chain dev experience is a nice-to-have, not a filter.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-correction crypto shops like Coinbase. Free at aimvantage.uk.' },

      { type: 'p', text: 'Coinbase hires engineers who can ship at lower-headcount, hold a calibrated opinion on the regulatory landscape, and reason about regulated financial systems at production scale. Prep the matching-engine fundamentals, the regulatory context, and the Base / L2 strategy.' },
    ],
  },
];
