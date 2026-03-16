'use client'
import { useState } from 'react'
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { useAdminLang } from '@/hooks/useAdminLang'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useAdminLang()
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
        copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? t.share.copied : label}
    </button>
  )
}

const PLATFORMS = [
  { icon: '📸', label: 'Instagram' },
  { icon: '💬', label: 'WhatsApp' },
  { icon: '📍', label: 'Google' },
  { icon: '✉️',  label: 'Email' },
  { icon: '🌐', label: 'Website' },
]

interface Props {
  bookingUrl: string
  iframeCode: string
  whatsappLink: string
  qrUrl: string
}

export default function ShareSection({ bookingUrl, qrUrl }: Props) {
  const { t } = useAdminLang()
  const [btnLabel, setBtnLabel] = useState(t.share.btnDefault)
  const [btnColor, setBtnColor] = useState('#4f46e5')
  const [showQr, setShowQr]     = useState(false)

  const buttonCode = `<a href="${bookingUrl}" target="_blank" style="display:inline-block;background:${btnColor};color:#fff;font-family:sans-serif;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;">${btnLabel}</a>`

  return (
    <div className="space-y-4">

      {/* ── Main link card ── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">

        {/* Link row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2.5 text-xs font-mono text-indigo-600 truncate">
            {bookingUrl}
          </div>
          <CopyButton text={bookingUrl} label={t.share.copy} />
          <a href={bookingUrl} target="_blank"
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex-shrink-0">
            <ExternalLink className="w-3.5 h-3.5" /> {t.share.open}
          </a>
          <button
            type="button"
            onClick={() => setShowQr(v => !v)}
            title="Show QR code"
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0 ${
              showQr
                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                : 'bg-white border-indigo-200 text-indigo-500 hover:bg-indigo-100'
            }`}>
            <QrCode className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform hint pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-indigo-400 mr-0.5">{t.share.worksOn}</span>
          {PLATFORMS.map(p => (
            <span key={p.label}
              className="flex items-center gap-1 text-xs text-indigo-600 bg-white border border-indigo-100 rounded-lg px-2 py-0.5">
              <span>{p.icon}</span> {p.label}
            </span>
          ))}
        </div>

        {/* QR panel — toggled */}
        {showQr && (
          <div className="mt-4 pt-4 border-t border-indigo-100 flex items-center gap-4">
            <div className="border-2 border-indigo-100 rounded-xl p-2 bg-white flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR code" width={80} height={80} className="rounded-lg block" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-900 mb-1">{t.share.qrTitle}</p>
              <p className="text-xs text-indigo-600 leading-relaxed mb-2">{t.share.qrSub}</p>
              <a href={qrUrl} download="bookflow-qr.png"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition-colors">
                {t.share.qrDownload}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Website button generator ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-1">{t.share.btnGenTitle}</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">{t.share.btnGenSub}</p>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.share.btnLabel}</label>
            <input type="text" value={btnLabel} onChange={e => setBtnLabel(e.target.value)}
              placeholder="e.g. Book a visit"
              className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.share.btnColour}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={btnColor} onChange={e => setBtnColor(e.target.value)}
                className="w-10 h-10 rounded-lg border-2 border-gray-100 cursor-pointer p-0.5" />
              <input type="text" value={btnColor} onChange={e => setBtnColor(e.target.value)}
                className="w-24 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-300 transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-3 min-h-[56px]">
          <a href={bookingUrl} target="_blank" style={{ background: btnColor }}
            className="inline-block text-white font-semibold px-7 py-2.5 rounded-[10px] text-sm no-underline"
            onClick={e => e.preventDefault()}>
            {btnLabel || t.share.btnDefault}
          </a>
        </div>

        <div className="bg-gray-900 rounded-xl p-3">
          <div className="flex items-start justify-between gap-3">
            <code className="text-xs text-green-400 leading-relaxed break-all flex-1 font-mono">{buttonCode}</code>
            <CopyButton text={buttonCode} label={t.share.copyCode} />
          </div>
        </div>
      </div>

    </div>
  )
}
