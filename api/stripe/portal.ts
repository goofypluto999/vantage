// API endpoint for creating Stripe billing portal sessions
// Vercel serverless function

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowed = process.env.APP_URL || process.env.VERCEL_URL;
  if (allowed) {
    const origin = allowed.startsWith('http') ? allowed : `https://${allowed}`;
    return origin.replace(/\/$/, '');
  }
  if (requestOrigin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)) {
    return requestOrigin;
  }
  return '';
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

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=stripe_customer_id`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    const profiles = await profileRes.json();
    const customerId = profiles[0]?.stripe_customer_id;

    if (!customerId) {
      return response.status(400).json({ error: 'No billing account found' });
    }

    const origin = getAllowedOrigin(request.headers.origin);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });

    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', (error as any)?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to create billing portal session' });
  }
}
