// This route is no longer used for binary uploads.
// Images are now uploaded directly from the browser to Supabase Storage
// using a signed upload URL. This route remains as a no-op to avoid 404s
// from any cached references, but all upload logic lives in the ImageUpload
// component via the Supabase JS client.
export async function POST() {
  return new Response(JSON.stringify({ error: 'Use direct Supabase Storage upload instead' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  })
}
