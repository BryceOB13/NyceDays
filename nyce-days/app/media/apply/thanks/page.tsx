import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { resolveEvent } from '@/lib/media-events'

export const metadata = {
  title: 'Got it · Nyce Days',
  description: 'Your media application is in. We will reach back within 48 hours.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ event?: string }>
}

export default async function MediaThanksPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { event } = resolveEvent(params.event)

  return (
    <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-nd-red/90 font-medium">
          {event.name} · {event.date}
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Got it.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          We&rsquo;ll review and reach back within 48 hours. If approved, you&rsquo;ll get a
          confirmation with check-in details.
        </p>

        <p className="font-serif text-lg text-foreground/90 italic pt-2">
          Have a nyce day.
        </p>

        <div>
          <Link href="/">
            <Button variant="outline" className="px-6">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
