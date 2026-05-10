// 3 more interview-guide posts -- batch 27 (commerce + SMB platforms)
// Shopify, Klaviyo, Toast.

import type { BlogPost } from './blogPosts';

export const newBlogPosts27: BlogPost[] = [
  // -------------------------------------------------------------------
  // 1) SHOPIFY SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'shopify-software-engineer-interview-2026',
    title: 'Shopify software engineer interview: the post-Sidekick + Shop App + Enterprise 2026 loop',
    description: 'The Shopify software engineer interview in 2026 -- five stages, the post-Sidekick AI + Shop App + Shopify Enterprise + the Hydrogen storefront context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Shopify', 'Software Engineer Interview', 'Commerce', 'Sidekick', 'Shop App', 'Ruby on Rails', 'Interview Prep'],
    excerpt: 'Shopify pivoted from SMB DIY-commerce into a multi-segment platform: Sidekick AI + Shop App (consumer) + Shopify Enterprise + Hydrogen. The 2026 engineer loop tests for monolith-scale + commerce-platform depth.',
    hook: 'Shopify is the Rails-monolith commerce platform that bet on Sidekick AI + Enterprise. The 2026 interview filters for engineers who can ship at Rails-monolith scale across 5M+ merchants.',
    sections: [
      { type: 'p', text: 'Shopify (NYSE: SHOP) repositioned from SMB DIY-commerce into a multi-segment platform: Sidekick (the merchant-facing AI assistant, generally available 2024), the Shop App (the consumer-facing surface, ~ tens-of-millions of MAU), Shopify Enterprise (going head-to-head with Salesforce Commerce Cloud + Adobe Commerce), Hydrogen + Oxygen (the headless storefront + edge runtime), Shopify Audiences + Magic (the AI ad-targeting + content stack), Shopify Payments + Shop Pay, and the deeper international + B2B + POS surfaces. The 2026 engineering team is hiring across the core Rails monolith (the famous Shopify-shop database + the modular monolith philosophy), Sidekick + Shopify Magic (the AI / agent stack), Shop App (React Native + the marketplace + post-purchase tracking), Shopify Enterprise (the new high-volume tier), Hydrogen + storefront, the Payments + financial-services products, and the developer platform (Shopify Functions + Theme + App Store). The 2026 hiring bar is high but specific: Rails-monolith depth, comfort with the modular-monolith register (as opposed to microservices fundamentalism), and a calibrated take on the commerce-platform-vs-enterprise-CMS thesis.' },

      { type: 'h2', text: 'The Shopify SWE process -- 4-5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Shopify, why this team. They will probe whether you understand the modular-monolith philosophy + the merchant-first register.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the Rails-monolith register.',
        'Technical screen -- 60-90 minutes (the famous "Pair Programming Interview") -- live coding in Ruby (or Python / TypeScript depending on team). Moderate problem with iterative refactor + test-writing.',
        'System design + technical deep-dive -- 60 minutes. Real Shopify-shaped scenarios. "Design Shop App\'s order-tracking ingest at peak (Black Friday)." "Walk me through how the Shopify shop-table sharding handles a merchant with 1M+ orders." "Design Sidekick -- a merchant-facing agent that can read store + take actions like updating inventory."',
        'Onsite or final loop -- 2-3 rounds: career experience (deep behavioural), technical leadership / values, plus a leadership round at senior+.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Shopify customer adds a product to cart on a storefront powered by Hydrogen. Trace it from the storefront request to the Rails monolith to the cart-token response."',
        '"Design Shop App\'s order-tracking ingest at Black Friday. Tens of thousands of orders per second across millions of merchants."',
        '"Walk me through how the Shopify shop-table sharding handles a merchant with 1M+ orders. The shop-table is the famous Shopify data-locality trick."',
        '"Design Sidekick. A merchant-facing agent that can read store data + take actions (update inventory, run a sale, draft a marketing email). Walk me through the action-confirmation + trust boundary."',
        '"You inherit a feature that improves admin-page load latency by 20% but breaks the API extensibility for 10% of installed apps. First three actions?"',
        '"You disagree with a senior engineer on whether to break a part of the Shopify monolith into a separate service. Argue your side."',
        '"What is your real opinion on the modular-monolith philosophy? Where does it win? Where does it create scaling pain?"',
        '"Walk me through the most subtle bug you have hit in a Rails or large-monolith system."',
        '"Why Shopify and not [Stripe Commerce / WooCommerce / Salesforce Commerce Cloud / a vertical SaaS]?"',
        '"How would you reduce checkout latency by 30% without weakening the cart-abandon recovery flow?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Shopify specifically' },
      { type: 'ol', items: [
        'No commerce-domain reasoning. Shopify is structurally a commerce platform. Stories that miss cart / inventory / fulfilment / settlement concepts miss the company.',
        'Generic monolith answers. Shopify has very specific architecture (the Rails modular monolith, the shop-table sharding, the Storefront API + Admin API split, the Pods isolation, the Liquid template language). Generic answers miss Shopify-specific context.',
        'Microservices fundamentalism. Shopify is famously a modular monolith by choice. "I would break it into microservices" without engaging with why Shopify went the other way is a red flag.',
        'Tone-deaf on the merchant-first register. Shopify\'s mantra is "make commerce better for everyone" with a deep merchant focus. Stories framed for the platform-extraction or enterprise-RFP register miss the company.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Read one Shopify Engineering blog post (shopify.engineering -- the famous "Shop App architecture" or "Pods" or "shop-table sharding" posts).',
        '15-35 min: Stack drill. Rails monolith fundamentals, the Shopify shop-table + Pods architecture, the Storefront + Admin API split, Hydrogen + Oxygen, Sidekick + Magic architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Shop App order-tracking, shop-table at scale, Sidekick agent. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with merchant-first + commerce framing. 200 words each.',
        '70-78 min: Read on Shopify vs alternatives. Articulate where Shopify wins (merchant-first DX, ecosystem, ShopPay) vs where competitors win.',
        '78-80 min: Close. One opinion on the modular-monolith philosophy, one specific Shopify decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Shopify remote in 2026?' },
      { type: 'p', text: 'Digital-by-design since 2020 -- distributed across Canada + US + EU + Australia + India. Most engineering roles fully remote within country. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of commerce-SaaS band post-2024 stock recovery. RSU + cash competitive; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including commerce platforms like Shopify. Free at aimvantage.uk.' },

      { type: 'p', text: 'Shopify hires engineers who can reason about the Rails modular monolith, navigate the Sidekick + Shop App + Enterprise multi-segment register, and engage with the merchant-first culture honestly. Prep the shop-table architecture, the Sidekick context, and a calibrated take on the modular-monolith philosophy.' },
    ],
  },

  // -------------------------------------------------------------------
  // 2) KLAVIYO SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'klaviyo-software-engineer-interview-2026',
    title: 'Klaviyo software engineer interview: the post-IPO + AI Predictive + B2C CRM 2026 loop',
    description: 'The Klaviyo software engineer interview in 2026 -- five stages, the post-IPO + AI predictive + B2C CRM context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Klaviyo', 'Software Engineer Interview', 'Email Marketing', 'B2C CRM', 'Predictive AI', 'Shopify Ecosystem', 'Interview Prep'],
    excerpt: 'Klaviyo went public in September 2023 and pushed into AI predictive + B2C CRM + SMS + Reviews while keeping its Shopify-ecosystem core. The 2026 engineer loop tests for high-volume marketing-platform depth.',
    hook: 'Klaviyo is the post-IPO Shopify-ecosystem giant repositioning as a B2C CRM. The 2026 interview filters for engineers who can ship marketing systems at billions-of-sends scale.',
    sections: [
      { type: 'p', text: 'Klaviyo (NYSE: KVYO) went public September 2023 (the largest tech IPO of 2023) and pushed into AI predictive (the lifetime-value, churn-risk, and product-recommendation models embedded across the product), Klaviyo B2C CRM (the rebranded super-set product unifying email + SMS + Reviews + Audiences + the CDP), Klaviyo AI (the gen-AI + agent layer for content + segment generation), SMS + push (mobile messaging), and the deeper Shopify + BigCommerce + WooCommerce + Magento integration. The 2026 engineering team is hiring across the core platform (events ingestion + the customer profile + segmentation engine + the deliverability stack), Klaviyo AI + predictive (the ML + content + agent stack), SMS + Reviews + Push (the omnichannel surfaces), the Shopify-integration team, and the new B2C-CRM-enterprise direction. The 2026 hiring bar is competitive and specific: high-volume marketing-platform depth, comfort with the deliverability register, and a calibrated take on the B2C-CRM-vs-narrow-email-tool register.' },

      { type: 'h2', text: 'The Klaviyo SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Klaviyo, why this team. They will probe whether you understand the post-IPO B2C CRM thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the marketing-platform register.',
        'Technical screen -- 60 minutes. Live coding (Python primarily; Java + Scala for backend; TypeScript + React for frontend). Moderate problem.',
        'System design -- 60 minutes. Real Klaviyo-shaped scenarios. "Design the event-ingestion pipeline for a Black Friday spike (10M events/sec)." "Walk me through Klaviyo\'s segmentation engine that re-evaluates 100M profile rules in near-real-time." "Design the email-deliverability infrastructure -- multi-IP, ISP feedback, suppression."',
        'Onsite or final loop -- 3 rounds: deeper coding or design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a Shopify customer triggers an Added to Cart event. Trace it from Shopify webhook to a flow-triggered email being sent."',
        '"Design the event-ingestion pipeline for Black Friday. 10M events/sec from millions of stores across multiple integrations."',
        '"Walk me through Klaviyo\'s segmentation engine. 100M+ customer profiles, complex rules, near-real-time re-evaluation. How does the data model + query engine work?"',
        '"Design the email-deliverability infrastructure. Multi-IP rotation, ISP feedback loops, suppression management, the SPF / DKIM / DMARC layer."',
        '"You are designing Klaviyo AI predictive. CLV + churn-risk + product-rec models running per profile. Walk me through the training + inference + freshness architecture."',
        '"You inherit a feature that improves segment-evaluation by 25% but adds 5% staleness in one cohort. First three actions?"',
        '"You disagree with a senior engineer on whether to build SMS as a separate product or unify with the email pipeline. Argue your side."',
        '"What is your real opinion on the B2C CRM positioning? Where does it win? Where does it dilute the focused-email-tool register?"',
        '"Walk me through the most subtle bug you have hit in high-volume event-streaming or deliverability systems."',
        '"Why Klaviyo and not [Braze / Iterable / Mailchimp / a B2C-specific CDP]?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Klaviyo specifically' },
      { type: 'ol', items: [
        'No marketing-platform reasoning. Klaviyo is structurally a marketing platform. Stories that miss event-ingestion / segmentation / deliverability concepts miss the company.',
        'Generic data answers. Klaviyo has specific architecture (the events firehose, the segmentation engine, the Flow + Campaign runtime, the deliverability stack with multi-IP + ISP feedback). Generic answers miss Klaviyo-specific context.',
        'No opinion on the B2C CRM positioning. The B2C CRM rebrand is central to the post-IPO strategy. Coming without an opinion on the trade-off vs the focused email-tool register signals shallow prep.',
        'Tone-deaf on the Shopify-ecosystem dependency. Klaviyo derives a large share of revenue from Shopify-integrated merchants. Stories that ignore this miss the actual operating reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Sign up for a Klaviyo free trial (15 min). Note three friction points + three things you respect. Look at one AI predictive feature.',
        '15-35 min: Stack drill. Events firehose architecture, segmentation engine, Flow + Campaign runtime, deliverability stack (SPF / DKIM / DMARC + IP rotation), Klaviyo AI predictive model serving. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- Black Friday event ingestion, segmentation engine, deliverability infra. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with high-volume + Shopify-ecosystem framing. 200 words each.',
        '70-78 min: Read on Klaviyo vs Braze vs Iterable. Articulate where Klaviyo wins (B2C focus, Shopify ecosystem, deliverability) vs where competitors win.',
        '78-80 min: Close. One opinion on the B2C CRM positioning, one specific Klaviyo decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Klaviyo remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Boston (HQ) + Denver + London + Sydney hubs. Some fully remote senior+ roles. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Strong post-IPO comp. RSU + cash competitive; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including marketing-platform companies like Klaviyo. Free at aimvantage.uk.' },

      { type: 'p', text: 'Klaviyo hires engineers who can reason about high-volume marketing platforms, navigate the B2C CRM positioning, and engage with the Shopify-ecosystem reality honestly. Prep the events + segmentation + deliverability stack, the Klaviyo AI context, and a calibrated take on the post-IPO direction.' },
    ],
  },

  // -------------------------------------------------------------------
  // 3) TOAST SOFTWARE ENGINEER
  // -------------------------------------------------------------------
  {
    slug: 'toast-software-engineer-interview-2026',
    title: 'Toast software engineer interview: the post-Toast Capital + Sous Chef AI 2026 loop',
    description: 'The Toast software engineer interview in 2026 -- five stages, the post-Toast Capital + Sous Chef AI + International + Retail context, real questions, four traps, and an 80-minute prep checklist.',
    publishedAt: '2026-05-10',
    author: 'Gio',
    readingTime: '7 min read',
    tags: ['Toast', 'Software Engineer Interview', 'Restaurant Tech', 'POS', 'Toast Capital', 'Sous Chef AI', 'Interview Prep'],
    excerpt: 'Toast expanded from restaurant POS into payments + payroll + capital + AI (Sous Chef) and pushed into international + retail. The 2026 engineer loop tests for transactional-systems depth + vertical-SaaS register.',
    hook: 'Toast is the restaurant-vertical SaaS that went public and now sells to everyone-who-serves-food. The 2026 interview filters for engineers who can ship at restaurant scale with payment + POS reliability.',
    sections: [
      { type: 'p', text: 'Toast (NYSE: TOST) expanded from restaurant POS + payments into Toast Capital (merchant cash advances), Toast Payroll + Team Management, Toast Marketing (the CRM + loyalty + email surface), Toast Retail (food + bev retail outside restaurants), Toast International (UK launched 2023, expanding), and Sous Chef (the gen-AI assistant + agent for restaurant operators, launched 2024). The 2026 engineering team is hiring across the core POS + payments platform (the iPad-based + Android-based terminal stack + the cloud-side merchant platform), Toast Capital (the lending + underwriting + servicing stack), Payroll + Team Management, Sous Chef + AI (the gen-AI + agent layer), International + Retail, and the developer / integration platform. The 2026 hiring bar is competitive and specific: transactional-systems depth (payments + POS + offline-tolerance), comfort with the regulated-fintech register (Toast Capital is a lender), and a calibrated take on the vertical-SaaS-platform-expansion thesis.' },

      { type: 'h2', text: 'The Toast SWE process -- 5 stages, ~4-5 weeks' },
      { type: 'ol', items: [
        'Recruiter screen -- 30 minutes. Background, why Toast, why this team. They will probe whether you understand the vertical-SaaS-expansion thesis.',
        'Hiring manager interview -- 60 minutes. Past work, scope, the restaurant-vertical register.',
        'Technical screen -- 60 minutes. Live coding (Java + Kotlin for backend; Android Kotlin + Swift for terminals; TypeScript for cloud apps).',
        'System design -- 60 minutes. Real Toast-shaped scenarios. "Design the Toast POS for offline-tolerance during a network outage at a 200-cover restaurant." "Walk me through how Toast Capital underwrites a merchant cash advance using transaction data." "Design Sous Chef -- an AI agent that can read merchant data + suggest operational actions."',
        'Onsite or final loop -- 3-4 rounds: deeper coding, deeper system design, behavioural / values, plus a leadership round.',
      ] },

      { type: 'h2', text: 'The questions that actually come up' },
      { type: 'ul', items: [
        '"Walk me through what happens when a server enters an order on a Toast terminal during a network outage. Trace it from input to eventual cloud reconciliation."',
        '"Design the Toast POS for offline-tolerance during a network outage at a 200-cover restaurant on a Friday night. What\'s the local-first architecture?"',
        '"Walk me through how Toast Capital underwrites a merchant cash advance using the restaurant\'s transaction data. The risk + servicing flow."',
        '"Design Sous Chef. An AI agent that reads merchant data + suggests operational actions (re-order this product, adjust this price, send this email). Walk me through the action-confirmation + trust boundary."',
        '"You inherit a feature that improves order-throughput by 12% but adds a 0.1% missed-payment rate. First three actions?"',
        '"You disagree with a senior engineer on whether to consolidate the Capital data model with the POS event-stream or keep them separate. Argue your side."',
        '"What is your real opinion on the vertical-SaaS-platform-expansion thesis (POS → payments → payroll → capital → AI)? Where does it win? Where does it create execution risk?"',
        '"Walk me through the most subtle bug you have hit in a transactional or payments system."',
        '"Why Toast and not [Square / Lightspeed / Clover / a horizontal POS]?"',
        '"How would you reduce time-to-payout for a Toast Capital merchant cash advance by 30%?"',
      ] },

      { type: 'h2', text: 'What kills candidates at Toast specifically' },
      { type: 'ol', items: [
        'No transactional-systems reasoning. Toast is structurally a payments + POS platform. Stories that miss offline-tolerance / payment-precision / idempotency concepts miss the company.',
        'Generic vertical-SaaS answers. Toast has specific architecture (the iPad + Android terminal stack, the local-first POS, the cloud-side merchant platform, the Toast Capital underwriting model). Generic answers miss Toast-specific context.',
        'No opinion on the platform-expansion thesis. The POS → payments → payroll → capital → AI expansion is central. Coming without an opinion signals shallow prep.',
        'Tone-deaf on the restaurant-operator reality. Toast sells to restaurants -- thin margins, high turnover, operational chaos. Stories framed for the SaaS-buyer register miss the actual end-customer reality.',
      ] },

      { type: 'h2', text: 'The 80-minute prep checklist (the day before)' },
      { type: 'ol', items: [
        '0-15 min: Watch a Toast demo or read about Sous Chef. Read one recent earnings call summary.',
        '15-35 min: Stack drill. POS architecture (local-first + sync), payments fundamentals (auth, capture, settlement, refunds), Toast Capital underwriting + servicing, Sous Chef agent architecture. Two minutes per concept.',
        '35-55 min: System design. Pick one of -- POS offline-tolerance, Capital underwriting, Sous Chef agent. Write a one-page memo.',
        '55-70 min: Story drill. Three behavioural stories with transactional + restaurant-operator framing. 200 words each.',
        '70-78 min: Read on Toast vs Square vs Lightspeed. Articulate where Toast wins (restaurant-focused depth, Capital, Sous Chef) vs where competitors win.',
        '78-80 min: Close. One opinion on the platform-expansion thesis, one specific Toast decision you would change, one question for the hiring manager.',
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'h3', text: 'Is Toast remote in 2026?' },
      { type: 'p', text: 'Hybrid -- Boston (HQ) + Chicago + Omaha + Dublin hubs. Some fully remote senior+ roles. Field engineering roles require in-person at customer sites. Confirm at the recruiter screen.' },
      { type: 'h3', text: 'How is the comp?' },
      { type: 'p', text: 'Top of vertical-SaaS band post-2024 stock recovery. RSU + cash competitive; total comp approaches FAANG mid-band at senior+ depending on stock price.' },
      { type: 'h3', text: 'Will they sponsor a visa?' },
      { type: 'p', text: 'Yes for senior+ roles. Confirm at the recruiter screen.' },

      { type: 'callout', text: 'Vantage runs the company intel + likely questions + a mock drill in 90 seconds for any role, including vertical-SaaS + POS + fintech companies like Toast. Free at aimvantage.uk.' },

      { type: 'p', text: 'Toast hires engineers who can reason about transactional + offline-tolerant systems, navigate the vertical-SaaS-platform-expansion register, and engage with the restaurant-operator reality honestly. Prep the POS + payments stack, the Capital underwriting context, the Sous Chef architecture, and a calibrated take on the AI-in-restaurants trajectory.' },
    ],
  },
];
