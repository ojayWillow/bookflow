const SLOT_HEIGHT = 64

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
function minutesToPx(mins: number) {
  return (mins / 60) * SLOT_HEIGHT
}

const STATUS_LIGHT: Record<string, string> = {
  confirmed: 'bg-indigo-50 border-indigo-200',
  cancelled:  'bg-red-50 border-red-200',
  completed:  'bg-gray-50 border-gray-200',
  pending:    'bg-amber-50 border-amber-200',
}
const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-indigo-500',
  cancelled:  'bg-red-400',
  completed:  'bg-gray-400',
  pending:    'bg-amber-400',
}
const STATUS_TEXT: Record<string, string> = {
  confirmed: 'text-indigo-700',
  cancelled:  'text-red-600',
  completed:  'text-gray-500',
  pending:    'text-amber-700',
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
  const dayBookings = (staffId: string) =>
    bookings.filter(b =>
      b.date === currentDate && b.staff_id === staffId && b.status !== 'cancelled'
    )

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-16 text-center text-gray-400">
        <p className="text-4xl mb-3">📅</p>
        <p className="font-medium">No bookings yet</p>
        <p className="text-sm mt-1">Bookings from your booking page will appear here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
      {/* Staff header */}
      <div className="flex border-b border-gray-100">
        <div className="w-16 flex-shrink-0 border-r border-gray-100" />
        {staff.map(m => (
          <div key={m.id} className="flex-1 px-3 py-3 border-r border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
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

      {/* Grid */}
      <div className="flex" style={{ minHeight: `${hours.length * SLOT_HEIGHT}px` }}>
        <div className="w-16 flex-shrink-0 border-r border-gray-100">
          {hours.map(h => (
            <div key={h} style={{ height: SLOT_HEIGHT }} className="border-b border-gray-50 flex items-start justify-end pr-3 pt-1">
              <span className="text-xs text-gray-300 font-medium">{h}:00</span>
            </div>
          ))}
        </div>
        {staff.map(m => {
          const colBookings = dayBookings(m.id)
          return (
            <div key={m.id} className="flex-1 relative border-r border-gray-50 last:border-0">
              {hours.map(h => (
                <div key={h} style={{ height: SLOT_HEIGHT }} className="border-b border-gray-50" />
              ))}
              {colBookings.map(b => {
                const startMins = timeToMinutes(b.time) - openHour * 60
                const top    = minutesToPx(startMins)
                const height = Math.max(minutesToPx(b.service_duration), 32)
                return (
                  <button key={b.id}
                    onClick={() => onSelectBooking(selectedBookingId === b.id ? null : b)}
                    style={{ top, height, left: 4, right: 4 }}
                    className={`absolute rounded-xl border-2 px-2 py-1.5 text-left overflow-hidden transition-all hover:z-10 hover:shadow-md ${
                      STATUS_LIGHT[b.status]
                    } ${selectedBookingId === b.id ? 'z-10 shadow-lg ring-2 ring-indigo-400' : ''}`}>
                    <div className={`w-1 h-full absolute left-0 top-0 rounded-l-xl ${STATUS_COLOR[b.status]}`} />
                    <div className="pl-2">
                      <p className={`text-xs font-bold leading-tight truncate ${STATUS_TEXT[b.status]}`}>
                        {b.customer_name.split(' ')[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate leading-tight">{b.service_name}</p>
                      {height > 45 && (
                        <p className="text-xs text-gray-400 leading-tight">{b.time} · {b.service_duration}m</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
