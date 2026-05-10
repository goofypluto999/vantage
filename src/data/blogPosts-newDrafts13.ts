// 3 more high-volume / EU-targeted interview-guide posts -- batch 13
// Adobe, Uber, Booking.com. Mix of high search volume + EU-targeted.

import type { BlogPost } from './blogPosts';

export const newBlogPosts13: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) ADOBE SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'adobe-software-engineer-interview-2026',
    title: 'Adobe software engineer interview: the GenAI-pivot 2026 loop',
    description: 'The Adobe software engineer interview in 2026 -- five stages, the Firefly + Express pivot, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Adobe', 'Software Engineer Interview', 'Firefly', 'Generative AI', 'Creative Cloud', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Adobe shipped Firefly and bet the Creative Cloud roadmap on generative AI. The engineer loop now expects creative-AI reasoning + Adobe-stack depth. Generic FAANG prep loses to Adobe-specific prep.',
    hook: 'Adobe shipped a generative-AI pivot most engineers underestimate. The interview filters for whether you have used Firefly seriously and have an opinion on where it falls short.',
    sections: [
      { type: 'p', text: 'Adobe (NASDAQ: ADBE) bet the Creative Cloud roadmap on generative AI when it shipped Firefly in 2023; by 2026 Firefly is integrated across Photoshop, Illustrator, Premiere, Express, and the new agent-driven asset pipeline. The engineering team is hiring across Firefly model serving, the Express consumer app, the Creative Cloud platform, and Document Cloud (Acrobat AI). The bar in 2026 is high but specific: comfort with image / video / audio model serving at scale, and a calibrated take on creative-AI ethics + Adobe\'s commercial-safe positioning.' },

      { type: 'h2', text: 'The Adobe SWE process -- 5 stages, ~5-6 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30-45 minutes. Background, why Adobe, why this team. They will probe whether you have used Firefly + Express seriously and have a real opinion on the commercial-safe positioning.',
        'Hiring manager interview -- 60 minutes. Past work, scope, technical fluency, the GenAI-pivot register.',
        'Technical screen -- 60 minutes. Live coding (Java is the strong default for backend; TypeScript for Express / web; C++ for Premiere / Photoshop core). Moderate-to-hard problem.',
        'System design -- 60 minutes. Real Adobe-shaped scenarios. "Design Firefly image-generation serving at 100K concurrent users with sub-3s p99." "How does Express handle real-time multi-user editing with operational transforms over a 50KB-200KB image canvas?" "Design the Acrobat AI doc-processing pipeline at 10M PDFs per day."',
        'Onsite or final loop -- 3-4 rounds: deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Open Firefly right now. Generate an image. Tell me three things you would change about the prompt-to-image flow."',
        '"Design Firefly image generation at 100K concurrent users, p99 under 3 seconds."',
        '"How does Express handle real-time multi-user editing? Walk me through the data sync and conflict resolution."',
        '"You disagree with a senior engineer on whether to ship a Firefly model trained on broader internet data (more capable but commercial-unsafe) or stay with Adobe Stock-licensed only (safer but less capable). Argue your side for 5 minutes."',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"What is your real opinion on Adobe\'s commercial-safe AI positioning vs OpenAI / Midjourney\'s broader-training approach? Where is Adobe right? Where is the gap?"',
        '"Pick a creative-cloud product surface. Tell me three things you would change. Defend each."',
        '"Tell me about a production incident you owned end-to-end. What did the postmortem look like?"',
        '"Why Adobe and not Figma, Canva, or a frontier AI lab?"',
        '"Walk me through how you would reduce the inference cost of a Firefly text-to-image model by 30% without degrading output quality."',
      ] },

      { type: 'h2', text: 'What kills candidates at Adobe specifically' },
      { type: 'ol', items: [
        'Not using Firefly + Express seriously. Adobe expects engineers to use the products. If your last serious Firefly session was 3 months ago, the recruiter screen ends fast. Spend 1 hour using both the day before applying.',
        'Generic GenAI takes. "Generative AI is going to change everything" is not an answer. Adobe has shipped a specific commercial-safe thesis. "I would not lower the licensing bar on Firefly training data because Adobe\'s enterprise customers explicitly need indemnified output for legal review" is calibrated.',
        'No reasoning on creative-app architecture. Express + Photoshop are not just "another web app" — they handle real-time multi-user editing, large binary canvases, and undo/redo across complex operations. If you cannot reason about operational transforms or CRDT-style merge in Express, the system design round goes shallow.',
        'Underestimating values + culture round. Adobe runs a strong values-driven culture (genuine, exceptional, innovative, involved). They are not slogans. Have specific stories tied to each.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Open Firefly + Express. Generate something with each. Note three friction points and three things you respect.',
        '20-40 min: Stack drill. Image-model serving (NVIDIA Triton + Adobe Sensei platform), Creative Cloud sync architecture, Express OT/CRDT, Acrobat AI document parsing pipeline. Two minutes per concept.',
        '40-55 min: System design. Pick one of -- Firefly serving at 100K users, Express real-time collaboration, Acrobat AI doc processing. Write a one-page memo. 5 components, 3 trade-offs, 1 thing you would not build.',
        '55-70 min: Story drill. Three stories tied to Adobe values (genuine, exceptional, innovative, involved). 200 words each.',
        '70-78 min: Commercial-safe AI audit. Read Adobe\'s public Firefly training-data position. Read OpenAI\'s and Midjourney\'s. Articulate where each is right and what trade-offs each made.',
        '78-80 min: Close. One opinion on commercial-safe AI, one specific Adobe decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Adobe remote in 2026?' },
      { type: 'p', text: 'Hybrid. San Jose, Seattle, NYC, London, Bucharest, Bangalore major hubs. 2-3 days a week in office for most engineering roles since 2023 RTO. Some staff+ roles fully remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of enterprise SaaS. Below FAANG on cash but stronger total comp at senior+ levels due to RSU appreciation post-2024.' },
      { type: 'h3', text: 'Do you need a creative background?' },
      { type: 'p', text: 'No. Adobe hires engineers without design backgrounds for most platform / infrastructure / Firefly model-serving roles. For Express UX engineering or Photoshop core, having shipped creative software is a strong signal but not required.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including GenAI-pivot shops like Adobe. Free at aimvantage.uk.' },

      { type: 'p', text: 'Adobe hires engineers who can reason about creative-AI serving at scale, hold a calibrated commercial-safe position, and ship in the GenAI register. Prep Firefly + Express + the commercial-safe context, and the system design round becomes the easier half of the loop.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) UBER SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'uber-software-engineer-interview-2026',
    title: 'Uber software engineer interview: the post-profitability 2026 loop',
    description: 'The Uber software engineer interview in 2026 -- five stages, the post-profitability efficiency mandate, real questions, four traps, and an 85-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Uber', 'Software Engineer Interview', 'Marketplaces', 'Real-time Systems', 'Distributed Systems', 'Interview Prep', 'Tech Hiring'],
    excerpt: 'Uber turned profitable in 2024 and runs a tighter ship in 2026. The engineer loop tests for marketplace reasoning + post-profitability discipline. Generic FAANG prep loses to Uber-specific prep.',
    hook: 'Uber turned profitable in 2024 and rebuilt the engineering culture around it. The bar in 2026 favours engineers who can reason about marketplace dynamics + ship at lower headcount.',
    sections: [
      { type: 'p', text: 'Uber (NYSE: UBER) is public, profitable as of 2024, and operating at a different tempo than the pre-2022 growth-at-all-costs era. The engineering team is hiring across rides, eats, freight, autonomous (Bedrock), and the marketplace platform that powers all of them. The bar in 2026 is high but specific: marketplace reasoning (supply / demand matching at city-block resolution), real-time systems comfort, and an honest take on the post-profitability operating mandate.' },

      { type: 'h2', text: 'The Uber SWE process -- 5 stages, ~5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Uber, why this team. They will probe whether you have a real opinion on marketplace dynamics + the post-2024 mandate.',
        'Phone screen -- 60 minutes. Hard coding problem (often Go for backend; Swift / Kotlin for mobile platform; Java / Python for ML platform).',
        'Onsite -- 4-5 rounds, 60 minutes each: 2x coding, 1-2x system design (always marketplace-shaped), 1x behavioural.',
        'System design -- expects real Uber primitives. "Design surge pricing for Manhattan at peak. p99 under 100ms for the rider quote." "Walk me through the rider-driver matching algorithm at city-block resolution."',
        'Hiring committee + team match. Similar to Google. 2-3 weeks added beyond onsite.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Code: implement consistent hashing for sharding rider requests across 1,000 server pods."',
        '"Code: design a rate limiter for the surge-pricing API that handles 10K QPS per region."',
        '"Design surge pricing for Manhattan at peak. Walk me through the architecture and the latency budget."',
        '"Walk me through the rider-driver matching algorithm. What changes when you have 100K active riders + 50K active drivers in NYC at rush hour?"',
        '"Design the Eats checkout flow for 1M concurrent orders during Super Bowl Sunday."',
        '"You inherit the dispatch service that has 99.95% uptime; new SLO is 99.99%. Six month plan?"',
        '"Tell me about a time you made a decision with incomplete data."',
        '"What is your real opinion on the post-2024 efficiency mandate? Where is it right? Where is it overcorrecting?"',
        '"Why Uber and not Lyft, DoorDash, or Instacart?"',
        '"Pick an Uber product surface (Eats / Rides / Freight). Tell me three things you would change."',
      ] },

      { type: 'h2', text: 'What kills candidates at Uber specifically' },
      { type: 'ol', items: [
        'No marketplace reasoning. Uber is a marketplace at heart, not a transportation company. If your stories don\'t demonstrate two-sided supply / demand thinking (rider OR driver, eater OR restaurant, shipper OR carrier), the system design round goes shallow.',
        'Pre-2022 growth-mode framing. Stories about "we shipped the feature in 6 months across 12 teams" land badly. Post-2024 Uber values shipping with fewer engineers, faster decision-making, and explicit cost-awareness. Frame your stories in that register.',
        'Generic backend system design. Uber expects real-time + geographic reasoning. "I\'d use Cassandra for storage" is not enough. Knowing roughly how Uber\'s actual stack handles geospatial indexing (H3 hex grids), real-time dispatch, and surge calculation matters.',
        'Underestimating data-driven decision-making. Uber engineers operate with extensive A/B test infrastructure (Morpheus). "I shipped X" without an A/B-tested impact metric scores low; "I shipped X, A/B-tested at 5% rollout for 4 weeks, +1.4% gross bookings, rolled to 100%" scores high.',
      ] },

      { type: 'h2', text: 'The 85-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-20 min: Code drill. Two leetcode-medium-to-hard problems. Time them.',
        '20-40 min: Stack drill. H3 hex geospatial indexing, real-time dispatch architecture, surge calculation algorithm, marketplace metrics framework, A/B test platform (Morpheus). Two minutes per concept.',
        '40-60 min: System design. Pick one of -- surge pricing at peak, rider-driver matching at city-block resolution, Eats checkout flow at peak. Write a one-page memo with real Uber-stack reasoning.',
        '60-75 min: Story drill. Three behavioural stories with concrete metrics + A/B test framing. 200 words each. Drilled in the post-2024 efficiency register.',
        '75-83 min: Marketplace economics audit. Read the most recent Uber earnings call summary. Identify three specific opinions you have on the gross-bookings vs take-rate trade-off, the autonomous opt-in, or the freight pivot.',
        '83-85 min: Close. One opinion on the post-2024 mandate, one specific Uber decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Uber remote in 2026?' },
      { type: 'p', text: 'Hybrid. San Francisco, NYC, Amsterdam, London, Bangalore major hubs. 3 days a week in office since 2023 RTO mandate. Some staff+ roles fully remote.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-to-top of FAANG. London base lags San Francisco by ~25-30%. Equity meaningful at the post-2024 stock trajectory.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles in most markets. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including post-profitability shops like Uber. Free at aimvantage.uk.' },

      { type: 'p', text: 'Uber hires engineers who can reason about marketplaces, ship in the post-2024 efficiency register, and operate with extensive A/B test discipline. Prep the marketplace stack, the geospatial primitives, and the data-driven decision-making framing.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) BOOKING.COM SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'booking-com-software-engineer-interview-2026',
    title: 'Booking.com software engineer interview: the data-driven 2026 loop',
    description: 'The Booking.com software engineer interview in 2026 -- five stages, the famously data-driven culture, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Booking.com', 'Software Engineer Interview', 'Travel Tech', 'A/B Testing', 'Distributed Systems', 'Interview Prep', 'Amsterdam', 'Tech Hiring'],
    excerpt: 'Booking.com runs the most-A/B-tested codebase in tech. The engineer loop tests for whether you can ship + measure under that culture. Most candidates underestimate how seriously they enforce experiment discipline.',
    hook: 'Booking.com runs more A/B tests per day than most companies run per year. The interview filters for whether you can ship + measure under that culture without hiding behind opinion.',
    sections: [
      { type: 'p', text: 'Booking.com (parent: Booking Holdings, NASDAQ: BKNG) is profitable, has 17,000+ engineers globally, and runs what is publicly known as one of the most A/B-tested codebases in technology — every feature ships behind an experiment, every product decision has measured outcomes. The engineering team is hiring across the consumer site, the partner platform, the AI / ML personalisation team, and the Amsterdam-based core platform. The bar in 2026 is high but specific: experiment discipline, data-driven decision-making, and tolerance for slow-moving consensus on major changes.' },

      { type: 'h2', text: 'The Booking.com SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Booking, willingness to relocate to Amsterdam (most senior roles still expect it). They will probe data-driven mindset.',
        'Hiring manager interview -- 60 minutes. Past work, scope, A/B test discipline. Stories without measured outcomes get follow-up grilling.',
        'Technical screen -- 60 minutes. Live coding (Java / Python / Perl backend; Booking has a famous Perl heritage but newer services are Java / Go).',
        'System design -- 60 minutes. Real Booking-shaped scenarios. "Design the search-and-rank pipeline for 28M listings worldwide at sub-200ms p99." "Walk me through how the A/B test platform reads + writes experiments at scale." "Design the booking confirmation flow with payment + supplier sync at 100K transactions/hour."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through how Booking ranks 28M listings for a search query in real time, sub-200ms p99."',
        '"Design the A/B test platform that runs 1,000+ concurrent experiments across the consumer site."',
        '"You ship a feature behind an experiment. After 4 weeks of data, the metric is +0.3% with p=0.18. What do you do?"',
        '"Walk me through the booking confirmation flow. What happens if the supplier API fails after the customer\'s card is charged?"',
        '"You disagree with a senior engineer on whether to ship a feature behind a 1% rollout or a full A/B at 50/50. Argue your side for 5 minutes."',
        '"Tell me about a time you shipped something that did NOT improve the metric. What did you learn?"',
        '"Walk me through the most ambiguous engineering decision you have owned. What did you commit to with incomplete data?"',
        '"Why Booking and not Airbnb, Expedia, or a Big Tech ML team?"',
        '"Pick a Booking product surface. Tell me three things you would change. Defend each with a hypothesis you would A/B test."',
        '"What is your real opinion on the consensus-driven decision-making at scale? Where does it fail?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Booking.com specifically' },
      { type: 'ol', items: [
        'Stories without measured outcomes. Booking interviewers expect EVERY shipped feature story to have an A/B-tested metric attached. "I shipped X" alone scores 30/100; "I shipped X, A/B-tested at 5% rollout for 4 weeks, +1.4% gross bookings on the test cell, rolled to 100% at week 5" scores 90.',
        'Strong opinions presented without data. The Booking engineering culture deeply prefers data-driven over opinion-driven. "I think we should X because I have seen Y" scores low; "We should test X because the lift on Y is plausibly Z%, and our existing data on adjacent A/B tests suggests we can detect that effect at 80% power in 6 weeks" scores high.',
        'Underestimating consensus-driven decision-making. Major changes at Booking move slower than at FAANG because consensus is required across multiple teams. Stories about "I just shipped it" don\'t land. The right register is "I built consensus by [specific moves] over [specific time]".',
        'Not committing to relocation. Most senior engineering roles expect Amsterdam. If you\'re not willing to relocate, the recruiter will be straight with you in the screen — but expecting a remote exception without a strong reason fails most candidates.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read the Booking engineering blog (booking.com/business/engineering). Identify three opinions you have on their A/B test culture / search architecture.',
        '15-35 min: Stack drill. Search-and-rank architecture, A/B test platform (ETA), booking confirmation flow with payment + supplier sync, real-time pricing, the Perl heritage + Java migration. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- search-and-rank at scale, A/B test platform at 1000+ experiments, booking confirmation with supplier failure handling. Write a one-page memo. Include explicit experiment-design notes.',
        '55-70 min: Story drill. Three behavioural stories WITH MEASURED OUTCOMES. 200 words each. If your last role didn\'t have A/B test infrastructure, find proxy metrics (deploy frequency, on-call burden, error rate) and frame your stories around those.',
        '70-78 min: Statistics / experiment-design refresher. Confidence intervals, p-values, false discovery rate, sample size calculation, A/A tests. Two minutes per concept.',
        '78-80 min: Close. One opinion on consensus-driven decision-making, one specific Booking decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Booking.com remote in 2026?' },
      { type: 'p', text: 'Mostly Amsterdam HQ-centric. Some senior+ roles open to remote within EU; very rare for non-Amsterdam staff+ roles. Confirm at the recruiter screen — they will be direct.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of EU market. Amsterdam base salaries lag San Francisco / NYC by ~25%; balanced by lower cost of living + comprehensive benefits (relocation, 13th-month pay, full healthcare).' },
      { type: 'h3', text: 'Do you need to know Perl?' },
      { type: 'p', text: 'No. Booking has been migrating off Perl for years. New services are Java / Go / Python. Comfort reading Perl is a nice-to-have for legacy-system roles, not required.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including data-driven shops like Booking.com. Free at aimvantage.uk.' },

      { type: 'p', text: 'Booking.com hires engineers who can ship + measure under heavy A/B test discipline, hold opinions backed by data, and tolerate consensus-driven decision-making. Prep the experiment-design fundamentals, the search-and-rank stack, and stories with concrete A/B-tested outcomes.' },
    ],
  },
];
