'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

interface Props {
  locale: string
  emailPlaceholder: string
  cta: string
}

export default function HeroSignupForm({ locale, emailPlaceholder, cta }: Props) {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/${locale}/signup?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="p-1.5 bg-white rounded-2xl shadow-lg ring-1 ring-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder={emailPlaceholder}
          className="flex-1 h-12 border-2 border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-white w-full shadow-sm placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="h-12 bg-indigo-600 text-white px-6 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto shadow-lg shadow-indigo-200"
        >
          {cta} <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
