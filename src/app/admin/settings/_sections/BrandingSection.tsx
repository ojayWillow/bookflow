'use client'
import { Palette, Globe, Instagram, Facebook } from 'lucide-react'
import ImageUpload from '../ImageUpload'

const BRAND_COLORS = [
  { label: 'Indigo',  value: '#6366f1' },
  { label: 'Violet',  value: '#7c3aed' },
  { label: 'Rose',    value: '#f43f5e' },
  { label: 'Amber',   value: '#f59e0b' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Cyan',    value: '#06b6d4' },
  { label: 'Slate',   value: '#475569' },
  { label: 'Black',   value: '#111827' },
]

function isValidHex(v: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}

type Settings = {
  primary_color: string
  logo_url: string
  name: string
  tagline: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  website_url: string
}

interface Props {
  settings: Settings
  hexInput: string
  onHexInput: (v: string) => void
  onColorChange: (color: string) => void
  onLogoUploaded: (url: string) => void
}

export default function BrandingSection({
  settings, hexInput, onHexInput, onColorChange, onLogoUploaded
}: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <Palette className="w-4 h-4 text-indigo-500" />
        <h2 className="font-semibold text-gray-900">Branding</h2>
      </div>
      <p className="text-sm text-gray-400 mb-5">Customise how your booking page looks to customers</p>

      <div className="space-y-6">

        {/* Logo upload */}
        <ImageUpload
          label="Logo" hint="Square image shown in the booking page header"
          field="logo_url" currentUrl={settings.logo_url}
          onUploaded={onLogoUploaded}
        />

        {/* Brand colour */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Brand colour</label>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {BRAND_COLORS.map(c => (
              <button key={c.value} type="button" title={c.label} onClick={() => onColorChange(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-9 h-9 rounded-xl transition-all ${
                  settings.primary_color === c.value
                    ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`} />
            ))}
            <label title="Custom colour"
              className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors overflow-hidden relative">
              <span className="text-gray-400 text-lg leading-none select-none">+</span>
              <input type="color" value={settings.primary_color} onChange={e => onColorChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 rounded-xl overflow-hidden transition-colors focus-within:border-indigo-400"
              style={{ borderColor: isValidHex(hexInput) ? settings.primary_color : '#e5e7eb' }}>
              <div className="w-8 h-9 flex-shrink-0" style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#e5e7eb' }} />
              <input value={hexInput} onChange={e => onHexInput(e.target.value)} maxLength={7} placeholder="#6366f1"
                className="px-3 py-2 text-sm font-mono w-28 focus:outline-none" />
            </div>
            {!isValidHex(hexInput) && hexInput.length > 0 && (
              <p className="text-xs text-red-500">Invalid hex</p>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Live preview</label>
          <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">

            {/* Header bar */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {settings.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: settings.primary_color }}>
                    {settings.name[0]}
                  </div>
                )}
                <div>
                  <p className="text-gray-900 font-bold text-xs leading-tight">{settings.name}</p>
                  {settings.tagline && <p className="text-gray-400 text-[10px] leading-tight">{settings.tagline}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {settings.website_url   && <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Globe className="w-3 h-3 text-gray-400" /></div>}
                {settings.instagram_url && <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Instagram className="w-3 h-3 text-gray-400" /></div>}
                {settings.facebook_url  && <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Facebook className="w-3 h-3 text-gray-400" /></div>}
                {settings.tiktok_url    && <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><TikTokIcon className="w-3 h-3 text-gray-400" /></div>}
                <div className="ml-1 flex gap-0.5">
                  {['LV','EN','RU'].map(l => (
                    <div key={l} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-500">{l}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="bg-gray-50 px-4 py-4 space-y-2.5">
              <div className="bg-white rounded-xl border-2 border-gray-100 p-3 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-2.5 w-28 bg-gray-200 rounded-full" />
                  <div className="h-2 w-20 bg-gray-100 rounded-full" />
                </div>
                <p className="text-base font-bold" style={{ color: settings.primary_color }}>€35</p>
              </div>
              <div className="bg-white rounded-xl border-2 border-gray-100 p-3 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
                  <div className="h-2 w-16 bg-gray-100 rounded-full" />
                </div>
                <p className="text-base font-bold" style={{ color: settings.primary_color }}>€55</p>
              </div>
              <button className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: settings.primary_color }}>
                Confirm booking ✓
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
