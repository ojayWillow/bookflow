'use client'
import { useState } from 'react'
import { Copy, Check, ExternalLink, ChevronDown, ChevronUp, Download } from 'lucide-react'
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
  { icon: '\uD83D\uDCF8', label: 'Instagram' },
  { icon: '\uD83D\uDCAC', label: 'WhatsApp' },
  { icon: '\uD83D\uDCCD', label: 'Google' },
  { icon: '\u2709\uFE0F',  label: 'Email' },
  { icon: '\uD83C\uDF10', label: 'Website' },
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
  const [codeOpen, setCodeOpen] = useState(false)

  const buttonCode = `<a href="${bookingUrl}" target="_blank" style="display:inline-block;background:${btnColor};color:#fff;font-family:sans-serif;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;">${btnLabel}</a>`

  // QR PNG download via canvas trick (no server round-trip)
  const qrDownloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(bookingUrl)}&format=png`
  const qrSvgUrl      = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(bookingUrl)}&format=svg`

  return (
    <div className="space-y-4">

      {/* ── Section 1: URL + share row ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5">

        {/* URL bar — full width, then action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono text-indigo-600 truncate min-w-0">
            {bookingUrl}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <CopyButton text={bookingUrl} label={t.share.copy} />
            <a
              href={bookingUrl}
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
              {t.share.open}
            </a>
          </div>
        </div>

        {/* Platform chips — wrapping */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 mr-0.5">{t.share.worksOn}</span>
          {PLATFORMS.map(p => (
            <span
              key={p.label}
              className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <span>{p.icon}</span> {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 2: Booking button generator ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">{t.share.btnGenTitle}</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">{t.share.btnGenSub}</p>

        {/* Inputs — stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.share.btnLabel}</label>
            <input
              type="text"
              value={btnLabel}
              onChange={e => setBtnLabel(e.target.value)}
              placeholder="e.g. Book a visit"
              className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 transition-colors"
            />
          </div>
          <div className="flex-shrink-0">
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.share.btnColour}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={btnColor}
                onChange={e => setBtnColor(e.target.value)}
                className="w-10 h-10 rounded-lg border-2 border-gray-100 cursor-pointer p-0.5 flex-shrink-0"
              />
              <input
                type="text"
                value={btnColor}
                onChange={e => setBtnColor(e.target.value)}
                className="w-28 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-300 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-3 min-h-[56px]">
          <a
            href={bookingUrl}
            target="_blank"
            style={{ background: btnColor }}
            className="inline-block text-white font-semibold px-7 py-2.5 rounded-[10px] text-sm no-underline"
            onClick={e => e.preventDefault()}>
            {btnLabel || t.share.btnDefault}
          </a>
        </div>

        {/* Collapsible code block */}
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => setCodeOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 text-xs text-green-400 font-mono hover:bg-gray-800 transition-colors">
            <span className="flex items-center gap-2">
              <span className="text-gray-500">&lt;&nbsp;&gt;</span>
              {codeOpen ? t.share.codeCollapse : t.share.codeExpand}
            </span>
            {codeOpen
              ? <ChevronUp  className="w-4 h-4 text-gray-500 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
          </button>
          {codeOpen && (
            <div className="bg-gray-900 px-4 pb-4">
              <div className="flex items-start justify-between gap-3 pt-1">
                <code className="text-xs text-green-400 leading-relaxed break-all flex-1 font-mono whitespace-pre-wrap">
                  {buttonCode}
                </code>
                <CopyButton text={buttonCode} label={t.share.copyCode} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: QR Code ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">{t.share.qrTitle}</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">{t.share.qrSub}</p>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* QR preview */}
          <div className="border-2 border-gray-100 rounded-xl p-2 bg-gray-50 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR code" width={100} height={100} className="rounded-lg block" />
          </div>

          {/* Download actions */}
          <div className="flex flex-col gap-2">
            <a
              href={qrDownloadUrl}
              download="bookflow-qr.png"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <Download className="w-3.5 h-3.5" />
              {t.share.qrDownload} PNG
            </a>
            <a
              href={qrSvgUrl}
              download="bookflow-qr.svg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              {t.share.qrDownload} SVG
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
