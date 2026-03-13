'use client'
import { useState, useEffect } from 'react'
import { Clock, Plus, X, Search, Loader2 } from 'lucide-react'
import {
  getStaff, upsertStaffMember, deleteStaffMember,
  getServices,
} from '@/lib/supabase/queries'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']

type DBService = { id: string; name: string; duration: number; price: number }
type DBStaff = {
  id: string; name: string; role: string; bio: string
  service_ids: string[]; work_days: number[]
  work_start: string; work_end: string
  active: boolean; color: string
}

const emptyForm = {
  name: '', role: '', bio: '',
  service_ids: [] as string[],
  work_days: [1, 2, 3, 4, 5] as number[],
  work_start: '09:00', work_end: '18:00',
  active: true, color: '#6366f1',
}

export default function StaffPage() {
  const [members, setMembers] = useState<DBStaff[]>([])
  const [services, setServices] = useState<DBService[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<DBStaff | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [skillSearch, setSkillSearch] = useState('')
  const [error, setError] = useState('')

  const loadAll = async () => {
    try {
      const [staffData, svcData] = await Promise.all([getStaff(), getServices()])
      setMembers((staffData ?? []) as DBStaff[])
      setServices((svcData ?? []) as DBService[])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const openCreate = () => {
    setForm({ ...emptyForm })
    setEditing(null)
    setSkillSearch('')
    setShowModal(true)
  }

  const openEdit = (m: DBStaff) => {
    setForm({
      name: m.name, role: m.role, bio: m.bio,
      service_ids: [...m.service_ids],
      work_days: [...m.work_days],
      work_start: m.work_start, work_end: m.work_end,
      active: m.active, color: m.color,
    })
    setEditing(m)
    setSkillSearch('')
    setShowModal(true)
  }

  const toggleService = (id: string) =>
    setForm(p => ({
      ...p,
      service_ids: p.service_ids.includes(id)
        ? p.service_ids.filter(s => s !== id)
        : [...p.service_ids, id],
    }))

  const toggleDay = (d: number) =>
    setForm(p => ({
      ...p,
      work_days: p.work_days.includes(d)
        ? p.work_days.filter(x => x !== d)
        : [...p.work_days, d].sort(),
    }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await upsertStaffMember({
        ...(editing ? { id: editing.id } : {}),
        name: form.name,
        role: form.role,
        bio: form.bio,
        service_ids: form.service_ids,
        work_days: form.work_days,
        work_start: form.work_start,
        work_end: form.work_end,
        active: form.active,
        color: form.color,
      })
      await loadAll()
      setShowModal(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save staff member')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this staff member?')) return
    try {
      await deleteStaffMember(id)
      await loadAll()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete staff member')
    }
  }

  const handleToggleActive = async (m: DBStaff) => {
    try {
      await upsertStaffMember({ ...m, active: !m.active })
      await loadAll()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update staff member')
    }
  }

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-400 mt-1">
            {members.filter(m => m.active).length} active · {members.length} total
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add staff member
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">⚠ {error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading staff…
        </div>
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
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                      style={{ backgroundColor: m.color }}>
                      {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{m.name}</p>
                        {!m.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                      </div>
                      <p className="text-sm text-indigo-600 font-medium">{m.role}</p>
                      {m.bio && <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">{m.bio}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {memberServices.map(s => (
                          <span key={s.id} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{s.name}</span>
                        ))}
                        {memberServices.length === 0 && (
                          <span className="text-xs text-gray-300">No services assigned</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
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
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)}
                        className="text-sm text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(m.id)}
                        className="text-sm text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 font-medium transition-colors">Remove</button>
                    </div>
                    <button onClick={() => handleToggleActive(m)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border-2 transition-all ${
                        m.active
                          ? 'border-gray-100 text-gray-500 hover:border-red-200 hover:text-red-500'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}>
                      {m.active ? 'Set inactive' : 'Set active'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {members.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p className="font-medium">No staff members yet</p>
              <p className="text-sm mt-1">Add your first team member to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit staff member' : 'New staff member'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Colour picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar colour</label>
                <div className="flex gap-2 items-center">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                      style={{ backgroundColor: c }}
                      className={`w-8 h-8 rounded-full transition-all ${
                        form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                      }`} />
                  ))}
                  <div className="ml-3 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: form.color }}>
                    {form.name ? form.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AB'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    placeholder="e.g. Laura Bērziņa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role / title</label>
                  <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    placeholder="e.g. Senior Therapist" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bio <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder="Short description shown to customers" />
              </div>

              {/* Skill picker — now from Supabase */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Skills <span className="text-gray-400 font-normal text-xs">(services from your catalogue)</span>
                  </label>
                  {form.service_ids.length > 0 && (
                    <span className="text-xs text-indigo-600 font-medium">{form.service_ids.length} selected</span>
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
                      placeholder="Search services..."
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
                      <p className="text-xs text-gray-300 text-center py-3">All services assigned</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Services are pulled from your Services page — add new ones there first.
                </p>
              </div>

              {/* Working days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working days</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start time</label>
                  <input type="time" value={form.work_start}
                    onChange={e => setForm(p => ({ ...p, work_start: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">End time</label>
                  <input type="time" value={form.work_end}
                    onChange={e => setForm(p => ({ ...p, work_end: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!form.name || !form.role || form.service_ids.length === 0 || saving}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
