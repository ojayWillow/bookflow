'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Loader2, Lock, ChevronLeft } from 'lucide-react'
import { Suspense } from 'react'
import { BUSINESS_CATEGORIES, getCategoryLabel } from '@/lib/service-templates'
import en from '@/i18n/en'
import lv from '@/i18n/lv'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow.app'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { locale } = useParams() as { locale: string }

  // Pick the right dictionary based on locale (default to English)
  const t = locale === 'lv' ? lv : en

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

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== confirmPassword) {
      setError(t.signup.errorPasswordMismatch)
      return
    }
    if (form.password.length < 8) {
      setError(t.signup.errorPasswordShort)
      return
    }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (overrideCategory?: string | null) => {
    setError('')
    setLoading(true)
    const category = overrideCategory !== undefined ? overrideCategory : selectedCategory

    const signupRes  = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, businessCategory: category ?? 'skip' }),
    })
    const signupData = await signupRes.json()
    if (!signupRes.ok) {
      setError(signupData.error || t.signup.errorGeneric)
      setLoading(false)
      return
    }

    router.push('/signup/confirm')
  }

  const passwordMismatch = confirmPassword.length > 0 && form.password !== confirmPassword
  const selectedCat = BUSINESS_CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">BookFlow</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-indigo-600" />
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${
            step === 2 ? 'bg-indigo-600' : 'bg-gray-200'
          }`} />
          <span className="text-xs text-gray-400 ml-1">
            {t.signup.stepOf.replace('{{step}}', String(step))}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {step === 1 && (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{t.signup.heading}</h1>
              <p className="text-sm text-gray-400 mb-6">{t.signup.subheading}</p>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelFirstName}</label>
                    <input value={form.firstName} onChange={set('firstName')} required disabled={loading}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                      placeholder={t.signup.placeholderFirstName} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelLastName}</label>
                    <input value={form.lastName} onChange={set('lastName')} required disabled={loading}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                      placeholder={t.signup.placeholderLastName} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelBusinessName}</label>
                  <input value={form.businessName} onChange={handleBusinessNameChange} required disabled={loading}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                    placeholder={t.signup.placeholderBusinessName} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelUrl}</label>
                  <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-indigo-400 transition-colors">
                    <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r border-gray-100 whitespace-nowrap">/book/</span>
                    <input value={form.slug} onChange={handleSlugChange} required disabled={loading}
                      className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent disabled:opacity-50"
                      placeholder="glow-beauty-studio" />
                  </div>
                  {form.slug && (
                    <p className="text-xs text-indigo-500 font-mono mt-1.5 truncate">{BASE}/book/{form.slug}</p>
                  )}
                  <div className="flex items-start gap-1.5 mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>{locale === 'lv' ? 'Šī saite ir pastāvīga' : 'This URL is permanent'}</strong> &mdash; {t.signup.slugWarning}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelEmail}</label>
                  <input type="email" value={form.email} onChange={set('email')} required disabled={loading}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                    placeholder={t.signup.placeholderEmail} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelPassword}</label>
                  <input type="password" value={form.password} onChange={set('password')} required minLength={8} disabled={loading}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                    placeholder={t.signup.placeholderPassword} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.signup.labelConfirmPassword}</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    required disabled={loading}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors disabled:opacity-50 ${
                      passwordMismatch ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-indigo-400'
                    }`}
                    placeholder={t.signup.placeholderConfirmPassword} />
                  {passwordMismatch && (
                    <p className="text-xs text-red-500 mt-1.5">⚠ {t.signup.errorPasswordMismatch}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠ {error}</p>
                )}

                <button type="submit" disabled={loading || passwordMismatch}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {t.signup.step1Continue}
                </button>
                <p className="text-xs text-center text-gray-400">{t.signup.noCreditCard}</p>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <button onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4 -ml-1 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {t.booking.back}
              </button>

              <h1 className="text-xl font-bold text-gray-900 mb-1">{t.signup.step2Title}</h1>
              <p className="text-sm text-gray-400 mb-6">{t.signup.step2Sub}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {BUSINESS_CATEGORIES.map(cat => (
                  <button key={cat.id} type="button"
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                      selectedCategory === cat.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50'
                    }`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700 leading-tight">
                      {getCategoryLabel(cat, locale)}
                    </span>
                    {selectedCategory === cat.id && (
                      <span className="text-xs text-indigo-500 font-medium">
                        {t.signup.step2Services.replace('{{count}}', String(cat.services.length))}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">⚠ {error}</p>
              )}

              <button onClick={() => handleSubmit()} disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-3">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? t.signup.step2Creating
                  : selectedCat
                    ? t.signup.step2ContinueWith.replace('{{label}}', getCategoryLabel(selectedCat, locale))
                    : t.signup.step2Continue}
              </button>

              <button type="button" onClick={() => handleSubmit('skip')} disabled={loading}
                className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                {t.signup.step2Skip}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          {t.signup.alreadyHaveAccount}{' '}
          <Link href="/admin/login" className="text-indigo-600 hover:underline font-medium">{t.signup.signIn}</Link>
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
