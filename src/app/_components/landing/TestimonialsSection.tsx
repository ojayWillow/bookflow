import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Marina K.',
    business: 'Marina BeautyRoom',
    text: 'My clients book online now instead of messaging me at midnight. Life changing.',
    stars: 5,
    initials: 'MK',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    name: 'Andris P.',
    business: 'AutoPro Rīga',
    text: 'We went from a paper diary to a fully digital booking system in one afternoon.',
    stars: 5,
    initials: 'AP',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Jekaterina S.',
    business: 'Old Riga SPA',
    text: 'The confirmation emails alone save me 20 messages a day. Customers always know their details.',
    stars: 4,
    initials: 'JS',
    color: 'bg-purple-100 text-purple-600',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Businesses love it</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${
                    i < t.stars ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                  }`} />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
