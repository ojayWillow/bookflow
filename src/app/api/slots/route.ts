import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSlotsForDate, getUnionSlotsForDate } from '@/lib/slots'
import type { BookedSlotRaw, SlotStaffMember } from '@/lib/slots'

// Service-role client — bypasses RLS so we always get real booking data
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const businessId = searchParams.get('businessId')
  const date       = searchParams.get('date')
  const staffId    = searchParams.get('staffId') // uuid or 'any'
  const serviceId  = searchParams.get('serviceId')

  if (!businessId || !date || !staffId || !serviceId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const supabase = adminClient()

  // 1. Load business settings
  const { data: biz, error: bizErr } = await supabase
    .from('business_settings')
    .select('open_days,open_time,close_time,slot_interval,lead_time_hours,max_advance_days')
    .eq('id', businessId)
    .single()

  if (bizErr || !biz) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  // 2. Load the service duration
  const { data: service, error: svcErr } = await supabase
    .from('services')
    .select('duration')
    .eq('id', serviceId)
    .single()

  if (svcErr || !service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  // 3. Load ALL non-cancelled bookings for this date + business
  const { data: bookings, error: bookErr } = await supabase
    .from('bookings')
    .select('time, service_duration, staff_id')
    .eq('business_id', businessId)
    .eq('date', date)
    .neq('status', 'cancelled')

  if (bookErr) {
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 })
  }

  const booked = (bookings ?? []) as BookedSlotRaw[]

  // 4. If a specific staff member — load their schedule
  if (staffId !== 'any') {
    const { data: staffRow, error: staffErr } = await supabase
      .from('staff')
      .select('id,name,role,bio,service_ids,work_days,work_start,work_end,active,color')
      .eq('id', staffId)
      .single()

    if (staffErr || !staffRow) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    const staffMember: SlotStaffMember = {
      id:         staffRow.id,
      name:       staffRow.name,
      role:       staffRow.role,
      bio:        staffRow.bio,
      serviceIds: staffRow.service_ids,
      workDays:   staffRow.work_days,
      workStart:  staffRow.work_start,
      workEnd:    staffRow.work_end,
      active:     staffRow.active,
      color:      staffRow.color,
    }

    // Only this staff member's bookings + null-staff bookings
    const relevant = booked.filter(b => b.staff_id === staffId || b.staff_id === null)

    const slots = getSlotsForDate(date, service.duration, relevant, staffMember, biz)
    return NextResponse.json({ slots })
  }

  // 5. "Anyone" — load all active staff for this service
  const { data: staffRows, error: staffListErr } = await supabase
    .from('staff')
    .select('id,name,role,bio,service_ids,work_days,work_start,work_end,active,color')
    .eq('active', true)
    .contains('service_ids', [serviceId])

  if (staffListErr) {
    return NextResponse.json({ error: 'Failed to load staff' }, { status: 500 })
  }

  const staffList: SlotStaffMember[] = (staffRows ?? []).map(s => ({
    id:         s.id,
    name:       s.name,
    role:       s.role,
    bio:        s.bio,
    serviceIds: s.service_ids,
    workDays:   s.work_days,
    workStart:  s.work_start,
    workEnd:    s.work_end,
    active:     s.active,
    color:      s.color,
  }))

  const slots = getUnionSlotsForDate(date, service.duration, booked, staffList, biz)
  return NextResponse.json({ slots })
}
