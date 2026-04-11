# Vantage -- Token Wallet Specification

**Priority:** CRITICAL -- This is the primary task for the next agent.

---

## The Problem

The current credit system REPLACES `credits_total` with a fixed plan value on every upgrade. This means users lose their unspent credits when they change plans. The webhook, sync endpoint, and checkout flow all have this bug.

---

## The User's Exact Words

> "It should be simple. User has a wallet. It holds tokens. When they get starter they get 10 tokens. If they upgrade they get more tokens that add to their tokens. Doesn't matter how many upgrades they get, it just adds more tokens. And they get to spend tokens on tools etc. It should just work."

---

## Required Behavior

### Single Balance Model

Replace the current `credits_total` / `credits_used` pair with a single `token_balance` field:

```
token_balance = current available tokens (always >= 0)
```

- On signup: `token_balance = 10` (starter grant)
- On purchase/upgrade: `token_balance += purchased_amount` (ADDITIVE, never replace)
- On tool use: `token_balance -= cost` (only if balance >= cost)
- On cancellation: tokens remain -- user keeps what they paid for

### Rules

1. **Additive only.** Every purchase ADDS tokens to the existing balance. Never set it to a fixed value.
2. **No expiry.** Tokens don't expire. If a user has 47 tokens, they have 47 tokens forever.
3. **No plan-based caps.** The plan name (starter/pro/premium) is just a label for what they bought. The wallet doesn't care about plan names -- it only cares about the number.
4. **Deductive on use.** Each tool costs a fixed number of tokens. Deduct on successful completion, not on attempt.
5. **Never go negative.** Check balance before allowing any action. If insufficient, show a clear "buy more tokens" prompt.
6. **Multiple purchases stack.** User buys Starter (10 tokens), uses 3, buys Pro (30 tokens) -> balance = 7 + 30 = 37.

### Token Costs (unchanged)

| Action | Tokens |
|--------|--------|
| Full job analysis | 3 |
| Cover letter tone rewrite | 1 |
| Interview question generation | 2 |
| Interview answer evaluation | 0 |

### Token Packages (match current plans)

| Package | Tokens | Price |
|---------|--------|-------|
| Starter | 10 | ~$5 |
| Pro | 30 | ~$12 |
| Premium | 60 | ~$20 |

---

## Database Changes

### Option A: Simplest (recommended)

Replace `credits_total` + `credits_used` with a single `token_balance` column:

```sql
ALTER TABLE profiles DROP COLUMN credits_total;
ALTER TABLE profiles DROP COLUMN credits_used;
ALTER TABLE profiles ADD COLUMN token_balance INTEGER NOT NULL DEFAULT 10;
```

Update all code that references `credits_total`, `credits_used`, `getCreditsRemaining()`, or `hasCredits()`.

### Option B: Keep audit trail

Keep `credits_total` and `credits_used` but change the semantics:
- `credits_total` = lifetime tokens ever received (only goes up)
- `credits_used` = lifetime tokens ever spent (only goes up)
- Available = `credits_total - credits_used`
- On purchase: `credits_total += amount` (ADDITIVE)
- On spend: `credits_used += cost`

This preserves an audit trail but requires more careful logic.

---

## Files That Need Changes

### Must change:

| File | What to change |
|------|---------------|
| `api/stripe/webhook.ts` | Line 105: change `credits_total: PLAN_CREDITS[plan]` to ADD tokens to existing balance |
| `api/stripe/sync.ts` | Line 123: same fix -- add tokens, don't replace |
| `api/stripe/checkout.ts` | Lines 80-88: reconsider cancelling old subscription before new checkout (causes race condition with webhook) |
| `api/credits/index.ts` | Update to return `token_balance` (or recalculated remaining) |
| `src/lib/supabase.ts` | Update `Profile` interface, `getCreditsRemaining()`, `hasCredits()` |
| `src/components/Dashboard.tsx` | Update credit display and checks |
| `src/components/Account.tsx` | Update credit/balance display |
| `database/schema.sql` | Update schema to match new model |

### Must verify (credit deduction logic):

| File | What it does |
|------|-------------|
| `api/analyze/index.ts` | Deducts 3 credits after successful analysis |
| `api/rewrite-tone/index.ts` | Deducts 1 credit after successful rewrite |
| `api/interview/questions.ts` | Deducts 2 credits after generating questions |

---

## Race Condition to Fix

Current flow when user upgrades:

1. `checkout.ts` cancels old subscription (line 80-88)
2. This fires `customer.subscription.deleted` webhook
3. Webhook sets `credits_total = credits_used` (zeroing remaining balance)
4. Meanwhile, `checkout.session.completed` fires and sets new credits
5. **If step 3 arrives after step 4, the user's new credits get wiped**

The webhook has guards (`stripe_subscription_id` matching), but the timing is fragile.

**Fix:** Either:
- Don't cancel old subscription in checkout.ts (let the webhook handler or Stripe handle it)
- Or use a `subscription_transition_at` timestamp field to ignore deletion events that arrive within N seconds of a checkout completion
- Or switch to one-time payments instead of subscriptions (simpler if tokens don't expire)

---

## Frontend Display

The Dashboard should show:
- Current token balance (prominent, always visible)
- "Buy More Tokens" button
- Token cost shown next to each action button (already shows "(3 credits)" on Generate button)

The Account page should show:
- Token balance
- Purchase history (stretch goal -- needs a `token_transactions` table)
