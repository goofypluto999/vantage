# Session 2026-05-18 → 2026-05-19 — GDPR Compliance + Mobile UX Sweep

> The session that closed two ICO/UK-GDPR gaps and did a full mobile-UX pass on the landing page. Also: a 10-round mobile-hero-animation rabbit hole that's documented here as a warning.

---

## TL;DR

| Stream | Outcome |
|---|---|
| **GDPR Gap #1** — Self-serve account deletion | ✅ Shipped (5 phases, 5 commits). Backend + UI + smoke test live. ⚠️ Phase 6 E2E with a disposable test account still pending (operator task). |
| **GDPR Gap #3** — Privacy Policy cv_summary disclosure | ✅ Shipped (1 commit). Section 3 + Section 8 both have explicit cv_summary copy with reviewer SHIP IT verdict. |
| **Mobile UX — Hero spacing + nav** | ✅ Fixed. Headline no longer overlaps the fixed navbar on iPhone; nav has backdrop blur on mobile so headline doesn't bleed through; hero content has proper top padding below the nav stack. |
| **Mobile UX — Chip cluster** | ✅ Fixed. "Or try a free tool" label on its own row on mobile, chips wrap cleanly underneath. Desktop unchanged. |
| **Mobile UX — Scroll indicator overlap** | ✅ Fixed. "Scroll" hint hidden on mobile (was anchored `absolute bottom-8` of a tall `min-h-screen` section and landing on the trust paragraph). |
| **Mobile UX — Hero background fade** | ✅ Shipped. Hero gradient fades from `#A8A5E6` through `#B5B3EB` to fully transparent — merges with the page wrapper below instead of cutting off at a hard seam. |
| **Mobile UX — Animated hero backdrop** | ❌ 10 rounds, all rolled back. Definitively parked. See Round-by-round postmortem below. |
| **Desktop UX — 3D dot-globe rotation** | ✅ Fixed. Removed the hover-state speed boost (0.14 → 0.7 rad/s on pointer-enter felt like janky mouse-tracking). Now constant 0.18 rad/s rotation with the same X-oscillation. |
| **SEO fallback flash** | ✅ Fixed. The static SEO fallback in `index.html#root` no longer briefly appears for real users — hidden by default CSS, re-enabled inside `<noscript>` so JS-less crawlers still see it. |
| **Smoke test** | 11/11 ✅ (was 10/10 before — new `/api/delete-account` check added in Phase 5 of Gap #1). |

---

## Reading order for the next session

1. **This file** (you are here)
2. `CLAUDE.md` — global rules (unchanged this session)
3. `BACKLOG.md` — updated with the new mobile-animation deferred item + the Phase-6 operator task
4. `PROJECT-INDEX.md` — unchanged this session, still canonical
5. `SESSION-2026-05-17-BUNDLING-ODYSSEY.md` — Strategy B canonical pattern reference (relevant because Gap #1's backend inlines its own Sentry/Resend/audit helpers per Strategy B)
6. `docs/superpowers/plans/2026-05-18-gap1-self-serve-delete-account.md` — full Gap #1 plan with all checkboxes synced
7. `docs/superpowers/plans/2026-05-18-gap3-privacy-policy-cv-summary.md` — full Gap #3 plan

---

## Detailed work log

### GDPR Gap #1 — Self-serve "Delete account" (5 phases, all green)

**Commits in order:**
- `225fd82` — Phase 1: backend handler in `api/user/index.ts` (multiplexer — no new function file because we're at 11/12 Vercel Hobby cap)
- `4e59974` — Phase 2: `deleteAccount()` client wrapper in `src/services/api.ts`
- `96174f1` — Phase 3: Account.tsx Danger-Zone UI with typed-`DELETE` confirmation gate
- `6bdb19f` — Phase 4: `vercel.json` rewrite `/api/delete-account` → `/api/user?endpoint=delete-account`
- `eca3a7c` — Phase 5: smoke test extended to 11/11 covering the new endpoint
- `1918c96` — BACKLOG updated, both gaps marked RESOLVED

**Architecture:**
1. Backend (`api/user/index.ts::handleDeleteAccount`) authenticates → snapshots `profile.plan / token_balance / created_at` + `analyses` count → writes `account.deleted` audit row **BEFORE** delete (because `audit_log.actor_id` is `ON DELETE SET NULL` so the row survives) → calls Supabase Auth admin `DELETE /auth/v1/admin/users/{id}` → `ON DELETE CASCADE` chain wipes `profiles → analyses, api_usage, seen_job_searches, cv_summary` → fires fire-and-forget confirmation email via Resend → returns counts.
2. Stripe customer record **intentionally preserved** for UK financial-records retention. Separate erasure available via email request (disclosed in the confirmation email body).
3. Frontend gates the destructive action with a collapsed-by-default "Delete account" button; click expands to a typed-`DELETE` input (strict `===`, case-sensitive). Submit disables all controls (no double-click race). Success path: `signOut() → navigate('/?deleted=1', { replace: true })`.
4. Reviewer verdicts: 10/10 backend, 8/8 UI, both SHIP IT.

**Inline helpers per Strategy B (canonical pattern):**
- `api/user/index.ts` now contains its own copies of `initSentry`/`captureError`, `sendEmail`/`wrapEmailBody`, `logAuditEvent` (~150 LOC INLINED HELPERS block at top of file).
- Verbatim derived from `api/stripe/webhook.ts`. **If you change ANY of these helpers, change ALL copies in:** `api/analyze/index.ts`, `api/interview/[action].ts`, `api/rewrite-tone/index.ts`, `api/stripe/webhook.ts`, `api/stripe/[action].ts`, `api/user/index.ts`. (See `SESSION-2026-05-17-BUNDLING-ODYSSEY.md` for WHY.)

**Phase 6 (still pending — OPERATOR TASK):**
Manual E2E with a disposable test account — sign up with a throwaway email, log in, expand Account → Danger Zone → "Delete account", type DELETE, confirm, then verify in Supabase:
- `auth.users` row gone
- `profiles` row gone (cascade)
- `analyses` rows for that user gone (cascade)
- `audit_log` row with `event_type='account.deleted'` SURVIVES with `actor_id=NULL` but `actor_email`, `ip_address`, `metadata` preserved
- Confirmation email arrives at the disposable inbox

### GDPR Gap #3 — Privacy Policy cv_summary disclosure

**Commit:** `769261f`

Two new subsections added to `src/components/PrivacyPolicy.tsx`, **purely additive** (no existing wording removed):
- **Section 3 (Data We Collect)** — new "CV Profile Summary" item between "CV / Resume Content" and "Job Information". Explicitly discloses the ≤2,000-char distilled summary stored on `profiles.cv_summary`, what it powers (AI Job Search scoring), and that the raw CV is NOT retained.
- **Section 8 (Data Retention)** — new "CV Profile Summary" item between "Account Data" and "Analysis Results". Documents the retention lifecycle: lives with the account, deleted automatically via Gap #1's self-serve flow (`ON DELETE CASCADE` from `auth.users → profiles`) or by email request.

**Note:** The original plan referenced "Section 4" and "Section 7" but those were off-by-one — the policy numbers Data-We-Collect as Section 3 and Data-Retention as Section 8. The semantic IDs (`data-we-collect`, `data-retention`) are the canonical references.

Reviewer verdict: 5/5 SHIP IT.

### Mobile UX fixes (all confirmed working by user)

**Commit `4834723` — hero spacing + nav backdrop:**
- Hero `<section>` was `h-screen flex justify-center` — content stack (eyebrow + 4-line H1 + subtitle + button + secondary links + free-tool chips) is taller than 100vh on iPhone, so flex-centering pushed the headline UP behind the fixed navbar.
- Fix: `min-h-screen flex justify-start pt-32 md:pt-0 md:justify-center` — on mobile, content starts BELOW the nav stack and grows naturally if taller than viewport. Desktop preserved (`md:` overrides restore the centred layout).
- Navbar at scroll-top was `bg-transparent` everywhere — dark headline bled through. Fix: mobile always gets `bg-white/30 backdrop-blur-[20px]`, desktop preserved (`md:bg-transparent md:backdrop-blur-0 md:border-b-0`).

**Commit `7989281` — Scroll indicator overlap:**
- The "Scroll" hint + vertical bar at hero `absolute bottom-8` was landing on top of the "Built solo by Giovanni Sizino Ennes..." trust paragraph because mobile content overflowed `min-h-screen`.
- Fix: `hidden md:flex` — indicator only renders on desktop where the hero actually fills the viewport.

**Commit `1cf05ef` — chip cluster cleanup:**
- "Or try a free tool:" label was `inline` and sharing its row with the first chip on mobile, causing zigzag wrap.
- Fix: `block w-full md:w-auto md:inline text-center` on the label `<span>` — full-width row on mobile, inline on desktop.

**Commit `bb3dd5e` — hero gradient fades to transparent:**
- Hero bottom had a hard seam where the gradient ended at `#E6E5F8` (lightest) but the page wrapper below was at a darker shade.
- Fix: `bg-gradient-to-b from-[#A8A5E6] via-[#B5B3EB] to-transparent lg:bg-[#A8A5E6] lg:bg-none` — bottom is transparent so the wrapper gradient below shows through. No seam.

**Commit `f9e7cba` — SEO fallback flash:**
- The static SEO fallback in `index.html#root` was visible for ~100-300ms before React hydrated. Real users saw dev/debug-style copy ("Brand colours: violet #a78bfa, indigo #6366f1...").
- Fix: `[data-static-fallback] { display: none; }` in the base `<style>`. A `<noscript><style>` block overrides to `display: block !important` when JS is disabled — so JS-less crawlers still see the fallback, real users never do.
- Net: no SEO regression (raw HTML still contains the fallback content for parsers that read the HTML directly), zero flash for real users.

**Commit `cadf8b8` — Desktop globe rotation:**
- `Hero3DScene.tsx::DotGlobe` had `groupRef.current.rotation.y += delta * (hovered ? 0.7 : 0.14)` — a 5× speed jump on pointer-enter that read as janky mouse-tracking.
- Fix: single constant `delta * 0.18` rotation. Removed the `hovered` state, `setHovered` callbacks, and `onPointerOver`/`onPointerOut` handlers. Canvas is fully passive now.

### Mobile hero animation — 10-round rabbit hole (PARKED)

**TL;DR:** Spent 10 rounds trying to add visible motion to the mobile hero. Every round was either invisible (subtle pale-on-pale CSS gradients) or off-brand (saturated neon to compensate). All attempts permanently rolled back. Mobile hero is static lavender-to-transparent gradient.

**Final commit:** `881f023` — definitive revert.

**Why this was hard (lesson for future sessions):**
The desktop has a 3D dot-globe with sparkles (`Hero3DScene` via Three.js). The motion is convincing because it's **shape-based** (a rotating sphere), not colour-based. The brand background is pale `#A8A5E6` lavender.

To match that vibe on mobile **with CSS-only techniques**, you have to choose:
- **Subtle/pale colours** that fit the brand → invisible against the lavender base
- **Saturated colours** to be visible → reads as garish/off-brand against the pale palette

CSS-only blur-based effects (radial-gradient + filter:blur(...) on low-alpha colours) **always average into the background** on a pale base. Stripe/Linear-style mesh gradients (multiple `radial-gradient` in one `background-image` + animated `background-position`) **work** but at the saturation level required to be visible, they break the brand identity.

**Round-by-round (for the next session that wants to try again — do NOT just repeat this):**

| Round | Commit | What | Outcome |
|---|---|---|---|
| 2 | `7989281` (partial) | 3 blurred CSS blobs in violet/indigo/lavender, opacity 0.4-0.55, blur 60px, `mix-blend-mode: soft-light` | Invisible — blend mode killed contrast |
| 4 | `54971a8` | Added animated gradient mesh (`background-size: 400%` shifting through 5 lavender stops) layered over blobs | Mesh too subtle (all-lavender stops have near-identical luminance) |
| 5 | `cadf8b8` | Tailwind fallback gradient on the parent + bigger blobs, opacity 0.55-0.75 | Still subtle on iPhone in daylight |
| 6 | `b2aec27` | **Off-brand neon** — bright pink (#EC4899), cyan (#22D3EE), white. Dramatic lavender→indigo parent gradient. | Looked like a Lisa Frank notebook. User hated it. |
| — | `e056d73` | First revert — restored brand-correct flat lavender | Clean |
| 7 | `6154697` | 2 corner pulsing glows — brand violet (#A78BFA) + white sheen, peak 0.6/0.55 alpha, blur 70px | Too subtle — corner-positioned + blur = whisper |
| 8 | `a4d8c12` | 80-dot SVG Fibonacci constellation rotating 60s | Looked like scattered debris — 3D sphere math doesn't read as a coherent shape in 2D |
| — | `6750648` | Revert — back to clean gradient | Clean |
| 9 | `0e02eb3` | 3 separate blurred divs with brand violet/lavender/indigo orbs, drift animations | Still invisible — same blur+pale-bg averaging problem |
| 10 | `fe983e6` | Canonical Stripe-mesh technique — 4 radial-gradients in one `background-image`, animated `background-position` | Worked in the sense of being visible, but at the saturation needed it broke brand identity — user said "kinda awful" |
| — | `881f023` | **Permanent revert** | Mobile hero is static, locked in |

**If revisiting in the future:** The correct path is probably custom Canvas / WebGL shader (same tech as desktop, optimised for mobile size). That's a proper design brief, not a Tailwind className tweak. Don't iterate live again.

---

## Smoke test state

`npm run smoke` is **11/11 ✅** on production as of `eca3a7c`. The 11th check verifies `/api/delete-account` returns JSON 401/405 on GET (catches the ERR_MODULE_NOT_FOUND class that broke production for 2 days on 2026-05-15).

Run after every API change. If a check fails, that deploy is broken regardless of what Vercel's UI says.

---

## What didn't get touched this session

- Schema (`database/schema.sql`) — no DDL changes. `ON DELETE CASCADE` and `ON DELETE SET NULL` constraints were all already in place. Gap #1 leans on the existing chain.
- Stripe wiring — Stripe customer NOT touched by Gap #1 (intentional, financial-records retention).
- All other landing-page sections — only the hero section, navbar, scroll indicator, and chip cluster got mobile-targeted className adjustments. Pricing, FAQ, trust bar, testimonial sections etc. were not touched.
- Server keys / env vars — no env changes.

---

## Open / parked items at session close

| Item | Status | Notes |
|---|---|---|
| Gap #1 Phase 6 — E2E with disposable account | ⚠️ Pending operator task | See `docs/superpowers/plans/2026-05-18-gap1-self-serve-delete-account.md` Phase 6 steps 1-4. ~10 min hands-on. |
| Mobile hero ambient motion | 🅿️ Parked indefinitely | 10 rounds tried, all rolled back. If revisiting: design brief + canvas/WebGL, not CSS. |
| Original landing/UX backlog | Unchanged | See `BACKLOG.md` items D1-D11 + U1-U9 + S1-S5. None touched this session except the privacy disclosure (Gap #3). |

---

## Style conventions reinforced this session

- **Every commit message must explain WHY, not just WHAT.** See the commit log — each message names the user-visible symptom, the root cause, and the trade-off. Future Claudes reading `git log` learn the system.
- **One change per commit.** Two-file changes for related concerns are OK (e.g. `.tsx` + `.css` for a single UI fix). Unrelated work goes in separate commits.
- **`npx tsc --noEmit` clean before every commit.** Build pipeline runs `tsc` then `vite build` (`vercel-build`), so any TS error fails the deploy.
- **Multi-agent reviewer required for destructive endpoint code.** Gap #1 Phase 1 (backend) and Phase 3 (UI) both got general-purpose subagent review before commit. Same standard applies to anything touching `DELETE`, `Stripe`, or `auth.users`.
- **`npm run smoke` 11/11 mandatory after every push that touches `/api/`.** Catches the entire ERR_MODULE_NOT_FOUND class of regressions in seconds.
- **Mobile fixes use `lg:` overrides to preserve desktop verbatim.** Pattern: change the mobile className, then add `lg:<original-value>` to restore desktop. Verified visually each round.

---

## Files modified this session (full list)

| File | Reason |
|---|---|
| `api/user/index.ts` | +`handleDeleteAccount` + INLINED HELPERS block (~150 LOC) + dispatcher case |
| `src/services/api.ts` | +`deleteAccount()` wrapper |
| `src/components/Account.tsx` | +Danger-Zone "Delete account" typed-DELETE UI |
| `src/components/PrivacyPolicy.tsx` | +Section 3 + Section 8 cv_summary disclosures |
| `src/components/LandingPage.tsx` | Mobile fixes: hero spacing, nav backdrop, chip cluster, Scroll-indicator visibility, hero gradient |
| `src/components/Hero3DScene.tsx` | Constant rotation, removed hover-state speed boost |
| `src/index.css` | (Various round adds + reverts — net zero animation code in final state) |
| `vercel.json` | +`/api/delete-account` rewrite |
| `scripts/smoke-test-deploy.mjs` | +`/api/delete-account` check (10/10 → 11/11) |
| `index.html` | +static-fallback hidden by default + `<noscript>` override for JS-less crawlers |
| `BACKLOG.md` | RESOLVED entries for Gaps #1 and #3 |
| `docs/superpowers/plans/2026-05-18-gap1-self-serve-delete-account.md` | Plan checkboxes synced (Phase 1-5 done) |
| `docs/superpowers/plans/2026-05-18-gap3-privacy-policy-cv-summary.md` | Plan checkboxes synced |

---

## End of session
