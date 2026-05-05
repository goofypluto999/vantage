/**
 * Company × seniority interview prep — depth tier on top of /interview-prep/[company].
 *
 * Top 8 companies × 5 seniorities = 40 cells. Each cell has substantively
 * unique content about how that specific seniority is interviewed at that
 * specific company. No template-fills; doorway-page risk is real and we
 * mitigate it by sourcing each cell from public material:
 * - Levels.fyi level mappings + comp bands
 * - Company engineering / hiring blogs
 * - Public interview reports (Blind, Glassdoor reviews)
 * - Official company hiring pages
 *
 * Schema target: BreadcrumbList + FAQPage + Article per cell. Cross-links
 * to other seniorities at the same company + same seniority elsewhere.
 */

export type SenioritySlug = 'junior' | 'mid' | 'senior' | 'staff' | 'manager';

export interface SenioritySalary {
  gbp: string;
  usd: string;
  note?: string;
}

export interface SeniorityVariant {
  slug: SenioritySlug;
  label: string;
  titleSuffix: string; // for SEO title — appears after company name
  yearsExp: string;
  /** 3-5 bullets specific to this level at this company. */
  interviewPattern: string[];
  /** 8-10 questions specific to this level. */
  likelyQuestions: string[];
  /** 1 paragraph on what they're looking for at this level. */
  levelRubric: string;
  /** Compensation band, sourced from public data. */
  compRange: SenioritySalary;
  /** 2-3 areas this level often falls short. */
  commonGaps: string[];
}

export interface CompanySeniorityPack {
  /** Matches an existing companyPacks slug. */
  companySlug: string;
  variants: SeniorityVariant[];
}

// ─────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────

