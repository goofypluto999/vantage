// API endpoint for fetching user's analysis history
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

    // Fetch user's analyses (most recent first, limit 50)
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
    console.error('Analyses list error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to load analysis history' });
  }
}
