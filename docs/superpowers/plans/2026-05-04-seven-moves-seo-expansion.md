# Seven SEO/Discovery Moves — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 7 SEO and AI-discovery surface expansions for aimvantage.uk that compound real organic traffic over weeks 4-12 post-launch.

**Architecture:** All seven are additive to the existing Vite + React + TypeScript SPA. No new runtime dependencies. Each move is independently deployable; failures in one do not affect others. Cross-cutting verification: `npx tsc --noEmit` + `npm run build` + manual content review. No unit-test framework exists in this codebase, so verification is type-check + build-check + content-check, in that order.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS v4, react-router-dom, react-helmet-async (SEO meta), JSON-LD via `<script type="application/ld+json">` inside `<Helmet>`, Vercel deploy.

**Reality constraints baked in:**
- Vercel Hobby plan limit: 12 serverless functions (currently using 12). No new API endpoints.
- No unit test runner — `npx tsc --noEmit` is the type gate.
- React Router (not SSR), so all schema is rendered client-side via Helmet. Crawlers that don't run JS hit the static fallback in `index.html#root > [data-static-fallback]`.
- Branch protection blocks pushes to `master` from this agent — Gio runs `git push origin master` after each commit.

---

## Chunk 1: Programmatic `/salary/[role]` pages

**Why:** "[role] salary 2026" queries are 5-50x higher volume than "[role] interview prep." Pulls top-of-funnel candidates 3-6 months before they need Vantage. Ranks fast on programmatic SEO if the page is uniquely useful.

**Approach:** One `<SalaryPage>` component reading from a `salaryData.ts` data file. 13 roles aligned with existing `/interview-questions/[role]` taxonomy so cross-linking is natural. Each page has unique:
- UK + US median, 25th, 75th, 90th percentile (cited to BLS / ONS / public sources)
- Top 3 factors that move salary for the role
- Common compensation pitfalls
- Internal link to matching `/interview-questions/[role]` and `/interview-prep/{company}` pages

**Schema:** `BreadcrumbList` + `Dataset` (Google rich-results-eligible for salary data) + `FAQPage`.

### Files

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/salaryData.ts` | Salary profiles for 13 roles. Median + percentile ranges + factors + sources. ~400 lines. |
| Create | `src/components/SalaryPage.tsx` | Renders one salary page from `useParams<{role}>()` + lookup. ~250 lines. |
| Create | `src/components/SalaryHubPage.tsx` | Lists all 13 roles with median + sparkline. ~120 lines. |
| Modify | `src/App.tsx` | Add `<Route path="/salary/:role" element={<SalaryPage />} />` and `/salary` hub. |
| Modify | `public/sitemap-pages.xml` | +14 entries (1 hub + 13 roles). Priority 0.85. |
| Modify | `public/llms.txt` | New `## Salary by role` section listing all 13 URLs. |

### Tasks

- [ ] **1.1: Create `src/data/salaryData.ts`** with 13 roles × salary profile fields. Cite each number to BLS / ONS / public source. Use the schema:
  ```typescript
  export interface SalaryProfile {
    slug: string;             // matches /interview-questions/[role]
    role: string;
    description: string;      // 1 sentence
    uk: { median: number; p25: number; p75: number; p90: number; currency: 'GBP'; source: string };
    us: { median: number; p25: number; p75: number; p90: number; currency: 'USD'; source: string };
    factors: string[];        // 3-5 things that move salary for this role
    pitfalls: string[];       // 2-3 negotiation traps
    relatedRoles: string[];   // 2-3 slugs of adjacent roles
    yearOfData: number;       // for transparency in citations
  }
  export const salaryProfiles: SalaryProfile[]; // 13 entries
  ```
  Roles must match: software-engineer, product-manager, data-scientist, product-designer, marketing-manager, sales-development-rep, customer-success-manager, frontend-developer, backend-developer, ux-researcher, devops-engineer, engineering-manager, account-executive.

- [ ] **1.2: Verify data file types** with `cd "C:\Cloaude Logic\vantage" && npx tsc --noEmit`. Expected: zero errors.

