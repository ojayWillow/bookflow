import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

/** Bare service-role client — bypasses RLS, never exposed to the browser */
function makeServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** Bare anon client — used only for auth.signUp which triggers the confirmation email */
function makeAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  const { email, password, businessName, slug } = await request.json()

  if (!email || !password || !businessName || !slug) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug must be 3–40 lowercase letters, numbers or hyphens' },
      { status: 400 }
    )
  }

  const serviceClient = makeServiceClient()

  // ── 1. Check slug availability ───────────────────────────────────────────────
  const { data: existing } = await serviceClient
    .from('business_settings')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'That slug is already taken — try a different one' },
      { status: 409 }
    )
  }

  // ── 2. Register user via anon client — triggers confirmation email via Resend ─
  const { data: authData, error: authError } = await makeAnonClient().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin`,
    },
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? 'Failed to create account' },
      { status: 400 }
    )
  }

  const userId = authData.user.id

  // ── 3. Insert business_settings with service role (bypasses RLS) ────────────
  const { error: bizError } = await serviceClient.from('business_settings').insert({
    user_id:             userId,
    name:                businessName,
    slug,
    tagline:             '',
    address:             '',
    phone:               '',
    email:               email,
    open_days:           [1, 2, 3, 4, 5],
    open_time:           '09:00',
    close_time:          '18:00',
    slot_interval:       30,
    lead_time_hours:     2,
    max_advance_days:    30,
    cancellation_policy: 'Please cancel at least 24 hours in advance.',
    primary_color:       '#6366f1',
  })

  if (bizError) {
    // Roll back: remove the orphaned auth user so they can retry cleanly
    await serviceClient.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: bizError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, confirm_email: true })
}
