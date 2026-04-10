/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChartWrapper } from './chart-wrapper'
import { StatCard } from './stat-card'
import { getSubscriberStats } from '@/app/admin/actions'
import { Users, TrendingUp } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function SubscriberMetricsCard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({
    total: 0,
    weeklyGrowth: 0,
    growthData: [],
    sourceBreakdown: []
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const stats = await getSubscriberStats()
      setData(stats)
    } catch (error) {
      console.error('Error fetching subscriber data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {/* Subscriber stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Subscribers"
          value={loading ? '...' : data.total.toLocaleString()}
          subtitle="Active email subscribers"
          icon={Users}
          iconColor="bg-purple-500"
          trend={data.weeklyGrowth > 0 ? 'up' : 'neutral'}
          trendValue={data.weeklyGrowth > 0 ? `+${data.weeklyGrowth} this week` : 'No growth'}
        />
        <StatCard
          title="Weekly Growth"
          value={loading ? '...' : `+${data.weeklyGrowth}`}
          subtitle="New subscribers this week"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Growth trend */}
        <ChartWrapper
          title="Growth Trend"
          subtitle="New subscribers per day (last 30 days)"
        >
          <div className="h-[250px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : data.growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No growth data available
              </div>
            )}
          </div>
        </ChartWrapper>

        {/* Source breakdown */}
        <ChartWrapper
          title="Source Breakdown"
          subtitle="Where subscribers come from"
        >
          <div className="h-[250px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : data.sourceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sourceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={({ percent, ...rest }: any) => `${rest.source} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.sourceBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No source data available
              </div>
            )}
          </div>
        </ChartWrapper>
      </div>
    </div>
  )
}