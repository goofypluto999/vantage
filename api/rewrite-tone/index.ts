// API endpoint for cover letter tone rewriting
// Vercel serverless function — costs 1 credit
import { GoogleGenAI } from '@google/genai';

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

async function refundTokens(userId: string, amount: number): Promise<void> {
  // Best-effort refund via add_tokens RPC. If this fails we log but don't crash
  // the request — the user will see the generation error and we'll eat the cost.
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ p_user_id: userId, p_amount: amount }),
    });
  } catch (err: any) {
    console.error('Refund failed for user', userId, 'amount', amount, err?.message || '');
  }
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace('Bearer ', '');

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
    } catch (err: any) {
      if (err.message?.includes('Insufficient')) {
        return response.status(403).json({ error: 'Insufficient tokens' });
      }
      throw err;
    }

    const prompt = `Rewrite this cover letter in a ${tone} tone. Keep the same factual content and structure but adjust the voice and style.

Tone guidelines:
- Formal: Professional, corporate, traditional business language
- Warm: Friendly, personable, conversational yet professional
- Direct: Concise, assertive, action-oriented, no fluff
- Creative: Dynamic, engaging, shows personality and flair

${roleContext ? `Role context: ${roleContext}\n` : ''}
Original cover letter:
${coverLetter}

Return ONLY the rewritten cover letter text, no explanation or preamble.`;

    let aiResponse;
    try {
      aiResponse = await ai.models.generateContent({
        model: 'models/gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
      });
      if (!aiResponse.text) throw new Error('No response from AI');
    } catch (err) {
      // Refund on AI failure so the user isn't charged for nothing
      await refundTokens(user.id, COST);
      throw err;
    }

    return response.status(200).json({
      success: true,
      coverLetter: aiResponse.text.trim(),
      token_balance: newBalance,
    });
  } catch (error: any) {
    console.error('Rewrite tone error:', error?.message || 'Unknown error');
    const msg = error.message?.includes('Insufficient') ? error.message : 'Failed to rewrite cover letter';
    return response.status(500).json({ error: msg });
  }
}
