import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, businessName, slug } = await request.json()

  if (!email || !password || !businessName || !slug) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug must be 3-40 lowercase letters, numbers or hyphens' },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()

  // Service-role client — used for admin.createUser + DB writes (bypasses RLS)
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll()             { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
          catch { /* ignored */ }
        },
      },
    }
  )

  // 1. Check slug uniqueness
  const { data: existing } = await supabaseAdmin
    .from('business_settings')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'That slug is already taken — try a different one' }, { status: 409 })
  }

  // 2. Create auth user (admin SDK auto-confirms email)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create account' }, { status: 400 })
  }

  const userId = authData.user.id

  // 3. Seed business_settings row
  const { error: bizError } = await supabaseAdmin.from('business_settings').insert({
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
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: bizError.message }, { status: 500 })
  }

  // 4. AUTO-LOGIN — sign the user in immediately using anon key so session cookies are set
  //    We collect the cookies Supabase wants to set, then forward them on the response.
  const sessionCookies: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabaseAnon = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()             { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            sessionCookies.push({ name, value, options })
          })
        },
      },
    }
  )

  const { error: loginError } = await supabaseAnon.auth.signInWithPassword({ email, password })

  if (loginError) {
    // Account was created — just couldn't auto-login. Return ok so the UI can fall back gracefully.
    return NextResponse.json({ ok: true, autoLogin: false })
  }

  const response = NextResponse.json({ ok: true, autoLogin: true })

  // Forward all session cookies to the browser
  sessionCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  })

  return response
}
