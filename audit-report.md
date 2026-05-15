# Vantage AI — Full Audit Report
Audit date: 2026-05-14
Auditor: Codex
Authority: Gio (founder + security officer)

## TL;DR
- 1 CRITICAL findings (security / data-loss / payment / auth)
- 5 HIGH findings (broken user flow / blocking bug)
- 4 MEDIUM findings (UX gap / minor bug)
- 2 LOW findings (polish / nice-to-have)
- Pages tested: `/dashboard` (redirected to `/login`), `/login`; then source audit stopped further automation after CRIT-01 per instruction.
- Tokens consumed during audit: ~0
- Overall ship-readiness verdict: NOT-READY

## CRITICAL findings

### CRIT-01 — Account page load can cancel live Stripe subscriptions
**Severity**: CRITICAL
**Where**: `src/components/Account.tsx:22`, `api/stripe/[action].ts:304`
**Symptom**: Merely visiting `/account` calls `syncSubscription()` when `profile.stripe_subscription_id` exists. The sync endpoint then loops over active Stripe subscriptions and calls `stripe.subscriptions.cancel(sub.id)` for every active subscription except the selected “best” one.
**Root cause hypothesis**: A recovery/sync endpoint was allowed to perform destructive Stripe mutation and is invoked automatically from a read-only account page mount.
**User impact**: Paying users with duplicate or mis-detected active subscriptions can have a real live Stripe subscription cancelled without clicking Manage Subscription, without confirmation, and without going through the Stripe Portal.
**Reproduction**:
1. Use a paid account whose Stripe customer has two active subscriptions.
2. Visit `/account`.
3. `Account.tsx` runs `syncSubscription()` on mount.
4. `/api/stripe/sync` picks one subscription and immediately cancels the other via Stripe API.
**Fix scope**: ~40-80 LOC. Make `/api/stripe/sync` read-only. Remove all `stripe.subscriptions.cancel()` calls from sync. If duplicate cleanup is needed, expose an admin-only/manual repair action with explicit confirmation and prefer `cancel_at_period_end` unless immediate cancellation is intended.
**Evidence**: Source lines: `Account.tsx:22-28` auto-calls sync; `api/stripe/[action].ts:304-308` cancels live subscriptions.

## HIGH findings

### HIGH-01 — Analyzer SSRF guard misses bracketed IPv6 and DNS-resolved private hosts
**Severity**: HIGH
**Where**: `api/analyze/index.ts:36`
**Symptom**: `isPrivateHostname()` checks `::1`, `fc*`, `fd*`, and `fe80*`, but `new URL('http://[::1]').hostname` is `[::1]`, so bracketed IPv6 localhost/private addresses pass. The guard also never resolves DNS, so a public-looking hostname resolving to a private IP can pass.
**Root cause hypothesis**: Hostname string checks are incomplete and do not validate the resolved address used by `fetch`.
**User impact**: Any authenticated user can submit a job URL that makes the server attempt internal or loopback fetches before token refund/error handling.
**Reproduction**:
1. In Node, run `new URL('http://[::1]').hostname` and observe `[::1]`.
2. `isPrivateHostname('[::1]')` returns false with current checks.
3. Submit an analyzer request with `jobUrl: "http://[::1]:12345/"`.
**Fix scope**: ~80-150 LOC. Normalize bracketed IPv6, block all loopback/link-local/ULA ranges, resolve DNS with `lookup: all`, reject private resolved IPs, and re-check every redirect hop after resolution.
**Evidence**: `api/analyze/index.ts:36-64` only validates URL hostname text before server-side fetch.

