-- Donations table for Jamaica Hurricane Relief campaign
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  campaign TEXT NOT NULL DEFAULT 'bbq_may_24',
  donor_email TEXT,
  donor_name TEXT,
  consent_marketing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS donations_campaign_idx ON donations (campaign);
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON donations (created_at DESC);

-- RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow public reads for running total
CREATE POLICY "Public can read donation totals" ON donations
  FOR SELECT TO anon USING (true);

-- Allow inserts from service role (webhook)
-- Service role bypasses RLS by default, so no policy needed for inserts
