import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { locales, defaultLocale, type Locale } from '@/i18n/index'

const BYPASS = [
  '/admin', '/api', '/auth', '/book',
  '/forgot-password', '/reset-password', '/verify-email',
  '/privacy', '/terms', '/_next', '/favicon',
]

const LOCALE_COOKIE = 'BOOKFLOW_LOCALE'

function detectLocale(request: NextRequest): Locale {
  // 1. Respect explicit user cookie preference
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value?.toLowerCase()
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie as Locale

  // 2. Fall back to Accept-Language
  const header = request.headers.get('accept-language') ?? ''
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

  if (pathname.startsWith('/admin')) {
    return await updateSession(request)
  }

  if (BYPASS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (/\.(.+)$/.test(pathname)) {
    return NextResponse.next()
  }

  const firstSegment = pathname.split('/')[1]
  if ((locales as readonly string[]).includes(firstSegment)) {
    return NextResponse.next()
  }

  const locale  = detectLocale(request)
  const newPath = `/${locale}${pathname === '/' ? '' : pathname}`
  const url     = request.nextUrl.clone()
  url.pathname  = newPath
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
