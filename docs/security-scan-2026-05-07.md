# Security scan — 2026-05-07 loop session (commits 2d440df → HEAD)

**Scan trigger:** Gio asked "security scan as a last step" after a long
loop session of 60+ commits.

**Scope:** All changes from `2d440df` (loop start) through current HEAD.
28 files touched, 1858 insertions, 254 deletions.

---

## Results: ✅ ALL CLEAR

No new vulnerabilities introduced. No regressions in existing security posture.

---

## What was checked

### 1. Hardcoded secrets / API keys
- Pattern: `sk_live`, `pk_live`, `AIza...`, `eyJ...`, password/secret literals
- Result: **None found.** Only references are `process.env.*` lookups.

### 2. Code-execution sinks
- Pattern: `eval(`, `new Function(`, `innerHTML =`, `dangerouslySetInnerHTML`
- Result: **None new.** Existing `dangerouslySetInnerHTML` usages are all
  for `<script type="application/ld+json">` with `JSON.stringify(trustedObject)`
  — server-trusted data, no user input.

### 3. Window/clipboard primitives
- All `window.open` calls verified: every one passes `'noopener,noreferrer'`
  ✓ no tab-jacking risk.
- All `navigator.clipboard.writeText` calls write only user-initiated content:
  URLs (sample, blog, refer, fitscore share), share-message text, the user's
  own cover letter from results. No PII leak vectors. No third-party data.

### 4. New API endpoint: `api/admin/draft-reply.ts`
- Protected by `ADMIN_EMAILS` env var (same gate as existing
  `/api/admin/dashboard`).
- Defence-in-depth: requires `user.email_confirmed_at` before granting admin.
- POST-only; returns 401 on missing auth, 403 on non-admin.
- Input validation:
  - `tweetText` required, ≤2000 chars
  - `extraContext` optional, ≤1000 chars
  - `platform` validated against whitelist `['X', 'LinkedIn', 'Reddit']`
- No SQL access (read-only Gemini call).
- Gemini API key from `process.env.GEMINI_API_KEY`, not exposed to client.

### 5. CSP / headers
- `vercel.json` Content-Security-Policy: **unchanged**.
- Added cache-control entries for `/sitemap*`, `/(rss|atom|feed).(xml|json)`,
  `/robots.txt`, `/llms*.txt` — read-only response headers, no security
  impact.
- Existing security headers preserved (X-Content-Type-Options, X-Frame-Options
  DENY, Referrer-Policy, Permissions-Policy, HSTS, COOP).

### 6. Token economics / payment integrity
- Diff scanned for changes to `COST`, `deductTokens`, RLS bypasses,
  unauthorized free-tier expansion.
- Result: **No changes.** All token-cost values and deduction flows
  preserved from pre-session state.

### 7. Routing / robots changes
- Robots.txt: only changes are ADDED disallows for YouBot (matches other
  AI crawlers). Strictly tighter, not looser.
- Vercel rewrites: unchanged.

### 8. JSON-LD / structured data
- App.tsx, SEO.tsx, /pricing, /sample, /faq additions are all
  ADDITIVE — no schema removals, no fake AggregateRating / Review
  introduced (lesson from i-shipped-fake-review-schema-then-caught-myself
  blog post still respected).

### 9. PII / data leak surfaces
- Dashboard 'Share my fit score' text uses ONLY: score number, role-type
  string, company name, Vantage URL. No user name, no CV content, no email.
- Sample/Blog share text uses ONLY: post title + excerpt + URL. No PII.
- Admin draft-reply endpoint accepts public-tweet text + optional context;
  output is reply drafts that link to public Vantage URLs. No leak vector.

### 10. New UI surfaces (admin tabs)
- Reply drafter + Post templates added under `/admin` route.
- /admin route is gated by `ProtectedRoute` (Supabase auth required) AND
  the `/api/admin/*` endpoints reject non-admin users at the API layer.
- Defence-in-depth: even if the route opens for a non-admin user, the
  API call to `/api/admin/draft-reply` returns 403 — no Gemini call,
  no cost.

---

## Recommendations (none urgent)

1. **Periodic env-var audit:** confirm `ADMIN_EMAILS` is set on Vercel
   production. If empty, the admin endpoints fall closed (return 403
   for everyone — safe default but breaks Gio's admin access).

2. **Stripe webhook signing secret:** not touched in this session,
   already validated. No action.

3. **Supabase RLS:** not touched in this session. If we change token
   costs in the proposed pricing-1-token migration, the
   `deduct_tokens` Postgres RPC stays unchanged (it accepts amount as
   parameter). No RLS impact.

---

*Scan performed by Claude. Methodology: git diff scan + grep patterns
for known security antipatterns + manual review of the new admin
endpoint. Cross-referenced against OWASP Top 10 categories most
relevant to a static-frontend + serverless-API SaaS.*
