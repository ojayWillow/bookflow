'use client'

const DAYS      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INTERVALS = [15, 30, 45, 60, 90, 120]

interface Props {
  openDays: number[]
  openTime: string
  closeTime: string
  slotInterval: number
  onToggleDay: (day: number) => void
  onChange: (field: string, value: string | number) => void
}

export default function ScheduleSection({ openDays, openTime, closeTime, slotInterval, onToggleDay, onChange }: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-4">📅 Schedule</h2>

      <div className="space-y-4">

        {/* Open days + hours on the same row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Open days &amp; hours</label>
          <div className="flex items-center gap-2 flex-wrap">
            {DAYS.map((day, i) => (
              <button key={day} type="button" onClick={() => onToggleDay(i)}
                className={`w-11 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                  openDays.includes(i)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-100 text-gray-400 hover:border-indigo-300'
                }`}>{day}</button>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <input type="time" value={openTime} onChange={e => onChange('open_time', e.target.value)}
                className="border-2 border-gray-100 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors w-32" />
              <span className="text-gray-300 text-sm">–</span>
              <input type="time" value={closeTime} onChange={e => onChange('close_time', e.target.value)}
                className="border-2 border-gray-100 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors w-32" />
            </div>
          </div>
        </div>

        {/* Slot interval */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Booking slot interval</label>
          <div className="flex gap-2 flex-wrap">
            {INTERVALS.map(i => (
              <button key={i} type="button" onClick={() => onChange('slot_interval', i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all ${
                  slotInterval === i
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-100 text-gray-500 hover:border-indigo-300'
                }`}>{i} min</button>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
