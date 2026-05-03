# VANTAGE AI — FULL SESSION HANDOFF
**Date:** 2026-04-12
**From:** Security hardening + subscription fix session
**To:** Next Claude session — CRM, Stripe live mode, subscription validation, promotion prep

---

## WHAT VANTAGE IS

Vantage AI is a job preparation SaaS. Users upload their CV, paste/link a job listing, and get back:
- Company intelligence snapshot (name, industry, culture, recent news)
- CV fit score (0-100, calibrated)
- Strategic brief (company context, role requirements, CV alignment, narrative angle)
- Tailored cover letter (with tone rewriting: Formal/Warm/Direct/Creative)
- Interview prep pack (AI-generated Q&A flashcards)
- AI mock interview (speech recognition, live evaluation)
- Presentation deck (6 slides)

**Live URL:** https://aimvantage.uk/
**Owner:** Giova (adlixir on Vercel)

---

## TECH STACK

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite 6 + Tailwind CSS v4 |
| Animations | motion/react (Framer Motion) -- NEVER change this import |
| 3D | Three.js + @react-three/fiber + drei (landing page globe) |
| Backend | Vercel serverless functions (TypeScript, `api/` directory) |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL with RLS |
| Payments | Stripe subscriptions (checkout + webhooks + billing portal) |
| AI | Google Gemini 2.5 Flash (`@google/genai`, model ID: `models/gemini-2.5-flash`) |
| Doc parsing | mammoth (DOCX), base64 (PDF -- Gemini parses natively) |
| Deployment | Vercel (frontend + serverless) |

---

## PROJECT STRUCTURE

```
C:\Cloaude Logic\vantage\
+-- api/                          # Vercel serverless functions
|   +-- analyze/index.ts          # Main AI analysis (679 lines, 60s timeout)
|   +-- rewrite-tone/index.ts     # Cover letter tone rewrite (1 token)
|   +-- interview/questions.ts    # Interview Q&A generation (2 tokens, Pro+)
|   +-- interview/evaluate.ts     # Answer evaluation (free, Pro+)
|   +-- stripe/checkout.ts        # Create Stripe checkout session
|   +-- stripe/webhook.ts         # Stripe webhook handler (signature verified)
|   +-- stripe/sync.ts            # Fallback subscription sync
|   +-- stripe/portal.ts          # Stripe billing portal session
|   +-- credits/index.ts          # GET token balance
|   +-- waitlist/index.ts         # Public waitlist signup
+-- src/
|   +-- App.tsx                   # Routes, auth context, ErrorBoundary
|   +-- lib/supabase.ts           # Supabase client, Profile type, helpers
|   +-- services/api.ts           # All API client functions
|   +-- components/
|       +-- LandingPage.tsx       # Marketing page (1028 lines)
|       +-- Dashboard.tsx         # Main workspace (842 lines)
|       +-- AIInterviewSession.tsx # Mock interview (1013 lines)
|       +-- Account.tsx           # User settings + subscription
|       +-- Pricing.tsx           # Plan cards + checkout
|       +-- Login.tsx / Register.tsx / ForgotPassword.tsx / ResetPassword.tsx
|       +-- InterviewPrep.tsx     # Flashcard prep
|       +-- Waitlist.tsx          # Early access signup
|       +-- CookieConsent.tsx / legal pages
+-- database/schema.sql           # Full DB schema (run in Supabase SQL Editor)
+-- vercel.json                   # Deployment config, security headers, timeouts
+-- CLAUDE.md                     # Project-level instructions
+-- HANDOFF.md                    # THIS FILE
```

---

## SECOND BRAIN (LightRAG)

A dedicated knowledge graph for Vantage runs on **port 9622** (separate from Foresay on 9621).

