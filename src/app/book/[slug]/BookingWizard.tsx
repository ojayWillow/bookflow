'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  getServicesForBusiness,
  getStaffForBusiness,
  createBooking,
  getBookedSlotsForDate,
} from '@/lib/supabase/queries'
import { getSlotsForDate, getUnionSlotsForDate, getAvailableDates } from '@/lib/slots'
import type { BookedSlotRaw, SlotStaffMember } from '@/lib/slots'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import type { DBService, DBStaffMember, Business, Step, BookingForm } from './types'
import StepService  from './_steps/StepService'
import StepStaff    from './_steps/StepStaff'
import StepDateTime from './_steps/StepDateTime'
import StepDetails  from './_steps/StepDetails'
import StepConfirm  from './_steps/StepConfirm'
import StepSuccess  from './_steps/StepSuccess'

const STEP_LABELS = ['Service', 'Who', 'Date & Time', 'Details', 'Confirm']

function toSlotStaff(m: DBStaffMember): SlotStaffMember {
  return {
    id: m.id, name: m.name, role: m.role, bio: m.bio,
    serviceIds: m.service_ids,
    workDays:   m.work_days,
    workStart:  m.work_start,
    workEnd:    m.work_end,
    active: m.active, color: m.color,
  }
}

const validateName  = (v: string) => {
  const parts = v.trim().split(/\s+/)
  if (parts.length < 2)              return 'Please enter your first and last name'
  if (parts.some(p => p.length < 2)) return 'Each name must be at least 2 characters'
  return ''
}
const validateEmail = (v: string) => {
  if (!v.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address'
  return ''
}
const validatePhone = (v: string) => {
  if (!v.trim()) return 'Phone number is required'
  const digits = v.replace(/[^0-9]/g, '')
  if (digits.length < 7) return 'Please enter a valid phone number (min 7 digits)'
  if (!/^[\d\s+\-()]{7,20}$/.test(v.trim())) return 'Only digits, spaces, +, - and () allowed'
  return ''
}

export default function BookingWizard({ business }: { business: Business }) {
  const [step, setStep]                           = useState<Step>('service')
  const [selectedService, setSelectedService]     = useState<DBService | null>(null)
  const [selectedStaffId, setSelectedStaffId]     = useState<string>('any')
  const [selectedDate, setSelectedDate]           = useState('')
  const [selectedTime, setSelectedTime]           = useState('')
  const [form, setForm]                           = useState<BookingForm>({ name: '', email: '', phone: '', notes: '' })
  const [touched, setTouched]                     = useState({ name: false, email: false, phone: false })
  const [bookingRef]                              = useState(() => 'BF-' + Math.random().toString(36).substring(2, 8).toUpperCase())
  const [services, setServices]                   = useState<DBService[]>([])
  const [staffMembers, setStaffMembers]           = useState<DBStaffMember[]>([])
  const [bookedRaw, setBookedRaw]                 = useState<BookedSlotRaw[]>([])
  const [loadingData, setLoadingData]             = useState(true)
  const [loadingSlots, setLoadingSlots]           = useState(false)
  const [submitting, setSubmitting]               = useState(false)
  const [submitError, setSubmitError]             = useState('')

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

  const availableDates    = useMemo(() => getAvailableDates(business), [business])
  const selectedStaffMember = selectedStaffId !== 'any'
    ? staffMembers.find(m => m.id === selectedStaffId) ?? null
    : null
  const availableStaff    = useMemo(
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
      await createBooking({
        business_id:      business.id,
        ref:              bookingRef,
        service_id:       selectedService.id,
        service_name:     selectedService.name,
        service_duration: selectedService.duration,
        service_price:    selectedService.price,
        staff_id:         selectedStaffMember?.id ?? null,
        staff_name:       selectedStaffMember?.name ?? 'Anyone available',
        date:             selectedDate,
        time:             selectedTime,
        customer_name:    form.name,
        customer_email:   form.email,
        customer_phone:   form.phone,
        customer_notes:   form.notes,
        status:           'confirmed',
      })
      setStep('success')
    } catch (err) {
      console.error(err)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: business.primary_color }}>
            {business.name[0]}
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">{business.name}</h1>
            <p className="text-sm text-gray-400">{business.tagline}</p>
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
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </>
        )}

        {step === 'service' && (
          <StepService
            services={services}
            loading={loadingData}
            onSelect={s => { setSelectedService(s); setSelectedStaffId('any'); setStep('staff') }}
          />
        )}
        {step === 'staff' && selectedService && (
          <StepStaff
            service={selectedService}
            availableStaff={availableStaff}
            selectedStaffId={selectedStaffId}
            loading={loadingData}
            onSelect={id => { setSelectedStaffId(id); setStep('datetime') }}
          />
        )}
        {step === 'datetime' && selectedService && (
          <StepDateTime
            service={selectedService}
            selectedStaffMember={selectedStaffMember ?? null}
            availableDates={availableDates}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            slots={slots}
            loadingSlots={loadingSlots}
            onSelectDate={date => { setSelectedDate(date); setSelectedTime('') }}
            onSelectTime={time => { setSelectedTime(time); setStep('details') }}
          />
        )}
        {step === 'details' && (
          <StepDetails
            form={form}
            errors={errors}
            touched={touched}
            onChange={(field, value) => setForm(p => ({ ...p, [field]: value }))}
            onBlur={field => setTouched(p => ({ ...p, [field]: true }))}
            onNext={() => { setTouched({ name: true, email: true, phone: true }); if (formValid) setStep('confirm') }}
          />
        )}
        {step === 'confirm' && selectedService && (
          <StepConfirm
            business={business}
            service={selectedService}
            staffMember={selectedStaffMember ?? null}
            date={selectedDate}
            time={selectedTime}
            form={form}
            submitting={submitting}
            submitError={submitError}
            onConfirm={handleConfirm}
          />
        )}
        {step === 'success' && selectedService && (
          <StepSuccess
            business={business}
            service={selectedService}
            staffMember={selectedStaffMember ?? null}
            date={selectedDate}
            time={selectedTime}
            form={form}
            bookingRef={bookingRef}
          />
        )}
      </main>
    </div>
  )
}
