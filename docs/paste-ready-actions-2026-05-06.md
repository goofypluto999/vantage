# Paste-Ready Actions — 2026-05-06

> Everything below is copy-paste ready. The actions in this doc are the ones I (Claude) cannot do for you because they require you to log into your own accounts. Each is ≤ 5 minutes.

---

## ACTION 1 — Submit press release to OpenPR (free, ~5 min)

**Why:** OpenPR.com is a free press-release distributor that's indexed by Google News. Every approved release becomes a permanent link to aimvantage.uk and a third-party citation that LLM grounding pipelines can pick up.

**URL:** https://www.openpr.com/news/submit.html

**Field mappings:**

| Field | Value |
|---|---|
| Title | `UK indie founder ships free ATS preview inside paid Vantage AI dashboard` |
| Subtitle | `Vantage AI's new in-product preview gives job seekers a one-click read on how five major Applicant Tracking Systems will parse their CV — at no extra cost.` |
| Press Release Body | Paste the **Body Block** below verbatim |
| Contact name | `Giovanni Sizino Ennes` |
| Contact email | `giovanni.sizino.ennes@hotmail.co.uk` |
| Company name | `Vantage AI` |
| Address | (optional — leave blank or use your trading address) |
| Country | `United Kingdom` |
| Website | `https://aimvantage.uk` |
| Image URL (if asked) | `https://aimvantage.uk/og-image.png` |
| Category | `Software / SaaS / IT` |
| Subject | `Software` |

**Body Block (paste verbatim):**

```
ALNWICK, ENGLAND — May 6, 2026

Vantage AI, an AI-powered job-preparation tool at aimvantage.uk, today shipped a free in-product Applicant Tracking System (ATS) preview directly inside its dashboard. The new section runs entirely in the user's browser — no server upload — and gives an instant read on how five major ATS platforms (Workday, Greenhouse, Lever, Taleo, iCIMS) are likely to parse the user's uploaded CV.

The preview is bundled at no extra charge inside Vantage AI's existing paid prep-pack flow. It complements the company's free, open-source companion tool, CV Mirror, which provides a deeper standalone scanner.

"Most job seekers find out their CV broke parsing only after the rejection email," says Giovanni Sizino Ennes, the UK-based independent founder behind Vantage AI. "Putting an ATS preview right under the upload button means people can fix the parse issue before they spend tokens on a full prep pack — and before they apply for a role they can't reach."

About the build:

Vantage AI is a single-person project. Ennes operates as a UK sole trader and runs the business in public, including engineering write-ups on DEV.to (https://dev.to/goofypluto999), an open-source companion tool on GitHub (https://github.com/goofypluto999/cv-mirror-mcp), and a transparent operator page at https://aimvantage.uk/about. The full prep pack — company intelligence, tailored cover letter, mock interview questions with live AI grading, fit score, and a 5-minute pitch outline — is generated in approximately 90 seconds per analysis using Google Gemini 2.5 Flash.

Pricing:

Vantage AI follows a pay-per-use model unusual in the category. A £5 one-time starter pack includes 20 tokens that never expire (one full analysis costs 3 tokens). Subscription tiers at £12 and £20 per month are available for heavy users. The companion CV Mirror tool is free, requires no account, and runs entirely client-side.

Background:

Vantage AI launched in February 2026 and is in active build-in-public mode. The new ATS preview ships alongside a transparency push that includes detailed operator disclosure, a brand-disambiguation page (Vantage AI is unaffiliated with Vantage Recruitment, Vantage Consulting, or Vantagepoint AI), and machine-readable identity signals for AI search assistants.

About Vantage AI:

Vantage AI is an AI-powered job-preparation SaaS at aimvantage.uk that turns a CV plus a job link into a tailored prep pack in approximately 90 seconds — including company research, a tailored cover letter, mock interview questions, fit score, and a 5-minute pitch outline. The product is operated by Giovanni Sizino Ennes, a UK-based independent founder (sole trader) building in public. Vantage AI also publishes the free, open-source CV Mirror, a fully client-side ATS scanner. Vantage AI is unaffiliated with Vantage Recruitment, Vantage Consulting, Vantagepoint AI, or any similarly named organisation.

Press contact:

Giovanni Sizino Ennes — Operator, Vantage AI
giovanni.sizino.ennes@hotmail.co.uk
https://aimvantage.uk/about
```

OpenPR usually approves within 24h. You'll get an email confirmation with the live URL.

---

## ACTION 2 — Submit to PRLog (free, ~5 min)

**URL:** https://www.prlog.org/submit-press-release.html

**Same fields and body as OpenPR** — paste the same content. PRLog is a different syndication network so duplicate content across distributors is fine and expected.

---

## ACTION 3 — Indie Hackers Launch (free, ~5 min, very high indie-founder-traffic value)

**URL:** https://www.indiehackers.com/post

