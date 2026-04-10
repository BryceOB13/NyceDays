'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartWrapper } from './chart-wrapper'
import { StatCard } from './stat-card'
import { getContactFunnelStats } from '@/app/admin/actions'
import { MessageSquare, Send, TrendingUp } from 'lucide-react'

export function ContactFunnelCard() {
  const [data, setData] = useState({
    formStarts: 0,
    formSubmissions: 0,
    conversionRate: 0,
    inquiryTypes: []
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const stats = await getContactFunnelStats()
      setData(stats)
    } catch (error) {
      console.error('Error fetching contact funnel data:', error)
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

  const funnelData = [
    { step: 'Form Starts', count: data.formStarts, color: '#8884d8' },
    { step: 'Form Submissions', count: data.formSubmissions, color: '#82ca9d' }
  ]

  return (
    <div className="space-y-4">
      {/* Funnel metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Form Starts"
          value={loading ? '...' : data.formStarts}
          subtitle="Last 30 days"
          icon={MessageSquare}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Form Submissions"
          value={loading ? '...' : data.formSubmissions}
          subtitle="Completed forms"
          icon={Send}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Conversion Rate"
          value={loading ? '...' : `${data.conversionRate}%`}
          subtitle="Starts → Submissions"
          icon={TrendingUp}
          iconColor="bg-purple-500"
          trend={data.conversionRate > 20 ? 'up' : data.conversionRate > 10 ? 'neutral' : 'down'}
          trendValue={data.conversionRate > 20 ? 'Good' : data.conversionRate > 10 ? 'Average' : 'Low'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel visualization */}
        <ChartWrapper
          title="Contact Funnel"
          subtitle="Form engagement flow"
        >
          <div className="h-[250px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs fill-muted-foreground" />
                  <YAxis 
                    type="category" 
                    dataKey="step" 
                    className="text-xs fill-muted-foreground"
                    width={100}
                  />
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
                    radius={[0, 2, 2, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartWrapper>

        {/* Inquiry type breakdown */}
        <ChartWrapper
          title="Inquiry Types"
          subtitle="What people are asking about"
        >
          <div className="h-[250px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : data.inquiryTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.inquiryTypes}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="type" 
                    className="text-xs fill-muted-foreground"
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                No inquiry data available
              </div>
            )}
          </div>
        </ChartWrapper>
      </div>
    </div>
  )
}