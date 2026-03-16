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
  breakStart?: string | null
  breakEnd?: string | null
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
    return slotStart < bEnd && slotEnd >= bStart
  })
}

/**
 * Returns true if the slot overlaps with the staff member's lunch break.
 * A slot is blocked if it starts inside the break, or if the service
 * would run into the break (i.e. slot finishes after break starts).
 */
function isDuringBreak(
  slotStart: number,
  durationMins: number,
  staff: SlotStaffMember
): boolean {
  if (!staff.breakStart || !staff.breakEnd) return false
  const breakStart = toMins(staff.breakStart)
  const breakEnd   = toMins(staff.breakEnd)
  const slotEnd    = slotStart + durationMins
  // Block if the slot overlaps the break window at all
  return slotStart < breakEnd && slotEnd > breakStart
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

export function getSlotsForDate(
  date: string,
  durationMins: number,
  bookedSlots: string[] | BookedSlotRaw[],
  staffMember?: SlotStaffMember | null,
  settings?: Settings | null
): { time: string; available: boolean }[] {
  const interval  = settings?.slot_interval  ?? 30
  const leadHours = settings?.lead_time_hours ?? 2

  const bizStart = toMins(settings?.open_time  ?? '09:00')
  const bizEnd   = toMins(settings?.close_time ?? '18:00')

  if (staffMember) {
    const dow = new Date(date + 'T12:00:00').getDay()
    if (!staffMember.workDays.includes(dow)) return []
  }

  const openMins = staffMember
    ? Math.max(toMins(staffMember.workStart), bizStart)
    : bizStart
  const closeMins = staffMember
    ? Math.min(toMins(staffMember.workEnd), bizEnd)
    : bizEnd

  if (openMins >= closeMins) return []

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

    if (staffMember && isDuringBreak(m, durationMins, staffMember)) {
      slots.push({ time, available: false })
      continue
    }

    slots.push({ time, available: !isBlocked(m, durationMins, relevant) })
  }

  return slots
}

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
      // Block if the slot falls in this staff member's break
      if (isDuringBreak(m, durationMins, staff)) return false
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
