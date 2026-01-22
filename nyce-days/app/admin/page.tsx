import { TrafficTrendsCard } from '@/components/admin/traffic-trends-card'
import { SubscriberMetricsCard } from '@/components/admin/subscriber-metrics-card'
import { EngagementCard } from '@/components/admin/engagement-card'
import { ContactFunnelCard } from '@/components/admin/contact-funnel-card'
import { AudienceCard } from '@/components/admin/audience-card'
import { ContentPerformanceCard } from '@/components/admin/content-performance-card'
import { RecentActivityCard } from '@/components/admin/recent-activity-card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into your Nyce Days performance</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Traffic & Real-time Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Traffic & Engagement</h2>
        <TrafficTrendsCard />
      </section>

      {/* Subscribers & Growth */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Subscriber Growth</h2>
        <SubscriberMetricsCard />
      </section>

      {/* Engagement Metrics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">User Engagement</h2>
        <EngagementCard />
      </section>

      {/* Contact & Audience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Contact Funnel</h2>
          <ContactFunnelCard />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Audience Insights</h2>
          <AudienceCard />
        </section>
      </div>

      {/* Content Performance */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Content Performance</h2>
        <ContentPerformanceCard />
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <RecentActivityCard />
      </section>
    </div>
  )
}
