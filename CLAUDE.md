# AimVantage — Claude Agent Context File

> Read this entire file before writing any code. Then read the latest session ledger (see "Reading order" below) so you don't redo shipped work.

---

## What Is This Project?

**AimVantage** (formerly "Vantage" until the 2026-05-14 rebrand — domain `aimvantage.uk`) is an AI-powered job preparation SaaS web app. Users upload their CV and a job URL, and the AI generates:
- A company intelligence snapshot (auto-extracted from the URL)
- A role/CV fit analysis
- A strategic brief and narrative angle
- A personalised cover letter (with tone switching: Formal / Warm / Direct / Creative)
- A presentation outline
- An interview prep pack with flashcards + AI mock interview

Backend: Supabase Auth + Stripe (LIVE mode) + Vercel serverless API + Resend transactional emails + Google Gemini 2.5 Flash. Status is **live, paid, monetized, and instrumented**.

---

## ⚠️ Reading order (do NOT skip)

1. **This file (CLAUDE.md)** — current rules + tech stack
2. **`BACKLOG.md`** — what's left to do (operator tasks + deferred code + strategic items + done-list)
3. **`SESSION-2026-05-19-GDPR-MOBILE-UX.md`** ← LATEST — GDPR Gaps #1 + #3 shipped (self-serve delete + privacy policy cv_summary), full mobile UX sweep (nav, hero spacing, chip cluster, gradient fade, SEO-flash fix, desktop globe smoothing), and a 10-round mobile-hero-animation rabbit hole (parked, do not re-litigate)
4. **`SESSION-2026-05-17-BUNDLING-ODYSSEY.md`** — Vercel NFT bundling postmortem (6 attempts), Strategy B canonical pattern, smoke test infrastructure
5. **`SESSION-2026-05-15-PART-2.md`** — GA4 funnel, transactional emails, Stripe LIVE confirmation, env hygiene, mobile baseline
6. **`SESSION-2026-05-15-COMPLETE.md`** — rebrand context (Vantage → AimVantage, DNS, JSON-LD)
7. **`PROJECT-INDEX.md`** — comprehensive 22-section system inventory
8. **`HANDOFF.md`** — original handoff (mostly superseded by PROJECT-INDEX)
9. **`architecture-map.html`** — open in browser for visual map (35 nodes / 45 edges)
10. **`WALLET-SPEC.md`** — wallet model is DONE; doc kept for historical reference

**Plans worth reading if touching the related code:**
- `docs/superpowers/plans/2026-05-18-gap1-self-serve-delete-account.md` — full GDPR Gap #1 plan, checkboxes synced (Phase 1-5 done, Phase 6 = manual E2E operator task)
- `docs/superpowers/plans/2026-05-18-gap3-privacy-policy-cv-summary.md` — full GDPR Gap #3 plan (all phases done)

Before doing ANY non-trivial work: `git log --oneline -30` to see what's already shipped AND `npm run smoke` to confirm the deploy is healthy.

### Critical Vercel constraint (learned the hard way 2026-05-17)

**Vercel's NFT (Node File Trace) only bundles files via `node_modules`. Cross-tree relative imports inside `/api/` are NEVER packaged into sibling function bundles.** Five different cross-tree strategies all failed (lib/, api/_lib/, api/shared/, `includeFiles` config, underscore-prefix). The only reliable patterns are:
1. **Inline helpers per-function** (Strategy B — current pattern, see SESSION-2026-05-17 for details)
2. **Workspace package via `package.json "file:./packages/..."` protocol** (Strategy A — deferred)

