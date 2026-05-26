'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'

const editSchema = z.object({
  name: z.string().min(1, 'Name required').max(200),
  description: z.string().max(1000).optional(),
  basePrice: z.number().positive('Price must be positive'),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  isSpicy: z.boolean(),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
})

type EditForm = z.infer<typeof editSchema>

interface MenuItem {
  id: string
  name: string
  description: string | null
  base_price: number
  is_available: boolean
  is_featured: boolean
  is_spicy: boolean
  is_vegetarian: boolean
  is_vegan: boolean
  categories?: { name: string } | null
}

export default function AdminMenuItemPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  })

  useEffect(() => {
    fetch(`/api/menu/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setItem(data)
        reset({
          name: data.name,
          description: data.description ?? '',
          basePrice: data.base_price,
          isAvailable: data.is_available,
          isFeatured: data.is_featured,
          isSpicy: data.is_spicy,
          isVegetarian: data.is_vegetarian,
          isVegan: data.is_vegan,
        })
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [id, reset])

  const onSubmit = async (values: EditForm) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          basePrice: values.basePrice,
          isAvailable: values.isAvailable,
          isFeatured: values.isFeatured,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Item updated')
      router.refresh()
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-brand-muted">Item not found. <Link href="/admin/menu" className="text-brand-green hover:underline">Back to menu</Link></div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/menu" className="inline-flex items-center gap-1.5 text-brand-muted hover:text-brand-green text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Menu
        </Link>
      </div>

      <div>
        <h1 className="font-display text-4xl text-brand-white tracking-wider">EDIT ITEM</h1>
        {item.categories && <p className="text-brand-muted text-sm mt-1">{item.categories.name}</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-brand-dim text-xs uppercase tracking-widest mb-1.5">Name</label>
          <input
            {...register('name')}
            className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-white text-sm focus:outline-none focus:border-brand-green/50 transition-colors"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-brand-dim text-xs uppercase tracking-widest mb-1.5">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-white text-sm focus:outline-none focus:border-brand-green/50 transition-colors resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-brand-dim text-xs uppercase tracking-widest mb-1.5">Base Price (£)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('basePrice', { valueAsNumber: true })}
            className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-white text-sm focus:outline-none focus:border-brand-green/50 transition-colors"
          />
          {errors.basePrice && <p className="text-red-400 text-xs mt-1">{errors.basePrice.message}</p>}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: 'isAvailable',  label: 'Available' },
            { key: 'isFeatured',   label: 'Featured' },
            { key: 'isSpicy',      label: 'Spicy' },
            { key: 'isVegetarian', label: 'Vegetarian' },
            { key: 'isVegan',      label: 'Vegan' },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand-green/30 transition-colors">
              <input type="checkbox" {...register(key)} className="w-4 h-4 accent-brand-green" />
              <span className="text-brand-white text-sm">{label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving || !isDirty}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </motion.div>
  )
}
