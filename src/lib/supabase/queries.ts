/**
 * Centralised Supabase query helpers.
 *
 * Admin queries (getSettings, getServices, getStaff, getBookings, …)
 * rely on Supabase Row Level Security scoped to auth.uid().
 * No hardcoded business identifiers needed — RLS handles isolation.
 *
 * Public booking queries (getServicesForBusiness, getStaffForBusiness,
 * getBookedSlotsForDate) run without a user session and scope by
 * business_id explicitly.
 */
import { createClient } from './client'

// ─── Business (public) ──────────────────────────────────────

export async function getBusinessBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

// ─── Settings (admin — RLS scoped) ──────────────────────────

export async function getSettings() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function saveSettings(settings: Record<string, unknown>) {
  const supabase = createClient()
  // RLS ensures we only update the row owned by auth.uid()
  const { error } = await supabase
    .from('business_settings')
    .update(settings)
    .eq('id', (settings as { id: string }).id)
  if (error) throw error
}

// ─── Services (admin — RLS scoped) ──────────────────────────

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
  // business_id is set via a Supabase DB trigger or default;
  // RLS prevents writing to another business's rows
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

// ─── Services (public — scoped by business_id) ──────────────

export async function getServicesForBusiness(businessId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ─── Staff (admin — RLS scoped) ─────────────────────────────

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

// ─── Staff (public — scoped by business_id) ─────────────────

export async function getStaffForBusiness(businessId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('business_id', businessId)
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ─── Bookings (admin — RLS scoped) ──────────────────────────

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

// ─── Bookings (public — scoped by business_id) ──────────────

export async function createBooking(booking: {
  business_id: string
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

export async function getBookedSlotsForDate(
  date: string,
  staffId: string | 'any',
  businessId: string
) {
  const supabase = createClient()
  let query = supabase
    .from('bookings')
    .select('time, service_duration, staff_id')
    .eq('date', date)
    .eq('business_id', businessId)
    .neq('status', 'cancelled')

  if (staffId !== 'any') {
    query = query.eq('staff_id', staffId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as { time: string; service_duration: number; staff_id: string }[]
}
