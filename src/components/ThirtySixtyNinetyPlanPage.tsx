import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Calendar, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /tools/30-60-90-plan -- 30/60/90 day plan generator.
 * Pure client-side. No LLM. Deterministic templates branched on
 * role type + level + company stage + 1-2 specific anchors.
 *
 * Drafted 2026-05-10. 19th free tool. Captures the "30 60 90 day
 * plan" search-traffic surface (THE most common final-round prompt
 * for senior+ roles). Final-round candidates are high-intent and
 * close to signing.
 */

type RoleType =
  | 'engineer'
  | 'eng-manager'
  | 'pm'
  | 'designer'
  | 'data'
  | 'sales'
  | 'marketing'
  | 'cs-cx'
  | 'ops'
  | 'leadership';

type Level =
  | 'ic-mid'
  | 'ic-senior'
  | 'tech-lead'
  | 'manager'
  | 'senior-manager'
  | 'director';

type CompanyStage =
  | 'startup-pre-pmf'
  | 'startup-post-pmf'
  | 'growth-stage'
  | 'enterprise';

interface Inputs {
  roleType: RoleType;
  level: Level;
  stage: CompanyStage;
  roleTitle: string;
  companyName: string;
  topPriorityFromHM: string;
  oneRiskOrAmbiguity: string;
}

const ROLE_LABELS: Record<RoleType, string> = {
  engineer: 'Software / Platform Engineer',
  'eng-manager': 'Engineering Manager',
  pm: 'Product Manager',
  designer: 'Designer (Product / UX)',
  data: 'Data / ML / Analytics',
  sales: 'Sales (AE / SDR / Sales Lead)',
  marketing: 'Marketing (Growth / Brand / Content)',
  'cs-cx': 'Customer Success / Customer Experience',
  ops: 'Operations (RevOps / BizOps / People Ops)',
  leadership: 'Senior Leadership (VP / Head Of / C-level)',
};

const LEVEL_LABELS: Record<Level, string> = {
  'ic-mid': 'IC — Mid',
  'ic-senior': 'IC — Senior / Staff',
  'tech-lead': 'Tech Lead / Lead IC',
  manager: 'First-line Manager',
  'senior-manager': 'Senior Manager',
  director: 'Director / Head Of',
};

const STAGE_LABELS: Record<CompanyStage, string> = {
  'startup-pre-pmf': 'Startup pre-PMF (under ~30 people)',
  'startup-post-pmf': 'Startup post-PMF (30-150 people)',
  'growth-stage': 'Growth stage (150-1000 people)',
  enterprise: 'Enterprise / public (1000+ people)',
};

interface PlanSection {
  days: '0-30' | '31-60' | '61-90';
  title: string;
  objectives: string[];
  deliverables: string[];
  metrics: string[];
}

interface Plan {
  framingLine: string;
  sections: PlanSection[];
  riskCallout: string;
  closingQuestion: string;
}

