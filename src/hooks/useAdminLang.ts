/**
 * useAdminLang — admin panel language hook
 *
 * Stores the chosen locale in localStorage under 'admin_lang'.
 * Defaults to 'lv'. Returns the full translation dict as `t`.
 */
'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminEn, adminLv, adminRu } from '@/i18n'
import type { AdminDict } from '@/i18n'
import type { Locale } from '@/i18n'

const STORAGE_KEY = 'admin_lang'

function getDict(lang: Locale): AdminDict {
  if (lang === 'en') return adminEn
  if (lang === 'ru') return adminRu
  return adminLv
}

export function useAdminLang() {
  const [lang, setLangState] = useState<Locale>('lv')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && ['lv', 'en', 'ru'].includes(stored)) setLangState(stored)
  }, [])

  const setLang = useCallback((l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLangState(l)
  }, [])

  return { lang, setLang, t: getDict(lang) }
}
