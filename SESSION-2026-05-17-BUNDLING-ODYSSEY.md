# Session ledger — 2026-05-16 → 2026-05-17

**Picks up where `SESSION-2026-05-15-PART-2.md` left off.** Covers everything since commit `9c790ae` (last KB sync). The headline story is a 6-attempt bundling postmortem on Vercel serverless functions — preserved here in full because the lesson generalizes to any Vercel TS project.

**TL;DR:** Two days of broken paid endpoints (caught only when a user demoed the tool to a friend). Five wrong fixes. One correct fix (Strategy B — inline real helpers per-function). Smoke test infrastructure shipped as the regression guard. 11 commits between `27fb51f` and `38588cb`.

---

## 🚨 The bundling outage — full postmortem

### What broke

Commits `3a8c514` (2026-05-15) + `5eb2886` added Sentry instrumentation that imported from `lib/observability/sentry.ts` into 5 serverless function handlers (`api/analyze`, `api/interview/[action]`, `api/rewrite-tone`, `api/stripe/[action]`, `api/stripe/webhook`). The static import resolved at TypeScript compile time → `tsc --noEmit` clean → Vercel marked every deploy "Ready" — but at request time Node failed with `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/lib/observability/sentry'`.

**Net effect:** every paid endpoint returned a non-JSON HTML 500 for ~48 hours. Caught only when the founder hit it himself while demoing.

### How it was discovered (the user-facing diagnostic message)

Frontend error wrapper at `src/services/api.ts:72` returned:
> `Server returned a non-JSON response (status 500). Your token was not consumed. Try again or contact support@aimvantage.uk if it repeats.`

