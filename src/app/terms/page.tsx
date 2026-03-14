import Link from 'next/link'
import { Calendar } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | BookFlow',
  description: 'The terms governing your use of the BookFlow platform.',
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-600">

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of terms</h2>
              <p>By creating an account or using BookFlow (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all users including business owners and their customers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of service</h2>
              <p>BookFlow provides an online appointment booking platform. Business owners can create an account, configure their services and staff, and receive bookings through a personalised booking page. Customers can use these booking pages to schedule appointments without creating an account.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Account responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must provide accurate information when creating your account</li>
                <li>You are responsible for maintaining the security of your password</li>
                <li>You must notify us immediately of any unauthorised use of your account</li>
                <li>One account per business unless otherwise agreed in writing</li>
                <li>Your booking page URL (slug) is permanent and cannot be transferred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Acceptable use</h2>
              <p className="mb-3">You agree not to use BookFlow to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Send spam or unsolicited communications to customers</li>
                <li>Impersonate any person or business</li>
                <li>Attempt to gain unauthorised access to other accounts or data</li>
                <li>Use the platform for any purpose other than legitimate appointment booking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Free trial and billing</h2>
              <p>All plans include a 7-day free trial with no credit card required. After the trial period, continued use of the Service requires a paid subscription. We reserve the right to suspend accounts that remain unpaid after the trial ends. Pricing is listed on our website and may change with 30 days written notice to existing subscribers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Data and privacy</h2>
              <p>Your use of BookFlow is also governed by our <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>. By using the Service, you consent to the collection and use of data as described therein. As a business owner, you are the data controller for your customers&apos; personal data collected through your booking page and are responsible for your own GDPR compliance obligations towards them.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Availability and uptime</h2>
              <p>We strive to maintain high availability but do not guarantee uninterrupted service. We may carry out maintenance, updates or emergency fixes that temporarily affect access. We will endeavour to provide advance notice of planned downtime where possible.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, BookFlow shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the Service, including but not limited to lost revenue, lost bookings or data loss. Our total liability shall not exceed the amount you paid us in the 3 months preceding the claim.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Termination</h2>
              <p>You may cancel your account at any time. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, your booking page will be deactivated and your data will be deleted within 30 days in accordance with our Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to terms</h2>
              <p>We may update these Terms from time to time. We will notify you of significant changes by email. Continued use of the Service after changes take effect constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Governing law</h2>
              <p>These Terms are governed by the laws of the Republic of Latvia and the European Union. Any disputes shall be subject to the exclusive jurisdiction of the courts of Latvia.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Contact</h2>
              <p>For any questions regarding these Terms, please contact: <a href="mailto:legal@bookflow.app" className="text-indigo-600 hover:underline">legal@bookflow.app</a></p>
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
