'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Scissors, LayoutDashboard, Settings } from 'lucide-react'

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Glow Beauty Studio</p>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link href="/book/demo" target="_blank"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl hover:bg-indigo-50">
            <Calendar className="w-3.5 h-3.5" />
            View booking page ↗
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
