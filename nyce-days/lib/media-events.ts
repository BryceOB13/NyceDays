// Event display map for /media/apply.
// Add new events here as they're announced; keep slugs sortable by date (YYYY-MM-DD).

export type MediaEvent = {
  slug: string
  name: string
  tagline: string
  date: string // human-readable
  iso_date: string // YYYY-MM-DD for sorting + comparison
  venue: string
  time: string
  flyer_url: string
}

export const MEDIA_EVENTS: Record<string, MediaEvent> = {
  'royalties-2026-05-17': {
    slug: 'royalties-2026-05-17',
    name: 'Royalties',
    tagline: 'the creative day party.',
    date: 'Sun May 17, 2026',
    iso_date: '2026-05-17',
    venue: 'Seta Oasis, DC',
    time: '3-10pm',
    flyer_url: 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/royalties_nycedays_v5.jpeg',
  },
  'the-yard-2026-05-24': {
    slug: 'the-yard-2026-05-24',
    name: 'The Yard',
    tagline: 'the cookout.',
    date: 'Sun May 24, 2026',
    iso_date: '2026-05-24',
    venue: 'Rock Creek Park',
    time: '3-7pm',
    flyer_url: 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/TheYard_NyceDays_Updated.jpeg',
  },
}

export function getNextUpcomingEvent(today = new Date()): MediaEvent {
  const todayIso = today.toISOString().slice(0, 10)
  const sorted = Object.values(MEDIA_EVENTS).sort((a, b) => a.iso_date.localeCompare(b.iso_date))
  const upcoming = sorted.find(e => e.iso_date >= todayIso)
  return upcoming ?? sorted[sorted.length - 1] // fall back to most recent if all past
}

/** Returns the resolved event and whether the requested slug was missing/invalid. */
export function resolveEvent(slug: string | null | undefined): { event: MediaEvent; fellBack: boolean } {
  if (slug && MEDIA_EVENTS[slug]) {
    return { event: MEDIA_EVENTS[slug], fellBack: false }
  }
  return { event: getNextUpcomingEvent(), fellBack: Boolean(slug) }
}
