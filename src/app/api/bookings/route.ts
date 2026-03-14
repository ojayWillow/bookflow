import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'BookFlow <bookings@kolab.lv>'

// ─── Helpers ─────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}
function formatTime(timeStr: string) {
  const [h, min] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour   = h % 12 || 12
  return `${hour}:${min.toString().padStart(2, '0')} ${period}`
}
function formatPrice(price: number, currency: string) {
  if (!price) return 'Free'
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency }).format(price)
}

// ─── Email: customer confirmation ────────────────────────────────
function customerEmailHtml(b: {
  ref: string; businessName: string; businessAddress: string
  businessPhone: string; cancellationPolicy: string
  serviceName: string; servicePrice: number; serviceCurrency: string
  serviceDuration: number; staffName: string; date: string; time: string
  customerName: string; primaryColor: string
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
        <tr><td style="background:${b.primaryColor};padding:32px;text-align:center">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">${b.businessName}</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Booking Confirmation</p>
        </td></tr>
        <tr><td style="padding:32px 32px 0;text-align:center">
          <div style="display:inline-block;background:#ecfdf5;border:1.5px solid #6ee7b7;border-radius:50px;padding:8px 20px">
            <span style="color:#059669;font-weight:600;font-size:14px">&#10003; Booking confirmed</span>
          </div>
          <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Ref: <strong style="color:#111827">${b.ref}</strong></p>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <table width="100%" style="background:#f9fafb;border-radius:12px">
            <tr><td style="padding:20px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%">Service</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${b.serviceName}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Date</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${formatDate(b.date)}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Time</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${formatTime(b.time)}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Duration</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${b.serviceDuration} min</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Staff</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${b.staffName}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Price</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${formatPrice(b.servicePrice, b.serviceCurrency)}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        ${b.businessAddress ? `<tr><td style="padding:0 32px 24px"><p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Location</p><p style="margin:0;color:#111827;font-size:13px">${b.businessAddress}</p></td></tr>` : ''}
        ${b.cancellationPolicy ? `<tr><td style="padding:0 32px 24px"><div style="background:#fefce8;border:1.5px solid #fde68a;border-radius:10px;padding:14px 16px"><p style="margin:0 0 4px;color:#92400e;font-size:12px;font-weight:600">Cancellation policy</p><p style="margin:0;color:#78350f;font-size:12px;line-height:1.5">${b.cancellationPolicy}</p></div></td></tr>` : ''}
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6">
          <p style="margin:0;color:#9ca3af;font-size:12px">Questions? Contact us at ${b.businessPhone || 'the number on our website'}.</p>
          <p style="margin:8px 0 0;color:#d1d5db;font-size:11px">Powered by BookFlow</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Email: owner alert ───────────────────────────────────────────────
function ownerEmailHtml(b: {
  ref: string; businessName: string; serviceName: string
  servicePrice: number; serviceCurrency: string; serviceDuration: number
  staffName: string; date: string; time: string
  customerName: string; customerEmail: string; customerPhone: string
  customerNotes: string; primaryColor: string
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
        <tr><td style="background:${b.primaryColor};padding:24px 32px">
          <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700">New booking &#8212; ${b.businessName}</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px">Ref: ${b.ref}</p>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#111827">Booking details</p>
          <table width="100%" style="background:#f9fafb;border-radius:12px">
            <tr><td style="padding:20px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;width:40%">Service</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${b.serviceName}</td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Date</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${formatDate(b.date)}</td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Time</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${formatTime(b.time)}</td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Duration</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${b.serviceDuration} min</td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Staff</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${b.staffName}</td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Price</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${formatPrice(b.servicePrice, b.serviceCurrency)}</td></tr>
              </table>
            </td></tr>
          </table>
          <p style="margin:24px 0 12px;font-size:14px;font-weight:600;color:#111827">Customer details</p>
          <table width="100%" style="background:#f9fafb;border-radius:12px">
            <tr><td style="padding:20px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;width:40%">Name</td><td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600">${b.customerName}</td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Email</td><td style="padding:5px 0;font-size:13px"><a href="mailto:${b.customerEmail}" style="color:#4f46e5">${b.customerEmail}</a></td></tr>
                <tr><td style="padding:5px 0;color:#6b7280;font-size:13px">Phone</td><td style="padding:5px 0;font-size:13px"><a href="tel:${b.customerPhone}" style="color:#4f46e5">${b.customerPhone}</a></td></tr>
                ${b.customerNotes ? `<tr><td style="padding:5px 0;color:#6b7280;font-size:13px;vertical-align:top">Notes</td><td style="padding:5px 0;color:#374151;font-size:13px">${b.customerNotes}</td></tr>` : ''}
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6">
          <p style="margin:0;color:#9ca3af;font-size:12px">Powered by BookFlow</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── POST /api/bookings ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      business_id, ref, service_id, service_name, service_duration,
      service_price, service_currency, staff_id, staff_name,
      date, time, customer_name, customer_email, customer_phone,
      customer_notes, status,
    } = body

    // 1. Insert booking into Supabase
    const supabase = await createClient()
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        business_id, ref, service_id, service_name, service_duration,
        service_price, staff_id, staff_name, date, time,
        customer_name, customer_email, customer_phone,
        customer_notes, status,
      })
      .select()
      .single()

    if (error) {
      console.error('[bookings] insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. Fetch business settings for email content
    const { data: biz } = await supabase
      .from('business_settings')
      .select('name, email, phone, address, cancellation_policy, primary_color')
      .eq('id', business_id)
      .single()

    const businessName       = biz?.name                ?? 'The Business'
    const businessEmail      = biz?.email               ?? 'info@kolab.lv'
    const businessPhone      = biz?.phone               ?? ''
    const businessAddress    = biz?.address             ?? ''
    const cancellationPolicy = biz?.cancellation_policy ?? ''
    const primaryColor       = biz?.primary_color       ?? '#6366f1'

    const emailData = {
      ref, businessName, businessAddress, businessPhone, cancellationPolicy,
      serviceName:     service_name,
      servicePrice:    service_price,
      serviceCurrency: service_currency ?? 'EUR',
      serviceDuration: service_duration,
      staffName:       staff_name,
      date, time,
      customerName:    customer_name,
      customerEmail:   customer_email,
      customerPhone:   customer_phone,
      customerNotes:   customer_notes ?? '',
      primaryColor,
    }

    // 3. Send emails via Resend (non-blocking — booking already saved)
    await Promise.allSettled([
      resend.emails.send({
        from:    FROM,
        to:      customer_email,
        subject: `Booking confirmed — ${service_name} on ${formatDate(date)}`,
        html:    customerEmailHtml(emailData),
      }),
      resend.emails.send({
        from:    FROM,
        to:      businessEmail,
        subject: `New booking: ${customer_name} — ${service_name} on ${formatDate(date)} [${ref}]`,
        html:    ownerEmailHtml({ ...emailData, businessName }),
      }),
    ])

    return NextResponse.json({ booking })

  } catch (err) {
    console.error('[bookings] unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
