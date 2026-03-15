import type { PublicDict } from '@/i18n/en'

interface Props {
  dict: PublicDict['testimonials']
}

export default function TestimonialsSection({ dict }: Props) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{dict.sectionTitle}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dict.items.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-indigo-600">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
