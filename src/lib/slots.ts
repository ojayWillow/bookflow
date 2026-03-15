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

/**
 * Returns true if [slotStart, slotStart+durationMins) overlaps any booking in `booked`.
 */
function isBlocked(
  slotStart: number,
  durationMins: number,
  booked: BookedSlotRaw[]
): boolean {
  return booked.some(b => {
    const bStart = toMins(b.time)
    const bEnd   = bStart + b.service_duration
    return slotStart < bEnd && slotStart + durationMins > bStart
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
 * Slots for a specific staff member (or no staff).
 *
 * `bookedSlots` contains ALL bookings for the day (all staff).
 * We only block this staff member's slots with:
 *   - bookings assigned to them
 *   - bookings with null staff_id ("anyone" bookings that block everyone)
 */
export function getSlotsForDate(
  date: string,
  durationMins: number,
  bookedSlots: string[] | BookedSlotRaw[],
  staffMember?: SlotStaffMember | null,
  settings?: Settings | null
): { time: string; available: boolean }[] {
  const startTime = staffMember?.workStart ?? settings?.open_time  ?? '09:00'
  const endTime   = staffMember?.workEnd   ?? settings?.close_time ?? '18:00'
  const interval  = settings?.slot_interval  ?? 30
  const leadHours = settings?.lead_time_hours ?? 2

  if (staffMember) {
    const dow = new Date(date + 'T12:00:00').getDay()
    if (!staffMember.workDays.includes(dow)) return []
  }

  const openMins     = toMins(startTime)
  const closeMins    = toMins(endTime)
  const leadCutoffMs = Date.now() + leadHours * 3_600_000

  const allBooked: BookedSlotRaw[] = (bookedSlots as Array<string | BookedSlotRaw>).map(b =>
    typeof b === 'string'
      ? { time: b, service_duration: durationMins, staff_id: null }
      : b
  )

  // Only consider bookings relevant to this staff member:
  //   - same staff_id, OR
  //   - null staff_id ("anyone" — blocks the whole schedule)
  const relevant = staffMember
    ? allBooked.filter(b => b.staff_id === staffMember.id || b.staff_id === null)
    : allBooked

  const slots: { time: string; available: boolean }[] = []

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
 * Union slots when "Anyone" is selected.
 *
 * A slot is available if AT LEAST ONE staff member is free.
 * A staff member is blocked by:
 *   - bookings assigned to them
 *   - null staff_id bookings ("anyone" bookings block all staff)
 */
export function getUnionSlotsForDate(
  date: string,
  durationMins: number,
  allBooked: BookedSlotRaw[],
  staffList: SlotStaffMember[],
  settings: Settings
): { time: string; available: boolean }[] {
  const interval     = settings.slot_interval  ?? 30
  const leadHours    = settings.lead_time_hours ?? 2
  const openMins     = toMins(settings.open_time  ?? '09:00')
  const closeMins    = toMins(settings.close_time ?? '18:00')
  const leadCutoffMs = Date.now() + leadHours * 3_600_000
  const dow          = new Date(date + 'T12:00:00').getDay()

  // Null-staff bookings block every staff member
  const nullBooked = allBooked.filter(b => b.staff_id === null)

  const slots: { time: string; available: boolean }[] = []

  for (let m = openMins; m + durationMins <= closeMins; m += interval) {
    const time   = toHHMM(m)
    const slotMs = new Date(`${date}T${time}:00`).getTime()

    if (slotMs < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    const anyFree = staffList.some(staff => {
      if (!staff.workDays.includes(dow)) return false
      const staffStart = toMins(staff.workStart)
      const staffEnd   = toMins(staff.workEnd)
      if (m < staffStart || m + durationMins > staffEnd) return false

      // Bookings that block this specific staff member:
      // their own bookings + any null-staff bookings
      const staffBooked = [
        ...allBooked.filter(b => b.staff_id === staff.id),
        ...nullBooked,
      ]
      return !isBlocked(m, durationMins, staffBooked)
    })

    slots.push({ time, available: anyFree })
  }

  return slots
}
