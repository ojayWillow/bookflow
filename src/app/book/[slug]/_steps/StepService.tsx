import { Clock, PackageOpen } from 'lucide-react'
import type { DBService } from '../types'

type Props = {
  services: DBService[]
  loading: boolean
  onSelect: (s: DBService) => void
}

export default function StepService({ services, loading, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Choose a service</h2>
      <p className="text-gray-400 text-sm mb-6">Select what you&apos;d like to book</p>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">No services available yet</p>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            This business hasn&apos;t added any services yet. Please check back soon or contact them directly.
          </p>
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="space-y-3">
          {services.map(s => (
            <button key={s.id}
              onClick={() => onSelect(s)}
              className="w-full text-left bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{s.description}</p>
                  <span className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                    <Clock className="w-3.5 h-3.5" /> {s.duration} min
                  </span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">€{s.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
