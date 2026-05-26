import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MENU_ITEMS } from '@/lib/data/menu'
import { apiError, apiSuccess } from '@/lib/api-error'
import { z } from 'zod'

const cartValidateSchema = z.object({
  items: z.array(z.object({
    menuItemId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1).max(50),
    unitPrice: z.number().positive(),
  })).min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = cartValidateSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'Invalid cart data')
    }

    const itemIds = parsed.data.items.map((i) => i.menuItemId)

    interface RawItem { id: string; name: string; price: number; is_available: boolean }

    let rawItems: RawItem[]

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      rawItems = MENU_ITEMS
        .filter((m) => itemIds.includes(m.id))
        .map((m) => ({ id: m.id, name: m.name, price: m.price, is_available: true }))
    } else {
      const supabase = await createClient()
      const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('id, name, base_price, is_available')
        .in('id', itemIds)
      if (error) return apiError(500, error.message)
      rawItems = (menuItems ?? []).map((m) => ({ id: m.id, name: m.name, price: m.base_price, is_available: m.is_available ?? true }))
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
      if (!menuItem.is_available) {
        issues.push(`${menuItem.name} is currently unavailable`)
        continue
      }
      subtotal += cartItem.unitPrice * cartItem.quantity
    }

    if (issues.length > 0) {
      return apiSuccess({ valid: false, issues }, 422)
    }

    return apiSuccess({ valid: true, subtotal: Math.round(subtotal * 100) / 100 })
  } catch {
    return apiError(500, 'Validation failed')
  }
}
