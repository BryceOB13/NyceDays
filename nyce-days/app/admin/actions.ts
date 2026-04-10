// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSupabase(): Promise<any> {
  return await createClient()
}

export type Period = 'today' | 'week' | 'month'

export interface TrafficStats {
  activeUsers: number
  uniqueVisitors: number
  pageViews: Array<{ time: string; views: number }>
}

export interface SubscriberStats {
  total: number
  weeklyGrowth: number
  growthData: Array<{ date: string; count: number }>
  sourceBreakdown: Array<{ source: string; count: number }>
}

export interface EngagementStats {
  bounceRate: number
  scrollDepth: Array<{ depth: string; count: number }>
  ctaClicks: Array<{ cta_id: string; count: number; url?: string }>
  newsletterSignups: Array<{ date: string; count: number }>
}

export interface ContactFunnelStats {
  formStarts: number
  formSubmissions: number
  conversionRate: number
  inquiryTypes: Array<{ type: string; count: number }>
}

export interface AudienceStats {
  referrers: Array<{ domain: string; count: number }>
  devices: Array<{ type: string; count: number }>
  geography: Array<{ country: string; count: number }>
}

export interface ContentStats {
  topPages: Array<{ path: string; views: number; uniqueVisitors: number }>
  upcomingEvents: number
  totalProjects: number
  nextEvents: Array<{ title: string; date: string; id: string }>
}

export interface RecentActivity {
  contacts: Array<{ id: string; name: string; type: string; timestamp: string }>
  signups: Array<{ id: string; email: string; source: string; timestamp: string }>
  events: Array<{ id: string; event_name: string; page_path: string; timestamp: string }>
}

export async function getTrafficStats(period: Period = 'today'): Promise<TrafficStats> {
  const supabase = await getSupabase()
  const now = new Date()
  
  let startDate: Date
  let timeFormat: string
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      timeFormat = 'hour'
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      timeFormat = 'day'
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      timeFormat = 'day'
      break
  }

  try {
    // Active users (last 5 minutes)
    const { count: activeUsers } = await supabase
      .from('analytics_events')
      .select('session_id', { count: 'exact', head: true })
      .gte('created_at', new Date(now.getTime() - 5 * 60 * 1000).toISOString())

    // Unique visitors for period
    const { count: uniqueVisitors } = await supabase
      .from('analytics_events')
      .select('session_id', { count: 'exact', head: true })
      .eq('event_name', 'page_view')
      .gte('created_at', startDate.toISOString())

    // Page views over time
    const { data: pageViewsData } = await supabase
      .from('analytics_events')
      .select('created_at')
      .eq('event_name', 'page_view')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Group page views by time interval
    const pageViews = groupByTimeInterval(pageViewsData || [], timeFormat)

    return {
      activeUsers: activeUsers || 0,
      uniqueVisitors: uniqueVisitors || 0,
      pageViews
    }
  } catch (error) {
    console.error('Error fetching traffic stats:', error)
    return {
      activeUsers: 0,
      uniqueVisitors: 0,
      pageViews: []
    }
  }
}

export async function getActiveUsers(): Promise<number> {
  const supabase = await getSupabase()
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  try {
    const { count } = await supabase
      .from('analytics_events')
      .select('session_id', { count: 'exact', head: true })
      .gte('created_at', fiveMinutesAgo.toISOString())

    return count || 0
  } catch (error) {
    console.error('Error fetching active users:', error)
    return 0
  }
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
  const supabase = await getSupabase()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  try {
    // Total subscribers
    const { count: total } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('subscribed', true)

    // Weekly growth
    const { count: weeklyGrowth } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('subscribed', true)
      .gte('created_at', weekAgo.toISOString())

    // Growth data (last 30 days)
    const { data: growthRawData } = await supabase
      .from('subscribers')
      .select('created_at')
      .eq('subscribed', true)
      .gte('created_at', monthAgo.toISOString())
      .order('created_at', { ascending: true })

    // Source breakdown
    const { data: sourceData } = await supabase
      .from('subscribers')
      .select('source')
      .eq('subscribed', true)

    const growthData = groupByDay(growthRawData || [])
    const sourceBreakdown = groupByField(sourceData || [], 'source')

    return {
      total: total || 0,
      weeklyGrowth: weeklyGrowth || 0,
      growthData,
      sourceBreakdown
    }
  } catch (error) {
    console.error('Error fetching subscriber stats:', error)
    return {
      total: 0,
      weeklyGrowth: 0,
      growthData: [],
      sourceBreakdown: []
    }
  }
}

