# V4 — Google Search Console Regex Audit

> What to do once aimvantage.uk has 7+ days of GSC data. Until then, this doc waits.

---

## Why wait

A 6-day-old domain has near-zero impressions. Running the regex audit now returns empty result sets. Wait until Search Console shows at least:

- 100+ total impressions in the Performance report
- 5+ unique queries with at least 5 impressions each
- 7+ days of data in the date range

Typical timeline for a fresh domain with sitemap submitted: ~10–14 days.

---

## Step 1 — Open the Performance report

1. Go to https://search.google.com/search-console
2. Top-left dropdown → select `https://aimvantage.uk/`
3. Left sidebar → **Performance** → **Search results**
4. Top of page → **Date** filter → **Last 28 days** (or longest available)

---

## Step 2 — Run the informational-intent regex

This finds queries where users are asking questions, looking for explanations, or doing pre-purchase research. These are pages where you should rank a blog post, not a product page.

1. Click **+ New** at the top of the table
2. Choose **Query**
3. Choose **Custom (regex)** → **Matches regex**
4. Paste:

```regex
^(how|what|why|when|where|who|is|are|can|should|does|do|will|would|could|which)\b
```

5. Click Apply
6. **Sort by Impressions descending**

Output: every search where someone asked a question that landed on aimvantage.uk.

### What to do with the output

| Pattern | Action |
|---|---|
| Question matches a blog post we have | Verify the blog post is the top result; rewrite the title using the V8 formula if CTR is below 2% |
| Question doesn't match any post we have | Write a post for it next week (V5 input) |
| Question matches a programmatic page (e.g. /salary/[role]) | Add a small "Q&A" block at the top of that page using the question as a header |
| CTR below 2% with high impressions | Title is a commodity; rewrite using non-commodity formula (V8) |

---

## Step 3 — Run the commercial-intent regex

This finds queries where the searcher is shopping — comparing tools, pricing, reading reviews. These are pages where alternatives / comparison pages should win.

1. Click **+ New** at the top of the table again (replace the previous filter)
2. Query → Custom (regex) → Matches regex
3. Paste:

```regex
\b(best|alternative|alternatives|vs|versus|compare|comparison|review|reviews|pricing|cost|cheap|cheaper|affordable|free)\b
```

4. Apply
5. Sort by Impressions descending

### What to do with the output

| Pattern | Action |
|---|---|
| "[X] alternative" where X is a competitor we have a page for | Confirm /alternatives/[x] is the landing URL; check CTR |
| "[X] alternative" where X is a competitor we don't have a page for | Add a new entry to `src/components/AlternativesPage.tsx` next sprint |
| "[product] review" or "[product] pricing" | Add a callout to the alternatives page that addresses pricing transparently |
| "best AI [category]" | Write a long-form post that lists the category honestly, with Vantage as one option |

---

## Step 4 — Run the brand-disambiguation regex

Identify queries where users are confused between Vantage AI and similarly-named businesses.

1. New filter → Query → Custom (regex) → Matches regex:

```regex
\bvantage\b
```

2. Apply, sort by Impressions

### What to do

| Pattern | Action |
|---|---|
| "vantage ai" landing on aimvantage.uk | ✅ Correct |
| "vantage" alone, mixed CTR | Acceptable; if CTR is very low, the brand-disambiguation work needs more reach |
| "vantage recruitment", "vantage consulting", "vantagepoint" | These should NOT land on us — if they do, we're cannibalising someone else's brand. Check that /about's "We are not affiliated with…" paragraph is rendering. |
| Any "vantage scam" or "vantage phishing" query | Re-run trust-thread checks: CheckPhish, Norton, Google Safe Browsing. Update /about FAQ. |

---

## Step 5 — Run the laid-off-cohort regex

Targets the active layoff news cycle.

```regex
\b(laid off|layoff|layoffs|fired|let go|redundancy|severance|cut)\b
```

What to do: every match should land on `/laid-off` or `/laid-off-from/[company]`. If they're landing on the homepage instead, add internal links from the homepage to the cohort pages.

---

## Step 6 — Pages report (parallel check)

Switch the Performance report from "Queries" tab to "Pages" tab.

Sort by Impressions descending. For each page:

- ✅ If it's in the top 20 — keep, monitor CTR
- ⚠️ If CTR is below 2% with > 100 impressions — title rewrite (V8)
- ⚠️ If position is between 11–25 — page is one tweak away from page 1; rewrite the meta description and add 1 internal link from a higher-authority page
- ❌ If position is 50+ with > 50 impressions — page is being shown but never clicked; either the title is wrong or the snippet is wrong

---

## Output: a punch list

After the audit, you should have a single markdown table of actions:

```
| Action | Page / file | Why |
|---|---|---|
| Rewrite title (V8) | src/data/blogPosts.ts entry "..." | CTR 0.8% with 200 impressions |
| New /alternatives/[x] page | src/components/AlternativesPage.tsx | "[x] alternative" got 50 impressions, no page exists |
| ... | ... | ... |
```

Save as `docs/v4-gsc-audit-results-YYYY-MM-DD.md`. This becomes the next sprint's content backlog.

---

## Cadence

Run this audit:

- **Once at day 14** to establish the baseline
- **Monthly thereafter** — last Sunday of every month
- **After any major content push** (when you ship 5+ new posts in a week)

---

*Doc waits for traffic data. No action today. Set a calendar reminder for 20 May 2026.*
