import { Clock, PackageOpen } from 'lucide-react'
import type { DBService } from '../types'
import type { PublicDict } from '@/i18n/en'

type Props = {
  services: DBService[]
  loading: boolean
  dict: PublicDict['booking']
  onSelect: (s: DBService) => void
}

export default function StepService({ services, loading, dict: t, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{t.stepServiceTitle}</h2>
      <p className="text-gray-400 text-sm mb-4">{t.stepServiceSub}</p>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">{t.noServicesTitle}</p>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{t.noServicesSub}</p>
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="space-y-2">
          {services.map(s => (
            <button key={s.id} onClick={() => onSelect(s)}
              className="w-full text-left bg-white border-2 border-gray-100 rounded-xl px-4 py-3 hover:border-indigo-400 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors truncate">{s.name}</p>
                    <span className="flex items-center gap-0.5 text-xs text-gray-400 flex-shrink-0">
                      <Clock className="w-3 h-3" />{s.duration}{t.min}
                    </span>
                  </div>
                  {s.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                  )}
                </div>
                <p className="text-base font-bold text-indigo-600 flex-shrink-0">€{s.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
