import { MediaSignup } from '@/components/media/media-signup'
import { resolveEvent } from '@/lib/media-events'

export const metadata = {
  title: 'Media Credentials · Nyce Days',
  description: 'Apply for credentialed media access at Nyce Days events. Photo, video, and press personnel reviewed within 48 hours.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ event?: string }>
}

export default async function MediaApplyPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { event, fellBack } = resolveEvent(params.event)

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <MediaSignup event={event} fellBack={fellBack} />
    </main>
  )
}
