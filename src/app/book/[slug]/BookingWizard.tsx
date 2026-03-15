'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  getServicesForBusiness,
  getStaffForBusiness,
  getBookedSlotsForDate,
} from '@/lib/supabase/queries'
import { getSlotsForDate, getUnionSlotsForDate, getAvailableDates } from '@/lib/slots'
import type { BookedSlotRaw, SlotStaffMember } from '@/lib/slots'
import { ChevronLeft, CheckCircle, Instagram, Facebook, Globe } from 'lucide-react'
import type { DBService, DBStaffMember, Business, Step, BookingForm } from './types'
import StepService  from './_steps/StepService'
import StepStaff    from './_steps/StepStaff'
import StepDateTime from './_steps/StepDateTime'
import StepDetails  from './_steps/StepDetails'
import StepConfirm  from './_steps/StepConfirm'
import StepSuccess  from './_steps/StepSuccess'
import { getDictionary, type Locale } from '@/i18n/index'
import type { PublicDict } from '@/i18n/en'

const LOCALE_COOKIE = 'BOOKFLOW_LOCALE'

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'lv'
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`))
  const val   = match?.[1]?.toLowerCase()
  if (val === 'en' || val === 'ru' || val === 'lv') return val
  // Fall back to browser language
  const lang = navigator.language.slice(0, 2).toLowerCase()
  if (lang === 'en' || lang === 'ru' || lang === 'lv') return lang
  return 'lv'
}

function toSlotStaff(m: DBStaffMember): SlotStaffMember {
  return {
    id: m.id, name: m.name, role: m.role, bio: m.bio,
    serviceIds: m.service_ids,
    workDays: m.work_days,
    workStart: m.work_start,
    workEnd: m.work_end,
    active: m.active, color: m.color,
  }
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}

export default function BookingWizard({ business }: { business: Business }) {
  const [step, setStep]                           = useState<Step>('service')
  const [selectedService, setSelectedService]     = useState<DBService | null>(null)
  const [selectedStaffId, setSelectedStaffId]     = useState<string>('any')
  const [selectedDate, setSelectedDate]           = useState('')
  const [selectedTime, setSelectedTime]           = useState('')
  const [form, setForm]                           = useState<BookingForm>({ name: '', email: '', phone: '', notes: '' })
  const [touched, setTouched]                     = useState({ name: false, email: false, phone: false })
  const [bookingRef, setBookingRef]               = useState('')
  const [services, setServices]                   = useState<DBService[]>([])
  const [staffMembers, setStaffMembers]           = useState<DBStaffMember[]>([])
  const [bookedRaw, setBookedRaw]                 = useState<BookedSlotRaw[]>([])
  const [loadingData, setLoadingData]             = useState(true)
  const [loadingSlots, setLoadingSlots]           = useState(false)
  const [submitting, setSubmitting]               = useState(false)
  const [submitError, setSubmitError]             = useState('')
  const [emailSent, setEmailSent]                 = useState(false)
  const [dict, setDict]                           = useState<PublicDict | null>(null)

  // Detect locale from cookie / browser on mount
  useEffect(() => {
    const locale = readLocaleCookie()
    getDictionary(locale).then(setDict)
  }, [])

  useEffect(() => {
    setLoadingData(true)
    Promise.all([
      getServicesForBusiness(business.id),
      getStaffForBusiness(business.id),
    ]).then(([svcData, staffData]) => {
      setServices(svcData as DBService[])
      setStaffMembers(staffData as DBStaffMember[])
    }).finally(() => setLoadingData(false))
  }, [business.id])

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    getBookedSlotsForDate(selectedDate, selectedStaffId, business.id)
      .then(data => setBookedRaw(data as BookedSlotRaw[]))
      .catch(() => setBookedRaw([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate, selectedStaffId, business.id])

  const availableDates      = useMemo(() => getAvailableDates(business), [business])
  const selectedStaffMember = selectedStaffId !== 'any'
    ? staffMembers.find(m => m.id === selectedStaffId) ?? null
    : null
  const availableStaff = useMemo(
    () => selectedService ? staffMembers.filter(m => m.service_ids.includes(selectedService.id)) : [],
    [selectedService, staffMembers]
  )
  const slots = useMemo(() => {
    if (!selectedService || !selectedDate) return []
    if (selectedStaffId === 'any') {
      return getUnionSlotsForDate(selectedDate, selectedService.duration, bookedRaw, availableStaff.map(toSlotStaff), business)
    }
    return getSlotsForDate(selectedDate, selectedService.duration, bookedRaw, selectedStaffMember ? toSlotStaff(selectedStaffMember) : null, business)
  }, [selectedService, selectedDate, selectedStaffId, bookedRaw, availableStaff, selectedStaffMember, business])

  const t = dict?.booking

  const validateName  = (v: string) => {
    const parts = v.trim().split(/\s+/)
    if (parts.length < 2)              return t?.errorNameParts  ?? 'Please enter your first and last name'
    if (parts.some(p => p.length < 2)) return t?.errorNameShort  ?? 'Each name must be at least 2 characters'
    return ''
  }
  const validateEmail = (v: string) => {
    if (!v.trim()) return t?.errorEmailRequired ?? 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return t?.errorEmailInvalid ?? 'Please enter a valid email address'
    return ''
  }
  const validatePhone = (v: string) => {
    if (!v.trim()) return t?.errorPhoneRequired ?? 'Phone number is required'
    const digits = v.replace(/[^0-9]/g, '')
    if (digits.length < 7) return t?.errorPhoneShort ?? 'Please enter a valid phone number (min 7 digits)'
    if (!/^[\d\s+\-()]{7,20}$/.test(v.trim())) return t?.errorPhoneInvalid ?? 'Only digits, spaces, +, - and () allowed'
    return ''
  }

  const errors    = { name: validateName(form.name), email: validateEmail(form.email), phone: validatePhone(form.phone) }
  const formValid = !errors.name && !errors.email && !errors.phone

  const stepKeys: Step[] = ['service', 'staff', 'datetime', 'details', 'confirm']
  const stepIndex = stepKeys.indexOf(step)
  const goBack    = () => { if (stepIndex > 0) setStep(stepKeys[stepIndex - 1]) }

  const handleConfirm = async () => {
    if (!selectedService || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id:      business.id,
          service_id:       selectedService.id,
          service_name:     selectedService.name,
          service_duration: selectedService.duration,
          service_price:    selectedService.price,
          staff_id:         selectedStaffMember?.id ?? null,
          staff_name:       selectedStaffMember?.name ?? (t?.anyoneAvailable ?? 'Anyone available'),
          date:             selectedDate,
          time:             selectedTime,
          customer_name:    form.name,
          customer_email:   form.email,
          customer_phone:   form.phone,
          customer_notes:   form.notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? (t?.errorGeneric ?? 'Booking failed'))
      setBookingRef(data.booking.ref)
      setEmailSent(data.emailsSent === true)
      setStep('success')
    } catch (err) {
      console.error(err)
      setSubmitError(err instanceof Error ? err.message : (t?.errorGeneric ?? 'Something went wrong. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const hasSocial = business.instagram_url || business.facebook_url || business.tiktok_url || business.website_url

  // Dict not loaded yet — render shell only (avoids flash of wrong language)
  if (!dict || !t) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const STEP_LABELS = [t.stepService, t.stepStaff, t.stepDateTime, t.stepDetails, t.stepConfirm]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="relative bg-white border-b overflow-hidden">
        {business.cover_url && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={business.cover_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className={`relative max-w-2xl mx-auto px-6 py-5 flex items-center justify-between gap-4 ${
          business.cover_url ? 'py-8' : ''
        }`}>
          <div className="flex items-center gap-4">
            {business.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logo_url} alt={business.name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 shadow-sm" />
            ) : (
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: business.primary_color }}>
                {business.name[0]}
              </div>
            )}
            <div>
              <h1 className={`font-bold text-lg ${business.cover_url ? 'text-white' : 'text-gray-900'}`}>{business.name}</h1>
              <p className={`text-sm ${business.cover_url ? 'text-white/80' : 'text-gray-400'}`}>{business.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {hasSocial && (
              <div className="flex items-center gap-2">
                {business.website_url && (
                  <a href={business.website_url} target="_blank" rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      business.cover_url ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}><Globe className="w-4 h-4" /></a>
                )}
                {business.instagram_url && (
                  <a href={business.instagram_url} target="_blank" rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      business.cover_url ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                    }`}><Instagram className="w-4 h-4" /></a>
                )}
                {business.facebook_url && (
                  <a href={business.facebook_url} target="_blank" rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      business.cover_url ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}><Facebook className="w-4 h-4" /></a>
                )}
                {business.tiktok_url && (
                  <a href={business.tiktok_url} target="_blank" rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      business.cover_url ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}><TikTokIcon className="w-4 h-4" /></a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {step !== 'success' && (
          <>
            <div className="flex items-center mb-8">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      stepIndex > i     ? 'bg-indigo-600 text-white'
                      : stepIndex === i ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-gray-200 text-gray-400'
                    }`}>
                      {stepIndex > i ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      stepIndex >= i ? 'text-indigo-600' : 'text-gray-400'
                    }`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${stepIndex > i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            {stepIndex > 0 && (
              <button onClick={goBack}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {t.back}
              </button>
            )}
          </>
        )}

        {step === 'service'  && <StepService  services={services} loading={loadingData} dict={t} onSelect={s => { setSelectedService(s); setSelectedStaffId('any'); setStep('staff') }} />}
        {step === 'staff'    && selectedService && <StepStaff service={selectedService} availableStaff={availableStaff} selectedStaffId={selectedStaffId} loading={loadingData} dict={t} onSelect={id => { setSelectedStaffId(id); setStep('datetime') }} />}
        {step === 'datetime' && selectedService && <StepDateTime service={selectedService} selectedStaffMember={selectedStaffMember ?? null} availableDates={availableDates} selectedDate={selectedDate} selectedTime={selectedTime} slots={slots} loadingSlots={loadingSlots} dict={t} onSelectDate={date => { setSelectedDate(date); setSelectedTime('') }} onSelectTime={time => { setSelectedTime(time); setStep('details') }} />}
        {step === 'details'  && <StepDetails form={form} errors={errors} touched={touched} dict={t} onChange={(field, value) => setForm(p => ({ ...p, [field]: value }))} onBlur={field => setTouched(p => ({ ...p, [field]: true }))} onNext={() => { setTouched({ name: true, email: true, phone: true }); if (formValid) setStep('confirm') }} />}
        {step === 'confirm'  && selectedService && <StepConfirm business={business} service={selectedService} staffMember={selectedStaffMember ?? null} date={selectedDate} time={selectedTime} form={form} submitting={submitting} submitError={submitError} dict={t} onConfirm={handleConfirm} />}
        {step === 'success'  && selectedService && <StepSuccess business={business} service={selectedService} staffMember={selectedStaffMember ?? null} date={selectedDate} time={selectedTime} form={form} bookingRef={bookingRef} emailSent={emailSent} dict={t} />}
      </main>
    </div>
  )
}
