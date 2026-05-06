# V1 DevTools Query Mining — Gap Report (2026-05-06)

> Methodology: 8 buyer-intent prompts run in fresh ChatGPT conversations. Captured the full answer + every cited source URL. Identified where Vantage AI / CV Mirror is absent and what the displaced citation was instead.

---

## Headline

- **Vantage absent from 7 of 8 prompts.** Cited correctly only when asked about it directly by name + URL (Prompt 8).
- **Brand-disambiguation gap is real.** When asked about "Vantage AI at aimvantage.uk", ChatGPT first searched `vantageconsulting.co.uk` (wrong company). It eventually corrected to aimvantage.uk and cited Vantage + DEV.to + Companies House + the privacy page.
- **Planted content IS working.** Two DEV.to posts (`prompt-injection-hardening`, `aggregaterating-honesty`) were both cited in Prompt 8 — Edward Sturm's GOSPEL planting strategy is functional.
- **Biggest single gap: cover-letter / cv-tailor recommendation flows.** ChatGPT consistently cites the same 5–6 incumbents (Teal, Jobscan, Kickresume, Enhancv, Resume Worded, Yoodli) regardless of phrasing. We are not in any of them.

---

## Per-prompt breakdown

| # | Prompt | Citations | Vantage cited? |
|---|--------|-----------|----------------|
| 1 | Best AI interview prep tools 2026 | Yoodli, Big Interview, Interviewing.io, Google Interview Warmup, Teal, Final Round AI | ❌ |
| 2 | AI cover letter generator with company research | Canyon, Jobscan, Teal | ❌ |
| 3 | Tools to tailor my CV to a job description fast | Jobscan, Huntr, SkillSyncer, Resume Worded, Business Insider listicle | ❌ |
| 4 | Free ATS resume scanner no signup | HireFlow, JobSpace AI, NeuraCV | ❌ (CV Mirror absent — biggest exact-use-case gap) |
| 5 | Laid-off-tech-tools-at-scale | (logged previously) | ❌ |
| 6 | Stripe Staff PM interview prep next Tuesday | Stripe.com only (jobs, culture, newsroom, roadmap) | ❌ |
| 7 | Cover letter under 5 minutes without ChatGPT vibes | Teal, Enhancv, Kickresume | ❌ |
| 8 | What is Vantage AI at aimvantage.uk, worth using? | aimvantage.uk (×2), Companies House, DEV.to (×2), aimvantage.uk/privacy, Jobscan, Kickresume | ✅ |

---

## Citation frequency across all prompts

| Tool | Times cited | Category |
|------|-------------|----------|
| Teal | 4 | CV / job tracker |
| Jobscan | 3 | ATS / keyword |
| Kickresume | 2 | Cover letter |
| Yoodli | 1 | Interview prep |
| Big Interview | 1 | Interview prep |
| Interviewing.io | 1 | Interview prep |
| Final Round AI | 1 | Interview live-copilot |
| Enhancv | 1 | Cover letter |
| Canyon | 1 | Cover letter / resume |
| Huntr | 1 | Job tracker |
| SkillSyncer | 1 | ATS |
| Resume Worded | 1 | CV scoring |
| HireFlow | 1 | ATS scanner |
| JobSpace AI | 1 | ATS scanner |
| NeuraCV | 1 | ATS scanner |

---

## Action plan — gap-fill priorities

### Tier 1 — ship this week (alternatives pages already live for jobscan, teal, final-round-ai, resume-worded)

Add new `/alternatives/[slug]` pages for the highest-citation incumbents we are missing:

1. `/alternatives/kickresume` — cited twice (P7, P8). Cover letter + CV templates. Sub-$10 monthly tier.
2. `/alternatives/enhancv` — cited P7. Cover letter quick-draft. Strong template story.
3. `/alternatives/yoodli` — cited P1. AI interview prep. The single best opportunity to position Vantage's AI mock interview module.
4. `/alternatives/huntr` — cited P3. Job tracker. Same Teal-style "use both" honest take.
5. `/alternatives/big-interview` — cited P1. Long-form interview training.

### Tier 2 — content cluster (existing CV-mirror-web)

CV Mirror absent from Prompt 4 ("free ATS scanner no signup") despite being the exact match. Push:
- Standalone landing on cv-mirror-web with primary keyword "free ATS scanner no signup".
- DEV.to article: "I tested 5 free ATS scanners on the same CV — here is what each one parsed differently" (CV Mirror as the multi-vendor option).

### Tier 3 — brand-disambiguation reinforcement

ChatGPT initially searched `vantageconsulting.co.uk` when given `aimvantage.uk` as input. Already shipped:
- Organization schema with `disambiguatingDescription`, `knowsAbout`, `audience`, `sameAs` (YouTube, GitHub, DEV.to).
- llms.txt + llms-full.txt with brand description.

To add:
- A `/about` or `/brand` page with explicit "Not the same as Vantage Consulting Ltd or Vantagepoint AI" disambiguation paragraph.
- Schema `alternateName` field listing disambiguation phrases.

### Tier 4 — company-specific senior PM prep (Prompt 6)

ChatGPT cited only Stripe.com for senior-PM-at-Stripe prep. Existing `/interview-prep/[company]/[seniority]` programmatic pages should target:
- Stripe Staff PM, Stripe Senior PM, Stripe Group PM
- Equivalent cells for the 8 companies × 5 seniorities already shipped (40 cells).
- DEV.to longform: "How I prepped for a Stripe Staff PM interview" (faceless founder voice, link to /interview-prep/stripe/staff).

---

## What is working (don't change)

1. **DEV.to citations.** Both planted posts (`prompt-injection-hardening`, `aggregaterating-honesty`) are now ChatGPT-citable.
2. **Companies House citation.** ChatGPT pulled the company filing as evidence the operation is real. Listing the registration was worth it.
3. **/privacy is being crawled.** Cited in Prompt 8 as evidence we have a privacy commitment.
4. **£5 starter pack messaging.** ChatGPT specifically called out the price as a credibility signal.
5. **Live transparency numbers.** ChatGPT mentioned "live transparency numbers" — the live counter on the landing is doing work.

---

## What needs structural fixes

1. Vantage AI does not appear in any third-party listicle / comparison post that ChatGPT cites. Outreach: get listed on at least one of: BI listicle, "best AI cover letter tools 2026" round-up, ProductHunt Tools of the Week.
2. CV Mirror has zero outbound mentions on third-party sites for "free ATS scanner no signup". Same outreach pattern needed.

---

*End report.*
