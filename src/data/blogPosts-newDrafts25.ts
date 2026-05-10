// 3 more interview-guide posts -- batch 25 (enterprise SaaS)
// Salesforce, ServiceNow, Zoom.

import type { BlogPost } from './blogPosts';

export const newBlogPosts25: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) SALESFORCE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'salesforce-software-engineer-interview-2026',
    title: 'Salesforce software engineer interview: the post-Agentforce + Data Cloud 2026 loop',
    description: 'The Salesforce software engineer interview in 2026 -- five stages, the post-Agentforce + Data Cloud + Einstein + Slack-integration context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Salesforce', 'Software Engineer Interview', 'CRM', 'Agentforce', 'Data Cloud', 'Multi-tenant SaaS', 'Interview Prep'],
    excerpt: 'Salesforce shipped Agentforce (autonomous AI agents on top of CRM data), unified Data Cloud, and pushed the Einstein-AI + Slack-integrated experience. The 2026 engineer loop tests for multi-tenant SaaS depth + the Agentforce thesis.',
    hook: 'Salesforce went from CRM-of-record to AI-agentic-everything. The 2026 interview filters for engineers who can ship at multi-tenant scale and reason about the Agentforce platform.',
    sections: [
      { type: 'p', text: 'Salesforce (NYSE: CRM) shipped Agentforce (autonomous AI agents that act on CRM data + customer systems, launched October 2024), Data Cloud (the unified customer-data layer, now the fastest-growing product), Einstein-AI (the trust-layer for LLMs across Sales / Service / Marketing / Commerce / Slack), and the deeper Slack subsidiary integration. The 2026 engineering team is hiring across the Core platform (Sales / Service / Marketing / Commerce Clouds, the multi-tenant runtime), Agentforce + Atlas reasoning engine + the Agent Builder, Data Cloud (the zero-copy data federation + Genie + the Tableau integration), the Slack + Quip + MuleSoft + Heroku surfaces, the Industry Clouds (Health, Financial Services, Public Sector, etc.), and the new AI Cloud + Hyperforce infra. The 2026 hiring bar is high but specific: multi-tenant SaaS depth, comfort with the Agentforce + trust-layer thesis, and a calibrated take on the platform-vs-best-in-class register.' },

      { type: 'h2', text: 'The Salesforce SWE process -- 5-6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Salesforce, why this team. They will probe whether you understand the Agentforce-as-platform thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the Ohana register.',
        'Technical screen -- 60 minutes. Live coding (Apex for Salesforce platform; Java for backend; LWC / TypeScript for frontend; Python for ML / Data Cloud).',
        'System design -- 60 minutes. Real Salesforce-shaped scenarios. "Design Agentforce -- how does an agent act on a customer\'s CRM data + external system safely?" "Walk me through Data Cloud zero-copy federation against Snowflake + Databricks." "Design multi-tenant Apex execution with the governor limits."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / Ohana-values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a custom Apex trigger fires on a multi-tenant Salesforce org. How do governor limits work?"',
        '"Design Agentforce. An agent needs to read a customer Account + take an action in a downstream system (e.g. create a Zendesk ticket). Walk me through the trust + permission model."',
        '"Walk me through Data Cloud zero-copy federation. The data lives in customer Snowflake / Databricks. Salesforce queries against it without copying. How does this work at the metadata layer?"',
        '"Design multi-tenant Apex execution. 1M+ orgs share the runtime. Governor limits prevent noisy-neighbour. Walk me through the architecture."',
        '"You inherit a query optimisation that improves 90% of customer queries by 18% but adds 5% regression to one Fortune-500 customer\'s reporting dashboards. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in an Industry Cloud feature or a horizontal Agentforce capability. Argue your side."',
        '"What is your real opinion on the platform-everything + AppExchange thesis? Where does it win? Where does it create lock-in vs. value?"',
        '"Walk me through the most subtle bug you have hit in a multi-tenant SaaS system."',
        '"Why Salesforce and not [Microsoft Dynamics / HubSpot / SAP / a vertical SaaS]?"',
        '"How would you reduce platform query latency by 30% without changing the multi-tenant isolation guarantees?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Salesforce specifically' },
      { type: 'ol', items: [
        'No multi-tenant reasoning. Salesforce runs millions of orgs on shared infra. Stories that miss governor limits, multi-tenant isolation, and the trust-and-safety register miss the company.',
        'Generic CRM answers. Salesforce has very specific architecture (Apex + the platform runtime, SOQL + the query optimiser, Lightning + LWC, Hyperforce migration, Data Cloud federation). Generic answers miss Salesforce-specific context.',
        'No opinion on Agentforce. Agentforce is the central 2025+ strategy. Coming without an opinion on whether autonomous agents on CRM data work (vs co-pilot or human-in-the-loop) signals shallow prep.',
        'Missing the Ohana culture. The Salesforce values (Trust, Customer Success, Innovation, Equality, Sustainability) show up in interviews. Stories tone-deaf to the values miss the company\'s actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Sign up for Salesforce Developer Edition (free, 15 min). Browse Trailhead (Agentforce module). Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Multi-tenant runtime + governor limits, Apex + SOQL basics, Lightning + LWC, Agentforce + Atlas reasoning, Data Cloud federation. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Agentforce trust model, Data Cloud federation, multi-tenant Apex. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with multi-tenant + Ohana framing. 200 words each.',
        '70-78 min: Read the Salesforce values + a recent earnings call summary. Identify Data Cloud + Agentforce ARR trajectory.',
        '78-80 min: Close. One opinion on Agentforce, one specific Salesforce decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Salesforce remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF + Indianapolis + Atlanta + Dublin + Hyderabad hubs. RTO tightened in 2024. Some senior+ remote exceptions. Slack subsidiary retains more remote flexibility. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise SaaS band. Strong RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including enterprise SaaS platforms like Salesforce. Free at aimvantage.uk.' },

      { type: 'p', text: 'Salesforce hires engineers who can reason about multi-tenant SaaS, navigate the Agentforce + Data Cloud thesis, and engage with the Ohana culture honestly. Prep the multi-tenant + Apex stack, the Agentforce architecture, and a calibrated take on the platform-everything register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) SERVICENOW SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'servicenow-software-engineer-interview-2026',
    title: 'ServiceNow software engineer interview: the post-Now Assist + AI Agents 2026 loop',
    description: 'The ServiceNow software engineer interview in 2026 -- five stages, the post-Now Assist + AI Agents + Now Platform + Workflow Data Fabric context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['ServiceNow', 'Software Engineer Interview', 'Workflow Automation', 'Now Assist', 'AI Agents', 'Multi-tenant SaaS', 'Interview Prep'],
    excerpt: 'ServiceNow expanded from ITSM + workflow automation into AI Agents on the Now Platform with Now Assist + Workflow Data Fabric. The 2026 engineer loop tests for workflow-engine depth + the AI-agents-as-product thesis.',
    hook: 'ServiceNow is the enterprise workflow platform that bet the future on AI agents inside enterprise processes. The 2026 interview filters for engineers who can ship workflow-engines at Fortune-500 scale.',
    sections: [
      { type: 'p', text: 'ServiceNow (NYSE: NOW) expanded from IT Service Management (ITSM) + workflow automation into AI Agents on the Now Platform with Now Assist (the gen-AI sidekick across all surfaces, on the Now AI Platform), AI Agents (the autonomous-agent layer), Workflow Data Fabric (the zero-copy data integration layer), and the deeper Customer / Employee / Creator / Industry Workflow products. The 2026 engineering team is hiring across the Now Platform (the multi-tenant Java + JavaScript runtime), Now Assist + AI Agents (the gen-AI + agent stack), Workflow Data Fabric, the four Workflow product lines (IT, Customer, Employee, Creator), the Industry products (Healthcare, Financial Services, Telco, Public Sector), and the developer platform (App Engine, Now Create). The 2026 hiring bar is high but specific: workflow-engine depth, multi-tenant SaaS reasoning, and a calibrated take on the AI-Agents-in-enterprise-workflow thesis.' },

      { type: 'h2', text: 'The ServiceNow SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why ServiceNow, why this team. They will probe whether you understand the AI Agents thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the Now-Platform register.',
        'Technical screen -- 60 minutes. Live coding (Java for Now Platform; JavaScript for client-side and Now Script; Python for ML / Now Assist).',
        'System design -- 60 minutes. Real ServiceNow-shaped scenarios. "Design Now Assist -- a gen-AI sidekick that works across ITSM, CSM, HR. Walk me through the architecture." "Walk me through Workflow Data Fabric (zero-copy integration with SAP, Salesforce, Workday)." "Design AI Agents that resolve customer tickets autonomously with human escalation."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a workflow triggers in a customer\'s ServiceNow instance. Trace it from event to action."',
        '"Design Now Assist. A gen-AI sidekick that works across ITSM, CSM, HR -- shared model serving with per-domain context. Walk me through the architecture + the trust boundary."',
        '"Walk me through Workflow Data Fabric. Zero-copy integration with SAP, Salesforce, Workday. How does the metadata + permission propagation work?"',
        '"Design AI Agents that resolve customer tickets autonomously with human escalation. The agent has tool-use access to CMDB + APIs. Walk me through the safety model."',
        '"You inherit a Now Assist feature that improves resolution by 12% but adds a 5% false-resolution rate for one product family. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in Industry-specific workflows or horizontal AI Agents capabilities. Argue your side."',
        '"What is your real opinion on the AI Agents in enterprise workflow thesis? Where does it win? Where does it create trust risk?"',
        '"Walk me through the most subtle bug you have hit in a multi-tenant workflow runtime."',
        '"Why ServiceNow and not [Salesforce / Microsoft Power Platform / Pega / a vertical SaaS]?"',
        '"How would you reduce Now Platform query latency by 30% without breaking the multi-tenant isolation guarantees?"',
      ] },

      { type: 'h2', text: 'What kills candidates at ServiceNow specifically' },
      { type: 'ol', items: [
        'No workflow-engine reasoning. ServiceNow is structurally a workflow platform. Stories that miss the workflow-engine + Flow Designer + Business Rules + UI Builder context miss the company.',
        'Generic multi-tenant answers. ServiceNow has specific architecture (the Now Platform Java runtime, the instance-as-tenant model, the CMDB, the Flow Designer + Now Script). Generic answers miss ServiceNow-specific context.',
        'No opinion on AI Agents direction. AI Agents is the central 2025+ strategy. Coming without an opinion on whether agents-in-workflow works (vs co-pilot or pure-automation) signals shallow prep.',
        'Tone-deaf on enterprise-trust register. ServiceNow sells to the most regulated Fortune-500 enterprises. Stories that ignore compliance, data residency, GxP / HIPAA / FedRAMP miss the actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Browse the ServiceNow Developer Site + Now Create. Look at one Now Assist demo + one AI Agents demo.',
        '15-35 min: Stack drill. Now Platform architecture, Flow Designer + Business Rules, CMDB, Now Script, Now Assist + AI Agents architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Now Assist gen-AI sidekick, Workflow Data Fabric, AI Agents trust model. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with workflow + enterprise-trust framing. 200 words each.',
        '70-78 min: Read a recent ServiceNow earnings call summary. Identify Now Assist + AI Agents revenue trajectory.',
        '78-80 min: Close. One opinion on AI Agents direction, one specific ServiceNow decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is ServiceNow remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Santa Clara + Dublin + Hyderabad + Toronto + Chicago hubs. Some fully remote engineering roles within US + select EU + India. RTO tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise SaaS band. Strong RSU; total comp matches or exceeds FAANG mid-band at senior+ depending on stock price (ServiceNow has been a strong-performer).' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including workflow-platform companies like ServiceNow. Free at aimvantage.uk.' },

      { type: 'p', text: 'ServiceNow hires engineers who can reason about workflow engines at Fortune-500 scale, navigate the Now Assist + AI Agents register, and engage with the enterprise-trust + multi-tenant context honestly. Prep the Now Platform stack, the AI Agents architecture, and a calibrated take on the agents-in-enterprise trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) ZOOM SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'zoom-software-engineer-interview-2026',
    title: 'Zoom software engineer interview: the post-AI-Companion + Workplace + Workvivo 2026 loop',
    description: 'The Zoom software engineer interview in 2026 -- five stages, the post-AI Companion + Zoom Workplace + Workvivo + Phone context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Zoom', 'Software Engineer Interview', 'Video Communications', 'AI Companion', 'Workvivo', 'Real-time', 'Interview Prep'],
    excerpt: 'Zoom pivoted from pandemic video-conferencing into an AI-first Workplace platform with AI Companion 2.0, Zoom Workplace, Workvivo (employee experience), and the deeper Zoom Phone + Contact Center + Revenue Accelerator products. The 2026 engineer loop tests for real-time-systems depth + the AI-first pivot.',
    hook: 'Zoom is the post-pandemic communications company that bet the future on AI Companion. The 2026 interview filters for engineers who can ship real-time + AI at video-conferencing scale.',
    sections: [
      { type: 'p', text: 'Zoom (NASDAQ: ZM) pivoted from pandemic video-conferencing into an AI-first Workplace platform with AI Companion 2.0 (the cross-product AI assistant, no extra cost for paid customers), Zoom Workplace (the unified Meetings + Team Chat + Whiteboard + Mail + Calendar + Notes + Docs + Clips + Workspace surface), Workvivo (acquired 2023, employee experience platform), and the deeper Zoom Phone (cloud PBX, ~7M+ paid seats) + Contact Center + Revenue Accelerator (Sales / Service) + Zoom Events. The 2026 engineering team is hiring across the core real-time video / audio platform (the famous low-latency stack), AI Companion (the gen-AI + agent layer across all surfaces), Zoom Phone + Contact Center, Workvivo, the developer platform (Zoom Apps + SDK), and the new AI Studio (custom-companion-building). The 2026 hiring bar is competitive and specific: real-time-systems depth, comfort with the AI-first pivot, and a calibrated take on the post-pandemic platform thesis.' },

      { type: 'h2', text: 'The Zoom SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Zoom, why this team. They will probe whether you understand the AI-first pivot context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-pandemic register.',
        'Technical screen -- 60 minutes. Live coding (C++ for the real-time media stack; Java / Go for backend; TypeScript for frontend; Python for ML / AI Companion).',
        'System design -- 60 minutes. Real Zoom-shaped scenarios. "Design the Zoom Meetings video pipeline at 1000+ participants with simulcast + SVC." "Walk me through AI Companion -- a meeting summarisation + action-item agent across multiple surfaces." "Design Zoom Phone for sub-100ms p99 across global PSTN."',
        'Onsite or final loop -- 3 rounds: deeper coding (often C++ or Java), deeper system design, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when 500 participants join a Zoom meeting at peak. Trace the media routing + the simulcast + SVC decisions."',
        '"Design the Zoom Meetings video pipeline at 1000+ participants. Walk me through the SFU + simulcast + SVC trade-offs."',
        '"Walk me through AI Companion. Meeting summarisation + action-item extraction + chat-thread summary. Same model serving stack across surfaces. How do you handle the trust + privacy boundary?"',
        '"Design Zoom Phone for sub-100ms p99 across global PSTN. The codec + carrier-integration + media-routing trade-offs."',
        '"You inherit a feature that improves video quality by 15% on poor networks but adds 5% CPU on the client. The cohort affected is concentrated on older Mac Intel machines. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a Workvivo-integrated feature or a horizontal AI Companion capability. Argue your side."',
        '"What is your real opinion on the AI-first pivot? Where does it win? Where does the platform-everything risk apply?"',
        '"Walk me through the most subtle bug you have hit in real-time-media or video-codec systems."',
        '"Why Zoom and not [Microsoft Teams / Google Meet / Webex / Slack Huddles]?"',
        '"How would you reduce media-routing latency by 20% without weakening video quality on poor networks?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Zoom specifically' },
      { type: 'ol', items: [
        'No real-time reasoning. Zoom is structurally a real-time media platform. Stories that miss SFU / simulcast / SVC / NACK / FEC / jitter-buffer concepts miss the company.',
        'Generic video answers. Zoom has specific architecture (the Multimedia Router, the famous AES-256-GCM key management, the Phone codec stack, the AI Companion model gateway). Generic answers miss Zoom-specific context.',
        'No opinion on the AI-first pivot. AI Companion is the central 2025+ strategy. Coming without an opinion on whether bundling AI free for paid customers works (vs separate pricing) signals shallow prep.',
        'Tone-deaf on the 2020-21 security context. Zoom-bombing + the end-to-end-encryption debate shaped the post-2020 register. Stories that ignore the trust + security register miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Zoom Workplace + AI Companion for 10 minutes. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. SFU + simulcast + SVC, codecs (H.264, VP9, AV1) + bitrate adaptation, the Multimedia Router, AI Companion architecture, Zoom Phone codec + PSTN. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Meetings pipeline at 1000 participants, AI Companion across surfaces, Zoom Phone latency. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with real-time + trust-and-safety framing. 200 words each.',
        '70-78 min: Read on Zoom vs Teams vs Google Meet. Articulate where Zoom wins (quality, UX, AI Companion bundle) vs where competitors win (productivity-suite integration).',
        '78-80 min: Close. One opinion on the AI-first pivot, one specific Zoom decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Zoom remote in 2026?' },
      { type: 'p', text: 'Hybrid -- San Jose + Denver + Singapore + Pune + Mexico hubs. The "structured hybrid" model: 2 days/week in office. Some senior+ remote exceptions. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band SaaS comp post-2022 stock correction. RSU is meaningful but stock has been range-bound. Total comp competitive with FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including real-time + AI communications platforms like Zoom. Free at aimvantage.uk.' },

      { type: 'p', text: 'Zoom hires engineers who can reason about real-time media at planetary scale, navigate the AI-first pivot, and engage with the post-pandemic platform-everything register honestly. Prep the SFU + simulcast stack, the AI Companion architecture, and a calibrated take on the workplace-bundle thesis.' },
    ],
  },
];
