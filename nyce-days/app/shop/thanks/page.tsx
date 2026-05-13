import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Got it · Nyce Days',
  description: 'Your vendor application for THE YARD is in. A Nyce Days rep will reach back within 48 hours.',
  robots: { index: false, follow: false },
}

export default function VendorThanksPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-nd-red/90 font-medium">
          THE YARD · 5.24
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Got it.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          A Nyce Days rep will reach back within 48 hours to lock in logistics.
        </p>

        {/* Hurricane relief commitment */}
        <div className="border border-nd-red/25 bg-nd-red/5 rounded-md px-5 py-5 text-left space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-nd-red font-medium">
            Optional: pledge to relief
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            100% of donations from THE YARD go to Jamaica hurricane relief.
            If you&rsquo;re moved to, commit a portion of your plate sales,
            round up tips, or donate directly. Every plate counts.
          </p>
          <Link href="/donate" className="block">
            <Button className="w-full bg-nd-red hover:bg-nd-red/90 text-white">
              Pledge or donate
            </Button>
          </Link>
        </div>

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
