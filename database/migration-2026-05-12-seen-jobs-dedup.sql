-- Per-user 'seen jobs' tracking for AI Job Search deduplication.
--
-- Problem this solves: today, if a user runs a scan with the same filters
-- twice they get the same top-10 results both times — wasting a token
-- (or their daily free scan) on identical output. Reported 2026-05-12:
-- "ensure that the same results don't appear twice for the user when
-- they run a scan, this is vital, otherwise we are wasting their tokens,
-- i.e their money."
--
-- Approach: every job returned from a successful scan is recorded as
-- 'seen' for that user with a timestamp. Subsequent scans filter the
-- raw Adzuna/Remotive results to exclude IDs the user has seen in the
-- last 30 days BEFORE feeding to Gemini. Different filters or 30 days
-- of distance both naturally reset the dedup.
--
-- Run ONCE in the Supabase SQL Editor. Safe to re-run — idempotent.

CREATE TABLE IF NOT EXISTS public.seen_job_searches (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_external_id TEXT NOT NULL,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, job_external_id)
);

CREATE INDEX IF NOT EXISTS idx_seen_user_recent
  ON public.seen_job_searches(user_id, seen_at DESC);

-- RLS: users can read their own seen rows (for any future "Show seen
-- jobs" toggle). Writes happen via service-role only.
ALTER TABLE public.seen_job_searches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see only their own seen rows" ON public.seen_job_searches;
CREATE POLICY "Users see only their own seen rows"
  ON public.seen_job_searches FOR SELECT
  USING (user_id = auth.uid());

-- Diagnostic
DO $$
DECLARE
  has_table BOOLEAN;
  has_index BOOLEAN;
  has_policy BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seen_job_searches'
  ) INTO has_table;
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'idx_seen_user_recent'
  ) INTO has_index;
  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'seen_job_searches'
  ) INTO has_policy;
  RAISE NOTICE '=== seen_job_searches migration ===';
  RAISE NOTICE 'Table exists:  %', has_table;
  RAISE NOTICE 'Index exists:  %', has_index;
  RAISE NOTICE 'RLS policy exists: %', has_policy;
  IF NOT (has_table AND has_index AND has_policy) THEN
    RAISE EXCEPTION 'seen_job_searches migration incomplete';
  END IF;
END $$;
