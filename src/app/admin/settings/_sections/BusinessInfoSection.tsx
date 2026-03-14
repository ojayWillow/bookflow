'use client'
import { Loader2, Check, X } from 'lucide-react'

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
  name, tagline, address, phone, email, slug, originalSlug, slugStatus, onChange, onSlugChange
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking page slug</label>
            <div>
              <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors focus-within:border-indigo-400 ${
                slugStatus === 'taken' ? 'border-red-300' : slugStatus === 'available' ? 'border-green-300' : 'border-gray-100'
              }`}>
                <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r border-gray-100 whitespace-nowrap">/book/</span>
                <input value={slug}
                  onChange={e => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent" />
                {slugStatus === 'checking'  && <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-3" />}
                {slugStatus === 'available' && <Check className="w-4 h-4 text-green-500 mr-3" />}
                {slugStatus === 'taken'     && <X className="w-4 h-4 text-red-500 mr-3" />}
              </div>
              {slugStatus === 'taken'     && <p className="text-xs text-red-500 mt-1">⚠ This slug is already taken</p>}
              {slugStatus === 'available' && <p className="text-xs text-green-600 mt-1">✓ Available</p>}
              {slug !== originalSlug && slugStatus !== 'taken' && (
                <p className="text-xs text-amber-600 mt-1">⚠ Changing your slug will break existing links and QR codes</p>
              )}
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
