/**
 * i18n entry point — exports locale dictionaries and helper types.
 *
 * Public pages: use getDictionary(locale) in Server Components,
 * or pass the dict down as a prop to Client Components.
 *
 * Admin panel: use useAdminLang() hook (localStorage-based).
 */
import type { PublicDict } from './en'

export type Locale = 'lv' | 'en' | 'ru'
export const locales: Locale[]  = ['lv', 'en', 'ru']
export const defaultLocale: Locale = 'lv'

// Dynamically imported so each locale bundle is code-split
export async function getDictionary(locale: Locale): Promise<PublicDict> {
  switch (locale) {
    case 'en': return (await import('./en')).default
    case 'ru': return (await import('./ru')).default
    default:   return (await import('./lv')).default
  }
}

// Admin dictionaries are imported statically (small, always needed)
export { default as adminEn } from './admin/en'
export { default as adminLv } from './admin/lv'
export { default as adminRu } from './admin/ru'
export type { AdminDict } from './admin/en'
