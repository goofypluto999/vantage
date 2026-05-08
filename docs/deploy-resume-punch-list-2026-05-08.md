# Deploy-resume punch list — 2026-05-08

**Status as of 2026-05-08 ~02:30 UTC:**
Vercel has not deployed since the deploy at `Thu, 07 May 2026 23:39:41 GMT`
(reported by the live `Last-Modified` header on `sitemap-pages.xml`).
Live JS hash is `index-DPyzWxJG.js`; recent local builds are `index-BVAGOd5M.js`.

**8 commits queued on master, NOT deployed:**

| Tag | Commit  | What it ships |
|-----|---------|----------------|
| `v40-roast-handoff`        | c50711f | RoastPage → register handoff; Dashboard reads `vantage:pendingRoast` and surfaces a banner |
| `v41-cost-calculator`      | 62b9f7d | New page `/tools/jobscan-cost-calculator` (sliders, comparison vs Jobscan/Resume Worded/Final Round AI/Teal/LiveCareer) |
| `v42-receipts`             | 3270886 | New page `/receipts` (12 trust-audit cards, footer link added) |
| `v43-diagnostic`           | 8ac80a4 | New page `/tools/no-interviews-diagnostic` (5-Q deterministic decision-tree, 7 verdicts) |
| `v44-cleanurls-fix`        | 7bcdf85 | `vercel.json`: `cleanUrls: true` + `trailingSlash: false` so prerendered `/<route>/index.html` files are served (regression of audit P0d) |
| `v45-c5-jd-warn`           | d4e0fe1 | Dashboard.tsx: warn-before-submit when JD missing on ANY host (was: only blocked-host list) — Tier 2 / C5 |
| `v46-cta-copy-sweep`       | 3b25726 | Replaced stale `"3 free analyses"` → `"10 free prep packs"` across 24 files |
| `v47-mobile-tools`         | 3eb6df3 | Hero chip cluster: 3 → 5 free tools; mobile drawer: surfaces all 5 tool routes + receipts + uses primary CTA copy |

## What Gio needs to do

1. Open the Vercel project dashboard for `vantage`.
2. Check the **Deployments** tab — are commits `c50711f` through `3eb6df3` showing as queued / building / failed?
3. If any are **failed**: click into the failed deploy, read the build log, and either:
   - Fix the underlying issue if it's a code error
   - Hit "Redeploy" if it was a transient infra issue (DNS, GitHub webhook, etc.)
4. If they're not even **queued**: the GitHub → Vercel webhook may have broken. Re-link in Vercel project settings → Git.
5. If the queue is **just slow**: wait 5-10 min and recheck. (Multi-commit pushes sometimes batch.)

## Verification after deploy resumes

Run this once the live JS hash matches the latest local build:

```bash
# 1. Per-route titles should each match their prerendered metadata
for path in "/receipts" "/tools/jobscan-cost-calculator" "/tools/no-interviews-diagnostic" "/pricing" "/about" "/roast"; do
  echo -n "$path -> "; curl -s "https://aimvantage.uk$path" | grep -oE '<title>[^<]+</title>' | head -1
done

# 2. cleanUrls verification — all of the above should NOT show the homepage title

# 3. Hero CTA copy — should say "Get 10 free prep packs", not "Get 3 free analyses"
curl -s "https://aimvantage.uk/" | grep -oE "Get 10 free prep packs"

# 4. Sitemap freshness — should have all entries (5 newer routes)
curl -s "https://aimvantage.uk/sitemap-pages.xml" | grep -c "<loc>"
# Expect: ≥70 (the local file has 70 entries)

# 5. New routes return 200
for path in "/tools/jobscan-cost-calculator" "/tools/no-interviews-diagnostic" "/receipts"; do
  echo -n "$path -> "; curl -s -o /dev/null -w "%{http_code}\n" "https://aimvantage.uk$path"
done
```

## Why this matters for conversion

The v46 sweep alone is the highest-leverage change shipped this session: every cold visitor was previously seeing **"3 free analyses"** in the hero pill, hero CTA, mid-page CTA, bottom CTA, floating pill, mobile pill, all 23+ marketing pages, and the JSON-LD Offer descriptions for AI assistants. The actual signup grant is **10 free prep packs** (10 tokens × 1 token/analysis after the 2026-05-08 pricing migration). We were under-selling the free tier by 233%.

## If Vercel cannot be unstuck

Backup plan (only if Gio approves — modifies production hosting):
- Manual deploy via `vercel --prod` from the local `dist/` directory (requires Vercel CLI auth and explicit Gio approval since this bypasses the normal git-driven pipeline).
- Or: rebuild on a fresh deploy by reverting `vercel.json` change, pushing, then re-applying — sometimes triggers the webhook to wake up.
