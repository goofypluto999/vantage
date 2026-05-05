# Twitter Presence Push — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 50 reply tweets + 100 comment-style follow-ups, each unique, in Gio's voice, ready for him to review one-by-one and post manually at safe cadence over 10-14 days. Each post drives traffic to a specific Vantage URL and builds presence in indie/build-in-public/AI-tools Twitter circles.

**Architecture:** Pure content generation — no code. Output is one master markdown file at `TWITTER-DECK.md` (in the vantage repo root, gitignored if needed) listing all 150 drafts with metadata: target archetype, suggested thread type, character count, primary URL. Each draft is independently usable — Gio can pick any 10/day in any order.

**Tech Stack:** None. Plain markdown.

---

## ⚠️ Reality constraints baked in upfront

1. **Twitter spam detection.** Posting 150 replies from a low-activity account in <2 weeks will get flagged. Cadence ceiling: **10 per day**, spread across 12+ hours, varied wording. Plan duration: **15 days minimum.**
2. **External-link penalty.** Twitter's algorithm de-ranks tweets with external links. Strategy: **link in 30-40%** of replies (the strongest-fit ones). For the other 60-70%, mention `aimvantage.uk` only in the bio / pinned tweet, drive interest via the reply content alone.
3. **Reply-to-viral-tweet engagement reality.** Replies to a 1000-like tweet get maybe 0.1-1% click-through on links. 150 quality replies should net ~200-500 site visits over 2 weeks. Real, but not magic.
4. **Voice authenticity.** Generic templates ("Check out my project at X") get hidden by Twitter and ignored by readers. Each reply must engage with the *specific content* of the original post.
5. **Account-age compounding.** Replies from a 6-day-old account with low followers carry less weight than the same replies from an established one. We compensate with sharper content.

---

## Chunk 1: Target-thread research

**Why:** Replies to the wrong threads = wasted effort. We pick threads where (a) the original poster is niche-but-high-traffic, (b) the audience overlaps with people who'd use Vantage (job seekers, indie hackers building career-tech, AI-tools enthusiasts, layoff cohorts), (c) the thread format invites replies (open question, "what are you building," "show me your X").

### Target accounts (15+) and their recurring thread patterns

| Account | Handle | Niche | Recurring thread pattern |
|---|---|---|---|
| Pieter Levels | @levelsio | Indie maker | Weekly "what are you building" + "post your MRR" |
| Marc Louvion | @marc_louvion | Bootstrapped | "Show me your product" threads, weekly cadence |
| Yong-Fook Cheong | @yongfook | Bootstrapped | "What did you ship this week" |
| Indie Hackers | @IndieHackers | Indie founder | Sunday share-your-product, milestone celebrations |
| Build in Public | hashtag #buildinpublic | Indie founder | Continuous, no single account |
| Ben Lang | @benln | Notion ecosystem | "What's your favourite AI tool" |
| Greg Isenberg | @gregisenberg | Audience-led businesses | "What are you working on this week" |
| Justin Welsh | @thejustinwelsh | Solopreneur | Weekly LinkedIn-and-Twitter share |
| Pat Walls | @patwalls | Starter Story founder | "Show me your bootstrapped business" |
| Marc Köhlbrugge | @marckohlbrugge | WIP founder | WIP Telegram/Twitter share |
| FutureTools | @futuretoolsio | AI tool curation | "What AI tools should I cover" / submission threads |
| There's An AI For That | @THERESANAIFORTHAT | AI tool curation | "Submit your AI tool" |
| Layoff Tracker | @layoffstracker | Layoff news | Recurring "if you were affected, comment" |
| Career Boss / Layoff support accounts | various | Layoff cohort | "What's your story" threads |
| AI engineer / dev accounts | various MCP/Claude/Cursor accounts | Developer | "Show me your MCP server" |

### Tasks

- [ ] **1.1: Lock the target list at 15-20 accounts.** Anything more dilutes the deck; anything less and we run out of fresh threads to reply to over 2 weeks.

- [ ] **1.2: For each account, find 2-3 recent recurring thread URLs.** Not specific tweets to reply to (those are time-sensitive and Gio picks live), but the *pattern* — e.g., "@levelsio posts a 'what are you building' thread every Sunday around 7am UTC." This tells us when to expect a fresh thread.

- [ ] **1.3: Categorize each target by reply archetype** (defined in Chunk 2). Some accounts welcome detailed replies; others prefer one-liners. The deck must match the archetype to the target.

---

## Chunk 2: Reply archetype taxonomy

**Why:** "150 unique replies" without structure becomes 150 variants of the same reply. The archetype taxonomy ensures we have variety AND that each reply matches its target context.

### The 5 reply archetypes

#### Archetype A — Direct pitch (~25 of 150)
For threads explicitly asking "what are you building / show me your product." Short, punchy, includes URL.

Voice: 2-3 sentences max. Lead with the problem solved. End with the URL.

