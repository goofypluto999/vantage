// 3 more interview-guide posts -- batch 18
// Block (Square + Cash App), Discord (community + AI), Pinterest (visual ML).

import type { BlogPost } from './blogPosts';

export const newBlogPosts18: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) BLOCK (SQUARE / CASH APP) SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'block-software-engineer-interview-2026',
    title: 'Block (Square / Cash App) software engineer interview: the post-restructure 2026 loop',
    description: 'The Block software engineer interview in 2026 -- five stages, the post-2024 ecosystem-restructure context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Block', 'Square', 'Cash App', 'Software Engineer Interview', 'Fintech', 'Payments', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Block (parent of Square + Cash App) restructured around ecosystems in 2024. The 2026 engineer loop tests for payments-systems depth + comfort with the Block-vs-Square-vs-Cash-App branding clarity that confuses most candidates.',
    hook: 'Block, Square, Cash App, TIDAL, TBD, Spiral — most candidates can\'t articulate the company structure clearly. The interview filters that signal in or out fast.',
    sections: [
      { type: 'p', text: 'Block, Inc. (NYSE: SQ) is the parent of Square (the merchant business), Cash App (the consumer / Bitcoin business), TIDAL (music streaming), TBD (decentralised identity / Web5), and Spiral (Bitcoin open source). The 2024 restructure simplified Block into "ecosystems" rather than business units. The 2026 hiring bar is high but specific: payments-systems depth, comfort with the branding hierarchy (engineers must articulate what Block is vs Square vs Cash App), and a calibrated take on the Bitcoin-bet that defines Cash App\'s competitive position.' },

      { type: 'h2', text: 'The Block SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Block, why this team (Square vs Cash App vs TBD vs Spiral). They will probe whether you can articulate the ecosystem structure.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-2024 ecosystem register.',
        'Technical screen -- 60 minutes. Live coding (Java / Kotlin for backend; Swift / Kotlin for mobile; TypeScript for some consumer-facing services).',
        'System design -- 60 minutes. Real Block-shaped scenarios. "Design Cash App\'s P2P send flow at 50M MAU with sub-3s p99." "Walk me through how Square\'s payment terminal handles a card-present transaction end-to-end." "Design the Bitcoin Lightning Network integration for Cash App at 1M txns/day."',
        'Onsite or final loop -- 3 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Cash App user sends $50 to another user. Trace it end-to-end."',
        '"Design Cash App P2P send at 50M MAU, p99 under 3 seconds. Walk me through the architecture."',
        '"How does Square\'s payment terminal handle a card-present transaction with a chip + PIN flow? What goes wrong if the network drops mid-transaction?"',
        '"You are designing the Bitcoin Lightning integration for Cash App at 1M transactions per day. Walk me through the architecture."',
        '"You inherit a fraud-detection service that has 0.3% false-positive rate that is locking out 30K legitimate users daily. Six month plan."',
        '"You disagree with a senior engineer on whether to ship a feature that increases conversion 1% but introduces a regulatory risk. Argue your side."',
        '"What is your real opinion on the Bitcoin bet at Cash App? Where is Block right? Where is the strategy a distraction from the merchant business?"',
        '"Walk me through the most subtle bug you have hit in payments systems."',
        '"Why Block and not [Stripe / PayPal / a pure-merchant fintech]?"',
        '"How do you reason about the trade-off between the merchant ecosystem and the consumer ecosystem? Where do they reinforce, where do they conflict?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Block specifically' },
      { type: 'ol', items: [
        'No clarity on company structure. If you cannot articulate Block vs Square vs Cash App vs TBD in one sentence each, the recruiter screen ends fast. Five minutes on the Block company page solves this.',
        'No payments-systems depth. "I would use Stripe" is not enough — Block IS the Stripe-equivalent for many merchants. Knowing roughly how settlement, authorisation, capture, refund, chargeback, and dispute work matters.',
        'Generic fintech takes. Block has specific bets (Bitcoin maximalist Cash App, merchant SaaS Square, decentralised identity TBD). Coming in with an opinion-free take signals you have not done the homework.',
        'Underestimating regulatory + fraud awareness. Cash App has been heavily scrutinised for fraud / money-laundering enforcement actions. "I would just ship the feature" without engaging with the FinCEN / BSA / AML context fails.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Block company structure page. Use Cash App for 10 minutes. Read the most recent earnings call summary. Identify three opinions on the Bitcoin bet.',
        '15-35 min: Stack drill. Square Reader / Terminal architecture, Cash App P2P + Bitcoin send architecture, the Square Online consumer commerce platform, TBD\'s ION protocol. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Cash App P2P at scale, Square card-present flow, Bitcoin Lightning integration. Write a one-page memo with payment-systems primitives baked in.',
        '55-70 min: Story drill. Three stories with payments + regulatory framing. 200 words each.',
        '70-78 min: Regulatory primer. PCI-DSS basics, BSA / AML compliance, the FinCEN money-services-business framework, NY DFS BitLicense. Two minutes per concept.',
        '78-80 min: Close. One opinion on the Bitcoin bet, one specific Block decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Block remote in 2026?' },
      { type: 'p', text: 'Block has been remote-first since 2020. SF + Oakland + St Louis (Square HQ historically) hubs. Most engineering remote within US.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of FAANG-equivalent for senior engineers. Below FAANG on RSU at the post-2022 stock price; competitive on cash + meaningful equity at the post-restructure trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including ecosystem-restructured fintechs like Block. Free at aimvantage.uk.' },

      { type: 'p', text: 'Block hires engineers who can articulate the ecosystem structure clearly, reason about payments systems with regulatory awareness, and hold a calibrated take on the Bitcoin bet. Prep the company structure, the payments stack, and the regulatory context.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) DISCORD SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'discord-software-engineer-interview-2026',
    title: 'Discord software engineer interview: the post-IPO-prep 2026 loop',
    description: 'The Discord software engineer interview in 2026 -- five stages, the IPO-track + AI-agent platform context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Discord', 'Software Engineer Interview', 'Real-time', 'Voice', 'Community', 'AI Agents', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Discord is preparing for IPO and shipping AI-agent infrastructure for community moderation + content. The 2026 engineer loop tests for real-time-systems depth + community-platform reasoning.',
    hook: 'Discord runs one of the largest real-time voice + chat platforms in tech. The interview tests for real-time-systems depth + community-moderation reasoning most candidates underestimate.',
    sections: [
      { type: 'p', text: 'Discord is private but on a clear IPO-track timeline (filed S-1 in 2024, public expected 2025-26). The engineering team is hiring across the core real-time platform (Elixir + Erlang for chat / voice; Rust for newer services), the AI agent platform (community moderation + content), the developer platform (bots + embedded apps), and the Nitro premium subscription stack. The 2026 hiring bar is high but specific: real-time-systems comfort (especially Elixir / Erlang reasoning), community-platform thinking (moderators are first-class citizens), and a calibrated take on the AI-agent moderation thesis.' },

      { type: 'h2', text: 'The Discord SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Discord, why this team. They will probe whether you have used Discord seriously.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the IPO-track register.',
        'Technical screen -- 60 minutes. Live coding (Python / Go / Rust depending on team; Elixir for the core platform team). Moderate problem.',
        'System design -- 60 minutes. Real Discord-shaped scenarios. "Design voice infrastructure for 1M concurrent voice connections with sub-200ms latency." "Walk me through how Discord handles message fan-out for a server with 500K members." "Design the AI agent for community moderation at scale."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user sends a message in a 500K-member server. Trace the message fan-out path."',
        '"Design Discord voice for 1M concurrent voice connections, sub-200ms latency p99. Walk me through the architecture."',
        '"How does Discord scale the message-history datastore? Cassandra? Something custom?"',
        '"You are designing an AI agent for community moderation that operates as a member of a server. Walk me through the architecture."',
        '"You inherit a feature that 0.5% of users hit a 5-second message-send latency on. The cohort is concentrated in a specific region. First three actions?"',
        '"You disagree with a senior engineer on whether to use Elixir/OTP or migrate a service to Rust. Argue your side."',
        '"What is your real opinion on the AI-moderation thesis? Where is Discord right? Where does the cost outweigh the benefit?"',
        '"Walk me through the most subtle bug you have hit in real-time / messaging systems."',
        '"Why Discord and not [Slack / Microsoft Teams / a pure-AI moderation startup]?"',
        '"How do you reason about engineering trade-offs that affect moderators specifically (not just users)?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Discord specifically' },
      { type: 'ol', items: [
        'Not using Discord seriously. Discord hires engineers who use the product. If you cannot name the servers you actively use and articulate one moderation friction point, the recruiter screen ends fast.',
        'No real-time-systems depth. "I would use WebSockets" is not enough. Discord expects reasoning about Erlang/OTP supervision trees, voice WebRTC infrastructure, message fan-out at server scale.',
        'Underestimating moderation complexity. Discord servers are run by volunteer moderators. Engineers who frame moderation as a back-office concern fail. Stories that frame moderators as primary stakeholders score high.',
        'Generic AI-moderation takes. Discord shipped specific AI moderation tools in 2024. "AI moderation is great" is not an answer. Calibrated take: "I would not let an AI agent autonomously ban users without a human-confirmation layer because the false-positive cost on a moderator\'s reputation in their server is too high."',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Discord for 15 minutes. If you don\'t already use it, join 3 popular servers. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. Elixir / OTP basics, Erlang BEAM virtual machine, voice WebRTC architecture, Cassandra usage at Discord scale, the fan-out service architecture (their famous blog post on it). Two minutes per concept.',
        '35-55 min: System design. Pick one of -- voice at 1M concurrent, message fan-out for large server, AI moderation agent. Write a one-page memo with explicit moderator-first reasoning.',
        '55-70 min: Story drill. Three stories with real-time + community-stakeholder framing. 200 words each.',
        '70-78 min: Read the Discord engineering blog (discord.com/blog/engineering). Pick one specific opinion on their architecture choices.',
        '78-80 min: Close. One opinion on AI moderation, one specific Discord decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Discord remote in 2026?' },
      { type: 'p', text: 'Mostly remote within US since 2020. SF + NYC hubs. Some senior+ roles preference SF in-person. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of late-stage private market. Below FAANG on RSU upside (private, less liquidity), competitive on cash. Equity meaningful at the IPO-track timing.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Selectively for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including IPO-track real-time platforms like Discord. Free at aimvantage.uk.' },

      { type: 'p', text: 'Discord hires engineers who use the product, can reason about real-time systems at scale, and treat moderators as first-class stakeholders. Prep the Elixir / Erlang context, the voice + fan-out stack, and a calibrated take on AI moderation.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) PINTEREST SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'pinterest-software-engineer-interview-2026',
    title: 'Pinterest software engineer interview: the visual-AI 2026 loop',
    description: 'The Pinterest software engineer interview in 2026 -- five stages, the visual-AI + shopping pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Pinterest', 'Software Engineer Interview', 'Visual Search', 'ML', 'Shopping', 'Recommendation Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Pinterest pivoted hard into visual-AI + shopping infrastructure in 2024-25. The 2026 engineer loop tests for visual-ML depth + comfort with the post-Bill Ready shopping thesis.',
    hook: 'Pinterest is the most ML-heavy social platform most candidates underestimate. Visual search, shoppable pins, and the AI-discovery layer are the engineering bar in 2026.',
    sections: [
      { type: 'p', text: 'Pinterest (NYSE: PINS) operates a visual-discovery platform with 500M+ monthly users; 70%+ are women. The engineering team is hiring across visual search (Pinterest Lens), the recommendation / Home Feed, the shopping platform, the ad platform, and the new AI agents for content generation. The 2026 hiring bar is high but specific: visual-ML depth (image embeddings, multimodal retrieval), real-time recommendation systems, and a calibrated take on the post-Bill-Ready shopping thesis.' },

      { type: 'h2', text: 'The Pinterest SWE process -- 5 stages, ~4 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Pinterest, why this team. They will probe whether you have used Pinterest seriously.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency tied to visual-AI / recommendation context.',
        'Technical screen -- 60 minutes. Live coding (Python / Java / TypeScript). Moderate ML / data structures problem.',
        'System design -- 60 minutes. Real Pinterest-shaped scenarios. "Design visual search at 500M users with sub-300ms p99." "Walk me through Home Feed ranking with implicit feedback at scale." "Design the shoppable-pin pipeline that detects products in user-uploaded images."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user uploads a photo of a sofa to Pinterest Lens. Trace it end-to-end."',
        '"Design visual search at 500M users, sub-300ms p99. Walk me through the architecture."',
        '"How does Pinterest rank the Home Feed for a user with 5 boards but no recent saves? What is the exploration-vs-exploitation balance?"',
        '"You are designing the shoppable-pin pipeline that auto-detects products in user-uploaded images. Walk me through it."',
        '"You inherit an embedding model that\'s drifting in production: similarity scores have shifted 3% over 4 weeks. First three actions?"',
        '"You disagree with a senior engineer on whether to use a single multi-modal model (image + text together) or two separate models. Argue your side."',
        '"What is your real opinion on the post-Bill-Ready shopping thesis? Where is Pinterest right? Where is it overcorrecting?"',
        '"Walk me through the most subtle bug you have hit in ML production systems."',
        '"Why Pinterest and not [Instagram / TikTok Shop / a pure-visual-search startup]?"',
        '"How do you reason about engineering trade-offs that affect Creators specifically (not just users)?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Pinterest specifically' },
      { type: 'ol', items: [
        'No visual-ML depth. Pinterest hires engineers who can reason about image embeddings, multimodal retrieval, and visual-similarity at scale. Pure-NLP-only backgrounds get filtered for visual-search teams.',
        'Underestimating recommendation-systems depth. Home Feed ranking is core. Stories without explicit recommendation-systems framing (two-tower retrieval, ranking, exploration) score low.',
        'Generic ML-platform answers. Pinterest has specific infrastructure (Galaxy ML platform, the Pinball workflow scheduler). Generic "I would use Airflow" misses the company-specific context.',
        'No opinion on shopping pivot. Pinterest hired Bill Ready (ex-Google Commerce) as CEO in 2022 and bet hard on shopping. Coming in without an opinion on the strategy signals you have not done the homework.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Pinterest for 15 minutes. Use Lens (the visual search). Use a board with shoppable pins. Note three friction points.',
        '15-35 min: Stack drill. Visual embeddings (CLIP-style or proprietary), two-tower retrieval, multi-stage ranking, the Galaxy ML platform, Pinball workflow scheduler, real-time feature serving. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- visual search at scale, Home Feed ranking, shoppable-pin product detection. Write a one-page memo with explicit ML-systems reasoning.',
        '55-70 min: Story drill. Three stories with ML / recommendation / metric framing. 200 words each.',
        '70-78 min: Read the Pinterest engineering blog (medium.com/pinterest-engineering). Pick one specific opinion on the visual-search architecture.',
        '78-80 min: Close. One opinion on the shopping thesis, one specific Pinterest decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Pinterest remote in 2026?' },
      { type: 'p', text: 'Hybrid for engineering. SF + Seattle + Toronto + Dublin. 3 days a week in office for most engineering since 2024 RTO. Some staff+ remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-of-market for FAANG-equivalent roles. Below FAANG on RSU at the post-2022 stock price; competitive on cash. London / Toronto base lags SF by ~20-25%.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including visual-ML platforms like Pinterest. Free at aimvantage.uk.' },

      { type: 'p', text: 'Pinterest hires engineers who can reason about visual-ML at 500M-user scale, hold an opinion on the shopping pivot, and treat Creators as primary stakeholders alongside users. Prep the visual-embeddings stack, the recommendation systems, and a calibrated take on the post-Bill-Ready shopping thesis.' },
    ],
  },
];
