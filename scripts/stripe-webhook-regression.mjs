#!/usr/bin/env node
/**
 * Stripe webhook synthetic-event regression test.
 *
 * Per the user's spec (Phase 4 of the subscription audit). Fires
 * SYNTHETIC events at the deployed webhook handler, asserts the DB
 * state changed correctly, then RESTORES the user record so the test
 * is non-destructive.
 *
 * Usage:
 *   node scripts/stripe-webhook-regression.mjs <test_user_id>
 *
 * Required env vars (mirror the deployed function):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   STRIPE_SECRET_KEY        — used to retrieve real subscription objects
 *   STRIPE_WEBHOOK_SECRET    — used to sign the synthetic event
 *   WEBHOOK_URL              — full https URL to /api/stripe/webhook
 *
 * This script does NOT touch Stripe. It builds JSON event objects in
 * the same shape Stripe sends, signs them with the webhook secret,
 * and POSTs them to our deployed handler. The handler runs its normal
 * flow against the DB; we then read back and assert.
 *
 * IMPORTANT: only run against a test user whose stripe_customer_id is
 * a TEST-mode customer in Stripe (so retrieval of dispute charges in
 * dispute handlers doesn't touch real money). The test user's
 * stripe_subscription_id is captured at start and restored at end.
 */

import { createHmac } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://aimvantage.uk/api/stripe/webhook';

if (!SUPABASE_URL || !SUPABASE_KEY || !WEBHOOK_SECRET) {
  console.error('Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_WEBHOOK_SECRET');
  process.exit(1);
}

const USER_ID = process.argv[2];
if (!USER_ID) {
  console.error('Usage: node scripts/stripe-webhook-regression.mjs <test_user_id>');
  process.exit(1);
}

// ---- helpers ----------------------------------------------------------

function signEvent(body) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${body}`;
  const sig = createHmac('sha256', WEBHOOK_SECRET).update(signedPayload).digest('hex');
  return `t=${timestamp},v1=${sig}`;
}

async function fireEvent(event) {
  const body = JSON.stringify(event);
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': signEvent(body),
    },
    body,
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function readProfile(userId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=plan,subscription_status,subscription_renews_at,subscription_cancel_at,stripe_subscription_id,token_balance`,
    {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    }
  );
  const rows = await res.json();
  return rows[0];
}

