// 3 more interview-guide posts -- batch 23 (fintech)
// Coinbase (crypto exchange + onchain), Robinhood (retail brokerage + crypto), Plaid (fintech infra).

import type { BlogPost } from './blogPosts';

export const newBlogPosts23: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) COINBASE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'coinbase-software-engineer-interview-2026',
    title: 'Coinbase software engineer interview: the post-Base + onchain 2026 loop',
    description: 'The Coinbase software engineer interview in 2026 -- five stages, the post-Base L2 + onchain + USDC + AI-agents context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Coinbase', 'Software Engineer Interview', 'Crypto', 'Base L2', 'Onchain', 'USDC', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Coinbase pivoted from retail exchange to onchain platform with Base L2, the Coinbase Developer Platform, x402 (HTTP 402 for AI agents), and the deepening USDC partnership with Circle. The 2026 engineer loop tests for blockchain depth + the onchain-platform thesis.',
    hook: 'Coinbase is the public-company crypto exchange that bet the future on Base L2 and onchain agents. The 2026 interview filters for engineers who can ship in a regulated + onchain register.',
    sections: [
      { type: 'p', text: 'Coinbase (NASDAQ: COIN) repositioned from retail crypto exchange to onchain platform with Base (the L2 built on the OP Stack, now top-3 L2 by TVL), the Coinbase Developer Platform (CDP), Smart Wallet (passkey-based EOA), x402 (the HTTP 402 + agentic-payments standard), and a deepening USDC partnership with Circle. The 2026 engineering team is hiring across the core exchange (matching engine, custody, compliance), Base L2 (the sequencer + bridge + ecosystem infra), CDP + Smart Wallet, onchain payments (USDC + x402), the institutional product (Coinbase Prime), and the Web3 + AI-agents teams. The 2026 hiring bar is high but specific: blockchain depth, comfort with regulated-environment trade-offs (SEC + CFTC + state regulators), and a calibrated take on the onchain-platform thesis.' },

      { type: 'h2', text: 'The Coinbase SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Coinbase, why this team. They will probe whether you understand the onchain-platform thesis + regulated context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-2023 + Howey-test-defeated register.',
        'Technical screen -- 60 minutes. Live coding (Go for backend; Solidity for onchain; TypeScript for CDP). Moderate problem.',
        'System design -- 60 minutes. Real Coinbase-shaped scenarios. "Design the matching engine for the BTC-USD pair at peak with sub-1ms order-ack." "Walk me through Base L2 sequencer architecture + the fault-proof handoff." "Design a Smart Wallet recovery flow that survives a sequencer outage."',
        'Onsite or final loop -- 4 rounds: deeper coding or design, behavioural (the famous Coinbase culture-doc gets quoted), compliance + risk reasoning, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user places a market BTC buy on Coinbase. Trace it from order entry to settlement + balance update."',
        '"Design the matching engine for BTC-USD at peak (50K+ orders/sec) with sub-1ms p99 order-ack."',
        '"Walk me through Base L2 sequencer architecture. What happens on a sequencer outage + how does the fault-proof + escape-hatch work?"',
        '"Design a Smart Wallet recovery flow (passkey-based) that survives an L1 reorg + sequencer outage."',
        '"You inherit a feature that improves trading-experience by 8% but adds 200ms to the regulated KYC-refresh flow for one US state. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a feature on Base before regulatory clarity in [State X]. Argue your side."',
        '"What is your real opinion on x402 + the agentic-payments standard? Where does HTTP 402 + USDC win? Where does it create fraud risk?"',
        '"Walk me through the most subtle bug you have hit in financial-precision systems (where rounding or precision errors compound)."',
        '"Why Coinbase and not [Binance / Kraken / Robinhood Crypto / a DEX]?"',
        '"How would you reduce withdrawal-latency by 30% without weakening custody or compliance guarantees?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Coinbase specifically' },
      { type: 'ol', items: [
        'No regulated-environment reasoning. Coinbase is a regulated US public company. Stories that miss compliance (KYC / AML / OFAC / Travel Rule / state money-transmitter licenses) miss the company.',
        'Generic blockchain answers. Coinbase has specific architecture (the hot-wallet + cold-wallet custody split, the matching engine, the Base sequencer, the bridge contracts). Generic answers miss Coinbase-specific context.',
        'No opinion on Base + onchain-platform thesis. Base is central to the 2025+ strategy. Coming without an opinion on whether the L2 bet works (vs alternatives like Arbitrum / Optimism / Solana / multi-chain) signals shallow prep.',
        'Tone-deaf on the 2023-24 SEC litigation context. Coinbase defeated SEC claims in 2024-25 but still operates in a regulator-aware register. Stories that ignore this miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Coinbase Wallet on Base (free + cheap) for 10 minutes. Note three UX friction points + three things you respect. Read one CDP page.',
        '15-35 min: Stack drill. Matching-engine architecture, hot-vs-cold custody split, Base L2 architecture (OP Stack), sequencer + fraud-proof basics, USDC mechanics + bridging. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- matching engine, Base sequencer, Smart Wallet recovery. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with regulated-environment + onchain framing. 200 words each.',
        '70-78 min: Read the most recent Coinbase shareholder letter or 10-Q. Identify the trading-vs-subscription-and-services revenue mix.',
        '78-80 min: Close. One opinion on the onchain-platform thesis, one specific Coinbase decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Coinbase remote in 2026?' },
      { type: 'p', text: 'Remote-first since 2020 (Coinbase was famously "no headquarters" early). Confirmed remote for most engineering roles within US + select EU + India locations. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of crypto-fintech band. Strong RSU; total comp matches or exceeds FAANG mid-band at senior+ depending on stock price (correlated with BTC trajectory).' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including regulated-fintech + onchain platforms like Coinbase. Free at aimvantage.uk.' },

      { type: 'p', text: 'Coinbase hires engineers who can reason about regulated-financial systems, navigate the onchain-platform pivot, and engage with the Base + x402 thesis honestly. Prep the matching engine, the Base L2 architecture, and a calibrated take on the agentic-payments + USDC trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) ROBINHOOD SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'robinhood-software-engineer-interview-2026',
    title: 'Robinhood software engineer interview: the post-Bitstamp + Robinhood-Legend 2026 loop',
    description: 'The Robinhood software engineer interview in 2026 -- five stages, the post-Bitstamp acquisition + Robinhood Legend + futures + 24/5 stock context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Robinhood', 'Software Engineer Interview', 'Retail Brokerage', 'Futures', '24/5 Trading', 'Crypto', 'Interview Prep'],
    excerpt: 'Robinhood expanded from US retail brokerage into futures, index options, 24/5 stocks, the Robinhood Legend pro desktop platform, and crypto (Bitstamp acquisition closed 2025). The 2026 engineer loop tests for brokerage-systems depth + the post-meme-stock pivot.',
    hook: 'Robinhood is the retail brokerage that survived 2021 meme-stock + GameStop + Reg-Best-Execution scrutiny and reinvented itself as a multi-asset platform. The 2026 interview filters for engineers who can ship financial-precision systems at retail scale.',
    sections: [
      { type: 'p', text: 'Robinhood (NASDAQ: HOOD) expanded from US retail commission-free stocks + options into futures (mid-2024), index options + advanced options strategies, 24-hour-market 5-day stocks (24/5), the Robinhood Legend pro desktop trading platform, retirement / IRA, gold credit card, and crypto -- including the Bitstamp acquisition (closed mid-2025, giving global crypto + institutional rails). The 2026 engineering team is hiring across the core brokerage (order management, clearing, options engine), futures + 24/5 + Legend, crypto (Bitstamp integration + US trading + Robinhood Wallet), retirement + gold subscription, and the institutional / market-data products. The 2026 hiring bar is high but specific: brokerage-systems depth, comfort with regulated-environment trade-offs (FINRA + SEC + CFTC), and a calibrated take on the multi-asset-platform thesis.' },

      { type: 'h2', text: 'The Robinhood SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Robinhood, why this team. They will probe whether you understand the multi-asset pivot + regulated context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the post-meme-stock register.',
        'Technical screen -- 60 minutes. Live coding (Python / Go for backend; Rust for low-latency; Swift / Kotlin for mobile). Moderate problem.',
        'System design -- 60 minutes. Real Robinhood-shaped scenarios. "Design the order management system for 1M concurrent retail orders at market open." "Walk me through 24/5 stock trading + the after-hours risk + clearing handoff." "Design Bitstamp integration with the Robinhood crypto trading flow."',
        'Onsite or final loop -- 3-4 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user places a market AAPL buy at 9:30am ET market open. Trace it from tap to T+1 settlement."',
        '"Design the order management system for 1M concurrent retail orders at peak (market open / close / Fed announcement)."',
        '"Walk me through 24/5 stock trading. What is the after-hours liquidity risk + how do you handle the clearing handoff to NSCC overnight?"',
        '"Design the Bitstamp integration with the Robinhood crypto trading flow. Order routing + custody + the dual-jurisdiction compliance boundary."',
        '"You inherit a feature that improves new-account-funnel conversion by 12% but adds 100ms to the regulated suitability-check flow for options upgrades. First three actions?"',
        '"You disagree with a senior engineer on whether to ship a feature that allows 0DTE options for retail. Argue your side."',
        '"What is your real opinion on the multi-asset-platform thesis (stocks + crypto + futures + retirement)? Where does it win? Where does the platform-everything risk apply?"',
        '"Walk me through a subtle bug in financial-precision systems (e.g. fractional shares, options Greeks, or futures multipliers)."',
        '"Why Robinhood and not [Schwab / Fidelity / Webull / Public]?"',
        '"How would you reduce time-to-trade (tap to executed) by 30% without weakening best-execution or risk controls?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Robinhood specifically' },
      { type: 'ol', items: [
        'No regulated-brokerage reasoning. Robinhood is a FINRA + SEC-regulated broker-dealer. Stories that miss Reg-Best-Execution, Reg-NMS, options suitability, PFOF, and clearing miss the company.',
        'Tone-deaf on the 2021 GameStop / meme-stock context. The "we turned off the buy button" incident shaped the post-2021 register. Stories that ignore this miss the actual operating reality. Calibrated take expected.',
        'Generic brokerage answers. Robinhood has specific architecture (the order routing + market makers, the options chain + Greeks engine, the clearing integration, the 24/5 + Legend platform). Generic answers miss Robinhood-specific context.',
        'No opinion on the multi-asset thesis. The post-2022 pivot to crypto + retirement + futures + Legend is central. Coming without an opinion on whether platform-everything works (vs focused brokerage) signals shallow prep.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Robinhood app for 10 minutes. Note three friction points + three things you respect. Look at Legend desktop briefly.',
        '15-35 min: Stack drill. Order routing + PFOF, options chain + Greeks computation, 24/5 mechanics, futures multipliers, the Bitstamp integration shape, NSCC clearing basics. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- OMS at market open, 24/5 after-hours, Bitstamp + crypto trading flow. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with regulated-brokerage + retail-scale framing. 200 words each.',
        '70-78 min: Read the most recent Robinhood 10-Q. Identify the transaction-revenue mix (PFOF + crypto + interest + gold + options).',
        '78-80 min: Close. One opinion on the multi-asset thesis, one specific Robinhood decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Robinhood remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Menlo Park + NYC + Bellevue + Toronto + London hubs. Some fully remote senior+ roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of mid-band fintech post-2024 stock recovery. Strong RSU; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including regulated-brokerage platforms like Robinhood. Free at aimvantage.uk.' },

      { type: 'p', text: 'Robinhood hires engineers who can reason about regulated-brokerage systems at retail scale, navigate the multi-asset pivot, and engage with the post-meme-stock register honestly. Prep the OMS, the 24/5 mechanics, and a calibrated take on the platform-everything trajectory.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) PLAID SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'plaid-software-engineer-interview-2026',
    title: 'Plaid software engineer interview: the post-CFPB-1033 + open-banking 2026 loop',
    description: 'The Plaid software engineer interview in 2026 -- five stages, the post-CFPB Section 1033 + open-banking + Layer (identity) context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Plaid', 'Software Engineer Interview', 'Fintech', 'Open Banking', 'CFPB 1033', 'Identity', 'Interview Prep'],
    excerpt: 'Plaid pivoted from screen-scraping aggregator into the open-banking + identity + payment-risk platform after CFPB Section 1033 mandated API-based bank-data access. The 2026 engineer loop tests for bank-integration depth + post-1033 register.',
    hook: 'Plaid is the fintech-infra company that bet on open-banking before it was mandated. The 2026 interview filters for engineers who can navigate bank integrations + the post-CFPB-1033 register.',
    sections: [
      { type: 'p', text: 'Plaid (private, late-stage) repositioned from screen-scraping bank-data aggregator into the open-banking + identity + payment-risk infrastructure platform after CFPB Section 1033 (Personal Financial Data Rights Rule, finalised October 2024, with implementation through 2026-30). The 2026 engineering team is hiring across the core bank-data network (10K+ institution integrations, API-based + token-based + the legacy screen-scrape paths), Plaid Layer (the consent + identity network), Signal (payment-risk scoring), Transfer (ACH + RTP payments), Identity Verification, the developer platform, and the new AI-features (transaction enrichment, fraud detection). The 2026 hiring bar is high but specific: bank-integration depth (the messy reality of 10K+ institutions), comfort with the post-CFPB-1033 register, and a calibrated take on the Plaid-as-network thesis.' },

      { type: 'h2', text: 'The Plaid SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Plaid, why this team. They will probe whether you understand the post-1033 transition.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the bank-integration register.',
        'Technical screen -- 60 minutes. Live coding (Go for backend; TypeScript for SDKs; Python for data). Moderate problem.',
        'System design -- 60 minutes. Real Plaid-shaped scenarios. "Design the bank-data sync flow for 100M+ end-user accounts across 10K+ institutions." "Walk me through Plaid Signal -- a payment-risk score returned in under 100ms." "Design the FDX-based open-banking flow + the legacy screen-scrape fallback."',
        'Onsite or final loop -- 4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user links a Chase account to a Plaid-powered app. Trace from OAuth flow to first transaction sync."',
        '"Design the bank-data sync flow for 100M+ end-user accounts across 10K+ institutions with reasonable freshness + cost."',
        '"How does Plaid Signal return a payment-risk score in under 100ms? Where does the model live + how do you handle the cold-start problem for first-time accounts?"',
        '"Design the FDX-based open-banking flow + the legacy screen-scrape fallback. Walk me through the trust + reliability differences."',
        '"You inherit a feature that improves Identity Verification pass-rate by 15% but adds a 30% false-accept rate increase for one demographic cohort. First three actions?"',
        '"You disagree with a senior engineer on whether to deprecate a legacy screen-scrape integration before the institution\'s API is reliable. Argue your side."',
        '"What is your real opinion on the CFPB Section 1033 trajectory? Where is it right? Where does it create friction?"',
        '"Walk me through a subtle bug in transaction-data parsing (multi-currency / pending vs posted / refunds)."',
        '"Why Plaid and not [MX / Finicity / Stripe Financial Connections / a direct bank API integration]?"',
        '"How would you reduce bank-link latency (linkOpened to firstTransactionAvailable) by 30% without weakening data quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Plaid specifically' },
      { type: 'ol', items: [
        'No bank-integration-reality reasoning. Plaid sits between 10K+ messy bank systems. Stories that assume "we just call an API" miss the actual operating reality (rate limits, MFA, fragile UIs, retry storms, bank-side maintenance windows).',
        'Generic fintech answers. Plaid has specific architecture (the institution-routing layer, the credential vault, the FDX vs screen-scrape paths, Signal\'s ML stack). Generic answers miss Plaid-specific context.',
        'No opinion on CFPB 1033. Section 1033 is the single most important regulatory event for Plaid in a decade. Coming without an opinion on the timeline + how it changes the network thesis signals shallow prep.',
        'Tone-deaf on consumer-data + privacy register. Plaid handles raw bank-transaction data. Stories that ignore the privacy + consent + Plaid Portal context miss the company.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Plaid docs intro + look at one quickstart (Auth or Transactions). Read the Plaid Portal page briefly.',
        '15-35 min: Stack drill. Institution-routing, OAuth + token-based vs screen-scrape, transaction enrichment, Signal architecture, FDX spec basics, CFPB 1033 timeline. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- 100M-account sync, Signal under 100ms, FDX + fallback. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with bank-integration-reality + privacy framing. 200 words each.',
        '70-78 min: Read on Plaid vs MX vs Stripe Financial Connections. Articulate where Plaid wins (network depth + Layer + Signal) vs where competitors win.',
        '78-80 min: Close. One opinion on CFPB 1033, one specific Plaid decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Plaid remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF + NYC + Salt Lake City + London + Amsterdam hubs. Some fully remote roles within those regions. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Late-stage private + 2024 secondary round set comp at top of fintech mid-band. Equity is private RSU. Confirm strike + 409A at offer.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including fintech-infra platforms like Plaid. Free at aimvantage.uk.' },

      { type: 'p', text: 'Plaid hires engineers who can reason about 10K+ bank integrations with all their messy reality, navigate the post-CFPB-1033 transition, and engage with the network-as-platform thesis honestly. Prep the institution-routing stack, the FDX context, and a calibrated take on the open-banking trajectory.' },
    ],
  },
];
