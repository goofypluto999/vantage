// 3 more interview-guide posts -- batch 22
// Cloudflare (edge + Workers + R2), HubSpot (CRM SaaS + AI), Atlassian (Jira + Confluence + Rovo).

import type { BlogPost } from './blogPosts';

export const newBlogPosts22: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) CLOUDFLARE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'cloudflare-software-engineer-interview-2026',
    title: 'Cloudflare software engineer interview: the post-Workers + R2 + AI 2026 loop',
    description: 'The Cloudflare software engineer interview in 2026 -- five stages, the post-Workers + R2 + Workers AI + Hyperdrive context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Cloudflare', 'Software Engineer Interview', 'Edge', 'Workers', 'R2', 'Workers AI', 'Distributed Systems', 'Interview Prep'],
    excerpt: 'Cloudflare turned the CDN into a developer platform with Workers + R2 + D1 + Workers AI + Hyperdrive. The 2026 engineer loop tests for edge-network reasoning + the dev-platform thesis vs AWS.',
    hook: 'Cloudflare runs a global anycast network and is selling it as the developer platform to replace AWS for the long tail. The 2026 interview filters for engineers who can reason at edge-network scale.',
    sections: [
      { type: 'p', text: 'Cloudflare (NYSE: NET) repositioned from CDN + DDoS protection into a developer platform with Workers (V8-isolate serverless), R2 (S3-compatible object store, zero egress), D1 (SQLite at edge), KV + Queues + Durable Objects, Workers AI (LLM inference on the network), Hyperdrive (Postgres acceleration), and the Cloudflare One zero-trust suite. The 2026 engineering team is hiring across the core proxy + edge runtime, Workers + R2 + D1 + Durable Objects, Workers AI (model serving + GPU scheduling), Hyperdrive + database products, and the zero-trust + email security products. The 2026 hiring bar is high but specific: edge-network reasoning, isolate-vs-container trade-offs, and a calibrated take on the dev-platform-vs-AWS thesis.' },

      { type: 'h2', text: 'The Cloudflare SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Cloudflare, why this team. They will probe whether you understand the dev-platform thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the edge-network register.',
        'Technical screen -- 60 minutes. Live coding (Rust for the core proxy; TypeScript / Go for Workers + control plane; C++ for the runtime). Moderate problem.',
        'System design -- 60 minutes. Real Cloudflare-shaped scenarios. "Design Workers cold-start under 5ms across 300+ POPs." "Walk me through R2 metadata consistency at multi-region scale." "Design Workers AI to serve a 70B-parameter model with edge-latency SLOs."',
        'Onsite or final loop -- 3 rounds: deeper coding (often Rust), deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a request hits a Cloudflare POP and is routed to a Worker. Trace it from TLS termination to response."',
        '"Design Workers cold-start under 5ms across 300+ POPs. How does V8 isolate reuse + per-request memory zeroing work?"',
        '"Walk me through R2 metadata consistency at multi-region scale. How do you avoid the eventual-consistency footguns?"',
        '"Design Workers AI to serve a 70B-parameter model on edge GPUs with sub-200ms latency."',
        '"You inherit a Workers runtime regression that adds 2ms p99 to 0.1% of customers. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a service from Rust to Go for hiring velocity. Argue your side."',
        '"What is your real opinion on the dev-platform-vs-AWS thesis? Where does Cloudflare win? Where does AWS win?"',
        '"Walk me through the most subtle bug you have hit in distributed networking / proxy systems."',
        '"Why Cloudflare and not [Fastly / Akamai / AWS / Fly.io]?"',
        '"How would you reduce R2 PUT-latency by 30% without violating durability guarantees?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Cloudflare specifically' },
      { type: 'ol', items: [
        'No edge-network reasoning. Cloudflare is structurally an anycast edge network. Stories that miss this miss the company. Knowing roughly how anycast routing, POP-affinity, and connection coalescing work matters.',
        'Generic serverless answers. Workers is V8 isolates not containers. Lambda-shaped answers ("design a Lambda invocation") miss the point. Isolate-vs-container trade-offs come up frequently.',
        'No opinion on the AWS-replacement thesis. The "egress = $0" + "global by default" + "isolate runtime" stack is a structural bet against AWS. Coming without an opinion on whether it works for which workloads signals shallow prep.',
        'Tone-deaf on the open-source / customer-trust register. Cloudflare leans heavily on transparency reports + open-sourcing the runtime + the famous "What it means to be the Internet" tone. Generic enterprise-SaaS answers miss this.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read one Cloudflare engineering blog post (blog.cloudflare.com is a goldmine -- look for Workers architecture deep-dives).',
        '15-35 min: Stack drill. Anycast routing, V8 isolate architecture, R2 architecture (the multi-region metadata layer), Workers AI + GPU scheduling, Durable Objects + the strongly-consistent edge primitive. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Workers cold-start, R2 metadata, Workers AI inference. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with edge-scale + multi-region framing. 200 words each.',
        '70-78 min: Read on Cloudflare vs AWS. Articulate where Cloudflare wins (egress economics, global by default, isolate cold-start) vs where AWS wins (depth of services, mature ML stack, primary-region durability).',
        '78-80 min: Close. One opinion on the AWS-replacement thesis, one specific Cloudflare decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Cloudflare remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF + Austin + London + Lisbon + Singapore hubs. Many fully remote roles within those regions. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Strong infra + SaaS band. Competitive RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including edge-platform companies like Cloudflare. Free at aimvantage.uk.' },

      { type: 'p', text: 'Cloudflare hires engineers who can reason about anycast edge networks, navigate the V8-isolate runtime, and engage with the AWS-replacement thesis honestly. Prep the Workers stack, the R2 architecture, and a calibrated take on the edge-vs-region register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) HUBSPOT SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'hubspot-software-engineer-interview-2026',
    title: 'HubSpot software engineer interview: the post-Breeze-AI 2026 loop',
    description: 'The HubSpot software engineer interview in 2026 -- five stages, the post-Breeze AI + Smart CRM + Content Hub context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['HubSpot', 'Software Engineer Interview', 'CRM', 'Breeze AI', 'SMB SaaS', 'Inbound', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'HubSpot pivoted from a Marketing Hub + CMS into a unified Smart CRM with Breeze AI agents across Marketing / Sales / Service / Content / Ops. The 2026 engineer loop tests for SMB-product reasoning + the Breeze-agent thesis.',
    hook: 'HubSpot is the SMB-focused CRM that bet the future on Breeze AI agents. The 2026 interview filters for engineers who can ship for the SMB user and reason about agentic CRM architecture.',
    sections: [
      { type: 'p', text: 'HubSpot (NYSE: HUBS) repositioned from Marketing Hub + CMS into a unified Smart CRM (2024 rebrand) with Breeze AI -- agentic features across Marketing / Sales / Service / Content / Ops Hubs. The 2026 engineering team is hiring across the core CRM data layer, Breeze AI (the agent stack), the five Hubs (Marketing automation, Sales sequences, Service ticketing, Content / CMS, Operations), the developer platform (HubSpot API + UI Extensions), and the SMB-focused payment + commerce surfaces. The 2026 hiring bar is high but specific: SMB-product reasoning, comfort with the Breeze-agent thesis, and a calibrated take on the unified-platform-vs-best-in-class register.' },

      { type: 'h2', text: 'The HubSpot SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why HubSpot, why this team. They will probe whether you understand the SMB-focus + unified-platform thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the SMB-product register.',
        'Technical screen -- 60 minutes. Live coding (Java for backend; TypeScript / React for frontend; Python for ML / Breeze). Moderate problem.',
        'System design -- 60 minutes. Real HubSpot-shaped scenarios. "Design the CRM data layer to support 100K+ contacts per portal at p99 < 200ms." "Walk me through Breeze AI -- a Sales agent that drafts outreach + an Ops agent that classifies tickets, sharing the same model serving stack." "Design the Marketing automation engine for 1M sends per minute."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round with the famous HubSpot Culture Code.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a sales rep clicks Send on a 1-to-1 email in HubSpot. Trace it from click to delivery + engagement tracking."',
        '"Design the CRM data layer to support 100K+ contacts per portal at p99 < 200ms for searches + list views."',
        '"How would you design Breeze AI such that a Sales-agent draft email + an Ops-agent ticket classifier share the same model serving stack but have different trust boundaries?"',
        '"Design the Marketing automation engine for 1M sends per minute with deliverability + suppression rules."',
        '"You inherit a feature that improves conversion for enterprise customers (>1000 contacts) by 12% but degrades the experience for SMBs (<50 contacts) by 8%. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in Marketplace integrations or build native equivalents. Argue your side."',
        '"What is your real opinion on the Breeze AI strategy? Where does AI-agents-as-CRM-feature work? Where does it become noise?"',
        '"Walk me through the most subtle bug you have hit in a multi-tenant SaaS system."',
        '"Why HubSpot and not [Salesforce / Pipedrive / Zoho / a vertical SaaS]?"',
        '"How would you reduce time-to-first-value for an SMB customer in their first 7 days?"',
      ] },

      { type: 'h2', text: 'What kills candidates at HubSpot specifically' },
      { type: 'ol', items: [
        'Treating HubSpot like Salesforce. HubSpot\'s SMB-first DNA matters. Stories framed for the enterprise-RFP register miss the company. Comfort with self-serve, time-to-value, and freemium thinking is required.',
        'Generic CRM answers. HubSpot has specific architecture (the portal-as-tenant model, the contacts / companies / deals object hierarchy, the workflow engine, the inbox / conversations unification). Generic answers miss HubSpot-specific context.',
        'No opinion on the Breeze AI thesis. Breeze is central to the post-2024 strategy. Coming without an opinion on whether agents-as-features works (vs alternatives like agent-as-product, or AI-augmented vs AI-replaced workflows) signals shallow prep.',
        'Missing the HubSpot Culture Code. HEART (Humble / Empathetic / Adaptable / Remarkable / Transparent) shows up in interviews. Stories tone-deaf to the values miss the company\'s actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Sign up for HubSpot free tier (15 min). Note three friction points + three things you respect. Look at one Breeze AI feature.',
        '15-35 min: Stack drill. Portal-as-tenant model, contacts / companies / deals + custom objects, the workflow engine, Marketing email + deliverability, Breeze AI surfaces. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- CRM data layer, Breeze AI agent stack, Marketing automation. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with SMB + Culture-Code framing (HEART). 200 words each.',
        '70-78 min: Read the HubSpot Culture Code (or a recent excerpt). Identify three values you actually believe in + how they show up in your past work.',
        '78-80 min: Close. One opinion on Breeze AI, one specific HubSpot decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is HubSpot remote in 2026?' },
      { type: 'p', text: 'Flex-first since 2021 -- Cambridge MA + Dublin + Berlin + Singapore + Sydney hubs but most engineering roles can be fully remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of SMB-SaaS band. Strong RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including SMB-CRM platforms like HubSpot. Free at aimvantage.uk.' },

      { type: 'p', text: 'HubSpot hires engineers who can ship for the SMB user, reason about unified-platform trade-offs, and engage with the Breeze AI thesis honestly. Prep the portal model, the workflow engine, and a calibrated take on the agents-as-features register. Bring the Culture Code.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) ATLASSIAN SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'atlassian-software-engineer-interview-2026',
    title: 'Atlassian software engineer interview: the post-Rovo + Cloud-only 2026 loop',
    description: 'The Atlassian software engineer interview in 2026 -- five stages, the post-Rovo + Cloud-only Jira / Confluence + Loom integration context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Atlassian', 'Software Engineer Interview', 'Jira', 'Confluence', 'Rovo', 'Cloud Migration', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Atlassian completed the Server EOL + Data Center push toward Cloud-only, integrated Loom, and shipped Rovo AI agents across Jira + Confluence. The 2026 engineer loop tests for multi-tenant SaaS depth + the Rovo + Loom-integration register.',
    hook: 'Atlassian forced a Cloud-only future and bet the integration layer on Rovo AI agents. The 2026 interview filters for engineers who can ship in the post-Server multi-tenant register and reason about agentic workflow.',
    sections: [
      { type: 'p', text: 'Atlassian (NASDAQ: TEAM) completed the Server end-of-life (Feb 2024) and pushed hard on Cloud-only (with Data Center for largest enterprises), integrated Loom (acquired 2023 for $975M), and shipped Rovo -- the cross-product AI agent platform across Jira + Confluence + Loom + Bitbucket. The 2026 engineering team is hiring across the core Jira + Confluence platforms, Rovo (the agent stack + Atlassian Intelligence), Loom (async video), Bitbucket + Compass (DevOps + internal developer platform), Trello (the consumer-leaning end), and the Forge developer platform. The 2026 hiring bar is high but specific: multi-tenant SaaS depth, comfort with the Cloud-only register, and a calibrated take on the Rovo-agent thesis.' },

      { type: 'h2', text: 'The Atlassian SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Atlassian, why this team. They will probe whether you understand the Cloud-only transition + the Rovo-agent thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the multi-tenant register.',
        'Technical screen -- 60 minutes. Live coding (Java / Kotlin for backend; TypeScript / React for frontend; Python for Rovo / ML). Moderate problem.',
        'System design -- 60 minutes. Real Atlassian-shaped scenarios. "Design Jira issue search at 100K+ issues per project, sub-300ms p99." "Walk me through Rovo -- a multi-product agent that can read Confluence + comment in Jira + summarise Loom videos." "Design the Confluence collaborative editor at peak."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values (the famous Atlassian values come up explicitly), plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user runs a JQL query across 100K+ Jira issues. Trace it from input to result."',
        '"Design Jira issue search at 100K+ issues per project with sub-300ms p99 across all sort orders."',
        '"How would you design Rovo such that an agent can read Confluence, comment in Jira, and summarise a Loom video while staying inside the customer\'s permission boundary?"',
        '"Design the Confluence collaborative editor at peak (1K concurrent editors per page) with OT or CRDT-based conflict resolution."',
        '"You inherit a feature that improves Cloud customers by 18% but breaks the Data Center variant for the top 50 enterprise customers. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in Forge marketplace apps or build native equivalents. Argue your side."',
        '"What is your real opinion on the Server EOL forced migration? Was the customer cost / benefit right?"',
        '"Walk me through the most subtle bug you have hit in a multi-tenant SaaS with permission boundaries."',
        '"Why Atlassian and not [Notion / Linear / monday.com / GitHub Issues]?"',
        '"How would you reduce Jira board-load latency by 30% without breaking the workflow engine?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Atlassian specifically' },
      { type: 'ol', items: [
        'Treating Cloud the same as the old Server / Data Center register. Cloud is multi-tenant + opinionated + faster-shipping. Stories framed for the Server / DC register miss the post-2024 reality.',
        'Generic permissions answers. Atlassian has specific architecture (the project + space + global permissions hierarchy, the OAuth 2.0 + 3LO + Forge runtime permissions). Generic answers miss the actual multi-tenant + permission boundary depth.',
        'No opinion on Rovo + the agent layer. Rovo is central to the 2025+ strategy. Coming without an opinion on whether cross-product agents work (vs in-product agents) signals shallow prep.',
        'Missing the Atlassian values. "Open company, no bullshit", "Play, as a team", "Don\'t @#%! the customer", "Be the change you seek", "Build with heart and balance" show up in interviews. Tone-deaf stories miss the company\'s actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Jira Cloud + Confluence Cloud for 15 minutes (free trial). Note three friction points + three things you respect. Look at one Rovo agent.',
        '15-35 min: Stack drill. Jira data model + JQL, Confluence editor (OT / CRDT), the permissions hierarchy, the Forge runtime, Rovo + Atlassian Intelligence architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- JQL search at scale, Rovo cross-product agent, Confluence collab editor. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with multi-tenant + Atlassian-values framing. 200 words each.',
        '70-78 min: Read the Atlassian values page. Identify three values you actually believe in + how they show up in your past work.',
        '78-80 min: Close. One opinion on Rovo, one specific Atlassian decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Atlassian remote in 2026?' },
      { type: 'p', text: 'Team Anywhere -- distributed-first since 2020. Hubs in Sydney + SF + Austin + Bengaluru + Amsterdam + Mountain View but most engineering roles fully remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise-SaaS band. Strong RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including multi-product SaaS platforms like Atlassian. Free at aimvantage.uk.' },

      { type: 'p', text: 'Atlassian hires engineers who can reason about multi-tenant SaaS, navigate the Cloud-only register, and engage with the Rovo + Loom-integration thesis honestly. Prep the Jira + Confluence stack, the Forge runtime, and a calibrated take on the cross-product-agent register. Bring the values.' },
    ],
  },
];
