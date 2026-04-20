// API endpoint to sync profile from Stripe
// Called after checkout return as a webhook fallback
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

    // Get current profile
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=stripe_customer_id,stripe_subscription_id,token_balance`,
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
    if (!profiles.length || !profiles[0].stripe_customer_id) {
      return response.status(200).json({ synced: false, reason: 'No Stripe customer' });
    }

    const profile = profiles[0];
    const customerId = profile.stripe_customer_id;

    // Get active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      // No active subscriptions — check for cancelled/past_due
      const allSubs = await stripe.subscriptions.list({
        customer: customerId,
        limit: 10,
      });

      if (allSubs.data.length === 0) {
        // No subscriptions at all — update status to inactive
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ subscription_status: 'inactive' }),
        });
        return response.status(200).json({ synced: true, subscription_status: 'inactive' });
      }

      // Use the most recent subscription — update status AND plan
      const latest = allSubs.data[0];
      const status = latest.cancel_at_period_end ? 'cancelling' :
                     latest.status === 'active' ? 'active' :
                     latest.status === 'canceled' ? 'cancelled' : 'past_due';

      // Derive plan from latest sub's price (supports both GBP and USD price IDs)
      const latestPriceId = latest.items?.data[0]?.price?.id || '';
      const starterGbpNA = process.env.STRIPE_PRICE_STARTER || process.env.STRIPE_STARTER_PRICE_ID || '';
      const proGbpNA = process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID || '';
      const premiumGbpNA = process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PREMIUM_PRICE_ID || '';
      const starterUsdNA = process.env.STRIPE_PRICE_STARTER_USD || '';
      const proUsdNA = process.env.STRIPE_PRICE_PRO_USD || '';
      const premiumUsdNA = process.env.STRIPE_PRICE_PREMIUM_USD || '';
      const latestPlan = (latestPriceId === premiumGbpNA || latestPriceId === premiumUsdNA) ? 'premium' :
                         (latestPriceId === proGbpNA || latestPriceId === proUsdNA) ? 'pro' : 'starter';

      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          subscription_status: status,
          plan: latestPlan,
          stripe_subscription_id: latest.id,
        }),
      });

      return response.status(200).json({
        synced: true,
        plan: latestPlan,
        subscription_status: status,
      });
    }

    // Separate active subs into non-cancelling and cancelling
    const activeSubs = subscriptions.data;
    const keepingSubs = activeSubs.filter(s => !s.cancel_at_period_end);
    const cancellingSubs = activeSubs.filter(s => s.cancel_at_period_end);

    // Prefer non-cancelling subs; fall back to cancelling ones if none
    const preferredSubs = keepingSubs.length > 0 ? keepingSubs : cancellingSubs;
    const isCancelling = keepingSubs.length === 0 && cancellingSubs.length > 0;

    const starterGbp = process.env.STRIPE_PRICE_STARTER || process.env.STRIPE_STARTER_PRICE_ID || '';
    const proGbp = process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID || '';
    const premiumGbp = process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PREMIUM_PRICE_ID || '';
    const starterUsd = process.env.STRIPE_PRICE_STARTER_USD || '';
    const proUsd = process.env.STRIPE_PRICE_PRO_USD || '';
    const premiumUsd = process.env.STRIPE_PRICE_PREMIUM_USD || '';

    function getPlan(priceId: string): string {
      if (priceId === premiumGbp || priceId === premiumUsd) return 'premium';
      if (priceId === proGbp || priceId === proUsd) return 'pro';
      if (priceId === starterGbp || priceId === starterUsd) return 'starter';
      return 'starter';
    }

    // Find the highest-tier from the preferred set
    let bestPlan = 'starter';
    let bestSubId = preferredSubs[0].id;

    for (const sub of preferredSubs) {
      const priceId = sub.items.data[0]?.price?.id || '';
      const plan = getPlan(priceId);
      if (plan === 'premium') { bestPlan = 'premium'; bestSubId = sub.id; }
      else if (plan === 'pro' && bestPlan !== 'premium') { bestPlan = 'pro'; bestSubId = sub.id; }
      else if (plan === 'starter' && bestPlan === 'starter') { bestSubId = sub.id; }
    }

    // Cancel any extra subscriptions (keep only the best non-cancelling one)
    for (const sub of activeSubs) {
      if (sub.id !== bestSubId) {
        try {
          await stripe.subscriptions.cancel(sub.id);
          console.log(`Sync: cancelled extra subscription ${sub.id}`);
        } catch (e: any) {
          console.warn(`Sync: could not cancel ${sub.id}: ${e.message}`);
        }
      }
    }

    // Only add tokens if the subscription ID changed (prevents double-crediting
    // if the webhook already processed this checkout)
    const alreadySynced = profile.stripe_subscription_id === bestSubId;
    const tokensToAdd = alreadySynced ? 0 : (PLAN_CREDITS[bestPlan] || 10);

    // Use atomic RPC for token addition
    let newBalance = profile.token_balance || 0;
    if (tokensToAdd > 0) {
      const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ p_user_id: user.id, p_amount: tokensToAdd }),
      });
      if (rpcRes.ok) newBalance = await rpcRes.json();
    }

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        plan: bestPlan,
        stripe_subscription_id: bestSubId,
        subscription_status: isCancelling ? 'cancelling' : 'active',
      }),
    });

    if (!updateRes.ok) {
      console.error('Sync: failed to update profile');
      return response.status(500).json({ error: 'Failed to sync profile' });
    }

    return response.status(200).json({
      synced: true,
      plan: bestPlan,
    });
  } catch (error: any) {
    console.error('Sync error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Sync failed' });
  }
}
