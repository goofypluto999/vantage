// API endpoint for cover letter tone rewriting
// Vercel serverless function — costs 1 credit
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const COST = 1;

async function getTokenBalance(userId: string): Promise<number> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=token_balance`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) return 0;
  const profiles = await res.json();
  if (!profiles || profiles.length === 0) return 0;
  return profiles[0].token_balance ?? 0;
}

async function deductTokens(userId: string): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/deduct_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ p_user_id: userId, p_amount: COST }),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes('Insufficient')) throw new Error('Insufficient tokens');
    throw new Error('Failed to deduct tokens');
  }
  return res.json();
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
    const balance = await getTokenBalance(user.id);

    if (balance < COST) {
      return response.status(403).json({ error: 'Insufficient tokens', token_balance: balance });
    }

    const { coverLetter, tone, roleContext } = request.body;
    if (!coverLetter || !tone) {
      return response.status(400).json({ error: 'coverLetter and tone are required' });
    }
    if (coverLetter.length > 10000) {
      return response.status(400).json({ error: 'Cover letter text is too long' });
    }
    if (roleContext && roleContext.length > 2000) {
      return response.status(400).json({ error: 'Role context is too long' });
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

    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });

    if (!aiResponse.text) throw new Error('No response from AI');

    const newBalance = await deductTokens(user.id);

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
