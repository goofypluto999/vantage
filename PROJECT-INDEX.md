# AimVantage — Full System Index

**Last full index:** 2026-05-15 (post-rebrand session)
**Live URL:** https://aimvantage.uk
**Source repo:** https://github.com/goofypluto999/aimvantage (renamed from `vantage` 2026-05-15)
**Brand mark:** AimVantage (closed compound, no space). Legacy form "Vantage" preserved as `alternateName` in JSON-LD for Knowledge Graph continuity.

This file is the **single source of truth** for what the product is, what's plugged in, and where. If a future Claude session needs to understand the system, this is the first read.

---

## 1. WHAT THE PRODUCT IS

**AimVantage** is an AI-powered job preparation SaaS. User uploads a CV, pastes a job listing URL, and gets back in ~90 seconds:

- Company intelligence snapshot
- CV-to-role fit score (0–100, calibrated)
- Strategic brief (4 sections)
- Tailored cover letter with 4 tone variants (Formal / Warm / Direct / Creative)
- Interview prep pack (12 AI-generated questions + model answers)
- AI mock interview (voice, speech recognition, live evaluation — Pro+)
- 5-minute pitch deck outline

Plus 10+ free public tools (no signup): cover letter roast, ghost-job detector, rejection email decoder, ATS scanner, cost calculator, LinkedIn rewriter, STAR story builder, salary negotiation script, etc.

**Operator:** Giovanni Sizino Ennes — UK sole trader (NOT a registered limited company). All operations from `aimvantage.uk`.

---

## 2. TECH STACK

