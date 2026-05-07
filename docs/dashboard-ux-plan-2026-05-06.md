# Dashboard UX Improvement Plan — 2026-05-06

> Source of plan: live observation of the dashboard via browser MCP + admin-data confirming 2/3 users never ran an analysis (signed up → walked away). Friction lives BETWEEN signup and first-completed-analysis, not at the paywall.

---

## Backup

- Tag: `v1-pre-ux-pass-2026-05-06`
- Commit: `cc0b4a0`
- Roll back any change in this pass with: `git checkout v1-pre-ux-pass-2026-05-06`

---

## Specific friction points observed (not assumed)

From a logged-in dashboard view:

| # | Issue | Risk if unchanged |
|---|---|---|
| F1 | **Pricing cards visible at the TOP** of the dashboard, above the upload form | New user lands → first thing seen = "Buy Tokens / Subscribe" cards = feels like paywall before they've even tried. Likely #1 reason 2/3 bounced. |
| F2 | **Three upload zones in one row** with no visual hierarchy | User doesn't know where to start. "Where do I begin?" |
| F3 | **JD field is dual-mode** (File tab / Paste tab) without explaining why or which is faster | Decision paralysis. Skip-step risk. |
| F4 | **JD field is mandatory but value of providing one is unclear** to user | They give up if they don't have a JD file or text on hand |
| F5 | **"Generate Intelligence" button label is generic SaaS jargon** | Doesn't communicate what they're getting |
| F6 | **No micro-guidance** on how to use each field (e.g. "paste any LinkedIn / Greenhouse / Lever URL") | Users staring at fields not knowing what counts |
| F7 | **Past Analyses visible to new users with no analyses yet** | Wasted screen space, looks empty |

---

## Ranked changes (safest + simplest first)

### Tier 1 — pure conditional render / copy (zero risk, ship today)

**C1. Hide pricing cards for new users who haven't paid and still have ≥7 free tokens.**
- File: `src/components/Dashboard.tsx`
- Change: wrap the existing "Subscription Banner" section in a condition `(everPaid || tokens < 7)`
- Effect: New users see the upload form FIRST. Existing users / paid users see no change.
- Risk: zero — pure conditional render. No new components, no logic changes, no schema.
- Rollback: revert the conditional, reintroduces the cards.

**C2. Add micro-guidance under each upload field.**
- File: `src/components/Dashboard.tsx`
- Change: add a one-line helper text under "Upload your CV", "Job Description", "Job Posting URL" explaining what counts and what's recommended.
- Effect: Reduces decision paralysis.
- Risk: zero — pure copy.

**C3. Improve "Generate Intelligence" button label.**
- File: `src/components/Dashboard.tsx`
- Change: "Generate Intelligence (3 tokens)" → "Run my prep pack — uses 3 of your 10 free tokens" (or similar context-aware copy).
- Effect: Concrete value language.
- Risk: zero — pure copy.

**C4. Hide "Past Analyses" section when user has zero analyses.**
- File: `src/components/Dashboard.tsx`
- Change: `{history.length > 0 && <AnalysisHistory ... />}` (already partially conditional — verify and tighten).
- Effect: Clean dashboard for new users.
- Risk: zero — pure conditional render.

### Tier 2 — interaction change (low risk, ship after Tier 1 verified)

**C5. Make JD field non-mandatory but warn before submit if missing.**
- File: `src/components/Dashboard.tsx`
- Change: remove "Required" label on JD section. On `handleStart()`, if no JD provided, show a confirm-dialog ("Without a job description, the AI has only the URL to work from. Quality may be lower. Continue anyway?") before firing.
- Effect: Removes blocker for users without JD on hand. Educates them on impact.
- Risk: low — adds a path but doesn't change existing happy path.
- Tests: confirm `handleStart` still works for users WITH a JD.

**C6. Step indicator at top of upload form.**
- File: `src/components/Dashboard.tsx`
- Change: Add "Step 1 / 2 / 3" pills above the form sections.
- Effect: Reduces "what do I do?" anxiety.
- Risk: low — pure presentational addition.

### Tier 3 — bigger UX work (medium risk, ship after Tier 1+2 verified)

**C7. Visually demote the JD-mode toggle (File / Paste).**
- File: `src/components/Dashboard.tsx`
- Change: Default to "Paste" tab (more common), make File a smaller "or upload a file" link. Show paste-area more prominently.
- Effect: Removes decision paralysis.
- Risk: medium — changes default state on first render.
- Tests: confirm both modes still work, file upload still parses.

**C8. Pre-fill demo data option.**
- File: `src/components/Dashboard.tsx`
- Change: Add "Don't have a CV ready? Try with our sample" link that pre-fills both fields with a sample CV + job URL.
- Effect: Removes hardest blocker (no CV on hand).
- Risk: medium — needs a real sample CV asset bundled.

---

## Validation gates (per change)

1. **Self-review the diff** before commit
2. **`npx tsc --noEmit`** — must exit 0
3. **`npm run build`** — must succeed
4. **Smoke test on dev server** — load /dashboard, verify component renders correctly for both states (new-user-with-tokens AND old-user-no-tokens)
5. **For Tier 2+ changes only:** Codex CLI review (`codex review` on the diff) AS LLM-council pass
6. **Push to master**
7. **After Vercel deploy:** smoke test on live, verify no regressions on existing routes
8. **Wait 24-48h** for next user signup to test the new flow before stacking another change

---

## Security sweep checklist (per change)

- [ ] No new external network calls
- [ ] No new user-supplied content sent to backend without sanitisation
- [ ] No PII added to client-side logs
- [ ] No bypass of existing RLS / auth checks
- [ ] No new file upload paths that could accept executable content
- [ ] All existing CSP directives still satisfied
- [ ] Rollback path verified (can revert with `git revert <hash>`)

---

## Out of scope (this pass)

- Stripe checkout flow changes (zero failed payments in admin data → not the bottleneck)
- Pricing page changes (already simplified earlier today in commit `2c8702d`)
- Backend / API / schema changes (any of these would be a separate plan with deeper review)
- Output quality / Gemini prompt changes (separate concern, address after UX bottleneck cleared)

---

*Plan written by Claude. Approved for execution.*
