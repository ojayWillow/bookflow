import { format, parseISO } from 'date-fns'
import { CheckCircle, MapPin, Phone, Mail, Globe, Instagram, Facebook } from 'lucide-react'
import type { DBService, DBStaffMember, Business, BookingForm } from '../types'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}

type Props = {
  business: Business
  service: DBService
  staffMember: DBStaffMember | null
  date: string
  time: string
  form: BookingForm
  bookingRef: string
}

export default function StepSuccess({ business, service, staffMember, date, time, form, bookingRef }: Props) {
  const hasSocial = business.instagram_url || business.facebook_url || business.tiktok_url || business.website_url

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re booked!</h2>
      <p className="text-gray-400 mb-1">
        Confirmation sent to <span className="font-medium text-gray-700">{form.email}</span>
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Booking ref: <span className="font-mono font-bold text-indigo-600">{bookingRef}</span>
      </p>

      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden text-left mb-6">
        <div className="bg-green-600 px-6 py-4">
          <p className="text-white font-bold">{service.name}</p>
          <p className="text-white/80 text-sm">{format(parseISO(date), 'EEEE, d MMMM yyyy')} at {time}</p>
        </div>
        <div className="p-5 space-y-3">
          {staffMember && (
            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: staffMember.color }}>
                {staffMember.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{staffMember.name}</p>
                <p className="text-xs text-gray-400">{staffMember.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />{business.address}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />{business.phone}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />{business.email}
          </div>
        </div>
      </div>

      {/* Social links on success screen */}
      {hasSocial && (
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3">Follow us</p>
          <div className="flex items-center justify-center gap-3">
            {business.website_url && (
              <a href={business.website_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            )}
            {business.instagram_url && (
              <a href={business.instagram_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {business.facebook_url && (
              <a href={business.facebook_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {business.tiktok_url && (
              <a href={business.tiktok_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">{business.cancellation_policy}</p>
    </div>
  )
}
