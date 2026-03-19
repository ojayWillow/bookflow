import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * GET /api/auth/check-email?email=xxx
 * Returns { taken: boolean }
 * Used by the signup form on step 1 to validate email before proceeding to step 2.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ taken: false })
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data } = await serviceClient.auth.admin.listUsers()
  const taken = data?.users?.some(
    u => u.email?.toLowerCase() === email.toLowerCase()
  ) ?? false

  return NextResponse.json({ taken })
}
