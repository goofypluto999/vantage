// Consolidated user-data endpoint.
// Replaces api/credits and api/analyses with one function so we stay
// under the Vercel Hobby plan's 12-function limit.
//
// Routing is driven by vercel.json rewrites:
//   /api/credits        → /api/user?endpoint=credits
//   /api/analyses       → /api/user?endpoint=analyses
//   /api/analyses?id=X  → /api/user?endpoint=analyses&id=X
//
// Original client paths are preserved so frontend code didn't have to change.

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function authenticate(authHeader: string | undefined) {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_SERVICE_KEY,
    },
  });
  if (!userRes.ok) return null;
  return userRes.json();
}

async function handleCredits(_request: any, response: any, userId: string) {
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=token_balance`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  const profiles = await profileRes.json();
  if (!profiles || profiles.length === 0) {
    return response.status(404).json({ error: 'Profile not found' });
  }

  return response.status(200).json({
    success: true,
    token_balance: profiles[0].token_balance ?? 0,
  });
}

async function handleAnalyses(request: any, response: any, userId: string) {
  // Support both ?id=... (single analysis) and no-param (list)
  const url = new URL(request.url, `http://${request.headers.host}`);
  const analysisId = url.searchParams.get('id');

  if (analysisId) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(analysisId)) {
      return response.status(400).json({ error: 'Invalid analysis ID' });
    }

    const detailRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analyses?id=eq.${analysisId}&user_id=eq.${userId}&select=*&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!detailRes.ok) {
      return response.status(500).json({ error: 'Failed to load analysis' });
    }

    const analyses = await detailRes.json();
    if (!analyses.length) {
      return response.status(404).json({ error: 'Analysis not found' });
    }

    return response.status(200).json({ analysis: analyses[0] });
  }

  const analysesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/analyses?user_id=eq.${userId}&select=id,company_name,job_title,job_url,tokens_spent,created_at&order=created_at.desc&limit=50`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!analysesRes.ok) {
    return response.status(500).json({ error: 'Failed to load analyses' });
  }

  const analyses = await analysesRes.json();
  return response.status(200).json({ analyses });
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const user = await authenticate(request.headers.authorization);
  if (!user) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  // Endpoint discrimination: prefer the rewrite-injected query param,
  // fall back to URL path matching for direct hits to /api/user?endpoint=...
  let endpoint = '';
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    endpoint = (url.searchParams.get('endpoint') || '').toLowerCase();
  } catch {
    // ignore — handled below
  }

  try {
    if (endpoint === 'credits') {
      return await handleCredits(request, response, user.id);
    }
    if (endpoint === 'analyses') {
      return await handleAnalyses(request, response, user.id);
    }
    return response.status(400).json({ error: 'Unknown endpoint' });
  } catch (error: any) {
    console.error(`User endpoint (${endpoint}) error:`, error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Internal server error' });
  }
}
