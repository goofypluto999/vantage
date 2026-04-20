// API endpoint for Stripe webhooks
// Vercel serverless function

import Stripe from 'stripe';

// Disable Vercel's default body parser — Stripe webhook signature
// verification requires the raw request body, not a parsed JSON object.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Read raw body from the Node.js request stream
async function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const PLAN_TOKENS: Record<string, number> = {
  'starter': 10,
  'pro': 30,
  'premium': 60,
};

// Map Stripe price IDs to plan names for trusted plan derivation.
// Supports both GBP and USD price IDs (Path B multi-currency).
function getPlanFromPriceId(priceId: string): string {
  const starterGbp = process.env.STRIPE_PRICE_STARTER || process.env.STRIPE_STARTER_PRICE_ID || '';
  const proGbp = process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID || '';
  const premiumGbp = process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PREMIUM_PRICE_ID || '';
  const starterUsd = process.env.STRIPE_PRICE_STARTER_USD || '';
  const proUsd = process.env.STRIPE_PRICE_PRO_USD || '';
  const premiumUsd = process.env.STRIPE_PRICE_PREMIUM_USD || '';

  if (priceId === premiumGbp || priceId === premiumUsd) return 'premium';
  if (priceId === proGbp || priceId === proUsd) return 'pro';
  if (priceId === starterGbp || priceId === starterUsd) return 'starter';
  return 'starter'; // fallback
}

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
    console.error(`Supabase PATCH failed (${filter}):`, res.status);
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
    console.error(`Supabase GET failed (${filter}):`, res.status);
    return [];
  }
  return res.json();
}

