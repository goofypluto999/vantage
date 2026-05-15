# Session State — Resume Point for Future Claude Sessions

> **2026-05-12 — AI JOB SEARCH POST-MILESTONE POLISH (083a3c8 → 861586f, autonomous /loop):**
>
> After the AI Job Search milestone landed (c46bdbb), the user reported three critical UX issues that became the kickoff for an autonomous /loop polish run:
> 1. NegotiationComposer modal was overwhelming — every field rendered at once → progressive disclosure refactor (TIER 1 essentials always visible, TIERs 2-6 collapsible).
> 2. AI Job Search shipped as a separate /jobs page — user wanted it as an expandable Dashboard section. Extracted `JobSearchSection` (embedded prop) and mounted it inside Dashboard between Negotiation and Tracker. `/jobs` route now a thin Dashboard-themed wrapper.
> 3. `/jobs` page rendered invisibly ("NOTHING LOADS") — theme-aware `t.pageBg` (light theme bright) collided with dark-theme `text-white` classes. Fixed by hardcoding the Dashboard dark gradient.
>
> All three landed in `083a3c8`. The session then continued in autonomous mode shipping safe polish commits:
>
> | SHA | What | Verified |
> |---|---|---|
> | `083a3c8` | three user-reported UX fixes (above) | ✓ live |
> | `95e8758` | "Next free scan in Xh" hint on successful scans | ✓ live |
> | `f461aa7` | distinct rose banner for `errored` job sources | ✓ live |
> | `0d703ad` | search filters auto-persist per-user via useFormDraft | ✓ live |
> | `511dae5` | landing-page FAQ entry mentioning AI Job Search | ✓ live |
> | `2466020` | "Reset filters" button (companion to persistence) | ✓ live |
> | `c3bbc3e` | AI Job Search bullet on Pricing Starter plan | queued |
> | `5484271` | "N saved →" deep-link from search results to tracker | queued |
> | `861586f` | smooth-scroll job-search panel on expand (mobile UX) | queued |
>
> Each commit shipped with: type-check clean, multi-agent review, preflight 8/8. Sandbox blocks direct master push, so user manually `git push origin master` each iteration; loop verifies bundle hash change + endpoint health on the next tick.
>
> ---

> **2026-05-11 — AI JOB SEARCH MILESTONE LIVE (c46bdbb):**
>
> Third attempt succeeded after two prior runtime crashes (`106a0bf`, `7594121`).
> Both prior attempts used external helper files (`/lib/jobSources.ts`, `/api/_lib/jobSources.ts`) that Vercel's `@vercel/node` bundler did NOT include in the function bundle, taking down all 5 actions in `api/interview/[action].ts` on module load.
> Fix: **inlined ALL source-adapter code directly into `[action].ts`**. File is now ~70KB but bundling is no longer a question. No external imports from `api/interview/[action].ts` except npm packages + Node builtins.
>
> Live verified (`https://aimvantage.uk/`):
> - `POST /api/interview/jobsearch` anon → 401 ✓ (auth-gated, new feature live)
> - `GET /api/interview/jobsearch` → 405 ✓ (method guard)
> - `POST /api/interview/{negotiation,followup,questions,evaluate}` anon → 401 ✓ (NO regression from new code)
> - `GET /jobs` → 200 ✓ (route renders)
> - `POST /api/{roast,decode-rejection,ghost-job-check}` empty → 400 ✓
> - `POST /api/{analyze,rewrite-tone}` anon → 401 ✓
> - `vantage-geo` cookie has `Secure` ✓
> - Salary canonical = self ✓
> - Stale `/assets/X.js` → 404 ✓
>
> User prerequisites complete:
> - Adzuna API keys in Vercel env (`ADZUNA_APP_ID`, `ADZUNA_APP_KEY`)
> - Supabase migration RUN (`last_free_jobsearch_at` + `cv_summary` + `REVOKE UPDATE`)
>
> Pricing: 1 free curated pack per 24h per user (server-tracked, refresh-proof). 1 token per subsequent pack. Anonymous redirected to /register.
> Sources: Adzuna (20 countries) + Remotive (global remote). LLM: Gemini 2.5 Flash (single batched call, ~£0.002-0.005 per scan).
>
> ---

> **2026-05-11 QUEUE STATE (historical — all of these have since shipped):**
>
> All three commits below pushed + verified live on 2026-05-11:
> - `903122e` preflight new checks → live
> - `b98736a` Dashboard download (.md) on analysis results → live
> - `860a4d4` ghost-job degraded:true banner → live
>
> Current queue lives in the 2026-05-12 polish block above.
>
> ---

