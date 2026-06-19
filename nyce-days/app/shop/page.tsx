import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Shop · Nyce Days',
  description: 'The Nyce Days shop is coming soon. Join the Nyce List to hear when it drops.',
}

export default function ShopPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-nd-red/90 font-medium">
          Nyce Days Shop
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight">
          Coming soon.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          We&rsquo;re putting the finishing touches on it. Join the Nyce List to be the
          first to know when it drops.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/community">
            <Button className="px-6 bg-nd-red hover:bg-nd-red/90 text-white">
              Join the Nyce List
            </Button>
          </Link>
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
