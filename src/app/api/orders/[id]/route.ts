import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const query = supabase
      .from('orders')
      .select('*, order_items(*), order_status_history(*)')
      .eq('id', id)

    // Guests can access by order_number too
    if (!user) {
      query.single()
    } else {
      query.eq('user_id', user.id).single()
    }

    const { data: order, error } = await query

    if (!order || error) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
