# Vantage Product Expansion Plan — 2026-05-11 (V1, pre-Gemini-review)

> Honest read: the current product is too thin to sustain a £5-£20 paid
> SaaS at scale. Users get a cover letter + interview questions + (Pro+)
> a mock interview. That's a 2-week competitive advantage at best —
> ChatGPT can do most of it for free with the right prompt. This plan
> deepens what tokens unlock so paying users feel they got £5-£20 of
> value, not £5 of cover-letter-which-ChatGPT-also-did.

## Current product surface (audited 2026-05-11)

**Per token spend:**
| Feature | Cost | Tier |
|---|---|---|
| Full analysis (company intel + brief + cover letter + interview Qs + fit score + pitch) | 1 token | All paid |
| Cover-letter tone rewrite (Formal/Warm/Direct/Creative) | 1 token | All paid |
| Interview-question generation (refresh) | 1 token | Pro+ |
| AI mock interview (voice, evaluated) | 0 tokens | Pro+ included |

**Pricing:**
- Starter: £5 one-time → 20 tokens, never expire
- Pro: £12/mo → 60 tokens/mo + mock interview unlocked
- Premium: £20/mo → 120 tokens/mo + fit score + presentation deck + priority processing

**Reality check on the marketing copy:** Site says "10 free prep packs". 1 prep pack as the user perceives it ≈ 1 analysis (1 token) + 2-3 tone rewrites (2-3 tokens) + 1 interview-question refresh (1 token) ≈ 4-5 tokens. So 10 tokens = 2-3 real prep packs, not 10. **This mis-sets expectation.** Fix in plan: clarify the count, OR make tokens actually go further (cheaper basic actions).

## What's missing — competitive snapshot

| Competitor | Price / month | Features Vantage doesn't have |
|---|---|---|
| Jobscan | $49.95 | LinkedIn optimisation, real-time JD-CV match score, weekly job-tracker dashboard, multi-version CV management, ATS-by-vendor breakdown, recruiter-side competitor analysis |
| Final Round AI | $148 | Real-time AI coach during live interview (Zoom/Meet overlay), STAR/PAR generators, behavioural simulation across personas, voice + facial coaching, interview-question library by company + role + level |
| LazyApply | $34 | Auto-apply to 100s of jobs/day, multi-platform tracking, application history, follow-up sequences |
| Teal | $9-$29 | Application tracker, contacts/networking CRM, AI cover letter, AI resume, job-board aggregator, salary tracker |
| Kickresume | $20 | Resume builder with 40+ templates, resume score, real-time content suggestions, cover-letter generator, personal website, cover-letter A/B |
| Resume Worded | $19 | Resume score, LinkedIn score, recruiter-style feedback, keyword match, skill gap analysis |
| Huntr | $40 | Job tracker, application status pipeline, contacts CRM, resume tailor, cover-letter tailor, chrome extension |

**Where Vantage actually wins today:** speed (90 seconds end-to-end), the 4-tone cover-letter switcher, the AI-graded voice mock interview at this price, no recurring fee at the Starter tier (£5 one-time).

**Where Vantage is weakest:** post-prep utility. The user signs up, runs 2-3 packs, and then either has a job (good for them, bad for retention) or runs out of tokens with no compelling reason to top up. The product solves prep, not the wider job search.

---

## The thesis

The user's question is right: more functions, more ways to spend tokens, more genuine value per token. But "more" must be in two directions:

**Direction A — deepen the prep loop** (more outputs per analysis, more useful re-tooling). Increases token-spend velocity in early career of the customer.

**Direction B — expand into adjacent loops** (LinkedIn, application tracking, follow-up, networking, offer evaluation). Extends customer lifetime — once they signed up to prep for one job, they stay for the next 5.

Direction A is faster, smaller, lower-risk. Direction B is the actual moat and ARPU lever.

---

## Proposed feature set, ranked by impact × effort

> Effort = engineering days (1d = ~6 focused hours). Impact = honest gut.
> Both 1-5. Score = impact - effort (positive = build now).

### 1. CV Variant Generator (Impact 5, Effort 2, Score +3) **— BUILD FIRST**

Right now Vantage spits out a tailored cover letter but never tailors the CV. Most ATS scanners reject CVs because the keywords don't match the JD. We have all the data already (CV upload + JD scrape + ATS scoring already exists).

