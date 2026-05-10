// 3 more interview-guide posts -- batch 17
// Sentry (observability), Roblox (gaming + AI), Twilio (comm APIs).

import type { BlogPost } from './blogPosts';

export const newBlogPosts17: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) SENTRY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'sentry-software-engineer-interview-2026',
    title: 'Sentry software engineer interview: the post-Codecov 2026 loop',
    description: 'The Sentry software engineer interview in 2026 -- five stages, the post-Codecov platform expansion, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Sentry', 'Software Engineer Interview', 'Observability', 'Error Tracking', 'OpenSource', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Sentry is private, profitable, and expanded into the broader observability + Codecov coverage market. The 2026 engineer loop tests for whether you can ship at the open-source-meets-commercial register.',
    hook: 'Sentry runs one of the most loved error-tracking products in tech. The post-Codecov expansion + open-source-meets-commercial dual register catches most candidates off-guard.',
    sections: [
      { type: 'p', text: 'Sentry is private, profitable, and has expanded significantly through the Codecov acquisition (test coverage / quality observability) since 2024. The engineering team is hiring across the core error-tracking platform (Python / JavaScript / Go), the Codecov coverage product, the new performance monitoring stack, the cron monitoring product, and the open-source SDK ecosystem (50+ language SDKs). The 2026 hiring bar is high but specific: comfort with the open-source-meets-commercial dual register, observability domain depth, and a calibrated take on the Datadog / New Relic / open-source competitive landscape.' },

      { type: 'h2', text: 'The Sentry SWE process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Sentry, why this team. They will probe whether you have used Sentry seriously and have an opinion on the product.',
        'Hiring manager interview -- 45-60 minutes. Past work, scope, the open-source-meets-commercial register.',
        'Technical screen -- 60 minutes. Live coding (Python is the strong default for backend; TypeScript for frontend). Moderate problem.',
        'System design + take-home option -- 60 minutes. Real Sentry-shaped scenarios. "Design error event ingestion at 100K events/sec with deduplication." "Walk me through how Sentry groups stack traces into issues." "Design Codecov\'s coverage diff calculation for a 1M-LOC PR."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when an error event is captured by a Sentry SDK. Trace it through ingestion to grouping to UI."',
        '"Design error event ingestion at 100K events/sec with deduplication and back-pressure."',
        '"How does Sentry group stack traces into issues? What are the failure modes?"',
        '"You are designing the Codecov coverage diff for a 1M-LOC PR. Walk me through the architecture."',
        '"You disagree with a senior engineer on whether to ship a feature only in the commercial product or also open-source the underlying primitive. Argue your side."',
        '"What is your real opinion on the Datadog vs Sentry competitive landscape? Where is Sentry right? Where does Datadog have a structural advantage?"',
        '"Walk me through the most subtle bug you have hit in distributed event processing."',
        '"Tell me about a contribution you have made to an open-source project (any project)."',
        '"Why Sentry and not [Datadog / New Relic / a pure-open-source alternative like Grafana / OpenTelemetry]?"',
        '"How do you reason about the open-source-meets-commercial trade-off in a specific feature? Where do you draw the line?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Sentry specifically' },
      { type: 'ol', items: [
        'No open-source experience or interest. Sentry hires engineers who genuinely care about open source. If your background is enterprise / closed-source-only, your stories will need to surface other open-source-adjacent signals (community contribution, public docs, etc.) — otherwise the cultural round goes shallow.',
        'No observability / event-processing depth. Sentry expects you to reason about high-volume event streams, deduplication, sampling strategies, and async processing. Generic system-design answers go shallow.',
        'Generic competitive takes. Sentry has specific competitors (Datadog dominant in metrics, Grafana / OpenTelemetry as open-source alternatives). Coming in with a "they\'re all the same" take signals you have not done the homework.',
        'Underestimating the dual register. Sentry must operate as both an open-source community steward AND a commercial company. Stories that frame everything as "ship the commercial feature" miss the company\'s thesis. Calibrated stories navigate the dual register honestly.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Sentry. Set up a free project if you don\'t have one. Read the Sentry blog (blog.sentry.io). Pick three opinions on the Codecov expansion / open-source strategy.',
        '15-35 min: Stack drill. Sentry SDK architecture (50+ languages), event ingestion pipeline, issue grouping algorithm, performance monitoring (transactions / spans), the Symbolicator service for native crash symbolication, Codecov coverage processing. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- error ingestion at scale, issue grouping, Codecov coverage diff at scale. Write a one-page memo with explicit open-source-vs-commercial reasoning.',
        '55-70 min: Story drill. Three stories with open-source contribution / community framing. 200 words each.',
        '70-78 min: Competitive landscape audit. Compare Sentry vs Datadog vs OpenTelemetry. Articulate where each is right.',
        '78-80 min: Close. One opinion on open-source-vs-commercial, one specific Sentry decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Sentry remote in 2026?' },
      { type: 'p', text: 'Mostly yes. SF + Vienna are HQ-ish, but most engineering roles are remote-friendly across NA + EU. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private market. Below FAANG on RSU upside (private + smaller scale than Datadog / New Relic), competitive on cash + meaningful equity at the post-Codecov valuation.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Selectively. SF + Vienna are easier sponsor markets. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including open-source-meets-commercial shops like Sentry. Free at aimvantage.uk.' },

      { type: 'p', text: 'Sentry hires engineers who care about open source, can reason about high-volume event-processing systems, and navigate the dual register honestly. Prep the observability stack, the Codecov context, and a calibrated take on the Datadog / OpenTelemetry competitive landscape.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) ROBLOX SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'roblox-software-engineer-interview-2026',
    title: 'Roblox software engineer interview: the AI-creator + safety 2026 loop',
    description: 'The Roblox software engineer interview in 2026 -- five stages, the AI-creator pivot + child-safety regulatory context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Roblox', 'Software Engineer Interview', 'Gaming', 'UGC', 'AI Creator Tools', 'Child Safety', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Roblox shipped massive AI-creator tooling in 2024-25. The 2026 engineer loop tests for whether you can reason about user-generated-content platforms + child-safety constraints + extreme scale.',
    hook: 'Roblox runs the largest UGC gaming platform in the world AND must comply with intense child-safety regulation. Most candidates miss how strongly the safety register shapes the engineering loop.',
    sections: [
      { type: 'p', text: 'Roblox (NYSE: RBLX) operates one of the largest user-generated-content gaming platforms with 80M+ daily active users (60% under 16). The engineering team is hiring across the core platform (Lua / C++ engine), AI creator tools (post-2024 generative-AI shipping), the marketplace and economy team, the Studio IDE, content moderation / safety, and the new agent platform. The 2026 hiring bar is high but specific: extreme-scale UGC platform reasoning, child-safety regulatory awareness (COPPA, GDPR-K, Ofcom Online Safety Act), and comfort with the AI-creator pivot.' },

      { type: 'h2', text: 'The Roblox SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Roblox, why this team. They will probe whether you have used Roblox / Studio seriously.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the safety + AI-creator register.',
        'Technical screen -- 60 minutes. Live coding (C++ for engine; Lua for platform game logic; Python / Go for AI / data tooling).',
        'System design -- 60 minutes. Real Roblox-shaped scenarios. "Design the marketplace listing search at 80M DAU with sub-100ms p99." "Walk me through how the Studio IDE handles a multi-creator simultaneous edit with 100K-asset scene." "Design the safety pipeline for moderating UGC at scale where 50% of creators are under 16."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how a Roblox experience boots from cold start. What loads first, what blocks gameplay?"',
        '"Design the marketplace listing search at 80M DAU, sub-100ms p99. Walk me through the architecture."',
        '"How does the Studio IDE handle a multi-creator simultaneous edit on a 100K-asset scene?"',
        '"Design the content-safety pipeline for UGC where 50% of creators are minors. Where does AI moderation fit? Where does it fail?"',
        '"You inherit a feature that 0.5% of users hit a payment error on. The cohort is concentrated in 13-15-year-olds. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a generative-AI tool that lets creators generate 3D assets from prompts. Argue both sides for 5 minutes."',
        '"What is your real opinion on the AI-creator pivot? Where is Roblox right? Where does it risk creator-economy disruption?"',
        '"Walk me through how you reason about an engineering decision where safety, scale, and creator-economy fairness all matter."',
        '"Why Roblox and not [Epic / Unity / a pure-AI gaming startup]?"',
        '"How does building for a child-majority audience shape your default engineering choices?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Roblox specifically' },
      { type: 'ol', items: [
        'Underestimating the safety register. 60% of Roblox users are under 16. Engineers cannot ignore COPPA, GDPR-K, the UK Online Safety Act, or NSPCC reporting obligations. Stories that frame "we just shipped fast" without engaging with safety constraints fail.',
        'Generic UGC-platform answers. Roblox is structurally different from YouTube / TikTok — the content is interactive 3D experiences, not video. Engineering trade-offs (cold start, asset streaming, multi-creator collaboration) are different. Generic UGC answers go shallow.',
        'No opinion on AI-creator pivot. Roblox shipped major generative-AI tools in 2024-25. Coming without an opinion on the trade-off (lowering the creator bar = more content, but risks creator-economy / quality dilution) signals you have not done the homework.',
        'Not having used Roblox or Studio. Most adult engineers haven\'t played Roblox seriously. Spend 1 hour using Studio + playing 3-5 popular experiences before the loop. The recruiter and HM will know.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Spend 20 minutes in Roblox Studio. Open a tutorial. Build a tiny experience. Note three friction points.',
        '20-35 min: Stack drill. Lua scripting model, Roblox Engine architecture (DataModel / Workspace / Replicated state), Studio IDE collaborative editing, the AI-creator generative tools, marketplace economy fundamentals. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- marketplace listing search, multi-creator Studio editing, content-safety pipeline. Write a one-page memo with safety-first reasoning baked in.',
        '55-70 min: Story drill. Three stories with explicit safety / multi-stakeholder framing. 200 words each.',
        '70-78 min: Regulatory primer. COPPA, UK Online Safety Act 2023, GDPR-K (EU children\'s data protection), NSPCC reporting framework. Two minutes per concept.',
        '78-80 min: Close. One opinion on AI-creator pivot, one specific Roblox decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Roblox remote in 2026?' },
      { type: 'p', text: 'Hybrid. San Mateo HQ, Bellevue WA, NYC, London, Bucharest, Hyderabad. 3 days a week in office for most engineering since 2024 RTO. Some staff+ remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG-equivalent for senior engineers. RSU heavy comp; total comp swings with RBLX stock price. London base lags San Mateo by ~25%.' },
      { type: 'h3', text: 'Do you need gaming background?' },
      { type: 'p', text: 'No, but you need to be honest about whether you genuinely care about the platform. Engineers who don\'t care about creators / players struggle in the Roblox culture. If you do care, the loop is welcoming.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including UGC + child-safety platforms like Roblox. Free at aimvantage.uk.' },

      { type: 'p', text: 'Roblox hires engineers who can reason about UGC platforms at 80M+ DAU scale, navigate child-safety regulation, and engage with the AI-creator pivot honestly. Prep the safety stack, the Studio + Lua context, and a calibrated take on the AI-creator trade-off.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) TWILIO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'twilio-software-engineer-interview-2026',
    title: 'Twilio software engineer interview: the post-Segment + AI-CX 2026 loop',
    description: 'The Twilio software engineer interview in 2026 -- five stages, the post-Segment-divestiture + AI customer-experience pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Twilio', 'Software Engineer Interview', 'Communications', 'CPaaS', 'AI Customer Experience', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Twilio divested Segment in 2025 and re-focused on AI customer experience. The 2026 engineer loop tests for communications-API depth + comfort with the post-divestiture cleaner thesis.',
    hook: 'Twilio re-focused around AI customer experience after the Segment divestiture. The 2026 loop tests for whether you can reason about communications APIs at planet scale and the AI-CX pivot most candidates miss.',
    sections: [
      { type: 'p', text: 'Twilio (NYSE: TWLO) divested Segment in 2025 to focus on its core communications-platform-as-a-service (CPaaS) business + the new AI customer experience layer (Twilio Engage, Flex, etc.). The engineering team is hiring across the core APIs (Voice, SMS, WhatsApp, Email via SendGrid), Flex (the contact-centre platform), the new AI agents for customer service, and the global infrastructure (carrier integrations across 180+ countries). The 2026 hiring bar is high but specific: communications-API depth, comfort with carrier-integration messiness, and a calibrated take on the post-divestiture AI-CX strategy.' },

      { type: 'h2', text: 'The Twilio SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Twilio, why this team. They will probe whether you have built with Twilio APIs.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-divestiture-focus register.',
        'Technical screen -- 60 minutes. Live coding (Python / Go / Java for backend; TypeScript for Flex frontend).',
        'System design -- 60 minutes. Real Twilio-shaped scenarios. "Design the SMS API for 10M messages/sec across 180 countries." "Walk me through how Twilio handles a carrier API outage in [region] without dropping messages." "Design the AI agent for customer-service routing at 100K concurrent conversations."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a developer calls the Twilio SMS API. Trace it from API gateway to carrier delivery to status callback."',
        '"Design the SMS sending pipeline at 10M messages/sec across 180 countries. Walk me through the architecture."',
        '"How does Twilio handle a carrier API outage in [country]? What systems detect it, what recovers?"',
        '"You inherit an integration with [carrier X] that has 92% delivery rate. Six month plan to get it to 99.5%."',
        '"You disagree with a senior engineer on whether to ship a feature behind a flag or as a full rollout. Argue your side."',
        '"What is your real opinion on the post-Segment-divestiture strategy? Where is Twilio right to focus on AI-CX? Where does it leave a gap?"',
        '"Walk me through the most subtle bug you have hit in carrier integration."',
        '"Tell me about a production incident in payments-adjacent or carrier-adjacent systems."',
        '"Why Twilio and not [Vonage / MessageBird / a pure-AI customer-service startup]?"',
        '"How do you reason about the cost of an SMS sent vs the LTV of customers who use it?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Twilio specifically' },
      { type: 'ol', items: [
        'No carrier-integration awareness. Twilio is fundamentally a multi-decade-old-protocols-meet-modern-API company. "I would just use Kafka" is not enough. Knowing roughly how SS7 / SIP / SMPP integrate with modern systems matters.',
        'Generic CPaaS answers. Twilio expects you to reason about idempotency, exactly-once delivery semantics, carrier rate limiting, A2P 10DLC compliance, and the messy reality of 180+ carrier APIs.',
        'No opinion on AI-CX strategy. Twilio bet on AI customer experience after Segment divestiture. Coming without an opinion on whether this strategy works (vs pure-AI competitors like Sierra, Decagon) signals you have not done the homework.',
        'Underestimating compliance. SMS / voice are heavily regulated (TCPA in US, Ofcom in UK, GDPR in EU, country-specific carrier rules). Stories that frame "ship fast" without engaging with compliance fail.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Build something tiny with Twilio APIs (free trial gives credit). Send an SMS. Read the API docs structure.',
        '15-35 min: Stack drill. SMS A2P 10DLC, SS7 vs SIP / SMPP basics, Voice via WebRTC, Flex contact-centre architecture, the Engage / Segment-replacement layer post-divestiture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- SMS at 10M/sec, carrier failover, AI agent routing. Write a one-page memo with carrier-integration reality + compliance baked in.',
        '55-70 min: Story drill. Three stories with delivery-reliability + compliance framing. 200 words each.',
        '70-78 min: Compliance + competitive primer. TCPA, GDPR communications rules, A2P 10DLC, Vonage / MessageBird / Sierra / Decagon competitive landscape.',
        '78-80 min: Close. One opinion on AI-CX strategy, one specific Twilio decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Twilio remote in 2026?' },
      { type: 'p', text: 'Mostly remote-first since 2020. Some senior+ roles preference SF / Denver / Dublin. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of CPaaS market. Below FAANG on RSU at the post-2022 stock price; competitive on cash. London base lags San Francisco by ~25%.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including communications-API platforms like Twilio. Free at aimvantage.uk.' },

      { type: 'p', text: 'Twilio hires engineers who can reason about carrier-integration messiness, hold an opinion on the post-Segment AI-CX strategy, and ship in the regulated-communications register. Prep the carrier stack, the compliance context, and a calibrated take on the AI-customer-service competitive landscape.' },
    ],
  },
];
