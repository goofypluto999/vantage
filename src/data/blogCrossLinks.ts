/**
 * Blog cross-link targets — internal-linking layer that distributes
 * topical authority from blog posts to commercial-intent pages.
 *
 * Each entry has a tag-set; the surfaced links on a blog post are scored
 * by tag-overlap with the post's own tags. This means the same 4 cross-
 * links don't appear on every post — relevance is contextual.
 */

export interface CrossLinkTarget {
  label: string;
  href: string;
  type: 'alternatives' | 'sample' | 'faq' | 'tool' | 'guide' | 'salary' | 'compare';
  description: string;
  /** Post tags that should surface this target. Lowercase, no punctuation. */
  tags: string[];
}

export const crossLinks: CrossLinkTarget[] = [
  // ─────── Alternatives + comparison surfaces ───────
  {
    label: 'Vantage vs Jobscan',
    href: '/alternatives/jobscan',
    type: 'alternatives',
    description: 'Honest side-by-side: keyword matcher at $49.95/mo vs full prep pack at £5 one-time.',
    tags: ['ats', 'cv', 'resume', 'job search', 'ai tools'],
  },
  {
    label: 'Vantage vs Teal',
    href: '/alternatives/teal',
    type: 'alternatives',
    description: 'Tracker vs prep tool — when to use each, and why most people end up using both.',
    tags: ['job search', 'productivity', 'career'],
  },
  {
    label: 'Vantage vs Final Round AI',
    href: '/alternatives/final-round-ai',
    type: 'alternatives',
    description: 'The ethical alternative — preparation before the interview, not in-call AI cheating.',
    tags: ['interview prep', 'ai tools', 'ai security'],
  },
  {
    label: 'Vantage vs Resume Worded',
    href: '/alternatives/resume-worded',
    type: 'alternatives',
    description: 'Generic CV score vs CV-fit-against-a-specific-role plus cover letter and interview prep.',
    tags: ['cv', 'resume', 'recruiting'],
  },
  {
    label: 'All alternatives',
    href: '/alternatives',
    type: 'alternatives',
    description: 'Honest comparisons across 4 of the most-searched job-application AI tools.',
    tags: ['ai tools', 'job search', 'career'],
  },
  {
    label: 'Side-by-side feature comparison',
    href: '/compare',
    type: 'compare',
    description: 'Vantage vs Teal vs Resume.io vs Jobscan in one table. Pricing, features, what each one wins at.',
    tags: ['ai tools', 'cv', 'job search'],
  },

  // ─────── Sample analyses (proof surfaces) ───────
  {
    label: 'Sample: Anthropic Senior PM analysis',
    href: '/sample/anthropic-senior-pm',
    type: 'sample',
    description: 'A complete real-style Vantage analysis for a Senior PM role at Anthropic. Fit score, cover letter, mock questions.',
    tags: ['interview prep', 'ai tools', 'job search', 'career'],
  },
  {
    label: 'Sample: Stripe Staff PM analysis',
    href: '/sample/stripe-staff-pm',
    type: 'sample',
    description: 'Calibrated 78/100 fit. Strategic brief covers code-quality bar and writing-as-thinking culture.',
    tags: ['interview prep', 'pm', 'career'],
  },
  {
    label: 'Sample: OpenAI ML Engineer analysis',
    href: '/sample/openai-ml-eng',
    type: 'sample',
    description: 'Calibrated 73/100 fit with explicit gap analysis and four closing moves.',
    tags: ['interview prep', 'ml', 'ai tools', 'career'],
  },

  // ─────── FAQ + content surfaces ───────
  {
    label: 'FAQ',
    href: '/faq',
    type: 'faq',
    description: 'Common questions about Vantage — pricing, privacy, the four cover-letter tones, who it\'s for.',
    tags: ['ai tools', 'job search', 'career', 'pricing'],
  },

  // ─────── Free tools ───────
  {
    label: 'Free Cover Letter Roast',
    href: '/roast',
    type: 'tool',
    description: 'Free AI roast of your cover letter — savage but useful, in 10 seconds. No signup.',
    tags: ['cover letter', 'ai tools', 'writing'],
  },
  {
    label: 'CV Mirror — Free ATS scanner',
    href: 'https://cv-mirror-web.vercel.app/',
    type: 'tool',
    description: 'Free, fully client-side ATS scanner. See exactly how 5 real ATSes parse your CV.',
    tags: ['ats', 'cv', 'resume', 'recruiting'],
  },
  {
    label: 'All free tools',
    href: '/tools',
    type: 'tool',
    description: 'Every free tool we ship — ATS scanner, cover letter feedback, interview prep packs, layoff guide.',
    tags: ['ai tools', 'job search', 'cv'],
  },

  // ─────── LinkedIn + adjacent guides ───────
  {
    label: 'LinkedIn profile optimization',
    href: '/linkedin-optimization',
    type: 'guide',
    description: '8-step concrete guide to make recruiters find you on LinkedIn. Free, no signup.',
    tags: ['linkedin', 'job search', 'recruiting', 'career'],
  },
  {
    label: 'The Vantage Playbook',
    href: '/playbook',
    type: 'guide',
    description: 'Week-1 layoff tactical playbook. CV format, parse-test, application prep, mock interview, follow-up.',
    tags: ['layoff', 'job search', 'career'],
  },
  {
    label: 'Layoff recovery guide',
    href: '/laid-off',
    type: 'guide',
    description: 'For the April 2026 layoff cohort. What to fix on your CV first, what to do in week 1, when to apply.',
    tags: ['layoff', 'career', 'job search'],
  },

  // ─────── Salary surfaces (Chunk 1 dependency) ───────
  {
    label: 'Salary by role — UK and US 2026',
    href: '/salary',
    type: 'salary',
    description: 'Real percentile data sourced from BLS, ONS, ITJobsWatch, Levels.fyi. No paywalls, every number cited.',
    tags: ['salary', 'compensation', 'negotiation', 'career'],
  },
  {
    label: 'Software Engineer salary 2026',
    href: '/salary/software-engineer',
    type: 'salary',
    description: 'UK median £60k, US median $130k. Tech-hub premium and company-tier factors detailed.',
    tags: ['salary', 'software engineer', 'compensation', 'career'],
  },
  {
    label: 'Product Manager salary 2026',
    href: '/salary/product-manager',
    type: 'salary',
    description: 'UK median £65k, US median $140k. Technical-PM premium documented.',
    tags: ['salary', 'pm', 'product manager', 'compensation'],
  },
  {
    label: 'Data Scientist salary 2026',
    href: '/salary/data-scientist',
    type: 'salary',
    description: 'UK median £60k, US median $130k. ML/research vs analytics split explained.',
    tags: ['salary', 'data scientist', 'ml', 'compensation'],
  },
];

