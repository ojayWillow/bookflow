import { Resend } from 'resend'

const key = process.env.RESEND_API_KEY

/**
 * Shared Resend client for all API routes.
 *
 * `new Resend(undefined)` throws at module load, which would crash every
 * route that imports it (book/cancel/approve/decline/complete) when
 * RESEND_API_KEY is not configured. Instead we export a no-op stub in that
 * case — bookings keep working and emails are skipped with a warning.
 */
export const resend: Resend = key
  ? new Resend(key)
  : ({
      emails: {
        send: async () => {
          console.warn('RESEND_API_KEY not set — email skipped')
          return {
            data: null,
            error: { message: 'RESEND_API_KEY not set', name: 'missing_api_key' },
          }
        },
      },
    } as unknown as Resend)
