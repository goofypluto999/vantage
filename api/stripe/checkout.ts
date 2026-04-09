// API endpoint for creating Stripe checkout sessions
// Vercel serverless function

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const PLAN_PRICES: Record<string, string> = {
  'starter': process.env.STRIPE_PRICE_STARTER || process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
  'pro': process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
  'premium': process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
};

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, plan } = request.body as { priceId?: string; plan?: string };

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

    // Cancel existing subscription if upgrading
    if (currentProfile.stripe_subscription_id && currentProfile.subscription_status === 'active') {
      try {
        await stripe.subscriptions.cancel(currentProfile.stripe_subscription_id);
        console.log(`Cancelled existing subscription ${currentProfile.stripe_subscription_id} for upgrade`);
      } catch (cancelErr: any) {
        // Already cancelled — proceed with new checkout
        console.warn(`Could not cancel old subscription: ${cancelErr.message}`);
      }
    }

    const planKey = plan || 'starter';
    const stripePriceId = priceId || PLAN_PRICES[planKey] || PLAN_PRICES.starter;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.origin}/dashboard?success=true`,
      cancel_url: `${request.headers.origin}/dashboard?cancelled=true`,
      metadata: {
        user_id: user.id,
        plan: planKey,
      },
    });

    return response.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return response.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}
