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

        <p className="font-serif text-lg text-foreground/90 italic pt-2">
          Have a nyce day.
        </p>

        <div className="pt-4">
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
