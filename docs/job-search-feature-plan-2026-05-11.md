# AI Job Search — Architecture + Plan (2026-05-11)

The "tool → service" milestone. Transforms Vantage from one-shot prep
to recurring daily-use career service. Token-economy multiplier.

## Decisions locked with user

| Question | Decision |
|---|---|
| **Pricing model** | **Hybrid**, refresh-proof. Signed-in users get 1 free curated pack per 24h (per `user.id`, server-tracked). Subsequent packs in the same window cost 1 token. Anonymous users get redirected to `/register` first (grants 10 free tokens). |
| **Marketing the daily limit** | **Don't.** Frame as "your first scan is free." The 24h reset is invisible — users who come back tomorrow get a pleasant surprise, not a fight against a meter. |
| **Sources for MVP** | **Adzuna** (multi-country, 1 API key covers 20 countries) + **Remotive** (global remote-anywhere, no key). |
| **Beta label** | **No.** 20-country Adzuna coverage is solid. Country dropdown with "more soon" microcopy. |
| **AI scoring** | Single batched Gemini call. 30-50 raw → 10 ranked + AI commentary. Cost ~£0.002-0.005 per scan. Margin ~50-100× on 1 token. |
| **Ghost-filter** | Auto-applied (toggleable). Reuses existing `/api/ghost-job-check` parser inline on each result. |
| **Integration** | "Save to tracker" feeds the just-shipped Application Tracker. "Apply via Vantage" pre-fills Dashboard analysis with the JD URL. |
| **Function ceiling** | New action `jobsearch` in existing `api/interview/[action].ts` dispatcher (5th action). Stays at 12/12 — no new function file. |

## Source coverage map

**Adzuna country codes covered with one free key (developer.adzuna.com):**

| Country | Code | Country | Code |
|---|---|---|---|
| United Kingdom 🇬🇧 | gb | United States 🇺🇸 | us |
| Canada 🇨🇦 | ca | Australia 🇦🇺 | au |
| Germany 🇩🇪 | de | France 🇫🇷 | fr |
| Spain 🇪🇸 | es | Italy 🇮🇹 | it |
| Netherlands 🇳🇱 | nl | Poland 🇵🇱 | pl |
| Singapore 🇸🇬 | sg | India 🇮🇳 | in |
| Brazil 🇧🇷 | br | Mexico 🇲🇽 | mx |
| Russia 🇷🇺 | ru | South Africa 🇿🇦 | za |
| New Zealand 🇳🇿 | nz | Switzerland 🇨🇭 | ch |
| Austria 🇦🇹 | at | Belgium 🇧🇪 | be |

**Remotive** (no key, public JSON API): global remote-anywhere across tech roles.

**Phase 2 (post-MVP) source additions:**
- **Reed.co.uk** — doubles UK coverage with a different aggregator (different employer set)
- **Greenhouse public boards** — `boards-api.greenhouse.io/v1/boards/<company>/jobs` for prestige companies (Stripe, OpenAI, Anthropic, Shopify, Airbnb, Notion, Linear, Vercel, …)
- **Lever public boards** — `api.lever.co/v0/postings/<company>?mode=json`
- **Ashby public boards** — `api.ashbyhq.com/posting-api/job-board/<org-slug>`
- **arbeitnow** — EU + remote, free JSON

## Architecture diagram

```
┌─────────────────────────────────────────────────────────┐
│ User on /jobs                                            │
│   ↓ Submits search (filters + CV summary already on profile)
├─────────────────────────────────────────────────────────┤
│ POST /api/interview?action=jobsearch                     │
│   1. Authenticate (Supabase JWT)                         │
│   2. Check rate gate: free this 24h? OR has 1 token?    │
│      - profiles.last_free_jobsearch_at < now-24h  → free │
│      - else deductTokens(user.id, 1)  (refund on fail)   │
│   3. Fetch from sources in parallel:                     │
│      - Adzuna /jobs/<country>/search/1?what=…&where=…   │
│      - Remotive /api/remote-jobs?category=…             │
│      - (Mock source in dev/test mode)                    │
│   4. Dedup by (title+company+location) hash             │
│   5. Run ghost-job filter on each (parser only, no LLM) │
│   6. Batched Gemini call:                                │
│      [30 raw jobs, CV summary, filters] →               │
│      [10 ranked + matchScore + fitCommentary +          │
│       skillMatches + skillGaps + salaryEstimate]        │
│   7. Update profiles.last_free_jobsearch_at = now()      │
│   8. Return 10 jobs                                      │
├─────────────────────────────────────────────────────────┤
│ Client renders: animated cards + filters + expand        │
│   - Save to tracker → useApplicationTracker.add()        │
│   - Apply via Vantage → /dashboard?jobUrl=...            │
└─────────────────────────────────────────────────────────┘
```

