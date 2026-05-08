// /api/search-suggest?q=<query>
//
// OpenSearch suggestions endpoint per https://github.com/dewitt/opensearch
// /blob/master/opensearch-1-1-draft-6.md#opensearch-suggestions
// (also documented at MDN OpenSearch description format).
//
// Response shape: a 4-element JSON array:
//   [
//     "<original query>",
//     [<suggestion strings>],
//     [<suggestion descriptions>],
//     [<suggestion URLs>]
//   ]
//
// We don't have a live search index; instead we hand-curate a small map of
// common Vantage-related queries to their best destination URL. The browser
// uses these as live suggestions when the user types in the address bar
// after adding Vantage as a search provider.
//
// No PII, no logging, no auth. Edge-friendly: no DB call.

interface VercelRequest {
  query: { [key: string]: string | string[] | undefined };
  method?: string;
}
interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (k: string, v: string) => void;
  send: (body: unknown) => void;
}

interface SuggestionEntry {
  // Lowercase tokens that should match
  match: string[];
  // What the browser will display in the suggestion box
  label: string;
  // Hover/long-form description
  description: string;
  // Where the suggestion sends the user when chosen
  url: string;
}

const SUGGESTIONS: SuggestionEntry[] = [
  { match: ['cover', 'letter', 'roast'], label: 'Cover letter roast', description: 'Free AI roast of your cover letter (10s)', url: 'https://aimvantage.uk/roast' },
  { match: ['no', 'interview', 'interviews', 'diagnostic'], label: 'Why no interviews? — 60s diagnostic', description: '5-question deterministic diagnostic, 7 verdicts', url: 'https://aimvantage.uk/tools/no-interviews-diagnostic' },
  { match: ['decode', 'rejection', 'email'], label: 'Decode rejection email', description: 'AI translation of recruiter rejection language', url: 'https://aimvantage.uk/decode-rejection' },
  { match: ['ghost', 'job', 'fake'], label: 'Ghost job detector', description: 'Score how likely a job listing is a ghost (0-100)', url: 'https://aimvantage.uk/ghost-job-check' },
  { match: ['jobscan', 'cost', 'calculator', 'vs'], label: 'Jobscan vs Vantage cost calculator', description: '12-month cost comparison vs Vantage', url: 'https://aimvantage.uk/tools/jobscan-cost-calculator' },
  { match: ['ats', 'workday', 'parser', 'cv', 'mirror'], label: 'CV Mirror — free ATS scanner', description: 'See how Workday/Greenhouse/Lever/Taleo/iCIMS parse your CV', url: 'https://cv-mirror-web.vercel.app/' },
  { match: ['pricing', 'price', 'cost', 'plan'], label: 'Pricing', description: '£5 starter pack (20 prep packs, never expires) or monthly subscription', url: 'https://aimvantage.uk/pricing' },
  { match: ['receipts', 'trust', 'safe', 'legit', 'real'], label: 'Receipts (trust audit)', description: 'Single-page audit of every Vantage trust claim', url: 'https://aimvantage.uk/receipts' },
  { match: ['about', 'operator', 'founder', 'who'], label: 'About the operator', description: 'Giovanni Sizino Ennes, UK independent founder', url: 'https://aimvantage.uk/about' },
  { match: ['interview', 'prep', 'company'], label: 'Interview prep by company', description: 'Google, Meta, Amazon, Stripe, OpenAI, Anthropic, +14 more', url: 'https://aimvantage.uk/interview-prep' },
  { match: ['interview', 'questions', 'role', 'engineer', 'pm', 'data'], label: 'Interview questions by role', description: 'SWE, PM, DS, Frontend, DevOps, Marketing, +more', url: 'https://aimvantage.uk/interview-questions' },
  { match: ['layoff', 'laid', 'off', 'redundant', 'fired'], label: 'Just laid off? 2026 playbook', description: 'Cohort-specific layoff playbook + free AI tools', url: 'https://aimvantage.uk/laid-off' },
  { match: ['blog', 'article', 'guide'], label: 'Blog', description: 'Long-form guides on AI job prep', url: 'https://aimvantage.uk/blog' },
  { match: ['sample', 'example', 'demo'], label: 'Sample analyses', description: 'Real example outputs (no signup)', url: 'https://aimvantage.uk/sample/anthropic-senior-pm' },
  { match: ['tools', 'free'], label: 'All free tools', description: 'Hub of every free Vantage tool', url: 'https://aimvantage.uk/tools' },
  { match: ['changelog', 'release', 'updates'], label: 'Changelog', description: 'Public release log including bug history', url: 'https://aimvantage.uk/changelog' },
  { match: ['faq', 'help'], label: 'FAQ', description: 'Honest answers about what Vantage does', url: 'https://aimvantage.uk/faq' },
];

function rank(query: string): SuggestionEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return SUGGESTIONS
    .map((s) => {
      const labelLower = s.label.toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (labelLower.includes(tok)) score += 5;
        if (s.match.some((m) => m.includes(tok) || tok.includes(m))) score += 3;
      }
      if (labelLower.includes(q)) score += 10;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.s);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.q;
  const q = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : '';
  // Clamp query length to keep this endpoint cheap and abuse-resistant.
  const safeQ = (q || '').slice(0, 200);

  const matches = rank(safeQ);

  // OpenSearch Suggestions array shape.
  const body: [string, string[], string[], string[]] = [
    safeQ,
    matches.map((m) => m.label),
    matches.map((m) => m.description),
    matches.map((m) => m.url),
  ];

  res.setHeader('Content-Type', 'application/x-suggestions+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  // Allow OpenSearch clients on any origin (browsers issue CORS for suggest).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(JSON.stringify(body));
}
