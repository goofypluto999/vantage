// 3 long-tail SEO posts -- batch 4, drafted 2026-05-10
// High-volume search verticals: fintech IPO (Klarna), design (Canva), no-code (Airtable).
// Append the objects below into the `blogPosts` array in `blogPosts.ts`.

import type { BlogPost } from './blogPosts';

export const newBlogPosts4: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) KLARNA SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'klarna-software-engineer-interview-2026',
    title: 'Klarna software engineer interview: the post-IPO 2026 loop',
    description: 'The Klarna software engineer interview in 2026 -- five stages, the post-IPO AI-first restructure, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Klarna', 'Software Engineer Interview', 'Fintech', 'AI Hiring', 'Interview Prep', 'Stockholm', 'Tech Hiring'],
    excerpt: 'Klarna IPO\'d in September 2025, cut 700 roles via AI replacement, and is now hiring engineers under a "do more with fewer humans" mandate. The loop has changed accordingly.',
    hook: 'Klarna told the public it had replaced 700 customer service reps with AI before its IPO. The engineering interview now tests for whether you can ship at that operating tempo.',
    sections: [
      { type: 'p', text: 'Klarna priced its IPO at $40 in September 2025 on the NYSE under KLAR. Sebastian Siemiatkowski has been explicit that the company is structurally smaller -- around 3,500 employees down from a peak of ~7,000 -- and that the AI-first restructure is permanent. The engineering team has been hiring through 2026, but the bar is higher and the questions reflect the new operating model. The Stockholm HQ still does most senior hiring; remote roles exist for staff and principal levels.' },

      { type: 'h2', text: 'The Klarna engineering process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Klarna, why now. Light technical filter -- they will probe whether you have followed the post-IPO trajectory.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the "ship at small-team velocity" register. Often paired with a small product critique.',
        'Coding -- 60 minutes. Live or take-home. Backend roles get a payments-shaped problem (idempotency, retry semantics, partial failure). Frontend roles get a checkout-flow polish problem.',
        'System design -- 60 minutes. Real Klarna-shaped scenarios. "Design the BNPL credit decision pipeline at 1,000 TPS." "How do you reconcile a payment that the merchant says succeeded and the bank says failed?" "Design the AI agent that replaces a tier-1 customer service queue."',
        'Onsite or final loop -- 3-4 rounds: deeper system design, behavioural / values, cross-functional, and a leadership round (often a VP or higher).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how a BNPL transaction settles. Where does the money actually move and when?"',
        '"You are designing the credit decision engine for a new market. 800ms p99 budget. Walk me through the architecture."',
        '"A merchant tells us they are missing $12,000 of expected payouts last week. First three things you check?"',
        '"You disagree with a senior engineer on whether to ship a feature behind a flag or as a canary. Argue your side for 5 minutes."',
        '"We replaced 700 CS roles with AI. Where do you think we drew the line wrong, if anywhere? Be specific."',
        '"Pick a Klarna product surface. Tell me three things you would change. Defend each."',
        '"Walk me through the most ambiguous engineering decision you owned. What did you commit to with incomplete data?"',
        '"What is wrong with our developer documentation? Be specific. We can pull it up."',
        '"Why Klarna and not Stripe, Adyen, or Revolut?"',
        '"Tell me about a production incident in payments where you owned the RCA. What did the postmortem look like?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Klarna specifically' },
      { type: 'ol', items: [
        'No payments domain reasoning. You do not need 5 years in fintech, but you need to be able to reason about idempotency, exactly-once vs at-least-once, settlement vs authorisation, and what "money moved" actually means at the bank level. Read the Stripe docs glossary cold if you need to.',
        'Generic AI takes. Klarna has gone further than almost any peer on AI-first operations. "AI is going to change everything" is a non-answer. "I would not have replaced complaints handling -- the false-positive cost on a refund dispute is too high" is a calibrated answer.',
        'Missing the post-IPO register. You are joining a public, smaller, faster company. Stories about how you ran 12-person committees do not land. Stories about how you shipped end-to-end as the only owner do.',
        'Underestimating the values round. Klarna has a reputation for direct, sometimes blunt, internal culture. Polished corporate-speak gets flagged. They want opinions, not slogans.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Q4 2025 earnings call summary and the most recent klarna.com/global/press post. Write down three opinions you have on the post-IPO trajectory.',
        '15-35 min: Payments fundamentals refresher. Idempotency, settlement vs authorisation, ACH vs card vs SEPA, BNPL credit-decision flow. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- BNPL credit decision pipeline, payment reconciliation, AI agent replacing tier-1 CS. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Three engineering stories -- ambiguous decision, payments incident, technical disagreement resolved. 200 words each, tight.',
        '70-80 min: Product audit. Open klarna.com and the Klarna app. Note three friction points. Open the developer docs. Note one thing that is wrong or unclear.',
        '80-85 min: Close. One opinion on the AI-first restructure, one specific Klarna decision you would change, one question for the hiring manager that proves you read the latest earnings call.',
      ] },

      { type: 'h2', text: 'On Stockholm vs remote' },
      { type: 'p', text: 'Most senior engineering roles still want Stockholm presence at least 2-3 days a week. Some staff and principal roles are open across EU timezones. Confirm with the recruiter early -- it is the single most common late-stage friction point.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'How is Klarna paying in 2026?' },
      { type: 'p', text: 'Mid-to-top of European market. Stockholm base salaries are competitive with London but lag SF significantly. Equity is publicly traded now -- liquid, but tied to share price.' },
      { type: 'h3', text: 'Will they sponsor a UK or US visa?' },
      { type: 'p', text: 'Sweden EU work authorisation: yes for most roles. UK or US relocation: rarely, role-dependent.' },
      { type: 'h3', text: 'Is Klarna still cutting headcount?' },
      { type: 'p', text: 'Not actively as of Q1 2026 -- Siemiatkowski has signalled the restructure is largely complete. Hiring is selective rather than aggressive.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-IPO fintech with shifting bars like Klarna. Free at aimvantage.uk.' },

      { type: 'p', text: 'Klarna hires engineers who can ship in payments at small-team velocity, hold a calibrated AI opinion, and operate with public-company rigour. Prep the payments fundamentals, the post-IPO context, and a real opinion on where they have drawn the AI line.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) CANVA PRODUCT MANAGER
  // -------------------------------------------------------------------
  {
    slug: 'canva-product-manager-interview-2026',
    title: 'Canva product manager interview: the AI-suite 2026 loop',
    description: 'The Canva product manager interview in 2026 -- six stages, the AI-suite expansion (Magic Studio, Affinity), real questions, the values round, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Canva', 'Product Manager Interview', 'Design Tools', 'AI Hiring', 'Interview Prep', 'Sydney', 'Tech Hiring'],
    excerpt: 'Canva is private, profitable, has 230M+ monthly users, owns Affinity, and is shipping AI features at speed. The PM bar tests for product judgement at consumer scale plus a real opinion on AI in creative tools.',
    hook: 'Canva is one of the few growth-stage tech companies that has never raised a funding round it needed. The PM loop reflects that confidence -- they are not desperate to hire you.',
    sections: [
      { type: 'p', text: 'Canva is privately valued at ~$32B, has been profitable for years, owns Affinity (acquired 2024), and ships Magic Studio plus a growing AI-feature suite on top of the core editor. The Sydney HQ does most senior PM hiring; satellite offices in Manila, Beijing, Austin, London. They hire deliberately and the loop is on the longer side -- 6-8 weeks from screen to offer is common.' },

      { type: 'h2', text: 'The Canva PM process -- 6 stages, ~6-8 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Canva, why this team. They explicitly probe whether you have used Canva recently and seriously.',
        'Hiring manager interview -- 60 minutes. Past PM work, scope, the consumer-scale judgement they are filtering for.',
        'Product case -- 60 minutes. Often Canva-shaped: "Design a workflow for a small business owner who has 6 minutes to ship a social media campaign." "Critique Magic Studio. Where does the abstraction break for a non-designer?"',
        'Take-home or async exercise -- some teams. Roughly 4-6 hours of expected work. A small PM problem with a write-up.',
        'Onsite loop -- 3-4 rounds: product sense, execution and metrics, cross-functional collaboration, and the values round (heavy at Canva -- they care).',
        'Founders or executive -- 30-45 minutes for senior+ roles. Cliff Obrecht or a VP+. Strategy questions, opinions, calibrated debate.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Canva right now. Pick one workflow. Tell me three things you would change."',
        '"A 14-year-old in Indonesia making content for her TikTok. A 52-year-old small business owner in Manchester making a flyer. Walk me through where their Canva experiences should diverge and where they should not."',
        '"Magic Studio promised one-click brand generation. It does not deliver consistently. PM the fix."',
        '"You inherit Canva Docs. It is fighting Notion, Google Docs, and now ChatGPT in a feature-parity war it cannot win on features. Strategy?"',
        '"Tell me about a launch you ran. Now tell me what you would do differently with the AI tooling that did not exist when you ran it."',
        '"You disagree with a designer on a flow change. PR is open. How do you handle the next 24 hours?"',
        '"Canva is one of the most-used products in the world by raw user count. Pick a metric we are probably gaming and tell me how to fix it."',
        '"What is wrong with our pricing page? Be specific. We can pull it up."',
        '"Why Canva and not Figma, Adobe, or Notion?"',
        '"You have one feature you can ship next quarter to grow paid conversion by 5%. What is it and why?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Canva specifically' },
      { type: 'ol', items: [
        'Not using Canva. The number one filter. They will ask you to use the product live. If you have not opened it in 2 months, this round is over in 3 minutes. Use it for 30 minutes the day before, on something real.',
        'Generic consumer PM answers. "I would A/B test it" is not a Canva answer. They want product judgement informed by their specific scale -- 230M monthly users, 100+ languages, freemium-to-paid conversion as the only metric that ultimately matters.',
        'Underestimating the values round. Canva runs a values round explicitly. "Be a force for good." "Set crazy big goals." "Pursue excellence." If you cannot tie a real story to each value, the round goes badly. They are not hiring people who treat values as decoration.',
        'Missing the AI calibration. Canva has shipped AI features but has been deliberately conservative compared to Figma or Adobe. "Ship more AI faster" without a specific take on what to ship and why does not land. They want opinions, not enthusiasm.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-30 min: Use Canva. Make one social media graphic, one document, one presentation. Note three friction points. Note three delights.',
        '30-50 min: Read canva.com/newsroom for the most recent two posts. Read one post on the Canva blog about a recent launch. Write down three opinions.',
        '50-65 min: Product case. Pick one of -- Magic Studio fix, Canva Docs strategy, freemium-to-paid conversion lever. Write a one-page memo. Numbers, trade-offs, one thing you would not build.',
        '65-80 min: Story drill. Four PM stories tied to Canva values -- big goal, customer obsession, force for good, excellence. 200 words each.',
        '80-85 min: Stack and team brief. Read the Canva engineering blog so you can speak to scale and velocity.',
        '85-90 min: Close. One opinion on AI in creative tools, one specific Canva decision you would change, one question for the hiring manager that proves you have used the product.',
      ] },

      { type: 'h2', text: 'On Sydney' },
      { type: 'p', text: 'Most senior PM roles want Sydney presence. Some are remote-friendly within Australia or the wider APAC region. Manila, Beijing, Austin, and London offices exist but most senior PM hiring still funnels through Sydney. Confirm at the recruiter screen.' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of Sydney market, mid-of-market by SF standards. Equity meaningful given the late-private valuation -- typically vests over 4 years.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in Australia. Other locations are local hires only.' },
      { type: 'h3', text: 'Is Canva remote?' },
      { type: 'p', text: 'Hybrid. 2-3 days a week in office for most senior roles. Some PM roles fully remote within country. Confirm with the recruiter.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role. Useful for consumer-scale PM loops where the JD undersells how much product judgement they actually filter for. Free at aimvantage.uk.' },

      { type: 'p', text: 'Canva PM hiring is deliberate. They are not in a rush. The candidates who get through have used the product seriously, hold real opinions on AI in creative tools, and can tie every story to a value without sounding rehearsed. Prep accordingly.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) AIRTABLE PRODUCT ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'airtable-product-engineer-interview-2026',
    title: 'Airtable product engineer interview: the AI-platform 2026 loop',
    description: 'The Airtable product engineer interview in 2026 -- five stages, the Cobuilder + AI agent platform pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Airtable', 'Product Engineer Interview', 'No-Code', 'AI Platform', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Airtable pivoted hard to AI in 2024-25 with Cobuilder and the agent platform. The product engineer loop now filters for whether you can build user-facing AI features -- not just no-code workflows.',
    hook: 'Airtable\'s pitch in 2026 is no longer "spreadsheets but better." It is "the platform every business builds its AI agents on." The interview loop has changed underneath that pivot.',
    sections: [
      { type: 'p', text: 'Airtable is private, has shipped Cobuilder (AI app generator) and the AI agent platform, and is hiring product engineers under a different mandate than it was 18 months ago. The bar is high but specific: can you build user-facing AI features with real latency, error-handling, and trust constraints? Generic full-stack experience is not enough.' },

      { type: 'h2', text: 'The Airtable product engineer process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Airtable, why now. They will probe whether you have used Cobuilder.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the product engineer register (someone who can design + ship + judge trade-offs).',
        'Coding -- 60 minutes live or take-home. Front-of-stack problem -- usually React-shaped, sometimes with an AI integration layer.',
        'System design -- 60 minutes. Real Airtable-shaped scenarios. "Design Cobuilder\'s prompt-to-app generation pipeline." "Walk me through how an AI agent should handle a multi-step Airtable record update with partial failures."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, product / craft round, values / cross-functional.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Cobuilder right now. Build me a CRM for a 3-person consultancy. Talk through what you change in the prompt."',
        '"A user types \'build me an inventory tracker.\' We generate something they hate. PM and engineer the recovery flow."',
        '"You are building an AI agent that updates 50 Airtable records as part of a workflow. Record 23 fails. What does the user see?"',
        '"What is wrong with our developer documentation? We can pull it up."',
        '"Walk me through the most ambiguous front-end decision you have owned. What did you commit to with incomplete data?"',
        '"You disagree with a designer on the empty state for Cobuilder. PR is open. Next 24 hours?"',
        '"Why Airtable and not Notion, Linear, or Coda?"',
        '"Pick one Airtable feature. Tell me how you would teach an AI agent to use it well."',
        '"Tell me about a production bug you owned end-to-end. What did the postmortem look like?"',
        '"What is the smallest feature you have shipped that you are most proud of?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Airtable specifically' },
      { type: 'ol', items: [
        'Not using Cobuilder. Same filter as Canva. If you have not used the AI features in 2 months, the recruiter screen is the end of the line. Spend 30 minutes building something the day before.',
        'Generic AI takes. Airtable has shipped a real AI agent platform with real customer trust constraints. "Just use GPT-4" is not an answer. "I would constrain the agent to write-after-confirmation for any destructive op below confidence X" is.',
        'Underestimating the product engineer register. They do not want a backend specialist or a frontend specialist. They want someone who can design a feature, ship the slice, judge the trade-offs, and write a clear post-mortem when it goes sideways.',
        'No real opinion on platform vs application. Airtable is straddling both. Candidates who do not have a calibrated take on which side they want to work get filtered.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open Cobuilder. Build something. 10 prompts of edits. Note three friction points and three delights.',
        '15-30 min: Stack drill. React, TypeScript, GraphQL, Postgres, Airtable\'s own API. Two minutes per concept -- one sentence on how Airtable uses it, one on what is interesting about its scale.',
        '30-50 min: System design. Pick one of -- prompt-to-app pipeline, agent partial-failure handling, large-table query performance. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '50-65 min: Story drill. Three product engineer stories -- ambiguous decision, designer disagreement, user-facing AI feature. 200 words each.',
        '65-75 min: Product audit. Open Airtable. Open Cobuilder. Note three things to change. Open the API docs. Note one thing that is wrong.',
        '75-80 min: Close. One opinion on AI agents, one specific Airtable decision you would change, one question for the hiring manager that proves you have used Cobuilder.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Airtable remote?' },
      { type: 'p', text: 'Hybrid. SF and NYC for most senior product engineering roles. Some staff+ roles open to fully remote in US timezones.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the stage. Equity meaningful at late-private valuation. London base salaries lag SF by 25-30% if remote-from-UK is offered.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Selectively for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-platform pivots like Airtable where the JD lists products that did not exist 18 months ago. Free at aimvantage.uk.' },

      { type: 'p', text: 'Airtable\'s product engineer bar in 2026 is high but specific: ship user-facing AI features, hold a calibrated take on agents, and operate as a designer-engineer hybrid. Use Cobuilder for 30 minutes the day before and you are already ahead of 70% of candidates.' },
    ],
  },
];
