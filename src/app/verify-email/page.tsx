import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">BookFlow</span>
        </div>

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Email verified!</h1>
        <p className="text-sm text-gray-500 mb-8">
          Your account is now active. Sign in to access your BookFlow dashboard.
        </p>

        <Link
          href="/admin/login"
          className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm"
        >
          Go to login →
        </Link>
      </div>
    </div>
  )
}
