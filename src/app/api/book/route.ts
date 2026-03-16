import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { generateCancelToken } from '@/lib/cancel-token'
import { randomBytes } from 'crypto'
import { customerEmailHtml, pendingCustomerEmailHtml, adminEmailHtml } from '@/lib/email-templates'

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

function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Returns true if the proposed slot overlaps any existing booking. */
function hasConflict(
  slotStart: number,
  duration: number,
  existing: { time: string; service_duration: number; staff_id: string | null }[],
  staffId: string | null
): boolean {
  const slotEnd = slotStart + duration
  return existing.some(b => {
    if (staffId !== null && b.staff_id !== null && b.staff_id !== staffId) return false
    const bStart = toMins(b.time)
    const bEnd   = bStart + b.service_duration
    return slotStart < bEnd && slotEnd > bStart
  })
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

    // ── Server-side double-booking check ─────────────────────────────────────
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('time, service_duration, staff_id')
      .eq('date', body.date)
      .eq('business_id', body.business_id)
      .neq('status', 'cancelled')

    if (existingBookings) {
      const slotStart = toMins(body.time)
      const conflict  = hasConflict(
        slotStart,
        body.service_duration,
        existingBookings as { time: string; service_duration: number; staff_id: string | null }[],
        body.staff_id ?? null
      )
      if (conflict) {
        return NextResponse.json(
          { error: 'This time slot is no longer available. Please choose another time.' },
          { status: 409 }
        )
      }
    }

    const ref = 'BF-' + randomBytes(4).toString('hex').toUpperCase()

    // ── Fetch business settings including approval mode ───────────────────────
    const { data: biz } = await supabase
      .from('business_settings')
      .select('name,address,phone,email,cancellation_policy,require_approval')
      .eq('id', body.business_id)
      .single()

    const isPending        = biz?.require_approval === true
    const bookingStatus    = isPending ? 'pending' : 'confirmed'
    const businessName     = biz?.name                ?? 'Business'
    const businessAddr     = biz?.address             ?? ''
    const businessPhone    = biz?.phone               ?? ''
    const businessEmail    = biz?.email               ?? ''
    const cancelPolicy     = biz?.cancellation_policy ?? ''

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
        status:           bookingStatus,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking insert error:', bookingError)
      return NextResponse.json({ error: bookingError.message }, { status: 500 })
    }

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
      // Customer email — pending or confirmed version
      resend.emails.send({
        from:    `BookFlow <${fromEmail}>`,
        to:      body.customer_email,
        subject: isPending
          ? `Booking request received \u2014 ${body.service_name} on ${body.date}`
          : `Booking confirmed \u2014 ${body.service_name} on ${body.date}`,
        html: isPending
          ? pendingCustomerEmailHtml({
              businessName,
              businessPhone,
              customerName:  body.customer_name,
              serviceName:   body.service_name,
              staffName:     body.staff_name,
              date:          body.date,
              time:          body.time,
              duration:      body.service_duration,
              price:         body.service_price,
              ref:           booking.ref,
            })
          : customerEmailHtml({
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
      // Admin notification email
      ...(adminEmail ? [resend.emails.send({
        from:    `BookFlow <${fromEmail}>`,
        to:      adminEmail,
        subject: isPending
          ? `Booking REQUEST: ${body.customer_name} \u2014 ${body.service_name} on ${body.date}`
          : `New booking: ${body.customer_name} \u2014 ${body.service_name} on ${body.date}`,
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
          isPending,
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
