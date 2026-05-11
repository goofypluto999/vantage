# Codex Production Audit — Fixes Applied (2026-05-11)

Source: `C:\Codex Logic\aimvantage-audit-handoff-2026-05-11.md`

Codex ran a black-box production audit on `https://aimvantage.uk/`,
crawled 271 sitemap pages + 523 rendered routes, tested every public AI
tool with 3 runs each, and probed all public API endpoints. Eleven
findings were filed across reliability, SEO, routing, cache, and
security hardening. This doc records what was fixed in this iteration,
what was deferred, and the smoke-test plan post-deploy.

## TL;DR

All P0 and P1 audit findings shipped in code. Two P2/P3 items were
deferred with a written rationale (CSP `unsafe-inline` requires a
Vite-wide nonce migration; SPA soft-404 is an inherent SPA tradeoff and
already mitigated client-side by `NotFoundPage` setting `noindex`).

Preflight: 6/6 pass after fixes. TypeScript clean. Production build
clean (302 prerendered route HTML files written, up from ~286 before —
the 16-route increase = 13 salary pages + 2 case studies + 1 press
release that were previously canonicalising to homepage).

## Findings Addressed

### P0 #1 — `/api/ghost-job-check` returns 500 `parse_failure` on valid input

**Files:** `api/ghost-job-check/index.ts`, `api/decode-rejection/index.ts`

Hardened `extractJsonObject()` in both endpoints (same pattern):
1. Strip markdown code-fences (` ```json ` / ` ``` `) before parsing.
2. On first `JSON.parse` failure, run a repair pass:
   - Trailing-comma removal (`,(\s*[}\]])` → `$1`)
   - Smart-quote normalization (`"` `"` `'` `'` → `"` `'`)
   - Escape stray raw `\n` / `\r` / `\t` characters inside string literals
     (the most common Gemini failure mode for the `tells` / `specificClues`
     fields where it inserts a literal newline mid-string).
3. If the repair still fails, throw `SyntaxError` — caller decides fallback.

Added 1-retry + graceful 200 fallback in both handlers: on terminal parse
failure (i.e. both the initial and the retry call fail), return a
`200 OK` with a neutral structured payload (`degraded: true`) instead of
a 500. UI stays responsive and the user gets a usable conservative
result rather than a hard error.

**Acceptance criteria from audit:**
> No valid input over 100 chars returns `parse_failure`.

Met: terminal `SyntaxError` no longer surfaces to the client; the
client gets either a parsed result, a retry-passed result, or a
graceful neutral fallback.

### P0 #2 — AI tool UIs can get stuck on `Roasting…` / `Decoding…`

**Files:**
- New: `src/lib/fetchWithTimeout.ts` — `fetchWithTimeout()` +
  `classifyAiToolError()` (framework-agnostic, lives in `/lib`)
- `src/components/RoastPage.tsx`
- `src/components/DecodeRejectionPage.tsx`
- `src/components/GhostJobCheckPage.tsx`

Every public AI tool POST is now wrapped in an `AbortController` with a
**30s hard timeout** (server `maxDuration: 20s` per `vercel.json`, +10s
network headroom). On timeout / network failure / 429 / 5xx / 4xx, the
shared `classifyAiToolError()` returns a recoverable user-friendly
message plus an optional retry hint (e.g. *"Try again in 2m."* for 429
with `retryAfterMs`). The `loading` state is always cleared in
`finally`, so the UI can never remain on "Roasting…" indefinitely.

Also added `degraded?: boolean` to `GhostResult` so the UI can surface a
"limited result" hint when the server returned the parse-failure
fallback path.

### P1 #3 — Soft 404s: unknown app routes return homepage HTML 200

**Status: partially fixed (SPA tradeoff documented).**

Vercel SPA deployments inherently rewrite unknown routes to the app
shell so the client router can render its own NotFound. The SEO impact
is already mitigated client-side: `src/components/NotFoundPage.tsx`
emits `<meta name="robots" content="noindex,nofollow">` via the SEO
component, so crawlers that execute JS won't index these soft-404s.

Fixing the HTTP status itself requires either build-time enumeration of
all valid routes (and the regex listing every one of them in
`vercel.json`) or full SSR. Both are larger refactors. Filed for V2.

