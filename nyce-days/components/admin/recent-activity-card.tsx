'use client'

import { useState, useEffect } from 'react'
import { ChartWrapper } from './chart-wrapper'
import { getRecentActivity } from '@/app/admin/actions'
import { Mail, Users, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'

type ActivityTab = 'all' | 'contacts' | 'signups' | 'events'

export function RecentActivityCard() {
  const [data, setData] = useState({
    contacts: [],
    signups: [],
    events: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActivityTab>('all')

  const fetchData = async () => {
    setLoading(true)
    try {
      const activity = await getRecentActivity(10)
      setData(activity)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { key: 'all' as ActivityTab, label: 'All Activity', icon: Activity },
    { key: 'contacts' as ActivityTab, label: 'Contacts', icon: Mail },
    { key: 'signups' as ActivityTab, label: 'Signups', icon: Users },
    { key: 'events' as ActivityTab, label: 'Events', icon: Activity }
  ]

  const getFilteredActivity = () => {
    const allActivity = [
      ...data.contacts.map(c => ({ ...c, type: 'contact' as const })),
      ...data.signups.map(s => ({ ...s, type: 'signup' as const })),
      ...data.events.map(e => ({ ...e, type: 'event' as const }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (activeTab === 'all') return allActivity
    if (activeTab === 'contacts') return data.contacts.map(c => ({ ...c, type: 'contact' as const }))
    if (activeTab === 'signups') return data.signups.map(s => ({ ...s, type: 'signup' as const }))
    if (activeTab === 'events') return data.events.map(e => ({ ...e, type: 'event' as const }))
    
    return []
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Mail className="h-4 w-4" />
      case 'signup':
        return <Users className="h-4 w-4" />
      case 'event':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'signup':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'event':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const formatActivityText = (item: any) => {
    switch (item.type) {
      case 'contact':
        return `${item.name} sent a ${item.type} inquiry`
      case 'signup':
        return `${item.email} subscribed via ${item.source}`
      case 'event':
        return `${item.event_name} on ${item.page_path}`
      default:
        return 'Unknown activity'
    }
  }

  const filteredActivity = getFilteredActivity()

  return (
    <ChartWrapper
      title="Recent Activity"
      subtitle="Latest site activity and interactions"
      headerAction={
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className="text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      }
    >
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading activity...</div>
          </div>
        ) : filteredActivity.length > 0 ? (
          filteredActivity.slice(0, 10).map((item, index) => (
            <div key={`${item.type}-${item.id}-${index}`} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className={`p-2 rounded-full ${getActivityColor(item.type)}`}>
                {getActivityIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {formatActivityText(item)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          </div>
        )}
      </div>
    </ChartWrapper>
  )
}