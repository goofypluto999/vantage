# Substack Newsletter — Issue 1, 2026-05-10

> Paste-ready first issue of a Vantage AI Substack. Pulls the
> /state-of-2026 flagship report into a more conversational format
> for a newsletter audience. Free distribution lever — Substack has
> auto-discovery within its own ecosystem (suggested newsletters,
> "what to read" feed) that LinkedIn doesn't.

## Setup (one-time)

1. Go to https://substack.com/signup → "Create a publication"
2. Publication name: `Vantage Notes` (or `The Vantage`)
3. Subdomain: `vantageai` → produces `vantageai.substack.com`
4. Description: "Field notes from a UK indie founder building AI job-prep software. Pre-revenue. 34+ company-specific interview deep-dives. New post weekly."
5. Publication URL: link to https://aimvantage.uk
6. Welcome page: short intro saying the same as above + link to /state-of-2026

After setup, paste the issue below as the first post. Title + subtitle + body all included.

---

## Issue 1

**Title:** What 34 tech interview deep-dives told us about 2026 hiring

**Subtitle:** Five things changed since 2024 that the standard interview-prep playbook does not cover. Plus the data, plus the prep changes that win.

**Tags / categories:** Career, Tech, Interview Prep

**Cover image:** Use a chart screenshot if you make one; otherwise default Substack cover is fine.

---

### Body

Hi — first Substack issue. Quick context: I'm Gio, a UK indie founder building Vantage AI ([aimvantage.uk](https://aimvantage.uk)). Pre-revenue. Sole trader. ICO-registered. I write 34 long-form interview-process deep-dives between March and May 2026 and aggregated the findings into a single trends report. This newsletter is the field-notes version of that work.

If you got laid off in the April-May 2026 wave (Oracle / Meta / ASML / Snap / Nike / Cloudflare cohort, ~43,100 of you), the prep landscape is not what your 2024 advice says it is. Five things changed.

#### 1. The AI-thesis filter is universal now

Of the 34 companies I covered, **28 run an AI-product opinion question** in either the recruiter screen or hiring-manager round. It's structural, not optional.

Cloudflare asks: *"By 2027 most of our network traffic will be AI agents not browsers. Pick one product and tell me what changes."*

Snowflake asks: *"What is your real opinion on AI in the data warehouse? Where is Snowflake right and where is Databricks right?"*

Shopify asks: *"What is your real opinion on the AI-as-default directive? Where do you draw the line?"*

The candidates who pass have a calibrated take that names a specific failure mode. Generic enthusiasm ("AI is going to change everything") loses every round it touches. The candidates who fail are usually the ones with the strongest technical depth on paper — they assume the AI question is a soft opener and answer it like one. It isn't.

> **What to do:** Read the company's most recent AI-product blog post the day before. Identify one specific failure mode you can articulate. "I would not let your agent X because the false-positive cost on Y is Z" wins rounds against generic enthusiasm.

#### 2. Values rounds are weighted heavier than candidates think

21 of 34 companies explicitly run a separate values, culture, or behavioural round with its own rubric. The companies most aggressive about it: Amazon (leadership principles), Shopify (Life Story round), Atlassian, Canva, ServiceNow, Snowflake, Stripe.

The bar-raiser at Amazon still kills more candidates than the system design round. The Life Story round at Shopify is built specifically to detect rehearsed STAR stories. At Canva the values round is a tick-box that is not a tick-box — they run it seriously.

The pattern that surprised me most: **polished generic STAR stories fail more often than rough-but-real ones**. Interviewers across these shops are trained to detect rehearsal and read polish as evasion.

> **What to do:** Have 8-10 stories with real failures, not 4 polished ones. Specific situations with concrete metrics that survive follow-up grilling.

#### 3. Take-homes are returning

18 of 34 companies use a take-home or async exercise as a filter. Linear, Hugging Face, Cursor, Stripe (paid take-home), Anthropic — all leaning hard on take-homes.

The shock for candidates: **take-homes do NOT reward speed**. They reward polish, scope discipline, and a clear README. Linear's take-home is structurally a 6-hour exercise; candidates who spend 30 hours "going above and beyond" get filtered out for inability to manage scope.

> **What to do:** The brief states 4-6 hours. Spend that. Ship a polished slice with a clear README. Spending 30 hours signals inability to manage scope — that's a rejection signal.

#### 4. Open-source signal substitutes for credentials at AI shops

At Hugging Face, Modal, and Cursor the recruiter screen filters explicitly on public open-source signal — merged PRs to widely-used libraries, fine-tunes shipped to public model registries, working Spaces, well-engineered issues that maintainers thanked you for.

At Hugging Face specifically, "I have read the docs" is the end of the recruiter screen. They hire for ecosystem participation, and self-taught engineers with strong Hub presence get loops faster than PhDs with no public artefacts.

> **What to do (especially for the laid-off cohort):** Spend a week before applying pushing one real artefact. A merged PR. A public fine-tune. A Space that solves a real problem. It compounds across the entire job search.

