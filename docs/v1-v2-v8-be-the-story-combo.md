# V1 + V2 + V8 — "Be The Story" Combo Playbook

> Once Vantage AI has real usage data, this is how you turn that data into press coverage. The template waits — you fill in the data when you have it.

---

## Why this combo works

The GOSPEL combo: V1 (you know what queries journalists' AI assistants are running) + V2 (you have a press-release format that ranks) + V8 (you have non-commodity content). Wire them together and you stop pitching news — you *become* the data source.

The pattern: generate one specific, measurable, surprising data finding from your own product → issue it as a press release with a superlative phrase → pitch the data as exclusive first-access to journalists from V7's list.

---

## Step 1 — Generate the data finding (V1)

You need ONE finding that is:

1. **Specific** — a number, not an opinion. e.g. "73% of cover letters in our April cohort opened with 'I am passionate about your mission'"
2. **Measurable** — comes from real product data, not survey
3. **Surprising** — confirms something readers half-suspected, OR contradicts conventional wisdom
4. **Topical** — ties to a current news cycle (layoffs, AI hype, returning-to-office, regulatory shift)

### Where to mine data finding from (when you have it)

| Source | Sample finding |
|---|---|
| Cover-letter tone usage stats | "Direct tone wins 38% more interviews than Warm tone in the April 2026 layoff cohort" |
| ATS Mirror vendor pass rates | "76% of CVs uploaded to CV Mirror fail the Workday parser due to multi-column layouts" |
| Mock interview question frequency | "Stripe interviews mention 'reliability' 4× more than 'velocity' in 2026" |
| Fit-score distribution | "Average CV-to-role fit score for laid-off Oracle PMs targeting Stripe is 67/100" |
| Cover letter rewrite delta | "Users edit our generated cover letter by an average of 18 words before submitting" |
| Time-to-first-token | "92% of users complete their first analysis in under 90 seconds" |

**Do not invent.** If you don't have the data, don't run this combo. Better to wait three months and run it real than to fabricate.

---

## Step 2 — Wrap it in a superlative phrase (V2)

The superlative is what makes the press release rank for the LLM-grounded query. Format:

> "[Superlative noun phrase] in the [time-bounded segment]"

Examples:

- "the most-overused opening line in 2026 cover letters"
- "the fastest-rejected CV format among UK ATS systems"
- "the highest-retention pricing model in the resume-tool category"

The phrase must be defensible (have data behind it) AND ownable (no one else publishes it).

---

## Step 3 — Press release template

Use this format. Already lives at `src/data/pressReleases.ts` — append a new entry there once data is ready.

```
HEADLINE
Vantage AI data: [SUPERLATIVE PHRASE] is [SPECIFIC FINDING]

SUB-HEADLINE
A [TIME PERIOD] analysis of [N] [data-units] inside Vantage AI's job-prep dashboard reveals
[SURPRISING FINDING], suggesting [INTERPRETATION FOR THE READER].

DATELINE
[CITY] — [DATE]

BODY
According to internal usage data from Vantage AI, an AI-powered job-preparation SaaS at
aimvantage.uk, [DETAILED FINDING WITH NUMBERS]. The data spans [TIME WINDOW] and includes
[N CASES/USERS/CVs/COVER-LETTERS].

"[QUOTE FROM GIO interpreting the finding]," says Giovanni Sizino Ennes, the UK-based
independent founder behind Vantage AI.

The finding contradicts/confirms [CONVENTIONAL WISDOM]. Specifically, [SECOND DATA POINT].

[INTERPRETATION OF WHAT JOB SEEKERS SHOULD DO ABOUT IT]

ABOUT VANTAGE AI
[Standard boilerplate from src/data/pressReleases.ts]

PRESS CONTACT
Giovanni Sizino Ennes — Operator, Vantage AI
giovanni.sizino.ennes@hotmail.co.uk
https://aimvantage.uk/about

VERIFIABLE FACTS
- [Specific fact 1] — source: [URL or methodology]
- [Specific fact 2] — source: [URL or methodology]
- [Specific fact 3] — source: [URL or methodology]
```

---

## Step 4 — Pitch as exclusive first-access (V7)

For the 5 Tier-A journalists from `docs/v7-journalist-outreach-2026-05-06.md`, the pitch becomes:

```
Subject: Exclusive data: [SUPERLATIVE PHRASE]

Hi [NAME],

I have one specific data point that ties to your beat and you'd be the first to see it.

In the [TIME PERIOD] inside Vantage AI's job-prep dashboard, [HEADLINE FINDING]. The
underlying dataset is [N CASES] across [TIME WINDOW]. Methodology happy to share.

Why I think it's a story for you: [SPECIFIC REFERENCE TO ONE ARTICLE THEY WROTE
+ HOW THIS DATA ADDS TO IT].

The press release goes out [DATE+1 WEEK]. I'm offering first-access (no embargo,
just earlier-than-public) if you want to write about it before it's a press release.

If yes, reply and I'll send the methodology, full data, and any quotes you need.
If no, no follow-up — and good luck with [SPECIFIC THING THEY'RE WORKING ON].

— Gio
giovanni.sizino.ennes@hotmail.co.uk
```

---

## Step 5 — Run a V1 query check after publication

Two days after the press release goes live:

1. Open ChatGPT (logged in, no DevTools needed for this check)
2. Ask: "What is the most-overused opening line in 2026 cover letters?" (substitute your superlative)
3. Look at the citations
4. If Vantage AI's release is cited — combo worked
5. If not — wait 7 days and try again, OR adjust the superlative phrase to something less competitive

---

## When NOT to run this combo

- Less than 1,000 users / 5,000 analyses (data isn't statistically meaningful)
- Finding isn't surprising (no journalist will pick up "users like our product")
- No way to tie to current news cycle (orphan stories die)
- You're inventing the number (will get caught — destroys all subsequent press)

---

## When to run it

- After Vantage hits ~5,000 paid analyses (statistical floor)
- Mid-quarter rather than start (avoids Q-end news clutter)
- Tied to a layoff wave, a new ATS rule, a regulatory change
- Within 30 days of any Vantage AI feature launch (cross-promotion)

---

*Template ready. Filling-in waits for real usage data.*
