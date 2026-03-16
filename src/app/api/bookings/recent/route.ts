import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: biz, error: bizError } = await supabase
    .from('business_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (bizError || !biz) {
    return NextResponse.json([], { status: 200 })
  }

  // Fetch new bookings (not cancelled) — ordered by created_at
  const { data: newBookings } = await supabase
    .from('bookings')
    .select('id, ref, customer_name, service_name, date, time, created_at, status')
    .eq('business_id', biz.id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch recently cancelled bookings — use updated_at if available, fallback to created_at
  const { data: cancelledBookings } = await supabase
    .from('bookings')
    .select('id, ref, customer_name, service_name, date, time, created_at, status')
    .eq('business_id', biz.id)
    .eq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(10)

  // Merge, tag with type, sort by created_at desc, return top 20
  const merged = [
    ...(newBookings ?? []).map(b => ({ ...b, type: 'new' as const })),
    ...(cancelledBookings ?? []).map(b => ({ ...b, type: 'cancelled' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
   .slice(0, 20)

  return NextResponse.json(merged)
}
