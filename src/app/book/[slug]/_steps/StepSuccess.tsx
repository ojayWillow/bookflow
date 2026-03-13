import { format, parseISO } from 'date-fns'
import { CheckCircle, MapPin, Phone, Mail } from 'lucide-react'
import type { DBService, DBStaffMember, Business, BookingForm } from '../types'

type Props = {
  business: Business
  service: DBService
  staffMember: DBStaffMember | null
  date: string
  time: string
  form: BookingForm
  bookingRef: string
}

export default function StepSuccess({ business, service, staffMember, date, time, form, bookingRef }: Props) {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re booked!</h2>
      <p className="text-gray-400 mb-1">
        Confirmation sent to <span className="font-medium text-gray-700">{form.email}</span>
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Booking ref: <span className="font-mono font-bold text-indigo-600">{bookingRef}</span>
      </p>

      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden text-left mb-6">
        <div className="bg-green-600 px-6 py-4">
          <p className="text-white font-bold">{service.name}</p>
          <p className="text-white/80 text-sm">{format(parseISO(date), 'EEEE, d MMMM yyyy')} at {time}</p>
        </div>
        <div className="p-5 space-y-3">
          {staffMember && (
            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: staffMember.color }}>
                {staffMember.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{staffMember.name}</p>
                <p className="text-xs text-gray-400">{staffMember.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />{business.address}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />{business.phone}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />{business.email}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400">{business.cancellation_policy}</p>
    </div>
  )
}
