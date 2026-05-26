import { createAdminClient } from '@/lib/supabase/server'
import { MenuEditor } from '@/components/admin/MenuEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Menu — Admin' }
export const revalidate = 60

export default async function AdminMenuPage() {
  const admin = await createAdminClient()
  const { data: items } = await admin
    .from('menu_items')
    .select('id, name, base_price, is_available, is_featured, is_vegetarian, is_spicy, categories(name)')
    .order('categories(sort_order)', { ascending: true })
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-brand-white tracking-wider">MENU ITEMS</h1>
        <p className="text-brand-muted text-sm mt-1">Toggle availability to show/hide items from customers</p>
      </div>
      <MenuEditor items={(items ?? []) as unknown as Parameters<typeof MenuEditor>[0]['items']} />
    </div>
  )
}