#### 5. The layoff-cohort recruiter window is 6 weeks

I covered 6 layoff cohorts (Oracle, Meta, ASML, Snap, Nike, Cloudflare). Across all of them, peer-company recruiters run targeted outreach against the public LinkedIn cohort within ~2 weeks of the announcement. The inbound queue saturates within ~6 weeks.

For ex-Cloudflare engineers the targeted recruiters are at AWS Edge, Vercel, Fastly, Akamai, and Cloudflare-customer companies (Shopify, DoorDash). For ex-Meta it's Apple, Microsoft, Anthropic, OpenAI, and the Meta-adjacent product surfaces.

The pattern that costs people most: **polishing the CV for 4 weeks before reaching out**. The badge ("ex-Meta", "ex-Cloudflare") has signal value for ~6 months but the recruiter-attention window is much narrower.

> **What to do:** Apply within 2 weeks of the announcement. Polish in parallel.

---

### What I shipped this week

I built Vantage as a tool because I tailored 100+ cover letters by hand last year and most got binned by an ATS in 3 seconds. The tool takes a CV + a job link and gives you a 90-second prep pack: company brief, fit score, tailored cover letter (4 tones), interview questions, 5-minute pitch outline.

Free for the first 10 prep packs. No card. UK indie, sole trader, ICO-registered.

This week I also shipped 9 free in-browser tools that don't need signup:
- [ATS keyword scanner](https://aimvantage.uk/ats/scanner) — paste CV + JD, see missing keywords
- [JD decoder](https://aimvantage.uk/tools/jd-decoder) — read between the lines of a JD
- [CV bullet rewriter](https://aimvantage.uk/tools/bullet-rewriter) — diagnose + rewrite weak bullets
- [30-day post-layoff playbook](https://aimvantage.uk/tools/layoff-playbook) — personalised plan
- [Cover letter A/B comparator](https://aimvantage.uk/tools/cover-letter-compare) — score two drafts
- [Salary negotiation script](https://aimvantage.uk/tools/negotiation-script) — the highest-leverage conversation
- [Roast my cover letter](https://aimvantage.uk/roast) — savage but constructive AI feedback
- [Decode rejection email](https://aimvantage.uk/decode-rejection) — what the recruiter actually meant
- [Ghost-job detector](https://aimvantage.uk/ghost-job-check) — score a job listing 0-100

All free. None of them upload your CV anywhere. Most run entirely in your browser.

---

### Methodology + sources

The full report (with all 34 underlying deep-dives linked) is at [aimvantage.uk/state-of-2026](https://aimvantage.uk/state-of-2026). The methodology section is honest about what's qualitative aggregation vs statistical sampling. Free to cite with attribution.

If you got laid off in the April-May 2026 wave specifically, the cohort pages are at [aimvantage.uk/laid-off](https://aimvantage.uk/laid-off). Each one covers severance / COBRA / vesting timing per company, plus how that cohort's background translates to next-employer ATS systems.

---

### What's next

Next week: a piece on why the take-home filter is back specifically, and what makes a take-home that actually wins (vs the over-engineered ones that fail).

Subscribe if useful. Built solo by a UK indie founder, no team, no PR, no investment. The newsletter is the long-form companion to [aimvantage.uk](https://aimvantage.uk).

— Gio
[aimvantage.uk](https://aimvantage.uk) · ICO ZA pending · Stripe billing only · No upsells

---

## Posting checklist

- [ ] Set publication name + subdomain
- [ ] Set publication description (paste exact wording above)
- [ ] Add aimvantage.uk as the website URL in publication settings
- [ ] Paste this issue as a new post
- [ ] Set a publication cover image (chart screenshot or default)
- [ ] Tag categories: Career, Tech, Interview Prep
- [ ] Schedule for Sunday morning UK time, OR publish immediately
- [ ] Cross-post the link to LinkedIn + X with a 1-sentence intro
- [ ] Add the Substack URL to llms.txt + footer of aimvantage.uk
- [ ] Subscribe to the publication yourself so you appear as a subscriber from issue 1

## Cadence

- Issue 1: this one (post 2026-05-11 ish)
- Issue 2 onwards: every Sunday, 2 weeks after the previous one
- Each issue follows the same pattern:
  1. Hook (one specific finding from a recent deep-dive)
  2. 3-5 bullet-pointed insights with examples
  3. "What to do" prescriptive note
  4. Cross-link to free tools
  5. Cross-link to the underlying deep-dive(s)
  6. Brief CTA back to the product

## Promotion

- Substack auto-discovery (suggested newsletters, "what to read" feed)
- Cross-post to LinkedIn newsletter (different audience overlap, free)
- DM 5 specific people each issue who would value it (template family C in /docs/linkedin-dm-templates-2026-05-10.md)
- After 5 issues, ping 3 newsletter editors ("would you cite us") — Lenny's, The Pragmatic Engineer, Stratechery
