import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MENU_ITEMS } from '@/lib/data/menu'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const item = MENU_ITEMS.find((m) => m.id === id)
    if (!item) return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    return NextResponse.json({ ...item, base_price: item.price, is_available: true, menu_variants: [] })
  }

  try {
    const supabase = await createClient()

    const { data: item, error } = await supabase
      .from('menu_items')
      .select('*, menu_variants(*)')
      .eq('id', id)
      .single()

    if (error?.code === 'PGRST116') {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }
    if (error) throw error

    return NextResponse.json(item)
  } catch (error) {
    console.error('Menu item fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    )
  }
}
