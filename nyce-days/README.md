# Nyce Days

> Event curation, community marketing, and content creation platform

**Live:** [nycedays.com](https://nycedays.com)

## Overview

Nyce Days is a full-stack web application for a creative platform spanning DC, NYC, and Baltimore. Features event management, portfolio showcase, e-commerce, and community engagement.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Magic Links) |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Email | Resend |
| Analytics | Custom (Supabase) |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

## Features

### Public Site
- Responsive design with VHS aesthetic
- Portfolio with category filtering
- Event calendar
- Newsletter signup with welcome emails
- Contact form with auto-reply

### Admin Dashboard (`/admin`)
- Authentication with magic links
- Analytics dashboard with real metrics
- Contact submission management
- Subscriber management with CSV export
- Content management (Projects, Events, Media, Products)

### Technical Highlights
- Custom analytics tracking (page views, conversions, scroll depth)
- Dynamic OG image generation
- Automated email notifications
- E2E test coverage with Playwright
- CI/CD pipeline with lint, type-check, test, build

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in your Supabase credentials

# Run development server
npm run dev

# Run tests
npm test
npm run test:e2e
```

## Environment Variables

See `.env.local.example` for required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_SITE_URL` - Site URL for OG images
- `RESEND_API_KEY` - (Optional) For email notifications
- `CONTACT_EMAIL` - (Optional) Admin notification email

## Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   ├── about/           # About page
│   ├── community/       # Community/events page
│   ├── contact/         # Contact page
│   ├── media/           # Media gallery
│   ├── portfolio/       # Portfolio pages
│   ├── services/        # Services page
│   └── shop/            # Shop pages
├── components/
│   ├── admin/           # Admin components
│   ├── community/       # Community components
│   ├── contact/         # Contact form
│   ├── layout/          # Nav, Footer
│   ├── shared/          # Shared components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── supabase/        # Database clients
│   ├── queries/         # Data fetching
│   └── schemas/         # Zod schemas
├── hooks/               # Custom hooks
├── e2e/                 # Playwright tests
└── public/              # Static assets
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

## Database Setup

Run the SQL schema in Supabase SQL Editor:
1. `supabase-schema.sql` - Main tables
2. `lib/supabase/analytics-schema.sql` - Analytics table

## Deployment

The site auto-deploys to Vercel on push to `main`. GitHub Actions runs:
1. Lint
2. Type check
3. Unit tests
4. Build

## License

Private - Nyce Days
