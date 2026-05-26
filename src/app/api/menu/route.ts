import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MENU_ITEMS, CATEGORIES } from '@/lib/data/menu'

export async function GET() {
  // Serve static data when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ categories: CATEGORIES, items: MENU_ITEMS })
  }

  try {
    const supabase = await createClient()

    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (catError) throw catError

    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .select('*, menu_variants(*)')
      .eq('is_available', true)
      .order('sort_order')

    if (itemError) throw itemError

    return NextResponse.json({ categories, items })
  } catch (error) {
    console.error('Menu fetch error:', error)
    return NextResponse.json({ categories: CATEGORIES, items: MENU_ITEMS })
  }
}
