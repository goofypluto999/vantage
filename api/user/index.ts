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
  if (profiles?.length) {
    return response.status(200).json({
      success: true,
      token_balance: profiles[0].token_balance ?? 0,
    });
  }

  // Lazy-create fallback (mirrors the same recovery path in
  // /api/interview/[action].ts:getProfile). Triggered when the
  // on_auth_user_created Supabase trigger didn't fire for this user's
  // signup. profiles.email is NOT NULL (schema.sql:10) so we must
  // resolve a non-null email — walking multiple paths off the admin
  // user object with a synthetic last-resort.
  try {
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    if (authRes.ok) {
      const authUser = await authRes.json();
      const u = authUser?.user || authUser;
      const identities = Array.isArray(u?.identities) ? u.identities : [];
      const identityEmail = identities.find((i: any) => i?.identity_data?.email)?.identity_data?.email;
      const email = u?.email
        || u?.new_email
        || u?.user_metadata?.email
        || identityEmail
        || `${userId}@vantage-recovered.local`;
      const fullName = u?.user_metadata?.full_name
        || u?.user_metadata?.name
        || identities.find((i: any) => i?.identity_data?.full_name)?.identity_data?.full_name
        || null;
      const avatarUrl = u?.user_metadata?.avatar_url
        || u?.user_metadata?.picture
        || identities.find((i: any) => i?.identity_data?.avatar_url)?.identity_data?.avatar_url
        || null;

      const createRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,resolution=ignore-duplicates',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          token_balance: 10,
          plan: 'starter',
          subscription_status: 'inactive',
        }),
      });
      if (createRes.ok) {
        return response.status(200).json({ success: true, token_balance: 10 });
      }
      const errBody = await createRes.text().catch(() => '');
      console.warn(`handleCredits: lazy-create returned ${createRes.status} for ${userId} — body: ${errBody.slice(0, 300)} — resolved email: ${email}`);
    } else {
      console.warn(`handleCredits: admin user lookup returned ${authRes.status} for ${userId}`);
    }
  } catch (err: any) {
    console.warn(`handleCredits: lazy-create exception for ${userId}: ${err?.message || ''}`);
  }

  return response.status(404).json({ error: 'Profile not found' });
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

/**
 * Save a CV summary directly from a client-extracted CV text upload.
 * No Gemini round-trip, no token spend — the user gets cv_summary
 * populated the moment they drop their CV, before any analysis runs.
 *
 * Resolves the user complaint: 'the user has to run a scan first, on
 * the Run a new analysis section it makes the user run that tool
 * first before the CV gets used in the Jobs search section, which
 * is not good, it forces user to waste a token first before being
 * able to use the tool with the job search function.' (2026-05-12).
 */
async function handleCvUpload(request: any, response: any, userId: string) {
  let body: any = {};
  try {
    body = request.body || {};
  } catch {
    return response.status(400).json({ error: 'Invalid JSON body' });
  }
  const cvText = typeof body?.cvText === 'string' ? body.cvText.trim() : '';
  if (cvText.length < 60) {
    return response.status(400).json({ error: 'CV text too short — at least 60 characters required.' });
  }
  // Sanity ceiling so a malicious upload can't bloat the profile row.
  // 12000 chars ~ a typical 2-page CV.
  const safeText = cvText.slice(0, 12000);

  // Build the same shape /api/analyze uses so AI Job Search treats this
  // identically to a post-analysis summary. No analysis was actually run,
  // so we don't have cvMatchPoints — just the raw CV text labelled as
  // such. The Job Search prompt accepts either format.
  const summary = [
    'CV RAW (uploaded directly, no analysis yet):',
    safeText.slice(0, 1800),
  ].join('\n').slice(0, 2000);

  try {
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ cv_summary: summary }),
    });
    if (!patchRes.ok) {
      const text = await patchRes.text().catch(() => '');
      console.error(`cv-upload PATCH failed ${patchRes.status}: ${text.slice(0, 200)}`);
      return response.status(500).json({ error: 'Could not save CV summary' });
    }
    return response.status(200).json({ success: true, cv_summary_length: summary.length });
  } catch (err: any) {
    console.error('cv-upload exception:', err?.message || 'unknown');
    return response.status(500).json({ error: 'Could not save CV summary' });
  }
}

export default async function handler(request: any, response: any) {
  // POST allowed for cv-upload; everything else stays GET-only.
  if (request.method !== 'GET' && request.method !== 'POST') {
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
      if (request.method !== 'GET') return response.status(405).json({ error: 'GET only' });
      return await handleCredits(request, response, user.id);
    }
    if (endpoint === 'analyses') {
      if (request.method !== 'GET') return response.status(405).json({ error: 'GET only' });
      return await handleAnalyses(request, response, user.id);
    }
    if (endpoint === 'cv-upload') {
      if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
      return await handleCvUpload(request, response, user.id);
    }
    return response.status(400).json({ error: 'Unknown endpoint' });
  } catch (error: any) {
    console.error(`User endpoint (${endpoint}) error:`, error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Internal server error' });
  }
}
