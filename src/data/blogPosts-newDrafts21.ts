// 3 more interview-guide posts -- batch 21
// Reddit (post-IPO community + ads), Snowflake (data cloud), Datadog (observability).

import type { BlogPost } from './blogPosts';

export const newBlogPosts21: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) REDDIT SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'reddit-software-engineer-interview-2026',
    title: 'Reddit software engineer interview: the post-IPO community-plus-ads 2026 loop',
    description: 'The Reddit software engineer interview in 2026 -- five stages, the post-IPO community + ads + AI-data-licensing context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Reddit', 'Software Engineer Interview', 'Community', 'Ads', 'AI Data Licensing', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Reddit went public in March 2024 and pivoted hard into the ads + AI-data-licensing business while keeping the volunteer-moderator community structure. The 2026 engineer loop tests for community-scale systems + ads stack depth + a real take on the moderator relationship.',
    hook: 'Reddit is a public company sitting on the largest English-language discussion corpus in existence. The 2026 interview filters for engineers who can ship the ads + AI-data-licensing future without breaking the volunteer-moderator trust.',
    sections: [
      { type: 'p', text: 'Reddit (NYSE: RDDT) IPO\'d in March 2024 and has run hard at three priorities since: an ads stack that competes with X / Meta for performance ad-spend, AI-data-licensing deals (the Google + OpenAI training-data contracts, ~$200M+ in 2024-25), and a community-moderation platform overhaul (Mod tools, AI-assisted moderation, community-fund payments). The 2026 engineering team is hiring across the core platform (post / comment / vote at petabyte scale), the ads platform (CPM + CPC auctions, conversion attribution), the AI / ML infra (recommendation, search, the licensing-data pipeline), and the developer platform (Devvit, Reddit Apps). The 2026 hiring bar is high but specific: community-scale systems depth, ads-stack reasoning, comfort with the volunteer-moderator dynamic.' },

      { type: 'h2', text: 'The Reddit SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Reddit, why this team. They will probe whether you understand the volunteer-moderator dynamic.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-IPO register.',
        'Technical screen -- 60 minutes. Live coding (Python / Go / TypeScript). Moderate problem.',
        'System design -- 60 minutes. Real Reddit-shaped scenarios. "Design the comment-tree service for the front page of r/AskReddit at peak." "Walk me through how Reddit\'s ads auction handles a 100ms p99 SLO." "Design the AI-data-licensing pipeline that ships fresh Reddit content to OpenAI / Google daily."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user upvotes a comment in a 50K-comment thread. Trace it from click to the visible UI update for other readers."',
        '"Design the comment-tree service for r/AskReddit at peak (10M+ DAU, threads with 50K+ comments)."',
        '"How does Reddit\'s ads auction handle a 100ms p99 SLO across all surface-types (feed, search, comment-page)?"',
        '"You are designing the AI-data-licensing pipeline. Fresh Reddit content needs to ship to OpenAI / Google daily with privacy + opt-out compliance. Walk me through the architecture."',
        '"You inherit a feature that increases moderator workload by 30% but reduces spam-comment incidence by 40%. First three actions?"',
        '"You disagree with a senior engineer on whether to use Reddit-style vote-fuzzing or transparent vote counts. Argue your side."',
        '"What is your real opinion on the AI-data-licensing strategy? Where is it right? Where does it create friction with moderators?"',
        '"Walk me through the most subtle bug you have hit in high-fanout / community-scale systems."',
        '"Why Reddit and not [X / Discord / a smaller forum]?"',
        '"How would you reduce comment-tree load latency by 30% without breaking the moderator-tools dependency?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Reddit specifically' },
      { type: 'ol', items: [
        'No moderator reasoning. Reddit is structurally a volunteer-moderator platform. Stories that miss this miss the company. Every feature has to be reasoned through the moderator-impact lens.',
        'Generic community-scale answers. Reddit has specific architecture (the comment-tree service, the vote-fuzzing pipeline, the karma calculation, the auto-moderator framework). Generic answers miss Reddit-specific context.',
        'Tone-deaf on the 2023 API price-hike + protest. Reddit raised third-party API prices in 2023, triggering moderator blackouts. Stories that ignore this signal you have not done the homework. Calibrated take expected.',
        'No opinion on AI-data-licensing. The $200M+ contracts are central to the financial story. Coming without an opinion on whether this is right (vs alternatives like community-revenue-share, opt-in licensing) signals shallow prep.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Reddit for 15 minutes. Note three things about moderation, three friction points, three things you respect. Look at one Devvit app.',
        '15-35 min: Stack drill. Comment-tree architecture, vote-fuzzing rationale, ads auction mechanics, moderator-tool framework, the AI-data-licensing pipeline shape. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- comment-tree at peak, ads auction p99, data-licensing pipeline. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with community + moderator-impact framing. 200 words each.',
        '70-78 min: Read the most recent Reddit earnings call summary. Identify the AI-data-licensing revenue, the ads-revenue mix, the DAU trajectory.',
        '78-80 min: Close. One opinion on AI-data-licensing, one specific Reddit decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Reddit remote in 2026?' },
      { type: 'p', text: 'Mostly remote within US. SF + NYC hubs. Some senior+ roles preference in-person. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of mid-tier post-IPO. RSU based on post-IPO stock; competitive cash. Senior+ levels approach FAANG mid-band depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including community-scale platforms like Reddit. Free at aimvantage.uk.' },

      { type: 'p', text: 'Reddit hires engineers who can reason about community-scale systems, navigate the moderator dynamic, and engage with the AI-data-licensing + ads strategy honestly. Prep the comment-tree stack, the 2023 API context, and a calibrated take on the post-IPO trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) SNOWFLAKE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'snowflake-software-engineer-interview-2026',
    title: 'Snowflake software engineer interview: the post-AI-Data-Cloud 2026 loop',
    description: 'The Snowflake software engineer interview in 2026 -- five stages, the post-AI-Data-Cloud (Cortex + Iceberg + Arctic) context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Snowflake', 'Software Engineer Interview', 'Data Cloud', 'Cortex AI', 'Iceberg', 'Distributed Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Snowflake pivoted from data warehouse to "AI Data Cloud" with Cortex (LLMs), Snowpark, Iceberg-native tables, and the Arctic open-source LLM. The 2026 engineer loop tests for distributed-systems depth + the AI-Data-Cloud thesis.',
    hook: 'Snowflake is no longer just a data warehouse -- it is positioning as the AI Data Cloud. The 2026 interview filters for engineers who can reason about distributed query engines AND the AI integration story.',
    sections: [
      { type: 'p', text: 'Snowflake (NYSE: SNOW) repositioned from cloud data warehouse to "AI Data Cloud" in 2023-25 with Cortex (LLM functions in SQL), Snowpark (Python / Java / Scala UDFs), native Iceberg-table support (lakehouse interop with Databricks), and Arctic (their open-source 480B-parameter MoE LLM). The 2026 engineering team is hiring across the core query engine (the multi-cluster compute warehouse), Cortex AI (LLM integration + vector search + Arctic serving), Snowpark + container services, the lakehouse / Iceberg layer, and the Marketplace + data-sharing platform. The 2026 hiring bar is high but specific: distributed-systems + query-engine depth, comfort with the AI-Data-Cloud pivot, and a calibrated take on the Iceberg-vs-proprietary-format tension.' },

      { type: 'h2', text: 'The Snowflake SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Snowflake, why this team. They will probe whether you understand the AI-Data-Cloud pivot.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-warehouse register.',
        'Technical screen -- 60 minutes. Live coding (C++ for the core engine; Java / Scala for Snowpark; Python for Cortex). Moderate-to-hard problem.',
        'System design -- 60 minutes. Real Snowflake-shaped scenarios. "Design the multi-cluster compute warehouse routing layer at 10K concurrent queries." "Walk me through how Cortex AI handles a 5M-row LLM inference batch with cost predictability." "Design the Iceberg-table-with-Snowflake-metadata sync."',
        'Onsite or final loop -- 4 rounds: deeper coding (often C++), deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user submits a 10TB query against a multi-cluster warehouse. Trace it from SQL parser to result set."',
        '"Design the multi-cluster compute warehouse routing layer at 10K concurrent queries with cost predictability."',
        '"How does Cortex AI handle a 5M-row LLM inference batch (e.g. COMPLETE() over a customer-feedback column)? What are the cost levers?"',
        '"You are designing the Iceberg-table-with-Snowflake-metadata sync. Snowflake stays the query engine but data lives in customer-owned S3. Walk me through the architecture + the consistency boundary."',
        '"You inherit a query optimiser change that improves 95% of queries by 15% but regresses 0.3% of customer queries by 40%. First three actions?"',
        '"You disagree with a senior engineer on whether to add a feature to the proprietary FDN format or invest in Iceberg-native equivalents. Argue your side."',
        '"What is your real opinion on the Iceberg integration? Where is it right? Where does it cannibalise Snowflake-native lock-in?"',
        '"Walk me through a subtle bug in distributed query execution that you have hit."',
        '"Why Snowflake and not [Databricks / BigQuery / Redshift]?"',
        '"How would you reduce Cortex AI inference latency by 30% without degrading model quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Snowflake specifically' },
      { type: 'ol', items: [
        'No query-engine reasoning. Snowflake is structurally a distributed query engine. Stories that miss this miss the company. Knowing roughly how query planning, optimisation, and the storage / compute separation work matters.',
        'Generic distributed-systems answers. Snowflake has specific architecture (the FDN format, the metadata layer in FoundationDB, the multi-cluster warehouse routing, the result cache, the micro-partition pruning). Generic answers miss Snowflake-specific context.',
        'No opinion on Iceberg integration. Snowflake added Iceberg-native support in 2024-25, which creates a tension with the proprietary FDN format. Coming without an opinion on whether Iceberg-first is right (vs FDN-primary with Iceberg-export) signals shallow prep.',
        'Tone-deaf on the Databricks competitive register. Snowflake-vs-Databricks is the central category competition. Stories that ignore this miss the company\'s actual strategic register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Snowflake architecture blog post (the famous "elastic data warehouse" paper or the recent Cortex + Iceberg posts).',
        '15-35 min: Stack drill. Query-engine architecture, micro-partition pruning, the FDN format basics, multi-cluster routing, Cortex AI + Arctic, Iceberg integration. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- multi-cluster routing, Cortex batch inference, Iceberg-metadata sync. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with distributed-systems + query-engine framing. 200 words each.',
        '70-78 min: Read on the Snowflake vs Databricks register. Articulate where Snowflake wins (governance, SQL-first, Cortex integration) vs where Databricks wins (notebooks, ML, Spark / Delta heritage).',
        '78-80 min: Close. One opinion on Iceberg integration, one specific Snowflake decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Snowflake remote in 2026?' },
      { type: 'p', text: 'Hybrid for most engineering roles -- Bay Area + Bellevue + Berlin + Toronto preferred. Some fully remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise SaaS / data infra band. Strong RSU; total comp competitive with FAANG mid-band at L5+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including distributed-systems + data infra companies like Snowflake. Free at aimvantage.uk.' },

      { type: 'p', text: 'Snowflake hires engineers who can reason about distributed query engines, navigate the AI-Data-Cloud pivot, and engage with the Iceberg-integration tension honestly. Prep the query-engine stack, the Cortex + Arctic context, and a calibrated take on the Databricks competitive register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) DATADOG SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'datadog-software-engineer-interview-2026',
    title: 'Datadog software engineer interview: the post-observability-plus-security 2026 loop',
    description: 'The Datadog software engineer interview in 2026 -- five stages, the post-observability + Cloud SIEM + Bits AI context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Datadog', 'Software Engineer Interview', 'Observability', 'Cloud SIEM', 'Bits AI', 'Time-series', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Datadog expanded from metrics + APM to logs + Cloud SIEM + Application Security + Bits AI. The 2026 engineer loop tests for time-series + ingest-pipeline depth and the platform-vs-point-tool register.',
    hook: 'Datadog is the observability platform that ate every adjacent category. The 2026 interview filters for engineers who can ship at petabyte ingest scale while keeping the unified-platform thesis intact.',
    sections: [
      { type: 'p', text: 'Datadog (NASDAQ: DDOG) expanded from metrics + APM (2010-19) into logs, RUM (Real User Monitoring), synthetics, Cloud SIEM, Cloud Security Posture Management, Application Security, Database Monitoring, Network Monitoring, and Bits AI (the AI-assistant + agentic-observability layer). The 2026 engineering team is hiring across the core ingest pipeline (petabyte-per-day metric + log + trace ingest), the time-series storage engine, the Bits AI / agent layer, the security products, and the new "Datadog Workflows" automation layer. The 2026 hiring bar is high but specific: time-series + ingest-pipeline depth, comfort with the platform thesis (vs the point-tool register), and a calibrated take on the Bits AI direction.' },

      { type: 'h2', text: 'The Datadog SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Datadog, why this team. They will probe whether you understand the platform-vs-point-tool register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-observability register.',
        'Technical screen -- 60 minutes. Live coding (Go for ingest + backend; Python for ML / Bits AI; TypeScript for frontend). Moderate problem.',
        'System design -- 60 minutes. Real Datadog-shaped scenarios. "Design the metric ingest pipeline at 10M points-per-second." "Walk me through how Datadog handles a 100x log spike from a customer incident." "Design Bits AI as an agentic-observability layer that can take corrective action."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a customer emits 1M metrics-per-second from a Kubernetes cluster. Trace it from agent to query."',
        '"Design the metric ingest pipeline at 10M points-per-second with sub-30-second time-to-query."',
        '"How does Datadog handle a 100x log spike from a single customer (e.g. an incident creating debug-log flood) without degrading other customers?"',
        '"You are designing Bits AI. It needs to read observability data + propose corrective actions (e.g. scale a service, restart a pod). Walk me through the architecture + the trust boundary."',
        '"You inherit a query-engine change that improves 90% of dashboards by 25% but adds 200ms to high-cardinality queries. First three actions?"',
        '"You disagree with a senior engineer on whether to use Datadog\'s proprietary time-series format or invest in OpenTelemetry-native equivalents. Argue your side."',
        '"What is your real opinion on the platform-everything strategy? Where is it right? Where does it create churn risk (customers consolidating elsewhere)?"',
        '"Walk me through a subtle bug in high-cardinality time-series systems that you have hit."',
        '"Why Datadog and not [New Relic / Splunk / Grafana Cloud / Honeycomb]?"',
        '"How would you reduce log-ingest latency by 30% without breaking the query-time index?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Datadog specifically' },
      { type: 'ol', items: [
        'No time-series reasoning. Datadog is structurally a time-series + ingest pipeline. Stories that miss this miss the company. Knowing roughly how compaction, downsampling, cardinality control, and tag-based queries work matters.',
        'Generic ingest-pipeline answers. Datadog has specific architecture (the agent, the intake service, the histogram + sketch types, the tag-resolution layer, the multi-tenant query engine). Generic answers miss Datadog-specific context.',
        'No opinion on the platform-everything strategy. Datadog has expanded into 15+ product lines. Coming without an opinion on whether this is right (vs the alternative -- focused best-in-class per category) signals shallow prep.',
        'Tone-deaf on OpenTelemetry. OTel is the open-source standard that competes with Datadog\'s proprietary agent. Stories that ignore this miss the company\'s actual strategic register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Datadog engineering blog (engineering.datadoghq.com) for one specific architecture deep-dive.',
        '15-35 min: Stack drill. Time-series ingest, the agent architecture, sketches + histograms (DDSketch), tag resolution + cardinality control, the trace + log + metric correlation. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- metric ingest at 10M pps, log-spike handling, Bits AI agentic architecture. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with high-cardinality + multi-tenant framing. 200 words each.',
        '70-78 min: Read on Datadog vs OpenTelemetry. Articulate where Datadog\'s proprietary stack wins (correlation, UX, opinionated agents) vs where OTel wins (open standard, no lock-in).',
        '78-80 min: Close. One opinion on the platform-everything strategy, one specific Datadog decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Datadog remote in 2026?' },
      { type: 'p', text: 'Hybrid -- NYC HQ + Paris + Boston + Dublin hubs preferred. Some fully remote engineering roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of mid-band SaaS comp. Strong RSU; total comp competitive with FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including time-series + observability platforms like Datadog. Free at aimvantage.uk.' },

      { type: 'p', text: 'Datadog hires engineers who can reason about petabyte-scale ingest pipelines, navigate the platform-everything strategy, and engage with the OpenTelemetry tension honestly. Prep the time-series stack, the Bits AI context, and a calibrated take on the platform-vs-point-tool register.' },
    ],
  },
];
