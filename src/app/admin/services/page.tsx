'use client'
import { useState, useEffect } from 'react'
import { Clock, Loader2 } from 'lucide-react'
import { getServices, upsertService, deleteService } from '@/lib/supabase/queries'
import AdminSkeleton  from '../_components/AdminSkeleton'
import ToastContainer from '../_components/Toast'
import { useToast }   from '@/hooks/useToast'
import { useAdminLang } from '@/hooks/useAdminLang'

type Service = {
  id: string; name: string; description: string
  duration: number; price: number; currency: string
}

const toForm = (s?: Service) => ({
  name:        s?.name        ?? '',
  description: s?.description ?? '',
  duration:    s ? String(s.duration) : '60',
  price:       s ? String(s.price)    : '0',
})

export default function ServicesPage() {
  const { t } = useAdminLang()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]   = useState<Service | null>(null)
  const [form, setForm]         = useState(toForm())
  const [error, setError]       = useState('')
  const { toasts, toast, dismiss } = useToast()

  const load = async () => {
    try {
      const data = await getServices()
      setServices(data ?? [])
      setError('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(toForm()); setEditing(null); setShowModal(true) }
  const openEdit   = (s: Service) => { setForm(toForm(s)); setEditing(s); setShowModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      await upsertService({
        ...(editing ? { id: editing.id } : {}),
        name:        form.name,
        description: form.description,
        duration:    Math.max(5, parseInt(form.duration) || 60),
        price:       Math.max(0, parseFloat(form.price) || 0),
      })
      await load()
      setShowModal(false)
      toast.success(editing ? t.services.toastUpdated : t.services.toastCreated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save service')
      toast.error(t.services.toastSaveFail)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.services.deleteConfirm)) return
    try {
      await deleteService(id)
      await load()
      toast.success(t.services.toastDeleted)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete service')
      toast.error(t.services.toastDeleteFail)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.services.title}</h1>
          <p className="text-gray-400 mt-1">{t.services.sub}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
          {t.services.addService}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">⚠ {error}</div>
      )}

      {loading ? (
        <AdminSkeleton rows={3} />
      ) : (
        <div className="grid gap-4">
          {services.map((s, i) => (
            <div key={s.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-100 transition-all shadow-soft">
              {/* top row: number + info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-600 flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3.5 h-3.5" /> {s.duration} min</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">€{s.price}</span>
                  </div>
                </div>
              </div>
              {/* bottom row: actions — always visible, aligned right */}
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(s)} className="text-sm text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 font-medium transition-colors">{t.services.edit}</button>
                <button onClick={() => handleDelete(s.id)} className="text-sm text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 font-medium transition-colors">{t.services.delete}</button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">✨</p>
              <p className="font-medium">{t.services.noServices}</p>
              <p className="text-sm mt-1">{t.services.noServicesSub}</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editing ? t.services.editService : t.services.newService}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.services.nameLabel}</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder={t.services.namePlaceholder} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.services.descLabel}</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder={t.services.descPlaceholder} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.services.durationLabel}</label>
                  <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                    onFocus={e => e.target.select()}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    min={5} step={5} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.services.priceLabel}</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    onFocus={e => e.target.select()}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    min={0} step={0.5} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.name || saving}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.services.save}
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
