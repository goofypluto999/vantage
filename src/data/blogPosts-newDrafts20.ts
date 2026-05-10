// 3 more interview-guide posts -- batch 20
// Lyft (rideshare), Slack (Salesforce subsidiary), MongoDB (database).

import type { BlogPost } from './blogPosts';

export const newBlogPosts20: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) LYFT SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'lyft-software-engineer-interview-2026',
    title: 'Lyft software engineer interview: the post-Uber-divergence 2026 loop',
    description: 'The Lyft software engineer interview in 2026 -- five stages, the post-Uber-divergence focus, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Lyft', 'Software Engineer Interview', 'Rideshare', 'Real-time Systems', 'Marketplaces', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Lyft refocused around US-only rideshare + the bikes/scooters business after Uber\'s broader-market expansion. The 2026 engineer loop tests for marketplace + real-time-systems depth + comfort with the focus-not-scope strategy.',
    hook: 'Lyft is the smaller Uber that bet on focus instead of scope. The 2026 interview filters for engineers who can ship in the post-divergence register without trying to be Uber.',
    sections: [
      { type: 'p', text: 'Lyft (NASDAQ: LYFT) refocused around US-only rideshare + bikes/scooters/transit after Uber\'s broader expansion (Eats, Freight, autonomous via Wayve). The engineering team is hiring across the rideshare platform (matching, dispatch, dynamic pricing), the bikes + scooters platform (Lyft Bikes, formerly Citi Bike + Bay Wheels), the driver experience, and the new AI agents for customer support. The 2026 hiring bar is high but specific: marketplace reasoning + real-time logistics + comfort with the focus-not-scope strategy + a take on the autonomous-vehicle context (Lyft killed L5 in 2021; relies on partners now).' },

      { type: 'h2', text: 'The Lyft SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Lyft, why this team. They will probe whether you have a real opinion on the focus-not-scope strategy.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-Uber-divergence register.',
        'Technical screen -- 60 minutes. Live coding (Python / Go / Java for backend; Swift / Kotlin for mobile). Moderate problem.',
        'System design -- 60 minutes. Real Lyft-shaped scenarios. "Design dispatch matching at peak hour in NYC." "Walk me through how dynamic pricing handles a sudden 10x demand spike." "Design the bikes / scooters real-time location service for 1M concurrent rides."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a rider requests a ride at peak hour in NYC. Trace it from app open to driver-acceptance to ride start."',
        '"Design dispatch matching at city-block resolution at peak hour. p99 under 200ms."',
        '"How does Lyft\'s dynamic pricing handle a sudden 10x demand spike (e.g. concert end, airport surge)?"',
        '"You inherit a feature that affects 0.3% of rides with a 5-minute longer wait time. The cohort is concentrated in suburban areas at peak. First three actions?"',
        '"You disagree with a senior engineer on whether to optimise for rider wait time or driver utilisation. Argue your side."',
        '"What is your real opinion on Lyft vs Uber\'s strategic divergence? Where is Lyft\'s focus right? Where does it leave growth on the table?"',
        '"Walk me through how you reason about engineering trade-offs that affect drivers vs riders."',
        '"Tell me about a production incident in real-time / marketplace systems."',
        '"Why Lyft and not [Uber / Waymo / a smaller rideshare regional]?"',
        '"How would you reduce dispatch latency by 20% without degrading match quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Lyft specifically' },
      { type: 'ol', items: [
        'No marketplace reasoning. Lyft is structurally a two-sided marketplace (rider / driver). Stories that miss this miss the company.',
        'Generic logistics answers. Lyft expects real-time + geographic reasoning. "I would batch the requests" is not enough. Knowing roughly how dispatch matching, supply heatmaps, and surge calculation work matters.',
        'Tone-deaf on driver experience. Lyft has been heavily scrutinised on driver earnings + worker classification. Stories that treat drivers as "the supply side widget" miss the company\'s actual operating reality.',
        'No opinion on Uber-divergence strategy. Lyft has bet on focus. Coming without an opinion on whether this strategy works (vs Uber\'s broader bet) signals you have not done the homework.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Lyft for 10 minutes (compare to Uber if possible). Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Dispatch architecture, surge calculation algorithm, real-time geographic indexing, the bikes / scooters integration boundary. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- dispatch at peak, dynamic pricing on demand spike, bikes location service. Write a one-page memo with marketplace reasoning.',
        '55-70 min: Story drill. Three behavioural stories with two-sided + driver-impact framing. 200 words each.',
        '70-78 min: Read the most recent Lyft earnings call summary. Identify three opinions on the focus-not-scope strategy.',
        '78-80 min: Close. One opinion on the Uber-divergence strategy, one specific Lyft decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Lyft remote in 2026?' },
      { type: 'p', text: 'Mostly remote within US since 2020. SF + NYC + Nashville hubs. Some senior+ roles preference SF in-person. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-of-market for FAANG-equivalent roles. Below FAANG on RSU at the post-2022 stock price; competitive on cash. Below Uber on total comp at senior+ levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including focused two-sided marketplaces like Lyft. Free at aimvantage.uk.' },

      { type: 'p', text: 'Lyft hires engineers who can reason about two-sided marketplaces, ship in the focus-not-scope register, and engage with the driver experience honestly. Prep the dispatch stack, the post-Uber-divergence context, and a calibrated take on the strategic focus.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) SLACK SOFTWARE ENGINEER (SALESFORCE SUBSIDIARY)
  // -------------------------------------------------------------------
  {
    slug: 'slack-software-engineer-interview-2026',
    title: 'Slack software engineer interview: the post-Salesforce-Agentforce-integration 2026 loop',
    description: 'The Slack software engineer interview in 2026 -- five stages, the post-Salesforce + Agentforce integration context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Slack', 'Salesforce', 'Software Engineer Interview', 'Real-time', 'Messaging', 'Agentforce', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Slack is now Salesforce-owned but retains a distinct engineering culture. The 2026 engineer loop tests for messaging-platform depth + comfort with the Agentforce integration thesis.',
    hook: 'Slack is Salesforce-owned but operates with a distinct culture. The 2026 interview filters for whether you understand both worlds without losing the Slack-engineering register.',
    sections: [
      { type: 'p', text: 'Slack is a Salesforce subsidiary (acquired 2021) but retains a distinct engineering culture (PHP / Hack heritage, smaller-team vibe, different values from Salesforce HQ). The 2026 engineering team is hiring across the core messaging platform, the Agentforce integration (Slack as the agentic-workforce surface), the developer platform (Slack Apps + Block Kit), and the new AI search / summarisation layer. The 2026 hiring bar is high but specific: real-time messaging depth, comfort with the PHP / Hack legacy, and a calibrated take on the Agentforce-integration thesis without losing Slack\'s distinctive culture.' },

      { type: 'h2', text: 'The Slack SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Slack, why this team. They will probe whether you understand the Slack-vs-Salesforce-HQ distinction.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-acquisition register.',
        'Technical screen -- 60 minutes. Live coding (Hack / PHP for legacy systems; Java / TypeScript for newer services).',
        'System design -- 60 minutes. Real Slack-shaped scenarios. "Design Slack message fan-out for a 100K-member channel." "Walk me through how Slack handles a workspace with 200K active users at peak." "Design the Agentforce-Slack integration where AI agents are first-class members of channels."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user sends a message in a 100K-member Slack channel. Trace the fan-out path."',
        '"Design Slack message fan-out for a 100K-member channel with sub-500ms p99."',
        '"How does Slack handle a workspace with 200K active users at peak (e.g. an enterprise customer with all-hands)?"',
        '"You are designing the Agentforce-Slack integration. AI agents become first-class channel members. Walk me through the architecture + the trust / permission boundary."',
        '"You inherit a feature that affects 0.5% of message-sends with a 3-second delay. The cohort is concentrated in workspaces with 50K+ members. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a Hack service to Java. Argue your side."',
        '"What is your real opinion on the Salesforce-Agentforce integration? Where is it right? Where does it dilute Slack\'s distinctive product?"',
        '"Walk me through the most subtle bug you have hit in real-time / messaging systems."',
        '"Why Slack and not [Microsoft Teams / Discord for work / a pure-Salesforce-internal communication]?"',
        '"How do you reason about engineering trade-offs that affect end users (Slack workspace members) vs enterprise admins (the Salesforce buyer)?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Slack specifically' },
      { type: 'ol', items: [
        'Treating Slack like Salesforce HQ. Slack retains a distinct engineering culture. Stories framed for the Salesforce-HQ register (multi-tenant + Ohana values) miss what Slack actually is. Confirm at the recruiter screen.',
        'Underestimating the Hack legacy. Slack has substantial Hack / PHP heritage. "I would just rewrite it" misses why Hack still works. Calibrated take: "I would invest in incremental Hack-to-Java migration paths language-by-language with explicit ROI thresholds, not greenfield rewrite."',
        'No opinion on Agentforce integration. Slack is being repositioned as the Agentforce surface. Coming without an opinion on whether AI agents as first-class channel members works (vs alternatives like agent UIs in dedicated apps) signals you have not done the homework.',
        'Generic real-time-systems answers. Slack has specific architecture (fan-out service, the WebSocket-based message-delivery stack, the "edge proxies" for multi-region). Generic answers miss Slack-specific context.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Slack for 15 minutes. Note three friction points. Read the Slack engineering blog (slack.engineering) for one specific opinion.',
        '15-35 min: Stack drill. Hack / PHP basics, Slack message fan-out architecture (the famous blog post), WebSocket-based message-delivery stack, edge proxies for multi-region, Block Kit + Slack Apps integration. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- 100K-member channel fan-out, peak-load workspace handling, Agentforce integration architecture. Write a one-page memo.',
        '55-70 min: Story drill. Three stories with real-time / messaging + culture-distinct framing. 200 words each.',
        '70-78 min: Read on the Salesforce-Slack integration strategy. Articulate where Slack-distinct culture wins vs where Salesforce-HQ-style governance wins.',
        '78-80 min: Close. One opinion on Agentforce integration, one specific Slack decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Slack remote in 2026?' },
      { type: 'p', text: 'Mostly remote within US (Slack pre-acquisition was remote-first). Salesforce HQ has tightened RTO but Slack subsidiary retains more remote flexibility. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise SaaS. Salesforce RSU based comp; total comp competitive with FAANG mid-tier post-Salesforce-stock-trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-acquisition cultures like Slack. Free at aimvantage.uk.' },

      { type: 'p', text: 'Slack hires engineers who can navigate the Salesforce-subsidiary structure without losing Slack\'s distinctive culture, reason about real-time messaging at scale, and engage with the Agentforce integration thesis. Prep the Hack stack, the message-fan-out architecture, and a calibrated take on the integration trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) MONGODB SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'mongodb-software-engineer-interview-2026',
    title: 'MongoDB software engineer interview: the AI-data-platform 2026 loop',
    description: 'The MongoDB software engineer interview in 2026 -- five stages, the Atlas + Vector Search + AI-data-platform pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['MongoDB', 'Software Engineer Interview', 'Database', 'Atlas', 'Vector Search', 'Distributed Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'MongoDB pivoted hard around Atlas + Vector Search to position as the AI data platform. The 2026 engineer loop tests for distributed-database depth + comfort with the post-Realm-divestiture focus.',
    hook: 'MongoDB has been one of the most-deployed databases in tech for a decade. The post-Atlas + Vector Search pivot has reshaped the engineering interview around AI-data-platform reasoning.',
    sections: [
      { type: 'p', text: 'MongoDB (NASDAQ: MDB) is public, profitable on adjusted free cash flow, and has pivoted significantly around Atlas (the cloud database) + Vector Search (post-2023) + the new AI data platform thesis. The engineering team is hiring across the core database server (C++), the Atlas managed-cloud control plane (Java / Go), Vector Search infrastructure, the developer platform (drivers in 10+ languages), and the new agentic-data-services layer. The 2026 hiring bar is high but specific: distributed-database depth (consistency, replication, sharding), comfort with C++ for core-server roles, and a calibrated take on the AI-data-platform strategy.' },

      { type: 'h2', text: 'The MongoDB SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why MongoDB, why this team (core server vs Atlas vs Vector Search vs drivers). They will probe whether you understand the team distinctions.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the AI-data-platform register.',
        'Technical screen -- 60 minutes. Live coding (C++ for core server; Java / Go for Atlas; Python for ML-tooling). Moderate problem.',
        'System design -- 60 minutes. Real MongoDB-shaped scenarios. "Design replica-set election when the primary partitions away from the majority." "Walk me through how Atlas handles a customer\'s sudden 10x query load spike with auto-scaling." "Design Vector Search indexing for a 10B-vector workload with sub-100ms p99."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through MongoDB\'s replication protocol. What happens when the primary loses majority?"',
        '"Design replica-set election handling when the primary partitions away. p99 fail-over under 5 seconds."',
        '"How does Atlas auto-scale a customer\'s cluster when their query load spikes 10x?"',
        '"Walk me through how MongoDB shards a collection across 1000+ shards. What are the failure modes during chunk migration?"',
        '"You are designing Vector Search indexing for 10B vectors with sub-100ms p99. Walk me through the architecture."',
        '"You disagree with a senior engineer on whether to optimise for read latency or write throughput on a customer workload. Argue your side."',
        '"What is your real opinion on the AI-data-platform strategy? Where is MongoDB right? Where does the strategy hit its limits vs PostgreSQL + pgvector?"',
        '"Walk me through the most subtle bug you have hit in distributed-database systems."',
        '"Why MongoDB and not [PostgreSQL / DynamoDB / Cassandra / a pure-vector-database like Pinecone]?"',
        '"How do you reason about consistency vs availability trade-offs in your designs?"',
      ] },

      { type: 'h2', text: 'What kills candidates at MongoDB specifically' },
      { type: 'ol', items: [
        'No distributed-database depth. MongoDB hires engineers who can reason about consistency models, replication, sharding, and chunk migration. Generic "I would use a database" answers go shallow.',
        'No C++ for core-server roles. The core MongoDB server is C++. If you cannot read C++ idiomatically (RAII, smart pointers, move semantics), the core-server team is not a fit.',
        'Underestimating Atlas\' control-plane complexity. Atlas runs millions of customer clusters. "I would just use Kubernetes" is not enough. Knowing roughly how Atlas\' provisioning, auto-scaling, backup, and failure recovery work matters.',
        'No opinion on PostgreSQL + pgvector. PostgreSQL with pgvector is the most-cited "alternative" to MongoDB Atlas Vector Search. Coming without an opinion on the comparison signals you have not done the homework.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the MongoDB engineering blog (mongodb.com/blog/category/engineering-blog). Identify three opinions on the AI-data-platform pivot.',
        '15-35 min: Stack drill. Replication protocol, sharding architecture, the Atlas control-plane, Vector Search HNSW indexing, the Realm-Sync (now post-divestiture context). Two minutes per concept.',
        '35-55 min: System design. Pick one of -- replica-set election, Atlas auto-scaling, Vector Search at 10B scale. Write a one-page memo with consistency/availability trade-off reasoning explicit.',
        '55-70 min: Story drill. Three stories tied to distributed-systems / production-database work. 200 words each.',
        '70-78 min: Comparative audit. Read on PostgreSQL + pgvector vs MongoDB Atlas Vector Search. Articulate where each wins.',
        '78-80 min: Close. One opinion on the AI-data-platform strategy, one specific MongoDB decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is MongoDB remote in 2026?' },
      { type: 'p', text: 'Hybrid for engineering. NYC HQ (Manhattan), Palo Alto, Dublin, Sydney, Bangalore. 2-3 days a week in office for most engineering since 2024 RTO. Some staff+ remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of database/infra market. Cash competitive with FAANG mid-tier; RSU meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in major hubs. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including distributed-database shops like MongoDB. Free at aimvantage.uk.' },

      { type: 'p', text: 'MongoDB hires engineers with real distributed-database depth, comfort with C++ for core-server roles, and a calibrated take on the AI-data-platform strategy vs PostgreSQL + pgvector. Prep the consistency / replication / sharding stack, the Atlas control-plane, and the Vector Search context.' },
    ],
  },
];
