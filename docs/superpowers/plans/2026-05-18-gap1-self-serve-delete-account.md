# Gap #1: Self-Serve "Delete My Account" — Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans (no subagents in this harness). Steps use checkbox (`- [ ]`) syntax for tracking. Project does NOT use TDD — verification gates are `tsc --noEmit` clean → multi-agent reviewer agent → commit + push → `npm run smoke` 10/10.

**Goal:** Replace the email-only deletion request path with a self-serve "Delete account & all data" flow in `Account.tsx`, satisfying ICO/UK-GDPR Article 17 expectations for reasonable self-serve erasure.

**Architecture:** Add `endpoint=delete-account` case to the existing `api/user/index.ts` multiplexer (12-function cap forbids new files). Handler: log audit event → revoke Supabase Auth user via service-role → return success. Profile row is auto-deleted via `ON DELETE CASCADE` on `auth.users` FK. Frontend adds a sub-section inside the existing "Danger Zone" with typed-`DELETE` confirmation gate. Stripe customer is deliberately preserved (financial records retention).

**Tech Stack:** TypeScript, Vercel serverless functions, Supabase Auth service-role admin API, inline Resend helper (already in the function), React 19 client.

---

## Files Touched (full inventory before any code change)

| File | Action | Purpose |
|---|---|---|
| `api/user/index.ts` | MODIFY (~80 LOC added) | Add `handleDeleteAccount(request, response, user)` + dispatcher case + inline Resend confirmation email helper (same pattern as api/analyze/index.ts inline helpers — NO cross-tree imports) |
| `src/services/api.ts` | MODIFY (~15 LOC added) | Add `deleteAccount(): Promise<{success: boolean; error?: string}>` wrapper. Uses existing `fetchWithAuth` |
| `src/components/Account.tsx` | MODIFY (~60 LOC added) | New sub-section inside existing Danger Zone — typed-`DELETE` input + irreversible confirm button + busy spinner + error display |
| `vercel.json` | MODIFY (1 LOC added) | New rewrite `/api/delete-account` → `/api/user?endpoint=delete-account` for clean URL parity with credits/analyses |
| `scripts/smoke-test-deploy.mjs` | MODIFY (add 1 check entry) | Add `/api/delete-account` GET → 405 (function alive, rejects GET correctly) |
| `BACKLOG.md` | MODIFY | Mark Gap #1 done with commit ref |

**File NOT touched:**
- `database/schema.sql` — `ON DELETE CASCADE` from profiles.id → auth.users(id) already exists (line 9). Nothing to add.
- `audit_log` — already exists with `actor_id` FK that goes to NULL on user delete (preserves the record). Nothing to add.

**Critical: NO new files. NO cross-tree imports.** Everything inlined per the Strategy B canonical pattern.

---

## Verification gates (run between every phase)

1. `npx tsc --noEmit` MUST exit 0
2. Multi-agent reviewer agent (general-purpose subagent) MUST clear the diff
3. `git commit + git push origin master`
4. Wait for Vercel deploy (~7 min)
5. `npm run smoke` MUST be 10/10 (will become 11/10 after Phase 5 extends the suite)

If any gate fails: STOP. Don't proceed to next phase. Diagnose first.

---

## Rollback paths per phase

| Phase | Rollback |
|---|---|
| 1 (backend handler) | `git revert <sha>` — only the new endpoint code, no schema changes, fully reversible |
| 2 (client wrapper) | `git revert <sha>` — only adds a function, doesn't replace anything |
| 3 (Account.tsx UI) | `git revert <sha>` — only adds a section, doesn't modify existing sections |
| 4 (vercel.json rewrite) | `git revert <sha>` — rewrite only, the endpoint still works at `/api/user?endpoint=delete-account` |
| 5 (smoke test) | `git revert <sha>` — only adds a check entry, doesn't change behavior |

