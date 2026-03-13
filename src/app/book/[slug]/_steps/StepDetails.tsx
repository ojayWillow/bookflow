import type { BookingForm } from '../types'

type Errors = { name: string; email: string; phone: string }
type Touched = { name: boolean; email: boolean; phone: boolean }

type Props = {
  form: BookingForm
  errors: Errors
  touched: Touched
  onChange: (field: keyof BookingForm, value: string) => void
  onBlur: (field: keyof Touched) => void
  onNext: () => void
}

export default function StepDetails({ form, errors, touched, onChange, onBlur, onNext }: Props) {
  const fieldClass = (field: keyof Errors) =>
    `w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${
      touched[field] && errors[field]    ? 'border-red-300 focus:border-red-400 bg-red-50'
      : touched[field] && !errors[field] ? 'border-green-300 focus:border-green-400'
      : 'border-gray-100 focus:border-indigo-400'
    }`

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Your details</h2>
      <p className="text-gray-400 text-sm mb-6">We&apos;ll send your confirmation to the email below</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name <span className="text-red-400">*</span></label>
          <input
            value={form.name}
            onChange={e => onChange('name', e.target.value)}
            onBlur={() => onBlur('name')}
            className={fieldClass('name')}
            placeholder="e.g. Anna Bērziņa"
          />
          {touched.name && errors.name  && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.name}</p>}
          {touched.name && !errors.name && <p className="text-xs text-green-600 mt-1.5">✓ Looks good</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={e => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            className={fieldClass('email')}
            placeholder="anna@example.com"
          />
          {touched.email && errors.email  && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.email}</p>}
          {touched.email && !errors.email && <p className="text-xs text-green-600 mt-1.5">✓ Looks good</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number <span className="text-red-400">*</span></label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            className={fieldClass('phone')}
            placeholder="+371 2612 3456"
          />
          {touched.phone && errors.phone  && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.phone}</p>}
          {touched.phone && !errors.phone && <p className="text-xs text-green-600 mt-1.5">✓ Looks good</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={e => onChange('notes', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
            rows={3}
            placeholder="Any special requests or things we should know?"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
        Review booking →
      </button>
    </div>
  )
}
