# Pricing change proposal — 1 token = 1 analysis

**Date:** 2026-05-07
**Status:** PROPOSAL — needs Gio's explicit go/no-go before shipping
**Trigger:** Gio asked "should each run be 1 token, not 3? we offer more value, still good profit?"

---

## TL;DR (decision needed)

**Recommend YES — move from 3-tokens-per-run to 1-token-per-run.** Gross margin stays above 99% either way. Conversion psychology is dramatically better at 1 token. But this is irreversible-feeling and touches existing users' balances — requires Gio's explicit approval before shipping.

---

## Cost reality (Gemini 2.5 Flash)

Per analysis = 1 main `models/gemini-2.5-flash` call.

- Average input: ~10,000 tokens (CV + JD + system prompt)
- Average output: ~3,000 tokens (full prep pack JSON)
- Gemini Flash 2.5 pricing: $0.075 / 1M input, $0.30 / 1M output
- **Cost per analysis: ~$0.00165 = ~£0.0013**

Tone rewrite call (separate, costs 1 token currently): ~$0.0005 each.
Interview-questions call (Pro+ feature, currently 2 tokens): ~$0.0008 each.
Interview-evaluate call (free for Pro+): ~$0.0006 each.

---

## Margin math

### Current pricing: 3 tokens/analysis

| Tier | Price | Tokens | Analyses | API cost | Gross margin |
|------|-------|--------|----------|----------|---|
| Free trial | £0 | 10 | ~3.3 | £0.004 | -£0.004 (free trial loss) |
| Starter | £5 | 20 | ~6.7 | £0.009 | £4.99 (99.82%) |
| Pro | £12/mo | 60 | 20 | £0.026 | £11.97 (99.78%) |
| Premium | £20/mo | 120 | 40 | £0.052 | £19.95 (99.74%) |

### Proposed pricing: 1 token/analysis

| Tier | Price | Tokens | Analyses | API cost | Gross margin |
|------|-------|--------|----------|----------|---|
| Free trial | £0 | 10 | 10 | £0.013 | -£0.013 |
| Starter | £5 | 20 | 20 | £0.026 | £4.97 (99.48%) |
| Pro | £12/mo | 60 | 60 | £0.078 | £11.92 (99.35%) |
| Premium | £20/mo | 120 | 120 | £0.156 | £19.84 (99.22%) |

**Both pricing models are 99%+ gross margin. The cost reality is that Gemini Flash is so cheap that the LLM cost is rounding error.**

The only material cost is the Vercel function execution time (free tier covers it for now), Supabase database (free tier ~500MB), and Stripe fees (1.4% + 20p UK).

Stripe fee on £5 = ~27p. So actual £5 starter take-home = £4.73.
- At 6.7 analyses: net per-analysis revenue = £0.71
- At 20 analyses: net per-analysis revenue = £0.24

Both still wildly profitable.

---

## Conversion psychology argument (the real reason to do this)

**Current 3-tokens-per-run framing has friction:**

1. Free signup says "10 free tokens = 3 free analyses" — users have to do the maths.
2. "£5 for 20 tokens = 6 prep packs" reads as cheap-but-stingy.
3. "Pro: 60 tokens/month = 18 prep packs" — users translate twice.
4. Vs Jobscan's "unlimited scans for $49.95/mo" — Pro looks constrained.

**Proposed 1-token-per-run framing removes the maths:**

1. "10 free analyses on signup" — dead-simple, no translation.
2. "£5 for 20 prep packs" — direct, generous.
3. "Pro: 60 prep packs/month" — abundant, comparable to Jobscan but ~£37 cheaper.
4. Premium's "120 prep packs/month" reads as "anyone serious about a job hunt".

**The numbers TRIPLE in user perception.** Same product, same backend cost, but every marketing surface, every tweet, every share button, every screenshot looks 3x more generous.

This is the cheapest possible "lift" to perceived value. Zero engineering required to make it happen except the migration.

---

## What changes if we ship this

### Code changes (small)

- `api/analyze/index.ts`: change `COST = 3` → `COST = 1`
- `api/interview/questions.ts`: stays at 2 tokens (unless we want to lower to 1)
- `api/rewrite-tone/index.ts`: stays at 1 token
- All copy that says "3 tokens" / "uses 3 of your tokens" / etc. — needs find/replace

Estimated change: 30-50 string replacements across components.

### Database / user migration (the tricky part)

Existing users have token balances calibrated for 3-tokens-per-run:
- User A has 6 tokens: under old pricing = 2 analyses; under new = 6 analyses (3x more)
- User B has 10 free tokens: same — gets 10 analyses instead of 3

**Net effect on existing users: their balances become 3x more valuable. Nothing breaks. They just get more.**

This is fine — it's a net positive surprise. We don't need to "downgrade" anyone's balance to keep the same analysis count, because the new pricing IS the new pricing.

### Marketing copy (largest effort)

