// /api/admin/<action> — consolidated admin endpoints.
//
// Action 'dashboard' (was /api/admin/dashboard, GET): returns business metrics.
// Action 'draft-reply' (was /api/admin/draft-reply, POST): generates reply drafts.
//
// Both endpoints share the same admin gate (ADMIN_EMAILS env + email_confirmed_at).
// Vercel-Hobby 12-function-limit consolidation. 2 → 1.

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || '';
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

async function verifyAdmin(token: string): Promise<{ isAdmin: boolean; userId?: string; email?: string }> {
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_SERVICE_KEY },
  });
  if (!userRes.ok) return { isAdmin: false };
  const user = await userRes.json();
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return { isAdmin: false };
  if (!user.email_confirmed_at) return { isAdmin: false };
  return {
    isAdmin: adminEmails.includes(user.email?.toLowerCase()),
    userId: user.id,
    email: user.email,
  };
}

async function supabaseQuery(endpoint: string, params: string = ''): Promise<any> {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${params ? '?' + params : ''}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Prefer: 'count=exact',
    },
  });
  const contentRange = res.headers.get('content-range');
  const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : 0;
  const data = await res.json();
  return { data, totalCount };
}

// In-memory rate limit for the AI endpoint. 30 calls / 5min / admin user.
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = 30;
const rateBuckets: Map<string, number[]> = new Map();
/**
 * Extract first balanced { ... } or [ ... ] from raw AI text. Same pattern
 * as api/decode-rejection / ghost-job-check / interview to defend against
 * Gemini occasionally wrapping JSON in markdown fences or prose when
 * responseMimeType is not set.
 */
function extractJson(raw: string): any {
  if (!raw || typeof raw !== 'string') throw new SyntaxError('No AI text');
  const candidates = [raw.indexOf('{'), raw.indexOf('[')].filter((n) => n !== -1);
  if (candidates.length === 0) throw new SyntaxError('No JSON value in AI response');
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
    if (ch === closer) { depth -= 1; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new SyntaxError('Unmatched brackets in AI response');
  return JSON.parse(raw.slice(start, end + 1));
}

function checkRateLimit(userId: string): { ok: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = (rateBuckets.get(userId) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (bucket.length >= RATE_MAX) {
    return { ok: false, retryAfterMs: RATE_WINDOW_MS - (now - bucket[0]) };
  }
  bucket.push(now);
  rateBuckets.set(userId, bucket);
  return { ok: true };
}

// ---- /api/admin/dashboard ----
async function handleDashboard(request: any, response: any) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
  const authHeader = request.headers.authorization;
  if (!authHeader) return response.status(401).json({ error: 'Authentication required' });
  const token = authHeader.replace('Bearer ', '');
  const { isAdmin } = await verifyAdmin(token);
  if (!isAdmin) return response.status(403).json({ error: 'Admin access required' });

  try {
    const [usersResult, activeSubsResult, cancellingSubsResult, cancelledSubsResult, recentAnalysesResult, waitlistResult, recentUsageResult] =
      await Promise.all([
        supabaseQuery(
          'profiles',
          'select=id,email,full_name,plan,token_balance,subscription_status,stripe_customer_id,created_at,updated_at&order=created_at.desc&limit=100'
        ),
        supabaseQuery('profiles', 'select=count&subscription_status=eq.active'),
        supabaseQuery('profiles', 'select=count&subscription_status=eq.cancelling'),
        supabaseQuery('profiles', 'select=count&subscription_status=eq.cancelled'),
        supabaseQuery('analyses', 'select=id,user_id,company_name,job_title,job_url,tokens_spent,created_at&order=created_at.desc&limit=50'),
        supabaseQuery('waitlist', 'select=id,email,name,source,created_at&order=created_at.desc&limit=100'),
        supabaseQuery('api_usage', 'select=id,user_id,endpoint,tokens_consumed,created_at&order=created_at.desc&limit=200'),
      ]);

    const users = usersResult.data || [];
    const analyses = recentAnalysesResult.data || [];
    const totalUsers = usersResult.totalCount;
    const activeSubscriptions = activeSubsResult.totalCount;
    const cancellingSubscriptions = cancellingSubsResult.totalCount;
    const cancelledSubscriptions = cancelledSubsResult.totalCount;
    const totalWaitlist = waitlistResult.totalCount;

    const planDistribution: Record<string, number> = { starter: 0, pro: 0, premium: 0 };
    for (const u of users) {
      if (planDistribution[u.plan] !== undefined) planDistribution[u.plan]++;
    }
    const totalTokensInCirculation = users.reduce((sum: number, u: any) => sum + (u.token_balance || 0), 0);

    const now = Date.now();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const startOfTodayUtc = new Date();
    startOfTodayUtc.setUTCHours(0, 0, 0, 0);
    const startOfTodayIso = startOfTodayUtc.toISOString();

    const recentSignups = users.filter((u: any) => u.created_at >= sevenDaysAgo).length;
    const signupsLast24h = users.filter((u: any) => u.created_at >= twentyFourHoursAgo).length;
    const signupsToday = users.filter((u: any) => u.created_at >= startOfTodayIso).length;
    const analysesLast24h = analyses.filter((a: any) => a.created_at >= twentyFourHoursAgo).length;
    const analysesToday = analyses.filter((a: any) => a.created_at >= startOfTodayIso).length;

    const PLAN_PRICES: Record<string, number> = { starter: 5, pro: 12, premium: 20 };
    let estimatedMRR = 0;
    for (const u of users) {
      if (u.subscription_status === 'active' || u.subscription_status === 'cancelling') {
        estimatedMRR += PLAN_PRICES[u.plan] || 0;
      }
    }

    return response.status(200).json({
      metrics: {
        totalUsers,
        activeSubscriptions,
        cancellingSubscriptions,
        cancelledSubscriptions,
        totalWaitlist,
        recentSignups,
        signupsLast24h,
        signupsToday,
        analysesLast24h,
        analysesToday,
        estimatedMRR,
        totalTokensInCirculation,
        planDistribution,
      },
      users: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        plan: u.plan,
        token_balance: u.token_balance,
        subscription_status: u.subscription_status,
        has_stripe: !!u.stripe_customer_id,
        created_at: u.created_at,
        updated_at: u.updated_at,
      })),
      recentAnalyses: recentAnalysesResult.data || [],
      waitlist: (waitlistResult.data || []).map((w: any) => ({
        id: w.id,
        email: w.email,
        name: w.name,
        source: w.source,
        created_at: w.created_at,
      })),
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to load admin data' });
  }
}

