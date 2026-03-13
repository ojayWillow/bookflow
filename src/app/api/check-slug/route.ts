import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug || slug.length < 2) {
    return NextResponse.json({ available: false, reason: 'Too short' })
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ available: false, reason: 'Invalid characters' })
  }

  // Check if any OTHER business already uses this slug
  const { data, error } = await supabase
    .from('business_settings')
    .select('user_id')
    .eq('slug', slug)
    .neq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ available: !data })
}
