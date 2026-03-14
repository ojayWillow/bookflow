import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

// This route handles email link confirmations using the token_hash flow.
// Unlike PKCE (exchangeCodeForSession), verifyOtp works cross-browser and
// cross-device — no cookie from the original session is required.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null
  const next       = searchParams.get('next') ?? '/admin'

  if (token_hash && type) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({ type, token_hash })

    if (!error) {
      // Recovery tokens go to /reset-password, everything else to /admin
      const destination = type === 'recovery' ? '/reset-password' : next
      return NextResponse.redirect(`${origin}${destination}`)
    }

    console.error('[auth/confirm] verifyOtp error:', error.message)
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=${encodeURIComponent('Confirmation link expired or already used. Please try again.')}`
  )
}
