import { Users } from 'lucide-react'
import type { DBService, DBStaffMember } from '../types'

type Props = {
  service: DBService
  availableStaff: DBStaffMember[]
  selectedStaffId: string
  loading: boolean
  onSelect: (staffId: string) => void
}

export default function StepStaff({ service, availableStaff, selectedStaffId, loading, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Choose who you&apos;d like</h2>
      <p className="text-gray-400 text-sm mb-6">
        {service.name} · {service.duration} min · €{service.price}
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => onSelect('any')}
            className={`w-full text-left bg-white border-2 rounded-2xl p-5 hover:border-indigo-400 transition-all ${
              selectedStaffId === 'any' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'
            }`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Anyone available</p>
                <p className="text-sm text-gray-400">Show all available slots across the team</p>
              </div>
            </div>
          </button>

          {availableStaff.map(m => (
            <button key={m.id}
              onClick={() => onSelect(m.id)}
              className={`w-full text-left bg-white border-2 rounded-2xl p-5 hover:border-indigo-400 transition-all ${
                selectedStaffId === m.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'
              }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: m.color }}>
                  {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <p className="text-sm text-indigo-600">{m.role}</p>
                  {m.bio && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{m.bio}</p>}
                </div>
              </div>
            </button>
          ))}

          {availableStaff.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-6">No staff assigned to this service yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
