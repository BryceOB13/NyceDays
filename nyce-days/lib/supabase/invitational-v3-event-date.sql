-- Migration: Add event_date column to distinguish between events
-- Run this in Supabase SQL Editor

-- Add the column
ALTER TABLE invitational_signups ADD COLUMN IF NOT EXISTS event_date DATE;

-- Backfill existing rows as the April 12 event
UPDATE invitational_signups SET event_date = '2026-04-12' WHERE event_date IS NULL;

-- Make it NOT NULL going forward
ALTER TABLE invitational_signups ALTER COLUMN event_date SET NOT NULL;
ALTER TABLE invitational_signups ALTER COLUMN event_date SET DEFAULT CURRENT_DATE;

-- Index for fast queries per event
CREATE INDEX IF NOT EXISTS idx_invitational_event_date ON invitational_signups (event_date, signup_type);
