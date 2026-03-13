'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [locked, setLocked]     = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown ticker when locked out
  useEffect(() => {
    if (countdown <= 0) { setLocked(false); return }
    const t = setTimeout(() => setCountdown(c => c - 1000), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    setLoading(true)
    setError('')

    const res  = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (res.status === 429) {
      setLocked(true)
      setCountdown(data.remainingMs ?? 15 * 60 * 1000)
      setError(data.error)
      setLoading(false)
      return
    }

    if (!res.ok) {
      const left = data.attemptsLeft ?? ''
      setError(
        data.error + (left ? ` (${left} attempt${left !== 1 ? 's' : ''} left)` : '')
      )
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  const countdownLabel = () => {
    const m = Math.floor(countdown / 60000)
    const s = Math.floor((countdown % 60000) / 1000)
    return `${m}:${String(s).padStart(2, '0')}`
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
            <p className="text-xs text-gray-400">Admin login</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={locked}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={locked}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={`text-sm rounded-xl px-4 py-2.5 border ${
              locked
                ? 'text-orange-700 bg-orange-50 border-orange-100'
                : 'text-red-500 bg-red-50 border-red-100'
            }`}>
              ⚠ {error}
              {locked && countdown > 0 && (
                <span className="ml-2 font-mono font-bold">{countdownLabel()}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || locked}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {locked ? 'Account locked' : loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400">
            No account?{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline font-medium">Sign up</Link>
          </p>
          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}
