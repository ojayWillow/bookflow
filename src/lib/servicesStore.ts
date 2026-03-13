import type { Service } from '@/data/mock'
import { services as mockServices } from '@/data/mock'

const KEY = 'bf_services'

export function loadServices(): Service[] {
  if (typeof window === 'undefined') return mockServices
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Service[]
    // First run — seed from mock
    localStorage.setItem(KEY, JSON.stringify(mockServices))
    return mockServices
  } catch {
    return mockServices
  }
}

export function saveServices(services: Service[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(services))
}
