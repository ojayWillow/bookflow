import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { supabase: null, user: null }
  return { supabase, user }
}

// GET /api/staff — list all staff for the authenticated user
export async function GET() {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// POST /api/staff — create or update a staff member
export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { id, name, role, bio, service_ids, work_days, work_start, work_end, active, color } = body

  const { data, error } = await supabase
    .from('staff')
    .upsert({
      id, name, role, bio, service_ids, work_days,
      work_start, work_end, active, color,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/staff?id=<uuid> — delete a staff member
export async function DELETE(req: NextRequest) {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
