# Deploy-resume punch list — 2026-05-08

**Status as of 2026-05-08 ~03:10 UTC:**
Vercel has not deployed since `Thu, 07 May 2026 23:39:41 GMT`.
Live JS hash: `index-DPyzWxJG.js`. Local just-built: `index-BVAGOd5M.js`+.
Age=18853s ≈ 5h 14min stale.

**17 commits queued on master, NOT deployed.** All pushed to `origin/master`.

## What's queued (in deploy order)

### Conversion-funnel fixes (v40–v47)

| Tag | Commit  | What it ships |
|-----|---------|----------------|
| `v40-roast-handoff`        | c50711f | RoastPage → register handoff; Dashboard reads `vantage:pendingRoast` and surfaces a banner |
| `v41-cost-calculator`      | 62b9f7d | New page `/tools/jobscan-cost-calculator` (sliders, comparison vs Jobscan/Resume Worded/Final Round AI/Teal/LiveCareer) |
| `v42-receipts`             | 3270886 | New page `/receipts` (12 trust-audit cards) + footer link |
| `v43-diagnostic`           | 8ac80a4 | New page `/tools/no-interviews-diagnostic` (5-Q deterministic decision-tree, 7 verdicts) |
| `v44-cleanurls-fix`        | 7bcdf85 | `vercel.json` cleanUrls — fixes prerendered `/<route>/index.html` serving |
| `v45-c5-jd-warn`           | d4e0fe1 | Dashboard.tsx: warn-before-submit when JD missing on ANY host |
| `v46-cta-copy-sweep`       | 3b25726 | **HIGHEST-LEVERAGE FIX:** "3 free analyses" → "10 free prep packs" across 24 files |
| `v47-mobile-tools`         | 3eb6df3 | Hero chip cluster 3→5 tools; mobile drawer surfaces all 5 tools + receipts |

### Tactical Deploy Playbook (v48–v56) — net-new distribution surfaces

