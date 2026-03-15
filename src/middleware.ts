import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { locales, defaultLocale, type Locale } from '@/i18n/index'

// Paths that are never locale-prefixed
const BYPASS = [
  '/admin',
  '/api',
  '/auth',
  '/book',          // booking pages belong to the business, not a locale
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/privacy',
  '/terms',
  '/_next',
  '/favicon',
]

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') ?? ''
  // Accept-Language can be e.g. "ru-RU,ru;q=0.9,lv;q=0.8,en;q=0.7"
  const preferred = header
    .split(',')
    .map(part => part.split(';')[0].trim().slice(0, 2).toLowerCase())
  for (const lang of preferred) {
    if ((locales as readonly string[]).includes(lang)) return lang as Locale
  }
  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Let Supabase handle /admin session refresh
  if (pathname.startsWith('/admin')) {
    return await updateSession(request)
  }

  // 2. Skip non-locale paths
  if (BYPASS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 3. Skip static files
  if (/\.(.+)$/.test(pathname)) {
    return NextResponse.next()
  }

  // 4. Already has a valid locale prefix — let it through
  const firstSegment = pathname.split('/')[1]
  if ((locales as readonly string[]).includes(firstSegment)) {
    return NextResponse.next()
  }

  // 5. Redirect to locale-prefixed path
  const locale  = detectLocale(request)
  const newPath = `/${locale}${pathname === '/' ? '' : pathname}`
  const url     = request.nextUrl.clone()
  url.pathname  = newPath
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image
     * - favicon.ico, robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
