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
    // Persist choice in cookie so middleware respects it on next visit
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    // Swap the locale segment in the current path
    const segments  = pathname.split('/')
    segments[1]     = next
    router.push(segments.join('/'))
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
