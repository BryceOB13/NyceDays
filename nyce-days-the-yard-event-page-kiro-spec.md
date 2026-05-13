# Kiro Spec: THE YARD — Event Landing Page

## Overview

Build a dedicated event landing page for THE YARD at `/events/the-yard` on the Nyce Days site. The event is already in the `events` table (slug: `the-yard-may-24`) and the `/donate` route is already live from previous work. This page is the richer detail view someone lands on from the IG link, the SMS blast, or the events list card — pulling all the CTAs into one place.

This is the second event in the May 2026 arc (ROYALTIES → THE YARD → NEW MONEY). The Yard is the cause-driven middle: Caribbean cookout, Memorial Day weekend, 100% of donations to Jamaica hurricane relief.

## Stack reminders

- Next.js (App Router) + TypeScript
- Supabase for the event row (already populated)
- Tailwind + existing brand tokens
- Reuse the video background, button primitives, and event card components already in the repo
- Tokens: `--nd-black #0A0A0A`, `--nd-white #F5F5F2`, `--nd-cream #E8E4DD`, `--nd-red #D64545`, `--nd-amber #E89B3C`
- Type: Georgia for headlines, Helvetica Neue for body/UI

## Reuse, don't rebuild

Search the codebase first. Reuse:

- The video/image background hero treatment used on `/donate` — match it so moving between the two pages feels like one experience
- `components/ui/` button, card, and link primitives
- The events card/list components on the existing events page
- The same image loading pattern (Next.js `<Image>` with `priority`) as `/donate` uses for the flyer
- The analytics event firing pattern already in use elsewhere on the site

If any of these don't exist where you expect, flag it before writing your own.

## Route

Create:

```
app/events/the-yard/page.tsx
```

If a dynamic slug route already exists (`app/events/[slug]/page.tsx`), use that instead and map `the-yard` → `the-yard-may-24` in the slug lookup. Check first. Don't create a duplicate route.

Server component for the data fetch. Pull the event row from the `events` table by slug `the-yard-may-24`. Fail gracefully (404 via `notFound()`) if missing.

## Event data (for reference, should match what's already in the events table)

- Name: THE YARD
- Subtitle: a nyce days cookout · rep your flag
- Date: Sunday, May 24, 2026
- Time: 3:00 PM to 7:00 PM
- Venue: Rock Creek Park, Picnic Grove 09
- Address: Beach Drive NW, just north of Sherrill Drive, Washington DC
- Admission: Free RSVP, donations welcomed
- Cause: 100% of donations go to Jamaica hurricane relief
- Hosted by: @nycedays
- Flyer asset: `public/events/the-yard-may-24/flyer.jpg` (or matching Supabase Storage path)
- Posh RSVP URL: pull from the event row (or use `TODO_BRYCE_POSH_URL` placeholder if null)

## Page layout

Mobile-first. Single column on mobile, two-pane on desktop (flyer left, content right). Both fit single-screen on desktop above the fold.

### Hero section

- Flyer image as the visual anchor (4:5 portrait, priority load)
- On mobile, flyer sits at the top, tappable to lightbox/expand
- Headline: `THE YARD` (Georgia, large)
- Subhead: `a nyce days cookout · rep your flag` (lowercase, italic)
- Meta row (chips or inline): `sun may 24` · `3–7pm` · `rock creek park`
- Primary CTAs (stacked on mobile, side-by-side on desktop):
  - `RSVP ON POSH` (primary, opens Posh in new tab)
  - `DONATE` (secondary, links to `/donate`)

### Event details section

Use this exact copy. Lowercase. No em dashes. No bullet lists in the body — write it as it reads.

```
it's almost summer and we're throwing a cookout in rock creek park.
burgers and dogs for everybody. might throw some steaks on the grill if y'all ready.

caribbean cookout vibe. rep your flag. bring one, bring all, everybody's welcome.

100% of donations go to jamaica hurricane relief. chip in at nycedays.com/donate.
every plate counts.
```

Format the donate URL as a styled inline link to `/donate`.

### Three CTA cards (below details)

Card grid: 1 column mobile, 3 columns desktop. Each card has an icon, a short heading, one line of copy, and a button.

1. **RSVP on Posh**
   - copy: `spots are limited. lock yours in.`
   - button: `RSVP →` → Posh URL (new tab)

2. **Donate**
   - copy: `100% goes to jamaica hurricane relief.`
   - button: `DONATE →` → `/donate`

3. **Bring a dish**
   - copy: `dm us what you're bringing so we don't double up on potato salad.`
   - button: `DM @NYCEDAYS →` → `https://instagram.com/nycedays` (new tab)

### Location section

- Static map image OR a simple block with the address and a `OPEN IN MAPS` link
- Use the Google Maps URL: `https://www.google.com/maps/search/?api=1&query=Rock+Creek+Park+Picnic+Grove+09`
- Copy under the address: `picnic grove 09 is on beach dr nw, just north of sherrill dr. parking is along the road.`

### Footer (within the page)

Sign-off line, centered, lowercase: `have a nyce day.`

Below that, the same global site footer.

## Styling notes

- Background: cream (`--nd-cream`) or black (`--nd-black`) — match `/donate` for consistency
- Headlines: Georgia, generous tracking
- Body: Helvetica Neue, comfortable line height
- Don't add gradients, drop shadows, or "marketing-page" decorations. Clean, editorial, like the rest of the site.

## Analytics

Fire on this page:

- `page_view` on mount with `page_path: '/events/the-yard'`
- `event_cta_click` with `event_data: { cta: 'rsvp_posh' | 'donate' | 'bring_dish' | 'open_maps' }` on each CTA click
- `flyer_expand` if the user taps the flyer on mobile to open the lightbox

Use the existing analytics event helper. Don't roll a new one.

## SEO

- Title: `the yard · a nyce days cookout · may 24`
- Description: `caribbean cookout in rock creek park, sunday may 24. 100% of donations go to jamaica hurricane relief. rep your flag.`
- OG image: the flyer (1200×1500 or whatever the closest preset already supports)
- Twitter card: `summary_large_image`
- Canonical: `https://nycedays.com/events/the-yard`

## Events list integration

On the existing `/events` page, the existing card for The Yard should now link to `/events/the-yard` (the new page) instead of going directly to `/donate`. Donate is still reachable from inside the event page via the secondary CTA. Keep the events list card visuals as-is, just swap the destination URL.

## Edge cases

- If the Posh URL on the event row is null, hide the RSVP CTA on the cards section but keep the primary hero RSVP button disabled with hover text `posh link coming soon`. Don't crash the page.
- If the flyer image is missing, fall back to a solid `--nd-cream` block with the headline overlaid. Don't show a broken image icon.
- Past-event state: if today's date is after May 24, 2026, replace the primary RSVP CTA with `EVENT RECAP →` linking to `/events/the-yard/recap` (route doesn't need to exist yet — just leave a 404-safe link). Keep the donate CTA active indefinitely.

## Build verification

Run `npm run build` locally and confirm zero errors before pushing. Do not push if the build fails.

Run the page locally on `/events/the-yard` and verify:

- Flyer renders at correct aspect ratio
- All three CTAs route correctly
- Mobile layout stacks cleanly
- Lighthouse mobile score stays above 90 on the page
