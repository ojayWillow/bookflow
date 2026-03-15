import { Calendar } from 'lucide-react'
import Link from 'next/link'
import HeroSignupForm      from './_components/landing/HeroSignupForm'
import FeaturesSection     from './_components/landing/FeaturesSection'
import PricingSection      from './_components/landing/PricingSection'
import TestimonialsSection from './_components/landing/TestimonialsSection'
import LanguageSwitcher    from './_components/LanguageSwitcher'
import en from '@/i18n/en'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">BookFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Sign in</Link>
            <Link
              href="/signup"
              className="bg-indigo-600 text-white font-medium whitespace-nowrap rounded-xl hover:bg-indigo-700 transition-colors px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm leading-tight"
            >
              Try free for 7 days
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5 sm:mb-6">
            Online booking that<br />
            <span className="text-indigo-600">just works</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
            Give your business a professional booking page in minutes. Customers book, you get notified, everyone knows what&apos;s happening.
          </p>
          <div className="flex justify-center px-0 sm:px-4">
            <HeroSignupForm
              locale={en.booking.locale}
              emailPlaceholder={en.hero.emailPlaceholder}
              cta={en.hero.cta}
            />
          </div>
          <p className="text-sm text-gray-400 mt-4">7-day free trial &middot; No credit card required</p>

          {/* Trust row */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 text-sm text-gray-400">
            <div className="flex -space-x-2">
              {['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>Trusted by <strong className="text-gray-600">1,200+ businesses</strong></span>
          </div>
        </div>
      </section>

      {/* Mock UI Preview */}
      <section className="py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 sm:p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <p className="font-bold text-gray-900 mb-4">Today&apos;s bookings</p>
                <div className="space-y-3">
                  {[
                    ['10:00', 'Anna B.',  'Gel Manicure',   'confirmed'],
                    ['11:00', 'Laura K.', 'Lash Lift',      'confirmed'],
                    ['14:00', 'Marta O.', 'Classic Facial', 'pending'],
                  ].map(([time, name, service, status]) => (
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

      <FeaturesSection     dict={en.features} />
      <PricingSection      dict={en.pricing}  locale={en.booking.locale} />
      <TestimonialsSection dict={en.testimonials} />

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to take bookings online?</h2>
          <p className="text-indigo-200 text-base sm:text-lg mb-8">Try BookFlow free for 7 days. No credit card, no contracts.</p>
          <Link href="/signup"
            className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-indigo-50 transition-colors">
            Start your free trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">BookFlow</span>
          </div>
          <p className="text-sm text-gray-400 text-center">© 2026 BookFlow. Built for businesses that take appointments.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-400">
            <Link href="/admin/login" className="hover:text-gray-700">Sign in</Link>
            <Link href="/signup"      className="hover:text-gray-700">Get started</Link>
            <Link href="/privacy"     className="hover:text-gray-700">Privacy</Link>
            <Link href="/terms"       className="hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