### HIGH-02 — Public AI/tool rate limits can be bypassed with spoofed `X-Forwarded-For`
**Severity**: HIGH
**Where**: `api/roast/index.ts:88`, `middleware.ts:76`
**Symptom**: `roast` and global middleware trust the first `x-forwarded-for` value as the client IP. Other fixed endpoints already prefer `x-vercel-forwarded-for`, but these two still use the spoofable header path.
**Root cause hypothesis**: Older IP extraction code was not updated consistently after the spoofing fix landed in `decode-rejection`, `ghost-job-check`, `waitlist`, and `api/[publicTool]`.
**User impact**: Attackers can rotate `X-Forwarded-For` values to bypass per-IP limits and burn Gemini calls on public endpoints.
**Reproduction**:
1. Send repeated same-origin-looking POSTs to `/api/roast`.
2. Change `X-Forwarded-For` per request.
3. Each spoofed value gets a fresh rate bucket.
**Fix scope**: ~20-40 LOC. Centralize `getClientIp()`, prefer `x-vercel-forwarded-for`, and use the last verified proxy hop as fallback only for local/non-Vercel.
**Evidence**: `api/roast/index.ts:88-95`; `middleware.ts:76-80`.

### HIGH-03 — `rewrite-tone` can silently fail to refund a charged token
**Severity**: HIGH
**Where**: `api/rewrite-tone/index.ts:30`
**Symptom**: `refundTokens()` calls `fetch('/rpc/add_tokens')` but never checks `res.ok`. HTTP 4xx/5xx responses resolve normally, so the function treats failed refunds as success and the outer error returns generic failure.
**Root cause hypothesis**: `rewrite-tone` still uses the old void best-effort refund helper while `analyze` and `interview` moved to boolean confirmed refunds.
**User impact**: A user can lose 1 token if Gemini fails and the refund RPC returns non-2xx.
**Reproduction**:
1. Force `add_tokens` RPC to return 500/403 during a rewrite-tone AI failure.
2. `refundTokens()` does not throw or report failure.
3. Client sees `Failed to rewrite cover letter`; balance remains deducted.
**Fix scope**: ~25-50 LOC. Mirror `api/analyze/index.ts` refund helper: return boolean, check `res.ok`, and surface “refund failed, contact support” when needed.
**Evidence**: `api/rewrite-tone/index.ts:33-45` ignores the `fetch` response.

### HIGH-04 — Tracker CSV Append creates duplicates on round-trip import
**Severity**: HIGH
**Where**: `src/components/ApplicationTracker.tsx:464`, `src/lib/useApplicationTracker.ts:252`
**Symptom**: Import Append loops every parsed row and calls `add()`; `add()` always generates a new ID and prepends the entry. There is no signature check against existing entries.
**Root cause hypothesis**: Import preserved timestamps and validation but never implemented dedupe semantics.
**User impact**: Exporting the tracker and importing the same CSV in Append mode duplicates every application, corrupting the client-side CRM.
**Reproduction**:
1. Save tracker entries.
2. Export CSV.
3. Import the same CSV.
4. Choose Append.
5. Existing rows are duplicated because each import row gets a new ID.
**Fix scope**: ~40-80 LOC. Before append, build a normalized duplicate key such as `company|role|sourceUrl|createdAt` or `company|role|sourceUrl|appliedDate`; skip existing matches and report skipped duplicates in the preview.
**Evidence**: `ApplicationTracker.tsx:483-485` calls `add()` unconditionally; `useApplicationTracker.ts:267-279` always creates a new ID and prepends.

### HIGH-05 — Unknown document routes still rewrite to `/` instead of HTTP 404
**Severity**: HIGH
**Where**: `vercel.json:57`
**Symptom**: The catch-all Vercel rewrite sends almost every non-API, non-asset path to `/`. Client-side Not Found may render later, but direct HTTP status remains 200 for unknown app routes.
**Root cause hypothesis**: SPA fallback is doing all route handling without a server-level known-route allowlist or 404 response.
**User impact**: The explicit “Should-404” requirement is not met, crawlers see soft 404s, and stale/bad URLs can be indexed as valid pages.
**Reproduction**:
1. Request `/definitely-not-real-codex-2026`.
2. Vercel rewrite matches and serves `/`.
3. HTTP status is 200 instead of 404.
**Fix scope**: ~80-200 LOC depending on hosting approach. Add a known-route allowlist rewrite, serve a real 404 for unknown document paths, or use middleware/functions to return 404 while preserving valid SPA routes.
**Evidence**: `vercel.json` catch-all rewrite destination `/`.

