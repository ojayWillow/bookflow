export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

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

export function loadBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

export function saveBooking(booking: Booking): void {
  const all = loadBookings()
  // Replace if ref already exists, otherwise append
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