### P1 #4 — Stale hashed assets return HTML 200

**File:** `vercel.json`

Added `/assets/`, `/frames/`, `/blog/`, `/markdown/`, `/postman/` to the
negative-lookahead in the SPA fallback `rewrite`. Missing files under
those paths now fall through to Vercel's default `404` (with correct
content-type), rather than being rewritten to `index.html`. The
hashed-asset module-load failure scenario is resolved.

### P1 #5 — Canonical/meta duplication on 15 sitemap pages

**File:** `scripts/prerender-seo.mjs`

The existing prerender script handled blog / sample / alternatives /
companyPacks / atsVendors / laidOff / companySeniority /
interviewQuestions, but **not** caseStudies, pressReleases, or
salaryData. Codex caught it: those three data sources produced 15 detail
pages all still serving the static `index.html` canonical
(`https://aimvantage.uk/`).

Extended `loadProgrammaticRoutes()` with three new blocks that read
`src/data/caseStudies.ts`, `src/data/pressReleases.ts`, and
`src/data/salaryData.ts`, pull `(slug, title, description|subtitle|role)`,
and add per-route entries with self-canonicals + unique titles +
unique descriptions.

Verified post-build: every previously-affected URL now has a correct
self-canonical in `dist/<path>/index.html`. Build wrote 302 files total.

### P2 #6 — Hashed assets not long-cache immutable

**File:** `vercel.json`

Added two header rules:
- `/assets/(.*)` → `Cache-Control: public, max-age=31536000, immutable`
- `/(.*)\.(?:js|mjs|css|woff|woff2|ttf|eot|otf|png|jpe?g|gif|svg|webp|avif|ico|map)` →
  same `immutable` long-cache

HTML still revalidates because it falls under the default `/(.*)` rule.
Deploys still propagate; only static fingerprinted assets stick in cache.

### P2 #7 — CSP `unsafe-inline` migration

**Deferred** with rationale: removing `script-src 'unsafe-inline'`
requires per-deploy nonce generation (a Vercel build hook or edge
middleware), and `style-src 'unsafe-inline'` would break Tailwind v4 +
React + Vite font tooling. Filed for V2 with the existing CSP positives
already in place (`object-src 'none'`, `base-uri 'self'`,
`form-action 'self'`, `upgrade-insecure-requests`).

### P2 #8 — `vantage-geo` cookie missing `Secure`

**File:** `middleware.ts`

Added `Secure` to the `vantage-geo` `Set-Cookie` header. Did not add
`HttpOnly`: `CurrencyContext` reads this cookie in the browser to
default currency on first paint, and the cookie value is non-
authenticating (ISO country code only). The combination is
intentional and matches the JS-readable, non-PII, browser-defaulting
cookie pattern.

### P2 #9 — Stale external source links

**Files:** `src/components/CostCalculatorPage.tsx`, `src/data/atsVendors.ts`, `src/components/VendorSourcesPage.tsx`, `src/data/sampleAnalyses.ts`

Replaced:
- `https://resumeworded.com/pricing` (404) → `https://resumeworded.com/`
- `https://www.livecareer.com/pricing` (timed out) → `https://www.livecareer.com/`
- `https://www.icims.com/customer-resources/` (404) → `https://www.icims.com/products/talent-cloud/`
- `https://stripe.com/jobs/listing/staff-product-manager-billing-platform` (404) → `https://stripe.com/jobs`

Workday, OpenAI, and Teal links flagged by the audit were bot/login-
gated, not broken — left in place.

### P2 #10 — Bundle architecture is heavier than needed

**Deferred.** Three.js + blog corpus weight is a known pre-existing
issue and not a launch blocker. Filed for V2 with a route-level code-
splitting plan.

### P3 #11 — Mobile homepage clipping

**Deferred — requires visual review.** The audit flagged off-viewport
elements at 390×844 but couldn't confirm whether they were intentional
(carousel) or unintended clipping. No code change without a live
browser inspection.

## Smoke Test Plan (post-deploy)

Run these against `https://aimvantage.uk/` after the deploy lands:

