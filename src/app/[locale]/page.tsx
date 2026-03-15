import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { getDictionary, type Locale } from '@/i18n/index'
import HeroSignupForm      from '../_components/landing/HeroSignupForm'
import FeaturesSection     from '../_components/landing/FeaturesSection'
import PricingSection      from '../_components/landing/PricingSection'
import TestimonialsSection from '../_components/landing/TestimonialsSection'
import LanguageSwitcher    from '../_components/LanguageSwitcher'

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getDictionary(locale as Locale)

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
            <a href="#features" className="hover:text-gray-900 transition-colors">{t.nav.features}</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">{t.nav.pricing}</a>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              {t.nav.signIn}
            </Link>
            <Link href={`/${locale}/signup`} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              {t.nav.tryFree}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t.hero.headline1}<br />
            <span className="text-indigo-600">{t.hero.headline2}</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
            {t.hero.subheadline}
          </p>
          <div className="flex justify-center">
            <HeroSignupForm locale={locale} emailPlaceholder={t.hero.emailPlaceholder} cta={t.hero.cta} />
          </div>
          <p className="text-sm text-gray-400 mt-4">{t.hero.trialNote}</p>
        </div>
      </section>

      {/* Mock UI Preview */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Glow Beauty Studio</p>
                    <p className="text-xs text-gray-400">{t.booking.stepService}</p>
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
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="font-bold text-gray-900 mb-4">{t.overview?.statsToday ?? "Today's bookings"}</p>
                <div className="space-y-3">
                  {[
                    ['10:00', 'Anna B.',  'Gel Manicure',   t.overview?.statusConfirmed ?? 'confirmed'],
                    ['11:00', 'Laura K.', 'Lash Lift',      t.overview?.statusConfirmed ?? 'confirmed'],
                    ['14:00', 'Marta O.', 'Classic Facial', t.overview?.statusPending   ?? 'pending'],
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
                        status === (t.overview?.statusConfirmed ?? 'confirmed')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection dict={t.features} />
      <PricingSection  dict={t.pricing} locale={locale} />
      <TestimonialsSection dict={t.testimonials} />

      {/* Final CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t.cta.headline}</h2>
          <p className="text-indigo-200 text-lg mb-8">{t.cta.sub}</p>
          <Link href={`/${locale}/signup`}
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors">
            {t.cta.button}
          </Link>
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
          <p className="text-sm text-gray-400">{t.footer.tagline}</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/admin/login"      className="hover:text-gray-700">{t.footer.signIn}</Link>
            <Link href={`/${locale}/signup`} className="hover:text-gray-700">{t.footer.getStarted}</Link>
            <Link href="/privacy"          className="hover:text-gray-700">{t.footer.privacy}</Link>
            <Link href="/terms"            className="hover:text-gray-700">{t.footer.terms}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