// ---- /api/admin/draft-reply ----
async function handleDraftReply(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const authHeader = request.headers.authorization;
  if (!authHeader) return response.status(401).json({ error: 'Authentication required' });
  const token = authHeader.replace('Bearer ', '');
  const { isAdmin, userId } = await verifyAdmin(token);
  if (!isAdmin || !userId) return response.status(403).json({ error: 'Admin access required' });

  const rl = checkRateLimit(userId);
  if (!rl.ok) {
    response.setHeader('Retry-After', Math.ceil((rl.retryAfterMs || RATE_WINDOW_MS) / 1000).toString());
    return response.status(429).json({ error: 'Too many requests. Try again in a few minutes.' });
  }

  try {
    const { tweetText, platform = 'X', extraContext } = request.body || {};
    if (!tweetText || typeof tweetText !== 'string') return response.status(400).json({ error: 'tweetText is required' });
    if (tweetText.length > 2000) return response.status(400).json({ error: 'tweetText is too long' });
    if (extraContext !== undefined && extraContext !== null) {
      if (typeof extraContext !== 'string') return response.status(400).json({ error: 'extraContext must be a string' });
      if (extraContext.length > 1000) return response.status(400).json({ error: 'extraContext is too long' });
    }
    const validPlatforms = ['X', 'LinkedIn', 'Reddit'];
    if (!validPlatforms.includes(platform)) return response.status(400).json({ error: 'platform must be X / LinkedIn / Reddit' });

    const prompt = `You are drafting reply options for Giovanni ("Gio"), the solo
operator of AimVantage (https://aimvantage.uk; previously branded "Vantage AI"
until the 2026-05 rebrand). AimVantage is an AI-powered job-preparation tool:
upload CV + paste a job link, get company intel + tailored cover letter (4 tone
variants) + mock interview questions + AI mock interview (voice) + CV fit score
+ 5-minute pitch outline. Costs £5 one-time for 20 tokens (never expire) or
subscription tiers at £12 / £20 a month. Ten free prep packs on signup, no
card required.

Original ${platform} post (verbatim):
"""
${tweetText}
"""

${extraContext ? `Additional context Gio wants to land:\n${extraContext}\n` : ''}

Write THREE distinct reply options. Each must:

  • Be a HUMAN reply, not a brand DM. First-person ("I built…", "I run a tiny tool that…"). Sole-trader voice. Specific. Slightly self-deprecating where it fits.
  • Acknowledge what the original poster actually said before pivoting to AimVantage. Quote a phrase or paraphrase the gist — show you read the post.
  • Recommend AimVantage NATURALLY. Don't open with the link. Mention it once, in context. Link is https://aimvantage.uk
  • Be platform-appropriate length:
      X reply: 200-280 chars (must fit in a tweet).
      LinkedIn reply: 80-150 words, can use line breaks.
      Reddit reply: 60-200 words, more conversational, can include 1 caveat ("not perfect, but…").
  • Be honest. Don't claim things AimVantage doesn't do. Don't claim user counts, awards, ratings, "everyone uses this" — AimVantage is small. Lean into "small, fast, cheap" not "leader in the space".
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

    // 2026-05-09: drop responseMimeType + strip code fences (same regression
    // pattern as /api/decode-rejection and /api/ghost-job-check).
    const aiResponse = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0.85 },
    });
    if (!aiResponse.text) throw new Error('No response from AI');
    const replies = extractJson(aiResponse.text);
    if (!Array.isArray(replies)) throw new Error('AI returned non-array');
    return response.status(200).json({ success: true, replies: replies.slice(0, 3) });
  } catch (error: any) {
    console.error('Draft reply error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to generate replies' });
  }
}

// ---- Dispatcher ----
export default async function handler(request: any, response: any) {
  const raw = request.query?.action;
  const action = String(Array.isArray(raw) ? raw[0] : raw || '').toLowerCase();
  switch (action) {
    case 'dashboard':
      return handleDashboard(request, response);
    case 'draft-reply':
      return handleDraftReply(request, response);
    default:
      return response.status(404).json({ error: `Unknown admin action: ${action || '<empty>'}` });
  }
}
