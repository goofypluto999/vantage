// API endpoint for cover letter tone rewriting
// Vercel serverless function — costs 1 credit
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const COST = 1;

async function getUserCredits(userId: string): Promise<{ total: number; used: number }> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=credits_total,credits_used`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const profiles = await res.json();
  if (!profiles || profiles.length === 0) return { total: 0, used: 0 };
  return { total: profiles[0].credits_total, used: profiles[0].credits_used ?? 0 };
}

async function deductCredits(userId: string): Promise<void> {
  const { used } = await getUserCredits(userId);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ credits_used: used + COST }),
  });
  if (!res.ok) throw new Error('Failed to deduct credits');
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
    const { total, used } = await getUserCredits(user.id);
    const remaining = total - used;

    if (remaining < COST) {
      return response.status(403).json({ error: 'Insufficient credits', creditsRemaining: remaining });
    }

    const { coverLetter, tone, roleContext } = request.body;
    if (!coverLetter || !tone) {
      return response.status(400).json({ error: 'coverLetter and tone are required' });
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

    await deductCredits(user.id);

    return response.status(200).json({
      success: true,
      coverLetter: aiResponse.text.trim(),
      creditsRemaining: remaining - COST,
    });
  } catch (error: any) {
    console.error('Rewrite tone error:', error);
    return response.status(500).json({ error: error.message || 'Failed to rewrite cover letter' });
  }
}