// ----------------------------------------------------------------------
// Plan generator — deterministic templates branched per role + level + stage
// ----------------------------------------------------------------------
function buildPlan(i: Inputs): Plan {
  const company = i.companyName.trim() || '[the company]';
  const title = i.roleTitle.trim() || '[the role]';
  const priority = i.topPriorityFromHM.trim();
  const risk = i.oneRiskOrAmbiguity.trim();

  // Common section structure: each role has 3 sections with role-specific
  // objectives / deliverables / metrics.

  // ----- Role-specific templates -----
  const tmpl: Record<RoleType, PlanSection[]> = {
    engineer: [
      {
        days: '0-30',
        title: 'Listen, learn, ship a small thing',
        objectives: [
          'Get a working dev environment + first PR merged within Week 1.',
          '1:1s with every member of immediate team + every cross-functional partner (PM, design, EM, on-call peers).',
          'Read the last 90 days of post-mortems, RFCs, and architecture docs for the area I will own.',
          'Identify the 3 most-painful workflow / build / test problems engineers complain about today.',
        ],
        deliverables: [
          'A first-month brief shared with my manager: what I observed, who I met, what I think I should focus on (with my reasoning).',
          'At least 2 small PRs merged (a bug fix + a small feature or refactor) to demonstrate I can navigate the codebase.',
          'A documented onboarding-friction list — what I had to figure out, that should be written down.',
        ],
        metrics: [
          'Time-to-first-PR < 5 working days.',
          'Time-to-first-on-call rotation shadow < 30 days.',
          'All immediate-team 1:1s completed.',
        ],
      },
      {
        days: '31-60',
        title: 'Own something end-to-end',
        objectives: [
          'Take ownership of a real project — scoped with PM + EM — and ship a meaningful piece of it.',
          'Begin contributing to design reviews + RFCs.',
          'Cover a real on-call rotation.',
          'Identify the area that should be my technical bet for the next 6 months.',
        ],
        deliverables: [
          'A shipped feature or completed migration milestone — with a measurable outcome.',
          'One RFC or design proposal authored end-to-end.',
          'A clean on-call shift summary, including 1-2 quick-wins I left for the team.',
        ],
        metrics: [
          'At least 1 production deploy fully owned by me.',
          'RFC reviewed + at least one round of substantive feedback.',
          'No production incidents I caused without prompt resolution.',
        ],
      },
      {
        days: '61-90',
        title: 'Become trusted to scope + ship',
        objectives: [
          'Be the named owner of a meaningful workstream — PM and EM can hand me work without micro-managing.',
          'Have an opinion + a backed-up proposal on the next 1-2 quarter\'s technical bets in my area.',
          'Be a useful design-review + code-review contributor across the team, not just my project.',
        ],
        deliverables: [
          'A roadmap proposal for my workstream, end of Q.',
          'A second shipped feature or milestone delivery.',
          'Documentation or process improvement that outlasts me (an onboarding doc, a runbook, a test pattern).',
        ],
        metrics: [
          'Comfortable being on the on-call rotation alone.',
          '1-2 cross-team partnerships (you\'re a known face on the relevant Slack / channels).',
          'EM signs off that the next-quarter plan is sound.',
        ],
      },
    ],
    'eng-manager': [
      {
        days: '0-30',
        title: 'Trust + diagnosis, no major changes',
        objectives: [
          '1:1s with every direct report (multiple times). Listen, do not change yet.',
          '1:1s with every adjacent manager, PM, design, exec stakeholder.',
          'Audit the team\'s current state: roadmap clarity, on-call health, code review hygiene, recent post-mortems, attrition history.',
          'Diagnose what is working AND what is broken (resist the urge to act in 30 days).',
        ],
        deliverables: [
          'A first-month observation memo to my own manager: what I see, what I think, what I will and will not do in the next 60 days.',
          'A documented one-page profile of each direct report (career goals, current struggle, where I should invest).',
          'A clear list of which existing rituals / processes I will keep, change, or remove (with reasoning).',
        ],
        metrics: [
          'Every direct report has had ≥3 1:1s with me.',
          'I can explain every active project + its owner in a single sentence each.',
          'No major team change introduced in this window (do no harm).',
        ],
      },
      {
        days: '31-60',
        title: 'Targeted interventions',
        objectives: [
          'Make the 2-3 highest-leverage process changes I diagnosed in month 1.',
          'Have a real feedback conversation with each direct report (positive + dev).',
          'Surface and unblock the biggest team-velocity blocker.',
          'Build the team\'s working agreement with cross-functional partners (PM cadence, design cadence, on-call boundaries).',
        ],
        deliverables: [
          '2-3 documented + announced changes — what changed, why, what success looks like.',
          'Performance + dev-area feedback delivered to each direct report (and documented).',
          'A team-level OKR or commitment doc for the quarter, owned by me + my reports.',
        ],
        metrics: [
          'Team velocity stable or improving (no dip from change-shock).',
          'No attrition triggered by my interventions.',
          'I am unblocking, not the bottleneck.',
        ],
      },
      {
        days: '61-90',
        title: 'Own the next-quarter plan',
        objectives: [
          'Co-authored a credible plan for the next quarter with PM + design partners.',
          'Each direct report has a written growth path with a 6-month milestone.',
          'Cross-functional partners can describe what my team owns + when work lands.',
          'Hiring or backfill plan in place if needed.',
        ],
        deliverables: [
          'A next-quarter team plan, signed off by leadership.',
          'A talent grid for the team (performance × potential), private to me + my manager.',
          'A documented hiring plan or talent strategy if relevant.',
        ],
        metrics: [
          'Leadership trusts the next-quarter plan (verbal sign-off).',
          'No direct report is surprised by where they stand.',
          'I have built a reputation as the manager who delivers + does not break the team.',
        ],
      },
    ],
    pm: [
      {
        days: '0-30',
        title: 'Customer + team listening',
        objectives: [
          'Talk to ≥10 customers (a mix of new + power + churned).',
          '1:1s with every member of my pod (eng, design, data, marketing, CS partners).',
          'Audit the last 6 months of roadmap commitments + what shipped + what landed.',
          'Identify the top 3 highest-leverage product problems I could own.',
        ],
        deliverables: [
          'A customer-interview synthesis doc — what they actually do, what hurts, what they value.',
          'A landscape doc — competitors, adjacent products, where my product sits.',
          'A first-month brief: where I think the next bet should go (with reasoning).',
        ],
        metrics: [
          '≥10 customer conversations.',
          '100% of pod 1:1s done.',
          'I can repeat customer-language about the product (not company-jargon).',
        ],
      },
      {
        days: '31-60',
        title: 'Frame + propose',
        objectives: [
          'Frame the top 1-2 problems as opportunity briefs the team can argue about.',
          'Run discovery on the top bet (problem interviews + concept tests).',
          'Co-design the v1 solution with eng + design.',
          'Get leadership alignment on the bet.',
        ],
        deliverables: [
          'A written opportunity brief (problem, evidence, hypothesis, success metric).',
          'A solution concept doc + low-fidelity prototype.',
          'A go / no-go decision with leadership, documented.',
        ],
        metrics: [
          'Discovery insights validate or kill the hypothesis (either is a win).',
          'Eng + design feel co-authors, not assigned.',
          'Leadership has a clear position on the bet.',
        ],
      },
      {
        days: '61-90',
        title: 'Ship something + earn the next bet',
        objectives: [
          'Ship a measurable v1 of the bet (or the largest meaningful slice).',
          'Set up the metric + experiment plan for it.',
          'Build the next-quarter PRD or roadmap proposal.',
          'Become the trusted owner of this area — eng + design come to me, not around me.',
        ],
        deliverables: [
          'A shipped v1 with a measurement plan.',
          'A next-quarter roadmap proposal, signed off.',
          'A retro on the first bet (what worked, what would I do differently).',
        ],
        metrics: [
          'Measurable launch (even if it is "we learned this", that\'s ok).',
          'Roadmap signed off by eng manager + design lead + my manager.',
          'I am the named PM for this area.',
        ],
      },
    ],
    designer: [
      {
        days: '0-30',
        title: 'Audit, listen, observe',
        objectives: [
          'Heuristic audit of the existing product surface + brand system.',
          'Interview / shadow ≥5 customers + ≥3 internal users (support, sales, ops).',
          'Map the design system + identify gaps + inconsistencies.',
          '1:1s with PM + eng + design partners.',
        ],
        deliverables: [
          'A heuristic audit doc with prioritised issues.',
          'A customer-interview synthesis doc.',
          'A first-month brief — where design can have the highest leverage in the next 60 days.',
        ],
        metrics: [
          'Audit doc reviewed by design lead.',
          '5+ customer interviews done.',
          'I can name 3 specific UX bottlenecks with evidence.',
        ],
      },
      {
        days: '31-60',
        title: 'Ship a real piece of design',
        objectives: [
          'Take a real feature or improvement and design it end-to-end (research → wireframe → spec → handoff).',
          'Contribute to the design system (a component, a pattern, a doc).',
          'Run at least one usability test on something live.',
        ],
        deliverables: [
          'A shipped design (live in product) — or in QA at minimum.',
          'A design system contribution.',
          'A usability test write-up + recommendations.',
        ],
        metrics: [
          'Design quality gets praised by eng + PM (not "fine", but "yes that\'s the right move").',
          'Test insights drive at least one change.',
          'Design-system contribution accepted.',
        ],
      },
      {
        days: '61-90',
        title: 'Own a problem area + raise the bar',
        objectives: [
          'Be the named designer for an area (sales onboarding / billing / search / etc.) — PM + eng go to you.',
          'Propose the design strategy for the next quarter in that area.',
          'Mentor or pair with another designer (or sibling team) on something.',
        ],
        deliverables: [
          'A next-quarter design strategy or vision deck for my area.',
          'A second shipped feature.',
          'A documented design contribution that outlasts me (a pattern, a guideline, a journey map).',
        ],
        metrics: [
          'Manager sign-off on the next-quarter design strategy.',
          'PM + eng feedback: you raised the bar in this area.',
          'You are a known + trusted face across the team.',
        ],
      },
    ],
    data: [
      {
        days: '0-30',
        title: 'Trust the data + map the system',
        objectives: [
          'Map the data landscape: sources, warehouses, pipelines, dashboards, the actual ground truth.',
          'Audit the last 6 months of reports + analyses — are they trusted? what is broken?',
          '1:1s with every cross-functional stakeholder who uses data.',
          'Identify the 2-3 datasets / dashboards that are wrong + costing the company decisions.',
        ],
        deliverables: [
          'A data-landscape map doc.',
          'A first-month brief: what is trustworthy, what is not, what to invest in.',
          'A documented "you cannot trust X" list, with the proposed fix.',
        ],
        metrics: [
          'Every key stakeholder has met with me.',
          'Top 3 critical-decision dashboards verified or flagged.',
          'I can explain the data flow end-to-end for the top 2 use cases.',
        ],
      },
      {
        days: '31-60',
        title: 'Ship a meaningful analysis or pipeline',
        objectives: [
          'Deliver an analysis that drives a decision (cohort, funnel, attribution, retention, etc.).',
          'Fix or rebuild a broken pipeline / dashboard if applicable.',
          'Set up reproducible templates so analyses get faster.',
          'Mentor or pair with a non-data partner on basic SQL / analytics.',
        ],
        deliverables: [
          'A documented analysis with a clear conclusion + decision recommendation.',
          'A fixed pipeline or dashboard with documentation.',
          'A reusable analysis template (notebook, dbt model, dashboard) for the team.',
        ],
        metrics: [
          'Stakeholders cite my analysis in a decision.',
          'Pipeline / dashboard reliability improves (uptime, freshness, accuracy).',
          'Velocity on analytics requests goes up.',
        ],
      },
      {
        days: '61-90',
        title: 'Own the strategic data question',
        objectives: [
          'Be the named analyst / data lead for an area — leadership comes to me with the strategic question.',
          'Propose the data-investment plan for the next quarter (new instrumentation, new dashboards, model investments).',
          'Build a single source of truth for one critical metric (e.g. ARR, MAU, retention).',
        ],
        deliverables: [
          'A next-quarter data-investment plan.',
          'A documented "north star metric" doc with definition + ownership + freshness SLO.',
          'A shipped strategic analysis that informs the next-quarter plan.',
        ],
        metrics: [
          'Leadership trusts the numbers I publish.',
          'Roadmap influenced by my analysis.',
          'A new self-serve capability exists for the team.',
        ],
      },
    ],
    sales: [
      {
        days: '0-30',
        title: 'Learn the customer + the deal',
        objectives: [
          'Shadow ≥5 calls (discovery, demo, close, renewal — mix).',
          'Read the last 20 closed-won and 10 closed-lost deals — patterns.',
          'Get certified on the product (demo certification or equivalent).',
          'Build a target account list + initial outreach plan.',
        ],
        deliverables: [
          'A documented territory plan with target accounts.',
          'A "buyer-language" doc — actual phrases customers use, not company-marketing.',
          'A first-month brief to my sales leader.',
        ],
        metrics: [
          'Product demo certified.',
          'Territory plan approved.',
          'First outreach cadence live.',
        ],
      },
      {
        days: '31-60',
        title: 'Pipeline-build + first deals',
        objectives: [
          'Hit pipeline-build targets (specific to ramp expectation).',
          'Run discovery + qualified-meeting calls solo.',
          'Get 1-2 deals into late stages.',
          'Refine my pitch + objection-handling against real responses.',
        ],
        deliverables: [
          'A pipeline that meets ramp-quota expectation.',
          'A documented objection-handling playbook from real calls.',
          'A retro on the first 30-60 days with the sales leader.',
        ],
        metrics: [
          'Pipeline coverage at expected ramp.',
          'Conversion rate per stage measured + benchmarked.',
          'First-deal velocity reasonable for segment.',
        ],
      },
      {
        days: '61-90',
        title: 'Close + earn the bigger book',
        objectives: [
          'Close first deals (segment + ramp-dependent).',
          'Refine ICP + target-account scoring with the data I now have.',
          'Co-sell or pair with cross-functional partners (SE, CS, marketing) for complex deals.',
          'Be ramped — the manager trusts me with the next-quarter book.',
        ],
        deliverables: [
          'Closed deals (segment-dependent quota).',
          'A refined ICP + account-scoring framework.',
          'A next-quarter territory plan.',
        ],
        metrics: [
          'Ramp quota hit or trajectory clear.',
          'Forecast accuracy >70% from week 8 onwards.',
          'Cross-functional partners can co-sell with me.',
        ],
      },
    ],
    marketing: [
      {
        days: '0-30',
        title: 'Audit + understand',
        objectives: [
          'Audit every active marketing surface (site, ads, email, content, social, events).',
          'Interview customers + adjacent teams (sales, CS, product).',
          'Map the funnel + the bottleneck.',
          'Diagnose the top 2-3 leverage opportunities.',
        ],
        deliverables: [
          'A marketing audit doc with prioritised opportunities.',
          'A funnel-state-of-the-union with the actual numbers.',
          'A first-month brief: where to invest the next 60 days.',
        ],
        metrics: [
          'Audit covers every channel.',
          'Top 3 leverage opportunities identified + sized.',
          'Leadership reviews the audit.',
        ],
      },
      {
        days: '31-60',
        title: 'Ship the highest-leverage change',
        objectives: [
          'Ship the #1 leverage change (a new page, a new campaign, a new content push, a positioning refresh).',
          'Instrument measurement for it.',
          'Build the team\'s working agreement with sales + product.',
        ],
        deliverables: [
          'A shipped campaign / asset / change.',
          'A measurement plan + dashboard.',
          'A documented sales-marketing handoff.',
        ],
        metrics: [
          'The leverage change is measurable + measured.',
          'Sales + product feel partnered (not at war).',
          'Initial signal on the change (good or bad — both useful).',
        ],
      },
      {
        days: '61-90',
        title: 'Own the next-quarter plan',
        objectives: [
          'Co-authored the next-quarter plan with sales + product + the CEO.',
          'Build a content / brand engine that runs without me daily.',
          'Earn the trust to set the marketing strategy.',
        ],
        deliverables: [
          'A next-quarter plan signed off by leadership.',
          'A repeatable content / campaign / brand cadence.',
          'A documented learning from the first 90 days.',
        ],
        metrics: [
          'Pipeline contribution from marketing measured + trending.',
          'Sales + product trust the next-quarter plan.',
          'Brand + content cadence is in flight + sustainable.',
        ],
      },
    ],
    'cs-cx': [
      {
        days: '0-30',
        title: 'Customer + book understanding',
        objectives: [
          'Shadow ≥10 customer calls (mix of QBRs, support, renewals).',
          'Read the last 6 months of churn / expansion / NPS data.',
          'Meet every CSM + the sales counterparts.',
          'Map the customer-journey + identify friction.',
        ],
        deliverables: [
          'A customer-journey map with friction-points.',
          'A book-of-business profile.',
          'A first-month brief.',
        ],
        metrics: [
          '10+ customer touches.',
          'Top 3 friction-points identified.',
          'Sales partnership established.',
        ],
      },
      {
        days: '31-60',
        title: 'Own the book + fix one big thing',
        objectives: [
          'Take ownership of the assigned book (or sub-segment).',
          'Fix the #1 friction-point identified in month 1.',
          'Build the team\'s playbook for QBRs / renewals / expansion.',
          'Surface product feedback systematically.',
        ],
        deliverables: [
          'A documented QBR / renewal playbook.',
          'A fixed friction-point with evidence.',
          'A monthly product-feedback synthesis.',
        ],
        metrics: [
          'Renewals on track.',
          'NPS / CSAT stable or improving.',
          'Product team trusts my feedback synthesis.',
        ],
      },
      {
        days: '61-90',
        title: 'Earn the bigger book + scale the system',
        objectives: [
          'Hit renewal + expansion targets for the quarter.',
          'Scale the playbook to other CSMs.',
          'Own a strategic CS metric (NRR, GRR, time-to-value).',
          'Be a credible voice in cross-functional reviews.',
        ],
        deliverables: [
          'Renewal + expansion numbers for the quarter.',
          'A scaled playbook adopted by other CSMs.',
          'A next-quarter CS strategy doc.',
        ],
        metrics: [
          'NRR / GRR / expansion on plan.',
          'Playbook adoption across team.',
          'Strategic-metric ownership recognised.',
        ],
      },
    ],
    ops: [
      {
        days: '0-30',
        title: 'Audit the operating system',
        objectives: [
          'Map the org\'s operating cadence: planning, forecasting, reviews, reporting.',
          'Audit the tools + the data + the actual workflows.',
          '1:1s with every department leader.',
          'Identify the top 3 process drag points.',
        ],
        deliverables: [
          'An operating-system audit doc.',
          'A first-month brief with prioritised interventions.',
          'A documented "what is broken" list with proposed fixes.',
        ],
        metrics: [
          'Audit covers every major operating ritual.',
          'Leadership reviews the audit.',
          'Stakeholders feel heard.',
        ],
      },
      {
        days: '31-60',
        title: 'Fix one big process drag',
        objectives: [
          'Implement the #1 process improvement (planning cadence, forecasting model, reporting layer, etc.).',
          'Build the team\'s data + dashboard layer for the critical metric.',
          'Establish the rhythm of monthly / quarterly reviews.',
        ],
        deliverables: [
          'A live improved process with documentation.',
          'A dashboard for the critical metric.',
          'A monthly business review template + cadence.',
        ],
        metrics: [
          'Process improvement adopted.',
          'Dashboard trusted + used in decisions.',
          'Review cadence sustained.',
        ],
      },
      {
        days: '61-90',
        title: 'Own the next-quarter plan',
        objectives: [
          'Drive the next-quarter planning cycle.',
          'Build the org\'s scorecard.',
          'Be the trusted source of operating truth.',
        ],
        deliverables: [
          'A driven next-quarter plan.',
          'An org scorecard with the right metrics.',
          'A documented operating-rhythm doc.',
        ],
        metrics: [
          'Plan signed off.',
          'Scorecard adopted by leadership.',
          'Operating rhythm sustainable.',
        ],
      },
    ],
    leadership: [
      {
        days: '0-30',
        title: 'Listen at scale, change nothing',
        objectives: [
          '1:1s with every direct report (multiple times) + every key leader + the CEO + the board chair if applicable.',
          'Audit the function\'s current state: roadmap, talent, attrition, financials, key partnerships.',
          'Diagnose the top 3 challenges + the top 3 strengths I should NOT break.',
          'Communicate "I am listening, I am not changing things yet" explicitly.',
        ],
        deliverables: [
          'A first-month memo to my CEO + board (if applicable).',
          'A documented talent grid + key-person-risk map.',
          'A clear list of what I will keep, change, and remove (with reasoning).',
        ],
        metrics: [
          'No major change made in this window.',
          'No attrition triggered by my listening tour.',
          'The org feels heard.',
        ],
      },
      {
        days: '31-60',
        title: 'Targeted bets',
        objectives: [
          'Make 2-3 high-leverage changes (process, hire, leadership re-shape, focus shift).',
          'Set the strategic narrative for the function.',
          'Engage the board + the exec team on the new direction.',
          'Reinforce the talent grid with feedback + dev plans.',
        ],
        deliverables: [
          '2-3 announced + executed changes.',
          'A strategic narrative doc for the function.',
          'A board / exec update.',
        ],
        metrics: [
          'Changes accepted + sticking.',
          'No avoidable attrition.',
          'Board / exec trust building.',
        ],
      },
      {
        days: '61-90',
        title: 'Own the next-year plan',
        objectives: [
          'Lead the next-year planning cycle for the function.',
          'Build the leadership bench underneath me.',
          'Earn the trust to set the function\'s long-range strategy.',
          'Have a clear story of "what did we do in the first 90 days, what changed, what is next".',
        ],
        deliverables: [
          'A next-year plan signed off by exec + board.',
          'A leadership-bench plan (succession + hiring).',
          'A 90-day retro shared with my CEO + my direct reports.',
        ],
        metrics: [
          'Plan signed off.',
          'Leadership bench in motion.',
          'Trust visibly built.',
        ],
      },
    ],
  };

  // ----- Adjustments by company stage + level -----
  const sections: PlanSection[] = tmpl[i.roleType].map((s) => ({ ...s }));

  // Append stage + level adjustments to the 0-30 section
  const stageNote =
    i.stage === 'startup-pre-pmf'
      ? 'Note: pre-PMF startup — speed > polish. The first month should also include 2-3 specific shippings, not just listening, since the company doesn\'t have time for a pure listening tour.'
      : i.stage === 'startup-post-pmf'
      ? 'Note: post-PMF startup — fast pace + lots of unfinished foundations. Expect to ship + fix in parallel during 30-60.'
      : i.stage === 'growth-stage'
      ? 'Note: growth stage — the cross-functional partner-map matters more than at smaller companies. Spend disproportionate time in cross-functional 1:1s in month 1.'
      : 'Note: enterprise — the political map matters as much as the technical one. Spend month 1 understanding who actually decides what, and what changes need committee sign-off.';

  const isLeadership = i.level === 'manager' || i.level === 'senior-manager' || i.level === 'director';
  const levelNote = isLeadership
    ? 'Level note: at this level, the bar in the first 90 days is "did you build trust without breaking the team?" — not "what did you ship". Resist the temptation to make a visible change just to look productive.'
    : 'Level note: at this level, the bar is "are you a credible owner of meaningful scope by day 90?" — show end-to-end ownership of at least one real thing, not breadth across many small things.';

  sections[0].objectives.push(stageNote);
  sections[0].objectives.push(levelNote);

  if (priority) {
    sections[0].objectives.unshift(`Explicit priority from the hiring manager: "${priority}". This is the anchor — every action in the first 30 days should move toward or against this priority deliberately.`);
  }

  const riskCallout = risk
    ? `Risk / ambiguity you named: "${risk}". Treat this as the #1 thing to de-risk in the first 30 days. Ask your manager about it in your Week 1 1:1 explicitly: "what does success vs failure look like on this specifically?" Document the answer.`
    : `Risk / ambiguity is the #1 silent killer in the first 90 days. In your Week 1 1:1, ask: "what would have to be true at day 90 for you to think this hire was a clear win?" + "what would have to be true for you to think it wasn't?" Document both answers.`;

  const framingLine = `${title} at ${company} — a 30/60/90 plan focused on trust-building and shipping a real piece of meaningful work, calibrated for ${LEVEL_LABELS[i.level]} at ${STAGE_LABELS[i.stage]}.`;

  const closingQuestion = isLeadership
    ? `Closing question for the hiring manager: "What's one thing that, if I do it in the first 90 days, will tell you we got the right hire? And one thing I should NOT do?"`
    : `Closing question for the hiring manager: "Apart from the explicit goals, what's a soft signal that tells you a new ${title} is working out well in the first 90 days?"`;

  return { framingLine, sections, riskCallout, closingQuestion };
}

