import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Thank You | Nyce Days',
  description: 'Your donation has been received.',
}

export default function ThanksPage() {
  return (
    <main className="min-h-[100dvh] bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-[#E8E4DD]">
          received. thank you.
        </h1>

        <p className="mt-6 text-sm text-[#E8E4DD]/70 leading-relaxed">
          you just helped fund jamaica hurricane relief. we&apos;ll forward your contribution along with everyone else&apos;s to supportjamaica.gov.jm and post the wire receipt to @nycedays once it&apos;s sent.
        </p>

        <p className="mt-4 text-sm text-[#E8E4DD]/70">
          see you may 24 at the cookout.
        </p>

        <Button asChild variant="outline" className="mt-8 border-[#E8E4DD]/30 text-[#E8E4DD] hover:bg-[#E8E4DD]/10">
          <Link href="/">back to nycedays.com</Link>
        </Button>
      </div>
    </main>
  )
}