async function addTokensAtomic(userId: string, amount: number): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/add_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ p_user_id: userId, p_amount: amount }),
  });
  if (!res.ok) throw new Error('Failed to add tokens');
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
    // Read the raw body from the request stream (bodyParser is disabled)
    const rawBody = await getRawBody(request);
    const isDeployed = process.env.VERCEL || process.env.NODE_ENV === 'production';

    if (sig && webhookSecret) {
      // Verify signature using raw body — parsed JSON would break HMAC
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else if (!isDeployed && !webhookSecret) {
      // ONLY accept unsigned events in local development without a secret configured
      console.warn('Webhook: accepting unsigned event (local development only)');
      event = JSON.parse(rawBody.toString()) as Stripe.Event;
    } else {
      // Reject in all deployed environments (production + preview)
      console.error('Webhook: rejecting unsigned event in deployed environment');
      return response.status(400).json({ error: 'Webhook signature verification required' });
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message || '');
    return response.status(400).json({ error: 'Webhook verification failed' });
  }

  // Idempotency: atomically claim this event ID before processing.
  // If the insert fails with a unique-violation we've seen this event before
  // (Stripe retry, double delivery, etc.) — return 200 silently.
  try {
    const claimRes = await fetch(`${SUPABASE_URL}/rest/v1/processed_stripe_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ event_id: event.id, event_type: event.type }),
    });
    if (claimRes.status === 409) {
      // Unique violation — already processed
      console.log(`Webhook: event ${event.id} already processed, skipping`);
      return response.status(200).json({ received: true, duplicate: true });
    }
    if (!claimRes.ok && claimRes.status !== 201) {
      // Unknown error claiming the event — log but continue so we don't lose the event
      console.error(`Webhook: failed to claim event ${event.id}: ${claimRes.status}`);
    }
  } catch (err: any) {
    console.error('Webhook: idempotency check error (continuing):', err?.message);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const isTopup = session.metadata?.type === 'topup' || session.mode === 'payment';
        const newSubscriptionId = session.subscription as string;

        if (!userId) break;

        if (isTopup) {
          // ONE-TIME TOP-UP (Starter): just add tokens, don't touch plan/subscription
          const topupTokens = PLAN_TOKENS['starter'] || 10;
          await addTokensAtomic(userId, topupTokens);
          console.log(`Webhook: top-up of ${topupTokens} tokens for user ${userId}`);
          break;
        }

        // SUBSCRIPTION CHECKOUT (Pro/Premium)
        const profiles = await supabaseGet(`id=eq.${userId}&select=stripe_subscription_id`);
        const current = profiles[0];

        // Idempotency: if subscription ID already matches, this event was already processed
        if (current?.stripe_subscription_id === newSubscriptionId) {
          console.log(`Webhook: checkout already processed for sub ${newSubscriptionId}`);
          break;
        }

        // Cancel old subscription if it exists and differs from new one
        if (current?.stripe_subscription_id && current.stripe_subscription_id !== newSubscriptionId) {
          try {
            await stripe.subscriptions.cancel(current.stripe_subscription_id);
          } catch (cancelErr: any) {
            // Already cancelled — fine
          }
        }

        // Derive plan from the actual Stripe subscription price, not user-controlled metadata
        let plan = session.metadata?.plan || 'pro';
        if (newSubscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(newSubscriptionId);
            const priceId = sub.items.data[0]?.price?.id;
            if (priceId) plan = getPlanFromPriceId(priceId);
          } catch {
            // Fall back to metadata plan
          }
        }

        // ADDITIVE: add purchased tokens atomically
        const tokensToAdd = PLAN_TOKENS[plan] || 10;
        await addTokensAtomic(userId, tokensToAdd);

        await supabasePatch(`id=eq.${userId}`, {
          plan,
          stripe_subscription_id: newSubscriptionId,
          subscription_status: 'active',
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`
        );

        if (profiles.length > 0) {
          const profile = profiles[0];

          const status = subscription.cancel_at_period_end ? 'cancelling' :
                        subscription.status === 'active' ? 'active' :
                        subscription.status === 'canceled' ? 'cancelled' : 'past_due';

          // Derive plan from the subscription's price
          const priceId = subscription.items?.data[0]?.price?.id;
          const plan = priceId ? getPlanFromPriceId(priceId) : undefined;

          const patch: Record<string, any> = {
            subscription_status: status,
            stripe_subscription_id: subscription.id,
          };
          if (plan) patch.plan = plan;

          await supabasePatch(`id=eq.${profile.id}`, patch);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const customerId = charge.customer as string;
        if (!customerId) break;

        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,plan,token_balance`
        );

        if (profiles.length > 0) {
          const profile = profiles[0];

          // Derive which plan was actually refunded from charge amount + currency,
          // NOT the user's current plan. Amounts are in the smallest unit (pence/cents).
          // Known plan prices:
          //   Starter: £5.00 = 500p  |  $5.00 = 500c  → 10 tokens
          //   Pro:     £12.00 = 1200p |  $15.00 = 1500c → 30 tokens
          //   Premium: £20.00 = 2000p |  $25.00 = 2500c → 60 tokens
          function planTokensForCharge(amount: number, currency: string): number {
            const isUsd = (currency || '').toLowerCase() === 'usd';
            if (isUsd) {
              if (amount >= 2400) return PLAN_TOKENS.premium;
              if (amount >= 1400) return PLAN_TOKENS.pro;
              return PLAN_TOKENS.starter;
            }
            // GBP
            if (amount >= 1900) return PLAN_TOKENS.premium;
            if (amount >= 1100) return PLAN_TOKENS.pro;
            return PLAN_TOKENS.starter;
          }

          const totalPaid = charge.amount; // smallest unit
          const refunded = charge.amount_refunded;
          const refundRatio = totalPaid > 0 ? refunded / totalPaid : 1;
          const chargeTokens = planTokensForCharge(totalPaid, charge.currency || 'gbp');
          const tokensToDeduct = Math.round(chargeTokens * refundRatio);

          // Can't go negative — cap at current balance
          if (tokensToDeduct > 0 && profile.token_balance > 0) {
            const safeDeduct = Math.min(tokensToDeduct, profile.token_balance);
            try {
              const deductRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/deduct_tokens`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_SERVICE_KEY,
                  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                },
                body: JSON.stringify({ p_user_id: profile.id, p_amount: safeDeduct }),
              });
              if (deductRes.ok) {
                console.log(`Refund: deducted ${safeDeduct}/${tokensToDeduct} tokens from user ${profile.id} (charge ${charge.id}, ${charge.currency} ${totalPaid})`);
              }
            } catch (err: any) {
              console.error(`Refund: failed to deduct tokens: ${err.message}`);
            }
          }

          // Only downgrade subscription_status on full refund of a SUBSCRIPTION charge.
          // Starter is a one-time payment — don't touch subscription_status.
          const isSubscriptionCharge = !!charge.invoice;
          if (refundRatio >= 1 && isSubscriptionCharge) {
            await supabasePatch(`id=eq.${profile.id}`, { subscription_status: 'cancelled' });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`
        );

        if (profiles.length > 0) {
          const profile = profiles[0];

          // Only act on the current or matching subscription
          if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscription.id) {
            break;
          }

          // Only update status — tokens are kept (user paid for them)
          await supabasePatch(`id=eq.${profile.id}`, {
            subscription_status: 'cancelled',
          });
        }
        break;
      }
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error');
    return response.status(500).json({ error: 'Webhook handler failed' });
  }
}
