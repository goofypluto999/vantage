# Conversion Diagnosis & Action Plan — 2026-05-06

> 3 users in weeks. 0 sales. This is the diagnosis, the 6 fixes shipped today, the data you need to gather, and the next moves.

---

## What we know vs what we don't

**Known:**
- 3 users registered
- 0 paid conversions
- Site has been live a few weeks
- Free trial = 10 tokens (≈3 full prep packs + tone rewrites)

**Unknown until you check `/admin`:**
- Did any of the 3 users actually run an analysis? (or just register and bounce)
- Did any reach the pricing page after the free trial?
- Did any reach Stripe Checkout but abandon?
- What was the time-on-site / drop-off path?

**You can answer these in 5 minutes:**
1. Open https://aimvantage.uk/admin (you're the admin)
2. Look at the user table — for each of 3 users, check `token_balance` (still 10 = never ran analysis; 4-7 = ran 1-2; 0 = exhausted free trial)
3. Look at the analyses table count
4. Look at the api_usage rows
5. Check Stripe Dashboard → Customers / Failed payments

That data tells us where the leak is. Then we fix that specific spot.

---

## The 6 fixes shipped today (commit 2c8702d + 61bf40e)

| # | Fix | Why it matters |
|---|---|---|
| 1 | Removed fake "Join thousands of job seekers" claim on Register sidebar | Trust risk — eroded the moment a prospect noticed we have 3 users |
| 2 | Improved post-register success screen with spam-folder warning + manual confirm fallback | Email confirmation is the #1 indie SaaS drop-off; 6-day-old domain emails land in spam ~50% |
| 3 | Reframed pricing from "20 tokens" to "6 prep packs" (with per-pack cost) | One mental-math step instead of two. Explicit cost-per-pack visible upsell signal |
| 4 | Added landing-hero link to /sample/anthropic-senior-pm | Best surface to answer "what does it actually produce?" without a signup ask. Existed for weeks but had ZERO links from homepage. |
| 5 | Rewrote "Not enough tokens" upgrade prompt | Removed currency-shaped language, added concrete value + risk-reversed messaging at moment of highest desire |
| 6 | Promoted Google OAuth to primary signup/login CTA | Bypasses email confirmation entirely. Users land in dashboard in 3 seconds instead of through spam-folder hunting |

All 6 verified clean: tsc clean, build clean, deployed.

---

## Likely root causes — ranked by how plausible they are

### 🔴 1. Email confirmation black hole (~40% of failure mode)
**What's happening:** User signs up with email/password. Supabase sends confirmation email. Email lands in spam. User doesn't see it. Never confirms. Never returns. We never even count them as "tried the product."

**Today's fix:** Google OAuth as primary signup (skips this entirely) + better spam-folder messaging on the success screen.

**Still to ship if needed:** Auto-confirm email accounts (turn off email confirmation in Supabase dashboard — Authentication → Providers → Email → uncheck "Confirm email"). One toggle, dramatic conversion improvement, but reduces fraud protection. Recommend keeping confirmation but the OAuth promote should reduce the need.

### 🟡 2. Free trial is enough for casual job-hunters (~25% of failure mode)
**What's happening:** 10 free tokens = ~3 full prep packs. A user trying it for "the job they want next week" runs 1 analysis on it, gets value, gets the job (or moves on), never needs to come back. They never feel the paywall.

**Hard to fix without changing the trial:**
- Option A: Reduce free trial to 5 tokens (1 prep pack + tone rewrites). Forces upgrade decision earlier.
- Option B: Lock specific high-value features behind paywall (mock interview, fit score) so free trial is "limited preview" not "full taste".
- Option C: Add an email reminder 3 days post-signup ("you have 7 free tokens left — try it on another role").
- Option D: Accept this and focus on volume.

