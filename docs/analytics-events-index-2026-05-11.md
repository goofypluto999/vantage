# Vantage Analytics Events Index — 2026-05-11

> Quick-reference map of every custom event the site fires + where to find it
> in Clarity / Vercel Analytics. Use this when you're staring at the dashboards
> trying to figure out what to filter on.

## Where each event lands

Every event from `src/lib/track.ts` fires to **two** destinations in parallel:

- **Microsoft Clarity** (https://clarity.microsoft.com/projects/view/wmw4zvycgg) — Custom Events panel + session-tag dimensioning + replay correlation. Good for "what did the user actually do in their session?".
- **Vercel Analytics** (Vercel dashboard → vantage project → Analytics → Events tab) — aggregate counts + filter-by-property. Good for "how often does this happen across all users?".

Both are env-gated. Clarity needs `VITE_CLARITY_PROJECT_ID`; Vercel auto-enables via `@vercel/analytics`.

---

## CTA-click events (added 2026-05-11)

Unified `cta_click` event with a `source` property describing WHERE the click happened.

### How to use
- In Vercel: Events tab → filter event = `cta_click` → group by `source` → top sources are your highest-traffic conversion paths.
- In Clarity: Custom Events panel → filter `cta_click` → click into a source → see the recorded sessions (replay shows the user's full journey before clicking).

### Sources currently firing

| Source | Component / route | Triggers what | Why it matters |
|---|---|---|---|
| `blog-post-top` | `BlogPost.tsx` (line 295) | Post header pill "Run mine free" → `/register` | Reader who clicked CTA before reading the post (high signal of intent from the SEO hook + excerpt) |
| `blog-post-mid` | `BlogPost.tsx` (line 399) | Mid-post inject CTA after 3rd h2 → `/register` | Reader who engaged with the post body. Highest-intent of the 3 blog CTA slots. |
| `blog-post-bottom` | `BlogPost.tsx` (line 420) | Bottom card "Try it free" → `/register` | Reader who finished the post. Lower-intent than mid (might just be at-bottom by scroll). |
| `landing-nav-cta` | `LandingPage.tsx` (line 248) | Top-right desktop nav "Get Started →" | Click during browsing — usually after scrolling around |
| `landing-mobile-drawer` | `LandingPage.tsx` (line 377) | Mobile drawer "Get 10 free prep packs" | Mobile traffic conversion-intent |
| `how-it-works-modal-header` | `LandingPage.tsx` (line 493) | "Try It Free →" in How-It-Works modal header | User reading the product explainer |
| `how-it-works-modal-body` | `LandingPage.tsx` (line 594) | "Start For Free" below the modal steps | Read the whole flow, then clicked |
| `landing-post-how-it-works` | `LandingPage.tsx` (line 1199) | "Try it free — 10 prep packs, no card" after How-It-Works section | Read the section, then clicked |
| `landing-post-sample` | `LandingPage.tsx` (line 1342) | "Get this for your next job — free" after See-What-You-Get | Looked at the sample, then clicked |
| `landing-pricing-starter` | `LandingPage.tsx` (line 1378) | Starter tier "Get Started" button | Lowest-tier intent |
| `landing-pricing-pro` | `LandingPage.tsx` (line 1400) | Pro tier "Upgrade to Pro" button | Highest revenue per click |
| `landing-pricing-premium` | `LandingPage.tsx` (line 1420) | Premium tier "Go Premium" button | Highest tier intent |
| `landing-final-cta` | `LandingPage.tsx` (line 1694) | Final big "Initialize Vantage" CTA | Read whole page, then clicked. Strongest conversion-intent. |
| `landing-sticky-bottom-pill` | `LandingPage.tsx` (line 1836) | Floating bottom-right pill | Mid-page impulse-click (or fallback when other CTAs missed) |

### Props always attached

- `source` (always) — string from table above
- `slug` (on blog-post-* sources) — the post slug, so you can filter `cta_click` events by blog post

### What to look for first

1. **Blog post conversion rate** — In Vercel, filter `cta_click` source=`blog-post-mid` → count by slug → that's clicks-from-mid-CTA per blog post. Compare to pageviews per post to find the conversion-rate-per-post. Top performers = promote. Zero-converters = re-write the hook or kill the post.
2. **Where on landing does the click happen?** — In Vercel, group `cta_click` by source for landing-* — tells you whether the hero, pricing, or final CTA is doing the actual conversion work.

---

## Content-share events (added 2026-05-11)

`content_share` — fires when a blog reader clicks X / LinkedIn / copy-link share buttons.

| Channel | Trigger |
|---|---|
| `x` | X share button on `BlogPost.tsx` (line 23) |
| `linkedin` | LinkedIn share button on `BlogPost.tsx` (line 32) |
| `copy-link` | Copy-link button on `BlogPost.tsx` (line 40) |

Props: `channel`, `slug`.

### What to look for

- Posts with high share rate but low click rate = good distribution potential, weak conversion copy. Fix the CTA.
- Posts with high share rate AND high click rate = winners. Use these in distribution scaffolds (LinkedIn DMs / Reddit posts).

---

## Hero-flavor + post-demo CTA events (legacy, pre-2026-05-11)

These pre-date the unified `cta_click` event. Left in place because they have historical data already; new tracking uses `cta_click` instead.

| Event | Fires where | Props |
|---|---|---|
| `hero_cta_click` | `LandingPage.tsx:798, 806, 813` | `cta` ∈ {`register_primary`, `diagnostic_low_friction`, `demo_reel_scroll`} |
| `post_demo_cta_click` | `LandingPage.tsx:1135, 1142` | `cta` ∈ {`register_primary`, `diagnostic_low_friction`} |

When analyzing the funnel, look at BOTH the unified `cta_click` events AND these legacy events — they cover slightly different surfaces.

---

## Task-completion events (the May-2026 playbook surface)

These were added earlier in the conversion-fix push. They measure whether a user "completed the task" on a page (vs. bounced) — the AEO/SEO ranking signal Google + AI engines care about.

| Event | When | Props |
|---|---|---|
| `content_task_started` | User starts a task on a content/tool page | `route`, `task_type` |
| `content_task_completed` | User reaches a meaningful endpoint | `route`, `task_type` |
| `template_downloaded` | User downloads a template | `route`, `template_id` |
| `checklist_copied` | User copies a checklist | `route`, `checklist_id` |
| `draft_analysis_started` | User starts a real analysis | `route`, `source` |
| `page_exit_fast` | User bounces in <10 sec | `route`, `seconds_visible` |

Currently fires from:
- `RoastPage.tsx` (`/roast` — task_type `roast_request_submitted` + `roast_result_returned`)
- `NoInterviewsDiagnostic.tsx` (`/tools/no-interviews-diagnostic` — task_type `diagnostic_started` + `verdict_shown`)
- `CostCalculatorPage.tsx` (`/tools/jobscan-cost-calculator` — task_type `calculator_loaded` + `slider_engaged`)

### What to look for

- Pages with high `content_task_started` but low `content_task_completed` = the task UX is breaking. Look at Clarity replays to see where.
- Pages with high `page_exit_fast` = the hook doesn't deliver. Look at the landing copy.

---

## Diagnostic-flow events

Specific to the diagnostic tool (`NoInterviewsDiagnostic.tsx`):

| Event | Means | Props |
|---|---|---|
| `diagnostic_verdict` | A verdict was shown | `verdict_key` (which of 7 failure modes) |
| `diagnostic_primary_cta_click` | User clicked the verdict-tied primary CTA | `verdict` |
| `diagnostic_secondary_register_click` | User clicked the secondary register CTA | `verdict` |
| `diagnostic_pillar_read_click` | User clicked through to deep-dive content | `verdict` |
| `diagnostic_callout_click` | User clicked the diagnostic callout from another page | `source`, `variant` |

### What to look for

- Which `verdict_key` is most-shown? That's your most-common user pain point — write more content about it.
- Which `verdict_key` has highest primary-CTA click-through? That's your strongest "tool → register" hook.

---

## Pricing-page events

| Event | Trigger |
|---|---|
| `pricing_diagnostic_click` | Pricing-page banner → diagnostic |
| `pricing_sample_click` | Pricing-page → sample-output link |
| `roast_to_register_clicked` | Roast result → register (with `severity` 1-5) |

---

## What's NOT instrumented yet (gaps)

The following surfaces have register CTAs but DON'T fire `cta_click` events. Worth adding in a future deploy when Vercel quota allows.

| Surface | File | Current state |
|---|---|---|
| `/tools/*` register CTAs (per-tool) | 20 free-tool pages | Each tool has `?source=tool-name` on the `/register` URL but no `ctaClick()` firing |
| `/sample` / `/sample/[slug]` | `SampleAnalysisPage.tsx` | Already fires `track('sample_to_register', ...)` — could be unified with `ctaClick()` |
| `/about`, `/press`, `/receipts` | Trust pages | Register CTAs there fire no events |
| Dashboard upgrade prompts | `Dashboard.tsx` | "Not enough tokens" upgrade prompt — no event |
| `Account.tsx` upgrade CTAs | Account page | "Top up tokens" buttons — no event |

When the next deploy slot is available, batch these into one commit using `ctaClick(source)` with sources like:
- `tool-ats-scanner`, `tool-jd-decoder`, `tool-bullet-rewriter`, etc.
- `dashboard-upgrade-prompt`
- `account-topup-button`

---

## Verifying an event is actually firing

When in doubt, open the live site in dev tools → Network tab → filter "clarity" or "vercel" → click a CTA → confirm a request fires. Both providers send beacons over `navigator.sendBeacon` and a few standard endpoints.

For Clarity specifically: open the Clarity dashboard → Custom Events panel → events appear ~30 seconds after firing (Clarity dashboard lag).

For Vercel: events appear in the Events tab within 1-5 minutes.

---

## Privacy reminders

Per `src/lib/track.ts`: **no PII in event props**. Never email, never name, never full URL with query params (because UTM tokens can leak identity). Only enums and short strings.

If you ever add a new event, the source/key naming convention is:
- **Verbs** for actions (`cta_click`, `content_share`, `template_downloaded`)
- **Past tense** when measuring completion (`task_completed`, `verdict_shown`)
- **Source = enum** (where it happened), never free-text

---

*Last updated 2026-05-11 — extended `track.ts` with `ctaClick()` + `contentShare()` helpers, instrumented `BlogPost.tsx` (3 CTAs + 3 share buttons) and `LandingPage.tsx` (11 register CTAs).*
