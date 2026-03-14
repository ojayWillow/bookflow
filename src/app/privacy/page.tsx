import Link from 'next/link'
import { Calendar } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | BookFlow',
  description: 'How BookFlow collects, uses and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">BookFlow</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-600">

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Who we are</h2>
              <p>BookFlow (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an online booking platform that enables businesses to accept appointments from their customers. Our service is operated from the European Union and we are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. What data we collect</h2>
              <p className="mb-3">We collect different data depending on how you use BookFlow:</p>
              <p className="font-medium text-gray-800 mb-1">Business owners (account holders):</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Name, email address and password (hashed)</li>
                <li>Business name, address, phone number</li>
                <li>Business settings, services and staff information</li>
                <li>Booking history associated with your account</li>
              </ul>
              <p className="font-medium text-gray-800 mb-1">Customers making bookings:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, email address and phone number</li>
                <li>Appointment details (service, date, time, notes)</li>
                <li>IP address and browser information (collected automatically)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How we use your data</h2>
              <p className="mb-3">We use collected data to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide and operate the BookFlow service</li>
                <li>Send booking confirmation and reminder emails</li>
                <li>Enable business owners to manage their appointments</li>
                <li>Improve and secure our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-3">We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Data storage and security</h2>
              <p>Your data is stored securely on <strong>Supabase</strong> infrastructure hosted within the European Union. We use industry-standard encryption (TLS) for all data in transit and at rest. Access to production data is strictly limited to authorised personnel.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Third-party services</h2>
              <p className="mb-3">We use the following third-party services to operate BookFlow:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Supabase</strong> — database and authentication</li>
                <li><strong>Resend</strong> — transactional email delivery</li>
                <li><strong>Vercel</strong> — hosting and deployment</li>
              </ul>
              <p className="mt-3">Each of these providers has their own privacy policy and is GDPR-compliant.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your rights (GDPR)</h2>
              <p className="mb-3">If you are located in the EU/EEA, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Access</strong> — request a copy of the data we hold about you</li>
                <li><strong>Rectification</strong> — request correction of inaccurate data</li>
                <li><strong>Erasure</strong> — request deletion of your personal data</li>
                <li><strong>Portability</strong> — receive your data in a portable format</li>
                <li><strong>Object</strong> — object to processing based on legitimate interests</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, please contact us at the email below.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Cookies</h2>
              <p>BookFlow uses only essential cookies required for authentication and session management. We do not use tracking or advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Data retention</h2>
              <p>We retain your data for as long as your account is active. If you close your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or tax purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Contact</h2>
              <p>For any privacy-related questions or requests, please contact us at: <a href="mailto:privacy@bookflow.app" className="text-indigo-600 hover:underline">privacy@bookflow.app</a></p>
            </section>

          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-gray-400">
        <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
      </footer>
    </div>
  )
}
