'use client'
import { useRouter, usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n/index'

const LABELS: Record<Locale, string> = { lv: 'LV', en: 'EN', ru: 'RU' }
const LOCALE_COOKIE = 'BOOKFLOW_LOCALE'

function getCurrentLocale(pathname: string): Locale {
  const seg = pathname.split('/')[1]
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : 'lv'
}

export default function LanguageSwitcher() {
  const router   = useRouter()
  const pathname = usePathname()
  const current  = getCurrentLocale(pathname)

  const switchTo = (next: Locale) => {
    if (next === current) return
    // Persist choice so middleware + booking wizard both respect it
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    // Fire custom event so BookingWizard (no locale segment) can re-load dict
    window.dispatchEvent(new CustomEvent('bookflow:locale-change'))
    // Swap locale segment in path (works for /lv/... and /book/... alike)
    const segments = pathname.split('/')
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = next
      router.push(segments.join('/'))
    } else {
      // No locale segment (e.g. /book/[slug]) — just fire cookie + event, no navigation
      // The wizard picks it up via the bookflow:locale-change event
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
