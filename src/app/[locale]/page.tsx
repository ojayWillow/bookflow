import { Calendar, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { getDictionary, type Locale } from '@/i18n/index'
import HeroSignupForm  from '../_components/landing/HeroSignupForm'
import FeaturesSection from '../_components/landing/FeaturesSection'
import PricingSection  from '../_components/landing/PricingSection'
import LanguageSwitcher from '../_components/LanguageSwitcher'

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900">BookFlow</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="scale-90 sm:scale-100 origin-right">
              <LanguageSwitcher />
            </div>
            <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              {t.nav.signIn}
            </Link>
            <Link
              href={`/${locale}/signup`}
              className="hidden md:inline-flex items-center bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
            >
              {t.nav.tryFree}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-20 sm:pt-32 pb-32 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-indigo-100">
            <Sparkles className="w-3 h-3" />
            Booking made simple
          </div>
          <h1 className="text-5xl sm:text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
            {t.hero.headline1}<br />
            <span className="text-indigo-600">{t.hero.headline2}</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-10 max-w-xs sm:max-w-xl mx-auto">
            {t.hero.subheadline}
          </p>

          <div className="hidden md:flex justify-center">
            <HeroSignupForm locale={locale} emailPlaceholder={t.hero.emailPlaceholder} cta={t.hero.cta} />
          </div>
          <p className="hidden md:block text-sm text-gray-400 mt-4">{t.hero.trialNote}</p>
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

      <FeaturesSection dict={t.features} />
      <PricingSection  dict={t.pricing} locale={locale} />

      {/* ── Final CTA ── */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t.cta.headline}</h2>
          <p className="text-indigo-200 text-sm sm:text-lg mb-8">{t.cta.sub}</p>
          <Link
            href={`/${locale}/signup`}
            className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/20"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* ── Footer gradient divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* ── Footer ── */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 pb-24 md:pb-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
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
