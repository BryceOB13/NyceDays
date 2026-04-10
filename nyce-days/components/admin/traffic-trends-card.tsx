'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartWrapper } from './chart-wrapper'
import { StatCard } from './stat-card'
import { getTrafficStats, getActiveUsers, type Period } from '@/app/admin/actions'
import { Eye, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TrafficTrendsCard() {
  const [period, setPeriod] = useState<Period>('today')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({
    activeUsers: 0,
    uniqueVisitors: 0,
    pageViews: []
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [trafficStats, activeUsers] = await Promise.all([
        getTrafficStats(period),
        getActiveUsers()
      ])
      
      setData({
        ...trafficStats,
        activeUsers
      })
    } catch (error) {
      console.error('Error fetching traffic data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [period])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [period])

  const periodTabs = [
    { key: 'today' as Period, label: 'Today' },
    { key: 'week' as Period, label: 'This Week' },
    { key: 'month' as Period, label: 'This Month' }
  ]

  return (
    <div className="space-y-4">
      {/* Real-time stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Active Users"
          value={loading ? '...' : data.activeUsers}
          subtitle="Last 5 minutes"
          icon={Users}
          iconColor="bg-green-500"
          trend={data.activeUsers > 0 ? 'up' : 'neutral'}
          trendValue={data.activeUsers > 0 ? 'Live' : 'None'}
        />
        <StatCard
          title="Unique Visitors"
          value={loading ? '...' : data.uniqueVisitors}
          subtitle={`${period === 'today' ? 'Today' : period === 'week' ? 'This week' : 'This month'}`}
          icon={Eye}
          iconColor="bg-blue-500"
        />
      </div>

      {/* Traffic trends chart */}
      <ChartWrapper
        title="Traffic Trends"
        subtitle="Page views over time"
        headerAction={
          <div className="flex space-x-1">
            {periodTabs.map((tab) => (
              <Button
                key={tab.key}
                variant={period === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        }
      >
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">Loading chart...</div>
            </div>
          ) : data.pageViews.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.pageViews}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for this period
            </div>
          )}
        </div>
      </ChartWrapper>
    </div>
  )
}