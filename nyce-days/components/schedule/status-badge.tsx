import { cn } from '@/lib/utils'

const styles = {
  open: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

export function StatusBadge({ status }: { status: 'open' | 'pending' | 'confirmed' }) {
  return (
    <span className={cn('inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider', styles[status])}>
      {status}
    </span>
  )
}