export async function getEngagementStats(): Promise<EngagementStats> {
  const supabase = await getSupabase()
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

  try {
    // Bounce rate calculation
    const { data: sessionData } = await supabase
      .from('analytics_events')
      .select('session_id')
      .eq('event_name', 'page_view')

    const sessionCounts = sessionData?.reduce((acc: Record<string, number>, { session_id }) => {
      acc[session_id] = (acc[session_id] || 0) + 1
      return acc
    }, {}) || {}

    const totalSessions = Object.keys(sessionCounts).length
    const bouncedSessions = Object.values(sessionCounts).filter(count => count === 1).length
    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0

    // Scroll depth
    const { data: scrollData } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_name', 'scroll_depth')

    const scrollDepth = scrollData?.reduce((acc: Record<string, number>, { event_data }) => {
      const depth = event_data?.depth || '0%'
      acc[depth] = (acc[depth] || 0) + 1
      return acc
    }, {}) || {}

    // CTA clicks
    const { data: ctaData } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_name', 'cta_click')

    const ctaClicks = ctaData?.reduce((acc: Record<string, { count: number; url?: string }>, { event_data }) => {
      const ctaId = event_data?.cta_id || 'unknown'
      const url = event_data?.url
      if (!acc[ctaId]) {
        acc[ctaId] = { count: 0, url }
      }
      acc[ctaId].count += 1
      return acc
    }, {}) || {}

    // Newsletter signups (last 14 days)
    const { data: signupData } = await supabase
      .from('analytics_events')
      .select('created_at')
      .eq('event_name', 'newsletter_signup')
      .gte('created_at', twoWeeksAgo.toISOString())

    const newsletterSignups = groupByDay(signupData || [])

    return {
      bounceRate: Math.round(bounceRate * 10) / 10,
      scrollDepth: Object.entries(scrollDepth).map(([depth, count]) => ({ depth, count })),
      ctaClicks: Object.entries(ctaClicks).map(([cta_id, data]) => ({ cta_id, count: data.count, url: data.url })),
      newsletterSignups
    }
  } catch (error) {
    console.error('Error fetching engagement stats:', error)
    return {
      bounceRate: 0,
      scrollDepth: [],
      ctaClicks: [],
      newsletterSignups: []
    }
  }
}

export async function getContactFunnelStats(): Promise<ContactFunnelStats> {
  const supabase = await getSupabase()
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  try {
    // Form starts and submissions
    const { count: formStarts } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'contact_form_start')
      .gte('created_at', monthAgo.toISOString())

    const { count: formSubmissions } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'contact_form_submit')
      .gte('created_at', monthAgo.toISOString())

    const conversionRate = formStarts && formStarts > 0 
      ? Math.round((formSubmissions || 0) / formStarts * 100 * 10) / 10
      : 0

    // Inquiry types from contact submissions
    const { data: inquiryData } = await supabase
      .from('contact_submissions')
      .select('inquiry_type')
      .gte('created_at', monthAgo.toISOString())

    const inquiryTypes = groupByField(inquiryData || [], 'inquiry_type')

    return {
      formStarts: formStarts || 0,
      formSubmissions: formSubmissions || 0,
      conversionRate,
      inquiryTypes
    }
  } catch (error) {
    console.error('Error fetching contact funnel stats:', error)
    return {
      formStarts: 0,
      formSubmissions: 0,
      conversionRate: 0,
      inquiryTypes: []
    }
  }
}

