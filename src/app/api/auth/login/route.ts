import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ─── In-process rate limiter ────────────────────────────────────────────────
const MAX_ATTEMPTS = 5
const WINDOW_MS    = 15 * 60 * 1000

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function getIP(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd ? fwd.split(',')[0] : 'unknown').trim()
}

function checkRateLimit(ip: string): { allowed: boolean; remainingMs: number; attemptsLeft: number } {
  const now    = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remainingMs: 0, attemptsLeft: MAX_ATTEMPTS - 1 }
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingMs: bucket.resetAt - now, attemptsLeft: 0 }
  }

  bucket.count += 1
  return { allowed: true, remainingMs: 0, attemptsLeft: MAX_ATTEMPTS - bucket.count }
}

function clearBucket(ip: string) {
  buckets.delete(ip)
}
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const ip = getIP(request)
  const rl = checkRateLimit(ip)

  if (!rl.allowed) {
    const minutes = Math.ceil(rl.remainingMs / 60000)
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`, locked: true, remainingMs: rl.remainingMs },
      { status: 429 }
    )
  }

  const { email, password } = await request.json()
  const cookieStore = await cookies()

  const cookiesToForward: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookiesToForward.push({ name, value, options })
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json(
      { error: 'Invalid email or password.', attemptsLeft: rl.attemptsLeft },
      { status: 401 }
    )
  }

  clearBucket(ip)

  const response = NextResponse.json({ success: true })
  cookiesToForward.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  })
  return response
}
