# Local Persistence Features — 2026-05-11

Two new client-side capabilities, no new serverless functions, zero AI
token cost. Built + reviewed + hardened in a single iteration.

## What Shipped

### 1. Form-draft auto-save + restore — NegotiationComposer + FollowupComposer

Long modals (especially Negotiation at 20+ fields) auto-persist every
keystroke (500ms debounce) to localStorage. On re-open, the user gets
a "Found an unfinished draft — Restore / Start fresh" prompt. Saved
drafts wipe on successful generation (so converted inputs don't
auto-restore later) and on logout.

User value: never lose a 20-field salary negotiation form to an
accidental refresh, tab close, or browser crash.

### 2. Result history — RoastPage + DecodeRejectionPage + GhostJobCheckPage

Each public AI tool stores the last 5 successful results in localStorage
(30-day TTL). When the user returns to the page with no current result
on screen, a "Past results" card shows clickable entries — tap to
reload the result with zero AI cost, no rate-limit slot consumed.

User value: revisit a roast / decode / ghost-job result later without
re-running and paying the cost again.

## Multi-Agent Review

Spawned two parallel `general-purpose` Agent sub-agents:
1. **Security + privacy reviewer** — focused on what's persisted, who
   can read it, quota/DoS, schema versioning, cross-tab pollution
2. **UX + a11y reviewer** — focused on discoverability, mental model,
   restore-prompt accessibility, race conditions, mobile

The reviews surfaced **3 HIGH bugs + 9 MED + 3 LOW**. All HIGH + MED
were fixed in the same iteration before any commit.

### HIGH findings — all fixed

1. **Autosave-after-clear race** (UX agent) — `clearDraft()` removed the
   localStorage entry, but the in-flight 500ms debounce timer fired
   ~500ms later and re-wrote the (now cleared) form state. Effect:
   "Start fresh" and "successful generate" both silently re-saved a
   fresh draft. Fix in `useFormDraft.ts`: cancel pending timer on
   clear + set a `suppressNextWriteRef` so the next render cycle's
   auto-save is skipped.

2. **Shared-device PII leakage** (security agent) — drafts were keyed
   per-deploy, not per-user. On a shared laptop, the next user could
   read the previous user's salary numbers, recipient name,
   competing-offer context, and "additionalContext" free-text via
   DevTools. Fix:
   - Hook accepts `userScope` option; storage key becomes
     `<base>:<userScope>` so user B can't read user A's draft.
   - New `sweepDraftsForUser()` + `sweepHistoryForUser()` helpers,
     called in `Dashboard.handleSignOut` before `signOut()` returns —
     clears every `vantage-*:<userId>` entry on logout.
   - NegotiationComposer + FollowupComposer accept `userScope` prop
     and wire `user?.id` from `useAuth()`.

3. **FollowupComposer double-click race** (UX agent) — Negotiation got
   the `inFlightRef` sync guard in the previous iteration; Followup
   was missed. A fast double-click could fire two requests and charge
   2 tokens for one intent. Fix: ported the same `useRef<boolean>`
   pattern to `FollowupComposer.handleGenerate`.

### MED findings — all fixed

4. **localStorage DoS via unbounded entry size** — `useResultHistory`
   now caps at 64KB per entry and 256KB per key total, with quota-error
   retry that sheds oldest entries until the write fits.

5. **Cross-tab last-write-wins** — both hooks now listen for `storage`
   events: clear in Tab A → Tab B stops auto-saving; push in Tab A →
   Tab B refreshes its in-memory snapshot.

6. **Stale React state on push** — `useResultHistory.push()` now
   re-reads from disk before merging, so parallel-tab pushes don't
   clobber each other.

7. **Restore prompt missing aria-live** — banner now has
   `role="status" aria-live="polite"`, announces on appear.

8. **Restore prompt microcopy** — now reads "Found an unfinished
   negotiation draft **on this browser** …" so users on a different
   device aren't confused by "missing" drafts.

