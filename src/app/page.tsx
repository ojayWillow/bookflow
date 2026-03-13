'use client'
import { useState } from 'react'
import { Calendar, Clock, Settings, Star, CheckCircle, Zap, Globe, Bell } from 'lucide-react'
import Link from 'next/link'

const features = [
  { icon: Calendar, title: 'Smart scheduling', desc: 'Set your open days, hours, and slot intervals. The system handles the rest.' },
  { icon: Clock,    title: 'Custom durations', desc: 'Each service has its own duration. No double-bookings, ever.' },
  { icon: Settings, title: 'Fully configurable', desc: 'Service names, prices, descriptions — all editable in seconds.' },
  { icon: Bell,     title: 'Customer confirmation', desc: 'Every booking shows a full summary. Customers always know what to expect.' },
  { icon: Globe,    title: 'Any business type', desc: 'Beauty, medical, auto, fitness, consulting — one platform fits all.' },
  { icon: Zap,      title: 'Up in minutes', desc: 'No technical setup. Add your services, set your hours, share your link.' },
]

const testimonials = [
  { name: 'Marina K.',     business: 'Marina BeautyRoom',  text: 'My clients book online now instead of messaging me at midnight. Life changing.' },
  { name: 'Andris P.',     business: 'AutoPro Rīga',       text: 'We went from a paper diary to a fully digital booking system in one afternoon.' },
  { name: 'Jekaterina S.', business: 'Old Riga SPA',       text: 'The confirmation page alone saves me 20 emails a day. Customers always know their details.' },
]

const plans = [
  { name: 'Starter', price: 19, features: ['1 location', 'Up to 5 services', 'Email confirmations', 'Basic branding'],                                          highlight: false },
  { name: 'Pro',     price: 49, features: ['Unlimited services', 'Custom domain', 'SMS reminders', 'Analytics dashboard', 'Priority support'],                  highlight: true  },
  { name: 'Agency',  price: 99, features: ['Multiple locations', 'White-label resale', 'API access', 'Dedicated support', 'Custom integrations'],               highlight: false },
]

// ─── Inline Hero Signup Form ─────────────────────────────────────────────────
function HeroSignupForm() {
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
        <p className="text-xs text-gray-400 mt-4">Didn’t get it? Check your spam folder.</p>
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
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">BookFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
            <a href="#hero-signup" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              Get started →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero-signup" className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5" />
                Built for every type of business
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Online booking that<br />
                <span className="text-indigo-600">just works</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed">
                Give your business a professional booking page in minutes. Customers book, you get notified, everyone knows what&apos;s happening.
              </p>
            </div>
            <div>
              <HeroSignupForm />
            </div>
          </div>
        </div>
      </section>

      {/* Mock UI Preview */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Glow Beauty Studio</p>
                    <p className="text-xs text-gray-400">Choose your service</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Classic Manicure — 45 min — €25', 'Gel Manicure — 60 min — €35', 'Lash Lift & Tint — 60 min — €45'].map((s, i) => (
                    <div key={i} className={`p-3 rounded-xl border-2 text-sm ${i === 1 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'}`}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <p className="font-bold text-gray-900 mb-4">Today&apos;s bookings</p>
                <div className="space-y-3">
                  {[['10:00', 'Anna B.',  'Gel Manicure',   'confirmed'],
                    ['11:00', 'Laura K.', 'Lash Lift',      'confirmed'],
                    ['14:00', 'Marta O.', 'Classic Facial', 'pending']].map(([time, name, service, status]) => (
                    <div key={time} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-medium text-indigo-600 w-12">{time}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{name}</p>
                          <p className="text-xs text-gray-400">{service}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything a booking system needs</h2>
            <p className="text-gray-500 text-lg">Simple to set up. Powerful enough for any business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-soft transition-all">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Businesses love it</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-gray-500 text-lg">Start free. Scale when you&apos;re ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 ${
                plan.highlight ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-2 border-gray-100'
              }`}>
                {plan.highlight && (
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Most popular</span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className={`text-4xl font-bold mb-6 ${plan.highlight ? 'text-white' : 'text-indigo-600'}`}>
                  €{plan.price}<span className={`text-base font-normal ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#hero-signup" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  Get started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take bookings online?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join businesses already using BookFlow. Your booking page is 2 minutes away.</p>
          <a href="#hero-signup"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors">
            Create your free account →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">BookFlow</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 BookFlow. Built for businesses that take appointments.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
