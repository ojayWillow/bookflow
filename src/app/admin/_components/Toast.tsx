'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  variant: ToastVariant
}

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
  error:   <XCircle    className="w-4 h-4 text-red-500   flex-shrink-0" />,
  info:    <Info       className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
}

const BORDER = {
  success: 'border-green-100',
  error:   'border-red-100',
  info:    'border-indigo-100',
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // mount → slide in
    const show   = setTimeout(() => setVisible(true),  10)
    // auto-dismiss after 3.5 s
    const hide   = setTimeout(() => setVisible(false), 3500)
    const remove = setTimeout(() => onDismiss(toast.id), 3800)
    return () => { clearTimeout(show); clearTimeout(hide); clearTimeout(remove) }
  }, [toast.id, onDismiss])

  return (
    <div
      className={`
        flex items-start gap-3 bg-white border-2 ${BORDER[toast.variant]}
        rounded-2xl px-4 py-3 shadow-lg max-w-sm w-full
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {ICONS[toast.variant]}
      <p className="text-sm text-gray-700 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onDismiss }: {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
