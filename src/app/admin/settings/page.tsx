'use client'
import { useState, useEffect } from 'react'
import { loadSettings, saveSettings } from '@/lib/settingsStore'
import { Copy, Check, QrCode, Globe, MessageCircle, MapPin, ExternalLink, Code2 } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INTERVALS = [15, 30, 45, 60]

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

export default function SettingsPage() {
  const [settings, setSettings] = useState(loadSettings())
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSettings(loadSettings()) }, [])

  const bookingUrl = `https://bookflow.app/book/demo`
  const iframeCode = `<iframe src="${bookingUrl}" width="100%" height="700" frameborder="0" style="border-radius:16px"></iframe>`
  const whatsappPhone = settings.phone.replace(/[^0-9]/g, '')
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=Hi%2C+I'd+like+to+make+a+booking+at+${encodeURIComponent(settings.name)}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`

  const toggleDay = (day: number) => {
    setSettings(prev => ({
      ...prev,
      openDays: prev.openDays.includes(day)
        ? prev.openDays.filter(d => d !== day)
        : [...prev.openDays, day].sort(),
    }))
  }

  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your business, schedule and booking rules</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-1">🔗 Share & distribute</h2>
          <p className="text-sm text-gray-400 mb-5">Get your booking page in front of customers — wherever they are</p>
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
                  <p className="text-xs text-gray-500 leading-relaxed">Customers scan this with their phone camera and go straight to your booking page. No app required.</p>
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
                <span className="text-xs text-gray-400">— works on Wix, WordPress, Squarespace, custom HTML</span>
              </div>
              <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <code className="text-xs text-gray-600 leading-relaxed break-all flex-1 font-mono">{iframeCode}</code>
                  <div className="flex-shrink-0"><CopyButton text={iframeCode} /></div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Paste this anywhere in your website HTML where you want the booking form to appear.</p>
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
                  <p className="text-xs font-medium text-gray-600 mb-2">Option B — Click-to-chat link (share anywhere)</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs font-mono text-green-700 truncate">{whatsappLink}</div>
                    <CopyButton text={whatsappLink} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">When tapped, opens WhatsApp with a pre-filled message ready to send to you.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-gray-700">Google Maps / Google Business Profile</span>
              </div>
              <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Add a "Book online" button to your Google Maps listing</p>
                  <ol className="text-xs text-gray-500 space-y-1.5 leading-relaxed">
                    <li><span className="font-semibold text-gray-700">1.</span> Go to <a href="https://business.google.com" target="_blank" className="text-indigo-600 underline">business.google.com</a> and sign in</li>
                    <li><span className="font-semibold text-gray-700">2.</span> Select your business → click <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Edit profile → Contact</span></li>
                    <li><span className="font-semibold text-gray-700">3.</span> Under <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Booking</span>, paste your booking link</li>
                    <li><span className="font-semibold text-gray-700">4.</span> Save — a blue "Book online" button appears on your Maps listing within 24h</li>
                  </ol>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-white border border-red-200 rounded-lg px-3 py-2 text-xs font-mono text-red-700 truncate">{bookingUrl}</div>
                  <CopyButton text={bookingUrl} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-4">🏢 Business information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
              <input value={settings.name} onChange={e => setSettings(p => ({ ...p, name: e.target.value }))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
              <input value={settings.tagline} onChange={e => setSettings(p => ({ ...p, tagline: e.target.value }))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input value={settings.address} onChange={e => setSettings(p => ({ ...p, address: e.target.value }))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input value={settings.phone} onChange={e => setSettings(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact email</label>
                <input value={settings.email} onChange={e => setSettings(p => ({ ...p, email: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-4">📅 Schedule</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Open days</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day, i) => (
                  <button key={day} type="button" onClick={() => toggleDay(i)}
                    className={`w-12 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      settings.openDays.includes(i)
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
                <input type="time" value={settings.openTime} onChange={e => setSettings(p => ({ ...p, openTime: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Closing time</label>
                <input type="time" value={settings.closeTime} onChange={e => setSettings(p => ({ ...p, closeTime: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking slot interval</label>
              <div className="flex gap-2">
                {INTERVALS.map(i => (
                  <button key={i} type="button" onClick={() => setSettings(p => ({ ...p, slotInterval: i }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      settings.slotInterval === i
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

        <section className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-soft">
          <h2 className="font-semibold text-gray-900 mb-4">⚙️ Booking rules</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lead time (hours)</label>
              <input type="number" value={settings.leadTimeHours} onChange={e => setSettings(p => ({ ...p, leadTimeHours: Number(e.target.value) }))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={0} />
              <p className="text-xs text-gray-400 mt-1">Min. hours before a booking can be made</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max advance (days)</label>
              <input type="number" value={settings.maxAdvanceDays} onChange={e => setSettings(p => ({ ...p, maxAdvanceDays: Number(e.target.value) }))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" min={1} />
              <p className="text-xs text-gray-400 mt-1">How far ahead clients can book</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation policy</label>
            <textarea value={settings.cancellationPolicy} onChange={e => setSettings(p => ({ ...p, cancellationPolicy: e.target.value }))}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
              rows={2} />
          </div>
        </section>

        <button onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          {saved ? '✓ Settings saved!' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}
