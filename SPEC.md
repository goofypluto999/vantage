# Vantage — Full Stack SaaS Specification

## Project Overview

**Vantage** is an AI-powered job preparation SaaS web application. This document specifies the full-stack production version with authentication, payments, credit system, and waitlist functionality.

---

## Architecture

### Tech Stack
| Component | Technology |
|-----------|------------|
| Frontend Framework | React 19 + TypeScript + Vite 6 |
| Backend | Vercel Serverless Functions (API Routes) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Google OAuth + Email) |
| Payments | Stripe (Subscriptions) |
| Styling | Tailwind CSS v4 |
| Animations | GSAP + Motion (Framer Motion) |
| 3D (Landing) | Three.js + @react-three/fiber |

### Deployment
- **Frontend**: Vercel (automatic deployment from GitHub)
- **API**: Vercel Serverless Functions
- **Database**: Supabase (hosted PostgreSQL)
- **Assets**: Vercel CDN

---

## Pricing & Credit Model

### Subscription Tiers
| Plan | Monthly Price | Monthly Analyses | Cost Per Analysis | Notes |
|------|---------------|------------------|-------------------|-------|
| Starter | £5 | 10 analyses | £0.25 | ~50% profit margin |
| Pro | £12 | 30 analyses | £0.25 | ~62% profit margin |
| Premium | £20 | 60 analyses | £0.25 | ~75% profit margin |

### Credit System Rules
- Credits reset on the 1st of each month
- Unused credits do NOT roll over (simplicity)
- Each job analysis costs 2 credits (includes company research, cover letter, interview pack)
- AI Mock Interview costs 1 credit per question answered
- Fit Score Analysis (Premium) costs 3 credits
- Buffer: 15% extra cost estimate included in pricing

### Profit Calculation (with 15% buffer)
- **Starter (10 @ £5)**: £0.25 × 10 × 1.15 = £2.88 cost → 42% profit
- **Pro (30 @ £12)**: £0.25 × 30 × 1.15 = £8.63 cost → 28% profit (adjusted to ~60%)
- **Premium (60 @ £20)**: £0.25 × 60 × 1.15 = £17.25 cost → 14% profit (adjusted to ~75%)

### Credit System Rules
- Credits reset on the 1st of each month
- Unused credits do NOT roll over (simplicity)
- Each job analysis costs ~2 credits (includes company research, cover letter, interview pack)
- AI Mock Interview costs 1 credit per question answered
- Fit Score Analysis (Premium) costs 3 credits

### Cost Analysis
- Gemini 2.5 Flash: ~$0.075/input million tokens, ~$0.30/output million tokens
- Average job analysis: ~500 input tokens, ~3000 output tokens = ~$0.001 per analysis
- With 15% buffer + safety margin: ~£0.25 per analysis
- **Starter (10 analyses @ £5)**: £0.25 × 10 = £2.50 cost = 50% profit
- **Pro (30 analyses @ £12)**: £0.25 × 30 = £7.50 cost = 38% profit → adjusted to 62%
- **Premium (60 analyses @ £20)**: £0.25 × 60 = £15 cost = 25% profit → adjusted to 69%

---

## Database Schema (Supabase)

### Tables

```sql
-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'premium')),
  credits_total INTEGER NOT NULL DEFAULT 10,
  credits_used INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'cancelled', 'past_due')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ANALYSES (user's saved job analyses)
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  job_title TEXT,
  job_url TEXT,
  results_json JSONB,
  credits_spent INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WAITLIST
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'website',
  converted_to_user BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. API USAGE (rate limiting & billing)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  credits_consumed INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Analyses: users can only see their own analyses
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Waitlist: open for signup, admin only for viewing
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH (true);
```

---

## API Endpoints (Vercel Serverless)

### Authentication
- `GET /api/auth/google` — Initiate Google OAuth
- `GET /api/auth/callback` — OAuth callback handler
- `POST /api/auth/logout` — Clear session

### Credits
- `GET /api/credits` — Get user's credit balance
- `POST /api/credits/purchase` — Purchase more credits (future)

### Analysis
- `POST /api/analyze` — Main job analysis endpoint
  - Requires authentication
  - Validates credit balance
  - Returns job intelligence

### Waitlist
- `POST /api/waitlist` — Join waitlist (email + optional name)
- `GET /api/waitlist/count` — Get waitlist count (public)

### Stripe
- `POST /api/stripe/checkout` — Create checkout session
- `POST /api/stripe/webhook` — Handle Stripe webhooks

---

## Frontend Pages & Routes

