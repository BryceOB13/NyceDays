# Requirements Document

## Introduction

Nyce Days is a portfolio and community platform for event curation, community marketing, and merch. The website will showcase portfolio projects, upcoming events, a media gallery, shop (initially empty state), and contact functionality. Built with Next.js 14 App Router, Tailwind CSS, Shadcn/UI, and Supabase.

## Glossary

- **Website**: The Nyce Days Next.js web application
- **Project**: A portfolio case study showcasing work done for clients
- **Media**: Images and videos stored in Supabase Storage
- **Event**: An upcoming or past community event
- **Product**: A shop item (merch, tickets, accessories)
- **Subscriber**: A user who has signed up for the newsletter
- **Contact_Submission**: A form entry from the contact page
- **Hero**: A full-screen or large visual section at the top of a page
- **Gallery**: A grid or masonry layout of media items with lightbox functionality

## Requirements

### Requirement 1: Project Setup and Configuration

**User Story:** As a developer, I want a properly configured Next.js 14 project with all dependencies, so that I can build the website with the specified tech stack.

#### Acceptance Criteria

1. THE Website SHALL be initialized as a Next.js 14 App Router project with TypeScript
2. THE Website SHALL include Tailwind CSS 3.4.x configured with the Nyce Days design system colors and typography
3. THE Website SHALL include Shadcn/UI components (button, card, form, input, select, sheet, tabs, textarea)
4. THE Website SHALL include Framer Motion 11.x for animations
5. THE Website SHALL include React Hook Form 7.x with Zod 3.x for form validation
6. THE Website SHALL include yet-another-react-lightbox 3.25.x for gallery functionality
7. THE Website SHALL include Supabase client libraries (@supabase/supabase-js, @supabase/ssr)
8. THE Website SHALL have environment variables configured for Supabase connection

### Requirement 2: Layout and Navigation

**User Story:** As a visitor, I want consistent navigation and footer across all pages, so that I can easily move between sections of the site.

#### Acceptance Criteria

1. THE Website SHALL display a navigation bar with links to Home, About, Services, Portfolio, Media, Community, Shop, and Contact
2. WHEN the viewport width is less than 768px, THE Website SHALL display a mobile hamburger menu with a slide-out sheet
3. THE Website SHALL display a footer with the Nyce Days logo, tagline, social links, and newsletter signup form
4. WHEN a user clicks a navigation link, THE Website SHALL navigate to the corresponding page
5. THE Website SHALL apply the Georgia font family to headings and Helvetica Neue to body text

### Requirement 3: Home Page

**User Story:** As a visitor, I want to see an engaging home page that showcases what Nyce Days does, so that I understand the brand and services.

#### Acceptance Criteria

1. THE Website SHALL display a full-screen hero section with video background, logo, tagline "Have A Nyce Day!", and call-to-action button
2. THE Website SHALL display a "What We Do" section with 3 service cards (Event Curation, Community Marketing, Content Creation)
3. THE Website SHALL display a "Featured Work" section with up to 3 featured projects from the database
4. THE Website SHALL display a stats bar showing key metrics (100K+ impressions, 10+ team, 3 markets)
5. WHEN featured projects are fetched, THE Website SHALL only display projects where featured=true and published=true

### Requirement 4: Portfolio Pages

**User Story:** As a visitor, I want to browse and view portfolio projects, so that I can see examples of Nyce Days' work.

#### Acceptance Criteria

1. THE Website SHALL display a portfolio grid page at /portfolio with filterable project cards
2. WHEN a user selects a category filter (All, Events, Content, Partnerships), THE Website SHALL display only projects matching that category
3. THE Website SHALL display a project detail page at /portfolio/[slug] with hero media, metadata, content, and gallery
4. WHEN viewing a project detail page, THE Website SHALL display previous/next navigation to adjacent projects
5. IF a project slug does not exist, THE Website SHALL return a 404 page

### Requirement 5: Media Gallery Page

**User Story:** As a visitor, I want to browse photos and videos from Nyce Days events, so that I can see the community and atmosphere.

#### Acceptance Criteria

