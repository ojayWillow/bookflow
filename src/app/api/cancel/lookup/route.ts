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

// GET /api/cancel/lookup?id=&token=
// Returns booking details + policy so the confirmation page can render them
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id    = searchParams.get('id')
  const token = searchParams.get('token')

  if (!id || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  if (!verifyCancelToken(id, token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  const supabase = await createClient()

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, status, ref, service_name, service_duration, date, time, customer_name, business_id')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const { data: biz } = await supabase
    .from('business_settings')
    .select('name, cancellation_window_hours, cancellation_policy, primary_color, logo_url')
    .eq('id', booking.business_id)
    .single()

  const windowHours = biz?.cancellation_window_hours ?? 24
  const appointmentAt = new Date(`${booking.date}T${booking.time}:00`)
  const deadlineAt    = windowHours > 0
    ? new Date(appointmentAt.getTime() - windowHours * 60 * 60 * 1000)
    : null
  const withinWindow  = deadlineAt ? new Date() >= deadlineAt : false

  return NextResponse.json({
    booking: {
      id: booking.id,
      ref: booking.ref,
      status: booking.status,
      service_name: booking.service_name,
      service_duration: booking.service_duration,
      date: booking.date,
      time: booking.time,
      customer_name: booking.customer_name,
    },
    business: {
      name: biz?.name ?? '',
      primary_color: biz?.primary_color ?? '#6366f1',
      logo_url: biz?.logo_url ?? '',
    },
    policy: {
      windowHours,
      cancellationPolicy: biz?.cancellation_policy ?? '',
      withinWindow,
      deadlineAt: deadlineAt?.toISOString() ?? null,
    },
  })
}
