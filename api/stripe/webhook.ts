// API endpoint for Stripe webhooks
// Vercel serverless function

import Stripe from 'stripe';
// 2026-05-17 (PROPER FIX 2nd round): all three helpers moved from lib/* to
// api/_lib/*. lib/email/resend.ts had been ALSO silently broken in production
// — NFT doesn't bundle ANY lib/* file into serverless function output, not
// just the dynamic-require one. The webhook never noticed because Stripe
// hasn't fired a real event since the import landed. Smoke test caught it.
import { sendEmail, wrapEmailBody } from '../_lib/email/resend';
import { logAuditEvent } from '../_lib/audit/log';
import { initSentry, captureError } from '../_lib/observability/sentry';

// Disable Vercel's default body parser — Stripe webhook signature
// verification requires the raw request body, not a parsed JSON object.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Lightweight HTML escape for any user-controlled string we splice into
// the email body. The Resend helper escapes the headline but explicitly
// leaves the body raw — this guards against the rare-but-possible case
// of a signup email like `gio+<script>@example.com`.
function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Fire-and-forget purchase-confirmation email. Never throws, never
 * blocks the webhook. If RESEND_API_KEY is unset, the helper returns
 * { ok: false, error: 'resend_not_configured' } and we just log it.
 */
function firePurchaseEmail(args: {
  toEmail: string | null | undefined;
  planLabel: string;
  tokenCount: number;
  isTopup: boolean;
  renewsAt?: string | null;
}): void {
  const to = (args.toEmail || '').trim();
  if (!to) return;
  const renewsHtml =
    !args.isTopup && args.renewsAt
      ? `<tr><td style="padding:8px 0;color:#8a85a3;">Next renewal</td><td style="padding:8px 0;color:#f0eef9;">${esc(new Date(args.renewsAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }))}</td></tr>`
      : '';
  const body = `
    <p>Your AimVantage purchase is confirmed. Here's what landed in your account:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;border-collapse:collapse;width:100%;">
      <tr><td style="padding:8px 0;color:#8a85a3;width:140px;">Plan</td><td style="padding:8px 0;color:#f0eef9;font-weight:600;">${esc(args.planLabel)}</td></tr>
      <tr><td style="padding:8px 0;color:#8a85a3;">Tokens added</td><td style="padding:8px 0;color:#f0eef9;font-weight:600;">${args.tokenCount}</td></tr>
      ${renewsHtml}
    </table>
    <p style="margin:20px 0;"><a href="https://aimvantage.uk/dashboard" style="display:inline-block;padding:12px 20px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Run your next prep pack →</a></p>
    <p style="font-size:13px;color:#8a85a3;margin-top:24px;">Manage your subscription or top up tokens any time from <a href="https://aimvantage.uk/account" style="color:#a78bfa;">your Account settings</a>. Receipts and invoices are in the Stripe customer portal linked from there.</p>
  `;
  void sendEmail({
    to,
    subject: args.isTopup
      ? `Top-up confirmed — ${args.tokenCount} tokens added`
      : `Welcome to AimVantage ${args.planLabel}`,
    html: wrapEmailBody(args.isTopup ? 'Top-up confirmed' : `${args.planLabel} subscription active`, body),
    tag: 'purchase_confirm',
  }).then((result) => {
    if (!result.ok) {
      console.warn(`Webhook: purchase email failed — ${result.error}`);
    }
  });
}

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
  'starter': 20,
  'pro': 60,
  'premium': 120,
};

// Trim env vars — paste errors in Vercel can leave trailing whitespace/newlines
// which would cause price IDs to never match and silently mis-classify plans.
const cleanEnv = (v: string | undefined) => (v || '').trim();

