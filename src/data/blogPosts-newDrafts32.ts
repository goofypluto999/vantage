// 3 more interview-guide posts -- batch 32 (consumer + healthcare)
// Booking Holdings (travel), Instacart (grocery), Tempus AI (precision medicine).

import type { BlogPost } from './blogPosts';

export const newBlogPosts32: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) BOOKING HOLDINGS SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'booking-software-engineer-interview-2026',
    title: 'Booking.com software engineer interview: the post-AI Trip Planner + Connected Trip 2026 loop',
    description: 'The Booking.com (Booking Holdings) software engineer interview in 2026 -- five stages, the post-AI Trip Planner + Connected Trip + Genius + Flights context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Booking.com', 'Software Engineer Interview', 'Travel', 'AI Trip Planner', 'Connected Trip', 'Perl', 'Interview Prep'],
    excerpt: 'Booking.com pushed the Connected Trip thesis, shipped AI Trip Planner, expanded Flights, and continued the Genius loyalty + Marketplace plays. The 2026 engineer loop tests for the famous Perl + Java + experimentation register.',
    hook: 'Booking.com is the EU travel giant whose engineering culture famously runs Perl + Java + A/B experimentation at planetary scale. The 2026 interview filters for engineers who can ship in the test-everything register.',
    sections: [
      { type: 'p', text: 'Booking Holdings (NASDAQ: BKNG) — parent of Booking.com, Priceline, Agoda, KAYAK, OpenTable, and Rentalcars.com — pushed the Connected Trip thesis (multiple verticals — accommodation + flights + ground transport + attractions + payments — in a single customer journey), shipped AI Trip Planner (the genAI travel assistant on Booking.com + Priceline + KAYAK + Agoda), continued the Flights + Vacation Rentals expansion (chasing Expedia + Vrbo + Airbnb), expanded the Genius loyalty + Wallet products, and pushed the Marketplace + Demand-API surfaces. The 2026 engineering team at Booking.com (the largest subsidiary by far) is hiring across the core booking platform (the famous Perl + Java + Mojolicious-flavoured monolith + the long migration to services), the AI Trip Planner + travel-genAI stack, the Connected Trip verticals (Flights, Vacation Rentals, Attractions, Transport, Payments), the partner-side products (extranet, content management), the marketing + experimentation platform (the famous "ExperimentX" infrastructure that runs 1000+ A/B tests in parallel), and the data + ML products. The 2026 hiring bar is competitive and specific: data-driven experimentation + experimentation-engineering depth, comfort with the Perl + Java + microservices-migration register, and a calibrated take on the Connected-Trip + AI thesis.' },

      { type: 'h2', text: 'The Booking.com SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Booking.com, why this team. They will probe whether you understand the experimentation register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the travel + Connected-Trip register.',
        'Technical screen -- 60 minutes. Live coding (Perl or Java most commonly; Python for ML / data; TypeScript + React for client web). Moderate problem with a focus on real-world trade-offs.',
        'System design + experimentation -- 60 minutes. Real Booking-shaped scenarios. "Design search-ranking for the accommodation list page at peak (multi-month-out summer search)." "Walk me through the experimentation platform -- run 1000+ A/B tests in parallel without metric pollution." "Design the AI Trip Planner backend integrating accommodation + flights + ground transport."',
        'Onsite or final loop -- 2-3 rounds: deeper coding, deeper system design + experimentation-flavoured questions, behavioural / values.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a user searches for accommodation in Paris for 3 nights next August. Trace it from the search box to the ranked list."',
        '"Design the experimentation platform. 1000+ A/B tests in parallel. How do you avoid metric pollution + interaction effects? How do you decide statistical significance?"',
        '"Design AI Trip Planner backend. The user asks: \'2 weeks in Japan for a couple in spring with a mix of cities + countryside.\' Walk me through the inference + retrieval + orchestration."',
        '"Walk me through search-ranking for the accommodation list page at peak. Multi-tenant ranking with personalisation + freshness + price + availability."',
        '"You inherit a search-ranking change that improves CTR by 4% but reduces booking-completion by 1.5%. First three actions?"',
        '"You disagree with a senior engineer on whether to migrate a Perl service to Java + microservices. Argue your side."',
        '"What is your real opinion on the Connected Trip thesis? Where does it win? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a high-traffic experimentation or recommender system."',
        '"Why Booking.com and not [Airbnb / Expedia / Google Travel / a vertical-travel app]?"',
        '"How would you reduce search-page TTFB by 30% without weakening personalisation quality?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Booking.com specifically' },
      { type: 'ol', items: [
        'No experimentation reasoning. Booking is structurally an A/B-test-everything company. Stories that miss experiment design / power / significance / interaction-effect concepts miss the company.',
        'Generic e-commerce answers. Booking has very specific architecture (the Perl + Mojolicious + Java monolith-migration, ExperimentX, the search-ranking + availability + pricing engine, the partner-extranet). Generic answers miss Booking-specific context.',
        'Disrespect for Perl. Booking is famously still heavy in Perl. "I would migrate everything to X" without engaging with why Perl works for them at this scale is a red flag.',
        'No opinion on the Connected Trip + AI direction. The Connected Trip thesis + AI Trip Planner are central. Coming without an opinion signals shallow prep.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Booking.com + AI Trip Planner. Note three friction points + three things you respect.',
        '15-35 min: Stack drill. A/B-test design (power, significance, interaction effects), search-ranking architecture, ExperimentX-style multi-test infrastructure, Mojolicious + Perl basics, AI Trip Planner architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- accommodation search ranking, ExperimentX, AI Trip Planner backend. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with experimentation + travel framing. 200 words each.',
        '70-78 min: Read on Booking.com vs Airbnb vs Expedia. Articulate where Booking wins (breadth, Connected Trip, Genius loyalty) vs where competitors win.',
        '78-80 min: Close. One opinion on the Connected Trip direction, one specific Booking.com decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Booking.com remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Amsterdam (HQ) + Manchester + Tel Aviv + Berlin + Bangalore + Singapore hubs. Most engineering roles are in-office or hybrid. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of EU consumer-tech band. Strong RSU; total comp approaches FAANG-EU at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles, especially Amsterdam. The Netherlands 30%-ruling tax incentive applies to many qualifying hires. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including travel + experimentation platforms like Booking.com. Free at aimvantage.uk.' },

      { type: 'p', text: 'Booking.com hires engineers who can reason about experimentation at planetary scale, navigate the Perl + Java + microservices-migration register, and engage with the Connected Trip + AI thesis honestly. Prep the ExperimentX context, the search-ranking + AI Trip Planner stack, and a calibrated take on the multi-vertical direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) INSTACART SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'instacart-software-engineer-interview-2026',
    title: 'Instacart software engineer interview: the post-IPO + Caper + Connected Stores 2026 loop',
    description: 'The Instacart software engineer interview in 2026 -- five stages, the post-IPO (2023) + Caper smart carts + Connected Stores + Eversight context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Instacart', 'Software Engineer Interview', 'Grocery Tech', 'Three-sided Marketplace', 'Caper', 'Ads', 'Interview Prep'],
    excerpt: 'Instacart (Maplebear) operates the three-sided grocery marketplace + Caper smart carts + Connected Stores + Eversight pricing AI + the Instacart Ads business. The 2026 engineer loop tests for marketplace + retail-tech depth.',
    hook: 'Instacart is the public grocery-tech company that owns the shopper + retailer + advertiser triangle. The 2026 interview filters for engineers who can ship across the messiest three-sided marketplace in commerce.',
    sections: [
      { type: 'p', text: 'Instacart (NASDAQ: CART, legal name Maplebear) operates the three-sided grocery marketplace (consumers + shoppers + retailers), Caper smart carts (the autonomous shopping-cart product deployed in retailers), Connected Stores (the in-store-tech platform combining Caper + Scan & Pay + Carrot Tags + FoodStorm + the retail-media platform), Eversight (AI pricing + promotions, acquired 2022), the rapidly-growing Instacart Ads business (now a meaningful share of revenue, sold to CPGs), and the deeper Caper Counters + Shop & Win + Retailer-managed-fulfilment surfaces. The 2026 engineering team is hiring across the consumer marketplace (the famous fulfilment / batching / shopper-routing platform), Instacart Ads (the auction + targeting + measurement stack, competing with Amazon Advertising + Walmart Connect for retail-media share), Caper + Connected Stores (the in-store IoT + edge + ML stack), Eversight pricing, the retailer-platform products (storefront, catalog, ops), and the data + ML products. The 2026 hiring bar is competitive and specific: three-sided marketplace depth, comfort with the messy-real-world-retail register, and a calibrated take on the Instacart-Ads + Connected-Stores thesis.' },

      { type: 'h2', text: 'The Instacart SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Instacart, why this team. They will probe whether you understand the three-sided marketplace + the Ads thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the grocery-tech + retail-reality register.',
        'Technical screen -- 60 minutes. Live coding (Python primarily; Ruby for legacy; Go for newer services; TypeScript + React for client web; Swift / Kotlin for mobile).',
        'System design -- 60 minutes. Real Instacart-shaped scenarios. "Design shopper-batching for a metropolitan area at peak (Saturday morning)." "Walk me through Instacart Ads auction at sub-100ms with a 10K-CPG bidder pool." "Design Caper smart-cart inventory sync with a 50K-SKU store."',
        'Onsite or final loop -- 3-4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a customer places an Instacart order with 50 items from a specific retailer. Trace it from checkout to a shopper picking up the order to delivery."',
        '"Design shopper-batching for a metro at peak. Combine 3-4 orders into one shopper run with constraints on items, distance, perishability, time-window."',
        '"Walk me through Instacart Ads auction. 10K CPG bidders, sub-100ms latency, multi-format (sponsored search, banner, recipe). How does the bidder + auction + delivery stack work?"',
        '"Design Caper smart-cart inventory sync. The cart sees what the shopper picks via computer vision. Walk me through the edge + cloud + store-systems integration."',
        '"You inherit a batching algorithm change that improves shopper-throughput by 10% but adds 4% late-deliveries in suburban markets. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a Caper feature or in marketplace-side ML. Argue your side."',
        '"What is your real opinion on the Instacart Ads thesis vs Amazon Advertising? Where does Instacart win? Where does Amazon win?"',
        '"Walk me through the most subtle bug you have hit in a marketplace or fulfilment system."',
        '"Why Instacart and not [DoorDash / Uber Eats / Amazon Fresh / Walmart\'s own delivery]?"',
        '"How would you reduce shopper-find-time by 30% on a complex order without weakening pick accuracy?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Instacart specifically' },
      { type: 'ol', items: [
        'No marketplace reasoning. Instacart is structurally a three-sided marketplace (consumers + shoppers + retailers). Stories that miss any side miss the company.',
        'Generic logistics answers. Instacart has very specific architecture (the batching engine, the shopper-app, the retailer integration, the Ads auction, Caper\'s edge stack). Generic answers miss Instacart-specific context.',
        'No opinion on the Ads + Connected Stores direction. Instacart Ads is the highest-margin growth lever. Coming without an opinion on the Ads-vs-Amazon-Advertising competitive register signals shallow prep.',
        'Tone-deaf on the shopper-worker-classification context. The 1099-vs-W2 + the wage + the gig-economy regulation context shapes the operating reality. Stories that ignore this miss the company.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Use Instacart. Note three friction points + three things you respect. Read one Instacart engineering blog post.',
        '15-35 min: Stack drill. Three-sided marketplace fundamentals, shopper-batching algorithms, retail-media auction architecture (Sponsored Products + Banner), Caper computer-vision + edge sync, Eversight pricing model. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- shopper batching at peak, Ads auction, Caper inventory sync. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with marketplace + retail-reality framing. 200 words each.',
        '70-78 min: Read on Instacart vs DoorDash + Amazon Advertising. Articulate where Instacart wins (grocery focus, Caper, retailer relationships) vs where competitors win.',
        '78-80 min: Close. One opinion on the Ads direction, one specific Instacart decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Instacart remote in 2026?' },
      { type: 'p', text: 'Hybrid -- SF (HQ) + Toronto + NYC hubs. Some senior+ remote roles. RTO tightened. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Mid-band post-IPO. Strong RSU; total comp competitive with FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including marketplace + retail-tech companies like Instacart. Free at aimvantage.uk.' },

      { type: 'p', text: 'Instacart hires engineers who can reason about three-sided marketplaces, navigate the grocery + retail-tech messiness, and engage with the Ads + Connected Stores thesis honestly. Prep the batching + shopper stack, the Ads auction, the Caper context, and a calibrated take on the retail-media direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) TEMPUS AI SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'tempus-ai-software-engineer-interview-2026',
    title: 'Tempus AI software engineer interview: the post-IPO + Lens + Olivia 2026 loop',
    description: 'The Tempus AI software engineer interview in 2026 -- five stages, the post-IPO (June 2024) + Tempus Lens + Olivia + Next-Gen Sequencing context, real questions, four traps, and a 90-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '8 min read',
    tags: ['Tempus AI', 'Software Engineer Interview', 'Precision Medicine', 'Genomics', 'Healthcare AI', 'NGS', 'Interview Prep'],
    excerpt: 'Tempus AI IPO\'d in June 2024 and operates the precision-medicine platform combining genomic sequencing + clinical data + the Tempus Lens + Olivia AI products. The 2026 engineer loop tests for healthcare-data depth + regulated-ML register.',
    hook: 'Tempus AI is the public precision-medicine company at the intersection of genomics + clinical data + AI. The 2026 interview filters for engineers who can ship in the most regulated + data-sensitive environment in tech.',
    sections: [
      { type: 'p', text: 'Tempus AI (NASDAQ: TEM) IPO\'d in June 2024 and operates a precision-medicine platform combining clinical data (the EHR-integrated patient data from 65%+ of US oncologists), genomic sequencing (the Tempus xT, xR, xF, xE NGS panels), proteomics + transcriptomics + RNA + germline + immune-cell profiling, the Tempus Lens (the AI-powered clinical decision-support product), Tempus Olivia (the generative AI assistant for clinicians), and the Tempus One + Tempus Next data products. The 2026 engineering team is hiring across the Sequencing + Lab informatics platform (the LIMS + the NGS bioinformatics pipelines), the Clinical Data platform (the EHR integration + de-identification + linking + tokenisation stack), Tempus Lens + Olivia (the AI / agent + the regulated-medical-device register), the Pharma + Research products (the curated data + biomarker + clinical-trial-matching surfaces), the Hardware-adjacent labs (the wet-lab + dry-lab + automation engineering), and the developer + customer-platform products. The 2026 hiring bar is high and specific: healthcare-data depth, comfort with the FDA / HIPAA / regulated-ML register, and a calibrated take on the Lens + Olivia + Pharma-partnership thesis.' },

      { type: 'h2', text: 'The Tempus AI SWE process -- 5-6 stages, ~5-7 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Tempus AI, why this team. They will probe whether you understand the regulated-healthcare context.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the precision-medicine register.',
        'Technical screen -- 60 minutes. Live coding (Python primarily for bioinformatics + ML; Go + Scala for backend; TypeScript + React for client web).',
        'System design -- 60-90 minutes. Real Tempus-shaped scenarios. "Design the NGS bioinformatics pipeline for the xT panel at clinical-scale (10K+ samples / month) with FDA-cleared rigor." "Walk me through Tempus Lens + Olivia integration with EHR de-identification + RAG + the regulated boundary." "Design the clinical-trial-matching engine across the curated patient population."',
        'Onsite or final loop -- 4-5 rounds: deeper coding (often Python + bioinformatics), deeper system design, behavioural / values + healthcare-mission, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when an oncologist orders a Tempus xT panel for a patient. Trace from order to report-delivery."',
        '"Design the NGS bioinformatics pipeline for the xT panel. 10K+ samples / month, FDA-cleared rigor, sub-week turnaround. Walk me through the read-alignment + variant-calling + annotation + report stack."',
        '"Walk me through Tempus Lens + Olivia integration with EHR. The model reads de-identified clinical context + answers clinician questions. Walk me through the RAG + de-identification + regulated boundary."',
        '"Design the clinical-trial-matching engine. Match a patient\'s clinical + genomic profile against active trials with eligibility criteria."',
        '"You inherit a variant-calling change that improves sensitivity by 4% but adds a 0.5% false-positive rate on one specific variant class. First three actions?"',
        '"You disagree with a senior engineer on whether to invest in a new Lens feature or in the bioinformatics pipeline. Argue your side."',
        '"What is your real opinion on the Pharma-partnership data strategy? Where is the right balance between patient benefit + partner value + commercial growth?"',
        '"Walk me through the most subtle bug you have hit in a healthcare-data or bioinformatics system."',
        '"Why Tempus AI and not [Foundation Medicine / Guardant / Veracyte / a sequencing platform like Illumina]?"',
        '"How would you reduce NGS report turnaround by 30% without weakening clinical-grade rigor?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Tempus AI specifically' },
      { type: 'ol', items: [
        'No healthcare-data reasoning. Tempus is structurally a healthcare + clinical data company. Stories that miss HIPAA / PHI / de-identification / tokenisation / FDA concepts miss the company.',
        'Generic ML answers. Tempus has very specific architecture (the NGS bioinformatics pipeline, the LIMS, the EHR-integration + de-id + linking stack, the Lens + Olivia regulated-medical-device boundary). Generic answers miss Tempus-specific context.',
        'No opinion on the Pharma-partnership data strategy. The Pharma deals are a meaningful revenue stream. Coming without an opinion on the patient-benefit + commercial-balance question signals shallow prep.',
        'Tone-deaf on the regulated context. Stories that treat FDA / HIPAA / IRB / consent as overhead-to-route-around miss the company\'s actual operating reality.',
      ] },

      { type: 'h2', text: 'The 90-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read about Tempus AI\'s xT / xR / xF panels + Tempus Lens + Olivia.',
        '15-40 min: Stack drill. NGS bioinformatics (alignment, variant calling, annotation), LIMS architecture, HIPAA + PHI handling + de-identification, EHR integration (FHIR + HL7), Lens + Olivia regulated-AI architecture. Three minutes per concept.',
        '40-65 min: System design. Pick one of -- NGS pipeline at scale, Lens + Olivia + EHR, clinical-trial-matching engine. Write a one-page memo.',
        '65-80 min: Story drill. Three behavioural stories with healthcare-mission + regulated-rigor framing. 200 words each.',
        '80-87 min: Read on Tempus vs Foundation Medicine vs Guardant. Articulate where Tempus wins (multi-modal data, scale, Lens + Olivia) vs where competitors win.',
        '87-90 min: Close. One opinion on the Pharma-partnership strategy, one specific Tempus decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Tempus AI remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Chicago (HQ) + Atlanta + LA + DC + NYC hubs. Wet-lab / dry-lab roles require in-person. Some engineering roles fully remote. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Post-IPO comp competitive with bio + healthtech band. Strong RSU; total comp matches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including precision-medicine + healthcare-AI companies like Tempus AI. Free at aimvantage.uk.' },

      { type: 'p', text: 'Tempus AI hires engineers who can reason about healthcare-data + NGS + regulated ML, navigate the multi-modal-data + Lens + Olivia register, and engage with the Pharma-partnership thesis honestly. Prep the NGS + LIMS + EHR stack, the Lens + Olivia context, and a calibrated take on the patient-benefit + commercial direction.' },
    ],
  },
];
