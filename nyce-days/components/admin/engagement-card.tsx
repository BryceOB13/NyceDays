'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ChartWrapper } from './chart-wrapper'
import { StatCard } from './stat-card'
import { getEngagementStats } from '@/app/admin/actions'
import { MousePointer, TrendingDown, Mail } from 'lucide-react'

export function EngagementCard() {
  const [data, setData] = useState({
    bounceRate: 0,
    scrollDepth: [],
    ctaClicks: [],
    newsletterSignups: []
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const stats = await getEngagementStats()
      setData(stats)
    } catch (error) {
      console.error('Error fetching engagement data:', error)
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
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Bounce Rate"
          value={loading ? '...' : `${data.bounceRate}%`}
          subtitle="Single page sessions"
          icon={TrendingDown}
          iconColor="bg-orange-500"
          trend={data.bounceRate > 50 ? 'down' : data.bounceRate > 30 ? 'neutral' : 'up'}
          trendValue={data.bounceRate > 50 ? 'High' : data.bounceRate > 30 ? 'Average' : 'Good'}
        />
        <StatCard
          title="CTA Clicks"
          value={loading ? '...' : data.ctaClicks.reduce((sum, cta) => sum + cta.count, 0)}
          subtitle="Total call-to-action clicks"
          icon={MousePointer}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Newsletter Signups"
          value={loading ? '...' : data.newsletterSignups.reduce((sum, day) => sum + day.count, 0)}
          subtitle="Last 14 days"
          icon={Mail}
          iconColor="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scroll depth distribution */}
        <ChartWrapper
          title="Scroll Depth"
          subtitle="How far visitors scroll down pages"
        >
          <div className="h-[250px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : data.scrollDepth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.scrollDepth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="depth" 
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
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No scroll depth data available
              </div>
            )}
          </div>
        </ChartWrapper>

        {/* Newsletter signup sparkline */}
        <ChartWrapper
          title="Newsletter Signups"
          subtitle="Daily signups over last 14 days"
        >
          <div className="h-[250px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : data.newsletterSignups.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.newsletterSignups}>
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
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No signup data available
              </div>
            )}
          </div>
        </ChartWrapper>
      </div>

      {/* CTA Clicks Table */}
      {data.ctaClicks.length > 0 && (
        <ChartWrapper
          title="Top CTA Clicks"
          subtitle="Most clicked call-to-action buttons"
        >
          <div className="space-y-2">
            {data.ctaClicks.slice(0, 5).map((cta) => (
              <div key={cta.cta_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{cta.cta_id}</p>
                  {cta.url && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{cta.url}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">{cta.count}</p>
                  <p className="text-xs text-muted-foreground">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </ChartWrapper>
      )}
    </div>
  )
}