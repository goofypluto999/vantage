#!/usr/bin/env node
/**
 * Offline unit test for extractSubscriptionDates.
 *
 * Pure function — no network, no DB, no Stripe. Runs in <1s on Node.js.
 * Feeds the extractor 11 different Stripe subscription shapes that the
 * webhook is likely to encounter in production, and asserts the date
 * extraction is correct for each.
 *
 * This proves the core logic without touching the live app, Stripe, or
 * the user's wallet. If this passes, the only remaining failure modes
 * are (a) the env-var price IDs mismatching, or (b) Supabase RLS
 * blocking the PATCH — both diagnosable from server logs without
 * spending real money.
 */

// Inlined copy of the extractor from api/stripe/webhook.ts so this
// test runs without a TS compile step. KEEP IN SYNC.
function extractSubscriptionDates(sub) {
  if (!sub || typeof sub !== 'object') return { renewsAt: null, cancelAt: null };
  let renewsEpoch = null;
  if (typeof sub.current_period_end === 'number' && sub.current_period_end > 0) {
    renewsEpoch = sub.current_period_end;
  } else if (sub.items?.data?.[0]?.current_period_end && typeof sub.items.data[0].current_period_end === 'number') {
    renewsEpoch = sub.items.data[0].current_period_end;
  }
  let cancelEpoch = null;
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

let passed = 0, failed = 0;
function assert(name, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  if (ok) {
    console.log(`  ✓ ${name}`);
    passed += 1;
  } else {
    console.log(`  ✗ ${name}`);
    console.log(`    expected: ${JSON.stringify(expected)}`);
    console.log(`    actual:   ${JSON.stringify(actual)}`);
    failed += 1;
  }
}

const RENEW = 1746000000; // 2025-04-30T08:00:00Z
const CANCEL = 1744000000; // 2025-04-07T04:26:40Z
const RENEW_ISO = new Date(RENEW * 1000).toISOString();
const CANCEL_ISO = new Date(CANCEL * 1000).toISOString();

console.log('Offline unit test: extractSubscriptionDates\n');

// ── CASE 1: Modern API, active subscription ───────────────────────────
console.log('CASE 1: Modern API (current_period_end on items, not top-level), active');
assert(
  'extracts renewsAt from items.data[0]',
  { renewsAt: RENEW_ISO, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    cancel_at_period_end: false,
    cancel_at: null,
    // current_period_end is OMITTED at top-level (modern API behavior)
    items: { data: [{ current_period_end: RENEW }] },
  })
);

// ── CASE 2: Legacy API, active ────────────────────────────────────────
console.log('\nCASE 2: Legacy API (current_period_end at top-level), active');
assert(
  'extracts renewsAt from top-level',
  { renewsAt: RENEW_ISO, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    cancel_at_period_end: false,
    cancel_at: null,
    current_period_end: RENEW,
  })
);

// ── CASE 3: Modern API, user cancelled ────────────────────────────────
console.log('\nCASE 3: Modern API, user cancelled (cancel_at populated)');
assert(
  'extracts both renewsAt + cancelAt',
  { renewsAt: RENEW_ISO, cancelAt: CANCEL_ISO },
  extractSubscriptionDates({
    status: 'active',
    cancel_at_period_end: true,
    cancel_at: CANCEL,
    items: { data: [{ current_period_end: RENEW }] },
  })
);

// ── CASE 4: Legacy API, user cancelled (cancel_at_period_end only) ────
console.log('\nCASE 4: Legacy API, user cancelled (only the boolean, no cancel_at)');
assert(
  'falls back to current_period_end for cancelAt',
  { renewsAt: RENEW_ISO, cancelAt: RENEW_ISO },
  extractSubscriptionDates({
    status: 'active',
    cancel_at_period_end: true,
    cancel_at: null,
    current_period_end: RENEW,
  })
);

// ── CASE 5: User un-cancelled (was cancelling, now active) ────────────
console.log('\nCASE 5: User un-cancelled');
assert(
  'cancelAt null, renewsAt still set',
  { renewsAt: RENEW_ISO, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    cancel_at_period_end: false,
    cancel_at: null,
    items: { data: [{ current_period_end: RENEW }] },
  })
);

// ── CASE 6: Edge — null subscription ──────────────────────────────────
console.log('\nCASE 6: Null/undefined subscription');
assert('null input returns nulls', { renewsAt: null, cancelAt: null }, extractSubscriptionDates(null));
assert('undefined input returns nulls', { renewsAt: null, cancelAt: null }, extractSubscriptionDates(undefined));
assert('non-object returns nulls', { renewsAt: null, cancelAt: null }, extractSubscriptionDates('not-an-object'));

// ── CASE 7: Edge — empty items array ──────────────────────────────────
console.log('\nCASE 7: Empty items array, no top-level period_end');
assert(
  'returns nulls when no period info anywhere',
  { renewsAt: null, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    items: { data: [] },
  })
);

// ── CASE 8: Edge — zero current_period_end (should treat as missing) ──
console.log('\nCASE 8: current_period_end = 0 (treat as missing)');
assert(
  'zero is rejected as a valid epoch',
  { renewsAt: null, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    current_period_end: 0,
  })
);

// ── CASE 9: Both top-level AND items set (legacy + modern overlap) ────
console.log('\nCASE 9: Both locations set — top-level wins (legacy preferred for back-compat)');
const RENEW2 = 1750000000;
assert(
  'top-level current_period_end takes precedence',
  { renewsAt: RENEW_ISO, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    current_period_end: RENEW, // older value at top-level
    items: { data: [{ current_period_end: RENEW2 }] }, // newer value on item
  })
);

// ── CASE 10: cancel_at set but no cancel_at_period_end ────────────────
console.log('\nCASE 10: cancel_at set without the boolean (admin-scheduled cancellation)');
assert(
  'cancel_at honoured even without the boolean',
  { renewsAt: RENEW_ISO, cancelAt: CANCEL_ISO },
  extractSubscriptionDates({
    status: 'active',
    cancel_at_period_end: false,
    cancel_at: CANCEL,
    current_period_end: RENEW,
  })
);

// ── CASE 11: past_due subscription ─────────────────────────────────────
console.log('\nCASE 11: past_due (payment failed) — dates still valid');
assert(
  'renewal date preserved during past_due',
  { renewsAt: RENEW_ISO, cancelAt: null },
  extractSubscriptionDates({
    status: 'past_due',
    cancel_at_period_end: false,
    cancel_at: null,
    current_period_end: RENEW,
  })
);

// ── CASE 12: malformed types ──────────────────────────────────────────
console.log('\nCASE 12: Malformed types (strings instead of numbers)');
assert(
  'string current_period_end is rejected',
  { renewsAt: null, cancelAt: null },
  extractSubscriptionDates({
    status: 'active',
    current_period_end: '1746000000', // STRING not number
  })
);

console.log(`\nResult: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
