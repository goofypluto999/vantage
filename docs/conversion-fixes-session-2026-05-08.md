# Conversion Fixes Session — 2026-05-08

> Autonomous /loop session continuing from 2026-05-07. Goal: fix what Gio
> tested himself and reported broken on the free tools, then ship landing
> CTA hierarchy + dashboard UX from the existing UX plan.

---

## What Gio reported

> "Ok the free tools you built they need a shit ton of attention, please
> revise, test look at each again, they dont fully work I tried, you need
> ot make sure they wrk and teh deisgn is well structured and done"

→ Free tools (`/decode-rejection`, `/ghost-job-check`) verified broken in
production. `/roast` was working. `/tools/jobscan-cost-calculator` was
working.

---

## Bugs found + fixed

### Bug 1 — `responseMimeType: 'application/json'` crashed Gemini calls

**Affected:**
- `/api/decode-rejection`
- `/api/ghost-job-check`
- `/api/interview/[action]` (questions + evaluate, latent — also affects paid users)
- `/api/admin/[action]` (draft-reply, latent — admin-only)

**Root cause:** `@google/genai` 1.29.0 + `gemini-2.5-flash` returns 500 on
prompts containing nested arrays when `responseMimeType: 'application/json'`
is set in config. `/api/roast` survived because it never set this flag.

**Fix:** Removed `responseMimeType` from all four endpoints. Prompt asks for
raw JSON output. Defensive code-fence stripping + balanced-brace JSON
extraction handle prose-wrapped responses.

**Commits:**
- `e9207f2` — initial fix removing responseMimeType + simple fence-strip
- `b43c755` — robust `extractJsonObject()` walker for the 2 free-tool endpoints
- `2bef654` — same fix applied proactively to `/api/interview` + `/api/admin`

### Bug 2 — `maxOutputTokens: 1500` truncated longer responses

**Affected:**
- `/api/ghost-job-check` (4 long `tells` strings + summary + yourMove → 1800+ tokens)
- `/api/decode-rejection` (specificClues + translation + nextMove → can exceed 1500)

**Root cause:** Gemini stopped mid-output → walker never found closing brace
→ `SyntaxError: 'Unmatched braces in AI response'`. Diagnosed via temporary
`debugDetail` field exposed in 500 responses.

**Fix:** Bumped `maxOutputTokens` 1500 → 2500 on both endpoints. Cost
ceiling rises ~£0.0001/call.

**Commits:**
- `c347135` — temporary `debugDetail` on decode 500 (later removed)
- `7c59a8e` — temporary `debugDetail` on ghost 500 (later removed)
- `b934490` — ghost token-cap fix (verified live 17:32)
- `c3f0281` — cleanup: removed both `debugDetail` fields
- `8c6545e` — decode token-cap fix (deploy in queue at session end)

---

## Conversion improvements shipped

### Landing — hero CTA hierarchy refactor

**Problem (Clarity data):** 14/15 visitors never reached signup. Hero had 9
above-the-fold CTAs (3 same-weight pill buttons + 5 chips + sample link).
Decision paralysis.

**Fix:** Demoted secondary buttons to text links. Result:
- 1 dominant pill: "Get 10 free prep packs" (purple)
- 2 supporting text links: "Or try the free 60-sec diagnostic →" + "See it work (22s)"
- 1 sample-output link
- 5 free-tool chips (unchanged, lower-priority cluster)

No CTAs removed, no tracking changed. Pure visual de-cluttering.
**Commit:** `7865dd2` — verified live.

### Dashboard — Tier 2 UX changes from `dashboard-ux-plan-2026-05-06.md`

| ID | Change | Status |
|---|---|---|
| C5 | Warn-before-submit if no JD | already shipped earlier, intact |
| C6 | Step-progress pills above upload form (1/3 filled, etc.) | shipped this session (`607a5bc`) |
| C8 | Sample CV pre-fill option | already shipped earlier, intact |

C6 design: 3 horizontal pills (CV / Job description / Job URL). Each turns
emerald with a checkmark when filled. Right-aligned "X/3 filled" counter.
Pure presentational — no new state, no API calls, no PII surfaces.

---

## Stable tag

`v1-stable-2026-05-08-conv-fixes` (pushed) — rollback any of the above with
`git checkout v1-stable-2026-05-08-conv-fixes`.

---

## Verified live (browser MCP)

- **Landing**: hero now has 1 button + 2 text links (confirmed via DOM
  inspection: primary `BUTTON` with `px-10 py-4`, secondary `A` with no
  padding)
- **Decode rejection page**: H1, textarea, 3 sample buttons render. AI call
  returned `parse_failure` for sample 1 → diagnosed as Bug 2 → fix shipped,
  awaiting deploy.
- **Ghost-job page**: H1, textarea, 3 sample buttons render. AI call
  returned `verdict: almost_certainly_ghost / 95%` end-to-end. Working.

---

## Open / next session

- `/api/decode-rejection` token-cap fix (`8c6545e`) deployment landing — verify
  all 3 sample inputs produce valid `verdict + translation + specificClues +
  nextMove` after deploy lands.
- Watch the 3 dead-click recordings in Clarity (blocked: requires user
  interaction in Clarity dashboard, can't be done autonomously).
- Set up Clarity AI Visibility (blocked: same — requires Clarity dashboard
  account access).
- Tier 3 dashboard UX (C7 — JD-mode toggle) — deferred per UX plan ranking.

---

*Session log written by Claude under autonomous /loop on 2026-05-08.
Scope: free-tool QA + conversion fixes. ~7 commits, ~3 hours wall-time
including queue waits on Vercel free tier.*
