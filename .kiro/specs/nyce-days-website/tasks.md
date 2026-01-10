# Implementation Plan: Nyce Days Website

## Overview

This plan implements the Nyce Days portfolio and community platform using Next.js 14 App Router, Tailwind CSS, Shadcn/UI, and Supabase. Tasks are ordered to build foundational elements first, then pages, with testing integrated throughout.

## Tasks

- [x] 1. Initialize Next.js project and configure dependencies
  - [x] 1.1 Create Next.js 14 project with TypeScript, Tailwind, ESLint, App Router
    - Run `npx create-next-app@latest` with appropriate flags
    - _Requirements: 1.1_
  - [x] 1.2 Install additional dependencies
    - Install: @supabase/supabase-js, @supabase/ssr, framer-motion, react-hook-form, @hookform/resolvers, zod, yet-another-react-lightbox
    - _Requirements: 1.4, 1.5, 1.6, 1.7_
  - [x] 1.3 Initialize Shadcn/UI and add required components
    - Run `npx shadcn@latest init` and add: button, card, form, input, select, sheet, tabs, textarea
    - _Requirements: 1.3_
  - [x] 1.4 Configure Tailwind with Nyce Days design system
    - Add custom colors (nd-black, nd-white, nd-cream, nd-red, nd-amber, grays)
    - Add font families (Georgia for serif, Helvetica Neue for sans)
    - _Requirements: 1.2, 2.5_
  - [x] 1.5 Set up environment variables and Supabase clients
    - Create .env.local with Supabase credentials
    - Move existing client.ts, server.ts, admin.ts to lib/supabase/
    - Move types-database.ts to types/database.ts
    - Move index.ts to lib/queries/index.ts
    - _Requirements: 1.8_

- [x] 2. Create validation schemas and utility functions
  - [x] 2.1 Create Zod validation schemas
    - Create lib/schemas.ts with contactFormSchema and subscribeSchema
    - _Requirements: 8.2, 8.3, 8.6_
  - [x] 2.2 Write property tests for validation schemas
    - **Property 5: Email Validation**
    - **Property 6: Contact Form Validation**
    - **Validates: Requirements 6.6, 8.5**
  - [x] 2.3 Create utility functions
    - Create lib/utils.ts with cn(), formatDate(), formatPrice() helpers
    - _Requirements: 12.1_

- [x] 3. Checkpoint - Verify project setup
  - Ensure all dependencies installed correctly
  - Ensure TypeScript compiles without errors
  - Ask the user if questions arise

- [x] 4. Build shared components
  - [x] 4.1 Create VideoBackground component
    - Implement autoplay, muted, loop video with poster fallback and overlay
    - _Requirements: 12.1_
  - [x] 4.2 Create FadeUp animation component
    - Implement Framer Motion fade-in and slide-up on viewport entry
    - _Requirements: 12.2_
  - [x] 4.3 Create Section component
    - Implement consistent section wrapper with max-width and padding
    - _Requirements: 12.3_
  - [x] 4.4 Create Lightbox component
    - Wrap yet-another-react-lightbox with project styling
    - _Requirements: 12.4_

- [x] 5. Build layout components
  - [x] 5.1 Create Nav component
    - Implement desktop navigation with all page links
    - _Requirements: 2.1_
  - [x] 5.2 Create MobileNav component
    - Implement hamburger menu with Shadcn Sheet for mobile
    - _Requirements: 2.2_
  - [x] 5.3 Create Footer component
    - Implement footer with logo, links, social, newsletter form placeholder
    - _Requirements: 2.3_
  - [x] 5.4 Create root layout
    - Set up app/layout.tsx with fonts, Nav, Footer, and providers
    - _Requirements: 2.4, 2.5_

- [x] 6. Build NewsletterForm component and subscribe API
  - [x] 6.1 Create NewsletterForm component
    - Implement email input with react-hook-form and Zod validation
    - Handle success/error states
    - _Requirements: 6.4, 6.5, 6.6_
  - [x] 6.2 Create /api/subscribe route
    - Validate request with subscribeSchema
    - Upsert to subscribers table
    - Return appropriate responses
    - _Requirements: 11.2, 11.4_
  - [x] 6.3 Write property tests for subscribe API
    - **Property 7: Newsletter Subscription Round-Trip**
    - **Property 9: API Validation Error Response (subscribe)**
    - **Validates: Requirements 6.5, 11.2, 11.4**

