/**
 * Centralised Supabase query helpers.
 */
import { createClient } from './client'

async function getAuthUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return { supabase, user }
}

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
  avatar_url?: string | null
  break_start?: string | null
  break_end?: string | null
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

const PAGE_SIZE = 25

export async function getBookings(page = 0) {
  const { supabase, user } = await getAuthUser()
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (bizErr || !biz) throw bizErr ?? new Error('Business not found')

  const from = page * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('business_id', biz.id)
    .order('date', { ascending: false })
    .order('time', { ascending: true })
    .range(from, to)

  if (error) throw error
  return { data: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE }
}

/**
 * Direct status update — intentionally excludes 'completed'.
 * Use the /api/bookings/[id]/complete API route to mark a booking complete
 * so that the review request email is always sent.
 */
export async function updateBookingStatus(
  id: string,
  status: 'confirmed' | 'pending' | 'cancelled'
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
  const { data, error } = await supabase
    .from('bookings')
    .select('time, service_duration, staff_id')
    .eq('date', date)
    .eq('business_id', businessId)
    .neq('status', 'cancelled')

  if (error) throw error

  const all = (data ?? []) as { time: string; service_duration: number; staff_id: string | null }[]
  if (staffId === 'any') return all
  return all.filter(b => b.staff_id === staffId || b.staff_id === null)
}
