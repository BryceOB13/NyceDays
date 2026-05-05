import DonatePanel from './DonatePanel'
import EventPoster from './EventPoster'
import { VideoBackground } from '@/components/shared/video-background'
import { videos } from '@/lib/videos'

export const metadata = {
  title: 'Donate — Jamaica Hurricane Relief | Nyce Days',
  description: '100% of donations forwarded to supportjamaica.gov.jm. Not tax-deductible.',
}

async function getTotal(): Promise<number> {
  try {
    const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${url}/api/donations/total`, { next: { revalidate: 60 } })
    const json = await res.json()
    return json.total_cents ?? 0
  } catch {
    return 0
  }
}

export default async function DonatePage() {
  const totalCents = await getTotal()

  return (
    <main className="relative min-h-[100dvh] overflow-hidden -mt-16">
      {/* Ambient video background */}
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        poster={videos.hero.poster}
        overlay="bg-gradient-to-b from-[rgba(10,10,10,0.55)] to-[rgba(10,10,10,0.85)]"
      />

      {/* Content */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-6 py-24 md:py-16">
        <EventPoster src="https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/TheYard_NyceDays_Updated.jpeg" />
        <DonatePanel totalCents={totalCents} />
      </div>
    </main>
  )
}
