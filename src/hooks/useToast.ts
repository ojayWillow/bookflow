'use client'
import { useState, useCallback } from 'react'
import type { ToastMessage, ToastVariant } from '@/app/admin/_components/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, variant }])
  }, [])

  const toast = Object.assign(
    (message: string) => add(message, 'info'),
    {
      success: (message: string) => add(message, 'success'),
      error:   (message: string) => add(message, 'error'),
    }
  )

  return { toasts, toast, dismiss }
}
