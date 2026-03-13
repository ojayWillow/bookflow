import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Marina K.',     business: 'Marina BeautyRoom', text: 'My clients book online now instead of messaging me at midnight. Life changing.' },
  { name: 'Andris P.',     business: 'AutoPro Rīga',      text: 'We went from a paper diary to a fully digital booking system in one afternoon.' },
  { name: 'Jekaterina S.', business: 'Old Riga SPA',      text: 'The confirmation page alone saves me 20 emails a day. Customers always know their details.' },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Businesses love it</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
