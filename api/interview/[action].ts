// /api/interview/<action> — consolidated interview endpoints.
//
// Action 'questions' (was /api/interview/questions): generates 5 interview
// questions for a role context. Costs 1 token. Pro/Premium only.
//
// Action 'evaluate' (was /api/interview/evaluate): grades the candidate's
// answer to a question. Free (cost was bundled into the questions call).
// Pro/Premium only.
//
// Vercel-Hobby 12-function-limit consolidation. Routes via dynamic segment.

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cost for 'questions' action. 'evaluate' is free.
const QUESTIONS_COST = 1;

/**
 * Extract the first balanced { ... } object OR [ ... ] array from a string
 * and JSON.parse it. Tolerates markdown fences, leading prose, trailing
 * commentary. Used after Gemini calls that omit responseMimeType (which we
 * had to drop because of the @google/genai 1.29.0 + gemini-2.5-flash JSON-
 * mode bug). The walker tracks depth + string/escape state so that braces
 * inside string values don't unbalance the count.
 */
function extractJson(raw: string): any {
  if (!raw || typeof raw !== 'string') {
    throw new SyntaxError('No text returned from AI');
  }
  // Find earliest '{' or '['
  const candidates = [raw.indexOf('{'), raw.indexOf('[')].filter((n) => n !== -1);
  if (candidates.length === 0) {
    throw new SyntaxError('No JSON value found in AI response');
  }
  const start = Math.min(...candidates);
  const opener = raw[start];
  const closer = opener === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escape = false;
  let end = -1;
  for (let i = start; i < raw.length; i += 1) {
    const ch = raw[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === opener) depth += 1;
    if (ch === closer) {
      depth -= 1;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) throw new SyntaxError('Unmatched brackets in AI response');
  return JSON.parse(raw.slice(start, end + 1));
}

async function getProfile(userId: string, fields: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=${fields}`,
    { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
  );
  const profiles = await res.json();
  if (!profiles?.length) return null;
  return profiles[0];
}

async function deductTokens(userId: string, amount: number): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/deduct_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
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
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ p_user_id: userId, p_amount: amount }),
    });
  } catch (err: any) {
    console.error('Refund failed for user', userId, 'amount', amount, err?.message || '');
  }
}

async function authenticate(request: any, response: any): Promise<any | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    response.status(401).json({ error: 'Authentication required' });
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_SERVICE_KEY },
  });
  if (!userRes.ok) {
    response.status(401).json({ error: 'Invalid token' });
    return null;
  }
  return userRes.json();
}

// ---- /api/interview/questions ----
async function handleQuestions(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const user = await authenticate(request, response);
  if (!user) return;

  try {
    const profile = await getProfile(user.id, 'plan,token_balance');
    if (!profile) return response.status(404).json({ error: 'Profile not found' });
    if (profile.plan !== 'pro' && profile.plan !== 'premium') {
      return response.status(403).json({ error: 'AI Mock Interview requires a Pro or Premium plan' });
    }

    const { roleContext } = request.body || {};
    if (!roleContext) return response.status(400).json({ error: 'roleContext is required' });
    if (roleContext.length > 2000) return response.status(400).json({ error: 'Role context is too long' });

    let newBalance: number;
    try {
      newBalance = await deductTokens(user.id, QUESTIONS_COST);
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
      // 2026-05-09: dropped responseMimeType:'application/json' — same
      // failure mode that broke /api/decode-rejection + /api/ghost-job-check
      // (a regression in @google/genai 1.29.0 + gemini-2.5-flash for
      // JSON-mode requests with nested arrays). Strip code fences
      // defensively before parsing.
      const aiResponse = await ai.models.generateContent({
        model: 'models/gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {},
      });
      if (!aiResponse.text) throw new Error('No response from AI');
      questions = extractJson(aiResponse.text);
    } catch (err) {
      await refundTokens(user.id, QUESTIONS_COST);
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

// ---- /api/interview/evaluate ----
async function handleEvaluate(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const user = await authenticate(request, response);
  if (!user) return;

  try {
    const profile = await getProfile(user.id, 'plan');
    if (!profile) return response.status(404).json({ error: 'Profile not found' });
    if (profile.plan !== 'pro' && profile.plan !== 'premium') {
      return response.status(403).json({ error: 'AI Mock Interview requires a Pro or Premium plan' });
    }

    const { roleContext, question, category, answer } = request.body || {};
    if (!question || !answer) return response.status(400).json({ error: 'question and answer are required' });
    if (answer.length > 5000) return response.status(400).json({ error: 'Answer is too long (max 5,000 characters)' });
    if (question.length > 2000) return response.status(400).json({ error: 'Question is too long' });
    if (roleContext && roleContext.length > 2000) return response.status(400).json({ error: 'Role context is too long' });

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

    // 2026-05-09: same responseMimeType fix — strip code fences before parse.
    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0 },
    });
    if (!aiResponse.text) throw new Error('No response from AI');
    const evaluation = extractJson(aiResponse.text);
    return response.status(200).json({ success: true, evaluation });
  } catch (error: any) {
    console.error('Interview evaluate error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to evaluate answer' });
  }
}

// ---- Dispatcher ----
export default async function handler(request: any, response: any) {
  const raw = request.query?.action;
  const action = String(Array.isArray(raw) ? raw[0] : raw || '').toLowerCase();
  switch (action) {
    case 'questions':
      return handleQuestions(request, response);
    case 'evaluate':
      return handleEvaluate(request, response);
    default:
      return response.status(404).json({ error: `Unknown interview action: ${action || '<empty>'}` });
  }
}
