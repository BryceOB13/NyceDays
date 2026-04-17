-- Migration: Add phone and contact_preference columns
-- Run this in Supabase SQL Editor

ALTER TABLE invitational_signups ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE invitational_signups ADD COLUMN IF NOT EXISTS contact_preference TEXT DEFAULT 'instagram';

-- Enable realtime for live slot updates
ALTER PUBLICATION supabase_realtime ADD TABLE invitational_signups;
