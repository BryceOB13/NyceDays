import Image from 'next/image'
import { ScheduleGrid } from '@/components/schedule/schedule-grid'
import { FadeUp } from '@/components/shared/fade-up'

export const metadata = {
  title: 'Drop Schedule | Nyce Days',
  description: 'When do you want us to post? Your video on Instagram.',
}

export default function SchedulePage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] w-full bg-background pt-8 pb-10 md:pt-12">
      <div className="w-full max-w-5xl mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-8 md:mb-10">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-nd-red mb-3">
              Drop Schedule
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold uppercase tracking-wide leading-none">
              Schedule Your Drop
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              When do you want us to post? Your video on Instagram.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="flex justify-center mb-6">
            <Image src="/logos/stars-white.png" alt="Nyce Days" width={280} height={84}
              className="hidden dark:block object-contain h-16 md:h-20 w-auto" />
            <Image src="/logos/stars-black.png" alt="Nyce Days" width={280} height={84}
              className="dark:hidden object-contain h-16 md:h-20 w-auto" />
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <ScheduleGrid />
        </FadeUp>
      </div>
    </div>
  )
}
