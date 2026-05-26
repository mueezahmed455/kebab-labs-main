import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError, apiSuccess } from '@/lib/api-error'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return apiError(401, 'Authentication required to view order details')
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*), order_status_history(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!order || error) {
      return apiError(404, 'Order not found')
    }

    return apiSuccess(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    return apiError(500, 'Failed to fetch order')
  }
}
