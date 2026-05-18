# Gap #3: Privacy Policy — Explicit cv_summary Disclosure

> **For agentic workers:** Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. This is a doc-only change — no tsc preflight needed but still requires multi-agent reviewer + commit + push. Smoke test must remain 10/10 (will be unchanged — no API surface touched).

**Goal:** Add explicit `cv_summary` disclosure to the Privacy Policy so the new "Your CV profile is saved" violet hint on the dashboard is legally backed by an itemised mention in the policy.

**Architecture:** Pure additive content changes to `src/components/PrivacyPolicy.tsx`. Two paragraphs added: one in Section 4 (Data We Collect) listing `cv_summary` as a stored item; one in Section 7 (Data Retention) explaining its lifecycle + how to delete via Gap #1's self-serve flow.

**Tech Stack:** React content component — no runtime logic, pure JSX/string changes.

---

## Files Touched

| File | Action | Purpose |
|---|---|---|
| `src/components/PrivacyPolicy.tsx` | MODIFY (~40 LOC added across 2 sections) | Add the two paragraphs |

**File NOT touched:** anything else. Doc-only. No imports, no state, no handlers, no schema.

---

## Verification gates

1. `npx tsc --noEmit` MUST exit 0 (sanity — JSX could break compile if I fat-finger)
2. Multi-agent reviewer: confirm wording is legally accurate + doesn't contradict existing copy
3. `git commit + git push origin master`
4. Wait for Vercel deploy (~7 min)
5. Manually load `https://aimvantage.uk/privacy` and verify both paragraphs render correctly

---

## Rollback

`git revert <sha>` — single file, additive content, fully reversible. Worst case the new violet hint references "Privacy Policy Section 7" that doesn't say exactly what we want — but the hint copy can be tweaked independently.

---

## Phase 1 — Section 4 addition (Data We Collect)

**Files:**
- Modify: `src/components/PrivacyPolicy.tsx` — Section with `id: 'data-we-collect'` (line ~19)

**Goal:** Inside the existing `items` array for Section 4, add a new `{ title, text }` object specifically about `cv_summary`. Should sit between the existing "CV / Resume Content" item and the next item.

- [ ] **Step 1: Read the current Section 4 structure**

Run: `sed -n '19,50p' src/components/PrivacyPolicy.tsx`

Confirm: Section 4 has `id: 'data-we-collect'`, contains an `items` array. The "CV / Resume Content" item is at line ~27-29.

- [ ] **Step 2: Add the new item after "CV / Resume Content"**

Find the existing item:

```typescript
{
  title: 'CV / Resume Content',
  text: 'The text content of CVs and resumes you upload. This content is processed by AI to generate analyses and is not permanently stored in its raw form after processing. Structured results are stored for your continued access.',
},
```

INSERT a new item RIGHT AFTER it (and BEFORE the next item):

```typescript
{
  title: 'CV Profile Summary',
  text: 'A short, AI-distilled summary of your CV (no more than 2,000 characters) extracted during your first analysis and stored on your profile. This summary powers our AI Job Search feature — when you run a job-board scan, the AI scores each role against this summary so we do not have to re-process your full CV on every search. The raw CV text itself is NOT retained (see "CV / Resume Content" above); only this short summary is. You can delete the summary at any time by deleting your account in your Account → Danger Zone settings, or by emailing giovanni.sizino.ennes@hotmail.co.uk.',
},
```

- [ ] **Step 3: Verify tsc clean**

Run: `npx tsc --noEmit`
Expected: zero output. (Sanity — should never break, but trailing-comma errors are possible.)

- [ ] **Step 4: Commit (no push yet — bundle with Phase 2)**

```bash
git add src/components/PrivacyPolicy.tsx
git commit -m "docs(privacy): disclose cv_summary in Section 4 (Data We Collect)

Phase 1 of Gap #3. Explicit itemisation of the AI-distilled CV
summary we keep on user profiles for AI Job Search scoring.
Wording emphasises:
  - It's a DISTILLED summary, ≤2,000 chars (not the raw CV)
  - Stored on the profile, not in analyses
  - Powers AI Job Search re-scoring
  - User can delete via the new Account → Danger Zone flow
    (Gap #1) or by email request

Resolves the previously-implicit storage by tying the new violet
dashboard hint to an explicit privacy disclosure."
```

---

## Phase 2 — Section 7 addition (Data Retention)

**Files:**
- Modify: `src/components/PrivacyPolicy.tsx` — Section with `id: 'data-retention'` (line ~102)

**Goal:** Add a new item explaining the cv_summary retention lifecycle.

- [ ] **Step 1: Read the current Section 7 structure**

Run: `sed -n '102,125p' src/components/PrivacyPolicy.tsx`

Confirm: Section 7 has `id: 'data-retention'`, contains an `items` array. Existing items cover account info, analysis outputs, waitlist, transaction records.

