import type { BusinessSettings } from '@/data/mock'
import type { StaffMember } from '@/data/mock'
import { addDays, format, isBefore } from 'date-fns'

/**
 * Build available dates for the date picker.
 * Respects business open_days and max_advance_days.
 */
export function getAvailableDates(settings: {
  open_days?: number[]
  openDays?: number[]
  max_advance_days?: number
  maxAdvanceDays?: number
}): string[] {
  const openDays: number[] = settings.open_days ?? settings.openDays ?? [1,2,3,4,5]
  const maxDays: number = settings.max_advance_days ?? settings.maxAdvanceDays ?? 30

  const dates: string[] = []
  const today = new Date()
  const max = addDays(today, maxDays)
  let cursor = new Date(today)
  while (isBefore(cursor, max)) {
    if (openDays.includes(cursor.getDay())) {
      dates.push(format(cursor, 'yyyy-MM-dd'))
    }
    cursor = addDays(cursor, 1)
  }
  return dates
}

type BookedSlotRaw = { time: string; service_duration: number; staff_id: string }

/**
 * Generate time slots for a given date.
 *
 * - Respects staff-specific workStart/workEnd/workDays when a staff member is provided.
 * - Marks a slot unavailable if:
 *   (a) an existing booking's time + service_duration overlaps with the new slot start, OR
 *   (b) the slot falls within leadTimeHours of now.
 */
export function getSlotsForDate(
  date: string,
  durationMins: number,
  bookedSlots: string[] | BookedSlotRaw[],
  staffMember?: StaffMember | null,
  settings?: {
    open_time?: string
    close_time?: string
    openTime?: string
    closeTime?: string
    slot_interval?: number
    slotInterval?: number
    lead_time_hours?: number
    leadTimeHours?: number
  } | null
): { time: string; available: boolean }[] {
  const startTime = staffMember?.workStart
    ?? settings?.open_time
    ?? settings?.openTime
    ?? '09:00'
  const endTime = staffMember?.workEnd
    ?? settings?.close_time
    ?? settings?.closeTime
    ?? '18:00'
  const interval: number = settings?.slot_interval ?? settings?.slotInterval ?? 30
  const leadTimeHours: number = settings?.lead_time_hours ?? settings?.leadTimeHours ?? 2

  // Staff day-off check
  if (staffMember) {
    const dayOfWeek = new Date(date + 'T12:00:00').getDay()
    if (!staffMember.workDays.includes(dayOfWeek)) return []
  }

  const [openH, openM] = startTime.split(':').map(Number)
  const [closeH, closeM] = endTime.split(':').map(Number)
  const openMins = openH * 60 + openM
  const closeMins = closeH * 60 + closeM

  // Lead time: block slots within X hours of now
  const now = new Date()
  const leadCutoffMs = now.getTime() + leadTimeHours * 60 * 60 * 1000

  // Normalise bookedSlots — handle both string[] and BookedSlotRaw[]
  const bookedRaw: BookedSlotRaw[] = (bookedSlots as Array<string | BookedSlotRaw>).map(b =>
    typeof b === 'string'
      ? { time: b, service_duration: durationMins, staff_id: '' }
      : b
  )

  const slots: { time: string; available: boolean }[] = []

  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const min = (m % 60).toString().padStart(2, '0')
    const time = `${h}:${min}`

    // Lead-time check
    const slotDate = new Date(`${date}T${time}:00`)
    if (slotDate.getTime() < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    // Overlap check: is any existing booking occupying this slot?
    const blocked = bookedRaw.some(b => {
      const [bh, bm] = b.time.split(':').map(Number)
      const bookedStart = bh * 60 + bm
      const bookedEnd = bookedStart + b.service_duration
      // New slot [m, m+durationMins) overlaps booked [bookedStart, bookedEnd)
      return m < bookedEnd && m + durationMins > bookedStart
    })

    slots.push({ time, available: !blocked })
  }

  return slots
}
