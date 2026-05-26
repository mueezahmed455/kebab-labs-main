import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if ((profile as { role: string } | null)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const admin = await createAdminClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [ordersResult, todayResult, popularResult] = await Promise.all([
      (admin as any).from('orders').select('total, created_at'),
      (admin as any).from('orders').select('id').gte('created_at', today.toISOString()),
      (admin as any).from('order_items')
        .select('name, quantity')
        .order('quantity', { ascending: false })
        .limit(10),
    ])

    const orders = ordersResult.data as Array<{ total: number }> | null
    const totalRevenue = orders?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0
    const todayOrders = (todayResult.data as unknown[] | null)?.length ?? 0
    const popularItems = (popularResult.data as Array<{ name: string; quantity: number }> | null) ?? []

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders?.length ?? 0,
      todayOrders,
      popularItems,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
