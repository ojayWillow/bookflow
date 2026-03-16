import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

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
      business_settings!inner(user_id, name, phone)
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
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  const fromDomain = process.env.RESEND_FROM_DOMAIN ?? 'kolab.lv'

  try {
    await resend.emails.send({
      from:    `BookFlow <noreply@${fromDomain}>`,
      to:      booking.customer_email,
      subject: `Booking update \u2014 ${booking.service_name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#4f46e5;padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">${biz.name}</h1>
        </td></tr>
        <tr><td style="padding:32px;text-align:center">
          <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
            <span style="font-size:28px">&#10005;</span>
          </div>
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Request Not Approved</h2>
          <p style="margin:0;color:#6b7280;font-size:15px">Hi ${booking.customer_name},</p>
          <p style="margin:12px 0 0;color:#6b7280;font-size:15px;line-height:1.6">
            Unfortunately, your booking request for <strong>${booking.service_name}</strong><br>
            on <strong>${booking.date}</strong> at <strong>${booking.time}</strong> could not be approved at this time.
          </p>
          <p style="margin:16px 0 0;color:#6b7280;font-size:15px">
            Please contact us on <a href="tel:${biz.phone}" style="color:#4f46e5;font-weight:600">${biz.phone}</a> to arrange an alternative time.
          </p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:12px">BookFlow &#8212; ${biz.name}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
  } catch (emailErr) {
    console.error('Decline email failed:', emailErr)
  }

  return NextResponse.json({ ok: true })
}