## Server: `handleJobSearch` action

Lives in `api/interview/[action].ts` (5th action). Follows the same
pattern as `handleNegotiation`:

- POST only
- JWT auth via existing `authenticate()` helper
- Validates request body (filters, country, role-type, salary band, keywords)
- Determines billing: free-scan-available vs token-deduct
- Concurrent source fetch with `Promise.allSettled` + per-source timeout (5s)
- Server-side dedup + ghost-filter (uses the same `extractJsonObject`
  + retry pattern as `/api/decode-rejection` for the batched scoring call)
- Returns structured JSON: `{ jobs: [...], tokenBalance, freeRemainingThisWindow }`
- Atomic deduct-before-AI; refund on any failure path (mirrors all
  other paid endpoints)

## Source-adapter pattern

`api/lib/jobSources.ts` (new helper file, NOT a serverless function —
just a TypeScript module imported by the dispatcher):

```ts
interface JobSource {
  name: string;
  fetch(params: JobSearchParams): Promise<RawJob[]>;
}

const sources: JobSource[] = [
  adzunaSource,   // multi-country via ADZUNA_APP_ID + ADZUNA_APP_KEY
  remotiveSource, // global remote, no key
  // mockSource only loaded when env NODE_ENV === 'development'
];
```

Each adapter handles its own retry/timeout/normalization. Adapter outputs
a uniform `RawJob` shape that the AI scorer consumes.

## Rate-limit + free-scan tracking

**Schema change required (user runs SQL):**

```sql
-- database/migrations/20260511_add_last_free_jobsearch_at.sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_free_jobsearch_at TIMESTAMPTZ;

-- Index for quick lookup (one-row-per-user but RLS-aware)
CREATE INDEX IF NOT EXISTS idx_profiles_last_free_jobsearch
  ON profiles (last_free_jobsearch_at)
  WHERE last_free_jobsearch_at IS NOT NULL;
```

**Server logic:**

```
on jobsearch request:
  profile = getProfile(user.id, 'plan,token_balance,last_free_jobsearch_at')
  freeAvailable = !profile.last_free_jobsearch_at
                  || (Date.now() - profile.last_free_jobsearch_at) > 24h
  if freeAvailable:
    didCharge = false
    set last_free_jobsearch_at = now()
  elif profile.token_balance >= 1:
    deductTokens(user.id, 1)
    didCharge = true
  else:
    return 402 { error: "Out of tokens, top up", needsTopUp: true }
```

## AI scoring prompt (high-level)

Single Gemini-2.5-flash call. Send:

```
USER_CV_SUMMARY: <500-char summary already on profile or generated once>
USER_FILTERS: <country, location, keywords, salary range, work mode>

RAW_JOBS (30-50, deduplicated):
1. Stripe — Senior PM, Billing Platform — London, hybrid — £130-160k
   Posted 2 days ago. Source: Adzuna.
   <500-char JD summary>
2. ...
```

Output schema (per multi-agent-review template):
```json
{
  "jobs": [
    {
      "rawIndex": 7,
      "matchScore": 87,
      "fitOneLiner": "Your Stripe-API experience maps directly to their core API surface; 8yrs PM aligns with their 'senior' band.",
      "skillMatches": ["Stripe API", "Billing", "Pricing experiments"],
      "skillGaps": ["Kafka (mentioned 4× in JD)", "GCP (heavy preference)"],
      "salaryEstimate": null,
      "ghostProbability": 12,
      "timeToApply": "12 min with recent cover letter",
      "atsPassLikelihood": "high"
    },
    ...10 entries total
  ]
}
```

