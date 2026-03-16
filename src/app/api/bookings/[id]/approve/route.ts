import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { generateCancelToken } from '@/lib/cancel-token'
import { customerEmailHtml } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: booking, error: fetchErr } = await supabase
    .from('bookings')
    .select(`
      *,
      business_settings!inner(
        user_id, name, address, phone, email, cancellation_policy, logo_url
      )
    `)
    .eq('id', id)
    .single()

  if (fetchErr || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const biz = (booking as any).business_settings
  if (biz.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (booking.status !== 'pending') {
    return NextResponse.json({ error: 'Booking is not pending' }, { status: 400 })
  }

  const { error: updateErr } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow-three.vercel.app'
  const fromDomain = process.env.RESEND_FROM_DOMAIN  ?? 'kolab.lv'
  const cancelToken = generateCancelToken(booking.id)
  const cancelUrl   = `${appUrl}/api/cancel?id=${booking.id}&token=${cancelToken}`

  try {
    await resend.emails.send({
      from:    `BookFlow <noreply@${fromDomain}>`,
      to:      booking.customer_email,
      subject: `Booking confirmed \u2014 ${booking.service_name} on ${booking.date}`,
      html: customerEmailHtml({
        businessName:       biz.name,
        businessAddress:    biz.address,
        businessPhone:      biz.phone,
        businessEmail:      biz.email,
        customerName:       booking.customer_name,
        serviceName:        booking.service_name,
        staffName:          booking.staff_name,
        date:               booking.date,
        time:               booking.time,
        duration:           booking.service_duration,
        price:              booking.service_price,
        ref:                booking.ref,
        cancellationPolicy: biz.cancellation_policy,
        cancelUrl,
        logoUrl:            biz.logo_url ?? null,
      }),
    })
  } catch (emailErr) {
    console.error('Approve email failed:', emailErr)
  }

  return NextResponse.json({ ok: true })
}
