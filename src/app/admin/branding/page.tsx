'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import BrandingSection       from '../settings/_sections/BrandingSection'
import OnlinePresenceSection from '../settings/_sections/OnlinePresenceSection'

type Settings = {
  id: string; name: string; tagline: string; address: string
  phone: string; email: string; slug: string
  open_days: number[]; open_time: string; close_time: string
  slot_interval: number; lead_time_hours: number; max_advance_days: number
  cancellation_window_hours: number
  cancellation_policy: string; primary_color: string
  logo_url: string; require_approval: boolean
  instagram_url: string; facebook_url: string; tiktok_url: string; website_url: string
}

function isValidHex(v: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [dirty, setDirty]       = useState(false)
  const [error, setError]       = useState('')
  const [hexInput, setHexInput] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(async res => { const j = await res.json(); if (!res.ok) throw new Error(j.error); return j })
      .then(data => {
        setSettings(data as Settings)
        setHexInput((data as Settings).primary_color)
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true); setError('')
    try {
      const res  = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const set = (field: string, value: unknown) => {
    setSettings(p => p ? { ...p, [field]: value } : p)
    setDirty(true)
    setSaved(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
    </div>
  )
  if (!settings) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-5">
        <p className="font-semibold mb-1">⚠️ Could not load branding</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
        <p className="text-gray-400 mt-1">How your booking page looks and where you&apos;re found online</p>
      </div>

      {dirty && !saved && (
        <div className="mb-5 flex items-center justify-between gap-3 bg-orange-400 text-white text-sm font-medium rounded-xl px-4 py-3 shadow-md">
          <span>⚠️ Unsaved changes — don&apos;t forget to save!</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-white text-orange-500 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Save now
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6">
        <BrandingSection
          settings={settings}
          hexInput={hexInput}
          onHexInput={v => { setHexInput(v); if (isValidHex(v)) set('primary_color', v) }}
          onColorChange={color => { set('primary_color', color); setHexInput(color) }}
          onLogoUploaded={url => set('logo_url', url)}
        />

        <OnlinePresenceSection
          websiteUrl={settings.website_url}
          instagramUrl={settings.instagram_url}
          facebookUrl={settings.facebook_url}
          tiktokUrl={settings.tiktok_url}
          onChange={set}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saved ? '✓ Saved!' : 'Save branding'}
        </button>
      </div>
    </div>
  )
}
