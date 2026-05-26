import { NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createOrderSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-error'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return apiError(401, 'Authentication required')
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return apiSuccess(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return apiError(500, 'Failed to fetch orders')
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = rateLimit(`order-create:${ip}`, 3, 60_000)
    if (!allowed) return apiError(429, 'Too many requests. Try again later.')

    const body = await request.json()
    if (JSON.stringify(body).length > 50_240) return apiError(413, 'Request too large')

    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'Validation failed', parsed.error.flatten())
    }

    const { orderType, contact, deliveryAddress, items, subtotal, deliveryFee, total, paymentMethod, customerNotes } = parsed.data

    // Server-side total verification: recalculate from items
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return apiError(400, 'Subtotal does not match item prices')
    }

    const admin = await createAdminClient()

    // Validate delivery postcode if delivery
    if (orderType === 'delivery' && deliveryAddress) {
      const { data: valid } = await (admin.rpc as any)('is_valid_delivery_postcode', {
        p_postcode: deliveryAddress.postcode,
      })
      if (!valid) {
        return apiError(400, 'Postcode is outside delivery area')
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

    return apiSuccess(order, 201)
  } catch (error) {
    console.error('Order creation error:', error)
    return apiError(500, 'Failed to create order')
  }
}