> **2026-05-11 INCIDENT RECORD (added end-of-session):**
> Commit `106a0bf` (AI Job Search feature MVP) BUILT clean + preflight 6/6 + multi-agent reviewed, but **broke production at runtime**: all `/api/interview/*` endpoints returned 500 (followup + negotiation + questions + evaluate down for ~4 min).
> **Root cause hypothesis (not confirmed via logs):** the new `handleJobSearch` imported from `../../lib/jobSources` — a top-level `lib/` directory OUTSIDE `api/`. Vercel's serverless function bundler likely did NOT include `lib/jobSources.ts` in the function bundle, so at runtime the require of the missing module crashed the entire `/api/interview/[action].ts` dispatcher module on first load. All five actions in the dispatcher (including pre-existing followup/negotiation) failed because the module itself wouldn't load.
> **Recovery:** `git revert 106a0bf` → `6e00cbf` deployed and live healthy.
> **Plan for redo:** put source-adapter code INSIDE `api/_lib/` (Vercel-convention for non-function modules) OR inline directly into `api/interview/[action].ts`. Will also need to teach preflight to ignore `_`-prefixed dirs so the file-count check passes.
> **Lesson:** preflight passes a local build but does NOT test the Vercel bundling pipeline. Need a "deploy to preview branch first" step before merging to master for changes that introduce cross-directory imports into `api/*`.



> Read this file FIRST in any new session. It captures everything in
> flight, where the rollback points are, what's shipped vs pending vs
> deferred, and what the next concrete steps are.
> Last updated: 2026-05-11, end-of-session wrap before next major
> milestone ("big-ticket feature — tool → service" per user).

---

## TL;DR — current production state

**Live at `https://aimvantage.uk` (verified 2026-05-11):**

| Endpoint / page | Result | Meaning |
|---|---|---|
| `GET /` | 200 | Homepage healthy |
| `POST /api/interview/followup` (anon) | 401 | Auth-gated, healthy |
| `POST /api/interview/negotiation` (anon) | 401 | Auth-gated, **new feature live** |
| `GET /api/interview/negotiation` | 405 | Method guard active |
| `POST /api/ghost-job-check` (empty) | 400 | Validation healthy |
| `GET /salary/software-engineer` | 200 + correct self-canonical | SEO fix verified |
| `GET /case-studies/building-vantage-…` | 200 + correct self-canonical | SEO fix verified |
| `GET /assets/<stale-hash>.js` | 404 | Routing fix verified (was HTML 200) |
| `GET /assets/<real-hash>.js` cache | `max-age=31536000, immutable` | Cache fix verified |
| `Set-Cookie: vantage-geo` | has `Secure` | Cookie hardening verified |

**Features shipped + live (since 2026-05-11 start):**

1. **Salary Negotiation Brief** (`/api/interview/negotiation`, 2 tokens):
   - Server: multi-agent reviewed handler in `api/interview/[action].ts`
     with 13 review findings applied (NaN validation, email-structure
     anti-pattern fix, JSON quote-escape repair, prompt-injection
     guard, fmtMoney for legitimate-zero handling). Recipient fields
     (`recipientName`, `recipientRole`) now correctly destructured +
     validated + threaded into the prompt.
   - Client: `src/components/NegotiationComposer.tsx` modal with 7
     HIGH + 3 MED multi-agent UX findings applied (double-click race
     guard via `inFlightRef`, degraded-fallback banner, aria-live
     result region + focus management, 17 missing htmlFor/id label
     pairs added, error retry button, mobile-first grid).
   - Wired into Dashboard between Follow-up Email block and upgrade
     nudge. Lazy-loaded.

2. **Codex production audit reliability fixes** (see `docs/audit-fixes-2026-05-11.md`):
   - `extractJsonObject()` hardened in both `/api/ghost-job-check` and
     `/api/decode-rejection` (markdown-fence strip, smart-quote norm,
     trailing-comma repair, stray-newline escape). 1-retry + graceful
     200 fallback (`degraded:true`) on terminal parse failure —
     `parse_failure` 500s can no longer reach the client.
   - New `src/lib/fetchWithTimeout.ts` shared helper: 30s
     AbortController-backed timeout + uniform `classifyAiToolError()`.
     Wired into Roast / Decode / GhostJob — no more stuck
     "Roasting…" / "Decoding…" UI.
   - `vercel.json`: SPA-fallback rewrite negative-lookahead excludes
     `/assets/`, `/frames/`, `/blog/`, `/markdown/`, `/postman/`.
     Missing hashed assets now return real 404. `/assets/*` gets
     immutable 1-year cache.
   - `scripts/prerender-seo.mjs` extended for `caseStudies` +
     `pressReleases` + `salaryData` — 15 audit-flagged pages now have
     per-route self-canonicals.
   - `middleware.ts`: `vantage-geo` cookie has `Secure` flag.
   - Stale external links cleaned up.

