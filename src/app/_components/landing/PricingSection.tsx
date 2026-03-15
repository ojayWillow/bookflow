import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { PublicDict } from '@/i18n/en'

interface Props {
  dict:   PublicDict['pricing']
  locale: string
}

export default function PricingSection({ dict, locale }: Props) {
  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-lg mx-auto text-center">

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{dict.sectionTitle}</h2>
        <p className="text-gray-500 text-sm sm:text-lg mb-10">{dict.sectionSub}</p>

        <div className="bg-indigo-600 rounded-2xl p-8 sm:p-10 text-white shadow-xl">

          {/* Price */}
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-6xl font-bold">€2.99</span>
            <span className="text-white/70 text-lg">{dict.perWeek}</span>
          </div>
          <p className="text-white/60 text-sm mb-8">{dict.afterTrial}</p>

          {/* Features */}
          <ul className="space-y-3 mb-8 text-left">
            {dict.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-white" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/signup`}
            className="block w-full text-center bg-white text-indigo-600 font-semibold py-3.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm"
          >
            {dict.cta}
          </Link>

          <p className="text-white/50 text-xs mt-4">{dict.cancelNote}</p>
        </div>

      </div>
    </section>
  )
}
