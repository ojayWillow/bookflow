'use client'
import { Lock, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useAdminLang } from '@/hooks/useAdminLang'

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
  const { t } = useAdminLang()
  const [copied, setCopied] = useState(false)
  const bookingUrl = `${BASE}/book/${slug}`

  function copyUrl() {
    navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-4">🏢 {t.settings.businessInfo}</h2>

      <div className="space-y-3">

        {/* Business name + tagline: stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-end h-9 mb-1.5">
              <label className="text-sm font-medium text-gray-700">{t.settings.businessName}</label>
            </div>
            <input
              value={name}
              onChange={e => onChange('name', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <div className="h-9 mb-1.5">
              <label className="block text-sm font-medium text-gray-700 leading-tight">{t.settings.shortDesc}</label>
              <span className="text-xs text-gray-400 leading-tight">{t.settings.shortDescHint}</span>
            </div>
            <input
              value={tagline}
              onChange={e => onChange('tagline', e.target.value)}
              placeholder="e.g. Hair salon in Riga"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.address}</label>
          <input
            value={address}
            onChange={e => onChange('address', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Phone + email: stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.phone}</label>
            <input
              value={phone}
              onChange={e => onChange('phone', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.settings.contactEmail}</label>
            <input
              value={email}
              onChange={e => onChange('email', e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5">
          <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span className="text-xs text-gray-400 shrink-0">{t.settings.bookingLink}</span>
          <span className="flex-1 text-xs font-mono text-gray-500 truncate">{bookingUrl}</span>
          <button
            type="button"
            onClick={copyUrl}
            className="shrink-0 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            {copied
              ? <><Check className="w-3.5 h-3.5" /> {t.settings.copied}</>
              : <><Copy className="w-3.5 h-3.5" /> {t.settings.copy}</>
            }
          </button>
        </div>

      </div>
    </section>
  )
}
