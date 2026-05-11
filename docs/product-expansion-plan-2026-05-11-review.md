# Product Expansion Plan — Adversarial Review Pass

> **Honest note on methodology:** the original brief asked for an LLM council
> (Gemini, Codex, DeepSeek). The Gemini API key is set only in Vercel's
> production env, not locally, and Gio's standing rule (`feedback_key_hygiene`)
> forbids asking for keys to be pasted in chat. So this review is a
> deliberate adversarial self-pass — Claude playing the role of skeptic
> against Claude's own V1 plan — NOT an actual second-LLM review. Labelled
> as such because over-claiming the methodology would be worse than being
> straight about it.

---

## What the V1 plan got right

1. **Honest about the current product being thin.** Most internal docs over-claim. The plan opens with "2-week competitive advantage at best — ChatGPT can do most of it for free with the right prompt." That's the right starting frame.
2. **Token-cost audit is correct.** The plan correctly identified that "10 free prep packs" mis-sets expectations because 1 prep pack = 4-5 tokens, not 1. This needs fixing in marketing copy alongside the feature work.
3. **The "Direction A vs Direction B" framing is useful.** Deepen-the-loop vs expand-to-adjacent-loops captures the real strategic choice. Most product-expansion docs collapse these into a feature list.
4. **The token-economics rebalance section** (showing how a typical user's spend goes from 5 to 50-60 tokens per campaign) is the right kind of math. That's how you prove the upgrade-to-Pro lever exists.

---

## What the V1 plan got wrong or under-thought

### 1. Feature 1 (ATS-tailored CV) under-states the engineering effort

The plan calls this 2 days. That's optimistic. A "rewrite the CV to match the JD" feature needs:
- A reliable way to OUTPUT a CV in DOCX with formatting preserved (not just a text dump)
- LLM prompt-engineering to produce ACCURATE rewrites (not hallucinated achievements the user didn't actually have)
- A diff view so the user can accept/reject changes per-bullet (otherwise it's a black-box trust problem — "did the AI make up things I didn't do?")
- An export pipeline (DOCX → PDF? both?)

Realistic effort: 4-5 days, not 2. The hallucinated-achievements problem is the *real* risk here — if Vantage suggests a CV bullet the user didn't actually do, and they submit it, and a recruiter calls them out, Vantage's reputation tanks. The mitigation (diff view + accept-per-bullet) is the design that protects users from themselves.

### 2. Feature 4 (follow-up emails) is fine but the token-cost math is shaky

Plan says 1 token per email. But the plan also says we want to add 2 follow-ups per analysis-context to lift typical token spend. That's +2 tokens per application. Combined with the ATS CV (+1) and STAR refreshes (+2), the application-level cost is climbing fast.

At £5/20 tokens = £0.25/token, an application now costs the user £3 of tokens. Out of 20 Starter tokens, they can do 6-7 applications. The marketing currently implies 20 applications. **The "10 free prep packs" copy needs to land at a real number that the user actually gets, post-rebalance.** Otherwise the conversion-funnel issue (over-promising free tier → under-delivery on signup) gets worse, not better.

### 3. Feature 2 (job tracker) is treated as a 4-effort feature. That's wrong.

A real tracker needs:
- Per-user encrypted storage (jobs the user is applying to are sensitive — current employer might search the database)
- A status state-machine (Saved → Applied → Phone-Screen → On-site → Offer → Rejected) with timestamps + notes
- A list view + a Kanban view + maybe a calendar view
- Integration with the existing analyses table (a "card" is a saved analysis)
- A "remind me" feature (user wants to apply by Friday — system pings them)

Realistic effort: 6-8 days, not 4. The integration with the existing analyses table is the easy part. The state-machine + reminders + UI variants is the work.

### 4. Feature 7 (LinkedIn audit) — the legal grey zone is bigger than the plan acknowledges

LinkedIn's ToS explicitly prohibits scraping. The HiQ vs LinkedIn case settled in 2022 in a way that's still ambiguous. Even if scraping is legal in some jurisdictions, LinkedIn will rate-limit + ban scraping IPs aggressively. The plan says "scrape with explicit user consent". Even with consent, the technical reliability of scraping LinkedIn at scale is poor — pages change regularly, JS-rendering vs server-rendering inconsistencies, auth-walled content, captchas.

**Cleaner alternatives:**
- (a) Ask the user to **paste** their LinkedIn About + Headline + Experience into a textbox. No scraping. Manual but reliable.
- (b) Build a **Chrome extension** that scrapes the user's OWN profile locally (no third-party detection) and sends just the extracted text to Vantage. This is the model used by Resume Worded + most LinkedIn-optimisation tools that have stayed in business.
- (c) Skip LinkedIn entirely for now. CV optimisation has higher leverage and no ToS risk.

The plan should pick one — probably (a) for V1 (low-effort, no extension distribution required) — and acknowledge that (b) is the real path if it gets traction.

### 5. The "community / aggregate-data" play (open question 3) is deferred without giving it real weight

This is potentially Vantage's biggest moat. Every paid competitor has data on what works (Jobscan knows which keywords get past which ATS; Final Round AI knows which interview questions Stripe asked candidates last week). Vantage starts with zero proprietary data and can never catch up to those incumbents on data.

BUT — Vantage runs 90-second analyses. Every analysis is data: which CV + which JD → fit score → did the user get an interview / offer? If Vantage can convert 100 users into "tell us how it went" feedback, that data layer becomes the moat (without it, Vantage is just "a thin wrapper over Gemini").

**The plan should treat the feedback loop as a Feature 0 — not deferred.** A simple post-application "did you get an interview?" prompt, with anonymous aggregation, is high-leverage and low-cost.

### 6. Free-tier strategy decision is missing a third option

The plan considers (a) keep 10 free tokens, (b) cut to 3. There's also (c): **keep 10 free tokens but make them go further by bundling**.

Bundle option: 1 token = analysis + ATS CV + 2 tone rewrites + 1 follow-up email. The user gets 4-5 "actions" for 1 token. The marketing claim "10 free prep packs" becomes literally true.

This is the right move and the plan should make it explicit in the V2.

### 7. The plan doesn't address WHO the customer is

Every feature decision benchmarks against a generic "user". But:
- An entry-level grad needs job tracker + cover letter + interview prep heavily, doesn't need negotiation brief.
- A senior IC in a layoff needs negotiation + LinkedIn audit + STAR library, doesn't need bulk-tracker.
- A career-changer needs CV variants + skills-gap analysis + STAR for transferable skills.

These are three different customer archetypes. The plan ranks features by impact-effort generically, but impact varies enormously by archetype. The plan should explicitly call out: which archetype is the V1 customer? Recommend grad / early-career first (largest cohort, lowest competitive moat for incumbents because Jobscan etc. are too expensive for entry-level).

### 8. Risk #1 (ship-rate budget) is mentioned but not solved

Vercel rate limit at 100/day is the constraint we ran into TODAY. The plan acknowledges it but doesn't propose a fix. Options not in the plan:
- (a) Batch multiple features into one commit (loses git granularity but uses fewer deploys).
- (b) Decouple content commits (which add data only) from feature commits (which need test cycles). Content can be `--no-verify`'d to skip rebuild if data files don't trigger Vite reload. (Actually they DO trigger Vite reload — bad idea.)
- (c) Use Vercel CLI to deploy directly (might bypass GitHub auto-deploy? would need verification).
- (d) Move pure content data (blogPosts) to a separate API endpoint so adding blog posts doesn't trigger a frontend rebuild. This is the structural fix but is itself ~3 days work.

The cleanest answer: **stop coupling content additions with feature deploys**. Batch all the V2 feature work into a single commit; content stays separate.

### 9. The plan doesn't define success metrics

What does V2 success look like quantitatively? The plan says token-spend lifts but doesn't give numbers:
- % of users who reach Pro upgrade prompt (i.e., spend > 20 tokens)
- Average tokens-per-user-per-month
- % of users who run > 3 analyses
- Time-to-first-paid-conversion

Without these numbers, "is the feature working?" becomes a vibes-based decision. Recommend defining them up front, even if first values are speculative.

---

## Conflicting recommendations from V1 vs review

| V1 said | Review says | Why |
|---|---|---|
| Feature 1 = 2d | Feature 1 = 4-5d | Hallucination mitigation + diff UI + export pipeline are non-trivial |
| Feature 7 (LinkedIn audit) via scraping | LinkedIn = paste-based, scraping deferred | ToS risk + reliability |
| Community data play "probably defer" | Should be Feature 0 (feedback loop) | It's the data moat — start collecting now |
| Free tier = 10 unchanged OR cut to 3 | Add option C: bundle so 10 goes further | Solves the "10 prep packs but actually 2-3" mis-set expectation |
| Generic user | Pick archetype: grad/early-career first | Largest cohort, weakest competitor coverage |

---

## V2 plan (post-review)

Re-ordered priority based on review:

**Feature 0** (NEW): Post-application "what happened?" feedback loop. 1 day. Tiny UI. Massive data play. Build first.

**Feature 1**: ATS-tailored CV generator (with diff view + accept-per-bullet + DOCX export). 4-5 days, not 2. Build second.

**Feature 4**: Follow-up emails generator. 1-2 days. Build third — fast win + builds the token-spend pattern.

**Feature 5**: Salary negotiation brief (the dashboard / paid version). 2 days. Build fourth at offer-stage moment.

**Feature 2**: Job tracker. 6-8 days, not 4. Build fifth — bigger investment, but it's the retention lever.

**Feature 6**: STAR story library per user. 2 days. Build sixth.

**Feature 3**: Multi-version CV library. 2 days. Build seventh (UI on top of existing data).

**Feature 7**: LinkedIn audit (paste-based, NOT scraping). 2 days. Build eighth.

**Defer:** Features 8, 9, 10 (interview-question bank, Chrome extension, mock-interview personas) — revisit after Features 0-7 ship + we have usage data.

**Token economics rebalance:** Move to bundled tokens. 1 token = full analysis context (analysis + ATS CV + 2 tone rewrites + 1 follow-up + STAR refresh). Per-action features (negotiation brief, LinkedIn audit) cost 2 tokens. This makes "10 free prep packs" honest.

**Target archetype:** grad / early-career (0-3 yoe). Drives Feature 0 design (post-application feedback weighted toward "did I get an interview?" not "did I negotiate well?"). Drives Feature 2 design (Kanban with status states relevant to entry-level pipelines). Drives the marketing copy + the SEO content focus.

**Success metrics for V2:** % of users who spend > 1 token (currently ~30% — best guess; need to verify); % of users who reach 20-token threshold (currently ~5% guess); % of users with 3+ analyses (sticky); time-to-Pro-upgrade (currently undefined). Define real baselines from /admin within 7 days, then track weekly.

---

## What still bothers me about V2 (open risks)

1. **Customer archetype is a guess.** I'm picking grad/early-career based on competitor coverage gaps + intuition. Could be wrong — the actual customer might be career-changers (a smaller cohort but with bigger desperation budget). The 5-minute fix is to look at the 50 existing users in `/admin` and see their LinkedIn / role patterns. I haven't done that.

2. **Bundling tokens makes per-feature value invisible.** If 1 token gets you 5 actions, the user can't tell which action provided value. When something breaks (Gemini downtime, weak output, etc.), bundled-token blame is opaque. Worth designing for.

3. **Feature 0 (feedback loop) only works if users come back.** A user who runs 1 analysis, doesn't get the job, and never returns gives no signal. The feedback prompt has to fire at the moment they're MOST likely to engage — which is probably *after* their first interview, not after the first application. Timing is hard.

4. **The whole plan assumes Vantage's outputs are good.** The plan never asks the meta-question: are the outputs actually better than ChatGPT? If they're not, no amount of feature expansion fixes the conversion problem. Recommend: before building V2, do the side-by-side test from the May-6 diagnosis (`docs/conversion-diagnosis-2026-05-06.md` section "Output quality vs free-ChatGPT perception"). 1 hour of work. If Vantage's outputs aren't visibly better, the next 6 weeks should be prompt-engineering, not feature-expansion.

---

## End of adversarial pass. Ready for V2 implementation when Gio approves direction.
