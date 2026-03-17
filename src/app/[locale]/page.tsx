import { Calendar } from 'lucide-react'
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