If you write a new helper and import it across function trees, the deploy will mark "Ready" but every consumer endpoint will 500 at request time. Tsc won't catch this. Vercel's build logs won't catch this. **Only `npm run smoke` against the deployed URL catches it.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin — no config file) |
| Animations | Framer Motion (`motion/react` import, NOT `framer-motion`) |
| 3D (landing) | Three.js + `@react-three/fiber` + `@react-three/drei` |
| AI | `@google/genai` SDK v1.29.0 — model: `models/gemini-2.5-flash` |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL with RLS + SECURITY DEFINER RPCs |
| Payments | Stripe **LIVE mode** (multi-currency GBP + USD) |
| Backend | Vercel serverless functions (TypeScript, `api/` directory, 12-function Hobby cap) |
| Email | Resend (transactional + Supabase Auth SMTP relay). Domain `aimvantage.uk` verified DKIM/SPF/DMARC/MX. |
| Analytics | GA4 (`G-FMW9BX278N`) + Microsoft Clarity |
| Search Console | Domain property verified, sitemap.xml submitted |
| Doc parsing | `mammoth` (DOCX → text, client-side) |
| Speech | Web Speech API (`SpeechRecognition`) |
| Icons | `lucide-react` |

### Critical Import Rules
- **Framer Motion:** `import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'`
- **Gemini:** model string MUST be `'models/gemini-2.5-flash'` (needs the `models/` prefix)
- **Tailwind v4:** NO `tailwind.config.js` — use `@import "tailwindcss"` in CSS
- **Server-only Resend helper:** `import { sendEmail, wrapEmailBody } from '../../lib/email/resend'` (path varies — helper lives OUTSIDE `/api/` to not count as a Vercel function)
- **Never expose `GEMINI_API_KEY` client-side** — no `VITE_GEMINI_API_KEY` allowed. All Gemini calls are server-side via `api/analyze`, `api/interview/*`, `api/roast`, `api/decode-rejection`, `api/ghost-job-check`, `api/[publicTool]`.

---

## Token Wallet (status: COMPLETE per WALLET-SPEC.md)

- Single `token_balance INTEGER NOT NULL DEFAULT 10 CHECK (token_balance >= 0)` column on `profiles`. No `credits_total/used`.
- Atomic RPCs: `deduct_tokens(p_user_id, p_amount)` raises on insufficient funds, `add_tokens(p_user_id, p_amount)` raises on amount > 1000. SECURITY DEFINER, service_role only.
- `addTokensAtomic` in Stripe webhook is **additive** for both topup (Starter) and subscription (Pro/Premium) branches. Plan derived from Stripe price ID, never user metadata.
- REVOKE UPDATE blocks the authenticated client from PATCHing token-affecting columns.

### Token Costs
| Action | Tokens |
|---|---|
| Full job analysis | 1 (migrated from 3 in 2026-05-08) |
| Cover letter tone rewrite | 1 |
| Interview question generation | 2 |
| Interview answer evaluation | 0 |

### Token Packages
| Package | Tokens | Price (GBP / USD) | Model |
|---|---|---|---|
| Starter | 20 | £5 / $5 | One-time top-up |
| Pro | 60 | £12 / $15 | Monthly subscription |
| Premium | 120 | £20 / $25 | Monthly subscription |

---

## File Structure (current)

