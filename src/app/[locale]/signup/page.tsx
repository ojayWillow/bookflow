'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Loader2, Lock } from 'lucide-react'
import LanguageSwitcher from '@/app/_components/LanguageSwitcher'
import { getDictionary, type Locale } from '@/i18n/index'
import type { PublicDict } from '@/i18n/en'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow.app'

function SignupForm({ locale, t }: { locale: string; t: PublicDict }) {
  const s        = t.signup
  const router   = useRouter()
  const params   = useSearchParams()

  const [form, setForm] = useState({
    firstName: '', lastName: '', businessName: '', slug: '', email: '', password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [slugTouched, setSlugTouched]         = useState(false)
  const [error, setError]                     = useState('')
  const [loading, setLoading]                 = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== confirmPassword) { setError(s.errorPasswordMismatch); return }
    if (form.password.length < 8)          { setError(s.errorPasswordShort);    return }
    setLoading(true)
    const res  = await fetch('/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || s.errorGeneric); setLoading(false); return }
    router.push('/admin')
  }

  const passwordMismatch = confirmPassword.length > 0 && form.password !== confirmPassword

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">BookFlow</span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{s.heading}</h1>
          <p className="text-sm text-gray-400 mb-6">{s.subheading}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelFirstName}</label>
                <input value={form.firstName} onChange={set('firstName')} required disabled={loading}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                  placeholder={s.placeholderFirstName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelLastName}</label>
                <input value={form.lastName} onChange={set('lastName')} required disabled={loading}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                  placeholder={s.placeholderLastName} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelBusinessName}</label>
              <input value={form.businessName} onChange={handleBusinessNameChange} required disabled={loading}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                placeholder={s.placeholderBusinessName} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelUrl}</label>
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
                <p className="text-xs text-amber-700 leading-relaxed">{s.slugWarning}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelEmail}</label>
              <input type="email" value={form.email} onChange={set('email')} required disabled={loading}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                placeholder={s.placeholderEmail} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelPassword}</label>
              <input type="password" value={form.password} onChange={set('password')} required minLength={8} disabled={loading}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
                placeholder={s.placeholderPassword} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.labelConfirmPassword}</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                required disabled={loading}
                className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors disabled:opacity-50 ${
                  passwordMismatch ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-indigo-400'
                }`}
                placeholder={s.placeholderConfirmPassword} />
              {passwordMismatch && <p className="text-xs text-red-500 mt-1.5">⚠ {s.errorPasswordMismatch}</p>}
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠ {error}</p>
            )}

            <button type="submit" disabled={loading || passwordMismatch}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? s.submitting : s.submit}
            </button>

            <p className="text-xs text-center text-gray-400">{s.noCreditCard}</p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          {s.alreadyHaveAccount}{' '}
          <Link href="/admin/login" className="text-indigo-600 hover:underline font-medium">{s.signIn}</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage({ params }: { params: { locale: string } }) {
  const [dict, setDict] = useState<PublicDict | null>(null)

  useEffect(() => {
    getDictionary(params.locale as Locale).then(setDict)
  }, [params.locale])

  if (!dict) return null

  return (
    <Suspense>
      <SignupForm locale={params.locale} t={dict} />
    </Suspense>
  )
}
