import { bookings, services, businessSettings } from '@/data/mock'
import { format } from 'date-fns'
import Link from 'next/link'

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function AdminOverview() {
  const today = '2026-03-13'
  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled')
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => {
      const svc = services.find(s => s.id === b.serviceId)
      return sum + (svc?.price || 0)
    }, 0)

  const stats = [
    { label: "Today's bookings", value: todayBookings.length, sub: 'appointments', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total bookings', value: bookings.filter(b => b.status !== 'cancelled').length, sub: 'all time', color: 'bg-green-50 text-green-600' },
    { label: 'Revenue', value: `€${totalRevenue}`, sub: 'confirmed bookings', color: 'bg-amber-50 text-amber-600' },
    { label: 'Active services', value: services.length, sub: 'on offer', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good morning 👋</h1>
        <p className="text-gray-400 mt-1">{format(new Date('2026-03-13'), 'EEEE, d MMMM yyyy')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
            <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${s.color}`}>{s.sub}</div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Today's schedule</h2>
          <Link href="/admin/bookings" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        {todayBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p>No bookings today</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-indigo-600 w-12">{b.time}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.service} · {b.customerPhone}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
