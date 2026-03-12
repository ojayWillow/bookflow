import { businessSettings } from '@/data/mock'
import { addDays, format, parseISO, isBefore, addMinutes } from 'date-fns'

export function getAvailableDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  const max = addDays(today, businessSettings.maxAdvanceDays)
  let cursor = addDays(today, 0)
  while (isBefore(cursor, max)) {
    if (businessSettings.openDays.includes(cursor.getDay())) {
      dates.push(format(cursor, 'yyyy-MM-dd'))
    }
    cursor = addDays(cursor, 1)
  }
  return dates
}

export function getSlotsForDate(date: string, durationMins: number, bookedSlots: string[]): { time: string; available: boolean }[] {
  const [openH, openM] = businessSettings.openTime.split(':').map(Number)
  const [closeH, closeM] = businessSettings.closeTime.split(':').map(Number)
  const openMins = openH * 60 + openM
  const closeMins = closeH * 60 + closeM
  const interval = businessSettings.slotInterval
  const slots: { time: string; available: boolean }[] = []

  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const min = (m % 60).toString().padStart(2, '0')
    const time = `${h}:${min}`
    slots.push({ time, available: !bookedSlots.includes(time) })
  }
  return slots
}
