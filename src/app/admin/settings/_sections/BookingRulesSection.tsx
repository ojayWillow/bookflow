'use client'

interface Props {
  leadTimeHours: number
  maxAdvanceDays: number
  cancellationPolicy: string
  onChange: (field: string, value: string | number) => void
}

export default function BookingRulesSection({ leadTimeHours, maxAdvanceDays, cancellationPolicy, onChange }: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-4">⚙️ Booking rules</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Lead time (hours)</label>
          <input type="number" value={leadTimeHours}
            onChange={e => onChange('lead_time_hours', Number(e.target.value))}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={0} />
          <p className="text-xs text-gray-400 mt-1">Min. hours before a booking can be made</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Max advance (days)</label>
          <input type="number" value={maxAdvanceDays}
            onChange={e => onChange('max_advance_days', Number(e.target.value))}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={1} />
          <p className="text-xs text-gray-400 mt-1">How far ahead clients can book</p>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation policy</label>
        <textarea value={cancellationPolicy}
          onChange={e => onChange('cancellation_policy', e.target.value)}
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none" rows={2} />
      </div>
    </section>
  )
}
