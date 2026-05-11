# Negotiation Feature — Multi-Agent Review + Fixes Applied

> First real use of the multi-agent review process (`docs/multi-agent-review-process.md`).
> Three Agent() sub-agents reviewed `handleNegotiation` in parallel with
> focused briefings. They surfaced one CRITICAL, six HIGH, four MED, and
> two LOW findings — most of which I'd have shipped without spotting.
> Net: the process was worth it.

## Reviewers

1. **Security agent** — auth, tokens, prompt-injection, error leakage
2. **Type-safety + edge-case agent** — boundary values, NaN/Infinity, race conditions
3. **UX + prompt-quality agent** — output structure, dead phrases, tone enforcement

All three were `general-purpose` Agent sub-agents with focused briefings.
Honest: same Claude model, but independent context per agent. Not Gemini.

## Findings + dispositions

| # | Severity | Agent | Finding | Fix applied |
|---|---|---|---|---|
| 1 | CRITICAL | Type | `typeof NaN === 'number'` — NaN passes all numeric validation, propagates into `baseTarget - baseOffered` and embeds `null` in the prompt | Switched required-number guards + `validateOptionalNum` to `Number.isFinite()` which rejects NaN + Infinity + non-numbers in one check |
| 2 | HIGH | UX | Email structure (multi-ask enumeration in para 2) is the negotiation anti-pattern coaches warn against — comes across as a demand list, weakens leverage | Rewrote email-structure rules: anchor email on PRIMARY ASK (largest pct delta) only, gesture to "a couple of other items, best for a call" if multi-ask. Multi-ask enumeration moved to phoneScript + talkingPoints. Word count scales with ask count (90-140 for single ask, 140-200 for multi) |
| 3 | HIGH | UX | Phone-script word count not enforced — "60-90 seconds" without word target lets Gemini overshoot | Added explicit "150-220 spoken words (≈60-90 seconds at conversational pace)" |
| 4 | HIGH | UX | Warnings thresholds (25% base ask, £50k signing) are made-up + mis-flag senior candidates whose larger absolute asks are normal | Made thresholds dynamic + calibrated to `yearsExperience` + `levelTitle`. Added explicit "do not flag X if Y is senior" rules. Emptied hardcoded numbers in favour of relative pct + experience-aware reasoning |
| 5 | HIGH | UX | JSON quote-escaping not addressed — talking points with embedded `'...'` quotes will break `extractJson` parse | Added explicit instruction: "Inside JSON string values that contain inline quotation, USE SINGLE QUOTES not double quotes" with example |
| 6 | HIGH | Type | `fmt(0)` returned `null` — hides legitimate `baseOffered=0` (unemployed candidate) cases, causing valid asks to hit the "no asks" 400-and-refund path | Replaced with `fmtMoney()` that only treats `undefined/null/NaN/Infinity` as missing. 0 now renders as e.g. "£0". Added explicit "(none offered)" suffix for clarity. Added separate code path for "user offered 0, asking for some" common case (signing/RSU) |
| 7 | MED | UX | Tone differentiation weak — `collaborative` vs `firm` would produce ~80% identical output | Added concrete sample openers per tone. Explicit instruction: "the two tones must produce CLEARLY DIFFERENT email + phone outputs, not the same content with different adverbs" |
| 8 | MED | UX | Dead-phrase list missing 6 common offenders ("I appreciate the offer, however", "per industry standards", "let me know what's possible", "I was hoping for", "is there any flexibility", "based on my research") | Added all 6 to the banned list |
| 9 | MED | UX | `[REMINDER:...]` bracket inside spoken phoneScript will confuse non-native readers and anyone using as teleprompter copy | Removed from phoneScript. Moved equivalent reminder to `talkingPoints` as one of the required-quality examples |
| 10 | MED | UX | Prompt-injection guard didn't wrap user input with explicit delimiter markers — Gemini-2.5-flash has been shown to follow injection through fake "END OF USER CONTEXT" delimiters ~15% of the time | Wrapped user input with `<<<USER_CONTEXT_START>>>` ... `<<<USER_CONTEXT_END>>>` markers + extended guard to reference them explicitly |
| 11 | MED | Security | Original guard only covered `additionalContext`; other free-text fields (`companyName`, `roleName`, `userName`, `levelTitle`, `competingCompany`, `competingOfferContext`) were unprotected | Guard now covers ALL text between the START/END markers (covers every user-supplied field) |
| 12 | LOW | Type | AI output array elements not type-guarded — `String(null)` ships `"null"` to client | Replaced bare `.map(String)` with `safeStringArray()` helper that filters to `typeof === 'string'` before stringification |
| 13 | LOW | UX | Zero-competing-offer case not explicit in prompt — Gemini sometimes hedges with "while I don't have another offer..." which is a negotiation own-goal | Added explicit `COMPETING OFFER IS "none stated" — do NOT mention competing offers, market rates, or other companies in any output` conditional |
| — | — | Type | Whitespace-only `remotePolicyOffered: "   "` passes length check but produces ugly prompt | Added `.trim()` before equality + length checks |

## Deferred (not fixed in this iteration)

- **Refund-not-atomic across handler kill** (Type agent #7) — real concern but architectural. Every existing Gemini endpoint has this property. Project-wide fix would need a `pending_charges` reconciliation queue. Filed for separate work, not blocking this feature.
- **Concurrent double-submit UX** (Type agent #8) — second click hits 403 "Insufficient tokens" which is technically correct but confusing. Future polish.

## Net assessment

Without the multi-agent review, I would have shipped:
- The NaN-validation hole
- The email-structure anti-pattern (THE biggest user-facing miss)
- The made-up warning thresholds
- The `fmt(0)` legitimate-zero bug
- The JSON quote-escape risk
- A weak prompt-injection guard

Most of these would not have surfaced from "Claude reviews Claude in the
same context". The trick was independent context per reviewer + focused
role briefings. **Process verdict: keep using it.**

## Status

- Code changes are LOCAL ONLY — not committed yet, not pushed
- Preflight 6/6 passed (only standard warnings: 12/12 fn ceiling + env vars not in .env.example)
- TypeScript clean
- Production build clean
- Next iteration: build FrontEnd modal + Dashboard wire-up + a separate `negotiation-feature-test-plan-2026-05-11.md` test-plan + commit all of it as one push

Rollback if anything explodes after the eventual push:
```bash
git reset --hard stable-2026-05-11-pre-followup
git push -f origin master
```
