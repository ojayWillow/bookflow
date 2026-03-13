import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

// Service role client — bypasses RLS for the DB update only
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase service role env vars')
  return createServiceClient(url, key, {
    auth: { persistSession: false },
  })
}

export async function POST(request: NextRequest) {
  // 1. Auth check via user session
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2. Parse multipart form
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Could not parse form data — file may be too large' }, { status: 413 })
  }

  const file  = formData.get('file')  as File | null
  const field = formData.get('field') as string | null

  if (!file || !field) {
    return NextResponse.json({ error: 'Missing file or field' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP or GIF allowed' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File must be under 5 MB' }, { status: 400 })
  }
  if (!['logo_url', 'cover_url'].includes(field)) {
    return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
  }

  // 3. Upload to Supabase Storage
  const ext    = file.name.split('.').pop() ?? 'jpg'
  const path   = `${user.id}/${field.replace('_url', '')}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('business-assets')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // 4. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('business-assets')
    .getPublicUrl(path)

  const urlWithBust = `${publicUrl}?t=${Date.now()}`

  // 5. Save URL back to business_settings via service role (bypasses RLS)
  const admin = getServiceClient()
  const { error: updateError } = await admin
    .from('business_settings')
    .update({ [field]: urlWithBust })
    .eq('user_id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ url: urlWithBust })
}
