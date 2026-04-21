'use client'

import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeekNavigatorProps {
  weekStart: Date
  weekEnd: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekNavigator({ weekStart, weekEnd, onPrev, onNext, onToday }: WeekNavigatorProps) {
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth()

  return (
    <div className="flex items-center justify-between mb-6">
      <button onClick={onPrev}
        className="p-2 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all"
        aria-label="Previous week">
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="text-center">
        <h2 className="text-sm md:text-base font-serif font-semibold tracking-wide">
          {sameMonth
            ? `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'd, yyyy')}`
            : `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`
          }
        </h2>
        <button onClick={onToday}
          className="text-[10px] text-nd-red hover:text-nd-red/80 transition-colors uppercase tracking-wider font-medium mt-0.5">
          this week
        </button>
      </div>

      <button onClick={onNext}
        className="p-2 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all"
        aria-label="Next week">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
