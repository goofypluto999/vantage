// /api/stripe/<action> — consolidated dispatcher.
//
// Reason for consolidation: Vercel Hobby tier has a 12-function-per-deployment
// limit. Pre-consolidation we had 4 separate stripe functions
// (checkout/portal/sync/webhook) which contributed 4 to that limit.
//
// This file uses Vercel's dynamic-segment routing — /api/stripe/checkout
// resolves [action]=checkout, /api/stripe/portal → [action]=portal,
// /api/stripe/sync → [action]=sync. The webhook is intentionally excluded
// because it's handled by the more-specific api/stripe/webhook.ts (which
// MUST stay separate because it parses raw bodies for Stripe signature
// verification — incompatible with the JSON-body convention used here).
//
// Net effect: 4 stripe functions → 2 (this file + webhook). Saves 2 slots.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const VALID_PLANS = ['starter', 'pro', 'premium'] as const;
const VALID_CURRENCIES = ['gbp', 'usd'] as const;

const PLAN_CREDITS: Record<string, number> = {
  starter: 20,
  pro: 60,
  premium: 120,
};

const cleanEnv = (v: string | undefined) => (v || '').trim();

const PLAN_PRICES_GBP: Record<string, string> = {
  starter: cleanEnv(process.env.STRIPE_PRICE_STARTER) || cleanEnv(process.env.STRIPE_STARTER_PRICE_ID),
  pro: cleanEnv(process.env.STRIPE_PRICE_PRO) || cleanEnv(process.env.STRIPE_PRO_PRICE_ID),
  premium: cleanEnv(process.env.STRIPE_PRICE_PREMIUM) || cleanEnv(process.env.STRIPE_PREMIUM_PRICE_ID),
};

const PLAN_PRICES_USD: Record<string, string> = {
  starter: cleanEnv(process.env.STRIPE_PRICE_STARTER_USD),
  pro: cleanEnv(process.env.STRIPE_PRICE_PRO_USD),
  premium: cleanEnv(process.env.STRIPE_PRICE_PREMIUM_USD),
};

function getPriceForPlan(plan: string, currency: string): string {
  if (currency === 'usd') return PLAN_PRICES_USD[plan] || PLAN_PRICES_GBP[plan];
  return PLAN_PRICES_GBP[plan];
}

/**
 * Tolerant extractor for subscription renewal + cancellation dates.
 * MIRRORS the helper in api/stripe/webhook.ts — kept in sync deliberately.
 *
 * Stripe MOVED `current_period_end` from the subscription top-level to
 * per-item on their recent API versions. Old code reading
 * `sub.current_period_end` silently gets `undefined` on modern APIs.
 * Tolerant: try top-level first (legacy), then per-item (modern).
 */
function extractSubscriptionDates(sub: any): { renewsAt: string | null; cancelAt: string | null } {
  if (!sub || typeof sub !== 'object') return { renewsAt: null, cancelAt: null };
  let renewsEpoch: number | null = null;
  if (typeof sub.current_period_end === 'number' && sub.current_period_end > 0) {
    renewsEpoch = sub.current_period_end;
  } else if (sub.items?.data?.[0]?.current_period_end && typeof sub.items.data[0].current_period_end === 'number') {
    renewsEpoch = sub.items.data[0].current_period_end;
  }
  let cancelEpoch: number | null = null;
  if (typeof sub.cancel_at === 'number' && sub.cancel_at > 0) {
    cancelEpoch = sub.cancel_at;
  } else if (sub.cancel_at_period_end === true && renewsEpoch) {
    cancelEpoch = renewsEpoch;
  }
  return {
    renewsAt: renewsEpoch ? new Date(renewsEpoch * 1000).toISOString() : null,
    cancelAt: cancelEpoch ? new Date(cancelEpoch * 1000).toISOString() : null,
  };
}

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

async function authenticate(request: any, response: any): Promise<any | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    response.status(401).json({ error: 'Authentication required' });
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_SERVICE_KEY },
  });
  if (!userRes.ok) {
    response.status(401).json({ error: 'Invalid token' });
    return null;
  }
  return userRes.json();
}