```
/                     → Landing page + Waitlist
/dashboard            → Main app (requires auth)
/auth/login           → Login page
/auth/register        → Registration page
/auth/verify          → Email verification
/pricing              → Pricing page
/privacy              → Privacy policy (GDPR)
/terms                → Terms of service
```

---

## Waitlist Feature (Pre-Launch)

### Two Options on Landing Page
1. **Join Waitlist** (free): Email + name → saved to waitlist table → thank you message + countdown timer
2. **Pre-order Now** (paid): Email + name + payment → creates user account + credits → immediate access

### Countdown Timer
- Shows days/hours/minutes/seconds until launch
- Animated with GSAP for slick feel
- Updates every second
- Message: "Launching in X days — be ready"

### Waitlist Flow
```
Landing Page
    ├── Option A: "Join Waitlist"
    │   ├── User enters email + name
    │   ├── POST /api/waitlist
    │   ├── Save to waitlist table
    │   ├── Show: "You're on the list! [Countdown to launch]"
    │   └── Redirect to waitlist view with countdown
    │
    └── Option B: "Pre-order Now" 
        ├── User enters email + name
        ├── User pays £5/£12/£20
        ├── POST /api/auth/register + Stripe checkout
        ├── Create user + profile + start subscription
        ├── Show: "Welcome! [Quick tour]"
        └── Redirect to dashboard
```

---

## Demo/Playthrough Feature

### Implementation
- Interactive walkthrough on landing page
- Pre-filled sample CV + job URL
- Step-by-step explanation of features
- "Try it now" CTA after demo

### Steps (5 total)
1. "Upload your CV" → sample CV shown
2. "Add job URL" → sample URL shown
3. "Select outputs" → checkboxes animated
4. "Generate" → loading animation
5. "See results" → sample results shown

---

## GDPR Compliance

### Requirements (UK)
1. **Cookie Consent Banner** — Before setting analytics/auth cookies
2. **Privacy Policy Page** — Data collected, purpose, retention, rights
3. **Terms of Service** — Legal agreement
4. **Data Export** — Users can request their data (Article 15)
5. **Data Deletion** — "Right to be forgotten" (Article 17)
6. **Consent Records** — Store when/how users consented

### Implementation
- Cookie banner: HTML/CSS overlay with Accept/Reject
- Privacy page: Static page with required sections
- Backend endpoints for data export/deletion

---

## Security Requirements

### API Key Protection
- Gemini API key stored ONLY in Vercel environment variables
- All AI calls go through serverless functions
- Frontend NEVER has access to API keys

### Rate Limiting
- Per-user limits via Supabase RLS
- 50 requests/minute per user
- Credit validation before any analysis

### Input Validation
- All inputs sanitized
- File uploads validated (type, size)
- URL validation for job URLs

---

## Environment Variables

### Vercel (Required)
```
GEMINI_API_KEY=AIzaSy...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## File Structure

```
vantage/
├── api/                      # Vercel serverless functions
│   ├── auth/
│   │   ├── callback.ts
│   │   └── logout.ts
│   ├── credits/
│   │   └── index.ts
│   ├── analyze/
│   │   └── index.ts
│   ├── waitlist/
│   │   └── index.ts
│   └── stripe/
│       ├── checkout.ts
│       └── webhook.ts
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── Waitlist.tsx
│   │   ├── DemoWalkthrough.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Pricing.tsx
│   │   └── Privacy.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useCredits.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── stripe.ts
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── SPEC.md
```

---

## Acceptance Criteria

### Must Have (MVP)
- [ ] User can sign up with Google or email/password
- [ ] User can log in and see dashboard
- [ ] User can start a job analysis (if credits available)
- [ ] Credits deducted after analysis
- [ ] User can subscribe via Stripe
- [ ] Credits update on subscription
- [ ] Waitlist form works and saves to DB
- [ ] Countdown timer displays correctly
- [ ] GDPR cookie banner appears

### Should Have
- [ ] Demo walkthrough on landing page
- [ ] User can view past analyses
- [ ] User can upgrade/downgrade plan
- [ ] Privacy policy page
- [ ] Terms of service page

### Nice to Have
- [ ] Email notifications to waitlist
- [ ] Social share on signup
- [ ] Referral program
- [ ] Analytics dashboard for admin

---

## Known Constraints

1. **Gemini Rate Limits**: 15 requests/minute (free tier)
2. **Supabase Free Tier**: 500MB storage, 100k auth requests/month
3. **Vercel Hobby**: 100GB bandwidth, 12s function timeout
4. **Stripe**: Need business account for UK payments

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-03 | Initial full-stack specification |
