-- Migration 2026-05-11: AI Job Search feature
-- Source-of-truth record of the SQL the user ran on Supabase production
-- to enable the jobsearch endpoint. Idempotent — safe to re-run on
-- staging / preview Supabase instances to bring them into parity.

-- 1. Columns. ALTER ... ADD COLUMN IF NOT EXISTS requires Postgres 9.6+
--    which Supabase comfortably exceeds.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_free_jobsearch_at TIMESTAMPTZ;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS cv_summary TEXT;

-- 2. Partial index for quick lookup.
CREATE INDEX IF NOT EXISTS idx_profiles_last_free_jobsearch
  ON profiles (last_free_jobsearch_at)
  WHERE last_free_jobsearch_at IS NOT NULL;

-- 3. Comments for future readers.
COMMENT ON COLUMN profiles.last_free_jobsearch_at IS
  'Timestamp of last free jobsearch scan. Gates the 1-free-per-24h grant. NULL = never used = free available. Server-set only.';

COMMENT ON COLUMN profiles.cv_summary IS
  'Short AI-distilled summary of the user CV. Used by jobsearch AI scorer. ≤2000 chars. Server-set only.';

-- 4. CRITICAL: REVOKE UPDATE on both new columns. Without this, an
--    authenticated user could PATCH their own last_free_jobsearch_at
--    to bypass the 24h gate, or PATCH cv_summary to inject prompts
--    into the Gemini call (since the server includes cv_summary in the
--    AI prompt context). Service-role key is NOT subject to GRANT/REVOKE
--    so server-side writes still work.
REVOKE UPDATE (last_free_jobsearch_at, cv_summary)
  ON profiles
  FROM authenticated, anon;
