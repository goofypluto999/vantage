-- Vantage Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- ============================================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'premium')),
  token_balance INTEGER NOT NULL DEFAULT 10 CHECK (token_balance >= 0),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'cancelling', 'cancelled', 'past_due')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- ============================================================================
-- ANALYSES TABLE (user's saved job analyses)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  job_title TEXT,
  job_url TEXT,
  results_json JSONB,
  tokens_spent INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'website',
  converted_to_user BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- ============================================================================
-- API USAGE TABLE (for rate limiting & billing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  tokens_consumed INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update their own profile only
-- No INSERT (handled by trigger) or DELETE (use admin/RPC for account deletion)
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can ONLY update safe columns (full_name, avatar_url).
-- Sensitive fields (plan, token_balance, subscription_status, stripe_*) are
-- updated ONLY by service_role via API endpoints.
-- Column-level grants enforce this even if RLS row-match passes.
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- REVOKE update on sensitive columns from authenticated users
REVOKE UPDATE (plan, token_balance, stripe_customer_id, stripe_subscription_id, subscription_status) ON profiles FROM authenticated;
REVOKE UPDATE (plan, token_balance, stripe_customer_id, stripe_subscription_id, subscription_status) ON profiles FROM anon;

-- Analyses: users can only see their own analyses
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Waitlist: anyone can join (insert), but only service role can view
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- API Usage: users can only read their own usage
CREATE POLICY "Users can view own usage" ON api_usage
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- ATOMIC TOKEN OPERATIONS (RPC functions)
-- Called from API endpoints via POST /rest/v1/rpc/<function_name>
-- These run as SECURITY DEFINER to bypass RLS with atomic guarantees
-- ============================================================================

-- Deduct tokens atomically. Returns new balance, raises exception if insufficient.
-- ONLY callable by service_role (API endpoints), NOT by authenticated users.
CREATE OR REPLACE FUNCTION deduct_tokens(p_user_id UUID, p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Validate amount is positive
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  UPDATE profiles
  SET token_balance = token_balance - p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
    AND token_balance >= p_amount
  RETURNING token_balance INTO new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  RETURN new_balance;
END;
$$;

-- Add tokens atomically. Returns new balance.
-- ONLY callable by service_role (API endpoints), NOT by authenticated users.
CREATE OR REPLACE FUNCTION add_tokens(p_user_id UUID, p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Validate amount is positive and reasonable (max 1000 per call)
  IF p_amount <= 0 OR p_amount > 1000 THEN
    RAISE EXCEPTION 'Invalid token amount';
  END IF;

  UPDATE profiles
  SET token_balance = token_balance + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING token_balance INTO new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_balance;
END;
$$;

-- Lock RPC functions to service_role only
REVOKE EXECUTE ON FUNCTION add_tokens FROM authenticated, anon, public;
GRANT EXECUTE ON FUNCTION add_tokens TO service_role;

REVOKE EXECUTE ON FUNCTION deduct_tokens FROM authenticated, anon, public;
GRANT EXECUTE ON FUNCTION deduct_tokens TO service_role;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp on profile changes
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- MIGRATION (run this if upgrading from old credits_total/credits_used schema)
-- ============================================================================
--
-- ALTER TABLE profiles ADD COLUMN token_balance INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE profiles ADD CONSTRAINT token_balance_non_negative CHECK (token_balance >= 0);
-- UPDATE profiles SET token_balance = GREATEST(0, credits_total - credits_used);
-- ALTER TABLE profiles DROP COLUMN credits_total;
-- ALTER TABLE profiles DROP COLUMN credits_used;
--
-- -- Split the RLS policy:
-- DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
-- CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
--
-- -- Fix analyses and api_usage policies:
-- DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
-- CREATE POLICY "Users can view own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
-- DROP POLICY IF EXISTS "Users can view own usage" ON api_usage;
-- CREATE POLICY "Users can view own usage" ON api_usage FOR SELECT USING (auth.uid() = user_id);
--
-- -- Rename columns:
-- ALTER TABLE analyses RENAME COLUMN credits_spent TO tokens_spent;
-- ALTER TABLE api_usage RENAME COLUMN credits_consumed TO tokens_consumed;
--
-- -- Create the RPC functions (copy from above)

-- ============================================================================
-- PROCESSED STRIPE EVENTS (webhook idempotency)
-- ============================================================================
-- Prevents double-processing of the same Stripe event (e.g. network retries,
-- duplicate deliveries). Webhook handler inserts the event_id after successful
-- processing; a UNIQUE constraint + ON CONFLICT DO NOTHING makes the check atomic.

CREATE TABLE IF NOT EXISTS processed_stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only the service_role can insert/read/delete (webhook handler uses service key)
ALTER TABLE processed_stripe_events ENABLE ROW LEVEL SECURITY;

-- Optional: cleanup old rows (keep 90 days)
-- Can be run manually or via a scheduled job
-- DELETE FROM processed_stripe_events WHERE processed_at < NOW() - INTERVAL '90 days';

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- 1. After running this SQL, go to Supabase Dashboard -> Authentication -> Providers
-- 2. Enable Google OAuth and configure your credentials
-- 3. Create your Stripe products and add their Price IDs to your environment variables
--
-- Environment Variables needed:
-- - SUPABASE_URL: Your project URL
-- - SUPABASE_SERVICE_ROLE_KEY: Found in Project Settings -> API
-- - SUPABASE_ANON_KEY: Found in Project Settings -> API
--
-- Stripe setup:
-- - Create 3 products in Stripe: Starter (5 GBP), Pro (12 GBP), Premium (20 GBP)
-- - Add their Price IDs to: STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM
