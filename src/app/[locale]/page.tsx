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

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900">BookFlow</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">{t.nav.features}</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">{t.nav.pricing}</a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switcher — slightly scaled down on mobile */}
            <div className="scale-90 sm:scale-100 origin-right">
              <LanguageSwitcher />
            </div>
            {/* Sign in — desktop only */}
            <Link href="/admin/login" className="hidden md:block text-sm text-gray-600 hover:text-gray-900 transition-colors">
              {t.nav.signIn}
            </Link>
            {/* CTA — desktop only; mobile uses sticky bottom bar */}
            <Link
              href={`/${locale}/signup`}
              className="hidden md:inline-flex items-center bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              {t.nav.tryFree}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 sm:pt-32 pb-32 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
            {t.hero.headline1}<br />
            <span className="text-indigo-600">{t.hero.headline2}</span>
          </h1>
          <p className="text-sm sm:text-xl text-gray-500 leading-relaxed mb-6 sm:mb-10 max-w-xs sm:max-w-xl mx-auto">
            {t.hero.subheadline}
          </p>

          {/* Email form — desktop only; mobile uses sticky bottom bar */}
          <div className="hidden md:flex justify-center">
            <HeroSignupForm locale={locale} emailPlaceholder={t.hero.emailPlaceholder} cta={t.hero.cta} />
          </div>
          <p className="hidden md:block text-sm text-gray-400 mt-4">{t.hero.trialNote}</p>

          {/* Trust row */}
          <div className="mt-5 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3">
            <div className="flex -space-x-1.5">
              {['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'].map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-400">Trusted by <strong className="text-gray-600">1,200+ businesses</strong></span>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile CTA bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <Link
          href={`/${locale}/signup`}
          className="flex items-center justify-center gap-2 w-full h-11 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {t.nav.tryFree} &rarr;
        </Link>
        <p className="text-center text-xs text-gray-400 mt-1.5">{t.hero.trialNote}</p>
      </div>

      {/* ── Mock UI Preview ── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">Glow Beauty Studio</p>
                    <p className="text-xs text-gray-400">{t.booking.stepService}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Classic Manicure — 45 min — €25', 'Gel Manicure — 60 min — €35', 'Lash Lift & Tint — 60 min — €45'].map((s, i) => (
                    <div key={i} className={`p-2.5 sm:p-3 rounded-xl border-2 text-xs sm:text-sm ${i === 1 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'}`}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                <p className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{t.overview?.statsToday ?? "Today's bookings"}</p>
                <div className="space-y-3">
                  {[
                    ['10:00', 'Anna B.',  'Gel Manicure',   t.overview?.statusConfirmed ?? 'confirmed'],
                    ['11:00', 'Laura K.', 'Lash Lift',      t.overview?.statusConfirmed ?? 'confirmed'],
                    ['14:00', 'Marta O.', 'Classic Facial', t.overview?.statusPending   ?? 'pending'],
                  ].map(([time, name, service, status]) => (
                    <div key={time} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm font-mono font-medium text-indigo-600 w-10 sm:w-12">{time}</span>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{name}</p>
                          <p className="text-xs text-gray-400">{service}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium ${
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

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t.cta.headline}</h2>
          <p className="text-indigo-200 text-sm sm:text-lg mb-8">{t.cta.sub}</p>
          <Link
            href={`/${locale}/signup`}
            className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 sm:py-10 px-4 sm:px-6 pb-24 md:pb-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">BookFlow</span>
          </div>
          <p className="text-sm text-gray-400 text-center">{t.footer.tagline}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-400">
            <Link href="/admin/login"        className="hover:text-gray-700">{t.footer.signIn}</Link>
            <Link href={`/${locale}/signup`} className="hover:text-gray-700">{t.footer.getStarted}</Link>
            <Link href="/privacy"            className="hover:text-gray-700">{t.footer.privacy}</Link>
            <Link href="/terms"              className="hover:text-gray-700">{t.footer.terms}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
