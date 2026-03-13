import { format, parseISO } from 'date-fns'
import Link from 'next/link'

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
  booking: Booking
  staff: StaffMember[]
  onClose: () => void
}

export default function BookingPopover({ booking: bk, staff, onClose }: Props) {
  const member = staff.find(m => m.id === bk.staff_id)

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          bk.status === 'confirmed' ? 'bg-green-100 text-green-700'
          : bk.status === 'completed' ? 'bg-gray-100 text-gray-500'
          : bk.status === 'pending'   ? 'bg-amber-100 text-amber-700'
          : 'bg-red-100 text-red-600'
        }`}>{bk.status}</span>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-lg leading-none">×</button>
      </div>
      <p className="font-bold text-gray-900">{bk.customer_name}</p>
      <p className="text-xs text-gray-400 font-mono mb-1">{bk.ref}</p>
      <p className="text-sm text-indigo-600 font-medium">{bk.service_name}</p>
      <div className="mt-3 space-y-1.5 text-sm text-gray-500">
        <p>📅 {format(parseISO(bk.date), 'EEE d MMM')} at {bk.time}</p>
        <p>⏱ {bk.service_duration} min · €{bk.service_price}</p>
        {member && <p>👤 {member.name}</p>}
        <p>📧 {bk.customer_email}</p>
        <p>📞 {bk.customer_phone}</p>
        {bk.customer_notes && <p>📝 {bk.customer_notes}</p>}
      </div>
      <Link href="/admin/bookings"
        className="mt-4 block text-center text-xs font-medium text-indigo-600 hover:underline">
        Manage booking →
      </Link>
    </div>
  )
}
