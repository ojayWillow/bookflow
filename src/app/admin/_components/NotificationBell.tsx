'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, X, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO, isToday, isYesterday } from 'date-fns'

const LS_KEY = 'bf_seen_bookings'

type NotificationItem = {
  id: string
  ref: string
  customer_name: string
  service_name: string
  date: string
  time: string
  created_at: string
  status: string
  type: 'new' | 'cancelled'
}

function timeLabel(iso: string) {
  const d = parseISO(iso)
  if (isToday(d))     return `Today at ${format(d, 'HH:mm')}`
  if (isYesterday(d)) return `Yesterday at ${format(d, 'HH:mm')}`
  return format(d, 'd MMM, HH:mm')
}

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveSeen(ids: Set<string>) {
  try {
    const arr = Array.from(ids).slice(-200)
    localStorage.setItem(LS_KEY, JSON.stringify(arr))
  } catch { /* storage full */ }
}

export default function NotificationBell() {
  const [open, setOpen]   = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [seen, setSeen]   = useState<Set<string>>(new Set())
  const ref               = useRef<HTMLDivElement>(null)

  useEffect(() => { setSeen(loadSeen()) }, [])

  const load = async () => {
    try {
      const res = await fetch('/api/bookings/recent', { credentials: 'include' })
      if (res.ok) setItems(await res.json())
    } catch { /* silent */ }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Use a compound key so a cancellation of an existing booking also appears unseen
  const unseenCount = items.filter(item => !seen.has(`${item.id}:${item.type}`)).length

  const handleOpen = () => {
    setOpen(o => !o)
    const next = new Set([...seen, ...items.map(item => `${item.id}:${item.type}`)])
    setSeen(next)
    saveSeen(next)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
      >
        <Bell className="w-5 h-5" />
        {unseenCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">Notifications</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {items.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              items.map(item => {
                const isCancelled = item.type === 'cancelled'
                return (
                  <Link
                    key={`${item.id}:${item.type}`}
                    href="/admin/bookings"
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      isCancelled ? 'hover:bg-red-50' : 'hover:bg-indigo-50'
                    }`}
                  >
                    {/* Avatar / icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isCancelled
                        ? 'bg-red-100 text-red-600'
                        : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {isCancelled ? '✕' : item.customer_name[0].toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${
                          isCancelled ? 'text-red-700' : 'text-gray-900'
                        }`}>
                          {item.customer_name}
                        </p>
                        {isCancelled && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            CANCELLED
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${
                        isCancelled ? 'text-red-400 line-through' : 'text-indigo-600'
                      }`}>
                        {item.service_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {format(parseISO(item.date), 'd MMM')} &middot; {item.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />{timeLabel(item.created_at)}
                      </span>
                    </div>
                  </Link>
                )
              })
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
