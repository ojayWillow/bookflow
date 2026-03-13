import { CheckCircle } from 'lucide-react'

const plans = [
  {
    name: 'Starter', price: 19,
    features: ['1 location', 'Up to 5 services', 'Email confirmations', 'Basic branding'],
    highlight: false,
  },
  {
    name: 'Pro', price: 49,
    features: ['Unlimited services', 'Custom domain', 'SMS reminders', 'Analytics dashboard', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Agency', price: 99,
    features: ['Multiple locations', 'White-label resale', 'API access', 'Dedicated support', 'Custom integrations'],
    highlight: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-500 text-lg">Start free. Scale when you&apos;re ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 ${
              plan.highlight ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-2 border-gray-100'
            }`}>
              {plan.highlight && (
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Most popular</span>
              )}
              <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <div className={`text-4xl font-bold mb-6 ${plan.highlight ? 'text-white' : 'text-indigo-600'}`}>
                €{plan.price}<span className={`text-base font-normal ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-green-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#hero-signup" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                plan.highlight
                  ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}>
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
