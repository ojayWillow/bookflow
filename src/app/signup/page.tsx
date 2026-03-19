'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Loader2, Lock, ChevronLeft } from 'lucide-react'
import { Suspense } from 'react'
import { BUSINESS_CATEGORIES } from '@/lib/service-templates'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow.app'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()

  const [step, setStep] = useState<1 | 2>(1)

  const [form, setForm] = useState({
    firstName: '', lastName: '', businessName: '', slug: '', email: '', password: '',
  })
  const [confirmPassword, setConfirmPassword]   = useState('')
  const [slugTouched, setSlugTouched]           = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const email = params.get('email')
    if (email) setForm(p => ({ ...p, email }))
  }, [params])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name     = e.target.value
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setForm(p => ({ ...p, businessName: name, ...(!slugTouched && { slug: autoSlug }) }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true)
    setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))
  }

  // Step 1 → Step 2 validation
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setStep(2)
  }

  // Final submit (Step 2)
  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const res  = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        businessCategory: selectedCategory ?? 'skip',
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return }
    router.push('/admin')
  }

  const passwordMismatch = confirmPassword.length > 0 && form.password !== confirmPassword

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">BookFlow</span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-indigo-600" />
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${
            step === 2 ? 'bg-indigo-600' : 'bg-gray-200'
          }`} />
          <span className="text-xs text-gray-400 ml-1">Step {step} of 2</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* ───────── STEP 1 ───────── */}
          {step === 1 && (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
              <p className="text-sm text-gray-400 mb-6">Your booking page will be live in 2 minutes.</p>

              <form onSubmit={handleNextStep} className="space-y-4">

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                    <input
                      value={form.firstName} onChange={set('firstName')}
                      required disabled={loading}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                    <input
                      value={form.lastName} onChange={set('lastName')}
                      required disabled={loading}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
                  <input
                    value={form.businessName} onChange={handleBusinessNameChange}
                    required disabled={loading}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                    placeholder="e.g. Glow Beauty Studio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your booking page URL</label>
                  <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-indigo-400 transition-colors">
                    <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r border-gray-100 whitespace-nowrap">/book/</span>
                    <input
                      value={form.slug} onChange={handleSlugChange}
                      required disabled={loading}
                      className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent disabled:opacity-50"
                      placeholder="glow-beauty-studio"
                    />
                  </div>
                  {form.slug && (
                    <p className="text-xs text-indigo-500 font-mono mt-1.5 truncate">{BASE}/book/{form.slug}</p>
                  )}
                  <div className="flex items-start gap-1.5 mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>This URL is permanent</strong> and cannot be changed after signup.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email" value={form.email} onChange={set('email')}
                    required disabled={loading}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password" value={form.password} onChange={set('password')}
                    required minLength={8} disabled={loading}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors disabled:opacity-50 ${
                      passwordMismatch
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-gray-100 focus:border-indigo-400'
                    }`}
                    placeholder="Repeat your password"
                  />
                  {passwordMismatch && (
                    <p className="text-xs text-red-500 mt-1.5">⚠ Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠ {error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || passwordMismatch}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue →
                </button>

                <p className="text-xs text-center text-gray-400">No credit card required</p>
              </form>
            </>
          )}

          {/* ───────── STEP 2 ───────── */}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4 -ml-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h1 className="text-xl font-bold text-gray-900 mb-1">What type of business are you?</h1>
              <p className="text-sm text-gray-400 mb-6">
                We’ll pre-load ready-to-use services so you can start taking bookings immediately.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {BUSINESS_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                      selectedCategory === cat.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700 leading-tight">{cat.label}</span>
                    {selectedCategory === cat.id && (
                      <span className="text-xs text-indigo-500 font-medium">
                        {cat.services.length} services
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">⚠ {error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-3"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? 'Creating account…'
                  : selectedCategory
                    ? `Create account with ${BUSINESS_CATEGORIES.find(c => c.id === selectedCategory)?.label} templates →`
                    : 'Create account →'
                }
              </button>

              <button
                type="button"
                onClick={() => { setSelectedCategory(null); handleSubmit() }}
                disabled={loading}
                className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Skip — I’ll set it up myself
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link href="/admin/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
