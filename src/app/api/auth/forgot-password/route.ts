import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // redirectTo must point to /auth/callback so the PKCE code can be
  // exchanged server-side before the user lands on /reset-password.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  const redirectTo = `${baseUrl}/auth/callback?type=recovery`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    console.error('[forgot-password]', error.message)
  }

  return NextResponse.json({ ok: true })
}
