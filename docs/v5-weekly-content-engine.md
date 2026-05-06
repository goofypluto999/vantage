# V5 — Sustainable Weekly Content Engine

> One blog post per week. Always non-commodity, always grounded in real material. No exceptions.

---

## The rule

Each week you ship **one** post that satisfies all of these:

1. ✅ **Non-commodity title** — passes the `scripts/new-blog-post.mjs` blocklist (no Top-N, no listicles, no "ultimate guide", no "how to" generics, no "why you" generics).
2. ✅ **At least 2 of 4 source-material fields filled** — git-log reference, user signal, concrete data, specific moment. Forced by the script.
3. ✅ **One concrete number per post** — your own usage data, public stat, or measured observation. No round-number guesses.
4. ✅ **Cross-linked to one tool page** — `/alternatives/[slug]`, `/salary/[role]`, or `/interview-prep/[company]/[seniority]`.
5. ✅ **Vantage upsell ≤ 3 sentences** — point is the post, not the conversion.

Posts that fail any of these get rejected by the script before they're written. Speed-over-specificity is what kills domains in 2026 (per the GOSPEL).

---

## The cadence

| Day | Action | Time |
|---|---|---|
| Monday | Open the week's source material — git log, support inbox, Vantage usage stats, GSC queries. Pick the angle. | 30 min |
| Tuesday | Run `node scripts/new-blog-post.mjs` and fill in source fields. Script writes a draft. | 30 min |
| Wednesday | Replace TODOs. Add the concrete data + sections. | 60 min |
| Thursday | Run `npx tsc --noEmit && npm run build`. Commit. | 15 min |
| Friday | Push. Cross-post to DEV.to with same body but a different title (per the V1+V8 combo — different keyword surface). | 15 min |

**Total time per week: ~2.5 hours.** The GOSPEL says you need 2 hours/week minimum — this fits inside that budget.

---

## The four source-material taps

Every post must pull from at least 2:

### Tap 1 — git log

```bash
git log --since="1 week ago" --oneline
```

Pick one commit that changed user-visible behaviour. Not a chore commit, not a docs-only commit. Something a user would notice or care about. The post explains *why* the change happened — what user pain or technical insight produced it.

### Tap 2 — user signal

Open these inboxes and find one quote:

- Support emails to giovanni.sizino.ennes@hotmail.co.uk
- DEV.to comments on planted articles
- Reddit threads where Vantage / CV Mirror was mentioned
- Twitter mentions of @aimvantage / your DEV.to handle

If the user said it in their own words, paste their words. Anonymise if needed. One real quote beats five fabricated personas.

### Tap 3 — concrete data

Pick one of:

- Vantage usage data (e.g. "the most-used cover-letter tone is Direct, ~47% of all generations")
- Public industry data (BLS, ONS, Companies House, Crunchbase) — must cite source
- Measured observation from your own A/B tests, build benchmarks, or experiments

Round numbers are suspicious. "About 42,000" is fine because it's the actual reported number. "Approximately 80% of users" without a count is not.

### Tap 4 — specific moment

The single scene that surfaced this insight. Real, dated, named. Examples:

- "Last Tuesday I was rebuilding the cover-letter tone-switcher and noticed…"
- "A user emailed me on 4 May saying their CV had been rejected from 30 jobs in a row…"
- "While testing CV Mirror against my own CV I found that…"

If you can't write the specific moment, you don't have the post yet. Don't ship.

---

## The non-commodity title formula

| Pattern | Example | Why it works |
|---|---|---|
| First-person + specific number | "I sat behind a recruiter for 80 CV scans. She rejected 71 in 30 seconds each." | Identifiable, dated, falsifiable. |
| Real-source citation | "r/jobsearchhacks just admitted: tailoring every resume stops working at 30+ applications." | External proof, time-bound. |
| Public-data anchor | "42,000 tech workers got laid off last month. Here is the fix-list before applying." | Verifiable, current, urgent without theatre. |
| Counter-finding | "I tested 5 real ATS parsers on the same CV. Here is what each one dropped." | Promises specifics, delivers them. |
| Surprising delta | "I rewrote the same cover letter in 4 tones across 50 applications. The tone that won was not the one I expected." | Curiosity gap grounded in real data. |

### Patterns to avoid

The script blocks these. If you find yourself writing one, the post is too generic to ship.

- ❌ Top-N / listicle ("Top 10 ATS Tips")
- ❌ N-things / N-ways ("5 Things You Need")
- ❌ Best-of ("Best 10 Resume Tools")
- ❌ How-to commodity ("How to Write a Resume")
- ❌ Why-you commodity ("Why You Need to Tailor Your Resume")
- ❌ Ultimate / Complete guide ("Ultimate Guide to ATS")
- ❌ Everything-you-need-to-know

The blocklist is in `scripts/new-blog-post.mjs` — extend it as you spot new commodity shapes.

---

## How to use the script

```bash
# Interactive mode (recommended):
node scripts/new-blog-post.mjs

# Or pass the title directly:
node scripts/new-blog-post.mjs "I shipped 47 commits last week. Three changed user behaviour."
```

The script will:
1. Reject the title if it's commodity-shaped (with a specific reason)
2. Ask for description, hook, and the 4 source-material fields
3. Refuse to continue if fewer than 2 source fields are filled
4. Insert a draft skeleton into `src/data/blogPosts.ts`
5. Print the next steps

You then open `src/data/blogPosts.ts`, find the `// === DRAFT ===` marker, and finish writing.

---

## Cross-link rule

Every post body must include at least one internal link to a *tool page*. Pick one:

- `/alternatives/[slug]` — for any post about competitor comparisons or pricing
- `/salary/[role]` — for any post about compensation or career value
- `/interview-prep/[company]/[seniority]` — for any post about specific company/role prep
- `/laid-off-from/[company]` — for any post about a specific layoff cohort

Why: cross-links spread link equity through the programmatic SEO layer and make pages more likely to rank as a cluster.

---

## What this engine produces over 30 weeks

- 30 non-commodity posts
- 30 unique source-material citations (git log, user quotes, public data, real moments)
- 30 internal cross-links to tool pages
- One DEV.to crosspost per week (~30 backlinks compounding)
- Zero commodity content — domain stays clean

The GOSPEL: "Templated content kills domains." This is the opposite — every post is one-of-one.

---

*End spec.*
