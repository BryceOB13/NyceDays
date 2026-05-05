import Image from 'next/image'
import { Section } from '@/components/shared/section'
import { FadeUp } from '@/components/shared/fade-up'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export const metadata = {
  title: 'Donate | Nyce Days',
  description: '100% of donations go towards Jamaica hurricane relief.',
}

export default function DonatePage() {
  return (
    <main>
      <Section className="bg-background pt-32">
        <div className="max-w-xl mx-auto text-center">
          <FadeUp>
            <div className="flex justify-center mb-6">
              <Image src="/logos/stars-white.png" alt="Nyce Days" width={240} height={72}
                className="hidden dark:block object-contain h-16 md:h-20 w-auto" />
              <Image src="/logos/stars-black.png" alt="Nyce Days" width={240} height={72}
                className="dark:hidden object-contain h-16 md:h-20 w-auto" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nd-red/10 text-nd-red text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
              <Heart className="h-3 w-3" />
              Jamaica Hurricane Relief
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-bold uppercase tracking-wide leading-none">
              Donate
            </h1>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              100% of donations go directly towards Jamaica hurricane relief efforts.
              Every dollar counts.
            </p>

            <div className="mt-8 space-y-3">
              <Button asChild variant="primary" size="xl" className="w-full max-w-xs mx-auto">
                <a href="https://posh.vip/g/nyce-days" target="_blank" rel="noopener noreferrer">
                  Donate via Posh
                </a>
              </Button>

              <p className="text-[11px] text-muted-foreground/50">
                Donations collected at The Yard on May 24 and online
              </p>
            </div>
          </FadeUp>
        </div>
      </Section>
    </main>
  )
}
