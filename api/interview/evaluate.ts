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
    if (!profileRes.ok) {
      return response.status(500).json({ error: 'Failed to load profile' });
    }
    const profiles = await profileRes.json();
    if (!profiles?.length) return response.status(404).json({ error: 'Profile not found' });

    if (profiles[0].plan !== 'pro' && profiles[0].plan !== 'premium') {
      return response.status(403).json({ error: 'AI Mock Interview requires a Pro or Premium plan' });
    }

    const { roleContext, question, category, answer } = request.body;
    if (!question || !answer) {
      return response.status(400).json({ error: 'question and answer are required' });
    }
    if (answer.length > 5000) {
      return response.status(400).json({ error: 'Answer is too long (max 5,000 characters)' });
    }
    if (question.length > 2000) {
      return response.status(400).json({ error: 'Question is too long' });
    }
    if (roleContext && roleContext.length > 2000) {
      return response.status(400).json({ error: 'Role context is too long' });
    }

    const prompt = `You are a brutally honest interview-prep grader. Not a confidence-coach. The candidate is going to walk into a real interview after reading your feedback — you have to call out gaps they actually have. Praise inflation is the worst possible failure mode here.

Role context: "${roleContext || 'General'}"
Question: "${question}"
Category: "${category || 'general'}"
Candidate's answer (verbatim): "${answer}"

Evaluate the answer and return a JSON object with:
- overallScore: integer 0-100 using STRICT calibration (defined below)
- grade: "Excellent" | "Good" | "Fair" | "Needs Work"
- summary: 2-3 sentence overall feedback. State the SINGLE biggest issue first. Do not open with praise.
- strengths: array of 2-3 specific strengths. Each must QUOTE OR PARAPHRASE a specific phrase from the candidate's answer (e.g. 'You named the stakeholder ("our head of finance") which is concrete enough to be falsifiable.'). NO generic "good structure" / "confident tone" entries. If you cannot name a real strength with quoted evidence, return only 1 — empty array is OK on weak answers.
- improvements: array of 2-3 specific, actionable improvements. Each must (a) name the gap, (b) quote what was said, (c) state what to do instead. Example: 'You said "I led a team" but did not say how big or for how long. Replace with "I led 6 engineers for 14 months" or similar concrete scope.' NO generic "be more specific" / "add a number" entries.
- metrics: object with these exact 5 keys, each an integer 0-100:
    - clarity: was the answer easy to follow or did it ramble? Rambling, fillers, abandoned sentences = low.
    - relevance: did the answer ANSWER THE QUESTION ASKED, or did it pivot to a different story? Pivoting = low.
    - structure: did the answer use STAR (Situation/Task/Action/Result) or SCQA (Situation/Complication/Question/Answer) shape, or list-style with clear hand-offs? Free-form rambling without structure = low.
    - impact: did the answer END with a measurable outcome (a number, a named result, a quantified change)? No outcome stated = max 50. No numbers but a clear named outcome = max 75. Hard number = up to 100.
    - confidence: did the language sound certain or hedged? "I think maybe we possibly improved..." = low. "We delivered X by doing Y" = high.

STRICT overallScore CALIBRATION (be HARSH — most early-career answers should score 50-70, not 80+):
  90-100 = Outstanding. STAR/SCQA shape, named stakeholders, hard numbers, concrete actions, clear measured outcome. Could be used as a teaching example.
  75-89 = Strong. Has structure + at least one specific number/scope. Minor gap in one of the 5 metrics.
  60-74 = Solid foundation. Right shape but missing concrete evidence. Needs one round of revision.
  40-59 = Weak. Recognisable attempt at structure but vague throughout. Missing the question's actual ask, OR no measurable result, OR wandered into a different story.
  20-39 = Poor. No structure, no specifics, mostly filler. The candidate would likely fail this question in a real interview.
  0-19 = Failed to answer. Off-topic, very short, or fundamentally wrong.

Banned grader phrases — do NOT use any of these in summary or strengths or improvements:
  "great job", "well done", "good answer", "nice work", "excellent point", "you're on the right track", "keep up the good work", "amazing", "fantastic", "stellar", "rockstar", "killer answer".

Return only the JSON object, no other text. No markdown fences. No commentary.`;

    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      // temperature: 0 — grading must be deterministic for the same answer
      config: { responseMimeType: 'application/json', temperature: 0 },
    });

    if (!aiResponse.text) throw new Error('No response from AI');

    const evaluation = JSON.parse(aiResponse.text);

    return response.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('Interview evaluate error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to evaluate answer' });
  }
}