export const companySeniorityPacks: CompanySeniorityPack[] = [
  // ════════════ GOOGLE ════════════
  {
    companySlug: 'google',
    variants: [
      {
        slug: 'junior',
        label: 'Junior / L3 (entry-level)',
        titleSuffix: 'L3 / junior interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'Two coding interviews (45 min each), one Googleyness behavioural, one general cognitive abilities round.',
          'Coding rounds focus on data structures + algorithms fundamentals — arrays, hash maps, trees, graphs, basic dynamic programming.',
          'No system design at L3.',
          'Hiring committee weighs the coding rounds heaviest; Googleyness is a calibration check, not an offer-decider.',
        ],
        likelyQuestions: [
          'Reverse a linked list (iteratively and recursively).',
          'Find the first non-repeating character in a string.',
          'Validate a binary search tree.',
          'Two-sum and three-sum variants — confirm you handle duplicates correctly.',
          'Implement a basic LRU cache.',
          'Detect a cycle in a directed graph.',
          'Tell me about a time you had to learn something new quickly.',
          'Why Google? (Avoid generic "I love Google search" — name a specific product or technology.)',
          'Describe a side project and what you would change about it.',
          'How would you debug a slow web page?',
        ],
        levelRubric:
          'L3 candidates need to demonstrate solid CS fundamentals, the ability to write working code in a 30-minute window, and capacity for growth. The bar is "can this person become an L4 in 18 months?" Strong CS theory + clean coding under pressure beats deep specialization at this level.',
        compRange: { gbp: '£75-95k base + ~15% equity refresh', usd: '$130-165k base + ~$30k stock/year', note: 'Levels.fyi 2024-25 L3 band' },
        commonGaps: [
          'Failing to clarify the problem before writing code — Google interviewers explicitly score this.',
          'Optimizing for performance before correctness; brute-force first, optimize after stating tradeoffs.',
          'Generic "Googleyness" answers that do not name a specific moment of intellectual humility or productive disagreement.',
        ],
      },
      {
        slug: 'mid',
        label: 'Mid / L4',
        titleSuffix: 'L4 / mid-level interview',
        yearsExp: '2-5 years',
        interviewPattern: [
          'Three coding rounds (45 min each), one Googleyness, one general cognitive abilities.',
          'Coding rounds expect medium-difficulty problems solved in 25-30 min with optimal complexity discussion.',
          'L4+ may include a "low-level design" round (LRU cache class, rate limiter — design at the API + data structure level, not full system).',
          'Looking for evidence of impact at past company, but team-fit and code quality outweigh sheer scope.',
        ],
        likelyQuestions: [
          'Design a thread-safe LRU cache class with O(1) get and put.',
          'Implement a rate limiter (token bucket or sliding window) — discuss tradeoffs.',
          'Word ladder / shortest path on a graph of strings.',
          'Serialize and deserialize a binary tree.',
          'Find the median of two sorted arrays.',
          'Tell me about a project where you had to influence engineers outside your team.',
          'Walk through a time you disagreed with a technical decision and what happened.',
          'What is the most complex bug you have shipped a fix for?',
          'How do you decide when to stop optimizing?',
          'What does "good enough" code look like to you?',
        ],
        levelRubric:
          'L4 is the hardest band to define because Google promotes externally to L4 from many backgrounds. The bar is consistent quality at the medium-difficulty level + at least one real production-impact story. Looking for "this person can own a feature end to end without supervision."',
        compRange: { gbp: '£105-140k base + ~£40k equity/year', usd: '$170-220k base + $80-130k stock/year', note: 'Levels.fyi L4 median 2024-25' },
        commonGaps: [
          'Lacking concrete production-impact stories — practice 3 STAR-format stories, each with metric outcomes.',
          'Coding round time-management; medium problems should take 20 min, not 35.',
          'Behavioural round under-preparation — Google takes Googleyness seriously and L4 candidates often skip prep here.',
        ],
      },
      {
        slug: 'senior',
        label: 'Senior / L5',
        titleSuffix: 'L5 / senior engineer interview',
        yearsExp: '5-9 years',
        interviewPattern: [
          'Two coding rounds, two system-design rounds, one Googleyness, one cognitive abilities.',
          'System design rounds explicitly test scaling, consistency tradeoffs, and component boundaries.',
          'Behavioural round becomes substantive — examples of leadership without authority, mentorship, technical influence.',
          'Hiring committee weighs system design + behavioural roughly equally with coding at this level.',
        ],
        likelyQuestions: [
          'Design YouTube\'s recommendation pipeline — focus on the data flow, not ML specifics.',
          'Design a global rate limiter for an API serving 1M requests/sec.',
          'Design Google Drive file storage — focus on the chunking + replication strategy.',
          'Design a distributed counter (think real-time view counts on YouTube).',
          'How would you scale a service from 1k QPS to 1M QPS? Walk through what breaks at each step.',
          'Tell me about the most complex technical decision you have led.',
          'Walk through a time you had to mentor a senior peer (yes, peer, not junior).',
          'What is a strong opinion you hold about software engineering that most engineers disagree with?',
          'Describe the most over-engineered system you have built and what you learned.',
          'How do you decide when to use a managed service vs. building in-house?',
        ],
        levelRubric:
          'L5 is "owns a feature end-to-end" → "owns a project with multiple engineers." Looking for technical breadth (can reason about systems beyond their own component), durability (3+ year tenure stories), and influence (others change behaviour because of this person).',
        compRange: { gbp: '£155-200k base + ~£90k equity/year', usd: '$220-310k base + $200-350k stock/year', note: 'Levels.fyi L5 median 2024-25; total comp $400-500k common at hub locations' },
        commonGaps: [
          'System design rounds where the candidate does not state assumptions or estimate scale before designing.',
          'Behavioural stories that name only what they did, not what they influenced others to do — L5 is about leverage.',
          'Failing to articulate when to push back on requirements vs. when to ship and iterate.',
        ],
      },
      {
        slug: 'staff',
        label: 'Staff / L6',
        titleSuffix: 'L6 / staff engineer interview',
        yearsExp: '8-12 years',
        interviewPattern: [
          'Two system-design rounds (one component-level, one cross-team), one coding round (medium-easy — proves you still code), two behavioural / leadership rounds, one cognitive abilities.',
          'Both behavioural rounds probe org-level impact — design docs read by 100+ engineers, deprecation programs, multi-quarter roadmaps.',
          'System design rounds are more abstract: "design the auth layer for a new product line" — open-ended, no clean answer.',
          'Hiring committee at L6 includes principal engineers and skip-level managers; calibration is unforgiving.',
        ],
        likelyQuestions: [
          'Design the consent + privacy infrastructure for a new product across Google\'s product surfaces.',
          'How would you redesign Bigtable today, knowing what you know now?',
          'Walk me through a design doc you authored that changed how a 30-person org operated.',
          'Tell me about a deprecation you led — how did you migrate users, what broke, what would you do differently?',
          'Describe a situation where you had to decide between technical correctness and business velocity.',
          'How do you make engineering decisions when the data is incomplete?',
          'Tell me about a time you were wrong about a technical direction. How did you recognise it and recover?',
          'How would you mentor a senior engineer who is technically strong but politically blocked?',
          'What is the highest-leverage thing you have done in your career, and how did you choose it over alternatives?',
          'Walk me through how you would structure a 3-year roadmap for a new infrastructure team.',
        ],
        levelRubric:
          'L6 is "drives multi-team initiatives." Looking for evidence the candidate has shaped engineering culture, written design docs that became canonical, and mentored other senior engineers. Promotion to L6 internally takes 2-3 years post-L5 minimum; external L6 hires are rare and heavily scrutinized.',
        compRange: { gbp: '£200-275k base + ~£170k equity/year', usd: '$280-400k base + $400-700k stock/year', note: 'Levels.fyi L6 median 2024-25; $700k-$1M total comp common at hub locations for top performers' },
        commonGaps: [
          'Conflating L5 work (project ownership) with L6 work (org influence) — the former does not get you to L6.',
          'Lacking written artifacts (design docs, blog posts, talks) that demonstrate intellectual reach beyond execution.',
          'Behavioural stories where the candidate is the lone hero — L6 stories are about enabling others to win.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager (L5/L6 management track)',
        titleSuffix: 'engineering manager interview',
        yearsExp: '5-10 years (mix of IC + management)',
        interviewPattern: [
          'Three behavioural / management rounds (people leadership, project management, technical leadership), one system-design round (proves you still understand the work), one Googleyness.',
          'No coding round at the manager track — but technical depth is checked in the system-design round and incidentally throughout behavioural rounds.',
          'One round will probe how you handle low-performers — Google specifically tests this.',
          'Reporting structure matters: managing 4 reports vs. managing 12 puts you in different bands.',
        ],
        likelyQuestions: [
          'Walk me through a performance management situation — including the outcome.',
          'How do you decide whether to promote someone vs. hire externally for the role?',
          'Tell me about a time you had to deliver a project under a hard deadline with insufficient resources.',
          'Describe a hiring decision you got wrong. How did you recognise it and recover?',
          'How do you balance individual coaching time with org-level work?',
          'Walk through a time you disagreed with your skip-level on a strategic decision.',
          'How do you measure team health beyond DORA metrics?',
          'Tell me about your engineering philosophy — what do you optimize for and why?',
          'How would you structure a team going from 5 to 15 engineers in 18 months?',
          'Design a feedback system for a team that has been silent on retros for the past quarter.',
        ],
        levelRubric:
          'EM track at Google is parallel to the IC ladder — L5/L6 EM ≈ L5/L6 IC in band but not in promotion velocity. Looking for: people leadership stories with measurable team outcomes, ability to deliver under constraints, and continued technical credibility (managers who cannot pass the system design round do not pass).',
        compRange: { gbp: '£170-250k base + ~£130k equity/year', usd: '$240-360k base + $300-550k stock/year', note: 'Levels.fyi EM median; varies heavily by team size and skip-level' },
        commonGaps: [
          'Lacking specific performance-management stories — Google interviewers explicitly probe this and "I never had to fire anyone" is a red flag at this level.',
          'Over-reporting individual technical contribution (you are interviewing for a manager role, lead with team outcomes).',
          'Failing the system-design round — managers who have been out of code for >2 years often blank on scaling fundamentals.',
        ],
      },
    ],
  },

  // ════════════ META ════════════
  {
    companySlug: 'meta',
    variants: [
      {
        slug: 'junior',
        label: 'E3 (entry / new grad)',
        titleSuffix: 'E3 new grad interview',
        yearsExp: '0-1 year',
        interviewPattern: [
          'Two coding rounds (45 min each, on CoderPad), one behavioural / "Jedi" round.',
          'No system design at E3.',
          'Coding rounds favour speed — 2 medium problems in 45 min is the bar, with clear communication throughout.',
          'Onsite is faster-paced than Google — Meta interviewers expect you to talk and code simultaneously.',
        ],
        likelyQuestions: [
          'Find the kth largest element in an unsorted array.',
          'Implement add and find for a TwoSum data structure.',
          'Validate a string of parentheses (with multiple bracket types).',
          'Reverse words in a string in-place.',
          'Find all anagrams of a pattern in a string (sliding window).',
          'Tell me about the project you are most proud of — what would you do differently?',
          'Why Meta? (Avoid generic answers — name a specific Meta product or engineering blog post.)',
          'Describe a time you got feedback that surprised you.',
          'How do you decide what to learn next?',
        ],
        levelRubric:
          'E3 candidates need to write working code fast, communicate clearly, and show signal for E4 within ~18 months. The Meta engineering culture values "move fast" — slow, perfectionist coders get a worse signal than fast iterators with one bug they catch in testing.',
        compRange: { gbp: '£80-100k base + ~£25k equity/year', usd: '$140-175k base + $40-75k stock/year', note: 'Levels.fyi E3 2024-25' },
        commonGaps: [
          'Silent coding — Meta wants narration throughout, not silent typing then explanation.',
          'Underweighting communication; the bar is "could I work with this person tomorrow?"',
          'Generic "Why Meta" answers — interviewers explicitly score whether you researched the company.',
        ],
      },
      {
        slug: 'mid',
        label: 'E4 (mid-level)',
        titleSuffix: 'E4 software engineer interview',
        yearsExp: '2-5 years',
        interviewPattern: [
          'Two coding rounds, one product-architecture round, one Jedi (behavioural).',
          'Product-architecture round at E4 is lightweight system design — focus on data model + API surface, not infra.',
          'Behavioural round will probe specific impact at past role — "what did you ship, how did it perform, what did you learn."',
          'Onsite cadence is faster than Google — fewer rounds, higher intensity per round.',
        ],
        likelyQuestions: [
          'Design the data model for a feature like Instagram Stories.',
          'Implement a thread-safe rate limiter.',
          'Find the longest substring with at most K distinct characters.',
          'Walk through your highest-impact ship in the last 12 months.',
          'Tell me about a time you had to push back on a product manager.',
          'How do you decide what tech debt to pay down vs. accept?',
          'Describe a bug that took you longer to fix than you expected. What slowed you down?',
          'How do you give feedback to a peer who is consistently late on commitments?',
          'What is your favourite Meta product and why?',
        ],
        levelRubric:
          'E4 is the most common level at Meta — the "owns features" tier. Looking for clean code under pressure, ability to discuss product tradeoffs (not just engineering ones), and a clear ship-impact story. Meta values "move fast" so prepare for interviewers to push pace.',
        compRange: { gbp: '£115-150k base + ~£70k equity/year', usd: '$190-235k base + $130-220k stock/year', note: 'Levels.fyi E4 median 2024-25' },
        commonGaps: [
          'Treating product-architecture round as full system design — it is much narrower at E4. Focus on the API + data model, not the full backend.',
          'Behavioural stories that omit the product context — Meta interviewers care about why you shipped what you shipped.',
          'Coding pace; E4 candidates often run out of time on the second problem.',
        ],
      },
      {
        slug: 'senior',
        label: 'E5 (senior software engineer)',
        titleSuffix: 'E5 senior engineer interview',
        yearsExp: '5-9 years',
        interviewPattern: [
          'Two coding, two system-design (one product-arch, one infra-style), two Jedi behavioural, one optional specialty round.',
          'System-design rounds expect concrete tradeoff articulation — "we choose Cassandra over Postgres because…" with specific reasons.',
          'Both Jedi rounds at E5 are substantive — leadership without authority, mentorship, navigating ambiguity.',
          'E5 is the most-hired senior IC level at Meta; calibration is tight but external hires are common.',
        ],
        likelyQuestions: [
          'Design Facebook News Feed ranking infrastructure (focus on the data flow, not the ML model itself).',
          'Design a global notification system (push + email + in-app), 1B users.',
          'Design Instagram\'s direct messaging — focus on consistency model and scale.',
          'Walk me through a system you redesigned. What was wrong with the original?',
          'Tell me about a time you led a project that involved 3+ engineering teams.',
          'Describe the highest-leverage thing you have done in the last year.',
          'Walk me through a time you mentored a peer through a hard technical decision.',
          'How do you decide when to escalate a blocker vs. solve it yourself?',
          'Tell me about a time your team was wrong about a technical decision. How did you handle it?',
          'What is the strongest engineering opinion you hold? Why might you be wrong?',
        ],
        levelRubric:
          'E5 is "owns projects with multi-team scope." Looking for evidence the candidate has shaped roadmaps, mentored peers, written design docs that influenced decisions across teams. The Meta engineering culture rewards bias-to-action — E5 candidates who waited for permission to act score lower than those who shipped and asked forgiveness.',
        compRange: { gbp: '£170-220k base + ~£140k equity/year', usd: '$245-320k base + $300-500k stock/year', note: 'Levels.fyi E5 median; total comp $500-700k at hub locations' },
        commonGaps: [
          'System-design rounds without explicit scale assumptions and capacity estimates — E5 bar requires this.',
          'Behavioural stories that focus on what the candidate did personally, not what they enabled others to do.',
          'Lacking artifacts (design docs, code reviews, RFCs) to point to as evidence of leadership.',
        ],
      },
      {
        slug: 'staff',
        label: 'E6 (staff engineer)',
        titleSuffix: 'E6 staff engineer interview',
        yearsExp: '8-12 years',
        interviewPattern: [
          'One coding (medium-easy), two system-design, three Jedi behavioural rounds (people, project, technical leadership).',
          'Behavioural rounds dominate at E6 — interviewers explicitly probe org-level impact and influence beyond own team.',
          'System-design rounds are more abstract — "design the auth platform for the next product line."',
          'Hiring committee at E6 includes E7+ engineers and director-level managers; bar is "this person should be promotable to E7 in 3-5 years."',
        ],
        likelyQuestions: [
          'Walk me through the design of a foundational system you built that other teams depend on today.',
          'Tell me about a deprecation or migration you led that affected 50+ engineers.',
          'How would you design Meta\'s identity / auth platform from scratch?',
          'Describe a situation where you had to push back on a director-level decision. What happened?',
          'Walk me through how you write a design doc — show me a real one.',
          'Tell me about a time you mentored an engineer who was technically strong but career-stuck. How did you help?',
          'How do you measure your own technical leverage?',
          'What is the most over-engineered system you have built? What did you learn?',
          'Describe a time you intentionally chose the slower / less-correct path because the alternative was politically blocked.',
          'How would you onboard a new E6 onto your team in their first 90 days?',
        ],
        levelRubric:
          'E6 is "shapes engineering culture across teams." Looking for: design docs that became canonical, deprecation programs led, mentorship of other senior engineers, public artifacts (talks, blog posts, OSS). Meta rarely hires E6 externally; most are promoted from within after 3-5 years at E5.',
        compRange: { gbp: '£220-310k base + ~£250k equity/year', usd: '$310-440k base + $500-900k stock/year', note: 'Levels.fyi E6 median; total comp $800k-$1.3M at hub locations for top performers' },
        commonGaps: [
          'Conflating E5 project ownership with E6 cross-team influence — the bar is fundamentally different.',
          'Behavioural stories that miss the "what did others do differently because of you" element.',
          'Lacking written or public artifacts that demonstrate intellectual reach beyond execution.',
        ],
      },
      {
        slug: 'manager',
        label: 'M1 / M2 (engineering manager)',
        titleSuffix: 'engineering manager interview',
        yearsExp: '5-10 years',
        interviewPattern: [
          'Three behavioural / management rounds (people, project, partnership), one system-design (technical credibility check), one Jedi.',
          'M1/M2 distinction is roughly direct-reports count and scope; M1 is single-team (4-8 reports), M2 is multi-team (manager-of-managers).',
          'Hiring panel includes a director and at least one peer EM; cross-functional partner (PM or designer) is common in the partnership round.',
          'Performance-management probing is standard — "tell me about a low performer" is asked at every level.',
        ],
        likelyQuestions: [
          'Tell me about the hardest performance-management situation you have handled.',
          'Walk me through how you ran your last hiring loop. What signal mattered most?',
          'How do you balance individual coaching with cross-team strategic work?',
          'Describe a time your team missed a major deadline. What did you do during, and after?',
          'How do you decide whether to promote internally or hire externally?',
          'Walk me through a partnership conflict with a PM. How did you resolve it?',
          'Describe how you manage a team that just lost a tenured senior engineer.',
          'Tell me about a time you disagreed with your skip-level on strategy. What happened?',
          'How do you ensure your team is shipping the most important work, not the most urgent?',
          'Design a feedback system for a team that has gone quiet on retros.',
        ],
        levelRubric:
          'EM at Meta sits parallel to the IC ladder — M1 ≈ E5 in band, M2 ≈ E6/E7. Looking for measurable people-leadership outcomes (promotions, retention, performance turnarounds), partnership stories that show credibility with PMs/designers, and continued technical credibility. Failing the system-design round disqualifies an EM regardless of behavioural strength.',
        compRange: { gbp: '£200-290k base + ~£190k equity/year', usd: '$280-400k base + $400-700k stock/year', note: 'Levels.fyi M1/M2; team-size-dependent' },
        commonGaps: [
          'Avoiding the "low performer" question — every Meta EM interview asks this directly.',
          'Over-reporting personal IC contribution; M1+ is judged on team outcomes, not individual ship counts.',
          'Failing system-design round; Meta does not accept "I have been a manager for 3 years and haven\'t coded" as an excuse.',
        ],
      },
    ],
  },

  // ════════════ AMAZON ════════════
  {
    companySlug: 'amazon',
    variants: [
      {
        slug: 'junior',
        label: 'SDE I (Software Development Engineer I)',
        titleSuffix: 'SDE I new grad interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'Online assessment (1-2 hours coding), then 4-5 onsite loops including a "bar raiser" round.',
          'Each round is structured around 1-2 Leadership Principles ("LPs") + a coding component for technical rounds.',
          'STAR format expected for every behavioural answer — situation, task, action, result. Interviewers explicitly score for it.',
          'Bar raiser is an interviewer from a different team whose job is to maintain hiring bar; their veto matters.',
        ],
        likelyQuestions: [
          'Tell me about a time you took on a project outside your formal responsibility (Ownership LP).',
          'Implement merge intervals.',
          'Find the k-closest points to the origin.',
          'Tell me about a time you disagreed with a peer (Have Backbone LP) — including the outcome.',
          'Reverse a linked list in groups of K.',
          'Tell me about a tight deadline you delivered on (Bias for Action LP).',
          'Implement a min-heap from scratch.',
          'Walk me through a project where you had to learn something new fast (Learn and Be Curious LP).',
          'Describe a time you made a mistake that cost the team (Earn Trust LP).',
        ],
        levelRubric:
          'SDE I bar is "can write working code, communicates clearly, demonstrates 2-3 LPs convincingly." Amazon weighs LPs equally with coding; even a perfect coding round can fail if LP answers are weak. Prepare 8-10 STAR-format stories that each cover a different LP.',
        compRange: { gbp: '£65-85k base + ~£15k stock/year', usd: '$110-150k base + $30-60k stock/year', note: 'Levels.fyi SDE I 2024-25' },
        commonGaps: [
          'Behavioural answers that skip the "result" — STAR without the R is incomplete.',
          'Not researching the LPs ahead of time; some candidates do not know them by name.',
          'Generic stories that do not name specific LPs the interviewer is probing for.',
        ],
      },
      {
        slug: 'mid',
        label: 'SDE II',
        titleSuffix: 'SDE II interview',
        yearsExp: '3-7 years',
        interviewPattern: [
          'Online assessment may or may not appear (varies by team). 5-round onsite is standard.',
          'Two coding rounds, one system-design (entry-level — focus on component boundaries, not full scale), two behavioural.',
          'Bar raiser still mandatory at SDE II; scrutiny on LPs increases.',
          'Hiring manager round will probe specific past-project depth — "what did you ship, what would you change."',
        ],
        likelyQuestions: [
          'Design a parking lot reservation system. Focus on the API and the data model.',
          'Tell me about a time you raised the bar for your team (Hire and Develop the Best LP).',
          'Implement a thread-safe queue.',
          'Walk me through a time you had to deliver under significant constraints (Frugality LP).',
          'Find the longest path in a binary tree.',
          'Tell me about a customer-facing decision you advocated for (Customer Obsession LP).',
          'How do you decide between buy and build for a new internal tool?',
          'Tell me about a time you simplified a complex process (Insist on the Highest Standards LP).',
          'Describe a time you took a calculated risk that did not work out.',
        ],
        levelRubric:
          'SDE II is "owns features end-to-end." Looking for clean code under pressure, real production-impact stories, and 4-5 LPs demonstrated convincingly. Amazon\'s "writing culture" matters here — interviewers will probe how you write design docs and one-pagers.',
        compRange: { gbp: '£100-130k base + ~£50k stock/year', usd: '$160-200k base + $80-150k stock/year', note: 'Levels.fyi SDE II median 2024-25' },
        commonGaps: [
          'Treating system-design round as if it were senior-level — SDE II is asked to design at the API + data model granularity, not to scale to 1B users.',
          'STAR stories that skip the conflict or risk — Amazon LPs explicitly probe for these.',
          'Underweighting "writing culture" — Amazon engineers write a lot of memos; demonstrate you can.',
        ],
      },
      {
        slug: 'senior',
        label: 'SDE III (Senior SDE)',
        titleSuffix: 'senior SDE interview',
        yearsExp: '7-12 years',
        interviewPattern: [
          'Two coding, two system-design, two behavioural, plus bar raiser.',
          'System-design rounds at L6 are full scale — design DynamoDB-like systems, S3-like systems, etc.',
          'Behavioural rounds substantively probe org-level impact — design docs, multi-team programs, mentorship.',
          'Bar raiser at this level is often a Principal Engineer; scrutiny on LPs is intense.',
        ],
        likelyQuestions: [
          'Design DynamoDB. Walk through partition strategy, replication, consistency tradeoffs.',
          'Design Amazon\'s order fulfillment pipeline at peak (Black Friday) scale.',
          'Tell me about a time you delivered a project at the highest standard despite organizational resistance (Insist on the Highest Standards + Have Backbone LPs together).',
          'Walk me through a deprecation or migration you led across multiple teams.',
          'Design a global feature flag system.',
          'Tell me about a time you raised your team\'s technical bar.',
          'How do you decide when a system needs a rewrite vs. an incremental fix?',
          'Walk through a design doc you authored that changed a team\'s direction.',
          'Tell me about the highest-leverage thing you have done in the past year.',
        ],
        levelRubric:
          'Senior SDE is "drives multi-team initiatives, owns architecture decisions for a service area." Looking for: design docs that became canonical, mentorship of other senior engineers, demonstrable bar-raising. Amazon\'s "writing culture" peaks at this level — bring 1-2 PR/FAQs you have authored.',
        compRange: { gbp: '£150-210k base + ~£140k stock/year', usd: '$220-330k base + $300-550k stock/year', note: 'Levels.fyi Senior SDE; total comp $400-700k at hub locations' },
        commonGaps: [
          'System-design rounds without explicit availability/consistency tradeoffs stated upfront.',
          'STAR stories that focus on personal contribution rather than team-level outcomes.',
          'Lacking a single strong "writing artifact" to point to — at Senior SDE level, your written work is the leverage.',
        ],
      },
      {
        slug: 'staff',
        label: 'Principal Engineer (L7)',
        titleSuffix: 'Principal Engineer interview',
        yearsExp: '12+ years',
        interviewPattern: [
          'One coding (medium, signal you still code), two system-design, three behavioural rounds focused on org-level leadership, bar raiser.',
          'Behavioural rounds at Principal level probe career-defining decisions — "tell me the most important technical decision of your career."',
          'System-design rounds are highly abstract — "design Amazon\'s next-generation data platform."',
          'Hiring panel includes Principal+ engineers and L8/L9 leaders; bar is "promotable to Senior Principal in 5+ years."',
        ],
        likelyQuestions: [
          'Tell me about the most important technical decision of your career and why.',
          'Walk me through a multi-year roadmap you have authored. What changed and why?',
          'Describe a time you changed the engineering culture of a 50+ person org.',
          'Design a globally distributed strongly-consistent data store. What tradeoffs would you defend?',
          'Tell me about an engineer you mentored to Senior. What was the leverage?',
          'Walk through a deprecation that affected 100+ services.',
          'How do you decide what is worth your personal time at Principal level?',
          'Describe a time you were wrong at scale. How did you recover?',
          'How would you onboard a new Principal Engineer onto your org in their first quarter?',
        ],
        levelRubric:
          'Principal Engineer is "shapes engineering direction across orgs." Looking for: multi-year written artifacts (PR/FAQs, design docs, technical strategy memos), demonstrable culture shifts, mentorship of Senior+ engineers. Amazon rarely hires Principal externally; most are promoted from Senior SDE after 3-5 years.',
        compRange: { gbp: '£230-340k base + ~£300k stock/year', usd: '$350-500k base + $700k-1.2M stock/year', note: 'Levels.fyi Principal; total comp $1M-1.7M for top performers' },
        commonGaps: [
          'Lacking written artifacts — at Principal level, your writing IS your work product.',
          'Behavioural stories that miss the org-level impact dimension.',
          'Underweighting the bar raiser at this level — Principal candidates have failed loops on bar-raiser veto alone.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager / Senior Manager',
        titleSuffix: 'engineering manager interview',
        yearsExp: '7-15 years',
        interviewPattern: [
          'Three management rounds (people, project, partner-facing), one technical-credibility round (system design), one bar raiser, one hiring-manager.',
          'EM bar raiser explicitly probes hiring decisions — "tell me about your last 5 hires and what you got right/wrong."',
          'Performance management is asked at every EM loop without exception.',
          'Senior Manager (L7+) loops include a written-exercise component — author a real org-strategy memo on the spot.',
        ],
        likelyQuestions: [
          'Walk me through your hardest performance-management decision.',
          'Tell me about your last 5 hires — what worked, what did not.',
          'Describe how you onboard a new senior engineer. Walk through their first 90 days.',
          'How do you decide whether to grow internally or hire externally for a senior role?',
          'Tell me about a partnership conflict with a Director-level peer. How did you resolve it?',
          'Describe how you handle a team where two senior engineers have a recurring disagreement.',
          'Walk through how you write a one-pager to your Director.',
          'Design a feedback culture for a team that has stopped doing retros.',
          'Tell me about a time you had to deliver a difficult message to your skip-level.',
        ],
        levelRubric:
          'EM at Amazon is parallel to the IC ladder — M3 ≈ Senior SDE, M4 ≈ Principal. Looking for: measurable team outcomes (promotions, retention, delivery), demonstrated hiring judgement, partnership credibility, and Amazon\'s LP framework deeply internalized. Performance management is a non-negotiable probe.',
        compRange: { gbp: '£180-280k base + ~£160k stock/year', usd: '$260-380k base + $350-650k stock/year', note: 'Levels.fyi EM; varies by team size and L7/L6 split' },
        commonGaps: [
          'Avoiding or under-answering the "last 5 hires" question — bar raisers explicitly probe this.',
          'Underweighting LP deep familiarity — Amazon EMs need to BE LP-fluent, not just demonstrate them.',
          'Lacking a written one-pager artifact to share when asked to walk through writing culture.',
        ],
      },
    ],
  },

  // ════════════ STRIPE ════════════
  {
    companySlug: 'stripe',
    variants: [
      {
        slug: 'junior',
        label: 'L2 Software Engineer (entry-level)',
        titleSuffix: 'L2 / entry-level interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'One online assessment, then 3-4 onsite-style rounds (mostly remote in 2026): two coding (one bug-fix, one greenfield), one design conversation, one values round.',
          'Stripe famously uses real bugs in their codebase for the bug-fix round — you get a code repo and an issue to triage.',
          'Coding rounds explicitly score code quality, tests, and incremental commits — not just correctness.',
          'Values round probes "rigorous thinking" — Stripe interviewers care about how you reason, not what you decide.',
        ],
        likelyQuestions: [
          'Here is a Ruby/Go/Python repo and a failing test. Find and fix the bug. Add a regression test.',
          'Implement a small but production-grade feature: a CLI for parsing CSVs with an unfamiliar format.',
          'Walk me through your reasoning when you do not know the answer to a technical question.',
          'How do you decide what tests to write?',
          'Tell me about a time you got feedback that surprised you.',
          'Describe a time you changed your mind about a technical opinion.',
          'What attracted you to Stripe specifically? (Avoid generic "I love Stripe\'s mission" — name a specific Stripe blog post or product.)',
        ],
        levelRubric:
          'L2 at Stripe needs to demonstrate clean code, tests-first thinking, and the ability to reason in writing. Stripe\'s "writing culture" is real — entry-level candidates who write clear PR descriptions on their take-home outscore stronger algorithmic coders who do not.',
        compRange: { gbp: '£75-95k base + ~£25k stock/year', usd: '$130-170k base + $40-90k stock/year', note: 'Levels.fyi Stripe L2 2024-25' },
        commonGaps: [
          'Coding without writing tests — Stripe interviewers explicitly score this.',
          'Generic "Why Stripe" answers — they probe specifically.',
          'Cutting corners on PR descriptions / commit messages during the take-home; presentation matters.',
        ],
      },
      {
        slug: 'mid',
        label: 'L3 Software Engineer',
        titleSuffix: 'L3 software engineer interview',
        yearsExp: '2-5 years',
        interviewPattern: [
          'Take-home (4-8 hour budget) followed by 4-round onsite — code review of the take-home, one debugging round, one design conversation, one values + collaboration round.',
          'The take-home is graded heavily on code quality, test coverage, README clarity, and PR-style commit history. Stripe explicitly cares about how you write more than how fast.',
          'Debugging round uses a real Stripe-shaped bug (web hooks failing intermittently, idempotency edge cases).',
          'Values round probes "rigorous thinking under pressure" — be ready to explain decisions and changes of mind.',
        ],
        likelyQuestions: [
          'Walk me through your take-home. What did you cut to fit in time?',
          'A webhook is firing twice. How do you debug it?',
          'Design a payment retry system that handles transient failures without double-charging.',
          'Tell me about a piece of code you wrote that you are most proud of. Why?',
          'How do you decide between modifying a working API vs. shipping a new one?',
          'Tell me about a technical decision you made that you later regretted.',
          'How do you balance moving fast with shipping correct code?',
          'Describe a code review you did that materially changed the design.',
        ],
        levelRubric:
          'L3 at Stripe is "owns features and writes clean, tested code." Stripe values "rigorous thinking" — the bar is clarity of reasoning, not raw speed. Strong code-review-and-PR culture means candidates who cannot articulate why they made each decision in their take-home fail the round.',
        compRange: { gbp: '£105-140k base + ~£60k stock/year', usd: '$170-220k base + $130-220k stock/year', note: 'Levels.fyi Stripe L3 2024-25' },
        commonGaps: [
          'Take-home submissions without thoughtful PR descriptions and tests.',
          'Verbalising reasoning that changes mid-sentence — Stripe wants you to articulate when you change your mind, not hide it.',
          'Underweighting writing culture — every L3 candidate is asked about how they write design docs.',
        ],
      },
      {
        slug: 'senior',
        label: 'L4 Senior Engineer',
        titleSuffix: 'senior engineer interview',
        yearsExp: '5-9 years',
        interviewPattern: [
          'Take-home (sometimes a longer paid take-home for senior+ candidates), 5-round onsite — code review of take-home, deep technical conversation, system-design, debugging-of-real-incident round, values + leadership round.',
          'Stripe is known for paid takehomes at senior+ — typically $500-1500 depending on length.',
          'System-design round expects production-grade depth — not "design Twitter" but "design our refunds system or our connected-accounts permissions model."',
          'Debugging round uses a real prior Stripe incident; candidates work through the postmortem-style thinking.',
        ],
        likelyQuestions: [
          'Walk me through your take-home. What did you cut, what did you over-engineer, and why?',
          'Design a refunds system that handles partial refunds, multiple currencies, and reversal of fees.',
          'A connected account is reporting balance discrepancies — walk me through how you investigate.',
          'Describe a technical decision that you led that 3+ engineers disagreed with.',
          'Tell me about a time you simplified a system that was over-engineered.',
          'How do you write a design doc? Show me a recent one.',
          'Describe an incident you led the postmortem for.',
          'Tell me about a code review where you changed someone\'s mind on architecture.',
          'What is the strongest engineering opinion you hold that most senior engineers disagree with?',
        ],
        levelRubric:
          'L4 at Stripe is "leads features with multi-team scope, mentors L3s, owns architecture for a service area." Looking for: writing samples (design docs, PR descriptions), demonstrable rigorous-thinking under pressure, ability to reason about distributed-systems edge cases. Stripe pays a premium for engineers who write well.',
        compRange: { gbp: '£155-200k base + ~£140k stock/year', usd: '$235-310k base + $280-500k stock/year', note: 'Levels.fyi L4 median; total comp $500-700k common' },
        commonGaps: [
          'Take-home that does not show design-doc-quality thinking — at L4 the take-home IS your design doc.',
          'System-design rounds without explicit failure-mode discussion (idempotency, double-write, eventual consistency).',
          'Lacking a writing artifact to point to when asked.',
        ],
      },
      {
        slug: 'staff',
        label: 'L5 Staff Engineer',
        titleSuffix: 'staff engineer interview',
        yearsExp: '8-12 years',
        interviewPattern: [
          'Long-form paid take-home (often $1500-3000 for a 1-2 week design exercise), 5-6 round onsite focused on system design + architectural leadership + writing.',
          'One round is a "writing exercise" — author a real design doc or one-pager on the spot.',
          'Hiring panel includes L6+ engineers and director-level managers.',
          'Stripe rarely hires L5 externally; most are promoted from L4 after 3+ years.',
        ],
        likelyQuestions: [
          'Walk me through your design-doc-style take-home. Where did you change your mind?',
          'Design Stripe\'s identity-and-permissions platform from scratch.',
          'Tell me about a multi-team initiative you led. What did you write, what did you delegate?',
          'Describe how you mentor a senior engineer who is stuck in their career.',
          'Walk me through how you would approach a 12-month technical-strategy memo for a service area.',
          'Tell me about a deprecation you led across 5+ teams.',
          'How do you decide what to write down and what to leave verbal?',
          'Describe a time you were technically wrong and had to course-correct an org.',
          'What is the highest-leverage thing you have written in the past year?',
        ],
        levelRubric:
          'L5 / Staff Engineer at Stripe is "shapes architecture across teams, owns multi-quarter roadmaps, writes the canonical design docs." Looking for: substantial written artifacts (memos, design docs, technical strategy), demonstrable culture shifts, mentorship of senior engineers. Stripe\'s writing-as-thinking culture peaks here.',
        compRange: { gbp: '£200-275k base + ~£250k stock/year', usd: '$310-440k base + $500-900k stock/year', note: 'Levels.fyi L5 median; total comp $800k-$1.3M for top performers' },
        commonGaps: [
          'Lacking 2-3 written design docs to bring to the loop — at L5, the writing IS the work.',
          'Behavioural stories that show personal execution rather than org-level influence.',
          'Underweighting the writing-exercise round — even strong senior engineers fail this when unprepared.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager (L4M / L5M)',
        titleSuffix: 'engineering manager interview',
        yearsExp: '6-12 years',
        interviewPattern: [
          'Behavioural-heavy: 3-4 management rounds (people, project, partnership), one technical-credibility round, one writing exercise, one cross-functional round (PM + designer perspective).',
          'Writing exercise asks you to author a one-pager addressing a real management situation.',
          'No coding round at EM track, but technical credibility is checked in the system-design conversation.',
          'L4M is single-team manager, L5M is manager-of-managers.',
        ],
        likelyQuestions: [
          'Walk me through how you wrote your last performance-review cycle.',
          'Tell me about your hardest hiring decision.',
          'Describe how you balance individual coaching time with org-level work.',
          'Walk me through a partnership conflict with a PM. How did you resolve it?',
          'Tell me about a low performer you successfully turned around.',
          'How do you decide whether to grow internally or hire externally?',
          'Describe how you ran your last 1-1 with your skip-level.',
          'Walk through a one-pager you wrote to influence a director-level decision.',
          'How do you handle a senior engineer who is technically strong but politically blocked?',
        ],
        levelRubric:
          'EM at Stripe is parallel to the IC track. L4M ≈ L4 IC, L5M ≈ L5 IC. Stripe values writing in management as much as in engineering — a manager who cannot write a clear one-pager fails the loop regardless of behavioural strength. Performance management is probed at every level.',
        compRange: { gbp: '£175-260k base + ~£170k stock/year', usd: '$280-410k base + $400-700k stock/year', note: 'Levels.fyi Stripe EM; varies by team size + IC-equivalent level' },
        commonGaps: [
          'Lacking a written one-pager artifact to bring to the writing exercise.',
          'Avoiding the "low performer" probe — Stripe explicitly tests this at EM level.',
          'Underweighting partnership credibility; PM/designer interviewers carry hiring weight.',
        ],
      },
    ],
  },
  // ════════════ MICROSOFT ════════════
  {
    companySlug: 'microsoft',
    variants: [
      {
        slug: 'junior',
        label: 'SDE / 59 (entry-level)',
        titleSuffix: 'SDE 59 / new grad interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'Online assessment (90-min coding) followed by 4-5 onsite loops.',
          'Two coding rounds at the medium-difficulty level, one design conversation, one "growth-mindset" behavioural round, one as-appropriate (manager).',
          'Microsoft\'s growth-mindset rubric explicitly probes how candidates respond to feedback and failure.',
          'Each loop interviewer gives an explicit hire/no-hire vote; recruiter aggregates.',
        ],
        likelyQuestions: [
          'Implement BFS and DFS on a graph — when do you choose each?',
          'Validate a sudoku board.',
          'Reverse the words in a sentence (in-place if possible).',
          'Tell me about a time you got feedback you initially disagreed with. How did your view evolve?',
          'Describe a project where you had to learn a new language or framework on the job.',
          'Why Microsoft, specifically? (Avoid generic — name a specific Microsoft product or recent engineering blog.)',
          'How do you decide what to test vs. trust the framework?',
          'Tell me about a bug that was harder than you expected to fix.',
        ],
        levelRubric:
          'SDE 59 bar is "writes correct code at medium difficulty + has demonstrable growth mindset + can articulate technical reasoning clearly." Microsoft explicitly weighs the growth-mindset rubric — candidates who treat feedback as a personal critique score lower than those who incorporate it visibly.',
        compRange: { gbp: '£60-80k base + ~£15k stock/year', usd: '$110-145k base + $25-50k stock/year', note: 'Levels.fyi Microsoft 59 2024-25' },
        commonGaps: [
          'Defensive responses to feedback in behavioural round — growth mindset is the explicit rubric.',
          'Generic "Why Microsoft" — they probe specifically, often around Azure, Copilot, or specific eng blog posts.',
          'Coding pace; new grads often run out of time on the second medium problem.',
        ],
      },
      {
        slug: 'mid',
        label: 'SDE II / 61',
        titleSuffix: 'SDE II / 61 interview',
        yearsExp: '2-5 years',
        interviewPattern: [
          'Online assessment + 4-5 loops including a hiring-manager round.',
          'Two coding (medium + medium-hard), one component-level design, one growth-mindset deep-dive, one hiring-manager round.',
          'Hiring manager probes ship history, code-review-and-PR culture, and team-fit.',
          'Microsoft\'s "as-appropriate" round (often a senior IC) gives technical-depth signal.',
        ],
        likelyQuestions: [
          'Design a thread-safe blocking queue. Walk through what tests you would write.',
          'Implement a basic key-value cache with TTL.',
          'Topological sort on a dependency graph; explain when it fails.',
          'Tell me about your highest-impact ship in the last 12 months.',
          'Walk me through a code review that materially changed someone\'s design.',
          'Describe a time you had to debug a flaky test.',
          'How do you decide what tech debt is worth paying down?',
          'Tell me about your favourite tool in your stack and why.',
        ],
        levelRubric:
          'SDE II / 61 is "owns features end-to-end, mentors entry-level engineers, contributes to team culture." Microsoft values shipped impact and code-quality habits over algorithmic showmanship. Strong candidates bring real PR-review or design-doc artifacts to the conversation.',
        compRange: { gbp: '£90-120k base + ~£40k stock/year', usd: '$160-205k base + $70-130k stock/year', note: 'Levels.fyi Microsoft 61 median 2024-25' },
        commonGaps: [
          'Treating component-level design as a full-stack scaling exercise — the bar is "design at the API + data structure level."',
          'Behavioural answers without metric outcomes — Microsoft interviewers explicitly prompt for impact numbers.',
          'Underweighting the growth-mindset rubric; this is not a soft round.',
        ],
      },
      {
        slug: 'senior',
        label: 'Senior SDE / 63',
        titleSuffix: 'Senior SDE 63 interview',
        yearsExp: '5-9 years',
        interviewPattern: [
          'Two coding (one medium, one harder), two system-design (one product-architecture, one infra-style), one growth-mindset, one hiring-manager.',
          'System-design rounds probe scaling, partitioning, replication tradeoffs explicitly.',
          'Behavioural rounds at Senior level probe leadership without authority and cross-team collaboration.',
          'Hiring panel includes a Principal-track engineer; technical-depth signal matters as much as behavioural.',
        ],
        likelyQuestions: [
          'Design Microsoft Teams chat infrastructure for 100M users.',
          'Design Azure Blob Storage. Focus on consistency model and replication strategy.',
          'Walk me through a system you redesigned. What was wrong, what changed.',
          'Tell me about a time you led a project that involved 3+ engineering teams.',
          'Describe a technical decision where you had to push back on senior leadership.',
          'How do you mentor a peer who is technically strong but career-stuck?',
          'What is the strongest engineering opinion you hold, and why might you be wrong?',
          'Tell me about an incident postmortem you led. What changed because of it?',
        ],
        levelRubric:
          'Senior SDE 63 is "drives projects with multi-team scope, owns architecture for a service area, mentors mid-level engineers." Looking for: design docs that became canonical, demonstrable bar-raising on code quality, ability to articulate why technical decisions were correct (or weren\'t).',
        compRange: { gbp: '£135-185k base + ~£90k stock/year', usd: '$200-285k base + $200-400k stock/year', note: 'Levels.fyi Senior SDE 63 median; total comp $400-600k at hub locations' },
        commonGaps: [
          'System-design rounds without explicit availability/consistency tradeoffs articulated upfront.',
          'Behavioural stories where the candidate is the lone hero — Senior is judged on what others did differently because of them.',
          'Lacking written artifacts (design docs, blog posts) to point to.',
        ],
      },
      {
        slug: 'staff',
        label: 'Principal SDE / 65 / 66',
        titleSuffix: 'Principal SDE interview',
        yearsExp: '8-13 years',
        interviewPattern: [
          'One coding (medium, signal you still code), two system-design (more abstract), three behavioural / leadership rounds, one hiring-manager.',
          'Behavioural rounds at Principal probe org-level impact — design docs read by 100+ engineers, multi-quarter roadmaps, deprecation programs.',
          'System-design rounds become "design Azure\'s next-generation X" — open-ended, no clean answer.',
          'Hiring panel includes Partner Engineers and director-level managers; calibration is unforgiving.',
        ],
        likelyQuestions: [
          'Walk me through the design of a foundational system you built that other teams depend on.',
          'Describe a technical-strategy memo you authored that changed your org\'s direction.',
          'How would you redesign Azure\'s identity and access management today, knowing what you know now?',
          'Tell me about a deprecation you led that affected 50+ engineers.',
          'Describe how you mentored an engineer to Principal level.',
          'What is the highest-leverage thing you have done in your career?',
          'Walk me through how you write a 3-year technical roadmap.',
          'Tell me about a time you were wrong at scale.',
        ],
        levelRubric:
          'Principal SDE 65/66 at Microsoft is "shapes engineering culture across orgs." Looking for: written artifacts (memos, design docs, OSS) that demonstrate intellectual reach, mentorship of Senior+ engineers, multi-year written roadmaps. Microsoft rarely hires Principal externally.',
        compRange: { gbp: '£200-300k base + ~£200k stock/year', usd: '$320-460k base + $500-900k stock/year', note: 'Levels.fyi Principal SDE; total comp $700k-$1.2M for top performers' },
        commonGaps: [
          'Behavioural stories that miss org-level impact — Principal bar requires it.',
          'Lacking written artifacts. At Principal level your written work is the leverage.',
          'Conflating Senior project-ownership stories with Principal multi-team-influence stories.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager (62-65 management track)',
        titleSuffix: 'engineering manager interview',
        yearsExp: '5-12 years',
        interviewPattern: [
          'Three management rounds (people, project, partnership), one technical-credibility round, one growth-mindset, one hiring-manager.',
          'Microsoft\'s "Model Coach Care" framework is explicitly probed in management rounds.',
          'Performance management is asked at every level.',
          'Cross-functional round often includes a PM or designer evaluator.',
        ],
        likelyQuestions: [
          'Walk me through your hardest performance-management decision.',
          'How do you apply Microsoft\'s "Model Coach Care" framework day-to-day?',
          'Tell me about your last 5 hires — what worked, what did not.',
          'Describe a time you turned around a low-performer.',
          'How do you balance individual coaching with strategic work?',
          'Walk me through a partnership conflict with a PM. Outcome?',
          'How do you measure team health beyond delivery metrics?',
          'Tell me about a time you disagreed with your skip-level on strategy.',
        ],
        levelRubric:
          'EM at Microsoft is parallel to IC. M62 ≈ Senior SDE in band, M64 ≈ Principal. Microsoft values "Model Coach Care" deeply — a manager who cannot articulate this framework with examples fails the loop. Continued technical credibility is checked.',
        compRange: { gbp: '£155-235k base + ~£150k stock/year', usd: '$240-360k base + $300-600k stock/year', note: 'Levels.fyi Microsoft EM; varies by team size and level' },
        commonGaps: [
          'Vague responses to "Model Coach Care" probing — Microsoft expects fluency.',
          'Avoiding the performance-management probe.',
          'Failing the technical-credibility round — managers out of code for >2 years often blank on scaling fundamentals.',
        ],
      },
    ],
  },

  // ════════════ OPENAI ════════════
  {
    companySlug: 'openai',
    variants: [
      {
        slug: 'junior',
        label: 'Member of Technical Staff (entry / new grad)',
        titleSuffix: 'MTS new grad interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'Paid take-home (typically $1000-$2000 for ~8 hours of work), then 4-5 round virtual onsite.',
          'Take-home is heavily weighted; failing it ends the loop. Real-product-flavoured task (build something small that uses an LLM well).',
          'Onsite includes one coding round, one ML / systems depth round (depending on track), one mission-fit / values round, one team-specific.',
          'Mission-fit round explicitly probes alignment with OpenAI\'s safety + research goals.',
        ],
        likelyQuestions: [
          'Walk me through your take-home. What did you cut?',
          'Implement a token-counting class for a specific tokenizer.',
          'Why OpenAI specifically? What would you not work on, and why?',
          'Describe a side project you built with LLMs. What surprised you?',
          'How do you stay current on ML research?',
          'Tell me about a time you went deep on a problem outside your formal scope.',
          'What does "AGI safety" mean to you in 2026?',
        ],
        levelRubric:
          'MTS entry-level at OpenAI heavily weighs take-home quality + mission-fit. Looking for: clean code with strong test coverage, demonstrable ML curiosity (open-source contributions, public side projects), and articulated alignment with OpenAI\'s mission. Generic "I want to work on AI" responses fail the mission-fit round.',
        compRange: { gbp: '£100-140k base + ~£60k equity/year (PPUs)', usd: '$200-280k base + $200-400k PPUs/year', note: 'OpenAI MTS 2024-25 base + Profit Participation Units; total comp $400-600k' },
        commonGaps: [
          'Take-home with weak tests or unclear README — OpenAI scores presentation.',
          'Mission-fit answers that lack specificity about OpenAI\'s research direction.',
          'No public artifacts (GitHub, blog posts, papers) for an entry-level ML role.',
        ],
      },
      {
        slug: 'mid',
        label: 'MTS (mid-level Member of Technical Staff)',
        titleSuffix: 'mid-level MTS interview',
        yearsExp: '3-6 years',
        interviewPattern: [
          'Longer paid take-home ($2000-$4000), 5-round onsite focused on shipping production systems + ML depth.',
          'Take-home graded for production-readiness — error handling, logging, observability, idempotency.',
          'Coding round at this level often involves debugging a real prior incident or an open issue.',
          'Mission-fit round becomes a 60-min philosophical conversation about safety + scaling.',
        ],
        likelyQuestions: [
          'Walk me through your take-home. What design tradeoffs did you make?',
          'Design a system that serves an LLM at 10K QPS with strict latency targets.',
          'Tell me about a time you shipped a feature that touched production ML systems.',
          'Describe a debugging session where the bug was in your model, not your code.',
          'How would you build evals for a feature like ChatGPT memory?',
          'What is the most important paper you read in 2025? Why?',
          'Walk me through how you would think about safety implications of a new capability.',
        ],
        levelRubric:
          'Mid-MTS bar at OpenAI is "ships production-grade ML systems, has shipped real evals or fine-tunes, can reason about safety implications of capability changes." Looking for: open-source artifacts at scale, demonstrable production ML experience (not just notebook work), and substantive engagement with OpenAI\'s research agenda.',
        compRange: { gbp: '£140-200k base + ~£150k PPUs/year', usd: '$280-385k base + $400-700k PPUs/year', note: 'OpenAI mid-MTS; total comp $700k-$1M' },
        commonGaps: [
          'Take-home that stops at "it works" without observability or test depth.',
          'Mission-fit answers that treat safety as marketing rather than a real engineering constraint.',
          'No production-ML stories — only notebook / research work.',
        ],
      },
      {
        slug: 'senior',
        label: 'Senior MTS',
        titleSuffix: 'Senior MTS interview',
        yearsExp: '6-10 years',
        interviewPattern: [
          'Long paid take-home ($3000-$5000, ~12 hours), 6-round onsite with deep technical + leadership probing.',
          'Take-home becomes a design exercise more than a code exercise — write a small system AND its design doc.',
          'Two-round mission/values block at this level — explicitly probes long-term commitment to OpenAI\'s direction.',
          'Hiring panel includes principal-track ICs; the bar is "demonstrably the best at something specific."',
        ],
        likelyQuestions: [
          'Walk me through the design doc from your take-home. Where would you cut, and where would you double down?',
          'How would you architect a multi-tenant LLM serving infrastructure?',
          'Describe a research-to-production handoff you led.',
          'Tell me about a time you killed a project. Why?',
          'What is your favourite paper from the last 18 months and how does it inform your thinking?',
          'Walk me through how you would build an eval harness from scratch.',
          'Tell me about a senior engineer you mentored. What changed because of you?',
          'What is the strongest engineering opinion you hold about ML systems?',
        ],
        levelRubric:
          'Senior MTS at OpenAI is "owns a research or systems area end-to-end, mentors mid-level MTS, writes the design docs others reference." Looking for: substantial public artifacts (papers, blog posts, OSS), evidence of cross-team influence, and articulated long-term commitment to alignment / safety as engineering constraints.',
        compRange: { gbp: '£185-260k base + ~£250k PPUs/year', usd: '$360-500k base + $700k-1.2M PPUs/year', note: 'OpenAI Senior MTS; total comp $1M-$1.7M for top performers' },
        commonGaps: [
          'Take-home that stops at "it works" — at Senior you are writing the design doc.',
          'Behavioural stories that focus on personal execution, not research-to-production leadership.',
          'Vague answers to "what paper informs your thinking" — OpenAI expects you to be reading the field.',
        ],
      },
      {
        slug: 'staff',
        label: 'Staff / Principal-level MTS',
        titleSuffix: 'Staff MTS interview',
        yearsExp: '10+ years',
        interviewPattern: [
          'Long paid design exercise ($5000+, 1-2 weeks). 6-7 round onsite probing org-level technical leadership and research-direction-setting.',
          'Behavioural rounds at this level explicitly probe research direction-setting and influencing the broader ML community.',
          'Hiring panel includes Distinguished-track engineers and senior research leaders.',
          'External hires at this level are rare; OpenAI mostly promotes internally.',
        ],
        likelyQuestions: [
          'Walk me through the most important technical decision of your career.',
          'Describe a research area you would push OpenAI toward, and why.',
          'Tell me about a paper / system you built that influenced others outside your org.',
          'How would you structure a 3-year technical strategy for a frontier model serving stack?',
          'Tell me about a time you killed a project that the org was emotionally invested in.',
          'What is the highest-leverage thing you have written or built in the past two years?',
          'How do you decide what to spend your personal research time on?',
          'Tell me about an engineer you mentored to Senior MTS.',
        ],
        levelRubric:
          'Staff/Principal MTS at OpenAI is "shapes research and engineering direction across the org." Looking for: published papers, public OSS, mentorship of Senior+ engineers, multi-year technical strategy artifacts, demonstrable influence outside OpenAI. Failing the public-artifacts test ends the loop.',
        compRange: { gbp: '£230-340k base + ~£400k PPUs/year', usd: '$460-650k base + $1.1M-2M PPUs/year', note: 'OpenAI Staff/Principal; total comp $1.5M-$3M for top performers' },
        commonGaps: [
          'Lacking public artifacts — at Staff level your published work IS your leverage.',
          'Treating safety as a separate concern from engineering — at OpenAI it is foundational.',
          'Behavioural stories that miss the org-level direction-setting dimension.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager / Research Manager',
        titleSuffix: 'engineering / research manager interview',
        yearsExp: '6-12 years',
        interviewPattern: [
          'Three management rounds, one technical-credibility round, one research-strategy round (for research managers), one mission-fit deep-dive.',
          'OpenAI EM track is harder than typical EM tracks — managers are expected to remain technically active and contribute to research / engineering directly.',
          'Mission-fit round at EM level explicitly probes how the candidate makes safety-vs-capability tradeoffs.',
          'Hiring panel includes a director and a Senior MTS+ peer.',
        ],
        likelyQuestions: [
          'Walk me through your hardest hiring decision.',
          'Describe how you handled a senior engineer pushing back on your team\'s direction.',
          'How do you balance individual coaching with hands-on technical contribution?',
          'Walk me through a research-to-production decision you made under uncertainty.',
          'Tell me about a time you turned around a low-performer.',
          'How do you think about safety vs. shipping speed in your team?',
          'Describe a research direction you killed and why.',
          'What is your engineering management philosophy?',
        ],
        levelRubric:
          'EM at OpenAI is "leads a small team of senior MTS, makes safety-vs-capability tradeoffs, contributes technically." Looking for: hiring judgement at high bar, technical contribution evidence (not just management overhead), articulated safety philosophy. OpenAI EMs who cannot pass technical-credibility round fail.',
        compRange: { gbp: '£210-320k base + ~£300k PPUs/year', usd: '$420-580k base + $700k-1.5M PPUs/year', note: 'OpenAI EM; varies heavily by team size and IC track' },
        commonGaps: [
          'Failing technical-credibility round — OpenAI EMs are expected to code/build alongside ICs.',
          'Vague safety philosophy — interviewers explicitly probe specifics.',
          'Hiring judgement stories without high-bar specifics.',
        ],
      },
    ],
  },

  // ════════════ ANTHROPIC ════════════
  {
    companySlug: 'anthropic',
    variants: [
      {
        slug: 'junior',
        label: 'New grad / entry-level researcher or engineer',
        titleSuffix: 'new grad interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'Long paid take-home ($1500-$3000 for 8-12 hours), then 4-5 onsite rounds focused on technical depth + Responsible Scaling Policy alignment.',
          'Take-home is real product-shaped — build a small evaluation tool, fine-tune-prompt-based system, or interpret a model output.',
          'Mission-fit round explicitly references the Responsible Scaling Policy (RSP) and probes how candidates think about safety.',
          'Anthropic engineering culture values "constitutional" thinking — candidates who treat safety as a checkbox fail this round.',
        ],
        likelyQuestions: [
          'Walk me through your take-home. What did you cut and why?',
          'Implement a basic transformer-attention layer in PyTorch.',
          'Why Anthropic specifically? What is the Responsible Scaling Policy?',
          'Describe a project where you went deep into a problem outside your formal scope.',
          'What is your favourite paper from the last 12 months and why?',
          'Tell me about an open-source contribution you made.',
          'How would you test that an LLM is "safe" for a specific use case?',
        ],
        levelRubric:
          'Entry-level at Anthropic heavily weighs take-home + mission-fit. Looking for: clean code, demonstrable engagement with the field (papers, OSS, side projects), and articulated thinking about safety as a real engineering constraint. Anthropic values intellectual curiosity over raw algorithmic skill at entry level.',
        compRange: { gbp: '£100-145k base + ~£70k equity/year', usd: '$200-290k base + $200-450k equity/year', note: 'Anthropic 2024-25; total comp $400-700k' },
        commonGaps: [
          'Take-home without test coverage or safety reasoning notes.',
          'Mission-fit answers that frame safety as PR rather than engineering.',
          'No public artifacts (GitHub, blog, papers) — Anthropic expects this even at entry level.',
        ],
      },
      {
        slug: 'mid',
        label: 'Mid-level (2-6 years post-grad / industry equivalent)',
        titleSuffix: 'mid-level interview',
        yearsExp: '3-6 years',
        interviewPattern: [
          'Long paid take-home ($2500-$4000), 5-round onsite — coding, ML systems depth, alignment / RSP, hiring manager, one team-specific.',
          'Take-home graded for production-readiness AND alignment-thinking — handle edge cases that have safety implications.',
          'Alignment round becomes substantive at mid-level — bring specific examples of constraint-driven engineering decisions you have made.',
          'Hiring panel often includes a research scientist; technical depth in ML is checked beyond mere systems familiarity.',
        ],
        likelyQuestions: [
          'Walk me through your take-home. Where did you make safety-relevant tradeoffs?',
          'Design a system that serves Claude with strict latency + safety guarantees.',
          'Tell me about a production ML system you owned. What broke and how did you fix it?',
          'How would you build evals for a feature like Claude Code?',
          'What is the most important paper in alignment research from the last 12 months?',
          'Describe a constraint that improved your engineering outcomes.',
          'Walk me through how you would think about deploying a new capability under the RSP.',
          'Tell me about an open-source contribution that shaped your thinking.',
        ],
        levelRubric:
          'Mid-level at Anthropic is "ships production ML systems, has substantive views on alignment, engages with the research community." Looking for: real production ML experience, articulated views on alignment tradeoffs, public artifacts demonstrating engagement with the field.',
        compRange: { gbp: '£140-200k base + ~£170k equity/year', usd: '$280-400k base + $400-800k equity/year', note: 'Anthropic mid-level; total comp $700k-$1.2M' },
        commonGaps: [
          'Treating alignment as a separate concern from engineering.',
          'Take-home that lacks safety-edge-case handling.',
          'Vague responses on RSP — Anthropic expects you to have read it.',
        ],
      },
      {
        slug: 'senior',
        label: 'Senior',
        titleSuffix: 'Senior engineer / researcher interview',
        yearsExp: '6-10 years',
        interviewPattern: [
          'Long paid design + code take-home ($3000-$6000), 6-round onsite with deep alignment + technical leadership probing.',
          'Take-home is design + code combined — write a small system and the design doc.',
          'Two alignment / RSP rounds at this level — substantive, not ceremonial.',
          'Hiring panel includes Senior+ ICs and research leadership.',
        ],
        likelyQuestions: [
          'Walk me through the design doc from your take-home. Where would you push back on yourself?',
          'How would you architect Claude Code\'s tool-use infrastructure?',
          'Describe a research-to-production handoff you led.',
          'Tell me about a project you killed and why.',
          'What is your view on capabilities-vs-alignment tradeoffs in 2026?',
          'Walk me through how you would build evals for a new capability under the RSP.',
          'Tell me about a senior engineer you mentored. What changed because of you?',
          'What is the strongest opinion you hold about ML safety, and why might you be wrong?',
        ],
        levelRubric:
          'Senior at Anthropic is "owns a research or systems area, mentors mid-level engineers, writes design docs that shape decisions, contributes to alignment thinking." Looking for: substantial public artifacts, demonstrable cross-team influence, articulated alignment philosophy that survives 60-min cross-examination.',
        compRange: { gbp: '£185-275k base + ~£280k equity/year', usd: '$370-540k base + $700k-1.4M equity/year', note: 'Anthropic Senior; total comp $1.1M-$1.9M for top performers' },
        commonGaps: [
          'Alignment views that collapse under cross-examination.',
          'Behavioural stories that focus on personal execution, not research-to-production leadership.',
          'Lacking public artifacts to point to.',
        ],
      },
      {
        slug: 'staff',
        label: 'Staff / Principal-level',
        titleSuffix: 'Staff engineer interview',
        yearsExp: '10+ years',
        interviewPattern: [
          'Long paid design exercise (1-2 weeks, $5000+). 6-7 round onsite probing org-level technical and alignment leadership.',
          'Behavioural rounds explicitly probe research direction-setting + alignment-philosophy depth.',
          'Hiring panel includes Distinguished-track engineers and senior alignment researchers.',
          'External Staff hires are rare; Anthropic typically promotes internally.',
        ],
        likelyQuestions: [
          'Walk me through the most important technical or research decision of your career.',
          'Describe a research direction you would push Anthropic toward, and why.',
          'How would you structure a 3-year technical strategy for Claude\'s serving infrastructure?',
          'Tell me about a paper or system you built that influenced others outside Anthropic.',
          'Tell me about a time you killed a project the org was emotionally invested in.',
          'How do you decide what to spend your personal research time on?',
          'Walk me through your alignment philosophy and where it might be wrong.',
          'Describe an engineer you mentored to Senior. What was the leverage?',
        ],
        levelRubric:
          'Staff at Anthropic is "shapes research and engineering direction across the org." Looking for: published papers, OSS contributions, mentorship of Senior+, multi-year technical strategy artifacts, alignment philosophy that holds up under deep scrutiny. Public artifacts are mandatory at this level.',
        compRange: { gbp: '£235-360k base + ~£450k equity/year', usd: '$470-700k base + $1.2M-2.5M equity/year', note: 'Anthropic Staff; total comp $1.7M-$3.5M for top performers' },
        commonGaps: [
          'No public artifacts — at Staff level published work is the leverage.',
          'Alignment philosophy that does not engage with current research disagreements.',
          'Behavioural stories that miss org-level influence.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager / Research Manager',
        titleSuffix: 'engineering manager interview',
        yearsExp: '6-12 years',
        interviewPattern: [
          'Three management rounds, one technical-credibility round, one alignment / RSP deep-dive, one team-specific.',
          'EM track at Anthropic is harder than typical — managers are expected to remain technically active.',
          'Alignment round at EM level explicitly probes how the candidate makes safety-vs-shipping tradeoffs in practice.',
          'Hiring panel includes a director, a senior IC peer, and (for research managers) a research scientist.',
        ],
        likelyQuestions: [
          'Walk me through your hardest hiring decision.',
          'How do you balance hands-on technical contribution with management work?',
          'Describe how you make safety-vs-shipping tradeoffs in practice.',
          'Tell me about a time you handled disagreement between two senior engineers on a research direction.',
          'How do you think about RSP commitments at the team level?',
          'Walk me through how you ran your last performance review cycle.',
          'Tell me about a research direction you killed and why.',
          'How do you measure your team\'s engineering output beyond shipped features?',
        ],
        levelRubric:
          'EM at Anthropic is "leads a small team, makes safety-vs-shipping tradeoffs, contributes technically, articulates alignment philosophy." Anthropic EMs who cannot pass the technical or alignment round fail. Hiring judgement is heavily weighted given the talent density.',
        compRange: { gbp: '£215-330k base + ~£330k equity/year', usd: '$430-620k base + $800k-1.6M equity/year', note: 'Anthropic EM; total comp $1.3M-$2.3M' },
        commonGaps: [
          'Failing technical-credibility round — Anthropic EMs are expected to remain hands-on.',
          'Alignment views that collapse under cross-examination at EM level (less acceptable than at IC).',
          'Hiring judgement without high-bar specifics — talent density at Anthropic raises the bar.',
        ],
      },
    ],
  },

  // ════════════ APPLE ════════════
  {
    companySlug: 'apple',
    variants: [
      {
        slug: 'junior',
        label: 'ICT2 / new grad SWE',
        titleSuffix: 'ICT2 / new grad interview',
        yearsExp: '0-2 years',
        interviewPattern: [
          'Recruiter screen, hiring manager screen, then 5-6 round onsite (much longer than industry-typical).',
          'Two-three coding rounds at medium difficulty, one design conversation, one team-fit, one cross-team panel.',
          'Apple\'s loop is heavily team-specific; same role title can have very different bars across teams.',
          'Confidentiality is enforced — interviewers may not share their team or what product they are hiring for until offer.',
        ],
        likelyQuestions: [
          'Implement a binary search variation — find the first/last occurrence in a sorted array with duplicates.',
          'Reverse a linked list, then implement a singly-linked list iterator.',
          'Validate a binary tree.',
          'Tell me about your most polished side project.',
          'Why Apple? (Avoid generic — talk about a specific product or design philosophy.)',
          'How do you decide when a UI / API is "done"?',
          'Describe a time you had to iterate on a design after stakeholder feedback.',
        ],
        levelRubric:
          'ICT2 bar varies by team. Software-platform teams emphasize CS fundamentals + OS-level depth; product teams emphasize craft + design taste. Cross-team panel matters — Apple weighs collaboration signal heavily because of internal-team confidentiality.',
        compRange: { gbp: '£70-90k base + ~£20k stock + bonus', usd: '$130-170k base + $40-90k stock/year', note: 'Levels.fyi Apple ICT2 2024-25' },
        commonGaps: [
          'Treating Apple loop like Google loop — Apple\'s rounds are more team-specific and design-craft-focused.',
          'Generic "Why Apple" answers — they explicitly probe taste and product judgement.',
          'Underweighting craft / polish on take-home or whiteboarded UI questions.',
        ],
      },
      {
        slug: 'mid',
        label: 'ICT3 (mid-level)',
        titleSuffix: 'ICT3 mid-level interview',
        yearsExp: '2-5 years',
        interviewPattern: [
          'Hiring manager + 5-6 onsite rounds, often spread over multiple days.',
          'Two coding rounds (one greenfield, one debugging), one component-design, two team-fit (different teams), one director-level conversation.',
          'Apple\'s "bar" varies more across teams than at peer tech companies; specific team interest matters in the loop.',
          'Confidentiality is enforced; you may not know which team you are interviewing for until late in the loop.',
        ],
        likelyQuestions: [
          'Implement a thread-safe LRU cache for an OS-level resource manager.',
          'Design a UIKit-like framework component (if iOS team) or a kernel-level data structure (if platform team).',
          'Walk me through your most recent ship. What would you change about it?',
          'Tell me about a time you pushed back on a design decision and won.',
          'Describe how you debug a flaky test on iOS.',
          'How do you decide between a public API and an SPI for an internal team?',
          'What is your favourite Apple product, and what would you change about it?',
        ],
        levelRubric:
          'ICT3 at Apple is "owns features end-to-end with attention to craft." Apple values polish, craft, and product taste in addition to engineering depth. Looking for: shipped products with measurable polish (not just "I shipped X" but "I shipped X and these specific details mattered"), demonstrable design judgement.',
        compRange: { gbp: '£100-135k base + ~£50k stock + bonus', usd: '$170-220k base + $80-160k stock/year', note: 'Levels.fyi Apple ICT3 2024-25' },
        commonGaps: [
          'Lacking polish stories — Apple wants details that show you sweated the small stuff.',
          'Generic ship narratives without explicit craft elements.',
          'Underweighting team-fit; Apple\'s cross-team panels carry decision weight.',
        ],
      },
      {
        slug: 'senior',
        label: 'ICT4 (senior)',
        titleSuffix: 'ICT4 senior engineer interview',
        yearsExp: '5-9 years',
        interviewPattern: [
          'Hiring manager screen + 6-7 onsite rounds; loop can span 6+ weeks.',
          'Two coding (one debugging-real-bug), two system-design (one product-architecture, one scaling), two behavioural (one craft-focused), one director conversation.',
          'Senior loops include a cross-functional design partner round (often a designer for product teams).',
          'Apple senior bar emphasizes "craft + scale" — both technical depth and product polish must show.',
        ],
        likelyQuestions: [
          'Design iCloud Drive\'s sync protocol. What conflicts do you anticipate?',
          'Design Apple Maps\' offline route caching system.',
          'Walk me through a system you redesigned. What was wrong with the original?',
          'Tell me about a time you led a cross-team initiative.',
          'Describe a piece of craft work you did that customers will never see but mattered.',
          'How do you decide between a public API and a private framework?',
          'What is the most over-engineered system you have built? What did you learn?',
          'Tell me about a code review that materially changed someone\'s design.',
        ],
        levelRubric:
          'ICT4 at Apple is "drives multi-team initiatives, owns architecture for a feature area, balances craft with scale." Looking for: shipped products with documented polish details, design docs that became canonical, mentorship of mid-level engineers. Apple\'s "craft" probe is rigorous.',
        compRange: { gbp: '£155-205k base + ~£140k stock + bonus', usd: '$250-340k base + $200-450k stock/year', note: 'Levels.fyi Apple ICT4; total comp $500-800k at hub locations' },
        commonGaps: [
          'System-design without polish considerations — Apple senior bar includes "what details did you not skip?"',
          'Behavioural stories that focus on shipping volume rather than shipping craft.',
          'Lacking design-doc artifacts.',
        ],
      },
      {
        slug: 'staff',
        label: 'ICT5 (staff / senior staff)',
        titleSuffix: 'ICT5 staff engineer interview',
        yearsExp: '8-12 years',
        interviewPattern: [
          'Hiring manager + 7+ onsite rounds, including multiple director-level conversations.',
          'One coding (medium-easy), three system-design / architecture rounds, three behavioural focused on org-level leadership, one director-level decision.',
          'Behavioural rounds at ICT5 probe shipped-quality at scale — design docs that became canonical, multi-team architecture decisions.',
          'Apple promotes ICT5 internally far more than externally; external loops are heavily scrutinized.',
        ],
        likelyQuestions: [
          'Walk me through the design of a foundational system you built that other teams depend on.',
          'Tell me about a multi-quarter roadmap you authored. What changed?',
          'How would you redesign a major Apple platform service today?',
          'Describe a deprecation you led across multiple Apple teams.',
          'Tell me about a design doc that became canonical for your org.',
          'How do you mentor a senior engineer career-stuck on craft vs. scope?',
          'What is the highest-leverage thing you have done in the past 18 months?',
        ],
        levelRubric:
          'ICT5 at Apple is "shapes engineering culture across teams." Looking for: shipped craft at scale, written design docs that influenced multi-team direction, mentorship of senior engineers, demonstrable product-craft philosophy. Apple\'s confidentiality + craft culture mean external Staff hires must show overwhelming evidence.',
        compRange: { gbp: '£210-300k base + ~£250k stock + bonus', usd: '$330-475k base + $400-800k stock/year', note: 'Levels.fyi Apple ICT5; total comp $800k-$1.4M' },
        commonGaps: [
          'Lacking written artifacts — at ICT5, design-doc samples are expected.',
          'Behavioural stories that focus on personal execution rather than org-level architecture decisions.',
          'Conflating ship-volume with ship-craft.',
        ],
      },
      {
        slug: 'manager',
        label: 'Engineering Manager (M3/M4/M5 management track)',
        titleSuffix: 'engineering manager interview',
        yearsExp: '6-12 years',
        interviewPattern: [
          'Hiring manager + 6-8 onsite rounds focused on people, project, partnership leadership.',
          'Two technical-credibility rounds (Apple expects EMs to remain hands-on), three management rounds, one craft-leadership conversation, one director conversation.',
          'Apple EMs are expected to internalize "design + engineering as one practice" — managers who treat design and engineering as separate orgs fail loops here.',
          'Cross-functional partnership round always includes a design or product partner.',
        ],
        likelyQuestions: [
          'Walk me through your hardest performance-management decision.',
          'How do you balance engineering velocity with craft on a constrained timeline?',
          'Tell me about your last 5 hires — what worked, what didn\'t.',
          'How do you work with design partners on a feature-defining decision?',
          'Walk me through how you ran your last performance cycle.',
          'Describe how you handle a senior engineer who is technically strong but struggles with cross-team partnerships.',
          'Tell me about a craft-focused decision you made that slowed delivery.',
          'How do you measure team health beyond shipping cadence?',
        ],
        levelRubric:
          'EM at Apple is parallel to IC. M3 ≈ ICT4, M4 ≈ ICT5. Apple values "design and engineering as one practice" deeply — EMs who do not work fluidly with design partners fail the loop. Continued technical credibility is non-negotiable. Performance management is asked at every level.',
        compRange: { gbp: '£170-260k base + ~£180k stock + bonus', usd: '$260-400k base + $300-650k stock/year', note: 'Levels.fyi Apple EM; varies by team size and IC-equivalent level' },
        commonGaps: [
          'Treating engineering and design as separate orgs — Apple\'s culture rejects this.',
          'Failing technical-credibility round — Apple EMs are expected to remain hands-on with code.',
          'Performance-management stories without specific outcomes.',
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

export function getCompanySeniorityVariant(
  companySlug: string,
  senioritySlug: string
): { pack: CompanySeniorityPack; variant: SeniorityVariant } | null {
  const pack = companySeniorityPacks.find((p) => p.companySlug === companySlug);
  if (!pack) return null;
  const variant = pack.variants.find((v) => v.slug === senioritySlug);
  if (!variant) return null;
  return { pack, variant };
}

export function getAllCompanySeniorityCells(): { companySlug: string; senioritySlug: SenioritySlug }[] {
  return companySeniorityPacks.flatMap((p) =>
    p.variants.map((v) => ({ companySlug: p.companySlug, senioritySlug: v.slug }))
  );
}
