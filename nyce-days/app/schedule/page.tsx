import { ScheduleGrid } from '@/components/schedule/schedule-grid'
import { FadeUp } from '@/components/shared/fade-up'

export const metadata = {
  title: 'Drop Schedule | Nyce Days',
  description: 'Schedule your drop date. We already have the video — just have your audio ready.',
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
              Pick the week you want us to start syncing your audio with your set.
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground/50 italic max-w-sm mx-auto">
              We already have the video — just make sure your audio is ready before you claim a date.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <ScheduleGrid />
        </FadeUp>
      </div>
    </div>
  )
}
