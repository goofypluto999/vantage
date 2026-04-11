# Starter Prompt for Next Agent

**IMPORTANT:** Open Claude Code in `C:\Cloaude Logic\vantage` (NOT `vantage-landing` -- that's an old copy).

Copy and paste this entire block as your first message to the new Claude agent:

---

```
IMPORTANT: Make sure you are in C:\Cloaude Logic\vantage (NOT vantage-landing).

I need you to fix the token/credit system in my Vantage project. It's broken and needs a rewrite.

This project has a FULL BACKEND -- Supabase auth, Stripe payments, Vercel serverless API functions. Check the api/ directory, src/lib/, src/components/, and database/ folders -- they all exist.

FIRST: Read these files in this exact order to get full context:
1. CLAUDE.md -- project architecture, tech stack, critical rules
2. HANDOFF.md -- what works (don't break it), what's broken, env vars, deployment
3. WALLET-SPEC.md -- exact requirements for the new token wallet system
4. FILE-MAP.md -- every file and what it does

THEN: Read the actual broken code:
5. api/stripe/webhook.ts -- webhook handler (main bug: line 105 replaces credits instead of adding)
6. api/stripe/sync.ts -- sync fallback (same bug: line 123)
7. api/stripe/checkout.ts -- checkout flow (race condition: lines 80-88 cancel old sub, triggering webhook that zeroes credits)
8. src/lib/supabase.ts -- Profile type, getCreditsRemaining(), hasCredits()
9. api/credits/index.ts -- credit balance endpoint
10. database/schema.sql -- current schema

YOUR TASK:
Rewrite the token system so it works like a simple wallet:
- Single balance (token_balance) that only goes up on purchase and down on spend
- Purchases are ADDITIVE (buying 30 tokens when you have 7 gives you 37, not 30)
- Tokens never expire, never get replaced, never go negative
- Fix the race condition between checkout.ts cancelling old subs and webhook.ts processing the deletion
- Update all files that reference credits_total, credits_used, getCreditsRemaining(), hasCredits()
- Update the Dashboard and Account components to show the new balance
- Run npx tsc --noEmit after changes and fix all TypeScript errors

DO NOT:
- Touch the landing page, AI analysis, cover letter, or interview features -- they work
- Change the Framer Motion imports (must stay as 'motion/react')
- Change the Gemini model string (must stay as 'models/gemini-2.5-flash')
- Remove the dark background CSS from index.css
- Combine googleSearch tool with responseMimeType in Gemini calls
- Remove the 50ms setTimeout in App.tsx auth flow (prevents Supabase deadlock)

See WALLET-SPEC.md for the complete specification including database migration options, race condition fix strategies, and frontend display requirements.
```
