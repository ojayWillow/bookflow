import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { reviewRequestEmailHtml } from '@/lib/email-templates'

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

  // Fetch business settings directly by user_id — guaranteed to have all fields
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('id, user_id, name, phone, logo_url, google_maps_url')
    .eq('user_id', user.id)
    .single()

  if (bizErr || !biz) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  // Fetch the booking and verify it belongs to this business
  const { data: booking, error: fetchErr } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .eq('business_id', biz.id)
    .single()

  if (fetchErr || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status !== 'confirmed') {
    return NextResponse.json({ error: 'Booking is not confirmed' }, { status: 400 })
  }

  const { error: updateErr } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Send review request email
  let emailWarning: string | null = null
  if (biz.google_maps_url) {
    const fromDomain = process.env.RESEND_FROM_DOMAIN ?? 'kolab.lv'
    try {
      await resend.emails.send({
        from:    `${biz.name} <noreply@${fromDomain}>`,
        to:      booking.customer_email,
        subject: `How was your ${booking.service_name}? ⭐ Leave us a review`,
        html: reviewRequestEmailHtml({
          businessName:  biz.name,
          businessPhone: biz.phone,
          customerName:  booking.customer_name,
          serviceName:   booking.service_name,
          date:          booking.date,
          reviewUrl:     biz.google_maps_url,
          logoUrl:       biz.logo_url ?? null,
        }),
      })
    } catch (emailErr) {
      console.error('Review request email failed:', emailErr)
      emailWarning = emailErr instanceof Error ? emailErr.message : 'Email send failed'
    }
  } else {
    console.warn('No google_maps_url set — review email skipped for booking', id)
  }

  return NextResponse.json({ ok: true, ...(emailWarning ? { emailWarning } : {}) })
}