export async function getAudienceStats(): Promise<AudienceStats> {
  const supabase = await getSupabase()

  try {
    // Referrers
    const { data: referrerData } = await supabase
      .from('analytics_events')
      .select('referrer')
      .eq('event_name', 'page_view')
      .not('referrer', 'is', null)

    const referrers = referrerData?.reduce((acc: Record<string, number>, { referrer }) => {
      if (referrer) {
        try {
          const domain = new URL(referrer).hostname.replace('www.', '')
          acc[domain] = (acc[domain] || 0) + 1
        } catch {
          acc['direct'] = (acc['direct'] || 0) + 1
        }
      }
      return acc
    }, {}) || {}

    // Device types
    const { data: deviceData } = await supabase
      .from('analytics_events')
      .select('device_type')
      .eq('event_name', 'page_view')

    const devices = groupByField(deviceData || [], 'device_type')

    // Geography (placeholder for future)
    const geography: Array<{ country: string; count: number }> = []

    return {
      referrers: Object.entries(referrers).map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      devices,
      geography
    }
  } catch (error) {
    console.error('Error fetching audience stats:', error)
    return {
      referrers: [],
      devices: [],
      geography: []
    }
  }
}

export async function getTopPages(limit = 10): Promise<Array<{ path: string; views: number; uniqueVisitors: number }>> {
  const supabase = await getSupabase()

  try {
    const { data } = await supabase
      .from('analytics_events')
      .select('page_path, session_id')
      .eq('event_name', 'page_view')

    const pageStats = data?.reduce((acc: Record<string, { views: number; sessions: Set<string> }>, { page_path, session_id }) => {
      if (!acc[page_path]) {
        acc[page_path] = { views: 0, sessions: new Set() }
      }
      acc[page_path].views += 1
      acc[page_path].sessions.add(session_id)
      return acc
    }, {}) || {}

    return Object.entries(pageStats)
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        uniqueVisitors: stats.sessions.size
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching top pages:', error)
    return []
  }
}

export async function getContentStats(): Promise<ContentStats> {
  const supabase = await getSupabase()
  const now = new Date()

  try {
    const [topPages, { count: upcomingEvents }, { count: totalProjects }, { data: nextEventsData }] = await Promise.all([
      getTopPages(5),
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', now.toISOString().split('T')[0]),
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('events')
        .select('title, date, id')
        .gte('date', now.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3)
    ])

    return {
      topPages,
      upcomingEvents: upcomingEvents || 0,
      totalProjects: totalProjects || 0,
      nextEvents: nextEventsData || []
    }
  } catch (error) {
    console.error('Error fetching content stats:', error)
    return {
      topPages: [],
      upcomingEvents: 0,
      totalProjects: 0,
      nextEvents: []
    }
  }
}

export async function getRecentActivity(limit = 10): Promise<RecentActivity> {
  const supabase = await getSupabase()

  try {
    const [{ data: contacts }, { data: signups }, { data: events }] = await Promise.all([
      supabase
        .from('contact_submissions')
        .select('id, name, inquiry_type, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('subscribers')
        .select('id, email, source, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('analytics_events')
        .select('id, event_name, page_path, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)
    ])

    return {
      contacts: (contacts || []).map(c => ({
        id: c.id,
        name: c.name,
        type: c.inquiry_type,
        timestamp: c.created_at
      })),
      signups: (signups || []).map(s => ({
        id: s.id,
        email: s.email,
        source: s.source,
        timestamp: s.created_at
      })),
      events: (events || []).map(e => ({
        id: e.id,
        event_name: e.event_name,
        page_path: e.page_path,
        timestamp: e.created_at
      }))
    }
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return {
      contacts: [],
      signups: [],
      events: []
    }
  }
}

// Helper functions
function groupByTimeInterval(data: Array<{ created_at: string }>, interval: string): Array<{ time: string; views: number }> {
  const grouped = data.reduce((acc: Record<string, number>, { created_at }) => {
    const date = new Date(created_at)
    let key: string
    
    if (interval === 'hour') {
      key = `${date.getHours()}:00`
    } else {
      key = date.toISOString().split('T')[0]
    }
    
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([time, views]) => ({ time, views }))
}

function groupByDay(data: Array<{ created_at: string }>): Array<{ date: string; count: number }> {
  const grouped = data.reduce((acc: Record<string, number>, { created_at }) => {
    const date = new Date(created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupByField(data: Array<Record<string, any>>, field: string): Array<any> {
  const grouped = data.reduce((acc: Record<string, number>, item) => {
    const value = item[field] || 'unknown'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([key, count]) => ({ [field.replace('_', '')]: key, count }))
}