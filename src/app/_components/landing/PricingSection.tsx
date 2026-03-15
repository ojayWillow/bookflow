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
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{dict.sectionTitle}</h2>
          <p className="text-gray-500 text-lg">{dict.sectionSub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {dict.plans.map((plan, i) => {
            const highlight = i === 1
            return (
              <div key={plan.name} className={`rounded-2xl p-8 ${
                highlight ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-2 border-gray-100'
              }`}>
                {highlight && (
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {dict.mostPopular}
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className={`text-4xl font-bold mb-1 ${highlight ? 'text-white' : 'text-indigo-600'}`}>
                  €{PRICES[i]}<span className={`text-base font-normal ${highlight ? 'text-white/70' : 'text-gray-400'}`}>{dict.perMonth}</span>
                </div>
                <p className={`text-xs mb-6 ${highlight ? 'text-white/70' : 'text-gray-400'}`}>{dict.afterTrial}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${highlight ? 'text-white/90' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-white' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/signup`} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  {dict.cta}
                </Link>
              </div>
            )
          })}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">{dict.cancelNote}</p>
      </div>
    </section>
  )
}
