'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, X, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO, isToday, isYesterday } from 'date-fns'

type Booking = {
  id: string
  ref: string
  customer_name: string
  service_name: string
  date: string
  time: string
  created_at: string
}

function timeLabel(iso: string) {
  const d = parseISO(iso)
  if (isToday(d))     return `Today at ${format(d, 'HH:mm')}`
  if (isYesterday(d)) return `Yesterday at ${format(d, 'HH:mm')}`
  return format(d, 'd MMM, HH:mm')
}

export default function NotificationBell() {
  const [open, setOpen]         = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [seen, setSeen]         = useState<Set<string>>(new Set())
  const ref                     = useRef<HTMLDivElement>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/bookings/recent', { credentials: 'include' })
      if (res.ok) setBookings(await res.json())
    } catch { /* silent */ }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000) // poll every 30s
    return () => clearInterval(id)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unseen = bookings.filter(b => !seen.has(b.id))

  const handleOpen = () => {
    setOpen(o => !o)
    // Mark all current as seen when opening
    setSeen(new Set(bookings.map(b => b.id)))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
      >
        <Bell className="w-5 h-5" />
        {unseen.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unseen.length > 9 ? '9+' : unseen.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">Recent bookings</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {bookings.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No bookings yet</p>
              </div>
            ) : (
              bookings.map(b => (
                <Link
                  key={b.id}
                  href="/admin/bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {b.customer_name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{b.customer_name}</p>
                    <p className="text-xs text-indigo-600 truncate">{b.service_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />{format(parseISO(b.date), 'd MMM')} &middot; {b.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />{timeLabel(b.created_at)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <Link
              href="/admin/bookings"
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all bookings &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
