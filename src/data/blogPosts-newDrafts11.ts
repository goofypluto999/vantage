// 3 high-volume FAANG/enterprise interview-guide posts -- batch 11, drafted 2026-05-10
// Google, Meta, Salesforce. Massive search volume + the laid-off-cohort
// ICP (Meta cut 8k in April 2026 specifically).

import type { BlogPost } from './blogPosts';

export const newBlogPosts11: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) GOOGLE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'google-software-engineer-interview-2026',
    title: 'Google software engineer interview: the post-Gemini 2026 loop',
    description: 'The Google software engineer interview in 2026 -- five stages, the Gemini-era technical bar, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Google', 'Software Engineer Interview', 'FAANG', 'Distributed Systems', 'Interview Prep', 'Gemini', 'Tech Hiring'],
    excerpt: 'Google\'s SWE loop in 2026 still runs the classic 4 onsite rounds plus Googleyness, but the bar has shifted around Gemini-era thinking. The leetcode-only prep approach loses more rounds than it wins now.',
    hook: 'Google\'s SWE bar in 2026 has not lowered — it has shifted. Candidates who prep only for leetcode-medium and ignore the Gemini-era system design context lose rounds they would have won in 2023.',
    sections: [
      { type: 'p', text: 'Google has been hiring through 2026 across cloud, search, ads, YouTube, Android, and the AI products group built around Gemini. The classic 5-stage process is intact (recruiter screen, phone screen, 4 onsite + lunch). What changed: the system design round now expects Gemini-era reasoning (multi-modal serving, agent infrastructure, prompt-injection mitigation), and Googleyness has compressed into a more structured rubric.' },

      { type: 'h2', text: 'The Google SWE process -- 5 stages, ~6-8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Google, why this team. Confirm location + level expectation. They will probe lightly on technical depth.',
        'Phone screen -- 45 minutes. One coding problem (Leetcode-medium-to-hard). Modern emphasis on edge cases, complexity analysis, "what would change if we 10x scaled this".',
        'Onsite -- 4 rounds, 45 minutes each: 2x coding, 1x system design (or coding + design hybrid for L4-), 1x behavioural / Googleyness.',
        'Lunch interview -- 30-45 minutes. Casual; not formally graded but feedback loops back. Treat as informal but not as zero-stakes.',
        'Hiring committee + team match. Hiring committee reviews packet (NOT the interviewers). Team match is separate; some candidates pass HC but not team match. Expect 3-4 weeks total.',
      ] },
      { type: 'p', text: 'Average end-to-end is 6-8 weeks. AI products org has compressed to 4-5 weeks for L5+ as of early 2026.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Code: given a stream of integers, design a data structure that supports insert(x), getMedian() in O(log n)."',
        '"Code: implement an LRU cache. Now extend it to be thread-safe with minimal lock contention."',
        '"Design Gemini\'s inference serving layer at 1M QPS, p99 under 100ms, with model swapping."',
        '"Design YouTube\'s recommendation pipeline at 2B daily active users."',
        '"You are designing a search index that needs to be updated every 30 seconds. Walk me through the architecture."',
        '"How would you handle prompt-injection attacks at scale on a multi-modal Gemini endpoint?"',
        '"Walk me through the most ambiguous engineering decision you have owned."',
        '"Tell me about a time you disagreed with a manager. What did you do?"',
        '"Why Google over [Meta / Anthropic / OpenAI]? Be specific."',
        '"Describe Googleyness in your own words. Then tell me about a time you exemplified it."',
      ] },

      { type: 'h2', text: 'What kills candidates at Google specifically' },
      { type: 'ol', items: [
        'Leetcode-only prep. Candidates who grind 200 leetcode-mediums but do not engage with system design at the post-Gemini level lose at least one round of the onsite. The bar has shifted.',
        'Generic system design answers. "I would use a load balancer + microservices" is 2018-era. 2026 expects you to reason about specific Google primitives — Spanner consistency models, Borg/Kubernetes scheduling, or the inference-serving stack used internally for Gemini.',
        'Googleyness blanks. The behavioural round has structured questions and trained interviewers. Stories about "a time you collaborated" need real metrics + specific moments. "I worked well with the team" = 30/100 score.',
        'Underestimating the lunch round. Pitched as casual; some candidates have been filtered out at this stage. Stay calibrated, do not vent about previous employers, do not get drunk if alcohol is involved (rare but happens).',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Code drill. Two leetcode-medium problems with edge case discussion. Time them under 25 min each.',
        '20-40 min: System design. Pick one of -- Gemini inference serving, YouTube recommendation pipeline, real-time search index. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '40-55 min: Stack drill. Spanner consistency, Borg scheduling, Bigtable, Pub/Sub, the Gemini multi-modal serving abstraction. Two minutes per concept.',
        '55-70 min: Story drill. Three behavioural stories (ambiguous decision, manager disagreement resolved, team conflict). 200 words each, drilled out loud.',
        '70-80 min: Googleyness. Read the most recent leadership note from Sundar / Demis / James Manyika. Identify one thing you have a real opinion on. The behavioural round expects you to ground Googleyness in current company strategy, not abstract values.',
        '80-85 min: Close. One opinion on Gemini direction, one specific Google decision you would change, one question for the team-match interviewer.',
      ] },

      { type: 'h2', text: 'On hiring committee vs team match' },
      { type: 'p', text: 'Two distinct gates. Hiring committee reviews your packet (anonymised, no interviewer present); they decide if you are HIREABLE at Google generally. Team match is a separate later stage where specific teams pull HC-passed candidates. Some candidates pass HC but never team match — usually because their stated team preferences are oversaturated. State broad preferences in the recruiter screen.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Google remote in 2026?' },
      { type: 'p', text: 'Hybrid. 3 days a week in office for most engineering roles since the 2024 RTO mandate. Some staff+ roles open to fully remote in cases. London, Mountain View, Zurich, NYC are major hubs. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG. London base lags Mountain View by ~25-30%. Equity (GSU) meaningful at every level.' },
      { type: 'h3', text: 'How long does the loop take end-to-end?' },
      { type: 'p', text: '6-8 weeks typical. AI products org runs 4-5 weeks for L5+. The hiring-committee + team-match stages add 3-4 weeks beyond the onsite.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including Google. Free at aimvantage.uk.' },

      { type: 'p', text: 'Google\'s SWE bar in 2026 has shifted, not lowered. Engage with Gemini-era system design, ground Googleyness in current strategy, and survive the lunch round. The candidates who get through prep both leetcode AND the AI-product reasoning the company hires for.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) META SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'meta-software-engineer-interview-2026',
    title: 'Meta software engineer interview: the post-Layoffs 2026 loop',
    description: 'The Meta software engineer interview in 2026 -- five stages, the AI-pivot context after the April 8k layoff, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Meta', 'Software Engineer Interview', 'FAANG', 'AI Hiring', 'Interview Prep', 'Distributed Systems', 'Tech Hiring'],
    excerpt: 'Meta cut 8,000 in April 2026 to fund AI infrastructure. The SWE loop has tightened around AI/ML adjacency and the IC-level system design round. Generic FAANG prep loses to Meta-specific prep.',
    hook: 'Meta cut 8,000 in April 2026 specifically to fund AI infrastructure. The SWE loop reflects that pivot — AI-adjacent backgrounds get loops faster, and the system design round now expects post-Llama-4 reasoning.',
    sections: [
      { type: 'p', text: 'Meta announced 8,000 cuts on April 17, 2026, with cuts effective May 20. The freed compensation budget is being redirected toward AI research and infrastructure. The SWE loop is unchanged structurally (5 stages) but tightened on two dimensions: AI/ML adjacency in the technical screen, and post-Llama-4 reasoning in system design. The post-layoff hiring is selective — Meta is hiring AI-adjacent SWEs faster than non-AI-adjacent ones, even at the same level.' },

      { type: 'h2', text: 'The Meta SWE process -- 5 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Meta, why this team. They will probe AI/ML adjacency in your background.',
        'Technical screen -- 45 minutes. Live coding (CoderPad). Two problems usually — one Leetcode-medium, one harder. Edge case discussion expected.',
        'Onsite -- 4-5 rounds, 45-60 minutes each: 2x coding, 1-2x system design, 1x behavioural / hiring manager.',
        'System design at IC4+ — explicit AI angle. Even non-AI teams get an AI-adjacent question (e.g. "design Llama-4 fine-tune serving for ad-targeting workloads").',
        'Hiring committee + team match. Similar to Google. 2-3 weeks added beyond onsite.',
      ] },
      { type: 'p', text: 'Total wall-clock 5-7 weeks. AI products group running compressed to 4 weeks for IC5+.' },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Code: given a graph with weighted edges, find the shortest path from A to B."',
        '"Code: implement a rate limiter with sliding window log algorithm."',
        '"Design Instagram\'s feed ranking pipeline at 2B daily active users."',
        '"Design the Llama-4 inference serving layer for ad-targeting workloads. p99 under 50ms."',
        '"You inherit a service that p99 spiked from 200ms to 1.4s overnight. First three actions?"',
        '"Walk me through how you would reduce inference cost for a 70B-parameter Llama fine-tune by 30% without degrading quality."',
        '"Tell me about a time you made a decision with incomplete data."',
        '"Tell me about a time you disagreed with engineering leadership. What did you do?"',
        '"Why Meta and not [Google / Anthropic / OpenAI]? Be specific."',
        '"What is your real opinion on the AI-pivot direction? Where do you think Meta is right? Where is the strategy wrong?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Meta specifically' },
      { type: 'ol', items: [
        'Generic FAANG prep. Meta-internal acronyms (FYI, DRI, PRD, IC4/IC5/IC6, PSC, SRP) are part of the loop. Knowing them is signal; using them well is calibrated. Candidates who treat Meta as "just another FAANG" miss the company-specific framing.',
        'No AI-adjacency angle. Even if your background is non-AI, the system design round expects an AI-adjacent reasoning angle in 2026. "I have not worked on AI before" is a weak answer; "I have not worked on AI directly but I would approach the latency budget for inference like X because Y" is calibrated.',
        'Post-layoff context blanks. The April 8,000 cuts framed the company as "betting on AI". Candidates whose stories sound like 2023-Meta (move-fast, growth-at-all-costs) lose to candidates who frame their work in the post-2024 efficiency-and-AI register.',
        'Underestimating IC4+ system design. The system design round at IC4+ expects you to reason about real Meta-scale traffic with real metrics. "I would use Cassandra" is not enough; you need to know roughly how Meta\'s actual stack would handle the question (TAO, Memcache, Hive, etc.).',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Code drill. Two leetcode-medium-to-hard problems. CoderPad-style execution (no autocomplete in interviews).',
        '20-40 min: System design. Pick one of -- Llama-4 inference serving, Instagram feed ranking, post-2024 ad-targeting pipeline. Write a one-page memo with real Meta-stack primitives (TAO, Memcache, etc.).',
        '40-55 min: Stack drill. TAO graph storage, Memcache architecture, Hive vs Spark internal usage, Llama-4 serving abstraction, A/B test infrastructure (Deltoid). Two minutes per concept.',
        '55-70 min: Story drill. Three behavioural stories with concrete metrics. Practice in the Meta register (impact-driven, IC-ladder-conscious).',
        '70-80 min: AI-adjacency framing. Write a one-paragraph "how my background applies to Meta\'s AI direction" answer. Even if your background is non-AI, find the bridge.',
        '80-85 min: Close. One opinion on the AI pivot, one specific Meta decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'On the layoff context' },
      { type: 'p', text: 'You will probably want to ask about it. Do, but ask it like an adult. "How is the team adapting to the post-April org structure?" lands fine. "Are you going to lay me off?" sounds desperate. They are open about the pivot — the right register is curious and pragmatic.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Meta remote in 2026?' },
      { type: 'p', text: 'Hybrid. 3 days a week in office since 2024 RTO. Menlo Park, Seattle, NYC, London, Tel Aviv major hubs. Some staff+ roles fully remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG, especially on RSU. London base lags Menlo Park by ~30%.' },
      { type: 'h3', text: 'Will they hire ex-FAANG laid-off candidates fast?' },
      { type: 'p', text: 'Yes for AI-adjacent backgrounds. Slower for non-AI-adjacent ex-FAANG, who compete in a saturated pool. Cohort context (laid off in April 2026) does NOT itself fast-track; the AI angle does.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-pivot Meta loops. Free at aimvantage.uk.' },

      { type: 'p', text: 'Meta\'s SWE loop in 2026 favours AI-adjacent backgrounds and post-2024 efficiency framing. Generic FAANG prep loses; Meta-specific prep with AI angle and real stack reasoning wins. Engage with the post-April pivot as a feature, not a worry.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) SALESFORCE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'salesforce-engineer-interview-2026',
    title: 'Salesforce engineer interview: the Agentforce-era 2026 loop',
    description: 'The Salesforce engineer interview in 2026 -- five stages, the post-Agentforce platform pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Salesforce', 'Engineer Interview', 'Enterprise SaaS', 'Agentforce', 'AI Hiring', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Salesforce reorganised hiring around Agentforce in 2024-25. The engineer loop now expects multi-tenant platform reasoning AND a real opinion on AI agents in regulated CRM workflows.',
    hook: 'Salesforce hires engineers who can reason about multi-tenant platform architecture AND AI agents in regulated CRM workflows in the same conversation. Most candidates default to one or the other.',
    sections: [
      { type: 'p', text: 'Salesforce (NYSE: CRM) is public, has 100,000+ enterprise customers, and reorganised significantly around Agentforce since 2024. The engineering team is hiring across core platform, Data Cloud, MuleSoft, Slack, and the Agentforce AI layer. The bar in 2026 is high but specific: multi-tenant platform reasoning at Fortune 500 scale, plus a calibrated take on AI agents in regulated CRM workflows where false-positive costs are real.' },

      { type: 'h2', text: 'The Salesforce engineer process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Salesforce, why this team. They will probe whether you have a real opinion on Agentforce.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency, the post-Agentforce register.',
        'Technical screen -- 60 minutes. Live coding (Java is the strong default; JavaScript/TypeScript for Lightning UI roles). Moderate problem with multi-tenant or platform trade-offs.',
        'System design -- 60 minutes. Real Salesforce-shaped scenarios. "Design Agentforce execution at 10K concurrent agent runs across 50K tenants." "Walk me through how the platform isolates customer data in shared compute." "How does Data Cloud unify identity across customer touchpoints at petabyte scale?"',
        'Onsite or final loop -- 3-4 rounds: deeper coding or design, behavioural / Ohana values round, cross-functional, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how an Agentforce agent would handle a multi-step CRM workflow that spans Sales Cloud, Service Cloud, and an external API. Where does state live?"',
        '"Design Agentforce execution at 10K concurrent agent runs across 50K tenants. Walk me through the architecture."',
        '"You disagree with a senior engineer on whether to gate a destructive Agentforce action behind explicit user confirmation or confidence thresholds. Argue your side for 5 minutes."',
        '"Walk me through how the Salesforce platform isolates customer data in shared multi-tenant compute. What goes wrong if a tenant\'s query is malformed?"',
        '"Pick a Salesforce product surface. Tell me three things you would change."',
        '"Walk me through the most ambiguous engineering decision you have owned."',
        '"What is your real opinion on AI agents in regulated CRM workflows? Where does the false-positive cost outweigh the labour saving?"',
        '"Tell me about a production incident in a multi-tenant system. What did the postmortem look like?"',
        '"Why Salesforce and not Microsoft Dynamics, ServiceNow, or HubSpot?"',
        '"What is wrong with our Agentforce pricing model? Be specific."',
      ] },

      { type: 'h2', text: 'What kills candidates at Salesforce specifically' },
      { type: 'ol', items: [
        'No reasoning on regulated enterprise AI. Salesforce customers operate in heavily regulated industries -- finance, healthcare, government. "AI is going to change everything" is not an answer. "I would not let Agentforce auto-update a sales-stage field because the false-positive cost on a SOX-relevant pipeline event is catastrophic" is calibrated.',
        'Underestimating multi-tenant complexity. Salesforce runs hundreds of thousands of customer orgs on the same platform. "I would shard by org_id" is not enough. "I would shard by org_id + maintain a hot pool for the top 1% by query volume because the long-tail noise pattern would otherwise impact p99 for big customers, and I would route Agentforce agent runs to a separate execution pool because their failure modes differ from API requests" is.',
        'Missing the platform model. Salesforce is not "the CRM". It is a workflow platform that customers extend with custom apps (Apex, Lightning Web Components, Flow). If you cannot reason about the platform / customisation layer trade-offs, the round goes shallow.',
        'Generic STAR stories on the Ohana round. Salesforce runs a values-driven culture (trust, customer success, equality, sustainability, AI). Trained interviewers, structured rubric. Have specific stories tied to each value.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent Marc Benioff keynote summary plus the latest Agentforce blog post. Note three opinions you have on the AI-platform direction.',
        '15-35 min: Stack drill. Salesforce platform architecture (compute, datastore, governor limits), Apex execution model, Lightning component framework, Agentforce LLM integration patterns, Data Cloud / MuleSoft integration boundary, multi-instance vs multi-tenant trade-offs. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Agentforce at scale, multi-tenant Data Cloud query, Apex execution governor pattern. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Four stories tied to Ohana values (trust, customer success, equality, sustainability). 200 words each.',
        '70-78 min: Enterprise / regulated context refresher. SOX, HIPAA, FedRAMP, SOC 2 basics. Salesforce AppExchange security review process basics.',
        '78-80 min: Close. One opinion on Agentforce, one specific Salesforce decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Salesforce remote in 2026?' },
      { type: 'p', text: 'Hybrid. 3 days a week in office since the 2024 RTO. SF, NYC, Indianapolis, Atlanta, London, Dublin, Hyderabad major hubs. Some staff+ roles fully remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise-SaaS market. Below FAANG on cash. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in most markets. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-platform pivots like Salesforce. Free at aimvantage.uk.' },

      { type: 'p', text: 'Salesforce hires engineers who can reason about multi-tenant CRM platform architecture at Fortune 500 scale, hold a calibrated take on AI agents in regulated workflows, and operate with enterprise-SaaS rigour. Prep the platform stack, the Agentforce context, and the regulated-workflow AI trade-offs.' },
    ],
  },
];
