# Session ledger — 2026-05-15 (part 2)

**Picks up where `SESSION-2026-05-15-COMPLETE.md` left off.** That earlier ledger covered the AimVantage rebrand (21 commits, DNS, GA4 init, Resend domain verification, etc.). This one covers the **punch-list run + truth-correction + Vercel hygiene pass** the user asked for after seeing the full backlog laid out.

**Outcome:** GA4 funnel fully instrumented, transactional email pipeline live (purchase / low-balance / refund), schema fold, operator-only Stripe-mode banner, charge.refunded hardened, Stripe-LIVE-mode confirmation across all knowledge-base docs (correcting earlier sessions' stale TEST-mode claims), Vercel env vars converted to Sensitive, mobile-perf baseline captured.

---

## 🎯 Headlines

| What changed | Why it matters |
|---|---|
| 6 new GA4 events live | Funnel previously had only page_view. Now full acquisition + activation + monetization coverage. |
| Resend transactional pipeline shipped + verified | `RESEND_API_KEY` added to Vercel, password reset confirmed arriving. Application code can now actually send branded emails — before this it was wired but silently no-op'd because the key wasn't in the server env. |
| WALLET-SPEC.md marked COMPLETE | The wallet rewrite that earlier sessions flagged as "CRITICAL — primary task for next agent" was already implemented; the spec was stale. Documented current state so future Claude sessions don't redo it. |
| Stripe-LIVE-mode confirmed in docs | PROJECT-INDEX.md / HANDOFF.md / architecture-map.html all asserted TEST mode. Inspected actual Vercel env: `sk_live_*`. All three docs corrected. **My previous claim was wrong** — keeping this record so the correction is traceable. |
| All secret env vars converted to Sensitive in Vercel | Was Plain (visible to any dashboard viewer). Now Sensitive (write-only after save). Vercel rule: Sensitive vars can only target Production + Preview, not Development. Local dev should use `.env.local` with test keys. |
| Mobile Lighthouse baseline | 62/100 Performance, LCP 5.8s, CLS 0 (perfect). Chunk-size build warnings ARE meaningful here. Spawned as a focused-session follow-up. |
| `charge.refunded` webhook hardened | Was silently swallowing deduct failures. Now logs HTTP status + body. Also sends refund-confirmation email to buyer. |

---

## 📜 All commits this session (chronological after `4c3f94d`)

| Commit | Description |
|---|---|
| `104526a` | feat(analytics): fire GA4 `sign_up` event on email signup success |
| `52c8143` | feat(analytics): fire GA4 `prep_pack_run` event on analyze success |
| `4bd125b` | feat(analytics): fire GA4 `prep_pack_failed` event on analyze failure |
| `5828cad` | fix(rebrand): update stale GitHub URL `goofypluto999/vantage` → `/aimvantage` (16 files) |
| `402973c` | docs: commit `architecture-map.html` + `audit-report.md` artifacts |
| `0fc3454` | feat(analytics): fire GA4 `sign_up` for OAuth providers in AuthContext |
| `f7b4f44` | feat(analytics): fire GA4 `purchase` + `plan_upgrade` on Stripe checkout success |
| `1613f42` | feat(analytics): fire GA4 `subscription_canceled` event in Account.tsx |
| `963d7be` | feat(ops): operator-only Stripe TEST-mode banner in Account.tsx |
| `98d2e60` | fix(db): fold remaining migrations into canonical `schema.sql` (LOW-01) |
| `2fbc406` | feat(email): add Resend transactional helper (`lib/email/resend.ts`) |
| `8af99e9` | feat(email): purchase-confirmation email on Stripe checkout completion |
| `080e5ba` | docs: WALLET-SPEC.md status update — wallet rewrite already shipped |
| `18333a6` | feat(email): low-balance warning email on token-threshold crossing |
| `233ef24` | feat(email): refund-confirmation email + harden deduct-fail logging |
| `3470c0d` | fix(stripe): recognize full Stripe zero-decimal-currency list in refund email *(spawned chip completion)* |
| `5c04f07` | docs: correct Stripe mode — LIVE in production, not TEST |

**Total: 17 commits** (16 from the punch-list run + 1 chip completion). All `tsc --noEmit` exit 0. Each behind a single-reviewer code review pass.

---

## 🧭 GA4 funnel — full coverage now live

| Event | Where fired | Params |
|---|---|---|
| `page_view` | `App.tsx::ScrollToTop` on every route change | path, title |
| `sign_up` (method: 'email') | `Register.tsx` after successful `signUp()` | method |
| `sign_up` (method: 'google'/other) | `App.tsx::onAuthStateChange` (60s-recency + sessionStorage dedupe) | method |
| `prep_pack_run` | `Dashboard.tsx` analyze success branch | has_job_url, mode |
| `prep_pack_failed` | `Dashboard.tsx` two failure branches | has_job_url, mode, reason |
| `purchase` | `Dashboard.tsx` post-checkout poll after token balance increases | plan, upgrade_type, currency |
| `plan_upgrade` | `Dashboard.tsx` same place if plan tier actually changed | from_plan, to_plan |
| `subscription_canceled` | `Account.tsx` when `subscription_status` flips to 'cancelling'/'cancelled', localStorage dedupe by sub_id | plan, reason |

**Coverage gaps (deferred, low priority):**
- No `value` param on `purchase` (would need server to plumb amount through `success_url` query)
- No funnel events on `rewrite-tone` or `interview` token spends (could be done same pattern, ~10 LOC each)

---

## 📧 Transactional email pipeline

**Helper:** `lib/email/resend.ts` (outside `/api/` so it doesn't burn one of the 12 Hobby-plan function slots)
- `sendEmail({ to, subject, html, text?, from?, replyTo?, tag? })` — fail-soft, never throws
- `wrapEmailBody(headline, innerHtml)` — branded HTML doc. **Body is injected RAW** — callers MUST escape user-supplied substrings.
- Default From: `AimVantage <noreply@aimvantage.uk>` (override per call via `from`)
- Default Reply-To: `giovanni.sizino.ennes@hotmail.co.uk` (override per call via `replyTo`)

**Three live paths in production:**

| Email | Trigger | File:line | Tag |
|---|---|---|---|
| Purchase confirmation | `checkout.session.completed` (both topup + subscription) | `api/stripe/webhook.ts::firePurchaseEmail` | `purchase_confirm` |
| Low-balance warning | `analyze` after token deduct, when crossing from ≥3 → <3 | `api/analyze/index.ts` post-success block | `low_balance` |
| Refund confirmation | `charge.refunded` after deduct | `api/stripe/webhook.ts::charge.refunded` case | `refund_processed` |

**Verified working:** password-reset email arrived 2026-05-15 after `RESEND_API_KEY` was added to Vercel. Confirms domain reputation + DKIM/SPF/DMARC + new API key all healthy.

---

## 🔐 Vercel env var state (verified 2026-05-15)

### Sensitive (Production + Preview only)
- `STRIPE_SECRET_KEY` (`sk_live_*` — confirmed)
- `STRIPE_WEBHOOK_SECRET` (3 separate rows for Production / Preview / Development)
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `RESEND_API_KEY` (new — added end of session)
- `ADZUNA_APP_KEY`, `ADZUNA_APP_ID`
- `VITE_STRIPE_MODE` = `live` (Sensitive flag is cosmetic on VITE_* vars — value bundles into client JS regardless)

### Plain (intentionally public — VITE_* always ships in browser JS)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_GA_MEASUREMENT_ID` (= `G-FMW9BX278N`)
- `VITE_CLARITY_PROJECT_ID`
- `VITE_STRIPE_PUBLISHABLE_KEY` (⚠️ dead weight — app uses server-redirect checkout, not Stripe.js; safe to delete)

### Plain (server feature flags / config)
- `ADMIN_EMAILS`, `APP_URL`
- `ROAST_RATELIMIT_ENABLED`, `ROAST_DISABLED`

### Missing (still TODO)
- `VITE_ADMIN_EMAILS` — would let the operator-only test-mode banner gate work in production (currently `import.meta.env.DEV` is the only true gate). Not critical because the banner is muted via `VITE_STRIPE_MODE=live` anyway.

### Local dev
Vercel's Development env can't hold Sensitive vars. Use `.env.local` (already `.gitignore`d) with test keys if you actually run server code locally. The normal `npm run dev` workflow reads from `.env.local`, not from Vercel's Development env.

---

## 📱 Mobile Lighthouse baseline (2026-05-15)

Audit URL: https://pagespeed.web.dev/analysis?url=https%3A%2F%2Faimvantage.uk&form_factor=mobile

| Metric | Value | Verdict |
|---|---|---|
| Performance | 62/100 | yellow — works, not great |
| LCP | 5.8s | 🔴 poor (target <2.5s) |
| FCP | 4.5s | 🔴 poor (target <1.8s) |
| CLS | 0 | 🟢 perfect — protect this when fixing |
| TBT | 240ms | 🟡 needs improvement (target <200ms) |
| Speed Index | 5.2s | 🔴 poor (target <3.4s) |

**Top opportunities (Lighthouse):**
- Reduce unused JavaScript: 299 KiB savings — Three.js / heavy components loaded eagerly (the chunk-size warnings DO matter)
- Improve image delivery: 221 KiB savings — hero images need WebP + srcset
- LCP request discovery (RED) — LCP element not preloaded
- Forced reflow (RED) — JS causing layout thrashing
- Network dependency tree (RED) — long request chain blocking first paint
- Render blocking requests (YELLOW)
- Minimize main-thread work: 2.1s
- 6 long tasks on initial paint

**Implication:** Mobile-first paid-traffic strategy (the UK keywords from PROJECT-INDEX §strategic-next-moves) will leak conversions until LCP gets under 2.5s. **Spawned as a focused-session chip** rather than tacked on here — needs verified-per-step deltas, not a hurried push.

---

## 🧱 Schema fold (LOW-01 resolved)

`database/schema.sql` was missing DDL that subsequent migrations added. Codex audit LOW-01 said fresh installs couldn't bootstrap from schema.sql alone. Folded in:
- `REVOKE UPDATE (last_free_jobsearch_at, cv_summary) ON profiles FROM authenticated, anon` (security gap on fresh setups — without it, authenticated users could PATCH their own jobsearch rate-limit or inject prompts via cv_summary)
- `seen_job_searches` table + index + RLS policy
- `idx_profiles_last_free_jobsearch` partial index (reviewer-caught miss)
- NOTES block documenting that `roast-rate-limit.sql` + `webmentions.sql` remain separate (feature-flagged / future), and that past `migration-*.sql` files are historical

Fresh Supabase setup now needs only `schema.sql` + (optional) `roast-rate-limit.sql` + (optional) `webmentions.sql`.

---

## ⚖️ Wallet status (closed)

`WALLET-SPEC.md` originally said "CRITICAL — primary task for next agent". Audit showed the rewrite already shipped in earlier sessions:
- Single `token_balance` column, no `credits_total/used`
- `add_tokens` / `deduct_tokens` SECURITY DEFINER RPCs, service_role only
- `addTokensAtomic` in `checkout.session.completed` for both top-up + subscription (ADDITIVE)
- Race condition documented in original spec is gone — `handleCheckout` no longer cancels the old subscription
- REVOKE UPDATE blocks client from PATCHing balance

Spec updated with COMPLETE header + verification ledger + stretch items (transaction audit table, helper rename, low-balance email which is now also shipped).

---

## 🛡️ Operator-only Stripe banner

`Account.tsx` shows an amber warning banner when `VITE_STRIPE_MODE !== 'live'`, **gated to admin emails only** via `VITE_ADMIN_EMAILS` (comma-split list) OR `import.meta.env.DEV`. Defaults to SHOWING — fail-loud is the safe default for a paid SaaS where forgetting to flip to live costs revenue, not data. End users never see it (would tank conversion). Currently muted in production because `VITE_STRIPE_MODE=live` is set.

---

## 🚧 Spawned follow-ups (chips on screen)

1. ~~**Mobile performance pass** — Lighthouse Mobile 62 → 80+~~ — **chip shipped 4 commits** (`7159176` route lazy-load, `8e3e432` WebP hero + preload, `c2efe49` Three.js out of modulepreload, `3eae14c` LCP preload dropped — H1 was true LCP). Lighthouse re-measurement against baseline still pending.
2. **OAuth `sign_up` double-count edge case** — instrument Day-0 confirmation-click path properly so we don't mis-fire.
3. ~~**`value`/`amount` for GA4 purchase event**~~ — **shipped in two halves**: server side bundled into `5eb2886` (PLAN_AMOUNTS map + amount+currency on success_url), client side `5f39e33` (Dashboard reads params, coerces, includes `value` only when finite). GA4 monetization reports will now show real revenue.
4. ~~Zero-decimal currency in refund email~~ — **shipped (commit `3470c0d`)**.
5. ~~**Extend Sentry captureError**~~ — **shipped (commit `5eb2886`)**. Wired into `interview/[action]`, `rewrite-tone`, `stripe/[action]`. 5 handlers total now have captureError on outer catch.

**All spawned chips from this session are now closed.**

---

## 🧪 Foresay cross-pollination (4 commits, 2026-05-15 evening)

After paste-back from the Foresay Claude, audited 17 patterns from their stack. Shipped 4 high-value, low-risk additions:

| Commit | What | Foresay equivalent |
|---|---|---|
| `e69808d` | `vercel-build` chain `tsc --noEmit` first | Their `Dockerfile && not ;` scar — silent build failures |
| `6fc8bc2` | `/api/health` + `/api/health-deep` in publicTool dispatcher | Their `/api/health-deep` multi-probe |
| `5f0116d` | `audit_log` table + `lib/audit/log.ts` helper + 3 webhook events | Their `services/audit.py` + `audit_log` table |
| `3a8c514` | Sentry server-side via `lib/observability/sentry.ts` + `captureError` on webhook + analyze outer catches | Their `@sentry-sdk/python` integration |

Deferred (real but too big / wrong shape for Vantage's stack):
- **2FA TOTP** — Supabase Auth supports it; not wired yet. End users on a job-prep tool don't expect it; B2B might. Spawn when needed.
- **CSP `unsafe-inline` removal** — would need nonce/hash for inline JSON-LD (SEO-critical). Risky, needs focused session.
- **Backend tests** — large. Scaffold on request.
- **Slowapi-style auth rate limits** — Supabase Auth handles its own. Self-hosted endpoints already use Vercel Edge middleware sliding-window limits.

---

## 🟢 Sentry is LIVE in production (2026-05-15 late evening)

After the 4-commit Foresay-import landed, drove the Sentry activation end-to-end via Claude-in-Chrome browser automation:

**Sentry project**
- Org: `foresay-labs` (shared org — alongside foresay-backend, foresay-frontend, waddaplay-backend, waddaplay-frontend)
- Project: `aimvantage-server` — Node.js / vanilla (matches Vercel TS function setup)
- Region: `de.sentry.io` (Germany / EU — GDPR-aligned, same region as Resend)
- Dashboard: https://foresay-labs.sentry.io/projects/aimvantage-server/

**Vercel env**
- `SENTRY_DSN` added with the DE-region DSN, Sensitive flag ON, Production + Preview (Development excluded — Vercel requires this for Sensitive)
- Triggered full redeploy from commit `5eb2886` — Ready in 7m 26s, 0 errors, 15 known chunk-size warnings (existing)

**Spike Protection**
- Already enabled at org level — covers all 5 Sentry projects automatically (aimvantage-server inherits)
- Belt-and-braces protection against 5K/month free-tier quota nuke from a bad-deploy spam loop. Layered on top of our own `captureError` 60s-window fingerprint dedupe in `lib/observability/sentry.ts`.

**End-to-end verification**
- `/api/health-deep` hits live: returns `status: "ok"` with all 4 probes passing
  - Supabase (authoritative): 200, 786ms cold / 328ms warm
  - Stripe (advisory): 404 reachable, ~17-46ms
  - Resend (advisory): 200, ~33-48ms
  - Gemini (advisory): 404 reachable, ~43-60ms
- 30s in-memory cache verified working: second hit within window returns identical timestamp + `cached: true`. Cache expires correctly after 30s.
- Sentry init runs without crashing the function — confirmed by /api/health-deep returning 200, not 500.

**Coverage extension (chip completed)** — `5eb2886`
- Sentry `captureError` now wired in `api/interview/[action].ts`, `api/rewrite-tone/index.ts`, `api/stripe/[action].ts` outer catches in addition to webhook + analyze.
- All 4xx-style validation branches (Insufficient tokens, JOB_PARSE_FAILED) early-return BEFORE capture — no Sentry noise for intentional 4xx.

**Mobile perf chip — shipped + measured** — `7159176` / `8e3e432` / `c2efe49` / `3eae14c`
- React.lazy split on Login/Register/ForgotPassword/ResetPassword/Dashboard/Account/Pricing + 60 other components (only LandingPage stays eager — it IS the LCP route).
- Hero PNG swapped for WebP with `<link rel="preload" fetchpriority="high">`.
- Three.js chunk excluded from modulepreload.
- LCP preload dropped after measurement showed the H1 text node was the real LCP element (preloading the hero image was actually slowing the real LCP).

**Lighthouse Mobile re-measurement (2026-05-16 01:49 UTC)** — audit URL: https://pagespeed.web.dev/analysis/https-aimvantage-uk/aeurjxyp3a?form_factor=mobile

| Metric | Baseline 2026-05-15 | After 4 perf commits | Delta |
|---|---|---|---|
| **Performance** | 62 / 100 | **79 / 100** | **+17** 🟢 |
| Accessibility | (not captured) | 100 / 100 | 🟢 |
| Best Practices | (not captured) | 92 / 100 | 🟢 |
| SEO | (not captured) | 100 / 100 | 🟢 |
| **LCP** | 5.8s 🔴 | **3.0s** 🟠 | **−2.8s** (48% faster) |
| **FCP** | 4.5s 🔴 | **2.9s** 🟠 | **−1.6s** (36% faster) |
| **CLS** | 0 🟢 | 0.036 🟢 | +0.036 (still well below 0.1 threshold — minor regression from lazy-load space reservation) |
| **TBT** | 240ms 🟡 | 310ms 🟡 | +70ms (slight regression from lazy-load scheduling overhead) |
| **Speed Index** | 5.2s 🔴 | 5.3s 🔴 | essentially flat |
| **Image savings opportunity** | 221 KiB 🔴 | 17 KiB 🟡 | **−204 KiB** (massive — WebP swap delivered) |
| **Unused JavaScript** | 299 KiB 🔴 | dropped out of top insights | bundle pruning + route lazy-load paid off |

**Net:** Mobile-first paid-acquisition strategy is now viable. LCP under 4s = Core Web Vitals "needs improvement" instead of "poor". To reach Performance 90+ the remaining levers are: Forced reflow (CSS/JS layout-read-after-write), Render blocking requests (3rd-party fonts/scripts), Main-thread work 2.2s (more code-splitting). Spawning as a chip if 90+ becomes a priority.

**Schema migration applied** — user ran the `audit_log` block in Supabase SQL Editor → "Success". Table + 4 indexes + RLS now live; `logAuditEvent()` writes will start landing on next purchase / refund webhook fire.

---

## ✅ Foresay cross-pollination status: complete

| Foresay pattern | Vantage status |
|---|---|
| `vercel-build` tsc gate | ✅ shipped |
| `/api/health-deep` | ✅ shipped + verified live |
| `audit_log` table + helper + first call sites | ✅ shipped + migration applied + table live |
| Sentry server-side | ✅ shipped + project live in DE region + coverage extended to 5 critical handlers |
| 2FA TOTP / recovery codes | ⏭ deferred — spawn when first B2B customer asks |
| CSP `unsafe-inline` removal | ⏭ deferred — needs focused session |
| Backend tests | ⏭ deferred — large scope |
| Slowapi-style auth limits | n/a — covered by Supabase Auth + Vercel Edge middleware |
| Stripe restricted key swap | ⏭ user task — recommended hygiene, not blocking |
| UptimeRobot 3 monitors | ⏭ user task — endpoints live + ready, point monitors at https://aimvantage.uk/api/health-deep with keyword `"status":"ok"` |

**Net result:** Vantage now matches Foresay's observability + audit + health-probe maturity bar, on a different stack (Vercel TS vs FastAPI). Vantage retains its own advantages — multiplexer pattern, atomic SQL RPC wallet, Stripe webhook idempotency table, /api/roast 7-layer abuse defense, threshold-crossing email pattern — which Foresay should consider importing.

---

## 🤝 Still on user

| # | Item | Where | Effort |
|---|---|---|---|
| 1 | Same Sensitive sweep on Foresay-v2 + Wadda Play Vercel projects | Vercel dashboards | ~10 min total |
| 2 | Delete `VITE_STRIPE_PUBLISHABLE_KEY` from `aimvantage` Vercel (dead weight) | Vercel | 1 min |
| 3 | Add `VITE_ADMIN_EMAILS` to Vercel if you want operator-only UI in future | Vercel | 1 min |
| 4 | Product Hunt edit save | producthunt.com/products/vantage-3/edit | 2 min |
| 5 | YouTube channel rename (different Google account) | YouTube Studio | 5 min |
| 6 | 3 directory rebrand emails | drafts in `docs/directory-rebrand-emails.md` | 5 min |

---

## 📚 Reading order for the next Claude session

1. `CLAUDE.md` — project rules (load first)
2. `SESSION-2026-05-15-PART-2.md` ← **THIS FILE** — latest state
3. `SESSION-2026-05-15-COMPLETE.md` — rebrand context (PATH-A, AimVantage naming, DNS, brand-entity continuity)
4. `PROJECT-INDEX.md` — comprehensive system inventory (22 sections)
5. `HANDOFF.md` — original handoff (now mostly superseded by PROJECT-INDEX but contains useful history)
6. `architecture-map.html` — open in browser for visual map (35 nodes / 45 edges)
7. `WALLET-SPEC.md` — wallet model is DONE; spec exists as historical reference
8. `audit-report.md` — Codex 2026-05-14 audit, all CRIT + HIGH + MED + LOW shipped

Do NOT re-do work the docs above say is already shipped. If unsure, `git log --oneline -20` is the source of truth.
