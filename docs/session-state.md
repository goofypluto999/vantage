# Session State — Resume Point for Future Claude Sessions

> Read this file FIRST in any new session. It captures everything in flight,
> where the rollback points are, and what the next concrete steps are.
> Updated whenever a significant milestone is reached or a feature is paused.
> Last updated: 2026-05-11, after negotiation API handler review pass.

---

## TL;DR — where we are right now

**Live in production (`https://aimvantage.uk`):**
- Nav fix (Features + How It Works buttons scroll correctly)
- Waitlist endpoint hardened (origin allowlist + per-IP rate limit)
- BlogPost CTA + share tracking (Clarity + Vercel custom events)
- LandingPage 11-CTA tracking (per-source attribution)
- ATS scanner supports PDF (lazy pdfjs-dist worker)
- Blog filter chips: deduped, multi-select, auto-derived from real post tags
- Follow-up email composer (`/api/interview/followup` + Dashboard modal). 1 token, 5 stages, 3 urgency tones. Live + verified working with smoke tests.

**Built but NOT live (work-in-progress):**
- Salary negotiation brief API handler at `/api/interview/negotiation`. Lives in `api/interview/[action].ts`. Multi-agent-reviewed, 13 findings applied (1 CRITICAL, 6 HIGH, 4 MED, 2 LOW). Costs 2 tokens. Returns emailSubject + emailBody + phoneScript + talkingPoints[] + warnings[].
- Local master is at commit `7207fbe` (one commit ahead of remote master at `abf7a85`).
- Same content also preserved on remote branch `feature/negotiation-in-progress` for disaster recovery.

**Safety infrastructure (live + committed):**
- `npm run preflight` — pre-deploy script that catches: function-count overage, vercel.json drift, duplicate routes, heavy frontend deps in api/, undocumented env vars, type errors, build failures
- `docs/deploy-safety-playbook.md` — codified 9-step pre-push checklist + failure modes table + "don't repeat history" log
- `docs/multi-agent-review-process.md` — three-Agent() review pattern (security / type+edge / UX+prompt) for non-trivial features
- Stable rollback git tag: `stable-2026-05-11-pre-followup` (last known good before this whole work stream)

---

## What to do next (immediate)

### Iteration N (the next one, where N is whatever loop fires)
**Build the NegotiationComposer frontend modal.** Mirror the pattern in `src/components/FollowupComposer.tsx`. Differences:
- Form inputs include all the fields the API expects: currency dropdown, baseOffered/baseTarget, signOffered/signTarget, rsuOffered/rsuTarget, bonusPctOffered/bonusPctTarget, ptoOffered/ptoTarget, remotePolicyOffered/Target, hasCompetingOffer + competingCompany + competingOfferContext, yearsExperience, levelTitle, preferredChannel (email/phone), tone (collaborative/firm), additionalContext
- Result panel: 5 surfaces (subject + body + phoneScript + talkingPoints array + warnings array) with copy buttons per surface
- Calls `generateNegotiationBrief()` from `src/services/api.ts` — does not exist yet, must be added (the wrapper for `/api/interview/negotiation`)
- Lazy-loaded chunk (`React.lazy()` + `React.Suspense`), same as FollowupComposer
- Modal pattern: `role="dialog"`, ESC close, click-outside close, body-scroll lock

### Iteration N+1
**Run UX-focused multi-agent review on the modal.** Use `docs/multi-agent-review-process.md` Agent 3 briefing template (UX + a11y). Apply findings.

### Iteration N+2
**Wire NegotiationComposer into Dashboard.tsx** between the Follow-up Email block and the upgrade-prompt block. Pre-fill `defaultCompanyName` from `results?.companySnapshot?.name` + `defaultUserName` from `profile?.full_name`. Add the section title "Salary Negotiation Brief (2 tokens)" with a "New" badge.

### Iteration N+3
**Run `npm run preflight` (full).** Confirm 12/12 functions still + type-check + build clean. Write `docs/negotiation-feature-test-plan-2026-05-11.md` (mirror the followup test plan).

### Iteration N+4
**Single commit. Single push.** Verify deploy status via `gh api ... /status`. Smoke-test live: `curl POST /api/interview/negotiation` returns 401 anon, 405 GET. Update this `session-state.md` to mark feature complete.

