import Link from 'next/link'
import { Calendar, Mail } from 'lucide-react'

export default function SignupConfirmPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8 text-center">

        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">BookFlow</span>
        </div>

        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h1>
        <p className="text-sm text-gray-500 mb-2">
          We sent a confirmation link to your email address.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Click the link in the email to activate your account, then come back and sign in.
        </p>

        <Link
          href="/admin/login"
          className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm mb-3"
        >
          Go to login &rarr;
        </Link>

        <p className="text-xs text-gray-400">
          Didn&apos;t get the email? Check your spam folder or{' '}
          <Link href="/signup" className="text-indigo-500 hover:underline">try signing up again</Link>.
        </p>
      </div>
    </div>
  )
}
