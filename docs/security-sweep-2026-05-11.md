# Vantage Security Sweep — 2026-05-11

Live target: `https://aimvantage.uk`
Codebase: `C:\Cloaude Logic\vantage`

Scope: secret leakage, gitignore audit, dist scan, API auth/validation, admin gating, public files, and live anonymous probes against critical endpoints.

## Summary

- 0 critical findings
- 0 high findings
- 1 medium finding
- 2 low / informational findings

The site is in very good security shape. No leaked secrets, no anonymous access to protected endpoints, webhook signature is enforced, SSRF is properly defended, prompt-injection guards are in place on every Gemini-backed surface, CSP is restrictive, and brute-force probing returns clean 401s. Findings below are minor.

## Critical findings

None.

## High findings

None.

## Medium findings

### M1. Anonymous waitlist insert with no rate limit
- File: `api/waitlist/index.ts:55-93`
- What it is: `POST /api/waitlist` accepts any email/name without auth, captcha, or per-IP rate limit. The handler validates email format and uses the anon key with RLS insert, but there is no per-IP cap.
- Proof: live request to `https://aimvantage.uk/api/waitlist` returns 200 anonymously (`{"signups":6,"analyses":16,"waitlist":2}` for stats), and the codepath in `api/waitlist/index.ts:65-93` inserts on POST with no rate-limit gate (compare with `api/roast/index.ts:340-388` which has 3/min + 30/day per IP).
- Why it matters: an attacker can flood the `waitlist` table with garbage emails (Supabase 23505 duplicate guard only stops exact-duplicates), inflate `signups`/`waitlist` counts on the public `?type=stats` endpoint, and pollute the founder's admin dashboard list view. Also generates Supabase row-inserts → contributes to free-tier limits.
- Suggested fix: add the same per-IP sliding-window limit used in `api/roast/index.ts` (3/min, ~30/day) and the same Origin/Referer allowlist check. The Cloudflare-Turnstile or hCaptcha pattern would be even better for a waitlist form.

## Low / informational

### L1. `cleanup-test-users-2026-04-28.sql` contains real test email addresses on disk
- File: `database/cleanup-test-users-2026-04-28.sql:20-24`
- What it is: lists `adlixir.uk+test1@gmail.com`, `+test2`, `+test3` in cleartext. The file is correctly listed in `.gitignore` under `database/cleanup-*.sql` and is NOT in `git ls-files`, so it is local-only. No live exposure.
- Why it matters: not a vulnerability today — flagged purely so it stays in the gitignore on every future commit. Anyone with shell access to the working copy can read the test alias addresses.
- Suggested fix: none required. Confirm the gitignore rule survives any future `.gitignore` rewrite. Optional: move historical cleanup SQL out of the repo root once it's no longer needed.

### L2. CORS header `Access-Control-Allow-Origin: *` on static asset responses
- Source: response headers on `https://aimvantage.uk/admin` and all SPA HTML responses (visible in `curl -i https://aimvantage.uk/admin`).
- What it is: Vercel emits `Access-Control-Allow-Origin: *` on every static response, including the SPA HTML shell that serves `/dashboard`, `/account`, `/admin`. This is harmless for HTML (browsers don't apply CORS to top-level navigation), but means any third-party page can `fetch()` the HTML cross-origin.
- Why it matters: low. The HTML contains no secrets — it's the same shell every visitor sees. Marked informational because someone reviewing the headers might mistake it for a CORS misconfig affecting the API. Confirm the API responses (`/api/*`) do not also wildcard CORS.
- Suggested fix: none required for static. Verify `/api/*` responses don't include `*` (spot-check on /api/user shows the wildcard is set by Vercel's static layer, not the function — fine).

## What's good

This is the load-bearing section — most of the audit confirms strong posture.

- **No secrets in shipped code or dist.** Grep across `src/`, `api/`, `dist/` for `sk_live_`, `sk_test_`, `whsec_`, `AIza...`, `eyJ...eyJ` JWT pairs, `AKIA...`, `BEGIN PRIVATE KEY` — only matches were the `SECURITY-AUDIT.md` documentation references describing what live keys look like. The dist bundle contains no inlined Gemini/Supabase service/Stripe-secret keys. The only `VITE_*` env vars referenced in src are the intended-public ones (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, etc.).
- **`.gitignore` is comprehensive.** Catches `.env*`, `*.pdf`, `*.log`, `_gitleaks*.json`, `_npm-audit*.json`, `database/cleanup-*.sql`, `.vercel`. `git ls-files | grep -iE "env|secret|credential|password|pem|key"` returns only `.env.example` (template), `ForgotPassword.tsx`, `ResetPassword.tsx`. Confirmed `giovanni-cv.pdf` is in the working tree but NOT in git.
- **All paid/admin API routes require auth.** Anonymous probes return clean 401s:
  - `GET /api/credits` → 401 `Authentication required`
  - `POST /api/analyze` → 401
  - `POST /api/stripe/checkout` → 401
  - `POST /api/stripe/portal` → 401
  - `GET /api/admin/dashboard` → 401
  - `POST /api/interview/questions` → 401
