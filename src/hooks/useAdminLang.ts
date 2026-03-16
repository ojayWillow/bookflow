/**
 * useAdminLang — reads from AdminLangContext.
 * The single lang state lives in AdminLangProvider (admin layout).
 * Changing language instantly re-renders every component in the tree.
 */
'use client'
import { useAdminLangContext } from '@/context/AdminLangContext'

export function useAdminLang() {
  return useAdminLangContext()
}
