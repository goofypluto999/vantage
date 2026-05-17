// API endpoint for cover letter tone rewriting
// Vercel serverless function — costs 1 credit
import { GoogleGenAI } from '@google/genai';
// HOTFIX 2026-05-17: Sentry import broke Vercel deploys (NFT didn't bundle
// ../../lib/observability/sentry). Same fix as api/interview/[action].ts.
function initSentry(): void { /* no-op until proper bundling fix */ }
function captureError(_err: unknown, _context?: Record<string, unknown>): void { /* no-op */ }

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const COST = 1;

async function deductTokens(userId: string, amount: number): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/deduct_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ p_user_id: userId, p_amount: amount }),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes('Insufficient')) throw new Error('Insufficient tokens');
    throw new Error('Failed to deduct tokens');
  }
  return res.json();
}

/**
 * Refunds tokens to a user. Returns true on confirmed success, false on
 * any failure (network, HTTP non-200). Callers must use the boolean to
 * gate user-facing copy that promises 'token refunded'.
 *
 * Codex audit HIGH-03 (2026-05-14): the previous version of this helper
 * never checked res.ok and treated 4xx/5xx as success. A user could lose
 * a token if Gemini failed and the refund RPC then errored. Now aligned
 * with the analyze + interview refund helpers.
 */
async function refundTokens(userId: string, amount: number): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ p_user_id: userId, p_amount: amount }),
    });
    if (!res.ok) {
      console.error('rewrite-tone refund non-ok for user', userId, 'status', res.status);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('rewrite-tone refund failed for user', userId, 'amount', amount, err?.message || '');
    return false;
  }
}

export default async function handler(request: any, response: any) {
  initSentry();
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace('Bearer ', '');

  // Lifted out so the outer catch can refund + report honestly if an
  // exception escapes the inner try. Parity with analyze + interview.
  let didCharge = false;
  let chargedUserId: string | null = null;

  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    });
    if (!userRes.ok) return response.status(401).json({ error: 'Invalid token' });

    const user = await userRes.json();

    // Validate inputs BEFORE spending tokens
    const { coverLetter, tone, roleContext } = request.body;
    if (!coverLetter || !tone) {
      return response.status(400).json({ error: 'coverLetter and tone are required' });
    }
    const VALID_TONES = ['Formal', 'Warm', 'Direct', 'Creative'];
    if (!VALID_TONES.includes(tone)) {
      return response.status(400).json({ error: 'Invalid tone' });
    }
    if (coverLetter.length > 10000) {
      return response.status(400).json({ error: 'Cover letter text is too long' });
    }
    if (roleContext && roleContext.length > 2000) {
      return response.status(400).json({ error: 'Role context is too long' });
    }

    // Deduct FIRST (atomic; raises 'Insufficient tokens' if balance too low).
    // If generation fails after this, we refund.
    let newBalance: number;
    try {
      newBalance = await deductTokens(user.id, COST);
      didCharge = true;
      chargedUserId = user.id;
    } catch (err: any) {
      if (err.message?.includes('Insufficient')) {
        return response.status(403).json({ error: 'Insufficient tokens' });
      }
      throw err;
    }

    const prompt = `Rewrite this cover letter in a ${tone} tone. Preserve every specific fact, name, number, and outcome from the original — change only the voice, structure of sentences, and register. The goal is that the same evidence reads dramatically differently across tones, so the candidate can pick the version that fits the company.

Tone guidelines (be DISTINCTIVE — each tone must feel different from the others, not a softer/sharper version of the same voice):

  Formal — measured, slightly distanced, classic business letter register. Long-form sentences with one strong clause and one supporting clause. Uses phrases like "I would welcome the opportunity to" / "the role appears to align with my background in". Suits law firms, financial services, government, traditional engineering, healthcare administration.

  Warm — first-person and human. Reads like a person, not a template. Acknowledges the reader's perspective ("I noticed your team is hiring after the X launch — that's the kind of inflection point I love walking into"). Allowed to use short sentences. Suits early-stage startups, design studios, nonprofits, mission-driven companies, hospitality.

  Direct — minimum sentence count, maximum information density. No preamble. Opens with the strongest CV proof point. Each sentence carries one fact or one outcome. No connective tissue ("In addition to that, I would also..."). Uses the active voice. Suits engineering teams at scale, fast-growing SaaS, sales-led organisations, ops roles.

  Creative — narrative-shaped. Opens with a one-sentence hook from the candidate's story (a moment, a turning point, a specific encounter), then ties it to the role. Allowed to be more vivid, allowed one metaphor, allowed sentence-fragment punctuation for rhythm. Suits creative agencies, product-marketing, content roles, brand strategy.

STRICT RULES (apply regardless of tone):
  • Keep the 3-paragraph structure of the original. Same evidence in roughly the same paragraph.
  • Keep the same length range (220-300 words across the 3 paragraphs).
  • Keep every specific fact: company name, role name, recent news referenced, numbers, named achievements, and the proposed first-30-days initiative.
  • Do NOT use these dead phrases in any tone: "I am passionate about", "I am writing to express my interest", "great fit", "deeply impressed", "thrilled at the opportunity", "wear many hats", "results-oriented", "synergy", "leverage", "go-getter", "team player". They are dead in formal too.
  • Do NOT add new claims or new metrics not in the original — this is a rewrite, not an embellishment.
  • Do NOT signal the tone in meta-commentary ("In a creative tone, …" / "Formally speaking, …"). The tone shows in the writing, never in the framing.

${roleContext ? `Role context: ${roleContext}\n` : ''}
Original cover letter:
${coverLetter}

Return ONLY the rewritten cover letter text. No explanation, no preamble, no markdown fences, no "Here is the rewrite".`;

    let aiResponse;
    try {
      aiResponse = await ai.models.generateContent({
        model: 'models/gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
      });
      if (!aiResponse.text) throw new Error('No response from AI');
    } catch (err) {
      // Refund on AI failure so the user isn't charged for nothing.
      // didCharge is set to false if refund actually succeeded, so the
      // outer catch knows the user is square. If refund fails, the
      // outer catch surfaces an honest "contact support" message.
      const refundOk = await refundTokens(user.id, COST);
      didCharge = !refundOk;
      throw err;
    }

    didCharge = false; // success — legitimately earned
    return response.status(200).json({
      success: true,
      coverLetter: aiResponse.text.trim(),
      token_balance: newBalance,
    });
  } catch (error: any) {
    console.error('Rewrite tone error:', error?.message || 'Unknown error');
    if (error.message?.includes('Insufficient')) {
      return response.status(500).json({ error: error.message });
    }
    let refundSucceeded = false;
    if (didCharge && chargedUserId) {
      refundSucceeded = await refundTokens(chargedUserId, COST);
    }
    captureError(error, {
      route: '/api/rewrite-tone',
      user_id: chargedUserId,
      did_charge: didCharge,
      refund_succeeded: refundSucceeded,
    });
    return response.status(500).json({
      error: !didCharge
        ? 'Failed to rewrite cover letter. Please try again.'
        : refundSucceeded
          ? 'Failed to rewrite cover letter. Your token was refunded — please try again.'
          : 'Failed to rewrite cover letter AND token refund failed. Please contact support@aimvantage.uk to have your token restored.',
    });
  }
}
