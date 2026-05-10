// 3 finance/quant interview-guide posts -- batch 15
// Goldman Sachs Engineering, Jane Street, Bloomberg. Distinct verticals
// with massive search volume + laid-off-FAANG-into-quant pivot pattern.

import type { BlogPost } from './blogPosts';

export const newBlogPosts15: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) GOLDMAN SACHS ENGINEERING
  // -------------------------------------------------------------------
  {
    slug: 'goldman-sachs-engineering-interview-2026',
    title: 'Goldman Sachs Engineering interview: the post-Marquee + GS Bank 2026 loop',
    description: 'The Goldman Sachs engineering interview in 2026 -- five stages, the SLANG / Marcus / Marquee context, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Goldman Sachs', 'Engineering Interview', 'Finance', 'Quant', 'SLANG', 'Marquee', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Goldman Sachs has 12,000+ engineers across SLANG (their proprietary language), the trading platform, and Marquee. The 2026 loop tests for finance-systems depth + GS-cultural register.',
    hook: 'Goldman has more engineers than most pure-tech companies. The 2026 interview filters for whether you can navigate the SLANG / proprietary-stack heritage + bank-engineering register most candidates underestimate.',
    sections: [
      { type: 'p', text: 'Goldman Sachs (NYSE: GS) has 12,000+ engineers globally — more than most pure-tech companies — across the trading platform (where SLANG, their proprietary language, dominates), Marquee (their client-facing API platform built on more modern stack), the Goldman Sachs Bank consumer division, and the post-Apple Card transition. The 2026 hiring bar is high but specific: comfort with proprietary-stack idioms (SLANG, SecDB), real-time financial systems, regulatory awareness (Dodd-Frank, MiFID II), and the GS-cultural register (formal, hierarchical, performance-driven).' },

      { type: 'h2', text: 'The Goldman Sachs Engineering process -- 5 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why GS, why this team. They will probe whether you have an opinion on bank-vs-tech engineering and whether you can stomach the formal register.',
        'HireVue / online assessment -- 60 minutes async. Two coding problems (Java / Python flavoured). Heavy emphasis on edge cases and complexity analysis.',
        'Phone screen -- 60 minutes. Live coding with an engineer. Modern teams (Marquee, GS Bank) use Java / Python / TypeScript; trading platform teams use SLANG.',
        'Onsite -- 4-5 rounds, 60 minutes each: 2x coding, 1-2x system design (always financial-systems-shaped), 1x behavioural / values.',
        'Hiring manager + division head conversation. GS has a more formal final round than most tech companies. Wear a suit if it is in-person.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Code: implement a price-time priority order book in Java. Now extend it for partial fills and IOC / FOK / GTD time-in-force flags."',
        '"Walk me through the trade lifecycle from order entry to settlement. Where are the failure modes?"',
        '"Design Marquee\'s real-time market data API at 1M concurrent client connections, p99 under 50ms."',
        '"You are designing a settlement system that handles £40bn of trades per day. Walk me through how you guarantee exactly-once execution under partial network failure."',
        '"You disagree with a senior engineer on whether to migrate a SLANG-based service to a modern stack. Argue your side for 5 minutes."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on the SLANG legacy vs Java/Python migration? Where does GS need to keep SLANG? Where should it migrate aggressively?"',
        '"Tell me about a production incident in financial systems. How did you handle it?"',
        '"Why Goldman Sachs and not [Morgan Stanley / JPMorgan / Citadel / a pure-tech company]?"',
        '"How do you balance tech-velocity against regulatory-reporting requirements?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Goldman Sachs specifically' },
      { type: 'ol', items: [
        'Pure-tech-company register. GS engineers operate inside a formal investment bank. Stories framed for "we shipped fast at a startup" land badly. Frame stories with regulatory awareness, hierarchical communication, and trade-floor-adjacent context.',
        'No financial-systems depth. "I would use Cassandra" is not enough. Knowing roughly how trade settlement, position-keeping, and risk-aggregation work matters. Read the GS engineering blog the week before.',
        'Generic STAR stories. GS interviewers grade on a structured rubric heavily weighted on judgement-under-regulatory-constraint. Stories without explicit constraint-awareness score low.',
        'Underestimating SLANG / proprietary-stack heritage. SLANG is not going away. If you frame your answer as "I would just rewrite it all in Python", you have signalled you do not understand why SLANG exists. Calibrated take: "SLANG\'s strengths in financial-domain expressiveness are real; the migration target should be language-by-language pragmatic, not greenfield Python rewrite".',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Goldman Sachs engineering blog (developer.gs.com or goldmansachs.com/engineering). Identify three opinions on the SLANG migration / Marquee strategy.',
        '15-35 min: Stack drill. SLANG basics (history + design philosophy), SecDB, Marquee API platform, the GS Bank consumer stack, Java / Spring patterns commonly used. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- order book at scale, settlement system with exactly-once execution, real-time market data API. Write a one-page memo with regulatory awareness baked in (Reg NMS, Dodd-Frank, MiFID II).',
        '55-70 min: Story drill. Three stories with regulatory + hierarchical-comms framing. 200 words each.',
        '70-78 min: Regulatory primer. Reg NMS, Dodd-Frank Section 1502 SEF rules, MiFID II for European trading, FINRA basics. Two minutes per concept.',
        '78-83 min: Code drill. Two leetcode-medium problems, Java preferred (closest to GS stack).',
        '83-85 min: Close. One opinion on SLANG migration, one specific GS engineering decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Goldman Sachs remote in 2026?' },
      { type: 'p', text: 'Hybrid for engineering, but more strict than tech companies. NYC HQ, London (Plumtree Court), Bangalore, Dallas major hubs. 4 days a week in office for most senior+ engineering since 2024 RTO.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of finance-tech market. Cash-heavy comp structure (less RSU than FAANG; more cash + bonus). Bonus is significant — 30-100% of base for senior+. Total comp competitive with FAANG once bonus is included.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including finance-tech shops like Goldman Sachs. Free at aimvantage.uk.' },

      { type: 'p', text: 'Goldman Sachs hires engineers who can navigate the SLANG / proprietary-stack heritage, hold opinions on the migration trajectory, and operate in the formal investment-bank register. Prep the financial-systems context, the regulatory framework, and stories framed with constraint-awareness.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) JANE STREET SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'jane-street-software-engineer-interview-2026',
    title: 'Jane Street software engineer interview: the OCaml-and-puzzles 2026 loop',
    description: 'The Jane Street software engineer interview in 2026 -- five stages, the OCaml-heavy stack + brain-teaser tradition, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Jane Street', 'Software Engineer Interview', 'Quant', 'OCaml', 'Functional Programming', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Jane Street pays famously well, runs an OCaml-heavy stack, and tests aggressive logic puzzles + math reasoning. Most candidates fail the same trap: optimising for code-correctness and missing the puzzle layer.',
    hook: 'Jane Street\'s interview is the most distinctive quant loop in finance. OCaml everywhere, brain-teasers on the phone screen, and a probability/expected-value test most candidates underestimate.',
    sections: [
      { type: 'p', text: 'Jane Street is a private quantitative trading firm with a famously OCaml-heavy engineering stack and a multi-stage interview process that tests pure logic, mathematics, and probability as much as it tests software engineering. They hire generalists — strong CS undergrads, math PhDs, even pure-math academics. Compensation is at the top of the entire engineering job market: total comp for new SWEs frequently exceeds $400k in their first year, with senior+ roles substantially higher. The 2026 hiring bar is unchanged from prior years (this is one shop where the bar genuinely has not moved).' },

      { type: 'h2', text: 'The Jane Street SWE process -- 5 stages, ~6-8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen + math/probability test -- 30 minutes call + 30 minutes test. The math test is real: expected value, probability, combinatorics. Score < 70% = filtered.',
        'Phone screen -- 60 minutes. Brain-teaser + light coding. Common questions: probability puzzles, market-making logic, expected-value calculations under partial information. Less code than tech-company phone screens; more reasoning out loud.',
        'Technical phone screen -- 60 minutes. OCaml-flavoured coding (you can use other languages but OCaml is preferred). Modern problem with functional-programming idioms.',
        'Onsite -- 5-6 rounds, 45-60 minutes each: 2x coding, 1x algorithms / data-structures depth, 1x system design (or quant systems for trading-team roles), 1-2x trading game / market-making simulation.',
        'Hiring committee + offer. JS makes offers fast when they like a candidate (often within 5 days of onsite); slowly when they don\'t.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"You roll two fair six-sided dice. What is the expected value of the maximum of the two rolls?"',
        '"There are 100 prisoners and 100 light switches in a circle. Each prisoner enters once and toggles one switch. What is the probability that switch #1 ends in the original position after all 100 prisoners have gone through?"',
        '"Code: implement a persistent priority queue in OCaml. What invariants do you need to maintain for amortised O(log n) operations?"',
        '"Walk me through how you would implement a market-making strategy for a single illiquid asset. What is the bid-ask spread you would quote? Why?"',
        '"You are designing a real-time risk-aggregation system for 1M positions across 50K instruments. p99 under 100ms. Walk me through the architecture."',
        '"Code: implement a function that returns the kth smallest element in a stream of integers. OCaml. Optimise for both time and space."',
        '"What is your real opinion on the OCaml-heavy stack vs migrating to Rust / Haskell / Scala? Where does OCaml win? Where does it lose?"',
        '"Walk me through the most subtle bug you have hit in functional programming."',
        '"You inherit a 200KLOC OCaml codebase. The senior engineer who wrote it just left. What do you do in the first month?"',
        '"What is the expected number of fair coin flips needed to see two heads in a row?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Jane Street specifically' },
      { type: 'ol', items: [
        'No probability / expected-value depth. The math test is real and not gamed. Candidates without genuine probability comfort fail at the recruiter-screen stage. Brush up if rusty.',
        'OCaml unfamiliarity. You can use other languages, but you lose signal. The right level for a Jane Street interview: comfortable reading and writing OCaml at the level of "I can implement persistent data structures from scratch". 2 weeks of reading + practice closes the gap for a strong CS background.',
        'Optimising only for code-correctness. The brain-teaser layer is graded separately. Strong code + weak puzzle reasoning = no offer. Weak code + strong puzzle reasoning = sometimes still offer (especially for new grads).',
        'Trading-game tone-deafness. The market-making simulation in the onsite tests whether you would actually be useful on a trading desk. Cautious, slow players don\'t pass. Players who go aggressive without managing risk also don\'t pass. Calibrated risk-taking is the right register.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Probability + EV drill. Two questions on expected value, one on conditional probability, one on combinatorics. Out loud.',
        '20-40 min: OCaml refresher. Implement a persistent stack in 10 minutes. Implement an immutable AVL tree in 10 minutes. If you cannot, the gap is too wide for tomorrow — schedule the loop further out.',
        '40-60 min: Brain-teaser drill. Solve 5 classic puzzles (Monty Hall variants, prisoners problem, two-egg drop, etc.) out loud, narrating reasoning.',
        '60-75 min: Functional-programming systems design. Pick one of -- persistent priority queue, immutable order book, real-time risk aggregation. Write a one-page memo using OCaml-style modular reasoning.',
        '75-83 min: Story drill. Two engineering stories with concrete metrics. Less critical than tech-company loops; the bar here is technical depth, not narrative.',
        '83-90 min: Close. Read the Jane Street tech blog (signalsandthreads.com). Identify one specific opinion you have on their engineering choices.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Jane Street remote in 2026?' },
      { type: 'p', text: 'No. NYC, London, Hong Kong major offices. In-person engineering culture. Some senior+ roles allow occasional WFH but the expectation is 5 days in office.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of the engineering job market, period. Total comp for new SWEs frequently exceeds $400k in year one (substantial profit-share / bonus on top of base). Senior+ roles regularly clear $1M.' },
      { type: 'h3', text: 'Do you need a CS / math degree?' },
      { type: 'p', text: 'No formal requirement. They hire from across CS, pure math, philosophy, music. But you need either a strong CS background or a strong math/quantitative-thinking background — they test for one or the other rigorously.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including distinctive shops like Jane Street. Free at aimvantage.uk.' },

      { type: 'p', text: 'Jane Street hires generalist engineers comfortable with OCaml, probability, brain-teasers, and calibrated risk-taking in the trading game. The bar is among the highest in the industry but the comp + culture is famously rewarding for those who pass. Prep the math, the OCaml, and the puzzle layer separately.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) BLOOMBERG SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'bloomberg-software-engineer-interview-2026',
    title: 'Bloomberg software engineer interview: the Terminal + market-data 2026 loop',
    description: 'The Bloomberg software engineer interview in 2026 -- five stages, the Terminal-platform context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Bloomberg', 'Software Engineer Interview', 'Finance', 'Terminal', 'Market Data', 'Real-time Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Bloomberg runs the most-used trading terminal in finance and powers the market data behind it. The 2026 engineer loop tests for real-time-systems depth + comfort with the Terminal-platform paradigm.',
    hook: 'Bloomberg\'s engineering org is 6,000+ across the Terminal, market data, and the new AI-news platform. Most candidates underestimate how distinctive the Terminal-platform paradigm is.',
    sections: [
      { type: 'p', text: 'Bloomberg is private (Mike Bloomberg-owned) and operates at the centre of finance: the Bloomberg Terminal is on 325,000+ desks worldwide, costing $2,500-3,500/month each. The engineering team is 6,000+ across the Terminal platform (a unique paradigm — keyboard-driven, function-coded, instant-feedback), the market-data infrastructure (B-PIPE feed, real-time quote distribution), the news + research engine (AI-augmented), and the trading platform (TSOX). The 2026 hiring bar is high but specific: real-time-systems depth, comfort with the C++/Python heritage, and an honest take on the Terminal-vs-modern-UI tension.' },

      { type: 'h2', text: 'The Bloomberg SWE process -- 5 stages, ~5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Bloomberg, why this team. They will probe whether you have used the Terminal (free trial available; recommended before applying).',
        'HireVue / online coding assessment -- 90 minutes async. Two-three coding problems. Modern Java / Python / C++ depending on team.',
        'Phone screen -- 60 minutes. Live coding + system design questions blended.',
        'Onsite -- 4 rounds, 60 minutes each: 2x coding, 1x system design (always financial-data-shaped), 1x behavioural.',
        'Hiring manager + skip-level. Bloomberg has more formal hiring ceremony than most tech, but less than Goldman Sachs.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through the architecture of the Bloomberg Terminal. What does the user actually see when they type AAPL EQUITY?"',
        '"Design B-PIPE\'s real-time quote distribution at 100M ticks/sec to 325K subscribers."',
        '"Code: implement a moving-average crossover signal generator on a stream of price ticks. Time and space optimised."',
        '"You are designing a news-distribution system that needs to push to 325K Terminal subscribers within 100ms of receiving a story. Walk me through the architecture."',
        '"You disagree with a senior engineer on whether to migrate a Terminal function from C++ to a more modern stack. Argue your side for 5 minutes."',
        '"Walk me through the most subtle bug you have hit in real-time financial systems."',
        '"What is your real opinion on the keyboard-driven Terminal vs modern web UIs? Where is the Terminal still right?"',
        '"Tell me about a production incident in latency-sensitive systems. What did the postmortem look like?"',
        '"Why Bloomberg and not [Refinitiv / FactSet / a pure-tech company building fintech infrastructure]?"',
        '"How do you reason about the trade-off between latency and feature velocity?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Bloomberg specifically' },
      { type: 'ol', items: [
        'Not having used the Terminal. Even a 2-hour familiarity from the free trial / Bloomberg University course shifts the recruiter screen significantly. Cold candidates who do not understand Terminal command syntax score visibly lower.',
        'No real-time-systems depth. "I would just use Kafka" is not enough. Bloomberg expects you to reason about microseconds, deterministic latency, multicast distribution, and FPGA-accelerated paths.',
        'Generic system design. The Bloomberg architecture is specific (B-PIPE, BLP/AAPL-style symbology, MSG news distribution, the function-and-mnemonic paradigm). Generic answers signal you have not done team-specific homework.',
        'Underestimating the news + AI integration. Bloomberg has been integrating LLM-augmented news analysis since 2023. If you cannot reason about how an AI-summarisation layer fits into a latency-sensitive Terminal session, the system design round goes shallow.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read 3 pages of the Bloomberg Tech blog (techatbloomberg.com). Pick one specific opinion on the Terminal evolution.',
        '15-35 min: Stack drill. Terminal architecture (function-and-mnemonic paradigm), B-PIPE quote distribution, MSG news pipeline, the C++/Python tooling, multicast distribution patterns. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- B-PIPE distribution at scale, news distribution with sub-100ms target, a Terminal function with AI-augmented output. Write a one-page memo.',
        '55-70 min: Story drill. Three stories with explicit latency / financial-data-correctness framing. 200 words each.',
        '70-78 min: Code drill. Two leetcode-medium problems in Java or C++.',
        '78-80 min: Close. One opinion on Terminal + AI integration, one specific Bloomberg decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Bloomberg remote in 2026?' },
      { type: 'p', text: 'Hybrid for engineering. NYC HQ, London, Princeton, San Francisco, Hong Kong major hubs. 3 days a week in office since 2024 RTO. Some staff+ remote, but rare.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of finance-tech market. Below FAANG on RSU (Bloomberg is private; less liquidity), competitive on cash + significant bonus. Total comp for senior engineers competitive with FAANG mid-tier.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including financial-data shops like Bloomberg. Free at aimvantage.uk.' },

      { type: 'p', text: 'Bloomberg hires engineers who can navigate the Terminal-platform paradigm, reason about real-time financial-data systems at microsecond budgets, and ship in the C++/Python heritage. Prep the Terminal context, the real-time stack, and a calibrated take on the AI-news integration.' },
    ],
  },
];
