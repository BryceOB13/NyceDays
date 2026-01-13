-- Nyce Days Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MEDIA TABLE
-- ============================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  mime_type TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  alt_text TEXT,
  caption TEXT,
  category TEXT CHECK (category IN ('event', 'bts', 'merch', 'community', 'site')),
  project_id UUID,
  sort_order INT DEFAULT 0
);

CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_project ON media(project_id);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  client TEXT,
  date DATE,
  location TEXT,
  category TEXT CHECK (category IN ('event', 'content', 'partnership')),
  services TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  hero_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_published ON projects(published) WHERE published = TRUE;

-- Add foreign key from media to projects (after projects table exists)
ALTER TABLE media ADD CONSTRAINT fk_media_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  category TEXT CHECK (category IN ('apparel', 'accessories', 'tickets')),
  variants JSONB DEFAULT '[]'::jsonb,
  inventory INT DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  snipcart_id TEXT,
  sort_order INT DEFAULT 0
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_published ON products(published) WHERE published = TRUE;

-- ============================================
-- PRODUCT IMAGES (Junction Table)
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  UNIQUE(product_id, media_id)
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id) WHERE is_primary = TRUE;

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  end_date DATE,
  location TEXT,
  address TEXT,
  ticket_url TEXT,
  ticket_price DECIMAL(10,2),
  published BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  flyer_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_published ON events(published) WHERE published = TRUE;
CREATE INDEX idx_events_upcoming ON events(date) WHERE date >= CURRENT_DATE;

-- ============================================
-- SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  source TEXT CHECK (source IN ('footer', 'community', 'shop', 'contact', 'modal')),
  email_consent BOOLEAN DEFAULT TRUE,
  sms_consent BOOLEAN DEFAULT FALSE,
  subscribed BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_subscribed ON subscribers(subscribed) WHERE subscribed = TRUE;

-- ============================================
-- SMS SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE sms_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  phone TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  source TEXT CHECK (source IN ('footer', 'community', 'shop', 'contact', 'modal')),
  subscribed BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sms_subscribers_phone ON sms_subscribers(phone);
CREATE INDEX idx_sms_subscribers_subscribed ON sms_subscribers(subscribed) WHERE subscribed = TRUE;

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('partnership', 'event', 'content', 'general')),
  message TEXT NOT NULL,
  referral TEXT,
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_unread ON contact_submissions(read) WHERE read = FALSE;

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"Nyce Days"'),
  ('tagline', '"Have A Nyce Day!"'),
  ('contact_email', '"hello@nycedays.com"'),
  ('instagram_url', '"https://instagram.com/nycedays"'),
  ('stats', '{"impressions": "100K+", "team_size": "10+", "markets": "3"}');

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (for published content)
CREATE POLICY "Public can view media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

-- Public insert policies (for forms)
CREATE POLICY "Public can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can subscribe sms" ON sms_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Service role has full access (for admin/API)
-- Note: Service role bypasses RLS by default

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Run these in Supabase Dashboard > Storage

-- 1. Create bucket named "media"
-- 2. Set bucket to PUBLIC
-- 3. Add policy for public read access:
--    - Name: "Public Access"
--    - Allowed operation: SELECT
--    - Target roles: anon, authenticated
--    - Policy: true

-- For uploads via service role, use the service_role key
-- which bypasses RLS

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample project
INSERT INTO projects (title, slug, description, category, services, featured, published) VALUES
(
  'Genre Roulette Brooklyn',
  'genre-roulette-brooklyn',
  'A night of musical discovery where DJs spin surprise genres all night long.',
  'event',
  ARRAY['Event Curation', 'Content Creation'],
  true,
  true
);

-- Insert sample event
INSERT INTO events (title, slug, description, date, location, published, featured) VALUES
(
  'Everyday Holiday',
  'everyday-holiday-2024',
  'Annual holiday celebration with the Nyce Days community.',
  '2024-12-21',
  'Washington, DC',
  true,
  true
);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Featured projects with media
CREATE VIEW featured_projects AS
SELECT 
  p.*,
  m.public_url as hero_url,
  m.alt_text as hero_alt
FROM projects p
LEFT JOIN media m ON p.hero_media_id = m.id
WHERE p.featured = true AND p.published = true
ORDER BY p.sort_order;

-- Upcoming events with flyers
CREATE VIEW upcoming_events AS
SELECT 
  e.*,
  m.public_url as flyer_url,
  m.alt_text as flyer_alt
FROM events e
LEFT JOIN media m ON e.flyer_media_id = m.id
WHERE e.published = true AND e.date >= CURRENT_DATE
ORDER BY e.date;

-- Published products with primary image
CREATE VIEW shop_products AS
SELECT 
  p.*,
  m.public_url as image_url,
  m.alt_text as image_alt
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
LEFT JOIN media m ON pi.media_id = m.id
WHERE p.published = true
ORDER BY p.sort_order;
