// API endpoint for generating interview questions
// Vercel serverless function — costs 1 token, Pro/Premium only
// (was 2 credits before the 2026-05-08 pricing migration)
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 2026-05-08: was 2 tokens — dropped to 1 to match the new
// 1-token-per-analysis pricing tier. AI Mock Interview is still
// Pro/Premium-gated (free tier doesn't see this endpoint).
const COST = 1;

async function getProfile(userId: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=plan,token_balance`,
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

async function refundTokens(userId: string, amount: number): Promise<void> {
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
    const profile = await getProfile(user.id);
    if (!profile) return response.status(404).json({ error: 'Profile not found' });

    // Plan gate: Pro or Premium only
    if (profile.plan !== 'pro' && profile.plan !== 'premium') {
      return response.status(403).json({ error: 'AI Mock Interview requires a Pro or Premium plan' });
    }

    // Validate inputs BEFORE spending tokens
    const { roleContext } = request.body;
    if (!roleContext) {
      return response.status(400).json({ error: 'roleContext is required' });
    }
    if (roleContext.length > 2000) {
      return response.status(400).json({ error: 'Role context is too long' });
    }

    // Deduct FIRST (atomic). Refund if generation fails.
    let newBalance: number;
    try {
      newBalance = await deductTokens(user.id);
    } catch (err: any) {
      if (err.message?.includes('Insufficient')) {
        return response.status(403).json({ error: 'Insufficient tokens' });
      }
      throw err;
    }

    const prompt = `You are an interviewer for the following role. Not a coach — an interviewer. You are about to ask the candidate questions in an actual interview.

Role context:
"${roleContext}"

Generate exactly 5 interview questions a real hiring manager at this company / for this role would actually ask. Return a JSON array of 5 objects. Each object must have:
- question: string (the interview question, written exactly as it would be spoken in the interview — natural cadence, not a chapter heading)
- category: one of "behavioural" | "technical" | "situational" | "motivational"
- hint: string (a 1-2 sentence prep cue for the candidate — point at the STAR or SCQA shape they should reach for, name the specific evidence-type they should bring)

STRICT RULES (this is what separates a Vantage mock from a generic ChatGPT prompt — follow them exactly):
  • Mandatory mix of categories across the 5: at least 1 "behavioural" (past behaviour predicts future), at least 1 "technical" or domain-specific to this role, at least 1 "situational" (hypothetical / scenario), and at least 1 "motivational" (why this role / company / now). The 5th can repeat any category.
  • Every question must reference SOMETHING SPECIFIC from the role context — a named technology, a stated responsibility, a domain, a scope. NEVER ask a generic question that could be asked in any interview.
  • DO NOT use these dead-shape questions: "Tell me about yourself" (the candidate already prepared one), "What's your greatest weakness", "Where do you see yourself in 5 years", "Why should we hire you" (without a specific role hook), "Describe a time you had a conflict with a coworker" (use a domain-specific conflict instead).
  • Each question should be answerable in 60-180 seconds out loud — not so wide the candidate freezes, not so narrow it's a yes/no.
  • Hint must NAME the structure to use ("Use STAR — situation, task, action, result. Bring a number for the result.") and NAME the type of evidence to bring ("Pick a moment with at least one named stakeholder and a measurable outcome.").
  • If the role context is unclear or generic, write the questions for a Senior IC / first-line-manager level. Do not punt with vague questions.

Only return the JSON array, no other text. No markdown fences. No commentary.`;

    let questions: any;
    try {
      const aiResponse = await ai.models.generateContent({
        model: 'models/gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' },
      });
      if (!aiResponse.text) throw new Error('No response from AI');
      questions = JSON.parse(aiResponse.text);
    } catch (err) {
      // Refund on AI failure
      await refundTokens(user.id, COST);
      throw err;
    }

    return response.status(200).json({
      success: true,
      questions: questions.slice(0, 5),
      token_balance: newBalance,
    });
  } catch (error: any) {
    console.error('Interview questions error:', error?.message || 'Unknown error');
    const msg = error.message?.includes('Insufficient') ? error.message : 'Failed to generate questions';
    return response.status(500).json({ error: msg });
  }
}
