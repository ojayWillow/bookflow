import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service-role'
import { generateCancelToken } from '@/lib/cancel-token'
import { cancelledAdminEmailHtml, cancelledCustomerEmailHtml } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

function verifyCancelToken(bookingId: string, token: string): boolean {
  const expected = generateCancelToken(bookingId)
  if (expected.length !== token.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}

// GET — redirect to the confirmation page
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id    = searchParams.get('id')
  const token = searchParams.get('token')
  if (!id || !token) {
    return NextResponse.redirect(new URL('/cancel?error=invalid', req.url))
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

  const supabase = createServiceClient()

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, status, ref, service_name, service_duration, service_price, date, time, customer_name, customer_email, customer_phone, business_id')
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

  const { data: biz } = await supabase
    .from('business_settings')
    .select('name, slug, email, phone, cancellation_window_hours, logo_url')
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

  // Send emails — fire and forget, don't block the response
  const fromDomain = process.env.RESEND_FROM_DOMAIN ?? 'kolab.lv'
  const bizName    = biz?.name ?? 'BookFlow'
  const bizEmail   = biz?.email ?? ''
  const bizPhone   = biz?.phone ?? ''
  const logoUrl    = biz?.logo_url ?? null

  try {
    await Promise.all([
      // Notify the business owner
      bizEmail && resend.emails.send({
        from:    `BookFlow <noreply@${fromDomain}>`,
        to:      bizEmail,
        subject: `\u274C Cancellation: ${booking.customer_name} — ${booking.service_name} on ${booking.date}`,
        html: cancelledAdminEmailHtml({
          businessName:  bizName,
          customerName:  booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          serviceName:   booking.service_name,
          date:          booking.date,
          time:          booking.time,
          duration:      booking.service_duration,
          ref:           booking.ref,
        }),
      }),
      // Confirm cancellation to customer
      resend.emails.send({
        from:    `${bizName} <noreply@${fromDomain}>`,
        to:      booking.customer_email,
        subject: `Your booking has been cancelled — ${booking.service_name}`,
        html: cancelledCustomerEmailHtml({
          businessName: bizName,
          businessPhone: bizPhone,
          customerName: booking.customer_name,
          serviceName:  booking.service_name,
          date:         booking.date,
          time:         booking.time,
          ref:          booking.ref,
          logoUrl,
        }),
      }),
    ])
  } catch (emailErr) {
    console.error('Cancellation emails failed:', emailErr)
  }

  return NextResponse.json({ success: true, slug: biz?.slug ?? null })
}
