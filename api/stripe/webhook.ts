// API endpoint for Stripe webhooks
// Vercel serverless function

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const PLAN_CREDITS: Record<string, number> = {
  'starter': 10,
  'pro': 30,
  'premium': 60,
};

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const sig = request.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return response.status(500).json({ error: 'Webhook not configured' });
    }
    if (!sig) {
      return response.status(400).json({ error: 'Missing stripe-signature header' });
    }
    event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return response.status(400).json({ error: 'Webhook verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan || 'starter';
        const subscriptionId = session.subscription as string;

        if (userId) {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              plan,
              credits_total: PLAN_CREDITS[plan] || 10,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
            }),
          });
          if (!res.ok) {
            console.error('Failed to update profile after checkout:', res.status, await res.text());
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const profileRes = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?stripe_customer_id=eq.${customerId}&select=id,plan`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
          }
        );

        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          const profile = profiles[0];
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'canceled' ? 'cancelled' : 'past_due';

          const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profile.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              subscription_status: status,
              credits_total: status === 'active' ? (PLAN_CREDITS[profile.plan] || 10) : 0,
            }),
          });
          if (!updateRes.ok) {
            console.error('Failed to update subscription status:', updateRes.status, await updateRes.text());
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const delRes = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?stripe_customer_id=eq.${customerId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              subscription_status: 'cancelled',
              credits_total: 0,
            }),
          }
        );
        if (!delRes.ok) {
          console.error('Failed to update profile after subscription deletion:', delRes.status, await delRes.text());
        }
        break;
      }
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return response.status(500).json({ error: 'Webhook handler failed' });
  }
}