3. **Local persistence layer** (see `docs/local-persistence-features-2026-05-11.md`):
   - `src/lib/useFormDraft.ts`: 500ms debounced localStorage with
     user-scope key segregation, suppressNextWriteRef to defeat the
     clear-then-resave race, cross-tab `storage` event sync,
     `sweepDraftsForUser()` called on logout.
   - `src/lib/useResultHistory.ts`: ring buffer (5 entries, 30-day
     TTL) with 64KB/entry + 256KB/key byte caps and quota-error retry.
   - NegotiationComposer + FollowupComposer get auto-save + "Restore
     draft / Start fresh" prompts (with `aria-live`).
   - RoastPage + DecodeRejectionPage + GhostJobCheckPage get
     "Past results (N saved on this device)" panel with Clear all,
     defensive entry rendering, ISO date labels.
   - `Dashboard.handleSignOut` sweeps both stores via `userScope`
     before `signOut()` returns.

---

## On master, NOT YET LIVE (Vercel rate-limited)

**Commit `49999c3` — `feat(tools): Download (.md) on Roast + Decode + Ghost-Job result panels`:**

- New `src/lib/exportMarkdown.ts` (framework-agnostic utility).
- `Download (.md)` button on each of the 3 public AI tool result panels.
- Pure client-side: Blob URL download, no server transit, no AI cost.
- Multi-agent security + UX review caught **2 HIGH + 5 MED + 3 LOW**;
  ALL fixed before push:
  - HIGH: HTML-escape `<` `>` `&` (XSS via raw HTML in Obsidian/
    GitHub/VS Code renderers)
  - HIGH: neuter `javascript:` / `data:` / `vbscript:` scheme links
  - MED: `aria-label`, `Download` icon, clearer "Download (.md)" copy
  - MED: `mdSection` helper — heading omitted when body empty
  - MED: filename fallback consistency
  - LOW: Windows reserved basenames (CON/PRN/NUL/...), Unicode RTL-
    override + zero-width strip (`.md.exe` masquerade vector)
  - LOW: list-item embedded-newline continuation

**Status:** Vercel returned `Deployment rate limited — retry in 24
hours` (hit the 100/day Hobby tier cap from today's many ship +
ratelimit + retry + fix cycle). **Live unaffected** — Vercel keeps
previous successful deployment (`5227644` / `10d7f4e`) serving traffic.

**When rate limit clears**, the next push (or Vercel's auto-retry on
the next commit) will deploy `49999c3` + anything stacked on top.
**No manual action needed** — this is normal Vercel behaviour.

---

## Deferred — indexed for V2 (not blocking)

These items were either flagged by Codex audit or surfaced in multi-
agent reviews but deferred with explicit rationale. **None block ship.**

| Item | Severity | Why deferred | Where logged |
|---|---|---|---|
| CSP `script-src 'unsafe-inline'` removal | P2 | Needs Vite-wide nonce migration (build hook or edge middleware). Style-src 'unsafe-inline' breaks Tailwind v4 + React + Vite font tooling. | `docs/audit-fixes-2026-05-11.md` |
| Unknown SPA routes return HTTP 200 (soft-404) | P1 | SPA inherent. `NotFoundPage` already emits `noindex` via SEO component, so JS-executing crawlers won't index. True HTTP-404 status needs SSR or per-route build-time enumeration. | `docs/audit-fixes-2026-05-11.md` |
| Three.js + blog corpus bundle weight (~1MB decoded) | P2 | Known. Route-level code-splitting plan filed. | `docs/audit-fixes-2026-05-11.md` |
| Mobile homepage clipping (390x844) | P3 | Codex couldn't confirm intentional vs accidental; needs live visual review. | `docs/audit-fixes-2026-05-11.md` |
| Login-protected external links (Workday/OpenAI/Teal) | P3 | Bot-blocked, not broken. Left in place. | `docs/audit-fixes-2026-05-11.md` |
| Refund-not-atomic across handler kill | Type-review #7 | Architectural. Every Gemini endpoint has this. Project-wide fix needs `pending_charges` reconciliation queue. | `docs/negotiation-feature-review-2026-05-11.md` |
| Concurrent double-submit shows 403 not friendly msg | Type-review #8 | UX polish. Not blocking. | `docs/negotiation-feature-review-2026-05-11.md` |
| Enum-source-of-truth refactor (NegotiationComposer local types) | LOW | Import from `services/api.ts` instead of redeclaring. Polish. | UX review log |
| `degraded` flag not rendered in GhostJob result panel | LOW | Already rendered in NegotiationComposer; bring same banner to GhostJob result panel. | UX review log |
| `additionalContext` free-text PII warning | LOW | Hook comment now truthful; consider a one-line UI hint next to the textarea. | UX review log |
| Failure-mode E2E test for AI tools (Playwright across 200/400/429/500/network/timeout) | suggested in audit | Time investment; multi-agent review provides equivalent coverage for now. | `docs/audit-fixes-2026-05-11.md` |