## MEDIUM findings

### MED-01 — CSP still allows `unsafe-inline`
**Severity**: MEDIUM
**Where**: `vercel.json:37`
**Symptom**: CSP includes `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'`.
**Root cause hypothesis**: Inline JSON-LD/bootstrap/style compatibility was prioritized over nonce/hash CSP.
**User impact**: Any future XSS has a weaker containment boundary.
**Reproduction**:
1. Inspect `/` response headers.
2. Observe `Content-Security-Policy` includes `unsafe-inline`.
**Fix scope**: ~100-250 LOC. Move inline scripts/styles to bundled assets or use per-request nonces/hashes for JSON-LD.
**Evidence**: `vercel.json` CSP header.

### MED-02 — Stripe sync token-credit recovery ignores `add_tokens` failures
**Severity**: MEDIUM
**Where**: `api/stripe/[action].ts:315`
**Symptom**: `/api/stripe/sync` calls `add_tokens` when `alreadySynced` is false, but never checks the RPC response before patching profile state and returning success.
**Root cause hypothesis**: Sync path lacks the checked `addTokensAtomic()` helper used by webhooks.
**User impact**: A recovery sync can mark the subscription synced while failing to add the expected plan tokens.
**Reproduction**:
1. Force `add_tokens` to return non-2xx in `/api/stripe/sync`.
2. Endpoint continues to update profile and returns success.
**Fix scope**: ~20-40 LOC. Use `addTokensAtomic()`-style helper and abort/return error if token credit fails.
**Evidence**: `api/stripe/[action].ts:315-327`.

### MED-03 — Account password visibility toggle has no accessible label
**Severity**: MEDIUM
**Where**: `src/components/Account.tsx:392`
**Symptom**: The show/hide password button is icon-only and has no `aria-label`, visible text, or title.
**Root cause hypothesis**: Icon-only control omitted the accessibility name.
**User impact**: Screen-reader users encounter an unnamed button in the password form.
**Reproduction**:
1. Visit `/account`.
2. Inspect the password visibility button.
3. It renders only an `Eye`/`EyeOff` icon with `aria-hidden="true"`.
**Fix scope**: 1-3 LOC. Add `aria-label={showPassword ? 'Hide password' : 'Show password'}`.
**Evidence**: `Account.tsx:392-398`.

### MED-04 — Tracker `clear()` does not broadcast same-tab changes
**Severity**: MEDIUM
**Where**: `src/lib/useApplicationTracker.ts:322`
**Symptom**: `clear()` removes localStorage and updates only that hook instance. It does not call `broadcastChange(key)`, unlike `writeSafe()`.
**Root cause hypothesis**: Same-tab pub-sub was added to writes but not the direct remove path.
**User impact**: If another mounted hook instance depends on tracker state, replace-import or clear can leave chips/counts stale until refresh.
**Reproduction**:
1. Mount `JobSearchSection` and `ApplicationTracker` hook instances.
2. Trigger a replace import or clear from one instance.
3. The other instance does not receive a same-tab event.
**Fix scope**: 3-5 LOC. Call `broadcastChange(key)` after successful `removeItem`.
**Evidence**: `useApplicationTracker.ts:322-330`.

## LOW findings

### LOW-01 — Base `schema.sql` is stale relative to migrations
**Severity**: LOW
**Where**: `database/schema.sql:5`
**Symptom**: Base schema does not include current profile columns used by code (`cv_summary`, `last_free_jobsearch_at`, `subscription_renews_at`, `subscription_cancel_at`); migrations add them later.
**Root cause hypothesis**: Migrations were added but the canonical bootstrap schema was not refreshed.
**User impact**: Fresh Supabase setup from `schema.sql` alone will be missing columns until every migration is manually applied.
**Reproduction**:
1. Read `database/schema.sql`.
2. Compare to `database/migration-2026-05-12-fix-all.sql` and `database/migration-2026-05-14-subscription-dates.sql`.
**Fix scope**: ~20 LOC. Fold current columns and indexes into the bootstrap schema or add a clear “run all migrations after schema” bootstrap script.
**Evidence**: `schema.sql` profile definition lacks current columns.