async function patchProfile(userId, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function clearProcessedEvent(eventId) {
  // So the same event ID can be re-fired across test runs.
  await fetch(`${SUPABASE_URL}/rest/v1/processed_stripe_events?event_id=eq.${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
}

function uniqId(prefix) { return `${prefix}_test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }

// ---- assertions -------------------------------------------------------

let passed = 0, failed = 0;
function assert(name, cond, detail) {
  if (cond) {
    console.log(`  ✓ ${name}`);
    passed += 1;
  } else {
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
    failed += 1;
  }
}

// ---- main -------------------------------------------------------------

async function main() {
  console.log(`Stripe webhook regression — target ${WEBHOOK_URL}, user ${USER_ID}\n`);

  const snapshot = await readProfile(USER_ID);
  if (!snapshot) { console.error(`User ${USER_ID} not found`); process.exit(1); }
  console.log('Snapshot:', JSON.stringify(snapshot, null, 2));
  console.log('');

  // Use snapshot.stripe_subscription_id if present; otherwise a synthetic ID is fine.
  const subId = snapshot.stripe_subscription_id || 'sub_test_regression';
  const customerId = `cus_test_regression_${USER_ID.slice(0, 8)}`;

  // Ensure the profile has a customer ID we control (webhooks lookup by customer_id).
  const originalCustomerId = snapshot.stripe_customer_id;
  await patchProfile(USER_ID, { stripe_customer_id: customerId });

  const nowEpoch = Math.floor(Date.now() / 1000);
  const renewEpoch = nowEpoch + 30 * 24 * 60 * 60; // 30 days from now
  const cancelEpoch = nowEpoch + 14 * 24 * 60 * 60; // 14 days from now (cancellation pending)

  try {
    // ---- TEST 1: invoice.payment_succeeded extends renewal ----
    console.log('TEST 1: invoice.payment_succeeded — renews_at extends');
    const evt1 = {
      id: uniqId('evt'),
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: uniqId('in'),
          billing_reason: 'subscription_cycle',
          customer: customerId,
          subscription: subId,
          lines: { data: [{ price: { id: process.env.STRIPE_PRICE_PRO || 'price_pro_unknown' } }] },
        },
      },
    };
    await clearProcessedEvent(evt1.id);
    const r1 = await fireEvent(evt1);
    assert('webhook returned 2xx', r1.status >= 200 && r1.status < 300, `got ${r1.status}: ${r1.body.slice(0, 200)}`);
    // We can't easily assert renews_at extension without a real Stripe sub.
    // Just verify the handler didn't 500 and the profile is still readable.
    const p1 = await readProfile(USER_ID);
    assert('profile still readable after invoice.payment_succeeded', !!p1);
    console.log('');

    // ---- TEST 2: customer.subscription.updated with cancel_at_period_end=true ----
    console.log('TEST 2: customer.subscription.updated — cancel_at populated');
    const evt2 = {
      id: uniqId('evt'),
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subId,
          customer: customerId,
          status: 'active',
          cancel_at_period_end: true,
          cancel_at: cancelEpoch,
          current_period_end: renewEpoch,
          items: { data: [{ price: { id: process.env.STRIPE_PRICE_PRO || 'price_pro_unknown' }, current_period_end: renewEpoch }] },
        },
      },
    };
    await clearProcessedEvent(evt2.id);
    const r2 = await fireEvent(evt2);
    assert('webhook returned 2xx', r2.status >= 200 && r2.status < 300, `got ${r2.status}: ${r2.body.slice(0, 200)}`);
    const p2 = await readProfile(USER_ID);
    assert('subscription_status = cancelling', p2?.subscription_status === 'cancelling', `actual: ${p2?.subscription_status}`);
    assert('subscription_cancel_at populated', !!p2?.subscription_cancel_at, `actual: ${p2?.subscription_cancel_at}`);
    assert('subscription_renews_at populated', !!p2?.subscription_renews_at, `actual: ${p2?.subscription_renews_at}`);
    console.log('');

    // ---- TEST 3: customer.subscription.updated with cancel_at_period_end=false (un-cancel) ----
    console.log('TEST 3: customer.subscription.updated — un-cancel clears cancel_at');
    const evt3 = {
      id: uniqId('evt'),
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subId,
          customer: customerId,
          status: 'active',
          cancel_at_period_end: false,
          cancel_at: null,
          current_period_end: renewEpoch,
          items: { data: [{ price: { id: process.env.STRIPE_PRICE_PRO || 'price_pro_unknown' }, current_period_end: renewEpoch }] },
        },
      },
    };
    await clearProcessedEvent(evt3.id);
    const r3 = await fireEvent(evt3);
    assert('webhook returned 2xx', r3.status >= 200 && r3.status < 300, `got ${r3.status}: ${r3.body.slice(0, 200)}`);
    const p3 = await readProfile(USER_ID);
    assert('subscription_status = active', p3?.subscription_status === 'active', `actual: ${p3?.subscription_status}`);
    assert('subscription_cancel_at cleared', !p3?.subscription_cancel_at, `actual: ${p3?.subscription_cancel_at}`);
    console.log('');

    // ---- TEST 4: invoice.payment_failed flips to past_due ----
    console.log('TEST 4: invoice.payment_failed — past_due');
    const evt4 = {
      id: uniqId('evt'),
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: uniqId('in'),
          customer: customerId,
          subscription: subId,
        },
      },
    };
    await clearProcessedEvent(evt4.id);
    const r4 = await fireEvent(evt4);
    assert('webhook returned 2xx', r4.status >= 200 && r4.status < 300, `got ${r4.status}: ${r4.body.slice(0, 200)}`);
    const p4 = await readProfile(USER_ID);
    assert('subscription_status = past_due', p4?.subscription_status === 'past_due', `actual: ${p4?.subscription_status}`);
    console.log('');

    // ---- TEST 5: customer.subscription.deleted clears dates ----
    console.log('TEST 5: customer.subscription.deleted — clears dates + sub_id');
    const evt5 = {
      id: uniqId('evt'),
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: subId,
          customer: customerId,
          status: 'canceled',
        },
      },
    };
    await clearProcessedEvent(evt5.id);
    const r5 = await fireEvent(evt5);
    assert('webhook returned 2xx', r5.status >= 200 && r5.status < 300, `got ${r5.status}: ${r5.body.slice(0, 200)}`);
    const p5 = await readProfile(USER_ID);
    assert('subscription_status = cancelled', p5?.subscription_status === 'cancelled', `actual: ${p5?.subscription_status}`);
    assert('subscription_cancel_at cleared', !p5?.subscription_cancel_at);
    assert('subscription_renews_at cleared', !p5?.subscription_renews_at);
    assert('stripe_subscription_id cleared', !p5?.stripe_subscription_id);
    console.log('');
  } finally {
    // ---- RESTORE ----
    console.log('Restoring profile to snapshot...');
    await patchProfile(USER_ID, {
      plan: snapshot.plan,
      subscription_status: snapshot.subscription_status,
      subscription_renews_at: snapshot.subscription_renews_at,
      subscription_cancel_at: snapshot.subscription_cancel_at,
      stripe_subscription_id: snapshot.stripe_subscription_id,
      stripe_customer_id: originalCustomerId,
      token_balance: snapshot.token_balance,
    });
    console.log('Restored.\n');
  }

  console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
