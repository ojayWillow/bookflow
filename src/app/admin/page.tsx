'use client'
import { useState, useEffect } from 'react'
import { getBookings, getStaff, getSettings } from '@/lib/supabase/queries'
import { format, addDays, parseISO, startOfWeek } from 'date-fns'
import StatsBar       from './_components/StatsBar'
import DayView        from './_components/DayView'
import WeekView       from './_components/WeekView'
import BookingPopover from './_components/BookingPopover'

const TODAY = format(new Date(), 'yyyy-MM-dd')

type Booking = {
  id: string; ref: string
  service_name: string; service_duration: number; service_price: number
  staff_id: string; staff_name: string
  date: string; time: string
  customer_name: string; customer_email: string
  customer_phone: string; customer_notes: string
  status: string
}

type StaffMember = {
  id: string; name: string; role: string
  work_days: number[]; work_start: string; work_end: string
  active: boolean; color: string
}

type Settings = {
  open_time: string; close_time: string
}

export default function AdminOverview() {
  const [view, setView]                   = useState<'day' | 'week'>('day')
  const [currentDate, setCurrentDate]     = useState(TODAY)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookings, setBookings]           = useState<Booking[]>([])
  const [staff, setStaff]                 = useState<StaffMember[]>([])
  const [settings, setSettings]           = useState<Settings>({ open_time: '09:00', close_time: '18:00' })
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    Promise.all([getBookings(), getStaff(), getSettings()])
      .then(([bData, sData, stData]) => {
        setBookings((bData ?? []) as Booking[])
        setStaff(((sData ?? []) as StaffMember[]).filter(m => m.active))
        setSettings(stData as Settings)
      })
      .finally(() => setLoading(false))
  }, [])

  const openHour  = parseInt(settings.open_time.split(':')[0])
  const closeHour = parseInt(settings.close_time.split(':')[0])
  const hours     = Array.from({ length: closeHour - openHour }, (_, i) => openHour + i)

  const weekStart = startOfWeek(parseISO(currentDate), { weekStartsOn: 1 })
  const weekDays  = Array.from({ length: 6 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'))

  const todayAll     = bookings.filter(b => b.date === TODAY && b.status !== 'cancelled')
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.service_price, 0)

  const stats = [
    { label: "Today's appointments", value: todayAll.length,    color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Pending confirmation',  value: pendingCount,       color: 'text-amber-600 bg-amber-50'  },
    { label: 'Total revenue',         value: `€${totalRevenue}`, color: 'text-green-600 bg-green-50'  },
    { label: 'Active staff',          value: staff.length,       color: 'text-purple-600 bg-purple-50' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Loading…
    </div>
  )

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">{format(parseISO(currentDate), 'EEEE, d MMMM yyyy')}</p>
        </div>
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

      <StatsBar stats={stats} />

      {/* Date nav */}
      <div className="px-8 pb-4 flex items-center gap-3">
        <button
          onClick={() => setCurrentDate(format(addDays(parseISO(currentDate), view === 'day' ? -1 : -7), 'yyyy-MM-dd'))}
          className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors text-gray-400 hover:text-indigo-600">←</button>
        <button onClick={() => setCurrentDate(TODAY)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors text-gray-500">Today</button>
        <button
          onClick={() => setCurrentDate(format(addDays(parseISO(currentDate), view === 'day' ? 1 : 7), 'yyyy-MM-dd'))}
          className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors text-gray-400 hover:text-indigo-600">→</button>
        <span className="text-sm font-medium text-gray-700 ml-1">
          {view === 'week'
            ? `${format(weekStart, 'd MMM')} – ${format(addDays(weekStart, 5), 'd MMM yyyy')}`
            : format(parseISO(currentDate), 'EEEE, d MMM')}
        </span>
      </div>

      {/* Views */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        {view === 'day' && (
          <DayView
            bookings={bookings}
            staff={staff}
            currentDate={currentDate}
            openHour={openHour}
            hours={hours}
            selectedBookingId={selectedBooking?.id ?? null}
            onSelectBooking={setSelectedBooking}
          />
        )}
        {view === 'week' && (
          <WeekView
            weekDays={weekDays}
            bookings={bookings}
            staff={staff}
            selectedBookingId={selectedBooking?.id ?? null}
            onSelectBooking={setSelectedBooking}
          />
        )}
      </div>

      {selectedBooking && (
        <BookingPopover
          booking={selectedBooking}
          staff={staff}
          onClose={() => setSelectedBooking(null)}
        />
      )}

    </div>
  )
}