Re-use the `extractJsonObject` hardened parser from `decode-rejection`
+ the retry + graceful fallback patterns.

## Client: `/jobs` route + component

- New route `/jobs` (no conflict with existing routes — checked)
- Lazy-loaded modal-style page (Suspense + React.lazy from Dashboard)
- Standalone full page when accessed directly (deep-linkable)
- Search form: location autocomplete (UK cities first, then world), keyword chips, work-mode chips (remote/hybrid/on-site/any), salary range slider (optional), country dropdown, "Hide ghost jobs" toggle (default on), "Posted within" select
- CV summary side-rail (transparency: shows what we're matching against)
- Submit → animated multi-stage loading skeleton (Framer Motion + GSAP):
  - "Fetching from N sources…"
  - "47 found, deduplicated to 32"
  - "Filtering ghost jobs… 3 hidden"
  - "Scoring against your CV…"
  - "Ready"
- Result cards:
  - Animated circular match-score (count-up via Framer)
  - Inline expand for full JD summary + skill matches/gaps + salary + ghost probability
  - 3 actions: **Save to tracker**, **Apply via Vantage**, **Open original**
  - "Apply via Vantage" → `/dashboard?prefillUrl=<job-url>` (Dashboard reads prefillUrl on mount and auto-fills the analyze form)
- Empty state with rescue paths (relax filters)
- Mobile-first card-stack for v2 (Phase 2)

## Phasing

**Phase 1 — MVP (this work stream):**
- Adzuna + Remotive + Mock sources
- Server action with rate gate
- Frontend `/jobs` route
- Animated loading + result cards
- Save to tracker + Apply via Vantage integrations
- Multi-agent review pipeline

**Phase 2 — Service-tier polish:**
- Reed.co.uk secondary UK source
- Greenhouse/Lever/Ashby premium company list
- Mobile swipe card-stack UX
- Comparison mode (2-3 jobs side-by-side)
- "New jobs match your saved search" daily check (cron-style via Vercel)

**Phase 3 — Advanced:**
- ATS pre-check on each result (uses existing ATS scanner)
- Salary negotiation auto-prep from job context
- Cmd+K palette
- Saved searches with notifications

## What I need from Gio (consolidated list)

When I've finished the build, here's what you'll need to do (I'll
remind you with the exact paste-able versions):

1. **Adzuna account + keys** — register at `https://developer.adzuna.com/`,
   put `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` into Vercel project env vars
   (Settings → Environment Variables → Production).
2. **Supabase SQL migration** — run the SQL block from
   `database/migrations/20260511_add_last_free_jobsearch_at.sql` in the
   Supabase SQL editor.
3. **Verify env vars list** — once added, redeploy from Vercel or push
   any commit to trigger. The new env vars only take effect on the
   next deploy.
4. **(Optional Phase 2)** — Reed.co.uk API key for UK coverage doubling.

## Risk index (kept honest)

- **Adzuna free tier limits** — 1000 calls/day. Need to upgrade to
  €99/mo when we hit >100 active daily users. Add a daily-budget guard
  in the server adapter that fails-open to Remotive-only if Adzuna
  budget exhausted.
- **AI ranking false positives** — show transparency ("here's why we
  ranked 87%"), allow user thumbs-down per result (just analytics, no
  real ML retrain).
- **Mock source in production** — gated behind `process.env.NODE_ENV
  === 'development'` strictly. Never enabled in prod build.
- **Function ceiling** — staying at 12/12 by adding action to existing
  dispatcher.
- **Cost per scan** — Gemini batched ~£0.002-0.005 + Adzuna 1 call =
  cost ~£0.005. Revenue from 1 token at retail price ~£0.25 = 50× margin.

---

*Architecture locked. Build in progress. This doc updates as build
progresses; final state will be reflected in
`docs/session-state.md` at end of milestone.*
