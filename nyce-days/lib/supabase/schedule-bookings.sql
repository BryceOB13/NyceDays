-- Schedule Bookings table for DJ content scheduling
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS schedule_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_date DATE UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  instagram_handle TEXT,
  media_link TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'confirmed')),
  is_ready BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule_bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_schedule_status ON schedule_bookings (status);

ALTER TABLE schedule_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view schedule" ON schedule_bookings
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public can update open bookings" ON schedule_bookings
  FOR UPDATE TO anon USING (status = 'open');

-- Seed some open dates (April-May 2026)
INSERT INTO schedule_bookings (booking_date, status) VALUES
  ('2026-04-21', 'open'),
  ('2026-04-22', 'open'),
  ('2026-04-23', 'open'),
  ('2026-04-24', 'open'),
  ('2026-04-25', 'open'),
  ('2026-04-28', 'open'),
  ('2026-04-29', 'open'),
  ('2026-04-30', 'open'),
  ('2026-05-01', 'open'),
  ('2026-05-02', 'open'),
  ('2026-05-05', 'open'),
  ('2026-05-06', 'open'),
  ('2026-05-07', 'open'),
  ('2026-05-08', 'open'),
  ('2026-05-09', 'open')
ON CONFLICT (booking_date) DO NOTHING;
