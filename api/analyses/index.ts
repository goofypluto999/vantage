// API endpoint for user's analysis history (list + detail)
// GET /api/analyses — list all user's analyses
// GET /api/analyses?id=<uuid> — get a specific analysis with full results
// Vercel serverless function

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(request: any, response: any) {
  if (request.method !== 'GET') {
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

    if (!userRes.ok) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await userRes.json();

    // Check for specific analysis ID
    const url = new URL(request.url, `http://${request.headers.host}`);
    const analysisId = url.searchParams.get('id');

    if (analysisId) {
      // Validate strict UUID v4-ish format (hyphens in correct positions)
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(analysisId)) {
        return response.status(400).json({ error: 'Invalid analysis ID' });
      }

      // Fetch specific analysis (user_id check ensures ownership)
      const detailRes = await fetch(
        `${SUPABASE_URL}/rest/v1/analyses?id=eq.${analysisId}&user_id=eq.${user.id}&select=*&limit=1`,
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

    // List all analyses (most recent first, limit 50)
    const analysesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analyses?user_id=eq.${user.id}&select=id,company_name,job_title,job_url,tokens_spent,created_at&order=created_at.desc&limit=50`,
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
  } catch (error: any) {
    console.error('Analyses error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to load analysis history' });
  }
}
