'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res  = await fetch('/api/auth/forgot-password', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
          <p className="text-sm text-gray-400 mb-6">
            If <span className="font-medium text-gray-700">{email}</span> has an account,
            you’ll receive a password reset link within a minute.
          </p>
          <Link href="/admin/login"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">BookFlow</h1>
            <p className="text-xs text-gray-400">Reset your password</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Enter the email you signed up with and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠ {error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/admin/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
