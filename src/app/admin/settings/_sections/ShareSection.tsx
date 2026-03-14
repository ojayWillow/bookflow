'use client'
import { useState } from 'react'
import { Globe, QrCode, Code2, MessageCircle, MapPin, ExternalLink, Copy, Check } from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
        copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

interface Props {
  bookingUrl: string
  iframeCode: string
  whatsappLink: string
  qrUrl: string
}

export default function ShareSection({ bookingUrl, iframeCode, whatsappLink, qrUrl }: Props) {
  return (
    <section className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900 mb-1">🔗 Share &amp; distribute</h2>
      <p className="text-sm text-gray-400 mb-5">Get your booking page in front of customers</p>
      <div className="space-y-5">

        {/* Booking link */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">Your booking link</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-600 truncate">{bookingUrl}</div>
            <CopyButton text={bookingUrl} />
            <a href={bookingUrl} target="_blank" className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
          </div>
        </div>

        {/* QR */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">QR code</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="border-2 border-gray-100 rounded-2xl p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR code" width={120} height={120} className="rounded-lg" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs text-gray-500 leading-relaxed">Customers scan this with their phone camera and go straight to your booking page.</p>
              <a href={qrUrl} download="bookflow-qr.png"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                ⬇ Download QR PNG
              </a>
            </div>
          </div>
        </div>

        {/* Embed */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">Embed on your website</span>
          </div>
          <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <code className="text-xs text-gray-600 leading-relaxed break-all flex-1 font-mono">{iframeCode}</code>
              <div className="flex-shrink-0"><CopyButton text={iframeCode} /></div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">WhatsApp Business</span>
          </div>
          <div className="bg-green-50 border-2 border-green-100 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Option A — Add booking link to your WhatsApp profile</p>
              <p className="text-xs text-gray-400 leading-relaxed">In WhatsApp Business: <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Settings → Business profile → Website</span> → paste your booking link.</p>
            </div>
            <div className="border-t border-green-100 pt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Option B — Click-to-chat link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs font-mono text-green-700 truncate">{whatsappLink}</div>
                <CopyButton text={whatsappLink} />
              </div>
            </div>
          </div>
        </div>

        {/* Google */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-gray-700">Google Business Profile</span>
          </div>
          <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 space-y-3">
            <ol className="text-xs text-gray-500 space-y-1.5 leading-relaxed">
              <li><span className="font-semibold text-gray-700">1.</span> Go to <a href="https://business.google.com" target="_blank" className="text-indigo-600 underline">business.google.com</a> and sign in</li>
              <li><span className="font-semibold text-gray-700">2.</span> Select your business → <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Edit profile → Contact</span></li>
              <li><span className="font-semibold text-gray-700">3.</span> Under <span className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-700">Booking</span>, paste your booking link</li>
              <li><span className="font-semibold text-gray-700">4.</span> A &quot;Book online&quot; button appears on Maps within 24h</li>
            </ol>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 bg-white border border-red-200 rounded-lg px-3 py-2 text-xs font-mono text-red-700 truncate">{bookingUrl}</div>
              <CopyButton text={bookingUrl} />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
