'use client'
import { useState } from 'react'
import { staff as initialStaff, services } from '@/data/mock'
import type { StaffMember } from '@/data/mock'
import { Clock, Plus, X } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']

const emptyForm = {
  name: '', role: '', bio: '',
  serviceIds: [] as string[],
  workDays: [1, 2, 3, 4, 5] as number[],
  workStart: '09:00', workEnd: '18:00',
  active: true, color: '#6366f1',
}

export default function StaffPage() {
  const [members, setMembers] = useState<StaffMember[]>(initialStaff)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const openCreate = () => { setForm({ ...emptyForm }); setEditing(null); setShowModal(true) }
  const openEdit = (m: StaffMember) => {
    setForm({ name: m.name, role: m.role, bio: m.bio, serviceIds: [...m.serviceIds], workDays: [...m.workDays], workStart: m.workStart, workEnd: m.workEnd, active: m.active, color: m.color })
    setEditing(m); setShowModal(true)
  }

  const toggleService = (id: string) =>
    setForm(p => ({ ...p, serviceIds: p.serviceIds.includes(id) ? p.serviceIds.filter(s => s !== id) : [...p.serviceIds, id] }))

  const toggleDay = (d: number) =>
    setForm(p => ({ ...p, workDays: p.workDays.includes(d) ? p.workDays.filter(x => x !== d) : [...p.workDays, d].sort() }))

  const handleSave = () => {
    if (editing) {
      setMembers(prev => prev.map(m => m.id === editing.id ? { ...m, ...form } : m))
    } else {
      setMembers(prev => [...prev, { ...form, id: `st${Date.now()}` }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Remove this staff member?')) setMembers(prev => prev.filter(m => m.id !== id))
  }

  const toggleActive = (id: string) =>
    setMembers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-400 mt-1">{members.filter(m => m.active).length} active · {members.length} total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add staff member
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit staff member' : 'New staff member'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Avatar color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar colour</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                      style={{ backgroundColor: c }}
                      className={`w-8 h-8 rounded-full transition-all ${
                        form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                      }`} />
                  ))}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder="Short description shown to customers" />
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services they can perform</label>
                <div className="flex flex-wrap gap-2">
                  {services.map(s => (
                    <button key={s.id} type="button" onClick={() => toggleService(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all ${
                        form.serviceIds.includes(s.id)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-gray-100 text-gray-500 hover:border-indigo-300'
                      }`}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working days</label>
                <div className="flex gap-2">
                  {DAYS.map((day, i) => (
                    <button key={day} type="button" onClick={() => toggleDay(i)}
                      className={`w-10 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        form.workDays.includes(i)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-gray-100 text-gray-400 hover:border-indigo-300'
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start time</label>
                  <input type="time" value={form.workStart} onChange={e => setForm(p => ({ ...p, workStart: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">End time</label>
                  <input type="time" value={form.workEnd} onChange={e => setForm(p => ({ ...p, workEnd: e.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.name || !form.role || form.serviceIds.length === 0}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors">
                Save
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff grid */}
      <div className="grid gap-4">
        {members.map(m => {
          const memberServices = services.filter(s => m.serviceIds.includes(s.id))
          return (
            <div key={m.id} className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-soft ${
              m.active ? 'border-gray-100 hover:border-indigo-100' : 'border-gray-100 opacity-60'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
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

                    {/* Services */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {memberServices.map(s => (
                        <span key={s.id} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{s.name}</span>
                      ))}
                    </div>

                    {/* Work schedule */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex gap-1">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                          <span key={i} className={`w-5 h-5 rounded-md text-xs flex items-center justify-center font-medium ${
                            m.workDays.includes(i) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-300'
                          }`}>{d}</span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />{m.workStart}–{m.workEnd}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)}
                      className="text-sm text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(m.id)}
                      className="text-sm text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 font-medium transition-colors">Remove</button>
                  </div>
                  <button onClick={() => toggleActive(m.id)}
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
      </div>
    </div>
  )
}
