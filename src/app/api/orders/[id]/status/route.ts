import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { orderStatusSchema } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if ((profile as { role: string } | null)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = orderStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { status, estimatedTime } = parsed.data

    const admin = await createAdminClient()

    const updateData: Record<string, string | number | null> = { status }

    if (estimatedTime) updateData.estimated_time = estimatedTime

    // Set timestamp for the new status
    const now = new Date().toISOString()
    switch (status) {
      case 'confirmed': updateData.confirmed_at = now; break
      case 'preparing': updateData.preparing_at = now; break
      case 'ready': updateData.ready_at = now; break
      case 'delivered': updateData.delivered_at = now; break
    }

    const { error } = await (admin as any)
      .from('orders')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order status update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
