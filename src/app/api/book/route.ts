import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

function customerEmailHtml(p: {
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  customerName: string
  serviceName: string
  staffName: string
  date: string
  time: string
  duration: number
  price: number
  ref: string
  cancellationPolicy: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <!-- Header -->
        <tr><td style="background:#4f46e5;padding:32px;text-align:center">
          <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
            <span style="color:#fff;font-size:22px;font-weight:800">${p.businessName[0]}</span>
          </div>
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">${p.businessName}</h1>
        </td></tr>
        <!-- Check + title -->
        <tr><td style="padding:32px 32px 0;text-align:center">
          <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
            <span style="font-size:28px">✓</span>
          </div>
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827">You&apos;re booked!</h2>
          <p style="margin:0;color:#6b7280;font-size:15px">Hi ${p.customerName}, your appointment is confirmed.</p>
        </td></tr>
        <!-- Booking card -->
        <tr><td style="padding:24px 32px">
          <table width="100%" style="background:#f9fafb;border-radius:12px;overflow:hidden">
            <tr><td style="background:#16a34a;padding:16px 20px">
              <p style="margin:0;color:#fff;font-weight:700;font-size:16px">${p.serviceName}</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${p.date} at ${p.time}</p>
            </td></tr>
            <tr><td style="padding:16px 20px">
              <table width="100%">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">With</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right">${p.staffName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Duration</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right">${p.duration} min</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Price</td>
                  <td style="padding:6px 0;color:#4f46e5;font-size:14px;font-weight:700;text-align:right">€${p.price}</td>
                </tr>
                <tr><td colspan="2" style="padding-top:12px;border-top:1px solid #e5e7eb"></td></tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Address</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;text-align:right">${p.businessAddress}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Phone</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;text-align:right">${p.businessPhone}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        <!-- Ref -->
        <tr><td style="padding:0 32px 24px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:13px">Booking reference</p>
          <p style="margin:4px 0 0;font-family:monospace;font-size:18px;font-weight:800;color:#4f46e5;letter-spacing:2px">${p.ref}</p>
        </td></tr>
        <!-- Policy -->
        <tr><td style="padding:0 32px 32px;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6">${p.cancellationPolicy}</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#d1d5db;font-size:12px">Questions? Reply to this email or call ${p.businessPhone}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function adminEmailHtml(p: {
  businessName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerNotes: string
  serviceName: string
  staffName: string
  date: string
  time: string
  duration: number
  price: number
  ref: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#4f46e5;padding:24px 32px">
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px">New booking — ${p.businessName}</p>
          <h1 style="margin:4px 0 0;color:#fff;font-size:20px;font-weight:700">&#128276; ${p.customerName} just booked</h1>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <table width="100%" style="border:2px solid #e5e7eb;border-radius:12px">
            <tr><td style="background:#f9fafb;padding:12px 16px;border-radius:10px 10px 0 0">
              <p style="margin:0;font-weight:700;color:#111827">${p.serviceName}</p>
              <p style="margin:2px 0 0;color:#6b7280;font-size:13px">${p.date} at ${p.time} &middot; ${p.duration} min &middot; €${p.price}</p>
            </td></tr>
            <tr><td style="padding:16px">
              <table width="100%">
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px;width:110px">Customer</td>
                  <td style="padding:5px 0;color:#111827;font-size:14px;font-weight:600">${p.customerName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Email</td>
                  <td style="padding:5px 0;font-size:14px"><a href="mailto:${p.customerEmail}" style="color:#4f46e5">${p.customerEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Phone</td>
                  <td style="padding:5px 0;font-size:14px"><a href="tel:${p.customerPhone}" style="color:#4f46e5">${p.customerPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Staff</td>
                  <td style="padding:5px 0;color:#111827;font-size:14px">${p.staffName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Ref</td>
                  <td style="padding:5px 0;font-family:monospace;font-size:14px;font-weight:700;color:#4f46e5">${p.ref}</td>
                </tr>
                ${p.customerNotes ? `
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Notes</td>
                  <td style="padding:5px 0;color:#92400e;font-size:14px;background:#fffbeb;border-radius:6px;padding:6px 10px">${p.customerNotes}</td>
                </tr>` : ''}
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:12px">BookFlow — ${p.businessName}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Save booking to Supabase using service role (no auth needed for public booking)
    const supabase = await createClient()
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        business_id:      body.business_id,
        ref:              body.ref,
        service_id:       body.service_id,
        service_name:     body.service_name,
        service_duration: body.service_duration,
        service_price:    body.service_price,
        staff_id:         body.staff_id,
        staff_name:       body.staff_name,
        date:             body.date,
        time:             body.time,
        customer_name:    body.customer_name,
        customer_email:   body.customer_email,
        customer_phone:   body.customer_phone,
        customer_notes:   body.customer_notes,
        status:           'confirmed',
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking insert error:', bookingError)
      return NextResponse.json({ error: bookingError.message }, { status: 500 })
    }

    // 2. Fetch business details for email content
    const { data: biz } = await supabase
      .from('business_settings')
      .select('name,address,phone,email,cancellation_policy')
      .eq('id', body.business_id)
      .single()

    const businessName   = biz?.name   ?? 'BookFlow'
    const businessAddr   = biz?.address ?? ''
    const businessPhone  = biz?.phone   ?? ''
    const businessEmail  = biz?.email   ?? ''
    const cancelPolicy   = biz?.cancellation_policy ?? ''
    const adminEmail     = process.env.ADMIN_EMAIL ?? businessEmail
    const fromEmail      = 'bookings@bookflow.app'

    // 3. Send both emails in parallel — never block the response if email fails
    const emailResults = await Promise.allSettled([
      // Customer confirmation
      resend.emails.send({
        from: `${businessName} <${fromEmail}>`,
        to:   body.customer_email,
        subject: `Booking confirmed — ${body.service_name} on ${body.date}`,
        html: customerEmailHtml({
          businessName,
          businessAddress:  businessAddr,
          businessPhone,
          businessEmail,
          customerName:     body.customer_name,
          serviceName:      body.service_name,
          staffName:        body.staff_name,
          date:             body.date,
          time:             body.time,
          duration:         body.service_duration,
          price:            body.service_price,
          ref:              body.ref,
          cancellationPolicy: cancelPolicy,
        }),
      }),
      // Admin notification
      resend.emails.send({
        from: `BookFlow Alerts <${fromEmail}>`,
        to:   adminEmail,
        subject: `📋 New booking: ${body.customer_name} — ${body.service_name} on ${body.date}`,
        html: adminEmailHtml({
          businessName,
          customerName:   body.customer_name,
          customerEmail:  body.customer_email,
          customerPhone:  body.customer_phone,
          customerNotes:  body.customer_notes,
          serviceName:    body.service_name,
          staffName:      body.staff_name,
          date:           body.date,
          time:           body.time,
          duration:       body.service_duration,
          price:          body.service_price,
          ref:            body.ref,
        }),
      }),
    ])

    const emailsSent = emailResults.every(r => r.status === 'fulfilled')
    if (!emailsSent) {
      emailResults.forEach((r, i) => {
        if (r.status === 'rejected') console.error(`Email ${i} failed:`, r.reason)
      })
    }

    return NextResponse.json({ booking, emailsSent })
  } catch (err) {
    console.error('POST /api/book error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