### LOW-02 — CSV formula defense misses LF and leading whitespace variants
**Severity**: LOW
**Where**: `src/components/ApplicationTracker.tsx:192`
**Symptom**: Export prefixes values beginning with `=`, `+`, `-`, `@`, tab, or carriage return, but does not prefix line-feed (`\n`) or leading spaces before formula characters.
**Root cause hypothesis**: OWASP formula prefix list was only partially implemented.
**User impact**: The requested `=cmd|'/c calc'!A1` case is protected, but spreadsheet edge cases beginning with LF/space may still be interpreted unexpectedly by some spreadsheet software.
**Reproduction**:
1. Add a tracker note beginning with `\n=1+1` or ` =1+1`.
2. Export CSV.
3. The cell is quoted but not apostrophe-prefixed.
**Fix scope**: 5-10 LOC. Prefix if `/^[\s]*[=+\-@]/` or starts with tab/CR/LF; document any intentional whitespace preservation.
**Evidence**: `ApplicationTracker.tsx:203`.

## Verified clean (don't worry about these)
- Admin API: server-side gate verifies Supabase JWT, confirmed email, and `ADMIN_EMAILS` membership before service-role dashboard reads.
- Stripe webhook: raw-body signature verification is enabled, test/live secrets are tried safely, and idempotency claims are released on handler failure so Stripe retries can re-run side effects.
- Ghost Job and Decode Rejection public endpoints: source contains hardened JSON extraction, retry, output sanitization, and graceful degraded 200 fallbacks for parser failures.
- Tracker export: the direct `=cmd|'/c calc'!A1` formula case is apostrophe-prefixed on export.
- Auth boundary observed: `/dashboard` redirected to `/login` in the in-app browser; no authenticated session was available.

## Performance metrics
- Landing LCP: N/A — stopped before automated sweep due CRIT-01.
- Dashboard LCP: N/A — authenticated session unavailable; `/dashboard` redirected to `/login`.
- Largest JS chunk: N/A — stopped before network bundle capture due CRIT-01.
- Total page weight (median): N/A — stopped before route sweep due CRIT-01.
- CSP report: Static header includes `unsafe-inline`; no live CSP violations captured before stop.

## Security observations
- No service role or Stripe secret key was found in inspected frontend source references; secret names appear in server code and examples only.
- Supabase service role usage is server-side in API handlers.
- Public AI abuse defenses are inconsistent: `decode-rejection`, `ghost-job-check`, `waitlist`, and `api/[publicTool]` use safer IP extraction; `roast` and middleware do not.
- Analyzer SSRF defenses are present but incomplete for IPv6 and DNS resolution.
- CSP is present but weakened by `unsafe-inline`.

## Console-log dump (raw, for the engineering agent)
```
/dashboard -> /login browser console warnings/errors: []
/login browser console warnings/errors: []
```

## Network failures (raw)
| URL | Method | Status | Page |
|-----|--------|--------|------|
| N/A | N/A    | N/A    | Automated network sweep stopped after CRIT-01 |

## Out-of-scope items I noticed but didn't test
- Authenticated dashboard journey, prep-pack token spend, AI Job Search, tracker live UI, mock interview, follow-up, negotiation, `/account`, `/refer`, `/jobs`, and `/admin` were not live-tested because the in-app browser was not logged in; `/dashboard` redirected to `/login`.
- Stripe Checkout buttons, Starter top-up, Pro/Premium subscribe buttons, and destructive Billing Portal actions were not clicked.
- Public route sweep, mobile/tablet/desktop screenshot pass, bundle-size capture, and AI public-tool live submissions were stopped after CRIT-01 per the user’s critical-finding instruction.
- Source repository was found at `C:\Cloaude Logic\vantage`; current working folder `C:\Codex Logic` is not the production source.

## Recommendation prioritization
1. Fix all CRITICAL before any new feature.
2. Fix HIGH before next paid customer.
3. MEDIUM and LOW in priority order: MED-02, MED-01, MED-03, MED-04, LOW-01, LOW-02.