| Tag | Commit  | What it ships |
|-----|---------|----------------|
| `v48-identity-opensearch` | ecf778e | rel=me + h-card on /about (IndieWeb identity mesh) + OpenSearch (`/opensearch.xml` + link tag) + `/search` route + `/api/search-suggest` endpoint |
| `v49-markdown-mirrors`    | 5123e7f | 5 agent-readable markdown mirrors (`/markdown/pricing`, `/jobscan-alternative`, `/workday-resume-parser`, `/openai-interview-prep`, `/api`) + `markdownAlternate` SEO prop wired on the 5 source pages |
| `v50-openapi-ai-plugin`   | 0a8a04e | `/openapi.json` (OpenAPI 3.1, 4 public endpoints + planned paid endpoint) + `/.well-known/ai-plugin.json` |
| `v51-pwa-os-ingress`      | dab9473 | site.webmanifest: share_target + file_handlers + protocol_handlers + 3 PWA shortcuts. New routes: `/share-target`, `/open-cv` (launchQueue), `/handle?payload=` (web+vantage:// router). Dashboard reads `vantage:pendingCv`. |
| `v52-webmention`          | e08198a | `/api/webmention` W3C-compliant receiver + `Link: rel="webmention"` header + `database/webmentions.sql` schema |
| `v53-distribution-pack`   | 55749a2 | MCP server (`mcp-server/`, npm package @vantage-ai/mcp-server, 5 tools) + Hugging Face Space (`hf-space/`, Gradio app + 3 sample files) + Postman collection (`public/postman/...`) + `docs/paste-kits-2026-05-08.md` (step-by-step for every external submission) |
| `v54-satisfaction-events` | 314045e | `src/lib/track.ts` query-satisfaction instrumentation (taskStarted, recordTaskCompletion, armExitFastDetector). Wired on /roast, /tools/no-interviews-diagnostic, /tools/jobscan-cost-calculator |
| `v55-og-cards`            | afc1551 | `/api/og?slug=<topic>` Edge endpoint with @vercel/og — generates route-specific PNG cards for 8 topics. Wired as `og:image` on /pricing, /receipts, /roast, /tools/jobscan-cost-calculator, /tools/no-interviews-diagnostic, /ats/workday |
| `v56-websub`              | ab0920c | RSS/Atom/JSON Feed get `<atom:link rel="hub">` + new `scripts/websub-publish.mjs` + chained into `.github/workflows/seo-postdeploy.yml` |

Plus 1 empty-commit nudge (0165c9b) + this punch-list doc commit.

## What Gio needs to do — Vercel side

1. Open https://vercel.com/<your-team>/vantage/deployments
2. Are commits `c50711f` → `ab0920c` showing as queued / building / failed?
3. **If failed:** click the failed deploy → read the build log → either fix the issue or hit Redeploy.
4. **If not even queued:** the GitHub → Vercel webhook is broken. Re-link in Project Settings → Git → reconnect repository.
5. **If just slow:** wait 5-10 min and recheck.

If you're unsure, post a screenshot of the Vercel deployments page in this chat and I'll help diagnose.

## What Gio needs to do — third-party submissions (after deploys land)

See `docs/paste-kits-2026-05-08.md` for the full step-by-step. Summary:

1. **Mastodon** (5 min) — Create `@aimvantage@mastodon.social`, paste pre-written bio, paste Vantage URL in the verification metadata field. Tell me the handle URL and I'll add it to /about.
2. **APIs.guru** (3 min) — Submit `https://aimvantage.uk/openapi.json` at https://apis.guru/add-api with the pre-written description.
3. **Postman API Network** (5 min) — Create a public workspace called "Vantage AI", import `vantage.postman_collection.json`, submit to API Network.
4. **MCP Registry** (10 min) — `cd mcp-server; npm publish --access public`, then PR the pre-written YAML entry to https://github.com/modelcontextprotocol/registry.
5. **Glama** (5 min) — Submit at https://glama.ai/ → "Submit MCP Server" with the pre-filled fields.
6. **Hugging Face Space** (5 min) — Create `vantage-cv-job-fit-preview` Space (Gradio, free CPU), upload the 6 files from `hf-space/`. Tell me the URL and I'll add it as rel=me + free-tool card.

## Verification commands (run when live JS hash changes)

```bash
# Per-route titles (cleanUrls fix)
for path in "/receipts" "/tools/jobscan-cost-calculator" "/tools/no-interviews-diagnostic" "/pricing" "/about" "/roast"; do
  echo -n "$path -> "; curl -s "https://aimvantage.uk$path" | grep -oE '<title>[^<]+</title>' | head -1
done

# CTA copy sweep
curl -s "https://aimvantage.uk/" | grep -oE "Get 10 free prep packs"   # expect 1+

# OpenSearch
curl -s "https://aimvantage.uk/opensearch.xml" | head -5
curl -s "https://aimvantage.uk/api/search-suggest?q=workday" | head -1

# OpenAPI / ai-plugin
curl -s "https://aimvantage.uk/openapi.json" | grep -oE '"version": "[^"]+"' | head -1
curl -s "https://aimvantage.uk/.well-known/ai-plugin.json" | head -3

# PWA manifest
curl -s "https://aimvantage.uk/site.webmanifest" | python -m json.tool | grep -E "share_target|file_handlers|protocol_handlers"

# Webmention
curl -sI "https://aimvantage.uk/" | grep -i "^link:"
curl -s "https://aimvantage.uk/api/webmention"

# OG cards
curl -sI "https://aimvantage.uk/api/og?slug=jobscan-alternative" | head -3

# Markdown mirrors
for f in pricing jobscan-alternative workday-resume-parser openai-interview-prep api; do
  echo "$f.md ->"; curl -sI "https://aimvantage.uk/markdown/$f.md" | head -1
done

# Sitemap freshness
curl -s "https://aimvantage.uk/sitemap-pages.xml" | grep -c "<loc>"
# Expect: ≥70
```

## Rollback path

Every shipped change is tagged. If anything regresses on live, roll back to the most recent known-good tag:

```bash
# Find the green tag
git tag --list 'v*' | tail -20

# Reset locally (DESTRUCTIVE — coordinate first)
git reset --hard v39-audit-P2-2026-05-08

# Or push a revert commit (safer)
git revert <bad-commit-sha>
git push origin master
```

`v39-audit-P2-2026-05-08` is the last tag before this loop session started — that's the safe "everything before tonight" anchor.

## Webmention DB schema

Before `/api/webmention` sees real traffic, run `database/webmentions.sql` once in the Supabase SQL editor. Safe to re-run (uses `if not exists`).

## What I cannot do regardless of permission

These are hard rules that don't unlock with explicit user permission:

1. Creating accounts on third-party platforms (Mastodon, npm, Hugging Face, Postman, Glama, MCP Registry).
2. Posting / publishing on third-party platforms on the user's behalf.
3. Pasting sensitive credentials (npm tokens, OAuth secrets, Stripe keys).

For everything else, code/spec/copy is staged ready for paste.

## Total session output

- **17 commits** queued on master (v40 → v56 + empty-commit nudge + this doc)
- **~30 conversion improvements** (Gospel tactics, dashboard UX, copy sweep, mobile)
- **~10 distribution surfaces** (PWA, MCP, OpenAPI, OpenSearch, Webmention, WebSub, OG cards, identity mesh, markdown mirrors, satisfaction analytics)
- **2 standalone packages** (`mcp-server/`, `hf-space/`) ready for external publish
- **All TypeScript clean, all builds clean.**

When Vercel resumes, this all lands at once.
