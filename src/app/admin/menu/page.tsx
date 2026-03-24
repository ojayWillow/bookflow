'use client'
import { useState, useEffect, useCallback } from 'react'
import { Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getMenuCategories, upsertMenuCategory, deleteMenuCategory, upsertMenuItem, deleteMenuItem, getBusinessSettings } from '@/lib/supabase/queries'
import AdminSkeleton from '../_components/AdminSkeleton'
import ToastContainer from '../_components/Toast'
import { useToast } from '@/hooks/useToast'

type MenuItem = {
  id: string; category_id: string; name: string
  description: string; price: number; available: boolean; image_url: string
}
type MenuCategory = {
  id: string; business_id: string; name: string; description: string
  image_url: string; sort_order: number; menu_items: MenuItem[]
}

const emptyItem = (category_id: string) => ({
  category_id, name: '', description: '', price: '0', available: true, image_url: ''
})

const emptyCat = () => ({ name: '', description: '', image_url: '' })

export default function MenuPage() {
  const [businessId, setBusinessId]     = useState<string | null>(null)
  const [restaurantMode, setRestaurantMode] = useState(false)
  const [categories, setCategories]     = useState<MenuCategory[]>([])
  const [loading, setLoading]           = useState(true)
  const [expanded, setExpanded]         = useState<Record<string, boolean>>({})
  const { toasts, toast, dismiss }      = useToast()

  // Category modal
  const [showCatModal, setShowCatModal] = useState(false)
  const [editingCat, setEditingCat]     = useState<MenuCategory | null>(null)
  const [catForm, setCatForm]           = useState(emptyCat())
  const [savingCat, setSavingCat]       = useState(false)

  // Item modal
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem]     = useState<MenuItem | null>(null)
  const [itemForm, setItemForm]           = useState(emptyItem(''))
  const [savingItem, setSavingItem]       = useState(false)

  const load = useCallback(async (bizId: string) => {
    try {
      const data = await getMenuCategories(bizId)
      setCategories(data as MenuCategory[])
    } catch {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    (async () => {
      try {
        const biz = await getBusinessSettings()
        setBusinessId(biz.id)
        setRestaurantMode(biz.restaurant_mode)
        await load(biz.id)
      } catch {
        setLoading(false)
      }
    })()
  }, [load])

  // ── Category CRUD ──────────────────────────────────────────────────
  const openNewCat  = () => { setCatForm(emptyCat()); setEditingCat(null); setShowCatModal(true) }
  const openEditCat = (c: MenuCategory) => {
    setCatForm({ name: c.name, description: c.description ?? '', image_url: c.image_url ?? '' })
    setEditingCat(c)
    setShowCatModal(true)
  }

  const saveCat = async () => {
    if (!businessId || !catForm.name.trim()) return
    setSavingCat(true)
    try {
      await upsertMenuCategory(businessId, {
        ...(editingCat ? { id: editingCat.id } : {}),
        name: catForm.name.trim(),
        description: catForm.description.trim(),
        image_url: catForm.image_url.trim(),
        sort_order: editingCat ? editingCat.sort_order : categories.length,
      })
      await load(businessId)
      setShowCatModal(false)
      toast.success(editingCat ? 'Category updated' : 'Category added')
    } catch {
      toast.error('Failed to save category')
    } finally {
      setSavingCat(false)
    }
  }

  const deleteCat = async (id: string) => {
    if (!confirm('Delete this category and all its items?')) return
    try {
      await deleteMenuCategory(id)
      await load(businessId!)
      toast.success('Category deleted')
    } catch {
      toast.error('Failed to delete category')
    }
  }

  // ── Item CRUD ────────────────────────────────────────────────────
  const openNewItem  = (categoryId: string) => { setItemForm(emptyItem(categoryId)); setEditingItem(null); setShowItemModal(true) }
  const openEditItem = (item: MenuItem) => {
    setItemForm({ category_id: item.category_id, name: item.name, description: item.description, price: String(item.price), available: item.available, image_url: item.image_url })
    setEditingItem(item)
    setShowItemModal(true)
  }

  const saveItem = async () => {
    if (!itemForm.name.trim()) return
    setSavingItem(true)
    try {
      await upsertMenuItem({
        ...(editingItem ? { id: editingItem.id } : {}),
        category_id: itemForm.category_id,
        name: itemForm.name.trim(),
        description: itemForm.description.trim(),
        price: Math.max(0, parseFloat(itemForm.price) || 0),
        available: itemForm.available,
        image_url: itemForm.image_url.trim(),
      })
      await load(businessId!)
      setShowItemModal(false)
      toast.success(editingItem ? 'Item updated' : 'Item added')
    } catch {
      toast.error('Failed to save item')
    } finally {
      setSavingItem(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return
    try {
      await deleteMenuItem(id)
      await load(businessId!)
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete item')
    }
  }

  const toggleExpanded = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const toggleAvailable = async (item: MenuItem) => {
    try {
      await upsertMenuItem({ ...item, available: !item.available })
      await load(businessId!)
    } catch {
      toast.error('Failed to update availability')
    }
  }

  // ── Render ─────────────────────────────────────────────────────
  if (!restaurantMode && !loading) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <UtensilsCrossed className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Restaurant mode is off</h2>
        <p className="text-sm text-gray-400 max-w-xs">Enable restaurant mode in Settings to manage your menu.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="flex items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your menu categories and items.</p>
        </div>
        <button onClick={openNewCat}
          className="shrink-0 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? <AdminSkeleton rows={3} /> : (
        <div className="space-y-4">
          {categories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-medium text-gray-700">No categories yet</p>
              <p className="text-sm text-gray-400 mt-1">Add a category to start building your menu.</p>
            </div>
          )}

          {categories.map(cat => (
            <div key={cat.id} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-100 transition-all">
              {/* Category header */}
              <div className="flex items-center gap-3 px-5 py-4">
                {cat.image_url && (
                  <img src={cat.image_url} alt={cat.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100" />
                )}
                <button onClick={() => toggleExpanded(cat.id)} className="flex-1 flex items-center gap-3 text-left min-w-0">
                  {expanded[cat.id] ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                  <div className="min-w-0">
                    <span className="font-semibold text-gray-900">{cat.name}</span>
                    {cat.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{cat.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">{cat.menu_items.length} items</span>
                </button>
                <button onClick={() => openNewItem(cat.id)}
                  className="text-sm text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 font-medium transition-colors flex items-center gap-1 shrink-0">
                  <Plus className="w-3.5 h-3.5" /> Add item
                </button>
                <button onClick={() => openEditCat(cat)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteCat(cat.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Items list */}
              {expanded[cat.id] && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {cat.menu_items.length === 0 && (
                    <p className="px-5 py-4 text-sm text-gray-400">No items yet — click &quot;Add item&quot; above.</p>
                  )}
                  {cat.menu_items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                        {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>}
                      </div>
                      <span className="text-sm font-semibold text-indigo-600 shrink-0">€{item.price.toFixed(2)}</span>
                      <button
                        onClick={() => toggleAvailable(item)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${item.available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {item.available ? 'Available' : 'Hidden'}
                      </button>
                      <button onClick={() => openEditItem(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{editingCat ? 'Edit Category' : 'New Category'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="e.g. Starters, Mains, Desserts" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder="Short note shown under the category name..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input value={catForm.image_url} onChange={e => setCatForm(p => ({ ...p, image_url: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="https://..." />
                {catForm.image_url && (
                  <img src={catForm.image_url} alt="preview"
                    className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-100" />
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveCat} disabled={!catForm.name.trim() || savingCat}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {savingCat && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </button>
              <button onClick={() => setShowCatModal(false)}
                className="px-5 py-2.5 border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{editingItem ? 'Edit Item' : 'New Item'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input value={itemForm.name} onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="e.g. Caesar Salad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={itemForm.description} onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  rows={2} placeholder="Short description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (€)</label>
                  <input type="number" value={itemForm.price} onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))}
                    onFocus={e => e.target.select()}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                    min={0} step={0.5} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Available</label>
                  <button onClick={() => setItemForm(p => ({ ...p, available: !p.available }))}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${itemForm.available ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                    {itemForm.available ? '✓ Available' : '✗ Hidden'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input value={itemForm.image_url} onChange={e => setItemForm(p => ({ ...p, image_url: e.target.value }))}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="https://..." />
                {itemForm.image_url && (
                  <img src={itemForm.image_url} alt="preview"
                    className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-100" />
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveItem} disabled={!itemForm.name.trim() || savingItem}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {savingItem && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </button>
              <button onClick={() => setShowItemModal(false)}
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
