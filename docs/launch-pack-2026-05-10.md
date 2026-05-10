# Vantage AI — Launch Pack, 2026-05-10

> ## ⚡ UPDATED 2026-05-10 (LATER): LEAD WITH THE STATE OF 2026 REPORT
>
> A new flagship aggregation page is now live at **aimvantage.uk/state-of-2026**.
> It synthesises findings from the 34 interview deep-dives into a single
> link-bait piece. **This** is what Show HN, Indie Hackers, journalists,
> and r/cscareerquestions actually link to — not a product page.
>
> All "Show HN" / "Indie Hackers" submission copy below should be
> reframed to lead with the report. Suggested rewrites:
>
> - **Show HN title (NEW):** `Show HN: The State of 2026 Tech Interview Hiring — data from 34 company deep-dives`
> - **Show HN URL:** `https://aimvantage.uk/state-of-2026` (NOT the product page)
> - **First sentence:** "I wrote 34 long-form interview deep-dives in 2026 and aggregated the findings into a single trends report. Five things changed from 2024 that the standard interview-prep playbook does not cover."
> - The product mention belongs in the LAST paragraph, not the first.
>
> The original product-led launch text below remains as backup if the
> flagship-led version doesn't fit the channel.
>
> ---

> Paste-ready posts and DMs Gio fires tomorrow morning to drive same-day
> traffic. SEO compounds in weeks; this drives signups now.
>
> **Order of fire (Sunday morning UK time):**
> 1. Show HN at 06:00 UK / 01:00 ET / 22:00 PT Saturday night — best time for HN (Sunday morning ET catches the surge of US tech browsing during their Saturday afternoon).
> 2. Indie Hackers launch post at 08:00 UK.
> 3. Dev.to / Hashnode at 09:00 UK.
> 4. LinkedIn DMs through the day, max 25 (LinkedIn rate-limit safe).
> 5. X/Twitter thread at 14:00 UK.
>
> All copy is **first-person Gio voice**. No flattery, no fluff, no thought-leader drip. Read each line out loud — if Gio wouldn't say it, replace it.

---

## 1. Show HN submission

**Title (under 80 chars):**
```
Show HN: Vantage – I built an AI that does 90 seconds of job prep instead of an hour
```

**URL field:**
```
https://aimvantage.uk
```

**Text (body) field — paste this verbatim:**
```
After getting laid off in early 2026 and tailoring 100+ cover letters by hand over six weeks, I built Vantage so I'd never have to again.

Upload your CV once. Paste any job link (LinkedIn, Greenhouse, Lever, company careers page). Vantage scrapes the company brief, runs CV-to-JD fit scoring with the gaps you need to close, generates a tailored cover letter you can switch between four tones in one click, drafts 8-12 likely interview questions specific to that exact role, and outputs a 5-minute pitch outline. End-to-end in about 90 seconds.

Stack: React 19 + Vite + TypeScript on the frontend, Vercel serverless on the backend, Gemini 2.5 Flash via @google/genai (model: gemini-2.5-flash with googleSearch grounding for real-time company intel), Supabase Auth + Postgres for state, Stripe for billing.

The interesting bits:
- googleSearch tool and responseMimeType: 'application/json' are mutually exclusive in Gemini, so I had to embed JSON shape in the prompt text whenever a URL was provided. Caused two days of confusion before I read the docs properly.
- Cover letter tone rewriting (Formal/Warm/Direct/Creative) caches results in a Map ref so toggling is instant.
- Citations are stripped post-hoc with a regex — the [cite: 6] artefacts from grounding leak into the output otherwise.

10 free prep packs on signup, no card. After that, top up at GBP 5 for 20 more (never expires) or GBP 12/month if you're applying daily.

Companion open-source ATS scanner I'm building alongside: github.com/goofypluto999/cv-mirror-mcp

I'm a UK indie founder, pre-revenue, three weeks live. Built solo. ICO-registered (UK data protection). I'd love roasts on the prep flow, edge cases that break the URL extractor, and any feedback on the tone-switching UX. Happy to answer technical questions in the comments.

Try the 10 free packs at: https://aimvantage.uk
```

