// 3 FAANG-targeted long-tail interview-guide posts -- batch 6, drafted 2026-05-10
// Highest-volume "X interview" search queries. Saturated competition but the
// upside skew is enormous if even one ranks page-2 for a breakout query.

import type { BlogPost } from './blogPosts';

export const newBlogPosts6: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) APPLE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'apple-software-engineer-interview-2026',
    title: 'Apple software engineer interview: the 2026 loop',
    description: 'The Apple software engineer interview in 2026 -- six stages, the team-match phase, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '9 min read',
    tags: ['Apple', 'Software Engineer Interview', 'iOS', 'Distributed Systems', 'Interview Prep', 'Cupertino', 'Tech Hiring'],
    excerpt: 'Apple\'s engineering loop is unique among FAANG -- you do not interview for "Apple," you interview for a specific team, and the team-match phase is where most candidates fail. Here is the actual 2026 process.',
    hook: 'Apple does not run a generic engineering interview. You interview for a specific team -- and the team match is where most candidates fail without realising it.',
    sections: [
      { type: 'p', text: 'Apple\'s engineering interview is structurally different from Google, Meta, or Amazon. There is no centralised "Apple SDE" pipeline. You interview for a specific team -- iOS Frameworks, Maps, Siri, Apple Intelligence, Vision Pro, etc. The recruiter screen funnels you into a team-match conversation early. The technical bar is high but the team fit is the silent filter that takes out most candidates. Here is the actual loop in 2026, and the four traps I have seen kill candidates I have walked through it.' },

      { type: 'h2', text: 'The Apple software engineer process -- 6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Apple, why this team area. Apple recruiters are explicit about funnelling you into a specific team rather than a generic pool.',
        'Team-match call -- 30-45 minutes. With the hiring manager or a senior engineer from the team. They probe whether you have a real opinion on what the team builds, not generic Apple admiration.',
        'Phone screen / coding -- 60 minutes. Live coding. Moderate to hard problem. Often involves data structures most teams use daily -- LRU caches, tree traversals, range queries.',
        'Onsite loop -- 4-5 rounds: deep coding, system design, behavioural, plus 1-2 team-specific rounds (iOS internals, ML systems, distributed architecture, etc).',
        'Cross-functional / lunch interview -- 45 minutes. Often pitched as casual. It is not. Apple specifically tests collaboration, ego, and fit during this round.',
        'Debrief and offer -- typically 1-2 weeks. Apple\'s offer process is famously slow. Plan for it.',
      ] },
      { type: 'p', text: 'Total wall-clock time is 5-7 weeks. Some teams move faster (Apple Intelligence has been compressing to 4 weeks in early 2026); others stretch to 9-10 weeks if you cross multiple time zones.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how iOS schedules background tasks. Where is the bottleneck under low-battery conditions?"',
        '"Design the architecture for offline message search across 10 years of iMessage history on-device."',
        '"You disagree with a senior engineer on whether to ship a privacy-impacting feature behind a flag or with explicit user opt-in. Argue your side for 5 minutes."',
        '"Pick an Apple product. Tell me three things you would change. Defend each."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on Apple Intelligence? Where do you draw the privacy line?"',
        '"Tell me about a production incident you owned end-to-end. What did the postmortem look like?"',
        '"Why this team and not [adjacent Apple team]?"',
        '"You inherit a 5-year-old framework with zero tests and three undocumented dependencies. First six weeks?"',
        '"Code an LRU cache. Now extend it for thread safety with minimal lock contention."',
      ] },

      { type: 'h2', text: 'What kills candidates at Apple specifically' },
      { type: 'ol', items: [
        'No team-specific opinion. Apple recruiters are explicit: this is for a specific team. If your team-match call sounds like you would be equally happy on iOS Frameworks or Maps, you are out. Pick the team. Have a real opinion on what they build. Use the product they ship.',
        'Generic FAANG STAR stories. Apple interviewers are direct and read polish as evasion. "I led the project" gets follow-up grilling. Specific, owned-failure stories with concrete metrics and lessons land.',
        'Underestimating the lunch / cross-functional round. Pitched as casual; it is not. Apple specifically tests collaboration, ego, and how you talk about people you disagreed with. Stay calibrated.',
        'Privacy missteps. Apple\'s privacy stance is structural, not marketing. Any answer that suggests "ship the feature, ask for permission later" or "scrape user data for training" is a red flag. Have a calibrated take on the privacy-vs-feature trade-off.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open the team\'s most recent product surface. iOS team -- the latest iOS release notes. Apple Intelligence -- the WWDC keynote summary. Maps -- the latest blog post. Note three opinions.',
        '15-35 min: Stack drill specific to the team. iOS: Swift, Combine, SwiftUI internals, GCD, memory management. ML systems: CoreML, on-device inference, privacy budgets. Distributed: iCloud architecture, sync conflict resolution.',
        '35-55 min: System design. Pick one of -- offline message search at scale, photo deduplication on-device, sync conflict resolution. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-75 min: Story drill. Four stories with concrete metrics. 30s situation, 60s action, 30s outcome. Time them out loud.',
        '75-85 min: Privacy + Apple-philosophy refresher. Read the most recent Apple privacy white paper one-pager. Have an opinion on differential privacy, on-device ML, and where Apple has tightened or loosened over the last 18 months.',
        '85-90 min: Close. One opinion you will defend, one specific Apple decision you would change, one question for the team-match interviewer that proves you have actually used the product.',
      ] },

      { type: 'h2', text: 'On the team-match call' },
      { type: 'p', text: 'This is the most underestimated round. The hiring manager is filtering for whether you actually want to work on what they build, not whether you want to work at Apple. Use the product. Read the team\'s most recent blog or release notes. Have a real opinion on what they have shipped in the last 6 months. Generic "I admire Apple" answers fail this round.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Apple remote in 2026?' },
      { type: 'p', text: 'Hybrid. Cupertino, Austin, Seattle, London for most engineering roles. 4 days a week in office for most teams; some staff and principal roles open to fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG market for senior+ levels. Below Meta on cash; competitive on RSU. London base salaries lag Cupertino by ~30-35%.' },
      { type: 'h3', text: 'How much weight does the lunch interview carry?' },
      { type: 'p', text: 'More than candidates expect. Apple interviewers explicitly compare notes on the casual rounds and a single "did not feel right" comment can sink an offer.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including team-specific FAANG loops like Apple. Free at aimvantage.uk.' },

      { type: 'p', text: 'Apple hires for the team, not the company. The candidates who get through have used the team\'s product seriously, hold a calibrated opinion on what they build, and stay direct without polish. Prep for the team -- not for "Apple."' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) MICROSOFT PRODUCT MANAGER
  // -------------------------------------------------------------------
  {
    slug: 'microsoft-product-manager-interview-2026',
    title: 'Microsoft product manager interview: the Copilot-era 2026 loop',
    description: 'The Microsoft product manager interview in 2026 -- five stages, the Copilot-everywhere context, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Microsoft', 'Product Manager Interview', 'Copilot', 'AI Hiring', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Microsoft has reorganised PM hiring around the Copilot-everywhere thesis. The loop is shorter than 2024 and the bar is higher on AI product reasoning. Here is what changed and how to prep.',
    hook: 'Microsoft has compressed the PM loop to 5 stages and shifted the bar firmly toward AI product reasoning. Generic PM frameworks no longer touch sides.',
    sections: [
      { type: 'p', text: 'Microsoft\'s PM org has reorganised significantly around the Copilot-everywhere thesis since 2024. The loop is shorter, the bar is higher on AI product reasoning, and the case rounds lean concrete. Most candidates I have walked through it underestimate two things: how specific the AI product questions get, and how seriously Microsoft enforces the Satya-era growth-mindset register in the values rounds.' },

      { type: 'h2', text: 'The Microsoft PM process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Microsoft, why this team. They probe whether you have a real opinion on Copilot beyond "it is impressive."',
        'Hiring manager interview -- 60 minutes. Past PM work, scope, technical fluency, the AI product judgement they are filtering for.',
        'Product case -- 60 minutes. Often Copilot-shaped: "Design a Copilot for a domain that does not have one yet." "Critique GitHub Copilot for enterprise customers. What is missing?"',
        'Technical / cross-functional -- 60 minutes. PMs do not code, but you should be able to reason about latency, model trade-offs, and enterprise security at whiteboard depth.',
        'Onsite loop -- 3-4 rounds: product sense, execution and metrics, leadership, and the values round (growth mindset, customer obsession, one Microsoft).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Pick a domain that does not have a Copilot yet. Design one. Walk me through the first three months of roadmap."',
        '"GitHub Copilot enterprise penetration is at X. Pick the lever you would pull next quarter to grow it 20%."',
        '"You disagree with engineering on whether to ship a Copilot feature behind a flag or as a default-on rollout. Argue your side for 5 minutes."',
        '"PMs at Microsoft do not code, but you should be able to explain inference latency budgets, model selection, and prompt-injection mitigations at whiteboard depth. Pick one and explain it."',
        '"Walk me through the most ambiguous PM decision you have owned. What did you commit to with incomplete data?"',
        '"What is wrong with our Microsoft 365 Copilot product right now? Be specific."',
        '"Tell me about a launch you ran. Now tell me what you would do differently with the AI tooling that did not exist when you ran it."',
        '"You own pricing for a new Copilot SKU. Walk me through the model. Numbers."',
        '"Pick a competitor product. Tell me what they get right that we do not."',
        '"How do you handle a senior leader pushing for a feature you think is a mistake?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Microsoft specifically' },
      { type: 'ol', items: [
        'Generic Copilot takes. "AI is going to change everything" is not an answer. Microsoft has shipped a specific thesis -- Copilot in every product -- and they want PMs who can reason about where the thesis breaks. "Copilot for legal contracts has a hallucination cost that exceeds the acceptable error rate at this token budget" is calibrated. "Just add more AI" is not.',
        'No technical fluency. PMs at Microsoft do not code, but you will be busted in 3 minutes if you cannot reason about inference latency, model trade-offs, and enterprise security. Get the basics in your head.',
        'Missing the values round. Growth mindset, customer obsession, one Microsoft. They are not slogans. The values round is real and interviewers compare notes. Have specific stories tied to each.',
        'Underestimating enterprise complexity. Microsoft\'s PM bar leans heavily toward enterprise reasoning -- compliance, identity, multi-tenant trade-offs, data residency. Generic consumer PM answers do not land.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent Satya Nadella keynote summary plus the latest Copilot blog post. Write down three opinions you have.',
        '15-35 min: Stack drill. Inference latency budgets, model selection (GPT-5 vs phi-4 vs custom), prompt-injection mitigations, RAG vs fine-tune trade-offs. Two minutes per concept.',
        '35-55 min: Product case. Pick a domain without a Copilot. Write a one-page memo: target customer, top three jobs-to-be-done, model + latency budget, pricing, what you would NOT build.',
        '55-70 min: Story drill. Four stories tied to values -- growth mindset (a specific failure you learned from), customer obsession (a feature you killed because customers did not want it), one Microsoft (a cross-org collaboration). 200 words each.',
        '70-80 min: Enterprise refresher. SSO, SAML, data residency, GDPR + HIPAA basics, multi-tenant isolation. You will not be quizzed; you will be busted if you cannot lean on these.',
        '80-85 min: Close. One opinion on Copilot, one specific Microsoft decision you would change, one question for the hiring manager that proves you read the latest earnings call.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Microsoft remote in 2026?' },
      { type: 'p', text: 'Hybrid. Redmond, San Francisco, Vancouver, Bangalore, London for most senior PM roles. 2-3 days a week in office. Some staff+ roles open to fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG. London base salaries lag Redmond by ~25-30%. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in most markets. Confirm specifics at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-thesis-heavy companies like Microsoft. Free at aimvantage.uk.' },

      { type: 'p', text: 'Microsoft PM hiring in 2026 is fast, AI-thesis-driven, and enterprise-heavy. Prep the Copilot stack, the values stories, and a calibrated take on where the AI thesis breaks. Skip the 2024 PM playbook everyone else is rehearsing.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) AMAZON SDE
  // -------------------------------------------------------------------
  {
    slug: 'amazon-sde-interview-2026',
    title: 'Amazon SDE interview: the leadership-principles 2026 loop',
    description: 'The Amazon SDE interview in 2026 -- five stages, the still-undefeated leadership principles filter, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Amazon', 'SDE Interview', 'Leadership Principles', 'System Design', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Amazon\'s leadership principles round is the most-prepped, least-changed signal in tech hiring. The 2026 loop has compressed but the bar-raiser bar has not moved. Here is how to prep without sounding rehearsed.',
    hook: 'Amazon\'s leadership principles round is the most-prepped, least-changed filter in tech hiring. The bar-raiser still kills more candidates than the system design round.',
    sections: [
      { type: 'p', text: 'Amazon\'s SDE interview has compressed since 2024 -- average loop is now 4 weeks instead of 6 -- but the structural filters have not changed. The leadership principles still drive every behavioural answer. The bar-raiser still kills more candidates than the system design round. The single biggest reason candidates fail in 2026 is the same as in 2020: rehearsed STAR stories that do not survive follow-up grilling.' },

      { type: 'h2', text: 'The Amazon SDE process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Amazon, why now. They will tag your application against 2-3 specific leadership principles to probe at later rounds.',
        'Online assessment -- 60-90 minutes async. Two coding problems plus a work-style assessment that scores against the leadership principles.',
        'Phone screen -- 60 minutes. One coding problem (medium-hard), 15 minutes of behavioural. The behavioural is not optional and not a warm-up -- it is part of the bar.',
        'Onsite loop -- 4-5 rounds: 1-2 coding, 1-2 system design, 1 bar-raiser. Each round is 60 minutes and includes 15-20 minutes of leadership-principles-tied behavioural.',
        'Bar-raiser debrief -- typically 1 week. The bar-raiser holds veto power over the team\'s offer recommendation. Their notes are weighted heavier than any other round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Tell me about a time you had to make a decision with incomplete data."',
        '"Tell me about a time you disagreed with your manager. What did you do?"',
        '"Tell me about a time you failed. What did you learn? Now tell me about a more recent failure."',
        '"Tell me about a time you simplified a process. By how much, exactly? In what units?"',
        '"Design a URL shortener at 1M writes/sec, p99 under 50ms."',
        '"Design Amazon\'s order processing pipeline. Walk me through what happens between checkout and warehouse pick."',
        '"Code: given a stream of integers, design a data structure that supports insert(x), median() in O(log n)."',
        '"You inherit a service that is slow. First three things you investigate?"',
        '"Walk me through the most ambiguous engineering decision you have owned. Be specific about what you committed to."',
        '"Why Amazon? Be specific. We have heard \'AWS scale\' a lot today."',
      ] },

      { type: 'h2', text: 'What kills candidates at Amazon specifically' },
      { type: 'ol', items: [
        'Rehearsed STAR stories. The bar-raiser is trained to detect them. If your story sounds like it has been told 30 times, the follow-up grilling will surface inconsistencies fast. Have 8-10 stories with real metrics, real failures, and real opinions -- not 4 polished ones.',
        'No leadership principles tagging. Each behavioural answer should clearly tie to a specific principle. "I had bias for action because..." or "this was a customer obsession decision because..." Interviewers use a structured rubric and "I just did the right thing" does not score.',
        'Underestimating the bar-raiser. The bar-raiser is from a different team and holds veto power. Their job is to filter aggressively. Treat them with the same energy as the hiring manager round.',
        'Generic system design. Amazon expects production-traffic numbers and trade-offs that survive grilling. "I would use a caching layer" is not enough. "I would use a write-through cache because the read-write ratio at 1M req/s is 100:1 and the eventual consistency tolerance is 30 seconds" is.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the leadership principles list. For each one, write a one-line answer to: "what is a real example of me doing this?" 14 lines, 30 seconds each.',
        '15-30 min: Story tagging. Pick your 8-10 best behavioural stories. Tag each one with the 2-3 leadership principles it best demonstrates.',
        '30-50 min: System design refresher. Pick one classic pattern -- URL shortener at scale, distributed counter, read-heavy timeline. Write a one-page memo with concrete numbers.',
        '50-65 min: Coding warm-up. Two medium-hard LeetCode problems with edge case discussion. Time them.',
        '65-75 min: Bar-raiser drill. Pick your two weakest stories. Have someone (or yourself, out loud) ask 5 follow-up questions on each. Drill the answers.',
        '75-80 min: Close. One leadership principle you will lead with, one specific Amazon decision you would change, one question for the bar-raiser that proves you have read recent shareholder letters.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Amazon remote in 2026?' },
      { type: 'p', text: 'Hybrid. 5 days a week in office for most engineering roles since 2024 RTO mandate. Some senior roles open to fully remote, but rare. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-to-top of FAANG. RSU vesting backloaded (5/15/40/40 historically, now 33/33/33/0 for some bands). London base lags Seattle by ~25%.' },
      { type: 'h3', text: 'How seriously do they take the leadership principles?' },
      { type: 'p', text: 'Very. They are not decoration. They drive the rubric, the bar-raiser feedback, and the offer-debrief discussion. Treat them as engineering requirements, not corporate slogans.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including FAANG loops where the JD does not tell you which leadership principles the team is filtering for. Free at aimvantage.uk.' },

      { type: 'p', text: 'Amazon\'s SDE bar in 2026 has not moved. The candidates who get through prep 8-10 stories with real failures, tag each to a principle, and survive the bar-raiser by being specific instead of polished. Skip the rehearsed-STAR pattern -- it has not worked since 2018.' },
    ],
  },
];
