import { createServerClient } from '@supabase/ssr'
import { createClient }       from '@supabase/supabase-js'
import { cookies }            from 'next/headers'
import { NextResponse }       from 'next/server'
import { getCategoryById }    from '@/lib/service-templates'

function makeServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: Request) {
  const cookieStore = await cookies()

  // Resolve the authenticated user from the session cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()                { return cookieStore.getAll() },
        setAll(cookiesToSet)    { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { category } = await request.json()
  if (!category || category === 'skip') {
    return NextResponse.json({ error: 'No category provided' }, { status: 400 })
  }

  const cat = getCategoryById(category)
  if (!cat) {
    return NextResponse.json({ error: 'Unknown category' }, { status: 400 })
  }

  const rows = cat.services.map(s => ({
    user_id:     user.id,
    name:        s.name,
    description: s.description,
    duration:    s.duration,
    price:       s.price,
    currency:    'EUR',
  }))

  const { error: insertError } = await makeServiceClient().from('services').insert(rows)
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, seeded: rows.length })
}
