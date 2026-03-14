'use client'
import { Globe, Instagram, Facebook } from 'lucide-react'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}

interface Props {
  websiteUrl: string
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  onChange: (field: string, value: string) => void
}

export default function OnlinePresenceSection({ websiteUrl, instagramUrl, facebookUrl, tiktokUrl, onChange }: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-1">🔗 Online presence</h2>
      <p className="text-sm text-gray-400 mb-5">These appear as icons on your booking page and confirmation screen</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input value={websiteUrl} onChange={e => onChange('website_url', e.target.value)}
            placeholder="https://yourwebsite.com"
            className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
        </div>
        <div className="flex items-center gap-3">
          <Instagram className="w-5 h-5 text-pink-400 flex-shrink-0" />
          <input value={instagramUrl} onChange={e => onChange('instagram_url', e.target.value)}
            placeholder="https://instagram.com/yourbusiness"
            className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
        </div>
        <div className="flex items-center gap-3">
          <Facebook className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <input value={facebookUrl} onChange={e => onChange('facebook_url', e.target.value)}
            placeholder="https://facebook.com/yourbusiness"
            className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
        </div>
        <div className="flex items-center gap-3">
          <TikTokIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <input value={tiktokUrl} onChange={e => onChange('tiktok_url', e.target.value)}
            placeholder="https://tiktok.com/@yourbusiness"
            className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
        </div>
      </div>
    </section>
  )
}
