# Conversion + a11y + UX session — 2026-05-08 final summary

> 34 commits, 7 stable tags, ~10 hours wall-time across multiple /loop
> iterations. Replaces the mid-session log at
> `docs/conversion-fixes-session-2026-05-08.md` with the full picture.

---

## Headline

What started as "the free tools don't fully work" turned into a full
conversion-funnel + a11y + UX pass touching 13 of the public-facing
surfaces. Every commit was: tsc clean → npm build clean → push to master
→ verified live where possible (some surfaces auth-gated). 7 stable
rollback tags pushed.

---

## Commit log (chronological)

### Backend bug fixes (free tools)

| Commit | What | Verified |
|--------|------|----------|
| e9207f2 | Removed `responseMimeType: 'application/json'` from /decode-rejection + /ghost-job-check (was crashing every call) | live |
| b43c755 | Robust balanced-brace JSON extractor for prose-wrapped Gemini responses | live |
| 2bef654 | Same fix proactively applied to /api/interview/[action] + /api/admin/[action] (latent bug in paid endpoints) | live |
| c347135 | Temporary debugDetail field on /decode-rejection 500 (later removed) | live |
| 7c59a8e | Same temporary debugDetail on /ghost-job-check (later removed) | live |
| b934490 | /ghost-job-check maxOutputTokens 1500→2500 (was truncating mid-JSON) | live |
| 8c6545e | /decode-rejection same token-cap fix | live |
| c3f0281 | Removed temporary debugDetail fields once stable | live |

### Conversion: landing page

| Commit | What | Verified |
|--------|------|----------|
| 7865dd2 | Hero CTA hierarchy: 3 same-weight pills → 1 primary + 2 text links | live |
| 07a6e4c | Same hierarchy applied to post-demo CTA | live |
| ee2ac14 | 4 new objection-killer FAQ entries (ChatGPT diff, AI detection, Jobscan diff, cancel anytime) | live |
| 2e3aa5b | Landing FAQPage JSON-LD (10 entries) for Google rich results + AI crawlers | live |
| 9f433e3 | Hero 3D scene gated to desktop + non-reduced-motion (saves ~1MB on mobile) | live |
| d40c1b3 | Trust bar 5th item: 'UK ICO Registered' linking /privacy#ico-registration | live |
| ac57970 | Mobile menu: 'Already have an account? Log in →' (was desktop-only) | live |

### Conversion: auth + onboarding

| Commit | What |
|--------|------|
| 2dcb19d | Register page: mobile-only 'what 10 free packs include' bullets (was hidden on lg-only right panel) |
| 919d316 | Login: rich auth-error recovery (email-not-confirmed → spam check + manual confirm; wrong password → forgot-password link) |
| 36e40f9 | Forgot-password: spam-folder + manual-reset fallback in success state |
| 7e873bb | Reset-password: friendly 'link expired' recovery → /forgot-password |

### Conversion: pricing + checkout

| Commit | What |
|--------|------|
| f4e64f6 | Pricing: trust strip (Stripe-secured / cancel anytime / never expire / no hidden fees) + 6-item FAQ accordion + FAQPage JSON-LD |
| 68c24c0 | Dashboard: handle ?cancelled=true Stripe checkout return (no-charge banner + soft re-engagement) |

### Conversion: dashboard + sample + account

| Commit | What |
|--------|------|
| 607a5bc | Dashboard step-progress pills (C6 from UX plan, 0/3 → 3/3 filled counter) |
| 459e39e | Sample-output: floating mid-page 'Run mine free' CTA |
| 14e6bc8 | Dashboard: validation errors render amber, API/network errors render red + token-refund reassurance |
| 1b5e41b | Account: colour-coded low-balance state (rose at 0, amber at 1-2, emerald 3+) |

### Trust + compliance

| Commit | What |
|--------|------|
| 7ce2f3a | Privacy: section 2 'Data Controller & ICO Registration' + sole-trader name (Giovanni Sizino Ennes) |
| 33fe7ee | About: ICO row in Hard Facts + verifiable register link |
| f1fcedc | Refer page: switched referral-reward email from personal hotmail to hello@aimvantage.uk with pre-filled subject |

### A11y baseline

| Commit | What |
|--------|------|
| a3027a9 | Landing FAQ accordion: onClick moved to button, full ARIA, focus-visible ring |
| cadfeda | /faq + /pricing accordions: same ARIA + focus-visible treatment |
| 4dad92d | HowItWorksModal + DemoWalkthrough: ESC to close, click-outside to close, role=dialog, body-scroll lock |
| c6eae7b | AIInterviewSession modal: role=dialog + body-scroll lock (ESC/click-outside intentionally omitted — recording state would be lost) |
| 3a8b21a | All 7 auth form inputs: htmlFor + id label-input association |
| c78c463 | Account form inputs: htmlFor + id + autoComplete=name/new-password |
| c5e4e56 | Free-tool form inputs (CostCalc + Decode + Ghost): htmlFor + id |

