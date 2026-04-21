import { cn } from '@/lib/utils'

const config = {
  open: { label: 'Open', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  pending: { label: 'Claimed', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  confirmed: { label: 'Locked', cls: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
}

export function StatusBadge({ status }: { status: 'open' | 'pending' | 'confirmed' }) {
  const { label, cls } = config[status]
  return (
    <span className={cn('inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border', cls)}>
      {label}
    </span>
  )
}
