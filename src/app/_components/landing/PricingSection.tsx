import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { PublicDict } from '@/i18n/en'

const PRICES = [19, 49, 99]

interface Props {
  dict:   PublicDict['pricing']
  locale: string
}

export default function PricingSection({ dict, locale }: Props) {
  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{dict.sectionTitle}</h2>
          <p className="text-gray-500 text-sm sm:text-lg">{dict.sectionSub}</p>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {dict.plans.map((plan, i) => {
            const highlight = i === 1
            return (
              <div
                key={plan.name}
                className={`rounded-2xl transition-shadow ${
                  highlight
                    ? 'bg-indigo-600 text-white shadow-xl sm:scale-105'
                    : 'bg-white border-2 border-gray-100'
                } ${
                  /* compact padding on mobile, normal on sm+ */
                  highlight ? 'p-5 sm:p-8' : 'p-4 sm:p-8'
                }`}
              >
                {/* On mobile: header row with name + badge inline */}
                <div className="flex items-center justify-between mb-2 sm:block">
                  <h3 className={`text-lg sm:text-xl font-bold sm:mb-2 ${highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  {highlight && (
                    <span className="inline-block sm:hidden bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {dict.mostPopular}
                    </span>
                  )}
                </div>

                {/* Badge on sm+ (block, above name) — desktop only */}
                {highlight && (
                  <span className="hidden sm:inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 -mt-2">
                    {dict.mostPopular}
                  </span>
                )}

                {/* Price row */}
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className={`text-3xl sm:text-4xl font-bold ${highlight ? 'text-white' : 'text-indigo-600'}`}>
                    €{PRICES[i]}
                  </span>
                  <span className={`text-sm font-normal ${highlight ? 'text-white/70' : 'text-gray-400'}`}>
                    {dict.perMonth}
                  </span>
                </div>
                <p className={`text-xs mb-4 sm:mb-6 ${highlight ? 'text-white/70' : 'text-gray-400'}`}>
                  {dict.afterTrial}
                </p>

                {/* Features — collapsed to 2-col grid on mobile for compactness */}
                <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-2 sm:gap-y-3 mb-5 sm:mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-1.5 text-xs sm:text-sm ${highlight ? 'text-white/90' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-white' : 'text-green-500'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/signup`}
                  className={`block text-center py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-colors ${
                    highlight
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {dict.cta}
                </Link>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-400 mt-6 sm:mt-8">{dict.cancelNote}</p>
      </div>
    </section>
  )
}