- [ ] **1.3: Create `src/components/SalaryHubPage.tsx`** — hub at `/salary`. Lists all 13 with role name + UK median + US median + small "see breakdown" link. Schema: `BreadcrumbList` + `ItemList` linking to all 13.

- [ ] **1.4: Create `src/components/SalaryPage.tsx`** — single role page. Uses `useParams<{ role: string }>()`, looks up from `salaryProfiles`, renders 404-redirect if not found. Sections in order: hook line + UK card + US card + factors that move salary + pitfalls + comparison-to-related-roles + cross-links to `/interview-questions/<role>` and `/interview-prep` hub. Schema: `BreadcrumbList` + `Dataset` (with `creator: { @type: Organization, name: Vantage }` and `distribution` referencing the source citation) + `FAQPage` (3 Q+A: "How accurate is this 2026 salary data," "Should I negotiate based on this," "Where does the data come from").

- [ ] **1.5: Wire routes in `src/App.tsx`**:
  ```tsx
  import SalaryPage from './components/SalaryPage';
  import SalaryHubPage from './components/SalaryHubPage';
  // ... in Routes:
  <Route path="/salary" element={<SalaryHubPage />} />
  <Route path="/salary/:role" element={<SalaryPage />} />
  <Route path="/salaries" element={<Navigate to="/salary" replace />} />
  ```

- [ ] **1.6: Add 14 entries to `public/sitemap-pages.xml`** — `/salary` hub at priority 0.85 + 13 role pages at 0.85 each. Lastmod `2026-05-04`, changefreq `monthly`.

- [ ] **1.7: Add `## Salary by role` section to `public/llms.txt`** — bullet list of all 14 URLs with one-line descriptions.

- [ ] **1.8: Type check + build**:
  ```
  npx tsc --noEmit
  npm run build
  ```
  Expected: tsc 0 errors, build "✓ built in <Ns>" with module count = previous + 3 (SalaryPage, SalaryHubPage, salaryData).

- [ ] **1.9: Visual content review** — read final salary page rendered output (via grep + visual inspection of source). Verify: each role has unique factors (no copy-paste), citations are real public sources, internal links go to existing routes, no fabricated numbers.

- [ ] **1.10: Commit**:
  ```
  git add src/data/salaryData.ts src/components/SalaryPage.tsx src/components/SalaryHubPage.tsx src/App.tsx public/sitemap-pages.xml public/llms.txt
  git commit -m "feat(seo): /salary programmatic pages for 13 roles + hub. UK + US percentile data with public-source citations. Dataset + FAQPage schema. ~14 high-volume long-tail SEO surfaces."
  ```

---

## Chunk 2: `/interview-prep/[company]/[seniority]` depth tier

**Why:** "[company] [seniority] interview" queries (e.g., "google staff engineer interview") have 30-60% of the volume of "[company] interview" but ~10% of the competitive surface. Adding a second URL dimension expands index from 20 cells → 80 cells with substantive unique content per cell.

**Approach:** Five seniority levels: junior, mid, senior, staff, manager. NOT all 20 companies × 5 seniorities = 100 cells (too thin per cell). Instead: top 8 companies × 5 = 40 cells. Each company-seniority cell adds:
- Seniority-specific interview pattern (juniors get coding + culture, staff gets system design + influence)
- Salary range from `salaryData.ts` (Chunk 1 dependency — implement Chunk 1 first)
- Common questions specific to that level
- Related cells (other seniorities at same company + same seniority elsewhere)

**Top 8 companies:** google, meta, amazon, microsoft, openai, anthropic, stripe, apple. (These have the most public interview data and highest search volume.)

### Files

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/data/interviewPrepCompanyPacks.ts` | Add `seniorityVariants` to existing 8 selected companies. ~600 lines added. |
| Create | `src/components/InterviewPrepCompanySeniorityPage.tsx` | Renders one company-seniority cell. ~280 lines. |
| Modify | `src/App.tsx` | Add nested route `/interview-prep/:company/:seniority`. |
| Modify | `public/sitemap-companies.xml` | +40 entries. |
| Modify | `public/llms.txt` | Expand `## Interview prep packs by company` section. |

### Tasks