/**
 * Tag-overlap scorer. Returns the top N cross-links sorted by relevance
 * to the post's tags. Falls back to defaults if no overlap, so every
 * post still gets links.
 */
export function getCrossLinks(postTags: string[], maxCount: number = 4): CrossLinkTarget[] {
  // Normalize post tags: lowercase, strip punctuation
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const postTagsNorm = postTags.map(normalize);

  // Score each crossLink by overlap count
  const scored = crossLinks.map((link) => {
    const linkTagsNorm = link.tags.map(normalize);
    const overlap = postTagsNorm.filter((pt) =>
      linkTagsNorm.some((lt) => lt.includes(pt) || pt.includes(lt))
    ).length;
    return { link, score: overlap };
  });

  // Sort: highest score first, then by type-priority (alternatives + sample
  // outrank tool / guide for surfacing), then alphabetical
  const typePriority: Record<CrossLinkTarget['type'], number> = {
    alternatives: 5,
    sample: 4,
    compare: 3,
    salary: 3,
    guide: 2,
    faq: 2,
    tool: 1,
  };

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const tp = typePriority[b.link.type] - typePriority[a.link.type];
    if (tp !== 0) return tp;
    return a.link.label.localeCompare(b.link.label);
  });

  // If best scores are 0 across the board, return a curated fallback set
  // so every post still has useful cross-links.
  const top = scored.slice(0, maxCount).map((s) => s.link);
  if (scored.every((s) => s.score === 0)) {
    return [
      crossLinks.find((c) => c.href === '/alternatives')!,
      crossLinks.find((c) => c.href === '/sample/anthropic-senior-pm')!,
      crossLinks.find((c) => c.href === '/faq')!,
      crossLinks.find((c) => c.href === '/tools')!,
    ];
  }
  return top;
}
