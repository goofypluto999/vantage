// API endpoint for evaluating interview answers
// Vercel serverless function — no extra credit cost (included in questions cost)
// Pro/Premium only
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

    // Check plan
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=plan`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const profiles = await profileRes.json();
    if (!profiles?.length) return response.status(404).json({ error: 'Profile not found' });

    if (profiles[0].plan !== 'pro' && profiles[0].plan !== 'premium') {
      return response.status(403).json({ error: 'AI Mock Interview requires a Pro or Premium plan' });
    }

    const { roleContext, question, category, answer } = request.body;
    if (!question || !answer) {
      return response.status(400).json({ error: 'question and answer are required' });
    }

    const prompt = `You are an expert interview coach evaluating a candidate's answer.

Role context: "${roleContext || 'General'}"
Question: "${question}"
Category: "${category || 'general'}"
Candidate's answer: "${answer}"

Evaluate the answer and return a JSON object with:
- overallScore: integer 0-100
- grade: "Excellent" | "Good" | "Fair" | "Needs Work"
- summary: 2-3 sentence overall feedback
- strengths: array of 2-3 specific strengths observed
- improvements: array of 2-3 specific areas to improve
- metrics: object with keys clarity, relevance, structure, impact, confidence — each an integer 0-100

Return only the JSON object, no other text.`;

    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    if (!aiResponse.text) throw new Error('No response from AI');

    const evaluation = JSON.parse(aiResponse.text);

    return response.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('Interview evaluate error:', error);
    return response.status(500).json({ error: error.message || 'Failed to evaluate answer' });
  }
}
