# Vantage -- Agent Handoff Document

**Date:** 2026-04-11
**Status:** Auth + Payments built, but token/credit system is broken and needs a rewrite.

---

## What Is Vantage?

AI-powered job preparation SaaS. User uploads CV + job URL, gets:
- Company intelligence snapshot (auto-scraped from URL + Gemini Google Search)
- Role/CV fit analysis with score
- Strategic brief and narrative angle
- Personalised cover letter (4 tones: Formal / Warm / Direct / Creative)
- Presentation outline
- Interview prep flashcards + AI mock interview with voice

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin -- NO config file) |
| Animations | Framer Motion (`motion/react` import, NOT `framer-motion`) |
| 3D (landing) | Three.js + `@react-three/fiber` + `@react-three/drei` |
| AI | `@google/genai` SDK -- model: `models/gemini-2.5-flash` |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL with RLS |
| Payments | Stripe (subscriptions via checkout sessions + webhooks) |
| Backend | Vercel serverless functions (TypeScript, in `api/` directory) |
| Doc parsing | `mammoth` (DOCX to text, client-side) |
| Speech | Web Speech API (`SpeechRecognition`) |
| Icons | `lucide-react` |

---

## What Works (DO NOT BREAK THESE)

These features have been live-tested and verified working:

1. **Landing page** -- Full glassmorphic design, 3D globe, all sections render correctly in light/dark mode
2. **Auth flow** -- Register, login, logout, Google OAuth, forgot/reset password all work
3. **CV upload** -- PDF, DOCX, and TXT files parse correctly
4. **URL scraping** -- Server-side scraper with soft 404 detection, JSON-LD extraction, minimum content length checks
5. **AI analysis** -- Gemini generates all sections (company snapshot, match points, strategic brief, cover letter, presentation, fit score)
6. **Cover letter tone switching** -- All 4 tones work, results cached in a Map ref
7. **Interview prep flashcards** -- Toggle on/off, Q&A format
8. **AI mock interview** -- Server-side question generation + answer evaluation, Pro/Premium gated
9. **Dark/light theme** -- Full theme system via ThemeContext, persists in localStorage
10. **Dark background CSS** -- `html, body { background: #0d0b1e; }` prevents white flash on results page

---

## What's Broken (THIS IS YOUR MAIN JOB)

### The Token/Credit System

The current implementation uses `credits_total` and `credits_used` fields. The problem: when a user upgrades plans, `credits_total` gets SET to a fixed value instead of ADDING tokens.

**Current broken behavior:**
- User signs up -> gets starter plan -> `credits_total = 10`, `credits_used = 0` -> 10 remaining (correct)
- User runs 3 analyses (costs 9 credits) -> `credits_total = 10`, `credits_used = 9` -> 1 remaining (correct)
- User upgrades to Pro -> webhook sets `credits_total = 30`, preserves `credits_used = 9` -> 21 remaining
- **BUT**: the user expected to ADD 30 tokens to their remaining 1, giving them 31 total

**Where the bug lives:**
1. `api/stripe/webhook.ts` line 105: `credits_total: PLAN_CREDITS[plan] || 10` -- REPLACES instead of ADDS
2. `api/stripe/sync.ts` line 123: `credits_total: newCreditsTotal` -- same bug, REPLACES instead of ADDS
3. `api/stripe/checkout.ts` line 80-88: cancels existing subscription before creating new one, which can trigger `subscription.deleted` webhook that zeroes out credits

**The user wants a complete rewrite. See `WALLET-SPEC.md` for the exact requirements.**

### Additional Issues

- Stripe checkout cancels the old subscription immediately (line 80-88 in checkout.ts), which fires a `subscription.deleted` webhook that can race with the `checkout.session.completed` webhook and zero out the user's credits
- The sync endpoint (`api/stripe/sync.ts`) also replaces credits instead of adding
- No purchase history -- user can't see what they bought or when

---

## Profile Schema (Supabase)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'starter',
  credits_total INTEGER NOT NULL DEFAULT 10,
  credits_used INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Auto-created on signup via `handle_new_user()` trigger. RLS enabled -- users can only access their own row.

---

## Credit Costs

| Action | Credits |
|--------|---------|
| Full job analysis | 3 |
| Cover letter tone rewrite | 1 |
| Interview question generation | 2 |
| Interview answer evaluation | 0 (free, but Pro/Premium only) |

---

## Plan Tiers

| Plan | Credits Given | Price |
|------|--------------|-------|
| Starter | 10 | ~$5 |
| Pro | 30 | ~$12 |
| Premium | 60 | ~$20 |

---

## Environment Variables (Vercel)

```
# Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...                    # Same as VITE_ version, for serverless functions
SUPABASE_SERVICE_ROLE_KEY=...       # Service role key (server-side only)

# Gemini
VITE_GEMINI_API_KEY=...
GEMINI_API_KEY=...                  # Same key, for serverless functions

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_STARTER=...           # (or STRIPE_STARTER_PRICE_ID)
STRIPE_PRICE_PRO=...               # (or STRIPE_PRO_PRICE_ID)
STRIPE_PRICE_PREMIUM=...           # (or STRIPE_PREMIUM_PRICE_ID)
```

---

## Dev Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000
npm run build        # Production build
npx tsc --noEmit     # TypeScript check (MUST be clean)
```

Deployed on Vercel. Serverless functions are in `api/` directory, auto-deployed by Vercel.

---

## Critical Rules (READ THESE)

1. **Framer Motion import**: `import { motion } from 'motion/react'` -- NOT `framer-motion`
2. **Gemini model string**: Must be `'models/gemini-2.5-flash'` (needs the `models/` prefix)
3. **Gemini constraint**: `googleSearch` tool and `responseMimeType: 'application/json'` are MUTUALLY EXCLUSIVE. Never combine both.
4. **Tailwind v4**: No `tailwind.config.js`. Uses `@import "tailwindcss"` in CSS.
5. **CSS 3D transforms**: Tailwind v4 doesn't reliably apply `preserve-3d` and `backface-hidden`. Always use inline styles for 3D CSS.
6. **Supabase auth deadlock**: The `onAuthStateChange` callback must NOT await Supabase DB queries. Profile fetch is deferred with a 50ms `setTimeout` to avoid internal lock conflicts. See `App.tsx` lines 76-91.
7. **Always run `npx tsc --noEmit`** after any code changes and fix all errors before finishing.
8. **Dark background**: `html, body { background: #0d0b1e; }` in `index.css` prevents white flash. Do not remove.

---

## Deployment

- **Frontend + API**: Vercel (single project, `vercel.json` routes API calls to serverless functions)
- **Database**: Supabase (hosted PostgreSQL)
- **Payments**: Stripe (test mode, `sk_test_` keys)
- **Stripe webhook**: Must be configured in Stripe Dashboard to point to `https://your-domain.vercel.app/api/stripe/webhook`

---

## What's NOT Built Yet

- Results persistence (analyses table exists but not wired up)
- Email onboarding / transactional emails
- Analytics
- Mobile optimization pass
- Real plan enforcement after wallet rewrite