- [ ] **2.1: Extend the company-pack data structure** in `src/data/interviewPrepCompanyPacks.ts`:
  ```typescript
  export interface SeniorityVariant {
    slug: 'junior' | 'mid' | 'senior' | 'staff' | 'manager';
    label: string;                // "Senior Engineer" / "Engineering Manager"
    titleSuffix: string;          // for SEO: "Senior Software Engineer interview"
    yearsExp: string;             // "5-8 years"
    interviewPattern: string[];   // 3-5 bullets unique to this level
    likelyQuestions: string[];    // 8-10 specific to this level
    levelRubric: string;          // 1 paragraph on what they're looking for
    compRange: { gbp: string; usd: string };  // from salaryData.ts
    commonGaps: string[];         // 2-3 areas this level often falls short
  }
  // Add SeniorityVariant[] to top 8 company packs.
  ```

- [ ] **2.2: For top 8 companies, populate 5 seniority variants each.** 40 unique payloads total. Each payload must be specific — "Google staff engineer focuses on design-doc culture, mentorship, cross-team influence" not "staff engineers do staff things." Time-box: 25 min per company-seniority cell × 40 = ~17 hours of content. Realistic compression: 6-8 min per cell with strong references = 4-5 hours. Source from levels.fyi (public), Blind (public), each company's own engineering blog, and existing Vantage company packs.

- [ ] **2.3: tsc check** — `npx tsc --noEmit`. Expected zero errors.

- [ ] **2.4: Create `src/components/InterviewPrepCompanySeniorityPage.tsx`** — component reads `useParams<{ company, seniority }>()`, looks up the variant, renders 404-redirect if missing. Schema: `BreadcrumbList` (4 levels: Home > Interview Prep > Company > Seniority) + `FAQPage` (4 Q+A specific to seniority) + `Article` (the prep guide itself).

- [ ] **2.5: Wire route in `src/App.tsx`**:
  ```tsx
  import InterviewPrepCompanySeniorityPage from './components/InterviewPrepCompanySeniorityPage';
  // After /interview-prep/:company:
  <Route path="/interview-prep/:company/:seniority" element={<InterviewPrepCompanySeniorityPage />} />
  ```

- [ ] **2.6: Add 40 entries to `public/sitemap-companies.xml`** — priority 0.85 each.

- [ ] **2.7: Update `public/llms.txt`** — under `## Interview prep packs by company`, list each company with its 5 seniority sub-paths.

- [ ] **2.8: Type + build check**:
  ```
  npx tsc --noEmit
  npm run build
  ```

- [ ] **2.9: Doorway-page audit** — for each company, manually read 2 random seniority cells. Confirm: copy is not 80%+ duplicated between cells. If duplication detected, rewrite. Doorway-page penalty risk is real here.

- [ ] **2.10: Commit**:
  ```
  git add src/data/interviewPrepCompanyPacks.ts src/components/InterviewPrepCompanySeniorityPage.tsx src/App.tsx public/sitemap-companies.xml public/llms.txt
  git commit -m "feat(seo): /interview-prep/:company/:seniority depth tier (top 8 companies × 5 seniorities = 40 new cells). Each cell has unique interview pattern, salary range, level rubric, common gaps. Dependency on Chunk 1 salary data."
  ```

---

## Chunk 3: Cross-link blog posts → /alternatives + /sample + /faq

**Why:** Internal linking compounds: blog posts driving topical authority can pass juice to commercial-intent pages (/alternatives) only if linked. Currently blog posts are dead-end leaves.

**Approach:** Extend `BlogPost.tsx` with a "Related" footer section that picks 3-5 cross-links based on the post's tags. Tag-to-target mapping table. No data file changes.

