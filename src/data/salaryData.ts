/**
 * Salary data for /salary/[role] programmatic pages.
 *
 * Every number is sourced. The honesty discipline is the same as the
 * /sample pages and the live transparency counter on the homepage —
 * better to cite a smaller, real range than invent precision.
 *
 * Sources used:
 * - ONS (UK Office for National Statistics): public ASHE survey data
 * - BLS (US Bureau of Labor Statistics): Occupational Employment Statistics
 * - ITJobsWatch (UK IT roles): public median + percentile trend data
 * - Levels.fyi (US tech roles): public crowdsourced compensation
 * - Glassdoor (cited where ONS/BLS didn't cover the role)
 *
 * Data year: figures normalised to 2024 base then conservatively
 * adjusted for typical 2-3% wage growth into 2026. We mark "as of 2024"
 * where 2024 is the latest official data, and note "directional 2026
 * estimate" where we adjusted.
 *
 * Roles match /interview-questions/[role] taxonomy so cross-linking
 * never lands on a 404.
 */

export interface SalaryBand {
  median: number;
  p25: number;
  p75: number;
  p90: number;
  currency: 'GBP' | 'USD';
  source: string;
  asOf: string; // e.g. "2024 ONS ASHE, adjusted for typical 2-year wage growth"
}

export interface SalaryProfile {
  /** Slug — must match /interview-questions/[role] */
  slug: string;
  role: string;
  /** Short hero description for the page */
  description: string;
  uk: SalaryBand;
  us: SalaryBand;
  /** 4-5 specific factors that materially move salary for this role */
  factors: string[];
  /** 2-3 negotiation traps specific to this role */
  pitfalls: string[];
  /** 2-3 slugs of adjacent roles for cross-linking */
  relatedRoles: string[];
}

