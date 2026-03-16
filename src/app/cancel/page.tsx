'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CalendarX, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'

type BookingData = {
  booking: {
    id: string; ref: string; status: string
    service_name: string; service_duration: number
    date: string; time: string; customer_name: string
  }
  business: {
    name: string; slug: string; primary_color: string; logo_url: string
  }
  policy: {
    windowHours: number
    cancellationPolicy: string
    withinWindow: boolean
    deadlineAt: string | null
  }
}

function CancelPageInner() {
  const params = useSearchParams()
  const router = useRouter()
  const id     = params.get('id')
  const token  = params.get('token')
  const error  = params.get('error')

  const [data, setData]             = useState<BookingData | null>(null)
  const [loading, setLoading]       = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [state, setState]           = useState<'idle' | 'done' | 'error' | 'already' | 'window'>('idle')
  const [errMsg, setErrMsg]         = useState('')

  useEffect(() => {
    if (error || !id || !token) { setLoading(false); setState('error'); return }
    fetch(`/api/cancel/lookup?id=${id}&token=${token}`)
      .then(async res => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        return json
      })
      .then(json => {
        if (json.booking.status === 'cancelled') { setState('already'); setLoading(false); return }
        if (json.booking.status === 'completed') {
          setErrMsg('This appointment has already been completed.')
          setState('error')
          setLoading(false)
          return
        }
        setData(json)
        setLoading(false)
      })
      .catch((e: unknown) => {
        setErrMsg(e instanceof Error ? e.message : 'Could not load booking')
        setState('error')
        setLoading(false)
      })
  }, [id, token, error])

  const handleCancel = async () => {
    if (!id || !token || !data) return
    setCancelling(true)
    try {
      const res  = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (json.error === 'already_cancelled') { setState('already'); return }
        if (json.error === 'window_passed')     { setState('window');  return }
        throw new Error(json.error)
      }
      setState('done')
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : 'Something went wrong')
      setState('error')
    } finally {
      setCancelling(false)
    }
  }

  const goToBookingPage = () => {
    const slug = data?.business.slug
    if (slug) router.push(`/book/${slug}`)
  }

  const color = data?.business.primary_color ?? '#6366f1'

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  )

  if (state === 'done') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Booking cancelled</h1>
        <p className="text-gray-500 text-sm">
          Your <strong>{data?.booking.service_name}</strong> appointment on{' '}
          <strong>{data ? format(parseISO(data.booking.date), 'd MMMM yyyy') : ''}</strong> at{' '}
          <strong>{data?.booking.time}</strong> has been cancelled.
        </p>
        <p className="text-gray-400 text-xs mt-4">You will receive a confirmation email shortly.</p>
        {data?.business.slug && (
          <button
            onClick={goToBookingPage}
            className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Book a new appointment →
          </button>
        )}
      </div>
    </div>
  )

  if (state === 'already') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarX className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Already cancelled</h1>
        <p className="text-gray-500 text-sm">This booking has already been cancelled.</p>
      </div>
    </div>
  )

  if (state === 'window') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-amber-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Cancellation deadline passed</h1>
        <p className="text-gray-500 text-sm">
          This booking can no longer be cancelled online. Please contact us directly for assistance.
        </p>
      </div>
    </div>
  )

  if (state === 'error') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm">{errMsg || 'This cancellation link is invalid or has expired.'}</p>
      </div>
    </div>
  )

  if (!data) return null

  const { booking, business, policy } = data
  const appointmentDate = format(parseISO(booking.date), 'EEEE, d MMMM yyyy')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 w-full max-w-md">

        {/* Header */}
        <div className="p-6 border-b-2 border-gray-100 flex items-center gap-3">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logo_url} alt="" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              {business.name[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">{business.name}</p>
            <p className="text-xs text-gray-400">Booking cancellation</p>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* Booking summary */}
          <div className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4 space-y-2">
            <p className="font-semibold text-gray-900">{booking.service_name}</p>
            <p className="text-sm text-gray-500">{appointmentDate} at {booking.time}</p>
            <p className="text-sm text-gray-500">{booking.service_duration} min &middot; {booking.customer_name}</p>
            <p className="text-xs text-gray-300 font-mono">{booking.ref}</p>
          </div>

          {/* Within-window warning */}
          {policy.withinWindow && policy.windowHours > 0 && (
            <div className="flex gap-3 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Late cancellation</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This appointment is within the {policy.windowHours}-hour cancellation window.
                  Cancellation may no longer be possible.
                </p>
              </div>
            </div>
          )}

          {/* Cancellation policy */}
          {policy.cancellationPolicy && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cancellation policy</p>
              <p className="text-sm text-gray-600 leading-relaxed">{policy.cancellationPolicy}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={goToBookingPage}
              className="flex-1 border-2 border-gray-100 text-gray-500 py-3 rounded-xl text-sm font-medium hover:border-gray-200 transition-colors"
            >
              Keep booking
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
              {cancelling ? 'Cancelling…' : 'Yes, cancel'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    }>
      <CancelPageInner />
    </Suspense>
  )
}
