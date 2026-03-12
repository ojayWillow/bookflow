'use client'
import { useState } from 'react'
import { services as initialServices } from '@/data/mock'
import { Clock, Euro } from 'lucide-react'

type Service = typeof initialServices[0]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState({ name: '', description: '', duration: 60, price: 0 })

  const openCreate = () => {
    setForm({ name: '', description: '', duration: 60, price: 0 })
    setEditing(null); setShowModal(true)
  }

  const openEdit = (s: Service) => {
    setForm({ name: s.name, description: s.description, duration: s.duration, price: s.price })
    setEditing(s); setShowModal(true)
  }

  const handleSave = () => {
    if (editing) {
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s))
    } else {
      setServices(prev => [...prev, { ...form, id: `s${Date.now()}`, currency: 'EUR' }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this service?')) setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-400 mt-1">Manage what you offer and your pricing</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
          + Add service
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{editing ? 'Edit service' : 'New service'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="e.g. Deep Tissue Massage" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder="Short description shown to clients" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    min={5} step={5} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (€)</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    min={0} step={0.5} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.name}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors">
                Save service
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {services.map((s, i) => (
          <div key={s.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-100 transition-all shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-600">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{s.description}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3.5 h-3.5" /> {s.duration} min</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">€{s.price}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(s)}
                className="text-sm text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 font-medium transition-colors">Edit</button>
              <button onClick={() => handleDelete(s.id)}
                className="text-sm text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 font-medium transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