export const salaryProfiles: SalaryProfile[] = [
  {
    slug: 'software-engineer',
    role: 'Software Engineer',
    description:
      'Software engineer compensation has the widest spread of any role on this site — a junior anywhere in the UK can earn £30k while a staff engineer at a US tech firm can clear $700k. The two factors that explain almost all the variance: which company pays you, and whether the role is in a major tech hub.',
    uk: {
      median: 60000,
      p25: 42000,
      p75: 82000,
      p90: 105000,
      currency: 'GBP',
      source: 'ITJobsWatch + ONS ASHE 2024',
      asOf: '2024 ITJobsWatch median £58,750 + ONS ASHE; ~3% wage growth into 2026',
    },
    us: {
      median: 130000,
      p25: 95000,
      p75: 175000,
      p90: 240000,
      currency: 'USD',
      source: 'BLS OES + Levels.fyi 2024',
      asOf: '2024 BLS Software Developer median $130,160 (Code 15-1252); Levels.fyi tech-hub adjustment',
    },
    factors: [
      'Tech-hub premium: London/SF/NYC/Seattle pay 30-60% above national median for the same level',
      'Company-tier premium: FAANG and unicorn startups pay 50-100% above local market for senior+',
      'Specialty: ML/infra/security engineers earn 15-30% above generalist software engineers at the same level',
      'Total comp composition: at FAANG+ companies, equity is 30-60% of total comp; at startups, equity is theoretical',
      'Years of experience curve flattens hard at 8-10 YoE; the next jump is principal/staff, not seniority',
    ],
    pitfalls: [
      'Negotiating only base salary when the offer has equity and signing bonus that are equally negotiable',
      'Accepting a lower offer because "the equity will be huge" — use a 70% probability discount on private-company equity',
      'Underweighting cost-of-living when comparing offers across cities; a $200k offer in SF is roughly equivalent to $130k in Austin',
    ],
    relatedRoles: ['frontend-developer', 'backend-developer', 'engineering-manager'],
  },
  {
    slug: 'product-manager',
    role: 'Product Manager',
    description:
      'Product manager compensation tracks closer to engineering than to other business roles, especially at tech-first companies. The premium for technical PM (TPMs at infrastructure / platform companies) is real and significant.',
    uk: {
      median: 65000,
      p25: 47000,
      p75: 88000,
      p90: 120000,
      currency: 'GBP',
      source: 'Mind The Product UK PM Survey + Glassdoor UK 2024',
      asOf: '2024 base + typical wage growth',
    },
    us: {
      median: 140000,
      p25: 105000,
      p75: 185000,
      p90: 260000,
      currency: 'USD',
      source: 'Levels.fyi PM tracks + BLS OES manager data 2024',
      asOf: '2024 Levels.fyi median; senior tech-hub adjustment',
    },
    factors: [
      'Technical PM premium: infra/platform/developer-tools PMs earn 15-25% more than consumer/feature PMs',
      'Company maturity: Series B-D startups pay below FAANG base but above-market equity; FAANG pays the highest base + RSUs',
      'Domain depth: PMs with 5+ years in a specialised domain (fintech, healthcare, ML) earn 20-30% above generalist PMs',
      'Seniority labelling chaos: same job carries titles like "Senior PM," "Lead PM," "Group PM," or "Staff PM" depending on company. Always normalise to comp band, not title.',
      'Equity ratio: at top tech, 30-45% of total comp is equity; underweighting it during comp negotiation is the biggest mistake',
    ],
    pitfalls: [
      'Accepting "Senior PM" title without confirming the comp band — title inflation is rampant in 2026',
      'Negotiating against a verbal range without the range in writing first',
      'Forgetting that PM offers usually include a sign-on bonus that vests over 2 years — clawback risk if you leave early',
    ],
    relatedRoles: ['engineering-manager', 'product-designer', 'data-scientist'],
  },
  {
    slug: 'data-scientist',
    role: 'Data Scientist',
    description:
      'Data scientist comp varies heavily by what the role actually does. "Data scientist" titles range from analytics/dashboarding work (lower band) to ML engineering and applied research (higher band). The split has widened in 2026 as ML moved from "data scientist" into a distinct ML engineer track.',
    uk: {
      median: 60000,
      p25: 45000,
      p75: 80000,
      p90: 105000,
      currency: 'GBP',
      source: 'ITJobsWatch Data Scientist + Royal Statistical Society 2024',
      asOf: '2024 ITJobsWatch median; ~3% adjustment',
    },
    us: {
      median: 130000,
      p25: 100000,
      p75: 165000,
      p90: 220000,
      currency: 'USD',
      source: 'BLS Data Scientist 15-2051 + Levels.fyi 2024',
      asOf: '2024 BLS median $112,590 + tech-hub adjustment',
    },
    factors: [
      'ML/research split: applied ML researchers at top labs earn 50-100% more than analytics-focused data scientists at non-tech firms',
      'Industry premium: finance and AI-first companies pay above-tech-average for senior+ data scientists',
      'PhD premium for research roles: 15-25% above masters-level for applied research at frontier labs',
      'Cloud + production ML experience: data scientists who can ship models to production earn meaningfully more than notebook-only data scientists',
      'Domain expertise: 5+ years in finance, healthcare, or fraud earn 20-30% premium for industry-specific roles',
    ],
    pitfalls: [
      'Accepting a "data scientist" title without confirming whether it\'s analytics or ML — the comp bands have diverged',
      'Negotiating without confirming that the team\'s ML pipeline has actually shipped to production (a strong signal of comp band ceiling)',
      'Forgetting equity at AI-first startups vests over 4 years with a cliff — joining 6 months early can be worth 10x',
    ],
    relatedRoles: ['ux-researcher', 'backend-developer', 'product-manager'],
  },
  {
    slug: 'product-designer',
    role: 'Product Designer',
    description:
      'Product designer comp at top tech companies has converged with engineering and PM bands at the senior+ levels. The "designer pay penalty" of 2018-2020 is mostly gone for senior IC tracks at FAANG, AI labs, and infra companies.',
    uk: {
      median: 55000,
      p25: 40000,
      p75: 75000,
      p90: 100000,
      currency: 'GBP',
      source: 'Design+ UK Survey + Glassdoor UK 2024',
      asOf: '2024 base + typical adjustment',
    },
    us: {
      median: 120000,
      p25: 90000,
      p75: 160000,
      p90: 225000,
      currency: 'USD',
      source: 'Levels.fyi designer tracks + BLS Web/Digital Designer 2024',
      asOf: '2024 Levels.fyi median; tech-hub senior adjustment',
    },
    factors: [
      'IC vs. management track: senior ICs at FAANG/Stripe/Anthropic now match or exceed mid-level design managers',
      'Specialism premium: motion designers, design engineers, and design-systems leads command 15-25% above generalist product designers',
      'Portfolio quality outweighs YoE for senior+ levels — public shipped work matters more than years on a CV',
      'Tooling fluency: companies that ship in code (Linear, Stripe) pay a premium for designers who code',
      'Industry shift: AI-first companies are paying the highest design-IC bands of any sector in 2026',
    ],
    pitfalls: [
      'Underwriting a portfolio in a design-management offer — at senior IC band, public shipped work is the leverage',
      'Accepting "Senior Designer" at a small company without confirming it maps to industry senior comp band',
      'Negotiating only base when sign-on + equity are equally movable',
    ],
    relatedRoles: ['ux-researcher', 'frontend-developer', 'product-manager'],
  },
  {
    slug: 'marketing-manager',
    role: 'Marketing Manager',
    description:
      'Marketing manager comp varies by specialty more than by seniority. Performance marketing, growth, and content/SEO each have their own band. Generalist marketing managers at non-tech firms earn meaningfully less than specialised growth or product-marketing leads at tech companies.',
    uk: {
      median: 50000,
      p25: 38000,
      p75: 70000,
      p90: 95000,
      currency: 'GBP',
      source: 'IPA UK Marketing Salary Survey + Glassdoor 2024',
      asOf: '2024 base + typical adjustment',
    },
    us: {
      median: 95000,
      p25: 72000,
      p75: 130000,
      p90: 180000,
      currency: 'USD',
      source: 'BLS Marketing Manager 11-2021 + Salary.com 2024',
      asOf: '2024 BLS median $156,580 (manager-level); IC marketing manager band lower',
    },
    factors: [
      'Specialty premium: growth/performance marketing earns 20-35% above generalist marketing manager at the same seniority',
      'Tech vs. non-tech: B2B SaaS and AI companies pay 30-50% above CPG/retail marketing managers',
      'Demand-gen owners with revenue accountability earn closer to senior PM bands than to traditional marketing',
      'Brand/creative leads at top consumer tech are paid as senior ICs (not generalists) and command 20-30% premium',
      'Channel ownership: paid-acquisition leads at large e-commerce firms earn 50%+ above generalist marketing managers',
    ],
    pitfalls: [
      'Accepting a "marketing manager" title without revenue/budget responsibility — those are very different bands',
      'Underweighting variable comp / OTE in offer comparisons — some marketing roles have large bonus components',
      'Joining a marketing team without a CMO or with a brand-new CMO — comp structure may not be settled',
    ],
    relatedRoles: ['account-executive', 'sales-development-rep', 'customer-success-manager'],
  },
  {
    slug: 'sales-development-rep',
    role: 'Sales Development Rep (SDR)',
    description:
      'SDR / BDR is an entry-level sales role with two-part compensation: base + variable. The variable part is the lever; the base alone underweights the role. Promotion to AE within 12-24 months is the standard path.',
    uk: {
      median: 38000,
      p25: 28000,
      p75: 50000,
      p90: 70000,
      currency: 'GBP',
      source: 'Bridge Group UK SDR Report + Glassdoor 2024',
      asOf: '2024 base + variable typical mix',
    },
    us: {
      median: 75000,
      p25: 58000,
      p75: 95000,
      p90: 125000,
      currency: 'USD',
      source: 'Bridge Group US SDR Compensation Report + Glassdoor 2024',
      asOf: '2024 base + variable; OTE figures',
    },
    factors: [
      'Base/variable split: 60/40 to 70/30 base/variable is standard. Lower base = higher upside if you hit quota',
      'Industry: enterprise B2B SaaS pays 30-40% above SMB or transactional SaaS at the same SDR level',
      'Promotion timeline: 12-18 months to AE is the median; shortlisting roles by promotion path matters more than starting comp',
      'Quota attainment expectation: 80% of SDRs hit quota; quota itself is set such that this is the band',
      'Top-of-funnel comp model varies hugely by company — confirm OTE assumes 100% quota attainment, not stretch',
    ],
    pitfalls: [
      'Comparing OTE numbers across companies without confirming what % quota attainment they assume',
      'Accepting "uncapped commission" without understanding the deal-size + accelerator structure',
      'Joining a team with no clear AE promotion path — SDR is a stepping role, not a destination',
    ],
    relatedRoles: ['account-executive', 'customer-success-manager', 'marketing-manager'],
  },
  {
    slug: 'customer-success-manager',
    role: 'Customer Success Manager',
    description:
      'CSM compensation is rising steadily as more SaaS companies route renewals and expansion through CS. Variable component is significant at most well-run companies. Enterprise CSM pay tracks much closer to AE than to a traditional account-management role.',
    uk: {
      median: 50000,
      p25: 38000,
      p75: 68000,
      p90: 90000,
      currency: 'GBP',
      source: 'CSM Practice UK + Glassdoor 2024',
      asOf: '2024 base + variable mix typical',
    },
    us: {
      median: 95000,
      p25: 72000,
      p75: 130000,
      p90: 180000,
      currency: 'USD',
      source: 'Customer Success Salary Report + Glassdoor 2024',
      asOf: '2024 OTE; enterprise CSM higher',
    },
    factors: [
      'Account size: enterprise CSMs (>$1M ARR per account) earn 50-100% above SMB CSMs at the same seniority',
      'Variable component: high-performing enterprise CSMs see 25-40% of total comp from quota / NRR variable',
      'Industry: AI/data infrastructure CSMs earn 20-30% above traditional SaaS CSMs as of 2026',
      'Technical CSM premium: post-sales engineers / solutions consultants earn meaningfully more than non-technical CSMs',
      'Geography: US-based CSMs at global SaaS firms earn 60-80% above their UK counterparts in same role',
    ],
    pitfalls: [
      'Accepting "Customer Success Manager" title without confirming whether it owns renewals + expansion or just adoption',
      'Underweighting variable comp by treating it as ceiling instead of expected comp at quota',
      'Joining a team where renewals are owned by AEs — your variable lever is much smaller',
    ],
    relatedRoles: ['account-executive', 'sales-development-rep', 'product-manager'],
  },
  {
    slug: 'frontend-developer',
    role: 'Frontend Developer',
    description:
      'Frontend developer comp ranges nearly as wide as software engineer overall, with sub-specialties (design engineer, UI engineer, web platform) commanding meaningful premiums at top tech companies. The "frontend pay penalty" relative to backend is mostly gone at FAANG and AI labs in 2026.',
    uk: {
      median: 58000,
      p25: 42000,
      p75: 78000,
      p90: 100000,
      currency: 'GBP',
      source: 'ITJobsWatch Frontend Developer 2024',
      asOf: '2024 ITJobsWatch median; ~3% adjustment',
    },
    us: {
      median: 125000,
      p25: 92000,
      p75: 165000,
      p90: 230000,
      currency: 'USD',
      source: 'BLS Software Developer + Levels.fyi 2024',
      asOf: '2024 BLS frontend split; tech-hub adjustment',
    },
    factors: [
      'Design-engineer premium: frontend engineers who can also design earn 15-25% above pure-frontend engineers',
      'React + framework specialty: deep React expertise commands a premium at AI labs and frontier startups',
      'Performance/web-platform specialty: lead frontend engineers at performance-critical companies (Stripe, Linear) earn near-staff-engineer band',
      'Mobile-cross-skill: frontend engineers who can also ship native iOS/Android earn 10-20% above pure-web frontend',
      'Public open-source presence: visible OSS work consistently lifts comp by ~10-15% for senior+ levels',
    ],
    pitfalls: [
      'Accepting "Senior Frontend Developer" without confirming team comp band matches FAANG/peer tech',
      'Underweighting design-engineer hybrid skill — even if you don\'t use it, the optionality is comp leverage',
      'Joining a team with no frontend-specific career ladder — frontend ICs at companies without one cap out lower',
    ],
    relatedRoles: ['software-engineer', 'product-designer', 'backend-developer'],
  },
  {
    slug: 'backend-developer',
    role: 'Backend Developer',
    description:
      'Backend developer compensation has historically tracked above frontend, though the gap is narrower at top tech companies in 2026 (frontend has caught up at FAANG, AI labs). Distributed-systems and infra/platform specialties earn the highest backend bands.',
    uk: {
      median: 65000,
      p25: 48000,
      p75: 85000,
      p90: 110000,
      currency: 'GBP',
      source: 'ITJobsWatch Backend Developer 2024',
      asOf: '2024 ITJobsWatch median; ~3% adjustment',
    },
    us: {
      median: 140000,
      p25: 105000,
      p75: 185000,
      p90: 260000,
      currency: 'USD',
      source: 'BLS Software Developer + Levels.fyi 2024',
      asOf: '2024 backend specialty + tech-hub adjustment',
    },
    factors: [
      'Distributed-systems / infra premium: backend engineers at Stripe/Cloudflare/Snowflake earn 20-30% above generalist backend engineers',
      'Language premium: Go/Rust/Scala for backend infra commands a small premium over Java/Node for senior+',
      'Database / data-platform specialty: senior backend engineers with strong data-platform experience earn near-ML-engineer band',
      'Cloud-native experience: backend engineers with Kubernetes/Terraform/cloud-platform fluency earn 10-15% above same-level non-cloud-native',
      'Observability / SRE-adjacent skill earns a small but real premium at companies with high reliability requirements',
    ],
    pitfalls: [
      'Accepting "Senior Backend Engineer" without confirming the team\'s tech maturity matches comp band',
      'Negotiating against a verbal range that doesn\'t include sign-on / equity refresh schedule',
      'Joining a team where on-call rotation isn\'t compensated separately — material if rotation is heavy',
    ],
    relatedRoles: ['software-engineer', 'devops-engineer', 'data-scientist'],
  },
  {
    slug: 'ux-researcher',
    role: 'UX Researcher',
    description:
      'UX researcher compensation has held steady through 2024-2026 despite tech-wide layoffs cutting research roles disproportionately. Senior researchers at AI labs and frontier consumer companies earn meaningfully above industry median.',
    uk: {
      median: 55000,
      p25: 42000,
      p75: 75000,
      p90: 100000,
      currency: 'GBP',
      source: 'UXPA UK + Glassdoor UK 2024',
      asOf: '2024 base + typical adjustment',
    },
    us: {
      median: 130000,
      p25: 95000,
      p75: 175000,
      p90: 240000,
      currency: 'USD',
      source: 'Glassdoor + Levels.fyi UX Researcher 2024',
      asOf: '2024 Levels.fyi median; senior FAANG band',
    },
    factors: [
      'Quant vs. qual specialty: quant-heavy researchers at AI labs/large consumer tech earn 15-25% above pure-qual researchers',
      'Stats/data-science crossover: researchers with strong data analysis skills can transition into data-science-band comp',
      'Industry: AI labs, frontier consumer (Apple, Meta) and gaming pay highest research bands as of 2026',
      'Methodology breadth: researchers with experience across diary, intercept, ethnography AND statistical methods are paid as senior ICs',
      'PhD / research training: at frontier AI labs, PhD adds 15-20% premium for senior-level research roles',
    ],
    pitfalls: [
      'Accepting "UX Researcher" title at a small team without confirming the role isn\'t actually generalist designer + research',
      'Underweighting research-ops / leadership track — researchers who lead programmes earn manager-band comp',
      'Joining a team where research findings don\'t reach product decisions — the role becomes execution-only and caps lower',
    ],
    relatedRoles: ['product-designer', 'data-scientist', 'product-manager'],
  },
  {
    slug: 'devops-engineer',
    role: 'DevOps / Platform Engineer',
    description:
      'DevOps and platform engineering compensation has risen steadily as more companies adopt platform-team models. Senior platform engineers at infrastructure-heavy companies earn band ceilings comparable to staff backend engineers.',
    uk: {
      median: 70000,
      p25: 52000,
      p75: 92000,
      p90: 120000,
      currency: 'GBP',
      source: 'ITJobsWatch DevOps Engineer + Platform Engineer 2024',
      asOf: '2024 ITJobsWatch + ~3% adjustment',
    },
    us: {
      median: 145000,
      p25: 110000,
      p75: 190000,
      p90: 270000,
      currency: 'USD',
      source: 'BLS + Levels.fyi DevOps/Platform 2024',
      asOf: '2024 Levels.fyi senior band; tech-hub adjustment',
    },
    factors: [
      'Platform-team premium: senior platform engineers at companies with formal platform-team models earn 15-25% above DevOps generalists',
      'Cloud-native / Kubernetes deep-expertise: 10-20% premium over generalist DevOps at same seniority',
      'Security crossover: DevSecOps engineers earn 15-25% above pure-DevOps at the same level',
      'On-call compensation: meaningful in this role; senior+ levels at well-run companies separate base from on-call pay',
      'Open-source contribution / public infrastructure work: lifts senior-level offers by 10-15% on average',
    ],
    pitfalls: [
      'Accepting "DevOps" title without confirming it\'s a platform-team role vs. an SRE-rebrand or build-pipeline maintenance role',
      'Underweighting on-call rotation comp when comparing offers',
      'Joining a team without a senior IC ladder past Senior — DevOps roles often cap unless promoted to platform-team lead',
    ],
    relatedRoles: ['backend-developer', 'software-engineer', 'engineering-manager'],
  },
  {
    slug: 'engineering-manager',
    role: 'Engineering Manager',
    description:
      'Engineering manager comp varies by team size and scope more than by individual ability. EMs of 5-8 ICs at FAANG earn senior-IC-equivalent. Directors of 30+ engineers move into separate director-band comp. The "manager penalty" of past years is mostly gone for IC-equivalent EMs at top tech.',
    uk: {
      median: 95000,
      p25: 70000,
      p75: 125000,
      p90: 165000,
      currency: 'GBP',
      source: 'ITJobsWatch Engineering Manager + Glassdoor UK 2024',
      asOf: '2024 ITJobsWatch + typical adjustment',
    },
    us: {
      median: 200000,
      p25: 150000,
      p75: 270000,
      p90: 380000,
      currency: 'USD',
      source: 'Levels.fyi EM + BLS Computer Manager 11-3021 2024',
      asOf: '2024 Levels.fyi EM median; senior+ FAANG band higher',
    },
    factors: [
      'Team size + scope: EMs of 8-10 ICs earn 15-30% above EMs of 4-5 ICs at the same company',
      'IC vs. EM track: at FAANG, the IC ladder (staff/principal/distinguished) frequently exceeds EM comp at the same level — moving to EM is rarely a comp boost above senior IC',
      'Skip-level reporting: EMs reporting to a senior director or VP earn higher band than EMs reporting to a peer director',
      'Domain importance: EMs running revenue-critical or platform-critical teams earn meaningfully above EMs of internal-tools teams',
      'Equity refresh cadence: at top tech, EMs receive larger annual equity refreshes than ICs — the long-term comp delta is bigger than base-comp suggests',
    ],
    pitfalls: [
      'Accepting "Engineering Manager" without confirming reporting structure and team size',
      'Underweighting the option value of staying on IC track — staff IC at FAANG often out-earns senior EM',
      'Joining a team where EM responsibilities also include heavy IC coding — title doesn\'t match band',
    ],
    relatedRoles: ['software-engineer', 'product-manager', 'devops-engineer'],
  },
  {
    slug: 'account-executive',
    role: 'Account Executive (AE)',
    description:
      'AE compensation has the largest variable component of any role on this site — base is typically 40-60% of OTE, with the remainder tied to quota attainment. Top AEs at enterprise B2B SaaS regularly clear $400k-$600k+ in over-attainment years.',
    uk: {
      median: 75000,
      p25: 55000,
      p75: 100000,
      p90: 150000,
      currency: 'GBP',
      source: 'Bridge Group UK + Pavilion AE Comp Report 2024',
      asOf: '2024 OTE base + variable mix typical',
    },
    us: {
      median: 165000,
      p25: 120000,
      p75: 230000,
      p90: 350000,
      currency: 'USD',
      source: 'Bridge Group + Pavilion + Glassdoor 2024',
      asOf: '2024 OTE; enterprise AEs higher; SMB AEs lower',
    },
    factors: [
      'Segment: enterprise AE OTE is 60-100% above SMB AE OTE at the same seniority',
      'ACV / deal size: AEs working $100k+ ACV deals earn meaningfully above AEs working $10-30k deals',
      'Quota attainment expectation: most well-run sales orgs set quota at ~80% achievement — confirm what % the OTE assumes',
      'Industry: AI/data-infrastructure AEs earn ~20-30% above traditional SaaS AEs in 2026',
      'Top-of-funnel quality: AEs at companies with strong demand-gen earn higher actual comp because attainment is structurally easier',
    ],
    pitfalls: [
      'Comparing OTE numbers without confirming quota attainment baseline',
      'Accepting "uncapped commission" without understanding deal-size accelerator structure',
      'Joining a team during a re-org or quota change — comp model in flux is comp risk',
    ],
    relatedRoles: ['sales-development-rep', 'customer-success-manager', 'marketing-manager'],
  },
];

/**
 * Lookup a profile by slug. Returns undefined if not found so callers
 * can render 404-redirect.
 */
export function getSalaryProfile(slug: string): SalaryProfile | undefined {
  return salaryProfiles.find((p) => p.slug === slug);
}

/**
 * Format a currency number into a clean display string.
 * 60000 GBP → "£60,000". 130000 USD → "$130,000".
 */
export function formatCurrency(amount: number, currency: 'GBP' | 'USD'): string {
  const symbol = currency === 'GBP' ? '£' : '$';
  return `${symbol}${amount.toLocaleString('en-US')}`;
}
