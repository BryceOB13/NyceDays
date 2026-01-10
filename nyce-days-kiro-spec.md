# Nyce Days Website — Kiro Implementation Spec

## Overview

A portfolio and community platform for Nyce Days. Event curation, community marketing, and merch.

**Tagline**: *Have A Nyce Day!*

**Live URL**: nycedays.com (TBD)

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| UI Components | Shadcn/UI | latest |
| Animation | Framer Motion | 11.x |
| Database | Supabase (PostgreSQL) | - |
| Storage | Supabase Storage | - |
| Auth (future) | Supabase Auth | - |
| E-commerce | Snipcart or Stripe | - |
| Forms | React Hook Form + Zod | 7.x / 3.x |
| Gallery | yet-another-react-lightbox | 3.25.x |
| Hosting | Vercel | - |

---

## Database Schema (Supabase)

### Tables

#### `projects`
Portfolio projects and case studies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| created_at | timestamptz | default now() | Creation timestamp |
| updated_at | timestamptz | default now() | Last update |
| title | text | not null | Project title |
| slug | text | unique, not null | URL slug |
| description | text | | Short description |
| content | text | | Full project writeup (markdown) |
| client | text | | Client/brand name |
| date | date | | Project date |
| location | text | | Event location |
| category | text | | 'event', 'content', 'partnership' |
| services | text[] | | Array of services provided |
| featured | boolean | default false | Show on homepage |
| published | boolean | default true | Public visibility |
| hero_media_id | uuid | FK -> media.id | Hero image/video |
| sort_order | int | default 0 | Display order |

#### `media`
All images and videos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| created_at | timestamptz | default now() | Upload timestamp |
| filename | text | not null | Original filename |
| storage_path | text | not null | Supabase storage path |
| public_url | text | | CDN URL |
| type | text | not null | 'image', 'video' |
| mime_type | text | | e.g. 'image/jpeg', 'video/mp4' |
| width | int | | Pixel width |
| height | int | | Pixel height |
| size_bytes | bigint | | File size |
| alt_text | text | | Accessibility text |
| caption | text | | Display caption |
| category | text | | 'event', 'bts', 'merch', 'community' |
| project_id | uuid | FK -> projects.id | Associated project |
| sort_order | int | default 0 | Gallery order |

#### `products`
Merch and shop items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| created_at | timestamptz | default now() | Creation timestamp |
| updated_at | timestamptz | default now() | Last update |
| name | text | not null | Product name |
| slug | text | unique, not null | URL slug |
| description | text | | Product description |
| price | decimal(10,2) | not null | Price in USD |
| compare_price | decimal(10,2) | | Original price (for sales) |
| category | text | | 'apparel', 'accessories', 'tickets' |
| variants | jsonb | | Size/color variants |
| inventory | int | default 0 | Stock count |
| published | boolean | default false | Show in shop |
| featured | boolean | default false | Homepage feature |
| snipcart_id | text | | Snipcart product ID |
| sort_order | int | default 0 | Display order |

#### `product_images`
Product image associations (many-to-many).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| product_id | uuid | FK -> products.id, not null | Product reference |
| media_id | uuid | FK -> media.id, not null | Media reference |
| is_primary | boolean | default false | Primary display image |
| sort_order | int | default 0 | Gallery order |

#### `events`
Upcoming and past events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| created_at | timestamptz | default now() | Creation timestamp |
| title | text | not null | Event name |
| slug | text | unique, not null | URL slug |
| description | text | | Event description |
| date | date | not null | Event date |
| time | time | | Start time |
| end_date | date | | End date (multi-day) |
| location | text | | Venue/city |
| address | text | | Full address |
| ticket_url | text | | External ticket link |
| ticket_price | decimal(10,2) | | Ticket price |
| published | boolean | default true | Public visibility |
| featured | boolean | default false | Homepage feature |
| flyer_media_id | uuid | FK -> media.id | Event flyer image |
| project_id | uuid | FK -> projects.id | Link to portfolio |

#### `subscribers`
Newsletter signups.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| created_at | timestamptz | default now() | Signup timestamp |
| email | text | unique, not null | Email address |
| source | text | | 'footer', 'community', 'shop' |
| subscribed | boolean | default true | Active subscription |

#### `contact_submissions`
Contact form entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| created_at | timestamptz | default now() | Submission timestamp |
| name | text | not null | Contact name |
| email | text | not null | Contact email |
| company | text | | Company/brand |
| inquiry_type | text | not null | 'partnership', 'event', 'content', 'general' |
| message | text | not null | Message content |
| referral | text | | How they found us |
| read | boolean | default false | Admin read status |
| archived | boolean | default false | Admin archived |

#### `site_settings`
Global site configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | Unique ID |
| key | text | unique, not null | Setting key |
| value | jsonb | | Setting value |
| updated_at | timestamptz | default now() | Last update |

---

## Supabase Storage Buckets

### `media`
All images and videos for the site.

