import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
