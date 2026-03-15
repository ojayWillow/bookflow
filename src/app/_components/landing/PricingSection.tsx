import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { PublicDict } from '@/i18n/en'

interface Props {
  dict:   PublicDict['pricing']
  locale: string
}

export default function PricingSection({ dict, locale }: Props) {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{dict.sectionTitle}</h2>
        <p className="text-gray-400 text-sm sm:text-base mb-10">{dict.sectionSub}</p>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <span className="text-5xl sm:text-6xl font-bold text-gray-900">€2.99</span>
          <span className="text-gray-400 text-base">{dict.perWeek}</span>
        </div>
        <p className="text-gray-400 text-sm mb-10">{dict.afterTrial}</p>

        {/* Features — 2 col grid */}
        <ul className="inline-grid grid-cols-2 gap-x-8 gap-y-2.5 text-left mb-10">
          {dict.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-indigo-500" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div>
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            {dict.cta}
          </Link>
          <p className="text-gray-400 text-xs mt-4">{dict.cancelNote}</p>
        </div>

      </div>
    </section>
  )
}
