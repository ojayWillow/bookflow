'use client'
import { useState, useEffect } from 'react'
import { services, staff } from '@/data/mock'
import { loadBookings, updateBookingStatus, type Booking, type BookingStatus } from '@/lib/bookingsStore'
import { format, parseISO } from 'date-fns'
import { Search, Phone, Mail, RefreshCw } from 'lucide-react'

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-gray-100 text-gray-500',
}

const FILTERS = ['All', 'confirmed', 'cancelled', 'completed']

export default function BookingsPage() {
  const [bkgs, setBkgs] = useState<Booking[]>([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const reload = () => setBkgs(loadBookings())

  useEffect(() => { reload() }, [])

  const filtered = bkgs.filter(b => {
    const matchFilter = filter === 'All' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerEmail.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.ref.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const handleStatus = (ref: string, status: BookingStatus) => {
    updateBookingStatus(ref, status)
    reload()
  }

  const activeCount = bkgs.filter(b => b.status === 'confirmed').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-400 mt-1">{activeCount} confirmed booking{activeCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={reload}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 border-2 border-gray-100 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="Search by name, email, service or ref..." />
        </div>
        <div className="flex gap-2 flex-wrap">
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
        {bkgs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📬</p>
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm mt-1">Bookings will appear here once customers book through your booking page.</p>
          </div>
        )}
        {bkgs.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🔍</p>
            <p>No bookings match your search</p>
          </div>
        )}
        {filtered.map(b => {
          const member = staff.find(m => m.id === b.staffId)
          return (
            <div key={b.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-100 transition-all shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600 flex-shrink-0">
                    {b.customerName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{b.customerName}</p>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLE[b.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                      <span className="text-xs text-gray-300 font-mono">{b.ref}</span>
                    </div>
                    <p className="text-sm font-medium text-indigo-600 mt-0.5">{b.serviceName}</p>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">{format(parseISO(b.date), 'EEE d MMM')} · {b.time}</span>
                      <span className="text-xs text-gray-400">{b.serviceDuration} min · €{b.servicePrice}</span>
                      {member && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: member.color }} />
                          {member.name}
                        </span>
                      )}
                    </div>
                    {b.customerNotes && (
                      <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mt-2 inline-block">📝 {b.customerNotes}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Mail className="w-3.5 h-3.5" /> {b.customerEmail}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="w-3.5 h-3.5" /> {b.customerPhone}
                  </div>
                  {b.status === 'confirmed' && (
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleStatus(b.ref, 'completed')}
                        className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 font-medium">
                        Mark complete
                      </button>
                      <button onClick={() => handleStatus(b.ref, 'cancelled')}
                        className="border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium">
                        Cancel
                      </button>
                    </div>
                  )}
                  {b.status === 'completed' && (
                    <span className="text-xs text-gray-400 italic mt-1">Completed ✓</span>
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
