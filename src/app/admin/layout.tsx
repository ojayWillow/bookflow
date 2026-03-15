'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Calendar, BookOpen, Settings, Users, LayoutDashboard, LogOut, Loader2, Menu, X } from 'lucide-react'
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
  const pathname  = usePathname()
  const [signingOut, setSigningOut] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (BARE_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  const handleLogout = async () => {
    setSigningOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const SidebarContent = (
    <>
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <span className="font-bold text-gray-900 text-sm">BookFlow</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setDrawerOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              onClick={() => setDrawerOpen(false)}
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
    </>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ─── Desktop sidebar ───────────────────────────────────────────── */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-100 flex-col flex-shrink-0">
        {SidebarContent}
      </aside>

      {/* ─── Mobile drawer overlay ────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col flex-shrink-0
        transform transition-transform duration-200 ease-in-out md:hidden
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {SidebarContent}
      </aside>

      {/* ─── Main content ───────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex justify-between items-center px-4 md:px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />{/* spacer on desktop */}
          <NotificationBell />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