- **Admin route has server-side gating.** `api/admin/[action].ts:20-34` verifies the Supabase JWT, then checks `email_confirmed_at` AND membership in `ADMIN_EMAILS` env var. The client-side `ProtectedRoute` only checks `user !== null`, but the server is the authoritative gate. A non-admin who navigates to `/admin` gets the SPA shell, then the API call returns 403 and the UI shows "Access Denied".
- **Stripe webhook signature is enforced in production.** `api/stripe/webhook.ts:117-128` rejects unsigned events when `VERCEL` or `NODE_ENV=production` is set. Live test: `curl -X POST /api/stripe/webhook` without signature → 400 `Webhook signature verification required`. Idempotency claim via `processed_stripe_events` table at `api/stripe/webhook.ts:137-159` prevents replay/double-credit on Stripe retries.
- **Plan/price derivation is server-trusted.** `api/stripe/webhook.ts:198-208` derives the plan from the actual Stripe price ID, NOT user-supplied `session.metadata.plan` — closes the obvious upgrade-for-cheap attack.
- **SSRF defended on `/api/analyze`.** `api/analyze/index.ts:36-65` blocks `localhost`, `127.0.0.1`, RFC1918 private ranges (10/8, 172.16/12, 192.168/16), 169.254/16 (AWS metadata), link-local IPv6, internal TLDs, and decimal-encoded IPs. Redirects are validated on every hop (`fetchPage` at line 126).
- **Prompt-injection hardening on every Gemini-backed surface.** `api/roast/index.ts` has: regex pre-flight injection patterns (line 210), system-prompt-leak output detection (line 285), bracket-delimited user-data block (line 427), `maxOutputTokens: 1500` cost cap, kill switch via `ROAST_DISABLED` env. `api/analyze/index.ts:594-608` separates system prompt from user-document parts to harden against CV-embedded injections. `api/admin/[action].ts:51-94` rate-limits AI calls 30/5min per admin user.
- **Origin/Referer allowlist on free public AI endpoints.** `api/roast/index.ts:57-77`, `api/decode-rejection/index.ts:36-51`, `api/ghost-job-check/index.ts` (same pattern). Live probe with no origin → 403 `Origin not allowed`. Stops trivial scripting against the unauthenticated AI endpoints.
- **No password/email enumeration vector in login UI.** `Login.tsx` uses Supabase `signInWithPassword` directly; errors surface as a single generic "Incorrect email or password" string (component returns the same shape regardless of whether the email exists). Four rapid anonymous probes against `/api/user` returned uniform 401s with no timing or message variance.
- **Robots.txt correctly disallows sensitive paths.** Explicitly blocks `/dashboard`, `/account`, `/admin`, `/refer`, `/reset-password`, `/api/` for all named AI crawlers. `X-Robots-Tag: noindex, nofollow` header also set on `/admin` in `vercel.json:55-57`.
- **`vercel.json` rewrites block sensitive path patterns.** The catch-all SPA rewrite at `vercel.json:74-77` excludes `\.env`, `\.git/`, `\.aws/`, `\.ssh/`, `\.htaccess`, `\.htpasswd`, `wp-admin`, `phpmyadmin`, `xmlrpc.php`, `database/`, `config.`, `setup.`, `install.`, `backup/`, `vendor/`. Confirmed via live probe: `/database/schema.sql` returns 404, `/.env` returns 404. Files NOT in that exclusion list (e.g. `/HANDOFF.md`, `/AGENT-PROMPT.md`, `/SECURITY-AUDIT.md`, `/giovanni-cv.pdf`, `/package.json`) return the SPA HTML shell (21918 bytes, `Content-Type: text/html`) — the rewrite delivers the SPA, NOT the underlying file, since those files are not in `public/` or `dist/`.
- **CSP is restrictive.** `vercel.json:31` sets `default-src 'self'`, `script-src` allowlisted to Stripe + Clarity + Bing, `frame-src` limited to Stripe, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. HSTS preload, X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy correctly tight.
- **Refund-on-failure pattern is correct.** `api/analyze/index.ts:777-794` and `api/rewrite-tone/index.ts` deduct tokens BEFORE the AI call and refund inside a try/catch — no failed-call charging, no opportunity for the user to spam free analyses.
- **`getClientIp` correctly uses Vercel's verified header.** `api/decode-rejection/index.ts:60-76` reads `x-vercel-forwarded-for` (set by Vercel infra, not spoofable) before falling back to the user-controlled `x-forwarded-for`. Closes the rate-limit-bypass via XFF spoofing identified in council 2026-05-08 review.
- **Idempotent Stripe processing.** `processed_stripe_events` table claim at `webhook.ts:137-159` prevents double-credit on retries. Even if the webhook is delivered 10x, only the first delivery adds tokens.
- **No PII or secrets in `/public/*.txt` SEO files.** `humans.txt`, `llms.txt`, `llms-full.txt`, `sitemap*.xml` reviewed — they contain only intentional public marketing/SEO content (founder name + email, which is also in the contact page). `sample-cv.txt` is the fictional "Sarah Mitchell" sample explicitly designed for public consumption.
