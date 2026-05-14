# Rebrand hand-off — Vantage → AimVantage

**Date:** 2026-05-14
**Status:** In-code rebrand complete (8 commits, batches 1-9). External-services work below MUST be done by Gio — I can't touch any of these from code.

---

## Why the rebrand happened

- Bare "Vantage" is unrankable on SERP (Vantage Markets / Data Centers / Aston Martin / Towers / Lenovo own it).
- "AimVantage" (closed compound) matches the `aimvantage.uk` domain and has near-zero SERP collision.
- Same operator, same product, same domain. Knowledge Graph entity continuity preserved via `alternateName` arrays in all JSON-LD.

Council research lives in conversation history (3 LLM Council reviewers — all PROCEED-WITH-CHANGES).

---

## Done in code (batches 1-9, all live on master)

| Batch | Commit | Scope |
|---|---|---|
| 1+2 | `8204676` | `index.html`, `SEO.tsx`, manifests (webmanifest, openapi, ai-plugin, opensearch, feed, llms, llms-full, rss, atom, robots, humans, sitemap-images, sitemap-pages, SearchPage.tsx) |
| 3 | `23d662c` | `LandingPage.tsx` + `App.tsx` (highest-visibility UI, 27+26 mentions) |
| 4 | `5b5a5e0` | Auth screens (Login, Register, ForgotPassword, ResetPassword) |
| 5 | `88a01be` | Dashboard, Account, Pricing, About, Press, PressReleases, FAQ, Changelog, Receipts, Privacy, Terms, Cookies |
| 6 | `6475878` | 59 tool pages (Alternatives, Compare, Sample, Tools, all `*Page.tsx`) |
| 7+9 | `c473b20` | Public markdown crawler mirrors + NotFoundPage + 404 HTML in middleware |
| 8 | `dece5d1` | Sitemap `<lastmod>` bumps to 2026-05-14 (signals Googlebot to recrawl) |

---

## What you (Gio) MUST do manually

### Priority 1 — Brand assets (visible-mismatch risk)

- [ ] **Regenerate OG image** (`public/og-image.png`, 1200×630). Current image visually renders the word "Vantage". After deploy, the meta tags say AimVantage but the share-card image says Vantage. Mismatch > 72h is unacceptable per LLM Council reviewer #2 — paid-acquisition landings will look phishy.
- [ ] **Regenerate favicon + apple-touch-icon** if either is a stylised wordmark (the SVG favicon may just be the BrainCircuit icon — if so, no work needed).
- [ ] **Regenerate `public/icon-192.png` and `public/icon-512.png`** (PWA install icons) if they show "Vantage" text.

### Priority 2 — External services (visible to paying users)

- [ ] **Stripe product names** in the Stripe Dashboard. Currently products are named "Vantage Starter / Pro / Premium". Rename to "AimVantage Starter / Pro / Premium". This updates: invoice line items, receipt emails, customer portal display. _Irreversible audit-log entry — do this once you're ready._
- [ ] **Supabase email templates** (Auth → Email Templates):
  - Confirmation email subject + body
  - Magic-link email subject + body
  - Password recovery email subject + body
  - Email-change email subject + body
  - Update the "Site URL" display name in Project Settings → API
- [ ] **Google OAuth consent screen** (Google Cloud Console → APIs & Services → OAuth consent screen): app name "Vantage" → "AimVantage", logo, app domain. Re-verification is NOT required for a name change (only domain change triggers it).
- [ ] **Vercel project display name** (optional): rename `vantage` Vercel project to `aimvantage`. The `*.vercel.app` URLs change but production domain is unaffected.

### Priority 3 — Search engines + analytics

- [ ] **Google Search Console**: submit the updated sitemap (`https://aimvantage.uk/sitemap.xml`). Already auto-discovered, but a manual ping accelerates re-crawl.
- [ ] **Bing Webmaster Tools** + **IndexNow**: run `INDEXNOW_KEY=<key> npx tsx scripts/indexnow-ping.ts` from the repo. Key setup instructions in the script header.
- [ ] **Google Analytics 4 + Microsoft Clarity**: rename the property from "Vantage" to "AimVantage" (cosmetic only — won't affect tracking).
- [ ] **ICO registration**: the data-protection registration is filed against your name + the trading name. The trading-name change "Vantage AI" → "AimVantage" can be updated via the ICO online portal. Not legally required (a trading name is not a legal entity) but worth doing for consistency.

### Priority 4 — Trademark (file in parallel with public launch)

- [ ] **UK IPO trademark filing** for "AimVantage" in:
  - Class 9 (downloadable software, SaaS)
  - Class 35 (job-application services, career advisory)
  - Class 41 (career education / training content)
  - Class 42 (SaaS, AI-as-a-service)

  Cost ~£170 + £50 per extra class (so ~£320 for all 4). Takes ~4 months. File via https://www.gov.uk/government/organisations/intellectual-property-office. Search the registry first — Reviewer #1's research showed no UK trademark on "AimVantage" as of 2026-05-14, but verify before paying.

### Priority 5 — Social + external profiles

- [ ] **GitHub repo rename** (optional): `vantage` → `aimvantage`. GitHub auto-redirects. Update any external badges/links.
- [ ] **Product Hunt** listing: update product name + tagline + logo.
- [ ] **TheresAnAIForThat / Submit AI Tools / AiToolzDir** entries (linked from `sameAs` in Organization JSON-LD): submit name update.
- [ ] **DEV.to / Hashnode** author profile + crosspost archive: bio update.
- [ ] **YouTube channel**: rename `Vantage` → `AimVantage` (channel handle changes are limited to once every 14 days — plan the timing).
- [ ] **LinkedIn / X / Bluesky** social bios if any.

---

## What was deliberately NOT changed (per scope rules)

- File paths, folder names, component identifiers (`LandingPage.tsx`, `vantage/` repo root) — internal references with no SEO value.
- `localStorage` keys (`vantage-theme`, `vantage-cookie-consent`, `vantage-geo`) — changing these would log out / re-prompt every existing user.
- Lowercase `vantage` in URL slugs and the `web+vantage` PWA protocol handler.
- The `aimvantage.uk` domain (the asset we kept).
- Historical content in `public/blog/*.md`, `src/data/blogPosts*.ts`, `src/data/caseStudies.ts`, `src/data/sampleAnalyses.ts`, `src/data/pressReleases.ts`, `src/data/interviewQuestions.ts` — content age signal.
- `docs/*`, `video-scripts/*`, internal planning markdown — internal-only.
- Internal mechanism-name comments in code (e.g. `// Apply via Vantage handler`) — code identifiers.
- Competitor disambiguation strings (Vantage Markets, Vantage Recruitment, Vantage Consulting, Vantage Data Centers, Vantage Towers, AI-Vantage Training, Vantagepoint AI, Aston Martin Vantage, Lenovo Vantage) — these are NAMES OF OTHER COMPANIES.
- Tagline ("Clarity in the Chaos") — A/B test before replacing.

---

## SERP recovery expectations

- Google may keep serving the old cached title for **2-6 weeks** before fully replacing with "AimVantage".
- Transient **CTR dip** likely as searchers don't yet recognise the new mark.
- The `alternateName` arrays in JSON-LD prevent Knowledge Graph entity fragmentation.
- The sitemap `<lastmod>` bump (Batch 8) accelerates re-crawl.
- Once Stripe + Supabase templates are updated AND OG image regenerated, you're at parity for paid acquisition.
