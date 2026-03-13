import type { BusinessSettings } from '@/data/mock'
import { businessSettings as mockSettings } from '@/data/mock'

const KEY = 'bf_settings'

export function loadSettings(): BusinessSettings {
  if (typeof window === 'undefined') return mockSettings
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as BusinessSettings
    // First run — seed from mock
    localStorage.setItem(KEY, JSON.stringify(mockSettings))
    return mockSettings
  } catch {
    return mockSettings
  }
}

export function saveSettings(settings: BusinessSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(settings))
}
