import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const formData = await request.formData()
  const file     = formData.get('file') as File | null
  const field    = formData.get('field') as string | null // 'logo_url' | 'cover_url'

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

  const ext      = file.name.split('.').pop() ?? 'jpg'
  const path     = `${user.id}/${field.replace('_url', '')}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('business-assets')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('business-assets')
    .getPublicUrl(path)

  // Bust the CDN cache by appending a timestamp
  const urlWithBust = `${publicUrl}?t=${Date.now()}`

  const { error: updateError } = await supabase
    .from('business_settings')
    .update({ [field]: urlWithBust })
    .eq('user_id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ url: urlWithBust })
}
