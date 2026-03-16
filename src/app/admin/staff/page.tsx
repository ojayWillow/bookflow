'use client'
import { useState, useEffect, useRef } from 'react'
import { Clock, Plus, X, Search, Loader2, Camera, Coffee } from 'lucide-react'
import Image from 'next/image'
import {
  getStaff, upsertStaffMember, deleteStaffMember, getServices,
} from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/client'
import AdminSkeleton  from '../_components/AdminSkeleton'
import ToastContainer from '../_components/Toast'
import { useToast }   from '@/hooks/useToast'
import { useAdminLang } from '@/hooks/useAdminLang'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']

type DBService = { id: string; name: string; duration: number; price: number }
type DBStaff = {
  id: string; name: string; role: string; bio: string
  service_ids: string[]; work_days: number[]
  work_start: string; work_end: string
  active: boolean; color: string
  avatar_url: string | null
  break_start: string | null
  break_end: string | null
}

const emptyForm = {
  name: '', role: '', bio: '',
  service_ids: [] as string[],
  work_days: [1, 2, 3, 4, 5] as number[],
  work_start: '09:00', work_end: '18:00',
  active: true, color: '#6366f1',
  avatar_url: null as string | null,
  break_start: '' as string,
  break_end: '' as string,
}

/** Resize + compress any image to max 400×400 JPEG at 80% quality */
function resizeImage(file: File, maxPx = 400, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const w = Math.round(img.width  * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export default function StaffPage() {
  const { t } = useAdminLang()
  const [members, setMembers]     = useState<DBStaff[]>([])
  const [services, setServices]   = useState<DBService[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState<DBStaff | null>(null)
  const [form, setForm]           = useState({ ...emptyForm })
  const [skillSearch, setSkillSearch] = useState('')
  const [error, setError]         = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toasts, toast, dismiss } = useToast()

  const loadAll = async () => {
    try {
      const [staffData, svcData] = await Promise.all([getStaff(), getServices()])
      setMembers((staffData ?? []) as DBStaff[])
      setServices((svcData  ?? []) as DBService[])
      setError('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const openCreate = () => { setForm({ ...emptyForm }); setEditing(null); setSkillSearch(''); setShowModal(true) }
  const openEdit   = (m: DBStaff) => {
    setForm({
      name: m.name, role: m.role, bio: m.bio,
      service_ids: [...m.service_ids],
      work_days: [...m.work_days],
      work_start: m.work_start, work_end: m.work_end,
      active: m.active, color: m.color,
      avatar_url: m.avatar_url ?? null,
      break_start: m.break_start ?? '',
      break_end: m.break_end ?? '',
    })
    setEditing(m); setSkillSearch(''); setShowModal(true)
  }

  const handleAvatarUpload = async (file: File) => {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!ALLOWED.includes(file.type)) { toast.error('Only JPEG, PNG, WebP or GIF allowed'); return }
    if (file.size > 10 * 1024 * 1024)  { toast.error('File must be under 10 MB'); return }

    setAvatarUploading(true)
    try {
      const resized = await resizeImage(file)
      const supabase = createClient()
      const path = `staff-avatars/${Date.now()}.jpg`
      const { error: upErr } = await supabase.storage
        .from('business-assets')
        .upload(path, resized, { contentType: 'image/jpeg', upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(path)
      setForm(p => ({ ...p, avatar_url: publicUrl }))
    } catch (e: unknown) {
      toast.error('Failed to upload photo')
      console.error(e)
    } finally {
      setAvatarUploading(false)
    }
  }

  const toggleService = (id: string) =>
    setForm(p => ({ ...p, service_ids: p.service_ids.includes(id)
      ? p.service_ids.filter(s => s !== id)
      : [...p.service_ids, id] }))

  const toggleDay = (d: number) =>
    setForm(p => ({ ...p, work_days: p.work_days.includes(d)
      ? p.work_days.filter(x => x !== d)
      : [...p.work_days, d].sort() }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      await upsertStaffMember({
        ...(editing ? { id: editing.id } : {}),
        name: form.name, role: form.role, bio: form.bio,
        service_ids: form.service_ids, work_days: form.work_days,
        work_start: form.work_start, work_end: form.work_end,
        active: form.active, color: form.color,
        avatar_url: form.avatar_url,
        break_start: form.break_start || null,
        break_end:   form.break_end   || null,
      })
      await loadAll()
      setShowModal(false)
      toast.success(editing ? t.staff.toastUpdated : t.staff.toastAdded)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save staff member')
      toast.error(t.staff.toastSaveFail)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.staff.removeConfirm)) return
    try {
      await deleteStaffMember(id)
      await loadAll()
      toast.success(t.staff.toastRemoved)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete staff member')
      toast.error(t.staff.toastRemoveFail)
    }
  }

  const handleToggleActive = async (m: DBStaff) => {
    try {
      await upsertStaffMember({ ...m, active: !m.active })
      await loadAll()
      toast.success(m.active
        ? t.staff.toastDeactivated.replace('{{name}}', m.name)
        : t.staff.toastActivated.replace('{{name}}', m.name)
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update staff member')
      toast.error(t.staff.toastToggleFail)
    }
  }

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.staff.title}</h1>
          <p className="text-gray-400 mt-1">
            {t.staff.activeSub
              .replace('{{active}}', String(members.filter(m => m.active).length))
              .replace('{{total}}', String(members.length))}
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> {t.staff.addMember}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">⚠ {error}</div>
      )}

      {loading ? (
        <AdminSkeleton rows={3} />
      ) : (
        <div className="grid gap-4">
          {members.map(m => {
            const memberServices = services.filter(s => m.service_ids.includes(s.id))
            return (
              <div key={m.id} className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-soft ${
                m.active ? 'border-gray-100 hover:border-indigo-100' : 'border-gray-100 opacity-60'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {m.avatar_url ? (
                      <Image src={m.avatar_url} alt={m.name} width={56} height={56}
                        className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                        style={{ backgroundColor: m.color }}>
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{m.name}</p>
                        {!m.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.staff.inactive}</span>}
                      </div>
                      <p className="text-sm text-indigo-600 font-medium">{m.role}</p>
                      {m.bio && <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">{m.bio}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {memberServices.map(s => (
                          <span key={s.id} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{s.name}</span>
                        ))}
                        {memberServices.length === 0 && (
                          <span className="text-xs text-gray-300">{t.staff.noServices}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                        <div className="flex gap-1">
                          {['S','M','T','W','T','F','S'].map((d, i) => (
                            <span key={i} className={`w-5 h-5 rounded-md text-xs flex items-center justify-center font-medium ${
                              m.work_days.includes(i) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-300'
                            }`}>{d}</span>
                          ))}
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />{m.work_start}–{m.work_end}
                        </span>
                        {m.break_start && m.break_end && (
                          <span className="flex items-center gap-1 text-xs text-amber-500">
                            <Coffee className="w-3 h-3" />{m.break_start}–{m.break_end}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)}
                        className="text-sm text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 font-medium transition-colors">{t.staff.edit}</button>
                      <button onClick={() => handleDelete(m.id)}
                        className="text-sm text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 font-medium transition-colors">{t.staff.remove}</button>
                    </div>
                    <button onClick={() => handleToggleActive(m)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border-2 transition-all ${
                        m.active
                          ? 'border-gray-100 text-gray-500 hover:border-red-200 hover:text-red-500'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}>
                      {m.active ? t.staff.setInactive : t.staff.setActive}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {members.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p className="font-medium">{t.staff.noStaff}</p>
              <p className="text-sm mt-1">{t.staff.noStaffSub}</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? t.staff.editTitle : t.staff.newTitle}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Profile photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile photo</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"
                    style={{ backgroundColor: form.avatar_url ? undefined : form.color }}>
                    {form.avatar_url ? (
                      <Image src={form.avatar_url} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {form.name ? form.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AB'}
                      </span>
                    )}
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={avatarUploading}
                      className="flex items-center gap-2 text-sm text-indigo-600 border-2 border-indigo-100 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors font-medium disabled:opacity-50">
                      <Camera className="w-4 h-4" />
                      {form.avatar_url ? 'Change photo' : 'Upload photo'}
                    </button>
                    {form.avatar_url && (
                      <button type="button" onClick={() => setForm(p => ({ ...p, avatar_url: null }))}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors text-left">
                        Remove photo
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f) }} />
                </div>
              </div>

              {!form.avatar_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.staff.avatarColour}</label>
                  <div className="flex gap-2 items-center">
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full transition-all ${
                          form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                        }`} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.staff.fullName}</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    placeholder={t.staff.namePlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.staff.roleLabel}</label>
                  <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    placeholder={t.staff.rolePlaceholder} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.staff.bioLabel} <span className="text-gray-400 font-normal">{t.staff.bioOptional}</span>
                </label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder={t.staff.bioPlaceholder} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t.staff.skillsLabel} <span className="text-gray-400 font-normal text-xs">{t.staff.skillsSub}</span>
                  </label>
                  {form.service_ids.length > 0 && (
                    <span className="text-xs text-indigo-600 font-medium">
                      {t.staff.selected.replace('{{count}}', String(form.service_ids.length))}
                    </span>
                  )}
                </div>
                {form.service_ids.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.service_ids.map(id => {
                      const svc = services.find(s => s.id === id)
                      return svc ? (
                        <span key={id} className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                          {svc.name}
                          <button type="button" onClick={() => toggleService(id)} className="hover:bg-indigo-700 rounded ml-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                <div className="border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-indigo-400 transition-colors">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-50">
                    <Search className="w-3.5 h-3.5 text-gray-300" />
                    <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
                      placeholder={t.staff.skillsSearch}
                      className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300 bg-transparent" />
                  </div>
                  <div className="max-h-36 overflow-y-auto">
                    {filteredServices.filter(s => !form.service_ids.includes(s.id)).map(s => (
                      <button key={s.id} type="button" onClick={() => toggleService(s.id)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center justify-between">
                        <span>{s.name}</span>
                        <span className="text-xs text-gray-400">{s.duration}min · €{s.price}</span>
                      </button>
                    ))}
                    {filteredServices.filter(s => !form.service_ids.includes(s.id)).length === 0 && (
                      <p className="text-xs text-gray-300 text-center py-3">{t.staff.allAssigned}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{t.staff.skillsHint}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.staff.workingDays}</label>
                <div className="flex gap-2">
                  {DAYS.map((day, i) => (
                    <button key={day} type="button" onClick={() => toggleDay(i)}
                      className={`w-10 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        form.work_days.includes(i)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-gray-100 text-gray-400 hover:border-indigo-300'
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.staff.startTime}</label>
                  <input type="time" value={form.work_start}
                    onChange={e => setForm(p => ({ ...p, work_start: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.staff.endTime}</label>
                  <input type="time" value={form.work_end}
                    onChange={e => setForm(p => ({ ...p, work_end: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <label className="text-sm font-medium text-gray-700">Lunch break</label>
                  <span className="text-xs text-gray-400 font-normal">(optional — blocks bookings during this window)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Break starts</label>
                    <input type="time" value={form.break_start}
                      onChange={e => setForm(p => ({ ...p, break_start: e.target.value }))}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Break ends</label>
                    <input type="time" value={form.break_end}
                      onChange={e => setForm(p => ({ ...p, break_end: e.target.value }))}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors bg-white" />
                  </div>
                </div>
                {form.break_start && form.break_end && (
                  <p className="text-xs text-amber-600 mt-2">
                    ☕ Slots from {form.break_start} to {form.break_end} will be blocked for this staff member.
                  </p>
                )}
                {form.break_start && form.break_end && (
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, break_start: '', break_end: '' }))}
                    className="text-xs text-gray-400 hover:text-red-400 mt-1 transition-colors">
                    Clear break
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave}
                disabled={!form.name || !form.role || form.service_ids.length === 0 || saving || avatarUploading}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.staff.save}
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                {t.staff.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