1. THE Website SHALL display a media gallery page at /media with filterable media items
2. WHEN a user selects a category filter (Events, Behind The Scenes, Merch, Community), THE Website SHALL display only media matching that category
3. WHEN a user clicks on a media item, THE Website SHALL open a lightbox with full-size view and navigation
4. THE Website SHALL display media items in a responsive grid layout

### Requirement 6: Community Page

**User Story:** As a visitor, I want to see upcoming events and sign up for the newsletter, so that I can stay connected with Nyce Days.

#### Acceptance Criteria

1. THE Website SHALL display a community page at /community with a hero section titled "You're Invited"
2. THE Website SHALL display upcoming events with flyer images, dates, locations, and ticket links
3. WHEN no upcoming events exist, THE Website SHALL display a message indicating no events are scheduled
4. THE Website SHALL display a newsletter signup form
5. WHEN a user submits a valid email to the newsletter form, THE Website SHALL save the subscription to the database and show a success message
6. WHEN a user submits an invalid email, THE Website SHALL display a validation error

### Requirement 7: Shop Pages

**User Story:** As a visitor, I want to browse and view products, so that I can purchase Nyce Days merchandise.

#### Acceptance Criteria

1. THE Website SHALL display a shop page at /shop
2. WHEN no products are published, THE Website SHALL display an empty state with "No drops right now. Check back soon." and a newsletter signup
3. WHEN products are published, THE Website SHALL display a product grid with filterable cards
4. THE Website SHALL display a product detail page at /shop/[slug] with images, description, price, and purchase options
5. IF a product slug does not exist, THE Website SHALL return a 404 page

### Requirement 8: Contact Page

**User Story:** As a visitor, I want to submit inquiries to Nyce Days, so that I can discuss partnerships or ask questions.

#### Acceptance Criteria

1. THE Website SHALL display a contact page at /contact with a form
2. THE Website SHALL require name, email, inquiry type, and message fields
3. THE Website SHALL provide optional company and referral fields
4. WHEN a user submits a valid contact form, THE Website SHALL save the submission to the database and show a success message
5. WHEN a user submits an invalid form, THE Website SHALL display validation errors for each invalid field
6. THE Website SHALL provide inquiry type options: Partnership, Event, Content, General

### Requirement 9: About Page

**User Story:** As a visitor, I want to learn about Nyce Days' story and values, so that I can understand the brand better.

#### Acceptance Criteria

1. THE Website SHALL display an about page at /about with hero section
2. THE Website SHALL display an origin story section with image and text
3. THE Website SHALL display a "By The Numbers" stats section
4. THE Website SHALL display a values section with numbered principles

### Requirement 10: Services Page

**User Story:** As a visitor, I want to understand what services Nyce Days offers, so that I can determine if they're a good fit for my needs.

#### Acceptance Criteria

1. THE Website SHALL display a services page at /services with hero section
2. THE Website SHALL display 4 service cards (Event Curation, Community Marketing, Content Creation, Merch & Brand Collaboration)
3. THE Website SHALL display a call-to-action section linking to the contact page

### Requirement 11: API Routes

**User Story:** As a developer, I want API endpoints for form submissions, so that the website can handle user interactions.

#### Acceptance Criteria

1. THE Website SHALL provide a POST /api/contact endpoint that validates and saves contact form submissions
2. THE Website SHALL provide a POST /api/subscribe endpoint that validates and saves newsletter subscriptions
3. WHEN a contact form is submitted, THE Website SHALL send an email notification to the configured contact email
4. WHEN an API request fails validation, THE Website SHALL return a 400 status with error details
5. WHEN an API request encounters a server error, THE Website SHALL return a 500 status with a generic error message

### Requirement 12: Shared Components

**User Story:** As a developer, I want reusable components, so that I can maintain consistency and reduce code duplication.

#### Acceptance Criteria

1. THE Website SHALL provide a VideoBackground component that displays video with poster image and overlay
2. THE Website SHALL provide a FadeUp animation wrapper component using Framer Motion
3. THE Website SHALL provide a Section component for consistent page section styling
4. THE Website SHALL provide a Lightbox component for media gallery viewing
5. THE Website SHALL provide a NewsletterForm component reusable across pages
