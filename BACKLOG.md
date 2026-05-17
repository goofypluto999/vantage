# AimVantage — Backlog

> Living document. Move items to "Done" when shipped (in git history). Anything not here is either already shipped, explicitly out-of-scope, or hasn't been thought of yet.

Last reviewed: 2026-05-16

---

## 👤 ON THE OPERATOR (you, manually — can't be automated)

| # | Item | Effort | Notes |
|---|---|---|---|
| U1 | **Stripe restricted key swap** (`sk_live_*` → `rak_live_*`) | 15 min | Hygiene. Scopes: Products+Prices Read, Customers R+W, Checkout Sessions R+W, Billing Portal W, Subscriptions R+W, Charges R, Invoices R. Test one checkout end-to-end before deleting old key. |
| U2 | **UptimeRobot 3 monitors** | 5 min | Free tier 50 monitors. Keyword monitor type. Targets: `https://aimvantage.uk/` (keyword `AimVantage`), `/api/health` (keyword `"status":"ok"`), `/api/health-deep` (same). |
| U3 | **Vercel Sensitive sweep on Foresay-v2** | 5 min | Same recipe as AimVantage. Edit each `_KEY`/`_SECRET`/`_TOKEN`, uncheck Development, toggle Sensitive, save. |
| U4 | **Vercel Sensitive sweep on Wadda Play** | 5 min | Same recipe. |
| U5 | **Delete dead `VITE_STRIPE_PUBLISHABLE_KEY`** from AimVantage Vercel env | 1 min | Unused — app uses server-redirect checkout, not Stripe.js. |
| U6 | **Product Hunt manual save** | 2 min | producthunt.com/products/vantage-3/edit — name + URL + description (instructions in `docs/directory-rebrand-emails.md` §4). |
| U7 | **YouTube channel rename** | 5 min | Channel `UCuZxrV6LaJfGHsEvztsaB4Q` lives on a different Google account. About, banner, handle (handle rate-limited 14d). |
| U8 | **Send 3 directory rebrand emails** | 5 min total | Drafts in `docs/directory-rebrand-emails.md`. TheresAnAIForThat, SubmitAITools, AiToolzDir. |
| U9 | **Add `VITE_ADMIN_EMAILS=adlixir.uk@gmail.com`** to Vercel | 1 min | Currently unset — operator-only TEST-mode banner gate is muted in prod via `VITE_STRIPE_MODE=live` anyway, but adding this re-enables the gate for any future operator-only UI. |

---

## 🚨 KNOWN-BROKEN — must fix before any real customer load

| # | Item | Severity | Reason |
|---|---|---|---|
| K1 | **Cross-file helpers (Sentry, Resend, audit) inline-stubbed in 5 handlers as of dc5375e** | 🟡 zero-observability + zero-emails, NOT user-blocking | 5 attempts to bundle `lib/`, `api/_lib/`, `api/shared/`, `includeFiles` all crashed prod with `ERR_MODULE_NOT_FOUND`. Stubs let the tool actually serve requests. Real fix needs a different strategy (inline real helpers per-function / workspace dep / single dispatcher function). Spawned chip on screen. **Tomorrow priority.** |

When fixing K1, smoke test MUST be 10/10 (run `npm run smoke`) AND Sentry must capture a deliberately-triggered prod error to confirm.

## 🤖 CODE-SIDE DEFERRED (real but not urgent — defer pile)

| # | Item | Why deferred | When to revisit |
|---|---|---|---|
| D1 | **2FA / TOTP** + recovery codes | Job-prep consumer users don't expect it; adds support burden. Supabase Auth supports it. | First B2B customer asks. |
| D2 | **Admin/CRM dashboard UI** | `api/admin/[action].ts` endpoint exists; no UI surface. | When manual Stripe + Supabase queries become annoying. |
| D3 | **Day-1 / Day-3 onboarding email sequence** | Needs Vercel cron + idempotency table to dedupe per-user delays. Day-0 already via Supabase Auth confirmation. | When activation rate becomes the bottleneck. |
| D4 | **CSP `unsafe-inline` removal** (Codex MED-01) | Would need nonce/hash for inline JSON-LD; SEO-critical surface. Risky. | Focused session. |
| D5 | **Backend test suite** | None exists; large scope. Vitest/Playwright. | Before any contractor touches the code. |
| D6 | **Push Lighthouse Mobile 79 → 90+** | Diminishing returns. 79 clears CWV "needs improvement". Remaining levers: forced reflow, network dep tree, main-thread work 2.2s, 3rd-party render-blocking. | When paid-acquisition data shows mobile conversion loss. |
| D7 | **Token transactions audit table** | Wallet is balance-only today. `audit_log` partially covers it. | First refund dispute that needs delta history. |
| D8 | **Subscribe to `invoice.payment_failed` webhook** + "card declined" email | Resend pipeline ready. ~30 min wire-up. | Anytime; would catch dunning failures before churn. |
| D9 | **`rewrite-tone` + `interview` low-balance email instrumentation** | Only `analyze` is instrumented today. Trivially extensible — same crossing pattern, ~10 LOC each. | Anytime. |
| D10 | **OAuth `sign_up` double-count edge case** | Confirmation-click after email signup could fire `sign_up` twice in narrow window. Low impact. | Anytime. |
| D11 | **GDPR right-to-erasure scrubbing** for audit_log | When a user requests deletion, actor_email + ip_address persist in audit rows as plain text. Needs a sweep helper. | First erasure request, or before B2B contract. |

