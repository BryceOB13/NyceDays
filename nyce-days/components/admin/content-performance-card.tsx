'use client'

import { useState, useEffect } from 'react'
import { ChartWrapper } from './chart-wrapper'
import { StatCard } from './stat-card'
import { getContentStats } from '@/app/admin/actions'
import { FileText, Calendar, FolderKanban, Eye, Users } from 'lucide-react'
import { format } from 'date-fns'

export function ContentPerformanceCard() {
  const [data, setData] = useState({
    topPages: [],
    upcomingEvents: 0,
    totalProjects: 0,
    nextEvents: []
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const stats = await getContentStats()
      setData(stats)
    } catch (error) {
      console.error('Error fetching content data:', error)
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
      {/* Content stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Upcoming Events"
          value={loading ? '...' : data.upcomingEvents}
          subtitle="Scheduled events"
          icon={Calendar}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Projects"
          value={loading ? '...' : data.totalProjects}
          subtitle="Portfolio projects"
          icon={FolderKanban}
          iconColor="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top pages table */}
        <ChartWrapper
          title="Top Pages"
          subtitle="Most viewed pages"
        >
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-muted-foreground">Loading pages...</div>
              </div>
            ) : data.topPages.length > 0 ? (
              <>
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                  <div className="col-span-6">Page</div>
                  <div className="col-span-3 text-center">Views</div>
                  <div className="col-span-3 text-center">Unique</div>
                </div>
                
                {/* Table rows */}
                {data.topPages.map((page, index) => (
                  <div key={page.path} className="grid grid-cols-12 gap-2 py-2 text-sm hover:bg-muted/50 rounded">
                    <div className="col-span-6 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate" title={page.path}>
                        {page.path === '/' ? 'Home' : page.path.replace('/', '')}
                      </span>
                    </div>
                    <div className="col-span-3 text-center font-medium">
                      {page.views.toLocaleString()}
                    </div>
                    <div className="col-span-3 text-center text-muted-foreground">
                      {page.uniqueVisitors.toLocaleString()}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No page data available
              </div>
            )}
          </div>
        </ChartWrapper>

        {/* Next events */}
        <ChartWrapper
          title="Next Events"
          subtitle="Upcoming scheduled events"
        >
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-muted-foreground">Loading events...</div>
              </div>
            ) : data.nextEvents.length > 0 ? (
              data.nextEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              </div>
            )}
          </div>
        </ChartWrapper>
      </div>
    </div>
  )
}