```
vantage/
├── api/                               # Vercel serverless functions
│   ├── [publicTool].ts                # multiplexer for unauthed public tools
│   ├── admin/[action].ts              # admin-gated by ADMIN_EMAILS env
│   ├── analyze/index.ts               # job analysis (1 token) — fires GA4 prep_pack_run + low_balance email
│   ├── decode-rejection/              # public free tool
│   ├── ghost-job-check/               # public free tool
│   ├── interview/[action].ts          # questions (2 tokens) + evaluate + jobsearch
│   ├── rewrite-tone/index.ts          # tone switch (1 token)
│   ├── roast/index.ts                 # public free tool with 7-layer abuse defense
│   ├── stripe/[action].ts             # multiplexer: checkout / sync / portal
│   ├── stripe/webhook.ts              # webhook handler — fires purchase, refund emails, GA4 events upstream
│   ├── user/index.ts                  # multiplexer: credits / analyses / cv-summary / delete-account
│   └── waitlist/index.ts              # waitlist join/count
├── lib/email/resend.ts                # ⚠️ server-only Resend helper (OUTSIDE /api/ — doesn't burn function slot)
├── database/
│   ├── schema.sql                     # canonical bootstrap (folded migrations 2026-05-15)
│   ├── roast-rate-limit.sql           # OPTIONAL — only if ROAST_RATELIMIT_ENABLED=true
│   ├── webmentions.sql                # OPTIONAL — future /mentions feature
│   └── migration-*.sql                # historical (DDL folded into schema.sql)
├── src/
│   ├── App.tsx                        # Auth context, lazy-loaded routes, GA4 OAuth sign_up
│   ├── main.tsx                       # Entry point + initGA4 + initClarity
│   ├── lib/
│   │   ├── ga4.ts                     # trackEvent / trackPageView, env-gated, DNT-aware
│   │   ├── clarity.ts                 # Microsoft Clarity loader
│   │   ├── supabase.ts                # Supabase client, Profile type, signUp/signIn helpers
│   │   └── (other small libs)
│   ├── services/
│   │   └── api.ts                     # All API calls with auth token injection
│   └── components/
│       ├── Dashboard.tsx              # Main workspace — fires prep_pack_run/_failed/purchase/plan_upgrade
│       ├── LandingPage.tsx            # Landing — Three.js dot globe (currently eager, mobile-perf TODO)
│       ├── AnalysisHistory            # Past prep packs from analyses table (inside Dashboard.tsx)
│       ├── AIInterviewSession.tsx     # AI mock interview
│       ├── Account.tsx                # Profile + billing + subscription_canceled GA4 + TEST-mode banner
│       ├── Pricing.tsx                # Pricing page with Stripe checkout
│       ├── Register.tsx               # Email signup — fires GA4 sign_up
│       ├── Login.tsx / ForgotPassword.tsx / ResetPassword.tsx
│       └── (60+ blog/tool/SEO surfaces — all React.lazy in App.tsx)
├── architecture-map.html              # interactive visual system map (open in browser)
├── SESSION-2026-05-15-PART-2.md       # latest session ledger ← read first
├── SESSION-2026-05-15-COMPLETE.md     # rebrand ledger
├── PROJECT-INDEX.md                   # canonical 22-section inventory
├── HANDOFF.md                         # original handoff
├── WALLET-SPEC.md                     # wallet status: COMPLETE
├── audit-report.md                    # Codex 2026-05-14 audit (all findings shipped)
├── vercel.json                        # routes + headers + rewrites
└── package.json
```

---

## API Functions (Vercel — 11/12 used)

