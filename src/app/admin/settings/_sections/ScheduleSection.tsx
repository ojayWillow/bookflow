'use client'
import { useAdminLang } from '@/hooks/useAdminLang'

const DAYS      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INTERVALS = [15, 30, 45, 60, 90, 120]

interface Props {
  openDays: number[]
  openTime: string
  closeTime: string
  slotInterval: number
  leadTimeHours: number
  maxAdvanceDays: number
  cancellationWindowHours: number
  cancellationPolicy: string
  requireApproval: boolean
  onToggleDay: (day: number) => void
  onChange: (field: string, value: string | number) => void
}

export default function ScheduleSection({
  openDays, openTime, closeTime, slotInterval,
  leadTimeHours, maxAdvanceDays, cancellationWindowHours,
  cancellationPolicy, requireApproval,
  onToggleDay, onChange,
}: Props) {
  const { t } = useAdminLang()

  const timeInputCls = 'w-full block border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-white'

  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-5">📅 {t.schedule.sectionTitle}</h2>

      <div className="space-y-5">

        {/* Open days — always 7 columns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.openDays}</label>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => onToggleDay(i)}
                className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
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

        {/* Start & end time — stacked to prevent iOS overflow */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.staff.startTime}</label>
            <input
              type="time"
              value={openTime}
              onChange={e => onChange('open_time', e.target.value)}
              className={timeInputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.staff.endTime}</label>
            <input
              type="time"
              value={closeTime}
              onChange={e => onChange('close_time', e.target.value)}
              className={timeInputCls}
            />
          </div>
        </div>

        {/* Slot interval */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.slotInterval}</label>
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

        {/* Booking rules */}
        <div className="border-t-2 border-gray-100 pt-5">
          <h3 className="font-semibold text-gray-900 mb-4">⚙️ {t.settings.bookingRules}</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-5 border-2 border-gray-100">
            <div>
              <p className="font-medium text-gray-900 text-sm">{t.settings.manualApproval}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.settings.manualApprovalDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => onChange('require_approval', requireApproval ? 0 : 1)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                requireApproval ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                requireApproval ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.leadTime}</label>
              <input type="number" value={leadTimeHours}
                onChange={e => onChange('lead_time_hours', Number(e.target.value))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={0} />
              <p className="text-xs text-gray-400 mt-1">{t.settings.leadTimeSub}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.maxAdvance}</label>
              <input type="number" value={maxAdvanceDays}
                onChange={e => onChange('max_advance_days', Number(e.target.value))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={1} />
              <p className="text-xs text-gray-400 mt-1">{t.settings.maxAdvanceSub}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.cancellationWindow}</label>
              <input type="number" value={cancellationWindowHours}
                onChange={e => onChange('cancellation_window_hours', Number(e.target.value))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={0} />
              <p className="text-xs text-gray-400 mt-1">{t.settings.cancellationWindowSub}</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.cancellationPolicy}</label>
            <textarea value={cancellationPolicy}
              onChange={e => onChange('cancellation_policy', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
              rows={2} />
            <p className="text-xs text-gray-400 mt-1">{t.settings.cancellationPolicySub}</p>
          </div>
        </div>

      </div>
    </section>
  )
}
