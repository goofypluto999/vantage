-- DIAGNOSTIC SQL — run this in Supabase SQL Editor.
-- Reports the exact state of your profiles table + auth.users.
-- Returns 4 separate result sets — read each one.
--
-- This is read-only. It does NOT modify anything.

-- 1. Do the required columns exist on profiles?
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('id', 'email', 'token_balance', 'plan', 'subscription_status', 'last_free_jobsearch_at', 'cv_summary')
ORDER BY column_name;

-- 2. How many auth.users vs profiles? (Should be equal.)
SELECT
  (SELECT COUNT(*) FROM auth.users) AS auth_users_count,
  (SELECT COUNT(*) FROM public.profiles) AS profiles_count;

-- 3. Which auth.users have NO profile row? (Should be 0 rows after backfill.)
SELECT
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at IS NOT NULL AS confirmed
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
LIMIT 20;

-- 4. Sample 5 profile rows to confirm shape.
SELECT id, email, token_balance, plan, subscription_status, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;
