// API endpoint for creating Stripe checkout sessions
// Vercel serverless function

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const VALID_PLANS = ['starter', 'pro', 'premium'] as const;
const VALID_CURRENCIES = ['gbp', 'usd'] as const;

const PLAN_PRICES_GBP: Record<string, string> = {
  'starter': process.env.STRIPE_PRICE_STARTER || process.env.STRIPE_STARTER_PRICE_ID || '',
  'pro': process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID || '',
  'premium': process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PREMIUM_PRICE_ID || '',
};

const PLAN_PRICES_USD: Record<string, string> = {
  'starter': process.env.STRIPE_PRICE_STARTER_USD || '',
  'pro': process.env.STRIPE_PRICE_PRO_USD || '',
  'premium': process.env.STRIPE_PRICE_PREMIUM_USD || '',
};

function getPriceForPlan(plan: string, currency: string): string {
  if (currency === 'usd') {
    // Fall back to GBP if USD is not configured
    return PLAN_PRICES_USD[plan] || PLAN_PRICES_GBP[plan];
  }
  return PLAN_PRICES_GBP[plan];
}

function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowed = process.env.APP_URL || process.env.VERCEL_URL;
  if (allowed) {
    const origin = allowed.startsWith('http') ? allowed : `https://${allowed}`;
    return origin.replace(/\/$/, '');
  }
  // Only trust localhost in local dev — NEVER trust arbitrary Origin headers
  if (requestOrigin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)) {
    return requestOrigin;
  }
  // Hard fail if no trusted origin found — prevents open redirect
  return '';
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, plan, currency } = request.body as { priceId?: string; plan?: string; currency?: string };

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

    // Get full profile: customer ID + current subscription
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=stripe_customer_id,stripe_subscription_id,subscription_status`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!profileRes.ok) {
      return response.status(500).json({ error: 'Failed to load profile' });
    }
    const profiles = await profileRes.json();
    const currentProfile = profiles[0] || {};
    let customerId = currentProfile.stripe_customer_id;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      });
    }

    // Old subscription is cancelled by the webhook after checkout completes.
    // Cancelling here races with the webhook and can zero out the user's tokens.

    const planKey = plan || 'starter';
    if (!VALID_PLANS.includes(planKey as any)) {
      return response.status(400).json({ error: 'Invalid plan' });
    }

    const currencyKey = (currency || 'gbp').toLowerCase();
    if (!VALID_CURRENCIES.includes(currencyKey as any)) {
      return response.status(400).json({ error: 'Invalid currency' });
    }

    const stripePriceId = getPriceForPlan(planKey, currencyKey);
    if (!stripePriceId) {
      return response.status(500).json({ error: 'Plan pricing is not configured' });
    }

    const origin = getAllowedOrigin(request.headers.origin);
    const isTopup = planKey === 'starter';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: isTopup ? 'payment' : 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?cancelled=true`,
      metadata: {
        user_id: user.id,
        plan: planKey,
        type: isTopup ? 'topup' : 'subscription',
        currency: currencyKey,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return response.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to create checkout session' });
  }
}
