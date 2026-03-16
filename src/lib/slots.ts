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
 * Returns true if [slotStart, slotStart+durationMins) overlaps or
 * touches any existing booking. >= on the right boundary ensures a
 * slot ending exactly when a booking starts is treated as blocked.
 */
function isBlocked(
  slotStart: number,
  durationMins: number,
  booked: BookedSlotRaw[]
): boolean {
  const slotEnd = slotStart + durationMins
  return booked.some(b => {
    const bStart = toMins(b.time)
    const bEnd   = bStart + b.service_duration
    return slotStart < bEnd && slotEnd >= bStart
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
 * When a staffMember is provided, their work_start/work_end are used
 * directly as the slot window — NOT clamped to business hours. This
 * allows each staff member to have independent working hours (e.g.
 * one person working 09:00-20:00 while another works 09:00-18:00).
 *
 * Business open_time/close_time are only used as the fallback window
 * when no specific staff member is selected (the "Anyone" path).
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

  // When a specific staff member is selected, use their hours directly.
  // When no staff (Anyone), fall back to business hours.
  const openMins  = staffMember
    ? toMins(staffMember.workStart)
    : toMins(settings?.open_time  ?? '09:00')
  const closeMins = staffMember
    ? toMins(staffMember.workEnd)
    : toMins(settings?.close_time ?? '18:00')

  const leadCutoffMs = Date.now() + leadHours * 3_600_000

  const allBooked: BookedSlotRaw[] = (bookedSlots as Array<string | BookedSlotRaw>).map(b =>
    typeof b === 'string'
      ? { time: b, service_duration: durationMins, staff_id: null }
      : b
  )

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
 * Union slots when "Anyone" is selected AND staff exist.
 *
 * A slot is available if AT LEAST ONE staff member is free.
 * Each staff member's window is clamped to business hours so that
 * the overall visible range stays within business open/close times.
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

  for (let m = bizStart; m + durationMins <= bizEnd; m += interval) {
    const time   = toHHMM(m)
    const slotMs = new Date(`${date}T${time}:00`).getTime()

    if (slotMs < leadCutoffMs) {
      slots.push({ time, available: false })
      continue
    }

    const anyFree = staffList.some(staff => {
      if (!staff.workDays.includes(dow)) return false
      const staffStart = Math.max(toMins(staff.workStart), bizStart)
      const staffEnd   = Math.min(toMins(staff.workEnd),   bizEnd)
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
