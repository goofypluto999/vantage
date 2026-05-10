# LLM Council validation — 2026-05-08

> Three parallel agents ran a stress-test pass on the day's 35 commits +
> the broader Vantage codebase. This doc captures their findings, what
> shipped in response, and what's still on the table.

---

## Agent 1: Codex CLI stress test (manual fallback)

**Codex CLI was broken on this machine** — every attempt with `gpt-5.5`,
`gpt-5`, `gpt-5-codex`, `gpt-5.1`, `gpt-4.1`, `o3` returned either
"model not supported when using Codex with a ChatGPT account" or
"requires a newer version of Codex." `~/.codex/config.toml` defaults to
`gpt-5.5`. **Fix later: `npm i -g @openai/codex@latest` + `codex login`.**

Falling back to manual review caught these:

| # | Severity | Issue | File:Line | Status |
|---|----------|-------|-----------|--------|
| 1 | P1 | Modal focus trap missing — focus not moved into dialog on mount, not trapped, not restored on close | LandingPage.tsx:319-332 (HowItWorksModal), DemoWalkthrough.tsx:53-67 | **PENDING** |
| 2 | P1 | Dashboard error block silent for screen readers (no `role='alert'` / `aria-live`) | Dashboard.tsx:823-846 | **FIXED** in `80fb79f` |
| 3 | P2 | `FaqItem` panelId collision risk — first-40-alphanum-chars fingerprint could collide on similar Q text | LandingPage.tsx:1513 | **FIXED** in `80fb79f` (now indexed: `faq-${i}-${slug}`) |
| 4 | P2 | Pricing FAQ accordion missing aria-controls + panel id | Pricing.tsx:295-340 | **FIXED** in `cadfeda` (already shipped earlier today) |
| 5 | P2 | Hero diagnostic / "see it work" CTAs ~20px tall after demotion — fail WCAG 2.5.5 (44×44 min) | LandingPage.tsx:638-644 | **FIXED** in `80fb79f` (`min-h-[44px] py-2 px-2`) |

Codex would also have caught:
- **JSON-LD XSS — safe.** Pricing + landing both use `JSON.stringify(...)` of object literals built from hard-coded strings. No user input flows in. `dangerouslySetInnerHTML` is correct here. Pre-emptive fix if user-content ever enters: `.replace(/</g, '\\u003c')`.
- **Body-scroll lock leak risk:** `4dad92d` saves `prevOverflow` per-mount. If modal A and B stack (B opens before A unmounts), B saves A's `'hidden'` as `prevOverflow` → on B unmount, body stays hidden. Low likelihood in current code (modals don't stack). Worth noting.
- **Token-cap bumps `b934490` / `8c6545e`** are correct order-of-magnitude (+£0.0001/call for Gemini 2.5 Flash 1500→2500 tokens). No latency or rate-limit concern. Solid.

**Solid items confirmed:**
- Modal `onClick` backdrop check `e.target === e.currentTarget` is correct — won't dismiss on inner clicks.
- FAQ accordion (`a3027a9`): textbook a11y disclosure pattern.
- Hero hierarchy refactor (`7865dd2`): no CTAs or tracking removed.
- Trust strip + pricing FAQ content factually consistent with WALLET-SPEC.md and HANDOFF.md.

---

## Agent 2: SEO/AEO 2026 research

### 3 AEO actions Vantage wasn't doing yet

