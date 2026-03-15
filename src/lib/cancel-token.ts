import { createHmac } from 'crypto'

const secret = process.env.CANCEL_TOKEN_SECRET

if (!secret) {
  throw new Error(
    'CANCEL_TOKEN_SECRET environment variable is not set. ' +
    'Add it to your .env.local and Vercel project settings.'
  )
}

export function generateCancelToken(bookingId: string): string {
  return createHmac('sha256', secret).update(bookingId).digest('hex')
}
