'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import ScheduleSection     from '../settings/_sections/ScheduleSection'
import BookingRulesSection from '../settings/_sections/BookingRulesSection'

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

export default function SchedulePage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(async res => { const j = await res.json(); if (!res.ok) throw new Error(j.error); return j })
      .then(data => setSettings(data as Settings))
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
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
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
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
    </div>
  )
  if (!settings) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-5">
        <p className="font-semibold mb-1">⚠ Could not load schedule</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-400 mt-1">Set your working hours and booking rules</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          ⚠ {error}
        </div>
      )}

      <div className="space-y-6">
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
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saved ? '✓ Saved!' : 'Save schedule'}
        </button>
      </div>
    </div>
  )
}
