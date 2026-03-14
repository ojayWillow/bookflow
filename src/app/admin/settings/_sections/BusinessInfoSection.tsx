'use client'
import { Lock } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow.app'

interface Props {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  slug: string
  originalSlug: string
  slugStatus: 'idle' | 'checking' | 'available' | 'taken'
  onChange: (field: string, value: string) => void
  onSlugChange: (value: string) => void
}

export default function BusinessInfoSection({
  name, tagline, address, phone, email, slug, onChange
}: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-4">🏢 Business information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
            <input value={name} onChange={e => onChange('name', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Booking page URL
            </label>
            <div className="flex items-center border-2 border-gray-100 bg-gray-50 rounded-xl overflow-hidden">
              <span className="px-3 py-2.5 text-xs text-gray-400 border-r border-gray-100 whitespace-nowrap">/book/</span>
              <span className="flex-1 px-3 py-2.5 text-sm text-gray-500 font-mono truncate">{slug}</span>
              <div className="pr-3 text-gray-400" title="Your booking URL is permanent and cannot be changed">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 font-mono truncate">
              {BASE}/book/{slug}
            </p>
            <div className="flex items-start gap-1.5 mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <Lock className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>This URL is permanent</strong> and cannot be changed. Customers and QR codes depend on it.
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
          <input value={tagline} onChange={e => onChange('tagline', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <input value={address} onChange={e => onChange('address', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input value={phone} onChange={e => onChange('phone', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact email</label>
            <input value={email} onChange={e => onChange('email', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
          </div>
        </div>
      </div>
    </section>
  )
}
