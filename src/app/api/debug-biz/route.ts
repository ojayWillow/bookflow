import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ error: 'Missing businessId' }, { status: 400 })

  const supabase = adminClient()
  const { data: biz, error } = await supabase
    .from('business_settings')
    .select('id,slot_interval,open_time,close_time')
    .eq('id', businessId)
    .single()

  if (error || !biz) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    raw_slot_interval: biz.slot_interval,
    typeof_slot_interval: typeof biz.slot_interval,
    Number_cast: Number(biz.slot_interval),
    full_row: biz,
  })
}
