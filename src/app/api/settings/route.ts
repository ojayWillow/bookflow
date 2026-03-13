import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// GET /api/settings — returns the current user's business_settings row
export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // PGRST116 = no rows found — account exists but settings row is missing
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'No settings found for this account. Please contact support.' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// PATCH /api/settings — updates the current user's business_settings row
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()

  // Prevent escalation — always scope update to the authenticated user
  const { id: _id, user_id: _uid, ...safeFields } = body

  const { error } = await supabase
    .from('business_settings')
    .update(safeFields)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