Recommend trying **C first** (least invasive — needs a transactional email setup which we don't have yet). Or **D** until volume reveals the real curve.

### 🟡 3. Output quality vs. "free ChatGPT" perception (~20% of failure mode)
**What's happening:** Users run an analysis, get a cover letter / mock interview questions / fit score. They think "this is good but I could've done it with ChatGPT for free." They don't pay £5 for what feels like a wrapper.

**Test this yourself now:**
1. Run an analysis on a real job you'd apply to
2. Generate the same outputs in raw ChatGPT (paste the JD + your CV, ask for cover letter / interview questions / fit score)
3. Compare side by side
4. Honestly: which is better? By how much?

If Vantage's output isn't visibly better, the product needs a quality push:
- Better prompts (Gemini grounding tighter)
- Specific output formats ChatGPT can't easily replicate (the 4-tone switcher is a unique value)
- Live-scored mock interview is genuinely hard to replicate

If Vantage's output IS visibly better, the marketing isn't communicating that. Ship a side-by-side comparison page.

### 🟡 4. Pricing wall placement / Stripe friction (~10% of failure mode)
**What's happening:** User hits "Buy 6 more prep packs" → goes to Stripe Checkout → bounces because of:
- Fields they don't recognise (VAT?)
- Card decline
- 3D Secure friction
- Just changes mind on the checkout page

**Check this now:** Stripe Dashboard → Payments → look for failed/cancelled checkout sessions. If there are any in the last 30 days, that's a smoking gun.

### 🟢 5. Wrong audience entirely (~5% of failure mode)
The 3 users may have been: friends checking out the link, you testing yourself, or random tire-kickers who weren't in active job search. Without traffic data we can't tell.

This resolves itself once distribution (the paused GOSPEL track) starts driving real applicants in. Resume distribution after we know the conversion fixes are actually working.

---

## What to do now (in this order)

### Today, 5 minutes — gather data
1. Open `/admin` → screenshot or paste me the user table (I'll redact emails for you)
2. Open Stripe Dashboard → check for any cancelled/failed checkouts
3. Open Clarity dashboard at https://clarity.microsoft.com/projects/view/wmw4zvycgg — sessions from today (post-deploy) start populating ~30 min from now

### This week — execute on data findings
- If users never ran analyses → onboarding problem → ship guided first-run tour
- If users ran analyses but never saw paywall → need stronger free-trial-end nudge → ship transactional email
- If users hit paywall but didn't checkout → checkout friction → audit the Stripe flow
- If users checked out but abandoned → Stripe-page friction → enable Stripe Link, add risk-reversal copy near checkout

### Next layer of fixes I can ship autonomously (no data needed)
- **Add risk reversal** ("£5, money back if you hate the output — just email me") — needs your policy OK
- **Build the side-by-side ChatGPT-vs-Vantage comparison page** — high-leverage but needs me to actually run a comparison
- **First-run onboarding tour** in dashboard — guides through "upload CV → paste URL → here's what happens"
- **Output-quality A/B**: try a sharper Gemini prompt and compare blindly

### Distribution (paused until we know conversion is fixed)
- V7 journalist outreach — emails ready in `docs/v7-journalist-outreach-2026-05-06.md` (5 emails, 1/day)
- DEV.to crosspost — already published, monitor
- Show HN — already submitted, monitor
- OpenPR + PRLog — blocked by hotmail-detection, will reattempt with paid mailbox later if needed

---

## Honest framing

**3 users / 0 sales is too small a sample to call PMF failure.** We need 30-50 free-trial users before the conversion rate is statistically meaningful. The 6 fixes shipped today should compound to better conversion ratios on the next 50 signups.

**But:** the 3 users tell us we have a hypothesis-rich, data-poor situation. The job today is to convert hypothesis-rich into data-rich (use the admin dashboard + Clarity), then ship the highest-leverage fix specific to where the data points.

The fixes shipped today are the universal indie-SaaS-funnel improvements that work regardless of what the data says. Layer on top of them when the data lands.

---

*End diagnosis.*