**Catastrophic rollback (Phase 1 ate someone's account):** the deleted Supabase Auth user CANNOT be undone — but `analyses` rows persist (FK is profile_id which CASCADES on profile delete; profile delete CASCADES on auth user delete; chain is one-way). Mitigation: typed-confirmation gate + 2-step Account.tsx pattern (collapse → expand → type → confirm).

---

## Phase 1 — Backend handler in api/user/index.ts

**Files:**
- Modify: `api/user/index.ts` (current line count: ~262; add ~80 LOC inside the file)

**Goal:** Add `handleDeleteAccount` function + a dispatcher case. Handler must (in order): authenticate → fetch profile.email for the audit log → write final `account.deleted` audit_log row → delete the Supabase Auth user via service-role admin API → fire fire-and-forget confirmation email → return 200 JSON.

- [x] **Step 1: Read api/user/index.ts to understand the existing inline helper pattern**

Already exists: an inline `authenticate()` helper at line 15. Dispatcher pattern at line ~239 (`if (endpoint === 'credits')`).

Need to add: inline Resend `sendEmail` + `wrapEmailBody` (copy from `api/stripe/webhook.ts`'s INLINED HELPERS block) AND inline `logAuditEvent` (same source).

Run: `sed -n '1,50p' api/user/index.ts` and `grep -n "endpoint ===" api/user/index.ts` to confirm. Note current file length: it's well under 300 LOC, adding 80 brings it to ~340 — fine.

- [x] **Step 2: Add inline INLINED HELPERS block (Resend + Audit + Sentry init — same pattern as webhook.ts)**

Insert at top of `api/user/index.ts`, after the existing imports + SUPABASE_URL/KEY constants. Block size: ~150 LOC.

Source: copy verbatim from `api/stripe/webhook.ts` (the established Strategy B canonical pattern). Specifically:
- `import * as Sentry from '@sentry/node'`
- `import type { ErrorEvent, EventHint } from '@sentry/node'`
- `import { Resend } from 'resend'`
- The `_sentryInit`/`_SENTRY_*`/`_sentrySeen` block (≈40 LOC)
- `initSentry()` + `_sentryFingerprint` + `_sentryShouldSend` + `captureError` (≈40 LOC)
- Resend `_RESEND_FROM` / `_RESEND_REPLY_TO` / `_getResend` / `SendEmailArgs` / `sendEmail` / `wrapEmailBody` (≈60 LOC)
- `AuditEvent` interface + `logAuditEvent` (≈40 LOC)

Use the EXACT same INLINED HELPERS comment fence so future grep + 1:1 derivation tracking works.

- [x] **Step 3: Implement handleDeleteAccount**

Add this function (paste verbatim — typed correctly for the inline helpers above):

```typescript
async function handleDeleteAccount(request: any, response: any, user: any): Promise<void> {
  // POST-only — deletion is destructive, must not be a GET that gets pre-fetched
  // by browser link-prefetchers or accidentally triggered by an XSS link tag.
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Body must contain { confirmation: 'DELETE' } verbatim. Belt to the
  // suspenders of the typed-confirmation UI gate — an XSS that triggers
  // this endpoint without the body still gets rejected here.
  const body = request.body || {};
  if (body.confirmation !== 'DELETE') {
    return response.status(400).json({ error: 'Missing or invalid confirmation token' });
  }

  const userId: string = user.id;
  const userEmail: string | null = user.email || null;

  // Fetch profile for the audit metadata + a "what we're about to delete"
  // count so the confirmation email is honest about what's gone.
  let profileSnapshot: { plan: string | null; token_balance: number | null; created_at: string | null } | null = null;
  let analysesCount = 0;
  try {
    const profRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=plan,token_balance,created_at`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    if (profRes.ok) {
      const arr = await profRes.json();
      if (arr.length) profileSnapshot = arr[0];
    }
    // Count analyses for the audit. Use Prefer: count=exact + HEAD-like select.
    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analyses?user_id=eq.${userId}&select=id`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'count=exact',
        },
      }
    );
    if (countRes.ok) {
      const contentRange = countRes.headers.get('content-range') || '';
      const m = contentRange.match(/\/(\d+)$/);
      if (m) analysesCount = parseInt(m[1], 10);
    }
  } catch (err: any) {
    // Snapshot failure is non-fatal — proceed with delete. Audit gets less detail.
    console.warn('delete-account: profile snapshot failed:', err?.message || '');
  }

  // CRITICAL: audit BEFORE delete. After Supabase Auth user delete, the
  // FK auth.users(id) is gone → audit_log.actor_id goes NULL via the
  // existing ON DELETE SET NULL constraint, but actor_email + ip_address
  // are preserved as plain text. This is the dispute-evidence row.
  await logAuditEvent({
    event_type: 'account.deleted',
    actor_id: userId,
    actor_email: userEmail,
    ip_address: (request.headers?.['x-vercel-forwarded-for'] as string) || null,
    user_agent: (request.headers?.['user-agent'] as string) || null,
    resource_type: 'user',
    resource_id: userId,
    detail: `Self-serve deletion (${analysesCount} analyses, plan=${profileSnapshot?.plan || '?'})`,
    metadata: {
      plan: profileSnapshot?.plan,
      token_balance_at_delete: profileSnapshot?.token_balance,
      analyses_count: analysesCount,
      account_age_days: profileSnapshot?.created_at
        ? Math.floor((Date.now() - new Date(profileSnapshot.created_at).getTime()) / 86_400_000)
        : null,
    },
  });

  // Delete the Supabase Auth user via service-role admin API. This cascades:
  //   auth.users delete → profiles ON DELETE CASCADE → analyses ON DELETE CASCADE
  //   → api_usage ON DELETE CASCADE → seen_job_searches ON DELETE CASCADE
  // audit_log.actor_id FK is SET NULL (preserves audit history).
  // Stripe customer is NOT touched — billing history retention.
  const deleteRes = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!deleteRes.ok) {
    const errText = await deleteRes.text().catch(() => '');
    captureError(new Error(`Supabase admin delete failed: ${deleteRes.status} ${errText.slice(0, 200)}`), {
      route: '/api/delete-account',
      user_id: userId,
    });
    return response.status(500).json({
      error: 'Account deletion failed on the server. We have logged the failure — please contact support@aimvantage.uk if it persists.',
    });
  }

  // Fire-and-forget confirmation email. Webhook-style: never block the
  // success response on email send. User's Supabase session is now revoked
  // so the client will sign out on its next refresh attempt anyway.
  if (userEmail) {
    const body_html = `
      <p>Your AimVantage account has been deleted.</p>
      <p>We removed:</p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Your profile (name, email, avatar)</li>
        <li>All ${analysesCount} saved analysis result${analysesCount === 1 ? '' : 's'}</li>
        <li>Your CV profile (the distilled summary used by AI Job Search)</li>
        <li>Your token balance (${profileSnapshot?.token_balance || 0} unused token${profileSnapshot?.token_balance === 1 ? '' : 's'})</li>
        <li>Your AI Job Search history (saved jobs, seen-jobs dedup data)</li>
      </ul>
      <p style="margin-top: 16px;"><strong>Billing records preserved.</strong> Your Stripe customer record (past invoices + transaction history) is kept for UK tax / financial-records retention requirements. To request Stripe-side erasure separately, reply to this email.</p>
      <p style="margin-top: 16px; font-size: 13px; color: #8a85a3;">If you didn't request this deletion, contact <a href="mailto:giovanni.sizino.ennes@hotmail.co.uk" style="color: #a78bfa;">giovanni.sizino.ennes@hotmail.co.uk</a> immediately. Note: the deletion cannot be reversed, but we can investigate unauthorised access.</p>
    `;
    void sendEmail({
      to: userEmail,
      subject: 'Your AimVantage account has been deleted',
      html: wrapEmailBody('Account deleted', body_html),
      tag: 'account_deleted',
    }).then((result) => {
      if (!result.ok) console.warn(`account-deleted email failed: ${result.error}`);
    });
  }

  return response.status(200).json({
    success: true,
    deleted: {
      analyses: analysesCount,
      token_balance: profileSnapshot?.token_balance || 0,
    },
  });
}
```

- [x] **Step 4: Add dispatcher case + call initSentry at top of handler**

In the existing default handler at the bottom of `api/user/index.ts`, add `initSentry()` as the FIRST line (after the existing variable reads), and add the dispatcher case:

```typescript
if (endpoint === 'delete-account') {
  return handleDeleteAccount(request, response, user);
}
```

The case goes AFTER the existing `if (endpoint === 'cv-upload')` block, BEFORE the final `return response.status(404)`.

- [x] **Step 5: Verify tsc clean**

Run: `npx tsc --noEmit`
Expected: zero output, exit 0.

If it fails: read the error. Most likely Sentry types if the inline block was pasted wrong. Compare against `api/stripe/webhook.ts` line-by-line.

- [x] **Step 6: Spawn multi-agent reviewer (general-purpose subagent)**

Prompt the reviewer with this verbatim:

> Review the new `handleDeleteAccount` function in `C:\Cloaude Logic\vantage\api\user\index.ts`. This is a destructive endpoint on a live paid SaaS. Specifically verify:
>
> 1. POST-only gate — confirm GET cannot trigger deletion.
> 2. `confirmation: 'DELETE'` body check — confirm it's strict-equal (not substring, not case-insensitive).
> 3. Audit log fires BEFORE the deletion — confirm ordering. After deletion, FK is null so audit_id wouldn't be populated.
> 4. Supabase Auth admin DELETE call uses the service-role key (not the user's bearer token — admin scope required).
> 5. ON DELETE CASCADE chain is complete: auth.users → profiles → analyses + api_usage + seen_job_searches. Verify schema.sql.
> 6. audit_log preservation: confirm `actor_id` FK is `ON DELETE SET NULL` so the audit record survives.
> 7. Email send is fire-and-forget (no await, no throw). Webhook-style.
> 8. Stripe customer is NOT deleted (intentional — financial-records retention).
> 9. No PII leakage in error responses.
> 10. captureError fires on Supabase delete failure with route + user_id context but NOT body content.
>
> Push blockers? Anything you'd reject?

- [x] **Step 7: Address any reviewer feedback. Re-run tsc if changed.**

- [x] **Step 8: Commit + push**

```bash
git add api/user/index.ts
git commit -m "feat(gdpr): self-serve account deletion endpoint (handler only)

Phase 1 of Gap #1. Backend handler that:
- POST-only with strict confirmation: 'DELETE' body check
- Logs audit event BEFORE delete (audit_log.actor_id is ON DELETE SET
  NULL so the record survives the user delete)
- Calls Supabase Auth admin API to delete the user
- ON DELETE CASCADE chain handles profiles + analyses + api_usage +
  seen_job_searches
- Fires fire-and-forget confirmation email
- Returns counts of what was removed
- Stripe customer NOT deleted (financial-records retention; user can
  request separately via email — disclosed in confirmation copy)

Inline helpers (Sentry + Resend + Audit) per Strategy B canonical
pattern, no cross-tree imports.

Frontend UI + client wrapper land in next commits."
git push origin master
```

- [ ] **Step 9: Wait for Vercel deploy (~7 min)**

Use `npm run smoke` to confirm the deploy is healthy (should still be 10/10 — the new endpoint isn't smoke-tested yet, comes in Phase 5).

---

## Phase 2 — Client wrapper in services/api.ts

**Files:**
- Modify: `src/services/api.ts` (add ~15 LOC)

**Goal:** Add typed `deleteAccount()` wrapper so the React component doesn't see raw fetch logic.

- [x] **Step 1: Add the wrapper function**

At the end of `src/services/api.ts` (after the existing `fetchAnalysisHistory` function around line 528):

```typescript
/**
 * Permanently delete the authenticated user's account and ALL associated data
 * (profile, analyses, CV summary, token balance, AI Job Search history).
 * Stripe customer record is preserved for financial-records retention.
 *
 * The user MUST type "DELETE" in the confirmation gate before this is called
 * (enforced both client-side via Account.tsx UI and server-side via
 * api/user::handleDeleteAccount body validation).
 *
 * After success, the caller should sign the user out (Supabase session is
 * already revoked server-side by the auth admin delete) and redirect to
 * landing.
 */
export async function deleteAccount(): Promise<{ success: boolean; deleted?: { analyses: number; token_balance: number }; error?: string }> {
  const response = await fetchWithAuth('/user?endpoint=delete-account', {
    method: 'POST',
    body: JSON.stringify({ confirmation: 'DELETE' }),
  });
  const data = await safeJson(response);
  if (!response.ok) {
    return { success: false, error: data.error || 'Account deletion failed. Please try again or contact support.' };
  }
  return { success: true, deleted: data.deleted };
}
```

- [x] **Step 2: Verify tsc clean**

Run: `npx tsc --noEmit`
Expected: zero output.

- [x] **Step 3: Commit + push**

```bash
git add src/services/api.ts
git commit -m "feat(gdpr): client wrapper for delete-account endpoint

Phase 2 of Gap #1. Typed deleteAccount() in services/api.ts.
Uses existing fetchWithAuth + safeJson plumbing. Returns
{success, deleted?, error?} contract.

UI section in Account.tsx lands next."
git push origin master
```

---

## Phase 3 — Account.tsx Danger Zone deletion UI

**Files:**
- Modify: `src/components/Account.tsx` (add ~60 LOC inside existing Danger Zone section)

**Goal:** Below the existing Sign Out button in the Danger Zone, add a collapsed-by-default deletion sub-section. Click "Delete account" → expands to typed-DELETE input + confirm button. Confirm calls `deleteAccount()` → success → sign out + redirect.

- [x] **Step 1: Add the deletion state at top of the Account component**

Find the existing useState declarations in `Account.tsx` (around line 26-50). Add these after the existing ones:

```typescript
// Account deletion (GDPR right-to-erasure, gap #1 self-serve flow)
const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteConfirmText, setDeleteConfirmText] = useState('');
const [deleteSubmitting, setDeleteSubmitting] = useState(false);
const [deleteError, setDeleteError] = useState<string | null>(null);
```

Also add this import at the top alongside the existing service imports:

```typescript
import { createBillingPortal, syncSubscription, deleteAccount } from '../services/api';
```

(modifying the existing import line — just add `, deleteAccount` to the existing list)

- [x] **Step 2: Add the deletion handler**

After the existing `handleSignOut` function, add:

```typescript
const handleDeleteAccount = async () => {
  if (deleteConfirmText !== 'DELETE') {
    setDeleteError('Type DELETE exactly (uppercase) to confirm.');
    return;
  }
  setDeleteSubmitting(true);
  setDeleteError(null);
  const result = await deleteAccount();
  if (!result.success) {
    setDeleteError(result.error || 'Account deletion failed. Please try again or email giovanni.sizino.ennes@hotmail.co.uk.');
    setDeleteSubmitting(false);
    return;
  }
  // Success — Supabase session was revoked server-side. Sign out client-
  // side too (clears localStorage / auth context) + redirect. NavigateOptions
  // replace: true so the back button doesn't return to /account.
  await signOut();
  navigate('/?deleted=1', { replace: true });
};
```

- [x] **Step 3: Add the UI block at the bottom of the existing Danger Zone section**

Find the existing Danger Zone in `Account.tsx` (line ~507):

```typescript
{/* Danger Zone */}
<section className="p-6 rounded-2xl bg-red-500/5 border border-red-500/15 mb-5">
  ...existing sign-out content...
</section>
```

INSIDE that section, AFTER the existing Sign Out button, BEFORE the section's closing `</section>`, add:

```typescript
<div className="mt-6 pt-6 border-t border-red-500/20">
  <h3 className="text-sm font-bold text-red-300 mb-2">Delete your account permanently</h3>
  <p className="text-white/60 text-xs leading-relaxed mb-3">
    Removes your profile, all saved analyses, your CV profile, token balance, and AI Job Search history.
    Your past payment records on Stripe are preserved for tax/financial-records retention — request separate
    Stripe-side erasure by emailing giovanni.sizino.ennes@hotmail.co.uk if you also need that.
    <strong className="text-red-300"> This action cannot be reversed.</strong>
  </p>

  {!deleteOpen ? (
    <button
      onClick={() => setDeleteOpen(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold hover:bg-red-500/20 transition-colors min-h-[44px]"
    >
      <AlertTriangle className="w-4 h-4" aria-hidden="true" />
      Delete account
    </button>
  ) : (
    <div className="space-y-3">
      <p className="text-red-200 text-xs font-medium">
        Type <strong className="font-mono text-red-100">DELETE</strong> below to confirm.
      </p>
      <input
        type="text"
        value={deleteConfirmText}
        onChange={(e) => setDeleteConfirmText(e.target.value)}
        placeholder="Type DELETE"
        autoComplete="off"
        spellCheck={false}
        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-red-500/30 text-white placeholder-white/30 outline-none focus:border-red-500/60 text-sm font-mono"
        disabled={deleteSubmitting}
      />
      {deleteError && (
        <div className="text-red-300 text-xs flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          {deleteError}
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleDeleteAccount}
          disabled={deleteSubmitting || deleteConfirmText !== 'DELETE'}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
        >
          {deleteSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Deleting…
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              Permanently delete my account
            </>
          )}
        </button>
        <button
          onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteError(null); }}
          disabled={deleteSubmitting}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors min-h-[44px] disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>
```

- [x] **Step 4: Verify all imports are present**

Make sure `AlertTriangle` and `Loader2` are already imported at the top of `Account.tsx`. They almost certainly are (existing UI uses both). If not, add to the existing `from 'lucide-react'` import line.

- [x] **Step 5: Verify tsc clean**

Run: `npx tsc --noEmit`
Expected: zero output.

- [x] **Step 6: Multi-agent reviewer for the UI**

Prompt:

> Review the new "Delete account" sub-section added inside the Danger Zone of `C:\Cloaude Logic\vantage\src\components\Account.tsx`. Verify:
>
> 1. The button is collapsed-by-default (deleteOpen=false initially) so accidental click is impossible — user must explicitly expand.
> 2. The confirm button is disabled until `deleteConfirmText === 'DELETE'` (strict equality, case-sensitive).
> 3. The Cancel button always escapes the dangerous state cleanly (resets text + error + closes).
> 4. The submitting state disables all interactive controls so double-click can't fire two deletes.
> 5. Error state shows server-side error message + a fallback support-email path.
> 6. Success path: `signOut()` then `navigate('/?deleted=1', { replace: true })` — back button can't return to account.
> 7. No existing Account.tsx logic is touched (password change, billing portal, sign out, etc.).
> 8. autoComplete="off" + spellCheck=false on the DELETE input so browser auto-suggest doesn't pollute the confirmation gate.
>
> Push blockers?

- [x] **Step 7: Address feedback, re-tsc**

- [x] **Step 8: Commit + push**

```bash
git add src/components/Account.tsx
git commit -m "feat(gdpr): typed-DELETE confirmation UI for self-serve account deletion

Phase 3 of Gap #1. Inside the existing Danger Zone in Account.tsx:
- Collapsed-by-default 'Delete account' button (no accidental click)
- Click to expand → typed-DELETE input + Cancel + Confirm
- Confirm button disabled until text === 'DELETE' (strict, case-sensitive)
- Submit disables all controls (no double-click)
- Success → signOut() → navigate('/?deleted=1', {replace:true})
- Error displays server message + support-email fallback

Zero changes to existing Account.tsx surfaces (password change,
billing portal, sign-out unchanged)."
git push origin master
```

---

## Phase 4 — vercel.json rewrite for clean URL

**Files:**
- Modify: `vercel.json` (add 1 LOC inside the existing `rewrites` array)

**Goal:** `/api/delete-account` should work as a clean URL, mirroring how `/api/credits` and `/api/analyses` rewrite to the user multiplexer.

- [ ] **Step 1: Add the rewrite**

Find the existing rewrites array (line ~68-75) and add this entry as the THIRD line:

```json
{ "source": "/api/delete-account", "destination": "/api/user?endpoint=delete-account" },
```

So the array reads:

```json
"rewrites": [
  { "source": "/api/credits", "destination": "/api/user?endpoint=credits" },
  { "source": "/api/analyses", "destination": "/api/user?endpoint=analyses" },
  { "source": "/api/delete-account", "destination": "/api/user?endpoint=delete-account" },
  {
    "source": "/((?!api/|assets/| ...
```

- [ ] **Step 2: Optionally update services/api.ts to use the clean URL**

In `src/services/api.ts::deleteAccount`, change `'/user?endpoint=delete-account'` to `'/delete-account'`. (Vercel rewrite handles the mapping.) This is cosmetic — both work. Skip if you want the explicit form.

- [ ] **Step 3: Commit + push**

```bash
git add vercel.json src/services/api.ts
git commit -m "feat(gdpr): /api/delete-account rewrite for clean URL parity

Phase 4 of Gap #1. Mirrors the /api/credits + /api/analyses rewrite
pattern. Endpoint now reachable at both /api/delete-account (clean)
and /api/user?endpoint=delete-account (raw)."
git push origin master
```

---

## Phase 5 — Smoke test extension

**Files:**
- Modify: `scripts/smoke-test-deploy.mjs` (add 1 entry to the `checks` array)

**Goal:** The smoke test must catch any future regression that breaks the delete-account endpoint at the function-loads-or-not level.

- [ ] **Step 1: Add the new check**

Find the `checks` array in `scripts/smoke-test-deploy.mjs`. Add this entry after the `/api/stripe/checkout` entry:

```javascript
{
  path: '/api/delete-account',
  method: 'GET',
  expectStatus: [401, 405],
  expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
  note: 'GDPR self-serve deletion endpoint — must return JSON 405 on GET, not crash with ERR_MODULE_NOT_FOUND',
},
```

Update the docstring count: change "10 critical endpoints" → "11 critical endpoints" at the top.

- [ ] **Step 2: Run the smoke test locally against production**

```bash
node scripts/smoke-test-deploy.mjs
```

Expected: 11/11 PASS (including the new one — Phase 1 deploy has already promoted by now).

If 10/11 with the new one failing: Phase 1's deploy may have failed silently. Check Vercel logs.

- [ ] **Step 3: Commit + push**

```bash
git add scripts/smoke-test-deploy.mjs
git commit -m "test(smoke): cover /api/delete-account in the smoke suite

Phase 5 of Gap #1. The smoke test catches the entire bug class that
broke the tool for 2 days on 2026-05-15 (Vercel-Ready-but-crashing).
Adds the new endpoint to the rotation. 11/11 baseline now."
git push origin master
```

---

## Phase 6 — End-to-end verification in production

**Files:** none modified

**Goal:** Confirm the entire round-trip works against the deployed production. This is the only step that requires the live environment.

- [ ] **Step 1: Wait for Phase 5 deploy to promote (~7 min)**

Re-run `node scripts/smoke-test-deploy.mjs` — should be 11/11.

- [ ] **Step 2: Manual E2E with a DISPOSABLE test account**

DO NOT TEST WITH THE OPERATOR'S OWN ACCOUNT. Create a throwaway account first:
- Sign up with a temporary email (mailinator / tempmail / + alias)
- Confirm via email
- Optionally run one /api/analyze to populate analyses + cv_summary
- Note the user.id from Supabase Auth

- [ ] **Step 3: Run the deletion**

- Navigate to /account
- Scroll to Danger Zone
- Click "Delete account" (button should expand the form)
- Try clicking confirm with empty text → button stays disabled (correct)
- Type "delete" (lowercase) → button stays disabled (correct)
- Type "DELETE" → button enables
- Click "Permanently delete my account"
- Watch: spinner → success → signed out → redirected to /?deleted=1

- [ ] **Step 4: Verify the cascade in Supabase**

Open Supabase dashboard → Table Editor → check:
- `auth.users`: the test user is gone
- `profiles`: the profile row is gone
- `analyses`: any rows for that user are gone
- `api_usage`: any rows for that user are gone
- `seen_job_searches`: any rows for that user are gone
- `audit_log`: a row with `event_type='account.deleted'` exists, `actor_id` is now NULL, `actor_email` is preserved, `metadata` has the count + plan snapshot

- [ ] **Step 5: Verify the confirmation email arrived**

Check the test email inbox (or Supabase Auth Logs if you used a real-but-temp one). Should have:
- Subject: "Your AimVantage account has been deleted"
- From: noreply@aimvantage.uk
- Tag: account_deleted

- [ ] **Step 6: Verify Stripe customer is preserved**

If the test account had any Stripe activity:
- Open Stripe Dashboard → Customers → search for the email
- Customer record should still exist
- All historical invoices / charges preserved

- [ ] **Step 7: Update BACKLOG.md**

In `BACKLOG.md`, find the entry that gates Gap #1 (currently might be in the "code-side deferred" section or already noted as the GDPR audit work). Mark it:

```markdown
- ✅ **Gap #1 (GDPR self-serve account deletion)** — shipped 2026-05-18, commits <list of phase SHAs>. Account → Danger Zone → "Delete account" → typed-DELETE confirmation. Server cascades through profiles + analyses + api_usage + seen_job_searches. Audit row preserved with actor_id=NULL. Stripe customer kept for financial-records retention.
```

- [ ] **Step 8: Final commit + push**

```bash
git add BACKLOG.md
git commit -m "docs: BACKLOG mark Gap #1 (GDPR self-serve delete) done

End-to-end verified in production with a disposable test account.
Cascade confirmed in Supabase, confirmation email delivered, Stripe
customer preserved as designed."
git push origin master
```

---

## Definition of done

- ✅ All 6 phases shipped
- ✅ `npm run smoke` = 11/11 against production
- ✅ E2E manual test passed (account created → deleted → cascade verified → email arrived)
- ✅ BACKLOG.md updated
- ✅ Audit log row exists for the test deletion
- ✅ Stripe customer record preserved
