'use client'
import { useState, useEffect } from 'react'
import { Loader2, Copy, Check, QrCode, Globe, MessageCircle, MapPin, ExternalLink, Code2, Palette } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INTERVALS = [15, 30, 45, 60]

const BRAND_COLORS = [
  { label: 'Indigo',    value: '#6366f1' },
  { label: 'Violet',    value: '#7c3aed' },
  { label: 'Rose',      value: '#f43f5e' },
  { label: 'Amber',     value: '#f59e0b' },
  { label: 'Emerald',   value: '#10b981' },
  { label: 'Cyan',      value: '#06b6d4' },
  { label: 'Slate',     value: '#475569' },
  { label: 'Black',     value: '#111827' },
]

type Settings = {
  id: string; name: string; tagline: string; address: string
  phone: string; email: string; slug: string
  open_days: number[]; open_time: string; close_time: string
  slot_interval: number; lead_time_hours: number; max_advance_days: number
  cancellation_policy: string; primary_color: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
        copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// Lightweight hex validator
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

  useEffect(() => {
    fetch('/api/settings')
      .then(async res => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load settings')
        return json
      })
      .then(data => {
        setSettings(data as Settings)
        setHexInput((data as Settings).primary_color)
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setError('')
    try {
      const res  = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(settings),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save settings')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const setColor = (color: string) => {
    setSettings(p => p ? ({ ...p, primary_color: color }) : p)
    setHexInput(color)
  }

  const handleHexInput = (v: string) => {
    setHexInput(v)
    if (isValidHex(v)) {
      setSettings(p => p ? ({ ...p, primary_color: v }) : p)
    }
  }

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
        <p className="text-sm">{error || 'Unknown error'}</p>
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
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">⚠ {error}</div>
      )}

      <div className="space-y-6">

        {/* ── BRANDING ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-indigo-500" />
            <h2 className="font-semibold text-gray-900">Branding</h2>
          </div>
          <p className="text-sm text-gray-400 mb-5">Customise how your booking page looks to customers</p>

          <div className="space-y-5">
            {/* Color picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Brand colour</label>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {BRAND_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-9 h-9 rounded-xl transition-all ${
                      settings.primary_color === c.value
                        ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
                {/* Native colour wheel */}
                <label
                  title="Custom colour"
                  className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors overflow-hidden relative"
                >
                  <span className="text-gray-400 text-lg leading-none select-none">+</span>
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={e => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Hex input */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 rounded-xl overflow-hidden transition-colors focus-within:border-indigo-400"
                  style={{ borderColor: isValidHex(hexInput) ? settings.primary_color : '#e5e7eb' }}>
                  <div className="w-8 h-9 flex-shrink-0" style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#e5e7eb' }} />
                  <input
                    value={hexInput}
                    onChange={e => handleHexInput(e.target.value)}
                    maxLength={7}
                    placeholder="#6366f1"
                    className="px-3 py-2 text-sm font-mono w-28 focus:outline-none"
                  />
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
                {/* Simulated booking page header */}
                <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: settings.primary_color }}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {settings.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{settings.name || 'Your Business'}</p>
                    <p className="text-white/70 text-xs leading-tight">{settings.tagline || 'Your tagline here'}</p>
                  </div>
                </div>

                {/* Simulated content area */}
                <div className="bg-gray-50 px-5 py-4 space-y-3">
                  <div className="bg-white rounded-xl border-2 border-gray-100 p-3.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-2.5 w-28 bg-gray-200 rounded-full" />
                      <div className="h-2 w-20 bg-gray-100 rounded-full" />
                    </div>
                    <p className="text-lg font-bold" style={{ color: settings.primary_color }}>€35</p>
                  </div>
                  <div className="bg-white rounded-xl border-2 border-gray-100 p-3.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
                      <div className="h-2 w-16 bg-gray-100 rounded-full" />
                    </div>
                    <p className="text-lg font-bold" style={{ color: settings.primary_color }}>€55</p>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    Confirm booking ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SHARE & DISTRIBUTE ────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-1">🔗 Share &amp; distribute</h2>
          <p className="text-sm text-gray-400 mb-5">Get your booking page in front of customers</p>
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Your booking link</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-600 truncate">{bookingUrl}</div>
                <CopyButton text={bookingUrl} />
                <a href={bookingUrl} target="_blank"
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">QR code</span>
                <span className="text-xs text-gray-400">— print on receipts, windows, business cards</span>
              </div>
              <div className="flex items-start gap-5">
                <div className="border-2 border-gray-100 rounded-2xl p-3 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="QR code" width={120} height={120} className="rounded-lg" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-gray-500 leading-relaxed">Customers scan this with their phone camera and go straight to your booking page.</p>
                  <a href={qrUrl} download="bookflow-qr.png"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    ⬇ Download QR PNG
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Embed on your website</span>
              </div>
              <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <code className="text-xs text-gray-600 leading-relaxed break-all flex-1 font-mono">{iframeCode}</code>
                  <div className="flex-shrink-0"><CopyButton text={iframeCode} /></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">WhatsApp Business</span>
              </div>
              <div className="bg-green-50 border-2 border-green-100 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Option A — Add booking link to your WhatsApp profile</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    In WhatsApp Business: <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Settings → Business profile → Website</span> → paste your booking link.
                  </p>
                </div>
                <div className="border-t border-green-100 pt-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Option B — Click-to-chat link</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs font-mono text-green-700 truncate">{whatsappLink}</div>
                    <CopyButton text={whatsappLink} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-gray-700">Google Business Profile</span>
              </div>
              <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 space-y-3">
                <ol className="text-xs text-gray-500 space-y-1.5 leading-relaxed">
                  <li><span className="font-semibold text-gray-700">1.</span> Go to <a href="https://business.google.com" target="_blank" className="text-indigo-600 underline">business.google.com</a> and sign in</li>
                  <li><span className="font-semibold text-gray-700">2.</span> Select your business → <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Edit profile → Contact</span></li>
                  <li><span className="font-semibold text-gray-700">3.</span> Under <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Booking</span>, paste your booking link</li>
                  <li><span className="font-semibold text-gray-700">4.</span> A “Book online” button appears on Maps within 24h</li>
                </ol>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-white border border-red-200 rounded-lg px-3 py-2 text-xs font-mono text-red-700 truncate">{bookingUrl}</div>
                  <CopyButton text={bookingUrl} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BUSINESS INFO ─────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-4">🏢 Business information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
                <input value={settings.name} onChange={e => setSettings(p => p ? ({ ...p, name: e.target.value }) : p)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking page slug</label>
                <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-indigo-400 transition-colors">
                  <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r border-gray-100 whitespace-nowrap">/book/</span>
                  <input value={settings.slug} onChange={e => setSettings(p => p ? ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }) : p)}
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
              <input value={settings.tagline} onChange={e => setSettings(p => p ? ({ ...p, tagline: e.target.value }) : p)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input value={settings.address} onChange={e => setSettings(p => p ? ({ ...p, address: e.target.value }) : p)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input value={settings.phone} onChange={e => setSettings(p => p ? ({ ...p, phone: e.target.value }) : p)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact email</label>
                <input value={settings.email} onChange={e => setSettings(p => p ? ({ ...p, email: e.target.value }) : p)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* ── SCHEDULE ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-4">📅 Schedule</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Open days</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day, i) => (
                  <button key={day} type="button" onClick={() => toggleDay(i)}
                    className={`w-12 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      settings.open_days.includes(i)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-100 text-gray-400 hover:border-indigo-300'
                    }`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Opening time</label>
                <input type="time" value={settings.open_time}
                  onChange={e => setSettings(p => p ? ({ ...p, open_time: e.target.value }) : p)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Closing time</label>
                <input type="time" value={settings.close_time}
                  onChange={e => setSettings(p => p ? ({ ...p, close_time: e.target.value }) : p)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking slot interval</label>
              <div className="flex gap-2">
                {INTERVALS.map(i => (
                  <button key={i} type="button"
                    onClick={() => setSettings(p => p ? ({ ...p, slot_interval: i }) : p)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      settings.slot_interval === i
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-100 text-gray-500 hover:border-indigo-300'
                    }`}>
                    {i} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BOOKING RULES ─────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-4">⚙️ Booking rules</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lead time (hours)</label>
              <input type="number"
                value={settings.lead_time_hours}
                onChange={e => setSettings(p => p ? ({ ...p, lead_time_hours: Number(e.target.value) }) : p)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                min={0} />
              <p className="text-xs text-gray-400 mt-1">Min. hours before a booking can be made</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max advance (days)</label>
              <input type="number"
                value={settings.max_advance_days}
                onChange={e => setSettings(p => p ? ({ ...p, max_advance_days: Number(e.target.value) }) : p)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                min={1} />
              <p className="text-xs text-gray-400 mt-1">How far ahead clients can book</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation policy</label>
            <textarea
              value={settings.cancellation_policy}
              onChange={e => setSettings(p => p ? ({ ...p, cancellation_policy: e.target.value }) : p)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
              rows={2} />
          </div>
        </section>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saved ? '✓ Settings saved!' : 'Save settings'}
        </button>

      </div>
    </div>
  )
}