function planToText(plan: Plan, inputs: Inputs): string {
  return [
    `30/60/90 DAY PLAN — ${inputs.roleTitle || 'the role'} at ${inputs.companyName || 'the company'}`,
    ``,
    `Framing: ${plan.framingLine}`,
    ``,
    ...plan.sections.flatMap((s) => [
      `=== DAYS ${s.days} — ${s.title.toUpperCase()} ===`,
      ``,
      `Objectives:`,
      ...s.objectives.map((o) => `- ${o}`),
      ``,
      `Deliverables:`,
      ...s.deliverables.map((d) => `- ${d}`),
      ``,
      `How I'll measure success:`,
      ...s.metrics.map((m) => `- ${m}`),
      ``,
    ]),
    `RISK CALLOUT:`,
    plan.riskCallout,
    ``,
    `CLOSING QUESTION TO ASK THE HIRING MANAGER:`,
    plan.closingQuestion,
  ].join('\n');
}

export default function ThirtySixtyNinetyPlanPage() {
  const { t } = useTheme();
  const [i, setI] = useState<Inputs>({
    roleType: 'engineer',
    level: 'ic-senior',
    stage: 'growth-stage',
    roleTitle: '',
    companyName: '',
    topPriorityFromHM: '',
    oneRiskOrAmbiguity: '',
  });
  const [generated, setGenerated] = useState<Plan | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = i.roleTitle.trim().length > 0 && i.companyName.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerated(buildPlan(i));
    setTimeout(() => {
      const el = document.getElementById('plan-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(planToText(generated, i));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: '30/60/90 Day Plan', item: `${SITE_URL}/tools/30-60-90-plan` },
    ],
  }), []);

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Free 30/60/90 Day Plan Generator — Final-Round Interview + First-Week-On-The-Job"
        description="Free in-browser 30/60/90 day plan generator. Pick role (engineer / EM / PM / designer / data / sales / marketing / CS / ops / leadership), level, company stage, and your hiring manager's stated top priority. Get a calibrated 90-day plan with objectives, deliverables, success metrics, risk callout, and the closing question to ask. Pure client-side."
        path="/tools/30-60-90-plan"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">AimVantage</span>
          </Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
            10 free prep packs
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <header className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">
            Free tool · No signup · Runs in your browser
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text} leading-tight`}>
            30/60/90 day plan generator
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} max-w-2xl mx-auto`}>
            Final-round candidates get asked: "what would your first 90 days look like?" Most candidates wing it. The ones who get the offer arrive with a real plan calibrated for the role, the level, and the company stage.
          </p>
        </header>

        <div className={`${t.glass} rounded-2xl p-6 mb-6`}>
          <h2 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted} mb-3`}>The basics</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Role type</label>
              <select
                value={i.roleType}
                onChange={(e) => setI({ ...i, roleType: e.target.value as RoleType })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {Object.entries(ROLE_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Level</label>
              <select
                value={i.level}
                onChange={(e) => setI({ ...i, level: e.target.value as Level })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {Object.entries(LEVEL_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Company stage</label>
              <select
                value={i.stage}
                onChange={(e) => setI({ ...i, stage: e.target.value as CompanyStage })}
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              >
                {Object.entries(STAGE_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Role title</label>
              <input
                type="text"
                value={i.roleTitle}
                onChange={(e) => setI({ ...i, roleTitle: e.target.value })}
                placeholder="Senior Product Manager"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>Company</label>
              <input
                type="text"
                value={i.companyName}
                onChange={(e) => setI({ ...i, companyName: e.target.value })}
                placeholder="Stripe"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>
          <h2 className={`text-sm font-bold uppercase tracking-widest ${t.textMuted} mb-3 mt-4`}>Anchors (optional but valuable)</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>What did the hiring manager say is the top priority for this role?</label>
              <input
                type="text"
                value={i.topPriorityFromHM}
                onChange={(e) => setI({ ...i, topPriorityFromHM: e.target.value })}
                placeholder="e.g. Ship the V2 of our pricing page by end of Q1, with conversion lift"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold ${t.text} mb-1`}>One risk or ambiguity you spotted in the interview</label>
              <input
                type="text"
                value={i.oneRiskOrAmbiguity}
                onChange={(e) => setI({ ...i, oneRiskOrAmbiguity: e.target.value })}
                placeholder="e.g. The previous person in this role left after 7 months — no one told me why"
                className={`w-full rounded-lg p-2 text-sm ${t.cardInner} ${t.text} border ${t.inputBorder}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
                canGenerate
                  ? 'bg-violet-600 hover:bg-violet-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/40'
              }`}
            >
              <Calendar className="w-4 h-4" /> Generate 30/60/90 plan
            </button>
            {!canGenerate && (
              <span className={`text-xs ${t.textMuted}`}>
                Fill in role title + company to generate.
              </span>
            )}
          </div>
        </div>

        {generated && (
          <section
            id="plan-results"
            className="scroll-mt-24 space-y-4"
            aria-labelledby="results-heading"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="results-heading" className={`text-2xl font-bold ${t.text}`}>
                Your 30/60/90 plan
              </h2>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : `${t.cardInner} ${t.textSub} hover:opacity-80 ${t.inputBorder}`
                }`}
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy full plan</>}
              </button>
            </div>

            <div className={`${t.glass} rounded-2xl p-5`}>
              <p className={`text-sm ${t.textSub}`}>{generated.framingLine}</p>
            </div>

            {generated.sections.map((s) => (
              <div key={s.days} className={`${t.glass} rounded-2xl p-5`}>
                <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-1`}>Days {s.days}</p>
                <h3 className={`text-xl font-bold ${t.text} mb-3`}>{s.title}</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider mb-2`}>Objectives</p>
                    <ul className={`text-sm ${t.textSub} space-y-1.5 list-disc pl-5`}>
                      {s.objectives.map((o, idx) => <li key={idx}>{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider mb-2`}>Deliverables</p>
                    <ul className={`text-sm ${t.textSub} space-y-1.5 list-disc pl-5`}>
                      {s.deliverables.map((d, idx) => <li key={idx}>{d}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider mb-2`}>Success metrics</p>
                    <ul className={`text-sm ${t.textSub} space-y-1.5 list-disc pl-5`}>
                      {s.metrics.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-amber-500`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-amber-500 mb-2`}>Risk callout</p>
              <p className={`text-sm ${t.textSub} leading-relaxed`}>{generated.riskCallout}</p>
            </div>

            <div className={`${t.glass} rounded-2xl p-5 border-l-4 border-violet-500`}>
              <p className={`text-xs font-bold uppercase tracking-widest text-violet-500 mb-2`}>Closing question</p>
              <p className={`text-sm ${t.textSub} leading-relaxed`}>{generated.closingQuestion}</p>
            </div>

            <div className={`${t.glass} rounded-2xl p-8 text-center mt-6`}>
              <h3 className={`text-2xl font-bold ${t.text}`}>
                Ready to actually nail this final round?
              </h3>
              <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
                AimVantage takes your CV and the actual job link, gives you the company-specific interview prep + cover letter + fit score. 90 seconds. 10 free packs on signup.
              </p>
              <Link
                to="/register?source=30-60-90-plan"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
              >
                Run the prep <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10 text-center">
          <p className={`text-sm ${t.textSub} mb-3`}>Other free tools, no signup:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/tools/reference-brief" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Reference call brief</Link>
            <Link to="/tools/offer-compare" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Offer comparison</Link>
            <Link to="/tools/negotiation-script" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Negotiation script</Link>
            <Link to="/tools/thank-you-note" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>Thank-you note</Link>
            <Link to="/tools/star-story-builder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>STAR story builder</Link>
            <Link to="/tools/jd-decoder" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>JD decoder</Link>
            <Link to="/ats/scanner" className={`text-xs px-3 py-1.5 rounded-full ${t.cardInner} ${t.textSub} hover:opacity-80`}>ATS keyword scanner</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
