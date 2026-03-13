import type { StaffMember } from '@/data/mock'
import { addDays, format, isBefore } from 'date-fns'

// ─── Shared types ────────────────────────────────────────────

export type BookedSlotRaw = {
  time: string
  service_duration: number
  staff_id: string
}

type Settings = {
  open_days?: number[]
  openDays?: number[]
  open_time?: string
  openTime?: string
  close_time?: string
  closeTime?: string
  slot_interval?: number
  slotInterval?: number
  lead_time_hours?: number
  leadTimeHours?: number
  max_advance_days?: number
  maxAdvanceDays?: number
}

// ─── Helpers ────────────────────────────────────────────────

function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toHHMM(mins: number): string {
  return `${Math.floor(mins / 60).toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}`
}

/** True if a new slot [slotStart, slotStart+duration) overlaps any booked window */
function isBlocked(
  slotStart: number,
  durationMins: number,
  booked: BookedSlotRaw[]
): boolean {
  return booked.some(b => {
    const bStart = toMins(b.time)
    const bEnd = bStart + b.service_duration
    return slotStart < bEnd && slotStart + durationMins > bStart
  })
}

// ─── Public API ─────────────────────────────────────────────

/**
 * Build the list of open dates for the date picker.
 * Accepts both snake_case (Supabase) and camelCase (legacy) settings.
 */
export function getAvailableDates(settings: Settings): string[] {
  const openDays = settings.open_days ?? settings.openDays ?? [1, 2, 3, 4, 5]
  const maxDays = settings.max_advance_days ?? settings.maxAdvanceDays ?? 30

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

/**
 * Generate slots for a specific staff member on a given date.
 *
 * A slot is unavailable when:
 *  (a) it falls within leadTimeHours of now, OR
 *  (b) an existing booking overlaps the window [slotStart, slotStart + duration)
 */
export function getSlotsForDate(
  date: string,
  durationMins: number,
  bookedSlots: string[] | BookedSlotRaw[],
  staffMember?: StaffMember | null,
  settings?: Settings | null
): { time: string; available: boolean }[] {
  const startTime = staffMember?.workStart ?? settings?.open_time ?? settings?.openTime ?? '09:00'
  const endTime   = staffMember?.workEnd   ?? settings?.close_time ?? settings?.closeTime ?? '18:00'
  const interval  = settings?.slot_interval ?? settings?.slotInterval ?? 30
  const leadHours = settings?.lead_time_hours ?? settings?.leadTimeHours ?? 2

  // Staff day-off check
  if (staffMember) {
    const dow = new Date(date + 'T12:00:00').getDay()
    if (!staffMember.workDays.includes(dow)) return []
  }

  const openMins  = toMins(startTime)
  const closeMins = toMins(endTime)
  const leadCutoffMs = Date.now() + leadHours * 3600_000

  // Normalise to BookedSlotRaw[]
  const booked: BookedSlotRaw[] = (bookedSlots as Array<string | BookedSlotRaw>).map(b =>
    typeof b === 'string'
      ? { time: b, service_duration: durationMins, staff_id: '' }
      : b
  )

  const slots: { time: string; available: boolean }[] = []

  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const time = toHHMM(m)
    const slotMs = new Date(`${date}T${time}:00`).getTime()

    if (slotMs < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    slots.push({ time, available: !isBlocked(m, durationMins, booked) })
  }

  return slots
}

/**
 * "Anyone available" union logic.
 *
 * For each slot in the business window, checks every qualifying staff member.
 * A slot is available if AT LEAST ONE staff member:
 *  - works on this day of the week
 *  - has this slot within their personal work hours
 *  - has no overlapping confirmed booking
 *  - the slot is beyond the lead-time cutoff
 *
 * Returns the same { time, available } shape as getSlotsForDate().
 */
export function getUnionSlotsForDate(
  date: string,
  durationMins: number,
  allBooked: BookedSlotRaw[],   // ALL bookings for this date (across all staff)
  staffList: StaffMember[],      // only staff who offer the selected service
  settings: Settings
): { time: string; available: boolean }[] {
  const interval  = settings.slot_interval ?? settings.slotInterval ?? 30
  const leadHours = settings.lead_time_hours ?? settings.leadTimeHours ?? 2
  const openMins  = toMins(settings.open_time ?? settings.openTime ?? '09:00')
  const closeMins = toMins(settings.close_time ?? settings.closeTime ?? '18:00')
  const leadCutoffMs = Date.now() + leadHours * 3600_000
  const dow = new Date(date + 'T12:00:00').getDay()

  const slots: { time: string; available: boolean }[] = []

  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const time = toHHMM(m)
    const slotMs = new Date(`${date}T${time}:00`).getTime()

    // Lead-time: no staff can take it
    if (slotMs < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    // Check each staff member individually
    const anyFree = staffList.some(staff => {
      // Staff must work this day
      if (!staff.workDays.includes(dow)) return false

      // Slot must fall within staff's personal hours
      const staffStart = toMins(staff.workStart)
      const staffEnd   = toMins(staff.workEnd)
      if (m < staffStart || m + durationMins > staffEnd) return false

      // Bookings for THIS staff member only
      const staffBooked = allBooked.filter(b => b.staff_id === staff.id)
      return !isBlocked(m, durationMins, staffBooked)
    })

    slots.push({ time, available: anyFree })
  }

  return slots
}