That string spotting in user feedback led to:
- Sentry dashboard check → **zero events** (Sentry was the bug — couldn't catch itself)
- Vercel runtime logs → `ERR_MODULE_NOT_FOUND` smoking gun

### The 6 attempts (chronological)

| # | Commit | Strategy | Result |
|---|---|---|---|
| 1 | `db922c5` | **HOTFIX**: replace Sentry import with local no-op stub | Tool works, observability disabled |
| 2 | `b70db4e` | Switch `lib/observability/sentry.ts` from dynamic `require('@sentry/node')` to top-of-file static `import * as Sentry from '@sentry/node'`. Reviewer agent passed cleanly. | Still 500 in production — bundler failure was deeper than dynamic-vs-static |
| 3 | `2e33bcd` | Move `lib/` → `api/_lib/`. Hypothesis: NFT bundles files inside `api/` tree. | Still 500 — Vercel skips underscore-prefixed dirs (Next.js Pages Router convention) |
| 4 | `c178f86` | Add `vercel.json` `functions.includeFiles: "api/_lib/**"` per Vercel docs. | Still 500 — `includeFiles` adds raw `.ts` to deployment payload but **doesn't transpile** to `.js`. Node ESM can't load `.ts`. |
| 5 | `6b36048` | Rename `api/_lib/` → `api/shared/` (drop underscore prefix). Hypothesis: NFT now traces normally. | Still 500 — Vercel NFT only bundles files via `node_modules`. Cross-tree relative imports inside `/api/` are NEVER packaged into sibling function bundles, regardless of underscore prefix. |
| 6 | `dc5375e` | **PLAN D**: revert to inline no-op stubs in all 5 consumers. Smoke test 10/10 (tool works, no observability). | Stable but temporary. Spawned a chip for the proper fix. |
| 7 | `d4a769f` | **Strategy B — RESOLUTION**: inline the REAL helper code (Sentry init + captureError + sendEmail + wrapEmailBody + audit) directly into each consumer file. Each function is self-contained; bundling is impossible to get wrong. | **10/10 smoke test + observability restored** ✓ |

### The fundamental Vercel rule (now documented)

**Vercel's NFT (Node File Trace) only bundles files via `node_modules`. Cross-tree relative imports inside `/api/` never get packaged into sibling function bundles.** Static vs dynamic imports doesn't matter. Underscore prefix doesn't matter. `includeFiles` config adds raw files but doesn't transpile TS. The only two reliable strategies:

- **Strategy B (chosen):** inline real helper code per-function. Self-contained, ~150 LOC duplicated per file, bundling impossible to get wrong.
- **Strategy A (deferred):** workspace package via `package.json` `"file:./packages/aimvantage-helpers"` protocol. NPM symlinks it into `node_modules`. NFT bundles via node_modules reliably. Cleaner long-term but unnecessary while duplication is manageable.

### The single biggest lesson — undetected breakage

Three failures stacked:
1. **`tsc --noEmit` doesn't catch runtime bundling errors.** Vercel marks every deploy "Ready" if compile succeeds. The crash only manifests when handlers run.
2. **Sentry was the observability mechanism AND the bug.** Zero events in Sentry didn't mean "all is well" — it meant "we crash before init runs."
3. **Zero post-deploy smoke tests.** Every other safeguard (atomic RPCs, REVOKE, idempotency table, etc.) was technically intact — but the HTTP path to those safeguards was dead.

---

## 🛡️ Smoke test infrastructure (the regression guard) — `scripts/smoke-test-deploy.mjs`

Built specifically to catch this bug class in seconds instead of days.

**Run via:** `npm run smoke` (defaults to `https://aimvantage.uk`) or `npm run smoke -- --url <preview-url>` against a Vercel preview.

**Test plan:** 10 critical endpoints, each verified for:
- Expected HTTP status (200 / 401 / 405 — anything else = fail)
- `Content-Type: application/json` (HTML body = function crashed pre-handler = the exact failure mode we just hit)
- Optional JSON shape assertion (e.g. `status: ok`, presence of `probes` array)
- Loud failure message when status mismatch + HTML body suggests pre-handler crash

**Endpoints covered:**

| Endpoint | Expected | Note |
|---|---|---|
| `/api/health` | 200 + `status: ok` | Liveness probe |
| `/api/health-deep` | 200 + `status: ok\|degraded` + probes array | Multi-probe |
| `/api/analyze` | 405 | The endpoint that was 500-ing for 2 days |
| `/api/interview/jobsearch` | 405 | First user-reported failure |
| `/api/rewrite-tone` | 405 | |
| `/api/stripe/webhook` | 400/405 | |
| `/api/stripe/checkout` | 405 | |
| `/api/user?endpoint=credits` | 401 | |
| `/api/waitlist` | 200/405 | |
| `/api/roast` | 405 | |

Exits 1 on any failure, 0 on all-pass. Use after every API change. Future: trigger from Vercel `deployment.succeeded` webhook.

---

## 📜 All commits this session window

| Commit | Description |
|---|---|
| `27fb51f` | docs: BACKLOG.md — durable punch list (new file) |
| `8070129` | fix(ux): null Suspense fallback — kill the purple-flash on lazy route loads |
| `db922c5` | HOTFIX: neutralize broken Sentry import — was 500-ing /api/interview/jobsearch |
| `b70db4e` | fix(observability): proper Sentry restore (static @sentry/node import) — still failed |
| `2e33bcd` | fix(infra): move helpers to api/_lib/ — still failed |
| `c178f86` | fix(infra): explicit functions.includeFiles for api/_lib/** in vercel.json — still failed |
| `6b36048` | fix(infra): drop underscore — api/_lib/ → api/shared/ — still failed |
| `dc5375e` | fix(infra): **Plan D inline-stub** — tool stable, observability disabled |
| `fef91eb` | docs: postmortem the bundling odyssey — 5 attempts, Plan D stubs live |
| `d4a769f` | fix(infra): **Strategy B — REAL Sentry + Resend + audit inlined per-function** ✓ |
| `38588cb` | docs: BACKLOG.md mark K1 RESOLVED — bundling odyssey closed |

**Total: 11 commits.** All `tsc --noEmit` clean. Final state verified via `npm run smoke` = 10/10 PASS.

---

## ✨ Smaller fix shipped: page-flash on lazy route loads (`8070129`)

**Symptom:** User reported "pages briefly flash another loading screen for a microsecond before the actual page paints."

**Root cause:** `App.tsx` Suspense fallback was a full-screen colored gradient + spinner. For SSG-prerendered routes (`/pricing`, `/login`, `/register`, etc.), the prerendered HTML painted INSTANTLY — but during React hydration, the lazy chunk import triggered the Suspense fallback, which painted OVER the already-visible prerendered content. ~200ms wipe-and-redraw before the React component took over.

**Fix:** `<React.Suspense fallback={null}>`. Prerendered HTML stays visible during the lazy chunk download. After chunk loads, React hydrates seamlessly in place. For client-side route navigation, the previous page stays visible during chunk download instead of being wiped to purple.

**Trade-off:** cold-load of a non-prerendered route shows blank for ~200ms. Every non-prerendered route in this app is auth-gated (Dashboard, Account) and the user is already past prerendered marketing pages by then — so the previous page is painted.

---

## 🧬 Helper code now inlined per-function (Strategy B canonical pattern)

Every consumer file contains its own real helper block. Marked with `INLINED SENTRY HELPER` / `INLINED HELPERS` comment fences for easy grep-and-update. If the helper logic ever changes, update **all 5** copies in lockstep.

**Sentry helper (in all 5 consumers):**
- `initSentry()` — idempotent per warm lambda, env-gated by `SENTRY_DSN`, `tracesSampleRate: 0`, `beforeSend` strips 4xx-tagged events + known bot/scanner noise
- `captureError(err, context)` — fire-and-forget, never throws, per-fingerprint dedupe (60s window, 200-entry ceiling, route+msg.slice(0,120) key)
- Variable names prefixed `_sentry*` / `_SENTRY_*` to avoid collision with consumer code

**Resend helper (in `api/analyze` + `api/stripe/webhook` only — the 2 consumers that send email):**
- `sendEmail({to, subject, html, text?, from?, replyTo?, tag?})` — fail-soft envelope `{ok, id?, error?}`, never throws
- `wrapEmailBody(headline, innerHtml)` — branded HTML doc. **`headline` is escaped; `innerHtml` is injected raw** — callers must escape user-controlled values
- `DEFAULT_FROM = 'AimVantage <noreply@aimvantage.uk>'`, `DEFAULT_REPLY_TO = 'giovanni.sizino.ennes@hotmail.co.uk'`
- Singleton client cached per warm lambda

**Audit helper (in `api/stripe/webhook` only — the only consumer that logs to `audit_log`):**
- `logAuditEvent({event_type, actor_id, actor_email, ip_address, user_agent, resource_type, resource_id, detail, metadata})` — fire-and-forget, never throws, length-capped (UA 500, resource_id 200, detail 500)
- `Prefer: return=minimal` on the Supabase REST POST
- ⚠️ NEVER pass whole Stripe `session`/`charge`/`invoice` objects into `metadata` — would bleed customer billing_details + card fingerprint into the audit table

---

## 🔒 Current production state (verified via smoke test 10/10)

| Surface | Status |
|---|---|
| All 5 paid endpoints (analyze, interview, rewrite-tone, stripe/[action], stripe/webhook) | ✅ healthy, real Sentry + Resend + audit wired |
| Page-flash (Suspense fallback) | ✅ fixed |
| Sentry project `aimvantage-server` in `foresay-labs` org | ✅ live, 0 events (means no prod errors) |
| Resend transactional pipeline (purchase confirm, low-balance, refund) | ✅ live |
| Audit log (purchase + refund webhook events) | ✅ live, fire-and-forget |
| Smoke test as regression guard | ✅ `npm run smoke` exists, 10/10 currently |

---

## 🔭 What's next (for the next session)

From `BACKLOG.md`:
- **U1-U9** (operator manual tasks): Stripe restricted-key swap, UptimeRobot 3 monitors, Sensitive sweep on Foresay/Wadda Play, etc.
- **D1-D11** (code-side deferred): 2FA TOTP, admin/CRM dashboard UI, Day-1/Day-3 onboarding sequence, CSP `unsafe-inline` removal, backend test suite, mobile-perf push 79→90, etc.

**Highest-leverage next move:** verify Sentry actually captures end-to-end by triggering a deliberate prod error. Send an authenticated POST to `/api/analyze` with a payload that causes a runtime exception past the validation layer. If captured → `foresay-labs.sentry.io/projects/aimvantage-server/` shows the event within 60s. If NOT captured → diagnose Sentry transport (DSN region, network egress, etc.).

---

## 📚 Reading order for the next agent

1. `CLAUDE.md` — global rules + tech stack
2. `BACKLOG.md` — what's left to do (operator tasks + deferred code + strategic items + done-list)
3. `SESSION-2026-05-17-BUNDLING-ODYSSEY.md` ← **THIS FILE** — bundling postmortem + smoke test + Strategy B canonical pattern
4. `SESSION-2026-05-15-PART-2.md` — GA4 funnel, transactional emails, Stripe LIVE confirmation, mobile baseline
5. `SESSION-2026-05-15-COMPLETE.md` — rebrand context
6. `PROJECT-INDEX.md` — comprehensive 22-section system inventory
7. `architecture-map.html` — open in browser for visual map
8. `WALLET-SPEC.md` — wallet model COMPLETE (historical reference)

Before doing ANY non-trivial work, `git log --oneline -30` to see what's already shipped, AND `npm run smoke` to confirm the deploy is healthy.
