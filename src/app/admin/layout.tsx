'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Calendar, BookOpen, Settings, Users, LayoutDashboard, LogOut, Loader2 } from 'lucide-react'
import NotificationBell from './_components/NotificationBell'

const NAV = [
  { href: '/admin',           label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/bookings',  label: 'Bookings',  icon: BookOpen },
  { href: '/admin/services',  label: 'Services',  icon: Calendar },
  { href: '/admin/staff',     label: 'Staff',     icon: Users },
  { href: '/admin/settings',  label: 'Settings',  icon: Settings },
]

const BARE_PATHS = ['/admin/login']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  if (BARE_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  const handleLogout = async () => {
    setSigningOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-gray-900 text-sm">BookFlow</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={signingOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signingOut
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <LogOut className="w-4 h-4" />}
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* flex-col + h-full so the content area fills the screen and children can use h-full */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-end items-center px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <NotificationBell />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