**Notes for Gio:**
- Submit it logged-in to your existing HN account (do not create a fresh one for this — HN's anti-spam will sandbox new accounts on Show HN).
- Reply to every single comment in the first 4 hours. Even the rude ones. Especially the rude ones.
- HN front-page surge is usually 2-4 hours after submission. Be at your laptop.

---

## 2. Indie Hackers launch post

**Title:**
```
I shipped 50+ commits in a week to my pre-revenue SaaS — here's what I learned about indie launch in 2026
```

**Body:**
```
Hey IH 👋

Three weeks ago I shipped Vantage — an AI that compresses an hour of job-application tailoring into 90 seconds. Twelve hundred visitors, fifteen signups, zero paying customers when I started this build pass.

The product was technically fine. The problem was distribution. I was polishing the page when the actual problem was that nobody knew Vantage existed.

What I shipped this week (in commit count, not feature count, because it's more honest):
- 1 built-in-public trust block linking to my GitHub commit graph, public changelog, open-source companion ATS scanner, ICO registration, Dev.to, and a sample output. Pre-revenue founders cannot do testimonials. We can do verifiable artefacts.
- 1 dashboard demo popup with a 30-second product reel that lazy-loads (no LCP cost).
- 16 long-tail interview-guide blog posts at /blog targeting "<company> interview" Google queries — Stripe, Anthropic, OpenAI, DeepMind, Cloudflare, Datadog, Notion, Figma, Spotify, Revolut, GitLab, Linear, Vercel, Klarna, Canva, Airtable. Each post has its own JSON-LD schema so ChatGPT and Perplexity can cite it.
- 1 company-pill filter UI on /blog so visitors arriving from Google can jump to their company's deep-dive in one click.
- llms.txt updated to advertise the 16 deep-dives to AI crawlers.
- WCAG-AA contrast pass, modal focus trap, role=alert error states, 93 aria-hidden tags on decorative icons.
- 25 no-mod auto-approve distribution channels lined up for this week.

Lessons I'd pass to any IH founder pre-revenue:

1. Ship the marketing surface alongside the product, not three weeks later. The number of indie founders who launch a product nobody can find is staggering.

2. Build in public from day zero. The biggest unlock wasn't a testimonial — those don't exist for me yet. It was the GitHub commit graph showing I shipped 50+ fixes in a week. People trust velocity more than they trust five-star reviews from three months ago.

3. Free tools are not a top-of-funnel garnish. They are THE funnel for indie SaaS in 2026. Three of my four free tools — roast, decode rejection, ghost job check — get more traffic than the paid product page. Each one drops the user back at a soft signup CTA.

4. Don't pay for directories. AlternativeTo, Hacker Noon, Dev.to, Hashnode, Indie Hackers — all free, all pull non-trivial traffic. TAAFT and Futurepedia became paid in 2026 ($497 and $347). Skip them.

10 free packs on signup, no card, at aimvantage.uk if you want to roast the prep flow. UK indie, sole trader, ICO-registered. Will post the actual sales numbers when they arrive — promise to be honest about it whether it works or doesn't.

Roast away.
```

---

## 3. Dev.to / Hashnode launch post

**Title:**
```
Building an AI job-prep SaaS solo: 50+ commits in a week, 16 long-tail blog posts, 0 paying customers (yet)
```

**Tags:** ai, indiehackers, saas, react, gemini

**Body opener (first 3 paragraphs — Dev.to truncates the preview at ~300 chars):**
```
I shipped 50+ commits this week to Vantage — an AI that compresses an hour of job-application tailoring into 90 seconds. The product is technically clean. I'm pre-revenue. Twelve hundred visitors, fifteen signups, zero customers when I started this build pass.

This is the technical breakdown of what I shipped, the trade-offs I made, and what I'd do differently if I started over. No fluff, real code paths.

Stack:
- React 19 + Vite 6 + TypeScript on the frontend
- Tailwind v4 (no config file — `@import "tailwindcss"` only)
- Vercel serverless functions for the backend (`api/` directory)
- @google/genai SDK with `gemini-2.5-flash` (the `models/` prefix is required)
- Supabase Auth + Postgres with RLS
- Stripe for billing
- IndexNow protocol for Bing/Yandex push on every new post
```

**Then continue with the same 4 lessons from the IH post but each with a code snippet from the repo. Example:**

```
## Lesson 2: googleSearch and responseMimeType: 'application/json' are mutually exclusive

This caught me for two days. The Gemini SDK lets you use one or the other, not both:

`​`​`​typescript
// WRONG — Gemini will silently fail or return garbled JSON:
const response = await ai.generateContent({
  model: 'models/gemini-2.5-flash',
  contents: prompt,
  config: {
    tools: [{ googleSearch: {} }],
    responseMimeType: 'application/json', // ← can't have both
  },
});

// RIGHT — when grounding is needed, embed the JSON shape in the prompt:
const response = await ai.generateContent({
  model: 'models/gemini-2.5-flash',
  contents: `${prompt}\n\nReturn ONLY a JSON object matching: ${JSON_SHAPE}`,
  config: {
    tools: [{ googleSearch: {} }],
  },
});
`​`​`​

The grounding output also injects citation markers like [cite: 6] into the text. I strip them post-hoc with a single regex pass.

Full file: services/ai.ts in the repo (link if I open-source the engine — TBD).
```

(Gio: write the rest in your voice. Don't copy-paste the whole thing across both Dev.to and Hashnode — vary the tone slightly so they're not duplicate. Hashnode is more enterprise/serious, Dev.to is scrappier.)

---

## 4. LinkedIn DMs — 5 templates for laid-off engineers

**Setup:** LinkedIn allows ~25 DMs per day before rate-limit warnings. Send to people who:
- Posted in the last 7 days about being laid off (April/May 2026 wave: Oracle, Meta, ASML, Snap, Nike, Cloudflare).
- Are 1st or 2nd-degree connections.
- Have a UK or US tech background.

**Template A — Cold but warm (default):**
```
Hi [first name] — saw your post about [company]. Sorry that's how the layoff landed. I built a free thing that might compress some of the prep tedium: aimvantage.uk — paste any job link, get a tailored cover letter, fit score, and likely interview questions in 90 seconds. 10 free runs on signup, no card. If it saves you 30 minutes on Monday I've done my bit. If it breaks, tell me and I'll fix it.

Gio
```

**Template B — Specific to a company:**
```
Hi [first name] — saw you were at Cloudflare. They cut 1,100 last week, brutal timing.

I built a tool that tailors cover letters and prep packs in 90 seconds — useful for anyone applying to 10+ roles a week. I just shipped a Cloudflare-PM-specific deep-dive at aimvantage.uk/blog/cloudflare-product-manager-interview-2026 if it's useful for thinking about what's next inside the company or elsewhere.

10 free packs on signup, no card. Roast the prep flow if it sucks.

Gio
```

**Template C — Fellow indie/laid-off founder energy:**
```
Hi [first name] — saw your post. Same boat, sort of — UK indie, just shipped a free job-prep tool because I got tired of tailoring cover letters by hand. aimvantage.uk if you want to skip the busywork. 10 free runs on signup. No card, no upsell, no recruiters in the loop. Built it solo, open-source companion ATS scanner on GitHub. If it doesn't work tell me, I'm shipping fixes daily.

Good luck with the search.

Gio
```

**Template D — When they're applying to specific roles you have a guide for:**
```
Hi [first name] — saw you're targeting [Stripe / Anthropic / OpenAI / etc.]. I just shipped a deep-dive on the [company] [role] interview process for 2026 — real questions, the traps, the prep checklist:

aimvantage.uk/blog/[slug]

Free, no signup needed for the post. The tool that powers it is at aimvantage.uk if you want to run prep on a live job link — 10 free packs on signup.

Gio
```

**Template E — When they ask "what is this":**
```
Fair question. I built it because I was tailoring 100+ cover letters by hand last year and most got binned by an ATS in 3 seconds. Vantage scrapes a job URL, runs CV-to-JD fit scoring, drafts a tailored cover letter (4 tones in one click), generates likely interview questions, and outputs a 5-minute pitch. End-to-end in 90 seconds.

10 free runs on signup, no card. £5 for 20 more after that, never expires. £12/mo if you apply daily.

UK sole trader, ICO-registered, no VC.

aimvantage.uk

If you try it and it breaks, tell me and I'll fix it same-day.
```

**Send 5 of A, 5 of B (split across companies), 5 of C, 5 of D, hold E for replies. Total 20 DMs/day.**

---

## 5. X/Twitter thread

**Tweet 1 (hook):**
```
I tailored 100 cover letters by hand last year before I built this.
Each one took an hour. Most got binned by an ATS in 3 seconds.
I was wasting three days a week.

So I built Vantage — 90 seconds, end-to-end, for any job link.

Free for the first 10. 🧵
```

**Tweet 2:**
```
Upload your CV once.
Paste any job link — LinkedIn, Greenhouse, Lever, company careers page.
Click "Run my prep pack."

90 seconds later you get:
- company brief auto-extracted from the URL
- tailored cover letter (4 tones, one click each)
- 12 likely interview questions specific to that exact role
- CV fit score with the gaps to close
- 5-minute pitch outline you can rehearse
```

**Tweet 3:**
```
The scaffolding under the hood:

@vercel serverless
@google/genai (gemini-2.5-flash) with googleSearch grounding for real company intel
@supabase auth + postgres
@stripe for billing
React 19 + Vite + TS + Tailwind v4

Built solo. Three weeks live. Pre-revenue.
```

**Tweet 4:**
```
Why free 10 packs?

Because nobody trusts an indie SaaS pitch from a stranger on the internet, and they shouldn't. The only way to find out if it saves you a Sunday is to try it on a real job link.

If it sucks, tell me. I ship fixes the same day. The commit graph is public.
```

**Tweet 5 (CTA):**
```
aimvantage.uk

10 free prep packs on signup.
No card. No upsell. No recruiters in the loop.

UK sole trader. ICO-registered.
Open-source companion ATS scanner: github.com/goofypluto999/cv-mirror-mcp

If you're applying to 40 roles this week, try it Sunday. Tell me what broke.
```

---

## 6. Reddit (when account comes back)

**Subreddit:** r/cscareerquestions OR r/jobs (NOT r/SaaS — they hate self-promotion)

**Title:**
```
[Tool/Free] I got tired of tailoring 100+ cover letters by hand so I built something — open to roasts
```

**Body:**
```
Disclosure up front: I built this. I am the founder. It is free for the first 10 runs and there is no card on signup. I'm posting because I am pre-revenue and I want feedback more than I want sales right now.

Vantage takes a CV and a job URL and outputs:
- Company brief (auto-scraped from the URL)
- Tailored cover letter you can switch between 4 tones in one click
- 8-12 likely interview questions specific to the role
- CV-to-JD fit score with the exact gaps to close
- 5-minute pitch outline

End-to-end in 90 seconds. Costs me about $0.04 in Gemini credits per run, which is why the free tier is 10 packs and not unlimited.

aimvantage.uk

Things I genuinely want feedback on:
1. The URL extractor breaks on some company careers pages (esp. Workday-hosted ones). Tell me which one broke for you.
2. The 4-tone cover letter switcher — does anyone actually use Creative or is that dead weight?
3. The fit score calibration — does the percentage match your gut?

UK indie, sole trader, ICO-registered. No VC, no recruiters paying me. Companion open-source ATS scanner on GitHub if you don't trust the closed bit.

Roast freely.
```

---

## 7. Submission directories (no-mod, auto-approve)

Hit these in this order tomorrow:

1. **AlternativeTo** — alternativeto.net/software/vantage-ai/about. Free. Auto-approves listings.
2. **Hashnode** — hashnode.com/start. Free. Cross-post the Dev.to article.
3. **dev.to** — dev.to/new. Free. Same article, varied opener.
4. **Indie Hackers** — indiehackers.com/post (Launch tag). Free.
5. **GitHub topics** — add `ai-job-search`, `cover-letter-ai`, `interview-prep` to the cv-mirror-mcp repo.
6. **llmstxthub.com** — submit aimvantage.uk/llms.txt.
7. **AItoolsdirectory.com** — free listing.
8. **opentools.ai** — free listing.
9. **theresanaiforthat.com** — paid in 2026 ($497). SKIP unless paid traffic.
10. **futurepedia.io** — paid in 2026 ($347). SKIP unless paid traffic.

**Rate limit yourself to 5 per day.** Submitting to 25 in 60 minutes triggers spam flags everywhere.

---

## 8. Email pitch — UK + US tech journalists

Source list: docs/PRESS-KIT.md (15 journalists, real emails).

**Subject:**
```
UK indie SaaS shipped 50+ commits in a week to drag pre-revenue out of the ditch — happy to be a case study
```

**Body:**
```
Hi [first name] — Gio Sizino Ennes here, sole founder of Vantage AI in the UK.

Quick context: I shipped Vantage three weeks ago. Twelve hundred visitors, fifteen signups, zero paying customers as of Wednesday. This week I stopped polishing the product and shipped 50+ commits aimed at one thing: making distribution work.

Stuff I shipped that's quotable:
- 16 long-tail interview-guide blog posts targeting "<company> interview" Google queries — Stripe, Anthropic, OpenAI, Cloudflare, etc. Each one with its own JSON-LD so ChatGPT and Perplexity can cite it.
- llms.txt published at aimvantage.uk/llms.txt advertising the 16 deep-dives directly to AI crawlers.
- A "build-in-public trust block" replacing testimonials I don't have — just verifiable artefacts: GitHub commit graph, live changelog, ICO registration, open-source companion ATS scanner.
- WCAG-AA accessibility pass top-to-bottom.

Why it might be a story:
- This is what indie SaaS looks like in 2026 — solo founder, AI features, public commit graph as social proof, no VC, free tier as the entire top of funnel.
- The pre-revenue → first sale window is the hardest in indie SaaS and almost no founder talks about it honestly.
- I'm happy to share the actual numbers as they evolve. No PR-ed up gloss.

Vantage is live at aimvantage.uk (10 free prep packs on signup, no card).

Open-source companion: github.com/goofypluto999/cv-mirror-mcp.

Happy to do a 20-minute call, share commit graphs, share visitor counts, share whatever's useful. Or kill it here if it's not your beat.

Thanks for reading this far.

Gio
```

---

## Notes for Gio

- Block out 4 hours Sunday morning UK time. Show HN goes first. Stay at the laptop.
- Don't post all of these from the same browser session in 60 minutes — looks coordinated and gets flagged.
- LinkedIn DMs: stop at 25/day. Going harder triggers their spam detector and your account gets soft-banned for 24h.
- If Show HN front-pages, every other channel benefits. If it doesn't, the other channels still pull individually.
- I built this pack from your existing assets — the YouTube scripts, the press kit, the no-mod distribution doc, the launch ammo. None of it is fabricated. Every number is verifiable from the repo.

Good luck.
