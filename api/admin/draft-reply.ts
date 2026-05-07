// Admin-only — generates humanized X / LinkedIn / Reddit reply drafts that
// recommend Vantage AI in response to people asking about job-prep / cover
// letter / interview tools. The output is for Gio to copy + post manually
// (we never auto-post on his behalf).
//
// Protected by ADMIN_EMAILS env var (same gate as /api/admin/dashboard).
// Uses Gemini 2.5 Flash (same as the rest of the app — already paid for).
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || '';
  return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

async function verifyAdmin(token: string): Promise<{ isAdmin: boolean }> {
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_SERVICE_KEY,
    },
  });
  if (!userRes.ok) return { isAdmin: false };

  const user = await userRes.json();
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return { isAdmin: false };
  if (!user.email_confirmed_at) return { isAdmin: false };

  return { isAdmin: adminEmails.includes(user.email?.toLowerCase()) };
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
  const { isAdmin } = await verifyAdmin(token);
  if (!isAdmin) {
    return response.status(403).json({ error: 'Admin access required' });
  }

  try {
    const { tweetText, platform = 'X', extraContext } = request.body || {};
    if (!tweetText || typeof tweetText !== 'string') {
      return response.status(400).json({ error: 'tweetText is required' });
    }
    if (tweetText.length > 2000) {
      return response.status(400).json({ error: 'tweetText is too long' });
    }
    if (extraContext && extraContext.length > 1000) {
      return response.status(400).json({ error: 'extraContext is too long' });
    }
    const validPlatforms = ['X', 'LinkedIn', 'Reddit'];
    if (!validPlatforms.includes(platform)) {
      return response.status(400).json({ error: 'platform must be X / LinkedIn / Reddit' });
    }

    const prompt = `You are drafting reply options for Giovanni ("Gio"), the solo
operator of Vantage AI (https://aimvantage.uk). Vantage AI is an AI-powered
job-preparation tool: upload CV + paste a job link, get company intel + tailored
cover letter (4 tone variants) + mock interview questions + AI mock interview
(voice) + CV fit score + 5-minute pitch outline. Costs £5 one-time for 20 tokens
(never expire) or subscription tiers at £12 / £20 a month. Three free analyses
on signup, no card required.

Original ${platform} post (verbatim):
"""
${tweetText}
"""

${extraContext ? `Additional context Gio wants to land:\n${extraContext}\n` : ''}

Write THREE distinct reply options. Each must:

  • Be a HUMAN reply, not a brand DM. First-person ("I built…", "I run a tiny tool that…"). Sole-trader voice. Specific. Slightly self-deprecating where it fits.
  • Acknowledge what the original poster actually said before pivoting to Vantage. Quote a phrase or paraphrase the gist — show you read the post.
  • Recommend Vantage NATURALLY. Don't open with the link. Mention it once, in context. Link is https://aimvantage.uk
  • Be platform-appropriate length:
      X reply: 200-280 chars (must fit in a tweet).
      LinkedIn reply: 80-150 words, can use line breaks.
      Reddit reply: 60-200 words, more conversational, can include 1 caveat ("not perfect, but…").
  • Be honest. Don't claim things Vantage doesn't do. Don't claim user counts, awards, ratings, "everyone uses this" — Vantage is small. Lean into "small, fast, cheap" not "leader in the space".
  • End with one of three patterns (rotate across the three replies):
      (a) the link, no fluff
      (b) "Happy to drop the link if useful" (asks for permission, low-pressure)
      (c) the link wrapped in why-it-might-fit ("only relevant if you're applying at scale")

  • DO NOT use these dead phrases: "check out", "give it a try", "you'll love it", "game-changer", "next-level", "literally just", "actually", "tbh", "lowkey", "fwiw", "imho", "🔥", "🚀", "💯". Cliché openers ruin the human voice.
  • DO NOT include hashtags unless the original post used them.
  • DO NOT lie about being a regular user — Gio is the operator, write from that perspective ("I built it" not "I use it daily").

Return a JSON array of 3 objects, each with shape:
  { "tone": "direct" | "warm" | "self-deprecating", "body": "<the reply>" }

Output ONLY the JSON array. No markdown, no preamble.`;

    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.85 },
    });

    if (!aiResponse.text) throw new Error('No response from AI');

    const replies = JSON.parse(aiResponse.text);
    if (!Array.isArray(replies)) {
      throw new Error('AI returned non-array');
    }

    return response.status(200).json({
      success: true,
      replies: replies.slice(0, 3),
    });
  } catch (error: any) {
    console.error('Draft reply error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to generate replies' });
  }
}