// ---- /api/stripe/checkout ----
async function handleCheckout(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const user = await authenticate(request, response);
  if (!user) return;
  const { plan, currency } = (request.body || {}) as { plan?: string; currency?: string };

  try {
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=stripe_customer_id,stripe_subscription_id,subscription_status`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    if (!profileRes.ok) return response.status(500).json({ error: 'Failed to load profile' });
    const profiles = await profileRes.json();
    let customerId = profiles[0]?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
      customerId = customer.id;
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      });
    }

    const planKey = plan || 'starter';
    if (!VALID_PLANS.includes(planKey as any)) return response.status(400).json({ error: 'Invalid plan' });
    const currencyKey = (currency || 'gbp').toLowerCase();
    if (!VALID_CURRENCIES.includes(currencyKey as any)) return response.status(400).json({ error: 'Invalid currency' });
    const stripePriceId = getPriceForPlan(planKey, currencyKey);
    if (!stripePriceId) return response.status(500).json({ error: 'Plan pricing is not configured' });

    const origin = getAllowedOrigin(request.headers.origin);
    const isTopup = planKey === 'starter';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: isTopup ? 'payment' : 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?cancelled=true`,
      metadata: { user_id: user.id, plan: planKey, type: isTopup ? 'topup' : 'subscription', currency: currencyKey },
    });
    return response.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to create checkout session' });
  }
}

// ---- /api/stripe/portal ----
async function handlePortal(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const user = await authenticate(request, response);
  if (!user) return;

  try {
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=stripe_customer_id`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    const profiles = await profileRes.json();
    const customerId = profiles[0]?.stripe_customer_id;
    if (!customerId) return response.status(400).json({ error: 'No billing account found' });
    const origin = getAllowedOrigin(request.headers.origin);
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${origin}/dashboard` });
    return response.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Failed to create billing portal session' });
  }
}

