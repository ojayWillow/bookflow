'use client'
import { useState } from 'react'
import { businessSettings, services, staff } from '@/data/mock'
import { getSlotsForDate, getAvailableDates } from '@/lib/slots'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, CheckCircle, MapPin, Phone, Mail, ChevronLeft, User, Users } from 'lucide-react'

type Step = 'service' | 'staff' | 'datetime' | 'details' | 'confirm' | 'success'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const STEP_LABELS = ['Service', 'Who', 'Date & Time', 'Details', 'Confirm']

export default function BookingPage() {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [bookingRef] = useState(() => 'BF-' + Math.random().toString(36).substring(2, 8).toUpperCase())

  const b = businessSettings
  const availableDates = getAvailableDates()
  const bookedSlots = ['10:00', '11:00', '14:00']
  const slots = selectedService && selectedDate
    ? getSlotsForDate(selectedDate, selectedService.duration, bookedSlots)
    : []

  // Staff available for selected service
  const availableStaff = selectedService
    ? staff.filter(m => m.active && m.serviceIds.includes(selectedService.id))
    : []

  const selectedStaffMember = selectedStaffId !== 'any'
    ? staff.find(m => m.id === selectedStaffId)
    : null

  const stepKeys: Step[] = ['service', 'staff', 'datetime', 'details', 'confirm']
  const stepIndex = stepKeys.indexOf(step)

  const goBack = () => {
    if (stepIndex > 0) setStep(stepKeys[stepIndex - 1])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {b.name[0]}
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">{b.name}</h1>
            <p className="text-sm text-gray-400">{b.tagline}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {step !== 'success' && (
          <>
            {/* Progress */}
            <div className="flex items-center mb-8">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      stepIndex > i ? 'bg-indigo-600 text-white'
                      : stepIndex === i ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-gray-200 text-gray-400'
                    }`}>
                      {stepIndex > i ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      stepIndex >= i ? 'text-indigo-600' : 'text-gray-400'
                    }`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${
                    stepIndex > i ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />}
                </div>
              ))}
            </div>
            {stepIndex > 0 && (
              <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </>
        )}

        {/* STEP 1 — Service */}
        {step === 'service' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Choose a service</h2>
            <p className="text-gray-400 text-sm mb-6">Select what you'd like to book</p>
            <div className="space-y-3">
              {services.map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); setSelectedStaffId('any'); setStep('staff') }}
                  className="w-full text-left bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-soft transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{s.description}</p>
                      <span className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <Clock className="w-3.5 h-3.5" /> {s.duration} min
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">€{s.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Staff */}
        {step === 'staff' && selectedService && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Choose who you'd like</h2>
            <p className="text-gray-400 text-sm mb-6">{selectedService.name} · {selectedService.duration} min · €{selectedService.price}</p>
            <div className="space-y-3">

              {/* Anyone option */}
              <button onClick={() => { setSelectedStaffId('any'); setStep('datetime') }}
                className={`w-full text-left bg-white border-2 rounded-2xl p-5 hover:border-indigo-400 transition-all ${
                  selectedStaffId === 'any' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'
                }`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anyone available</p>
                    <p className="text-sm text-gray-400">Show me the first available slot</p>
                  </div>
                </div>
              </button>

              {/* Individual staff */}
              {availableStaff.map(m => (
                <button key={m.id} onClick={() => { setSelectedStaffId(m.id); setStep('datetime') }}
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
          </div>
        )}

        {/* STEP 3 — Date & Time */}
        {step === 'datetime' && selectedService && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Pick a date & time</h2>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-sm text-gray-400">{selectedService.name}</span>
              <span className="text-gray-300">·</span>
              {selectedStaffMember ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: selectedStaffMember.color }}>
                    {selectedStaffMember.name[0]}
                  </div>
                  <span className="text-sm text-gray-400">{selectedStaffMember.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Anyone available</span>
              )}
            </div>

            {/* Dates */}
            <p className="text-sm font-medium text-gray-700 mb-3">Select a date</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
              {availableDates.slice(0, 14).map(date => {
                const d = parseISO(date)
                const isSelected = date === selectedDate
                return (
                  <button key={date} onClick={() => { setSelectedDate(date); setSelectedTime('') }}
                    className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-100 bg-white hover:border-indigo-300'
                    }`}>
                    <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{DAYS_SHORT[d.getDay()]}</span>
                    <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{format(d, 'd')}</span>
                    <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>{format(d, 'MMM')}</span>
                  </button>
                )
              })}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select a time</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {slots.map(slot => (
                    <button key={slot.time} disabled={!slot.available}
                      onClick={() => { setSelectedTime(slot.time); setStep('details') }}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        !slot.available
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-100 bg-white hover:border-indigo-400 text-gray-700'
                      }`}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Details */}
        {step === 'details' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Your details</h2>
            <p className="text-gray-400 text-sm mb-6">We'll send your confirmation to the email below</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name <span className="text-red-400">*</span></label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="e.g. Anna Bērziņa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address <span className="text-red-400">*</span></label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="anna@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number <span className="text-red-400">*</span></label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="+371 2612 3456" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={3} placeholder="Any special requests?" />
              </div>
            </div>
            <button onClick={() => setStep('confirm')}
              disabled={!form.name || !form.email || !form.phone}
              className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Review booking →
            </button>
          </div>
        )}

        {/* STEP 5 — Confirm */}
        {step === 'confirm' && selectedService && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Review your booking</h2>
            <p className="text-gray-400 text-sm mb-6">Please check everything before confirming</p>
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden mb-5">
              <div className="bg-indigo-600 px-6 py-4">
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Booking Summary</p>
                <p className="text-white font-bold text-lg mt-1">{b.name}</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  ['Service', selectedService.name],
                  ['Duration', `${selectedService.duration} minutes`],
                  ['Price', `€${selectedService.price}`],
                  ['Staff', selectedStaffMember ? selectedStaffMember.name : 'Anyone available'],
                  ['Date', format(parseISO(selectedDate), 'EEEE, d MMMM yyyy')],
                  ['Time', selectedTime],
                  ['Name', form.name],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ...(form.notes ? [['Notes', form.notes]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-6 py-3.5">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-amber-700"><span className="font-semibold">Cancellation policy:</span> {b.cancellationPolicy}</p>
            </div>
            <button onClick={() => setStep('success')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Confirm booking ✓
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && selectedService && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're booked!</h2>
            <p className="text-gray-400 mb-1">Confirmation sent to <span className="font-medium text-gray-700">{form.email}</span></p>
            <p className="text-sm text-gray-400 mb-8">Booking ref: <span className="font-mono font-bold text-indigo-600">{bookingRef}</span></p>
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden text-left mb-6">
              <div className="bg-green-600 px-6 py-4">
                <p className="text-white font-bold">{selectedService.name}</p>
                <p className="text-white/80 text-sm">{format(parseISO(selectedDate), 'EEEE, d MMMM yyyy')} at {selectedTime}</p>
              </div>
              <div className="p-5 space-y-3">
                {selectedStaffMember && (
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: selectedStaffMember.color }}>
                      {selectedStaffMember.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedStaffMember.name}</p>
                      <p className="text-xs text-gray-400">{selectedStaffMember.role}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />{b.address}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />{b.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />{b.email}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">{b.cancellationPolicy}</p>
          </div>
        )}
      </main>
    </div>
  )
}
