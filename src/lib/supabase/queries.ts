/**
 * Centralised Supabase query helpers.
 *
 * Admin queries (getSettings, getServices, getStaff, getBookings, …)
 * use the BROWSER client (RLS + auth session cookie) and additionally
 * filter by user_id as a belt-and-suspenders guard.
 *
 * Public booking queries (getServicesForBusiness, getStaffForBusiness,
 * getBookedSlotsForDate, createBooking) run with the anon key and
 * scope by business_id explicitly. business_id is always resolved
 * server-side (slug → business row) before being passed in here.
 */
import { createClient } from './client'

// ─── Auth helper ──────────────────────────────────────────────────

async function getAuthUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return { supabase, user }
}

// ─── Business (public) ───────────────────────────────────────────

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

// ─── Settings (admin — RLS + explicit user_id guard) ──────────────

export async function getSettings() {
  const { supabase, user } = await getAuthUser()
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  if (error) throw error
  return data
}

export async function saveSettings(settings: Record<string, unknown>) {
  const { supabase, user } = await getAuthUser()
  const { error } = await supabase
    .from('business_settings')
    .update(settings)
    .eq('user_id', user.id)
  if (error) throw error
}

// ─── Services (admin — RLS + explicit user_id guard) ────────────

export async function getServices() {
  const { supabase, user } = await getAuthUser()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertService(service: {
  id?: string; name: string; description: string; duration: number; price: number
}) {
  const { supabase, user } = await getAuthUser()
  const { data, error } = await supabase
    .from('services')
    .upsert({ ...service, user_id: user.id, currency: 'EUR' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteService(id: string) {
  const { supabase, user } = await getAuthUser()
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// ─── Services (public — scoped by user_id resolved from business_settings) ────

export async function getServicesForBusiness(businessId: string) {
  const supabase = createClient()
  // services are tenant-scoped by user_id, not business_id.
  // Resolve user_id from business_settings using the known business row id.
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('user_id')
    .eq('id', businessId)
    .single()
  if (bizErr || !biz) return []

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', biz.user_id)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ─── Staff (admin — RLS + explicit user_id guard) ──────────────

export async function getStaff() {
  const { supabase, user } = await getAuthUser()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('user_id', user.id)
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
  const { supabase, user } = await getAuthUser()
  const { data, error } = await supabase
    .from('staff')
    .upsert({ ...member, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStaffMember(id: string) {
  const { supabase, user } = await getAuthUser()
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// ─── Staff (public — scoped by user_id resolved from business_settings) ──────

export async function getStaffForBusiness(businessId: string) {
  const supabase = createClient()
  // staff are tenant-scoped by user_id, not business_id.
  // Resolve user_id from business_settings using the known business row id.
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('user_id')
    .eq('id', businessId)
    .single()
  if (bizErr || !biz) return []

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('user_id', biz.user_id)
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ─── Bookings (admin — RLS scoped via business_settings join) ────

export async function getBookings() {
  const { supabase, user } = await getAuthUser()
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (bizErr || !biz) throw bizErr ?? new Error('Business not found')

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('business_id', biz.id)
    .order('date', { ascending: false })
    .order('time', { ascending: true })
  if (error) throw error
  return data
}

export async function updateBookingStatus(
  id: string,
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
) {
  const { supabase, user } = await getAuthUser()
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (bizErr || !biz) throw bizErr ?? new Error('Business not found')

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .eq('business_id', biz.id)
  if (error) throw error
}

// ─── Bookings (public — business_id is server-resolved, not client-supplied) ─

/**
 * createBooking is called from the client-side BookingWizard.
 * business_id comes from the Business object that was fetched server-side
 * during slug resolution (page.tsx Server Component), NOT from user input.
 * The anon key + RLS "public can insert" policy allows unauthenticated inserts.
 */
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