**What it is:** "Generate ATS-tailored CV for this JD" button on the results page. Uses the existing CV + JD + ATS analysis to output:
- A reordered bullet-point version highlighting JD-matching achievements
- An ATS-keyword section (the keywords from the JD that the CV doesn't have, listed as "Skills to add or reframe")
- DOCX export

**Cost:** 1 token.
**Why now:** all inputs already in the analysis. ~2 days of work. Direct revenue lever.
**Token-spend lift:** +1-2 tokens per analysis-context.

### 2. Job Tracker dashboard (Impact 4, Effort 4, Score 0) **— BUILD SECOND**

Every paid competitor has a tracker. Teal, Huntr, Jobscan all do. Vantage doesn't, so the user has to manage their pipeline in a spreadsheet — which means they don't come back to Vantage often.

**What it is:** A simple Kanban (Saved / Applied / Interviewing / Offer / Rejected) per job link the user has analysed. Each card shows the company, role, fit score, and a button to re-run the prep if the JD changes. No new analyses required — it's an organisational layer on top of existing analyses.

**Cost:** Free (it's UI on top of existing data).
**Why now:** retention. Job search is months-long. A user who runs 3 analyses and then leaves the dashboard never comes back. A user with 8 cards open returns every time they hear back from one.
**Token-spend lift:** Indirect — keeps user in the product, generates more analysis runs over the campaign.

### 3. Multi-version CV Library (Impact 3, Effort 2, Score +1)

Users with diverse backgrounds run multiple analyses against different versions of their CV. Right now each analysis re-uploads. Storing 2-3 named CV versions ("PM-flavoured", "Eng-flavoured") removes friction.

**Cost:** Free. UI-only feature.
**Token-spend lift:** Indirect — friction reduction increases the number of analyses-per-user.

### 4. Follow-up Email Generator (Impact 3, Effort 1, Score +2) **— QUICK WIN**

After applying or interviewing, the user needs to follow up. Right now this is a 5-minute ChatGPT session. Vantage already has the company + role context per analysis. Add: "Generate follow-up email" with three branches (post-application, post-first-round, post-final-round, no-response-3-weeks).

**Cost:** 1 token per email.
**Why now:** trivial to build, directly tied to existing analysis context.
**Token-spend lift:** +1 token per analysis-context, potentially +3 over the lifecycle of a single application.

### 5. Salary Negotiation Brief (Impact 4, Effort 2, Score +2)

The /tools/negotiation-script is free but text-only. A *paid* version inside the dashboard would: pull the company's known salary band (from public sources), reference the role's market rate, generate a negotiation script anchored to the user's specific offer, and produce talking points based on the user's leverage (years experience, competing offers).

**Cost:** 2 tokens (higher token-cost = signal of higher value).
**Token-spend lift:** +2 tokens at offer stage, which is the highest-intent moment in the funnel.

### 6. STAR Story Library, per user (Impact 4, Effort 2, Score +2)

Users repeatedly need "tell me about a time..." stories. Right now /tools/star-story-builder is free, one-shot. A paid version: store the user's 8-12 STAR stories, surface relevant ones automatically when the user runs an analysis ("These 3 stories match the role's behavioural expectations"), and remix them per interview.

**Cost:** 1 token per story-generation; library storage free.
**Token-spend lift:** +3-5 tokens per user lifetime.

### 7. LinkedIn Profile Audit (Impact 4, Effort 3, Score +1)

We have /tools/linkedin-about (free, one-shot). A paid dashboard version: paste LinkedIn URL → audit headline + about + experience + skills + recommendations against the user's target role-type → generate optimisation suggestions + before/after copy.

**Cost:** 2 tokens (since it's a deeper analysis than a single section).
**Token-spend lift:** +2 tokens, plus brings in users who weren't actively job-searching.

### 8. Interview Question Bank by Company × Role × Level (Impact 4, Effort 5, Score -1)

Final Round AI charges $148/mo partially for this. We have the data — the existing /interview-prep/{company} pages are user-facing — but we don't surface it inside paid dashboard as a "study these specific questions" tool.

**Cost:** 1 token per refresh.
**Why later:** content layer is high-effort to maintain (questions go stale, companies change interview formats). Defer until we have signal that question-bank-style usage is wanted.

### 9. Application Tracker — Chrome Extension (Impact 5, Effort 6, Score -1)

Auto-detect when a user lands on a job page (LinkedIn, Indeed, Greenhouse, Lever), one-click "save to Vantage" → automatic analysis triggered. Removes the manual paste-the-URL step entirely.

**Cost:** N/A (extension is free; analysis still costs 1 token).
**Why later:** extension distribution + browser-store review takes weeks. High-impact when shipped, but defer until the core dashboard is sticky.

### 10. Mock Interview — Persona Library (Impact 3, Effort 3, Score 0)

Current AI mock interview is generic. Adding "Practice with a tough VP-Engineering persona" / "Practice with a friendly recruiter persona" / "Practice with a behavioural-only senior PM persona" makes practice more useful + creates a clear Premium-tier upgrade reason.

**Cost:** 0 tokens (Pro+ feature).
**Why later:** the current mock interview probably needs polish first. Persona-switching is a layer on top, not foundational.

---

## Free-tier expansion (separately)

The free tools cluster (currently 20 tools at `/tools/*`) is the top-of-funnel acquisition surface. Each tool that ranks for a search term brings a visitor who *might* register. Plan: ship 2 more tools per month at the cadence we have been running, BUT focus on tools that have a natural register hook (e.g., "your result is best when run on your full CV — sign up to run it on the real one").

**Existing tools that need a stronger register hook:**
- `/tools/jd-decoder` — the result page tells you what the JD really wants, then says "now write a cover letter that matches" without offering to do it. Add CTA: "Run the matching cover letter on this JD".
- `/tools/bullet-rewriter` — rewrites bullets in isolation. Add CTA: "Get all your bullets rewritten against a specific job link → register".
- `/tools/star-story-builder` — builds one STAR story. Add CTA: "Get a STAR library of 8-12 stories tied to your CV → register".

These are all free, low-friction copy changes inside existing tool pages. They convert visitors at the moment-of-highest-intent (the moment they got a result they wanted).

---

## Token economics rebalance

If we add features 1, 4, 5, 6, 7, the typical user's lifecycle becomes:

**Today (sparse):**
- 1 analysis × 5 applications = 5 tokens

**With proposed features:**
- 1 analysis = 1 token
- 1 ATS-tailored CV = 1 token (Feature 1)
- 2 follow-up emails = 2 tokens (Feature 4)
- 2 tone rewrites of cover letter = 2 tokens
- 1 LinkedIn audit at start of search = 2 tokens (Feature 7)
- 1 negotiation brief at offer = 2 tokens (Feature 5)
- 2 STAR story refreshes per interview = 2 tokens (Feature 6)
- Per application: ~12 tokens
- Across 5 applications + 1 offer: ~50-60 tokens

That's exactly the Pro tier's monthly allocation (60 tokens). The product naturally pulls the user from Starter (20 one-time) to Pro (60/mo). **This is the actual upgrade lever the product has been missing.**

---

## Risk-side of this plan

**1. Ship-rate budget.** Vercel rate limit is 100/day. This plan is 4-6 features. If we ship each as a separate commit + deploy, we're using 4-6 deploy slots over a few days. Manageable but tight if combined with content batches.

**2. Token-cost balance.** Increasing tokens-per-application to 12 might feel expensive at £0.25/token (£5/20). Solution: tighten the analysis-token-cost to 0.5 tokens-equivalent (e.g., "1 analysis includes ATS-CV + cover letter + 1 follow-up + 2 tone rewrites for 1 token combined") instead of charging per micro-feature. Bundle = perceived value.

**3. Database load.** Job tracker + CV library + STAR library = 3 new tables + RLS policies + migration. About 2-3 days of Supabase work. Not a blocker but should be planned.

**4. Maintenance overhead.** Each new feature is a surface that can break. We already have 20 tools, 124 blog posts, 5 hub surfaces, the main app. Adding 4-6 dashboard features doubles the surface to maintain. Mitigation: each feature must have a "remove this if it's not used in 90 days" off-ramp documented in its file header (already a convention).

**5. Cannibalisation of pricing.** If we add too much to the £5 Starter, the Pro tier looks worse. Plan accordingly: features 1, 4 in Starter; features 5, 6, 7 Pro-exclusive; 8, 10 Premium-exclusive.

---

## Recommended sequence

**Week 1:** Ship Feature 1 (ATS-tailored CV generator) + Feature 4 (follow-up emails). Both small, both directly tied to existing analysis context. Token-economic impact immediately visible.

**Week 2:** Ship Feature 3 (multi-version CV library) + Feature 6 (STAR story library). Both UI-on-top-of-existing data + small Supabase tables.

**Week 3:** Ship Feature 2 (job tracker dashboard). Larger DB schema work, but unlocks retention.

**Week 4:** Ship Feature 5 (salary negotiation brief) + Feature 7 (LinkedIn audit). Both fit at the high-intent moments (offer stage, search-start).

**Defer:** Features 8, 9, 10 until weeks 5-8 based on usage signal from features 1-7.

---

## Open questions for review

1. Is the **bundled-token model** ("1 token gets you the analysis + ATS CV + 2 tone rewrites + 1 follow-up") more compelling than the **per-action model**? Hypothesis: bundle = "feels generous", per-action = "feels nickel-and-dimed". But bundled hides the value of each individual action, which matters when comparing to ChatGPT.
2. Should the **job tracker** be a free dashboard feature (retention), or a Pro-tier feature (revenue lever)? Argument for free: it's the "hook" that brings the user back even if they don't pay this month. Argument for Pro: it's a high-effort feature and gating it justifies the £12/mo.
3. Is there a **community / aggregate-data** play? E.g., showing the user "47 other Vantage users applied to Stripe Engineer roles this month — here's the average fit score they got, here's what their cover letters emphasised". Privacy-respecting (no individual data shown), high signal. Probably defer — needs more users first.
4. Should we **integrate with LinkedIn's API** directly (formal partnership), or scrape (informal)? Integration is years of compliance + API costs; scraping is fast but fragile + ToS-grey. Recommend: scrape with explicit user consent for now, partnership conversation only after we have material user count.

---

## What's NOT in this plan

- **Internationalisation / multi-language.** User flagged this as a concern; deliberately deferred until UK + US users converge on enough volume to justify the engineering cost.
- **Free-tier reduction.** Some indie SaaS playbooks say "cut free tokens from 10 to 3" to force upgrade decisions. Not in this plan because the customer signal is too weak right now — we have <50 users. Cutting the free tier reduces top-of-funnel; better to deepen the product first.
- **Aggressive cross-sell** (email drips, retargeting ads, in-app prompts every 2 clicks). The product needs to be deep enough to deserve cross-sell first. Premature cross-sell on a thin product feels desperate.

---

## End of V1. Awaiting Gemini review pass.
