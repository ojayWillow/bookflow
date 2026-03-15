'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, Phone, Mail, RefreshCw, Loader2, Calendar, X, Clock } from 'lucide-react'
import { getBookings, updateBookingStatus } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'
import AdminSkeleton  from '../_components/AdminSkeleton'
import ToastContainer from '../_components/Toast'
import { useToast }   from '@/hooks/useToast'

type Booking = {
  id: string; ref: string; service_name: string; service_duration: number
  service_price: number; staff_id: string; staff_name: string
  date: string; time: string; customer_name: string
  customer_email: string; customer_phone: string
  customer_notes: string; status: string; created_at: string
}

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-gray-100 text-gray-500',
  pending:   'bg-amber-100 text-amber-700',
}

const FILTERS = ['All', 'confirmed', 'pending', 'cancelled', 'completed']

// ─── Reschedule Modal ───────────────────────────────────────────────────
function RescheduleModal({
  booking, onClose, onSaved,
}: {
  booking: Booking
  onClose: () => void
  onSaved: () => void
}) {
  const [date, setDate]   = useState(booking.date)
  const [time, setTime]   = useState(booking.time.slice(0, 5))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!date || !time) { setError('Please fill in both date and time'); return }
    setSaving(true)
    setError('')
    const res  = await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: booking.id, date, time }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Failed to reschedule'); setSaving(false); return }
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900">Reschedule booking</h2>
            <p className="text-xs text-gray-400 mt-0.5">{booking.customer_name} · {booking.service_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />New date
            </label>
            <input type="date" value={date} min={format(new Date(), 'yyyy-MM-dd')}
              onChange={e => setDate(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Clock className="w-3.5 h-3.5 inline mr-1" />New time
            </label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
          </div>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">⚠ {error}</p>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 border-2 border-gray-100 text-gray-500 py-2.5 rounded-xl text-sm font-medium hover:border-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const [bookings, setBookings]         = useState<Booking[]>([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState('All')
  const [search, setSearch]             = useState('')
  const [error, setError]               = useState('')
  const [rescheduling, setRescheduling] = useState<Booking | null>(null)
  const { toasts, toast, dismiss }      = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getBookings()
      setBookings(data ?? [])
      setError('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => { load() }, [load])

  // Real-time subscription — re-fetch whenever any booking row changes
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => { load() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [load])

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'All' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_email.toLowerCase().includes(q) ||
      b.service_name.toLowerCase().includes(q) ||
      b.ref.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const handleStatus = async (
    id: string,
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed',
  ) => {
    try {
      await updateBookingStatus(id, status)
      await load()
      const labels: Record<string, string> = {
        confirmed: 'Booking restored',
        completed: 'Marked as complete',
        cancelled: 'Booking cancelled',
      }
      toast.success(labels[status] ?? 'Status updated')
    } catch {
      toast.error('Failed to update booking status')
    }
  }

  const handleRescheduleSaved = async () => {
    await load()
    toast.success('Booking rescheduled')
  }

  const activeCount = bookings.filter(b => b.status === 'confirmed').length

  return (
    <div className="p-4 md:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {rescheduling && (
        <RescheduleModal
          booking={rescheduling}
          onClose={() => setRescheduling(null)}
          onSaved={handleRescheduleSaved}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-400 mt-1">{activeCount} confirmed booking{activeCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 border-2 border-gray-100 hover:border-indigo-300 px-3 py-2 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">⚠ {error}</div>
      )}

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

      {loading ? (
        <AdminSkeleton rows={5} />
      ) : (
        <div className="space-y-3">
          {bookings.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📬</p>
              <p className="font-medium">No bookings yet</p>
              <p className="text-sm mt-1">Bookings will appear here once customers book through your booking page.</p>
            </div>
          )}
          {bookings.length > 0 && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No bookings match your search</p>
            </div>
          )}
          {filtered.map(b => (
            <div key={b.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-100 transition-all shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600 flex-shrink-0">
                    {b.customer_name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{b.customer_name}</p>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLE[b.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                      <span className="text-xs text-gray-300 font-mono">{b.ref}</span>
                    </div>
                    <p className="text-sm font-medium text-indigo-600 mt-0.5">{b.service_name}</p>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">{format(parseISO(b.date), 'EEE d MMM')} · {b.time}</span>
                      <span className="text-xs text-gray-400">{b.service_duration} min · €{b.service_price}</span>
                      {b.staff_name && <span className="text-xs text-gray-400">{b.staff_name}</span>}
                    </div>
                    {b.customer_notes && (
                      <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mt-2 inline-block">📝 {b.customer_notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Mail className="w-3.5 h-3.5" /> {b.customer_email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="w-3.5 h-3.5" /> {b.customer_phone}
                  </div>
                  {b.status === 'confirmed' && (
                    <div className="flex gap-2 mt-1 flex-wrap justify-end">
                      <button onClick={() => setRescheduling(b)}
                        className="border-2 border-indigo-200 text-indigo-600 text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-50 font-medium transition-colors">
                        Reschedule
                      </button>
                      <button onClick={() => handleStatus(b.id, 'completed')}
                        className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                        Mark complete
                      </button>
                      <button onClick={() => handleStatus(b.id, 'cancelled')}
                        className="border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                  {b.status === 'completed' && (
                    <span className="text-xs text-gray-400 italic mt-1">Completed ✓</span>
                  )}
                  {b.status === 'cancelled' && (
                    <button onClick={() => handleStatus(b.id, 'confirmed')}
                      className="border border-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium transition-colors mt-1">
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
