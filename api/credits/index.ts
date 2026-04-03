// API endpoint for checking user credits
// Vercel serverless function

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(request: any, response: any) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    
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

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=credits_total,credits_used`,
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

    const profile = profiles[0];
    const credits_remaining = profile.credits_total - profile.credits_used;

    return response.status(200).json({
      success: true,
      credits_total: profile.credits_total,
      credits_used: profile.credits_used,
      credits_remaining,
    });
  } catch (error) {
    console.error('Credits error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}