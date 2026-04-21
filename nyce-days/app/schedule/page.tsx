import { ScheduleGrid } from '@/components/schedule/schedule-grid'
import { FadeUp } from '@/components/shared/fade-up'

export const metadata = {
  title: 'Content Schedule | Nyce Days',
  description: 'Book your drop date. Nyce Days content schedule for DJs.',
}

export default function SchedulePage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] w-full bg-background pt-8 pb-10 md:pt-12">
      <div className="w-full max-w-4xl mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-8 md:mb-10">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-nd-red mb-3">
              Content Schedule
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold uppercase tracking-wide leading-none">
              Nyce Days Content Schedule
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">book your drop date</p>
            <p className="mt-1 text-[11px] text-muted-foreground/60 italic">only book once your set is ready</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <ScheduleGrid />
        </FadeUp>
      </div>
    </div>
  )
}
