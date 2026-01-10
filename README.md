# Nyce Days Website

Portfolio and community platform for Nyce Days — event curation, community marketing, and merch.

**Tagline**: *Have A Nyce Day!*

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Animation**: Framer Motion
- **E-commerce**: Snipcart or Stripe
- **Hosting**: Vercel

## Quick Start

### 1. Clone and Install

```bash
# Create Next.js project
npx create-next-app@latest nyce-days --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd nyce-days

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr framer-motion react-hook-form zod @hookform/resolvers yet-another-react-lightbox react-photo-album

# Install Shadcn
npx shadcn@latest init

# Add Shadcn components
npx shadcn@latest add button card form input select sheet tabs textarea
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Storage** and create a public bucket named `media`
4. Go to **Settings > API** and copy your keys

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials and other API keys.

### 4. Add Adobe Fonts

1. Go to [fonts.adobe.com](https://fonts.adobe.com)
2. Add **Georgia** and **Helvetica Neue** to a web project
3. Copy your project ID
4. Add the stylesheet link to `app/layout.tsx`:

```tsx
<head>
  <link rel="stylesheet" href="https://use.typekit.net/YOUR_ID.css" />
</head>
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nyce-days/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home
│   ├── about/
│   ├── services/
│   ├── portfolio/
│   ├── media/
│   ├── community/
│   ├── shop/
│   ├── contact/
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Shadcn components
│   ├── layout/             # Nav, Footer
│   └── shared/             # Reusable components
├── lib/
│   ├── supabase/           # Supabase clients
│   └── queries/            # Database queries
├── types/
│   └── database.ts         # TypeScript types
└── styles/
    └── globals.css         # Tailwind + CSS vars
```

## Database Schema

See `supabase-schema.sql` for the complete schema. Key tables:

- `projects` — Portfolio case studies
- `media` — Images and videos
- `products` — Shop items
- `events` — Upcoming events
- `subscribers` — Newsletter signups
- `contact_submissions` — Contact form entries

## Storage Structure

```
media/
├── projects/{slug}/        # Project media
├── events/{slug}/          # Event flyers
├── products/{slug}/        # Product photos
├── gallery/                # General gallery
│   ├── events/
│   ├── bts/
│   ├── merch/
│   └── community/
└── site/                   # Site assets
    ├── hero-video.mp4
    └── logo.svg
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, What We Do, Featured Work, Stats |
| `/about` | Origin story, values, stats |
| `/services` | Service offerings for brands |
| `/portfolio` | Project grid with filters |
| `/portfolio/[slug]` | Project detail with gallery |
| `/media` | Photo/video gallery |
| `/community` | Events calendar, newsletter signup |
| `/shop` | Product grid (empty state initially) |
| `/shop/[slug]` | Product detail |
| `/contact` | Contact form |

## Design System

### Colors

```css
--nd-black: #0A0A0A
--nd-white: #F5F5F2
--nd-cream: #E8E4DD
--nd-red: #D64545
--nd-amber: #E89B3C
```

### Typography

- **Headlines**: Georgia (serif)
- **Body/UI**: Helvetica Neue (sans-serif)

### Aesthetic

Clean, minimal UI with warm VHS video backgrounds. No scan lines or glitch effects — just authentic analog warmth paired with efficient modern design.

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Vercel

Add all variables from `.env.local.example` to your Vercel project settings.

## E-commerce Setup

### Option 1: Snipcart

1. Create account at [snipcart.com](https://snipcart.com)
2. Add your API key to `.env.local`
3. Add Snipcart script to `app/layout.tsx`

### Option 2: Stripe Checkout

1. Create account at [stripe.com](https://stripe.com)
2. Add your keys to `.env.local`
3. Create products in Stripe Dashboard
4. Implement checkout API route

## Content Management

For easy content updates without code changes:

1. Use Supabase Dashboard directly
2. Or integrate a headless CMS (Sanity, Contentful)
3. Or build a simple admin panel

## License

Private — Nyce Days
