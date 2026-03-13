'use client'
import { useState } from 'react'

export default function HeroSignupForm() {
  const [form, setForm]       = useState({ businessName: '', slug: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name     = e.target.value
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setForm(p => ({ ...p, businessName: name, slug: autoSlug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res  = await fetch('/api/auth/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md mx-auto text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✉️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Check your inbox!</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          We sent a verification link to{' '}
          <span className="font-medium text-gray-800">{form.email}</span>.<br />
          Click it to activate your account and get started.
        </p>
        <p className="text-xs text-gray-400 mt-4">Didn&apos;t get it? Check your spam folder.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md mx-auto text-left"
    >
      <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Create your free account</p>

      <div className="space-y-3">
        <input
          value={form.businessName}
          onChange={handleNameChange}
          required
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
          placeholder="Business name (e.g. Glow Beauty Studio)"
        />

        <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-indigo-400 transition-colors">
          <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r border-gray-100 whitespace-nowrap">/book/</span>
          <input
            value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
            required
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent"
            placeholder="your-booking-url"
          />
        </div>

        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          required
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
          placeholder="Email address"
        />

        <input
          type="password"
          value={form.password}
          onChange={set('password')}
          required
          minLength={8}
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
          placeholder="Password (min. 8 characters)"
        />

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠ {error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
        >
          {loading ? 'Creating account…' : 'Create your booking page →'}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">No credit card · Takes 2 minutes</p>
    </form>
  )
}
