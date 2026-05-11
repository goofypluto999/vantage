-- Migration 2026-05-11: AI Job Search feature
-- Adds the per-user 24h free-scan tracker column.
-- Run this in Supabase SQL editor BEFORE the next deploy that enables
-- the jobsearch endpoint.
--
-- Idempotent: safe to run multiple times.

-- 1. Add the columns. ALTER ... ADD COLUMN IF NOT EXISTS requires
--    Postgres 9.6+ which Supabase comfortably exceeds.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_free_jobsearch_at TIMESTAMPTZ;

-- cv_summary: short (≤2000 char) AI-distilled summary of the user's
-- CV. Generated once on first /analyze, persisted, reused by the
-- jobsearch action's AI scorer so we don't have to re-send full CV
-- text on every search. NULL = no summary yet; jobsearch falls back
-- to filter-based scoring.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS cv_summary TEXT;

-- 2. Partial index for quick lookup (filter on NULL is cheap; full
--    index would index every profile but only 0-1 rows per user ever
--    have a non-null value at any given time).
CREATE INDEX IF NOT EXISTS idx_profiles_last_free_jobsearch
  ON profiles (last_free_jobsearch_at)
  WHERE last_free_jobsearch_at IS NOT NULL;

-- 3. Comment for future readers.
COMMENT ON COLUMN profiles.last_free_jobsearch_at IS
  'Timestamp of last free jobsearch scan. Used to gate the 1-free-per-24h grant. NULL = never used a free scan = free is available. Server-set only; clients should not write.';

-- 4. RLS + column-level revoke: the existing profiles RLS policy locks
--    rows to `auth.uid() = id`, BUT row-level policies don't cover
--    column-level write surface. Without this REVOKE, an authenticated
--    user could PATCH their own `last_free_jobsearch_at` to NULL or
--    a far-future date via the anon key + their JWT, bypassing the
--    24h free-scan gate entirely. Same for `cv_summary` (which the
--    server uses to score job fit — user-controlled value flowing
--    into Gemini = silent prompt-injection vector).
--    Server-side updates use the service-role key which is NOT
--    subject to GRANT/REVOKE, so this only blocks client-side writes.
--    (Multi-agent security review finding 2026-05-11.)
REVOKE UPDATE (last_free_jobsearch_at, cv_summary)
  ON profiles
  FROM authenticated, anon;

-- 5. Verify the migration worked:
--    SELECT column_name, data_type FROM information_schema.columns
--    WHERE table_name = 'profiles' AND column_name = 'last_free_jobsearch_at';
--    Expected: last_free_jobsearch_at | timestamp with time zone
