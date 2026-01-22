import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'bg-primary',
  trend,
  trendValue,
  className
}: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-lg', iconColor)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && trendValue && (
            <div className={cn(
              'text-xs px-2 py-1 rounded-full',
              trend === 'up' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
              trend === 'down' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
              trend === 'neutral' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            )}>
              {trendValue}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}