## Strategic / open questions (still unanswered)

These are the questions from `docs/product-expansion-plan-2026-05-11-review.md`
that the user has not answered yet. Surface them before each major
direction decision:

1. **Customer archetype** — grad/early-career, career-changer, or
   senior layoff cohort? Affects every feature priority.
2. **ChatGPT-vs-Vantage output quality test** — has user run this yet?
   If outputs aren't visibly better than free ChatGPT, future work
   should be prompt-engineering not new features.
3. **Free tier rebalance** — 10 tokens, cut to 3, or bundle tokens
   with more actions per token? (Diagnosed as likely conversion issue.)
4. **Token-cost philosophy** — per-action (current) or bundle
   ("1 token = analysis + ATS-CV + 2 rewrites + 1 follow-up")?

---

## Constraints to remember

1. **Vercel Hobby tier limits:**
   - 12 serverless functions per deployment (**currently at 12/12**;
     any new endpoint must consolidate into existing `[action].ts`
     dispatchers like `api/interview/[action].ts` or `api/admin/[action].ts`)
   - **100 deploys per day** (hit this 2026-05-11; auto-clears in 24h)
   - 50MB compressed per function
2. **No Vercel Pro** — user explicitly said no.
3. **`feedback_key_hygiene` memory** — never ask for API keys in chat.
4. **One feature at a time, fully reviewed before push** — generally
   true, but 2026-05-11 bundled three streams in one commit due to
   cross-file overlap. Future: try to keep streams separate when
   possible.
5. **Multi-agent review required** for non-trivial features. Pattern
   in `docs/multi-agent-review-process.md`.

---

## Files containing strategic context (read in this order if rebuilding context)

1. `docs/session-state.md` (this file) — start here
2. `docs/deploy-safety-playbook.md` — the rules
3. `docs/multi-agent-review-process.md` — how to use Agent() for review
4. `docs/audit-fixes-2026-05-11.md` — Codex audit findings + fixes
5. `docs/negotiation-feature-review-2026-05-11.md` — review log
6. `docs/local-persistence-features-2026-05-11.md` — feature + review log
7. `docs/product-expansion-plan-2026-05-11.md` — the V1 plan
8. `docs/product-expansion-plan-2026-05-11-review.md` — adversarial review
9. `docs/followup-feature-test-plan-2026-05-11.md` — pattern for test plans
10. `docs/analytics-events-index-2026-05-11.md` — every custom event

---

## Commit log (recent — most recent first)

| SHA | Live? | What |
|---|---|---|
| `49999c3` | **pending (Vercel rate-limited)** | feat(tools): Download (.md) on Roast + Decode + GhostJob result panels — multi-agent reviewed |
| `10d7f4e` | yes (live) | docs: session-state reflects shipped + verified live state |
| `5227644` | yes (live, current head) | fix(vercel): drop `(?:...)` non-capturing-group header rule |
| `ff60235` | yes (superseded by 5227644) | Bundled 22-file ship (deploy initially failed on vercel.json regex) |
| `07fed20` | yes (live) | docs: session-state cold-start recovery |
| `7207fbe` | yes (superseded by ff60235) | Negotiation API handler v1 (recipient-drop bug, fixed) |
| `abf7a85` | yes (live) | Preflight + deploy-safety-playbook + multi-agent-review-process docs |
| **`stable-2026-05-11-pre-followup`** | tag | **Rollback point.** |

---

## Loop state

Session loop **stopped** by user request at end-of-session. No
ScheduleWakeup armed. One in-flight wakeup may still fire (last
scheduled before stop request); if it does, it's safe to ignore — no
work to continue, just acknowledge and exit.

---

## How to resume cleanly

```bash
# 1. Verify live state still matches the smoke table above:
curl -s -o /dev/null -w "%{http_code}\n" https://aimvantage.uk/
curl -s -X POST -o /dev/null -w "%{http_code}\n" -H "Content-Type: application/json" -d '{}' https://aimvantage.uk/api/interview/negotiation

# 2. Check whether the rate-limited deploy cleared:
gh api repos/goofypluto999/aimvantage/commits/49999c3/status --jq '.state'
# If "success" — the Download (.md) feature is now live too.
# If still "failure" with "rate limited" — wait, no action needed.

# 3. Run local preflight to confirm worktree integrity:
npm run preflight   # expect 6/6 pass

# 4. Read this doc + the 10 referenced docs above. Full context rebuilt.
```

## Hard rollback (last resort)

```bash
git reset --hard stable-2026-05-11-pre-followup
git push -f origin master
# Reverts EVERYTHING shipped 2026-05-11. Loses negotiation feature,
# audit fixes, persistence, markdown export. Use only if a deployed
# regression is unfixable in-place.
```

---

*This doc is the cold-start recovery path. Update it at every milestone.*
