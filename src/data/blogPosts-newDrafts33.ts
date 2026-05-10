// 3 more interview-guide posts -- batch 33 (HR tech)
// Rippling, Gusto, Deel.

import type { BlogPost } from './blogPosts';

export const newBlogPosts33: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) RIPPLING SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'rippling-software-engineer-interview-2026',
    title: 'Rippling software engineer interview: the post-Compound-Startup + Spend + Global 2026 loop',
    description: 'The Rippling software engineer interview in 2026 -- five stages, the post-Compound-Startup + Spend + Global Payroll + IT context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Rippling', 'Software Engineer Interview', 'HR Tech', 'Compound Startup', 'Spend', 'Global Payroll', 'Interview Prep'],
    excerpt: 'Rippling executed the Compound Startup playbook -- a single workforce platform spanning HR + IT + Finance + Global. The 2026 engineer loop tests for the famous Rippling Unity ground-up architecture + workforce-graph depth.',
    hook: 'Rippling is the Compound Startup with HR + IT + Finance + Global Payroll in one platform on top of the Rippling Unity employee graph. The 2026 interview filters for engineers who can ship at platform-breadth scale.',
    sections: [
      { type: 'p', text: 'Rippling executed the Compound Startup playbook (a single workforce platform spanning HR + IT + Finance + Global Payroll + EOR + benefits + identity + device management + spend), built on the Rippling Unity employee-graph (the single source of truth where every product references the same employee + role + access + cost-center primitives), shipped Rippling Spend (the corporate card + travel + expense + bill pay + procurement product), Rippling Global Payroll + EOR (the alternative to Deel + Remote in 50+ countries), Rippling IT (device + identity + app management), and the new Rippling AI agents across the platform. The 2026 engineering team is hiring across the core Rippling Unity employee-graph platform, the Spend product (the corporate-card + AP + procurement stack), Global Payroll + EOR (the regulatory + payroll-engine stack across 50+ countries), Rippling IT (device + Mosyle / Jamf-equivalent + Okta-equivalent identity), HR + Benefits + Recruiting, the developer + Marketplace platform, and the AI agents stack. The 2026 hiring bar is high and specific: workforce-graph reasoning, comfort with the Compound-Startup register, and a calibrated take on the Spend + Global expansion thesis.' },

      { type: 'h2', text: 'The Rippling SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Rippling, why this team. They will probe whether you understand the Compound-Startup thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the workforce-graph register.',
        'Technical screen -- 60 minutes. Live coding (Python primarily; Java + Go for some services; TypeScript + React for frontend; Swift for device management).',
        'System design -- 60 minutes. Real Rippling-shaped scenarios. "Design the Rippling Unity employee-graph so HR + Payroll + IT + Spend share the same employee + role + access primitives without N x N integrations." "Walk me through how a single termination event across the platform cascades device wipe + access revoke + final payroll + benefits termination + Spend card freeze atomically." "Design Global Payroll for 50+ countries with country-specific compliance."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values (the Rippling "Go and See" + "I am the CEO of my role" register), plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a manager onboards a new hire in Rippling. Trace it from HR record creation to laptop shipped to identity provisioned to first paycheck."',
        '"Design Rippling Unity. HR + Payroll + IT + Spend all need the same employee + role + access + cost-center primitives. How do you avoid N x N integration hell?"',
        '"Walk me through the atomic termination cascade. Manager fires an employee → device wipe + identity revoke + final payroll + benefits termination + Spend card freeze. All atomic. How?"',
        '"Design Global Payroll for 50+ countries. Country-specific compliance, tax tables, statutory deductions, FX. Walk me through the payroll-engine architecture."',
        '"You inherit a Rippling Unity schema change that improves performance by 25% but breaks 1 country\'s payroll for 1 month. First three actions?"',
        '"You disagree with a senior engineer on whether to build a feature as a new product line (compound) or as a feature inside an existing product. Argue your side."',
        '"What is your real opinion on the Compound Startup thesis? Where does it win? Where does it create execution risk vs focused competitors?"',
        '"Walk me through the most subtle bug you have hit in a multi-product platform with shared primitives."',
        '"Why Rippling and not [Workday / Gusto / Deel / a focused-best-in-class competitor]?"',
        '"How would you reduce time-to-hire-to-productive (laptop in hand + access + first PR) by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Rippling specifically' },
      { type: 'ol', items: [
        'No workforce-graph reasoning. Rippling Unity is the foundational architectural bet. Stories that miss the shared-primitives register miss the company.',
        'Generic HR-tech answers. Rippling has very specific architecture (Rippling Unity, the cross-product atomic-cascade, Global Payroll\'s country-engine model, Spend\'s card + ledger). Generic answers miss Rippling-specific context.',
        'No opinion on the Compound Startup thesis. The Parker Conrad-led platform-breadth strategy is central. Coming without an opinion on the compound-vs-focused trade-off signals shallow prep.',
        'Tone-deaf on the Rippling culture register. "Go and See" + "I am the CEO of my role" + the high-bar performance culture are real. Stories framed for a slower-cadence enterprise miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read Parker Conrad\'s public posts on Compound Startup. Browse Rippling\'s product pages.',
        '15-35 min: Stack drill. Rippling Unity employee-graph design, the cross-product cascade architecture, Global Payroll country-engine model, Spend card + ledger, IT device + identity stack. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Rippling Unity, atomic termination cascade, Global Payroll. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with workforce-graph + Compound-Startup framing. 200 words each.',
        '70-78 min: Read on Rippling vs Workday vs Deel. Articulate where Rippling wins (Compound, Unity, breadth) vs where competitors win.',
        '78-80 min: Close. One opinion on the Compound thesis, one specific Rippling decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Rippling remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF (HQ) + Bengaluru + Dublin hubs. Some senior+ remote roles. RTO tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private HR-tech band. Cash + RSU-equivalent tracking the latest valuation (~$13B+). Total comp matches FAANG mid-band at senior+ levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including Compound-Startup workforce platforms like Rippling. Free at aimvantage.uk.' },

      { type: 'p', text: 'Rippling hires engineers who can reason about workforce-graphs at platform scale, navigate the Compound-Startup register, and engage with the Spend + Global expansion thesis honestly. Prep the Rippling Unity stack, the atomic-cascade architecture, the Global Payroll context, and a calibrated take on the compound-vs-focused direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) GUSTO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'gusto-software-engineer-interview-2026',
    title: 'Gusto software engineer interview: the post-Embedded + Gusto AI + International 2026 loop',
    description: 'The Gusto software engineer interview in 2026 -- five stages, the post-Embedded + Gusto AI + International + Wallet context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Gusto', 'Software Engineer Interview', 'SMB Payroll', 'Embedded Payroll', 'Wallet', 'Gusto AI', 'Interview Prep'],
    excerpt: 'Gusto expanded from SMB payroll into Embedded Payroll (the white-label-payroll-API for vertical SaaS), Gusto AI, the Wallet financial-services suite, and started international expansion. The 2026 engineer loop tests for payroll-precision depth + SMB-DX register.',
    hook: 'Gusto is the SMB-payroll-DX company that bet on Embedded Payroll API + Gusto AI. The 2026 interview filters for engineers who can ship at small-business-trust-level reliability.',
    sections: [
      { type: 'p', text: 'Gusto expanded from SMB-focused all-in-one payroll + benefits + HR into Embedded Payroll (the white-label-payroll-API for vertical SaaS customers like Squarespace, Procore, Trainual), Gusto AI (the gen-AI assistant + agent across the product, GA 2024-25), the Wallet financial-services suite (instant pay, Cashout, Bills + Spending, savings goals), early international expansion (Canada GA, UK + EU in planning), and the deeper Health + Benefits + Recruiting + Workers\' Comp surfaces. The 2026 engineering team is hiring across the core payroll platform (the famous payroll-engine + tax + filing + ACH stack across 50 states + DC + Puerto Rico), Embedded Payroll (the API platform + the tenant + partner-side compliance), Gusto AI (the gen-AI + agent layer), Wallet (the consumer-facing fintech surface), Benefits + Insurance, the SMB-customer experience products, and the developer platform. The 2026 hiring bar is competitive and specific: payroll-precision depth, comfort with the SMB-DX register, and a calibrated take on the Embedded + AI thesis.' },

      { type: 'h2', text: 'The Gusto SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Gusto, why this team. They will probe whether you understand the SMB-DX thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the payroll-precision register.',
        'Technical screen -- 60 minutes. Live coding (Ruby on Rails primarily; Python for ML; Go for newer services; TypeScript + React for frontend).',
        'System design -- 60 minutes. Real Gusto-shaped scenarios. "Design the payroll run pipeline for end-of-month at peak (10K+ small businesses all running payroll on Friday)." "Walk me through Embedded Payroll API -- a white-label payroll inside a vertical SaaS." "Design Gusto AI as an SMB-focused agent that can answer payroll + benefits questions."',
        'Onsite or final loop -- 2-3 rounds: deeper coding, deeper system design, behavioural / values + the famous Gusto-values register.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a small business owner runs payroll on Friday for 25 employees. Trace from Run Payroll button to net pay in employee bank accounts."',
        '"Design the payroll-run pipeline for end-of-month peak. 10K+ small businesses all running on the same Friday. Sub-1hr time-to-completion for the rush."',
        '"Walk me through Embedded Payroll. A vertical SaaS (e.g. a fitness-studio software) wants to offer payroll to its customers under its own brand. Walk me through the API + multi-tenancy + compliance boundary."',
        '"Design Gusto AI as an SMB-focused agent. SMB owners ask: \'How do I fix this W-2?\' or \'Can I 1099 this person?\'. Walk me through the trust + correctness + escalation boundary."',
        '"You inherit a tax-filing change that improves throughput by 18% but adds a 0.05% miscalculation rate in one specific state. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a Ruby service to Go. Argue your side."',
        '"What is your real opinion on the Embedded Payroll strategy? Where does it win? Where does it create channel risk?"',
        '"Walk me through the most subtle bug you have hit in a financial-precision or payroll system."',
        '"Why Gusto and not [Rippling / ADP / Paychex / Square Payroll]?"',
        '"How would you reduce time-to-first-payroll for a new SMB by 30% without weakening compliance?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Gusto specifically' },
      { type: 'ol', items: [
        'No payroll-precision reasoning. Gusto is structurally a payroll + tax-filing company. Stories that miss tax / FICA / state-by-state filing / ACH precision concepts miss the company.',
        'Generic SaaS answers. Gusto has very specific architecture (the Rails payroll engine, the tax-filing stack across 50 states + DC + Puerto Rico, the ACH pipeline, Embedded multi-tenancy, the Wallet bank-partner stack). Generic answers miss Gusto-specific context.',
        'No opinion on the Embedded + AI thesis. Embedded is a meaningful growth lever. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the SMB register. Gusto sells to small businesses with no HR or finance person. Stories framed for enterprise-RFP miss the actual customer reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Browse Gusto + read the Gusto Engineering blog for one specific deep-dive.',
        '15-35 min: Stack drill. Payroll engine fundamentals (gross-to-net, tax, deductions), ACH + tax-filing pipeline, Rails + Sidekiq monolith patterns, Embedded multi-tenancy, Wallet bank-partnership architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- end-of-month payroll peak, Embedded Payroll API, Gusto AI agent. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with payroll-precision + SMB-DX framing. 200 words each.',
        '70-78 min: Read on Gusto vs Rippling vs ADP. Articulate where Gusto wins (SMB-DX, Embedded, simplicity) vs where competitors win.',
        '78-80 min: Close. One opinion on Embedded, one specific Gusto decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Gusto remote in 2026?' },
      { type: 'p', text: 'Remote-friendly within US -- SF + Denver + NYC + Toronto hubs. Most engineering roles remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Strong late-stage private band. Cash + RSU-equivalent tracking the latest tender-offer valuation. Total comp competitive with FAANG mid-band at senior+ depending on valuation trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including SMB-payroll platforms like Gusto. Free at aimvantage.uk.' },

      { type: 'p', text: 'Gusto hires engineers who can reason about payroll-precision + SMB-DX, navigate the Embedded + AI register, and engage with the financial-precision-at-small-business-scale reality honestly. Prep the payroll-engine stack, the Embedded API, and a calibrated take on the SMB-vs-enterprise direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) DEEL SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'deel-software-engineer-interview-2026',
    title: 'Deel software engineer interview: the post-Engage + IT + AI + 150-country 2026 loop',
    description: 'The Deel software engineer interview in 2026 -- five stages, the post-Deel Engage + Deel IT + Deel AI + 150+ country global payroll context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Deel', 'Software Engineer Interview', 'Global Payroll', 'EOR', 'Engage', 'Deel AI', 'Interview Prep'],
    excerpt: 'Deel expanded from EOR + Contractor payments into global Engage (HR + performance) + Deel IT + Deel AI + Deel Card + the global-employer platform. The 2026 engineer loop tests for global-payroll + multi-jurisdiction depth.',
    hook: 'Deel is the global-payroll giant that runs across 150+ countries with EOR + Contractor + Engage + IT + AI. The 2026 interview filters for engineers who can ship across the most fragmented regulatory landscape in tech.',
    sections: [
      { type: 'p', text: 'Deel expanded from EOR (Employer of Record) + Contractor payments into a full global-employer platform with Deel Engage (HR + performance + onboarding + 1:1s + surveys), Deel IT (device + identity management — competing with Rippling IT), Deel AI (the gen-AI assistant + agents across the product), Deel Card (the multi-currency contractor card), Deel Tax (tax-advisor + filing services), and Deel Engage + Talent (recruiting + ATS). The 2026 engineering team is hiring across the core EOR + Contractor + Global Payroll platform (the regulatory-engine across 150+ countries, the entity + compliance + payroll-engine stack), Deel Engage (the HR + performance + onboarding products), Deel IT (device + identity), Deel AI (the gen-AI + agent layer), Deel Card + Wallet (the fintech surface), and the developer + API platform. The 2026 hiring bar is competitive and specific: multi-jurisdiction global-payroll depth, comfort with the regulated-fintech-at-150-country scale register, and a calibrated take on the platform-expansion + Rippling-competitive thesis.' },

      { type: 'h2', text: 'The Deel SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Deel, why this team. They will probe whether you understand the global-payroll + Rippling-competitive context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the multi-jurisdiction register.',
        'Technical screen -- 60 minutes. Live coding (TypeScript + Node + React primarily; Python for ML / AI; Go for some services).',
        'System design -- 60 minutes. Real Deel-shaped scenarios. "Design the EOR onboarding flow for a customer hiring an engineer in Argentina. Local entity + compliance + payroll + benefits." "Walk me through Deel Engage 1:1 + survey scheduling at multi-tenant scale." "Design Deel AI -- an agent that helps SMB owners navigate 150-country employment law."',
        'Onsite or final loop -- 3 rounds: deeper coding, deeper system design, behavioural / values (Deel famously hires fast + ships fast).',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a US company hires an engineer in Argentina via Deel EOR. Trace from offer letter signing to first paycheck."',
        '"Design the EOR onboarding flow. The customer\'s Argentinian engineer needs a local entity, contract, tax setup, benefits, payroll. Walk me through the orchestration."',
        '"Walk me through Deel Engage. 1:1s + surveys + performance reviews at multi-tenant scale. How does the scheduling + notification + analytics layer work?"',
        '"Design Deel AI as an agent. SMB owners ask: \'Can I hire a contractor in India and pay them in USDC?\' Walk me through the legal + answer + escalation boundary."',
        '"You inherit a payroll-engine change that improves throughput by 12% but breaks Brazil\'s payroll for 1 month. First three actions?"',
        '"You disagree with a senior engineer on whether to build a new country-specific feature or invest in cross-country abstraction. Argue your side."',
        '"What is your real opinion on Deel\'s platform-expansion thesis (Engage + IT + AI + Tax)? Where does it win? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a multi-jurisdiction or payroll-engine system."',
        '"Why Deel and not [Rippling Global / Remote / Velocity Global / Oyster]?"',
        '"How would you reduce time-to-first-payroll for a new country expansion by 30% without weakening compliance?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Deel specifically' },
      { type: 'ol', items: [
        'No multi-jurisdiction reasoning. Deel is structurally a 150-country regulated business. Stories that miss country-by-country compliance + payroll + tax variation miss the company.',
        'Generic HR-tech answers. Deel has very specific architecture (the EOR entity + compliance stack, the global payroll engine, Deel Engage products, the Card + multi-currency wallet). Generic answers miss Deel-specific context.',
        'No opinion on the platform-expansion thesis. Deel + Rippling are in head-to-head expansion. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the move-fast-ship-fast culture. Deel has built a reputation for shipping at startup velocity at scale. Stories framed for slower-cadence cultures miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Browse Deel\'s product pages + the Deel AI demo.',
        '15-35 min: Stack drill. EOR fundamentals (entity, compliance, contract), Global Payroll engine (country abstractions + variations), Deel Engage architecture, Deel Card + multi-currency wallet, Deel AI agent. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- EOR onboarding, Engage at scale, Deel AI agent. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with multi-jurisdiction + ship-fast framing. 200 words each.',
        '70-78 min: Read on Deel vs Rippling vs Remote. Articulate where Deel wins (country breadth, EOR maturity, platform-expansion velocity) vs where competitors win.',
        '78-80 min: Close. One opinion on the platform-expansion thesis, one specific Deel decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Deel remote in 2026?' },
      { type: 'p', text: 'Fully distributed -- famously remote-first across 100+ countries. Confirm hiring-entity availability for your country at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Late-stage private + valuation around $12B+. Strong cash + RSU-equivalent. Total comp matches FAANG mid-band at senior+ depending on valuation trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Usually hires you where you are -- Deel has hiring entities in most countries. Visa sponsorship is rare. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including global-payroll + HR-tech platforms like Deel. Free at aimvantage.uk.' },

      { type: 'p', text: 'Deel hires engineers who can reason about multi-jurisdiction payroll + EOR + the global-employer reality, navigate the platform-expansion register, and engage with the Rippling-competitive thesis honestly. Prep the EOR + Global Payroll stack, the Deel Engage + AI context, and a calibrated take on the platform-velocity direction.' },
    ],
  },
];