// Map Stripe price IDs to plan names for trusted plan derivation.
// Supports both GBP and USD price IDs (Path B multi-currency).
function getPlanFromPriceId(priceId: string): string {
  const id = (priceId || '').trim();
  const starterGbp = cleanEnv(process.env.STRIPE_PRICE_STARTER) || cleanEnv(process.env.STRIPE_STARTER_PRICE_ID);
  const proGbp = cleanEnv(process.env.STRIPE_PRICE_PRO) || cleanEnv(process.env.STRIPE_PRO_PRICE_ID);
  const premiumGbp = cleanEnv(process.env.STRIPE_PRICE_PREMIUM) || cleanEnv(process.env.STRIPE_PREMIUM_PRICE_ID);
  const starterUsd = cleanEnv(process.env.STRIPE_PRICE_STARTER_USD);
  const proUsd = cleanEnv(process.env.STRIPE_PRICE_PRO_USD);
  const premiumUsd = cleanEnv(process.env.STRIPE_PRICE_PREMIUM_USD);

  if (id === premiumGbp || id === premiumUsd) return 'premium';
  if (id === proGbp || id === proUsd) return 'pro';
  if (id === starterGbp || id === starterUsd) return 'starter';
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

/**
 * Tolerant extractor for subscription renewal + cancellation dates.
 *
 * Stripe MOVED `current_period_end` from the subscription top-level to
 * per-item on their recent API versions. Old code reading
 * `sub.current_period_end` silently gets `undefined` on modern APIs and
 * `subscription_renews_at` never gets set — every paying user shows as
 * "free tier" despite paying. Defensively read BOTH locations.
 *
 * `cancel_at` is the MODERN cancellation flag (epoch timestamp at which
 * the subscription becomes 'cancelled'). When the user clicks Cancel in
 * the portal, Stripe sets both `cancel_at_period_end: true` AND
 * `cancel_at: <period_end_epoch>`. Reading the timestamp lets the UI
 * say "Pro ends Mar 15 — renewal cancelled" instead of a date-less
 * "Cancelling at end of period".
 *
 * `cancelled_at` is set only AFTER the cancellation takes effect, so
 * we don't read it for display purposes — it's a historical marker.
 *
 * Returns ISO strings or null. Stripe epoch timestamps are seconds-since-1970.
 */
function extractSubscriptionDates(sub: any): { renewsAt: string | null; cancelAt: string | null } {
  if (!sub || typeof sub !== 'object') return { renewsAt: null, cancelAt: null };

  // current_period_end may live in two places depending on API version.
  // Tolerant: try top-level first (legacy), then per-item (modern).
  let renewsEpoch: number | null = null;
  if (typeof sub.current_period_end === 'number' && sub.current_period_end > 0) {
    renewsEpoch = sub.current_period_end;
  } else if (sub.items?.data?.[0]?.current_period_end && typeof sub.items.data[0].current_period_end === 'number') {
    renewsEpoch = sub.items.data[0].current_period_end;
  }

  // cancel_at is the modern flag (epoch). May be null even when
  // cancel_at_period_end is true on very old API versions — defensive
  // fallback to current_period_end in that case so the UI still has a
  // date to display.
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

export default async function handler(request: any, response: any) {
  initSentry();
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const sig = request.headers['stripe-signature'] as string;
  // BOTH secrets supported. STRIPE_WEBHOOK_SECRET = live mode (production).
  // STRIPE_WEBHOOK_SECRET_TEST = test mode (CLI-driven synthetic events).
  // If both are set, signature is tried against each in turn — the FIRST one
  // that verifies wins. Test events that match the live secret would be
  // implausible (different HMAC keys), so this can't be exploited to bypass
  // signature checks. Lets us run `stripe trigger` against production code
  // without spending real money.
  const webhookSecretLive = process.env.STRIPE_WEBHOOK_SECRET;
  const webhookSecretTest = process.env.STRIPE_WEBHOOK_SECRET_TEST;

  let event: Stripe.Event;

  try {
    // Read the raw body from the request stream (bodyParser is disabled)
    const rawBody = await getRawBody(request);
    const isDeployed = process.env.VERCEL || process.env.NODE_ENV === 'production';
    const candidateSecrets = [webhookSecretLive, webhookSecretTest].filter(Boolean) as string[];

    if (sig && candidateSecrets.length > 0) {
      // Verify signature using raw body — parsed JSON would break HMAC.
      // Try each candidate secret in turn; first success wins.
      let verifiedEvent: Stripe.Event | null = null;
      let lastErr: Error | null = null;
      for (const secret of candidateSecrets) {
        try {
          verifiedEvent = stripe.webhooks.constructEvent(rawBody, sig, secret);
          break;
        } catch (err: any) {
          lastErr = err;
        }
      }
      if (!verifiedEvent) throw lastErr || new Error('Signature did not match any configured secret');
      event = verifiedEvent;
    } else if (!isDeployed && candidateSecrets.length === 0) {
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
          firePurchaseEmail({
            toEmail: session.customer_details?.email,
            planLabel: 'Starter top-up',
            tokenCount: topupTokens,
            isTopup: true,
          });
          // Audit trail — fire-and-forget, never blocks webhook 200.
          void logAuditEvent({
            event_type: 'purchase.completed',
            actor_id: userId,
            actor_email: session.customer_details?.email || null,
            resource_type: 'stripe_session',
            resource_id: session.id,
            detail: `Top-up: +${topupTokens} tokens (Starter)`,
            metadata: {
              stripe_event_id: event.id,
              type: 'topup',
              tokens_added: topupTokens,
              amount_total: session.amount_total,
              currency: session.currency,
            },
          });
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

        // Derive plan from the actual Stripe subscription price, not user-controlled metadata.
        // ALSO retrieve the full subscription so we can extract renews_at + cancel_at —
        // these dates are required by the Account UI to show "Pro renews on X".
        let plan = session.metadata?.plan || 'pro';
        let renewsAt: string | null = null;
        let cancelAt: string | null = null;
        if (newSubscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(newSubscriptionId);
            const priceId = sub.items.data[0]?.price?.id;
            if (priceId) plan = getPlanFromPriceId(priceId);
            const dates = extractSubscriptionDates(sub);
            renewsAt = dates.renewsAt;
            cancelAt = dates.cancelAt;
          } catch (e: any) {
            console.error(`Webhook: failed to retrieve subscription ${newSubscriptionId} for dates:`, e?.message || '');
            // Fall back to metadata plan; dates stay null (will populate on next webhook)
          }
        }

        // ADDITIVE: add purchased tokens atomically
        const tokensToAdd = PLAN_TOKENS[plan] || 10;
        await addTokensAtomic(userId, tokensToAdd);

        const ok = await supabasePatch(`id=eq.${userId}`, {
          plan,
          stripe_subscription_id: newSubscriptionId,
          subscription_status: 'active',
          subscription_renews_at: renewsAt,
          subscription_cancel_at: cancelAt,
        });
        if (!ok) {
          console.error(`Webhook CRITICAL: profile patch failed after token credit for user ${userId} — user paid but plan/dates not updated`);
        }
        firePurchaseEmail({
          toEmail: session.customer_details?.email,
          planLabel: plan.charAt(0).toUpperCase() + plan.slice(1),
          tokenCount: tokensToAdd,
          isTopup: false,
          renewsAt,
        });
        // Audit trail for subscription checkout
        void logAuditEvent({
          event_type: 'purchase.completed',
          actor_id: userId,
          actor_email: session.customer_details?.email || null,
          resource_type: 'stripe_subscription',
          resource_id: newSubscriptionId,
          detail: `Subscription: ${plan} (+${tokensToAdd} tokens)`,
          metadata: {
            stripe_event_id: event.id,
            type: 'subscription',
            plan,
            tokens_added: tokensToAdd,
            amount_total: session.amount_total,
            currency: session.currency,
            renews_at: renewsAt,
          },
        });
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        // BOTH event names handled because Stripe fires both for the same
        // transitions and a user's Dashboard may be subscribed to either.
        // Idempotency check at the top of the handler (processed_stripe_events
        // table) means double-fire from both events is safe — second one
        // 409s and short-circuits.
        // Handles monthly subscription RENEWALS.
        //
        // billing_reason values we see:
        //   'subscription_create' — first month of a new subscription.
        //        SKIP here — checkout.session.completed already added tokens.
        //   'subscription_cycle' — auto-renewal at the end of each billing period.
        //        ADD plan's full monthly tokens here.
        //   'subscription_update' — prorated invoice from a plan change via the
        //        Stripe Billing Portal. SKIP — plan upgrades should go through
        //        /api/stripe/checkout, which generates a checkout.session.completed.
        //        (If portal plan-changes are later enabled, handle this branch.)
        //   'manual' / others — out of scope.
        //
        // Idempotency: the processed_stripe_events row inserted at the top of
        // this handler prevents Stripe retries from double-adding tokens.
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.billing_reason !== 'subscription_cycle') {
          break;
        }

        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id;
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;

        if (!customerId || !subscriptionId) {
          console.warn(`Renewal: missing customer or subscription on invoice ${invoice.id}`);
          break;
        }

        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id,plan`
        );

        if (profiles.length === 0) {
          console.warn(`Renewal: no profile for customer ${customerId}`);
          break;
        }

        const profile = profiles[0];

        // Only refill tokens if this invoice is for the user's CURRENT
        // subscription. If they have a stale/cancelled sub somehow firing
        // events, skip.
        if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscriptionId) {
          console.log(`Renewal: ignoring non-current sub ${subscriptionId} for user ${profile.id}`);
          break;
        }

        // Derive plan from the invoice's line item price (trusted — from Stripe)
        const lineItem = invoice.lines?.data?.[0];
        const price = lineItem && typeof lineItem.price === 'object' ? lineItem.price : null;
        const priceId = price?.id;
        const plan = priceId ? getPlanFromPriceId(priceId) : profile.plan;

        // Starter is one-time, shouldn't appear on a subscription cycle — guard anyway
        if (plan === 'starter' || !PLAN_TOKENS[plan]) {
          console.warn(`Renewal: unexpected plan "${plan}" on invoice ${invoice.id}`);
          break;
        }

        const tokensToAdd = PLAN_TOKENS[plan];
        await addTokensAtomic(profile.id, tokensToAdd);
        console.log(`Renewal: added ${tokensToAdd} tokens to user ${profile.id} (plan ${plan}, invoice ${invoice.id})`);

        // ALSO extend the subscription_renews_at timestamp so the UI shows
        // the NEW next-renewal date, not the old one. Retrieve the full
        // subscription because the invoice itself doesn't carry the next
        // period_end (it carries the just-ended period only).
        try {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const dates = extractSubscriptionDates(sub);
          const ok = await supabasePatch(`id=eq.${profile.id}`, {
            subscription_renews_at: dates.renewsAt,
            subscription_cancel_at: dates.cancelAt,
            // Defensive: status may have transitioned cancelling→active if user
            // un-cancelled before the renewal landed. Keep status in sync.
            subscription_status: sub.cancel_at_period_end ? 'cancelling' : 'active',
          });
          if (!ok) {
            console.error(`Renewal: profile patch failed for renewal-date update on user ${profile.id}`);
          }
        } catch (e: any) {
          console.error(`Renewal: failed to retrieve sub ${subscriptionId} for date update:`, e?.message || '');
          // Tokens already added; date will catch up on next webhook
        }
        break;
      }

      case 'invoice.payment_failed': {
        // Card declined or other payment failure on a renewal.
        // Mark the user 'past_due' so the UI can warn them BEFORE Stripe
        // gives up and cancels the subscription. Stripe will continue
        // retrying for ~3 weeks by default; our job is to surface the
        // problem so the user can update their card via the portal.
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        if (!customerId) {
          console.warn(`payment_failed: no customer on invoice ${invoice.id}`);
          break;
        }
        const profiles = await supabaseGet(`stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`);
        if (profiles.length === 0) {
          console.warn(`payment_failed: no profile for customer ${customerId}`);
          break;
        }
        const profile = profiles[0];
        const ok = await supabasePatch(`id=eq.${profile.id}`, {
          subscription_status: 'past_due',
        });
        if (!ok) {
          console.error(`payment_failed: profile patch failed for user ${profile.id}`);
        } else {
          console.log(`payment_failed: marked user ${profile.id} past_due (invoice ${invoice.id})`);
        }
        break;
      }

      case 'charge.dispute.created': {
        // Customer initiated a chargeback. Mark past_due so we stop serving
        // premium features until the dispute resolves. Tokens are NOT clawed
        // back here — we wait for charge.refunded (if the dispute is lost)
        // or charge.dispute.closed (if won) to make the final decision.
        const dispute = event.data.object as Stripe.Dispute;
        const charge = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id;
        if (!charge) break;
        try {
          const chargeObj = await stripe.charges.retrieve(charge);
          const customerId = typeof chargeObj.customer === 'string' ? chargeObj.customer : chargeObj.customer?.id;
          if (!customerId) {
            console.warn(`dispute.created: no customer on charge ${charge}`);
            break;
          }
          const profiles = await supabaseGet(`stripe_customer_id=eq.${customerId}&select=id`);
          if (profiles.length === 0) break;
          await supabasePatch(`id=eq.${profiles[0].id}`, { subscription_status: 'past_due' });
          console.log(`dispute.created: marked user ${profiles[0].id} past_due (dispute ${dispute.id})`);
        } catch (e: any) {
          console.error(`dispute.created: failed:`, e?.message || '');
        }
        break;
      }

      case 'charge.dispute.closed': {
        // Dispute resolved. Stripe sends 'won' or 'lost' in dispute.status.
        // If WON: restore subscription_status to active (or cancelling if
        // user had cancelled separately). Note: do NOT use the dispute event
        // to restore tokens — they were never deducted.
        // If LOST: charge.refunded will fire separately and handle plan→free.
        const dispute = event.data.object as Stripe.Dispute;
        if (dispute.status !== 'won') break; // 'lost' is handled by charge.refunded
        const charge = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id;
        if (!charge) break;
        try {
          const chargeObj = await stripe.charges.retrieve(charge);
          const customerId = typeof chargeObj.customer === 'string' ? chargeObj.customer : chargeObj.customer?.id;
          if (!customerId) break;
          const profiles = await supabaseGet(`stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`);
          if (profiles.length === 0) break;
          const profile = profiles[0];
          // Re-derive status from the current Stripe subscription state.
          let newStatus: string = 'active';
          if (profile.stripe_subscription_id) {
            try {
              const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
              newStatus = sub.cancel_at_period_end ? 'cancelling'
                : sub.status === 'active' ? 'active'
                : sub.status === 'canceled' ? 'cancelled'
                : 'past_due';
            } catch { /* fall back to 'active' */ }
          }
          await supabasePatch(`id=eq.${profile.id}`, { subscription_status: newStatus });
          console.log(`dispute.closed (won): restored user ${profile.id} to ${newStatus}`);
        } catch (e: any) {
          console.error(`dispute.closed: failed:`, e?.message || '');
        }
        break;
      }

      case 'customer.subscription.created': {
        // Safety net handler. Normally checkout.session.completed already
        // captured the new subscription + added tokens. But Stripe's event
        // delivery order is NOT guaranteed — if subscription.created lands
        // FIRST (or if checkout.session.completed is lost in retry chain),
        // this handler ensures the dates land on the profile so the UI
        // doesn't show stale state.
        //
        // We do NOT add tokens here — that's checkout.session.completed's
        // job (and double-credit would be bad). Profile idempotency on
        // stripe_subscription_id handles the race where both fire close
        // together.
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`
        );
        if (profiles.length === 0) {
          console.warn(`subscription.created: no profile for customer ${customerId} (race with checkout.session.completed?)`);
          break;
        }
        const profile = profiles[0];
        const priceId = subscription.items?.data[0]?.price?.id;
        const plan = priceId ? getPlanFromPriceId(priceId) : undefined;
        const dates = extractSubscriptionDates(subscription);
        const status = subscription.cancel_at_period_end ? 'cancelling' :
                      subscription.status === 'active' ? 'active' :
                      subscription.status === 'canceled' ? 'cancelled' : 'past_due';
        const patch: Record<string, any> = {
          subscription_status: status,
          stripe_subscription_id: subscription.id,
          subscription_renews_at: dates.renewsAt,
          subscription_cancel_at: dates.cancelAt,
        };
        if (plan) patch.plan = plan;
        const ok = await supabasePatch(`id=eq.${profile.id}`, patch);
        if (!ok) {
          console.error(`subscription.created: profile patch failed for user ${profile.id}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        // Fires on EVERY subscription mutation: cancellation, un-cancellation,
        // plan change, payment-method swap, status transition. We need to
        // re-sync our local mirror of the renewal date AND the cancellation
        // date on every one of these — otherwise the UI lies.
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Lookup by customer_id (subscription_id is fragile — a sub may have
        // been deleted and replaced; the customer_id is stable).
        let profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`
        );

        // Fallback: lookup by subscription_id if customer_id missed (rare —
        // happens if customer_id was never set on the profile due to an
        // earlier webhook race).
        if (profiles.length === 0) {
          profiles = await supabaseGet(
            `stripe_subscription_id=eq.${subscription.id}&select=id,stripe_subscription_id`
          );
        }

        if (profiles.length > 0) {
          const profile = profiles[0];

          const status = subscription.cancel_at_period_end ? 'cancelling' :
                        subscription.status === 'active' ? 'active' :
                        subscription.status === 'canceled' ? 'cancelled' : 'past_due';

          // Derive plan from the subscription's price
          const priceId = subscription.items?.data[0]?.price?.id;
          const plan = priceId ? getPlanFromPriceId(priceId) : undefined;

          // Extract dates — THIS is the missing piece that meant cancellations
          // never showed a date in the UI. cancel_at carries the period-end
          // epoch when the user clicked Cancel; current_period_end (or its
          // modern items.data[0] sibling) carries the next-renewal epoch.
          const dates = extractSubscriptionDates(subscription);

          const patch: Record<string, any> = {
            subscription_status: status,
            stripe_subscription_id: subscription.id,
            subscription_renews_at: dates.renewsAt,
            // Explicitly write null on un-cancel so the "Renewal cancelled"
            // banner clears in the UI.
            subscription_cancel_at: dates.cancelAt,
          };
          if (plan) patch.plan = plan;

          const ok = await supabasePatch(`id=eq.${profile.id}`, patch);
          if (!ok) {
            console.error(`subscription.updated: profile patch failed for user ${profile.id} (sub ${subscription.id})`);
          }
        } else {
          console.warn(`subscription.updated: no profile for customer ${customerId} or subscription ${subscription.id}`);
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

          // Derive which plan was refunded from the invoice's price ID
          // (subscription charges) or the checkout session's metadata
          // (one-time top-up charges). This is robust against:
          //   - price changes (a future £10 Pro tier wouldn't get
          //     classified as Starter just because it's under the
          //     hard-coded £11 threshold)
          //   - promotional discounts / coupons (a £2 Premium charge
          //     after coupon shouldn't deduct only Starter tokens)
          //   - non-GBP/USD currencies (€/A$/etc. all hit the
          //     amount-threshold fallback wrong)
          //
          // Amount-based inference is kept as a last-resort fallback
          // for ancient legacy charges that have no recoverable price
          // ID, but it triggers a console.warn so we know it fired.
          async function inferPlanTokensFromCharge(c: Stripe.Charge): Promise<number> {
            // Subscription charge → look up invoice → first line's price → plan
            if (c.invoice && typeof c.invoice === 'string') {
              try {
                const invoice = await stripe.invoices.retrieve(c.invoice);
                const priceId = invoice.lines.data[0]?.price?.id;
                if (priceId) {
                  const plan = getPlanFromPriceId(priceId);
                  return PLAN_TOKENS[plan] || PLAN_TOKENS.starter;
                }
              } catch {
                // fall through
              }
            }
            // One-time top-up → resolve via the checkout session's metadata.plan
            // (set when /api/stripe/checkout created the session)
            try {
              const sessions = await stripe.checkout.sessions.list({
                payment_intent: typeof c.payment_intent === 'string' ? c.payment_intent : c.payment_intent?.id,
                limit: 1,
              });
              const sessionPlan = sessions.data[0]?.metadata?.plan;
              if (sessionPlan && PLAN_TOKENS[sessionPlan]) {
                return PLAN_TOKENS[sessionPlan];
              }
            } catch {
              // fall through
            }
            // LAST-RESORT: amount/currency thresholds — wrong for promo
            // pricing + non-£/$ currencies. We log this so it can be
            // investigated if it ever fires in production.
            console.warn(`Refund: falling back to amount-based plan inference for charge ${c.id} (${c.currency} ${c.amount})`);
            const isUsd = (c.currency || '').toLowerCase() === 'usd';
            if (isUsd) {
              if (c.amount >= 2400) return PLAN_TOKENS.premium;
              if (c.amount >= 1400) return PLAN_TOKENS.pro;
              return PLAN_TOKENS.starter;
            }
            if (c.amount >= 1900) return PLAN_TOKENS.premium;
            if (c.amount >= 1100) return PLAN_TOKENS.pro;
            return PLAN_TOKENS.starter;
          }

          const totalPaid = charge.amount;
          const refunded = charge.amount_refunded;
          const refundRatio = totalPaid > 0 ? refunded / totalPaid : 1;
          const chargeTokens = await inferPlanTokensFromCharge(charge);
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
              } else {
                // Was silently swallowed before — now surface so we can tell apart
                // "deduct returned 4xx" (e.g. RPC mismatch, profile gone) from
                // "deduct fetch threw" (network). Both keep the webhook 200 — the
                // refund itself is irreversible Stripe-side, retrying the deduct
                // is the operator's call.
                const errText = await deductRes.text().catch(() => '');
                console.error(`Refund: token deduct returned ${deductRes.status} for user ${profile.id} (charge ${charge.id}): ${errText.slice(0, 200)}`);
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

          // Refund-confirmation email — courtesy notification so the user
          // doesn't wonder why their balance dropped. Fire-and-forget; never
          // blocks the webhook. Recipient comes from the charge's billing
          // details (Stripe-verified buyer email at time of purchase, more
          // reliable than profile.email which a user could change post-purchase).
          const buyerEmail =
            (charge.billing_details?.email as string | undefined) ||
            (charge.receipt_email as string | undefined) ||
            '';
          // Audit trail for refund — single most-important paper trail for
          // dispute response. Always fires regardless of email path success.
          void logAuditEvent({
            event_type: 'purchase.refunded',
            actor_id: profile.id,
            actor_email: buyerEmail || null,
            resource_type: 'stripe_charge',
            resource_id: charge.id,
            detail: `${refundRatio >= 1 ? 'Full' : 'Partial'} refund: ${charge.currency?.toUpperCase()} ${charge.amount_refunded} (deducted ${Math.min(tokensToDeduct, profile.token_balance)} tokens)`,
            metadata: {
              stripe_event_id: event.id,
              charge_amount: charge.amount,
              amount_refunded: charge.amount_refunded,
              refund_ratio: Number(refundRatio.toFixed(4)),
              currency: charge.currency,
              tokens_deducted: Math.min(tokensToDeduct, profile.token_balance),
              tokens_to_deduct_calculated: tokensToDeduct,
              is_subscription_charge: isSubscriptionCharge,
            },
          });

          if (buyerEmail) {
            const ZERO_DECIMAL = new Set(['bif','clp','djf','gnf','jpy','kmf','krw','mga','pyg','rwf','ugx','vnd','vuv','xaf','xof','xpf']);
            const currencyKey = (charge.currency || 'gbp').toLowerCase();
            const refundedMajor = ZERO_DECIMAL.has(currencyKey)
              ? String(charge.amount_refunded)
              : (charge.amount_refunded / 100).toFixed(2);
            const currencyLabel = (charge.currency || 'gbp').toUpperCase();
            const refundType = refundRatio >= 1 ? 'full' : 'partial';
            const deductedNote =
              tokensToDeduct > 0 && profile.token_balance > 0
                ? `<p>We've adjusted your token balance accordingly — ${Math.min(tokensToDeduct, profile.token_balance)} token${Math.min(tokensToDeduct, profile.token_balance) === 1 ? '' : 's'} removed. Anything you used before the refund stays used.</p>`
                : '<p>No tokens were available to remove, so your balance is unchanged.</p>';
            const body = `
              <p>Your AimVantage refund has been processed: <strong style="color:#ffffff;">${currencyLabel} ${refundedMajor}</strong> (${refundType} refund).</p>
              ${deductedNote}
              <p>Funds typically arrive in your card account within 5–10 working days — Stripe's own confirmation email will have the exact ETA for your card issuer.</p>
              <p style="font-size:13px;color:#8a85a3;margin-top:24px;">If you didn't expect this refund, reply to this email and a human (Gio) will look into it.</p>
            `;
            void import('../_lib/email/resend').then(({ sendEmail, wrapEmailBody }) =>
              sendEmail({
                to: buyerEmail,
                subject: `Refund processed — ${currencyLabel} ${refundedMajor}`,
                html: wrapEmailBody('Refund processed', body),
                tag: 'refund_processed',
              })
            ).then((result) => {
              if (result && !result.ok) {
                console.warn(`Refund email failed for user ${profile.id}: ${result.error}`);
              }
            }).catch(() => { /* never block the webhook response */ });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Fires when the subscription is FULLY terminated (period ended after
        // cancellation OR Stripe gave up on a past_due sub OR admin deleted it).
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        let profiles = await supabaseGet(
          `stripe_customer_id=eq.${customerId}&select=id,stripe_subscription_id`
        );
        if (profiles.length === 0) {
          profiles = await supabaseGet(
            `stripe_subscription_id=eq.${subscription.id}&select=id,stripe_subscription_id`
          );
        }

        if (profiles.length > 0) {
          const profile = profiles[0];

          // Only act on the current or matching subscription
          if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscription.id) {
            break;
          }

          // Clear renewal + cancel dates AND zero out the subscription_id.
          // Tokens are kept (user paid for them) — only status + dates flip.
          // Clearing stripe_subscription_id prevents stale-sub lookups in
          // future webhooks (e.g. a delayed renewal event firing on the
          // dead sub).
          const ok = await supabasePatch(`id=eq.${profile.id}`, {
            subscription_status: 'cancelled',
            subscription_renews_at: null,
            subscription_cancel_at: null,
            stripe_subscription_id: null,
          });
          if (!ok) {
            console.error(`subscription.deleted: profile patch failed for user ${profile.id}`);
          }
        }
        break;
      }
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    // CRITICAL: release the idempotency claim before returning 500.
    //
    // Without this, the failure sequence is:
    //   1. We claim the event row in processed_stripe_events (lines 137-159)
    //   2. Side-effect throws (e.g. addTokensAtomic RPC errors out)
    //   3. Catch returns 500 → Stripe retries the webhook
    //   4. On retry the claim row already exists → 409 short-circuits
    //      with duplicate:true and returns 200
    //   5. Side effect NEVER re-attempts → user paid but never got tokens
    //
    // Releasing the claim row here means Stripe's retry can re-execute
    // the handler. The side-effect handlers themselves are designed to
    // be retry-safe: deduct_tokens is balance-guarded, addTokensAtomic
    // is capped, and the checkout.session.completed handler has its
    // own profile-state idempotency check at line 184.
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/processed_stripe_events?event_id=eq.${encodeURIComponent(event.id)}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      });
    } catch (cleanupErr: any) {
      console.error(`Webhook: failed to release idempotency claim for event ${event.id}: ${cleanupErr?.message || ''}`);
    }
    // Preserve the actual error message/stack — losing it on line 482's
    // static-string log was a diagnosability hole flagged in review.
    console.error('Webhook handler error:', error);
    // Sentry capture — webhook failures are the single most-important
    // server errors to know about (every miss = potentially refunded
    // money / missing tokens / no email). Include event type + id so
    // ops can replay via the Stripe CLI.
    captureError(error, {
      route: '/api/stripe/webhook',
      stripe_event_id: event?.id || null,
      stripe_event_type: event?.type || null,
    });
    return response.status(500).json({ error: 'Webhook handler failed' });
  }
}
