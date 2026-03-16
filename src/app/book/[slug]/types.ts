export type DBService = {
  id: string; name: string; description: string
  duration: number; price: number; currency: string
}

export type DBStaffMember = {
  id: string; name: string; role: string; bio: string
  service_ids: string[]; work_days: number[]
  work_start: string; work_end: string
  active: boolean; color: string
}

export type Business = {
  id: string; name: string; tagline: string; address: string
  phone: string; email: string; slug: string
  open_days: number[]; open_time: string; close_time: string
  slot_interval: number; lead_time_hours: number; max_advance_days: number
  cancellation_policy: string; primary_color: string
  // Branding
  logo_url:      string
  cover_url:     string
  // Social
  instagram_url: string
  facebook_url:  string
  tiktok_url:    string
  website_url:   string
}

export type Step = 'service' | 'staff' | 'datetime' | 'details' | 'confirm' | 'success'

export type BookingForm = {
  name: string; email: string; phone: string; notes: string
}
