'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import BrandingSection      from './_sections/BrandingSection'
import OnlinePresenceSection from './_sections/OnlinePresenceSection'
import ShareSection          from './_sections/ShareSection'
import BusinessInfoSection   from './_sections/BusinessInfoSection'
import ScheduleSection       from './_sections/ScheduleSection'
import BookingRulesSection   from './_sections/BookingRulesSection'

type Settings = {
  id: string; name: string; tagline: string; address: string
  phone: string; email: string; slug: string
  open_days: number[]; open_time: string; close_time: string
  slot_interval: number; lead_time_hours: number; max_advance_days: number
  cancellation_window_hours: number
  cancellation_policy: string; primary_color: string
  logo_url: string; cover_url: string
  instagram_url: string; facebook_url: string; tiktok_url: string; website_url: string
}

function isValidHex(v: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')
  const [hexInput, setHexInput] = useState('')
  const [slugStatus, setSlugStatus]     = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [originalSlug, setOriginalSlug] = useState('')
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(async res => { const j = await res.json(); if (!res.ok) throw new Error(j.error); return j })
      .then(data => {
        setSettings(data as Settings)
        setHexInput((data as Settings).primary_color)
        setOriginalSlug((data as Settings).slug)
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const checkSlug = useCallback((slug: string) => {
    if (slug === originalSlug) { setSlugStatus('idle'); return }
    if (slug.length < 2)       { setSlugStatus('idle'); return }
    setSlugStatus('checking')
    if (slugTimer.current) clearTimeout(slugTimer.current)
    slugTimer.current = setTimeout(async () => {
      const res  = await fetch(`/api/check-slug?slug=${encodeURIComponent(slug)}`)
      const json = await res.json()
      setSlugStatus(json.available ? 'available' : 'taken')
    }, 500)
  }, [originalSlug])

  const handleSave = async () => {
    if (!settings || slugStatus === 'taken') return
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
      setOriginalSlug(settings.slug)
      setSlugStatus('idle')
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const set = (field: string, value: unknown) =>
    setSettings(p => p ? { ...p, [field]: value } : p)

  const toggleDay = (day: number) => {
    if (!settings) return
    setSettings(prev => prev ? ({
      ...prev,
      open_days: prev.open_days.includes(day)
        ? prev.open_days.filter(d => d !== day)
        : [...prev.open_days, day].sort(),
    }) : prev)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading settings…
    </div>
  )
  if (!settings) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-5">
        <p className="font-semibold mb-1">⚠ Could not load settings</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )

  const bookingUrl    = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow.app'}/book/${settings.slug}`
  const iframeCode    = `<iframe src="${bookingUrl}" width="100%" height="700" frameborder="0" style="border-radius:16px"></iframe>`
  const whatsappPhone = settings.phone.replace(/[^0-9]/g, '')
  const whatsappLink  = `https://wa.me/${whatsappPhone}?text=Hi%2C+I'd+like+to+make+a+booking+at+${encodeURIComponent(settings.name)}`
  const qrUrl         = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your business, schedule and booking rules</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          ⚠ {error}
        </div>
      )}

      <div className="space-y-6">
        <BrandingSection
          settings={settings}
          hexInput={hexInput}
          onHexInput={v => { setHexInput(v); if (isValidHex(v)) set('primary_color', v) }}
          onColorChange={color => { set('primary_color', color); setHexInput(color) }}
          onLogoUploaded={url => set('logo_url', url)}
          onCoverUploaded={url => set('cover_url', url)}
        />

        <OnlinePresenceSection
          websiteUrl={settings.website_url}
          instagramUrl={settings.instagram_url}
          facebookUrl={settings.facebook_url}
          tiktokUrl={settings.tiktok_url}
          onChange={set}
        />

        <ShareSection
          bookingUrl={bookingUrl}
          iframeCode={iframeCode}
          whatsappLink={whatsappLink}
          qrUrl={qrUrl}
        />

        <BusinessInfoSection
          name={settings.name}
          tagline={settings.tagline}
          address={settings.address}
          phone={settings.phone}
          email={settings.email}
          slug={settings.slug}
          originalSlug={originalSlug}
          slugStatus={slugStatus}
          onChange={set}
          onSlugChange={v => { set('slug', v); checkSlug(v) }}
        />

        <ScheduleSection
          openDays={settings.open_days}
          openTime={settings.open_time}
          closeTime={settings.close_time}
          slotInterval={settings.slot_interval}
          onToggleDay={toggleDay}
          onChange={set}
        />

        <BookingRulesSection
          leadTimeHours={settings.lead_time_hours}
          maxAdvanceDays={settings.max_advance_days}
          cancellationWindowHours={settings.cancellation_window_hours ?? 24}
          cancellationPolicy={settings.cancellation_policy}
          onChange={set}
        />

        <button
          onClick={handleSave}
          disabled={saving || slugStatus === 'taken'}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saved ? '✓ Settings saved!' : slugStatus === 'taken' ? 'Fix slug to save' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}