Example shape:
> "Built [Vantage](https://aimvantage.uk) — paste a job link + your CV, get the full prep pack (cover letter, mock interview, fit score) in 90 seconds. Solo, ~£80 MRR, applying it to my own job hunt while I build."

#### Archetype B — Problem-relating + soft mention (~40 of 150)
For threads where someone describes a job-search/career pain. Engage with their specific pain, mention Vantage as one tool you happen to make. URL only if it fits naturally.

Voice: 3-4 sentences. Acknowledge the specific pain in their post. Offer one concrete piece of advice. Mention Vantage as "fwiw I'm building X for exactly this" — without hard sell.

Example shape:
> "100% on the cover-letter time tax. The trick I found is to write the structural 80% once and only swap the per-company hook + tone. I'm actually building [Vantage](https://aimvantage.uk) to compress that to ~90 sec — but the manual version works too if you don't want a tool."

#### Archetype C — Insight without pitch (~40 of 150)
For threads where pitching feels off-fit. Drop genuinely useful insight + leave the URL out. The bio handles the conversion. This is for sustaining-presence content, not direct conversion.

Voice: 1-3 sentences. One actionable thing. No mention of Vantage at all.

Example shape:
> "Underrated trick: read the company's last earnings call before the interview. Even at small companies the equivalent (recent blog post, recent funding announcement) gives you 3 specific things to reference that 99% of candidates won't."

#### Archetype D — Question to the OP (~15 of 150)
Engagement plays. Ask a sharp follow-up question that actually adds to the thread. No URL. Builds reply-thread visibility.

Voice: 1 sentence question + (optional) one sentence context.

Example shape:
> "How do you decide between killing a feature vs. shipping it half-done? I find I procrastinate on this specifically and it costs me weeks."

#### Archetype E — Founder-journey detail (~30 of 150)
For threads asking about building/launching/MRR. Share a specific real detail from your Vantage build — a bug, a discovery, a tactical decision. URL optional (drop in if asked specifically).

Voice: 3-5 sentences. One specific story moment. Concrete numbers where possible.

Example shape:
> "Day 6 after launching mine I had 4 signups and was tempted to add fake review counts to the schema. Caught myself on a re-read and removed it. The fix was a live transparency counter pulling from Supabase — 4 real signups beats 23 fake ones long-term."

### Tasks

- [ ] **2.1: Lock the archetype mix at A:25 + B:40 + C:40 + D:15 + E:30 = 150.** Adjust if any seems over- or under-weighted after first 20 drafts in each.

- [ ] **2.2: Identify which Vantage URL each archetype should drive.** Not all replies should send to homepage. Allocation:
  - Archetype A: `/` (homepage) — they want to see the product
  - Archetype B: `/sample/anthropic-senior-pm` or `/roast` — they want proof, not signup
  - Archetype C: no URL
  - Archetype D: no URL
  - Archetype E: `/blog/<relevant-founder-journal>` — the story is the value

---

## Chunk 3: Voice rules + linguistic anti-patterns

**Why:** AI-generated text has tells. Twitter's audience is hyper-attuned to them. A single "I love how you're tackling..." or "It's worth noting that..." in a reply gets it flagged as bot in seconds.

### Voice anchors — extract from existing Vantage content

These existing posts/copy show Gio's actual voice:
- `public/blog/i-shipped-fake-review-schema-then-caught-myself.md`
- `public/blog/the-bug-that-killed-every-signup-for-four-days.md`
- `src/components/LandingPage.tsx` headline + hero copy
- `index.html` static fallback content

### Voice rules

1. **First-person, present-tense.** "I'm building" not "We have built." "I caught" not "It was caught."
2. **Specific numbers.** "47 signups" beats "some signups." "£0.0003 per request" beats "very cheap."
3. **Self-deprecating where honest.** "I missed it for 4 days" beats "the issue persisted."
4. **No corporate softening.** "I shipped fake schema" not "I included inaccurate structured data."
5. **British spellings.** "Realised", "behaviour", "favourite". Twitter audiences are global but Gio is UK-based.
6. **Lowercase i where deliberate.** Gio's writing voice mirrors lowercase i (per his stated preference).

### Linguistic anti-patterns — instant kills

Any of these phrases in a draft = instant rewrite:
- "It's worth noting that..."
- "In today's competitive landscape..."
- "Whether you're a founder or..."
- "When it comes to..."
- "I love how..."
- "Great question!"
- "Absolutely!"
- "Make sure to..."
- "At the end of the day..."
- "100% agree" (only if not actually adding to the conversation)
- Emojis at the start of replies (🚀 / ✨ are AI tells)
- Any em-dash with spaces around it that wasn't in the source — keep `—` adjacent to words (Gio uses tight em-dashes)

### Tasks

- [ ] **3.1: Validate the 5 voice rules and anti-pattern list with Gio before drafting.** If he wants to add or remove any, lock now.

- [ ] **3.2: For every draft, run the anti-pattern checklist.** Any hit = rewrite.

