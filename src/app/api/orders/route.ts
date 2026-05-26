import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createOrderSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { orderType, contact, deliveryAddress, items, subtotal, deliveryFee, total, paymentMethod, customerNotes } = parsed.data

    const admin = await createAdminClient()

    // Validate delivery postcode if delivery
    if (orderType === 'delivery' && deliveryAddress) {
      const { data: valid } = await (admin.rpc as any)('is_valid_delivery_postcode', {
        p_postcode: deliveryAddress.postcode,
      })
      if (!valid) {
        return NextResponse.json(
          { error: 'Postcode is outside delivery area' },
          { status: 400 }
        )
      }
    }

    // Generate order number
    const { data: orderNumber } = await (admin.rpc as any)('generate_order_number')

    // Get user if authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Create order
    const { data: order, error: orderError } = await (admin as any)
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        guest_name: contact.name,
        guest_email: contact.email,
        guest_phone: contact.phone,
        order_type: orderType,
        delivery_line1: deliveryAddress?.line1 ?? null,
        delivery_line2: deliveryAddress?.line2 ?? null,
        delivery_city: deliveryAddress?.city ?? null,
        delivery_postcode: deliveryAddress?.postcode ?? null,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: paymentMethod,
        customer_notes: customerNotes ?? null,
        estimated_time: orderType === 'delivery' ? 45 : 20,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_id: item.menuItemId,
      variant_id: item.variantId ?? null,
      name: item.name,
      variant_label: item.variantLabel ?? null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
      notes: item.notes ?? null,
    }))

    const { error: itemsError } = await (admin as any)
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Log initial status
    await (admin as any).from('order_status_history').insert({
      order_id: order.id,
      status: 'pending',
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
