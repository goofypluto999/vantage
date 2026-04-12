// API endpoint for fetching a specific analysis by ID
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

  // Extract analysis ID from URL path
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathParts = url.pathname.split('/');
  const analysisId = pathParts[pathParts.length - 1];

  if (!analysisId || !/^[0-9a-f-]{36}$/.test(analysisId)) {
    return response.status(400).json({ error: 'Invalid analysis ID' });
  }

  try {
    // Verify user
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

    // Fetch the analysis (user_id check ensures user can only see their own)
    const analysisRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analyses?id=eq.${analysisId}&user_id=eq.${user.id}&select=*&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!analysisRes.ok) {
      return response.status(500).json({ error: 'Failed to load analysis' });
    }

    const analyses = await analysisRes.json();
    if (!analyses.length) {
      return response.status(404).json({ error: 'Analysis not found' });
    }

    return response.status(200).json({ analysis: analyses[0] });
  } catch (error: any) {
    console.error('Analysis detail error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to load analysis' });
  }
}
