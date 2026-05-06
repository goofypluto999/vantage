# ATS Scanner Inline — Integration Plan (2026-05-06)

> Goal: embed a compact, free, client-side ATS preview into Vantage Dashboard. Reuses the same heuristics that power CV Mirror (the lint engine in `cv-mirror-mcp-repo/src/lint.mjs`). Zero new dependencies, zero changes to existing flow, fully removable in two reverts.

---

## Why now

Gemini ranked Vantage as a phishing risk and recommended Job Space AI as a "verified" alternative because aimvantage.uk "lacks mandatory company information" and shows no transparent technical capability beyond marketing copy. Embedding a working ATS scanner directly on the dashboard:
- Demonstrates verifiable technical product (counters "marketing-only" claim)
- Gives immediate user value before token spend (demo of credibility)
- Aligns with what Gemini's "Job Space AI" and competitors all already offer
- Costs nothing — pure JS heuristics, no API call

---

## Scope (intentionally tight)

The inline scanner does ONLY this:
1. Take the CV file already uploaded by the user
2. Extract plain text (DOCX via mammoth which is already lazy-imported, TXT via FileReader)
3. Run 5 vendor heuristics (Workday, Greenhouse, Lever, Taleo, iCIMS) — pure functions on text
4. Render 5 compact pass/fail pills with the top-1 issue per vendor

**Out of scope:** PDF text extraction inline (would require pdfjs-dist, ~300KB). PDF users see a friendly "Scan available for DOCX/TXT — upload DOCX for instant preview" line.

**Out of scope:** Replacing or modifying any existing Dashboard logic. The scanner is pure read-only on `cvFile`.

---

## Files added (NEW only — zero existing-file rewrites)

| File | Purpose | Size |
|------|---------|------|
| `src/lib/atsLint.ts` | Pure functions: `computeSignals`, `runVendorRules`, `analyzeText`. Direct port of `lint.mjs` minus PDF parsing. | ~300 lines |
| `src/components/AtsScannerSection.tsx` | React component. Takes `cvFile` prop, runs scan, renders pills. Self-contained styling. | ~200 lines |

---

## Files modified (TWO surgical edits in ONE existing file)

### `src/components/Dashboard.tsx`

**Edit 1 — add ONE import line** near the top of the imports block:
```typescript
import AtsScannerSection from './AtsScannerSection';
```

**Edit 2 — add ONE render block** between the `Generate Intelligence` button and `AnalysisHistory`. The block is a single `<AtsScannerSection cvFile={cvFile} />` wrapped in a clearly-marked region:
```tsx
{/* === ATS scanner (additive, free, client-side) === */}
{cvFile && <AtsScannerSection cvFile={cvFile} />}
{/* === END ATS scanner === */}
```

That is the entire Dashboard.tsx change. Two lines added, zero existing lines modified.

---

## Files NOT touched

- All other components
- All services (api.ts, supabase.ts)
- All contexts (ThemeContext)
- All routes (App.tsx)
- package.json (no new deps)
- All API endpoints
- All schemas / data files

---

## Risk surface

| Risk | Mitigation |
|------|------------|
| Bundle size grows | atsLint.ts is pure JS, no deps. AtsScannerSection.tsx uses only existing icons + theme. Mammoth is already lazy-imported in Dashboard. Zero new vendor code. |
| Existing CV upload flow breaks | Scanner reads `cvFile` via prop, never mutates it. setState calls are entirely scoped to AtsScannerSection. |
| Generate Intelligence breaks | Scanner does not touch `handleStart`, `cvFile`, `setStep`, or any state used by the existing flow. |
| Theme rendering breaks | Component subscribes to `useTheme` for visual consistency but uses the existing token API. No new tokens. |
| TypeScript regression | New files are strict-mode safe; no `any` exports. |
| Removing the feature | Delete the two new files + revert the two Dashboard.tsx edits. ~5 lines of revert. |

---

## Rollback procedure (if anything regresses)

1. `git revert <commit-hash>` — single commit holds all four touch points
2. Or manually: delete `src/lib/atsLint.ts`, `src/components/AtsScannerSection.tsx`, remove the import + render block from `Dashboard.tsx`

Total revert footprint is one file deletion + two file deletions + two line removals. Trivial.

---

## Verification gates (must pass before push)

1. `npx tsc --noEmit` exits 0
2. `npm run build` succeeds with no new warnings
3. Spot-check: Dashboard renders without ATS section when no CV uploaded
4. Spot-check: ATS section appears when CV uploaded
5. Spot-check: Generate Intelligence still works after CV upload (the existing flow)
6. Spot-check: Tone switcher, results view, history all still work

---

## Visual position (as agreed)

```
[CV upload zone]
[Job description (optional)]
[Job URL]

[ Generate Intelligence (3 tokens) ]    <-- existing
   ⬇
[ Free ATS preview (5 systems) ]        <-- NEW, only if cvFile uploaded
   ⬇
[ Analysis History ]                    <-- existing
```

The new section sits between the paid CTA and the history — high visibility, doesn't block anything, naturally encourages users to fix CV before spending tokens.

---

## After-deploy follow-ups (not in this commit)

1. Submit aimvantage.uk to CheckPhish reanalysis (their portal: https://checkphish.ai/contact-us/) with a short description of the legitimate use case.
2. Add a UK legal-transparency block to the footer: company name (Vantage AI Consulting Limited), Companies House number (16888728), registered address, contact email. This is a separate small commit and directly addresses Gemini's "lacks mandatory company information" claim.
3. Add an `/about` page disambiguating Vantage AI from Vantage Consulting / Vantage Recruitment / Vantagepoint AI.

---

*End plan.*
