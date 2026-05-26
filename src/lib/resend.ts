import { Resend } from 'resend'
import { orderConfirmationHtml, orderStatusHtml, adminNewOrderHtml } from '@/lib/email'

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = process.env.RESEND_FROM_EMAIL ?? 'orders@thekebablabonline.co.uk'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@thekebablabonline.co.uk'

/* ── Order confirmation to customer ───────────────────────── */

export async function sendOrderConfirmation(params: {
  email: string
  customerName: string
  orderNumber: string
  orderType: 'delivery' | 'collection'
  items: Array<{ name: string; quantity: number; total_price: number; variant_label?: string | null; options?: { name: string }[] }>
  subtotal: number
  deliveryFee: number
  total: number
  estimatedTime: number
  paymentMethod: string
  deliveryAddress?: { line1: string; line2?: string | null; city: string; postcode: string } | null
  customerNotes?: string | null
}) {
  const mapped: Parameters<typeof orderConfirmationHtml>[0] = {
    orderNumber: params.orderNumber,
    customerName: params.customerName,
    orderType: params.orderType,
    items: params.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      totalPrice: i.total_price,
      variantLabel: i.variant_label,
      options: i.options,
    })),
    subtotal: params.subtotal,
    deliveryFee: params.deliveryFee,
    total: params.total,
    estimatedTime: params.estimatedTime,
    paymentMethod: params.paymentMethod,
    deliveryAddress: params.deliveryAddress,
    customerNotes: params.customerNotes,
  }
  const resend = getResend()
  if (!resend) return
  const html = orderConfirmationHtml(mapped)
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Order Confirmed — ${params.orderNumber} 🎉`,
    html,
  })
}

/* ── Order status update to customer ──────────────────────── */

export async function sendOrderStatusUpdate(params: {
  email: string
  customerName: string
  orderNumber: string
  status: string
  estimatedTime?: number | null
  orderType: string
}) {
  const resend = getResend()
  if (!resend) return
  const html = orderStatusHtml(params)
  const statusLabels: Record<string, string> = {
    confirmed: 'Confirmed ✅',
    preparing: 'Being Prepared 👨‍🍳',
    ready: 'Ready for Collection 📦',
    out_for_delivery: 'Out for Delivery 🚚',
    delivered: 'Delivered! 🎉',
    cancelled: 'Cancelled',
  }
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Order Update — ${params.orderNumber}: ${statusLabels[params.status] ?? params.status}`,
    html,
  })
}

/* ── Admin new-order alert ────────────────────────────────── */

export async function sendAdminNewOrderAlert(params: {
  orderNumber: string
  customerName: string
  orderType: string
  total: number
  items: Array<{ name: string; quantity: number; total_price: number }>
  customerNotes?: string | null
  deliveryAddress?: { line1: string; line2?: string | null; city: string; postcode: string } | null
}) {
  const mapped: Parameters<typeof adminNewOrderHtml>[0] = {
    orderNumber: params.orderNumber,
    customerName: params.customerName,
    orderType: params.orderType,
    total: params.total,
    items: params.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      totalPrice: i.total_price,
    })),
    customerNotes: params.customerNotes,
    deliveryAddress: params.deliveryAddress,
  }
  const resend = getResend()
  if (!resend) return
  const html = adminNewOrderHtml(mapped)
  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🆕 New Order — ${params.orderNumber} — £${params.total.toFixed(2)}`,
    html,
  })
}
