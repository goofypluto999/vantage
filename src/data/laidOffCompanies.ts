/**
 * Layoff cohort data — used by /laid-off/from/:company programmatic pages.
 *
 * Each company has specific 2026 layoff context, common roles affected, and
 * tailored advice. Pages target queries like "Oracle layoff april 2026",
 * "Meta layoff what to do next", "ASML redundancy uk".
 *
 * Public source numbers: published news coverage of each company's
 * announcement.
 */

export interface LaidOffCompany {
  slug: string;
  /** Display name (used in headlines) */
  name: string;
  /** Full corporate name */
  legalName: string;
  /** Affected count (rounded, public) */
  affectedCount: string;
  /** Date of announcement */
  announcedDate: string;
  /** Effective date if different */
  effectiveDate?: string;
  /** Plain-language description of the layoff */
  context: string;
  /** Common roles affected — used to target specific job-search keywords */
  commonRoles: string[];
  /** Specific advice for this company's cohort */
  specificAdvice: { title: string; body: string }[];
  /** ATSes this company's typical next employer is most likely to use */
  likelyNextATSes: string[];
  /** Related companies (for cross-linking) */
  relatedCompanies: string[];
}

export const laidOffCompanies: LaidOffCompany[] = [
  {
    slug: 'oracle',
    name: 'Oracle',
    legalName: 'Oracle Corporation',
    affectedCount: 'Up to 30,000',
    announcedDate: 'April 2026',
    context: 'Oracle issued a mass layoff via 6am email, affecting up to 30,000 employees across cloud, hardware, and consulting divisions. The cohort lit up LinkedIn within minutes of the email.',
    commonRoles: ['Software Engineer', 'Cloud Engineer', 'Sales', 'Customer Success Manager', 'Solutions Architect', 'Database Administrator', 'Consultant', 'Product Manager'],
    specificAdvice: [
      {
        title: 'Your Oracle skills are highly valued — but the framing matters',
        body: 'Oracle Database, Oracle Fusion, OCI, Java, SQL, PL/SQL — these are in demand at every enterprise. But "Oracle Cloud Engineer" reads narrower than "Cloud Engineer with deep enterprise experience". Reframe transferably for non-Oracle shops.',
      },
      {
        title: 'Watch for Taleo at your next employer',
        body: 'Many enterprises that hire ex-Oracle talent (banks, insurance, public sector) still run Taleo as their ATS. It is Oracle-owned and parses CVs strictly. Standard sections, ASCII characters, single column. CV Mirror simulates Taleo specifically.',
      },
      {
        title: 'Severance + COBRA + EI — handle the paperwork in week 1',
        body: 'Don\'t let benefits paperwork slip. Oracle severance typically includes salary continuation; in the US, COBRA election windows are time-sensitive. UK Oracle employees: confirm statutory redundancy pay vs enhanced terms in the announcement.',
      },
      {
        title: 'LinkedIn connections are your strongest asset',
        body: 'Oracle has 150,000+ employees globally. Your immediate former colleagues are also job-hunting. The strongest signal is your specific 10 contacts — DM them with a specific ask, not a generic update.',
      },
    ],
    likelyNextATSes: ['Workday', 'Taleo', 'iCIMS'],
    relatedCompanies: ['meta', 'asml', 'snap'],
  },
  {
    slug: 'meta',
    name: 'Meta',
    legalName: 'Meta Platforms, Inc.',
    affectedCount: '8,000',
    announcedDate: 'April 17, 2026',
    effectiveDate: 'May 20, 2026',
    context: 'Meta announced a 10% headcount reduction (~8,000 employees) on April 17, 2026, with cuts effective May 20. The freed compensation budget is being redirected toward AI research and infrastructure.',
    commonRoles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Research Scientist', 'Product Designer', 'Engineering Manager', 'Recruiter', 'Marketing Manager'],
    specificAdvice: [
      {
        title: 'Use the May 20 runway',
        body: 'You have ~5 weeks between announcement and effective date. Use them. CV refresh, LinkedIn refresh, network outreach, and 30+ applications BEFORE you lose Meta email access.',
      },
      {
        title: 'Meta-internal acronyms don\'t translate',
        body: '"FYI", "DRI", "PRD", "TPM", "IC4 / IC5 / IC6", "PSC", "SRP" — every one of these reads as alphabet soup at a non-Meta employer. Translate to industry-standard equivalents on your CV.',
      },
      {
        title: 'AI/ML pivot is real',
        body: 'Meta is cutting non-AI roles to fund AI infrastructure. If you have any AI/ML adjacency in your background, lead with it. The market for ML engineers, AI infrastructure, and applied research is the strongest sub-segment of tech hiring in 2026.',
      },
      {
        title: 'The "ex-Meta" badge has signal value but only briefly',
        body: 'For ~6 months post-layoff, "ex-Meta" reads as senior signal. After that, it\'s just a former employer. Use the badge while it\'s hot — apply to roles 1-2 levels above your last Meta level.',
      },
    ],
    likelyNextATSes: ['Greenhouse', 'Lever', 'Workday'],
    relatedCompanies: ['oracle', 'snap', 'asml'],
  },
  {
    slug: 'asml',
    name: 'ASML',
    legalName: 'ASML Holding N.V.',
    affectedCount: '1,700',
    announcedDate: 'April 2026',
    context: 'ASML, the Dutch semiconductor lithography giant, cut 1,700 jobs across its European operations including significant reductions in the Netherlands and UK offices.',
    commonRoles: ['Mechanical Engineer', 'Electrical Engineer', 'Software Engineer', 'Process Engineer', 'Technical Sales', 'Field Service Engineer', 'Optical Engineer', 'Manufacturing Engineer'],
    specificAdvice: [
      {
        title: 'Semiconductor experience is rare and valuable',
        body: 'ASML is one of a handful of companies in the world doing EUV lithography. Your specific domain expertise is highly sought after. Target competitors (Applied Materials, KLA, Tokyo Electron, Lam Research), tier-1 chip manufacturers (TSMC, Samsung, Intel), and the broader photonics industry.',
      },
      {
        title: 'UK redundancy law specifics',
        body: 'If you\'re a UK ASML employee: confirm statutory minimum redundancy pay (1.5 weeks per year of service if 41+, 1 week if 22-40, 0.5 weeks if under 22). Confirm enhanced terms in your contract or the announcement. Get it in writing before signing anything.',
      },
      {
        title: 'European tech talent visa is a real asset',
        body: 'If you have rights to work in the EU/UK as a tech professional, that\'s leverage. Many semiconductor employers will sponsor visas — and your existing rights save them time. Mention work eligibility prominently on your CV.',
      },
      {
        title: 'Watch for Workday at next employer',
        body: 'Most large semiconductor and engineering firms run Workday as their ATS. Workday is strict on multi-column CVs. Single column, standard section names, plain fonts. CV Mirror simulates Workday specifically.',
      },
    ],
    likelyNextATSes: ['Workday', 'SuccessFactors', 'iCIMS'],
    relatedCompanies: ['oracle', 'meta', 'snap'],
  },
  {
    slug: 'snap',
    name: 'Snap',
    legalName: 'Snap Inc.',
    affectedCount: '1,000',
    announcedDate: 'April 2026',
    context: 'Snap cut approximately 1,000 jobs after activist investor pressure citing "over-hiring." The cuts hit product, engineering, and marketing teams.',
    commonRoles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'AR/VR Engineer', 'Creative Strategist', 'Marketing Manager', 'Product Designer', 'Community Manager'],
    specificAdvice: [
      {
        title: 'Consumer + AR experience is differentiated',
        body: 'Snap is one of the few companies with deep AR/AR-Lens production experience at scale. If you worked on Lenses, Spectacles, or AR creative tools, that\'s a niche and valuable specialization. Target Apple (Vision Pro), Meta (Reality Labs), and the broader AR ecosystem.',
      },
      {
        title: 'Younger-skewing user research is rare',
        body: 'Working at Snap means you have data and intuition about Gen Z product behavior that most companies lack. Frame this as a specific user-research advantage on your CV.',
      },
      {
        title: 'Snap stock equity — check your vesting',
        body: 'Activist-investor-driven layoffs sometimes coincide with stock price volatility. Confirm your remaining vesting schedule, the cliff for unvested RSUs, and any post-layoff exercise window for options.',
      },
      {
        title: 'Greenhouse and Lever are the most likely next ATSes',
        body: 'Tech-product roles in 2026 lean Greenhouse-heavy. Strip emoji from your CV, use exact section names, single column.',
      },
    ],
    likelyNextATSes: ['Greenhouse', 'Lever', 'Workday'],
    relatedCompanies: ['meta', 'oracle', 'nike'],
  },
  {
    slug: 'nike',
    name: 'Nike',
    legalName: 'NIKE, Inc.',
    affectedCount: '1,400',
    announcedDate: 'April 2026',
    context: 'Nike cut 1,400 employees in its latest round of restructuring, primarily affecting corporate roles in marketing, technology, and supply chain.',
    commonRoles: ['Marketing Manager', 'Product Manager', 'Supply Chain Analyst', 'Software Engineer', 'Brand Manager', 'Data Analyst', 'Designer', 'Operations Manager'],
    specificAdvice: [
      {
        title: 'Nike brand experience is portable',
        body: 'Working at Nike puts you in the top tier of consumer-brand experience. Target consumer goods (Unilever, P&G, Estée Lauder), tech-meets-retail (Apple, Amazon, Shopify), and direct-to-consumer brands. Your brand instincts translate.',
      },
      {
        title: 'Athlete partnerships and sponsorship work is rare',
        body: 'If you worked on athlete partnerships, the skill set transfers to creator economy roles, sports tech (Strava, Whoop, Peloton), and brand-side influencer management.',
      },
      {
        title: 'Beaverton location is a market reality',
        body: 'Most Nike layoffs hit Oregon. The Portland tech market is smaller than SF/NY/Seattle. Consider remote-first companies, relocation, or pivoting to non-tech industries with strong Portland presence (athletic wear, outdoor brands).',
      },
      {
        title: 'Workday is everywhere in retail/CPG',
        body: 'Most large retail and consumer goods companies run Workday. Single column, standard sections, plain fonts. CV Mirror simulates Workday specifically.',
      },
    ],
    likelyNextATSes: ['Workday', 'iCIMS', 'SuccessFactors'],
    relatedCompanies: ['oracle', 'meta', 'snap'],
  },
];

export function getCompanyBySlug(slug: string): LaidOffCompany | undefined {
  return laidOffCompanies.find((c) => c.slug === slug.toLowerCase());
}
