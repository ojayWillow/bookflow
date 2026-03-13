import { format, parseISO } from 'date-fns'

const TODAY = format(new Date(), 'yyyy-MM-dd')

const STATUS_LIGHT: Record<string, string> = {
  confirmed: 'bg-indigo-50 border-indigo-200',
  cancelled:  'bg-red-50 border-red-200',
  completed:  'bg-gray-50 border-gray-200',
  pending:    'bg-amber-50 border-amber-200',
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
  id: string; name: string; color: string
}

type Props = {
  weekDays: string[]
  bookings: Booking[]
  staff: StaffMember[]
  selectedBookingId: string | null
  onSelectBooking: (b: Booking | null) => void
}

export default function WeekView({ weekDays, bookings, staff, selectedBookingId, onSelectBooking }: Props) {
  const weekBookingsForDay = (date: string) =>
    bookings.filter(b => b.date === date && b.status !== 'cancelled')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-6 border-b border-gray-100">
        {weekDays.map(date => {
          const isToday = date === TODAY
          const count   = weekBookingsForDay(date).length
          return (
            <div key={date} className={`px-3 py-3 border-r border-gray-50 last:border-0 text-center ${isToday ? 'bg-indigo-50' : ''}`}>
              <p className={`text-xs font-medium ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>{format(parseISO(date), 'EEE')}</p>
              <p className={`text-lg font-bold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>{format(parseISO(date), 'd')}</p>
              {count > 0 && (
                <span className="inline-flex w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold items-center justify-center mx-auto mt-0.5">{count}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Booking cards per day */}
      <div className="grid grid-cols-6 divide-x divide-gray-50" style={{ minHeight: 400 }}>
        {weekDays.map(date => {
          const dayBkgs = weekBookingsForDay(date).sort((a, b) => a.time.localeCompare(b.time))
          return (
            <div key={date} className="p-2 space-y-1.5">
              {dayBkgs.map(b => {
                const member = staff.find(m => m.id === b.staff_id)
                return (
                  <button key={b.id}
                    onClick={() => onSelectBooking(selectedBookingId === b.id ? null : b)}
                    className={`w-full text-left rounded-xl border-2 px-2.5 py-2 transition-all ${
                      STATUS_LIGHT[b.status]
                    } ${selectedBookingId === b.id ? 'ring-2 ring-indigo-400' : 'hover:shadow-sm'}`}>
                    <p className={`text-xs font-bold truncate ${STATUS_TEXT[b.status]}`}>
                      {b.time} {b.customer_name.split(' ')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{b.service_name}</p>
                    {member && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }} />
                        <p className="text-xs text-gray-400 truncate">{member.name.split(' ')[0]}</p>
                      </div>
                    )}
                  </button>
                )
              })}
              {dayBkgs.length === 0 && <p className="text-xs text-gray-200 text-center pt-4">—</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
