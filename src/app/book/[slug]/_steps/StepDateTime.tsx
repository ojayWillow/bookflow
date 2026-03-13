import { format, parseISO } from 'date-fns'
import { CalendarX } from 'lucide-react'
import type { DBService, DBStaffMember } from '../types'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Slot = { time: string; available: boolean }

type Props = {
  service: DBService
  selectedStaffMember: DBStaffMember | null
  availableDates: string[]
  selectedDate: string
  selectedTime: string
  slots: Slot[]
  loadingSlots: boolean
  onSelectDate: (date: string) => void
  onSelectTime: (time: string) => void
}

export default function StepDateTime({
  service, selectedStaffMember, availableDates,
  selectedDate, selectedTime, slots, loadingSlots,
  onSelectDate, onSelectTime,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Pick a date &amp; time</h2>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm text-gray-400">{service.name}</span>
        <span className="text-gray-300">·</span>
        {selectedStaffMember ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: selectedStaffMember.color }}>
              {selectedStaffMember.name[0]}
            </div>
            <span className="text-sm text-gray-400">{selectedStaffMember.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Anyone available</span>
        )}
      </div>

      <p className="text-sm font-medium text-gray-700 mb-3">Select a date</p>

      {availableDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <CalendarX className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">No available dates</p>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            There are no bookable dates at the moment. The business may not have set their opening days or schedule yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
          {availableDates.slice(0, 14).map(date => {
            const d = parseISO(date)
            const isSelected = date === selectedDate
            return (
              <button key={date}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-100 bg-white hover:border-indigo-300'
                }`}>
                <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{DAYS_SHORT[d.getDay()]}</span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{format(d, 'd')}</span>
                <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>{format(d, 'MMM')}</span>
              </button>
            )
          })}
        </div>
      )}

      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Select a time</p>
          {loadingSlots ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots.map(slot => (
                <button key={slot.time}
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    !slot.available             ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                    : selectedTime === slot.time ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-100 bg-white hover:border-indigo-400 text-gray-700'
                  }`}>
                  {slot.time}
                </button>
              ))}
              {slots.length === 0 && (
                <p className="col-span-full text-sm text-gray-400 text-center py-4">No available slots for this date.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
