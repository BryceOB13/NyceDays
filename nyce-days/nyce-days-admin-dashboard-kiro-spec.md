# Kiro Spec: Nyce Days Admin Dashboard

## Overview

Build a comprehensive analytics admin dashboard for the Nyce Days Next.js application. The dashboard extends the existing `/admin` page with rich data visualizations, real-time metrics, and engagement analytics. All data comes from existing Supabase tables (`analytics_events`, `subscribers`, `sms_subscribers`, `contact_submissions`, `projects`, `events`).

## Tech Stack (Existing)

- **Framework**: Next.js 14+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts (install if not present)
- **Auth**: Supabase Auth (magic links) - already configured for /admin

## Requirements

### 1. Traffic Trends & Real-Time Users

Create a `TrafficTrendsCard` component at `components/admin/traffic-trends-card.tsx`:

- **Line chart** showing page views over time (hourly for today, daily for week/month view)
- Query: `analytics_events WHERE event_name='page_view'` grouped by time interval
- **Real-time active users counter**: Count distinct `session_id` from events in last 5 minutes
- **Unique visitors gauge**: Count distinct `session_id` for selected period (today/week/month)
- Include period selector tabs (Today | This Week | This Month)
- Auto-refresh every 30 seconds using `useEffect` interval or React Query

### 2. Subscriber Metrics

Create a `SubscriberMetricsCard` component at `components/admin/subscriber-metrics-card.tsx`:

- **Total subscriber counter** with weekly growth indicator (+X this week)
- **Growth trend line/bar chart**: New subscribers per day over last 30 days
- Query `subscribers` table, group by `created_at::date`
- **Source breakdown pie chart**: Distribution by `source` field (footer, community, shop, etc.)
- Include both email subscribers and SMS subscribers (separate or combined view)

### 3. Engagement & Behavior

Create an `EngagementCard` component at `components/admin/engagement-card.tsx`:

#### 3a. Bounce Rate Gauge
- Calculate: `(sessions with only 1 page_view) / (total sessions) * 100`
- Query `analytics_events` grouped by `session_id`, count page_views per session
- Display as circular gauge or prominent percentage

#### 3b. Scroll Depth Distribution
- Bar chart showing visitor counts at 25%, 50%, 75%, 100% scroll depths
- Query: `analytics_events WHERE event_name='scroll_depth'` grouped by `event_data->>'depth'`

#### 3c. CTA Clicks Table
- Table or horizontal bar chart of top CTA clicks
- Query: `analytics_events WHERE event_name='cta_click'` grouped by `event_data->>'cta_id'`
- Show click counts and destination URLs

#### 3d. Newsletter Signup Sparkline
- Mini line chart showing signups over last 14 days
- Query: `analytics_events WHERE event_name='newsletter_signup'`

### 4. Contact Form Funnel

Create a `ContactFunnelCard` component at `components/admin/contact-funnel-card.tsx`:

- **Funnel visualization** or side-by-side bars:
  - "Form Starts" (`event_name='contact_form_start'`)
  - "Form Submissions" (`event_name='contact_form_submit'`)
- **Conversion rate** prominently displayed: `(submits / starts) * 100`
- **Inquiry type breakdown**: Bar chart of counts by `event_data->>'inquiry_type'` or from `contact_submissions.inquiry_type`

### 5. Audience Breakdown

Create an `AudienceCard` component at `components/admin/audience-card.tsx`:

#### 5a. Referrer Sources
- Pie chart of top referrer domains from `analytics_events.referrer`
- Parse and group by domain (strip paths)
- Show top 5-10 with "Other" bucket

#### 5b. Device Breakdown
- Donut chart: Desktop vs Mobile vs Tablet
- Query `analytics_events` grouped by `device_type`

#### 5c. Geography (Future-Ready)
- Placeholder for country breakdown when `country` field is populated
- Show "Geo data coming soon" or hide if no data

### 6. Content Performance

Create a `ContentPerformanceCard` component at `components/admin/content-performance-card.tsx`:

#### 6a. Top Pages Table
- Table showing most-viewed pages ranked by view count
- Query: `analytics_events WHERE event_name='page_view'` grouped by `page_path`
- Columns: Page Path | Views | Unique Visitors

#### 6b. Events & Projects Tiles
- Card showing total upcoming events count (from `events` table where date >= now)
- Card showing total projects count (from `projects` table)
- Mini list of next 3 upcoming events with dates

### 7. Recent Activity Feed

Create a `RecentActivityCard` component at `components/admin/recent-activity-card.tsx`:

- Combined feed of latest activity:
  - Recent contact form submissions (with type and timestamp)
  - Recent newsletter signups (with source)
  - Recent analytics events (last 10, showing event type and page)
