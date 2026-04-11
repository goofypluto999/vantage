# Vantage -- File Map

Every critical file and its purpose. Read this to understand what lives where.

---

## Root Config

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude agent context -- tech stack, architecture, critical rules, theme system |
| `HANDOFF.md` | Full handoff doc -- what works, what's broken, env vars, deployment |
| `WALLET-SPEC.md` | Exact requirements for the token wallet rewrite |
| `vercel.json` | Vercel config -- routes API calls to serverless functions, 60s timeout on analyze |
| `vite.config.ts` | Vite config -- port 3000, Tailwind v4 plugin |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies and scripts |
| `.env` | Environment variables (gitignored) |

---

## Frontend -- Core

| File | Purpose | Lines |
|------|---------|-------|
| `src/App.tsx` | Auth context, routing, protected routes | ~209 |
| `src/main.tsx` | Entry point | ~10 |
| `src/index.css` | Tailwind import, design tokens, glassmorphism utilities, dark bg fix | ~184 |
| `src/contexts/ThemeContext.tsx` | Light/dark theme system, `useTheme()` hook | ~150 |
| `src/lib/supabase.ts` | Supabase client, Profile type, auth helpers, credit helpers | ~105 |
| `src/services/api.ts` | All API calls with auth token injection | ~206 |

---

## Frontend -- Components

| File | Purpose | Lines |
|------|---------|-------|
| `src/components/LandingPage.tsx` | Landing page -- hero, globe, features, pricing, FAQ | ~996 |
| `src/components/Dashboard.tsx` | Main workspace -- upload, results, cover letter, interview prep | ~754 |
| `src/components/AIInterviewSession.tsx` | Live AI mock interview with voice transcription | ~400 |
| `src/components/InterviewPrep.tsx` | Flashcard UI for interview prep | ~200 |
| `src/components/Account.tsx` | User account page -- profile, subscription, billing | ~300 |
| `src/components/Pricing.tsx` | Pricing page with plan cards | ~200 |
| `src/components/Login.tsx` | Login form (email + Google OAuth) | ~150 |
| `src/components/Register.tsx` | Registration form | ~150 |
| `src/components/ForgotPassword.tsx` | Password reset request | ~100 |
| `src/components/ResetPassword.tsx` | Password reset form | ~100 |
| `src/components/CookieConsent.tsx` | Cookie consent banner | ~50 |
| `src/components/CookiePolicy.tsx` | Cookie policy page | ~100 |
| `src/components/PrivacyPolicy.tsx` | Privacy policy page | ~100 |
| `src/components/TermsOfService.tsx` | Terms of service page | ~100 |
| `src/components/Waitlist.tsx` | Waitlist signup component | ~80 |
| `src/components/DemoWalkthrough.tsx` | Demo walkthrough component | ~100 |

---

## Backend -- API Endpoints (Vercel Serverless)

| File | Endpoint | Method | Auth | Credits | Purpose |
|------|----------|--------|------|---------|---------|
| `api/analyze/index.ts` | `/api/analyze` | POST | Yes | 3 | URL scraping + Gemini analysis (main feature) |
| `api/credits/index.ts` | `/api/credits` | GET | Yes | 0 | Check user's credit balance |
| `api/rewrite-tone/index.ts` | `/api/rewrite-tone` | POST | Yes | 1 | Rewrite cover letter in new tone |
| `api/interview/questions.ts` | `/api/interview/questions` | POST | Yes | 2 | Generate 5 interview questions (Pro+) |
| `api/interview/evaluate.ts` | `/api/interview/evaluate` | POST | Yes | 0 | Evaluate interview answer (Pro+) |
| `api/stripe/checkout.ts` | `/api/stripe/checkout` | POST | Yes | 0 | Create Stripe checkout session |
| `api/stripe/webhook.ts` | `/api/stripe/webhook` | POST | No* | 0 | Stripe webhook handler |
| `api/stripe/sync.ts` | `/api/stripe/sync` | POST | Yes | 0 | Fallback sync from Stripe after checkout |
| `api/stripe/portal.ts` | `/api/stripe/portal` | POST | Yes | 0 | Create Stripe billing portal session |
| `api/waitlist/index.ts` | `/api/waitlist` | GET/POST | No | 0 | Join waitlist / get count |

*Webhook uses Stripe signature verification instead of Bearer token auth.

---

## Database

| File | Purpose |
|------|---------|
| `database/schema.sql` | Full SQL schema -- profiles, analyses, waitlist, api_usage tables + RLS + triggers |

---

## Static Assets

| Path | Purpose |
|------|---------|
| `public/frames/` | 49 WebP frames (unused, from old scroll animation) |
| `index.html` | HTML entry point with font preloads |

---

## Key Data Flow

```
User uploads CV + URL
    |
    v
Dashboard.tsx -> api.ts.analyzeJob()
    |
    v
fetchWithAuth('/analyze', { cvText, jobUrl })
    |
    v
api/analyze/index.ts:
  1. Verify auth token
  2. Check credits (>= 3)
  3. Scrape jobUrl (fetch + cheerio-like extraction)
  4. Send CV text + scraped content to Gemini
  5. Parse JSON response
  6. Deduct 3 credits
  7. Return results
    |
    v
Dashboard.tsx displays results in cards
```

---

## Files Involved in Token System (YOUR FOCUS)

```
api/stripe/checkout.ts     -- Creates checkout, cancels old sub (race condition source)
api/stripe/webhook.ts      -- Handles checkout.completed, sub.updated, sub.deleted
api/stripe/sync.ts         -- Fallback sync after checkout return
api/credits/index.ts       -- Returns current balance
api/analyze/index.ts       -- Deducts 3 credits on analysis
api/rewrite-tone/index.ts  -- Deducts 1 credit on tone rewrite
api/interview/questions.ts -- Deducts 2 credits on question gen
src/lib/supabase.ts        -- Profile type, getCreditsRemaining(), hasCredits()
src/components/Dashboard.tsx -- Displays balance, checks before actions
src/components/Account.tsx  -- Shows subscription/balance info
database/schema.sql         -- Table definition with credits_total, credits_used
```
