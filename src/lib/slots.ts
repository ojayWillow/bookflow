import { loadSettings } from '@/lib/settingsStore'
import type { StaffMember } from '@/data/mock'
import { addDays, format, isBefore } from 'date-fns'

export function getAvailableDates(): string[] {
  const settings = loadSettings()
  const dates: string[] = []
  const today = new Date()
  const max = addDays(today, settings.maxAdvanceDays)
  let cursor = new Date(today)
  while (isBefore(cursor, max)) {
    if (settings.openDays.includes(cursor.getDay())) {
      dates.push(format(cursor, 'yyyy-MM-dd'))
    }
    cursor = addDays(cursor, 1)
  }
  return dates
}

export function getSlotsForDate(
  date: string,
  durationMins: number,
  bookedSlots: string[],
  staffMember?: StaffMember | null
): { time: string; available: boolean }[] {
  const settings = loadSettings()

  // Use staff-specific hours if a staff member is selected
  const startTime = staffMember ? staffMember.workStart : settings.openTime
  const endTime = staffMember ? staffMember.workEnd : settings.closeTime

  // If staff member doesn't work on this day, return no slots
  if (staffMember) {
    const dayOfWeek = new Date(date + 'T12:00:00').getDay()
    if (!staffMember.workDays.includes(dayOfWeek)) return []
  }

  const [openH, openM] = startTime.split(':').map(Number)
  const [closeH, closeM] = endTime.split(':').map(Number)
  const openMins = openH * 60 + openM
  const closeMins = closeH * 60 + closeM
  const interval = settings.slotInterval
  const slots: { time: string; available: boolean }[] = []

  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const min = (m % 60).toString().padStart(2, '0')
    const time = `${h}:${min}`
    slots.push({ time, available: !bookedSlots.includes(time) })
  }
  return slots
}