### Files

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/components/BlogPost.tsx` | Add `<RelatedLinks />` section after the article body. |
| Create | `src/data/blogCrossLinks.ts` | Tag-to-target mapping + scoring helper. ~80 lines. |

### Tasks

- [ ] **3.1: Create `src/data/blogCrossLinks.ts`**:
  ```typescript
  export interface CrossLinkTarget {
    label: string;
    href: string;
    type: 'alternatives' | 'sample' | 'faq' | 'tool' | 'guide';
    tags: string[];     // post tags that should surface this
  }
  export const crossLinks: CrossLinkTarget[]; // ~25 entries

  export function getCrossLinks(postTags: string[], maxCount: number): CrossLinkTarget[] {
    // Score each crossLinks entry by tag-overlap count, return top N.
  }
  ```
  Targets must include: /alternatives/jobscan, /alternatives/teal, /alternatives/final-round-ai, /alternatives/resume-worded, /alternatives, /sample/anthropic-senior-pm, /sample/stripe-staff-pm, /sample/openai-ml-eng, /faq, /compare, /linkedin-optimization, /tools, /roast, /playbook, /laid-off.

- [ ] **3.2: Modify `src/components/BlogPost.tsx`** to render `<RelatedLinks />` after the article body, before the existing related-posts section. Use `getCrossLinks(post.tags, 4)`. Style: small card grid matching existing Related section.

- [ ] **3.3: Type + build**:
  ```
  npx tsc --noEmit
  npm run build
  ```

- [ ] **3.4: Spot-check 3 blog posts**: load `/blog/i-shipped-fake-review-schema-then-caught-myself`, `/blog/the-bug-that-killed-every-signup-for-four-days`, and `/blog/how-to-prep-for-any-interview-in-20-minutes`. Verify each shows 4 contextually-relevant cross-links (not the same 4 links on every page).

- [ ] **3.5: Commit**:
  ```
  git add src/data/blogCrossLinks.ts src/components/BlogPost.tsx
  git commit -m "feat(seo): contextual cross-links from blog posts to /alternatives, /sample, /faq, and other commercial-intent pages. Tag-driven, 4 per post. Internal linking distributes topical authority to conversion pages."
  ```

---

## Chunk 4: `/case-studies` section structure

**Why:** "[Company] case study Vantage" and "AI job prep case study" queries have low but specific search intent. URLs reserved early rank when filled later.

**Approach:** Hub at `/case-studies` + 2 honest case studies based on Gio's own usage of Vantage to land jobs (founder-as-first-customer is honest, verifiable, not "thin content"). 2 placeholder URL slots reserved for future customer wins, marked clearly as "Q3 2026 — case study coming."

**Hard constraint:** No fake case studies. Each one is either Gio's own real journey or honestly marked "coming soon." This avoids the same fabrication trap from `i-shipped-fake-review-schema-then-caught-myself`.

### Files

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/caseStudies.ts` | 2 real (founder) + 2 placeholder. ~350 lines. |
| Create | `src/components/CaseStudiesHub.tsx` | Hub listing all 4. ~140 lines. |
| Create | `src/components/CaseStudyPage.tsx` | Single case study render. ~200 lines. |
| Modify | `src/App.tsx` | Routes `/case-studies` and `/case-studies/:slug`. |
| Modify | `public/sitemap-pages.xml` | +5 entries. |
| Modify | `public/llms.txt` | Add `## Case studies` section. |

### Tasks

