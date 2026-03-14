import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get this user's business
  const { data: biz, error: bizError } = await supabase
    .from('business_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (bizError || !biz) {
    return NextResponse.json([], { status: 200 })
  }

  // Return the 10 most recent bookings for this business
  const { data, error } = await supabase
    .from('bookings')
    .select('id, ref, customer_name, service_name, date, time, created_at')
    .eq('business_id', biz.id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
