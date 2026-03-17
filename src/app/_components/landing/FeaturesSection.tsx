import { Calendar, Clock, Settings, Bell, Globe, Zap } from 'lucide-react'
import type { PublicDict } from '@/i18n/en'

const ICONS = [Calendar, Clock, Settings, Bell, Globe, Zap]

interface Props {
  dict: PublicDict['features']
}

export default function FeaturesSection({ dict }: Props) {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{dict.sectionTitle}</h2>
          <p className="text-gray-500 text-lg">{dict.sectionSub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {dict.items.map((f, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={f.title}
                className="relative overflow-hidden group p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
