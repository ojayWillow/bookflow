import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { getCategoryById, getServiceName, getServiceDescription } from '@/lib/service-templates'

function makeServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function makeAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, businessName, slug, businessCategory, locale } =
    await request.json()

  const seedLocale: string = locale === 'lv' ? 'lv' : 'en'

  if (!email || !password || !firstName || !lastName || !businessName || !slug) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return NextResponse.json(
      { error: 'Booking URL must be 3-40 lowercase letters, numbers or hyphens' },
      { status: 400 }
    )
  }

  const serviceClient = makeServiceClient()

  // Check email uniqueness using the admin API before attempting signUp.
  // Supabase signUp does NOT error on duplicate email — it returns a fake user
  // with an empty identities array, which then causes FK violations downstream.
  const { data: existingUsers } = await serviceClient.auth.admin.listUsers()
  const emailTaken = existingUsers?.users?.some(
    u => u.email?.toLowerCase() === email.toLowerCase()
  )
  if (emailTaken) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Please sign in instead.' },
      { status: 409 }
    )
  }

  // Check slug uniqueness
  const { data: existingSlug } = await serviceClient
    .from('business_settings')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existingSlug) {
    return NextResponse.json(
      { error: 'That booking URL is already taken — try a different one' },
      { status: 409 }
    )
  }

  // Create auth user
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const { data: authData, error: authError } = await makeAnonClient().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=/admin`,
      data: {
        first_name:   firstName,
        last_name:    lastName,
        display_name: `${firstName} ${lastName}`,
      },
    },
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? 'Failed to create account' },
      { status: 400 }
    )
  }

  // Extra safety: Supabase may still return a fake user with empty identities
  // if the email was registered after our check above (race condition).
  if (!authData.user.identities || authData.user.identities.length === 0) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Please sign in instead.' },
      { status: 409 }
    )
  }

  const userId = authData.user.id

  // Insert business_settings
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
    await serviceClient.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: bizError.message }, { status: 500 })
  }

  // Seed services from template in the user's signup locale
  if (businessCategory && businessCategory !== 'skip') {
    const category = getCategoryById(businessCategory)
    if (category && category.services.length > 0) {
      const rows = category.services.map(s => ({
        user_id:     userId,
        name:        getServiceName(s, seedLocale),
        description: getServiceDescription(s, seedLocale),
        duration:    s.duration,
        price:       s.price,
        currency:    'EUR',
      }))
      await serviceClient.from('services').insert(rows)
    }
  }

  return NextResponse.json({ ok: true, confirm_email: true })
}
