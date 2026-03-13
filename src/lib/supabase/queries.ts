/**
 * Centralised Supabase query helpers.
 * Used by admin pages and the booking flow.
 */
import { createClient } from './client'

// ─── Services ───────────────────────────────────────────────
export async function getServices() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertService(service: {
  id?: string; name: string; description: string; duration: number; price: number
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('services')
    .upsert({ ...service, currency: 'EUR' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteService(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

// ─── Staff ──────────────────────────────────────────────────
export async function getStaff() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertStaffMember(member: {
  id?: string; name: string; role: string; bio: string
  service_ids: string[]; work_days: number[]
  work_start: string; work_end: string
  active: boolean; color: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('staff')
    .upsert(member)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStaffMember(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('staff').delete().eq('id', id)
  if (error) throw error
}

// ─── Business Settings ──────────────────────────────────────
export async function getSettings() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('slug', 'demo')
    .single()
  if (error) throw error
  return data
}

export async function saveSettings(settings: Record<string, unknown>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('business_settings')
    .update(settings)
    .eq('slug', 'demo')
  if (error) throw error
}

// ─── Bookings ───────────────────────────────────────────────
export async function getBookings() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: true })
  if (error) throw error
  return data
}

export async function createBooking(booking: {
  ref: string
  service_id: string | null
  service_name: string
  service_duration: number
  service_price: number
  staff_id: string | null
  staff_name: string
  date: string
  time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_notes: string
  status: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateBookingStatus(
  id: string,
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
) {
  const supabase = createClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function getBookedSlotsForDate(
  date: string,
  staffId: string | 'any'
) {
  const supabase = createClient()
  let query = supabase
    .from('bookings')
    .select('time, service_duration')
    .eq('date', date)
    .neq('status', 'cancelled')

  if (staffId !== 'any') {
    query = query.eq('staff_id', staffId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((b: { time: string }) => b.time)
}