```
media/
├── projects/           # Portfolio project media
│   ├── {project-slug}/
│   │   ├── hero.mp4
│   │   ├── hero-poster.jpg
│   │   ├── gallery-01.jpg
│   │   └── gallery-02.jpg
├── events/             # Event flyers and photos
│   ├── {event-slug}/
│   │   └── flyer.jpg
├── products/           # Product photography
│   ├── {product-slug}/
│   │   ├── main.jpg
│   │   ├── alt-01.jpg
│   │   └── alt-02.jpg
├── gallery/            # General media gallery
│   ├── events/
│   ├── bts/
│   ├── merch/
│   └── community/
└── site/               # Site assets
    ├── hero-video.mp4
    ├── hero-video.webm
    ├── hero-poster.jpg
    ├── logo.svg
    └── og-image.jpg
```

**Bucket Settings**:
- Public bucket (for CDN delivery)
- File size limit: 50MB (for videos)
- Allowed MIME types: image/*, video/mp4, video/webm

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site
NEXT_PUBLIC_SITE_URL=https://nycedays.com

# E-commerce (choose one)
NEXT_PUBLIC_SNIPCART_API_KEY=...
# OR
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (for contact form)
RESEND_API_KEY=re_...
CONTACT_EMAIL=hello@nycedays.com
```

---

## File Structure

```
nyce-days/
├── .kiro/
│   └── specs/
│       └── nyce-days.md          # This spec
├── app/
│   ├── layout.tsx                # Root layout, fonts, providers
│   ├── page.tsx                  # Home
│   ├── about/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── portfolio/
│   │   ├── page.tsx              # Project grid
│   │   └── [slug]/
│   │       └── page.tsx          # Project detail
│   ├── media/
│   │   └── page.tsx
│   ├── community/
│   │   └── page.tsx
│   ├── shop/
│   │   ├── page.tsx              # Product grid (empty state)
│   │   └── [slug]/
│   │       └── page.tsx          # Product detail
│   ├── contact/
│   │   └── page.tsx
│   └── api/
│       ├── contact/
│       │   └── route.ts          # Contact form submission
│       ├── subscribe/
│       │   └── route.ts          # Newsletter signup
│       └── revalidate/
│           └── route.ts          # On-demand ISR
├── components/
│   ├── ui/                       # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── layout/
│   │   ├── nav.tsx
│   │   ├── mobile-nav.tsx
│   │   └── footer.tsx
│   ├── home/
│   │   ├── hero.tsx
│   │   ├── what-we-do.tsx
│   │   ├── featured-work.tsx
│   │   ├── stats-bar.tsx
│   │   └── partner-logos.tsx
│   ├── portfolio/
│   │   ├── project-grid.tsx
│   │   ├── project-card.tsx
│   │   └── project-gallery.tsx
│   ├── media/
│   │   └── media-gallery.tsx
│   ├── shop/
│   │   ├── product-grid.tsx
│   │   ├── product-card.tsx
│   │   └── empty-state.tsx
│   ├── community/
│   │   ├── event-card.tsx
│   │   └── newsletter-form.tsx
│   └── shared/
│       ├── video-background.tsx
│       ├── fade-up.tsx
│       ├── section.tsx
│       └── lightbox.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Service role client
│   ├── queries/
│   │   ├── projects.ts
│   │   ├── media.ts
│   │   ├── products.ts
│   │   └── events.ts
│   ├── utils.ts                  # cn(), formatDate(), etc.
│   └── schemas.ts                # Zod validation schemas
├── types/
│   ├── database.ts               # Supabase generated types
│   └── index.ts                  # Shared types
├── styles/
│   └── globals.css               # Tailwind + custom CSS vars
├── public/
│   ├── fonts/                    # Local font files (if needed)
│   └── favicon.ico
├── .env.local                    # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

### Fonts

**Adobe Fonts (Typekit)**:
- Georgia (serif) — Headlines
- Helvetica Neue (sans-serif) — Body, UI

```tsx
// app/layout.tsx
<head>
  <link rel="stylesheet" href="https://use.typekit.net/[PROJECT_ID].css" />
</head>
```

```css
/* tailwind.config.ts */
fontFamily: {
  serif: ['Georgia', 'Times New Roman', 'serif'],
  sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
}
```

### Colors

```css
/* globals.css */
:root {
  --nd-black: #0A0A0A;
  --nd-white: #F5F5F2;
  --nd-cream: #E8E4DD;
  --nd-red: #D64545;
  --nd-amber: #E89B3C;
  --nd-gray-900: #1A1A1A;
  --nd-gray-700: #2A2A2A;
  --nd-gray-500: #6B6B6B;
  --nd-gray-300: #B8B8B8;
  --nd-gray-100: #E5E5E5;
}
```

### Typography Scale

| Element | Font | Size |
|---------|------|------|
| H1 | Georgia | clamp(3rem, 8vw, 5.5rem) |
| H2 | Georgia | clamp(2rem, 5vw, 3rem) |
| H3 | Helvetica Neue Medium | 1.25rem |
| Body | Helvetica Neue | 1rem |
| Caption | Helvetica Neue Medium | 0.75rem |

---

## Pages

### 1. Home (`/`)

**Sections**:
1. Hero — Full-screen VHS video background, logo, tagline, CTA
2. What We Do — 3-column grid (Event Curation, Community Marketing, Content Creation)
3. Featured Work — 3 project cards from portfolio
4. Stats Bar — 100K+ impressions, 10+ team, 3 markets
5. Partner Logos — Optional grayscale logo bar

**Data**:
```ts
// Fetch featured projects
const projects = await supabase
  .from('projects')
  .select('*, hero_media:media(*)')
  .eq('featured', true)
  .eq('published', true)
  .order('sort_order')
  .limit(3)
