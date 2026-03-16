import { addDays, format, isBefore } from 'date-fns'

// ─── Shared types ────────────────────────────────────

export type SlotStaffMember = {
  id: string
  name: string
  role: string
  bio: string
  serviceIds: string[]
  workDays: number[]
  workStart: string
  workEnd: string
  active: boolean
  color: string
}

export type BookedSlotRaw = {
  time: string
  service_duration: number
  staff_id: string | null
}

type Settings = {
  open_days?: number[]
  open_time?: string
  close_time?: string
  slot_interval?: number
  lead_time_hours?: number
  max_advance_days?: number
}

// ─── Helpers ──────────────────────────────────────────────

function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toHHMM(mins: number): string {
  return `${Math.floor(mins / 60).toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}`
}

function isBlocked(
  slotStart: number,
  durationMins: number,
  booked: BookedSlotRaw[]
): boolean {
  const slotEnd = slotStart + durationMins
  return booked.some(b => {
    const bStart = toMins(b.time)
    const bEnd   = bStart + b.service_duration
    return slotStart < bEnd && slotEnd > bStart
  })
}

// ─── Public API ────────────────────────────────────────────

export function getAvailableDates(settings: Settings): string[] {
  const openDays = settings.open_days ?? [1, 2, 3, 4, 5]
  const maxDays  = settings.max_advance_days ?? 30

  const dates: string[] = []
  const today = new Date()
  const max   = addDays(today, maxDays)
  let cursor  = new Date(today)
  while (isBefore(cursor, max)) {
    if (openDays.includes(cursor.getDay())) {
      dates.push(format(cursor, 'yyyy-MM-dd'))
    }
    cursor = addDays(cursor, 1)
  }
  return dates
}

/**
 * Slots for a specific staff member (or no staff / anyone).
 *
 * The effective window is the INTERSECTION of business hours and staff
 * hours — i.e. the later of the two starts, and the earlier of the two
 * ends. This means a staff member whose work_start is 03:00 will never
 * produce slots before the business open_time of 09:00, and a staff
 * member whose work_end is 20:00 will never produce slots after the
 * business close_time of 18:00.
 *
 * bookedSlots contains ALL bookings for the day.
 * When a staffMember is given we only block using:
 *   - bookings for that staff member
 *   - bookings with null staff_id (anyone — blocks the whole schedule)
 * When no staffMember, ALL bookings block slots.
 */
export function getSlotsForDate(
  date: string,
  durationMins: number,
  bookedSlots: string[] | BookedSlotRaw[],
  staffMember?: SlotStaffMember | null,
  settings?: Settings | null
): { time: string; available: boolean }[] {
  const interval  = settings?.slot_interval  ?? 30
  const leadHours = settings?.lead_time_hours ?? 2

  if (staffMember) {
    const dow = new Date(date + 'T12:00:00').getDay()
    if (!staffMember.workDays.includes(dow)) return []
  }

  // Business hours bounds
  const bizStart = toMins(settings?.open_time  ?? '09:00')
  const bizEnd   = toMins(settings?.close_time ?? '18:00')

  // Staff hours bounds — clamped to never exceed business hours
  const staffStart = staffMember ? Math.max(toMins(staffMember.workStart), bizStart) : bizStart
  const staffEnd   = staffMember ? Math.min(toMins(staffMember.workEnd),   bizEnd)   : bizEnd

  // Effective window: intersection of business and staff hours
  const openMins  = staffStart
  const closeMins = staffEnd

  const leadCutoffMs = Date.now() + leadHours * 3_600_000

  const allBooked: BookedSlotRaw[] = (bookedSlots as Array<string | BookedSlotRaw>).map(b =>
    typeof b === 'string'
      ? { time: b, service_duration: durationMins, staff_id: null }
      : b
  )

  // Only bookings for this staff member (or null-staff) are relevant blockers
  const relevant = staffMember
    ? allBooked.filter(b => b.staff_id === staffMember.id || b.staff_id === null)
    : allBooked

  const slots: { time: string; available: boolean }[] = []

  // Loop from effective open to effective close, only emit slots where
  // the full duration fits within the window.
  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const time   = toHHMM(m)
    const slotMs = new Date(`${date}T${time}:00`).getTime()

    if (slotMs < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    slots.push({ time, available: !isBlocked(m, durationMins, relevant) })
  }

  return slots
}

/**
 * Union slots when "Anyone" is selected AND staff exist.
 *
 * A slot is available if AT LEAST ONE staff member is free.
 * Each staff member's effective window is clamped to business hours.
 */
export function getUnionSlotsForDate(
  date: string,
  durationMins: number,
  allBooked: BookedSlotRaw[],
  staffList: SlotStaffMember[],
  settings: Settings
): { time: string; available: boolean }[] {
  if (staffList.length === 0) {
    return getSlotsForDate(date, durationMins, allBooked, null, settings)
  }

  const interval     = settings.slot_interval  ?? 30
  const leadHours    = settings.lead_time_hours ?? 2
  const bizStart     = toMins(settings.open_time  ?? '09:00')
  const bizEnd       = toMins(settings.close_time ?? '18:00')
  const leadCutoffMs = Date.now() + leadHours * 3_600_000
  const dow          = new Date(date + 'T12:00:00').getDay()

  const nullBooked = allBooked.filter(b => b.staff_id === null)

  const slots: { time: string; available: boolean }[] = []

  // Outer loop covers full business hours window
  for (let m = bizStart; m + durationMins <= bizEnd; m += interval) {
    const time   = toHHMM(m)
    const slotMs = new Date(`${date}T${time}:00`).getTime()

    if (slotMs < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    const anyFree = staffList.some(staff => {
      if (!staff.workDays.includes(dow)) return false

      // Clamp staff hours to business hours
      const staffStart = Math.max(toMins(staff.workStart), bizStart)
      const staffEnd   = Math.min(toMins(staff.workEnd),   bizEnd)

      // Full duration must fit within the clamped staff window
      if (m < staffStart || m + durationMins > staffEnd) return false

      const staffBooked: BookedSlotRaw[] = [
        ...allBooked.filter(b => b.staff_id === staff.id),
        ...nullBooked,
      ]
      return !isBlocked(m, durationMins, staffBooked)
    })

    slots.push({ time, available: anyFree })
  }

  return slots
}
