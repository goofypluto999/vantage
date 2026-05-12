-- SINGLE SQL TO RUN IN SUPABASE — fixes the 'Profile not found' issue end to end.
--
-- Combines TWO migrations that may not have run completely on your project:
--   1. Adds the jobsearch tracking columns (last_free_jobsearch_at + cv_summary)
--      that /api/interview/jobsearch SELECTs. If these columns don't exist,
--      the SELECT returns a Postgres column-not-found error object — not an
--      empty array — which our 'no profile' detection misreads as missing.
--   2. Backfills profile rows for any auth.users that don't have one (covers
--      accounts that pre-date the on_auth_user_created trigger).
--
-- Run ONCE. Idempotent — safe to re-run.

-- ============================================================================
-- Step 1: schema (columns + grants)
-- ============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_free_jobsearch_at TIMESTAMPTZ;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS cv_summary TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_last_free_jobsearch
  ON profiles (last_free_jobsearch_at) WHERE last_free_jobsearch_at IS NOT NULL;

-- Prevent the client (authenticated / anon) from PATCHing these directly.
-- The server uses service_role which bypasses these grants.
REVOKE UPDATE (last_free_jobsearch_at, cv_summary) ON profiles FROM authenticated, anon;

-- ============================================================================
-- Step 2: backfill missing profile rows
-- ============================================================================

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  avatar_url,
  token_balance,
  plan,
  subscription_status
)
SELECT
  u.id,
  COALESCE(
    NULLIF(u.email, ''),
    NULLIF(u.raw_user_meta_data->>'email', ''),
    u.id::text || '@vantage-recovered.local'
  ),
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name'
  ),
  COALESCE(
    u.raw_user_meta_data->>'avatar_url',
    u.raw_user_meta_data->>'picture'
  ),
  10,
  'starter',
  'inactive'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- ============================================================================
-- Step 3: diagnostic — confirm state
-- ============================================================================

DO $$
DECLARE
  auth_count INTEGER;
  profile_count INTEGER;
  has_lastfree BOOLEAN;
  has_cvsummary BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_free_jobsearch_at'
  ) INTO has_lastfree;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'cv_summary'
  ) INTO has_cvsummary;

  RAISE NOTICE '=== Vantage profile fix complete ===';
  RAISE NOTICE 'auth.users count: %', auth_count;
  RAISE NOTICE 'profiles count:   %', profile_count;
  RAISE NOTICE 'last_free_jobsearch_at column exists: %', has_lastfree;
  RAISE NOTICE 'cv_summary column exists:             %', has_cvsummary;

  IF NOT has_lastfree OR NOT has_cvsummary THEN
    RAISE EXCEPTION 'Schema fix failed: required columns still missing';
  END IF;

  IF auth_count <> profile_count THEN
    RAISE NOTICE 'WARNING: % auth users still without profile rows. Check for soft-deleted users.', auth_count - profile_count;
  ELSE
    RAISE NOTICE 'All % auth users now have profile rows', auth_count;
  END IF;
END $$;
