'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n/index'

const LABELS: Record<Locale, string> = { lv: 'LV', en: 'EN', ru: 'RU' }
const LOCALE_COOKIE = 'BOOKFLOW_LOCALE'

function readCookie(): Locale {
  if (typeof document === 'undefined') return 'lv'
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`))
  const val = match?.[1]?.toLowerCase()
  if (val && (locales as readonly string[]).includes(val)) return val as Locale
  // Fall back to URL segment
  const seg = window.location.pathname.split('/')[1]
  if ((locales as readonly string[]).includes(seg as Locale)) return seg as Locale
  return 'lv'
}

export default function LanguageSwitcher() {
  const router   = useRouter()
  const pathname = usePathname()
  const [current, setCurrent] = useState<Locale>('lv')

  // Read cookie on mount so the active pill is always correct
  useEffect(() => {
    setCurrent(readCookie())
  }, [])

  const switchTo = (next: Locale) => {
    if (next === current) return

    // 1. Write cookie
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

    // 2. Update local state so the pill moves immediately
    setCurrent(next)

    // 3. Notify BookingWizard (no locale segment in path)
    window.dispatchEvent(new CustomEvent('bookflow:locale-change'))

    // 4. Navigate only on locale-prefixed routes (e.g. /lv/... /en/...)
    const segments = pathname.split('/')
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = next
      router.push(segments.join('/'))
    }
  }

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
      {locales.map(locale => (
        <button
          key={locale}
          onClick={() => switchTo(locale)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            locale === current
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          {LABELS[locale]}
        </button>
      ))}
    </div>
  )
}
