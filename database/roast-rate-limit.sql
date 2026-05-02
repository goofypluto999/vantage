-- ============================================================================
-- ROAST RATE LIMIT + ABUSE LOG
-- ============================================================================
-- Persistent storage for /api/roast rate limiting.
--
-- Why this exists: Vercel serverless functions cold-start, which wipes any
-- in-memory rate limit state. Without persistent storage, an attacker can
-- bypass per-IP limits by triggering enough cold starts. This module gives
-- /api/roast a real, durable rate-limit counter that survives restarts.
--
-- Setup: paste this entire file into Supabase SQL Editor and run once.
-- After running, set the env var SUPABASE_ROAST_RATELIMIT_ENABLED=true on
-- Vercel and the API will start using the persistent limit. Until then it
-- falls back to the in-memory limit transparently.
--
-- IPs are hashed with SHA-256 before storage so we never store raw IPs.
-- Old rows are auto-pruned after 48 hours via the cleanup function below.

-- ─── Rate limit counter table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roast_rate_limit (
  ip_hash TEXT NOT NULL,
  bucket TEXT NOT NULL CHECK (bucket IN ('min', 'day')),
  -- window_start is the floor of the current window. For 'min', it's the
  -- start of the current minute. For 'day', it's the start of the current day.
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, bucket, window_start)
);

CREATE INDEX IF NOT EXISTS idx_roast_rate_limit_window_start
  ON roast_rate_limit (window_start);

-- ─── Abuse log table ─────────────────────────────────────────────────────
-- Every /api/roast hit records a row here. Used to detect patterns.
-- Hashed IP + minimal metadata. No cover-letter content stored ever.
CREATE TABLE IF NOT EXISTS roast_abuse_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  ua_hash TEXT,
  -- result: 'ok' | 'rate_limited_min' | 'rate_limited_day' | 'bot_throttle'
  --       | 'origin_blocked' | 'injection_blocked' | 'too_short' | 'too_long'
  --       | 'gemini_error' | 'output_blocked' | 'other_error'
  result TEXT NOT NULL,
  letter_chars INTEGER,
  severity_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roast_abuse_log_ip_hash_created_at
  ON roast_abuse_log (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roast_abuse_log_result_created_at
  ON roast_abuse_log (result, created_at DESC);

-- ─── Atomic check-and-increment RPC ──────────────────────────────────────
-- Increments the per-IP per-minute and per-day counters atomically and
-- returns whether the request should be allowed. This is the function the
-- API calls before each Gemini request.
--
-- Args:
--   p_ip_hash    SHA-256 of the client IP (hex string, 64 chars)
--   p_min_max    integer; max requests allowed in the current minute
--   p_day_max    integer; max requests allowed in the current day
--
-- Returns: jsonb with { allowed: bool, reason: text|null, min_count: int, day_count: int }
CREATE OR REPLACE FUNCTION roast_rate_check(
  p_ip_hash TEXT,
  p_min_max INTEGER DEFAULT 3,
  p_day_max INTEGER DEFAULT 30
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_min_window TIMESTAMPTZ := date_trunc('minute', NOW());
  v_day_window TIMESTAMPTZ := date_trunc('day', NOW());
  v_min_count INTEGER;
  v_day_count INTEGER;
BEGIN
  -- Reject misshapen IP hashes early to keep the table clean.
  IF p_ip_hash IS NULL OR length(p_ip_hash) <> 64 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'invalid_ip_hash'
    );
  END IF;

  -- Atomically increment the per-minute counter.
  INSERT INTO roast_rate_limit (ip_hash, bucket, window_start, count)
  VALUES (p_ip_hash, 'min', v_min_window, 1)
  ON CONFLICT (ip_hash, bucket, window_start)
  DO UPDATE SET count = roast_rate_limit.count + 1
  RETURNING count INTO v_min_count;

  IF v_min_count > p_min_max THEN
    -- Roll back the increment for the rejected request so it doesn't count
    -- against the user's quota.
    UPDATE roast_rate_limit
       SET count = count - 1
     WHERE ip_hash = p_ip_hash AND bucket = 'min' AND window_start = v_min_window;
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited_min',
      'min_count', v_min_count - 1,
      'day_count', 0
    );
  END IF;

  -- Atomically increment the per-day counter.
  INSERT INTO roast_rate_limit (ip_hash, bucket, window_start, count)
  VALUES (p_ip_hash, 'day', v_day_window, 1)
  ON CONFLICT (ip_hash, bucket, window_start)
  DO UPDATE SET count = roast_rate_limit.count + 1
  RETURNING count INTO v_day_count;

  IF v_day_count > p_day_max THEN
    -- Roll back BOTH counters: we already incremented the minute counter.
    UPDATE roast_rate_limit
       SET count = count - 1
     WHERE ip_hash = p_ip_hash AND bucket = 'day' AND window_start = v_day_window;
    UPDATE roast_rate_limit
       SET count = count - 1
     WHERE ip_hash = p_ip_hash AND bucket = 'min' AND window_start = v_min_window;
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited_day',
      'min_count', v_min_count - 1,
      'day_count', v_day_count - 1
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'reason', NULL,
    'min_count', v_min_count,
    'day_count', v_day_count
  );
END;
$$;

-- ─── Cleanup function ────────────────────────────────────────────────────
-- Removes rate-limit rows older than 48h. Schedule with a Supabase cron job
-- if you want automatic pruning, otherwise just call manually every few days.
CREATE OR REPLACE FUNCTION roast_rate_limit_cleanup()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM roast_rate_limit
   WHERE window_start < NOW() - INTERVAL '48 hours';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  -- Also prune abuse log entries older than 30 days.
  DELETE FROM roast_abuse_log
   WHERE created_at < NOW() - INTERVAL '30 days';

  RETURN v_deleted;
END;
$$;

-- ─── RLS: lock the tables down ───────────────────────────────────────────
-- Only the service role (used by the API) should be able to read/write.
-- Anonymous + authenticated users should never touch these tables directly.
ALTER TABLE roast_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE roast_abuse_log ENABLE ROW LEVEL SECURITY;

-- No policies created → service role has full access (bypasses RLS),
-- anon and authenticated have zero access. Exactly what we want.

-- ─── Permissions on the RPC ──────────────────────────────────────────────
-- Allow only service role + authenticated users to call the rate-check RPC.
-- (The API uses the service role; this prevents client-side abuse of the
-- function via the public Supabase URL.)
REVOKE EXECUTE ON FUNCTION roast_rate_check(TEXT, INTEGER, INTEGER) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION roast_rate_check(TEXT, INTEGER, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION roast_rate_check(TEXT, INTEGER, INTEGER) TO service_role;

REVOKE EXECUTE ON FUNCTION roast_rate_limit_cleanup() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION roast_rate_limit_cleanup() FROM anon;
GRANT EXECUTE ON FUNCTION roast_rate_limit_cleanup() TO service_role;
