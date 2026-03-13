'use client'
import { useState, useRef } from 'react'
import { Loader2, Upload, X } from 'lucide-react'

export default function ImageUpload({
  label, hint, field, currentUrl, onUploaded,
}: {
  label: string
  hint: string
  field: 'logo_url' | 'cover_url'
  currentUrl: string
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const MAX     = 5 * 1024 * 1024
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!ALLOWED.includes(file.type)) { setUploadError('Only JPEG, PNG, WebP or GIF allowed'); return }
    if (file.size > MAX)              { setUploadError('File must be under 5 MB'); return }

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('field', field)

      const res  = await fetch('/api/upload-asset', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Upload failed')

      onUploaded(json.url)
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    onUploaded('')
    await fetch('/api/settings', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ [field]: '' }),
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-xs text-gray-400 mb-2">{hint}</p>

      {currentUrl ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt={label}
            className={`object-cover rounded-xl border-2 border-gray-100 ${
              field === 'logo_url' ? 'w-20 h-20' : 'w-full h-28'
            }`}
          />
          <button onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
        >
          {uploading
            ? <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            : <>
                <Upload className="w-6 h-6 text-gray-300" />
                <p className="text-xs text-gray-400 text-center">Click or drag &amp; drop<br /><span className="text-gray-300">JPEG, PNG, WebP &middot; max 5 MB</span></p>
              </>
          }
        </div>
      )}

      {uploadError && <p className="text-xs text-red-500 mt-1.5">⚠ {uploadError}</p>}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
