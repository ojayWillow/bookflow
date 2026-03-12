'use client'
import { useState } from 'react'
import { bookings as initialBookings, services } from '@/data/mock'
import { format, parseISO } from 'date-fns'
import { Search, Phone, Mail } from 'lucide-react'

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
}

const FILTERS = ['All', 'confirmed', 'pending', 'cancelled']

export default function BookingsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [bkgs, setBkgs] = useState(initialBookings)

  const filtered = bkgs.filter(b => {
    const matchFilter = filter === 'All' || b.status === filter
    const matchSearch = b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const updateStatus = (id: string, status: typeof bkgs[0]['status']) => {
    setBkgs(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-400 mt-1">{bkgs.filter(b => b.status !== 'cancelled').length} active bookings</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="Search by name, email or service..." />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-100 text-gray-500 hover:border-indigo-300'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p>No bookings found</p>
          </div>
        )}
        {filtered.map(b => {
          const svc = services.find(s => s.id === b.serviceId)
          return (
            <div key={b.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-100 transition-all shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600 flex-shrink-0">
                    {b.customerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{b.customerName}</p>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLE[b.status]}`}>{b.status}</span>
                    </div>
                    <p className="text-sm font-medium text-indigo-600 mt-0.5">{b.service}</p>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">{format(parseISO(b.date), 'EEE d MMM')} · {b.time}</span>
                      {svc && <span className="text-xs text-gray-400">{svc.duration} min · €{svc.price}</span>}
                    </div>
                    {b.notes && <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mt-2 inline-block">📝 {b.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Mail className="w-3.5 h-3.5" /> {b.customerEmail}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="w-3.5 h-3.5" /> {b.customerPhone}
                  </div>
                  {b.status === 'pending' && (
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => updateStatus(b.id, 'confirmed')}
                        className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">
                        Confirm
                      </button>
                      <button onClick={() => updateStatus(b.id, 'cancelled')}
                        className="border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium">
                        Cancel
                      </button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => updateStatus(b.id, 'cancelled')}
                      className="border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium mt-1">
                      Cancel booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
