import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { isAdminEmail } from '@/lib/admin/allowlist'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Must be signed in.
  if (!user) {
    redirect('/admin/login')
  }

  // ...and on the admin allowlist. Any other authenticated account is sent away,
  // so a self-registered magic-link user can never reach the dashboard.
  if (!isAdminEmail(user.email)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar user={user} />
        <main className="flex-1 p-8 ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
