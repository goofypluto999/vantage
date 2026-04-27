-- =====================================================================
-- Migration: Grant 10 free tokens to every new signup
-- Date: 2026-04-28
-- Why:    Live DB defaults token_balance to 0 for new profiles even
--         though schema.sql declares DEFAULT 10. Most recent signup
--         (2026-04-20) confirmed 0 tokens. UI now promises a free
--         trial; this makes the DB match.
--
-- Safety:
--   - Idempotent: safe to run multiple times. CREATE OR REPLACE +
--     ALTER … SET DEFAULT do not error on re-run.
--   - No data loss. No row deletes. No RLS changes. No Stripe
--     touches.
--   - Affects ONLY future signups. Existing profiles are NOT changed.
--   - Reversible: see ROLLBACK section at bottom of this file.
--
-- Run: paste this entire file into Supabase Dashboard ->
--      SQL Editor -> + New query -> Run.
-- =====================================================================

BEGIN;

-- 1. Update column default to 10 (in case future code paths INSERT
--    without specifying token_balance).
ALTER TABLE profiles
  ALTER COLUMN token_balance SET DEFAULT 10;

-- 2. Update the on-signup trigger to explicitly grant 10 tokens.
--    Belt + braces: even if someone changes the column default later,
--    the trigger keeps granting 10. Same SECURITY DEFINER + search_path
--    settings as the original trigger in schema.sql.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    token_balance
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    10  -- 10 free tokens = 3 full analyses (3 tokens each) + tone rewrites
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. The DROP TRIGGER + CREATE TRIGGER from schema.sql is still in
--    effect. The trigger references handle_new_user() by name, so
--    replacing the function body above is enough — no need to recreate
--    the trigger itself.

COMMIT;

-- =====================================================================
-- VERIFICATION (run after the migration above)
-- =====================================================================

-- Q1: confirm column default is now 10
-- Expected: column_default contains "10"
SELECT
  column_name,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'token_balance';

-- Q2: confirm the trigger function is updated
-- Expected: routine_definition mentions "10" and "token_balance"
SELECT
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Q3 (optional, only after a NEW test signup has been created):
-- Expected: most recent profile has token_balance = 10
SELECT
  email,
  token_balance,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================================
-- ROLLBACK (only run if you want to undo the migration)
-- =====================================================================

-- BEGIN;
--
-- -- 1. Restore original column default (0)
-- ALTER TABLE profiles
--   ALTER COLUMN token_balance SET DEFAULT 0;
--
-- -- 2. Restore original trigger (no token grant on signup)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, email, full_name, avatar_url)
--   VALUES (
--     NEW.id,
--     NEW.email,
--     NEW.raw_user_meta_data->>'full_name',
--     NEW.raw_user_meta_data->>'avatar_url'
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- COMMIT;

-- =====================================================================
-- NOTES on abuse risk (the email-farming concern)
-- =====================================================================
--
-- One free analysis = ~$0.01 in Gemini API spend (Flash 2.5 pricing).
-- Worst-case farm scenario: attacker creates 1,000 emails, confirms
-- each one (Supabase requires email confirmation by default), logs
-- into each, runs one analysis each. Cost: ~$10. Bounded.
--
-- Real-world farming friction:
--   - Each email needs to be confirmed (Supabase default)
--   - Each session needs a separate browser/cookie
--   - The full prep flow takes ~90 seconds per analysis
--   - 1,000 farmed analyses takes hours of manual work
--
-- If abuse is detected later, the cheapest mitigations:
--   1. Add Cloudflare Turnstile to the signup form (free)
--   2. Add an IP-based rate limit at the Vercel edge
--   3. Reduce the grant from 10 to 5 (still 1 full analysis + bonus)
--
-- We are NOT adding these defences upfront. Premature defence raises
-- friction for legitimate users; we add them only if abuse is observed.
