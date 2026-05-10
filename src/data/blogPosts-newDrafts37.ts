// 3 more interview-guide posts -- batch 37 (UK/EU heavyweights)
// Revolut (UK super-app fintech), Monzo (UK neobank), DeepMind (UK AI lab).

import type { BlogPost } from './blogPosts';

export const newBlogPosts37: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) REVOLUT SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'revolut-software-engineer-interview-2026',
    title: 'Revolut software engineer interview: the post-UK-banking-licence + Stays + Business 2026 loop',
    description: 'The Revolut software engineer interview in 2026 -- five stages, the post-UK banking licence (with restrictions, July 2024) + Revolut Stays + Revolut Business + the super-app expansion context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Revolut', 'Software Engineer Interview', 'UK Fintech', 'Super-App', 'Java', 'Banking', 'Interview Prep'],
    excerpt: 'Revolut received its UK banking licence (with restrictions, mobilisation, July 2024), shipped Stays + Pets + Mobile Plans, expanded Revolut Business, and operates in 38+ countries with 50M+ retail customers. The 2026 engineer loop tests for super-app + multi-product + payments depth.',
    hook: 'Revolut is the UK super-app fintech that finally got its banking licence and operates 50M+ retail customers across 38+ countries. The 2026 interview filters for engineers who can ship at fintech velocity with banking rigor.',
    sections: [
      { type: 'p', text: 'Revolut received its UK banking licence (with restrictions, the "mobilisation" phase, July 2024 — full operations expected 2025-26), continued operating as a licensed bank in EEA (since 2018), pushed into new product lines: Revolut Stays (travel booking), Revolut Pets, Revolut Mobile Plans, Revolut Wealth + Robo-advisory, expanded Revolut Business (now ~700K SMB customers), continued the Revolut Pay merchant-payments product, and crossed 50M+ retail customers globally. The 2026 engineering team is hiring across the core super-app (the Java + Kotlin backend across the multi-product surface, the iOS + Android client teams), the payments + cards platform (the in-house BIN sponsorship + Mastercard + Visa integrations), Revolut Business (the multi-currency-account + corporate-card + bill-pay + payroll product), Revolut Wealth + Crypto + Stocks (the regulated investing surfaces), the risk + fraud + compliance engineering (the famous Revolut data-engineering + Sherlock fraud-detection), the regulatory + banking-licence operations (the mobilisation engineering), and the developer platform. The 2026 hiring bar is competitive and specific: super-app multi-product depth, comfort with the regulated + multi-jurisdiction register, and a calibrated take on the UK-banking-licence trajectory.' },

      { type: 'h2', text: 'The Revolut SWE process -- 5-6 stages, ~4-6 weeks (Revolut is famous for a long + intense process)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Revolut, why this team. They will probe whether you understand the UK-banking-licence + super-app context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the super-app + fintech register.',
        'Technical screen -- 60-90 minutes. Live coding (Java primarily; Kotlin for newer services; Swift + Kotlin for mobile; Python for ML / data). Often a non-trivial system + algorithm problem.',
        'System design -- 60 minutes. Real Revolut-shaped scenarios. "Design the FX-conversion + multi-currency account ledger for 50M+ customers." "Walk me through Revolut\'s Sherlock fraud-detection at sub-100ms decision latency." "Design the Stays booking + payment flow across multiple property providers + multi-currency."',
        'Final round -- often 2-3 more rounds: deeper coding, deeper system design, behavioural / values + culture-fit, plus sometimes a CEO-level round at senior+.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Revolut customer pays for coffee in Paris with their GBP card. Trace from tap to settlement + FX + ledger update."',
        '"Design the FX-conversion + multi-currency account ledger for 50M+ customers. The mid-market + spread + the limit + premium-plan logic."',
        '"Walk me through Sherlock fraud-detection. Sub-100ms decision latency, multi-feature input, model serving + override + post-decision audit."',
        '"Design the Stays booking + payment flow. Multiple property providers, multi-currency rate-lock, refund + dispute handling."',
        '"You inherit a fraud-detection change that improves false-positive rate by 8% but adds a 0.05% false-negative rate on one customer cohort. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a Revolut service from a monolith pattern to microservices. Argue your side."',
        '"What is your real opinion on the super-app strategy? Where does it win? Where does it create execution drag vs focused-fintech competitors?"',
        '"Walk me through the most subtle bug you have hit in a payments or financial-precision system."',
        '"Why Revolut and not [Monzo / Starling / Wise / N26 / a US-fintech equivalent]?"',
        '"How would you reduce time-to-first-transaction for a new Revolut signup by 30% without weakening KYC?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Revolut specifically' },
      { type: 'ol', items: [
        'No fintech-precision reasoning. Revolut is structurally a regulated multi-currency bank. Stories that miss ledger / settlement / FX / KYC / AML / sanctions concepts miss the company.',
        'Generic SaaS answers. Revolut has very specific architecture (the super-app Java + Kotlin monolith-to-services migration, the Sherlock fraud-detection, the multi-currency ledger, the Mastercard + Visa BIN sponsorship). Generic answers miss Revolut-specific context.',
        'No opinion on the super-app strategy. Revolut + ant + N26 + Cash App + Klarna all chase super-app outcomes. Coming without an opinion on the super-app-vs-focused trade-off signals shallow prep.',
        'Tone-deaf on the high-intensity culture. Revolut is famous for an intense + direct culture. Stories framed for slower-cadence enterprise miss the operating reality. (Equally: glorifying burnout misses too.)',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Revolut for 15 minutes. Note three friction points + three things you respect. Read about the UK banking-licence status.',
        '15-35 min: Stack drill. Multi-currency-ledger architecture, FX engine + mid-market + spread, KYC + AML + sanctions screening, Sherlock fraud-detection, super-app cross-product economics. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- FX ledger, Sherlock fraud, Stays booking. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with payments-precision + high-velocity framing. 200 words each.',
        '70-78 min: Read on Revolut vs Monzo vs Wise. Articulate where Revolut wins (super-app breadth, multi-country, Wealth + Crypto) vs where competitors win.',
        '78-80 min: Close. One opinion on super-app strategy, one specific Revolut decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Revolut remote in 2026?' },
      { type: 'p', text: 'Hybrid -- London (HQ-ish, the Canary Wharf office) + Vilnius + Krakow + Porto + Singapore hubs. Some senior+ remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of UK fintech band. Cash + RSU-equivalent tracking the latest tender-offer valuation (~$45B+). Total comp matches FAANG-UK mid-band at senior+ depending on valuation.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles, especially London + Krakow. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including super-app fintech companies like Revolut. Free at aimvantage.uk.' },

      { type: 'p', text: 'Revolut hires engineers who can reason about super-app multi-product + regulated payments at multi-country scale, navigate the high-intensity register, and engage with the UK-banking-licence trajectory honestly. Prep the FX + ledger + Sherlock stack, the Stays + Business context, and a calibrated take on the super-app direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) MONZO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'monzo-software-engineer-interview-2026',
    title: 'Monzo software engineer interview: the post-Plus + Premium + US-launch + Business 2026 loop',
    description: 'The Monzo software engineer interview in 2026 -- five stages, the post-Plus + Premium + US-launch + Business + Investments context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Monzo', 'Software Engineer Interview', 'UK Fintech', 'Microservices', 'Go', 'Cassandra', 'Interview Prep'],
    excerpt: 'Monzo crossed 12M+ UK customers, profitable on annualised basis, expanded Plus + Premium tiers, pushed Monzo Business (~500K SMBs), and started US-launch in earnest. The 2026 engineer loop tests for microservices + Go + Cassandra + banking depth.',
    hook: 'Monzo is the UK challenger bank that ran on famously bold microservices architecture and is now actually profitable. The 2026 interview filters for engineers who can ship at Go + Cassandra + microservices scale with banking discipline.',
    sections: [
      { type: 'p', text: 'Monzo crossed 12M+ UK personal customers (mid-2025), achieved annualised profitability (the famous F2024 + F2025 profitability milestones), expanded Monzo Plus + Premium tiers (the paid subscription products), pushed Monzo Business (~500K SMB customers + the new Pro + Team tiers), shipped Monzo Investments (the GIA + ISA wrappers + the partner integration), started the US-launch in earnest (the New York-led product, the new partner-bank integration in the US), and continued the famously-iconic Monzo coral-card brand work. The 2026 engineering team is hiring across the core platform (the Go + microservices architecture at 1500+ services + Cassandra + Kafka + the Cuddle service-mesh + the famous Banking Platform), the Personal product (the consumer app + cards + payments), Monzo Business (the SMB-focused multi-tier product), Investments + Wealth, the US launch + partner-bank integration, the risk + financial-crime engineering, the data + ML platform, and the developer platform. The 2026 hiring bar is competitive and specific: microservices + Go + Cassandra depth, comfort with the consumer-banking register, and a calibrated take on the US-expansion + multi-tier monetisation thesis.' },

      { type: 'h2', text: 'The Monzo SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Monzo, why this team. They will probe whether you understand the Monzo culture + the post-profitability trajectory.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the microservices-banking register.',
        'Technical screen -- 60 minutes. Live coding (Go primarily; Python for some services; Swift + Kotlin for mobile; TypeScript + React for the Monzo Business web).',
        'System design + take-home -- 60 minutes. Real Monzo-shaped scenarios. "Design the transaction-categorisation service at 12M+ customers + 100M+ transactions per month." "Walk me through how Monzo\'s 1500+ microservice estate handles a cross-service request like a payment." "Design the US-launch + partner-bank integration with FedNow + ACH + cards."',
        'Onsite or final loop -- 2-3 rounds: deeper coding, deeper system design, behavioural / values + the Monzo culture round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Monzo customer makes a card purchase. Trace from POS auth to ledger + categorisation + notification."',
        '"Design the transaction-categorisation service. 12M+ customers, 100M+ transactions / month, near-real-time category assignment with ML + heuristics."',
        '"Walk me through Monzo\'s 1500+ microservice estate. A cross-service request like a payment touches 30+ services. How does this not collapse under itself?"',
        '"Design the US-launch + partner-bank integration. FedNow + ACH + cards, US KYC + AML, FX-from-GBP, the partner-bank-as-BIN-sponsor architecture."',
        '"You inherit a microservice change that improves latency by 15% but introduces a 0.1% chance of a duplicate transaction in one specific flow. First three actions?"',
        '"You disagree with a senior engineer on whether to break up a microservice that has grown too large. Argue your side."',
        '"What is your real opinion on Monzo\'s 1500+ microservices architecture? Where does it win? Where does it create operational drag?"',
        '"Walk me through the most subtle bug you have hit in a microservices or banking system."',
        '"Why Monzo and not [Revolut / Starling / Wise / a US-based neobank]?"',
        '"How would you reduce p99 latency on the home-screen feed by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Monzo specifically' },
      { type: 'ol', items: [
        'No microservices reasoning. Monzo is structurally a 1500+ microservices estate. Stories that miss service-mesh / Cassandra / Kafka / RPC / idempotency / saga concepts miss the company.',
        'Generic backend answers. Monzo has very specific architecture (the Go + Cassandra + Kafka backbone, the Cuddle service-mesh, the famous Coredeposit ledger, the in-house Banking Platform). Generic answers miss Monzo-specific context.',
        'No opinion on the 1500+ services. Whether this is brilliant or excessive is a known debate. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the Monzo culture. Monzo is famously collaborative + transparent + brand-led. Stories framed for the wolf-of-Wall-Street culture miss the company.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Monzo + Monzo Business. Read a Monzo Engineering blog post (the famous "Banking Platform" or "Cuddle" or "Coredeposit ledger" posts).',
        '15-35 min: Stack drill. Microservices patterns (service-mesh, retries, idempotency, sagas), Cassandra + Kafka basics, banking-ledger patterns (double-entry, idempotent posting), US partner-bank integration. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- transaction categorisation, microservice estate, US partner-bank integration. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with microservices + consumer-banking framing. 200 words each.',
        '70-78 min: Read on Monzo vs Revolut vs Starling. Articulate where Monzo wins (UK customer love, brand, profitability, Coredeposit) vs where competitors win.',
        '78-80 min: Close. One opinion on 1500+ services, one specific Monzo decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Monzo remote in 2026?' },
      { type: 'p', text: 'Hybrid -- London (HQ) + Dublin + Cardiff + New York hubs. Many engineering roles fully remote within UK. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Strong UK fintech band post-profitability. Cash + RSU-equivalent tracking the latest tender-offer valuation (~$5B+ at last public round). Total comp competitive with London FAANG mid-band at senior+.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including UK neobank fintech companies like Monzo. Free at aimvantage.uk.' },

      { type: 'p', text: 'Monzo hires engineers who can reason about microservices + banking + Go + Cassandra at consumer scale, navigate the collaborative + transparent culture, and engage with the US-expansion + profitability thesis honestly. Prep the Cuddle + Banking Platform + Coredeposit stack, the multi-tier monetisation, and a calibrated take on the 1500+ services trade-off.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) DEEPMIND SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'deepmind-software-engineer-interview-2026',
    title: 'DeepMind software engineer interview: the post-Gemini + AlphaFold + Veo + Genie 2026 loop',
    description: 'The DeepMind software engineer interview in 2026 -- five stages, the post-Gemini + AlphaFold 3 + Veo 3 + Genie 2 + AlphaProteo context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-11',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['DeepMind', 'Software Engineer Interview', 'AI Research', 'Gemini', 'AlphaFold', 'Veo', 'Interview Prep'],
    excerpt: 'DeepMind (now Google DeepMind) is the AI research lab behind Gemini + AlphaFold 3 + Veo 3 + Genie 2 + AlphaProteo + AlphaGeometry 2. The 2026 engineer loop tests for ML research-engineering + Jax + scaling depth.',
    hook: 'DeepMind is the UK-founded AI research lab now behind Google\'s frontier-model push. The 2026 interview filters for engineers who can ship at the research + scaling intersection that defines frontier AI.',
    sections: [
      { type: 'p', text: 'DeepMind (Google DeepMind, since the 2023 merge with Google Brain) is the Alphabet AI research lab behind Gemini (the frontier multi-modal model family — Gemini 2.5 + the new Deep Think reasoning variants), AlphaFold 3 (the protein + DNA + RNA + ligand structure prediction model, deployed via the AlphaFold Server), Veo 3 (the next-gen video generation model with audio + dialogue), Genie 2 (the playable-world-from-image model), AlphaProteo (de-novo protein design), AlphaGeometry 2 + AlphaMissense + Med-Gemini + Project Astra + the new Project Mariner + AlphaEvolve + AlphaQubit, the Imagen video / image stack, the WeatherNext models, and the Isomorphic Labs (the drug-discovery spinout). The 2026 engineering team is hiring across model + algorithm research (research engineers + research scientists), training infrastructure (Jax + Pathways + TPU + the scaling stack), Gemini productisation (the model serving + multi-modal alignment + Deep Think for reasoning), Astra + Mariner + agentic products, AlphaFold + AlphaProteo + biomedical applications, the Med-Gemini + healthcare products, robotics (the new RT + Gemini Robotics lines), and the platform + tools (Vertex AI integration). The 2026 hiring bar is exceptional and specific: ML research-engineering + Jax + scaling depth, comfort with the research + product register, and a calibrated take on the Google-DeepMind merger + the frontier-AI safety question.' },

      { type: 'h2', text: 'The DeepMind SWE process -- 5-6 stages, ~6-10 weeks (interview cycles are long)' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why DeepMind, why this team. They will probe whether you have a real take on frontier AI + safety.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the research-engineering register.',
        'Technical screen -- 60-90 minutes. Live coding (Python + Jax + PyTorch primarily). Moderate-to-hard problem, often with an ML-systems angle.',
        'Research + ML depth -- 60 minutes. Real DeepMind-shaped scenarios. "Design Gemini 2.5\'s Deep Think reasoning training pipeline." "Walk me through AlphaFold 3\'s diffusion-based prediction architecture vs AlphaFold 2." "Design the Veo 3 audio-conditioned generation training stack."',
        'Onsite or final loop -- 3-4 rounds: deeper ML, deeper systems, behavioural / values + safety, plus a research + leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Gemini 2.5 query arrives at the inference cluster with Deep Think mode enabled. Trace from input to streamed response."',
        '"Design Gemini 2.5\'s Deep Think reasoning training pipeline. How does the long-CoT training data + the reward modelling + the eval suite combine?"',
        '"Walk me through AlphaFold 3\'s diffusion-based prediction. How does it differ from AlphaFold 2\'s structure module + recycling architecture?"',
        '"Design the Veo 3 audio-conditioned generation training stack. Multi-modal (video + audio + text), the data + training + eval infrastructure."',
        '"You inherit a training run that improves Gemini benchmark scores by 4% but appears to regress on one specific safety eval. First three actions?"',
        '"You disagree with a senior researcher on whether to invest in a new evaluation suite or a new training architecture. Argue your side."',
        '"What is your real opinion on the Google-DeepMind merger? Where does it create value? Where did it create cultural cost?"',
        '"Walk me through a subtle bug you have hit in distributed ML training (e.g. sync issues, gradient explosion, dataloading)."',
        '"Why DeepMind and not [OpenAI / Anthropic / Meta FAIR / Mistral / xAI]?"',
        '"How would you reduce Gemini-Deep-Think inference latency by 30% without weakening reasoning quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at DeepMind specifically' },
      { type: 'ol', items: [
        'No ML research-engineering reasoning. DeepMind is structurally a research-engineering organisation. Stories that miss training infra / scaling / Jax / TPU / evaluation concepts miss the company.',
        'Generic LLM answers. DeepMind has very specific architecture (Gemini family + Deep Think + Astra + Mariner, AlphaFold 3 diffusion, Veo 3, the Jax + Pathways + TPU stack). Generic answers miss DeepMind-specific context.',
        'No opinion on the Google-DeepMind merger. The 2023 merger + the cultural integration is central. Coming without a calibrated take signals shallow prep.',
        'Tone-deaf on the research + product tension. DeepMind started as pure research; now it ships product. The tension between long-horizon research bets + quarterly product velocity is real. Stories that ignore it miss the operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Gemini 2.5 + read the AlphaFold 3 paper abstract + watch a Veo 3 demo. Note three things about the current trajectory.',
        '15-40 min: Stack drill. Jax + Pathways basics, TPU + scaling laws, transformer + Deep Think reasoning architecture, diffusion-model fundamentals (for AlphaFold 3 + Veo), evaluation + safety eval design. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- Gemini Deep Think training, AlphaFold 3 inference, Veo 3 training. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with research-engineering + scaling framing. 200 words each. At least one should be an honest failed-research story (research is mostly failure).',
        '80-87 min: Develop a calibrated take on the Google-DeepMind merger + the safety-vs-velocity tension. Specific + considered, not slogan-y.',
        '87-90 min: Close. One opinion on Deep Think, one specific DeepMind decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is DeepMind remote in 2026?' },
      { type: 'p', text: 'Mostly in-office -- London (HQ) + Mountain View + Zurich + Montreal + Paris + Tokyo + Bengaluru hubs. Most engineering + research roles require physical co-location. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of UK research-engineering band (London-FAANG-equivalent comp). Cash + GOOGL RSU; total comp matches or exceeds Google Brain-equivalent at senior+ levels.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles, especially London. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including frontier-AI research labs like DeepMind. Free at aimvantage.uk.' },

      { type: 'p', text: 'DeepMind hires engineers who can reason about ML research-engineering + scaling + Jax + TPU at frontier scale, navigate the Google-DeepMind merger reality, and engage with the research + product + safety register honestly. Prep the Gemini + AlphaFold + Veo + Genie stack, the Jax + Pathways infrastructure, and a calibrated take on the frontier-AI direction.' },
    ],
  },
];
