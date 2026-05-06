/**
 * Press releases — published versions of marketing announcements.
 *
 * Each entry becomes:
 *   - One row on /press-releases (hub page)
 *   - One detail page at /press-releases/[slug] with NewsArticle schema
 *   - One sitemap entry
 *   - One link from /press for journalists
 *
 * Source of truth for the body content: docs/press-release-*.md.
 * Add a new release: append an entry here, redeploy. Sitemap auto-picks up.
 *
 * Strict schema rules (do NOT break):
 *   - All fields below are required (TypeScript enforces it).
 *   - publishedAt must be ISO 8601 (YYYY-MM-DD).
 *   - body sections must use the existing PressReleaseSection union — no new variants.
 *   - Anything in the "factCheck" array must be independently verifiable.
 */

export type PressReleaseSection =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string; cite: string }
  | { type: 'callout'; text: string };

export interface PressRelease {
  slug: string;
  /** SEO title — used in <title>, og:title, NewsArticle headline. Keep ≤ 80 chars. */
  title: string;
  /** Sub-headline shown on the hub card and at the top of the detail page. */
  subheadline: string;
  /** Plain-text summary used in meta description and og:description. ≤ 160 chars. */
  description: string;
  publishedAt: string;
  dateline: string;
  /** Plain-language body — renderer maps to HTML. */
  body: PressReleaseSection[];
  /** Tags surfaced on the hub card. */
  tags: string[];
  /** Verifiable facts displayed in a fact-checker block at the bottom. */
  factCheck: { fact: string; source: string }[];
}

export const pressReleases: PressRelease[] = [
  {
    slug: 'free-ats-preview-launch-2026-05-06',
    title: 'UK indie founder ships free ATS preview inside paid Vantage AI dashboard',
    subheadline:
      'Vantage AI\'s new in-product preview gives job seekers a one-click read on how five major Applicant Tracking Systems will parse their CV — at no extra cost to existing users.',
    description:
      'Vantage AI ships a free in-product ATS preview inside the paid prep-pack flow. Five vendor parsers (Workday, Greenhouse, Lever, Taleo, iCIMS), client-side, no upload.',
    publishedAt: '2026-05-06',
    dateline: 'ALNWICK, ENGLAND — May 6, 2026',
    tags: ['Product launch', 'AI tools', 'Career tech', 'Build in public', 'UK SaaS'],
    body: [
      {
        type: 'p',
        text:
          'Vantage AI, an AI-powered job-preparation tool at aimvantage.uk, today shipped a free in-product Applicant Tracking System (ATS) preview directly inside its dashboard. The new section runs entirely in the user\'s browser — no server upload — and gives an instant read on how five major ATS platforms (Workday, Greenhouse, Lever, Taleo, iCIMS) are likely to parse the user\'s uploaded CV.',
      },
      {
        type: 'p',
        text:
          'The preview is bundled at no extra charge inside Vantage AI\'s existing paid prep-pack flow. It complements the company\'s free, open-source companion tool, CV Mirror, which provides a deeper standalone scanner.',
      },
      {
        type: 'quote',
        text:
          'Most job seekers find out their CV broke parsing only after the rejection email. Putting an ATS preview right under the upload button means people can fix the parse issue before they spend tokens on a full prep pack — and before they apply for a role they can\'t reach.',
        cite: 'Giovanni Sizino Ennes, founder of Vantage AI',
      },
      { type: 'h2', text: 'About the build' },
      {
        type: 'p',
        text:
          'Vantage AI is a single-person project. Ennes operates as a UK sole trader and runs the business in public, including engineering write-ups on DEV.to, an open-source companion tool on GitHub, and a transparent operator page at aimvantage.uk/about. The full prep pack — company intelligence, tailored cover letter, mock interview questions with live AI grading, fit score, and a 5-minute pitch outline — is generated in approximately 90 seconds per analysis using Google Gemini 2.5 Flash.',
      },
      { type: 'h2', text: 'Pricing' },
      {
        type: 'p',
        text:
          'Vantage AI follows a pay-per-use model unusual in the category. A £5 one-time starter pack includes 20 tokens that never expire (one full analysis costs 3 tokens). Subscription tiers at £12 and £20 per month are available for heavy users. The companion CV Mirror tool is free, requires no account, and runs entirely client-side.',
      },
      { type: 'h2', text: 'Background' },
      {
        type: 'p',
        text:
          'Vantage AI launched in February 2026 and is in active build-in-public mode. The new ATS preview ships alongside a transparency push that includes detailed operator disclosure, a brand-disambiguation page (Vantage AI is unaffiliated with Vantage Recruitment, Vantage Consulting, or Vantagepoint AI), and machine-readable identity signals for AI search assistants.',
      },
      { type: 'h2', text: 'About Vantage AI' },
      {
        type: 'p',
        text:
          'Vantage AI is an AI-powered job-preparation SaaS at aimvantage.uk that turns a CV plus a job link into a tailored prep pack in approximately 90 seconds — including company research, a tailored cover letter, mock interview questions, fit score, and a 5-minute pitch outline. The product is operated by Giovanni Sizino Ennes, a UK-based independent founder (sole trader) building in public. Vantage AI also publishes the free, open-source CV Mirror, a fully client-side ATS scanner. Vantage AI is unaffiliated with Vantage Recruitment, Vantage Consulting, Vantagepoint AI, or any similarly named organisation.',
      },
      { type: 'h2', text: 'Press contact' },
      {
        type: 'p',
        text:
          'Giovanni Sizino Ennes — Operator, Vantage AI · giovanni.sizino.ennes@hotmail.co.uk · https://aimvantage.uk/about',
      },
    ],
    factCheck: [
      { fact: 'Operator legal name is Giovanni Sizino Ennes (UK sole trader)', source: 'https://aimvantage.uk/about' },
      { fact: 'Domain is rated CLEAN by CheckPhish, Norton SafeWeb, Google Safe Browsing as of 6 May 2026', source: 'https://safeweb.norton.com/report/show?url=aimvantage.uk' },
      { fact: 'Open-source companion tool is publicly available', source: 'https://github.com/goofypluto999/cv-mirror-mcp' },
      { fact: 'Founder publishes engineering write-ups in public', source: 'https://dev.to/goofypluto999' },
      { fact: 'All payments run through Stripe Checkout — no direct financial-data collection', source: 'https://aimvantage.uk/privacy' },
      { fact: 'Vantage AI is unaffiliated with Vantage Recruitment, Vantage Consulting, Vantagepoint AI', source: 'https://aimvantage.uk/about' },
    ],
  },
];

export function getPressReleaseBySlug(slug: string): PressRelease | undefined {
  return pressReleases.find((p) => p.slug === slug);
}
