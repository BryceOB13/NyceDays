import { createClient } from '@/lib/supabase/server'
import { SubscribersTable } from '@/components/admin/subscribers-table'

async function getSubscribers() {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching subscribers:', error)
    return []
  }

  return data || []
}

async function getStats() {
  const supabase = await createClient()
  
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [total, active, thisMonth] = await Promise.all([
    (supabase as any).from('subscribers').select('id', { count: 'exact', head: true }),
    (supabase as any).from('subscribers').select('id', { count: 'exact', head: true }).eq('subscribed', true),
    (supabase as any).from('subscribers').select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return {
    total: total.count || 0,
    active: active.count || 0,
    thisMonth: thisMonth.count || 0,
  }
}

export default async function SubscribersPage() {
  const [subscribers, stats] = await Promise.all([getSubscribers(), getStats()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <p className="text-muted-foreground mt-1">
          Manage your newsletter subscribers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Subscribers</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-3xl font-bold text-blue-600">+{stats.thisMonth}</p>
          <p className="text-sm text-muted-foreground">This Month</p>
        </div>
      </div>

      <SubscribersTable subscribers={subscribers} />
    </div>
  )
}