// ---- /api/stripe/sync ----
async function handleSync(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const user = await authenticate(request, response);
  if (!user) return;

  try {
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=stripe_customer_id,stripe_subscription_id,token_balance`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    if (!profileRes.ok) return response.status(500).json({ error: 'Failed to load profile' });
    const profiles = await profileRes.json();
    if (!profiles.length || !profiles[0].stripe_customer_id) {
      return response.status(200).json({ synced: false, reason: 'No Stripe customer' });
    }
    const profile = profiles[0];
    const customerId = profile.stripe_customer_id;

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 10 });

    if (subscriptions.data.length === 0) {
      const allSubs = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
      if (allSubs.data.length === 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ subscription_status: 'inactive' }),
        });
        return response.status(200).json({ synced: true, subscription_status: 'inactive' });
      }
      const latest = allSubs.data[0];
      const status = latest.cancel_at_period_end
        ? 'cancelling'
        : latest.status === 'active'
        ? 'active'
        : latest.status === 'canceled'
        ? 'cancelled'
        : 'past_due';
      const latestPriceId = (latest.items?.data[0]?.price?.id || '').trim();
      const sg = cleanEnv(process.env.STRIPE_PRICE_STARTER) || cleanEnv(process.env.STRIPE_STARTER_PRICE_ID);
      const pg = cleanEnv(process.env.STRIPE_PRICE_PRO) || cleanEnv(process.env.STRIPE_PRO_PRICE_ID);
      const mg = cleanEnv(process.env.STRIPE_PRICE_PREMIUM) || cleanEnv(process.env.STRIPE_PREMIUM_PRICE_ID);
      const su = cleanEnv(process.env.STRIPE_PRICE_STARTER_USD);
      const pu = cleanEnv(process.env.STRIPE_PRICE_PRO_USD);
      const mu = cleanEnv(process.env.STRIPE_PRICE_PREMIUM_USD);
      const latestPlan =
        latestPriceId === mg || latestPriceId === mu ? 'premium' : latestPriceId === pg || latestPriceId === pu ? 'pro' : 'starter';
      const latestDates = extractSubscriptionDates(latest);

      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          subscription_status: status,
          plan: latestPlan,
          stripe_subscription_id: latest.id,
          subscription_renews_at: latestDates.renewsAt,
          subscription_cancel_at: latestDates.cancelAt,
        }),
      });
      return response.status(200).json({
        synced: true,
        plan: latestPlan,
        subscription_status: status,
        subscription_renews_at: latestDates.renewsAt,
        subscription_cancel_at: latestDates.cancelAt,
      });
    }

    const activeSubs = subscriptions.data;
    const keepingSubs = activeSubs.filter((s) => !s.cancel_at_period_end);
    const cancellingSubs = activeSubs.filter((s) => s.cancel_at_period_end);
    const preferredSubs = keepingSubs.length > 0 ? keepingSubs : cancellingSubs;
    const isCancelling = keepingSubs.length === 0 && cancellingSubs.length > 0;

    const sg = cleanEnv(process.env.STRIPE_PRICE_STARTER) || cleanEnv(process.env.STRIPE_STARTER_PRICE_ID);
    const pg = cleanEnv(process.env.STRIPE_PRICE_PRO) || cleanEnv(process.env.STRIPE_PRO_PRICE_ID);
    const mg = cleanEnv(process.env.STRIPE_PRICE_PREMIUM) || cleanEnv(process.env.STRIPE_PREMIUM_PRICE_ID);
    const su = cleanEnv(process.env.STRIPE_PRICE_STARTER_USD);
    const pu = cleanEnv(process.env.STRIPE_PRICE_PRO_USD);
    const mu = cleanEnv(process.env.STRIPE_PRICE_PREMIUM_USD);

    function getPlan(priceId: string): string {
      const id = (priceId || '').trim();
      if (id === mg || id === mu) return 'premium';
      if (id === pg || id === pu) return 'pro';
      if (id === sg || id === su) return 'starter';
      return 'starter';
    }

    let bestPlan = 'starter';
    let bestSubId = preferredSubs[0].id;
    for (const sub of preferredSubs) {
      const priceId = sub.items.data[0]?.price?.id || '';
      const plan = getPlan(priceId);
      if (plan === 'premium') {
        bestPlan = 'premium';
        bestSubId = sub.id;
      } else if (plan === 'pro' && bestPlan !== 'premium') {
        bestPlan = 'pro';
        bestSubId = sub.id;
      } else if (plan === 'starter' && bestPlan === 'starter') {
        bestSubId = sub.id;
      }
    }

    // CRITICAL SECURITY FIX 2026-05-14 (CRIT-01 from Codex audit):
    // The previous version of this block called stripe.subscriptions.cancel()
    // for every active subscription except the chosen 'best' one. Because
    // Account.tsx invokes syncSubscription() on every mount, this turned a
    // passive page-load into a DESTRUCTIVE Stripe mutation that could cancel
    // a real paying customer's subscription without any click, confirmation,
    // or Portal flow.
    //
    // SYNC IS NOW STRICTLY READ-ONLY. If a user has duplicate active subs
    // and we need to clean them up, that's a one-off admin task — never an
    // automatic side-effect of visiting /account.
    if (activeSubs.length > 1) {
      const extraIds = activeSubs.filter((s) => s.id !== bestSubId).map((s) => s.id);
      console.warn(`Sync: user ${user.id} has ${extraIds.length} duplicate active subscriptions (${extraIds.join(', ')}) — NOT auto-cancelling. Manual admin review required.`);
    }

    const alreadySynced = profile.stripe_subscription_id === bestSubId;
    const tokensToAdd = alreadySynced ? 0 : PLAN_CREDITS[bestPlan] || 10;
    if (tokensToAdd > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ p_user_id: user.id, p_amount: tokensToAdd }),
      });
    }

    // Extract renewal + cancellation dates from the chosen subscription.
    // These drive the "Pro renews on X" / "Pro ends X — renewal cancelled"
    // UI strings.
    const bestSub = preferredSubs.find((s) => s.id === bestSubId) || preferredSubs[0];
    const bestDates = extractSubscriptionDates(bestSub);

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        plan: bestPlan,
        stripe_subscription_id: bestSubId,
        subscription_status: isCancelling ? 'cancelling' : 'active',
        subscription_renews_at: bestDates.renewsAt,
        subscription_cancel_at: bestDates.cancelAt,
      }),
    });
    if (!updateRes.ok) {
      console.error('Sync: failed to update profile');
      return response.status(500).json({ error: 'Failed to sync profile' });
    }
    return response.status(200).json({
      synced: true,
      plan: bestPlan,
      subscription_status: isCancelling ? 'cancelling' : 'active',
      subscription_renews_at: bestDates.renewsAt,
      subscription_cancel_at: bestDates.cancelAt,
    });
  } catch (error: any) {
    console.error('Sync error:', error?.message || 'Unknown error');
    return response.status(500).json({ error: 'Sync failed' });
  }
}

// ---- Dispatcher ----
export default async function handler(request: any, response: any) {
  // The dynamic segment lands in request.query.action ('checkout' | 'portal'
  // | 'sync'). webhook is handled by the sibling api/stripe/webhook.ts which
  // is more specific so it wins for /api/stripe/webhook.
  const raw = request.query?.action;
  const action = String(Array.isArray(raw) ? raw[0] : raw || '').toLowerCase();
  switch (action) {
    case 'checkout':
      return handleCheckout(request, response);
    case 'portal':
      return handlePortal(request, response);
    case 'sync':
      return handleSync(request, response);
    default:
      return response.status(404).json({ error: `Unknown stripe action: ${action || '<empty>'}` });
  }
}
