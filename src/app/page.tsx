import Link from 'next/link'
import { Calendar, Clock, Settings, Star, CheckCircle, Zap, Globe, Bell } from 'lucide-react'

const features = [
  { icon: Calendar, title: 'Smart scheduling', desc: 'Set your open days, hours, and slot intervals. The system handles the rest.' },
  { icon: Clock, title: 'Custom durations', desc: 'Each service has its own duration. No double-bookings, ever.' },
  { icon: Settings, title: 'Fully configurable', desc: 'Service names, prices, descriptions — all editable in seconds.' },
  { icon: Bell, title: 'Customer confirmation', desc: 'Every booking shows a full summary. Customers always know what to expect.' },
  { icon: Globe, title: 'Any business type', desc: 'Beauty, medical, auto, fitness, consulting — one platform fits all.' },
  { icon: Zap, title: 'Up in minutes', desc: 'No technical setup. Add your services, set your hours, share your link.' },
]

const testimonials = [
  { name: 'Marina K.', business: 'Marina BeautyRoom', text: 'My clients book online now instead of messaging me at midnight. Life changing.' },
  { name: 'Andris P.', business: 'AutoPro Rīga', text: 'We went from a paper diary to a fully digital booking system in one afternoon.' },
  { name: 'Jekaterina S.', business: 'Old Riga SPA', text: 'The confirmation page alone saves me 20 emails a day. Customers always know their details.' },
]

const plans = [
  { name: 'Starter', price: 19, features: ['1 location', 'Up to 5 services', 'Email confirmations', 'Basic branding'], highlight: false },
  { name: 'Pro', price: 49, features: ['Unlimited services', 'Custom domain', 'SMS reminders', 'Analytics dashboard', 'Priority support'], highlight: true },
  { name: 'Agency', price: 99, features: ['Multiple locations', 'White-label resale', 'API access', 'Dedicated support', 'Custom integrations'], highlight: false },
]

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
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <Link href="/book/demo" className="hover:text-gray-900 transition-colors">Demo</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Admin demo</Link>
            <Link href="/book/demo" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              See it live →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Built for every type of business
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Online booking that<br />
            <span className="text-indigo-600">just works</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Give your business a professional booking page in minutes. Customers book, you get notified, everyone knows what's happening.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book/demo" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors">
              Try the booking flow →
            </Link>
            <Link href="/admin" className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-indigo-300 transition-colors">
              See the dashboard
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card · 14-day free trial</p>
        </div>
      </section>

      {/* Mock UI Preview */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Booking card preview */}
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
              {/* Dashboard card preview */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <p className="font-bold text-gray-900 mb-4">Today's bookings</p>
                <div className="space-y-3">
                  {[['10:00', 'Anna B.', 'Gel Manicure', 'confirmed'], ['11:00', 'Laura K.', 'Lash Lift', 'confirmed'], ['14:00', 'Marta O.', 'Classic Facial', 'pending']].map(([time, name, service, status]) => (
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
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
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
            <p className="text-gray-500 text-lg">Start free. Scale when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-indigo-600 text-white shadow-xl scale-105'
                  : 'bg-white border-2 border-gray-100'
              }`}>
                {plan.highlight && <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Most popular</span>}
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
                <Link href="/book/demo" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
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
