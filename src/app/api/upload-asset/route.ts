import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // 1. Verify the user is logged in via their session cookie
  const supabaseAuth = await createServerClient()
  const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2. Parse the multipart form data
  const formData = await req.formData()
  const file  = formData.get('file') as File | null
  const field = formData.get('field') as string | null
  if (!file || !field) {
    return NextResponse.json({ error: 'Missing file or field' }, { status: 400 })
  }

  // 3. Validate
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP or GIF allowed' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5 MB' }, { status: 400 })
  }

  // 4. Upload using SERVICE ROLE KEY — bypasses all RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `${user.id}/${field.replace('_url', '')}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadErr } = await supabaseAdmin.storage
    .from('business-assets')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 })
  }

  // 5. Get the public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('business-assets')
    .getPublicUrl(path)

  const url = `${publicUrl}?t=${Date.now()}`

  // 6. Save URL to business_settings
  const { error: updateErr } = await supabaseAuth
    .from('business_settings')
    .update({ [field]: url })
    .eq('user_id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ url })
}
