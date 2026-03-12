export type Service = {
  id: string
  name: string
  description: string
  duration: number // minutes
  price: number
  currency: string
}

export type Booking = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: string
  serviceId: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
  notes: string
  createdAt: string
}

export type BusinessSettings = {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  currency: string
  openDays: number[] // 0=Sun 1=Mon ... 6=Sat
  openTime: string   // '09:00'
  closeTime: string  // '18:00'
  slotInterval: number // minutes
  leadTimeHours: number
  maxAdvanceDays: number
  cancellationPolicy: string
  primaryColor: string
}

export const businessSettings: BusinessSettings = {
  name: 'Glow Beauty Studio',
  tagline: 'Premium beauty & wellness services in the heart of Riga',
  address: 'Brīvības iela 45, Rīga, LV-1010',
  phone: '+371 2612 3456',
  email: 'hello@glowbeauty.lv',
  currency: 'EUR',
  openDays: [1, 2, 3, 4, 5, 6], // Mon–Sat
  openTime: '09:00',
  closeTime: '19:00',
  slotInterval: 30,
  leadTimeHours: 2,
  maxAdvanceDays: 30,
  cancellationPolicy: 'Free cancellation up to 24 hours before your appointment.',
  primaryColor: '#6366f1',
}

export const services: Service[] = [
  { id: 's1', name: 'Classic Manicure', description: 'Shape, buff and polish for perfect nails', duration: 45, price: 25, currency: 'EUR' },
  { id: 's2', name: 'Gel Manicure', description: 'Long-lasting gel colour with UV finish', duration: 60, price: 35, currency: 'EUR' },
  { id: 's3', name: 'Full Body Wax', description: 'Smooth skin from head to toe', duration: 90, price: 65, currency: 'EUR' },
  { id: 's4', name: 'Eyebrow Shaping', description: 'Define and sculpt your brows', duration: 30, price: 18, currency: 'EUR' },
  { id: 's5', name: 'Lash Lift & Tint', description: 'Natural lash enhancement that lasts 6–8 weeks', duration: 60, price: 45, currency: 'EUR' },
  { id: 's6', name: 'Classic Facial', description: 'Deep cleanse, exfoliation and hydration mask', duration: 60, price: 55, currency: 'EUR' },
]

export const bookings: Booking[] = [
  { id: 'b1', customerName: 'Anna Bērziņa', customerEmail: 'anna@example.com', customerPhone: '+371 2611 0001', service: 'Gel Manicure', serviceId: 's2', date: '2026-03-13', time: '10:00', status: 'confirmed', notes: '', createdAt: '2026-03-11T08:22:00Z' },
  { id: 'b2', customerName: 'Laura Kalniņa', customerEmail: 'laura@example.com', customerPhone: '+371 2611 0002', service: 'Lash Lift & Tint', serviceId: 's5', date: '2026-03-13', time: '11:00', status: 'confirmed', notes: 'First time client', createdAt: '2026-03-11T09:10:00Z' },
  { id: 'b3', customerName: 'Marta Ozola', customerEmail: 'marta@example.com', customerPhone: '+371 2611 0003', service: 'Classic Facial', serviceId: 's6', date: '2026-03-13', time: '14:00', status: 'pending', notes: 'Sensitive skin', createdAt: '2026-03-12T10:05:00Z' },
  { id: 'b4', customerName: 'Ilze Liepiņa', customerEmail: 'ilze@example.com', customerPhone: '+371 2611 0004', service: 'Eyebrow Shaping', serviceId: 's4', date: '2026-03-14', time: '09:30', status: 'confirmed', notes: '', createdAt: '2026-03-12T11:00:00Z' },
  { id: 'b5', customerName: 'Kristīne Vītoliņa', customerEmail: 'kristine@example.com', customerPhone: '+371 2611 0005', service: 'Full Body Wax', serviceId: 's3', date: '2026-03-14', time: '13:00', status: 'confirmed', notes: '', createdAt: '2026-03-12T12:30:00Z' },
  { id: 'b6', customerName: 'Sandra Freiberga', customerEmail: 'sandra@example.com', customerPhone: '+371 2611 0006', service: 'Classic Manicure', serviceId: 's1', date: '2026-03-10', time: '10:30', status: 'confirmed', notes: '', createdAt: '2026-03-08T09:00:00Z' },
  { id: 'b7', customerName: 'Dace Krūmiņa', customerEmail: 'dace@example.com', customerPhone: '+371 2611 0007', service: 'Gel Manicure', serviceId: 's2', date: '2026-03-10', time: '15:00', status: 'cancelled', notes: '', createdAt: '2026-03-09T14:00:00Z' },
]
