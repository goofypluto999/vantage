// 3 long-tail SEO posts -- batch 3, drafted 2026-05-10
// Dev-tool companies that hire indie / dev-first profiles.
// Append the objects below into the `blogPosts` array in `blogPosts.ts`.

import type { BlogPost } from './blogPosts';

export const newBlogPosts3: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) GITLAB STAFF ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'gitlab-staff-engineer-interview-2026',
    title: 'GitLab staff engineer interview: the all-remote 2026 loop',
    description: 'The GitLab staff software engineer interview in 2026 -- six stages, the all-remote async assessment, real Duo-era questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['GitLab', 'Staff Engineer Interview', 'Remote', 'Distributed Systems', 'Interview Prep', 'AI DevTools', 'Tech Hiring'],
    excerpt: 'GitLab is fully remote, public, profitable, and shipping AI features (Duo, Knowledge Graph, Agent Platform) at speed. The staff engineer loop now filters hard for written async clarity, distributed systems depth, and a real opinion on AI in the SDLC.',
    hook: 'GitLab has 1,300+ engineers across 65 countries, no offices, and a public handbook longer than the Bible. The staff loop tests for one thing every onsite-trained engineer underestimates: writing.',
    sections: [
      { type: 'p', text: 'GitLab went public in 2021, has been operating cash-flow positive since FY24, and ships GitLab Duo plus the new Agent Platform on top of the core DevSecOps stack. They run all-remote, all-async, with the company handbook public on about.gitlab.com/handbook. The staff engineer interview reflects all of that. Most candidates I have walked through it underestimate two things: how heavily they are tested on async written communication, and how concrete the system design rounds get on real GitLab problems (CI runners, container registry scaling, federated git).' },

      { type: 'h2', text: 'The GitLab staff engineer process -- 6 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, all-remote fit, why GitLab. They will probe whether you have actually read the handbook -- some candidates get a follow-up question on a specific page.',
        'Hiring manager interview -- 45-60 minutes. Past staff-level work, scope, technical leadership, what kind of problem you want to own next.',
        'Technical screen -- 60 minutes. Live coding on a moderate problem (no leetcode-hards), with a heavy focus on how you reason out loud and write tests. Some teams replace this with an async take-home.',
        'System design -- 60 minutes. Real GitLab-shaped scenarios. "Design CI runner autoscaling across 12 cloud providers." "Design the container registry for 10x current load." "How does Duo Code Suggestions stay under 200ms p95 from a free-tier user in Sao Paulo?"',
        'Cross-functional / values -- 60 minutes. Conflict, feedback, written async work, transparency in practice. The interviewer is often a Director or Principal from a different stage of the SDLC.',
        'Executive / culture interview -- 30-45 minutes. CTO org or above. Strategy-level questions and a culture-add read.',
      ] },
      { type: 'p', text: 'Total wall-clock time is usually 5-6 weeks. Faster than the 2024 average; the recruiting team has been explicit about wanting to compress the loop.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through the most complex async written debate you have led. What did you write? What changed in the team because of it?"',
        '"Design a CI runner pool that autoscales across AWS, GCP, Azure, and 9 other providers. Tell me where the abstraction breaks."',
        '"GitLab Duo has to work for a 3-person free-tier customer in Brazil and a 50,000-engineer enterprise on a self-managed instance behind a corporate firewall. Walk me through the architectural compromises."',
        '"You disagree with a Principal in another stage about whether to ship a feature behind a feature flag or via gradual rollout. There is no synchronous meeting -- everything is async. How does this go for the next week?"',
        '"What is wrong with our handbook page on incident management? Be specific. We can pull it up."',
        '"Tell me about a production incident where you owned the RCA. What did the public postmortem look like?"',
        '"What is your real opinion on AI-generated code in production? Where do you draw the line at GitLab specifically?"',
        '"You inherit a 4-year-old Rails service with 18% test coverage and a 90-minute CI pipeline. Six month plan."',
        '"Why staff and not senior, and why not principal? Be honest."',
        '"You have 90 minutes in your week reserved for handbook contributions. What did you change last quarter and why?"',
      ] },

      { type: 'h2', text: 'What kills candidates at GitLab specifically' },
      { type: 'ol', items: [
        'Weak written communication. The single biggest filter. Staff engineers at GitLab live in MRs, issues, handbook PRs, and async docs. If your STAR stories sound like they were written for an onsite, they will not land. Practice the same answers in writing first, then read them back out.',
        'Missing the all-remote register. "I would set up a Zoom" or "I would walk over to their desk" gets you flagged. Default to async written for everything but exec-level conflict resolution; reserve sync for the irreducibly social.',
        'Generic AI takes. GitLab has a specific posture: AI helps with the SDLC, but the product values transparency, low lock-in, and customer choice of model. "We should fine-tune our own model" or "we should ban AI in code review" both miss the room. Prep a calibrated take.',
        'Not reading the handbook. Even one specific reference -- "I noticed the engineering / development handbook page on async standups says X, and I think Y" -- separates you from 80% of candidates.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Handbook drill. Read the engineering handbook section on the stage you are interviewing for, plus the values page (CREDIT: collaboration, results, efficiency, diversity, iteration, transparency). Write down two opinions you have on each value.',
        '20-40 min: System design drill. Pick one of -- CI runners, container registry, Duo Code Suggestions latency, federated git -- and write a one-page design memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '40-60 min: Story drill in writing. Three staff-level stories -- ambiguous decision, written debate you led, technical leadership without authority. Write each in 200 words. Then time them out loud.',
        '60-75 min: Stack refresher. Know enough Rails, Vue, GraphQL, Postgres, Redis, and Sidekiq to talk fluently. You will not be quizzed on syntax; you will be busted if you cannot reason about Sidekiq queue saturation.',
        '75-85 min: Async drill. Open Slack or your equivalent. Write a 4-paragraph project update for a fictional release -- problem, options considered, recommendation, ask. Read it back. Cut 30%.',
        '85-90 min: Close. One opinion on AI in the SDLC, one specific GitLab decision you would change, one question for the hiring manager that proves you read the latest engineering handbook update.',
      ] },

      { type: 'h2', text: 'On the handbook' },
      { type: 'p', text: 'You do not need to read all 3,000 pages. You do need to read the values page, the engineering handbook for your stage, and the most recent CEO blog post. The interviewers will respect a candidate who quotes the handbook back to them critically -- "this is great in theory but I think the page on async standups breaks down when timezones overlap less than 4 hours" -- much more than one who recites it.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is GitLab still hiring in 2026?' },
      { type: 'p', text: 'Yes, but selectively. The careers page lists ~80 engineering roles at any given time, weighted toward staff and principal levels. They are explicit about hiring globally rather than US-only.' },
      { type: 'h3', text: 'Do they pay US salaries globally?' },
      { type: 'p', text: 'No. GitLab uses a public compensation calculator with a country and city multiplier. London staff engineers come in around the SF level minus ~25%. Lisbon, Sao Paulo, Bangalore further down. They are transparent about it.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'No -- the all-remote model means you stay where you are. They hire via local entities or contractor-of-record providers in 65+ countries.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including async-first companies like GitLab. Free at aimvantage.uk.' },

      { type: 'p', text: 'The GitLab staff bar in 2026 is high but specific: write clearly, design real systems for real GitLab traffic, hold a calibrated AI opinion, and prove you can operate in async without losing scope. Nail those four and the loop is doable.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) LINEAR FOUNDING ENGINEER / PRODUCT ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'linear-product-engineer-interview-2026',
    title: 'Linear product engineer interview: the craft-first 2026 loop',
    description: 'The Linear product engineer interview in 2026 -- four stages, the take-home that filters 80%, real questions, the taste signal, and a 75-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Linear', 'Product Engineer Interview', 'Frontend', 'Craft', 'Interview Prep', 'Startup Hiring', 'Tech Hiring'],
    excerpt: 'Linear hires fewer than 200 people total and rejects ~99% of applicants. The product engineer loop tests for one thing more aggressively than any other top-tier shop: taste. Here is how that actually plays out in 2026.',
    hook: 'Linear gets ~10,000 applications a year and hires under 50 engineers. Most candidates fail the take-home for the same reason: they shipped something fast instead of something good.',
    sections: [
      { type: 'p', text: 'Linear is small, profitable, opinionated about craft, and ships at a pace most enterprise tools cannot match. They hire product engineers -- people who can design, ship frontend code, hold a strong opinion on the spec, and care about the eight-pixel grid. The loop is short on stages but brutal on the take-home, and the rest of the rounds are largely about whether your taste matches the product.' },

      { type: 'h2', text: 'The Linear product engineer process -- 4 stages, ~3 weeks' },
      { type: 'ol', items: [
        'Recruiter or founder screen -- 30 minutes. Why Linear, what you have shipped that you are proud of, and a soft taste check. They will look at your portfolio, your GitHub, and the products you ship in your spare time.',
        'Take-home -- 4-6 hours of expected work, 1 week wall clock. A small Linear-shaped product problem. Past versions: build a keyboard-driven command palette, design a recurring task model and ship the UI, refactor a poorly built kanban into something that feels native to Linear.',
        'Technical pairing -- 60 minutes on the take-home. They will ask you to extend it live. The conversation is more important than the lines of code.',
        'Onsite (or remote equivalent) -- 3-4 rounds: design / spec critique, frontend depth, product judgement, and a culture / values round usually with a founder.',
      ] },
      { type: 'p', text: 'They move fast when they like a candidate -- offers in 3 weeks. Slow when they do not -- silence within 4 days of the take-home is the usual signal.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Linear right now. Tell me three things you would change. Defend each."',
        '"You have one week, one designer, one PM. Build the spec and the first slice of a Linear-native CRM. What does day five of the sprint look like?"',
        '"Walk me through the most boring engineering decision you made on your last project. Why did you make it the way you did?"',
        '"Pick a product you love that is not Linear. What is the single thing it gets right that nobody else does?"',
        '"What is wrong with our Linear API? Be specific."',
        '"You inherit a 30,000-line React codebase with no tests and three TypeScript errors masked as any. First two weeks?"',
        '"Show me your dotfiles or your editor config."',
        '"You disagree with the design on a spacing decision. The PR is open. How does the next 24 hours go?"',
        '"Describe a feature you killed -- one you built or one someone else did. Why?"',
        '"Pick a Linear shortcut. Tell me why it is bound to that key combination."',
      ] },

      { type: 'h2', text: 'What kills candidates at Linear specifically' },
      { type: 'ol', items: [
        'Take-home fast and rough. The number one rejection reason. Linear is not testing whether you can ship -- they assume you can. They are testing whether you ship something that feels like it belongs in their product. A polished 4-component prototype with thoughtful empty states beats a 14-component everything-bagel every time.',
        'No taste signal. If your portfolio is generic SaaS dashboards or your GitHub is full of unfinished side projects with no README, the recruiter screen is the end of the line. Pick one project. Polish it. Write a README that explains the decisions, not the features.',
        'Generic React answers. You will not win on hooks trivia. You will win on opinion -- "I avoid Redux because the Linear-style local-first model makes it noise" -- if you can defend it.',
        'Ignoring the design system. Linear has a public design system at linear.app/design. If your take-home uses Bootstrap or Tailwind defaults instead of approximating their type scale and 8px grid, you are signalling that you do not see what they see.',
      ] },

      { type: 'h2', text: 'The 75-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open Linear. Use it for 15 minutes on a real project. Note three pain points. Note three things that delight you.',
        '15-30 min: Open the take-home. Re-read the brief. Write down what you would not build. Cut the scope by 20%.',
        '30-45 min: Stack refresher. React 19, TypeScript strict, GraphQL, MobX. You do not need to be deep on MobX -- you do need to know why local-first reactive state matters for Linear.',
        '45-60 min: Story drill. Three product engineering stories -- spec you wrote, decision you reversed, polish that took longer than the feature. 200 words each, tight.',
        '60-70 min: Taste audit. Open three competitor products (Jira, Asana, Height). Articulate one thing each gets wrong that Linear gets right. Articulate one thing each gets right that Linear does not.',
        '70-75 min: Close. One product opinion you will defend. One Linear feature you would kill. One question for the hiring manager about how they decide what NOT to build.',
      ] },

      { type: 'h2', text: 'On the take-home' },
      { type: 'p', text: 'Spend 6 hours, not 30. They explicitly do not reward over-investment -- it signals you cannot manage scope. Pick the smallest meaningful slice, ship it polished, write a 300-word README explaining what you did, what you cut, and what you would do next. The README is read more carefully than the code.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Linear remote?' },
      { type: 'p', text: 'Hybrid. SF and EU hubs (Amsterdam, Berlin) for most product engineering roles. Some senior roles open to fully remote in EU or US timezones. Always confirm with the recruiter.' },
      { type: 'h3', text: 'What is the comp?' },
      { type: 'p', text: 'Mid-market for SF, top-of-market for Europe. Equity is meaningful given the late-stage valuation. They publish band ranges in the recruiter screen on request.' },
      { type: 'h3', text: 'Do they hire juniors?' },
      { type: 'p', text: 'Rarely. The bar is functionally senior. They have hired exceptional juniors with strong open-source taste signals, but it is not the default path.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds. Useful for craft-bar shops like Linear where the JD does not tell you what they are actually filtering for. Free at aimvantage.uk.' },

      { type: 'p', text: 'Linear is one of the few companies where the interview signal genuinely matches the product. If you would not enjoy debating the spacing on a confirmation modal for 20 minutes, you would not enjoy working there. If you would, prep accordingly -- and ship the take-home polished, not fast.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) VERCEL SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'vercel-software-engineer-interview-2026',
    title: 'Vercel software engineer interview: the v0 + Next.js 2026 loop',
    description: 'The Vercel software engineer interview in 2026 -- five stages, the v0 / Next.js / AI SDK product depth, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Vercel', 'Software Engineer Interview', 'Next.js', 'AI SDK', 'v0', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Vercel ships Next.js, the AI SDK, and v0. The engineering loop now expects you to have built with the stack -- not just read about it. Here is what changed for 2026 and how to prep.',
    hook: 'Vercel ships the framework, the deploy target, and the AI tooling. The interview tests whether you have lived inside their stack. Most candidates have not, and it shows in 90 seconds.',
    sections: [
      { type: 'p', text: 'Vercel is a private, growth-stage company shipping Next.js, the AI SDK, the v0 generator, and the underlying edge platform. The engineering bar in 2026 is high and the loop is dense. The single biggest filter: have you actually built something on Next.js 15 + the AI SDK + v0 in the last six months, or are you reciting docs you read once? They tell within the first 15 minutes.' },

      { type: 'h2', text: 'The Vercel engineering process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Vercel, why this team. Light technical filter -- they will ask what you have shipped on Next.js recently.',
        'Hiring manager interview -- 60 minutes. Past work, technical scope, what kind of problem you want to own. Often paired with a small product critique.',
        'Coding -- 60 minutes. Live or take-home depending on team. Frontend roles get a UI / React focused problem. Platform roles get something closer to systems -- caching, build pipelines, edge routing.',
        'System design -- 60 minutes. Real Vercel-shaped scenarios. "Design build cache invalidation across 100,000 deployments per day." "Design v0 streaming UI for a free-tier user on a 3G connection in Lagos." "Walk me through the AI SDK abstraction layer and what you would change."',
        'Onsite or final loop -- 3-4 rounds: deeper coding, product / craft judgement, cross-functional, and a culture / founders round (Guillermo or Lee Robinson appears in some loops).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open v0 right now and build me a pricing component. Talk me through what you change in the prompt and why."',
        '"You are designing the Next.js cache layer for the 16 release. ISR, on-demand revalidation, fetch caching, route segments. Pick one and tell me what is broken about its mental model right now."',
        '"You have a customer with 12,000 routes hitting build times of 45 minutes. First three things you investigate?"',
        '"Walk me through the AI SDK streamObject API. Where would you take the abstraction next?"',
        '"What is wrong with the Vercel dashboard? Be specific. We can pull it up."',
        '"You disagree with a senior engineer on whether to ship a Next.js feature behind a flag or in a canary. Defend your side for 5 minutes."',
        '"Describe a deploy that went wrong. What did you do in the first 10 minutes?"',
        '"Why do you think Next.js is still winning when Astro, Remix, and Svelte each have real arguments?"',
        '"Pick one piece of Next.js documentation that is wrong or unclear. Tell me what you would change."',
        '"What is the smallest thing you have shipped that you are most proud of?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Vercel specifically' },
      { type: 'ol', items: [
        'No real Next.js usage. The interviewer can tell within 5 minutes whether you have lived in the App Router, server actions, partial prerendering, and middleware -- or whether you read the docs last week. Build something. Deploy it. Hit a real bug. Reference it in the loop.',
        'Generic AI takes. Vercel has shipped concrete AI tooling -- the SDK, v0, agent primitives. "AI is going to change frontend" is not an answer. "I built a streaming chat UI with the AI SDK and ran into rate limits at concurrent stream count X" is.',
        'Underestimating product taste. Vercel hires for craft. If your portfolio screams generic SaaS dashboards, the founders round will not go well. Ship a side project. Polish it. Deploy it on Vercel.',
        'Missing the platform layer. Even pure frontend candidates get hit with "what happens when you push to a branch?" Know the deployment pipeline -- git hook, build, asset upload, edge propagation, cache warm.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open v0. Build something. 10 prompts, 5 minutes of edits. Note three things you would change about the product.',
        '15-35 min: Stack drill. App Router, server actions, partial prerendering, middleware, edge runtime, fluid compute, AI SDK streamObject / streamText. Two minutes per concept -- one sentence on what it does, one on its weakness.',
        '35-55 min: System design. Pick one of -- build cache invalidation, v0 streaming under load, AI SDK abstraction, Next.js ISR. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Three engineering stories -- shipped feature, production incident, technical disagreement resolved. 200 words each, tight.',
        '70-80 min: Product audit. Open the Vercel dashboard. Note three friction points. Open vercel.com/blog -- read the most recent two posts, write one critical opinion on each.',
        '80-85 min: Close. One opinion on Next.js future direction, one specific Vercel decision you would change, one question for the hiring manager that proves you read the latest blog post.',
      ] },

      { type: 'h2', text: 'On Guillermo and Lee' },
      { type: 'p', text: 'If either appears in your loop, do not freeze. They run the round like senior engineers -- direct questions, calibrated follow-ups, no theatre. The most common failure mode is candidates getting starstruck and pulling punches. State your opinion crisply. They will respect disagreement more than agreement.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Vercel remote?' },
      { type: 'p', text: 'Mostly yes for engineering. SF, NYC, and London hubs for some senior roles. Confirm with the recruiter.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the stage. Equity meaningful at late-private valuations. London base salaries lag SF by ~20-25%.' },
      { type: 'h3', text: 'Do they sponsor visas?' },
      { type: 'p', text: 'Selectively, role-dependent. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role. Useful when the JD references half-a-dozen Vercel products and you have not used them all. Free at aimvantage.uk.' },

      { type: 'p', text: 'Vercel hires people who have built with the stack, hold a real opinion on its future, and care about craft. Prep by shipping something on Next.js 15 + the AI SDK in the week before the loop -- not by re-reading the docs.' },
    ],
  },
];
