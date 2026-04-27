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
];

export function getCompanyPack(slug: string): CompanyPack | undefined {
  return companyPacks.find((p) => p.slug === slug);
}
