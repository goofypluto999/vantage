# Vantage / AimVantage — Token Wallet Specification

**Status as of 2026-05-15:** ✅ **COMPLETE** — wallet rewrite shipped across schema, server, client, and webhooks. The remainder of this document is the original spec (kept for historical reference) followed by a verification ledger of what was actually built.

---

## Verification ledger (what was built)

### ✅ Database (`database/schema.sql`)
- Single `token_balance INTEGER NOT NULL DEFAULT 10 CHECK (token_balance >= 0)` column on `profiles`.
- Atomic RPCs: `deduct_tokens(p_user_id, p_amount)` raises on insufficient funds; `add_tokens(p_user_id, p_amount)` raises on amount > 1000. Both `SECURITY DEFINER`, `service_role` only.
- `REVOKE UPDATE` on token-affecting columns so the authenticated client cannot patch its own balance via Supabase REST.
- `handle_new_user()` trigger grants 10 tokens on signup.
- Legacy `credits_total` / `credits_used` columns are gone — schema has only `token_balance`.

### ✅ Server (`api/`)
- **`api/stripe/webhook.ts`** — `checkout.session.completed` handler is ADDITIVE for both branches:
  - Top-up (one-time payment, Starter): `addTokensAtomic(userId, PLAN_TOKENS['starter'])`.
  - Subscription (Pro/Premium): `addTokensAtomic(userId, tokensToAdd)`. Plan derived from Stripe price ID (`getPlanFromPriceId`) — never from user-controlled metadata.
- **Idempotency** via `processed_stripe_events` table + UNIQUE constraint + ON CONFLICT DO NOTHING. Stripe retries can never double-credit.
- **`api/stripe/[action].ts::handleCheckout`** does NOT cancel the old subscription before checkout. The race condition documented in the original spec is gone — old subscription cleanup happens inside the webhook only after the new subscription is durably recorded, with `current?.stripe_subscription_id === newSubscriptionId` short-circuit guarding against retries.
- **`api/analyze/index.ts`**, **`api/rewrite-tone/index.ts`**, **`api/interview/*.ts`** all use the `deduct_tokens` RPC. Refund path on Gemini failure returns a boolean — analyze + interview check `res.ok`; rewrite-tone is queued for the same hardening (Codex HIGH-03, still listed in punch list).

### ✅ Client (`src/`)
- **`src/lib/supabase.ts`** — `Profile.token_balance: number` is the single source of truth. `getCreditsRemaining(profile)` returns `Math.max(0, profile.token_balance)`. `hasCredits(profile, required)` checks `token_balance >= required`. (Functions kept their legacy names for stability — they wrap the new model.)
- **`src/components/Dashboard.tsx`** — token balance displayed prominently; per-action token costs shown next to buttons.
- **`src/components/Account.tsx`** — balance + plan + renewal date visible.

### ✅ Stripe products
- Starter (£5 / $5, 20 tokens, one-time).
- Pro (£12 / $15, 60 tokens/month).
- Premium (£20 / $25, 120 tokens/month).
- All products carry "AimVantage" branding post-rebrand. Per-currency price IDs in `STRIPE_PRICE_*_GBP` and `_USD` env vars.

### Stretch (not yet built — optional refinements)

- **Token transaction audit table** (Option B from the original spec): a `token_transactions(user_id, delta, source, ref_id, created_at)` table for full audit history. Today the wallet is balance-only; transaction history would be useful for refund disputes and analytics. Not blocking.
- **Helper rename** (`getCreditsRemaining` → `getTokenBalance`, `hasCredits` → `hasTokens`): cosmetic, ~10 call sites across 2 files. Functions read correctly today, naming is just historical.
- **Low-balance warning email** via the Resend pipeline shipped in commits 2fbc406 + 8af99e9. Easy follow-up.

---

# Original specification (historical)

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
| Full job analysis | 1 (was 3 — migrated 2026-05-08) |
| Cover letter tone rewrite | 1 |
| Interview question generation | 2 |
| Interview answer evaluation | 0 |

### Token Packages (current values)

| Package | Tokens | Price | Model |
|---------|--------|-------|-------|
| Starter | 20 | £5 / $5 | one-time top-up |
| Pro | 60 | £12 / $15 | monthly subscription |
| Premium | 120 | £20 / $25 | monthly subscription |

---

## Race Condition (resolved)

Original spec described a race where `checkout.ts` cancelled the old subscription, which fired `customer.subscription.deleted` and could zero out tokens. **This is fixed:** `api/stripe/[action].ts::handleCheckout` never cancels subscriptions. The webhook's `checkout.session.completed` handler does the cleanup at line ~261 only after the new subscription is recorded, and the idempotency guard `current?.stripe_subscription_id === newSubscriptionId` ensures retries can't undo it.

---

## Frontend display (current)

The Dashboard shows:
- Current token balance (prominent, always visible at top of `/dashboard`).
- "Top up at /pricing" CTA when balance is low.
- Token cost displayed next to each action button (e.g. "Generate (1 token)").

The Account page shows:
- Token balance.
- Plan tier + next renewal date + cancel-at date when applicable.
- Manage Subscription button (Stripe Billing Portal).
- Purchase history: still a stretch goal — needs the `token_transactions` table.