**Location:** `C:\Cloaude Logic\vantage-brain\` (17 Obsidian notes)
**Start manually:** `& "C:\Cloaude Logic\vantage-brain\lightrag-service.bat"`
**Re-index after edits:** `"C:\Users\giova\AppData\Local\Programs\Python\Python313\python.exe" "C:\Cloaude Logic\vantage-brain\index-vault.py"`

**Key notes:**
- `stripe-integration.md` -- Full subscription lifecycle, race conditions, historical bugs
- `security-hardening.md` -- Complete audit results and fixes applied
- `token-system.md` -- Atomic operations, additive model, never expire
- `database-schema.md` -- Tables, RLS, RPC functions
- `ai-analysis.md` -- Scraping pipeline, Gemini prompts, anti-hallucination
- `debug-log.md` -- All past bugs and how they were fixed

**Query the brain before making complex changes.**

---

## DATABASE (Supabase)

### Tables
- **profiles** -- User data, plan, token_balance, Stripe IDs, subscription_status
- **analyses** -- Saved job analysis results (JSONB)
- **waitlist** -- Pre-signup emails
- **api_usage** -- Audit trail for rate limiting

### Security (Hardened 2026-04-11)
- RLS enabled on ALL tables
- Column-level REVOKE on sensitive fields (plan, token_balance, stripe_*, subscription_status)
- `add_tokens` and `deduct_tokens` RPC locked to service_role only
- Input validation: amounts must be positive, add_tokens capped at 1000/call

### Subscription Status CHECK Constraint
**CRITICAL:** The constraint MUST include 'cancelling'. If it doesn't, webhook/sync writes silently fail.
```sql
CHECK (subscription_status IN ('inactive', 'active', 'cancelling', 'cancelled', 'past_due'))
```

If not yet applied, run:
```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check
  CHECK (subscription_status IN ('inactive', 'active', 'cancelling', 'cancelled', 'past_due'));
```

---

## STRIPE INTEGRATION

### Plans (TEST MODE -- NOT LIVE YET)
| Plan | Price | Tokens | Env Var |
|------|-------|--------|---------|
| Starter | 5 GBP/mo | 10 | `STRIPE_PRICE_STARTER` |
| Pro | 12 GBP/mo | 30 | `STRIPE_PRICE_PRO` |
| Premium | 20 GBP/mo | 60 | `STRIPE_PRICE_PREMIUM` |

### Subscription Lifecycle
```
active (green) -> cancelling (amber) -> cancelled (amber, period ended)
```

### Token Model
- Tokens are **additive** -- buying a new plan ADDS tokens to existing balance
- Tokens **never expire**, even after cancellation (user paid for them)
- Tokens are **never replaced** -- old balance + new purchase = total
- Atomic operations via PostgreSQL RPC (no race conditions on balance)

### Key Flows
1. **Checkout:** Frontend -> `/api/stripe/checkout` -> Stripe hosted page -> `/dashboard?success=true` -> sync fallback + webhook
2. **Webhook:** Stripe -> `/api/stripe/webhook` -> verify signature -> update plan/status/tokens
3. **Sync:** Frontend calls `/api/stripe/sync` as fallback -> reads Stripe API -> updates DB
4. **Cancellation:** Stripe sets `cancel_at_period_end=true` -> webhook/sync detect -> status = 'cancelling'
5. **Portal:** `/api/stripe/portal` -> Stripe billing portal

### Historical Bugs (ALL FIXED in code, need SQL migration to fully work)
- Plan not updating after downgrade (sync picked highest-tier including cancelling subs)
- Webhook ignoring new subscription events (sub ID mismatch = silent drop)
- Dashboard not syncing on mount (only synced after checkout return)
- subscription_status CHECK constraint missing 'cancelling' (DB rejects writes silently)

---

## SECURITY HARDENING (Completed 2026-04-11)

### Fixed in Code (deployed)
- RLS column lockdown + RPC functions locked to service_role
- SSRF: manual redirect following, comprehensive IP blocklist
- Prompt injection: prompt/data separation, score post-validation
- Webhook: rejects unsigned events on all Vercel environments
- CSP + HSTS headers
- Open redirect fixed (checkout/portal + frontend Stripe URL validation)
- Stale .env file deleted, .gitignore catch-all
- Tone parameter allowlist, error message sanitization

### Needs SQL Migration (may or may not have been run yet)
- Column-level REVOKE on sensitive profile fields
- RPC EXECUTE revoked from authenticated/anon
- CHECK constraint updated for 'cancelling'
- Input validation on RPC functions

### Still Needs (future work)
- Rate limiting (Vercel Edge Middleware or Upstash Redis)
- Webhook/sync race condition (DB-level idempotency key)
- Auth error message mapping (raw Supabase errors shown in login forms)

---

## WHAT MUST HAPPEN NEXT (PRIORITY ORDER)

### 1. VERIFY SQL MIGRATION WAS RUN
```sql
-- Check constraint includes 'cancelling':
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass AND contype = 'c';

