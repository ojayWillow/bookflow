'use client'
import { useAdminLang } from '@/hooks/useAdminLang'

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
  const t = useAdminLang()

  // Day abbreviations are locale-aware via the browser
  const DAYS = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(undefined, { weekday: 'short' })
      .format(new Date(2024, 0, 7 + i)) // Sun=7 Jan 2024
  )

  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-5">📅 {t.schedule.sectionTitle}</h2>

      <div className="space-y-5">

        {/* Open days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.schedule.openDays}</label>
          <div className="flex gap-2">
            {DAYS.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onToggleDay(i)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  openDays.includes(i)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-100 text-gray-400 hover:border-indigo-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Hours + Slot interval side by side */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.schedule.hours}</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={openTime}
                onChange={e => onChange('open_time', e.target.value)}
                className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <span className="text-gray-300 font-medium">–</span>
              <input
                type="time"
                value={closeTime}
                onChange={e => onChange('close_time', e.target.value)}
                className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.schedule.slotInterval}</label>
            <div className="flex gap-1.5 flex-wrap">
              {INTERVALS.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange('slot_interval', i)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                    slotInterval === i
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-100 text-gray-500 hover:border-indigo-300'
                  }`}
                >
                  {i}m
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
