// 3 more interview-guide posts -- batch 30
// Spotify (music streaming), Wise (fintech), Palantir (enterprise + gov).

import type { BlogPost } from './blogPosts';

export const newBlogPosts30: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) SPOTIFY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'spotify-software-engineer-interview-2026',
    title: 'Spotify software engineer interview: the post-AI DJ + Audiobooks + Wrapped AI 2026 loop',
    description: 'The Spotify software engineer interview in 2026 -- five stages, the post-AI DJ + AI Playlist + Audiobooks + Wrapped AI context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Spotify', 'Software Engineer Interview', 'Music Streaming', 'AI DJ', 'Recommendations', 'Audiobooks', 'Interview Prep'],
    excerpt: 'Spotify expanded from music streaming into AI DJ, AI Playlist, audiobooks-in-Premium, and Wrapped AI. The 2026 engineer loop tests for recommender-systems + audio-streaming depth.',
    hook: 'Spotify is the audio-streaming giant that bet on AI personalisation and audiobooks. The 2026 interview filters for engineers who can ship recommender systems at planetary listening scale.',
    sections: [
      { type: 'p', text: 'Spotify (NYSE: SPOT) expanded from music streaming into AI DJ (the voice-narrated personalised stream, launched 2023 + iterating), AI Playlist (the prompt-to-playlist feature, GA 2024-25), Audiobooks-in-Premium (15 hours/month included, the post-Findaway-acquisition product, US + UK + Australia + Ireland + Canada), Wrapped AI (the AI-narrated Wrapped + the new Spotify Pulse year-round version), the deeper Podcast + Patron + Marketplace products, and Spotify for Artists + Marquee + Discovery Mode (the supply-side ad surfaces). The 2026 engineering team is hiring across the core streaming platform (the famous Backstage-based Tech Radar microservices estate), Music + Editorial + Personalisation (the recommender systems team, including the famous BaRT / Echo Nest descendant models), AI DJ + AI Playlist + Wrapped AI (the gen-AI + voice + agent stack), Audiobooks + Podcasts, the Marketplace + advertising stack, and the Mobile + Web client teams (the famous Spotify Connect protocol, the iOS / Android / desktop / web / car / TV / wearable surfaces). The 2026 hiring bar is competitive and specific: recommender-systems depth, comfort with the Spotify-Backstage + microservices register, and a calibrated take on the AI-personalisation thesis.' },

      { type: 'h2', text: 'The Spotify SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Spotify, why this team. They will probe whether you understand the AI-personalisation + audiobooks-expansion thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the Spotify-engineering-culture register.',
        'Technical screen -- 60 minutes. Live coding (Java + Scala for backend; Python for ML / recommender; TypeScript + React for web; Swift / Kotlin for mobile).',
        'System design -- 60 minutes. Real Spotify-shaped scenarios. "Design AI DJ\'s audio-generation pipeline -- TTS voice + curated track sequencing at sub-3-second latency." "Walk me through Spotify\'s recommender architecture for Home Feed at 600M+ MAU." "Design audiobook chapter + bookmark sync across devices."',
        'Onsite or final loop -- 3-4 rounds: deeper coding or design, behavioural / values (the famous Spotify Values + the "Squad / Tribe / Chapter / Guild" model come up), plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user taps Home on the Spotify app. Trace it from app open to the personalised Home Feed rendered."',
        '"Design AI DJ\'s audio-generation pipeline. TTS-narrated voice + curated track sequencing + the recommender + a sub-3-second perceived latency."',
        '"Walk me through Spotify\'s recommender architecture for Home Feed at 600M+ MAU. The candidate-generation + ranking + diversity + freshness stack."',
        '"Design audiobook chapter + bookmark sync across devices. The user can pause on iPhone in a chapter, resume on web at the same word. How does this work at scale?"',
        '"You inherit a recommender change that improves engagement by 8% but reduces catalog diversity by 12% for one cohort. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a microservice from Java to Scala 3. Argue your side."',
        '"What is your real opinion on the audiobooks-in-Premium bet? Where does it create value? Where does it cost (margin, licensing)?"',
        '"Walk me through the most subtle bug you have hit in audio streaming, codec, or recommender systems."',
        '"Why Spotify and not [Apple Music / YouTube Music / Amazon Music / TIDAL]?"',
        '"How would you reduce time-to-first-audio on mobile cold-start by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Spotify specifically' },
      { type: 'ol', items: [
        'No recommender-systems reasoning. Spotify is structurally a personalisation platform. Stories that miss candidate-generation / ranking / diversity / cold-start concepts miss the company.',
        'Generic streaming answers. Spotify has very specific architecture (the Spotify Connect protocol, the Backstage developer platform, the Squad / Tribe / Chapter / Guild model, BaRT / Echo Nest descendants). Generic answers miss Spotify-specific context.',
        'No opinion on the audiobooks + AI-personalisation strategy. The post-2022 strategy bet on these. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the artist + creator-economy register. Spotify has been heavily scrutinised on artist payouts + the Joe Rogan / podcast-content context. Stories that ignore this miss the actual register.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Spotify + AI DJ + AI Playlist + audiobook for 10-15 minutes. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Recommender architecture (candidate-gen + ranking + diversity), Spotify Connect protocol, Backstage developer platform, AI DJ / Wrapped AI generation pipeline, the Squad / Tribe / Chapter / Guild model. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- AI DJ generation, Home Feed recommender, audiobook chapter sync. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with personalisation + streaming framing. 200 words each.',
        '70-78 min: Read on Spotify vs Apple Music. Articulate where Spotify wins (personalisation, AI DJ, cross-platform, podcasts) vs where Apple Music wins (Lossless, spatial audio, ecosystem integration).',
        '78-80 min: Close. One opinion on the audiobook bet, one specific Spotify decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Spotify remote in 2026?' },
      { type: 'p', text: 'Work-from-anywhere policy (since 2021, though tightened) -- Stockholm + NYC + London + Boston + Singapore + Tokyo hubs. Many roles remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of consumer-streaming SaaS band. Strong RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including music + audio + recommender platforms like Spotify. Free at aimvantage.uk.' },

      { type: 'p', text: 'Spotify hires engineers who can reason about recommender systems at planetary scale, navigate the Squad / Tribe / Chapter / Guild model, and engage with the AI-personalisation + audiobooks thesis honestly. Prep the recommender + Connect stack, the AI DJ context, and a calibrated take on the artist + creator-economy register.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) WISE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'wise-software-engineer-interview-2026',
    title: 'Wise software engineer interview: the post-Mission-Roadmap + Platform + Business 2026 loop',
    description: 'The Wise software engineer interview in 2026 -- five stages, the post-Mission-Roadmap + Wise Platform + Wise Business context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Wise', 'Software Engineer Interview', 'Fintech', 'Cross-border Payments', 'FX', 'Wise Platform', 'Interview Prep'],
    excerpt: 'Wise (formerly TransferWise) executed the Mission Roadmap to make money move instantly + transparently + free. The 2026 engineer loop tests for cross-border payments + FX + regulated-fintech depth.',
    hook: 'Wise is the cross-border payments giant whose whole company runs against the Mission to make money move instantly + transparently + free. The 2026 interview filters for engineers who really care about the mission.',
    sections: [
      { type: 'p', text: 'Wise (LSE: WISE) executed the Mission Roadmap (the public 5-year roadmap to make money move instantly + transparently + free at zero cost), opened Wise Platform (the white-label / embedded fintech infrastructure, used by Monzo, Bank of America, Standard Chartered, and others), expanded Wise Business (the SMB cross-border + multi-currency-account product), shipped Wise Card across more geographies, and continued the deepening regulatory licensing footprint (50+ countries). The 2026 engineering team is hiring across the core payments platform (the rail-by-rail integration with 70+ banks + payment networks worldwide, the FX engine, the routing logic), Wise Platform (the white-label APIs + the Bank-of-America-grade enterprise tier), Wise Business (the SMB-focused multi-currency-account + Cards + Batch payments), the consumer product (the famous in-app + web + Cards experience), the regulatory + compliance + risk engineering teams (KYC + AML + sanctions screening across 50+ jurisdictions), and the data + analytics products. The 2026 hiring bar is competitive and specific: cross-border payments + FX depth, comfort with the regulated-fintech register, and a calibrated take on the Mission Roadmap.' },

      { type: 'h2', text: 'The Wise SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Wise, why this team. They will probe whether you understand the Mission Roadmap + actually care about the mission.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the Mission-led register.',
        'Technical screen -- 60 minutes. Live coding (Java for backend; Kotlin for mobile; TypeScript + React for web; Python for data / risk).',
        'System design -- 60 minutes. Real Wise-shaped scenarios. "Design the FX-pricing engine that quotes a mid-market rate + the Wise fee, updated in real-time as the customer types." "Walk me through how Wise routes a GBP → INR transfer across the bank-integration matrix." "Design the multi-currency account ledger across 40+ supported currencies with reconciliation."',
        'Onsite or final loop -- 3-4 rounds: deeper coding or design, behavioural / values + Mission Roadmap discussion, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a customer initiates a GBP → INR transfer of £2,000. Trace from quote to settlement in the recipient account."',
        '"Design the FX-pricing engine that quotes a real-time mid-market rate + the Wise fee. The rate must update as the customer types the amount."',
        '"Walk me through how Wise routes a transfer across the bank-integration matrix. Pricing, speed, compliance, capacity considerations."',
        '"Design the multi-currency account ledger across 40+ supported currencies with reconciliation. Money never goes missing."',
        '"You inherit a routing optimisation that reduces fees by 8% for 60% of corridors but breaks compliance in one specific corridor for the new sanctions list. First three actions?"',
        '"You disagree with a senior engineer on whether to integrate a new payment rail or improve an existing one. Argue your side using Mission Roadmap reasoning."',
        '"What is your real opinion on the Wise Platform white-label strategy? Where does it accelerate the mission? Where does it create channel conflict?"',
        '"Walk me through the most subtle bug you have hit in a financial-precision or payments-routing system."',
        '"Why Wise and not [Revolut / Remitly / a traditional bank / a fintech-rails-only competitor]?"',
        '"How would you reduce time-to-recipient-bank by 30% on a GBP → INR transfer without weakening compliance?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Wise specifically' },
      { type: 'ol', items: [
        'No cross-border-payments reasoning. Wise is structurally a payments + FX company. Stories that miss SWIFT vs direct-rail / settlement-cycles / float / FX-spread concepts miss the company.',
        'Generic fintech answers. Wise has very specific architecture (the rail-by-rail bank integrations, the FX engine, the multi-currency account ledger, the routing engine). Generic answers miss Wise-specific context.',
        'No genuine care for the Mission. Wise is unusually Mission-led for a public company. The Mission Roadmap is published + tracked publicly. Candidates who treat this as a slogan miss what makes Wise different.',
        'Tone-deaf on the regulated context. Wise operates in 50+ jurisdictions with separate licenses + regulatory frameworks. Stories that ignore KYC / AML / sanctions / capital requirements miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Wise Mission Roadmap (public). Use the Wise app + the comparison-rate page for a corridor you know.',
        '15-35 min: Stack drill. Cross-border payments fundamentals (SWIFT + direct rail + correspondent banking), FX engine + mid-market rate + spread, multi-currency account ledger, KYC + AML + sanctions screening. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- FX pricing engine, GBP-INR routing, multi-currency ledger. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with payments-precision + Mission-led framing. 200 words each.',
        '70-78 min: Read on Wise vs Revolut. Articulate where Wise wins (cross-border + transparency mission + Platform) vs where Revolut wins (super-app + breadth).',
        '78-80 min: Close. One opinion on the Mission Roadmap, one specific Wise decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Wise remote in 2026?' },
      { type: 'p', text: 'Hybrid -- London (HQ) + Tallinn + Budapest + Singapore + Tokyo + Austin + New York hubs. Some senior+ remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of UK fintech band. Cash + RSU at LSE-listed Wise. Total comp approaches FAANG-UK mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including cross-border payments + fintech infra companies like Wise. Free at aimvantage.uk.' },

      { type: 'p', text: 'Wise hires engineers who can reason about cross-border payments + FX + regulated-fintech, navigate the Mission Roadmap register, and engage with the multi-jurisdiction reality honestly. Prep the FX engine + multi-currency ledger stack, the Wise Platform context, and a calibrated take on the Mission.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) PALANTIR SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'palantir-software-engineer-interview-2026',
    title: 'Palantir software engineer interview: the post-AIP + Foundry + Apollo 2026 loop',
    description: 'The Palantir software engineer interview in 2026 -- five stages, the post-AIP + Foundry + Apollo + Gotham + Commercial context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Palantir', 'Software Engineer Interview', 'AIP', 'Foundry', 'Apollo', 'Gotham', 'Government', 'Interview Prep'],
    excerpt: 'Palantir shipped AIP (the AI platform) on top of Foundry + Gotham, joined the S&P 500, and pushed deep into commercial + defense + healthcare. The 2026 engineer loop tests for distributed-systems + forward-deployed register depth.',
    hook: 'Palantir is the S&P-500 enterprise platform that bet on AIP + the forward-deployed engineer model. The 2026 interview filters for engineers who can ship customer-by-customer in the most complex environments.',
    sections: [
      { type: 'p', text: 'Palantir (NYSE: PLTR) shipped AIP (the AI Platform that brings LLM + agent workflows to Foundry + Gotham), joined the S&P 500 in September 2024, and pushed deep into commercial (US Commercial revenue compounding rapidly), defense (the DoD + NATO + UK MoD relationships), healthcare (the Mount Sinai + NHS partnerships), and the new manufacturing + auto + Warp Speed commercial expansions. The 2026 engineering team is hiring across Foundry (the data + operations platform for commercial customers), Gotham (the operations + targeting platform for government / defense), AIP (the AI-on-top-of-Palantir layer + the agent-builder + the LLM gateway), Apollo (the continuous-delivery + multi-cloud-multi-environment management plane), Skywise (the aviation-vertical product), the forward-deployed-engineer (FDE) teams (the famous on-site engineer model), and the new commercial + Warp Speed acquisition-velocity teams. The 2026 hiring bar is high and specific: distributed-systems depth, comfort with the forward-deployed register (working inside customer environments), and a calibrated take on the AIP + commercial-vs-government register.' },

      { type: 'h2', text: 'The Palantir SWE process -- 5-6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Palantir, why this team. They will probe whether you understand the forward-deployed model + the commercial-vs-government register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the customer-facing register.',
        'Technical screen -- 60-90 minutes. Live coding (TypeScript primarily; Java for backend; Python for data / AIP). Often non-trivial systems design embedded in the coding session.',
        'System design + deep-dive -- 60-90 minutes. Real Palantir-shaped scenarios. "Design Foundry\'s data-lineage + branch / merge model at a Fortune-500 manufacturer." "Walk me through AIP -- an LLM agent that operates on a customer ontology with cell-level permissions." "Design Apollo deploying a Foundry release across 200+ customer environments + air-gapped clusters."',
        'Onsite or final loop -- 4-5 rounds: deeper coding, deeper system design, behavioural / values (the famous Palantir values + the "low-headcount, high-leverage" register), plus a customer-facing / forward-deployed simulation round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Foundry user runs a data pipeline that joins 3 datasets, materialises a new dataset, then publishes it to a dashboard. Trace through the platform."',
        '"Design Foundry\'s data-lineage + branch / merge model. Customers branch ontologies + datasets, propose changes, merge after review. How does this work at Fortune-500-data scale?"',
        '"Walk me through AIP. An LLM agent operates on a customer ontology with cell-level permissions. How does the permission boundary + the model gateway + the agent action-confirmation work?"',
        '"Design Apollo. Continuous delivery deploying a Foundry release across 200+ customer environments + on-prem + air-gapped clusters. Walk me through the rollout-control + the multi-environment governance."',
        '"You are a forward-deployed engineer at a customer. The customer says \'AIP is hallucinating answers on our financial-reporting ontology\'. Walk me through the first 48 hours."',
        '"You disagree with a senior engineer on whether to build a new Foundry capability or a customer-specific AIP integration. Argue your side."',
        '"What is your real opinion on the commercial-vs-government register? Where does Palantir win in commercial? Where does the government-DNA help or hurt commercial?"',
        '"Walk me through the most subtle bug you have hit in a distributed-data or LLM-agent system."',
        '"Why Palantir and not [Databricks / Snowflake / a hyperscaler-native equivalent / a defense-specific competitor]?"',
        '"How would you reduce AIP-on-Foundry inference latency by 30% without weakening the cell-level permission guarantees?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Palantir specifically' },
      { type: 'ol', items: [
        'No customer-facing reasoning. Palantir is structurally a forward-deployed company. Stories that miss the customer-on-site / FDE / "ship at the customer\'s reality" register miss the company.',
        'Generic enterprise answers. Palantir has very specific architecture (Foundry\'s ontology + branch / merge / data-lineage, Gotham\'s investigative + targeting model, AIP\'s cell-level-permissioned agent stack, Apollo\'s multi-environment CD). Generic answers miss Palantir-specific context.',
        'No opinion on the commercial-vs-government register. The commercial expansion is the central 2025+ growth story. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the political + ethical context. Palantir works with intelligence + defense + immigration agencies. Stories that ignore this miss the operating reality. A real take is expected -- enthusiasm OR principled-engagement, but not silence.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Foundry + AIP + Apollo + Gotham (Palantir publishes overviews + watch a Foundry demo).',
        '15-40 min: Stack drill. Foundry ontology + data-lineage + branch / merge, Gotham investigative model, AIP cell-level permissions + LLM gateway, Apollo multi-environment CD. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- Foundry data-lineage at scale, AIP permissioned agent, Apollo multi-environment release. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with customer-facing + forward-deployed framing. 200 words each.',
        '80-87 min: Read about Palantir\'s government work + commercial expansion. Form a calibrated opinion -- where do you stand, what would you do, would you be willing to work on which customers.',
        '87-90 min: Close. One opinion on the commercial-vs-government register, one specific Palantir decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Palantir remote in 2026?' },
      { type: 'p', text: 'Hybrid + heavy forward-deployed travel. Denver + Palo Alto + NYC + London hubs + many customer-site weeks. Some senior+ remote roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Strong, especially post-S&P-500 inclusion. RSU has been a multi-bagger 2023-25. Total comp matches or exceeds FAANG senior at strong-stock-price moments.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Some government / defense projects require US citizenship + clearance. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including enterprise + government data platforms like Palantir. Free at aimvantage.uk.' },

      { type: 'p', text: 'Palantir hires engineers who can reason about distributed-data systems at customer-environment scale, navigate the forward-deployed model, and engage with the AIP + commercial + government register honestly. Prep the Foundry + AIP + Apollo stack, the FDE context, and a calibrated take on the political-and-ethical question.' },
    ],
  },
];
