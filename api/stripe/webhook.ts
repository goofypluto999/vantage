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

const isTestMode = (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_');

async function supabasePatch(filter: string, body: Record<string, any>): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${filter}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`Supabase PATCH failed (${filter}):`, res.status, await res.text());
    return false;
  }
  return true;
}

async function supabaseGet(filter: string): Promise<any[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${filter}`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    console.error(`Supabase GET failed (${filter}):`, res.status, await res.text());
    return [];
  }
  return res.json();
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const sig = request.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (sig && webhookSecret) {
      // Verify signature when both are available
      event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
    } else if (isTestMode) {
      // In test mode, accept unsigned events with a warning
      console.warn('Webhook: accepting unsigned event (test mode, STRIPE_WEBHOOK_SECRET not set)');
      event = request.body as Stripe.Event;
    } else {
      // In live mode, require signature
      console.error('Webhook: rejecting unsigned event in live mode');
      return response.status(400).json({ error: 'Webhook signature required in live mode' });
    }
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
        const newSubscriptionId = session.subscription as string;

        if (userId) {
          // Fetch current profile to get existing credits_used and old subscription
          const profiles = await supabaseGet(`id=eq.${userId}&select=credits_used,stripe_subscription_id`);
          const current = profiles[0] || { credits_used: 0 };

          // Cancel old subscription if it exists and differs from new one
          if (current.stripe_subscription_id && current.stripe_subscription_id !== newSubscriptionId) {
            try {
              await stripe.subscriptions.cancel(current.stripe_subscription_id);
              console.log(`Cancelled old subscription ${current.stripe_subscription_id} for user ${userId}`);
            } catch (cancelErr: any) {
              // Already cancelled or doesn't exist — that's fine
              console.warn(`Could not cancel old subscription: ${cancelErr.message}`);
            }
          }

          // Update profile: new plan + credits, carry over credits_used
          await supabasePatch(`id=eq.${userId}`, {
            plan,
            credits_total: PLAN_CREDITS[plan] || 10,
            credits_used: current.credits_used || 0, // preserve usage
            stripe_subscription_id: newSubscriptionId,
            subscription_status: 'active',
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,plan,credits_used,stripe_subscription_id`
        );

        if (profiles.length > 0) {
          const profile = profiles[0];

          // Only update if this event is for the CURRENT subscription
          // Prevents old subscription events from overwriting a new upgrade
          if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscription.id) {
            console.log(`Ignoring subscription.updated for old sub ${subscription.id} (current: ${profile.stripe_subscription_id})`);
            break;
          }

          const status = subscription.status === 'active' ? 'active' :
                        subscription.status === 'canceled' ? 'cancelled' : 'past_due';

          await supabasePatch(`id=eq.${profile.id}`, {
            subscription_status: status,
            credits_total: status === 'active' ? (PLAN_CREDITS[profile.plan] || 10) : profile.credits_used,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,credits_used,stripe_subscription_id`
        );

        if (profiles.length > 0) {
          const profile = profiles[0];

          // Only update if this event is for the CURRENT subscription
          // Prevents old subscription deletion from overwriting a new upgrade
          if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscription.id) {
            console.log(`Ignoring subscription.deleted for old sub ${subscription.id} (current: ${profile.stripe_subscription_id})`);
            break;
          }

          await supabasePatch(`id=eq.${profile.id}`, {
            subscription_status: 'cancelled',
            credits_total: profile.credits_used, // remaining becomes 0
          });
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
