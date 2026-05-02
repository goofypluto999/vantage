/**
 * Programmatic SEO data: interview question packs by role.
 *
 * Each entry powers a /interview-questions/<slug> route that ranks for
 * "[role] interview questions 2026", "[role] interview prep", and tail terms.
 *
 * Keep entries data-only. The page component renders title + meta + JSON-LD
 * + question list. Anything you want indexed lives here.
 */

export interface RolePack {
  /** URL slug, lowercase, hyphen-separated. */
  slug: string;
  /** Display name of the role. */
  role: string;
  /** Short blurb under the H1 (~30 words). Plain prose, not a list. */
  intro: string;
  /** TL;DR / direct answer rendered as the first thing on the page (AEO). */
  tldr: string;
  /** Top likely questions an interviewer asks for this role. 12+ each. */
  questions: string[];
  /** Concrete things this candidate should prep before the interview. */
  prepSteps: string[];
  /** Common mistakes that bin candidates for this role. */
  mistakes: string[];
  /** FAQ for the FAQPage schema and the on-page accordion. */
  faq: { q: string; a: string }[];
  /** ISO date — populates lastmod in sitemap and articleMeta in JSON-LD. */
  updated: string;
}

export const rolePacks: RolePack[] = [
  {
    slug: 'software-engineer',
    role: 'Software Engineer',
    updated: '2026-04-24',
    intro:
      'A practical, role-specific guide to software engineering interviews in 2026 — what they actually ask, what they listen for in your answers, and how to prep in under an hour with Vantage.',
    tldr:
      'Software engineer interviews split into three rounds: behavioural fit, system design, and live coding. The bar is moving toward "explain your thinking out loud," not just shipping the right answer. Prep two stories, one system you have built end-to-end, and a 25-minute warm-up coding session before the call.',
    questions: [
      'Walk me through your CV — pick one project to describe in depth.',
      'Tell me about a time you disagreed with a senior engineer. How did it end?',
      'Design a URL shortener. Walk me through the data model, the API, and how you would scale it to a billion links.',
      'What happens when I type a URL into a browser and press enter?',
      'Reverse a linked list. Now do it without recursion.',
      'Tell me about a production bug you owned. How did you find the root cause?',
      'How do you decide what to ship and what to deprioritise?',
      'How would you migrate a service from monolith to microservices? What would you not migrate?',
      'Explain a recent technical decision you made and the trade-offs.',
      'How do you keep up with new technologies without chasing every hype cycle?',
      'Describe your testing approach. What do you test, what do you not?',
      'Why do you want to work here, specifically? What did you read about us this morning?',
    ],
    prepSteps: [
      'Pick one system you have shipped end-to-end. Be ready to draw the architecture on a whiteboard from memory.',
      'Prepare two STAR stories: one disagreement, one production fix. 90 seconds each.',
      'Re-read the job description and grep your CV for missing keywords. Add the ones that are true.',
      'Run a 25-minute warm-up coding session on LeetCode the morning of the interview. Easy or medium, not hard.',
      'Prepare one question that proves you read their engineering blog or open-source repos.',
    ],
    mistakes: [
      'Listing every framework you have ever touched. Recruiters bin CVs that read like a tag cloud.',
      'Describing a project as "I built X" when it was a team of six. Use "I owned the X module."',
      'Forgetting to ask about deployment, observability, or on-call rotation. Senior signals.',
      'Memorising 80 LeetCode answers and being unable to explain time complexity for any of them.',
    ],
    faq: [
      {
        q: 'How long should I prep for a software engineering interview?',
        a: 'For a role you already do day to day, 1 hour of focused prep beats 8 hours of general study. Reread the JD, prep two stories, and run one warm-up coding session.',
      },
      {
        q: 'Should I memorise LeetCode patterns?',
        a: 'Memorise the patterns, not the solutions. Two-pointer, sliding window, BFS/DFS, hash map, dynamic programming. If you can name the pattern in 10 seconds, you can derive the code in 25 minutes.',
      },
      {
        q: 'What do FAANG-tier companies test that startups do not?',
        a: 'System design at scale, behavioural depth, and a hiring committee with explicit calibration. Startups test "can you ship this thing in two weeks." Different bar, different prep.',
      },
    ],
  },
  {
    slug: 'product-manager',
    role: 'Product Manager',
    updated: '2026-04-24',
    intro:
      'Product manager interviews in 2026 stress-test three things: judgment, prioritisation, and how clearly you think under pressure. This is the prep pack most candidates wish they had.',
    tldr:
      'PM interviews are 60 percent product sense, 30 percent prioritisation, and 10 percent metrics. Prep two product cases, three "tell me about a time" stories, and a 90-second pitch for a feature you would build at this exact company.',
    questions: [
      'Pick a product you use every day. How would you improve it?',
      'How would you prioritise the roadmap for our app for the next quarter?',
      'Tell me about a product decision you got wrong. What did you do?',
      'How do you measure the success of a feature?',
      'Walk me through how you would launch a new feature, end to end.',
      'What metric would you use to decide whether to kill a feature?',
      'Tell me about a stakeholder who disagreed with your roadmap. How did you handle it?',
      'Estimate the number of monthly active users our product needs to break even.',
      'How do you decide what NOT to build?',
      'Describe a time you ran a customer interview that changed your mind.',
      'Imagine engagement on our home screen drops 20 percent overnight. What do you do?',
      'Why product management, and why us specifically?',
    ],
    prepSteps: [
      'Memorise three product frameworks but only mention them by name once: AARRR, Jobs-to-be-Done, RICE.',
      'Prepare two case studies of products you shipped — one that worked, one that did not.',
      'Run the company\'s product yourself the morning of the interview. Take screenshots. Reference them.',
      'Prepare three things you would build, with rough estimates of impact and cost.',
      'Have a strong opinion on at least one trade-off the company is currently making in their product.',
    ],
    mistakes: [
      'Reciting frameworks like a textbook. Use the framework once, then talk like a human.',
      'Confusing output (features shipped) with outcome (user behaviour changed). Senior PMs talk in outcomes.',
      'Pretending you have never made a bad call. Bad signal.',
      'Asking generic questions at the end. "What is the team culture like?" is a no-op. Ask about the hardest decision the team made this quarter.',
    ],
    faq: [
      {
        q: 'Do I need an MBA to be a product manager?',
        a: 'No. The vast majority of senior PMs at top tech companies do not have one. Operational experience and clear thinking are the real prerequisites.',
      },
      {
        q: 'How do I prep for a product sense question without using the company\'s product?',
        a: 'Pick a product in an adjacent space, run the same exercise, and bring the analysis. Showing the process is more valuable than knowing the company.',
      },
      {
        q: 'What is the most common reason PMs fail interviews?',
        a: 'Confusing analytical breadth with depth. They jump between five frameworks instead of going one level deeper on a single insight.',
      },
    ],
  },
  {
    slug: 'data-scientist',
    role: 'Data Scientist',
    updated: '2026-04-24',
    intro:
      'Data science interviews in 2026 split into stats fundamentals, applied ML, SQL, and a business case. Here is the prep pack, the questions, and the mistakes that get strong candidates rejected.',
    tldr:
      'Data scientist interviews test four things: SQL fluency, statistical reasoning, applied ML judgment, and the ability to translate a vague business problem into a measurable analysis. Prep one end-to-end project narrative, three SQL warm-ups, and one A/B testing case.',
    questions: [
      'Walk me through a recent data science project from problem statement to deployment.',
      'How would you design an experiment to measure the impact of a new feature?',
      'A stakeholder says retention dropped this week. How do you investigate?',
      'Explain bias-variance trade-off without a whiteboard.',
      'Write the SQL to find the second-highest salary in each department.',
      'When would you use a tree-based model over a linear model?',
      'How do you validate that a model is not overfitting?',
      'Explain p-values to a non-technical PM in 60 seconds.',
      'Describe a time your model went into production and broke. What did you do?',
      'How do you choose a success metric for a recommender system?',
      'Walk me through how you would build a churn prediction model end to end.',
      'How do you communicate uncertainty in a forecast to leadership?',
    ],
    prepSteps: [
      'Pick one project that touches data ingestion, modelling, validation, and stakeholder communication. Tell it as a story.',
      'Run three medium-difficulty SQL drills the morning of the interview — joins, window functions, aggregations.',
      'Refresh stats fundamentals: hypothesis testing, p-values, confidence intervals, central limit theorem.',
      'Prepare a 90-second story about a model decision that turned out wrong, and what you learned.',
      'Be ready to push back on a vague brief. "What metric are we optimising?" is a green-flag question.',
    ],
    mistakes: [
      'Going straight to model selection without first restating the business problem. Hiring managers count this.',
      'Not knowing the SQL window functions. They will ask, and "I would Google it" is not a passing answer.',
      'Talking about Kaggle competitions instead of production systems.',
      'Vague stats. "I would do a t-test" is a 3/10. "I would use a Welch t-test because variances differ across groups, and I would correct for multiple testing" is an 8/10.',
    ],
    faq: [
      {
        q: 'Do I need a PhD to get hired as a data scientist?',
        a: 'No. Most product-facing data science roles favour applied judgment over research credentials. PhDs help for ML researcher roles specifically.',
      },
      {
        q: 'How much SQL is enough?',
        a: 'Comfortable with joins, window functions, aggregations, and CTEs. Recursive CTEs and pivots if the role is heavily analytics-leaning.',
      },
      {
        q: 'Should I demo a model live in the interview?',
        a: 'Only if asked. Bring a notebook screenshot if the format is "walk us through your work." Live coding is rarer at the senior level.',
      },
    ],
  },
  {
    slug: 'product-designer',
    role: 'Product Designer',
    updated: '2026-04-24',
    intro:
      'Product designer interviews are won or lost on the portfolio walkthrough. Here is what hiring managers actually score, and the questions that follow.',
    tldr:
      'Product designer interviews are 70 percent portfolio walkthrough, 20 percent design critique, and 10 percent culture. Prep two case studies that show your decision process — not just final pixels.',
    questions: [
      'Walk me through a project you are most proud of. Include the messy middle.',
      'How do you decide between competing design directions?',
      'Tell me about a time engineering pushed back on your design. What did you do?',
      'Critique the home screen of our product.',
      'How do you measure whether a design succeeded?',
      'What is your approach to design systems vs one-off custom work?',
      'How do you handle stakeholders with conflicting feedback?',
      'Walk me through a design that did not ship. Why didn\'t it?',
      'How do you partner with research and PM to get to a brief?',
      'Describe a recent design trend you do not buy into. Why?',
      'How do you decide when to use AI in your design workflow vs do it manually?',
      'What does great craft mean to you, in one sentence?',
    ],
    prepSteps: [
      'Pick two case studies. One that shipped and worked, one that taught you something hard. Skip "everything worked perfectly."',
      'For each case study, prep three slides: problem, decision points, outcome. Three minutes per study, no more.',
      'Open the company\'s product the night before. Take screenshots of three things you would change.',
      'Be ready to defend a design decision you made that someone smart pushed back on.',
      'Prepare one question that proves you understand the team\'s scope and challenges, not generic culture-fit talk.',
    ],
    mistakes: [
      'Showing 12 case studies. The signal is depth, not breadth.',
      'Talking about Figma plugins and tools instead of decisions and outcomes.',
      'Skipping the messy middle. "We had a stakeholder veto and pivoted in week 3" is the most interesting thing you can say.',
      'Critiquing the company\'s product without first acknowledging what is working. Reads as combative.',
    ],
    faq: [
      {
        q: 'How many case studies should be in my portfolio?',
        a: 'Three is the sweet spot. Two minimum, four maximum. Hiring managers spend ~7 minutes per portfolio on first review.',
      },
      {
        q: 'Do I need to show pixel-perfect designs?',
        a: 'No. Show the decision tree, the dead ends, and the trade-offs. Final pixels are the easy part.',
      },
      {
        q: 'Should I include client work in my portfolio?',
        a: 'Only if you can show the strategy and decisions. If it is just "client gave brief, I executed pixels," skip it.',
      },
    ],
  },
  {
    slug: 'marketing-manager',
    role: 'Marketing Manager',
    updated: '2026-04-24',
    intro:
      'Marketing manager interviews in 2026 go past channel knowledge into strategy, attribution, and judgment. Here is the prep pack and questions you will actually face.',
    tldr:
      'Marketing manager interviews test channel breadth, attribution maturity, and budget judgment. Prep one campaign with clean before/after metrics, one channel you killed, and a 60-second strategy you would deploy at this company.',
    questions: [
      'Walk me through a campaign you ran end to end. What worked and what did not?',
      'How do you measure the ROI of brand-building activity?',
      'Our CAC has doubled in 6 months. Where do you start?',
      'What is your approach to channel mix and budget allocation?',
      'Tell me about a channel you killed and why.',
      'How do you brief a creative team without dictating the work?',
      'Describe how you have used AI in your workflow this year.',
      'How do you partner with sales when leads are not converting?',
      'Walk me through your attribution model. How do you handle multi-touch?',
      'What is one trend in marketing right now that is overhyped?',
      'How would you launch our new feature with a $20k budget?',
      'What is the worst-performing campaign you ever ran?',
    ],
    prepSteps: [
      'Pick one campaign with clean before/after numbers. Memorise the spend, the revenue, and the CAC change.',
      'Prepare a kill story — a channel or campaign you stopped, and why. This shows judgment.',
      'Audit the company\'s current marketing for 20 minutes the night before. Note three gaps.',
      'Prepare a 60-second proposal for what you would do in your first 90 days.',
      'Know your numbers — CAC, LTV, payback period, attribution lag — without notes.',
    ],
    mistakes: [
      'Listing channels you have run instead of outcomes you have driven.',
      'Vague metrics. "We grew engagement" is a 2/10. "We grew weekly active users 28 percent quarter-over-quarter at a 14 percent lower CAC" is the bar.',
      'Not having a strong opinion on attribution. Senior marketers do.',
      'Pitching tactics before strategy. "I would run more LinkedIn ads" is junior. "I would re-segment the buyer persona, then run LinkedIn ads against the high-intent segment" is senior.',
    ],
    faq: [
      {
        q: 'Should I bring slides to a marketing interview?',
        a: 'Only if asked, or if a portfolio would meaningfully change the conversation. Default to no.',
      },
      {
        q: 'How do I answer "what would you do here in 90 days" without insider data?',
        a: 'Acknowledge the data gap, then propose the diagnostic you would run. The framework matters more than the answer.',
      },
      {
        q: 'How much do I need to know about the company\'s exact tools?',
        a: 'Know their stack at the category level (CRM, MAP, attribution platform). You can learn the specific tool in week one.',
      },
    ],
  },
  {
    slug: 'sales-development-rep',
    role: 'Sales Development Representative',
    updated: '2026-04-24',
    intro:
      'SDR interviews in 2026 are pattern-matched: hiring managers want energy, coachability, and one example that proves you have done the work. Here is the prep pack.',
    tldr:
      'SDR interviews test three things: do you have outbound stamina, are you coachable, and can you adapt a script in under 30 seconds. Prep one cold-outreach story with concrete numbers, one rejection story, and a live mock cold call.',
    questions: [
      'Walk me through your outbound day, hour by hour.',
      'Tell me about your highest-volume month. How many calls, emails, meetings booked?',
      'Pretend I am a CMO. Cold call me right now.',
      'Tell me about a time you got rejected hard. What did you do next?',
      'How do you research a prospect before reaching out?',
      'Walk me through your email sequence — first touch through follow-up 5.',
      'What is your typical reply rate? What is your meeting-booked rate?',
      'How do you handle the "send me an email" objection?',
      'Tell me about an account executive you worked with well, and one you struggled with.',
      'What CRM and outreach tools have you used?',
      'How do you stay motivated on a slow day?',
      'Why us, and why now?',
    ],
    prepSteps: [
      'Memorise your numbers. Calls per day, emails per day, meetings booked per month, conversion rate.',
      'Prepare a 30-second cold pitch for the company\'s product. They may ask you to deliver it live.',
      'Have one rejection story where you stayed in the relationship and eventually booked the meeting.',
      'Research the company\'s ideal customer profile before the call. Be able to name 3 example accounts.',
      'Know who their AEs are on LinkedIn. Reference one if asked.',
    ],
    mistakes: [
      'Not knowing your own numbers. Killer. Every SDR manager will ask.',
      'Reading the cold call from a script when asked to do it live. Show that you can deviate.',
      'Generic objection handling. "I would say I understand and ask another question." Be specific.',
      'Forgetting to ask about quota, OTE, ramp time, and AE-to-SDR ratio. Senior signals.',
    ],
    faq: [
      {
        q: 'How long should the SDR ramp take?',
        a: 'Standard is 30 days for product training, 60 days for full quota. If they say longer, ask why.',
      },
      {
        q: 'What is a good email-reply rate in 2026?',
        a: '4–6 percent for unsegmented outbound, 12 percent or higher for tight ICP and personalisation. Benchmarks shift fast.',
      },
      {
        q: 'Should I do the mock cold call seriously or jokingly?',
        a: 'Seriously. Always. They are testing whether you can hold a real conversation under pressure.',
      },
    ],
  },
  {
    slug: 'customer-success-manager',
    role: 'Customer Success Manager',
    updated: '2026-04-24',
    intro:
      'Customer Success Manager interviews test how you balance retention, expansion, and bad news. Here is the prep pack used by candidates who actually get the offer.',
    tldr:
      'CSM interviews lean on three scenarios: a churning account, an expansion opportunity, and a tough customer call. Prep one save story, one expansion story, and one moment you delivered hard news.',
    questions: [
      'Walk me through your book of business. How many accounts, what ARR?',
      'Tell me about an account you saved from churn. How did you do it?',
      'Tell me about an expansion you closed. What was the trigger?',
      'How do you decide which accounts to spend time on?',
      'Describe a time you had to tell a customer something they did not want to hear.',
      'How do you partner with sales on a renewal at risk?',
      'What does a successful onboarding look like to you?',
      'Walk me through a QBR you have run.',
      'How do you measure customer health?',
      'What is the playbook when a customer\'s exec sponsor leaves?',
      'How do you handle a customer who is hitting our product limits but is on the wrong plan?',
      'Why customer success, and why us?',
    ],
    prepSteps: [
      'Memorise your book size, ARR managed, gross retention, and net retention numbers.',
      'Prepare three stories: a save, an expansion, and a hard conversation.',
      'Read the company\'s product release notes from the last quarter so you can speak to current customer pain.',
      'Be ready to talk about your customer health framework. Even a simple one beats none.',
      'Prepare one question about the company\'s NDR and renewal motion.',
    ],
    mistakes: [
      'Confusing CSM with support. Senior CSMs talk in revenue, not tickets.',
      'No numbers. "We had high retention" is a 2/10. "We held gross retention at 95 percent and pushed net to 118 percent" is the bar.',
      'Not having an opinion on tooling vs process. Best CSMs lean on process; tools come second.',
      'Avoiding tough-conversation stories. They are looking for them specifically.',
    ],
    faq: [
      {
        q: 'What is the difference between a CSM and an account manager?',
        a: 'CSMs own value realisation and adoption, AMs own contracting and commercials. The split is fuzzy and varies by company.',
      },
      {
        q: 'How big should my book of business be?',
        a: 'Depends on segment. SMB CSMs run 80–200 accounts, mid-market 30–60, enterprise 5–15.',
      },
      {
        q: 'What metrics do CSMs get measured on?',
        a: 'Gross retention, net retention, expansion ARR, and adoption metrics. Plus sometimes NPS.',
      },
    ],
  },
  {
    slug: 'frontend-developer',
    role: 'Frontend Developer',
    updated: '2026-04-24',
    intro:
      'Frontend developer interviews in 2026 test framework depth, performance instincts, and the ability to ship a UI under time pressure. Here is the prep pack.',
    tldr:
      'Frontend interviews split into framework knowledge, a live coding round, and a performance/architecture conversation. Prep one component you would refactor, one performance fix, and a 25-minute warm-up before the call.',
    questions: [
      'Build a typeahead search component live. How do you debounce?',
      'Explain the React rendering lifecycle as if I have never used React.',
      'A page is loading in 8 seconds. How do you debug it?',
      'Walk me through how you would architect a new design system.',
      'How do you decide between server components and client components?',
      'Tell me about a performance bug you fixed. What was the root cause?',
      'How do you handle accessibility in your team?',
      'Describe your testing strategy: unit, integration, end-to-end.',
      'What is the difference between debouncing and throttling? When does each win?',
      'How do you keep bundle size in check?',
      'Walk me through how you implement dark mode without flicker on first paint.',
      'Why do you want to work on the web specifically in 2026?',
    ],
    prepSteps: [
      'Build one Codepen demo in your strongest framework, ready to share live.',
      'Re-read the React or Vue docs section relevant to the role. Refresh on hooks, signals, suspense.',
      'Run a 25-minute warm-up coding session — implement a debounced typeahead.',
      'Prepare a story about a performance bug. CDN, hydration, render thrash. Specific.',
      'Have an opinion on at least one of: server components vs islands, signals vs hooks, monorepos vs polyrepos.',
    ],
    mistakes: [
      'Listing every JS framework you have touched. Hiring managers want depth in one or two.',
      'Skipping accessibility. Senior frontend folks treat it as table stakes.',
      'Not knowing the difference between layout, paint, and composite. Junior signal.',
      'Asking about CSS-in-JS vs Tailwind religiously. Pick a side, defend it briefly, move on.',
    ],
    faq: [
      {
        q: 'Do I need to know algorithms for a frontend interview?',
        a: 'For top tech companies, yes — but only the basics. Hash maps, BFS/DFS, two pointers. Hard DP is rare for frontend.',
      },
      {
        q: 'How important is TypeScript in 2026 frontend interviews?',
        a: 'Default. Most companies expect you to type your code by default and use generics where they help.',
      },
      {
        q: 'What about AI-assisted coding?',
        a: 'Expected. Senior interviews ask how you use AI to ship faster while keeping quality up. Have a real workflow to describe.',
      },
    ],
  },
  {
    slug: 'backend-developer',
    role: 'Backend Developer',
    updated: '2026-04-24',
    intro:
      'Backend developer interviews lean on system design, debugging in production, and how you reason about reliability. Here is the role-specific prep pack.',
    tldr:
      'Backend interviews focus on system design, database trade-offs, and reliability under load. Prep one production incident you owned, one schema you would redesign, and a system design warm-up.',
    questions: [
      'Design a rate limiter. Token bucket or leaky bucket?',
      'How would you scale a write-heavy database to 10x traffic?',
      'Explain database isolation levels. When would you use serialisable?',
      'Tell me about a production incident you owned end to end.',
      'How would you design a job queue that survives a process crash?',
      'Walk me through how you would migrate a monolith to microservices.',
      'How do you debug a service that is intermittently slow?',
      'Explain the CAP theorem in plain language.',
      'Describe how you would build a payments idempotency layer.',
      'How do you handle backwards compatibility in your API?',
      'What is your testing pyramid?',
      'Why backend over frontend, and why this team?',
    ],
    prepSteps: [
      'Pick one system you have built, ready to draw the architecture from memory.',
      'Refresh database fundamentals: indexing, locking, isolation levels, replication.',
      'Prepare a production incident story with a specific root cause and a specific learning.',
      'Practice one system design problem the morning of the interview — rate limiter, URL shortener, or chat service.',
      'Have an opinion on monolith vs microservices that is more nuanced than "it depends."',
    ],
    mistakes: [
      'Designing for theoretical scale instead of actual scale. "What is our QPS today?" is the right opening question.',
      'Not knowing how indexes actually work. They will ask.',
      'Skipping observability. Senior engineers talk about logs, metrics, and traces by default.',
      'Generic system design. "I would put it on AWS" is a 1/10. Specific services, trade-offs, failure modes.',
    ],
    faq: [
      {
        q: 'Do I need to know Kubernetes for a backend interview?',
        a: 'For senior roles at infra-heavy companies, yes. For most product backend roles, container basics and one orchestrator at the user level is enough.',
      },
      {
        q: 'How do I prep for system design without real production experience?',
        a: 'Read the post-mortems published by Stripe, Cloudflare, GitHub, and Discord. Then narrate one to a friend until they understand the trade-offs.',
      },
      {
        q: 'What about distributed systems theory?',
        a: 'Know the names — CAP, FLP, consensus, quorum — and the practical implications. Theorem proofs are not expected for product roles.',
      },
    ],
  },
  {
    slug: 'ux-researcher',
    role: 'UX Researcher',
    updated: '2026-04-24',
    intro:
      'UX researcher interviews test methodology, judgment, and stakeholder craft. Here is the prep pack and the questions hiring managers actually ask.',
    tldr:
      'UX researcher interviews focus on three things: study design, stakeholder influence, and how you handle ambiguous briefs. Prep one mixed-methods project, one project that changed a roadmap decision, and one study you would not run.',
    questions: [
      'Walk me through a research project from brief to impact.',
      'How do you decide between qualitative and quantitative methods?',
      'Tell me about a study that changed a roadmap decision.',
      'Describe a time a stakeholder ignored your research findings. What did you do?',
      'How do you recruit participants for a niche B2B audience?',
      'How do you measure whether research had impact?',
      'Walk me through your interview guide structure.',
      'When would you say no to running a study?',
      'How do you partner with PMs and designers to shape a brief?',
      'Describe a research method you have never used but want to learn.',
      'How do you handle conflicting findings from two studies?',
      'Why research, and why us?',
    ],
    prepSteps: [
      'Prepare one mixed-methods project you can describe end to end in 5 minutes.',
      'Have a story about influencing a stakeholder who initially disagreed.',
      'Refresh on three methods: usability testing, in-depth interviews, and at least one quantitative method.',
      'Read the company\'s public research or design system if any exists.',
      'Prepare three questions about how the research function partners with PM and design.',
    ],
    mistakes: [
      'Treating research as deliverables. Senior researchers talk in decisions changed.',
      'Generic method talk. Show the actual interview guide structure or screener you used.',
      'No story about influence. Every senior researcher has one.',
      'Forgetting to ask about how the team measures research impact. Reveals research maturity.',
    ],
    faq: [
      {
        q: 'Do I need a behavioural science degree for UX research?',
        a: 'No, but a degree in psychology, sociology, or a related field helps. More important is method fluency and stakeholder craft.',
      },
      {
        q: 'How many participants per study is enough?',
        a: 'For qualitative usability testing, 5–8 covers most issues. For attitudinal interviews, 12–15 to reach saturation. Quantitative depends on confidence interval needs.',
      },
      {
        q: 'How do I show research impact in my portfolio?',
        a: 'Tie each project to a decision changed, a feature shipped or killed, or a metric moved. Process is the input, not the output.',
      },
    ],
  },
  {
    slug: 'devops-engineer',
    role: 'DevOps Engineer',
    updated: '2026-05-01',
    intro:
      'DevOps engineer interviews in 2026 stress-test infrastructure judgment, incident response, and how you reason about reliability and cost trade-offs. Here is the prep pack candidates wish they had.',
    tldr:
      'DevOps interviews focus on three things: infrastructure-as-code fluency, an incident you owned end-to-end, and observability maturity. Prep one production incident with a clean root cause, one cost optimisation with real numbers, and a system design that survives a region failure.',
    questions: [
      'Walk me through a production incident you owned end to end. What was the root cause?',
      'How would you design CI/CD for a service deployed to three regions?',
      'Explain blue/green vs canary vs rolling deploys. When does each win?',
      'A service is throwing 500s intermittently. What is the first thing you check?',
      'How do you handle secrets in your infrastructure?',
      'Walk me through the difference between Kubernetes deployments, statefulsets, and daemonsets.',
      'How would you cut your cloud bill by 30 percent without dropping reliability?',
      'Describe your observability stack. What do you log, what do you trace, what do you alert on?',
      'How do you decide between Terraform and Pulumi (or CDK) for a new project?',
      'Walk me through how you would migrate a workload from EC2 to Kubernetes.',
      'How do you think about disaster recovery and RTO/RPO?',
      'Why DevOps over backend engineering, and why this team?',
    ],
    prepSteps: [
      'Pick one production incident you owned. Be ready to draw the timeline, root cause, fix, and postmortem follow-ups from memory.',
      'Refresh on Kubernetes core objects (deployment, service, ingress, statefulset) and one cluster autoscaler.',
      'Prepare a concrete cost-optimisation story with before/after numbers. Reserved instances, right-sizing, spot, autoscaling — pick the lever you actually pulled.',
      'Have an opinion on Terraform vs Pulumi vs CDK that is more nuanced than "it depends".',
      'Run one warm-up: deploy a hello-world to a cluster the morning of the interview. Keep the muscle memory live.',
    ],
    mistakes: [
      'Talking about tools without trade-offs. "I would use ArgoCD" is junior. "I picked ArgoCD over Flux because the multi-cluster fan-out matched our org structure" is senior.',
      'No specific incident story. Every senior DevOps engineer has one. If you say "we just have good monitoring", they\'ll downgrade you.',
      'Generic observability. "We use Datadog" is a 2/10. "We trace request paths with OpenTelemetry into Datadog APM, alert on p99 latency at the service boundary, and route logs through Vector" is the bar.',
      'Skipping cost. Senior DevOps roles in 2026 expect you to know cloud bill mechanics. Reserved instances, spot, savings plans, multi-cloud egress — pick at least one.',
    ],
    faq: [
      {
        q: 'Do I need Kubernetes for every DevOps role in 2026?',
        a: 'No. Plenty of strong roles run on serverless (Lambda, Cloud Run) or managed PaaS (Fly, Railway, Vercel). Know the trade-offs against Kubernetes — that\'s the real signal.',
      },
      {
        q: 'How much coding should a DevOps engineer be doing?',
        a: 'Enough to write production-quality scripts in Python, Go, or Bash, and to read service code in whatever language your team ships. Senior roles increasingly write production code, not just glue.',
      },
      {
        q: 'What is the difference between SRE and DevOps in 2026?',
        a: 'Practically very fuzzy. SRE roles tend to lean more on production reliability and error budgets, DevOps roles more on developer experience and the deployment pipeline. Same skill stack, different framing.',
      },
    ],
  },
  {
    slug: 'engineering-manager',
    role: 'Engineering Manager',
    updated: '2026-05-01',
    intro:
      'Engineering manager interviews test how you balance people, project delivery, and technical judgment. Here is the prep pack used by candidates who actually land the offer.',
    tldr:
      'EM interviews split into people leadership, technical depth, and execution. Prep one underperformer story you turned around, one technical decision you made under pressure, and a 90-day plan for joining a struggling team.',
    questions: [
      'Walk me through your team. How many people, what shape, what stage?',
      'Tell me about an underperformer you managed. How did it end?',
      'Tell me about someone you promoted. What was the signal?',
      'How do you decide between hiring senior versus growing a junior into the role?',
      'A senior engineer on your team disagrees publicly with your tech direction. What do you do?',
      'How do you measure your team\'s impact?',
      'Describe a time you had to deliver a project late. How did you communicate it?',
      'How do you balance tech debt against feature delivery?',
      'Walk me through a technical decision you made that turned out wrong. What did you do?',
      'How do you partner with product and design when priorities clash?',
      'How do you handle a high-performer who is toxic to the team?',
      'Why management over senior IC, and why us specifically?',
    ],
    prepSteps: [
      'Memorise your team shape — headcount, levels, stage of product, current top initiative.',
      'Prepare three people stories: an underperformer turned around (or exited), a promotion you championed, and a hiring loop you ran.',
      'Have a coaching framework you actually use. Even a simple one ("weekly 1:1s, 30/60/90 plans, monthly career check-ins") beats none.',
      'Be ready to defend a recent technical decision. EMs who can\'t talk depth get filtered out.',
      'Prepare a 90-day plan for joining a struggling team. Diagnostic week 1-2, alignment week 3-4, ship something week 5-12.',
    ],
    mistakes: [
      'Avoiding the underperformer question. Every senior EM has one. "I haven\'t had any" reads as you\'re not actually managing.',
      'Talking only about delivery dates. Senior EMs also speak in retention, growth, and team health metrics.',
      'No technical opinion. Engineering managers who can\'t reason about a system design or a recent tech trade-off lose against player-coach EMs.',
      'Generic 1:1 talk. "I do weekly 1:1s" is table stakes. "I run growth-focused 1:1s with a quarterly career conversation and a monthly skip-level" shows craft.',
    ],
    faq: [
      {
        q: 'Should I still code as an engineering manager in 2026?',
        a: 'Up to roughly two reports, yes — code regularly. Three to six reports, probably reviews and prototypes. Seven plus, strategic only. AI-assisted coding has lowered the cost of staying in the code, so more EMs are doing some of it again.',
      },
      {
        q: 'How do I prep for a system design round as an EM?',
        a: 'Same prep as a senior IC, but lead with trade-offs and team-shape implications. EMs who design systems with no thought to staffing or operability rank below ICs in technical rounds.',
      },
      {
        q: 'What is the most common reason EMs fail interviews?',
        a: 'Vague stories. "We had a great team, we shipped a lot" is a 2/10. "We were missing two senior engineers, I rebalanced the org from 3 squads to 2, prioritised the latency work over the feature work, shipped six weeks late but cut p99 by 60 percent" is the bar.',
      },
    ],
  },
  {
    slug: 'account-executive',
    role: 'Account Executive',
    updated: '2026-05-01',
    intro:
      'Account executive interviews test pipeline discipline, deal craft, and how you handle losses. Here is the prep pack candidates use to land six-figure SaaS sales jobs.',
    tldr:
      'AE interviews focus on three things: a closed-won deal you can narrate end to end, a closed-lost deal you can dissect, and how you build pipeline when SDRs aren\'t feeding you enough. Memorise your numbers — quota, attainment, ASP, sales cycle — to two decimal places.',
    questions: [
      'Walk me through your last fiscal year. Quota, attainment, ASP, sales cycle.',
      'Tell me about your most complex deal. Who was involved, how long did it take?',
      'Walk me through a deal you lost. Why did it lose?',
      'How do you build pipeline when your SDRs aren\'t feeding you enough?',
      'Describe your discovery process. What questions do you always ask?',
      'How do you handle a procurement team that keeps pushing for a 30 percent discount?',
      'Tell me about a time you ran a multi-threaded deal. How did you map the buying committee?',
      'How do you forecast? How accurate are you typically?',
      'Walk me through how you would qualify a deal using MEDDIC (or your framework of choice).',
      'How do you handle the "send me a proposal and I\'ll get back to you" stall?',
      'Tell me about an executive sponsor who left mid-deal. What did you do?',
      'Why this product, why this company, why now?',
    ],
    prepSteps: [
      'Memorise your numbers cold. Quota, attainment, ASP, sales cycle, win rate, ramp time. They will ask.',
      'Pick one closed-won deal you can narrate from prospect to signature in 4 minutes — including who you sold to and how you mapped the buying committee.',
      'Pick one closed-lost deal. Be honest about why it lost. The interviewer is testing your self-awareness, not your win rate.',
      'Prepare a 30-second pitch for the company\'s product to their ICP. They may ask you to deliver it live.',
      'Research the company\'s recent customer wins, competitive losses, and any earnings call language about their sales motion.',
    ],
    mistakes: [
      'Vague numbers. "I exceeded quota" is a 2/10. "I closed 142 percent of my $1.2M annual quota at a 26 percent win rate, $48K ASP, 71-day average sales cycle" is the bar.',
      'Blaming losses on the product or pricing only. Every interviewer is listening for self-awareness — was the loss avoidable, what would you do differently.',
      'No buying-committee mapping in your deal stories. Senior AE roles want multi-threaded sellers.',
      'Generic discovery. "I ask about pain points" is junior. "I run a value-driven discovery anchored to a measurable business outcome and tie every demo back to that outcome" is senior.',
    ],
    faq: [
      {
        q: 'Should I bring my W-2 or pay slips to a sales interview?',
        a: 'Many top-tier SaaS hiring managers ask for them at offer stage to verify quota attainment claims. Bring them ready. If your numbers are honest, this is the easiest part of the loop.',
      },
      {
        q: 'What sales methodology do I need to know in 2026?',
        a: 'MEDDIC and MEDDPICC are still the most-asked. Command of the Message, Sandler, and Challenger come up too. Pick one you actually use, defend it, don\'t pretend to use them all.',
      },
      {
        q: 'How honest should I be about a quarter I missed?',
        a: 'Fully honest. Senior sales leaders know everyone misses a quarter. They are listening for self-awareness, the diagnostic you ran, and what you changed for the next quarter. A polished excuse is worse than a missed quarter.',
      },
    ],
  },
];

export function getRolePack(slug: string): RolePack | undefined {
  return rolePacks.find((p) => p.slug === slug);
}