- [ ] **4.1: Create `src/data/caseStudies.ts`** with 2 real (Gio's journey) + 2 placeholder:
  ```typescript
  export interface CaseStudy {
    slug: string;
    status: 'live' | 'coming-soon';
    title: string;
    subtitle: string;
    persona: { role: string; industry: string; situation: string };
    outcome: string;          // One-line headline result
    timeline: string;         // "April 2026 - May 2026"
    sections: CaseStudySection[];
    publishedAt?: string;
    expectedAt?: string;      // for coming-soon
  }
  ```
  Real case study #1: "Building Vantage in 6 weeks while applying to 50+ jobs/week" — Gio's actual founder story, with real numbers from his own application history.
  Real case study #2: "From £0 in revenue at launch to first paying user" — when first paying user lands. (For now, prepare structure; mark as coming-soon if no paying user yet.)
  Placeholders: "Senior PM at [Series-B SaaS] — case study coming Q3 2026", "Software Engineer transitioning to ML — case study coming Q3 2026".

- [ ] **4.2: Create `src/components/CaseStudiesHub.tsx`** — hub at `/case-studies`. Renders the 2 live + 2 coming-soon clearly differentiated. Schema: `BreadcrumbList` + `ItemList`.

- [ ] **4.3: Create `src/components/CaseStudyPage.tsx`** — single page from `useParams<{ slug }>()`. For coming-soon entries, render an honest "this case study is in progress, expected by [date]" placeholder with a link back to /sample for live examples. Schema: `BreadcrumbList` + (if live) `Article`.

- [ ] **4.4: Wire routes**:
  ```tsx
  import CaseStudiesHub from './components/CaseStudiesHub';
  import CaseStudyPage from './components/CaseStudyPage';
  <Route path="/case-studies" element={<CaseStudiesHub />} />
  <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
  <Route path="/case-study" element={<Navigate to="/case-studies" replace />} />
  ```

- [ ] **4.5: Sitemap + llms.txt** — +5 entries to sitemap, new section in llms.txt.

- [ ] **4.6: Type + build + smoke**:
  ```
  npx tsc --noEmit
  npm run build
  ```

- [ ] **4.7: Honesty audit** — read each case study's "outcome" line. Confirm none of them claim outcomes that haven't happened. The placeholder pages must say "coming soon" plainly, not pretend to be real.

- [ ] **4.8: Commit**:
  ```
  git add src/data/caseStudies.ts src/components/CaseStudiesHub.tsx src/components/CaseStudyPage.tsx src/App.tsx public/sitemap-pages.xml public/llms.txt
  git commit -m "feat(seo): /case-studies section with 2 founder-real + 2 coming-soon placeholder URLs. Honesty-first — no fake case studies, placeholders clearly marked."
  ```

---

## Chunk 5: JSON Feed + Atom feed enrichment

**Why:** RSS/Atom/JSON Feed crawlers (Feedly, Inoreader, FreshRSS, Reeder) auto-discover and pull blog posts. Currently the feed metadata is sparse. Enrichment increases pickup probability and rich preview quality.

**Approach:** Modify the prebuild script `scripts/generate-feeds.mjs` to add: full content (not excerpt), author objects with URL, channel-level icon + favicon URLs, language, and per-item categories (from tags).

### Files

| Action | Path | Responsibility |
|---|---|---|
| Modify | `scripts/generate-feeds.mjs` | Enrich the three feed generators. ~150 lines added. |
| Auto-regenerated | `public/rss.xml`, `public/atom.xml`, `public/feed.json` | Output. |

### Tasks

- [ ] **5.1: Read current `scripts/generate-feeds.mjs`** to confirm the existing shape (it's referenced by `package.json` prebuild). Identify where the channel + item-level metadata is built.

- [ ] **5.2: Enrich JSON Feed (1.1 spec)** at https://www.jsonfeed.org/version/1.1/ — add:
  ```javascript
  {
    "version": "https://jsonfeed.org/version/1.1",
    "title": "Vantage Blog",
    "home_page_url": "https://aimvantage.uk/blog",
    "feed_url": "https://aimvantage.uk/feed.json",
    "description": "Long-form guides on AI job prep, ATS, cover letters, and interview strategy",
    "icon": "https://aimvantage.uk/logo-512.png",
    "favicon": "https://aimvantage.uk/favicon.svg",
    "language": "en-GB",
    "authors": [{ "name": "Gio", "url": "https://aimvantage.uk/press" }],
    "items": [{
      "id": "https://aimvantage.uk/blog/<slug>",
      "url": "https://aimvantage.uk/blog/<slug>",
      "title": "<post.title>",
      "summary": "<post.description>",
      "content_html": "<full HTML rendering of post.sections>",
      "content_text": "<plaintext rendering of post.sections>",
      "date_published": "<post.publishedAt>T00:00:00Z",
      "date_modified": "<post.updatedAt or publishedAt>T00:00:00Z",
      "tags": post.tags,
      "authors": [{ "name": post.author }]
    }]
  }
  ```

- [ ] **5.3: Enrich Atom 1.0** (RFC 4287) — add `<icon>`, `<logo>`, `<rights>`, full `<content type="html">` per entry, `<author><uri>` per entry.

- [ ] **5.4: Enrich RSS 2.0** — add `<image>` channel-level, `<atom:link rel="self">`, `<media:thumbnail>` per item, `<dc:creator>` namespace.

- [ ] **5.5: Generate test output**:
  ```
  cd "C:\Cloaude Logic\vantage" && node scripts/generate-feeds.mjs
  ```
  Inspect `public/feed.json`, `public/atom.xml`, `public/rss.xml`. Validate with:
  - JSON Feed: paste into https://validator.jsonfeed.org/
  - Atom: paste into https://validator.w3.org/feed/
  - RSS: same validator

- [ ] **5.6: Build check**:
  ```
  npm run build
  ```
  Expected: prebuild runs cleanly, all three feed files regenerated in `dist/`.

- [ ] **5.7: Spot-check** the regenerated feeds for the 3 newest posts. Confirm full content, not truncated; tags array populated; author URL points at /press.

- [ ] **5.8: Commit**:
  ```
  git add scripts/generate-feeds.mjs public/rss.xml public/atom.xml public/feed.json
  git commit -m "feat(feeds): enrich RSS, Atom, and JSON Feed metadata. Channel icon + favicon, full content per item, author URLs, tag categories. Better pickup by Feedly/Inoreader/FreshRSS."
  ```

---

## Chunk 6: Lighthouse + CWV audit and fixes

**Why:** Core Web Vitals (LCP, INP, CLS) are confirmed Google ranking factors. The current `LandingPage.tsx` is heavy (Three.js DotGlobe + scroll animations + LiveDemoReel) and likely has a poor LCP. Each percentile point on LCP correlates with measurable SERP-rank delta in real-world tests.

**Approach:** Run Lighthouse against the production build. Identify top 3 issues. Fix them. Re-measure. Don't try to fix everything — diminishing returns past LCP < 2.5s.

### Files

| Action | Path | Responsibility |
|---|---|---|
| Likely modify | `src/components/LandingPage.tsx` | Lazy-load DotGlobe, defer LiveDemoReel below the fold. |
| Possibly modify | `index.html` | Preload critical fonts. |
| Possibly modify | `vite.config.ts` | Manual chunks to keep Three.js out of the initial bundle. |
| Possibly modify | `src/components/LiveDemoReel.tsx` | Lazy-load if used. |

### Tasks

- [ ] **6.1: Install Lighthouse** locally if not already:
  ```
  cd "C:\Cloaude Logic\vantage" && npx lighthouse --version
  ```
  If not installed: `npm install -g lighthouse` (one-time, system-wide).

- [ ] **6.2: Build the production bundle**:
  ```
  npm run build
  npm run preview &
  ```
  (Vite preview serves on port 4173.)

- [ ] **6.3: Run Lighthouse against the homepage**:
  ```
  npx lighthouse http://localhost:4173/ --output=json --output-path=./lighthouse-baseline.json --chrome-flags="--headless"
  ```
  Inspect: LCP, INP, CLS, TBT, performance score.

- [ ] **6.4: Identify top 3 issues** from the report's "Opportunities" and "Diagnostics" sections. Likely candidates based on existing code:
  - Three.js DotGlobe imported eagerly → make `React.lazy(() => import('./DotGlobe'))` with Suspense fallback
  - LiveDemoReel imported eagerly → lazy-load below the fold
  - Heavy fonts loaded synchronously → add `<link rel="preload" as="font" crossorigin>` for the actually-used weights only

- [ ] **6.5: Apply fixes one at a time.** After each fix:
  ```
  npm run build && npx lighthouse http://localhost:4173/ --output=json --output-path=./lighthouse-after-fix-<n>.json --chrome-flags="--headless"
  ```
  Compare to baseline. Keep the change if it improves score, revert if it regresses.

- [ ] **6.6: Specifically: code-split Three.js bundle.** In `vite.config.ts`:
  ```typescript
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom'],
          gsap: ['gsap'],
        }
      }
    }
  }
  ```
  Verify build output: Three.js chunk should be a separate file from the main bundle.

- [ ] **6.7: Lazy-load DotGlobe in `src/components/LandingPage.tsx`**:
  ```tsx
  const DotGlobe = React.lazy(() => import('./DotGlobe'));
  // ...
  <Suspense fallback={<div className="aspect-square w-full max-w-[600px]" />}>
    <DotGlobe />
  </Suspense>
  ```

- [ ] **6.8: Final Lighthouse run** + diff baseline vs after. Target: LCP under 2.5s, performance score > 75. Commit even partial improvements.

- [ ] **6.9: Type + build check**:
  ```
  npx tsc --noEmit
  npm run build
  ```

- [ ] **6.10: Commit**:
  ```
  git add vite.config.ts src/components/LandingPage.tsx [+ any others]
  git commit -m "perf: code-split Three.js, lazy-load DotGlobe + LiveDemoReel, manual chunk strategy. Lighthouse LCP <baseline>s → <after>s on landing page. CWV-improvement is a confirmed Google ranking factor."
  ```

---

## Chunk 7: SoftwareSourceCode schema + GitHub topics for `cv-mirror-mcp`

**Why:** The cv-mirror-mcp open-source repo is one of the strongest backlinks aimvantage.uk has (sister-product → main product). Making the repo more discoverable in GitHub search and via schema lifts both. SoftwareSourceCode schema specifically helps AI assistants cite the package.

**Approach:** Add JSON-LD `SoftwareSourceCode` schema to the README via HTML comment + standard schema in any docs site if one exists. Add comprehensive GitHub topics. Optimize package metadata in the repo's `package.json` for npm search.

**Hard constraint:** This repo lives on GitHub, not in `C:\Cloaude Logic` locally. Two execution options:
- **Option A:** Gio clones the repo locally; we make changes and he pushes.
- **Option B:** Make all changes via `gh` CLI API calls (requires repo write permissions, which his existing token has).

This plan assumes Option B (gh CLI) since branch protection on master here doesn't apply to a different repo.

### Files (in cv-mirror-mcp repo, NOT vantage)

| Action | Path (in cv-mirror-mcp) | Responsibility |
|---|---|---|
| Modify | `README.md` | Add JSON-LD `SoftwareSourceCode` block in HTML comment + Schema.org-friendly markdown headings. |
| Modify | `package.json` | Optimize description, keywords, homepage. |
| GitHub API | repo settings | Set topics: mcp-server, ats, resume-parser, cv-parser, jobsearch, hr-tech, ai-tools, claude-skill, anthropic, model-context-protocol. |

### Tasks

- [ ] **7.1: Inspect current cv-mirror-mcp repo state**:
  ```
  gh repo view goofypluto999/cv-mirror-mcp --json topics,description,homepageUrl,defaultBranchRef
  ```
  Note current topics. Plan additions, not replacements.

- [ ] **7.2: Set the homepage URL on the repo**:
  ```
  gh repo edit goofypluto999/cv-mirror-mcp --homepage="https://cv-mirror-web.vercel.app"
  ```

- [ ] **7.3: Add canonical topics**:
  ```
  gh repo edit goofypluto999/cv-mirror-mcp --add-topic mcp-server --add-topic ats --add-topic resume-parser --add-topic cv-parser --add-topic jobsearch --add-topic hr-tech --add-topic ai-tools --add-topic claude-skill --add-topic anthropic --add-topic model-context-protocol
  ```

- [ ] **7.4: Read current `README.md` in the repo**:
  ```
  gh api repos/goofypluto999/cv-mirror-mcp/contents/README.md --jq '.content' | base64 -d | head -50
  ```

- [ ] **7.5: Prepare README enhancement** — at the top of the README, add an HTML comment containing JSON-LD:
  ```html
  <!-- markdownlint-disable-next-line -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "CV Mirror MCP",
    "description": "MCP server that lints a CV against 5 real ATS parsers (Workday, Greenhouse, Lever, Taleo, iCIMS). Pure JS, MIT licensed, no network calls.",
    "codeRepository": "https://github.com/goofypluto999/cv-mirror-mcp",
    "programmingLanguage": "JavaScript",
    "license": "https://opensource.org/licenses/MIT",
    "author": { "@type": "Organization", "name": "Vantage Labs", "url": "https://aimvantage.uk" },
    "keywords": "mcp,ats,resume,cv,workday,greenhouse,lever,taleo,icims,claude,anthropic"
  }
  </script>
  ```
  GitHub renders the README markdown but the embedded `<script>` block is parsed by Google when crawling raw.githubusercontent.com.

- [ ] **7.6: Add a "How to use with Claude" section** to the README pointing readers to https://aimvantage.uk and explaining the npm install + Claude config flow. This earns the backlink from a high-DA repo back to aimvantage.uk.

- [ ] **7.7: Update package.json** in the repo (via gh API or a local clone):
  ```json
  {
    "description": "MCP server: lint a CV against 5 real ATS parsers (Workday, Greenhouse, Lever, Taleo, iCIMS). Pure JS engine, MIT licensed, no network calls.",
    "keywords": ["mcp", "ats", "resume", "cv", "workday", "greenhouse", "lever", "taleo", "icims", "anthropic", "claude", "model-context-protocol"],
    "homepage": "https://cv-mirror-web.vercel.app",
    "repository": { "type": "git", "url": "https://github.com/goofypluto999/cv-mirror-mcp" }
  }
  ```

- [ ] **7.8: Commit changes via the cv-mirror-mcp repo's normal flow.** Either:
  - Clone to `C:\Cloaude Logic\cv-mirror-mcp-repo` (separate from cv-mirror-web), commit, push.
  - Or use `gh api` PUT requests to update files via the GitHub Contents API.

  Concrete command for option 1:
  ```
  cd "C:\Cloaude Logic"
  gh repo clone goofypluto999/cv-mirror-mcp cv-mirror-mcp-repo
  cd cv-mirror-mcp-repo
  # apply README + package.json changes
  git add README.md package.json
  git commit -m "feat(seo): SoftwareSourceCode schema in README + npm keywords + homepage. Lifts repo discoverability for MCP/ATS/CV searches and strengthens backlink to aimvantage.uk."
  git push origin main
  ```

- [ ] **7.9: Verify topics applied** — `gh repo view goofypluto999/cv-mirror-mcp --json topics` should show the full list including the additions.

- [ ] **7.10: No commit needed in the vantage repo for this chunk** — all changes are in the cv-mirror-mcp repo.

---

## Cross-cutting completion tasks

Run these after all 7 chunks are committed in the vantage repo:

- [ ] **C.1: Run IndexNow ping**:
  ```
  cd "C:\Cloaude Logic\vantage" && node scripts/indexnow-ping.mjs
  ```
  Expected output: `[indexnow] OK — <N> URLs accepted by Bing/Yandex/Seznam` where N ≈ 90 + 14 (salary) + 40 (interview-prep depth) + 5 (case-studies) = ~150 URLs.

- [ ] **C.2: Update `DEPLOY-NOW.md`** to reference the seven new surface clusters in the "What's live" header.

- [ ] **C.3: Update `public/llms-full.txt`** with the new sections (Salary, Case Studies, Seniority Tiers).

- [ ] **C.4: Final type + build check** — `npx tsc --noEmit && npm run build`. Expected: zero errors, build under 12s.

- [ ] **C.5: Tell Gio to push** — branch protection blocks agent pushes to master. Show the commits with `git log --oneline origin/master..HEAD`.

---

## Estimated effort + sequencing

| Chunk | Estimated wall time | Blocks |
|---|---|---|
| 1: /salary | 90 min (data + components + verify) | — |
| 2: /interview-prep depth | 4-5 hr (40 cells of unique content) | Chunk 1 (uses salaryData) |
| 3: Blog cross-links | 30 min | — |
| 4: /case-studies | 60 min | — |
| 5: Feed enrichment | 45 min | — |
| 6: Lighthouse + CWV | 90 min (audit + 2-3 fixes + remeasure) | — |
| 7: cv-mirror-mcp schema | 30 min (mostly gh API calls) | — |

**Total: ~9 hours of focused work.** Recommend executing in this order: 1 → 3 → 4 → 5 → 7 → 6 → 2. Reasoning:
- Chunks 1, 3, 4, 5, 7 are independent and quick; do them first to build momentum.
- Chunk 6 (Lighthouse) is a measure-fix-measure loop; better with fresh attention.
- Chunk 2 is the longest single block (40 cells of unique content) and depends on Chunk 1; do it last.

---

## Review loop

After each chunk's tasks are complete and committed, dispatch the plan-document-reviewer subagent to verify the work matches the plan. If any chunk fails review, fix and re-dispatch before proceeding.
