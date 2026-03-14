import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHmac } from 'crypto'

const SECRET = process.env.CANCEL_TOKEN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'fallback-secret'

export function generateCancelToken(bookingId: string): string {
  return createHmac('sha256', SECRET).update(bookingId).digest('hex')
}

function verifyCancelToken(bookingId: string, token: string): boolean {
  const expected = generateCancelToken(bookingId)
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}

const html = (title: string, message: string, isError = false) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px">
    <div style="background:#fff;border-radius:16px;padding:40px;max-width:420px;width:100%;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
      <div style="width:64px;height:64px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;background:${isError ? '#fee2e2' : '#dcfce7'}">
        <span style="font-size:28px">${isError ? '⚠️' : '✓'}</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">${title}</h1>
      <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.6">${message}</p>
    </div>
  </div>
</body>
</html>`

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id    = searchParams.get('id')
  const token = searchParams.get('token')

  if (!id || !token) {
    return new NextResponse(
      html('Invalid link', 'This cancellation link is missing required information.', true),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (!verifyCancelToken(id, token)) {
    return new NextResponse(
      html('Invalid link', 'This cancellation link is invalid or has been tampered with.', true),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const supabase = await createClient()

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, status, service_name, date, time, customer_name')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return new NextResponse(
      html('Booking not found', 'We could not find this booking. It may have already been removed.', true),
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (booking.status === 'cancelled') {
    return new NextResponse(
      html('Already cancelled', `Your booking for ${booking.service_name} on ${booking.date} at ${booking.time} was already cancelled.`),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (booking.status === 'completed') {
    return new NextResponse(
      html('Booking completed', 'This appointment has already been completed and cannot be cancelled.', true),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (updateError) {
    return new NextResponse(
      html('Something went wrong', 'We could not cancel your booking right now. Please contact us directly.', true),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(
    html(
      'Booking cancelled',
      `Your ${booking.service_name} appointment on ${booking.date} at ${booking.time} has been successfully cancelled. We hope to see you again soon.`
    ),
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}
