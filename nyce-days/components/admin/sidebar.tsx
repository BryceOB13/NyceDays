'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Image as ImageIcon,
  ShoppingBag,
  Mail,
  Users,
  Clapperboard,
  Settings,
  LogOut,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/casting', label: 'Casting', icon: Clapperboard },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  user: User
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-foreground text-background border-r border-background/10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-background/10">
          <Link href="/admin" className="text-xl font-bold">
            Nyce Days
          </Link>
          <p className="text-xs text-background/50 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-background text-foreground'
                    : 'text-background/70 hover:text-background hover:bg-background/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-background/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-background/50">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 mt-2 rounded-lg text-sm text-background/70 hover:text-background hover:bg-background/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
