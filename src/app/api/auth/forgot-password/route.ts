import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // redirectTo points to /auth/confirm which uses verifyOtp (token_hash flow).
  // This works cross-browser/cross-device unlike PKCE which requires the same
  // browser session that initiated the request.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  const redirectTo = `${baseUrl}/auth/confirm`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    console.error('[forgot-password]', error.message)
  }

  return NextResponse.json({ ok: true })
}
