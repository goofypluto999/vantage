// 3 more interview-guide posts -- batch 19
// DoorDash (delivery + logistics), Workday (enterprise HR + ATS), Etsy (UK-friendly ecom).

import type { BlogPost } from './blogPosts';

export const newBlogPosts19: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) DOORDASH SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'doordash-software-engineer-interview-2026',
    title: 'DoorDash software engineer interview: the post-merchant-platform 2026 loop',
    description: 'The DoorDash software engineer interview in 2026 -- five stages, the post-merchant-platform expansion, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['DoorDash', 'Software Engineer Interview', 'Logistics', 'Marketplaces', 'Real-time Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'DoorDash expanded beyond food into broader retail + logistics in 2024-25. The 2026 engineer loop tests for marketplace + real-time-logistics depth + comfort with the consumer + merchant + dasher three-sided market.',
    hook: 'DoorDash runs a three-sided marketplace (consumers, merchants, dashers) with real-time logistics constraints most candidates underestimate.',
    sections: [
      { type: 'p', text: 'DoorDash (NASDAQ: DASH) is public, profitable on adjusted free cash flow, and expanded significantly beyond food delivery into broader retail (Wolt acquisition, DashMart, Storefront) since 2024. The engineering team is hiring across the consumer app, the merchant platform (Storefront, Wolt POS integrations), the Dasher app, the logistics + dispatch platform, the ad platform, and the new AI agent layer for customer service. The 2026 hiring bar is high but specific: marketplace reasoning across THREE sides (consumer / merchant / dasher), real-time logistics (city-block-level dispatch), and a calibrated take on the broader-retail expansion.' },

      { type: 'h2', text: 'The DoorDash SWE process -- 5 stages, ~5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why DoorDash, why this team. They will probe whether you have a real opinion on the three-sided market.',
        'Phone screen -- 60 minutes. Live coding (Kotlin / Java for backend; Swift / Kotlin for mobile; Python / Go for ML / data tooling).',
        'Onsite -- 4-5 rounds, 60 minutes each: 2x coding, 1-2x system design (always logistics or marketplace shaped), 1x behavioural.',
        'System design -- expects real DoorDash primitives. "Design the dispatch algorithm at city-block resolution at peak hour." "Walk me through how DashMart inventory syncs across 5,000 stores in real time."',
        'Hiring committee + team match. 2-3 weeks added beyond onsite.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a consumer places an order at 7pm in NYC. Trace it from order placement to delivery."',
        '"Design the dispatch algorithm matching consumers to dashers in real time at city-block resolution. p99 under 200ms."',
        '"How does DashMart inventory sync across 5,000 stores in real time without overselling?"',
        '"You inherit a feature that affects 0.4% of orders with a 30-second delay in checkout. The cohort is concentrated in suburban areas at peak. First three actions?"',
        '"You disagree with a senior engineer on whether to prioritise dasher utilisation or consumer wait time when they conflict. Argue your side."',
        '"What is your real opinion on the broader-retail expansion strategy? Where is DoorDash right? Where does the food-delivery focus get diluted?"',
        '"Walk me through how you think about the three-sided market trade-off (consumer experience vs merchant economics vs dasher earnings)."',
        '"Tell me about a production incident in real-time / marketplace systems."',
        '"Why DoorDash and not [Uber Eats / Instacart / Wolt-pre-acquisition]?"',
        '"How would you reduce dispatch latency by 30% without degrading allocation quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at DoorDash specifically' },
      { type: 'ol', items: [
        'No three-sided marketplace reasoning. DoorDash is structurally different from a two-sided marketplace. Stories that frame "we improved consumer X" without engaging with merchant + dasher impact get follow-up grilling.',
        'Generic logistics answers. DoorDash expects real-time + geographic reasoning. "I would batch the orders" is not enough. Knowing roughly how route batching, dasher chaining, and dispatch conflict resolution work matters.',
        'No A/B test discipline. DoorDash runs extensive experimentation. Stories without measured outcomes score low. Frame stories with explicit treatment / control / metric impact.',
        'Underestimating dasher / gig-worker context. DoorDash has been heavily scrutinised on dasher earnings + worker-classification regulation. Stories that treat dashers as "the supply side widget" miss the company\'s actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use DoorDash for 15 minutes. Note three friction points + three things you respect. Watch a Dasher app tutorial video to understand the supply-side experience.',
        '15-35 min: Stack drill. Dispatch architecture, route batching algorithm, multi-tenant DashMart inventory sync, the Wolt POS integration boundary, real-time geographic indexing (H3 hex or proprietary). Two minutes per concept.',
        '35-55 min: System design. Pick one of -- dispatch at city-block resolution, DashMart inventory sync, broader-retail integration. Write a one-page memo with three-sided market reasoning.',
        '55-70 min: Story drill. Three behavioural stories with three-sided + A/B-test framing. 200 words each.',
        '70-78 min: Read the most recent DoorDash earnings call summary + the most recent DashMart / broader-retail announcement. Identify three opinions on the strategy.',
        '78-80 min: Close. One opinion on broader-retail strategy, one specific DoorDash decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is DoorDash remote in 2026?' },
      { type: 'p', text: 'Hybrid. SF, NYC, Toronto, Tempe AZ, Sao Paulo. 3 days a week in office for most engineering since 2024 RTO. Some staff+ remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-to-top of FAANG-equivalent. Below FAANG on RSU, competitive on cash. London / Toronto base lags SF by ~25-30%.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including three-sided marketplaces like DoorDash. Free at aimvantage.uk.' },

      { type: 'p', text: 'DoorDash hires engineers who can reason about three-sided marketplaces, ship under A/B-test discipline, and operate with real-time logistics constraints. Prep the dispatch stack, the broader-retail context, and stories with three-sided framing.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) WORKDAY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'workday-software-engineer-interview-2026',
    title: 'Workday software engineer interview: the AI-everywhere 2026 loop',
    description: 'The Workday software engineer interview in 2026 -- five stages, the AI-everywhere + Illuminate platform context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Workday', 'Software Engineer Interview', 'Enterprise HR', 'ATS', 'AI Platform', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Workday powers HR, ATS, finance for half the Fortune 500. The 2026 engineer loop tests for multi-tenant enterprise platform reasoning + comfort with the Illuminate AI-everywhere strategy.',
    hook: 'Workday is the ATS that probably parsed your CV before you got an interview elsewhere. The 2026 engineer interview has its own distinctive enterprise-platform register.',
    sections: [
      { type: 'p', text: 'Workday (NASDAQ: WDAY) is public, profitable, and powers HR, ATS, and finance systems for ~50% of the Fortune 500. The engineering team is hiring across the core Workday platform (multi-tenant Java + their proprietary Object Management Service), the Illuminate AI platform (their gen-AI strategy launched 2024), the Adaptive Planning finance product, and the new agent platform for HR / recruiter automation. The 2026 hiring bar is high but specific: multi-tenant enterprise-platform depth, comfort with the proprietary OMS framework, and a calibrated take on the Illuminate AI-everywhere strategy in regulated HR contexts.' },

      { type: 'h2', text: 'The Workday SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Workday, why this team. They will probe whether you understand multi-tenant enterprise-platform context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the Illuminate / AI-everywhere register.',
        'Technical screen -- 60 minutes. Live coding (Java is the strong default; some Python / Go for ML / data services).',
        'System design -- 60 minutes. Real Workday-shaped scenarios. "Design Workday\'s ATS resume-parsing pipeline at 10M CVs/day across 50K customers." "Walk me through how Workday isolates customer data across 10K shared-tenant instances." "Design Illuminate-driven candidate matching for an enterprise customer with 100K open requisitions."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how Workday\'s ATS parses a CV when a candidate applies. What goes wrong? What signals get extracted?"',
        '"Design the ATS resume-parsing pipeline at 10M CVs/day across 50K customers."',
        '"How does Workday isolate customer data across shared multi-tenant instances? What happens if a tenant\'s query is malformed?"',
        '"You are designing Illuminate-driven candidate matching at scale. Walk me through the architecture + the human-in-the-loop boundary."',
        '"You inherit a feature that affects 0.05% of customer transactions with an audit-trail discrepancy. The cohort is enterprise customers in financial services. First three actions?"',
        '"You disagree with a senior engineer on whether to ship an Illuminate AI feature behind a customer-opt-in flag or as default-on. Argue your side."',
        '"What is your real opinion on Illuminate? Where is Workday right? Where does the AI-everywhere strategy hit its limits in regulated HR?"',
        '"Walk me through the most subtle bug you have hit in multi-tenant enterprise systems."',
        '"Why Workday and not [SAP SuccessFactors / Oracle HCM / a pure-AI HR startup]?"',
        '"How do you reason about engineering trade-offs in a regulated context (Equal Employment Opportunity, GDPR Article 22 automated decision-making)?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Workday specifically' },
      { type: 'ol', items: [
        'Underestimating multi-tenant enterprise complexity. Workday runs 10K+ customer instances on a shared platform. "I would shard by customer" is not enough — Workday\'s actual approach is more nuanced (object-graph isolation in OMS). Generic answers go shallow.',
        'No regulated-HR awareness. Equal Employment Opportunity, GDPR Article 22 (automated decision-making), bias-in-hiring regulation are real constraints on what Illuminate can ship. "Just ship it" without engaging with the constraint set fails.',
        'Generic AI takes. Workday has a specific Illuminate strategy. Coming with a "AI is going to change everything" take signals you have not done the homework.',
        'Underestimating the proprietary stack. Workday\'s OMS (Object Management System) is a distinctive in-house framework. Stories that frame "I would just use [popular framework]" miss why OMS exists. Calibrated take: "OMS\'s strengths in audit-trail + data-isolation justify staying on it for core HR; greenfield consumer-facing Illuminate features could justify a more standard stack."',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Workday investor day summary + the most recent Illuminate announcement. Identify three opinions on the AI-everywhere strategy.',
        '15-35 min: Stack drill. Workday OMS architecture, multi-tenant isolation strategy, Illuminate platform integration patterns, the ATS resume-parser internals, Adaptive Planning model architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- ATS parsing at scale, multi-tenant isolation, Illuminate matching pipeline. Write a one-page memo with regulated-HR constraints baked in.',
        '55-70 min: Story drill. Three stories with multi-tenant + regulated + audit-trail framing. 200 words each.',
        '70-78 min: Regulatory primer. EEOC guidance on automated employment decision-making, GDPR Article 22, NYC Local Law 144 (bias audit), EU AI Act high-risk systems. Two minutes per concept.',
        '78-80 min: Close. One opinion on Illuminate + regulated AI, one specific Workday decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Workday remote in 2026?' },
      { type: 'p', text: 'Hybrid. Pleasanton CA HQ, Atlanta, Dublin, Bangalore major hubs. 3 days a week in office for most engineering since 2024 RTO. Some staff+ remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise SaaS. Below FAANG on cash, competitive on RSU + benefits. Pleasanton base lags SF by ~10-15%.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in major hubs. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including multi-tenant enterprise platforms like Workday. Free at aimvantage.uk.' },

      { type: 'p', text: 'Workday hires engineers who can reason about multi-tenant enterprise platforms, navigate regulated-HR constraints, and engage with the Illuminate AI strategy honestly. Prep the OMS context, the regulatory framework, and a calibrated take on AI-everywhere in regulated workflows.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) ETSY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'etsy-software-engineer-interview-2026',
    title: 'Etsy software engineer interview: the post-Reverb-divestiture 2026 loop',
    description: 'The Etsy software engineer interview in 2026 -- five stages, the post-Reverb-divestiture refocus, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Etsy', 'Software Engineer Interview', 'E-commerce', 'Marketplaces', 'Visual Search', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Etsy refocused on the core handmade marketplace after divesting Reverb in 2024. The 2026 engineer loop tests for marketplace + visual-search depth + comfort with the post-divestiture register.',
    hook: 'Etsy refocused after Reverb + Depop reshuffle. The 2026 interview filters for whether you can ship for the handmade-creator marketplace without overcomplicating it.',
    sections: [
      { type: 'p', text: 'Etsy (NASDAQ: ETSY) is public, refocused on the core handmade + vintage marketplace after divesting Reverb in 2024 (the music-instruments marketplace), and operates Depop as a separate fashion-focused marketplace. The engineering team is hiring across the core Etsy.com platform (PHP / Hack heritage migrating to Java / Python), search + recommendations (heavy ML / visual search), the seller platform (POS, ads, analytics), and the new gen-AI tools for sellers (product photo enhancement, listing optimisation). The 2026 hiring bar is high but specific: marketplace reasoning, comfort with the post-Reverb-divestiture refocus, and a real take on the small-seller-economy (most sellers are individuals or micro-businesses).' },

      { type: 'h2', text: 'The Etsy SWE process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Etsy, why this team. They will probe whether you have used Etsy seriously and care about the small-seller-economy.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-divestiture register.',
        'Technical screen -- 60 minutes. Live coding (PHP / Hack for legacy parts; Java / Python / TypeScript for newer services).',
        'System design -- 60 minutes. Real Etsy-shaped scenarios. "Design search at 100M+ items with sub-200ms p99." "Walk me through how Etsy ranks listings personalised to the buyer\'s past favorites." "Design the seller dashboard with real-time orders + inventory + ad performance."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how Etsy\'s search ranks 100M+ items for a buyer\'s query."',
        '"Design search at 100M items, sub-200ms p99 with personalisation. Walk me through the architecture."',
        '"How does Etsy handle a seller listing with a typo in the description that affects search retrieval? What corrective signals fire?"',
        '"You are designing the gen-AI tool that auto-generates listing descriptions from product photos. Walk me through it."',
        '"You inherit a feature that 0.3% of buyers hit a checkout error on. The cohort is concentrated on mobile in non-US markets. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a feature that increases conversion 1% but makes search less surprising for buyers who specifically came for unique handmade items. Argue your side."',
        '"What is your real opinion on the post-Reverb-divestiture refocus? Where is Etsy right? Where is the strategy under-executing?"',
        '"Walk me through the most subtle bug you have hit in marketplace systems."',
        '"Why Etsy and not [Amazon Handmade / Pinterest Shopping / a pure-marketplace startup]?"',
        '"How do you reason about engineering trade-offs that affect small sellers (most are individuals) vs the handful of larger sellers who drive a disproportionate share of GMV?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Etsy specifically' },
      { type: 'ol', items: [
        'Generic e-commerce framing. Etsy is structurally different from Amazon (handmade-creator focused, mostly individual sellers). Stories framed for generic e-commerce miss the small-seller-economy register.',
        'Underestimating the legacy stack. Etsy has a substantial PHP / Hack heritage. "I would just rewrite it in Go" misses why the legacy stack still works at scale. Calibrated take: "I would invest in incremental migration paths language-by-language with explicit ROI thresholds, not greenfield rewrite."',
        'No opinion on AI-for-sellers. Etsy has shipped specific gen-AI tools for sellers (product photo enhancement, listing description). Coming without an opinion on whether this helps or homogenises the marketplace signals you have not done the homework.',
        'Underestimating values + culture round. Etsy runs a strong values culture (small-seller advocacy, sustainability, work-life balance). Have specific stories tied to these values.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Etsy for 15 minutes. Buy something (or get to checkout). Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Etsy search + ranking architecture, the PHP / Hack legacy + Java migration boundaries, visual-search system, recommendation pipeline, seller-platform integrations (POS, ads). Two minutes per concept.',
        '35-55 min: System design. Pick one of -- search at scale, AI-driven listing generation, seller dashboard real-time updates. Write a one-page memo with small-seller-economy framing.',
        '55-70 min: Story drill. Three stories tied to Etsy values (small-seller, sustainability, work-life). 200 words each.',
        '70-78 min: Read the Etsy engineering blog (codeascraft.com). Identify one specific opinion on the architecture choices.',
        '78-80 min: Close. One opinion on AI-for-sellers, one specific Etsy decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Etsy remote in 2026?' },
      { type: 'p', text: 'Mostly remote within US since 2020. Brooklyn HQ, Dublin (EMEA), Toronto. Some senior+ roles preference Brooklyn / Dublin in-person. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-of-market for senior engineers. Below FAANG on cash + RSU; competitive on benefits + work-life balance.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in Brooklyn / Dublin. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including small-seller-economy marketplaces like Etsy. Free at aimvantage.uk.' },

      { type: 'p', text: 'Etsy hires engineers who can reason about marketplace systems with small-seller-economy framing, navigate the PHP / Hack legacy, and engage with the AI-for-sellers thesis honestly. Prep the search + recommendation stack, the post-divestiture context, and a calibrated take on AI tools for individual creators.' },
    ],
  },
];
