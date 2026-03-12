'use client'
import { useState } from 'react'
import { businessSettings } from '@/data/mock'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INTERVALS = [15, 30, 45, 60]

export default function SettingsPage() {
  const [settings, setSettings] = useState({ ...businessSettings })
  const [saved, setSaved] = useState(false)

  const toggleDay = (day: number) => {
    setSettings(prev => ({
      ...prev,
      openDays: prev.openDays.includes(day)
        ? prev.openDays.filter(d => d !== day)
        : [...prev.openDays, day].sort(),
    }))
  }

  const handleSave = () => {
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

        {/* Business Info */}
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

        {/* Schedule */}
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

        {/* Booking Rules */}
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
