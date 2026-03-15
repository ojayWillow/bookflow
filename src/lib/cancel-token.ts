import { createHmac } from 'crypto'

const secret = process.env.CANCEL_TOKEN_SECRET

if (!secret) {
  throw new Error(
    'CANCEL_TOKEN_SECRET environment variable is not set. ' +
    'Add it to your .env.local and Vercel project settings.'
  )
}

// TypeScript cannot narrow a module-level const across function boundaries,
// so we assert the type here after the guard above has already thrown.
const resolvedSecret: string = secret

export function generateCancelToken(bookingId: string): string {
  return createHmac('sha256', resolvedSecret).update(bookingId).digest('hex')
}
