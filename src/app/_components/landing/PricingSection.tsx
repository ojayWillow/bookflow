import Link from 'next/link'
import { CheckCircle, Sparkles } from 'lucide-react'
import type { PublicDict } from '@/i18n/en'

interface Props {
  dict:   PublicDict['pricing']
  locale: string
}

export default function PricingSection({ dict, locale }: Props) {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-md mx-auto">

        {/* Floating card */}
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden">

          {/* Card header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
            {/* Badge pill */}
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3 h-3" />
              {dict.sectionTitle}
            </span>
            <p className="text-indigo-100 text-sm">{dict.sectionSub}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Card body */}
          <div className="px-6 py-8">
            {/* Price */}
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-5xl sm:text-6xl font-bold text-gray-900">€2.99</span>
              <span className="text-gray-400 text-base">{dict.perWeek}</span>
            </div>
            <p className="text-gray-400 text-sm text-center mb-8">{dict.afterTrial}</p>

            {/* Features — 2 col grid */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-left mb-8">
              {dict.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-indigo-500" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />

            {/* Full-width CTA */}
            <Link
              href={`/${locale}/signup`}
              className="flex items-center justify-center w-full bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              {dict.cta}
            </Link>
            <p className="text-gray-400 text-xs mt-4 text-center">{dict.cancelNote}</p>
          </div>
        </div>

      </div>
    </section>
  )
}