Surfaces that mention "3 tokens" or "X tokens = Y analyses":
- LandingPage hero, mid-page CTAs, pricing section, FAQ
- Pricing page (the standalone /pricing route)
- BlogPost CTAs ("3 free analyses · no card · 90 seconds per run" — stays correct since 10 free tokens × 1 = 10 analyses, but free trial is 3-on-signup right? need to check)
- Sample analysis page CTAs
- All admin reply-drafter and post-template content
- llms.txt and llms-full.txt
- Schema.org Offers (homepage + /pricing AggregateOffer)
- Blog posts that cite the pricing
- FAQ schema answers

Estimated change: ~80 string updates across the codebase.

---

## Free-tier consideration

Currently: 10 free tokens on signup = 3 free analyses (under 3-token pricing).

Under 1-token pricing: 10 free tokens = 10 free analyses. **Possibly too generous.**

Recommendation: drop signup tokens from 10 → 3 to keep the free-trial value identical at 3 analyses.

Marketing reads as "3 free analyses on signup, no card" either way — that copy doesn't change.

---

## Migration plan (if Gio approves)

**Phase 1 — Code changes (~30 min):**
1. `api/analyze/index.ts`: COST 3 → 1
2. `database/schema.sql` `init_token_balance` default: 10 → 3 (for new signups)
3. Find/replace "3 tokens" / "uses 3" / "= 3 analyses" → "1 token" / "uses 1" / appropriate
4. Update homepage Schema Offers + /pricing AggregateOffer descriptions

**Phase 2 — Marketing copy sweep (~60 min):**
1. LandingPage Pricing section
2. /pricing component
3. Dashboard upload form ("Run my prep pack — uses 1 token")
4. Dashboard post-analysis upgrade nudge
5. BlogPost CTAs
6. Sample CTAs
7. Interview-prep CTAs
8. Interview-questions CTAs
9. Refer page templates
10. llms.txt + llms-full.txt
11. Admin reply-drafter prompt + post-templates
12. FaqPage Q&A
13. JSON-LD FAQPage on /pricing
14. Email confirmation copy

**Phase 3 — Comm to existing users (Gio's task):**
- One-line tweet: "Pricing simplified: 1 token = 1 prep pack. Existing balances now go 3x further."
- Email to recent signups (3 of them) saying the same.

**Phase 4 — Verify (~15 min):**
- Live smoke test on /pricing, /, /faq, /dashboard
- Search Console re-fetch sitemap
- Stripe products: verify token-grant amounts in Stripe metadata still match

Total estimated effort: 2 hours of focused work.

---

## Risks / counter-arguments

### "We'll burn through more API spend"
- At 99%+ margin, no. Even 10x usage growth = pennies of API cost.

### "Heavy users won't upgrade to Pro"
- True risk. A user who runs 20 analyses on Starter might never need Pro.
- But: Pro has features Starter doesn't (AI Mock Interview voice mode, STAR stories). Users who actually want those features upgrade regardless of token count.
- And: 20 analyses/month at £0.25 each = same per-analysis revenue as Pro at 18 analyses.

### "Existing users will feel cheated retroactively"
- No — their balances become 3x more valuable. Net positive.
- Only risk is if anyone JUST paid £5 for 20 tokens at the old pricing. We have ~3 paid users; can manually credit any if there's complaint.

### "What if Gemini raises prices?"
- Even at 10x current Gemini pricing, gross margin would still be 95%+. Plenty of headroom.

### "We lose the upsell pressure of running out of tokens fast"
- The post-analysis "Top up £5" nudge fires when tokens drop below 10. At 1-token pricing, that fires after 10 analyses (not 3). Slower upsell, but at the SAME emotional peak.
- Pro/Premium subscriptions still attractive for monthly users.

---

## Decision matrix

| Factor | Keep 3 tokens | Move to 1 token |
|--------|---------------|---|
| Gross margin | 99.8% | 99.4% |
| Conversion at signup | Lower (3 analyses feels stingy) | Higher (10 analyses feels generous) |
| Marketing readability | Two-step translation | Direct |
| Pro tier perceived value | Lower (18 vs Jobscan unlimited) | Higher (60 vs Jobscan unlimited) |
| Migration risk | None | Low (only need code + copy update) |
| Reversal cost | n/a | Low (revert COST + copy in one PR) |

**Strong recommendation: ship 1-token pricing.** The conversion uplift is meaningfully larger than the marginal cost of more API calls.

---

## Unanswered questions for Gio

1. Free signup: keep at 10 tokens (= 10 free analyses) or drop to 3 to maintain 3-free-analyses parity?
2. Pro / Premium prices: keep at £12 / £20 or also adjust?
3. Tone rewrites: keep at 1 token (was 1 token = 1 rewrite, no change) or drop to 0 (free / unlimited)?
4. Interview questions cost: was 2 tokens, now what? (Suggest 1.)
5. Comms to existing 3 paid users about the change? Manual emails?

---

*Written by Claude. Awaiting Gio's go/no-go before any code changes.*
