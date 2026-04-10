// API endpoint for generating interview questions
// Vercel serverless function — costs 2 credits, Pro/Premium only
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const COST = 2;

async function getProfile(userId: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=plan,credits_total,credits_used`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const profiles = await res.json();
  if (!profiles || profiles.length === 0) return null;
  return profiles[0];
}

async function deductCredits(userId: string, currentUsed: number): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ credits_used: (currentUsed ?? 0) + COST }),
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
    const profile = await getProfile(user.id);
    if (!profile) return response.status(404).json({ error: 'Profile not found' });

    // Plan gate: Pro or Premium only
    if (profile.plan !== 'pro' && profile.plan !== 'premium') {
      return response.status(403).json({ error: 'AI Mock Interview requires a Pro or Premium plan' });
    }

    const remaining = profile.credits_total - (profile.credits_used ?? 0);
    if (remaining < COST) {
      return response.status(403).json({ error: 'Insufficient credits', creditsRemaining: remaining });
    }

    const { roleContext } = request.body;
    if (!roleContext) {
      return response.status(400).json({ error: 'roleContext is required' });
    }

    const prompt = `You are an expert interview coach preparing a candidate for the following role:
"${roleContext}"

Generate exactly 5 interview questions that are highly specific to this role and context.
Return a JSON array of exactly 5 objects. Each object must have:
- question: string (the interview question)
- category: one of "behavioural" | "technical" | "situational" | "motivational"
- hint: string (a brief coaching tip, 1-2 sentences, to help the candidate answer well)

Only return the JSON array, no other text.`;

    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    if (!aiResponse.text) throw new Error('No response from AI');

    const questions = JSON.parse(aiResponse.text);

    await deductCredits(user.id, profile.credits_used ?? 0);

    return response.status(200).json({
      success: true,
      questions: questions.slice(0, 5),
      creditsRemaining: remaining - COST,
    });
  } catch (error: any) {
    console.error('Interview questions error:', error);
    return response.status(500).json({ error: error.message || 'Failed to generate questions' });
  }
}
