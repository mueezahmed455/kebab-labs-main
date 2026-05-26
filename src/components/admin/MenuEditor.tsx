'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils/formatting'
import { Eye, EyeOff, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItemRow {
  id: string
  name: string
  base_price: number
  is_available: boolean
  is_featured: boolean
  is_vegetarian: boolean
  is_spicy: boolean
  categories?: { name: string } | null
}

interface MenuEditorProps {
  items: MenuItemRow[]
}

export function MenuEditor({ items: initialItems }: MenuEditorProps) {
  const [items, setItems] = useState(initialItems)
  const [toggling, setToggling] = useState<string | null>(null)

  const toggleAvailability = async (item: MenuItemRow) => {
    setToggling(item.id)
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.is_available }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_available: !i.is_available } : i))
      toast.success(`${item.name} ${!item.is_available ? 'enabled' : 'disabled'}`)
    } catch {
      toast.error('Failed to update item')
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'flex items-center gap-4 bg-brand-card border rounded-xl p-4 transition-colors',
            item.is_available ? 'border-brand-border' : 'border-brand-border/50 opacity-60'
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-brand-white text-sm font-medium">{item.name}</span>
              {item.is_vegetarian && <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full">VEG</span>}
              {item.is_spicy && <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full">🌶 SPICY</span>}
              {item.is_featured && <span className="text-[10px] text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded-full">FEATURED</span>}
            </div>
            <p className="text-brand-muted text-xs mt-0.5">{item.categories?.name}</p>
          </div>
          <span className="text-brand-green font-display text-lg tracking-wider">{formatCurrency(item.base_price)}</span>
          <button
            onClick={() => toggleAvailability(item)}
            disabled={toggling === item.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors',
              item.is_available
                ? 'border-brand-border text-brand-muted hover:border-red-700/30 hover:text-red-400'
                : 'border-brand-green/30 text-brand-green hover:bg-brand-green/10'
            )}
            title={item.is_available ? 'Disable item' : 'Enable item'}
          >
            {toggling === item.id ? (
              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : item.is_available ? (
              <><Eye className="w-3 h-3" /> Visible</>
            ) : (
              <><EyeOff className="w-3 h-3" /> Hidden</>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
