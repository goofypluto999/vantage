// /api/og?slug=<topic-slug> — runtime-generated OG card per topic.
//
// Per docs/aimvantage-tactical-deploy-playbook-2026-05-08.md section 9:
// for social, image search, Discover-like surfaces, Slack/Discord/LinkedIn
// unfurls, and AI browsing previews — the IMAGE is the snippet. Most small
// SaaS sites ship one generic OG card. This endpoint generates a route-
// specific card on demand, so /jobscan-cost-calculator and /ats/workday
// each get their own answer-card image.
//
// Usage from any page:
//   <meta property="og:image" content="https://aimvantage.uk/api/og?slug=workday-parser" />
//   <img src="/api/og?slug=workday-parser" alt="..." />
//
// The card is rendered server-side by @vercel/og (Satori + Resvg WASM,
// no native deps). Cached at the edge for 1h so repeated unfurls don't
// re-render.

import { ImageResponse } from '@vercel/og';

// Force the Edge runtime — @vercel/og requires it.
export const config = { runtime: 'edge' };

interface CardSpec {
  problem: string;       // The pain in 1 short sentence
  proof: string;         // Why / how — 1 sentence
  action: string;        // The next step the reader should take
  badge: string;         // Top-right pill text (e.g. "ATS GUIDE")
  hue: string;           // CSS color for the accent
}

// Hand-curated answer cards for the highest-traffic topics. Add a row
// here, redeploy, and the new card is live at /api/og?slug=<key>.
const CARDS: Record<string, CardSpec> = {
  'workday-parser': {
    problem: 'Workday breaks two-column CVs.',
    proof: 'The parser reads visual columns as document-stream order — your CV interleaves into nonsense before any human sees it.',
    action: 'Use a one-column CV before applying. Test it free at CV Mirror.',
    badge: 'ATS GUIDE',
    hue: '#f97316',
  },
  'jobscan-alternative': {
    problem: 'Jobscan: $49.95/mo. Vantage: £5 once.',
    proof: 'Same coverage area, 50× cheaper. 10 free prep packs on signup, no card.',
    action: 'See the year-long cost breakdown in the calculator.',
    badge: 'COST CALCULATOR',
    hue: '#10b981',
  },
  'no-interviews': {
    problem: '200 applications, 0 interviews?',
    proof: 'You\'re probably hitting one of 7 specific failure modes. None of them are "you suck".',
    action: '5 questions, 60 seconds, deterministic verdict. No signup.',
    badge: 'FREE DIAGNOSTIC',
    hue: '#a855f7',
  },
  'ghost-job': {
    problem: 'That listing is probably a ghost job.',
    proof: 'Multiple seniorities collapsed. Salary band of $80K-$280K. "We use the latest tech." Classic tells.',
    action: 'Score any listing 0-100 in 5 seconds. Free, no signup.',
    badge: 'GHOST DETECTOR',
    hue: '#f43f5e',
  },
  'cover-letter-roast': {
    problem: 'Your cover letter sounds like everyone else\'s.',
    proof: '"Results-driven dynamic professional" — the recruiter has seen this 200 times this week.',
    action: 'Get a savage but specific roast in 10 seconds. Free.',
    badge: 'COVER LETTER',
    hue: '#ec4899',
  },
  'openai-interview': {
    problem: 'OpenAI interviews don\'t fit a generic template.',
    proof: '4-6 stages: tech screen + system design at AI scale + alignment + values-fit. Memorized answers fail values-fit.',
    action: 'Free OpenAI prep guide + tailored prep packs against the actual JD.',
    badge: 'INTERVIEW PREP',
    hue: '#06b6d4',
  },
  'receipts': {
    problem: 'Is Vantage AI legit?',
    proof: 'UK sole trader, Stripe-only billing, no DM outreach, no auto-renew traps, public bug history, EU hosting.',
    action: 'Read the single-page trust audit before uploading anything.',
    badge: 'TRUST AUDIT',
    hue: '#22c55e',
  },
  'pricing': {
    problem: '£5 = 20 prep packs. Tokens never expire.',
    proof: 'Or 10 free on signup, no card. 1 token = 1 full analysis (company intel + cover letter + interview Qs + fit + pitch).',
    action: 'See the full plan comparison.',
    badge: 'PRICING',
    hue: '#7c3aed',
  },
  'default': {
    problem: 'AI job preparation in 90 seconds.',
    proof: 'Upload CV, paste job link. Get company intel + cover letter + interview Qs + fit score + pitch.',
    action: '10 free prep packs on signup. No card.',
    badge: 'VANTAGE AI',
    hue: '#4f46e5',
  },
};

export default function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = (searchParams.get('slug') || 'default').slice(0, 64);
    const card = CARDS[slug] || CARDS['default'];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 60%, #2d2654 100%)',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '64px 72px',
            position: 'relative',
            justifyContent: 'space-between',
          }}
        >
          {/* Top row: badge + brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                background: card.hue,
                color: 'white',
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: '0.18em',
                padding: '10px 20px',
                borderRadius: 999,
                textTransform: 'uppercase',
              }}
            >
              {card.badge}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 800,
                opacity: 0.85,
                letterSpacing: '0.04em',
              }}
            >
              VANTAGE
            </div>
          </div>

          {/* Headline (problem) */}
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginTop: 24,
            }}
          >
            {card.problem}
          </div>

          {/* Proof + Action stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                fontWeight: 500,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {card.proof}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                fontWeight: 700,
                color: card.hue,
                lineHeight: 1.3,
              }}
            >
              → {card.action}
            </div>
          </div>

          {/* Bottom-right URL stamp */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 20,
                fontWeight: 600,
                opacity: 0.55,
                letterSpacing: '0.02em',
              }}
            >
              aimvantage.uk
            </div>
          </div>

          {/* Decorative accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 6,
              background: card.hue,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Edge cache 1h; same slug always renders identically.
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (e) {
    return new Response('og generation failed', { status: 500 });
  }
}
