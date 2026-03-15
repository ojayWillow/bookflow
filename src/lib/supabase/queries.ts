/**
 * Centralised Supabase query helpers.
 *
 * Admin mutations for services and staff are routed through Next.js
 * API routes (/api/services, /api/staff) so that auth is resolved
 * server-side from cookies via @supabase/ssr — avoiding the browser
 * client 400 / stale-JWT problem.
 *
 * Public booking queries run with the anon key scoped by business_id.
 */
import { createClient } from './client'

// ─── Auth helper (browser client) ────────────────────────────────────────────

async function getAuthUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return { supabase, user }
}

// ─── Business (public) ────────────────────────────────────────────────────────

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

// ─── Settings (admin — RLS + explicit user_id guard) ──────────────────────────

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

// ─── Services (admin — via /api/services, server auth) ───────────────────────

export async function getServices() {
  const res = await fetch('/api/services', { credentials: 'include' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to load services')
  }
  return res.json()
}

export async function upsertService(service: {
  id?: string; name: string; description: string; duration: number; price: number
}) {
  const res = await fetch('/api/services', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to save service')
  }
  return res.json()
}

export async function deleteService(id: string) {
  const res = await fetch(`/api/services?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to delete service')
  }
}

// ─── Services (public — scoped by user_id from business_settings) ────────────

export async function getServicesForBusiness(businessId: string) {
  const supabase = createClient()
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

// ─── Staff (admin — via /api/staff, server auth) ──────────────────────────────

export async function getStaff() {
  const res = await fetch('/api/staff', { credentials: 'include' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to load staff')
  }
  return res.json()
}

export async function upsertStaffMember(member: {
  id?: string; name: string; role: string; bio: string
  service_ids: string[]; work_days: number[]
  work_start: string; work_end: string
  active: boolean; color: string
}) {
  const res = await fetch('/api/staff', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to save staff member')
  }
  return res.json()
}

export async function deleteStaffMember(id: string) {
  const res = await fetch(`/api/staff?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to delete staff member')
  }
}

// ─── Staff (public — scoped by user_id from business_settings) ───────────────

export async function getStaffForBusiness(businessId: string) {
  const supabase = createClient()
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

// ─── Bookings (admin — RLS scoped via business_settings join) ─────────────────

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

// ─── Bookings (public — business_id server-resolved, not client-supplied) ────

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

/**
 * Fetch booked slots for a given date, business, and optional staff member.
 *
 * When a specific staffId is provided we return:
 *   - bookings assigned to that staff member
 *   - bookings with no staff assigned (null) — these block the whole calendar
 *
 * When staffId is 'any' we return all bookings for the day so that
 * the union-slot generator can correctly mark slots as taken.
 */
export async function getBookedSlotsForDate(
  date: string,
  staffId: string | 'any',
  businessId: string
) {
  const supabase = createClient()

  // Always fetch all non-cancelled bookings for the date — the slot
  // generator will filter by staff_id itself when needed.
  const { data, error } = await supabase
    .from('bookings')
    .select('time, service_duration, staff_id')
    .eq('date', date)
    .eq('business_id', businessId)
    .neq('status', 'cancelled')

  if (error) throw error

  const all = (data ?? []) as { time: string; service_duration: number; staff_id: string | null }[]

  if (staffId === 'any') return all

  // For a specific staff member: include bookings for that staff AND
  // any bookings with null staff_id (they block the full schedule).
  return all.filter(b => b.staff_id === staffId || b.staff_id === null)
}
