// 3 more interview-guide posts -- batch 14
// IBM (legacy + AI), Reddit (post-IPO), Plaid (fintech infra).

import type { BlogPost } from './blogPosts';

export const newBlogPosts14: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) IBM SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'ibm-software-engineer-interview-2026',
    title: 'IBM software engineer interview: the watsonx + Granite 2026 loop',
    description: 'The IBM software engineer interview in 2026 -- five stages, the watsonx + Granite enterprise-AI pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['IBM', 'Software Engineer Interview', 'watsonx', 'Granite', 'Enterprise AI', 'Hybrid Cloud', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'IBM rebuilt its engineering pitch around watsonx + Granite open-weight models. The 2026 loop favours engineers who can navigate the Red Hat acquisition heritage + bring fresh enterprise-AI thinking.',
    hook: 'IBM is not the IBM of 2018. The Granite open-weight models + watsonx + Red Hat heritage create a distinctive engineer interview that most candidates underestimate.',
    sections: [
      { type: 'p', text: 'IBM (NYSE: IBM) is a 110-year-old company that rebuilt its engineering identity around watsonx (their AI platform), Granite (their open-weight model family), and the Red Hat acquisition (OpenShift / Linux). The engineering team is hiring across watsonx model serving, Red Hat platform / OpenShift, security (post-HashiCorp acquisition), Z mainframe modernisation, and quantum (Qiskit). The bar in 2026 is high but heterogeneous: it varies sharply by team, with watsonx and Red Hat being the most modern, mainframe being the most traditional.' },

      { type: 'h2', text: 'The IBM SWE process -- 5 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why IBM, why this team. They will probe whether you understand the watsonx vs Red Hat vs mainframe distinction.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency tied to the specific team\'s stack.',
        'Technical screen -- 60 minutes. Live coding (Java for Red Hat / OpenShift; Python for watsonx; COBOL for mainframe modernisation if applicable). Moderate problem.',
        'System design -- 60 minutes. Real IBM-shaped scenarios. "Design watsonx Granite serving for an enterprise customer with 1B daily inferences across 50 regulated industries." "Walk me through how OpenShift schedules a multi-tenant AI workload across hybrid cloud." "Modernise a 30-year-old COBOL settlement system without halting daily transactions."',
        'Onsite or final loop -- 3-4 rounds: behavioural, cross-functional, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through Granite\'s open-weight strategy. Where is IBM right? Where is Mistral / Llama right that IBM is not?"',
        '"Design watsonx model serving for an enterprise customer with strict data-residency requirements (EU customer, no data leaves Frankfurt region)."',
        '"How does OpenShift schedule a multi-tenant AI workload across hybrid cloud (some pods on customer\'s on-prem, some on IBM Cloud)?"',
        '"You inherit a 30-year-old COBOL system that handles £40bn/day. Modernise it without breaking it. Six month plan."',
        '"You disagree with a senior architect on whether to use Granite or fine-tune Llama for an enterprise customer. Argue your side for 5 minutes."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on enterprise AI in regulated industries? Where does the false-positive cost actually outweigh the labour saving?"',
        '"Tell me about a production incident you owned end-to-end. What did the postmortem look like?"',
        '"Why IBM and not [Microsoft Azure / Google Cloud / AWS]? What does IBM do better for your specific target customer profile?"',
        '"Pick an IBM product surface (watsonx / Red Hat / Z / Quantum). Tell me three things you would change."',
      ] },

      { type: 'h2', text: 'What kills candidates at IBM specifically' },
      { type: 'ol', items: [
        'Treating IBM as one company. IBM watsonx, Red Hat, IBM Z, and IBM Quantum are functionally different companies. Stories framed for one team often miss the others. Confirm at the recruiter screen which one you are interviewing for.',
        'Underestimating regulated-industry context. IBM\'s biggest customers are banks, insurance, healthcare, government. "Just ship it" answers fail. "I would not let watsonx auto-generate medical imaging interpretations because the regulatory liability under FDA software-as-a-medical-device falls on us" is calibrated.',
        'No opinion on the Granite open-weight strategy. IBM has explicitly bet on commercially-licensed open weights as a differentiator vs Mistral / Llama. Coming in without an opinion on this strategy signals you have not done the homework.',
        'Generic FAANG STAR stories. IBM hiring managers grade differently from FAANG. They care about cross-functional + cross-business-unit collaboration more, individual contribution slightly less. Frame your stories around partnership + enterprise-customer outcomes.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the most recent watsonx blog post + the latest Granite model card. Identify three opinions you have on the Granite open-weight strategy + watsonx positioning.',
        '15-35 min: Stack drill specific to your target team. watsonx: model serving stack, vector database integration, RAG patterns. Red Hat: OpenShift architecture, OperatorHub patterns, Ansible automation. Z: COBOL modernisation patterns, IMS / DB2, transaction processing. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- watsonx serving with data residency, OpenShift hybrid AI workload, COBOL system modernisation. Write a one-page memo with regulated-industry constraints baked in.',
        '55-70 min: Story drill. Three stories with cross-functional + enterprise-customer framing. 200 words each.',
        '70-78 min: Regulated-industry primer. SOC 2, HIPAA, FedRAMP, FINRA, FCA basics. You will not be quizzed; you will be busted if you cannot lean on these.',
        '78-80 min: Close. One opinion on Granite + the open-weight strategy, one specific IBM decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is IBM remote in 2026?' },
      { type: 'p', text: 'Hybrid for most engineering roles since 2024 RTO. Major hubs: Armonk NY, Raleigh NC (Red Hat), Dublin (EMEA), Bangalore (APAC). Some staff+ roles fully remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-of-market for FAANG-comparable roles, top-of-market for the IBM lifestyle (work-life balance, comprehensive benefits, more PTO than FAANG average). Below-FAANG on cash; total-comp gap closes if you weight benefits.' },
      { type: 'h3', text: 'Can you transfer between watsonx and Red Hat?' },
      { type: 'p', text: 'Yes — internal mobility is one of IBM\'s real strengths. Most senior+ engineers have crossed business units at least once. Mention internal-mobility intent explicitly at the recruiter screen if it appeals.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including heterogeneous-stack shops like IBM. Free at aimvantage.uk.' },

      { type: 'p', text: 'IBM hires engineers who can navigate the watsonx / Red Hat / Z heterogeneity, hold opinions on the Granite open-weight bet, and reason about regulated-industry constraints. Prep specific to your target team — generic IBM prep loses to team-specific prep.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) REDDIT SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'reddit-software-engineer-interview-2026',
    title: 'Reddit software engineer interview: the post-IPO 2026 loop',
    description: 'The Reddit software engineer interview in 2026 -- five stages, the post-IPO efficiency mandate + AI training-data licensing pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Reddit', 'Software Engineer Interview', 'Social', 'AI Training Data', 'Distributed Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Reddit IPO\'d in March 2024 and has been growing aggressively into AI-training-data licensing + ad revenue. The 2026 loop tests for community-platform reasoning + post-IPO discipline.',
    hook: 'Reddit IPO\'d in 2024 and ran the AI-training-data play hard. The 2026 engineer loop tests community-platform reasoning + post-IPO discipline.',
    sections: [
      { type: 'p', text: 'Reddit (NYSE: RDDT) IPO\'d in March 2024, has been growing aggressively into AI-training-data licensing (Google deal, OpenAI deal), and operates a 850M+ MAU community platform with the unique constraint that most content is community-moderated. The engineering team is hiring across the consumer site, the ML / personalisation team, the ad platform, the developer platform, and the new training-data licensing infrastructure. The bar in 2026 is high but specific: community-platform reasoning (moderation, content quality, abuse), real-time systems comfort, and a calibrated take on the AI-licensing strategy.' },

      { type: 'h2', text: 'The Reddit SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Reddit, why this team. They will probe whether you have used Reddit seriously and have a real opinion on the platform.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-IPO efficiency register.',
        'Technical screen -- 60 minutes. Live coding (Python is the strong default for backend; TypeScript for frontend; Go for some new services). Moderate problem.',
        'System design -- 60 minutes. Real Reddit-shaped scenarios. "Design the front-page ranking algorithm at 850M MAU with sub-200ms p99." "Walk me through how Reddit handles a sudden 10x traffic spike on a viral thread." "Design the AI-training-data licensing API for OpenAI / Google with proper rate limiting and access auditing."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how the Reddit front-page ranks 100M posts in real time across 100K active subreddits."',
        '"Design the response to a viral thread: 10x normal traffic for 4 hours. What gets bottlenecked, what breaks first?"',
        '"You disagree with a senior engineer on whether to ship a feature that improves engagement but risks moderator burnout. Argue your side for 5 minutes."',
        '"Walk me through the AI-training-data licensing infrastructure. How do you grant access to OpenAI without giving them the firehose AND audit what they actually consumed?"',
        '"Pick a Reddit product surface. Tell me three things you would change. Defend each."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on the AI-training-data licensing strategy? Where is Reddit right? Where is Reddit overcharging or undercharging?"',
        '"Tell me about a time you had to make a call that affected the moderator community. How did you approach it?"',
        '"Why Reddit and not [Twitter / Discord / Bluesky / Substack]?"',
        '"How would you reduce Reddit\'s cost-per-MAU by 20% without degrading user experience?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Reddit specifically' },
      { type: 'ol', items: [
        'Not using Reddit seriously. Reddit hires engineers who use the product. If you cannot name 5 subreddits you actively read, the recruiter screen ends fast.',
        'Underestimating moderation complexity. Reddit is community-moderated; engineers cannot ignore the moderator class. Stories that frame moderation as a back-office function score low; stories that frame moderators as primary stakeholders score high.',
        'No opinion on the AI-licensing strategy. Reddit has bet hard on this. Coming in without an opinion on the OpenAI / Google deals signals you have not done the homework.',
        'Generic startup stories. Reddit is now a public company. Stories framed for "we shipped fast at a startup" land badly. Frame for the post-IPO register: shipped fast WITH measured outcome AND fewer engineers.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Reddit for 15 minutes on a real interest. Subscribe to 5 subreddits if you are not already a daily user. Note three friction points.',
        '15-35 min: Stack drill. Reddit\'s old.reddit + new.reddit architecture, the 2018-2024 rebuild, ranking algorithm (hot / best / controversial), the AI-licensing API design, real-time WebSocket architecture for live threads, ad-targeting infrastructure. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- front-page ranking at scale, viral thread spike handling, AI-licensing API. Write a one-page memo with real Reddit-stack reasoning.',
        '55-70 min: Story drill. Three behavioural stories with concrete metrics + post-IPO discipline framing. 200 words each.',
        '70-78 min: Earnings call audit. Read the most recent Reddit earnings call summary. Identify three opinions you have on the ad-revenue vs AI-licensing-revenue mix.',
        '78-80 min: Close. One opinion on AI-licensing strategy, one specific Reddit decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Reddit remote in 2026?' },
      { type: 'p', text: 'Hybrid. SF HQ, NYC, London. 3 days a week in office for most engineering roles. Some staff+ remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for the public-social space. Listed equity is liquid. London base lags SF by ~30%.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-IPO consumer platforms like Reddit. Free at aimvantage.uk.' },

      { type: 'p', text: 'Reddit hires engineers who use the product, hold opinions on the AI-licensing strategy, and reason about community-platform constraints. Prep the moderation context, the ranking stack, and a calibrated take on the AI-deal economics.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) PLAID SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'plaid-software-engineer-interview-2026',
    title: 'Plaid software engineer interview: the open-finance 2026 loop',
    description: 'The Plaid software engineer interview in 2026 -- five stages, the open-finance regulatory shift, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Plaid', 'Software Engineer Interview', 'Fintech Infrastructure', 'Open Banking', 'API Platform', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Plaid sits at the centre of US open-finance as the Section 1033 rules came into effect. The 2026 engineer loop tests for fintech-API depth + regulatory awareness + a real opinion on the bank-permissioned-data future.',
    hook: 'Plaid is the fintech-infrastructure company most engineers underestimate. The Section 1033 open-finance rules in 2024-25 reshaped what Plaid does — the interview reflects it.',
    sections: [
      { type: 'p', text: 'Plaid is private, has been growing through the post-2024 Section 1033 open-finance regulatory shift, and powers the bank-data layer for thousands of US fintechs (Venmo, Robinhood, Chime, etc.). The engineering team is hiring across core API, data quality / liability, fraud / risk, identity, and the new permissioned-data infrastructure required by 1033. The bar in 2026 is high but specific: fintech-API depth, regulatory awareness (CFPB, Section 1033, OAuth-style bank-permissioned-data), and comfort with the messy reality of US banking integration.' },

      { type: 'h2', text: 'The Plaid SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Plaid, why this team. They will probe whether you have a real opinion on the post-1033 open-finance landscape.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency tied to fintech-API context.',
        'Technical screen -- 60 minutes. Live coding (Go is the strong default; some Python for data platform). Moderate-to-hard problem.',
        'System design -- 60 minutes. Real Plaid-shaped scenarios. "Design the bank-permissioned-data flow for a customer connecting Bank of America for the first time. p99 under 3s." "Walk me through how Plaid handles a bank API change without breaking 1,000 customers." "Design the fraud-signal aggregation pipeline at 1B+ daily transactions."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Plaid user clicks \'Connect Bank of America\'. Trace it end-to-end."',
        '"Design the bank-permissioned-data flow for the Section 1033 era. Where does OAuth fit? Where does it not fit?"',
        '"You inherit an integration with [bank X] that has 80% reliability. Six month plan to get it to 99.5%."',
        '"Walk me through how Plaid handles a bank changing their API without warning at 02:00. What systems detect it? What recovers?"',
        '"You disagree with a senior engineer on whether to ship a feature that improves connection success rate by 2% but introduces a data-quality issue affecting 0.1% of transactions. Argue your side for 5 minutes."',
        '"What is your real opinion on the post-Section-1033 landscape? Where is Plaid still the right architecture? Where do banks bypass us in 3 years?"',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"Tell me about a production incident you owned end-to-end. What did the postmortem look like?"',
        '"Why Plaid and not [Stripe / Modern Treasury / a TradFi vendor / a fintech that has built its own connectivity]?"',
        '"How do you reason about the cost of a bank integration vs the LTV of customers who use it?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Plaid specifically' },
      { type: 'ol', items: [
        'No regulatory awareness. Plaid operates inside CFPB jurisdiction post-2024. "I just want to ship code" answers fail. Have a calibrated take on Section 1033 + the open-finance regulatory framework.',
        'Generic API platform answers. "I would use REST + JSON" is not enough. Plaid has specific integration challenges (banks with no public API, banks with legacy SOAP endpoints, banks rotating credentials). Frame answers around those messy realities.',
        'Underestimating data quality. Plaid is fundamentally a data-quality company. If your stories don\'t demonstrate care about the 0.1%-of-transactions edge cases, the system design round goes shallow.',
        'Stories without measured liability. At Plaid, stories about shipping new connections need to engage with what could go wrong (incorrect transaction categorisation = legal exposure for fintech customers). Frame stories with explicit liability awareness.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Plaid Developer Hub overview + the most recent CFPB / Section 1033 explainer. Identify three opinions you have on the post-2024 open-finance landscape.',
        '15-35 min: Stack drill. Plaid Link integration flow, Open Banking standards (OBIE for UK, OFX for legacy US), OAuth bank-permissioned-data flow, screen-scraping fallback architecture, transaction enrichment pipeline. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- bank-permissioned-data flow at scale, integration self-healing on bank API changes, fraud-signal aggregation. Write a one-page memo with messy banking-integration reality baked in.',
        '55-70 min: Story drill. Three behavioural stories with concrete metrics + liability framing. 200 words each.',
        '70-78 min: Regulatory primer. CFPB Section 1033, FFIEC guidance, the post-Cantwell open-finance bills, GLBA basics. You will not be quizzed; you will be busted if you cannot lean on these.',
        '78-80 min: Close. One opinion on the post-1033 future, one specific Plaid decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Plaid remote in 2026?' },
      { type: 'p', text: 'Hybrid. San Francisco, NYC, London. 2-3 days a week in office for most engineering roles. Some staff+ remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top-of-market for fintech infrastructure. Below-FAANG on RSU upside (private valuation more conservative); cash competitive. London base lags SF by ~25-30%.' },
      { type: 'h3', text: 'Do you need fintech background?' },
      { type: 'p', text: 'No, but you need to be comfortable spending the first 4 weeks ramping on banking-integration realities (multi-decade-old systems, screen scraping fallbacks, etc). Most candidates from non-fintech backgrounds successfully transition; FAANG-only-experienced candidates sometimes struggle with the messy-real-world register.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including fintech-infrastructure shops like Plaid. Free at aimvantage.uk.' },

      { type: 'p', text: 'Plaid hires engineers who can reason about messy bank-integration reality, hold opinions on the post-1033 open-finance landscape, and ship with explicit liability awareness. Prep the regulatory context, the integration patterns, and stories with measurable data-quality outcomes.' },
    ],
  },
];