| Layer | Tech | Notes |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite 6 | SPA with react-router-dom 7 |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/vite` | No config file. 3D transforms use inline styles. |
| **Animations** | `motion/react` (Framer Motion) | NEVER change this import |
| **3D landing globe** | Three.js + `@react-three/fiber` + `@react-three/drei` | Fibonacci sphere |
| **AI** | Google Gemini 2.5 Flash via `@google/genai` v1.29.0 | Model ID: `models/gemini-2.5-flash` |
| **Backend** | Vercel serverless functions | `api/` directory, TypeScript |
| **Edge middleware** | `@vercel/edge` | `middleware.ts` — rate limiting + geo + 404 enforcement |
| **Auth** | Supabase Auth | Email + password + Google OAuth |
| **Database** | Supabase PostgreSQL with RLS | 4 tables + 2 RPC functions |
| **Payments** | Stripe Subscriptions | Checkout sessions + webhooks + Billing Portal |
| **Email** | Resend (free tier 100/day) | SMTP relay configured in Supabase Auth |
| **Doc parsing** | `mammoth` (DOCX) | PDF parsed natively by Gemini |
| **Speech** | Web Speech API (`SpeechRecognition`) | Used in AI mock interview |
| **Hosting** | Vercel (`adlixirs-projects/aimvantage`) | Production + Preview + Development envs |
| **Domain registrar** | Namecheap (account `gigio98`) | `aimvantage.uk`, DNS managed at Namecheap |

---

## 3. DOMAIN & DNS

Domain `aimvantage.uk` is registered at **Namecheap** (account `gigio98`).
Nameservers: Namecheap default (`dns*.registrar-servers.com`).

### Complete DNS record table

| # | Type | Host | Value | Priority | Purpose |
|---|---|---|---|---|---|
| 1 | A | `@` | `76.76.21.21` | — | Vercel (production) |
| 2 | CNAME | `www` | `cname.vercel-dns.com` | — | Vercel www subdomain |
| 3 | TXT | `_dmarc` | `v=DMARC1; p=none;` | — | DMARC policy (optional, monitor mode) |
| 4 | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb...QIDAQAB` (218 chars) | — | Resend DKIM (mandatory for sending) |
| 5 | TXT | `send` | `v=spf1 include:amazonses.com ~all` | — | SPF allowing Resend (Amazon SES backend) |
| 6 | TXT | `@` | `google-site-verification=mt9jxsCNbClfyg16j1cr7N7UjVt3ZzPbTUMAdRI2WVI` | — | Google Search Console Domain verification |
| 7 | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` | 10 | Resend bounce/return-path |

**Mail Settings:** Set to **Custom MX** in Namecheap Advanced DNS (NOT Email Forwarding — that was swapped to allow record #7).

**Caveat:** Switching to Custom MX removed the default Namecheap email-forwarding TXT at `@`. If you ever want `hello@aimvantage.uk` → Gmail forwarding, you'll need to set it up separately (e.g. via Resend Inbound or a 3rd-party forwarder).

---

## 4. HOSTING — VERCEL

**Project:** `adlixirs-projects/aimvantage` (renamed from `vantage` 2026-05-15)
**Branch:** `master` → auto-deploys to production
**Build:** `npm run build` → `dist/` directory
**Framework:** Vite

### `vercel.json` configuration

- **Function timeouts:** `/api/analyze` 60s, `/api/interview/*` 60s, `/api/rewrite-tone` 30s, `/api/roast` 20s, `/api/decode-rejection` 20s, `/api/ghost-job-check` 20s, `/api/admin/*` 30s
- **Hobby plan limit:** 12 serverless functions. `/api/user` consolidates credits + analyses endpoints under one function (driven by `?endpoint=` query) to stay under the limit.
- **Security headers:** HSTS preload, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy disabling camera/geolocation/cohort
- **CSP:** Strict allowlist — Stripe, Clarity, Bing tag, Supabase, Jina (for SSRF-safe URL fetching). `script-src 'unsafe-inline'` still present (LLM Council flagged this as MED-01, intentionally deferred)
- **Cache-Control:**
  - `/sitemap*` → 10 min
  - `/rss.xml`, `/atom.xml`, `/feed.json` → 10 min
  - `/robots.txt`, `/llms.txt`, `/llms-full.txt` → 1 hour
  - `/assets/*` → 1 year immutable (Vite bundle hashing)
- **Noindex routes:** `/dashboard`, `/account`, `/admin`, `/refer`, `/reset-password` (X-Robots-Tag)
- **Rewrites:** SPA fallback rewrites every non-API non-asset path to `/`, BUT `middleware.ts` intercepts unknown routes first and returns a real HTTP 404 (Codex audit HIGH-05 fix)

### Vercel environment variables (all encrypted, scope shown)

| Variable | Used by | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | Client + server | All 3 |
| `VITE_SUPABASE_ANON_KEY` | Client (RLS-protected) | All 3 |
| `SUPABASE_URL` | Server | All 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | All 3 |
| `GEMINI_API_KEY` | Server | All 3 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client | All 3 |
| `STRIPE_SECRET_KEY` | Server | All 3 |
| `STRIPE_WEBHOOK_SECRET` | `/api/stripe/webhook` | All 3 |
| `STRIPE_PRICE_STARTER` | Server | All 3 |
| `STRIPE_PRICE_PRO` | Server | All 3 |
| `STRIPE_PRICE_PREMIUM` | Server | All 3 |
| `STRIPE_PRICE_STARTER_USD` | Server | Production |
| `STRIPE_PRICE_PRO_USD` | Server | Production |
| `STRIPE_PRICE_PREMIUM_USD` | Server | Production |
| `ADMIN_EMAILS` | `/api/admin/*` auth gate | All 3 |
| `APP_URL` | Stripe redirect URLs | All 3 |
| `VITE_CLARITY_PROJECT_ID` | `src/lib/clarity.ts` | Production, Development |
| `VITE_GA_MEASUREMENT_ID` | `src/lib/ga4.ts` (`G-FMW9BX278N`) | Production, Development |
| `ADZUNA_APP_ID` | AI Job Search backend | Production, Preview |
| `ADZUNA_APP_KEY` | AI Job Search backend | Production, Preview |
| `ROAST_RATELIMIT_ENABLED` | `/api/roast` toggle | Production, Development |
| `ROAST_DISABLED` | Emergency kill switch | Production, Development |

**NOT yet set (would unlock additional features):**
- `INDEXNOW_KEY` — for `scripts/indexnow-ping.mjs` (key file already in `public/745e7c1576...txt`)
- Custom GA4 IDs for future projects (Foresay, Wadda Play) if they share this Vercel account

---

## 5. DATABASE — SUPABASE

**Project ID:** `wgbizaesqrweqzotzfhb` (visible in Vercel SUPABASE_URL)
**Region:** Auto-selected (likely eu-west-1 for EU latency)
**Plan:** Free tier (500 MB DB, 1 GB file storage, 50K MAU)

### Tables (`database/schema.sql`)

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | One row per user (extends `auth.users`) | `id` (PK = auth.users.id), `email`, `plan`, `token_balance`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `subscription_renews_at`, `subscription_cancel_at`, `cv_summary`, `last_free_jobsearch_at` |
| `analyses` | Saved AI analysis results | `id`, `user_id`, `payload` (JSONB), `created_at` |
| `waitlist` | Pre-signup emails | `email`, `created_at` |
| `api_usage` | Audit trail for rate limiting | `user_id`, `endpoint`, `ts` |

### RLS (Row Level Security) — ENABLED on ALL tables

- Users can only `SELECT/UPDATE` their own `profiles` row
- Users can only `SELECT/INSERT` their own `analyses`
- Column-level `REVOKE` on sensitive `profiles` fields (plan, token_balance, stripe_*, subscription_status) — these are managed by `service_role` only via webhooks/sync

### RPC functions (server-side only)

- `add_tokens(user_id uuid, amount int)` → atomically increment `token_balance`. Locked to `service_role`. Capped at 1000/call.
- `deduct_tokens(user_id uuid, amount int)` → atomically decrement with under-balance check. Returns `{ ok: bool, balance: int }`.

### Subscription status CHECK constraint (CRITICAL)

```sql
CHECK (subscription_status IN ('inactive', 'active', 'cancelling', 'cancelled', 'past_due'))
```
If `cancelling` is missing, Stripe webhook writes silently fail. Verified live.

---

## 6. AUTH — SUPABASE AUTH

**Methods enabled:**
- Email + password (with confirmation flow)
- Google OAuth (via Supabase's default proxy — NO custom Google Cloud OAuth app)
- Magic Link (configured but not surfaced in UI)

**Email templates:** 5 custom HTML templates pasted into Supabase Dashboard → Authentication → Emails:
- Confirm signup
- Invite user
- Magic Link
- Change Email Address
- Reset Password

Templates live in repo at `docs/supabase-emails/01..05-*.html` for reference.

**Sender:** `noreply@aimvantage.uk` (display name: `AimVantage`) via custom SMTP → Resend (see §8).

**Rate limits:** Default Supabase 4/hr was the OLD bottleneck. Now bypassed entirely via custom SMTP (Resend) — effective limit is 100/day from Resend free tier.

**Frontend flow (`src/lib/supabase.ts` + `src/components/Login.tsx`/`Register.tsx`/`ForgotPassword.tsx`/`ResetPassword.tsx`):**
- `supabase.auth.signUp` / `signInWithPassword` / `signInWithOAuth` / `resetPasswordForEmail` / `updateUser`
- All errors mapped through `mapAuthError()` for user-friendly messages

---

## 7. PAYMENTS — STRIPE

**Mode:** **LIVE mode in production** as of 2026-05-15. Confirmed by inspecting `STRIPE_SECRET_KEY` in Vercel — value starts with `sk_live_`. All Stripe-related env vars (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`) have been converted from "Plain" to "Sensitive" in Vercel. Sensitive vars target Production + Preview only (Vercel does not allow Sensitive in Development — local dev should use `.env.local` with test keys).

### Products (renamed 2026-05-14)

| Product ID | Display name | Price ID env var (GBP) | Price ID env var (USD) | Price | Tokens/month |
|---|---|---|---|---|---|
| `prod_UK7rZ8M8ARLfbB` | **AimVantage Starter** | `STRIPE_PRICE_STARTER` | `STRIPE_PRICE_STARTER_USD` | £5 / $5 | 20 (one-time top-up, never expire) |
| `prod_UK7r5uWulsk6Jc` | **AimVantage Pro** | `STRIPE_PRICE_PRO` | `STRIPE_PRICE_PRO_USD` | £12 / $15 | 60 |
| `prod_UK7rEa90B9zYe4` | **AimVantage Premium** | `STRIPE_PRICE_PREMIUM` | `STRIPE_PRICE_PREMIUM_USD` | £20 / $25 | 120 |

**Free tier:** 10 tokens on signup, no card required.

### Subscription lifecycle

```
inactive → (checkout) → active
active → (cancel via portal) → cancelling (period_end pending)
cancelling → (period_end reached) → cancelled
```

### Token model — IMMUTABLE RULES

1. Tokens are **additive** — new plan ADDS to existing balance
2. Tokens **never expire** (even after cancellation — user paid for them)
3. Tokens are **never replaced** — old balance + new purchase = total
4. **Atomic** ops via PostgreSQL RPC (no race conditions)

### Webhook — `/api/stripe/webhook`

Signature verified via `STRIPE_WEBHOOK_SECRET`. Handles:
- `checkout.session.completed` → upgrade plan, add tokens
- `customer.subscription.created` / `updated` / `deleted` → sync plan/status/renew/cancel dates
- `invoice.payment_succeeded` → top up monthly tokens for Pro/Premium
- `invoice.payment_failed` → set `subscription_status = 'past_due'`
- `charge.refunded` — **NOT YET IMPLEMENTED** (see Refund Policy gap in handoff)

Webhook delivers to `https://aimvantage.uk/api/stripe/webhook` from Stripe dashboard.

### API surface (`api/stripe/[action].ts`)

Single endpoint multiplexer:
- `?action=checkout` → create Stripe Checkout Session, redirect URL
- `?action=portal` → create Billing Portal session
- `?action=sync` → fallback after checkout return; reads Stripe API and updates DB if webhook hasn't fired yet (Codex audit CRIT-01: this is now READ-ONLY; no longer cancels active subs)

### Customer Billing Portal

Self-serve cancellations + plan changes + invoice download. Configured in Stripe Dashboard → Settings → Billing → Customer portal.

---

## 8. EMAIL — RESEND (custom SMTP)

**Account:** `adlixir.uk@gmail.com` (NOT the hotmail one — that was used for Foresay's Resend account, which has 1 domain slot already used)

**Domain:** `aimvantage.uk` — verified (DKIM ✓, SPF MX ✓, SPF TXT ✓, DMARC ✓)
**Domain UUID:** `e5f5f427-758e-49cf-a2d2-d798ac45c2b3`
**Region:** Ireland (eu-west-1) — matches Vercel/Supabase EU stack

### API key
- **Name:** "AimVantage Supabase Auth"
- **Scope:** Sending access, aimvantage.uk only
- **Stored in:** Supabase Auth → SMTP Settings → Password field (encrypted; can't be revealed after save)
- **NOT stored** in Vercel env vars — only in Supabase. Resend doesn't currently call from any AimVantage server code; all email goes via Supabase's SMTP relay.

### SMTP settings in Supabase Auth

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` (TLS) |
| Username | `resend` |
| Password | the API key |
| Sender email | `noreply@aimvantage.uk` |
| Sender name | `AimVantage` |
| Min interval per user | 60 seconds |

### Free tier
100 emails/day, 3,000/month. At current scale this is plentiful. Upgrade path: $20/mo for 50K/month.

### What sends email
- Supabase Auth: confirmation, magic link, password reset, email change, invite (5 templates)
- **Future:** transactional emails like "Your prep pack is ready", "Subscription cancelled", "Token balance low" — not yet built. Would need to call Resend API directly from `api/` functions.

---

## 9. AI — GOOGLE GEMINI

**Model:** `models/gemini-2.5-flash`
**SDK:** `@google/genai` v1.29.0
**Auth:** `GEMINI_API_KEY` (server-side, Vercel env)

### Critical constraint
`googleSearch` tool and `responseMimeType: 'application/json'` are **mutually exclusive** in the same request. The `useSearch` flag in `api/analyze/index.ts` handles which path to use:
- With job URL → `tools: [{ googleSearch: {} }]` only (JSON shape embedded in prompt)
- Without URL → `responseMimeType: 'application/json'` only

### Endpoints using Gemini

| Endpoint | Cost | Auth | Purpose |
|---|---|---|---|
| `/api/analyze` | 1 token | Bearer JWT | Main job analysis (60s timeout) |
| `/api/rewrite-tone` | 1 token | Bearer JWT | Rewrite cover letter in different tone |
| `/api/interview/questions` | 2 tokens (Pro+) | Bearer JWT | Generate mock interview Qs |
| `/api/interview/evaluate` | Free (Pro+) | Bearer JWT | Score answer |
| `/api/roast` | Free, public | IP rate limit | Cover letter roast |
| `/api/decode-rejection` | Free, public | IP rate limit | Rejection email decoder |
| `/api/ghost-job-check` | Free, public | IP rate limit | Ghost job detector |

### Prompt engineering (system prompts in api/* files)
All prompts now reference "AimVantage" (was "Vantage" before rebrand — fixed 2026-05-15). Sanitization layer strips `[CV, cite: 6]`-style citation artifacts from output before returning to client.

---

## 10. ANALYTICS

| Service | Status | Where wired |
|---|---|---|
| **Google Analytics 4** | `G-FMW9BX278N` (Stream ID `14885402585`) | `src/lib/ga4.ts` + `src/main.tsx` initialiser. Page views fire on SPA route changes via `ScrollToTop` in `src/App.tsx`. Env-gated by `VITE_GA_MEASUREMENT_ID`. |
| **Microsoft Clarity** | Project `wmw4zvycgg` (renamed AimVantage 2026-05-15) | `src/lib/clarity.ts` + `src/main.tsx`. Heatmaps + session replays. Env-gated. |
| **Vercel Analytics** | Always-on free tier | `@vercel/analytics/react` in `src/main.tsx` |

**Privacy:**
- All three honour `navigator.doNotTrack === '1'`
- GA4 has `anonymize_ip: true`
- Clarity masks form inputs by default
- No cross-site cookies set

---

## 11. SEARCH — GOOGLE SEARCH CONSOLE + INDEXNOW

### Google Search Console
- Property type: **Domain** (verified via DNS TXT)
- Account: `adlixir.uk@gmail.com`
- Verification token (live in DNS + as fallback meta tag): `mt9jxsCNbClfyg16j1cr7N7UjVt3ZzPbTUMAdRI2WVI`
- Sitemap submitted: `https://aimvantage.uk/sitemap.xml` (sitemap index)
- Last known: **289 pages discovered**, sitemap status `Success`

### Sitemaps (`public/sitemap*.xml`)
- `sitemap.xml` — sitemap index (parent)
- `sitemap-pages.xml` — static product pages
- `sitemap-blog.xml` — blog posts
- `sitemap-roles.xml` — `/salary/{role}` slugs
- `sitemap-companies.xml` — `/interview-prep/{company}` slugs
- `sitemap-images.xml` — image SEO

### IndexNow (Bing/Yandex/Seznam)
- Key file: `public/745e7c1576ba55e88704a1df0306edf7d3d8036cfd2141c8.txt`
- Ping script: `scripts/indexnow-ping.mjs`
- Run via `node scripts/indexnow-ping.mjs` after big content changes
- Last submission: 271 URLs accepted

### Structured data (JSON-LD)
All in `index.html` and per-route `<SEO />` blocks via `react-helmet-async`:
- `WebSite` (with `SearchAction` for sitelinks searchbox)
- `Organization` (with `disambiguatingDescription`, `alternateName: ["Vantage", "Vantage AI", "Aim Vantage"]` for KG continuity)
- `SoftwareApplication` (with 3 `Offer` blocks for Starter/Pro/Premium)
- Per-route: `Product`, `FAQPage`, `HowTo`, `BreadcrumbList`, `Article`, `NewsArticle`, `Service`

---

## 12. PUBLIC FREE TOOLS (no signup, IP rate-limited)

All routed through Edge Middleware rate limits, with shared `getClientIp()` defense against X-Forwarded-For spoofing (Codex HIGH-02).

| Route | API | What it does |
|---|---|---|
| `/roast` | `/api/roast` | AI cover letter roast (10s, savage but constructive) |
| `/decode-rejection` | `/api/decode-rejection` | Decode rejection email → real verdict |
| `/ghost-job-check` | `/api/ghost-job-check` | Score job listing for ghost-job probability |
| `/ats/scanner` | client-side | ATS keyword scanner (in-browser, no API) |
| `/tools/jd-decoder` | client-side | JD analyser (regex-based) |
| `/tools/bullet-rewriter` | client-side | CV bullet rewriter |
| `/tools/layoff-playbook` | client-side | 30-day personalised playbook |
| `/tools/cover-letter-compare` | client-side | A/B compare 2 drafts |
| `/tools/negotiation-script` | client-side | Salary negotiation script |
| `/tools/offer-compare` | client-side | 4-yr total comp calculator |
| `/tools/reference-brief` | client-side | Reference call brief gen |
| `/tools/30-60-90-plan` | client-side | First-90-days plan |
| `/tools/why-leaving-framer` | client-side | "Why leaving?" answer framer |
| `/tools/thank-you-note` | client-side | Post-interview thank-you |
| `/tools/linkedin-about` | client-side | LinkedIn About rewriter |
| `/tools/recruiter-reply` | client-side | Recruiter cold-DM reply gen |
| `/tools/cold-email-hiring-manager` | client-side | ATS-bypass cold email |
| `/tools/star-story-builder` | client-side | STAR story builder |
| `/tools/glassdoor-decoder` | client-side | Glassdoor red-flag decoder |
| `/tools/career-risk-index` | client-side | 6-axis career risk score |

---

## 13. API SURFACE — `api/` directory (10 functions, under 12-function Hobby cap)

| File | Path(s) it serves | Auth | Notes |
|---|---|---|---|
| `api/analyze/index.ts` | `/api/analyze` | Bearer JWT | 60s timeout, SSRF-defended URL fetch |
| `api/rewrite-tone/index.ts` | `/api/rewrite-tone` | Bearer JWT | Honest-refund pattern (Codex HIGH-03) |
| `api/interview/[action].ts` | `/api/interview/questions`, `/api/interview/evaluate` | Bearer JWT | Pro+ only |
| `api/stripe/[action].ts` | `/api/stripe/checkout`, `/api/stripe/portal`, `/api/stripe/sync` | Bearer JWT | Sync is READ-ONLY (no longer cancels subs — CRIT-01) |
| `api/stripe/webhook.ts` | `/api/stripe/webhook` | Signature verified | Idempotency keys; never deletes data on retry |
| `api/user/index.ts` | `/api/credits`, `/api/analyses` (via rewrites) | Bearer JWT | Consolidated to stay under function limit |
| `api/roast/index.ts` | `/api/roast` | IP rate limit | Public, no auth |
| `api/decode-rejection/index.ts` | `/api/decode-rejection` | IP rate limit | Public |
| `api/ghost-job-check/index.ts` | `/api/ghost-job-check` | IP rate limit | Public |
| `api/admin/[action].ts` | `/api/admin/*` | `ADMIN_EMAILS` allowlist + JWT | Reply generator, etc. |
| `api/waitlist/index.ts` | `/api/waitlist` | IP rate limit | Public signup form |
| `api/[publicTool].ts` | catch-all (`/api/webmention`, etc.) | varies | IndieWeb endpoints |

---

## 14. FRONTEND ARCHITECTURE — `src/`

### Entry — `src/main.tsx`

Renders `<HelmetProvider><App /><Analytics /></HelmetProvider>`. Initialises Clarity + GA4 from env vars.

### Root — `src/App.tsx` (~780 lines)

- `<BrowserRouter>` wraps everything
- `<AuthContext.Provider>` — global user/profile state
- `<CurrencyProvider>` — currency switcher
- `<ThemeProvider>` — light/dark
- `<ScrollToTop />` — fires `trackPageView()` on route change
- `<React.Suspense fallback={spinner}>` — for lazy routes
- Routes table with per-route `<SEO>` + lazy-imported components
- ~50 routes covering: landing, auth flow, dashboard, account, pricing, all tool pages, all alternative pages, blog, sample, salary, etc.

### Library helpers — `src/lib/`

| File | Purpose |
|---|---|
| `supabase.ts` | Supabase client, `Profile` type, `mapAuthError`, profile fetch helpers |
| `ga4.ts` | GA4 loader, `trackPageView`, `trackEvent` (env-gated, DNT-aware) |
| `clarity.ts` | Microsoft Clarity loader (env-gated, DNT-aware) |
| `track.ts` | Internal `track()` event helper (used for ad CTAs, share events) |
| `useApplicationTracker.ts` | localStorage CRM for tracking applications (client-side only) |
| `useFocusTrap.ts` | a11y: trap focus in modals |
| `useFormDraft.ts` | autosave form input to localStorage |
| `useResultHistory.ts` | result page history navigation |
| `fetchWithTimeout.ts` | fetch wrapper with abort signal |
| `exportMarkdown.ts` | export results as markdown |
| `atsLint.ts` | client-side ATS scanner logic |

### Services — `src/services/api.ts`

Thin client wrapper around all `/api/*` endpoints. Auto-injects Bearer JWT from Supabase session.

### Components — `src/components/`

~60+ components. Critical-path eagerly imported (LandingPage, Login, Register, Dashboard, Account); marketing/blog/tool pages lazy-loaded for LCP.

### Edge middleware — `middleware.ts`

- 404 enforcement for unknown SPA routes (Codex HIGH-05)
- Rate limiting per IP per endpoint (in-memory; resets on cold start)
- Geo country cookie (`vantage-geo=GB`) for default currency
- IP defense uses `x-vercel-forwarded-for` (unspoofable) with fallback (Codex HIGH-02)

---

## 15. BUILD PIPELINE — `scripts/`

| Script | When it runs | What it does |
|---|---|---|
| `scripts/prerender-seo.mjs` | `npm run build` (post-bundle) | Generates `dist/<route>/index.html` for every slug route with proper `<title>`, `<meta>`, OG, JSON-LD baked in BEFORE React hydrates. Crawlers see these immediately. |
| `scripts/seo-routes.mjs` | imported by `prerender-seo.mjs` | Static-route SEO manifest (`/`, `/pricing`, `/about`, all tool pages, etc.) |
| `scripts/generate-feeds.mjs` | `npm run build` | Regenerates `public/rss.xml`, `public/atom.xml`, `public/feed.json` from `src/data/blogPosts*.ts` data files |
| `scripts/indexnow-ping.mjs` | manual after big changes | POSTs all sitemap URLs to Bing/Yandex/Seznam |
| `scripts/preflight.mjs` | manual `npm run preflight` | Local pre-deploy safety check |
| `scripts/new-blog-post.mjs` | manual `npm run blog:new` | Scaffolds a new blog post |
| `scripts/devto-crosspost.mjs` | manual | Cross-post to DEV.to |
| `scripts/hashnode-crosspost.mjs` | manual | Cross-post to Hashnode |
| `scripts/produce-v6-video.mjs` | manual | YouTube video gen (faceless AI narration) |
| `scripts/produce-walkthrough-video.mjs` | manual | Product walkthrough video |

---

## 16. EXTERNAL DASHBOARDS (where to monitor)

| Service | URL | What to check |
|---|---|---|
| **Vercel** | https://vercel.com/adlixirs-projects/aimvantage | Deploys, function logs, env vars, analytics |
| **Supabase** | https://supabase.com/dashboard/project/wgbizaesqrweqzotzfhb | Auth users, table rows, RLS, function logs |
| **Stripe** | https://dashboard.stripe.com | Customers, subscriptions, webhook attempts, payouts |
| **Resend** | https://resend.com/emails | Email logs, deliverability, bounce rate |
| **Google Analytics 4** | https://analytics.google.com (G-FMW9BX278N) | Realtime users, conversion funnels |
| **Google Search Console** | https://search.google.com/search-console?resource_id=sc-domain%3Aaimvantage.uk | Indexing status, search queries, click data |
| **Microsoft Clarity** | https://clarity.microsoft.com/projects/view/wmw4zvycgg | Heatmaps, session replays |
| **Namecheap** | https://ap.www.namecheap.com/domains/domaincontrolpanel/aimvantage.uk/advancedns | DNS records, domain renewal |
| **GitHub** | https://github.com/goofypluto999/aimvantage | Source, commits, PRs, Actions (if any) |
| **Microsoft Bing Webmaster** | https://www.bing.com/webmasters | (not yet set up; IndexNow proxies for now) |

---

## 17. EXTERNAL BACKLINKS & DIRECTORIES (where AimVantage is listed)

In `Organization.sameAs` JSON-LD:
1. https://cv-mirror-web.vercel.app/ — sister product (free ATS scanner)
2. https://www.producthunt.com/products/vantage-3 — Product Hunt listing (still needs name updated; you have an edit instruction in `docs/directory-rebrand-emails.md`)
3. https://theresanaiforthat.com/ai/vantage/ — TheresAnAIForThat directory
4. https://github.com/goofypluto999/aimvantage — source repo
5. https://dev.to/goofypluto999 — DEV.to author profile (updated with AimVantage bio 2026-05-15)
6. https://hashnode.com/@vantagelabs — Hashnode profile (updated 2026-05-15)
7. https://www.youtube.com/channel/UCuZxrV6LaJfGHsEvztsaB4Q — YouTube channel (still on a different Google account — not yet renamed)

In website footer ("Featured on"):
- https://submitaitools.org
- https://aitoolzdir.com

---

## 18. SECURITY LAYERS

1. **CSP** — strict allowlist (Stripe, Clarity, Bing, Supabase, Jina, fonts). `unsafe-inline` for scripts still present (MED-01 deferred — would require nonces).
2. **HSTS** — `max-age=63072000; includeSubDomains; preload`
3. **RLS on every Supabase table** — column-level REVOKE on sensitive profile fields
4. **RPC functions locked to `service_role`** — `add_tokens` / `deduct_tokens` cannot be called from client
5. **SSRF defense** in `/api/analyze`:
   - IPv6 bracket normalisation
   - DNS resolution check (blocks `[::1]`, `127/8`, `169.254/16`, etc.)
   - Octal/hex IPv4 detection
   - Re-check every redirect hop
6. **IP defense** — `x-vercel-forwarded-for` preferred over `x-forwarded-for` (which is spoofable)
7. **Webhook signature verification** — Stripe + Resend webhooks reject unsigned events on ALL environments (not just production)
8. **Open redirect fixed** in checkout/portal (success/cancel URLs whitelisted to same-origin)
9. **Prompt injection defense** — prompt/data separation, output sanitisation, score post-validation
10. **CSV formula injection defense** — tracker export prefixes `=`, `+`, `-`, `@`, `\t`, `\r`, `\n` values with `'` (CWE-1236)
11. **Rate limiting in Edge Middleware** — per-IP per-endpoint (in-memory, resets on cold start)
12. **Tone parameter allowlist** — `rewrite-tone` rejects anything not in `['Formal', 'Warm', 'Direct', 'Creative']`
13. **Error message sanitisation** — never leak raw Supabase errors to client

---

## 19. WHAT'S NOT BUILT YET (canonical "next" list)

From `HANDOFF.md` + this session's discoveries:

- ✅ **Token wallet rewrite** — see `WALLET-SPEC.md`. Status flipped to COMPLETE 2026-05-15 — additive `addTokensAtomic` on Stripe webhook, single `token_balance` column, RPC-gated, REVOKE on sensitive columns.
- ✅ **Results persistence wired to UI** — `AnalysisHistory` component in `Dashboard.tsx` lists past analyses from the `analyses` table (commit `0fe6733`).
- ✅ **Transactional emails** — Resend pipeline now used for 3 paths: purchase confirmation (`8af99e9`), low-balance warning (`18333a6`), refund confirmation (`233ef24`). Supabase Auth still uses Resend as SMTP relay.
- ✅ **Refund webhook handler** — `charge.refunded` deducts tokens proportionally and sends a confirmation email (`233ef24`).
- ✅ **Stripe LIVE mode** — confirmed live 2026-05-15. All secret-type env vars converted to Sensitive in Vercel.
- ✅ **Audit log** — `audit_log` table (commit `5f0116d`) + `lib/audit/log.ts` helper. Migration applied to Supabase 2026-05-15. Wired on Stripe purchase + refund events.
- ✅ **Server-side error tracking** — Sentry live in `foresay-labs` org as `aimvantage-server` project (commit `3a8c514` shipped helper + 2 critical handlers; `5eb2886` extended to 3 more = 5 total wired handlers).
- ✅ **Health endpoints** — `/api/health` + `/api/health-deep` (commit `6fc8bc2`). Multi-probe with 30s cache, authoritative Supabase + advisory Stripe/Resend/Gemini. Verified live.
- ✅ **CI build gate** — `vercel-build` chains `tsc --noEmit` first (commit `e69808d`) so TS errors fail deploys at build step.
- ✅ **Mobile perf** — Lighthouse re-measurement 2026-05-16: **Performance 79/100** (was 62, +17). LCP **3.0s** (was 5.8s, −2.8s). FCP 2.9s (was 4.5s, −1.6s). CLS 0.036 (still green). Accessibility 100, SEO 100, Best Practices 92. Mobile-first paid-acquisition strategy is now viable. To reach 90+ would need: forced-reflow fix, render-blocking-3rd-party reduction, more main-thread work splitting.
- ✅ **GA4 `purchase` event has real `value`** — server bundled into `5eb2886` (success_url carries amount + currency), client completed in `5f39e33` (Dashboard reads + validates + ships only when finite). GA4 monetization reports now reflect real revenue.
- ✅ **Server observability (Sentry / Resend / audit_log)** — RESOLVED 2026-05-17 via Strategy B (commit `d4a769f`). After 6-attempt bundling postmortem (lib/, api/_lib/, api/shared/, `includeFiles`, underscore renames — all failed with `ERR_MODULE_NOT_FOUND`), all helpers are inlined real per-function. See `SESSION-2026-05-17-BUNDLING-ODYSSEY.md` for the full forensic trail.
- ✅ **Post-deploy smoke test** — `scripts/smoke-test-deploy.mjs` + `npm run smoke` alias. 10 critical endpoints checked for JSON body + expected status. Catches "Vercel Ready but crashing" deploys in seconds. Must be 10/10 after every API change.
- ✅ **Page-flash UX fix** — `null` Suspense fallback in `App.tsx` (commit `8070129`). SSG-prerendered routes no longer get wiped to a colored spinner during lazy-chunk hydration.
- ⏳ **Admin/CRM dashboard** — `api/admin` endpoint exists; no UI surface.
- ⏳ **Email onboarding sequence** — Day-1 / Day-3 drip campaign (needs Vercel cron + idempotency).
- ⏳ **2FA / TOTP** — Supabase Auth supports it; not wired. Defer until B2B asks.
- ⏳ **AggregateRating JSON-LD** — explicitly avoided (don't fake ratings — see `dist/blog/i-shipped-fake-review-schema-then-caught-myself`).
- ⏳ **`unsafe-inline` removal from CSP** — MED-01 from LLM Council (~100-250 LOC). Risky for inline JSON-LD.
- ⏳ **Backend test suite** — none. Scaffold on request.
- ⏳ **UptimeRobot 3 monitors** — endpoints ready + verified; point monitors at `/`, `/api/health`, `/api/health-deep` with keyword `"status":"ok"`.
- ⏳ **Stripe restricted key swap** — `STRIPE_SECRET_KEY` still full-scope. Recommended hygiene; not blocking. ~15 min via Stripe dashboard.

---

## 20. KEY DECISIONS LOG (why things are the way they are)

- **Domain stays `aimvantage.uk`** — domain age asset, GSC indexing built up. Not renaming.
- **Brand mark = `AimVantage` (closed compound)** — bare "Vantage" SERP is owned by Vantage Markets, Vantage Data Centers, Aston Martin Vantage. AimVantage has zero collision.
- **Legacy "Vantage" preserved as `alternateName` in JSON-LD** — protects Knowledge Graph entity continuity. Google won't fragment our entity.
- **Sole trader, NOT Ltd** — operator legally is Giovanni Sizino Ennes as a sole trader. Earlier doc mentioned "Vantage AI Consulting Limited" / Companies House 16888728 — that does NOT appear to be the production state. The site explicitly disclaims being a registered company.
- **Resend on `adlixir.uk@gmail.com` Gmail** — Foresay's Resend account (on hotmail) used the 1 free domain slot. New account spun up to give AimVantage its own slot.
- **GA4 measurement ID `G-FMW9BX278N` lives in env var** — `VITE_GA_MEASUREMENT_ID`. Code is env-gated so it gracefully no-ops in dev.
- **MX record at `send.aimvantage.uk` required Custom MX in Namecheap** — Namecheap Advanced DNS hides MX from its dropdown; only Mail Settings → Custom MX exposes it. This forced removing the default Namecheap email forwarding TXT at `@`.
- **No custom Google OAuth consent screen** — Sign-in-with-Google uses Supabase's default proxy. If you ever want the consent screen to say "AimVantage" instead of "Supabase", create a Google Cloud OAuth app + add credentials to Supabase → Auth → Providers → Google.
- **Stripe products renamed via direct API (not CLI)** — Stripe CLI was logged into the Wadda Play account locally. We bypassed by pulling production `STRIPE_SECRET_KEY` from Vercel and calling Stripe's REST API directly.

---

## 21. DEV / LOCAL COMMANDS

```bash
# Install
npm install

# Local dev (http://localhost:3000)
npm run dev

# Production build (runs prerender-seo + generate-feeds)
npm run build

# TypeScript check (must be 0 errors before any push)
npx tsc --noEmit

# IndexNow ping (after big content updates)
node scripts/indexnow-ping.mjs

# Pull Vercel env vars locally (gitignored)
npx vercel env pull .env.local --environment=production --yes

# Trigger redeploy without code changes
git commit --allow-empty -m "..." && git push
```

---

## 22. FILES YOU SHOULD READ IF YOU'RE A NEW CLAUDE SESSION

In order:

1. **`CLAUDE.md`** — project conventions, critical import rules
2. **This file (`PROJECT-INDEX.md`)** — the canonical system map
3. **`HANDOFF.md`** — what's broken / what's next priority-ordered
4. **`SESSION-2026-05-15-COMPLETE.md`** — the full rebrand session ledger
5. **`REBRAND-HANDOFF.md`** — manual external steps if rebrand follow-ups
6. **`WALLET-SPEC.md`** — token wallet rewrite spec (when that becomes priority)
7. **`SECURITY-AUDIT.md`** — 2026-04-11 hardening pass (Codex audits since are in `audit-report.md`)
8. **`database/schema.sql`** — full DB schema with RLS + RPC functions
9. **`vercel.json`** — function timeouts, CSP, all headers
10. **`middleware.ts`** — Edge runtime: 404 enforcement + rate limits + geo cookie

---

_Generated 2026-05-15 by Claude during the rebrand session as a comprehensive snapshot. Update when major systems change._
