import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MENU_ITEMS } from '@/lib/data/menu'
import { z } from 'zod'

const cartValidateSchema = z.object({
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).max(50),
    unitPrice: z.number().positive(),
  })).min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = cartValidateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 })
    }

    const itemIds = parsed.data.items.map((i) => i.menuItemId)

    let rawItems: { id: string; name: string; base_price: number; is_available: boolean }[]

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      rawItems = MENU_ITEMS
        .filter((m) => itemIds.includes(m.id))
        .map((m) => ({ id: m.id, name: m.name, base_price: m.basePrice, is_available: true }))
    } else {
      const supabase = await createClient()
      const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('id, name, base_price, is_available')
        .in('id', itemIds)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      rawItems = (menuItems ?? []) as typeof rawItems
    }

    const itemMap = new Map(rawItems.map((m) => [m.id, m]))
    const issues: string[] = []
    let subtotal = 0

    for (const cartItem of parsed.data.items) {
      const menuItem = itemMap.get(cartItem.menuItemId)
      if (!menuItem) {
        issues.push(`Item not found: ${cartItem.menuItemId}`)
        continue
      }
      if (!(menuItem as { is_available: boolean }).is_available) {
        issues.push(`${(menuItem as { name: string }).name} is currently unavailable`)
        continue
      }
      subtotal += cartItem.unitPrice * cartItem.quantity
    }

    if (issues.length > 0) {
      return NextResponse.json({ valid: false, issues }, { status: 422 })
    }

    return NextResponse.json({ valid: true, subtotal: Math.round(subtotal * 100) / 100 })
  } catch {
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
