import { format, parseISO } from 'date-fns'
import type { DBService, DBStaffMember, Business, BookingForm } from '../types'

type Props = {
  business: Business
  service: DBService
  staffMember: DBStaffMember | null
  date: string
  time: string
  form: BookingForm
  submitting: boolean
  submitError: string
  onConfirm: () => void
}

export default function StepConfirm({
  business, service, staffMember, date, time, form, submitting, submitError, onConfirm
}: Props) {
  const rows: [string, string][] = [
    ['Service',  service.name],
    ['Duration', `${service.duration} minutes`],
    ['Price',    `€${service.price}`],
    ['Staff',    staffMember ? staffMember.name : 'Anyone available'],
    ['Date',     format(parseISO(date), 'EEEE, d MMMM yyyy')],
    ['Time',     time],
    ['Name',     form.name],
    ['Email',    form.email],
    ['Phone',    form.phone],
    ...(form.notes ? [['Notes', form.notes] as [string, string]] : []),
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Review your booking</h2>
      <p className="text-gray-400 text-sm mb-6">Please check everything before confirming</p>

      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden mb-5">
        <div className="px-6 py-4" style={{ backgroundColor: business.primary_color }}>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Booking Summary</p>
          <p className="text-white font-bold text-lg mt-1">{business.name}</p>
        </div>
        <div className="divide-y divide-gray-50">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between px-6 py-3.5">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Cancellation policy:</span> {business.cancellation_policy}
        </p>
      </div>

      {submitError && <p className="text-sm text-red-500 text-center mb-4">⚠ {submitError}</p>}

      <button
        onClick={onConfirm}
        disabled={submitting}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? 'Confirming…' : 'Confirm booking ✓'}
      </button>
    </div>
  )
}
