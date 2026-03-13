import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const supabase = await createClient()

  // At this point the user has arrived via the magic link in their email.
  // Supabase sets their session from the URL hash (handled client-side in reset-password/page.tsx).
  // We then call updateUser to set the new password.
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
