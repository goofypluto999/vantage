# DEPLOY-NOW — distribution payload for aimvantage.uk

> Everything Claude built tonight that needs your finger on the trigger.
> Each section is **one or two clicks**. Most are 30 seconds. Some are 5.
>
> Order matters: do them top-to-bottom for highest leverage.
> Total click time if you do everything: ~45 minutes.

---

## 0. Push the code

```
cd "C:\Cloaude Logic\vantage"
git push origin master
```

This deploys: FAQ, /alternatives x4, live stats counter, llms.txt refresh,
canonical-URL fix in index.html, sitemap-images.xml, internal cross-links,
DEV.to + Hashnode crosspost scripts, expanded /tools page with keyword-mirror
entries, brand disambiguation in Organization schema, /vs/* redirect routes.

Wait for Vercel to finish deploying before continuing (≤ 90 seconds).

## 0b. Redeploy CV Mirror (sister site backlink fix)

CV Mirror at `C:\Cloaude Logic\cv-mirror-web` had 9 stale references to
`vantage-livid.vercel.app` instead of `aimvantage.uk`. They've been fixed in
the source tree. Deploy them:

```
cd "C:\Cloaude Logic\cv-mirror-web"
npx vercel --prod
```

(Or whatever your existing deploy flow is.) **This is a real backlink leak fix** —
CV Mirror is a DA-30+ sister site that should link to aimvantage.uk, not the
old preview domain.

## 0c. Token security — REVOKE FIRST

If you pasted DEV.to or Hashnode tokens in chat (you did), revoke them at:
- https://dev.to/settings/extensions
- https://hashnode.com/settings/developer

Then create new tokens and pass them to scripts via PowerShell environment
variables — never type them in chat:

```powershell
$env:DEV_API_TOKEN = "new_token_here"
$env:HASHNODE_TOKEN = "new_token_here"
$env:HASHNODE_PUBLICATION_ID = "your_pub_id"
```

---

## 1. Re-ping IndexNow after deploy

```
node scripts/indexnow-ping.mjs
```

Tells Bing/Yandex/Seznam to recrawl now that the canonical URL is fixed.
**This matters more than it sounds** — they were indexing the wrong domain before.

---

## 2. Google Search Console

URL: https://search.google.com/search-console

- Add property `aimvantage.uk` (DNS verification — TXT record method)
- Submit sitemap: `https://aimvantage.uk/sitemap.xml`
- Use **URL Inspection** tool on:
  - `https://aimvantage.uk/`
  - `https://aimvantage.uk/faq`
  - `https://aimvantage.uk/alternatives`
  - `https://aimvantage.uk/alternatives/jobscan`
  - `https://aimvantage.uk/alternatives/teal`
  - `https://aimvantage.uk/sample/anthropic-senior-pm`
  - `https://aimvantage.uk/sample/stripe-staff-pm`
  - `https://aimvantage.uk/sample/openai-ml-eng`
  - `https://aimvantage.uk/roast`
- For each: click "Request Indexing"
- Limit is 10/day per property — these are the 8 highest-priority

---

## 3. Bing Webmaster Tools

URL: https://www.bing.com/webmasters

- Add site `aimvantage.uk` (Google Search Console import works — one click)
- Submit sitemap: `https://aimvantage.uk/sitemap.xml`
- Use **Submit URLs** tool — paste these as a batch (Bing allows 10K/day):
  ```
  https://aimvantage.uk/
  https://aimvantage.uk/faq
  https://aimvantage.uk/alternatives
  https://aimvantage.uk/alternatives/jobscan
  https://aimvantage.uk/alternatives/teal
  https://aimvantage.uk/alternatives/final-round-ai
  https://aimvantage.uk/alternatives/resume-worded
  https://aimvantage.uk/compare
  https://aimvantage.uk/sample/anthropic-senior-pm
  https://aimvantage.uk/sample/stripe-staff-pm
  https://aimvantage.uk/sample/openai-ml-eng
  https://aimvantage.uk/roast
  https://aimvantage.uk/laid-off
  https://aimvantage.uk/playbook
  https://aimvantage.uk/skills
  ```

---

## 4. DEV.to cross-posts (DA 90, ~5 min total)

**Get token (60 seconds):** https://dev.to/settings/extensions → "DEV Community API Keys" → click "Generate API Key"

Then in PowerShell:

```powershell
$env:DEV_API_TOKEN = "paste_your_token_here"
node scripts/devto-crosspost.mjs --dry-run    # preview first
node scripts/devto-crosspost.mjs              # publishes 9 posts as drafts
```

Then go to https://dev.to/dashboard, review each draft, click Publish on each.

**Why this matters:** 9 backlinks from DA 90 with `canonical_url` set means
Google attributes the SEO juice to aimvantage.uk while DEV.to's audience
discovers the posts. No penalty risk. Real traffic in 2–4 weeks.

---

## 5. Hashnode cross-posts (DA 90, ~5 min total)

**Set up first time only:**
1. Sign up at https://hashnode.com/signup (use Google OAuth — fastest)
2. Pick a subdomain like `vantage.hashnode.dev` or your name
3. Get publication ID from /settings/general (shows in URL)
4. Get token from https://hashnode.com/settings/developer

```powershell
$env:HASHNODE_TOKEN = "paste_token_here"
$env:HASHNODE_PUBLICATION_ID = "paste_publication_id_here"
node scripts/hashnode-crosspost.mjs --dry-run
node scripts/hashnode-crosspost.mjs
```

Drafts at https://hashnode.com/draft → review → publish.

---

## 6. Medium importer (no API needed, ~3 min)

URL: https://medium.com/p/import (sign in first)

Paste each of these URLs one at a time, click Import:

```
https://aimvantage.uk/blog/how-to-prep-for-any-interview-in-20-minutes
https://aimvantage.uk/blog/the-30-second-cv-review-recruiters-actually-run
https://aimvantage.uk/blog/the-5-minute-interview-pitch-that-gets-you-remembered
https://aimvantage.uk/blog/the-4-cover-letter-tones-and-when-to-use-each
https://aimvantage.uk/blog/what-ats-actually-checks-in-2026
https://aimvantage.uk/blog/how-to-use-chatgpt-to-prep-for-an-interview
https://aimvantage.uk/blog/500-applications-zero-interviews-the-ats-parse-problem
https://aimvantage.uk/blog/how-to-spot-a-ghost-job-in-30-seconds
https://aimvantage.uk/blog/tailoring-every-resume-vs-the-smarter-alternative
```

Medium auto-preserves canonical URL on imports (verified). Cost: 0.

---

## 7. RSS aggregators (one-click each)

Click each link below — most just open the aggregator with your feed pre-filled:

| Aggregator | DA | One-click URL |
|---|---|---|
| Inoreader | 78 | https://www.inoreader.com/?add_feed=https%3A%2F%2Faimvantage.uk%2Frss.xml |
| Feedly | 86 | https://feedly.com/i/discover (search "aimvantage" then click Follow) |
| The Old Reader | 53 | https://theoldreader.com (sign in → Add subscription → paste rss.xml URL) |
| NewsBlur | 60 | https://newsblur.com (Add Site → paste rss.xml) |
| Feedspot | 63 | https://www.feedspot.com/?followfeedurl=https%3A%2F%2Faimvantage.uk%2Frss.xml |
| Blogarama | 50 | https://www.blogarama.com/site-add.php (manual form) |
| Feedreader | 35 | https://feedreader.com (free signup → Add feed) |
| RSSBot.com | 40 | https://rssbot.com (Submit Feed) |

These don't move SEO directly, but they create a discoverable presence for
power users who'd otherwise never find a 6-day-old site.

---

## 8. Directory submissions (~30 min total — biggest blocker is captcha)

See: `DIRECTORY-BUNDLE.md` — all the copy, screenshots URLs, tags, and
deep-links pre-written for 8 high-DA directories. Each takes 2-4 minutes.

Order to do them:
1. Indie Hackers Products (instant approval) — highest community traffic
2. AlternativeTo (1-3 days approval) — captures "Jobscan alternative" SERP
3. StackShare (instant approval) — DA 76
4. SaaSHub (1-2 days)
5. There's An AI For That (manual review, takes weeks but huge listing)
6. AI Tool Net
7. Futurepedia
8. BetaList (queue 2-4 weeks)

---

## 9. Quora answers (slow burn, but compounds for years)

See: `QUORA-ANSWERS.md` — 5 high-quality answer drafts you copy-paste.

Each one has:
- The exact question to find/search for
- A pre-written answer (300-500 words, your voice)
- Where to drop the aimvantage.uk link naturally

Quora answers rank in Google for years and bring trickle traffic forever.
Posting cadence: 1 per day, max. More than that and Quora flags as spam.

---

## 10. After everything: re-ping IndexNow

```
node scripts/indexnow-ping.mjs
```

This is a free signal to Bing/Yandex that there's a fresh deploy. Run after
each batch of changes. No rate limit at sane volumes.

---

## What success looks like in 14 days

| Metric | Day 0 | Day 14 (realistic) |
|---|---|---|
| URLs in Google index | 5-10 | 30-50 |
| URLs in Bing index | 30-50 | 86+ |
| External backlinks | 3 | 20-30 |
| AI assistants citing aimvantage | 0 | 2-5 |
| Directory listings | 2 | 9 |
| Organic Google clicks/day | ~0 | 5-15 |
| Total signups (current 0) | — | 5-30 |

Anything more aggressive than this is either gaming (penalty risk) or
wishful thinking. We're playing the **legitimate fast-growth** game, which
is the only game that compounds without blowing up later.

---

## Stop doing things if any of these happen

- Manual penalty in Search Console → stop all backlinking, focus on content
- Cease & desist from a competitor over comparison page wording → soften
- DEV.to / Hashnode flag account as spam → space out posting cadence

---

Updated: 2026-05-04 by Claude Code
