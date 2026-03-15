'use client'
import { useState } from 'react'
import { Copy, Check, ExternalLink, QrCode, MapPin, MessageCircle } from 'lucide-react'

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
        copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

interface Props {
  bookingUrl: string
  iframeCode: string
  whatsappLink: string
  qrUrl: string
}

export default function ShareSection({ bookingUrl, whatsappLink, qrUrl }: Props) {
  const [btnLabel, setBtnLabel] = useState('Book now')
  const [btnColor, setBtnColor] = useState('#4f46e5')

  const buttonCode = `<a href="${bookingUrl}" target="_blank" style="display:inline-block;background:${btnColor};color:#fff;font-family:sans-serif;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;">${btnLabel}</a>`

  return (
    <div className="space-y-6">

      {/* ── One link intro ── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-indigo-900 mb-1">One link. Works everywhere.</p>
        <p className="text-xs text-indigo-700 leading-relaxed mb-4">
          This is your booking page link. Share it in your Instagram bio, WhatsApp, email signature, Google Business, or anywhere else — it always opens your booking page.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-600 truncate">
            {bookingUrl}
          </div>
          <CopyButton text={bookingUrl} label="Copy link" />
          <a
            href={bookingUrl}
            target="_blank"
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open
          </a>
        </div>
      </div>

      {/* ── Button generator ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-900 mb-1">Add a booking button to your website</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Name it whatever you like — "Book a table", "Schedule a visit", "Reserve now". Paste the snippet anywhere on your site.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Button text</label>
            <input
              type="text"
              value={btnLabel}
              onChange={e => setBtnLabel(e.target.value)}
              placeholder="e.g. Book a visit"
              className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Button colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={btnColor}
                onChange={e => setBtnColor(e.target.value)}
                className="w-10 h-10 rounded-lg border-2 border-gray-100 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={btnColor}
                onChange={e => setBtnColor(e.target.value)}
                className="w-24 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-300 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center mb-4 min-h-[64px]">
          <a
            href={bookingUrl}
            target="_blank"
            style={{ background: btnColor }}
            className="inline-block text-white font-semibold px-7 py-3 rounded-[10px] text-sm no-underline"
            onClick={e => e.preventDefault()}
          >
            {btnLabel || 'Book now'}
          </a>
        </div>

        {/* Code snippet */}
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <code className="text-xs text-green-400 leading-relaxed break-all flex-1 font-mono">
              {buttonCode}
            </code>
            <CopyButton text={buttonCode} label="Copy code" />
          </div>
        </div>
      </div>

      {/* ── QR code ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <QrCode className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-900">QR code</span>
        </div>
        <div className="flex items-start gap-5">
          <div className="border-2 border-gray-100 rounded-2xl p-3 bg-white flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR code" width={100} height={100} className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 leading-relaxed">Print it on a business card, flyer or table stand. Customers scan it and land straight on your booking page.</p>
            <a
              href={qrUrl}
              download="bookflow-qr.png"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              ⬇ Download QR
            </a>
          </div>
        </div>
      </div>

      {/* ── Quick tips ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3">Where to share your link</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
            <MessageCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-800">WhatsApp</p>
              <p className="text-xs text-gray-500 mt-0.5">Add to your WhatsApp Business profile under Website, or send it directly to customers.</p>
              <CopyButton text={whatsappLink} label="Copy WhatsApp link" />
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            <span className="text-base mt-0.5">📸</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">Instagram</p>
              <p className="text-xs text-gray-500 mt-0.5">Paste your booking link in your bio. Add "Book here 👇" to your posts.</p>
              <CopyButton text={bookingUrl} label="Copy link" />
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
            <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-800">Google Business</p>
              <p className="text-xs text-gray-500 mt-0.5">Add your link under Booking in your Google Business profile. A "Book online" button appears on Maps.</p>
              <CopyButton text={bookingUrl} label="Copy link" />
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
            <span className="text-base mt-0.5">✉️</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">Email signature</p>
              <p className="text-xs text-gray-500 mt-0.5">Add your booking link to every email you send. Customers can book directly from your signature.</p>
              <CopyButton text={bookingUrl} label="Copy link" />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
