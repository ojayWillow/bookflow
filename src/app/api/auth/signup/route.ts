import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, businessName, slug } = await request.json()

  if (!email || !password || !businessName || !slug) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  // Slug validation
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug must be 3-40 lowercase letters, numbers or hyphens' },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,   // service role — bypasses RLS for signup
    {
      cookies: {
        getAll()                { return cookieStore.getAll() },
        setAll(cookiesToSet)    {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
          catch { /* ignored in route handler */ }
        },
      },
    }
  )

  // 1. Check slug is not already taken
  const { data: existing } = await supabase
    .from('business_settings')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'That slug is already taken — try a different one' }, { status: 409 })
  }

  // 2. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,   // auto-confirm for now (add email verification later)
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create account' }, { status: 400 })
  }

  const userId = authData.user.id

  // 3. Seed business_settings row
  const { error: bizError } = await supabase.from('business_settings').insert({
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
    // Roll back: delete the auth user so we don't leave orphans
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: bizError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