| File | Multiplexer? | Purpose |
|---|---|---|
| `api/analyze/index.ts` | no | Main job analysis (1 token) |
| `api/admin/[action].ts` | yes | Admin dashboard reads (gated by ADMIN_EMAILS) |
| `api/interview/[action].ts` | yes | questions / evaluate / jobsearch |
| `api/rewrite-tone/index.ts` | no | Cover letter tone switch (1 token) |
| `api/roast/index.ts` | no | Public free tool with 7-layer abuse defense |
| `api/decode-rejection/index.ts` | no | Public free tool |
| `api/ghost-job-check/index.ts` | no | Public free tool |
| `api/[publicTool].ts` | yes | Catch-all for other public tools |
| `api/stripe/[action].ts` | yes | checkout / sync / portal |
| `api/stripe/webhook.ts` | no | Stripe event handler |
| `api/user/index.ts` | yes | credits / analyses / cv-summary / **delete-account** (GDPR Gap #1, 2026-05-18) |
| `api/waitlist/index.ts` | no | Waitlist join/count |

⚠️ **Do not add new top-level functions without retiring one.** Vercel Hobby plan caps at 12. Use multiplexers (`[action].ts` pattern) for related endpoints.

---

## Environment Variables (current Vercel state, 2026-05-15)

### Server (Sensitive type, Production + Preview)
- `STRIPE_SECRET_KEY` (`sk_live_*`)
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_PREMIUM` (GBP)
- `STRIPE_PRICE_STARTER_USD`, `STRIPE_PRICE_PRO_USD`, `STRIPE_PRICE_PREMIUM_USD`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `RESEND_API_KEY`
- `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` (AI Job Search)
- `ADMIN_EMAILS` (comma-split admin gate)
- `APP_URL` (canonical origin)

### Server (Plain, feature flags)
- `ROAST_RATELIMIT_ENABLED`, `ROAST_DISABLED`
- `SENTRY_DSN` (Sensitive — active as of 2026-05-15, routes errors to `foresay-labs/aimvantage-server`. Helper no-ops if unset.)

### Client (Plain — VITE_* bundles into browser JS, intentionally public)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_GA_MEASUREMENT_ID` (= `G-FMW9BX278N`)
- `VITE_CLARITY_PROJECT_ID`
- `VITE_STRIPE_MODE` (= `live` — gates the operator-only TEST-mode banner)

### Local dev
- Use `.env.local` (already `.gitignore`d). Vercel's "Development" env cannot hold Sensitive vars, so server keys go in `.env.local` if you actually run server code locally. Normal `npm run dev` workflow does NOT need them — the frontend hits production API.

---

## Database (schema.sql is canonical)

Tables: `profiles`, `analyses`, `waitlist`, `api_usage`, `processed_stripe_events`, `seen_job_searches`. Optional: `roast_rate_limit` + `roast_abuse_log`, `webmentions`.

Atomic RPCs (SECURITY DEFINER, service_role only):
- `deduct_tokens(p_user_id, p_amount)` — raises 'Insufficient tokens' if balance too low
- `add_tokens(p_user_id, p_amount)` — raises if amount > 1000

Trigger `on_auth_user_created` → `handle_new_user()` grants 10 tokens on signup.

REVOKE UPDATE on sensitive columns from authenticated + anon: `plan`, `token_balance`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `last_free_jobsearch_at`, `cv_summary`. Service role bypasses RLS.

---

## GA4 Event Catalog

| Event | Fired by | Params |
|---|---|---|
| `page_view` | `App.tsx::ScrollToTop` (route change) | path, title |
| `sign_up` (email) | `Register.tsx` after `signUp()` success | method='email' |
| `sign_up` (oauth) | `App.tsx::onAuthStateChange` (60s recency + sessionStorage dedupe) | method='google'/etc |
| `prep_pack_run` | `Dashboard.tsx` analyze success | has_job_url, mode |
| `prep_pack_failed` | `Dashboard.tsx` failure branches | has_job_url, mode, reason |
| `purchase` | `Dashboard.tsx` post-checkout poll | plan, upgrade_type, currency, **value** (major units, shipped via amount/currency query params from `api/stripe/[action].ts` success_url) |
| `plan_upgrade` | same as purchase, only on tier change | from_plan, to_plan |
| `subscription_canceled` | `Account.tsx` on status flip | plan, reason |

---

## Transactional Email Catalog (Resend)

| Email | Trigger | Tag |
|---|---|---|
| Purchase confirmation | `api/stripe/webhook.ts` checkout.session.completed (topup + subscription) | `purchase_confirm` |
| Low-balance warning | `api/analyze/index.ts` after deduct, when crossing ≥3 → <3 tokens | `low_balance` |
| Refund confirmation | `api/stripe/webhook.ts` charge.refunded (after token deduct) | `refund_processed` |
| Supabase Auth (signup confirm, magic link, recovery, change, invite) | Supabase Auth uses Resend as SMTP relay | n/a |

Helper: `lib/email/resend.ts`. `sendEmail({to, subject, html, tag?})` is fail-soft (never throws). `wrapEmailBody(headline, innerHtml)` provides the branded shell — **callers MUST escape user-supplied substrings** in innerHtml.

---

## Observability + Audit (Foresay-import additions, 2026-05-15)

### Audit log table — `audit_log` in `database/schema.sql`
Fire-and-forget event log for dispute paper trail + future admin dashboard. Service-role only. Helper: `lib/audit/log.ts::logAuditEvent({event_type, actor_id, actor_email, ip_address, resource_type, resource_id, detail, metadata})` — **NEVER pass whole Stripe objects into `metadata`** (would bleed customer email, card fingerprint). Hand-pick scalars.

Wired event types:
- `purchase.completed` — `api/stripe/webhook.ts` topup + subscription branches
- `purchase.refunded` — `api/stripe/webhook.ts` charge.refunded
- `account.deleted` — `api/user/index.ts::handleDeleteAccount` (GDPR Gap #1, 2026-05-18). Written BEFORE the auth.users delete fires so the audit row survives with `actor_id=NULL` but `actor_email` + `ip_address` + `metadata` preserved.

Event taxonomy (dotted namespace, soft convention): `auth.*` / `purchase.*` / `token.*` / `admin.*`.

### Sentry / Resend / audit_log helpers — INLINED PER-HANDLER (Plan E, 2026-05-17)

**Status: REAL helpers live in every consumer.** No stubs. After 5 failed attempts to share cross-file helpers (lib/, api/_lib/, api/shared/, vercel.json includeFiles, underscore renames — all ERR_MODULE_NOT_FOUND at runtime), the code is now inlined directly into each consumer handler. Each function file is self-contained; Vercel NFT only has to follow bare-package imports from `node_modules`, which it does reliably.

Trade-off: helper updates touch up to **6 files** (analyze, interview, rewrite-tone, stripe/[action], stripe/webhook, user). Originals (now deleted) lived at `api/shared/{observability,email,audit}/*` — preserved in git history if a future fix wants them back as a single source.

If you change one inlined helper, change all copies. They're 1:1 derived from `api/shared/observability/sentry.ts` @ commit `b70db4e` / `api/shared/email/resend.ts` / `api/shared/audit/log.ts`. **`api/user/index.ts` joined the inlined-helpers set on 2026-05-18** (commit `225fd82`) so the new `handleDeleteAccount` could log the `account.deleted` audit row + send the confirmation email — count them all when updating.

**Smoke test (`npm run smoke`) is the regression guard.** Run after every API change. Must be **11/11** (was 10/10 before 2026-05-18; the new check is `/api/delete-account` returns JSON 401/405 on GET).

### Sentry server-side — `lib/observability/sentry.ts`
**ACTIVE in production** as of 2026-05-15. Project: `aimvantage-server` in `foresay-labs` org, EU/Germany region (`de.sentry.io`). Dashboard: https://foresay-labs.sentry.io/projects/aimvantage-server/. DSN lives in Vercel as `SENTRY_DSN` (Sensitive, Production + Preview). Spike Protection ON at org level.

Helper still env-gated — no-op if `SENTRY_DSN` is removed.

`initSentry()` at handler entry, `captureError(err, context)` on outer catch. `captureMessage(msg, level, context)` for non-exception signals.

Defensive defaults:
- `tracesSampleRate: 0` (Performance has separate quota; auto-instrumenting fetch would burn fast)
- `beforeSend` strips 4xx-tagged events + known noise patterns
- Per-fingerprint dedupe (60s window, 200-entry ceiling, `route+msg` key) protects 5K-event free tier from bad-deploy spam loops

**Wired in 6 handlers** (all token-charging, money-critical, or destructive-account):
- `api/stripe/webhook.ts` (commit `3a8c514`)
- `api/analyze/index.ts` (commit `3a8c514`)
- `api/interview/[action].ts` (commit `5eb2886`)
- `api/rewrite-tone/index.ts` (commit `5eb2886`)
- `api/stripe/[action].ts` (commit `5eb2886`)
- `api/user/index.ts` (commit `225fd82` — added 2026-05-18 with GDPR Gap #1 self-serve delete handler)

4xx-style branches (Insufficient tokens, JOB_PARSE_FAILED) early-return BEFORE capture — no Sentry noise for intentional 4xx.

### Health endpoints
- `GET /api/health` — minimal "function alive" (instant 200, no probes). Cheapest UptimeRobot keyword target.
- `GET /api/health-deep` — multi-probe (Supabase authoritative + Stripe/Resend/Gemini advisory). Returns 200 always; truth is in `status: 'ok' | 'degraded'`. 30s in-memory cache to prevent abuse amplification. Cache-Control: no-store so monitors see live state.

Both inside `api/[publicTool].ts` dispatcher — no Vercel function slot burned.

### Build-time gate
`package.json` `build` + `vercel-build` chain `tsc --noEmit` before vite. Any TS error fails the deploy at build step. Was missing — only `lint` script existed but nothing in pipeline called it.

---

## CSS Patterns

### Glassmorphic Card (light mode)
```
bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(79,70,229,0.07)]
```

### Glassmorphic Card (dark mode)
```
bg-[#181530]/75 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
```

### CSS 3D Transforms — CRITICAL
Tailwind v4 does NOT reliably apply `preserve-3d` and `backface-hidden` classes.
**Always use inline styles for 3D CSS:**
```tsx
style={{ transformStyle: 'preserve-3d' }}
style={{ backfaceVisibility: 'hidden' }}
style={{ perspective: '1200px' }}
```

---

## Gemini Constraint — CRITICAL

`googleSearch` tool and `responseMimeType: 'application/json'` are **mutually exclusive** in the same request.

Pattern used throughout `api/analyze` and similar handlers:
- When `jobUrl` provided → `tools: [{ googleSearch: {} }]` only (JSON shape embedded in prompt text)
- When no URL → `responseMimeType: 'application/json'` only

**Never combine both.** Every new endpoint touching Gemini must observe this rule.

---

## What's NOT Built Yet (current backlog)

- **Mobile performance pass** — Lighthouse Mobile 62/100, LCP 5.8s. Plan: dynamic-import Three.js, WebP images, LCP preload. Chip spawned 2026-05-15.
- **Day-1 / Day-3 onboarding email sequence** — needs Vercel cron + idempotency. Day-0 already covered via Supabase Auth confirmation through Resend SMTP.
- **CSP `unsafe-inline` removal** (Codex MED-01) — would require nonce/hash for inline JSON-LD. Risky to do without verifying SEO impact.
- **Admin/CRM dashboard** — `api/admin` exists but no UI surface for it.
- **Stripe `value`/`amount` in GA4 `purchase`** — need server to plumb amount through `success_url` query. Chip spawned.
- **`rewrite-tone` + `interview` low-balance email instrumentation** — only `analyze` is instrumented; trivially extensible.
- **Token transaction audit table** — wallet today is balance-only. A `token_transactions(user_id, delta, source, ref_id, created_at)` table would help with refund disputes.

### NOT to do
- Don't fake testimonials or ratings (see `dist/blog/i-shipped-fake-review-schema-then-caught-myself`)
- Don't add `AggregateRating` JSON-LD without real ratings
- Don't expose `GEMINI_API_KEY` client-side
- Don't switch back to TEST mode without coordinating env var changes everywhere

---

## Dev Commands

```bash
npm run dev          # Local dev on http://localhost:3000 (reads .env.local)
npm run build        # Production build (will show chunk-size warnings — see mobile-perf TODO)
npx tsc --noEmit     # TypeScript check — MUST be clean before any commit
```

---

## Known Issues / Watch Out For

1. Avira antivirus may block `@react-three/drei` downloads — whitelist if needed
2. `public/frames/` directory has 49 WebP frames from an old Compass Video — currently unused since the scroll video section was replaced with static cards. Safe to delete if disk space is needed.
3. `useScroll` and `useTransform` imports from `motion/react` may show as unused — safe to ignore, used in some components
4. Always run `npx tsc --noEmit` after edits and fix all errors before considering work done
5. **Vercel Hobby plan: 12 serverless functions max.** Don't add a new function without retiring one. Use multiplexers.
6. **Stripe is LIVE.** Mistakes here charge real customers' real cards. Test refund/checkout logic in a separate Stripe **test mode account** (separate API key) before pushing changes.
7. **Resend free plan: 100 emails/day, 3K/month, 1 verified domain.** Don't write loops that send emails per user without rate-limiting.
8. The `VITE_STRIPE_PUBLISHABLE_KEY` env var exists but is **dead weight** — the app does server-redirect checkout, not Stripe.js client-side. Safe to delete from Vercel.
