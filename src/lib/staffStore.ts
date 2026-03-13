import type { StaffMember } from '@/data/mock'
import { staff as mockStaff } from '@/data/mock'

const KEY = 'bf_staff'

export function loadStaff(): StaffMember[] {
  if (typeof window === 'undefined') return mockStaff
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as StaffMember[]
    // First run — seed from mock
    localStorage.setItem(KEY, JSON.stringify(mockStaff))
    return mockStaff
  } catch {
    return mockStaff
  }
}

export function saveStaff(staff: StaffMember[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(staff))
}
