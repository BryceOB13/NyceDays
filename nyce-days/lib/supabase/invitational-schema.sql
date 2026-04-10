-- Nyce Invitational DJ Signup Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS invitational_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  instagram_handle text NOT NULL,
  genre text,
  genre_other text,
  time_slot_preference text[],
  signup_type text NOT NULL CHECK (signup_type IN ('dj', 'waitlist')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for fast DJ count queries
CREATE INDEX IF NOT EXISTS idx_invitational_signup_type ON invitational_signups (signup_type);

-- Enable RLS
ALTER TABLE invitational_signups ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (public form)
CREATE POLICY "Allow public inserts" ON invitational_signups
  FOR INSERT TO anon WITH CHECK (true);

-- Allow reads for count queries from anon
CREATE POLICY "Allow public count reads" ON invitational_signups
  FOR SELECT TO anon USING (true);