---

## Constraints — DO NOT FORGET

1. **Vercel Hobby tier limits:**
   - 12 serverless functions per deployment (currently at 12/12 — adding a 13th breaks deploy)
   - 100 deploys per day
   - 50MB compressed per function
2. **No Vercel Pro** — Gio explicitly said no.
3. **`feedback_key_hygiene` memory** — never ask for API keys to be pasted in chat. Gemini key is only in Vercel prod env, not locally.
4. **One feature at a time, fully reviewed before push** — Gio's explicit ask 2026-05-11.

---

## Files containing strategic context (read in this order if rebuilding context)

1. `docs/session-state.md` (this file) — start here
2. `docs/deploy-safety-playbook.md` — the rules
3. `docs/multi-agent-review-process.md` — how to use Agent() for review
4. `docs/product-expansion-plan-2026-05-11.md` — the V1 plan
5. `docs/product-expansion-plan-2026-05-11-review.md` — V2 (adversarial review of V1)
6. `docs/negotiation-feature-review-2026-05-11.md` — what the 3 review agents found on the current feature
7. `docs/followup-feature-test-plan-2026-05-11.md` — pattern for the next feature's test plan
8. `docs/analytics-events-index-2026-05-11.md` — every custom event the site fires

---

## How to rebuild context if this session dies

If a future Claude session starts cold:

```bash
# 1. Verify the negotiation handler work is still intact:
git log --oneline -10
git show 7207fbe --stat   # confirms the in-progress commit exists

# 2. Verify the safety net is in place:
npm run preflight

# 3. Read this doc + the 7 referenced docs above. That rebuilds full context.

# 4. To resume: check what iteration N is supposed to do (above), and start.
```

If `7207fbe` is missing locally but the feature branch exists:
```bash
git fetch origin
git checkout master
git reset --hard origin/feature/negotiation-in-progress
# Now you're at the savepoint and can continue.
```

If everything is broken and we need to restart cleanly:
```bash
git reset --hard stable-2026-05-11-pre-followup
git push -f origin master
# Rolls back to last known-good. Lose the follow-up + negotiation work.
# Use only as absolute last resort.
```

---

## Open strategic questions (deferred decisions)

These are unresolved questions from `product-expansion-plan-2026-05-11-review.md` that Gio hasn't answered yet. Future sessions should ask if relevant:

1. **Customer archetype** — grad/early-career, career-changer, or senior layoff cohort? Affects every feature priority decision.
2. **ChatGPT-vs-Vantage output quality test** — has Gio run this yet? If Vantage outputs aren't visibly better than free ChatGPT, future work should be prompt-engineering not new features.
3. **Free tier rebalance** — keep 10 tokens, cut to 3, or bundle 10 tokens with more actions per token? (May 6 diagnosis flagged this as a likely conversion issue.)
4. **Token-cost philosophy** — per-action (current) or bundle ("1 token = analysis + ATS-CV + 2 rewrites + 1 follow-up")? Bundle would make "10 free prep packs" marketing actually accurate.

---

## Commit log (recent — most recent first)

| SHA | Pushed? | What |
|---|---|---|
| `7207fbe` | local + feature branch | Negotiation API handler + multi-agent review (LOCAL ONLY on master, also on `feature/negotiation-in-progress`) |
| `abf7a85` | yes (live) | Preflight + deploy-safety-playbook + multi-agent-review-process docs |
| `87077f6` | yes (live) | Followup consolidation into /api/interview/[action] (fixed 13-function deploy fail) |
| `399e309` | yes (FAILED deploy) | First followup attempt — caused the 13-function fail. Code lives in the consolidated version now. |
| `c2d3d42` | yes (live) | PDF support for ATS scanner + blog chip dedup/multi-select + product expansion docs |
| `b5faf2b` | yes (live) | LandingPage 11-CTA tracking |
| `7c5f2e2` | yes (live) | Waitlist endpoint hardening (rate-limit + origin allowlist) |
| `e33e2f5` | yes (live) | Nav fix (Features + How It Works buttons scroll properly) |
| `0368989` | yes (live) | BlogPost CTA + share tracking |
| **`stable-2026-05-11-pre-followup`** | tag | **Rollback point.** |

---

*This doc is the cold-start recovery path. Update it at every milestone.*
