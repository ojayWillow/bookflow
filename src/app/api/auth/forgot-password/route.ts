import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = await createClient()

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin}/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  // Always return 200 — don't leak whether the email exists in the system
  if (error) {
    console.error('[forgot-password]', error.message)
  }

  return NextResponse.json({ ok: true })
}
