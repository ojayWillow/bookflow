'use client'
import { useEffect, useRef, useState } from 'react'

const SLOT_HEIGHT = 64 // px per hour

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
function minutesToPx(mins: number) {
  return (mins / 60) * SLOT_HEIGHT
}

const STATUS_BADGE: Record<string, string> = {
  confirmed: 'bg-indigo-100 text-indigo-700',
  cancelled:  'bg-red-100 text-red-600',
  completed:  'bg-gray-100 text-gray-500',
  pending:    'bg-amber-100 text-amber-700',
}

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

type Props = {
  bookings: Booking[]
  staff: StaffMember[]
  currentDate: string
  openHour: number
  hours: number[]
  selectedBookingId: string | null
  onSelectBooking: (b: Booking | null) => void
}

export default function DayView({
  bookings, staff, currentDate, openHour, hours, selectedBookingId, onSelectBooking
}: Props) {
  const isToday = currentDate === new Date().toISOString().slice(0, 10)
  const [nowMins, setNowMins] = useState(() => {
    const n = new Date()
    return n.getHours() * 60 + n.getMinutes()
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  // Update current time every minute
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setNowMins(n.getHours() * 60 + n.getMinutes())
    }
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  // Scroll to current time (or first booking) on mount
  useEffect(() => {
    if (!scrollRef.current) return
    const targetMins = isToday ? nowMins : (openHour * 60)
    const scrollTo = minutesToPx(targetMins - openHour * 60) - 120
    scrollRef.current.scrollTop = Math.max(0, scrollTo)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dayBookings = (staffId: string) =>
    bookings.filter(b =>
      b.date === currentDate && b.staff_id === staffId && b.status !== 'cancelled'
    )

  const totalHeight = hours.length * SLOT_HEIGHT
  const nowTop = isToday ? minutesToPx(nowMins - openHour * 60) : null

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
        <p className="text-4xl mb-3">👥</p>
        <p className="font-medium">No active staff</p>
        <p className="text-sm mt-1">Add staff members to see the schedule.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ maxHeight: '75vh' }}>

      {/* ── Staff header row ── */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        {/* Time gutter */}
        <div className="w-14 flex-shrink-0 border-r border-gray-100" />
        {staff.map(m => (
          <div key={m.id} className="flex-1 min-w-[120px] px-3 py-3 border-r border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                style={{ backgroundColor: m.color }}>
                {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 leading-tight truncate">{m.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-400 leading-tight truncate">{m.work_start} – {m.work_end}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Scrollable grid ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-auto">
        <div className="flex" style={{ minHeight: `${totalHeight}px` }}>

          {/* Time gutter */}
          <div className="w-14 flex-shrink-0 border-r border-gray-100 relative">
            {hours.map(h => (
              <div key={h} style={{ height: SLOT_HEIGHT }} className="relative">
                <span className="absolute -top-2 right-2 text-[10px] text-gray-300 font-medium select-none">
                  {h}:00
                </span>
                {/* Half-hour tick */}
                <span className="absolute top-[calc(50%-1px)] right-3 text-[9px] text-gray-200 select-none">
                  –
                </span>
              </div>
            ))}
          </div>

          {/* Staff columns */}
          {staff.map(m => {
            const colBookings = dayBookings(m.id)
            const workStartMins = timeToMinutes(m.work_start)
            const workEndMins   = timeToMinutes(m.work_end)
            const offTopPx      = minutesToPx(workStartMins - openHour * 60)
            const offBottomPx   = minutesToPx((hours[hours.length - 1] + 1) * 60 - workEndMins)

            return (
              <div key={m.id} className="flex-1 min-w-[120px] relative border-r border-gray-100 last:border-0">

                {/* Hour grid lines */}
                {hours.map(h => (
                  <div key={h} style={{ height: SLOT_HEIGHT }}
                    className="border-b border-gray-50 relative">
                    {/* Half-hour line */}
                    <div className="absolute bottom-0 left-0 right-0 border-b border-dashed border-gray-50"
                      style={{ bottom: SLOT_HEIGHT / 2 }} />
                  </div>
                ))}

                {/* Off-hours shading — before work start */}
                {offTopPx > 0 && (
                  <div
                    className="absolute top-0 left-0 right-0 bg-gray-50/70 pointer-events-none"
                    style={{ height: offTopPx }}
                  />
                )}

                {/* Off-hours shading — after work end */}
                {offBottomPx > 0 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gray-50/70 pointer-events-none"
                    style={{ height: offBottomPx }}
                  />
                )}

                {/* Empty state for this staff column */}
                {colBookings.length === 0 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      top: offTopPx,
                      bottom: offBottomPx,
                    }}>
                    <p className="text-[10px] text-gray-300 font-medium">No bookings</p>
                  </div>
                )}

                {/* Booking cards */}
                {colBookings.map(b => {
                  const startMins = timeToMinutes(b.time) - openHour * 60
                  const top    = minutesToPx(startMins)
                  const height = Math.max(minutesToPx(b.service_duration), 36)
                  const isSelected = selectedBookingId === b.id
                  return (
                    <button
                      key={b.id}
                      onClick={() => onSelectBooking(isSelected ? null : b)}
                      style={{
                        top,
                        height,
                        left: 4,
                        right: 4,
                        borderLeftColor: m.color,
                      }}
                      className={`absolute rounded-xl border border-gray-100 border-l-4 px-2 py-1.5 text-left overflow-hidden transition-all hover:z-10 hover:shadow-md bg-white ${
                        isSelected ? 'z-10 shadow-lg ring-2 ring-offset-1' : 'shadow-sm'
                      }`}
                      style={{
                        top,
                        height,
                        left: 4,
                        right: 4,
                        borderLeftColor: m.color,
                        // @ts-expect-error css var
                        '--tw-ring-color': m.color,
                      } as React.CSSProperties}>
                      <div className="pl-1">
                        <p className="text-xs font-bold leading-tight truncate text-gray-800">
                          {b.customer_name.split(' ')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate leading-tight">{b.service_name}</p>
                        {height > 48 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-gray-400">{b.time} · {b.service_duration}m</span>
                            <span className={`text-[9px] px-1 py-0.5 rounded-full font-medium leading-none ${STATUS_BADGE[b.status]}`}>
                              {b.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}

                {/* Current time indicator */}
                {isToday && nowTop !== null && nowTop >= 0 && nowTop <= totalHeight && (
                  <div
                    className="absolute left-0 right-0 pointer-events-none z-20 flex items-center"
                    style={{ top: nowTop }}>
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 flex-shrink-0" />
                    <div className="flex-1 h-px bg-red-400" />
                  </div>
                )}

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
