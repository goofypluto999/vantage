# AI Job Search — Step-by-Step Handoff for Gio

The build is done end-to-end + multi-agent reviewed (HIGHs + MEDs all
fixed pre-commit). The feature is **ready to deploy** with the
following two-step activation:

---

## ✅ What I've finished

- Architecture doc: `docs/job-search-feature-plan-2026-05-11.md`
- Source adapters (Adzuna multi-country, Remotive global remote, dev-only mock): `lib/jobSources.ts`
- Server action `jobsearch`: 5th action in `api/interview/[action].ts` (no new function file — still 12/12)
- Per-user 24h free-scan gate + per-user serial guard against parallel-burner abuse
- AI scoring with prompt-injection guard around third-party JD content
- Client `searchJobs()` wrapper + types: `src/services/api.ts`
- Search page at `/jobs`: `src/components/JobSearchPage.tsx`
- Animated multi-stage loading skeleton, match-score `role="meter"`, ghost-badge color tiering (amber 50-74% / rose 75+%), tracker-integrated Save button, Apply-via-Vantage handoff banner on Dashboard
- Migration SQL: `database/migration-2026-05-11-jobsearch-tracking.sql`
- Preflight 6/6 pass, TypeScript clean, production build clean

---

## 📋 What I need YOU to do

### Step 1 — Run the SQL migration in Supabase

Open Supabase → SQL Editor → New query → paste the contents of
`database/migration-2026-05-11-jobsearch-tracking.sql` → **Run**.

What it does:
- Adds `profiles.last_free_jobsearch_at TIMESTAMPTZ` (the 24h gate column)
- Adds `profiles.cv_summary TEXT` (AI-distilled CV summary; populated in a future iteration)
- Creates a partial index for quick free-scan lookups
- **`REVOKE UPDATE` on both new columns** from `authenticated` + `anon` roles — closes a HIGH-severity bypass where a user could PATCH their own free-scan timestamp via the anon key and get unlimited free scans

Verify with:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name IN ('last_free_jobsearch_at', 'cv_summary');
```

Expected: 2 rows.

### Step 2 — Register Adzuna + add API keys to Vercel

1. Go to **https://developer.adzuna.com/** → sign up (free)
2. After verification you'll get an `App ID` and `App Key`
3. Vercel dashboard → Project (vantage) → Settings → **Environment Variables**
4. Add both:

| Variable name | Value | Environments |
|---|---|---|
| `ADZUNA_APP_ID` | (your app id) | Production + Preview |
| `ADZUNA_APP_KEY` | (your app key) | Production + Preview |

5. **Trigger a redeploy** so the new env vars take effect (Vercel only loads them at deploy time). Easiest: push any commit — even an empty one (`git commit --allow-empty -m "deploy: pick up Adzuna keys"`).

### Step 3 — Smoke test live

After the redeploy, visit `https://aimvantage.uk/jobs` while signed in:

1. Try a UK search: keywords "product manager", location "London", country "United Kingdom"
2. Run scan → should see live results from Adzuna in 5-10s
3. Click "Save to tracker" on one → opens Dashboard, see it appear in the Application Tracker
4. Click "Apply via Vantage" on another → Dashboard loads with the JD URL prefilled + a banner saying "Pre-filled from your AI Job Search"
5. Run a second scan immediately → should now charge 1 token (not free, because the first one used the daily free)
6. Wait 24h → first scan that day should be free again

---

## 🛡️ Safety state right now (before your steps)

**The /jobs page is already live and works gracefully without the Adzuna keys.** When you push my latest commit:

- Without `ADZUNA_APP_ID/KEY`: users see Remotive-only (global remote) results + a yellow banner saying "Multi-country search (Adzuna) is not yet configured on this deploy. UK/US/EU coverage coming online soon."
- Without the SQL migration: users get **a 500 error** on jobsearch because the server tries to read `last_free_jobsearch_at`. **The migration MUST run before deploy** — that's why it's Step 1.

If you can only do one step before deploy, do the migration (Step 1). Without keys, the feature is degraded-but-honest. Without the migration, it's broken.

---

## 📊 What it costs to run

- **Adzuna free tier**: ~1000 calls/day. Each user search = 1 call (we paginate at 25 results/source). So ~1000 searches/day across all users.
- **Beyond free tier**: €99/month for ~100,000 calls. Plenty of runway. Plan to upgrade when daily active searches hit ~700.
- **Gemini cost per scan**: ~£0.002-0.005 (one batched call, 4000-token output cap).
- **Revenue per scan**: 1 token retail-equivalent at ~£0.25 — that's **50-100× margin**.

---

## 🪪 Deferred / Phase 2 (indexed, NOT blocking)

- Reed.co.uk API (UK coverage doubler, also free)
- Greenhouse / Lever / Ashby direct fetches for prestige companies (free, no key)
- Mobile swipe card-stack UX
- Comparison mode (2-3 jobs side-by-side)
- Daily "new jobs match your saved search" cron
- ATS pre-check per result using existing ATS scanner
- `cv_summary` populator — currently the column is there but nothing writes to it. We can do a one-time fill from existing `analyses` rows in a follow-up.

---

## ⚠️ Rollback path

If anything goes wrong post-deploy:

```bash
# Soft: revert just the job-search work
git revert <commit-sha> && git push origin master

# Hard: roll back to before the milestone
git reset --hard stable-2026-05-11-pre-followup && git push -f origin master
# (loses everything from today: audit fixes, negotiation, persistence,
#  markdown export, tracker, job search)
```

The migration is forward-only — even on rollback, the new columns stay in the DB harmlessly. To drop them:
```sql
ALTER TABLE profiles DROP COLUMN IF EXISTS last_free_jobsearch_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS cv_summary;
```