- [x] 7. Build contact form and API
  - [x] 7.1 Create ContactForm component
    - Implement form with all fields using react-hook-form and Zod
    - Handle success/error states with field-level errors
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  - [x] 7.2 Create /api/contact route
    - Validate request with contactFormSchema
    - Insert to contact_submissions table
    - Send email notification (placeholder for Resend integration)
    - _Requirements: 11.1, 11.3, 11.4, 11.5_
  - [x] 7.3 Write property tests for contact API
    - **Property 8: Contact Submission Round-Trip**
    - **Property 9: API Validation Error Response (contact)**
    - **Validates: Requirements 8.4, 11.1, 11.4**

- [x] 8. Checkpoint - Verify core components and APIs
  - Ensure all tests pass
  - Verify forms submit correctly
  - Ask the user if questions arise

- [x] 9. Build home page components
  - [x] 9.1 Create Hero component
    - Implement full-screen hero with VideoBackground, logo, tagline, CTA
    - _Requirements: 3.1_
  - [x] 9.2 Create WhatWeDo component
    - Implement 3-column service cards grid
    - _Requirements: 3.2_
  - [x] 9.3 Create FeaturedWork component
    - Fetch and display up to 3 featured projects
    - _Requirements: 3.3, 3.5_
  - [x] 9.4 Create StatsBar component
    - Implement horizontal stats display
    - _Requirements: 3.4_
  - [x] 9.5 Create home page
    - Assemble all home components in app/page.tsx
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 9.6 Write property tests for featured projects query
    - **Property 1: Featured Projects Filter**
    - **Validates: Requirements 3.5**

- [x] 10. Build portfolio pages
  - [x] 10.1 Create ProjectCard component
    - Implement card with hero image, title, category, date
    - _Requirements: 4.1_
  - [x] 10.2 Create ProjectGrid component
    - Implement filterable grid with category tabs
    - _Requirements: 4.1, 4.2_
  - [x] 10.3 Create portfolio list page
    - Fetch all projects and render ProjectGrid at /portfolio
    - _Requirements: 4.1_
  - [x] 10.4 Write property tests for project category filter
    - **Property 2: Project Category Filter**
    - **Validates: Requirements 4.2**
  - [x] 10.5 Create ProjectGallery component
    - Implement thumbnail grid with Lightbox integration
    - _Requirements: 4.3_
  - [x] 10.6 Create project detail page
    - Fetch project by slug, display hero, metadata, content, gallery
    - Implement prev/next navigation
    - Handle 404 for invalid slugs
    - _Requirements: 4.3, 4.4, 4.5_
  - [x] 10.7 Write property tests for adjacent project navigation
    - **Property 3: Adjacent Project Navigation**
    - **Validates: Requirements 4.4**

- [x] 11. Build media gallery page
  - [x] 11.1 Create MediaGallery component
    - Implement filterable grid with category tabs and Lightbox
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 11.2 Create media page
    - Fetch media and render MediaGallery at /media
    - _Requirements: 5.1, 5.4_
  - [x] 11.3 Write property tests for media category filter
    - **Property 4: Media Category Filter**
    - **Validates: Requirements 5.2**

- [x] 12. Build community page
  - [x] 12.1 Create EventCard component
    - Implement card with flyer, title, date, location, ticket link
    - _Requirements: 6.2_
  - [x] 12.2 Create community page
    - Fetch upcoming events, display hero, event cards, newsletter form
    - Handle empty state when no events
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 13. Build shop pages
  - [x] 13.1 Create ProductCard component
    - Implement card with image, name, price, compare price
    - _Requirements: 7.3_
  - [x] 13.2 Create ProductGrid component
    - Implement filterable grid with category tabs
    - _Requirements: 7.3_
  - [x] 13.3 Create EmptyState component
    - Implement "No drops right now" message with newsletter CTA
    - _Requirements: 7.2_
  - [x] 13.4 Create shop list page
    - Fetch products, show EmptyState or ProductGrid
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 13.5 Create product detail page
    - Fetch product by slug, display images, description, price
    - Handle 404 for invalid slugs
    - _Requirements: 7.4, 7.5_

- [x] 14. Build static pages
  - [x] 14.1 Create about page
    - Implement hero, origin story, stats, values sections
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 14.2 Create services page
    - Implement hero, 4 service cards, CTA section
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 14.3 Create contact page
    - Implement page with ContactForm component
    - _Requirements: 8.1_

- [x] 15. Final checkpoint - Complete integration
  - Ensure all pages render correctly
  - Ensure all tests pass
  - Verify navigation works across all pages
  - Ask the user if questions arise

## Notes

- All tasks including property tests are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Existing Supabase client code and types will be moved into the new project structure
