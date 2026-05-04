---
title: "The bug that killed every signup for 4 days"
description: "A hidden plan-picker step in my signup flow was making users pick a paid plan before they had ever seen the product. Conversion was rounding to zero. Removing it tripled signups in 48 hours. Real founder journal."
author: "Gio"
published: 2026-05-04
reading_time: "7 min"
tags: ["Founder Journal", "Conversion", "UX", "Product", "SaaS"]
canonical: https://aimvantage.uk/blog/the-bug-that-killed-every-signup-for-four-days
---

# The bug that killed every signup for 4 days

> My signup flow asked users to pick a paid plan before they had ever seen the product. Conversion was rounding to zero.

Vantage launched on April 22. By April 28 I had four signups. Four. The site was getting traffic — Vercel Analytics confirmed it — but almost nobody was making it from the landing page to a working account.

I assumed it was the price. I assumed it was the copy. I assumed it was the demo. I rewrote the hero three times that week.

It was none of those.

It was a step in the signup flow I had completely forgotten was there. The "plan picker." Before a user could create an account, my code routed them to a screen that said "pick your plan" and showed three options: Free, Pro (£12/month), Enterprise.

They had not seen the product yet. They had not run a single analysis. They had no information. And I was asking them to commit, on the spot, to a £12/month subscription or accept the perceived disadvantage of "Free."

## How I missed it for four days

When I built the plan picker months earlier, the assumption was: "users land on pricing → click a tier → sign up under that tier." Sensible flow if traffic comes from the pricing page. Wrong flow if traffic comes from the homepage and lands on signup directly.

I tested the signup flow myself daily. But I tested it as the developer, with a test card pre-loaded, knowing what the product did. The friction the picker created was invisible to me because I knew what to pick.

A new user does not know. A new user, faced with a forced choice between Free, Pro, and Enterprise without context, does the rational thing: closes the tab.

## The fix took 12 minutes

1. Removed the plan picker route from the signup flow.
2. Wired the new-user path so it auto-grants 10 free tokens at signup.
3. Updated the dashboard to surface the trial wallet immediately after first login: "You have 10 free tokens. One full analysis = 3 tokens. No card on file."
4. Pushed. Vercel deployed in 90 seconds.

I shipped it on April 28 at about 11pm. By April 30 I had 13 signups. By May 4 I had 47. The slope of the line changed instantly the moment the picker was gone.

> The picker was not visible on the landing page. It was not visible in any analytics funnel I had set up. It was buried in a route component I wrote in February and forgot about. **Conversion bugs hide where you stop looking.**

## The deeper pattern: forced explicit choice is friction in disguise

Every "pick your plan" screen, "what brings you here" survey, "select your role" dropdown, and "tell us about your team" wizard is the same architectural choice. The product owner thinks: "I want to know what this user wants so I can serve them well." The user thinks: "I have not used this thing once and you want me to commit to a category I do not understand yet."

The right time to ask is **after value has been delivered**. Show me one good analysis, then ask if I want to upgrade. Show me one finished cover letter, then ask what tone I prefer. The order matters.

## How to find your version of this bug

### 1. Walk through your own signup flow as a stranger

Open an incognito window. Use a fresh email. Forget what you know about the product. At every screen, ask: "Could a person who has never seen this product before answer this question with confidence?" If the answer is no, that screen is killing you.

### 2. Watch the funnel report drop-off step by step

In Vercel Analytics, Plausible, or any funnel tool, look at the page-by-page drop-off after a signup-button click. The step where the largest percentage of users disappears is your bug.

### 3. Audit every screen where you ask the user to "choose"

Plan tier, role, intent, team size, source-of-discovery dropdowns. Each one is a friction tax. Default the answer wherever you can. Ask only after the user has earned context.

## The honest part — I should have caught this earlier

A more disciplined founder runs the cold-start signup flow on day 1, day 7, day 30. I did not. I got distracted by the visible work — landing copy, hero animation, pricing page — and ignored the invisible work, the actual flow.

A bug that costs you four days of signups while you have £0 in revenue is not a small bug. It is the difference between making rent and not.

> [Vantage](https://aimvantage.uk) now grants 10 free tokens at signup, no card required. That is enough for three full job-prep packs (3 tokens each, plus extras for tone rewrites). The "pick your plan" screen is gone.

## For other solo founders

- Audit your own onboarding once a week as a stranger.
- Treat every required choice as friction until proven necessary.
- When you see a conversion drop, do not rewrite the hero — walk the flow first.
- A 12-minute fix can three-X your signups. Never assume the problem is something big.
