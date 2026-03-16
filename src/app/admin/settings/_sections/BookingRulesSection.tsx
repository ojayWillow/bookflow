'use client'

interface Props {
  leadTimeHours: number
  maxAdvanceDays: number
  cancellationWindowHours: number
  cancellationPolicy: string
  requireApproval: boolean
  onChange: (field: string, value: string | number) => void
}

export default function BookingRulesSection({
  leadTimeHours,
  maxAdvanceDays,
  cancellationWindowHours,
  cancellationPolicy,
  requireApproval,
  onChange,
}: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-4">&#9881;&#65039; Booking rules</h2>

      {/* Manual approval toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-5 border-2 border-gray-100">
        <div>
          <p className="font-medium text-gray-900 text-sm">Manual booking approval</p>
          <p className="text-xs text-gray-400 mt-0.5">
            When enabled, new bookings require your approval before being confirmed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange('require_approval', requireApproval ? 0 : 1)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
            requireApproval ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              requireApproval ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Lead time (hours)</label>
          <input
            type="number"
            value={leadTimeHours}
            onChange={e => onChange('lead_time_hours', Number(e.target.value))}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
            min={0}
          />
          <p className="text-xs text-gray-400 mt-1">Min. hours before a booking can be made</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Max advance (days)</label>
          <input
            type="number"
            value={maxAdvanceDays}
            onChange={e => onChange('max_advance_days', Number(e.target.value))}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
            min={1}
          />
          <p className="text-xs text-gray-400 mt-1">How far ahead clients can book</p>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation window (hours)</label>
          <input
            type="number"
            value={cancellationWindowHours}
            onChange={e => onChange('cancellation_window_hours', Number(e.target.value))}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
            min={0}
          />
          <p className="text-xs text-gray-400 mt-1">How many hours before the appointment customers can still cancel online. Set to 0 to always allow cancellation.</p>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation policy</label>
        <textarea
          value={cancellationPolicy}
          onChange={e => onChange('cancellation_policy', e.target.value)}
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
          rows={2}
        />
        <p className="text-xs text-gray-400 mt-1">This text is shown to customers in their confirmation email.</p>
      </div>
    </section>
  )
}
