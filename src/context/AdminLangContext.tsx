'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminEn, adminLv, adminRu } from '@/i18n'
import type { AdminDict, Locale } from '@/i18n'

const STORAGE_KEY = 'admin_lang'

function getDict(lang: Locale): AdminDict {
  if (lang === 'en') return adminEn
  if (lang === 'ru') return adminRu
  return adminLv
}

interface AdminLangContextValue {
  lang: Locale
  setLang: (l: Locale) => void
  t: AdminDict
}

const AdminLangContext = createContext<AdminLangContextValue | null>(null)

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>('lv')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && ['lv', 'en', 'ru'].includes(stored)) setLangState(stored)
  }, [])

  const setLang = useCallback((l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLangState(l)
  }, [])

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t: getDict(lang) }}>
      {children}
    </AdminLangContext.Provider>
  )
}

export function useAdminLangContext() {
  const ctx = useContext(AdminLangContext)
  if (!ctx) throw new Error('useAdminLangContext must be used inside AdminLangProvider')
  return ctx
}
