-- The Yard: Outside is Calling — Event Setup
-- 
-- STEP 1: Upload the flyer image to Supabase Storage
-- Go to Storage > media bucket > create folder "events/the-yard-may-24"
-- Upload the flyer as "flyer.jpg"
-- The public URL will be:
-- https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/events/the-yard-may-24/flyer.jpg
--
-- STEP 2: Run this SQL after uploading the image

-- Insert flyer into media table
INSERT INTO media (
  filename,
  storage_path,
  public_url,
  type,
  mime_type,
  alt_text,
  caption,
  category
) VALUES (
  'the-yard-may-24-flyer.jpg',
  'events/the-yard-may-24/flyer.jpg',
  'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/events/the-yard-may-24/flyer.jpg',
  'image',
  'image/jpeg',
  'The Yard: Outside is Calling — Cookout at Rock Creek Park',
  'Sunday, May 24 · 3–7 PM · Rock Creek Park · 100% of donations go towards Jamaica hurricane relief',
  'event'
)
RETURNING id;

-- Copy the returned UUID and use it below (replace YOUR_MEDIA_ID)
-- Or run this as a single transaction:

WITH flyer AS (
  INSERT INTO media (
    filename, storage_path, public_url, type, mime_type, alt_text, caption, category
  ) VALUES (
    'the-yard-may-24-flyer.jpg',
    'events/the-yard-may-24/flyer.jpg',
    'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/events/the-yard-may-24/flyer.jpg',
    'image', 'image/jpeg',
    'The Yard: Outside is Calling — Cookout at Rock Creek Park',
    'Sunday, May 24 · 3–7 PM · Rock Creek Park · 100% of donations go towards Jamaica hurricane relief',
    'event'
  )
  RETURNING id
)
INSERT INTO events (
  title,
  slug,
  description,
  date,
  time,
  location,
  address,
  ticket_url,
  published,
  featured,
  flyer_media_id
) VALUES (
  'The Yard: Outside is Calling',
  'the-yard-may-24',
  'Cookout · Rep Your Flag · Bring a Dish. 100% of donations go towards Jamaica hurricane relief. DM @nycedays to bring a dish.',
  '2026-05-24',
  '15:00',
  'Rock Creek Park — Picnic Grove 09',
  'Beach Dr NW, just north of Sherrill Dr, Washington DC',
  'https://posh.vip/g/nyce-days',
  true,
  true,
  (SELECT id FROM flyer)
);
