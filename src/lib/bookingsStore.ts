import { bookings as mockBookings } from '@/data/mock'

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'pending'

export interface Booking {
  id: string
  ref: string
  createdAt: string

  // Service
  serviceId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number

  // Staff
  staffId: string | 'any'
  staffName: string

  // Date & time
  date: string      // ISO date string YYYY-MM-DD
  time: string      // HH:MM

  // Customer
  customerName: string
  customerEmail: string
  customerPhone: string
  customerNotes: string

  status: BookingStatus
}

const KEY = 'bf_bookings'

function seedIfEmpty(): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    // Map mock bookings to the canonical Booking interface
    const seeded: Booking[] = mockBookings.map(b => ({
      id: b.id,
      ref: `BF-${b.id.toUpperCase()}`,
      createdAt: b.createdAt,
      serviceId: b.serviceId,
      serviceName: b.service,
      serviceDuration: 60,
      servicePrice: 0,
      staffId: b.staffId,
      staffName: b.staffName,
      date: b.date,
      time: b.time,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      customerNotes: b.notes,
      status: b.status as BookingStatus,
    }))
    localStorage.setItem(KEY, JSON.stringify(seeded))
  }
}

export function loadBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  seedIfEmpty()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

export function saveBooking(booking: Booking): void {
  const all = loadBookings()
  const idx = all.findIndex(b => b.ref === booking.ref)
  if (idx >= 0) {
    all[idx] = booking
  } else {
    all.unshift(booking)
  }
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function updateBookingStatus(ref: string, status: BookingStatus): void {
  const all = loadBookings()
  const idx = all.findIndex(b => b.ref === ref)
  if (idx >= 0) {
    all[idx].status = status
    localStorage.setItem(KEY, JSON.stringify(all))
  }
}

export function clearBookings(): void {
  localStorage.removeItem(KEY)
}
