-- Migration: subscription renewal + cancellation dates
-- Date: 2026-05-14
--
-- Adds the date columns we were missing — without these, the webhook can't
-- persist when a subscription renews next or when a cancellation takes effect,
-- and the UI shows "Cancelling at end of period" with no actual date.
--
-- Run in Supabase SQL Editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_renews_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at TIMESTAMPTZ;

-- The status check constraint already includes 'cancelling'/'past_due' — no
-- change needed there.

-- Helpful index for cron jobs that may sweep expiring subscriptions.
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_renews_at
  ON profiles(subscription_renews_at)
  WHERE subscription_renews_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_cancel_at
  ON profiles(subscription_cancel_at)
  WHERE subscription_cancel_at IS NOT NULL;

-- Backfill from existing data is NOT done here (no source — Stripe truth).
-- Next webhook event (renewal, manual sync, or cancellation) will populate.
-- A manual one-shot sync can also be triggered from Account.tsx mount path.