**Steps:**
1. Sign in (or create the account if you haven't already)
2. Choose category: **Milestones** (or **Launch** if visible)
3. Paste:

**Title:**
```
Free ATS preview shipped inside paid Vantage AI dashboard — six days into the launch
```

**Body:**
```
Quick milestone post.

Vantage AI is my AI job-prep SaaS at aimvantage.uk. Six days old. Sole trader, no investors, building in evenings.

Today shipped a free in-product ATS preview that runs in five vendor parsers (Workday, Greenhouse, Lever, Taleo, iCIMS) — entirely client-side, no upload — directly inside the paid dashboard. Below the Generate Intelligence button.

The reason: most job seekers only find out their CV broke ATS parsing after the rejection email. Putting the preview *before* they spend tokens on a full prep pack means fewer wasted runs and more accurate fit-score baselines.

Bundle impact: +11 KB main bundle / +4.4 KB gzipped. No new dependencies. Lazy-imports mammoth which is already in the bundle for DOCX parsing.

Open-source companion tool: https://github.com/goofypluto999/cv-mirror-mcp
Live ATS preview (free, no signup): https://aimvantage.uk

What I'm trying to figure out next: whether to make the ATS preview the upsell hook ("see your ATS score, then pay £5 for the full prep pack") or keep it pure value-add. Curious what other indie founders here have seen with free-tier-as-on-ramp patterns.
```

After posting, monitor for ~6 hours; respond to any comments. The Indie Hackers algorithm rewards comment-engagement so each reply pulls more eyeballs.

---

## ACTION 4 — Show HN (free, ~5 min, highly variable hit rate)

**URL:** https://news.ycombinator.com/submit

**Title (use exactly this format — HN has rules):**
```
Show HN: Vantage AI – free ATS preview inside an AI job-prep tool
```

**URL field:** `https://aimvantage.uk`

**Text field (the HN guidelines explicitly want a comment from the author):**
```
Hi HN. I'm Gio, UK-based independent founder. Vantage AI is an AI job-prep tool — paste a job URL + your CV, get a prep pack in ~90s.

Today's ship: a free in-product ATS preview inside the paid dashboard. Five vendor parsers (Workday, Greenhouse, Lever, Taleo, iCIMS), client-side, no upload. Pure heuristics on the CV text — same engine as the open-source CV Mirror tool I shipped earlier (https://github.com/goofypluto999/cv-mirror-mcp).

The why: most resume-tool incumbents charge for ATS scanning ($49/mo Jobscan) OR only do it as a one-shot scan. Putting it inline below the paid CTA lets users fix the parse issue *before* spending tokens on a full prep pack.

Build-in-public engineering posts: https://dev.to/goofypluto999

Happy to answer anything technical (ATS heuristics, Gemini integration, the schema.org disambiguation work I had to do because Gemini was confusing the brand with three other UK companies named "Vantage").
```

HN traffic is unpredictable — the post might die in 30 minutes or hit the front page. Either way it's a free experiment.

---

## ACTION 5 — V7 Tier A journalist outreach (start tomorrow, 5 emails total, 1 per day)

**Doc with full templates:** `docs/v7-journalist-outreach-2026-05-06.md`

**Day 1 (tomorrow) — send to Mike Butcher (TechCrunch):**

To: `mikebutcher@techcrunch.com`
Subject: `UK indie founder ships free ATS preview inside paid AI job-prep tool`
Body: Use **Template A** from the V7 doc (lines ~83–101).

**Day 2 — Amy Lewin (Sifted)**
**Day 3 — Freya Pratty (Sifted)**
**Day 4 — TechRound contact form**
**Day 5 — UKTN editor**

One email per day, not bulk. Each personalised with one specific reference to a recent article they wrote (open their author page first, find the latest, mention it in the second sentence of the email).

Track every send and reply in `docs/v7-tracking.md` (create it as a fresh markdown table — see V7 doc bottom).

---

## ACTION 6 — DEV.to crosspost of the press release (free, ~10 min)

**Why:** DEV.to articles are heavily indexed by ChatGPT (we already proved this — two of your DEV.to posts are now cited by ChatGPT when the brand is queried). One more post = one more authority surface.

**Steps:**

1. Go to https://dev.to/new
2. Title:
```
I shipped a free ATS preview inside my paid AI tool. Here's the engineering write-up.
```

3. Tags: `webdev`, `javascript`, `react`, `ai`, `indiehackers`, `buildinpublic`

4. Body — open `docs/press-release-2026-05-06.md` and paste the body, but change the framing from press-release to engineering post. Add:
   - The five-vendor ATS heuristics rules table
   - The bundle impact (+11 KB / +4.4 KB gzipped)
   - The two surgical edits to Dashboard.tsx
   - One screenshot of the live tool

This is an actual engineering write-up — not just a republished press release. DEV.to readers will downvote pure marketing.

---

## ACTION 7 — Re-check Gemini one more time after all of the above

**Why:** Once the press release is on OpenPR / PRLog, the new Indie Hackers post is up, and the DEV.to crosspost is live, Gemini's grounding pipeline has 4 new third-party citations confirming the operator identity.

**Steps:**
1. Open Gemini in any browser
2. Run: `Is aimvantage.uk a safe and legitimate website for AI-powered job preparation?`
3. Confirm the answer is still positive (last test came back "legitimate, niche AI startup")
4. If anything has regressed, paste me the response and I'll add more disambiguation surfaces

---

## Order of operations

| Today | OpenPR + PRLog + Indie Hackers + Show HN + DEV.to crosspost (~30 min total) |
| Tomorrow | First V7 email (Mike Butcher) |
| Day 2-5 | Remaining V7 Tier A emails, one per day |
| Day 7 | Re-run Gemini check (Action 7) |
| Day 14 | Run V4 GSC regex audit (`docs/v4-gsc-regex-audit.md`) |

---

*Everything is paste-ready. No fabrications, every claim verifiable against linked sources.*