---

## 🔭 STRATEGIC / GROWTH (not code — needs budget or time)

| # | Item | Estimated effort | Budget needed |
|---|---|---|---|
| S1 | Paid acquisition test on 4 high-intent UK keywords | £200–500 | Yes (you said no for now) |
| S2 | Push to £1.5K MRR over 3 months | Months of operating | n/a — outcome metric |
| S3 | List on Acquire.com / Tiny Acquisitions at the £1.5K MRR milestone | Listing fee + time | Small fee |
| S4 | Real testimonials on landing page | Time to collect | n/a — gated on having paying users |
| S5 | UK IPO trademark for "AimVantage" | £170 + admin | Yes (you said no for now) |

---

## 🧪 OPERATIONAL LOOSE ENDS

| # | Item | Status |
|---|---|---|
| O1 | Look at GA4 dashboard after ~7 days of traffic to see actual funnel rates | Pending traffic accumulation |
| O2 | Sentry "0 issues" confirms live; first real prod error will land in dashboard | Pending an error |
| O3 | Bing Webmaster Tools setup (mirrors GSC for Bing/Copilot/DuckDuckGo) | Status unknown — may not be done |
| O4 | IndexNow re-ping on next major content drop | Trigger-driven |
| O5 | Mobile re-measurement after another perf push (when D6 happens) | Tied to D6 |

---

## ✅ DONE (reference — already shipped, do NOT repeat)

| Area | Source-of-truth |
|---|---|
| Rebrand Vantage → AimVantage | `SESSION-2026-05-15-COMPLETE.md` (21 commits) |
| Token wallet (additive, atomic RPC, REVOKE on sensitive cols) | `WALLET-SPEC.md` status COMPLETE |
| GA4 funnel: page_view, sign_up (email + OAuth), prep_pack_run, prep_pack_failed, purchase (with `value`), plan_upgrade, subscription_canceled | `SESSION-2026-05-15-PART-2.md` |
| Transactional emails: purchase confirmation, low-balance, refund | Commits `8af99e9`, `18333a6`, `233ef24` |
| Stripe LIVE mode + Sensitive env sweep | Commit `5c04f07` + Vercel state |
| Audit log table + helper + first call sites (purchase + refund) | Commit `5f0116d` + migration applied |
| Sentry server-side live (5 handlers) | Commits `3a8c514` + `5eb2886`, project `foresay-labs/aimvantage-server` |
| `/api/health` + `/api/health-deep` multi-probe | Commit `6fc8bc2`, verified live |
| CI build gate (tsc --noEmit chained to vite build) | Commit `e69808d` |
| Mobile perf: Lighthouse 62 → 79, LCP 5.8s → 3.0s | Commits `7159176` `8e3e432` `c2efe49` `3eae14c` |
| Schema fold (LOW-01) | Commit `98d2e60` |
| Operator-only Stripe test-mode banner | Commit `963d7be` |
| charge.refunded webhook proportional deduct + buyer email | Commit `233ef24` + helper |
| Knowledge base sync | `CLAUDE.md` + `PROJECT-INDEX.md` + `SESSION-2026-05-15-PART-2.md` (current as of `9c790ae`) |

---

## 📚 READING ORDER FOR NEXT AGENT

1. `CLAUDE.md` — project rules + current tech stack
2. `BACKLOG.md` ← **this file** — what's left to do
3. `SESSION-2026-05-15-PART-2.md` — latest session ledger
4. `SESSION-2026-05-15-COMPLETE.md` — rebrand context
5. `PROJECT-INDEX.md` — comprehensive 22-section inventory
6. `git log --oneline -30` — recent commits as source of truth