- [ ] **Step 2: Add the new item**

Insert this as the SECOND item in the array (right after the first "Account Information" item that says "retained for as long as your account is active"):

```typescript
{
  title: 'CV Profile Summary',
  text: 'Your AI-distilled CV summary (≤2,000 characters, stored on your profile — see Section 4) is retained for as long as your account is active. It is deleted automatically and immediately when you delete your account via Account → Danger Zone → "Delete account" (self-serve, takes effect within seconds and cannot be undone) or when you email us a deletion request at giovanni.sizino.ennes@hotmail.co.uk. There is no separate retention window — the summary lives with your account and dies with it.',
},
```

- [ ] **Step 3: Verify tsc clean**

Run: `npx tsc --noEmit`
Expected: zero output.

- [ ] **Step 4: Spawn multi-agent reviewer (low-stakes — doc only)**

Prompt:

> Review two new paragraphs added to `C:\Cloaude Logic\vantage\src\components\PrivacyPolicy.tsx`:
>
> 1. Section 4 (Data We Collect) — new "CV Profile Summary" item explaining the ≤2,000-char distilled CV blob stored on profiles.
> 2. Section 7 (Data Retention) — corresponding lifecycle paragraph.
>
> Verify:
> - Accuracy: matches what code actually does (cv_summary is built in `api/analyze/index.ts::buildCvSummary`, stored on `profiles.cv_summary`, used by AI Job Search via `api/interview/[action].ts::jobsearch`, hard-capped at 2,000 chars).
> - Consistency: doesn't contradict the existing "we do not permanently store the raw CV text" wording in Section 4 — the summary is a DERIVED smaller blob, not the raw CV.
> - Honesty: deletion claim ("immediately when you delete your account") is true — schema.sql ON DELETE CASCADE from auth.users → profiles wipes cv_summary along with the row.
> - Tone: matches the rest of the policy (formal but plain UK English, no marketing softening, no false reassurance).
> - Cross-references: Section 4 mentions Gap #1's self-serve flow, Section 7 mentions it too — both URLs / paths should be consistent.
>
> Anything legally or factually off? Anything missing?

- [ ] **Step 5: Address feedback if any**

If reviewer says wording is fine — proceed. If they flag anything material, fix and re-tsc.

- [ ] **Step 6: Commit + push**

```bash
git add src/components/PrivacyPolicy.tsx
git commit -m "docs(privacy): retention lifecycle for cv_summary in Section 7

Phase 2 of Gap #3. Pairs with the Section 4 disclosure (previous
commit). Makes explicit:
  - Lives with the account, no separate retention window
  - Deleted immediately via self-serve Account → Danger Zone
  - OR via email request
  - Schema ON DELETE CASCADE from auth.users → profiles wipes it

Closes the GDPR Article 13/14 disclosure gap for cv_summary."
git push origin master
```

---

## Phase 3 — Production verification

**Files:** none

**Goal:** Confirm the Privacy Policy page renders the new content correctly.

- [ ] **Step 1: Wait for Vercel deploy (~7 min)**

Run `npm run smoke` — should still be 10/10 (no API surface touched).

- [ ] **Step 2: Manual page-load verification**

Open `https://aimvantage.uk/privacy` in a browser. Scroll to:
- Section 4 (Data We Collect) — confirm "CV Profile Summary" item appears between "CV / Resume Content" and the next item.
- Section 7 (Data Retention) — confirm "CV Profile Summary" item appears after "Account Information".

Both should render with the same visual style as siblings (no broken layout).

- [ ] **Step 3: Verify the violet hint references hold**

The dashboard violet hint says "AI Job Search will score against it." Confirm the new Section 4 paragraph backs that claim. The hint also says "upload your CV file again in Step 1 below" — that's UX direction, not a privacy claim, so doesn't need policy backing.

- [ ] **Step 4: Update BACKLOG.md**

Mark Gap #3 resolved:

```markdown
- ✅ **Gap #3 (Privacy Policy cv_summary disclosure)** — shipped 2026-05-18. Section 4 lists cv_summary as a stored item with what/why/how-long. Section 7 explains the retention lifecycle. Pairs cleanly with Gap #1's new self-serve deletion flow.
```

- [ ] **Step 5: Commit + push BACKLOG**

```bash
git add BACKLOG.md
git commit -m "docs: BACKLOG mark Gap #3 (privacy policy disclosure) done

Pairs with Gap #1. The dashboard violet hint about saved CV summary
now has explicit policy backing in Sections 4 + 7."
git push origin master
```

---

## Definition of done

- ✅ Both phases shipped
- ✅ `https://aimvantage.uk/privacy` renders the two new paragraphs correctly
- ✅ `npm run smoke` = 10/10 (unchanged — no API touched)
- ✅ Multi-agent reviewer cleared both content additions
- ✅ BACKLOG.md updated
