/**
 * Programmatic SEO data: company-specific interview prep packs.
 *
 * Each entry powers a /interview-prep/<slug> route that ranks for
 * "[company] interview questions" / "[company] interview prep" / etc.
 *
 * Each pack must have substantively unique content to avoid Google's
 * "scaled content abuse" demotion. Generic question lists get binned —
 * each entry needs at least one real, specific signal about that company.
 */

export interface CompanyPack {
  slug: string;
  company: string;
  /** Brief intro under H1 (~30 words, prose). Mention industry + scale. */
  intro: string;
  /** TL;DR / quick answer for AEO crawlers — 1-2 sentences. */
  tldr: string;
  /** What this company is known for in their interview process. */
  signature: string[];
  /** Likely interview questions specific to this company / domain. */
  questions: string[];
  /** Concrete prep steps for this company. */
  prepSteps: string[];
  /** Common mistakes that bin candidates here. */
  mistakes: string[];
  /** FAQ for FAQPage schema + on-page accordion. */
  faq: { q: string; a: string }[];
  /** ISO date for sitemap lastmod + Article schema. */
  updated: string;
}

export const companyPacks: CompanyPack[] = [
  {
    slug: 'google',
    company: 'Google',
    updated: '2026-04-25',
    intro:
      'Google interviews in 2026 stress-test technical depth, structured thinking, and Googleyness. Five rounds is standard for engineering, four for non-technical. Here is the prep pack.',
    tldr:
      'Google interviews split into coding (3 rounds), system design (1 round if senior), and behavioural / "Googleyness" (1 round). Prep two strong stories, one system design problem you have shipped, and three medium-difficulty algorithm patterns.',
    signature: [
      'Hiring committee model — your interviewers do not decide; a separate committee reads the packet.',
      'Calibration is heavy — the bar is global, not team-specific.',
      'Behavioural rubric scores intellectual humility, ownership, and ability to disagree productively.',
      'Coding interviews use Google Docs, not a real IDE. Practise this.',
    ],
    questions: [
      'Walk me through a recent technical decision you owned. What were the trade-offs?',
      'Implement a function to find the longest substring without repeating characters.',
      'Design a system to count unique daily users at YouTube scale.',
      'Tell me about a time you disagreed with a senior engineer. What happened?',
      'How would you scale a search index that is doubling every quarter?',
      'Walk me through a production incident where you were on the hook.',
      'How do you decide what to build vs what to buy?',
      'Reverse a linked list, then explain time and space complexity.',
      'Tell me about a time you made a decision with incomplete information.',
      'How do you mentor junior engineers without doing their work for them?',
      'Explain consistent hashing. Where would you use it?',
      'Why Google? What part of our recent work do you actually find interesting?',
    ],
    prepSteps: [
      'Run 25 medium LeetCode problems — focus on patterns, not memorisation. Hash maps, sliding window, BFS/DFS, two pointers cover most rounds.',
      'Pick one system you have built end to end. Be ready to draw the architecture in Google Docs (not a whiteboard).',
      'Prepare three behavioural stories: a disagreement, a failure, an ownership moment. Each 90 seconds, no more.',
      'Read three recent Google AI blog posts. Be ready to reference one.',
      'Practise coding in Google Docs the morning of — no IDE help, no autocomplete.',
    ],
    mistakes: [
      'Memorising LeetCode solutions without understanding the pattern. The committee can tell.',
      'Saying "I am a team player" without a specific story. Behavioural rubric needs evidence.',
      'Going silent during coding rounds. Narrate everything — the interviewer is scoring how you think.',
      'Treating Googleyness as a soft round. It is the most-failed round at L4 and above.',
    ],
    faq: [
      {
        q: 'How long does the Google hiring process take?',
        a: 'Six to ten weeks from recruiter screen to offer is standard. Faster if you are a referral, slower if the team has hiring constraints.',
      },
      {
        q: 'Do I need to know algorithms for non-engineering roles?',
        a: 'No, but you need structured analytical thinking. PM and APM rounds use case-style problems, not coding.',
      },
      {
        q: 'Is the Google interview harder than Meta or Amazon?',
        a: 'Different bar, not necessarily harder. Google weights system design and behavioural depth more. Meta weights coding speed. Amazon weights leadership principles.',
      },
    ],
  },

  {
    slug: 'meta',
    company: 'Meta',
    updated: '2026-04-25',
    intro:
      'Meta interviews in 2026 are coding-heavy, fast-paced, and weight raw output highly. Behavioural rounds focus on impact and ambiguity tolerance. Here is the role-specific prep pack.',
    tldr:
      'Meta engineering interviews: 2 coding rounds at LeetCode-medium speed, 1 system design (mid-level+), 1 behavioural focused on impact and dealing with ambiguity. Prep coding speed first, then a sharp 60-second impact story.',
    signature: [
      'Coding rounds expect 2 problems in 45 minutes. Speed matters.',
      'Behavioural questions explicitly probe "moving fast with imperfect information."',
      'System design uses "back of the envelope" before any architecture — quantify first.',
      'Hiring is team-matching after the loop, not before. The loop signals level only.',
    ],
    questions: [
      'Implement a function to merge two sorted linked lists. Optimise for memory.',
      'Design Instagram\'s newsfeed ranking — how would you score posts?',
      'Tell me about a project where you had to ship before the spec was clear.',
      'Find all anagrams of a string in a longer string.',
      'How would you build a notification system at Meta scale?',
      'Describe the highest-impact thing you have shipped in the last 12 months.',
      'How do you handle disagreement with a peer who blocks your PR?',
      'Implement an LRU cache.',
      'Walk me through a time you had to change direction mid-project.',
      'How would you design Facebook Marketplace search?',
      'Tell me about a time you took on something outside your comfort zone.',
      'Why Meta now? What do you want to work on, specifically?',
    ],
    prepSteps: [
      'Solve 2 LeetCode mediums per day for 2 weeks. Focus on speed — under 25 minutes per problem.',
      'For each system design problem, do back-of-the-envelope first: how many users, how many writes, what is the QPS at peak.',
      'Prepare a 60-second impact story with a number in it. "I shipped X which moved Y by Z%." Specific.',
      'Read recent Meta Engineering blog posts. Reference one when asked about technical decisions.',
      'Practise the "ambiguity" behavioural — Meta loves this question.',
    ],
    mistakes: [
      'Going slow on coding. Even correct answers get below-bar at Meta if you take 40+ minutes.',
      'No quantification in the impact story. "I improved performance" is a 2/10. "I reduced p99 latency from 240ms to 95ms across 800M requests/day" is the bar.',
      'Skipping the back-of-the-envelope in system design. Meta interviewers explicitly fail candidates who jump to architecture.',
      'Behavioural answers without a learning. Every story needs "and what I would do differently next time."',
    ],
    faq: [
      {
        q: 'What is the Meta engineering ladder vs Google?',
        a: 'E3-E4 ≈ L3-L4 Google, E5 ≈ L5, E6 ≈ L6, E7 ≈ L7. Compensation is usually higher at Meta at staff+ levels but more variable.',
      },
      {
        q: 'Does Meta still do "Move Fast" culture in 2026?',
        a: 'The phrase has matured but the culture still rewards shipping. Behavioural rubric still includes "operates with limited information."',
      },
      {
        q: 'How does team matching work at Meta?',
        a: 'You pass the loop at a level, then enter the team-match phase. Recruiter introduces you to teams that have headcount at your level. You can decline.',
      },
    ],
  },

  {
    slug: 'amazon',
    company: 'Amazon',
    updated: '2026-04-25',
    intro:
      'Amazon interviews are 70% Leadership Principles, 30% role-specific. The bar raiser round is what trips most candidates. Here is the prep pack.',
    tldr:
      'Amazon interviews lean heavily on the 16 Leadership Principles via STAR-format behavioural stories. Prep one strong story per principle, two coding warm-ups, and rehearse the bar raiser round specifically.',
    signature: [
      'STAR format is non-negotiable. Situation, Task, Action, Result. Recruiters explicitly score for it.',
      'Bar raiser is a separate interviewer not on your team — they have veto power.',
      'Customer Obsession and Ownership are the two most-weighted principles. Prep both deeply.',
      'Hiring decisions are made by written feedback, not group consensus. Your interviewer\'s notes matter more than vibes.',
    ],
    questions: [
      'Tell me about a time you put the customer first when it was inconvenient.',
      'Describe a time you took ownership of something outside your role.',
      'Walk me through a time you disagreed with your manager.',
      'Tell me about a time you failed.',
      'Describe a time you delivered a project under tight constraints.',
      'How would you design Amazon\'s order tracking system?',
      'Tell me about a time you made a decision with insufficient data.',
      'Describe a time you simplified a complex process.',
      'Walk me through a technical decision and the trade-offs.',
      'Tell me about a time you had to deliver bad news.',
      'How do you handle a peer who consistently misses deadlines?',
      'Why Amazon, and which leadership principle resonates most with you?',
    ],
    prepSteps: [
      'Prepare one STAR story per leadership principle (16 stories). Two minutes each maximum.',
      'Pick 5 stories you want to lead with — Customer Obsession, Ownership, Bias for Action, Earn Trust, Deliver Results.',
      'Practise the "tell me about a time you failed" answer — must end with a specific learning, not a deflection.',
      'For technical roles: 2 LeetCode mediums per day for 7 days before the loop.',
      'Read Amazon\'s 2024 Letter to Shareholders before the bar raiser round.',
    ],
    mistakes: [
      'Reusing the same story across multiple principles. The bar raiser asks for a different story and you draw a blank.',
      'Skipping STAR format. "We had a tough quarter and I helped" is an instant 2/10.',
      'Generic answers about "the customer." You need to name the customer, the problem, the specific action.',
      'Going negative on the bar raiser. They are doing their job. Be calm.',
    ],
    faq: [
      {
        q: 'How many leadership principle stories do I need?',
        a: 'Sixteen, one per principle. Realistically you can pass with 8 strong ones if you map them carefully.',
      },
      {
        q: 'What is the bar raiser actually looking for?',
        a: 'Whether you would raise the bar at Amazon — meaning, would your hire move the average up. They ask the toughest behavioural questions.',
      },
      {
        q: 'Does Amazon still ask Leadership Principles for technical roles?',
        a: 'Yes. Even staff engineering loops have 1-2 dedicated behavioural rounds. Coding alone does not get you the offer.',
      },
    ],
  },

  {
    slug: 'stripe',
    company: 'Stripe',
    updated: '2026-04-25',
    intro:
      'Stripe interviews in 2026 are technical, deep, and weighted heavily on systems thinking. Plus a written take-home. Here is the prep pack.',
    tldr:
      'Stripe interviews are 2 coding rounds, 1 system design, 1 bug-bash-style debugging, 1 behavioural, and a written take-home. Prep deep technical fundamentals and one strong written sample.',
    signature: [
      'Strong opinion on writing — every loop has a written component.',
      'Bug-bash round expects you to debug a real Stripe-style integration issue, not algorithmic puzzles.',
      'Behavioural questions probe "writing like an engineer" — concise, structured, specific.',
      'System design favours actual production trade-offs (idempotency, retries, eventual consistency) over interview-puzzle architecture.',
    ],
    questions: [
      'Implement an idempotency layer for a payment API.',
      'Walk me through how you would design a webhook delivery system that survives subscriber outages.',
      'Tell me about a piece of writing you are proud of.',
      'Debug this code (interviewer pastes broken Ruby/JS) — what is wrong?',
      'How would you handle currency conversion for an international payments product?',
      'Describe the most complex production incident you have owned.',
      'Implement a rate limiter that handles bursts and sustained load.',
      'How do you structure a written engineering proposal?',
      'Tell me about a time you had to choose between two technically valid options.',
      'How would you migrate a payment API to a new schema with zero downtime?',
      'What is your process for writing post-mortems?',
      'Why Stripe? What part of payments do you find genuinely interesting?',
    ],
    prepSteps: [
      'Read at least 5 Stripe engineering blog posts. The writing style is the bar.',
      'Practise idempotency, retries, distributed systems fundamentals — Stripe loves these.',
      'Have one writing sample (post-mortem, design doc, technical proposal) you can reference.',
      'For the take-home: write like an engineer. Headings, bulleted trade-offs, conclusion at the top.',
      'Prepare a story about a real production incident with a clean root cause.',
    ],
    mistakes: [
      'Underestimating the written component. Average code + great writing beats great code + average writing at Stripe.',
      'Going long. Stripe interviewers explicitly score concision.',
      'Skipping the engineering blog. They will ask which post you read.',
      'No opinion on technical trade-offs. "It depends" without specifics is a fail.',
    ],
    faq: [
      {
        q: 'How long is the Stripe take-home?',
        a: 'Most are 4-8 hours of focused work. They are clear about scope. Going over does not impress them.',
      },
      {
        q: 'Does Stripe pay above market?',
        a: 'Yes for senior+, very competitive at all levels. Equity has historically been strong on the secondary market.',
      },
      {
        q: 'Is remote work supported at Stripe?',
        a: 'Mostly yes for engineering. Some teams are office-leaning (HQ in San Francisco, hubs in Dublin, Singapore, NYC). Confirm with your recruiter for the specific role.',
      },
    ],
  },

  {
    slug: 'shopify',
    company: 'Shopify',
    updated: '2026-04-25',
    intro:
      'Shopify interviews emphasise async work, written communication, and entrepreneurial mindset. Their "Life Story" interview is unique to them. Here is the pack.',
    tldr:
      'Shopify interviews include the famous "Life Story" round (45-90 mins of personal narrative), plus coding, system design, and a "pair programming" technical round. Prep your story, your craft, and an entrepreneurial example.',
    signature: [
      'Life Story round — 45 to 90 minutes of "tell me your life from earliest memory to now." Yes, really.',
      'Async-first culture — they explicitly score whether you can work without sync meetings.',
      'Pair programming round, not whiteboard. They want to see how you actually code.',
      'Entrepreneurial mindset — every round probes whether you have built something on your own.',
    ],
    questions: [
      'Tell me your life story — from your earliest memory until today.',
      'Pair-program with me on this small feature (45 min, real codebase).',
      'How would you design a multi-tenant database for an e-commerce platform?',
      'Walk me through something you have built outside of work.',
      'Tell me about a time you worked across timezones with limited sync time.',
      'How do you write a good async update?',
      'Implement a function to throttle API calls per user.',
      'Describe a project where you had to learn a new technology mid-project.',
      'How would you architect a recommendation engine for products?',
      'Walk me through a side project, even a tiny one.',
      'Tell me about a time you delivered without managerial oversight.',
      'Why Shopify? Why merchant tools specifically?',
    ],
    prepSteps: [
      'Practise telling your life story — 60 minute version, 90 minute version. Cover formative moments, not a CV recap.',
      'Have a side project to point to. Even tiny. They ask everyone.',
      'Practise pair programming on a real laptop, real IDE — not a whiteboard.',
      'Prepare an example of async work — long-form Slack message, doc, written proposal.',
      'Read the Shopify Engineering blog. Reference one post.',
    ],
    mistakes: [
      'Treating the Life Story as a soft round. It is the round most candidates fail.',
      'No side project. They ask, you have to have something.',
      'Sync-heavy work style. They can tell from your stories.',
      'Generic answers about "loving e-commerce" without naming a merchant or use case.',
    ],
    faq: [
      {
        q: 'What is the Shopify Life Story interview?',
        a: 'A 45-90 minute behavioural where you walk the interviewer through your life from earliest memory. They are looking for self-awareness, growth arcs, and how you talk about people who shaped you.',
      },
      {
        q: 'Is Shopify still fully remote in 2026?',
        a: 'Mostly yes. They are "digital by default" with quarterly in-person team gatherings. Confirm with the recruiter for the specific team.',
      },
      {
        q: 'Do I need Ruby/Rails experience?',
        a: 'Helpful but not required. They hire generalists and expect you to ramp on Rails in your first 90 days.',
      },
    ],
  },

  {
    slug: 'apple',
    company: 'Apple',
    updated: '2026-04-25',
    intro:
      'Apple interviews are team-specific, deeply technical, and craft-obsessed. The hiring bar is set by the team you are interviewing with, not a global rubric.',
    tldr:
      'Apple interviews are team-led, with 4-6 rounds of deep technical depth in your specialty plus one cross-functional round. Prep one craft area to true expert level, plus one example of obsessive attention to detail.',
    signature: [
      'No global rubric — each team sets the bar. Two Apple loops can look completely different.',
      'Craft is weighted heavily. They explicitly score "how do you talk about quality."',
      'Confidentiality matters — they will ask about your discretion.',
      'NDA-heavy environment — most teams cannot tell you what you would actually work on until day one.',
    ],
    questions: [
      'Walk me through your most-technical project. Go three levels deeper than you normally would.',
      'How do you define craft in your work?',
      'Tell me about a detail you obsessed over that no one else noticed.',
      'How do you handle a vague brief where you cannot get clarification?',
      'Implement (deep technical question specific to the team).',
      'Walk me through a system you would not be allowed to talk about — describe the engineering, not the product.',
      'How do you balance pixel-perfect execution with shipping on time?',
      'Tell me about a time you said no to a stakeholder.',
      'How do you handle critical feedback on something you spent months on?',
      'Describe how you keep up with deep technical changes in your field.',
      'How do you mentor someone who is over-engineering?',
      'Why Apple? What product would you want to work on, and why?',
    ],
    prepSteps: [
      'Pick one technical specialty and prep to expert level. Apple does not reward broad shallow knowledge.',
      'Prepare one story about obsessive attention to detail — must be specific, with the detail named.',
      'Re-read your CV — be ready to go three levels deeper on any line.',
      'Avoid mentioning unreleased Apple speculation. They will think you talk too much.',
      'Prepare the "vague brief" answer — Apple loves ambiguity questions.',
    ],
    mistakes: [
      'Going broad instead of deep. Apple wants depth.',
      'Speculating about unannounced products. Instant negative signal.',
      'Casual attitude to confidentiality. Even joking about it costs you.',
      'No example of craft-obsession. They will dig until they find one or rule you out.',
    ],
    faq: [
      {
        q: 'Does Apple still pay below market?',
        a: 'Apple stock has compounded. Total comp is competitive at senior+, slightly under FAANG peers at junior-mid. Equity refresh is the lever.',
      },
      {
        q: 'How does Apple handle remote work?',
        a: 'Mostly hybrid (3 days in office), strong push back to in-office in 2024-2026. Remote roles exist but rare and team-specific.',
      },
      {
        q: 'Does Apple use Leetcode-style coding interviews?',
        a: 'Some teams yes, some teams no. Most teams now do real-codebase or system design over puzzle algorithms. Confirm with the recruiter.',
      },
    ],
  },

  {
    slug: 'netflix',
    company: 'Netflix',
    updated: '2026-04-25',
    intro:
      'Netflix interviews focus on senior-level autonomy, judgment under ambiguity, and "stunning colleague" cultural fit. Junior roles do not exist here.',
    tldr:
      'Netflix interviews are 5-7 rounds covering technical depth, written judgment, and the famous keeper test. Prep one production decision you owned end to end and one example of high-quality autonomous work.',
    signature: [
      'No junior roles. Even "junior" titles expect 4+ years experience.',
      'Keeper test is real — the question "would I fight to keep this person?" is asked at every loop.',
      'Written component is heavy. Many loops include a long-form take-home.',
      'No formal performance reviews. Trust and autonomy is the model — interview probes whether you can operate that way.',
    ],
    questions: [
      'Walk me through a major production decision you made without your manager\'s sign-off.',
      'How would you architect Netflix\'s personalisation pipeline?',
      'Tell me about the highest-quality piece of work you have shipped in the last 18 months.',
      'How do you decide what is good enough to ship?',
      'Describe a time you delivered a hard message to a senior peer.',
      'Walk me through a technical trade-off where you chose a non-obvious option.',
      'How do you operate without a defined scope?',
      'Tell me about a time you turned down a project.',
      'How do you handle a peer who is underperforming?',
      'Walk me through how you would design a video recommendation system at Netflix scale.',
      'How do you keep your skills current without a formal training budget?',
      'Why Netflix? What part of the culture deck do you actually believe?',
    ],
    prepSteps: [
      'Read the latest Netflix Culture Deck. They will reference it.',
      'Prepare one autonomous decision story — no manager sign-off, owned outcome end to end.',
      'Have a sample of long-form writing you can share or reference.',
      'Be ready to talk pay candidly. Netflix pays top-of-market and expects you to know that.',
      'Prepare a concise "what I would not do" answer for the prioritisation question.',
    ],
    mistakes: [
      'Pretending to love every Netflix culture point. Disagreement is respected; insincerity is not.',
      'Wanting a structured environment. They explicitly hire for "operates without a manual."',
      'Junior framing. Even the language "I would ask my manager what to do" is a red flag.',
      'Memorised culture-deck answers. They can tell.',
    ],
    faq: [
      {
        q: 'How much does Netflix pay vs FAANG peers?',
        a: 'Top of market on cash. Less equity-heavy. Total comp is roughly comparable but the cash component is higher.',
      },
      {
        q: 'Is the Netflix keeper test still a thing?',
        a: 'Yes, formally. Managers are asked quarterly: "if X resigned today, would I fight to keep them?" If no, severance is offered.',
      },
      {
        q: 'Does Netflix have engineering ladders?',
        a: 'Less formal than FAANG peers. Levels exist but the culture treats every senior IC as roughly equivalent — autonomy and outcome matter more than title.',
      },
    ],
  },

  {
    slug: 'airbnb',
    company: 'Airbnb',
    updated: '2026-04-25',
    intro:
      'Airbnb interviews emphasise design sensibility (even for engineers), "host empathy", and structured technical depth. Their core values rounds are unusually weighty.',
    tldr:
      'Airbnb interviews are 4-6 rounds with one full round on core values + host/guest empathy. Prep coding, system design, behavioural, plus one strong example of caring about end-user experience.',
    signature: [
      '"Champion the Mission" core value rounds are scored strictly — you need to show genuine engagement with the platform.',
      'Design sensibility expected even from engineers. They will ask what you would change in the product.',
      'Host/guest empathy round — they want you to have actually used the product as both.',
      'Cross-functional collaboration is weighted heavily — pure-IC stories do not impress.',
    ],
    questions: [
      'Have you stayed at an Airbnb? What was the experience like?',
      'Tell me about a time you championed a product decision against the easier path.',
      'How would you redesign Airbnb\'s search experience?',
      'Walk me through a cross-functional project where you partnered with design and PM.',
      'Implement a function to find available booking slots given a list of reservations.',
      'How would you architect Airbnb\'s pricing recommendation system?',
      'Tell me about a time you had to balance host and guest interests.',
      'Describe the highest-empathy customer-facing decision you have made.',
      'How would you handle a critical bug affecting hosts during peak season?',
      'Walk me through how you would build a fraud detection system for bookings.',
      'How do you handle disagreement with a designer on UX trade-offs?',
      'Why Airbnb? What about the mission resonates with you specifically?',
    ],
    prepSteps: [
      'Have an actual Airbnb experience to talk about. If you have not used it, book a stay before the loop.',
      'Spend 30 minutes using the app the day before — note 3 things you would change.',
      'Prepare a story about championing a customer-facing decision.',
      'For engineering: prep system design with a strong empathy framing — not just architecture but who is affected.',
      'Read at least one recent Airbnb engineering blog post.',
    ],
    mistakes: [
      'Never having used Airbnb. Instant red flag.',
      'Engineering-only stories with no cross-functional context. Airbnb explicitly hires for collaboration.',
      'Generic answers about "the user." You must name host vs guest.',
      'Skipping the design sensibility round prep. They probe taste.',
    ],
    faq: [
      {
        q: 'How long are Airbnb interview loops?',
        a: 'Five to six rounds, typically over 2-3 weeks. Recruiter screen plus one onsite (virtual or in-person depending on team).',
      },
      {
        q: 'Does Airbnb still do remote-first?',
        a: 'They went remote-first in 2022. Some teams have hubs in San Francisco, Dublin, Singapore. Most engineering is remote with quarterly meetups.',
      },
      {
        q: 'What is the "champion the mission" round actually testing?',
        a: 'Whether you have engaged with the product as a real user, whether you can articulate what trade-offs they make, and whether you would advocate for the platform mission internally.',
      },
    ],
  },

  {
    slug: 'mckinsey',
    company: 'McKinsey',
    updated: '2026-04-25',
    intro:
      'McKinsey interviews are case-driven and structured. Two rounds of cases (3-4 cases each), plus a personal experience interview. Here is the prep pack.',
    tldr:
      'McKinsey interviews are 2 rounds of structured case interviews (3-4 cases per round) plus a Personal Experience Interview. Prep frameworks, mental math, and three specific PEI stories.',
    signature: [
      'Cases use the McKinsey-specific "MECE" structure — Mutually Exclusive, Collectively Exhaustive.',
      'Personal Experience Interview (PEI) — one for each of three dimensions: leadership, achievement, problem-solving.',
      'Mental math is non-negotiable. They will throw numbers at you and watch how you handle them.',
      'Up-or-out culture starts with the offer. Performance bar is high from day one.',
    ],
    questions: [
      'A grocery client is losing market share. What is happening, and what do they do?',
      'How many tennis balls fit in a 747?',
      'A pharmaceutical client wants to enter a new market. Walk me through your approach.',
      'Tell me about a time you led a team through a difficult challenge.',
      'A SaaS company\'s churn doubled this quarter. Diagnose.',
      'Walk me through a time you achieved something that others said could not be done.',
      'How would you size the global market for electric scooters?',
      'A bank wants to launch a digital-only product. Should they?',
      'Describe a problem where the answer was not obvious. How did you get to it?',
      'A retail client\'s margin is collapsing. What do you investigate first?',
      'How do you handle disagreement with a senior partner during a case?',
      'Why McKinsey, and which practice area do you want to be in?',
    ],
    prepSteps: [
      'Run 30+ practice cases out loud with a partner. Speed and structure matter equally.',
      'Drill mental math for 15 minutes daily — multiplication, division, percentages, market sizing.',
      'Prepare three PEI stories — one each for leadership, achievement, problem-solving. Each 4-7 minutes.',
      'Read the McKinsey Insights articles in your target practice. Reference one in the case round.',
      'Practise the "structure" first — say your framework out loud, get buy-in, then execute.',
    ],
    mistakes: [
      'Rushing into the case before structuring. Interviewers explicitly score for stating the framework first.',
      'Mental math errors that compound. Even small ones cost you.',
      'PEI stories without specific numbers or outcomes. "We solved it" without quantification fails.',
      'Generic case approaches. McKinsey expects cases tailored to the industry.',
    ],
    faq: [
      {
        q: 'How long does the McKinsey hiring process take?',
        a: 'Six to ten weeks from application to offer. First round in 1-2 weeks of screening, second round 2-3 weeks later, decisions within 1 week.',
      },
      {
        q: 'Do I need an MBA for McKinsey?',
        a: 'Not for analyst/associate. MBAs typically come in at engagement manager level. Both paths exist.',
      },
      {
        q: 'What is the up-or-out timeline?',
        a: 'Roughly 2-3 years per level. Promotion expectations are explicit; if you are not progressing, you are coached out.',
      },
    ],
  },

  {
    slug: 'goldman-sachs',
    company: 'Goldman Sachs',
    updated: '2026-04-25',
    intro:
      'Goldman Sachs interviews are technical, tradition-heavy, and culture-fit-weighted. Different divisions have wildly different processes. Here is the cross-divisional pack.',
    tldr:
      'Goldman interviews vary by division (IBD, S&T, AM, Eng) but share a focus on technical knowledge, market awareness, and culture fit. Prep division-specific knowledge, current market moves, and a clear story for "why Goldman."',
    signature: [
      '14 Business Principles — they will quote them at you. Memorise the first three.',
      'Market awareness expected. "Did you read the FT this morning?" is a real opener.',
      'Technical questions are division-specific — IBD does DCF and LBO, S&T does options Greeks, Eng does coding.',
      'Culture fit is gated by 1-2 senior partner rounds — they have veto power.',
    ],
    questions: [
      'Walk me through a DCF.',
      'What did you read in the FT this morning that mattered?',
      'How would you value [a real public company they pick]?',
      'Walk me through your CV in 90 seconds.',
      'Why Goldman over [direct competitor]?',
      'Tell me about a time you worked under pressure.',
      'Pitch me a stock you would buy today.',
      'Explain options Greeks (S&T) or LBO mechanics (IBD).',
      'How would you design a low-latency order book? (Eng)',
      'Describe a trade you would put on right now and why.',
      'Tell me about a leadership experience.',
      'Why investment banking, and why this division specifically?',
    ],
    prepSteps: [
      'Read the FT, Bloomberg, Wall Street Journal daily for 4 weeks pre-interview. Track 3 trades you would put on.',
      'Memorise the first 3 Goldman Business Principles.',
      'For IBD: prep DCF, LBO, comps, M&A precedent. For S&T: prep Greeks, fixed income, FX.',
      'Have a "stock pitch" ready with 3 reasons and 1 risk. Defend it.',
      'Research the division leadership — name 1-2 partners on LinkedIn.',
    ],
    mistakes: [
      'Not reading the FT. Single biggest reason candidates get rejected.',
      'Generic "I want to learn" answers for "why Goldman." They want a real reason.',
      'Stock pitch without a specific catalyst or timeline.',
      'Sloppy on technicals. There are no second chances on a DCF question.',
    ],
    faq: [
      {
        q: 'How early should I start prepping for Goldman?',
        a: 'Six months for IBD/S&T if you are not from a target school. Three months minimum for any division.',
      },
      {
        q: 'Does Goldman still have target schools?',
        a: 'Less rigid than 10 years ago but yes for IBD. Engineering and asset management are more open.',
      },
      {
        q: 'What is the pay progression at Goldman?',
        a: 'Analyst (~$100-130k base + bonus) → Associate (~$175-200k) → VP (~$250-300k) → MD (variable, $500k+ base, much more in bonus).',
      },
    ],
  },

  {
    slug: 'microsoft',
    company: 'Microsoft',
    updated: '2026-05-01',
    intro:
      'Microsoft interviews in 2026 are organised by org (Cloud + AI, Office, Azure, Gaming, Research). Five rounds is standard for engineering, with one round explicitly assessing "growth mindset." Here is the prep pack.',
    tldr:
      'Microsoft engineering loops: 4 technical (2 coding, 1 system design at mid-level+, 1 deep technical on a previous project) plus 1 behavioural anchored on the "growth mindset" rubric. Prep medium-difficulty coding speed, one ship-to-prod story you can defend in detail, and the three growth-mindset signals (learn-it-all, customer obsession, partner & team).',
    signature: [
      'Five-round loop with explicit growth-mindset evaluation in the as-appropriate "AsAppropriate" round.',
      'Coding interviews use a shared editor (Codility-style) with a real compile + run loop.',
      'Deep-dive technical: an interviewer reads a project from your CV and grills you for 45 minutes on technical decisions.',
      'Hiring is to a team, not to a level. The loop signals fit; the team-match conversation seals it.',
    ],
    questions: [
      'Walk me through a system you shipped that you would now redesign. What changed?',
      'Implement a function to find the kth largest element in a stream. Optimise for memory.',
      'Design a real-time collaborative editor like the one in Office Online.',
      'Tell me about a time a customer told you something you didn\'t want to hear. What did you do?',
      'How would you scale Azure Functions cold-start to under 50ms?',
      'Describe a technical decision you got wrong. How did you find out?',
      'Why Microsoft? What product do you actually use?',
      'Implement an LRU cache. Then add TTL.',
      'Tell me about a time you partnered with another team to ship something.',
      'How do you decide between buy / build / open-source for a new dependency?',
      'Walk me through a debugging session that took longer than expected.',
      'What does "growth mindset" mean to you in technical work?',
    ],
    prepSteps: [
      'Run 30 medium LeetCode problems — Microsoft tags lean toward strings, trees, dynamic programming.',
      'Pick one shipped project. Be ready to defend every technical decision for 45 minutes — assume the interviewer has read your CV.',
      'Prepare three behavioural stories framed around growth mindset: a learning moment, a customer-obsession moment, a partnership moment.',
      'Read two recent Microsoft Research blog posts. Be ready to reference one.',
      'Practise in a shared online editor (Codility, HackerRank) — no IDE help.',
    ],
    mistakes: [
      'Treating the deep-dive technical as a casual chat. Interviewers prepare specific gotchas from your CV.',
      'Saying "I learned X" without a specific decision the learning changed. Growth mindset needs evidence.',
      'Skipping system design prep at SDE-2 level and above. The bar is real.',
      'Mismatching the team-fit conversation. Research the org you\'re interviewing into and reference its actual focus.',
    ],
    faq: [
      {
        q: 'How long does the Microsoft hiring process take?',
        a: 'Five to eight weeks from recruiter screen to offer is standard. Team-match after the loop adds 1-3 weeks depending on role availability.',
      },
      {
        q: 'Is Microsoft easier or harder than Google?',
        a: 'Comparable bar, different shape. Microsoft leans more on past-project depth via the deep-dive round; Google leans more on system design and behavioural calibration.',
      },
      {
        q: 'Do non-engineering roles (PM, sales) follow the same loop?',
        a: 'No. PMs do 4 rounds: 2 product / case interviews, 1 technical depth (lighter than SDE), 1 behavioural. Sales is 3-5 rounds heavy on customer scenarios.',
      },
    ],
  },

  {
    slug: 'openai',
    company: 'OpenAI',
    updated: '2026-05-01',
    intro:
      'OpenAI interviews in 2026 emphasise depth in machine learning, distributed systems, and high-context judgement. Loops vary by team but a 5-round loop is typical. Here is the prep pack.',
    tldr:
      'OpenAI engineering loops weight ML / training infrastructure heavily for research roles, distributed systems heavily for product engineering, and one strong "what would you build / deprecate at OpenAI?" judgement round across all roles. Prep depth in your domain, not breadth across all of CS.',
    signature: [
      'Domain-specific depth: research-engineering loops have ML eval rounds; product-engineering loops have distributed-systems-at-scale rounds.',
      'Take-home assignments are common at the screening stage and well-paid (OpenAI compensates for take-homes).',
      'Mission-fit is genuinely scored. "What is OpenAI\'s mission and where do you disagree with it?" is a real question.',
      'Compensation tilts heavily toward equity (PPUs). Understand the mechanics before negotiating.',
    ],
    questions: [
      'Walk me through how you would debug a model that suddenly started outputting garbage on production.',
      'Design the request routing for a multi-region inference service.',
      'Implement KV-cache management for a transformer at inference time. What goes wrong at scale?',
      'OpenAI\'s mission — restate it in your own words. Where do you disagree?',
      'Tell me about a time you shipped something with a meaningful safety implication.',
      'How would you build the eval set for a new safety classifier?',
      'Walk me through a decision where you had to choose between speed and correctness.',
      'What would you deprecate in OpenAI\'s product line if you could?',
      'How do you reason about emergent behaviour in large models?',
      'Implement a tokenizer in 30 minutes. What edge cases do you handle first?',
      'Why OpenAI vs Anthropic vs DeepMind?',
      'Describe a time you worked on something where the outcome was genuinely uncertain.',
    ],
    prepSteps: [
      'Read OpenAI\'s most recent technical blog posts — the past 90 days. Be specific about which research line you find most interesting and why.',
      'Pick one ML-adjacent or distributed-systems project you shipped. Be ready to defend every choice including model size, training mix, deployment topology.',
      'Prepare a mission-fit answer that includes one specific disagreement framed constructively. Generic agreement scores low.',
      'Practise on take-home problems with a 4-hour timer. OpenAI take-homes typically expect production-quality code, not prototype.',
      'Brush up on inference-side optimisations (KV cache, batching, speculative decoding) if interviewing on the inference team.',
    ],
    mistakes: [
      'Reciting OpenAI\'s mission verbatim without engaging with it. The judgement round wants real opinions.',
      'Underestimating the take-home — OpenAI pays for serious engineering work and expects it.',
      'Trying to fake ML knowledge. Interviewers can tell within 5 minutes. Be specific about what you do and don\'t know.',
      'Negotiating compensation without understanding PPU mechanics — anchoring against TC numbers from levels.fyi without context is a red flag.',
    ],
    faq: [
      {
        q: 'How long does the OpenAI hiring process take?',
        a: 'Six to twelve weeks. Slower than most companies — the take-home stage and team-match add real time.',
      },
      {
        q: 'Do I need a PhD to interview at OpenAI?',
        a: 'For research roles typically yes. For research-engineering, a strong ML systems track record can substitute. For product-engineering, no.',
      },
      {
        q: 'Is the technical bar at OpenAI higher than at Google or Meta?',
        a: 'In domain depth, often yes. In coding speed, similar. The loop weights deep judgement and ML / systems intuition more than algorithmic puzzles.',
      },
    ],
  },

  {
    slug: 'anthropic',
    company: 'Anthropic',
    updated: '2026-05-01',
    intro:
      'Anthropic interviews in 2026 prioritise mission-fit, technical depth, and the ability to reason carefully about consequences. Loops are typically 5 rounds with paid take-homes common. Here is the prep pack.',
    tldr:
      'Anthropic engineering loops include 1 paid take-home, 2 technical rounds (coding + ML / systems for research-engineering), 1 behavioural deeply focused on "responsible scaling" judgement, and 1 team-fit. Prep depth in your domain, mission alignment with safety / alignment work, and explicit reasoning about consequences.',
    signature: [
      'Paid take-homes at the screening stage. Anthropic explicitly compensates for these — average $1k-$2k per take-home.',
      'Behavioural interview probes for "constitutional AI" thinking — how you weigh harms vs benefits in real decisions.',
      'Coding interviews use a real IDE (or your IDE of choice). Less Google-Docs-vibe than other companies.',
      'Compensation is competitive but the equity is illiquid. Long-term thinking expected.',
    ],
    questions: [
      'Tell me about a time you noticed something would go wrong before anyone else did. What did you do?',
      'Implement a function to score the "harmfulness" of a model output. What edge cases do you handle?',
      'Walk me through Anthropic\'s Responsible Scaling Policy. Where would you push back?',
      'Design an A/B test for a safety classifier when the negative class is extremely rare.',
      'Tell me about a technical decision you made that had downstream safety implications.',
      'How would you build evals for a new "agentic" model capability?',
      'Why Anthropic vs OpenAI? Be specific.',
      'Describe a project where you had to reason about adversarial users.',
      'Implement gradient accumulation in PyTorch. When does it break?',
      'What does "honesty" mean to you in the context of building AI systems?',
      'Walk me through a time you said no to a leadership ask.',
      'How do you stay calibrated about your own uncertainty?',
    ],
    prepSteps: [
      'Read Anthropic\'s recent research papers (Claude, alignment, interpretability) — the past 6 months. Form opinions.',
      'Read Anthropic\'s Responsible Scaling Policy end-to-end. Have specific things you agree and disagree with.',
      'Pick one shipped project where you had to reason about safety / harm / adversarial use. Sharpen the story.',
      'Practise the take-home in a real environment. Production-quality code. Anthropic take-homes are typically eval design or systems work, not LeetCode.',
      'Prepare 3 stories around responsible decision-making — choosing not to ship something, pushing back on a deadline for safety reasons, etc.',
    ],
    mistakes: [
      'Generic agreement with the mission. Interviewers want substantive engagement, not flattery.',
      'Treating the take-home as a screening hurdle. They\'re evaluated as the second-most-important signal in the loop.',
      'Skipping interpretability / mech interp prep if interviewing on relevant teams. Read the recent papers.',
      'Mismatching tone — Anthropic interviewers are more reserved than OpenAI\'s. Confidence reads as honest precision, not bravado.',
    ],
    faq: [
      {
        q: 'How long does the Anthropic hiring process take?',
        a: 'Six to ten weeks typically. The paid take-home stage adds real time; the team-fit conversation can move fast or slow depending on team availability.',
      },
      {
        q: 'Is Anthropic harder to interview at than OpenAI?',
        a: 'Comparable bar, different shape. Anthropic weights judgement around safety / consequences more; OpenAI weights raw research-engineering depth more. Both are competitive.',
      },
      {
        q: 'Do I need ML background for non-research engineering roles?',
        a: 'For some teams (Inference, Tools), strong distributed systems background substitutes for ML depth. For Alignment Science / Interpretability roles, ML / research background is required.',
      },
    ],
  },

  {
    slug: 'tesla',
    company: 'Tesla',
    updated: '2026-05-01',
    intro:
      'Tesla interviews in 2026 are fast, technical, and high-pressure. Hiring decisions are made by hiring managers without the committee model used at FAANG. Here is the prep pack.',
    tldr:
      'Tesla engineering loops are 3-5 rounds, fast-moving, with hiring-manager final say. Coding depth + raw work-rate + ability to reason about hardware-software interfaces (not just web stack) wins. Behavioural rounds explicitly probe "first-principles thinking" and intolerance for bureaucratic friction.',
    signature: [
      'Hiring-manager-decides model — no calibration committee. Build rapport with the manager.',
      'Pace is faster than FAANG — interviews start sooner, decisions move faster, sometimes in days.',
      'Hardware-software interface knowledge is a differentiator (firmware, embedded, real-time systems).',
      'Compensation is heavily equity-weighted; understand the lockup mechanics before negotiating.',
    ],
    questions: [
      'Walk me through a problem you solved by going back to first principles.',
      'Implement a function to detect anomalies in a sensor stream in real-time.',
      'Design a system to coordinate fleet-wide software updates across 5 million vehicles.',
      'Tell me about a time you ignored conventional wisdom and shipped anyway.',
      'How would you debug a bug that only reproduces under specific physical conditions?',
      'Describe a project where you cut scope aggressively. What did you cut and why?',
      'Walk me through a memory-constrained problem you optimised.',
      'Why Tesla vs a more comfortable company?',
      'Implement a state machine for a multi-stage charging protocol.',
      'Tell me about a leadership decision you disagreed with publicly.',
      'How do you balance shipping fast with safety-critical correctness?',
      'What\'s your view on Tesla\'s autonomy strategy?',
    ],
    prepSteps: [
      'Read 3-5 recent Tesla AI / engineering posts and Andrej Karpathy\'s public talks if interviewing on Autonomy.',
      'Pick one project you shipped under unusual constraints (small team, short deadline, hardware constraints). Sharpen the story.',
      'Prepare a "first-principles" story: a time you ignored standard advice based on the actual physics or math of the problem.',
      'Practise coding in C / C++ if interviewing for firmware, embedded, or real-time roles. Web-stack-only candidates struggle.',
      'Prepare a thoughtful answer to "Why Tesla?" that doesn\'t reference Elon Musk. Reference the actual engineering ambition.',
    ],
    mistakes: [
      'Treating Tesla like a FAANG. The committee doesn\'t exist; the manager\'s opinion is what matters.',
      'Pretending to agree with everything about the company. Tesla hires people who push back substantively.',
      'Missing the hardware-software dimension if interviewing on autonomy or vehicle software roles.',
      'Negotiating like FAANG. Tesla\'s offer process is more flexible but less data-rich. Anchor on what you know is fair, not on levels.fyi.',
    ],
    faq: [
      {
        q: 'How long does the Tesla hiring process take?',
        a: 'Three to six weeks. Faster than FAANG. Some teams move offer in 1-2 weeks for senior candidates.',
      },
      {
        q: 'Is Tesla harder than Google?',
        a: 'Different bar. Tesla\'s technical depth requirement is comparable; the work-rate and pressure expectations are higher.',
      },
      {
        q: 'Should I worry about layoffs at Tesla?',
        a: 'Tesla has done multiple rounds of layoffs in the last 3 years. Understand the financial environment when weighing the offer. Your manager\'s area\'s funding is the signal that matters.',
      },
    ],
  },

  {
    slug: 'uber',
    company: 'Uber',
    updated: '2026-05-01',
    intro:
      'Uber interviews in 2026 stress operational thinking, scale-at-pace, and "playbook" depth. The loop varies by org (Rider, Driver, Eats, Freight, ATG) but follows similar patterns. Here is the prep pack.',
    tldr:
      'Uber engineering loops: 4-5 rounds with 2 coding (LeetCode-medium pace), 1 system design (mid+), 1 behavioural anchored on "We are owners" / "Doers get more done", 1 hiring-manager fit. Operations roles flip the mix: 2 case interviews + 1 playbook walkthrough + 1 leadership behavioural.',
    signature: [
      'Strong "owner" / "doer" rubric in behavioural rounds — they want evidence you ship, not pontificate.',
      'System design questions usually riff on actual Uber problems (surge pricing, ETA, dispatch) — knowing the public Uber engineering blog posts is a real edge.',
      'Operations / Strategy & Planning roles use a structured case interview format more like consulting than tech.',
      'Compensation negotiable; equity tilted heavier than base for senior IC roles.',
    ],
    questions: [
      'Walk me through how you would build the matching algorithm for Uber Eats restaurant-to-courier dispatch.',
      'Tell me about a time you owned a system end-to-end including the operational follow-through.',
      'Implement a function to compute the shortest path through a road graph with real-time congestion data.',
      'Walk me through a metric that improved by 10x. What did you change?',
      'How would you design surge pricing for a new market with no historical data?',
      'Tell me about a time you cut scope to ship on time.',
      'Implement a rate limiter for an API serving 500K req/sec at peak.',
      'Walk me through a partnership decision you owned (build vs partner).',
      'How do you debug a production issue affecting only one geographic region?',
      'Why Uber? Which of the four marketplaces do you actually use?',
      'Tell me about a time you disagreed with a senior leader on direction.',
      'How would you reduce ETA error in a dense urban environment?',
    ],
    prepSteps: [
      'Read 3-5 recent Uber Engineering blog posts. Reference one specifically in your loop.',
      'Pick one project where you owned operations as well as tech. Sharpen the story around outcomes, not effort.',
      'Practise system design with marketplace-style questions (matching, pricing, dispatch).',
      'For Strategy / Operations roles: practice 4-5 case interview prompts (estimation, market sizing, prioritisation).',
      'Brush up on geo-spatial concepts (H3 hexagons, geohashing) if interviewing on the maps / dispatch teams.',
    ],
    mistakes: [
      'Over-indexing on tech depth in behavioural rounds. They explicitly weight "owner" outcomes.',
      'Not knowing the public Uber engineering content. Multiple interviewers will reference it.',
      'Treating Strategy / Operations interviews like tech interviews. Different rubric, different prep.',
      'Underestimating equity in negotiation. Uber\'s base is competitive but the senior equity is where the meaningful comp lives.',
    ],
    faq: [
      {
        q: 'How long does the Uber hiring process take?',
        a: 'Four to eight weeks from recruiter screen to offer is standard. Faster for engineering, slower for cross-org leadership.',
      },
      {
        q: 'Are technical interviews the same across Rider / Driver / Eats / Freight?',
        a: 'Similar coding rounds, but system design differs — Eats interviews tilt toward marketplace + recommendation; Freight tilts toward logistics; Rider/Driver tilt toward dispatch + matching. Match your prep to the org you\'re interviewing into.',
      },
      {
        q: 'Should I worry about layoffs at Uber?',
        a: 'Uber has done multiple cost-discipline waves since 2022, including engineering reductions in non-core areas. Understand the team\'s strategic position before joining.',
      },
    ],
  },

  {
    slug: 'doordash',
    company: 'DoorDash',
    updated: '2026-05-01',
    intro:
      'DoorDash interviews in 2026 emphasise operational rigour, marketplace intuition, and ability to ship under pressure. Loops are 4-5 rounds. Here is the prep pack.',
    tldr:
      'DoorDash engineering loops: 2 coding (LeetCode-medium pace), 1 system design with marketplace flavour (matching / dispatch / pricing), 1 behavioural anchored on "We are 1% better every day" + "Customer obsession", 1 hiring-manager fit. Operations roles flip the mix to 2 case interviews + 1 SQL test + 1 leadership behavioural.',
    signature: [
      'SQL screen is real for both engineering and operations roles. Skipping SQL prep is a common mistake.',
      'Strong "customer obsession" rubric — interviewers explicitly probe how candidates think about Dashers, customers, and merchants as three separate user groups.',
      'System design weights operational concerns (Dasher dispatch, restaurant ETA, refund automation) over abstract scale.',
      'Hiring manager round has real weight; the manager\'s opinion can flip a borderline loop.',
    ],
    questions: [
      'Write SQL to find the top 10 restaurants by repeat-customer rate over the last 90 days.',
      'Walk me through how you would design the Dasher batching system for dense urban orders.',
      'Implement a rate limiter that handles per-Dasher and per-restaurant caps.',
      'Tell me about a time you balanced three user groups with conflicting needs.',
      'How would you reduce the refund rate without making customers feel cheated?',
      'Implement a function to merge multiple Dasher GPS streams into a deduplicated event log.',
      'Walk me through a decision you made with incomplete data.',
      'How do you debug an ETA model that\'s drifting in one specific zip code?',
      'Tell me about a time you had to make a customer-success call that hurt a metric.',
      'Why DoorDash vs Uber Eats?',
      'Implement a backoff strategy for retrying failed delivery callbacks.',
      'What\'s your view on dark stores / restaurants?',
    ],
    prepSteps: [
      'Brush up on SQL — joins, window functions, CTEs. The screen will test these even for senior IC roles.',
      'Read DoorDash\'s engineering blog. Specifically the posts on dispatch, ETA prediction, and the tech stack overview.',
      'Pick a marketplace problem you\'ve worked on. Sharpen the story to hit all three user groups (where applicable).',
      'For Operations / Strategy: practice 3-5 cases on marketplace economics (unit economics, expansion strategy).',
      'Practice the "Why DoorDash" answer specifically. Differentiated answers from candidates who use the product win this one.',
    ],
    mistakes: [
      'Skipping SQL prep — it\'s screened harder than at most tech companies.',
      'Treating the customer-obsession rubric as a soft skill. They want specific examples.',
      'Not knowing the three user groups (Dasher / customer / merchant). The framework is core to product thinking at DoorDash.',
      'Underestimating the hiring manager round. They have real weight.',
    ],
    faq: [
      {
        q: 'How long does the DoorDash hiring process take?',
        a: 'Three to seven weeks. Faster than Google or Microsoft. The SQL screen + hiring-manager fit are the steps that vary most.',
      },
      {
        q: 'Is DoorDash easier than Uber to interview at?',
        a: 'Different bar. DoorDash leans more on SQL fluency and customer-obsession evidence. Uber leans more on system design at scale.',
      },
      {
        q: 'Do all engineering roles take the SQL screen?',
        a: 'Yes for ICs at most levels, even backend / platform / infra. Senior leadership may skip it. SQL has been the surprising filter for many candidates.',
      },
    ],
  },

  {
    slug: 'spotify',
    company: 'Spotify',
    updated: '2026-05-01',
    intro:
      'Spotify interviews in 2026 weight technical depth, music-product intuition, and "Squad" cultural fit. Loops are typically 4-5 rounds. Here is the prep pack.',
    tldr:
      'Spotify engineering loops: 1 take-home (paid for senior roles), 2 technical rounds (coding + system design with audio / streaming flavour), 1 cross-functional collaboration round, 1 hiring-manager fit. Spotify\'s "Squad" model means hiring is to a team with real autonomy; the team-fit conversation matters more than at calibrated FAANG.',
    signature: [
      'Take-home assignments at senior IC level. Paid; expected to take 4-8 hours.',
      '"Squad" model — interviews assess team-fit more than universal-bar fit.',
      'System design questions tilt toward streaming, recommendation, audio processing — domain context helps.',
      'Cross-functional collaboration round is unusually weighted (vs other tech companies). They want product / design / data partnership evidence.',
    ],
    questions: [
      'Walk me through how you would design the recommendation pipeline for Daily Mixes.',
      'Implement an LRU cache with size and TTL constraints, suitable for an audio CDN.',
      'Tell me about a time you partnered with a designer to ship something unusual.',
      'How would you A/B test a change to the Discover Weekly algorithm?',
      'Implement a function to detect duplicate tracks in a user library across different masters.',
      'Walk me through a decision where you balanced data + qualitative product judgement.',
      'How do you reduce buffering on slow connections without compromising audio quality?',
      'Tell me about a time you owned a Squad-level decision that affected another team.',
      'Implement a music similarity scorer based on metadata (genre, BPM, key, year).',
      'Why Spotify vs Apple Music vs YouTube Music?',
      'Walk me through a system design problem on streaming scale.',
      'How do you debug a recommendation drift in one user cohort?',
    ],
    prepSteps: [
      'Read Spotify\'s engineering blog posts on the recommendation system, audio infrastructure, and Squad model.',
      'Pick a project where you partnered cross-functionally (designer, PM, data scientist). Sharpen the story.',
      'Take-home: budget 4-8 hours. Expect production-quality code. Expect to defend every design decision in a follow-up call.',
      'Practice system design with streaming-flavour problems (CDN, caching, bandwidth-adaptive delivery).',
      'For "Why Spotify": have a real opinion on one product feature you\'d ship or remove.',
    ],
    mistakes: [
      'Treating the take-home casually. They\'re scored seriously and define your level signal.',
      'Generic answers about cross-functional work. The collaboration round wants specific stories with named partners.',
      'Underestimating the team-fit conversation. The Squad you interview into has real autonomy in the decision.',
      'Forgetting to explore the product before interviewing. Interviewers reference specific features in real time.',
    ],
    faq: [
      {
        q: 'How long does the Spotify hiring process take?',
        a: 'Five to ten weeks. The take-home stage adds real time (typically 1-2 weeks of candidate time + a follow-up call).',
      },
      {
        q: 'Is the Spotify bar lower than FAANG?',
        a: 'Different bar, not necessarily lower. Spotify weights team-fit and cross-functional collaboration more; FAANG weights universal-bar coding + system design more.',
      },
      {
        q: 'Do non-engineering roles take the same loop?',
        a: 'No. Product roles do 4-5 rounds focused on product sense + analytical depth. Design roles include a portfolio walkthrough. Data science roles include an SQL + analytics test.',
      },
    ],
  },

  {
    slug: 'salesforce',
    company: 'Salesforce',
    updated: '2026-05-01',
    intro:
      'Salesforce interviews in 2026 are structured, multi-round, and weight customer-obsession heavily. Loops vary by org (Slack, Tableau, Mulesoft, core CRM) but follow a similar pattern. Here is the prep pack.',
    tldr:
      'Salesforce engineering loops are 4-5 rounds: 2 technical (coding + system design), 1 behavioural anchored on the "Ohana" values, 1 hiring-manager fit. Prep medium-difficulty coding, customer-impact storytelling, and explicit alignment with the values.',
    signature: [
      'Values are scored explicitly: Trust, Customer Success, Innovation, Equality, Sustainability.',
      'System design rounds tilt toward enterprise SaaS at scale (multi-tenancy, data isolation, audit logging).',
      'Some orgs (Slack, Tableau) retain their pre-acquisition interview style and feel different.',
      'Compensation includes restricted stock units with 4-year vest. Signing bonus negotiable.',
    ],
    questions: [
      'Walk me through a time you championed a customer\'s perspective inside a technical decision.',
      'Implement a function to merge multi-tenant logs while preserving tenant isolation.',
      'Design a multi-tenant SaaS database that supports per-tenant query quotas.',
      'Tell me about a time you partnered with sales / customer success to ship something.',
      'How would you handle a P0 bug affecting one customer at 4am Friday?',
      'Implement a rate limiter that handles per-tenant burst patterns.',
      'Walk me through a decision where you balanced trust / customer success against shipping speed.',
      'How do you think about compliance (SOC 2, GDPR) in your engineering work?',
      'Why Salesforce? What\'s your honest read on the AI strategy?',
      'Tell me about a time you mentored someone outside your team.',
      'Describe a system you scaled from one tenant to thousands. What broke first?',
      'How would you design audit logging that works even when the database is down?',
    ],
    prepSteps: [
      'Read Salesforce\'s recent earnings calls or analyst-day presentations. Have specific opinions on AI strategy and Slack integration.',
      'Pick one project where you balanced multiple customer needs. Be specific about the trade-offs.',
      'Prepare three values-anchored behavioural stories: one for trust, one for customer success, one for innovation.',
      'Brush up on multi-tenancy patterns: shared schema vs separate schema, data isolation, per-tenant configuration.',
      'If interviewing into Slack or Tableau, study their pre-acquisition culture in addition to Salesforce\'s. The teams retain meaningful autonomy.',
    ],
    mistakes: [
      'Generic answers about the values. The behavioural rubric explicitly looks for customer-impact specifics.',
      'Treating the system design round as a generic FAANG-style question. Salesforce wants enterprise SaaS specifics.',
      'Underestimating the hiring manager round. They have meaningful weight in the decision.',
      'Negotiating without understanding the RSU vest structure. Salesforce\'s offers are flexible if you anchor correctly.',
    ],
    faq: [
      {
        q: 'How long does the Salesforce hiring process take?',
        a: 'Four to eight weeks. Faster for engineering, slower for cross-org senior leadership.',
      },
      {
        q: 'Are interviews at Slack / Tableau different?',
        a: 'Yes, materially. Slack retains a more startup-y, async-first style; Tableau is more analytics-focused. Research the specific org\'s culture in addition to Salesforce\'s.',
      },
      {
        q: 'Do I need Apex / Lightning experience for Salesforce engineering roles?',
        a: 'For platform engineering, helpful but not required. Most engineering teams hire on general distributed systems / SaaS background. Apex experience matters more for customer-facing implementation roles.',
      },
    ],
  },
];

export function getCompanyPack(slug: string): CompanyPack | undefined {
  return companyPacks.find((p) => p.slug === slug);
}