---

## Chunk 4: Generate the 150 drafts

**Why:** This is the bulk of the work. Each draft must be independent, voice-correct, and matched to an archetype.

### Draft format (in `TWITTER-DECK.md`)

Each draft is one block:

```
---
ID: A-001
Archetype: A — Direct pitch
Target: "What are you building this week" thread (e.g. @levelsio Sunday)
URL: https://aimvantage.uk
Length: 248 chars (under 280)
---
Built Vantage — paste a job link + your CV, get the full prep pack
(company intel, cover letter, mock interview, fit score) in 90 sec.
Solo, 6 weeks old, applying it to my own job hunt while I build.

aimvantage.uk
```

The ID convention `A-001` through `E-150` lets Gio say "remove A-007, rewrite B-018" without confusion.

### Tasks

- [ ] **4.1: Draft Archetype A — 25 direct pitches.** Each opens with a different verb pattern (built / shipped / running / making / launched). Each names a different specific feature as the hook. URLs vary across `/`, `/sample/anthropic-senior-pm`, `/sample/stripe-staff-pm`, `/roast`.

- [ ] **4.2: Draft Archetype B — 40 problem-relating + soft mentions.** Each must reference a specific job-search pain (cover letter time tax, ghost job postings, ATS parse issues, interview prep paralysis, layoff overwhelm, salary negotiation). 7 pain types × ~5-6 variants each.

- [ ] **4.3: Draft Archetype C — 40 insight-without-pitch.** No URL, no Vantage mention. Each is one genuinely useful career-prep insight. Topics: ATS quirks, cover letter structure, interview prep tactics, layoff playbook, LinkedIn optimization, salary negotiation. 6 topics × ~6-7 variants.

- [ ] **4.4: Draft Archetype D — 15 questions to OP.** Each engages with a different recurring thread pattern.

- [ ] **4.5: Draft Archetype E — 30 founder-journey details.** Each is one specific real moment from the Vantage build. Source material: git log + the 3 founder-journal blog posts + the launch story. 30 different moments.

- [ ] **4.6: Anti-pattern audit pass.** Run all 150 through the anti-pattern checklist. Rewrite any hits.

- [ ] **4.7: Length audit.** Each draft must be ≤ 280 characters (Twitter limit). Some platforms (X premium) allow more, but defaulting to 280 keeps every draft usable on every account.

- [ ] **4.8: Write `TWITTER-DECK.md` to repo root.** Include a 200-word preamble explaining the archetype system, the cadence rules, and the "10/day max" reminder.

---

## Chunk 5: Review + execution mechanics

**Why:** Gio needs to verify each draft. The deck must be skim-able fast.

### Review format

Gio scans the deck. For each draft he marks one of:
- ✅ Ship as-is
- 🔄 Reshape (with a one-line note on what to change)
- ❌ Drop

He sends the marked-up file back. I do the reshapes/drops, output the final shippable list.

### Execution cadence (Gio runs)

- **Max 10 replies per day.** Spread across 12+ hours.
- **Vary archetypes within a day.** 3-4 archetypes per day, not 10 of one.
- **Track engagement.** After 3 days, note which archetypes / target accounts converted best. Lean into those.
- **Stop if Twitter shadowbans.** If reply-engagement drops to 0 across all replies, pause for 48h, then resume at 5/day.

### Bio + pinned tweet (Gio updates once)

Bio: `Building Vantage — AI job prep in 90 sec for people applying at scale. Solo, in public. aimvantage.uk`

Pinned tweet: One Archetype-A draft repurposed as a thread-starter. Stays pinned throughout the campaign so every replies-back-to-Gio's-profile click sees the product immediately.

### Tasks

- [ ] **5.1: Add bio + pinned-tweet drafts to `TWITTER-DECK.md`** (one bio, three pinned-tweet candidates).

- [ ] **5.2: Add a daily-execution checklist to `TWITTER-DECK.md`** — a literal checklist Gio works through each morning.

---

## Estimated effort

| Chunk | Wall time | Notes |
|---|---|---|
| 1: Target research | 30 min | mostly research, light drafting |
| 2: Archetype taxonomy | 15 min | lock the mix |
| 3: Voice rules | 10 min | validate with Gio |
| 4: 150 drafts | 4-5 hr | the actual work |
| 5: Review mechanics | 15 min | doc additions |

**Total ~5-6 hours** for a complete, reviewed, voice-correct deck. The drafting itself is the bulk.

---

## Stop conditions

- If Gio rejects > 30% of any single archetype, pause and rework that archetype's voice template.
- If after Chunk 1 research the target account list is < 10, pause — small target list = small deck ceiling.
- If the spam-cadence calculation shows > 4 weeks to ship 150 replies, scale down to 100 replies (preserves quality at higher per-reply effort).

---

## Review loop

After the full deck is drafted, Gio reads through it once. He marks each draft ✅/🔄/❌. I do all reshapes/drops in one pass. Final approved list ships.
