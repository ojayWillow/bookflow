'use client'
import { useState } from 'react'
import { bookings, services, staff, businessSettings } from '@/data/mock'
import { format, addDays, parseISO, startOfWeek } from 'date-fns'
import Link from 'next/link'

const TODAY = '2026-03-13'
const SLOT_HEIGHT = 64 // px per hour

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToPx(mins: number) {
  return (mins / 60) * SLOT_HEIGHT
}

const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-indigo-500',
  pending: 'bg-amber-400',
  cancelled: 'bg-red-400',
}

const STATUS_LIGHT: Record<string, string> = {
  confirmed: 'bg-indigo-50 border-indigo-200',
  pending: 'bg-amber-50 border-amber-200',
  cancelled: 'bg-red-50 border-red-200',
}

const STATUS_TEXT: Record<string, string> = {
  confirmed: 'text-indigo-700',
  pending: 'text-amber-700',
  cancelled: 'text-red-600',
}

export default function AdminOverview() {
  const [view, setView] = useState<'day' | 'week'>('day')
  const [currentDate, setCurrentDate] = useState(TODAY)
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null)

  const openHour = parseInt(businessSettings.openTime.split(':')[0])
  const closeHour = parseInt(businessSettings.closeTime.split(':')[0])
  const hours = Array.from({ length: closeHour - openHour }, (_, i) => openHour + i)

  const activeStaff = staff.filter(m => m.active)

  // For day view — bookings on currentDate per staff
  const dayBookings = (staffId: string) =>
    bookings.filter(b => b.date === currentDate && b.staffId === staffId && b.status !== 'cancelled')

  // For week view — get Mon–Sat of current week
  const weekStart = startOfWeek(parseISO(currentDate), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 6 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'))

  const weekBookingsForDay = (date: string) =>
    bookings.filter(b => b.date === date && b.status !== 'cancelled')

  // Stats
  const todayAll = bookings.filter(b => b.date === TODAY && b.status !== 'cancelled')
  const totalRevenue = bookings.filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (services.find(s => s.id === b.serviceId)?.price || 0), 0)

  const stats = [
    { label: "Today's appointments", value: todayAll.length, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Pending confirmation', value: bookings.filter(b => b.status === 'pending').length, color: 'text-amber-600 bg-amber-50' },
    { label: 'Total revenue', value: `€${totalRevenue}`, color: 'text-green-600 bg-green-50' },
    { label: 'Active staff', value: activeStaff.length, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="px-8 pt-8 pb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">{format(parseISO(currentDate), 'EEEE, d MMMM yyyy')}</p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(['day', 'week'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-8 pb-5 grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft">
            <p className={`text-2xl font-bold mb-1 ${s.color.split(' ')[0]}`}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Date navigation */}
      <div className="px-8 pb-4 flex items-center gap-3">
        <button onClick={() => setCurrentDate(format(addDays(parseISO(currentDate), view === 'day' ? -1 : -7), 'yyyy-MM-dd'))}
          className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors text-gray-400 hover:text-indigo-600">
          ←
        </button>
        <button onClick={() => setCurrentDate(TODAY)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors text-gray-500">
          Today
        </button>
        <button onClick={() => setCurrentDate(format(addDays(parseISO(currentDate), view === 'day' ? 1 : 7), 'yyyy-MM-dd'))}
          className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors text-gray-400 hover:text-indigo-600">
          →
        </button>
        <span className="text-sm font-medium text-gray-700 ml-1">
          {view === 'week'
            ? `${format(weekStart, 'd MMM')} – ${format(addDays(weekStart, 5), 'd MMM yyyy')}`
            : format(parseISO(currentDate), 'EEEE, d MMM')
          }
        </span>
      </div>

      {/* ===== DAY VIEW ===== */}
      {view === 'day' && (
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
            {/* Staff header row */}
            <div className="flex border-b border-gray-100">
              <div className="w-16 flex-shrink-0 border-r border-gray-100" />
              {activeStaff.map(m => (
                <div key={m.id} className="flex-1 px-3 py-3 border-r border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: m.color }}>
                      {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 leading-tight">{m.name.split(' ')[0]}</p>
                      <p className="text-xs text-gray-400 leading-tight">{m.role.split(' ')[0]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline grid */}
            <div className="flex" style={{ minHeight: `${hours.length * SLOT_HEIGHT}px` }}>
              {/* Hour labels */}
              <div className="w-16 flex-shrink-0 border-r border-gray-100">
                {hours.map(h => (
                  <div key={h} style={{ height: SLOT_HEIGHT }}
                    className="border-b border-gray-50 flex items-start justify-end pr-3 pt-1">
                    <span className="text-xs text-gray-300 font-medium">{h}:00</span>
                  </div>
                ))}
              </div>

              {/* Staff columns */}
              {activeStaff.map(m => {
                const colBookings = dayBookings(m.id)
                return (
                  <div key={m.id} className="flex-1 relative border-r border-gray-50 last:border-0">
                    {/* Hour grid lines */}
                    {hours.map(h => (
                      <div key={h} style={{ height: SLOT_HEIGHT }}
                        className="border-b border-gray-50" />
                    ))}
                    {/* Booking blocks */}
                    {colBookings.map(b => {
                      const svc = services.find(s => s.id === b.serviceId)
                      const startMins = timeToMinutes(b.time) - openHour * 60
                      const top = minutesToPx(startMins)
                      const height = Math.max(minutesToPx(svc?.duration || 30), 32)
                      return (
                        <button key={b.id}
                          onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                          style={{ top, height, left: 4, right: 4 }}
                          className={`absolute rounded-xl border-2 px-2 py-1.5 text-left overflow-hidden transition-all hover:z-10 hover:shadow-md ${
                            STATUS_LIGHT[b.status]
                          } ${selectedBooking?.id === b.id ? 'z-10 shadow-lg ring-2 ring-indigo-400' : ''}`}>
                          <div className={`w-1 h-full absolute left-0 top-0 rounded-l-xl ${STATUS_COLOR[b.status]}`} />
                          <div className="pl-2">
                            <p className={`text-xs font-bold leading-tight truncate ${STATUS_TEXT[b.status]}`}>{b.customerName.split(' ')[0]}</p>
                            <p className="text-xs text-gray-500 truncate leading-tight">{b.service}</p>
                            {height > 45 && <p className="text-xs text-gray-400 leading-tight">{b.time} · {svc?.duration}m</p>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== WEEK VIEW ===== */}
      {view === 'week' && (
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
            {/* Day header */}
            <div className="grid grid-cols-6 border-b border-gray-100">
              {weekDays.map(date => {
                const isToday = date === TODAY
                const dayBookingCount = weekBookingsForDay(date).length
                return (
                  <div key={date} className={`px-3 py-3 border-r border-gray-50 last:border-0 text-center ${
                    isToday ? 'bg-indigo-50' : ''
                  }`}>
                    <p className={`text-xs font-medium ${ isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {format(parseISO(date), 'EEE')}
                    </p>
                    <p className={`text-lg font-bold ${ isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {format(parseISO(date), 'd')}
                    </p>
                    {dayBookingCount > 0 && (
                      <span className="inline-block w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mx-auto mt-0.5">
                        {dayBookingCount}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Week booking list per day */}
            <div className="grid grid-cols-6 divide-x divide-gray-50" style={{ minHeight: 400 }}>
              {weekDays.map(date => {
                const dayBkgs = weekBookingsForDay(date).sort((a, b) => a.time.localeCompare(b.time))
                return (
                  <div key={date} className="p-2 space-y-1.5">
                    {dayBkgs.map(b => {
                      const member = staff.find(m => m.id === b.staffId)
                      return (
                        <button key={b.id}
                          onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                          className={`w-full text-left rounded-xl border-2 px-2.5 py-2 transition-all ${
                            STATUS_LIGHT[b.status]
                          } ${selectedBooking?.id === b.id ? 'ring-2 ring-indigo-400' : 'hover:shadow-sm'}`}>
                          <p className={`text-xs font-bold truncate ${STATUS_TEXT[b.status]}`}>{b.time} {b.customerName.split(' ')[0]}</p>
                          <p className="text-xs text-gray-400 truncate">{b.service}</p>
                          {member && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }} />
                              <p className="text-xs text-gray-400 truncate">{member.name.split(' ')[0]}</p>
                            </div>
                          )}
                        </button>
                      )
                    })}
                    {dayBkgs.length === 0 && (
                      <p className="text-xs text-gray-200 text-center pt-4">—</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking detail popover */}
      {selectedBooking && (() => {
        const b = selectedBooking
        const svc = services.find(s => s.id === b.serviceId)
        const member = staff.find(m => m.id === b.staffId)
        return (
          <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                b.status === 'confirmed' ? 'bg-green-100 text-green-700'
                : b.status === 'pending' ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-600'
              }`}>{b.status}</span>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-300 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <p className="font-bold text-gray-900">{b.customerName}</p>
            <p className="text-sm text-indigo-600 font-medium">{b.service}</p>
            <div className="mt-3 space-y-1.5 text-sm text-gray-500">
              <p>📅 {format(parseISO(b.date), 'EEE d MMM')} at {b.time}</p>
              {svc && <p>⏱ {svc.duration} min · €{svc.price}</p>}
              {member && <p>👤 {member.name}</p>}
              <p>📧 {b.customerEmail}</p>
              <p>📞 {b.customerPhone}</p>
              {b.notes && <p>📝 {b.notes}</p>}
            </div>
            <Link href="/admin/bookings"
              className="mt-4 block text-center text-xs font-medium text-indigo-600 hover:underline">Manage booking →</Link>
          </div>
        )
      })()}
    </div>
  )
}