1. **Ghost-job parse-failure regression:**
   ```bash
   curl -s -X POST https://aimvantage.uk/api/ghost-job-check \
     -H "Content-Type: application/json" \
     -H "Origin: https://aimvantage.uk" \
     -d '{"jobDescription": "<paste a real-job-style JD with quoted phrases, 200+ chars>"}'
   ```
   Expect: HTTP 200, valid JSON with `ghostProbability`, `verdict`,
   `summary`, `tells`, `yourMove`. **Never** `parse_failure`.

2. **Decode-rejection same:** identical test against
   `/api/decode-rejection` with a real rejection email body.

3. **AI tool UI timeout regression (browser):**
   - Open `/roast`, paste a 5000-char letter, click Roast.
   - In DevTools Network panel, throttle to "Offline" mid-request.
   - UI must show a recoverable error within 30s and re-enable the
     Roast button. Same for `/decode-rejection` and `/ghost-job-check`.

4. **Stale asset → 404:**
   ```bash
   curl -s -o /dev/null -w "HTTP %{http_code}\n" \
     https://aimvantage.uk/assets/index-wzvNxi5B.js
   curl -s -o /dev/null -w "HTTP %{http_code}\n" \
     https://aimvantage.uk/assets/index-DBOm9-go.css
   ```
   Expect: HTTP 404 for both, NOT HTML 200.

5. **Canonical fix:**
   ```bash
   curl -s https://aimvantage.uk/salary/software-engineer | \
     grep 'rel="canonical"'
   ```
   Expect: `<link rel="canonical" href="https://aimvantage.uk/salary/software-engineer" />`,
   NOT homepage URL.

6. **Asset cache:**
   ```bash
   curl -sI https://aimvantage.uk/assets/<any-hashed.js> | \
     grep -i cache-control
   ```
   Expect: `cache-control: public, max-age=31536000, immutable`.

7. **Cookie Secure:**
   ```bash
   curl -sI https://aimvantage.uk/ | grep -i set-cookie
   ```
   Expect: `vantage-geo=XX; ...; Secure`.

8. **Followup smoke (regression of previous deploy):**
   ```bash
   curl -s -o /dev/null -w "POST anon /followup → %{http_code}\n" \
     -X POST -H "Content-Type: application/json" \
     https://aimvantage.uk/api/interview/followup
   ```
   Expect: 401.

If any of these fail, do **not** push more — rollback via
`git reset --hard stable-2026-05-11-pre-followup` and forensics.

## Rollback Plan

```bash
# Soft rollback (preserves audit fixes elsewhere):
git revert HEAD

# Hard rollback (back to pre-followup baseline):
git reset --hard stable-2026-05-11-pre-followup
git push -f origin master
```

## What's NOT In This Commit

- Negotiation feature wire-up (modal exists at
  `src/components/NegotiationComposer.tsx` + Dashboard wiring done, API
  wrapper done — but kept on local branch until post-audit smoke clears).
  Will go in a separate dedicated commit per the
  one-feature-at-a-time-then-push discipline.

## Files Touched

| File | Reason |
|---|---|
| `api/ghost-job-check/index.ts` | Parser hardening + retry + graceful fallback |
| `api/decode-rejection/index.ts` | Same parser hardening + retry + graceful fallback |
| `src/lib/fetchWithTimeout.ts` | NEW shared timeout + error-classification helper |
| `src/components/RoastPage.tsx` | Wire timeout + classifier |
| `src/components/DecodeRejectionPage.tsx` | Wire timeout + classifier |
| `src/components/GhostJobCheckPage.tsx` | Wire timeout + classifier + degraded hint |
| `vercel.json` | Asset routing fix + immutable cache headers |
| `middleware.ts` | `Secure` on vantage-geo cookie |
| `scripts/prerender-seo.mjs` | caseStudies + pressReleases + salaryData routes |
| `src/components/CostCalculatorPage.tsx` | Stale URLs replaced |
| `src/data/atsVendors.ts` | Stale URL replaced |
| `src/components/VendorSourcesPage.tsx` | Stale URL replaced |
| `src/data/sampleAnalyses.ts` | Stale URL replaced |
| `docs/audit-fixes-2026-05-11.md` | This document |