- Tabbed interface to filter by activity type
- Auto-refresh capability

## Data Fetching Architecture

### Server Actions (Recommended)

Create server actions at `app/admin/actions.ts`:

```typescript
'use server'

export async function getTrafficStats(period: 'today' | 'week' | 'month') { ... }
export async function getActiveUsers() { ... }
export async function getSubscriberStats() { ... }
export async function getEngagementStats() { ... }
export async function getContactFunnelStats() { ... }
export async function getAudienceStats() { ... }
export async function getTopPages(limit?: number) { ... }
export async function getRecentActivity(limit?: number) { ... }
```

### Real-Time Updates

Option A (Simple): Client-side polling with `useEffect` + `setInterval` (30-60 second refresh)

Option B (Advanced): Supabase Realtime subscription to `analytics_events` table for live updates

## UI/UX Guidelines

- Follow existing shadcn/ui patterns from current admin page
- Use `Card`, `CardHeader`, `CardTitle`, `CardContent` from shadcn
- Consistent color palette matching Nyce Days brand (check existing tailwind config)
- Responsive grid layout: 
  - Desktop: 2-3 column grid
  - Mobile: Single column stack
- Loading skeletons for async data
- Error states with retry buttons

## Dashboard Layout

Update `app/admin/page.tsx` to include new sections:

```
┌─────────────────────────────────────────────────────────────┐
│  NYCE DAYS ADMIN DASHBOARD                    [Refresh All] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   Active Users: 12  │  │  Unique Today: 156  │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │  Traffic Trends (Line Chart)                 │          │
│  │  [Today] [Week] [Month]                      │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  Subscribers        │  │  Engagement         │          │
│  │  Total: 1,234       │  │  Bounce: 45%        │          │
│  │  [Growth Chart]     │  │  [Scroll Depth]     │          │
│  │  [Source Pie]       │  │  [CTA Clicks]       │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  Contact Funnel     │  │  Audience           │          │
│  │  [Funnel Chart]     │  │  [Referrers Pie]    │          │
│  │  Conv Rate: 23%     │  │  [Devices Donut]    │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │  Top Pages                                   │          │
│  │  [Table: Page | Views | Unique]              │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  Events & Projects  │  │  Recent Activity    │          │
│  │  Upcoming: 5        │  │  [Activity Feed]    │          │
│  │  Projects: 12       │  │                     │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
app/
  admin/
    page.tsx              # Main dashboard (update existing)
    actions.ts            # Server actions for data fetching
    loading.tsx           # Loading skeleton

components/
  admin/
    traffic-trends-card.tsx
    subscriber-metrics-card.tsx
    engagement-card.tsx
    contact-funnel-card.tsx
    audience-card.tsx
    content-performance-card.tsx
    recent-activity-card.tsx
    stat-card.tsx          # Reusable stat display component
    chart-wrapper.tsx      # Consistent chart container
```

## Database Queries Reference

### Active Users (Last 5 Minutes)
```sql
SELECT COUNT(DISTINCT session_id) 
FROM analytics_events 
WHERE created_at > NOW() - INTERVAL '5 minutes'
```

### Bounce Rate
```sql
WITH session_counts AS (
  SELECT session_id, COUNT(*) as page_views
  FROM analytics_events
  WHERE event_name = 'page_view'
  GROUP BY session_id
)
SELECT 
  COUNT(*) FILTER (WHERE page_views = 1)::float / COUNT(*)::float * 100 as bounce_rate
FROM session_counts
```

### Scroll Depth Distribution
```sql
SELECT 
  event_data->>'depth' as depth,
  COUNT(*) as count
FROM analytics_events
WHERE event_name = 'scroll_depth'
GROUP BY event_data->>'depth'
ORDER BY depth
```

### Top Pages
```sql
SELECT 
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM analytics_events
WHERE event_name = 'page_view'
GROUP BY page_path
ORDER BY views DESC
LIMIT 10
```

### Subscriber Growth (Last 30 Days)
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_subscribers
FROM subscribers
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date
```

## Dependencies to Install

```bash
npm install recharts date-fns
```

(shadcn/ui components should already be available)

## Testing Checklist

- [ ] All charts render with sample/real data
- [ ] Period selectors update data correctly
- [ ] Auto-refresh works without memory leaks
- [ ] Mobile responsive layout
- [ ] Loading states display properly
- [ ] Error handling for failed queries
- [ ] Auth protection still works (only logged-in admin access)

## Notes

- Preserve existing admin functionality (recent messages, subscribers list)
- The `analytics_events` table already has all required event types tracked
- Charts should use brand colors from tailwind config
- Consider dark mode support if the site uses it
