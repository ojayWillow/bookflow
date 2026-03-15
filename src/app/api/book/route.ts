import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { generateCancelToken } from '@/lib/cancel-token'
import { randomBytes } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX    = 10
const RATE_LIMIT_WINDOW = 60_000

function isRateLimited(ip: string): boolean {
  const now    = Date.now()
  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  record.count++
  return record.count > RATE_LIMIT_MAX
}

const uuid       = z.string().uuid()
const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM expected)')
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD expected)')

const BookingSchema = z.object({
  business_id:      uuid,
  service_id:       uuid,
  service_name:     z.string().min(1).max(200),
  service_duration: z.number().int().min(5).max(480),
  service_price:    z.number().min(0).max(100_000),
  staff_id:         uuid.nullable().optional(),
  staff_name:       z.string().min(1).max(200),
  date:             dateString,
  time:             timeString,
  customer_name:    z.string().min(1).max(200).trim(),
  customer_email:   z.string().email(),
  customer_phone:   z.string().min(1).max(50),
  customer_notes:   z.string().max(1000).optional().default(''),
})

type BookingBody = z.infer<typeof BookingSchema>

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
  cancelUrl: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#4f46e5;padding:32px;text-align:center">
          <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
            <span style="color:#fff;font-size:22px;font-weight:800">${p.businessName[0]}</span>
          </div>
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">${p.businessName}</h1>
        </td></tr>
        <tr><td style="padding:32px 32px 0;text-align:center">
          <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
            <span style="font-size:28px">&#10003;</span>
          </div>
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827">You&apos;re booked!</h2>
          <p style="margin:0;color:#6b7280;font-size:15px">Hi ${p.customerName}, your appointment is confirmed.</p>
        </td></tr>
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
                  <td style="padding:6px 0;color:#4f46e5;font-size:14px;font-weight:700;text-align:right">&#8364;${p.price}</td>
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
        <tr><td style="padding:0 32px 24px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:13px">Booking reference</p>
          <p style="margin:4px 0 0;font-family:monospace;font-size:18px;font-weight:800;color:#4f46e5;letter-spacing:2px">${p.ref}</p>
        </td></tr>
        ${p.cancellationPolicy ? `
        <tr><td style="padding:0 32px 16px;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6">${p.cancellationPolicy}</p>
        </td></tr>` : ''}
        <tr><td style="padding:0 32px 32px;text-align:center">
          <a href="${p.cancelUrl}"
            style="display:inline-block;border:1px solid #e5e7eb;color:#6b7280;font-size:12px;padding:8px 20px;border-radius:8px;text-decoration:none;">
            Need to cancel? Click here
          </a>
        </td></tr>
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
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px">New booking &#8212; ${p.businessName}</p>
          <h1 style="margin:4px 0 0;color:#fff;font-size:20px;font-weight:700">&#128276; ${p.customerName} just booked</h1>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <table width="100%" style="border:2px solid #e5e7eb;border-radius:12px">
            <tr><td style="background:#f9fafb;padding:12px 16px;border-radius:10px 10px 0 0">
              <p style="margin:0;font-weight:700;color:#111827">${p.serviceName}</p>
              <p style="margin:2px 0 0;color:#6b7280;font-size:13px">${p.date} at ${p.time} &middot; ${p.duration} min &middot; &#8364;${p.price}</p>
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
          <p style="margin:0;color:#9ca3af;font-size:12px">BookFlow &#8212; ${p.businessName}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    const raw = await req.json()
    const parsed = BookingSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const body: BookingBody = parsed.data

    const supabase = await createClient()

    const { data: bizExists, error: bizLookupError } = await supabase
      .from('business_settings')
      .select('id')
      .eq('id', body.business_id)
      .single()

    if (bizLookupError || !bizExists) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const ref = 'BF-' + randomBytes(4).toString('hex').toUpperCase()

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        business_id:      body.business_id,
        ref,
        service_id:       body.service_id,
        service_name:     body.service_name,
        service_duration: body.service_duration,
        service_price:    body.service_price,
        staff_id:         body.staff_id ?? null,
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

    const { data: biz } = await supabase
      .from('business_settings')
      .select('name,address,phone,email,cancellation_policy')
      .eq('id', body.business_id)
      .single()

    const businessName  = biz?.name                ?? 'Business'
    const businessAddr  = biz?.address             ?? ''
    const businessPhone = biz?.phone               ?? ''
    const businessEmail = biz?.email               ?? ''
    const cancelPolicy  = biz?.cancellation_policy ?? ''

    const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow-three.vercel.app'
    const fromDomain = process.env.RESEND_FROM_DOMAIN  ?? 'kolab.lv'
    const fromEmail  = `noreply@${fromDomain}`
    const adminEmail = businessEmail

    const cancelToken = generateCancelToken(booking.id)
    const cancelUrl   = `${appUrl}/api/cancel?id=${booking.id}&token=${cancelToken}`

    if (!adminEmail) {
      console.warn('No business email found for business_id:', body.business_id)
    }

    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from:    `BookFlow <${fromEmail}>`,
        to:      body.customer_email,
        subject: `Booking confirmed \u2014 ${body.service_name} on ${body.date}`,
        html: customerEmailHtml({
          businessName,
          businessAddress:    businessAddr,
          businessPhone,
          businessEmail,
          customerName:       body.customer_name,
          serviceName:        body.service_name,
          staffName:          body.staff_name,
          date:               body.date,
          time:               body.time,
          duration:           body.service_duration,
          price:              body.service_price,
          ref:                booking.ref,
          cancellationPolicy: cancelPolicy,
          cancelUrl,
        }),
      }),
      ...(adminEmail ? [resend.emails.send({
        from:    `BookFlow <${fromEmail}>`,
        to:      adminEmail,
        subject: `New booking: ${body.customer_name} \u2014 ${body.service_name} on ${body.date}`,
        html: adminEmailHtml({
          businessName,
          customerName:  body.customer_name,
          customerEmail: body.customer_email,
          customerPhone: body.customer_phone,
          customerNotes: body.customer_notes,
          serviceName:   body.service_name,
          staffName:     body.staff_name,
          date:          body.date,
          time:          body.time,
          duration:      body.service_duration,
          price:         body.service_price,
          ref:           booking.ref,
        }),
      })] : []),
    ])

    const emailsSent = emailResults.every(r => r.status === 'fulfilled')
    emailResults.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`Email ${i} failed:`, r.reason)
    })

    return NextResponse.json({ booking, emailsSent })
  } catch (err) {
    console.error('POST /api/book error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