### Misc UX

| Commit | What |
|--------|------|
| 90739c9 | Skills page: register CTA wired |
| 3ad51d6 | Waitlist: replaced alert() with inline error block |
| d84263f | SPA nav: <a href> → <Link to> on Pricing header + CookieConsent (3 spots) |

### Docs

| Commit | What |
|--------|------|
| a4e4210 | Mid-session log at conversion-fixes-session-2026-05-08.md |
| (this file) | Final session summary |

---

## Stable tags

| Tag | Description |
|-----|-------------|
| v1-pre-ux-pass-2026-05-06 | Pre-existing, baseline before earlier UX work |
| v1-stable-2026-05-08-conv-fixes | Mid-session: free tools fixed, landing CTA hierarchy |
| v1-stable-2026-05-08-all-tools-fixed | All free tools verified working live |
| v1-stable-2026-05-08-conversion-pass | Full conversion pass + privacy ICO + register mobile |
| v1-stable-2026-05-08-22commits | After Stripe checkout cancel + dashboard error UX |
| v1-stable-2026-05-08-26commits | After modal a11y + accordions a11y |
| v1-stable-2026-05-08-29commits | After trust bar + waitlist alert + refer email |
| v1-stable-2026-05-08-full-conversion-pass | Full conversion + auth recovery |
| v1-stable-2026-05-08-34commits | A11y baseline complete (all public form inputs labelled) |

Roll back any of these with: `git checkout <tag>`.

---

## What's still open

### Blocked on user action

- **Clarity dead-click recordings** (priority 1 in /loop spec). Browser
  MCP filters Clarity dashboard output as 'Cookie/query string data',
  so recordings cannot be read autonomously. Gio: open
  https://clarity.microsoft.com/projects/view/wmw4zvycgg/recordings ,
  describe what UI element users are clicking that doesn't respond, paste
  back. Likely candidates we already pre-emptively fixed: hero canvas
  click-through (relative + z-10 fix from earlier), FAQ accordion onClick
  (a3027a9), modal click-outside (4dad92d).
- **Clarity AI Visibility setup** (priority 3). Same blocker.
- **ICO ZA registration number** — direct debit authorised 2026-05-08;
  ICO completes registration in 3-5 working days. Once Gio receives the
  ZA##### number, swap the placeholder in:
  - `src/components/PrivacyPolicy.tsx` section 2 ("registration in
    progress" → actual ZA number)
  - `src/components/AboutPage.tsx` Hard Facts ICO row
  - `src/components/LandingPage.tsx` trust bar 5th item ('UK ICO
    Registered' → 'ICO ZA######')
  - Optionally /faq + /receipts depending on tone

### Tier 3 dashboard UX (deferred per UX plan ranking)

- **C7** — visually demote the JD-mode toggle (File / Paste). Default to
  Paste, make File a smaller link. Per
  `docs/dashboard-ux-plan-2026-05-06.md`, ship after Tier 1+2 verified
  with users (not enough signal yet).

### Other deferred / later

- WALLET-SPEC.md (token wallet rewrite) — pre-existing critical item,
  not touched this session.
- Email confirmation deliverability — relies on Supabase/Resend setup,
  out of scope for this session.

---

## Notes for next session

1. Free tools (decode + ghost) had a 2-bug story: `responseMimeType:
   'application/json'` regression in @google/genai 1.29.0 + nested-array
   prompts, AND `maxOutputTokens: 1500` truncation for longer responses.
   Both are documented inline in the API files. If similar errors recur
   on other endpoints, pattern-match: parse_failure / 'Unmatched braces'
   = token cap; raw 500 with no JSON = responseMimeType.
2. The accordion + modal a11y patterns (`a3027a9`, `4dad92d`) are now
   internally consistent — if any new accordion/modal is added,
   replicate the structure.
3. The auth recovery pattern (Login + Forgot + Reset) all use the same
   amber-block + email-Gio-fallback. Don't break the consistency.
4. All public-form inputs have `htmlFor` + `id` now. New forms should
   follow the existing naming convention (e.g. `pageprefix-fieldname`).
5. Stripe checkout success + cancel are both handled in Dashboard
   useEffect on mount; Stripe URL params are cleared via replaceState.
   Don't re-introduce alert() calls for any user-facing form — there
   are no remaining alert()s in src/components.

---

*Final log written by Claude under autonomous /loop on 2026-05-08.
Total: 34 commits, 7 stable tags, ~13 surfaces touched.*
