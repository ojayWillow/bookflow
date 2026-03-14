import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// PATCH /api/bookings
// Body: { id: string, date: string (yyyy-MM-dd), time: string (HH:mm) }
// Only allows rescheduling bookings that belong to the authenticated user's business.
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, date, time } = body

  if (!id || !date || !time) {
    return NextResponse.json({ error: 'id, date and time are required' }, { status: 400 })
  }

  // Validate date format yyyy-MM-dd
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  // Validate time format HH:mm
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: 'Invalid time format' }, { status: 400 })
  }

  // Fetch the booking and verify it belongs to this user's business
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, business_id')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const { data: settings } = await supabase
    .from('business_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!settings || settings.id !== booking.business_id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ date, time })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
