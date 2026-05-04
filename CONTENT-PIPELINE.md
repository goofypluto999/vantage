# CONTENT-PIPELINE.md — the founder-journal content system

> How to keep producing genuinely good content without burning out, faking
> insight, or relying on AI slop that gets your accounts banned.

---

## The principle

Every post on this blog is one of three types. Anything that doesn't fit
one of these three doesn't get written.

| Type | What it is | Source material |
|---|---|---|
| **Tactical guide** | Concrete how-to with specific steps | Things you've actually done |
| **Founder journal** | Real stories from building Vantage | Your git log + product decisions |
| **Industry observation** | Pattern you've noticed in the job market | Things you've read and pressure-tested |

**No "5 tips for X" listicles. No "best AI tools for Y." No generic SEO
fluff.** That stuff ranks for a week then gets buried, and writing it dulls
the voice that distinguishes everything else.

---

## The voice rules

Every post must be:

1. **First-person, direct.** "I built this" not "we built this" or "Vantage
   was built." The you-the-founder is the brand.
2. **Self-deprecating where honest.** "I missed it for four days" beats
   "the issue persisted for 96 hours."
3. **Specific numbers.** "47 signups" beats "many users." "£0.0003 per
   request" beats "a small amount."
4. **One useful insight per ~400 words.** If a paragraph could be cut
   without losing a concrete takeaway, cut it.
5. **No corporate softening.** "I shipped fake schema" not "I included
   inaccurate structured data."
6. **Always end with a CTA, never a moral.** Give the reader something
   to do or check, not a feeling to feel.

---

## The founder-journal source pattern

This is the system to keep producing posts that are unfakeable.

### Step 1 — Pull material from your real journey

```
git log --pretty=format:"%h %ad %s" --date=short --since="2 weeks ago"
```

Every commit is potential post material. The most fertile commits look like:

- `fix(...)` — a bug you fixed reveals something you got wrong
- `harden(...)` — security or robustness work has universal lessons
- `feat(distribution)` — growth experiments others can copy
- `chore(domain)` — migrations always teach something painful
- A revert of an earlier commit — even better, the about-face is the story

For each commit that looks substantive, ask:
- What did I assume that turned out to be wrong?
- What did I do that was non-obvious?
- What would another founder benefit from knowing?

If two of three answers exist, that commit is a post.

### Step 2 — Write the hook first

Every post starts with one line that could only be true for you.

Bad hook: *"Many founders struggle with conversion bugs."*
Good hook: *"My signup flow asked users to pick a paid plan before they
had ever seen the product. Conversion was rounding to zero."*

The good hook does three things:
- Is specific enough that nobody else could have written it
- Names a problem the reader either has or recognises
- Implies the post will tell them what to do

If you can't write the hook in one sentence, the topic isn't ready.

### Step 3 — Three-section template

```
## How [the bad thing] happened
   - The setup, the assumption, why it was reasonable
## What I did about it
   - The fix, with specific steps and code if relevant
## What this means for [reader's situation]
   - The transferable lesson, with checklist
```

Most posts fit this. Some are pure technical (the prompt-injection one)
and use a layered "Layer 1, Layer 2..." structure instead. Use whichever
the material wants.

### Step 4 — Add the post to two places

```
src/data/blogPosts.ts          — TypeScript data with sections array
public/blog/<slug>.md          — markdown twin (used by API + crossposters)
```

The build pipeline (`scripts/generate-feeds.mjs`) auto-regenerates:
- `public/sitemap-blog.xml`
- `public/rss.xml`
- `public/feed.json`
- `public/atom.xml`

So you only have to manually edit two files per post.

### Step 5 — Cross-post via existing scripts

Once the post is live on aimvantage.uk:

```powershell
node --env-file=.env scripts/devto-crosspost.mjs --slug=<your-new-slug>
node --env-file=.env scripts/hashnode-crosspost.mjs --slug=<your-new-slug>
```

Drafts appear on both. 30 seconds to publish each.

### Step 6 — Re-ping IndexNow

```
node scripts/indexnow-ping.mjs
```

Bing/Yandex/Seznam recrawl within hours. Google catches up in 1-2 weeks.

---

## What "good" looks like

A finished post hits all of these:

- [ ] Hook line that names a specific problem only you could've written
- [ ] At least one specific number (£, %, days, lines of code)
- [ ] At least one specific link to your live product
- [ ] At least one quoted error / commit message / piece of code
- [ ] One actionable checklist for the reader at the end
- [ ] Word count between 800 and 1500
- [ ] Reading time roughly word-count / 200, not a marketing-team
      "X min read" inflation

---

## The "don't post this" list

If a draft hits any of these, don't publish:

1. **No specific story behind it.** If you can't point to a date, a
   commit, or a real moment, the post is generic.
2. **Generic title pattern.** "Top 10 X" / "How to Y in 2026" / "X vs Y
   guide" — every one of these has a thousand competitors. Don't fight
   them. Write things only you can write.
3. **Lecture energy.** If the closing line moralises ("Always be honest
   with your users"), rewrite. The lesson should be implicit in the
   story, not stated.
4. **Length-padding.** If you padded a 600-word story to 1200 words,
   publish at 600.
5. **AI-rewrite signal phrases.** "It's worth noting that..." / "In
   today's competitive landscape..." / "When it comes to..." / "Whether
   you're a founder or..." — all dead giveaways. Cut them on sight.

---

## Cadence

Aim for 1 founder-journal post per week. More frequent than that risks:
- Running out of substantive material → drift toward generic content
- DEV.to / Hashnode flagging the account as a content mill
- Diluting the brand voice

Less frequent than weekly is fine. Quality > volume.

---

## What the AI assistant (Claude) helps with

When asked to draft a new post, Claude:

1. Reads `git log --since="..."` and identifies post-worthy commits
2. Reads existing posts in `src/data/blogPosts.ts` to lock the voice
3. Drafts the post following the structure above
4. Adds entries to `blogPosts.ts` AND `public/blog/<slug>.md`
5. Runs `npx tsc --noEmit` to verify
6. **Stops before publishing.** You read the draft once, edit any line
   that doesn't sound like you, then commit and crosspost.

The hard rule: Claude does not publish autonomously. The 30-second skim
is non-negotiable for spam-detection safety on DA-90 platforms.

---

## A worked example — how the May 4 batch was written

Real session log:

1. Asked Claude to extract material from `git log --since="2026-04-22"`
2. Three commits stood out:
   - `934ccd7 fix(seo): remove fabricated AggregateRating + Review schemas`
   - `b673e15 fix(conversion): remove plan picker from signup`
   - `d5d0f3d harden(roast): origin check, kill switch, bot throttle, injection defense`
3. Each became one post. Voice locked from the existing 9 posts. Each
   post took ~15 minutes of Claude drafting + ~5 minutes of editing.
4. Three posts shipped. Total token cost: ~30,000 input / ~8,000 output.

That's the system. Replicate weekly.

---

Updated: 2026-05-04