-- Check RPC is locked down:
SELECT has_function_privilege('authenticated', 'add_tokens(uuid, integer)', 'EXECUTE');
-- Should return FALSE
```
If not applied, the full migration SQL is in `database/schema.sql`.

### 2. VERIFY SUBSCRIPTION SYSTEM END-TO-END
Subscribe -> check tokens -> cancel -> check status shows 'Cancelling' -> subscribe to different plan -> check plan updates

### 3. SWITCH STRIPE TO LIVE MODE
- Create live products in Stripe Dashboard (same 3 plans, GBP)
- Update all `STRIPE_*` env vars in Vercel with live keys
- Set up live webhook endpoint -> get new `STRIPE_WEBHOOK_SECRET`
- Redeploy

### 4. BUILD ADMIN/CRM VISIBILITY
Giova currently has ZERO visibility into signups, payments, cancellations, or usage. Options:
- **Minimum:** Stripe Dashboard (already works) + Supabase table queries
- **Better:** Admin API endpoint + simple admin page
- **Best:** Email notifications on new signups/cancellations + admin dashboard

### 5. DEFINE REFUND POLICY
- Stripe handles refunds natively
- Need webhook handler for `charge.refunded` to deduct tokens
- Policy decision: full refund within X days? Pro-rated? Tokens kept or removed?

### 6. PROMOTION PREP (2+ sessions away)
- Stripe live mode working
- Admin visibility exists
- Landing page real testimonials
- Email onboarding

---

## CONVENTIONS

- **TypeScript:** Always run `npx tsc --noEmit` after changes, zero errors required
- **Framer Motion:** Import from `motion/react` ONLY
- **Tailwind CSS v4:** No config file. 3D transforms use inline styles.
- **Gemini:** Model ID = `models/gemini-2.5-flash`. googleSearch and responseMimeType are mutually exclusive.
- **Git:** New commits only (never amend). Conventional messages.
- **Security:** All API endpoints validate auth. Never expose service keys. Tokens via RPC only.

---

## ENV VARS (names only)

```
VITE_SUPABASE_URL            # Public
VITE_SUPABASE_ANON_KEY       # Public
SUPABASE_URL                 # Server-side
SUPABASE_SERVICE_ROLE_KEY    # Server-side ONLY

GEMINI_API_KEY               # Server-side
VITE_GEMINI_API_KEY          # Reference only

VITE_STRIPE_PUBLISHABLE_KEY  # Public
STRIPE_SECRET_KEY            # Server-side ONLY
STRIPE_WEBHOOK_SECRET        # Server-side ONLY
STRIPE_PRICE_STARTER         # Price ID
STRIPE_PRICE_PRO             # Price ID
STRIPE_PRICE_PREMIUM         # Price ID
```

---

## FIRST ACTIONS FOR NEXT SESSION

1. Read this handoff + `CLAUDE.md`
2. Start LightRAG: `& "C:\Cloaude Logic\vantage-brain\lightrag-service.bat"`
3. Query brain for any context needed
4. Verify SQL migration applied (run check queries above)
5. Test subscription end-to-end
6. Proceed with Giova's priorities
