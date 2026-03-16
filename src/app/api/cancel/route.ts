import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCancelToken } from '@/lib/cancel-token'

function verifyCancelToken(bookingId: string, token: string): boolean {
  const expected = generateCancelToken(bookingId)
  if (expected.length !== token.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}

// GET — redirect to the confirmation page (no longer cancels directly)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id    = searchParams.get('id')
  const token = searchParams.get('token')
  if (!id || !token) {
    return NextResponse.redirect(new URL(`/cancel?error=invalid`, req.url))
  }
  return NextResponse.redirect(new URL(`/cancel?id=${id}&token=${token}`, req.url))
}

// POST — called by the confirmation page after user clicks "Yes, cancel"
export async function POST(req: NextRequest) {
  const { id, token } = await req.json()

  if (!id || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  if (!verifyCancelToken(id, token)) {
    return NextResponse.json({ error: 'Invalid cancellation token' }, { status: 403 })
  }

  const supabase = await createClient()

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, status, service_name, date, time, customer_name, business_id')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'already_cancelled' }, { status: 409 })
  }

  if (booking.status === 'completed') {
    return NextResponse.json({ error: 'already_completed' }, { status: 409 })
  }

  // Cancellation window check
  const { data: biz } = await supabase
    .from('business_settings')
    .select('cancellation_window_hours')
    .eq('id', booking.business_id)
    .single()

  const windowHours = biz?.cancellation_window_hours ?? 24

  if (windowHours > 0) {
    const appointmentAt = new Date(`${booking.date}T${booking.time}:00`)
    const deadlineAt    = new Date(appointmentAt.getTime() - windowHours * 60 * 60 * 1000)
    if (new Date() >= deadlineAt) {
      return NextResponse.json({ error: 'window_passed', windowHours }, { status: 409 })
    }
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
