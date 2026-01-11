import { createClient } from '@/lib/supabase/server'
import { 
  FolderKanban, 
  Mail, 
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [
    totalPageViews,
    weeklyPageViews,
    totalContacts,
    newContacts,
    totalSubscribers,
    newSubscribers,
    projects,
    upcomingEvents,
    formStarts,
    formSubmits,
  ] = await Promise.all([
    (supabase as any).from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'page_view'),
    (supabase as any).from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'page_view').gte('created_at', weekAgo.toISOString()),
    (supabase as any).from('contact_submissions').select('*', { count: 'exact', head: true }),
    (supabase as any).from('contact_submissions').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
    (supabase as any).from('subscribers').select('*', { count: 'exact', head: true }).eq('subscribed', true),
    (supabase as any).from('subscribers').select('*', { count: 'exact', head: true }).eq('subscribed', true).gte('created_at', weekAgo.toISOString()),
    (supabase as any).from('projects').select('*', { count: 'exact', head: true }),
    (supabase as any).from('events').select('*', { count: 'exact', head: true }).gte('date', now.toISOString().split('T')[0]),
    (supabase as any).from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'contact_form_start').gte('created_at', monthAgo.toISOString()),
    (supabase as any).from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'contact_form_submit').gte('created_at', monthAgo.toISOString()),
  ])
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const conversionRate = formStarts.count 
    ? ((formSubmits.count || 0) / formStarts.count * 100).toFixed(1) 
    : '0'

  return {
    totalPageViews: totalPageViews.count || 0,
    weeklyPageViews: weeklyPageViews.count || 0,
    totalContacts: totalContacts.count || 0,
    newContacts: newContacts.count || 0,
    totalSubscribers: totalSubscribers.count || 0,
    newSubscribers: newSubscribers.count || 0,
    projects: projects.count || 0,
    upcomingEvents: upcomingEvents.count || 0,
    conversionRate,
  }
}

async function getRecentActivity() {
  const supabase = await createClient()
  
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [contactsResult, subscribersResult, eventsResult] = await Promise.all([
    (supabase as any)
      .from('contact_submissions')
      .select('id, name, email, inquiry_type, created_at, read')
      .order('created_at', { ascending: false })
      .limit(5),
    (supabase as any)
      .from('subscribers')
      .select('id, email, source, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    (supabase as any)
      .from('analytics_events')
      .select('id, event_name, event_data, page_path, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ])
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return { 
    contacts: contactsResult.data || [], 
    subscribers: subscribersResult.data || [],
    recentEvents: eventsResult.data || [],
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const { contacts, subscribers } = await getRecentActivity()

  const statCards = [
    { 
      label: 'Page Views', 
      value: stats.weeklyPageViews, 
      subtext: `${stats.totalPageViews} total`,
      change: 'This week',
      icon: Eye, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Contacts', 
      value: stats.totalContacts, 
      subtext: stats.newContacts > 0 ? `+${stats.newContacts} this week` : 'No new this week',
      change: stats.newContacts > 0 ? 'up' : 'neutral',
      icon: Mail, 
      color: 'bg-red-500' 
    },
    { 
      label: 'Subscribers', 
      value: stats.totalSubscribers, 
      subtext: stats.newSubscribers > 0 ? `+${stats.newSubscribers} this week` : 'No new this week',
      change: stats.newSubscribers > 0 ? 'up' : 'neutral',
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Conversion Rate', 
      value: `${stats.conversionRate}%`, 
      subtext: 'Form starts → submits',
      change: 'Last 30 days',
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Projects', 
      value: stats.projects, 
      subtext: `${stats.upcomingEvents} upcoming events`,
      change: '',
      icon: FolderKanban, 
      color: 'bg-orange-500' 
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to Nyce Days admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {stat.change === 'up' && (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                )}
                {stat.change === 'down' && (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Messages</h2>
            <a href="/admin/contacts" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No messages yet</p>
            ) : (
              contacts.map((contact: { id: string; name: string; email: string; inquiry_type: string; created_at: string; read: boolean }) => (
                <div key={contact.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full ${contact.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Mail className={`h-4 w-4 ${contact.read ? '' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{contact.name}</p>
                      {!contact.read && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {contact.inquiry_type} · {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">New Subscribers</h2>
            <a href="/admin/subscribers" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {subscribers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No subscribers yet</p>
            ) : (
              subscribers.map((sub: { id: string; email: string; source: string; created_at: string }) => (
                <div key={sub.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="p-2 bg-muted rounded-full">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{sub.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      via {sub.source} · {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
