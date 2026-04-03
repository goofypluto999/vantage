# Vantage — Deployment Guide

## What's Been Built

### Full-Stack Architecture
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + GSAP + Motion
- **Backend**: Vercel Serverless Functions (API Routes)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (Google OAuth + Email/Password)
- **Payments**: Stripe Subscriptions

### Key Features Implemented
1. **Waitlist System** - Join waitlist or pre-order with countdown timer
2. **Demo Walkthrough** - Interactive 5-step walkthrough showing how the tool works
3. **GDPR Cookie Consent** - Cookie banner with Accept/Reject options
4. **Credit System** - Users get monthly credits based on plan tier
5. **Stripe Integration** - Checkout sessions and webhook handlers
6. **API Security** - All Gemini calls go through serverless functions (API key never exposed)

### Credit & Pricing Model
| Plan | Price | Monthly Credits | Cost |
|------|-------|-----------------|------|
| Starter | £5 | 10 analyses | ~£2.50 |
| Pro | £12 | 30 analyses | ~£7.50 |
| Premium | £20 | 60 analyses | ~£15.00 |

Each analysis costs 2 credits. Unused credits don't roll over.

---

## Deployment Checklist

### Step 1: Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the SQL in `database/schema.sql` in the SQL Editor
3. Go to **Authentication → Providers** and enable Google OAuth
4. Go to **Project Settings → API** and copy:
   - Project URL
   - Service Role Key (keep secret!)
   - Anon Key

### Step 2: Stripe Setup
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create 3 products: Starter (£5), Pro (£12), Premium (£20)
3. Get your API keys (Secret Key, Webhook Secret)
4. Copy the Price IDs for each product

### Step 3: Vercel Setup
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project
3. Add environment variables:

```
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Gemini
GEMINI_API_KEY=AIzaSy...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx

# Google OAuth (optional)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

4. Deploy!

### Step 4: Test the Flow
1. Visit the deployed site
2. Try the waitlist (enter email)
3. Try the demo walkthrough
4. Try pre-order (if Stripe is configured)

---

## File Structure Created

```
vantage-landing/
├── api/                      # Vercel serverless functions
│   ├── analyze/index.ts      # Main job analysis endpoint
│   ├── credits/index.ts      # Check credit balance
│   ├── stripe/
│   │   ├── checkout.ts       # Create Stripe checkout
│   │   └── webhook.ts        # Handle Stripe webhooks
│   └── waitlist/index.ts     # Join waitlist
├── src/
│   ├── components/
│   │   ├── Waitlist.tsx      # Waitlist + countdown
│   │   ├── DemoWalkthrough.tsx # Interactive demo
│   │   └── CookieConsent.tsx # GDPR cookie banner
│   ├── lib/
│   │   └── supabase.ts       # Supabase client
│   └── services/
│       └── api.ts            # API client for frontend
├── database/
│   └── schema.sql            # Database schema + RLS
├── .env.example              # Environment variables template
├── vercel.json               # Vercel config
├── vite.config.ts            # Vite config
├── package.json              # Dependencies
└── SPEC.md                   # Full specification
```

---

## Next Steps After Deployment

1. **Verify auth flow** - Sign up with Google, test login/logout
2. **Verify payments** - Complete a Stripe checkout
3. **Verify credit deduction** - Run an analysis, check credits decreased
4. **Add privacy policy page** - Create `/privacy` route
5. **Add terms of service** - Create `/terms` route
6. **Set up email notifications** - For waitlist (optional)

---

## Troubleshooting

### "Missing environment variable" errors
- Check Vercel dashboard → Settings → Environment Variables
- Make sure all required variables are set

### "Function timeout" errors
- Vercel Hobby: 12s limit
- If analysis takes too long, optimize the Gemini prompt or reduce output size

### Stripe webhook not working
- Go to Stripe Dashboard → Webhooks
- Add your Vercel URL: `https://your-site.com/api/stripe/webhook`
- Make sure the webhook secret is set in environment variables

### Supabase RLS errors
- Check that RLS policies are enabled
- Make sure the service role key is used for API routes (not anon key)

---

## Cost Estimates (Monthly)

| Service | Free Tier | If You Need More |
|---------|-----------|------------------|
| Supabase | 500MB DB, 100k auth | ~$25/mo |
| Vercel | 100GB bandwidth | ~$20/mo Pro |
| Stripe | Free (they take %) | Free |
| Gemini API | 15 req/min | ~£50-200/mo |

**Total: ~£70-220/month** depending on usage

---

## Security Notes

1. **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend (it's only for serverless)
2. **NEVER** expose `GEMINI_API_KEY` to the frontend
3. Use the `VITE_SUPABASE_*` variables only in the frontend
4. Always use HTTPS in production
5. Enable 2FA on your Supabase and Stripe accounts