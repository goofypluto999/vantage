/**
 * ATS Vendor data — used by /ats/:vendor programmatic SEO pages.
 *
 * Each vendor has specific parse quirks documented in public sources.
 * Pages target queries like "workday resume parser", "greenhouse ATS cv",
 * "lever cv format" — high-intent long-tail queries with low competition.
 *
 * The pattern: generate a full vendor-specific page from this data file,
 * with FAQPage + HowTo schema for AEO (Answer Engine Optimization — getting
 * cited by Claude/ChatGPT/Gemini when users ask LLM questions about ATSes).
 */

export interface ATSVendor {
  slug: string;
  name: string;
  marketShare: string;
  parentCompany?: string;
  primaryUse: string;
  /** One-line description of the parser's behavior */
  parserBehavior: string;
  /** 4-6 specific quirks with concrete examples */
  quirks: { title: string; description: string }[];
  /** 4-6 specific fixes */
  fixes: { title: string; description: string }[];
  /** FAQ entries for the page (generates FAQPage schema) */
  faqs: { question: string; answer: string }[];
  /** Public-source citations for the rules */
  sources: { name: string; url: string }[];
}

export const atsVendors: ATSVendor[] = [
  {
    slug: 'workday',
    name: 'Workday',
    marketShare: 'Most-used ATS at Fortune 500 companies (~50% of large enterprise)',
    parentCompany: 'Workday Inc.',
    primaryUse: 'Enterprise HR + recruiting (e.g. JPMorgan, Walmart, Amazon, Salesforce)',
    parserBehavior: 'Reads PDFs in document-stream order, top to bottom. Strict on formatting.',
    quirks: [
      {
        title: 'Multi-column layouts get interleaved',
        description: 'If your CV has a sidebar (e.g. Skills on the left, Experience on the right), Workday reads top-to-bottom across columns. Your skills end up scattered between job entries.',
      },
      {
        title: 'Tables for layout break section detection',
        description: 'CVs that use HTML tables (or PDF table objects) for visual alignment confuse the parser. Section boundaries get lost. Workday may treat your "Education" header as a job title.',
      },
      {
        title: 'PDF header/footer text is unreliable',
        description: 'Contact info placed in a PDF header/footer (the way some Word templates do it) may be dropped entirely. Always put contact info in the document body.',
      },
      {
        title: 'Image-based PDFs are invisible',
        description: 'If you scanned your CV or exported it as image-based PDF, Workday sees nothing. Open the PDF, try Ctrl+F your name — if it doesn\'t find it, it\'s an image.',
      },
      {
        title: 'Graphics-heavy templates fail silently',
        description: 'Icons, decorative bars, infographic-style "skill bars" — these don\'t parse. The Workday parser strips them and may misalign nearby text.',
      },
    ],
    fixes: [
      { title: 'Use single-column layout', description: 'Always. The single biggest fix.' },
      { title: 'Standard section headers', description: '"Experience", "Education", "Skills", "Summary" — exact words. Avoid creative names like "My Story".' },
      { title: 'Plain fonts', description: 'Calibri, Arial, Helvetica, Times New Roman. Avoid decorative or display fonts.' },
      { title: 'Reverse chronological order', description: 'Most recent role first within each section.' },
      { title: 'Save as text-searchable PDF', description: 'In Word: File → Save As → PDF. Not "print to PDF" from an image source.' },
      { title: 'Test before submitting', description: 'Use a tool like CV Mirror to see exactly what Workday extracts before you send it.' },
    ],
    faqs: [
      {
        question: 'Does Workday read multi-column resumes correctly?',
        answer: 'No. Workday reads PDFs in stream order — top to bottom of the document, ignoring visual columns. Multi-column CVs get their content interleaved into a single linear stream, which scrambles section boundaries.',
      },
      {
        question: 'What is the best resume format for Workday ATS?',
        answer: 'Single column, standard section headers ("Experience", "Education", "Skills", "Summary"), reverse chronological, plain fonts (Calibri / Arial / Helvetica), saved as text-searchable PDF (not image-based).',
      },
      {
        question: 'Does Workday strip emoji from resumes?',
        answer: 'Workday handles standard Unicode reasonably well, but decorative icons embedded as images are ignored entirely. Greenhouse is the parser most known for stripping emoji codepoints.',
      },
      {
        question: 'How do I check if Workday will parse my resume correctly?',
        answer: 'Run your CV through a multi-vendor ATS scanner like CV Mirror (cv-mirror-web.vercel.app). It simulates Workday\'s parse stream-order behavior and shows you exactly what gets extracted.',
      },
    ],
    sources: [
      { name: 'Workday Help — Resume Parsing', url: 'https://doc.workday.com/' },
      { name: 'Workday Talent Best Practices', url: 'https://www.workday.com/' },
    ],
  },
  {
    slug: 'greenhouse',
    name: 'Greenhouse',
    marketShare: 'Used by ~40% of Series B+ tech startups and many mid-market enterprises',
    parentCompany: 'Greenhouse Software',
    primaryUse: 'Tech recruiting (e.g. Airbnb, Pinterest, DoorDash, Vox Media)',
    parserBehavior: 'Modern, generally forgiving. Some specific blind spots around special characters.',
    quirks: [
      {
        title: 'Strips emoji codepoints',
        description: 'Section headers like "Projects 🚀" lose their emoji and may also lose surrounding context. Avoid emoji in headers and body.',
      },
      {
        title: 'Section detection by exact wording',
        description: 'Greenhouse looks for specific section names. Non-standard headers ("My Story" instead of "Summary") may be skipped or misclassified.',
      },
      {
        title: 'Skills section parsing varies by template',
        description: 'A bullet list of skills works. A skills "cloud" or icon-based skills section may not be extracted.',
      },
      {
        title: 'Relatively good with PDFs',
        description: 'Greenhouse handles most common PDF formats well, including standard multi-column if columns are clearly delineated.',
      },
    ],
    fixes: [
      { title: 'Remove all emoji', description: 'Including from job titles. Use plain text only.' },
      { title: 'Standard section names', description: '"Summary", "Experience", "Education", "Skills" — these match Greenhouse expectations.' },
      { title: 'Skills as text list', description: 'Comma-separated list or bullet list. Avoid icon-based "skill bars".' },
      { title: 'Use clear bullet character', description: 'Standard "•" or "-". Some decorative bullets break parsing.' },
    ],
    faqs: [
      {
        question: 'Does Greenhouse strip emoji from resumes?',
        answer: 'Yes. Greenhouse strips emoji codepoints during parsing. Section headers like "Projects 🚀" lose the emoji and surrounding context may also be affected. Remove all emoji from your CV before submitting.',
      },
      {
        question: 'What sections does Greenhouse expect on a CV?',
        answer: 'Standard sections: Summary (or Profile), Experience (or Work Experience), Education, Skills. Non-standard names like "My Journey" or "What I Do" may be skipped or misclassified.',
      },
      {
        question: 'Does Greenhouse work with multi-column resumes?',
        answer: 'Greenhouse handles multi-column PDFs better than Workday but still inconsistently. Single-column layouts have the highest success rate across all major ATSes.',
      },
    ],
    sources: [
      { name: 'Greenhouse Support — Resume Formatting', url: 'https://support.greenhouse.io/' },
    ],
  },
  {
    slug: 'lever',
    name: 'Lever',
    marketShare: 'Popular among Series A/B tech companies (~25% of post-Series A)',
    parentCompany: 'Lever Inc. (acquired by Employ Inc., 2022)',
    primaryUse: 'Mid-market tech recruiting (e.g. Netflix, Shopify, Quora)',
    parserBehavior: 'Modern parser with historical quirks around PDF document structure.',
    quirks: [
      {
        title: 'Drops PDF header/footer content',
        description: 'Historically, Lever dropped anything placed in a PDF header or footer object. If your contact info lives in the page header, it may not get extracted.',
      },
      {
        title: 'Standard CV layouts work well',
        description: 'Lever handles single-column and well-formed multi-column reasonably. The header/footer issue is the main historical gotcha.',
      },
      {
        title: 'Date parsing requires consistent format',
        description: 'Mixed date formats (e.g. "Jan 2024" in one entry, "01/2024" in another) can confuse the timeline extraction.',
      },
    ],
    fixes: [
      { title: 'Keep contact info in document body', description: 'Don\'t use PDF headers/footers for name/email/phone.' },
      { title: 'Consistent date formatting', description: 'Pick one format ("Jan 2024 – Mar 2025") and stick with it throughout.' },
      { title: 'Single column preferred', description: 'Even though Lever handles columns OK, single column has zero ambiguity.' },
    ],
    faqs: [
      {
        question: 'Does Lever parse PDF headers?',
        answer: 'Historically Lever has dropped content placed in PDF header or footer objects. Always keep your contact information (name, email, phone) in the document body, not in the page header or footer.',
      },
      {
        question: 'What date format does Lever expect on a CV?',
        answer: 'Lever\'s timeline parser is most reliable with a consistent date format throughout. Pick one format ("Jan 2024 – Mar 2025") and use it for every job entry. Mixing formats can cause extraction errors.',
      },
    ],
    sources: [
      { name: 'Lever Help Center', url: 'https://help.lever.co/' },
    ],
  },
  {
    slug: 'taleo',
    name: 'Taleo',
    marketShare: 'Legacy enterprise — large public sector, banking, retail',
    parentCompany: 'Oracle',
    primaryUse: 'Enterprise + government recruiting (older deployments common in financial services, public sector)',
    parserBehavior: 'Older parser, strict on formatting. Among the harder ATSes to satisfy.',
    quirks: [
      {
        title: 'Strict on standard section names',
        description: 'Taleo expects "Education", "Work Experience" (or "Experience"), "Skills". Non-standard names like "Where I\'ve Worked" may be skipped.',
      },
      {
        title: 'Struggles with Unicode special characters',
        description: 'Em-dashes (—), curly quotes ("), and some non-ASCII characters may garble in older Taleo deployments.',
      },
      {
        title: 'Tables and graphics fail more often than newer ATSes',
        description: 'Taleo predates modern parser improvements. Anything visually clever fails more often than it succeeds.',
      },
      {
        title: 'Older deployments may require .doc or .docx',
        description: 'Some Taleo customer instances are configured to prefer Word formats over PDF for parsing reliability.',
      },
    ],
    fixes: [
      { title: 'Use only ASCII characters', description: 'Replace em-dashes with hyphens, curly quotes with straight quotes.' },
      { title: 'Submit both PDF and DOCX if option exists', description: 'When Taleo allows multiple file uploads, submit a Word version too.' },
      { title: 'Strictly standard section names', description: '"Summary", "Experience", "Education", "Skills" — no creativity.' },
      { title: 'Avoid all graphic elements', description: 'No icons, no decorative lines, no progress bars.' },
    ],
    faqs: [
      {
        question: 'Is Taleo still used in 2026?',
        answer: 'Yes, particularly in large enterprises in financial services, public sector, and retail. Many Oracle Fusion HCM customers run Taleo as their recruiting layer. It\'s an older parser and stricter on formatting than newer ATSes.',
      },
      {
        question: 'Should I use PDF or Word for Taleo?',
        answer: 'PDF is fine for most modern Taleo deployments, but some older customer instances prefer DOCX for parsing reliability. If both options are available on the application form, submit both.',
      },
      {
        question: 'Why does Taleo seem stricter than other ATSes?',
        answer: 'Taleo predates many of the parser improvements in newer ATSes like Greenhouse and Lever. Older parsing logic is more sensitive to non-standard section names, special characters, and graphical elements.',
      },
    ],
    sources: [
      { name: 'Oracle Talent Acquisition Cloud Documentation', url: 'https://docs.oracle.com/en/cloud/saas/talent-management/' },
    ],
  },
  {
    slug: 'icims',
    name: 'iCIMS',
    marketShare: 'Enterprise mid-market, common in retail, healthcare, manufacturing',
    parentCompany: 'iCIMS Inc.',
    primaryUse: 'Mid-market and enterprise recruiting (e.g. UPS, T-Mobile, Penske)',
    parserBehavior: 'Configuration-dependent — newer deployments parse well, older ones miss sections.',
    quirks: [
      {
        title: 'Behavior varies significantly by tenant',
        description: 'iCIMS is highly customizable per customer. Some deployments use modern parsing, others use legacy. You can\'t predict which without testing.',
      },
      {
        title: 'Section ordering matters in older configs',
        description: 'Some older iCIMS deployments expect specific section order (Summary → Experience → Education → Skills) and may misclassify if reordered.',
      },
      {
        title: 'Skills extraction is unreliable',
        description: 'iCIMS\'s skills extraction is among the weaker among major ATSes. A dedicated "Skills" section helps; embedded skills inside bullets often don\'t get extracted.',
      },
    ],
    fixes: [
      { title: 'Standard section order', description: 'Summary → Experience → Education → Skills (most common preferred order).' },
      { title: 'Dedicated Skills section', description: 'Comma-separated list or bullet list. Don\'t bury skills only inside job bullets.' },
      { title: 'Standard PDF format', description: 'Single column, plain fonts, text-searchable PDF.' },
    ],
    faqs: [
      {
        question: 'Is iCIMS good at parsing resumes?',
        answer: 'iCIMS quality varies by customer deployment. Newer iCIMS deployments parse well and handle most modern CV formats. Older deployments are stricter and may miss sections if formatting deviates from standard.',
      },
      {
        question: 'Where should the Skills section go on an iCIMS resume?',
        answer: 'A dedicated "Skills" section near the bottom of the CV (after Experience and Education) is the most reliable placement for iCIMS. Don\'t rely on iCIMS to extract skills only mentioned inside job description bullets.',
      },
    ],
    sources: [
      { name: 'iCIMS Talent Cloud Documentation', url: 'https://www.icims.com/customer-resources/' },
    ],
  },
];

export function getVendorBySlug(slug: string): ATSVendor | undefined {
  return atsVendors.find((v) => v.slug === slug.toLowerCase());
}
