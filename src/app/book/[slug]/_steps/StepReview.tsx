'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import type { Business } from '../types'
import type { PublicDict } from '@/i18n/en'

type Props = {
  business: Business
  dict: PublicDict['booking']
  onDone: () => void
}

export default function StepReview({ business, dict: t, onDone }: Props) {
  const [clicked, setClicked] = useState(false)

  const handleReviewClick = () => {
    window.open(business.google_maps_url, '_blank', 'noopener,noreferrer')
    setClicked(true)
  }

  return (
    <div className="text-center py-8">
      {/* Icon */}
      <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <Star className="w-10 h-10 text-yellow-400" fill="currentColor" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t.reviewTitle}
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        {t.reviewSubtitle.replace('{{business}}', business.name)}
      </p>

      {/* Star row — decorative */}
      <div className="flex items-center justify-center gap-1 mb-8">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className="w-8 h-8 text-yellow-400" fill="currentColor" />
        ))}
      </div>

      {!clicked ? (
        <>
          <button
            onClick={handleReviewClick}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3.5 rounded-xl transition-colors text-sm mb-3"
          >
            {t.reviewCta}
          </button>
          <button
            onClick={onDone}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            {t.reviewSkip}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-green-600 font-medium mb-4">
            {t.reviewThanks}
          </p>
          <button
            onClick={onDone}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            {t.reviewDone}
          </button>
        </>
      )}
    </div>
  )
}