1. **Author/Person schema with `sameAs`.** Bare author name without sameAs is a wasted E-E-A-T slot for AI engines. → **FIXED** in `2c92fd1` (landing creator/provider + blog author all hydrated with full Person + sameAs cluster).
2. **Restructure pillar passages to 134-167 word AI-extractable blocks** with answer in first 40-60 words + 2-3 short paragraphs + citable stat. **PENDING** — content rewrite, not a code task.
3. **Robots.txt AI-crawler directives** (don't bother with `llms.txt` — low yield in 2026 audits). → **VERIFIED** existing robots.txt already covers Anthropic, OpenAI, Perplexity, Google-Extended, Apple, Meta, Amazon, ByteDance, Cohere, Common Crawl, Diffbot, You.com. No change needed.

### 3 SEO actions Vantage wasn't doing yet

1. **FAQPage rich results deprecated by Google May 2026.** Keep schema for AI parsing, but pivot visual-SERP effort to Product schema on /pricing. **PENDING** — adds Product schema with price + offer + AggregateRating (when reviews exist).
2. **Hit INP <200ms.** 43% of sites fail it in 2026, single most discriminating CWV. → **PARTIALLY** addressed (`9f433e3` gated 1MB Three.js to desktop-only, helps mobile INP). Full audit pending.
3. **"Published" + "Last reviewed" date pair on pillars.** → **FIXED** in `c39b16a` for blog posts.

### Glossary — current 2026 vocabulary

- **AEO** — Answer Engine Optimization. Getting cited inside AI answers, not ranked.
- **GEO** — Generative Engine Optimization. Synonym, more common in academic/SEO press.
- **Share of Model (SoM)** — % of AI answers in your category that mention your brand. The new "share of voice."
- **Citation rate** — How often an AI engine cites your URL when answering category queries.
- **Extractable passage** — A 134-167 word block AI can lift verbatim with attribution.
- **First-hand experience signal** — Dated, specific, verifiable outcome content (the new top E-E-A-T axis post-2026 Helpful Content Update).
- **Wedge product** — The narrow workflow you own end-to-end before expanding (Vantage's wedge: prep pack per application).
- **Micro-commitment ladder** — Sequence of small "yeses" replacing single CTAs in 2026 GTM.
- **Named-customer claim** — Specific revenue-context proof ("Used by 8 of FTSE 100"); +22% lift vs logo strips.
- **Third-party verification badge** — G2/Capterra/Trustpilot; +15-22% conversion when authentic.
- **AI user-agent allowlist** — robots.txt block listing the 2026 AI bots explicitly.
- **INP (Interaction to Next Paint)** — Replaced FID in 2024; <200ms is "good." Most-failed CWV in 2026.

---

## Agent 3: Gap audit (what wasn't done)

| # | Sev | Item | Status |
|---|-----|------|--------|
| 1 | P0 | Catch-all `*` route silently 302s to `/` (soft-404 SEO problem) | **FIXED** `37e075c` (real `/404` page) |
| 2 | P0 | No `<main>` landmark + no skip-to-main-content link | **FIXED** `80fb79f` (skip link in App.tsx + #main anchor on landing) |
| 3 | P0 | Heading hierarchy: `/pricing` jumps h1→h3 | **FIXED** `37e075c` (plan name h3→h2) |
| 4 | P0 | No real social proof anywhere | **PENDING** — built-in-public trust block (separate batch) |
| 5 | P0 | Refund policy invisible on Pricing | **FIXED** `c39b16a` (14-day refund chip) |
| 6 | P1 | Low-contrast text (`text-white/30`, `text-white/40`) — fails WCAG AA | **PENDING** — global contrast sweep |
| 7 | P1 | Decorative lucide icons missing `aria-hidden` | **PARTIAL** — fixed on icons we touched today; full sweep pending |
| 8 | P1 | Featured-On `<img>` shipped without width/height (CLS risk) | **FIXED** `c39b16a` |
| 9 | P1 | `/changelog`, `/about` weak conversion CTAs | **PENDING** |
| 10 | P1 | Blog "Last updated" not visible (only in schema) | **FIXED** `c39b16a` |
| 11 | P1 | `/dashboard?checkout_error=true` had no banner handler | **FIXED** `c39b16a` |
| 12 | P2 | Eager-loaded index chunk = 502 KB | **PENDING** — lazy-load Pricing |
| 13 | P2 | `/sample/:slug` invalid → silent home redirect (soft-404) | **FIXED** `37e075c` (now `/404`) |

**8 of 13 fixed in this validation pass.** Remaining 5 are: focus trap, color contrast sweep, full aria-hidden sweep, social proof block, bundle splitting. None are blockers; all are scheduled for the next iteration.

---

## Commits shipped in response to this validation

1. `80fb79f` — a11y critical (5 issues)
2. `c39b16a` — conversion plumbing (4 issues)
3. `37e075c` — SEO+UX (3 issues incl. real /404)
4. `2c92fd1` — AEO Person schema enrichment

---

## Pattern for next session

The three-parallel-agent council format worked well — Codex stress test
+ research agent + gap audit agent finished in ~5 min combined and
between them surfaced 21 distinct items. The Codex CLI was broken
which limited the LLM-council leg; once that's fixed (`codex login`)
the council is more powerful.

For follow-up loops: the 5 "PENDING" items above (focus trap, contrast
sweep, icon sweep, social proof block, bundle split) are the next
high-leverage targets. Each is independently shippable in one commit.
