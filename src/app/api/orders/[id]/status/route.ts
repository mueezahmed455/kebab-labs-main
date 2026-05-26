import { NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { orderStatusSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-error'
import { rateLimit } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = rateLimit(`order-status:${ip}`, 20, 60_000)
    if (!allowed) return apiError(429, 'Too many requests')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return apiError(401, 'Unauthorized')

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if ((profile as { role: string } | null)?.role !== 'admin') {
      return apiError(403, 'Forbidden')
    }

    const body = await request.json()
    if (JSON.stringify(body).length > 5_120) return apiError(413, 'Request too large')

    const parsed = orderStatusSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'Validation failed', parsed.error.flatten())
    }

    const { status, estimatedTime } = parsed.data
    const admin = await createAdminClient()

    const updateData: Record<string, string | number | null> = { status }
    if (estimatedTime) updateData.estimated_time = estimatedTime

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

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Order status update error:', error)
    return apiError(500, 'Failed to update order status')
  }
}
