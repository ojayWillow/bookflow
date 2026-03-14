import { createHmac } from 'crypto'

const SECRET = process.env.CANCEL_TOKEN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'fallback-secret'

export function generateCancelToken(bookingId: string): string {
  return createHmac('sha256', SECRET).update(bookingId).digest('hex')
}
