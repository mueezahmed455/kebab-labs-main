import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

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
