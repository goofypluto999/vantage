// API endpoint for waitlist signup
// Vercel serverless function

interface WaitlistBody {
  email: string;
  name?: string;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(request: any, response: any) {
  // GET: return waitlist count (public)
  if (request.method === 'GET') {
    try {
      const countRes = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=count`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'count=exact',
        },
      });
      const countHeader = countRes.headers.get('content-range');
      const total = countHeader ? parseInt(countHeader.split('/')[1]) : 0;
      return response.status(200).json({ count: total });
    } catch {
      return response.status(200).json({ count: 0 });
    }
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, name } = request.body as WaitlistBody;

  if (!email || !email.includes('@')) {
    return response.status(400).json({ success: false, error: 'Valid email required' });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        name: name?.trim() || null,
        source: 'website',
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Supabase insert error:', JSON.stringify(errorData), 'Status:', res.status);
      if (errorData.code === '23505') {
        return response.status(409).json({ success: false, error: 'Email already on waitlist' });
      }
      return response.status(500).json({ success: false, error: errorData.message || 'Failed to add to waitlist', detail: errorData });
    }

    const countRes = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=count`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact',
      },
    });
    const countHeader = countRes.headers.get('content-range');
    const total = countHeader ? parseInt(countHeader.split('/')[1]) : 0;

    return response.status(201).json({ success: true, position: total });
  } catch (error: any) {
    console.error('Waitlist error:', error?.message || error);
    return response.status(500).json({ success: false, error: error?.message || 'Internal server error' });
  }
}