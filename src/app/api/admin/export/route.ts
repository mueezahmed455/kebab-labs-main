import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return (profile as { role: string } | null)?.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from') ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const to   = searchParams.get('to')   ?? new Date().toISOString()

  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('orders')
    .select('order_number, created_at, status, order_type, guest_name, guest_email, guest_phone, subtotal, delivery_fee, total, payment_method, payment_status, delivery_postcode')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const orders = (data ?? []) as Array<Record<string, unknown>>

  const headers = [
    'Order Number', 'Date', 'Status', 'Type', 'Customer Name', 'Email', 'Phone',
    'Subtotal (£)', 'Delivery Fee (£)', 'Total (£)', 'Payment Method', 'Payment Status', 'Postcode',
  ]

  const rows = orders.map((o) => [
    o.order_number,
    new Date(o.created_at as string).toLocaleString('en-GB'),
    o.status,
    o.order_type,
    o.guest_name ?? '',
    o.guest_email ?? '',
    o.guest_phone ?? '',
    (o.subtotal as number).toFixed(2),
    (o.delivery_fee as number).toFixed(2),
    (o.total as number).toFixed(2),
    o.payment_method,
    o.payment_status,
    o.delivery_postcode ?? '',
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="kebablab-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
