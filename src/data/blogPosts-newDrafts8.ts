// 3 enterprise SaaS interview-guide posts -- batch 8, drafted 2026-05-10
// Shopify / Atlassian / ServiceNow. Multi-thousand-engineer companies that
// hire steadily through 2026 -- aligned with the laid-off-FAANG ICP.

import type { BlogPost } from './blogPosts';

export const newBlogPosts8: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) SHOPIFY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'shopify-software-engineer-interview-2026',
    title: 'Shopify software engineer interview: the post-AI-restructure 2026 loop',
    description: 'The Shopify software engineer interview in 2026 -- five stages, the post-AI-default culture pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Shopify', 'Software Engineer Interview', 'E-commerce', 'AI Hiring', 'Interview Prep', 'Ruby', 'Tech Hiring'],
    excerpt: 'Shopify\'s engineering bar shifted in 2024-25 around Tobi Lutke\'s "AI as default" memo. The 2026 loop tests for one specific signal most candidates underestimate: do you reach for AI before headcount?',
    hook: 'Shopify\'s "AI before headcount" memo reshaped the engineering interview. Most candidates miss the filter that comes from it -- and lose the round in 5 minutes.',
    sections: [
      { type: 'p', text: 'Shopify is public (NYSE: SHOP), profitable, and has reorganised significantly around Tobi Lutke\'s 2024-25 directive: any new headcount request must first prove that AI cannot do the work. The engineering bar in 2026 reflects that. The Ruby + Rails + GraphQL + React stack has not changed; the cultural register has. Most candidates underestimate two things: the seriousness of the AI-first filter, and how directly Shopify interviewers reward thoughtful disagreement.' },

      { type: 'h2', text: 'The Shopify engineering process -- 5 stages, ~3-4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Shopify, why this team. They will probe whether you have a real opinion on the "AI as default" thesis.',
        'Life Story -- 60 minutes. Behavioural deep-dive, distinctively Shopify. They walk back through your career and probe at decision points. Calibrated to detect rehearsal.',
        'Pair programming -- 60 minutes. Live Ruby (or your strongest language). Moderate problem in the realm of e-commerce / merchant tooling.',
        'System design -- 60 minutes. Real Shopify-shaped scenarios. "Design checkout at 100K TPS during Black Friday peak." "How does Shop Pay tokenisation work end-to-end?" "Walk me through the AI agent that we would use for merchant support triage."',
        'Onsite or final loop -- 2-3 rounds: deeper coding or design, plus a culture / leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"You are about to ask for headcount. Walk me through how you proved AI cannot do the work first."',
        '"Walk me through what happens during checkout when a card is declined. Where does state live, and what is the recovery flow?"',
        '"Design checkout to handle 100K TPS during Black Friday peak. Walk me through the architecture."',
        '"You disagree with a senior engineer on whether to use Sorbet or stay on plain Ruby for a new service. Argue your side for 5 minutes."',
        '"Pick a Shopify product surface. Tell me three things you would change. Defend each."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on the AI-as-default directive? Where do you draw the line?"',
        '"Tell me about a production incident in a high-traffic system you owned. What did the postmortem look like?"',
        '"Why Shopify and not Stripe, Square, or Adyen?"',
        '"What is the smallest feature you have shipped that you are most proud of?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Shopify specifically' },
      { type: 'ol', items: [
        'No real engagement with the AI-first directive. "I love AI" is not an answer. "I would not let an AI agent issue refunds above $200 without confirmation because the false-positive cost is 100x the labour saved" is. Calibrated takes win.',
        'Rehearsed Life Story answers. The Life Story round is built to detect rehearsal. Stories that sound polished and consistent across follow-up questions get flagged as fabricated. Have specific failures with concrete metrics that survive grilling.',
        'No Ruby fluency. You do not need to recite YARV internals. You do need to read Ruby idiomatically and reason about Rails ActiveRecord performance, GraphQL resolvers, and Sorbet type adoption trade-offs.',
        'Underestimating commerce-specific complexity. Stripe-shaped reasoning works partially; Shopify-shaped reasoning expects you to think about merchant onboarding, multi-currency, multi-tax-jurisdiction, and the inventory + fulfillment leg as well.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read Tobi Lutke\'s most recent published memo plus the latest Shopify investor update. Write down three opinions you have on the AI-first thesis.',
        '15-30 min: Stack drill. Ruby/Rails idioms, GraphQL resolver performance, Sorbet trade-offs, Shop Pay flow, multi-tenant isolation. Two minutes per concept.',
        '30-50 min: System design. Pick one of -- checkout at peak, Shop Pay tokenisation, AI agent for merchant support. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '50-65 min: Story drill. Three Life-Story-shaped stories with concrete metrics + real failures. 200 words each. Drill follow-up questions.',
        '65-75 min: Commerce drill. Currency conversion, tax jurisdiction, refund flow, inventory reconciliation. One sentence on each.',
        '75-80 min: Close. One opinion on AI-as-default, one specific Shopify decision you would change, one question for the hiring manager that proves you read the latest Lutke memo.',
      ] },

      { type: 'h2', text: 'On the Life Story round' },
      { type: 'p', text: 'This round is unique to Shopify. The interviewer walks back through your career chronologically, probing at decision points. The trap: candidates who give polished STAR stories tuned for a generic FAANG loop fail because the round is built specifically to detect that pattern. The register that wins is honest, specific, and willing to say "I do not know" when the answer is genuinely "I do not know."' },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Shopify remote in 2026?' },
      { type: 'p', text: 'Mostly yes. Shopify went "digital by default" in 2020 and has not reverted. Toronto, Ottawa, SF hubs but most engineering roles are remote-friendly across NA + EU. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of Canadian market for engineering. SF roles competitive with FAANG mid-tier. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in Canada. Some US sponsorship but selective. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-first companies like Shopify where the JD undersells how seriously the directive is enforced. Free at aimvantage.uk.' },

      { type: 'p', text: 'Shopify hires engineers who engage with the AI-first thesis specifically, survive the Life Story round honestly, and reason about commerce-shaped systems at peak load. Prep the Lutke memo, the Ruby stack, and a calibrated take on where the AI directive breaks.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) ATLASSIAN SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'atlassian-software-engineer-interview-2026',
    title: 'Atlassian software engineer interview: the AI-Rovo era 2026 loop',
    description: 'The Atlassian software engineer interview in 2026 -- five stages, the post-Rovo AI agent platform pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Atlassian', 'Software Engineer Interview', 'Enterprise SaaS', 'Rovo', 'AI Hiring', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Atlassian (Jira, Confluence, Bitbucket) has reorganised hiring around the Rovo AI agent platform. The engineering loop now filters for whether you can reason about teamwork software in an agent-native world.',
    hook: 'Atlassian\'s engineering bar moved with the Rovo AI agent launch. Most candidates still prep for the 2023 Jira-PM-shaped loop and lose accordingly.',
    sections: [
      { type: 'p', text: 'Atlassian (NASDAQ: TEAM) is public, profitable on adjusted free cash flow, and has reorganised significantly around the Rovo AI agent platform since 2024. Jira, Confluence, Bitbucket, Trello, and the Atlassian Intelligence layer all hire engineers, but the bar has shifted: where 2023 Atlassian interviews were almost entirely SaaS architecture and team-collaboration product reasoning, 2026 interviews now blend that with AI agent reasoning -- agent-to-agent workflows, multi-step task chaining, human-in-the-loop trade-offs.' },

      { type: 'h2', text: 'The Atlassian engineering process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Atlassian, why this team. They probe whether you have used Rovo seriously.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the AI-agent-era register.',
        'Coding -- 60 minutes. Live or take-home. Backend roles get a moderate problem with multi-tenant or workflow trade-offs.',
        'System design -- 60 minutes. Real Atlassian-shaped scenarios. "Design Rovo at 50M users with sub-1s p99 for agent-to-agent calls." "Walk me through how Jira Cloud handles a 100K-issue project query under load." "Design the audit trail for Confluence agent edits."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how Rovo would handle a multi-step workflow that spans Jira, Confluence, and an external API. Where does state live? Where do failures bite?"',
        '"Design Jira Cloud to handle a 100K-issue project query under load. Sub-second p99."',
        '"You are designing the audit trail for Confluence when a Rovo agent edits a page. What do you log, and what do you NOT log?"',
        '"You disagree with a senior engineer on whether to gate a destructive Rovo action behind explicit user confirmation or behind confidence thresholds. Argue your side for 5 minutes."',
        '"Pick an Atlassian product surface. Tell me three things you would change. Defend each."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on AI agents replacing PM busywork in Jira? Where do you draw the line?"',
        '"Tell me about a production incident in a multi-tenant SaaS you owned. What did the postmortem look like?"',
        '"Why Atlassian and not Notion, Linear, or Asana?"',
        '"What is wrong with the Atlassian Intelligence pricing model? Be specific."',
      ] },

      { type: 'h2', text: 'What kills candidates at Atlassian specifically' },
      { type: 'ol', items: [
        'No engagement with the Rovo / AI-agent thesis. Atlassian has invested heavily in Rovo. "AI agents in workflow tools is interesting" is not an answer. "I would not let a Rovo agent close a Jira ticket marked critical without explicit human approval because the false-positive cost on premature closure is too high" is calibrated.',
        'Generic SaaS architecture answers. Atlassian operates at multi-tenant scale across thousands of enterprise customers. "I would shard by tenant" is not enough. "I would shard by tenant, but route the top 1% of customers to dedicated infra because their query volume is 3 sigma above the long tail and the noisy-neighbour cost is high" is.',
        'Underestimating the values round. Atlassian runs a serious values round (Open company, no bullshit; Build with heart and balance; Don\'t #@!% the customer; Play, as a team; Be the change you seek). They are not slogans. Have specific stories tied to each.',
        'Missing the multi-product context. Atlassian is no longer just Jira. If your answers do not reason across Jira + Confluence + Bitbucket + Rovo + Compass interactions, the round goes shallow.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Open Rovo. Use it for 15 minutes on a real workflow. Note three friction points and three things you respect.',
        '15-35 min: Stack drill. Atlassian Intelligence layer (architecture overview), Forge (extension platform), Rovo agent runtime, Jira REST API patterns, Confluence content APIs. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Rovo at scale, Jira query under load, audit trail for agent edits. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Three stories tied to Atlassian values -- open company / no bullshit (a time you flagged something honestly), don\'t screw the customer (a time you slowed down to do it right), play as a team (a cross-functional disagreement you owned). 200 words each.',
        '70-80 min: Close. One opinion on the Rovo direction, one specific Atlassian decision you would change, one question for the hiring manager that proves you have used the products.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Atlassian remote in 2026?' },
      { type: 'p', text: 'Mostly yes. Atlassian went "Team Anywhere" in 2020 and has not reverted. Sydney, SF, Mountain View, Bengaluru, Amsterdam, and Yerevan are hubs; most engineering roles are remote-friendly within timezone-overlap regions. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of Sydney market for senior+ engineering. Below SF FAANG on cash. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in Australia and India hubs. Some US sponsorship. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including AI-agent-platform pivots like Atlassian. Free at aimvantage.uk.' },

      { type: 'p', text: 'Atlassian hires engineers who engage with the Rovo agent thesis, reason about multi-tenant SaaS at enterprise scale, and survive the values round with real stories. Prep the agent-era stack, the multi-product context, and a calibrated take on where Rovo should and should not go.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) SERVICENOW SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'servicenow-software-engineer-interview-2026',
    title: 'ServiceNow software engineer interview: the Now Assist 2026 loop',
    description: 'The ServiceNow software engineer interview in 2026 -- five stages, the Now Assist AI platform pivot, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['ServiceNow', 'Software Engineer Interview', 'Enterprise SaaS', 'Now Assist', 'AI Hiring', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'ServiceNow has shipped Now Assist as a structural part of every workflow product. The engineering loop now expects production-traffic reasoning AND a real opinion on enterprise AI in regulated workflows.',
    hook: 'ServiceNow is the largest enterprise SaaS company most engineers underestimate. The Now Assist pivot has tightened the bar specifically around regulated-workflow AI reasoning.',
    sections: [
      { type: 'p', text: 'ServiceNow (NYSE: NOW) is public, has 8,000+ enterprise customers, and operates the workflow platform that runs IT, HR, customer service, and security operations for a meaningful slice of the Fortune 500. The Now Assist AI platform shipped as a cross-product layer in 2024 and has been deepened steadily since. The engineering bar in 2026 is high but specific: production-traffic reasoning at enterprise scale, plus a calibrated take on AI in regulated workflows where false-positive costs are catastrophic.' },

      { type: 'h2', text: 'The ServiceNow engineering process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why ServiceNow, why this team. They probe whether you have a real opinion on enterprise SaaS vs consumer SaaS trade-offs.',
        'Technical screen -- 60 minutes. Live coding (Java is the strong default; JavaScript/TypeScript for Now Platform UI roles). Moderate problem.',
        'System design -- 60 minutes. Real ServiceNow-shaped scenarios. "Design Now Assist incident triage at 1M tickets/day." "Walk me through how the Workflow Studio engine schedules cross-application steps under load." "How does the platform handle a multi-tenant CMDB query at scale?"',
        'Behavioural / values -- 60 minutes. Customer obsession, hunger for innovation, ownership, integrity. ServiceNow runs the values round seriously.',
        'Onsite or final loop -- 3 rounds: deeper system design, cross-functional, and a leadership round (often a Director or VP).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how Now Assist would triage an incident from a Fortune 500 IT team. Where do you draw the human-in-the-loop line?"',
        '"Design incident triage at 1M tickets/day, p99 under 2 seconds. Walk me through the architecture."',
        '"You disagree with a senior engineer on whether to ship a Now Assist feature behind a flag or as default-on for enterprise customers. Argue your side."',
        '"Walk me through how multi-tenant CMDB queries scale on the Now Platform."',
        '"You are paged at 03:00 because Workflow Studio is slow for one specific customer. First three actions?"',
        '"Pick a ServiceNow product surface. Tell me three things you would change. Defend each."',
        '"What is your real opinion on AI in regulated enterprise workflows? Where does the false-positive cost outweigh the labour saving?"',
        '"Tell me about a production incident in a multi-tenant system you owned. What did the postmortem look like?"',
        '"Why ServiceNow and not Salesforce, Microsoft Dynamics, or Atlassian?"',
        '"What is wrong with the Now Assist pricing model? Be specific."',
      ] },

      { type: 'h2', text: 'What kills candidates at ServiceNow specifically' },
      { type: 'ol', items: [
        'No reasoning on regulated enterprise AI. ServiceNow customers operate in heavily regulated industries -- finance, healthcare, government. "AI is going to change everything" is not an answer. "I would not let Now Assist auto-approve a privileged-access request because the false-positive cost on a SOX-relevant workflow is catastrophic" is calibrated.',
        'Underestimating multi-tenant complexity. ServiceNow runs thousands of enterprise tenants on the same platform. "I would shard by tenant" is not enough. "I would shard by tenant + maintain a hot pool for the top 5% by query volume because the long-tail noise pattern would otherwise impact p99 for big customers" is.',
        'Missing the Now Platform model. ServiceNow is not just "the IT ticketing tool." It is a workflow platform that customers extend with custom apps. If you cannot reason about the platform / customisation layer trade-offs, the round goes shallow.',
        'Generic STAR stories on the values round. Customer obsession, hunger for innovation, ownership, integrity. They are weighted heavily in the rubric. Have specific stories tied to each, with concrete metrics.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent ServiceNow earnings call summary plus the latest Now Assist blog post. Write down three opinions you have on the AI-platform trajectory.',
        '15-35 min: Stack drill. Now Platform architecture (compute, datastore, file), Workflow Studio engine, Now Assist LLM integration patterns, RaptorDB, Service Graph, multi-instance vs multi-tenant trade-offs. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Now Assist incident triage at 1M/day, multi-tenant CMDB query, Workflow Studio cross-app scheduling. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Four stories tied to values -- customer obsession (a feature you shipped from a customer escalation), hunger for innovation (a process you simplified), ownership (a production incident you owned), integrity (a time you raised a concern). 200 words each.',
        '70-80 min: Enterprise / regulated context refresher. SOX, HIPAA, FedRAMP, SOC 2 basics. You will not be quizzed; you will be busted if you cannot lean on these.',
        '80-85 min: Close. One opinion on enterprise AI, one specific ServiceNow decision you would change, one question for the hiring manager that proves you read the latest investor update.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is ServiceNow remote in 2026?' },
      { type: 'p', text: 'Hybrid. Santa Clara, San Diego, Hyderabad, Dublin, London for most engineering roles. 2-3 days a week in office. Some staff+ roles open to fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise-SaaS market. Competitive with Salesforce, Workday, Snowflake on cash. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in most markets. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including regulated-enterprise SaaS like ServiceNow. Free at aimvantage.uk.' },

      { type: 'p', text: 'ServiceNow hires engineers who can reason about multi-tenant platform architecture at Fortune 500 scale, hold a calibrated take on AI in regulated workflows, and operate with enterprise-SaaS rigour. Prep the Now Platform stack, the Now Assist context, and the regulated-workflow AI trade-offs.' },
    ],
  },
];