```

### 2. About (`/about`)

**Sections**:
1. Hero — 60vh with headline
2. Origin Story — 2-column (image + text)
3. By The Numbers — Stats grid
4. Values — Numbered list of principles

**Content**: Static markdown or CMS

### 3. Services (`/services`)

**Sections**:
1. Hero — 50vh with headline
2. Service Cards — 4 full-width alternating cards
3. CTA — "Let's talk about your vision."

**Services**:
- Event Curation
- Community Marketing
- Content Creation
- Merch & Brand Collaboration

### 4. Portfolio (`/portfolio`)

**Features**:
- Filter tabs: All, Events, Content, Partnerships
- Grid of project cards
- Click to detail page

**Data**:
```ts
const projects = await supabase
  .from('projects')
  .select('*, hero_media:media(*)')
  .eq('published', true)
  .order('sort_order')
```

### 5. Portfolio Detail (`/portfolio/[slug]`)

**Sections**:
1. Hero image/video
2. Project metadata (client, date, location, services)
3. Content (markdown)
4. Photo/video gallery
5. Prev/Next navigation

**Data**:
```ts
const project = await supabase
  .from('projects')
  .select('*, hero_media:media(*), gallery:media(*)')
  .eq('slug', slug)
  .single()
```

### 6. Media (`/media`)

**Features**:
- Filter tabs: Events, Behind The Scenes, Merch, Community
- Masonry/rows photo grid
- Lightbox on click
- Instagram CTA

**Data**:
```ts
const media = await supabase
  .from('media')
  .select('*')
  .eq('type', 'image')
  .order('created_at', { ascending: false })
```

### 7. Community (`/community`)

**Sections**:
1. Hero — "You're Invited"
2. Upcoming Events — Event cards with flyers
3. Newsletter Signup — Email capture form

**Data**:
```ts
const events = await supabase
  .from('events')
  .select('*, flyer:media(*)')
  .eq('published', true)
  .gte('date', new Date().toISOString())
  .order('date')
```

### 8. Shop (`/shop`)

**States**:
- Empty: "No drops right now. Check back soon." + newsletter CTA
- Active: Product grid with filters

**Data**:
```ts
const products = await supabase
  .from('products')
  .select('*, images:product_images(*, media(*))')
  .eq('published', true)
  .order('sort_order')
```

### 9. Contact (`/contact`)

**Form Fields**:
- Name (required)
- Email (required)
- Company/Brand
- Inquiry Type (select)
- Message (required)
- How'd you hear about us?

**Submission**:
```ts
// app/api/contact/route.ts
await supabase.from('contact_submissions').insert({
  name,
  email,
  company,
  inquiry_type,
  message,
  referral
})

// Send email notification via Resend
await resend.emails.send({
  to: process.env.CONTACT_EMAIL,
  subject: `New inquiry from ${name}`,
  // ...
})
```

---

## Key Components

### VideoBackground

```tsx
interface VideoBackgroundProps {
  src: string;
  poster: string;
  overlay?: string; // Tailwind class, default "bg-black/50"
  children: React.ReactNode;
}
```

### FadeUp (Animation Wrapper)

```tsx
interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}
```

### ProjectCard

```tsx
interface ProjectCardProps {
  project: {
    title: string;
    slug: string;
    category: string;
    date: string;
    hero_media: {
      public_url: string;
      alt_text: string;
    };
  };
}
```

### NewsletterForm

```tsx
// Uses react-hook-form + zod
// Submits to /api/subscribe
// Shows success/error states
```

---

## API Routes

### `POST /api/contact`
Handles contact form submissions.

### `POST /api/subscribe`
Handles newsletter signups.

### `POST /api/revalidate`
On-demand ISR for content updates (webhook from Supabase).

---

## Deployment

### Vercel
1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Supabase Setup
1. Create project
2. Run SQL migrations (see `supabase/migrations/`)
3. Create storage bucket
4. Set bucket to public
5. Copy API keys to Vercel env vars

---

## Next Steps

1. [ ] Set up Supabase project
2. [ ] Run database migrations
3. [ ] Configure storage bucket
4. [ ] Set up Adobe Fonts project
5. [ ] Initialize Next.js project
6. [ ] Install Shadcn components
7. [ ] Build layout (nav, footer)
8. [ ] Build home page
9. [ ] Build remaining pages
10. [ ] Add content
11. [ ] Configure Snipcart/Stripe
12. [ ] Deploy to Vercel
13. [ ] Connect domain

---

*Kiro Implementation Spec v1.0 — Nyce Days*
