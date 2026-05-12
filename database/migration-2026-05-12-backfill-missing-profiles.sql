-- Backfill missing profile rows for any auth.users that lack one.
--
-- The on_auth_user_created trigger (schema.sql:241) is supposed to insert
-- a profiles row for every new signup. In practice we have accounts that
-- predate the trigger, or where it failed silently during signup. Those
-- users get "Profile not found" on EVERY API call until a row exists.
--
-- Run this ONCE in the Supabase SQL Editor. It is safe to re-run — the
-- INSERT is gated by NOT EXISTS so re-runs are no-ops.
--
-- What it does:
--   * Selects every auth.users row that has no matching profiles.id
--   * For each, inserts a profiles row with:
--       - id          = the auth user's UUID
--       - email       = auth.users.email if set, else
--                       raw_user_meta_data->>'email' if set, else
--                       <uid>@vantage-recovered.local (NOT NULL satisfied)
--       - full_name   = raw_user_meta_data->>'full_name' (fallback: name)
--       - avatar_url  = raw_user_meta_data->>'avatar_url' (fallback: picture)
--       - token_balance = 10  (same default the trigger uses)
--       - plan        = 'starter'
--       - subscription_status = 'inactive'
--   * After the backfill, runs a diagnostic SELECT showing how many users
--     it fixed.
--
-- WARNING: this populates email for ANY missing user, including ones who
-- never confirmed their signup. That's intentional — we'd rather they
-- have a recoverable account than be stuck on "Profile not found". They
-- can update the email in Account → Email after first login.

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

-- Diagnostic: how many users now have profiles?
DO $$
DECLARE
  auth_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  RAISE NOTICE 'Backfill complete: % auth users, % profile rows', auth_count, profile_count;
  IF auth_count <> profile_count THEN
    RAISE NOTICE 'WARNING: counts differ by %. Check for soft-deleted auth users or RLS interference.', auth_count - profile_count;
  END IF;
END $$;
