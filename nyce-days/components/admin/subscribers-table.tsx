'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Download, UserMinus, UserPlus } from 'lucide-react'

interface Subscriber {
  id: string
  created_at: string
  email: string
  source: string
  subscribed: boolean
}

interface SubscribersTableProps {
  subscribers: Subscriber[]
}

export function SubscribersTable({ subscribers: initialSubscribers }: SubscribersTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && sub.subscribed) ||
      (filter === 'unsubscribed' && !sub.subscribed)
    
    const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const toggleSubscription = async (id: string, currentStatus: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('subscribers')
      .update({ subscribed: !currentStatus })
      .eq('id', id)

    setSubscribers(subscribers.map(s => 
      s.id === id ? { ...s, subscribed: !currentStatus } : s
    ))
  }

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.subscribed)
    const csv = [
      'email,source,subscribed_at',
      ...activeSubscribers.map(s => `${s.email},${s.source},${s.created_at}`)
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nyce-days-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sourceColors: Record<string, string> = {
    footer: 'bg-gray-100 text-gray-800',
    community: 'bg-purple-100 text-purple-800',
    shop: 'bg-green-100 text-green-800',
    contact: 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['all', 'active', 'unsubscribed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-foreground text-background'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Subscribed</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No subscribers found
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t hover:bg-muted/30">
                  <td className="p-4">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="text-primary hover:underline"
                    >
                      {subscriber.email}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${sourceColors[subscriber.source] || 'bg-gray-100'}`}>
                      {subscriber.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      subscriber.subscribed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleSubscription(subscriber.id, subscriber.subscribed)}
                      className={`p-2 rounded-lg transition-colors ${
                        subscriber.subscribed
                          ? 'hover:bg-red-100 text-red-600'
                          : 'hover:bg-green-100 text-green-600'
                      }`}
                      title={subscriber.subscribed ? 'Unsubscribe' : 'Resubscribe'}
                    >
                      {subscriber.subscribed ? (
                        <UserMinus className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t text-sm text-muted-foreground">
        Showing {filteredSubscribers.length} of {subscribers.length} subscribers
      </div>
    </div>
  )
}
