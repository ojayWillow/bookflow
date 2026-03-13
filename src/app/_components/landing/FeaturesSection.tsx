import { Calendar, Clock, Settings, Bell, Globe, Zap } from 'lucide-react'

const features = [
  { icon: Calendar, title: 'Smart scheduling',      desc: 'Set your open days, hours, and slot intervals. The system handles the rest.' },
  { icon: Clock,    title: 'Custom durations',       desc: 'Each service has its own duration. No double-bookings, ever.' },
  { icon: Settings, title: 'Fully configurable',     desc: 'Service names, prices, descriptions — all editable in seconds.' },
  { icon: Bell,     title: 'Customer confirmation',  desc: 'Every booking shows a full summary. Customers always know what to expect.' },
  { icon: Globe,    title: 'Any business type',      desc: 'Beauty, medical, auto, fitness, consulting — one platform fits all.' },
  { icon: Zap,      title: 'Up in minutes',          desc: 'No technical setup. Add your services, set your hours, share your link.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything a booking system needs</h2>
          <p className="text-gray-500 text-lg">Simple to set up. Powerful enough for any business.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-soft transition-all">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