9. **Past-results panel missing Clear all + count** — added
   "(N saved on this device)" count + "Clear all" button next to
   the muted helper text.

10. **✕ remove button contrast + focus** — bumped from `text-white/40`
    to theme-aware `t.textSub`, added `hover:bg-rose-500/15
    hover:text-rose-400` and a `focus:ring-2 focus:ring-rose-400/50`.

11. **Date label collisions on same-minute saves** — switched from
    `toLocaleDateString({ month: 'short', day: 'numeric' })` to
    explicit ISO-style `YYYY-MM-DD HH:MM:SS` with seconds, year, and
    zero-padding. Two saves in the same minute now produce distinct
    labels.

12. **Defensive rendering on restore** — `setResult(entry.result)` is
    now gated on `entry.result && typeof entry.result === 'object'`;
    a corrupted historical entry falls through to `removeHistory(id)`
    instead of crashing the render.

### LOW findings — accepted as-is / deferred

- **Misleading "no PII persisted" comment** — rewritten in the
  `useFormDraft` header to be explicit: the hook DOES persist whatever
  the caller passes, and caller-side responsibility is highlighted.
- **TTL bypass via tampered savedAt** — accepted. Same-origin
  tampering means the attacker has code execution; TTL is a UX timer,
  not a security boundary.
- **Restore-prompt visibility post-result** — verified by inspection
  that the prompt is inside `{!result && (...)}` block; cannot appear
  simultaneously with a result.

## Files Touched

### New
- `src/lib/useFormDraft.ts` — draft auto-save hook + `sweepDraftsForUser`
- `src/lib/useResultHistory.ts` — result-history hook + `sweepHistoryForUser`
- `docs/local-persistence-features-2026-05-11.md` (this file)

### Modified
- `src/components/NegotiationComposer.tsx` — wire `useFormDraft`,
  restore prompt, `userScope` prop, aria-live, clearDraft on success
- `src/components/FollowupComposer.tsx` — same + `inFlightRef`
  double-click guard + actionable error mapping
- `src/components/RoastPage.tsx` — wire `useResultHistory`, past-results
  panel, Clear all, ISO date labels, defensive entry rendering
- `src/components/DecodeRejectionPage.tsx` — same pattern
- `src/components/GhostJobCheckPage.tsx` — same pattern
- `src/components/Dashboard.tsx` — pass `userScope={user?.id}` to both
  composers + call `sweepDraftsForUser` + `sweepHistoryForUser` on
  sign out

## Smoke Test Plan (post-deploy)

1. Open `/dashboard` → click "Build negotiation brief" → type into 5
   fields → close modal without generating → reopen → expect "Restore
   draft" prompt → click Restore → all 5 fields populated.
2. Same flow, click "Start fresh" → close modal → reopen → no prompt
   (cleared draft did not resurrect via the autosave race).
3. Same flow, generate successfully → reopen → no prompt (cleared on
   success).
4. Sign out → sign in as different user → open modal → no prompt
   (user-scoped key segregation working).
5. Open `/roast` → generate 3 results → reload page → expect "Past
   roasts (3 saved on this device)" with 3 entries → click one → result
   reloads without AI call → click ✕ on another → entry removed.
6. Same flow, click "Clear all" → list disappears → reload page →
   stays empty.
7. Browser DevTools → Application → Local Storage → search
   `vantage-` → confirm keys end with `:<user-uuid>` for modal drafts,
   no `:<uuid>` for public AI tool history (intentional — those pages
   are public).
8. After sign out → Local Storage → confirm all `vantage-*-draft-*:<uuid>`
   and `vantage-*-history-*:<uuid>` keys are gone.

## Status

- Preflight: 6/6 pass (typescript + build clean)
- All multi-agent HIGH + MED findings fixed before any commit
- Held for commit + push as a separate feature stream after the audit
  fixes + negotiation feature have shipped
