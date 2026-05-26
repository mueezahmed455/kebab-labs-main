import { BRAND } from '@/lib/data/brand'

/* ── Base email layout ─────────────────────────────────────── */

interface EmailLayoutProps {
  title: string
  preview: string
  children: string
}

function emailLayout({ title, preview, children }: EmailLayoutProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#08080e;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08080e;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border-radius:16px;border:1px solid #2a2a3e;max-width:100%;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="background:rgba(163,230,53,0.1);width:64px;height:64px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                      <span style="font-size:28px;">🔥</span>
                    </div>
                    <h1 style="margin:0;font-size:28px;font-weight:800;color:#f5f0eb;letter-spacing:1px;">THE KEBAB LAB</h1>
                    <p style="margin:4px 0 0;color:#a3e635;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Clay Oven Specialist</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,165,74,0.3),transparent);"></div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${children}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(245,240,235,0.06),transparent);margin-bottom:24px;"></div>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <a href="https://thekebablabonline.co.uk" style="color:#d4a54a;text-decoration:none;font-size:14px;font-weight:600;">www.thekebablabonline.co.uk</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:#6b6258;font-size:12px;line-height:1.6;">
                    ${BRAND.address}
                    <br />
                    ${BRAND.phone}
                    <br />
                    Open 6 Days a Week · 4:00pm – 12:40am · Closed Tuesday
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;color:#4a4340;font-size:11px;">
                    © ${new Date().getFullYear()} The Kebab Lab. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/* ── Order Confirmation ────────────────────────────────────── */

interface ItemRow {
  name: string
  quantity: number
  totalPrice: number
  variantLabel?: string | null
  options?: { name: string }[]
}

export function orderConfirmationHtml(params: {
  orderNumber: string
  customerName: string
  orderType: 'delivery' | 'collection'
  items: ItemRow[]
  subtotal: number
  deliveryFee: number
  total: number
  estimatedTime: number
  paymentMethod: string
  deliveryAddress?: { line1: string; line2?: string | null; city: string; postcode: string } | null
  customerNotes?: string | null
}): string {
  const { orderNumber, customerName, orderType, items, subtotal, deliveryFee, total, estimatedTime, paymentMethod, deliveryAddress, customerNotes } = params

  const itemsRows = items
    .map((item) => {
      const optionsText = item.options?.length
        ? item.options.map((o) => o.name).join(', ')
        : ''
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(245,240,235,0.06);">
            <div style="color:#f5f0eb;font-size:14px;font-weight:600;">${item.quantity}× ${item.name}</div>
            ${item.variantLabel ? `<div style="color:#6b6258;font-size:12px;margin-top:2px;">${item.variantLabel}</div>` : ''}
            ${optionsText ? `<div style="color:#6b6258;font-size:12px;">+ ${optionsText}</div>` : ''}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(245,240,235,0.06);text-align:right;color:#f5f0eb;font-size:14px;font-weight:600;white-space:nowrap;">
            £${item.totalPrice.toFixed(2)}
          </td>
        </tr>`
    })
    .join('')

  const deliveryLine = orderType === 'delivery' && deliveryAddress
    ? `
    <tr>
      <td colspan="2" style="padding:16px 0 0;">
        <div style="color:#6b6258;font-size:13px;margin-bottom:4px;">📍 Delivering to</div>
        <div style="color:#f5f0eb;font-size:14px;">
          ${deliveryAddress.line1}${deliveryAddress.line2 ? `, ${deliveryAddress.line2}` : ''}
          <br />${deliveryAddress.city}, ${deliveryAddress.postcode}
        </div>
      </td>
    </tr>`
    : ''

  const notesLine = customerNotes
    ? `<tr><td colspan="2" style="padding:12px 0 0;"><div style="color:#6b6258;font-size:13px;">📝 Notes: <span style="color:#f5f0eb;">${customerNotes}</span></div></td></tr>`
    : ''

  return emailLayout({
    title: `Order Confirmed — ${orderNumber}`,
    preview: `Your ${orderType} order from The Kebab Lab is confirmed!`,
    children: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <div style="width:56px;height:56px;border-radius:50%;background:rgba(163,230,53,0.12);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
              <span style="font-size:24px;">✅</span>
            </div>
            <h2 style="margin:0 0 4px;color:#a3e635;font-size:22px;font-weight:700;">Order Confirmed!</h2>
            <p style="margin:0;color:#9c9288;font-size:14px;">Thanks for your order, ${customerName} 🙌</p>
          </td>
        </tr>
        <tr>
          <td style="background:rgba(163,230,53,0.04);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:4px 0;">
                  <span style="color:#6b6258;font-size:12px;">Order Reference</span>
                  <div style="color:#f5f0eb;font-size:18px;font-weight:800;letter-spacing:1px;">${orderNumber}</div>
                </td>
                <td align="right" style="padding:4px 0;">
                  <span style="color:#6b6258;font-size:12px;">Est. Time</span>
                  <div style="color:#d4a54a;font-size:18px;font-weight:700;">~${estimatedTime} min</div>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 0 0;" colspan="2">
                  <span style="color:#6b6258;font-size:12px;">Type</span>
                  <div style="color:#f5f0eb;font-size:14px;font-weight:600;text-transform:capitalize;">${orderType === 'delivery' ? '🚚 Delivery' : '🏪 Collection'}</div>
                </td>
              </tr>
              ${deliveryLine}
              ${notesLine}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px;">
            <h3 style="margin:0 0 12px;color:#f5f0eb;font-size:15px;font-weight:700;">Order Summary</h3>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th style="padding:8px 0;border-bottom:2px solid rgba(212,165,74,0.2);text-align:left;color:#6b6258;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Item</th>
                  <th style="padding:8px 0;border-bottom:2px solid rgba(212,165,74,0.2);text-align:right;color:#6b6258;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding:10px 0 4px;color:#6b6258;font-size:13px;">Subtotal</td>
                  <td style="padding:10px 0 4px;text-align:right;color:#9c9288;font-size:13px;">£${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b6258;font-size:13px;">Delivery Fee</td>
                  <td style="padding:4px 0;text-align:right;color:#9c9288;font-size:13px;">${deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : 'FREE'}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 4px;border-top:1px solid rgba(212,165,74,0.2);color:#f5f0eb;font-size:16px;font-weight:700;">Total</td>
                  <td style="padding:12px 0 4px;border-top:1px solid rgba(212,165,74,0.2);text-align:right;color:#d4a54a;font-size:18px;font-weight:800;">£${total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:4px;color:#6b6258;font-size:12px;">Payment: ${paymentMethod === 'card' ? '💳 Card' : '💰 Cash on Delivery'}</td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:32px 0 8px;">
            <a href="https://thekebablabonline.co.uk/track/${orderNumber}" style="display:inline-block;padding:14px 36px;background:#a3e635;color:#08080e;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Track Your Order →</a>
          </td>
        </tr>
      </table>
    `,
  })
}

/* ── Order Status Update ───────────────────────────────────── */

const STATUS_META: Record<string, { icon: string; color: string; title: string }> = {
  confirmed: { icon: '✅', color: '#a3e635', title: 'Order Confirmed' },
  preparing: { icon: '👨‍🍳', color: '#d4a54a', title: 'Being Prepared' },
  ready: { icon: '📦', color: '#a3e635', title: 'Ready for Collection' },
  out_for_delivery: { icon: '🚚', color: '#d4a54a', title: 'Out for Delivery' },
  delivered: { icon: '🎉', color: '#a3e635', title: 'Delivered!' },
  cancelled: { icon: '❌', color: '#b81c1c', title: 'Cancelled' },
}

export function orderStatusHtml(params: {
  orderNumber: string
  customerName: string
  status: string
  estimatedTime?: number | null
  orderType: string
}) {
  const { orderNumber, customerName, status, estimatedTime, orderType } = params
  const meta = STATUS_META[status] ?? { icon: '📋', color: '#9c9288', title: status }

  const deliveryMsg = orderType === 'delivery'
    ? 'Your order is on its way! Make sure someone is available to receive it.'
    : 'Your order is ready to collect! Please come to the shop.'

  const statusStages = [
    { label: 'Confirmed', done: ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].includes(status) },
    { label: 'Preparing', done: ['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(status) },
    { label: orderType === 'delivery' ? 'Out for Delivery' : 'Ready', done: ['ready', 'out_for_delivery', 'delivered'].includes(status) },
    { label: 'Delivered', done: status === 'delivered' },
  ]

  const timelineHtml = statusStages
    .map((s) => {
      const bg = s.done ? meta.color : '#2a2a3e'
      const textColor = s.done ? '#f5f0eb' : '#6b6258'
      return `
        <tr>
          <td style="padding:6px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:20px;vertical-align:middle;">
                  <div style="width:12px;height:12px;border-radius:50%;background:${bg};"></div>
                </td>
                <td style="padding-left:12px;vertical-align:middle;">
                  <span style="color:${textColor};font-size:14px;font-weight:${s.done ? '600' : '400'};">${s.label}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    })
    .join('')

  return emailLayout({
    title: `Order Update — ${orderNumber}`,
    preview: `Your order ${orderNumber} is now: ${meta.title}`,
    children: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <div style="width:56px;height:56px;border-radius:50%;background:rgba(163,230,53,0.12);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
              <span style="font-size:24px;">${meta.icon}</span>
            </div>
            <h2 style="margin:0 0 4px;color:${meta.color};font-size:22px;font-weight:700;">${meta.title}</h2>
            <p style="margin:0;color:#9c9288;font-size:14px;">Hey ${customerName}, here's your order update</p>
          </td>
        </tr>
        <tr>
          <td style="background:rgba(163,230,53,0.04);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="color:#6b6258;font-size:12px;">Order Reference</span>
                  <div style="color:#f5f0eb;font-size:18px;font-weight:800;letter-spacing:1px;">${orderNumber}</div>
                </td>
                <td align="right">
                  ${estimatedTime ? `<span style="color:#6b6258;font-size:12px;">Est. Time</span><div style="color:#d4a54a;font-size:18px;font-weight:700;">~${estimatedTime} min</div>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 0;">
            <h3 style="margin:0 0 12px;color:#f5f0eb;font-size:15px;font-weight:700;">Order Progress</h3>
            <table role="presentation" cellpadding="0" cellspacing="0">
              ${timelineHtml}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 0 8px;color:#9c9288;font-size:14px;line-height:1.6;">
            ${status === 'out_for_delivery' || status === 'ready' ? deliveryMsg : 'We\'ll keep you posted on any updates.'}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 0 8px;">
            <a href="https://thekebablabonline.co.uk/track/${orderNumber}" style="display:inline-block;padding:14px 36px;background:#a3e635;color:#08080e;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Track Live →</a>
          </td>
        </tr>
      </table>
    `,
  })
}

/* ── Admin New Order Alert ─────────────────────────────────── */

export function adminNewOrderHtml(params: {
  orderNumber: string
  customerName: string
  orderType: string
  total: number
  items: ItemRow[]
  customerNotes?: string | null
  deliveryAddress?: { line1: string; line2?: string | null; city: string; postcode: string } | null
}) {
  const { orderNumber, customerName, orderType, total, items, customerNotes, deliveryAddress } = params

  const itemsRows = items
    .map(
      (item) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid rgba(245,240,235,0.06);color:#f5f0eb;font-size:13px;">${item.quantity}× ${item.name}</td><td style="padding:6px 12px;border-bottom:1px solid rgba(245,240,235,0.06);text-align:right;color:#d4a54a;font-size:13px;font-weight:600;">£${item.totalPrice.toFixed(2)}</td></tr>`
    )
    .join('')

  return emailLayout({
    title: `🆕 New Order — ${orderNumber}`,
    preview: `New ${orderType} order from ${customerName} — £${total.toFixed(2)}`,
    children: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <h2 style="margin:0;color:#d4a54a;font-size:22px;font-weight:700;">🆕 New Order Incoming!</h2>
            <p style="margin:4px 0 0;color:#9c9288;font-size:14px;">${orderNumber}</p>
          </td>
        </tr>
        <tr>
          <td style="background:rgba(212,165,74,0.06);border-radius:12px;padding:16px 20px;margin-bottom:20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:2px 0;">
                  <span style="color:#6b6258;font-size:12px;">Customer</span>
                  <div style="color:#f5f0eb;font-size:16px;font-weight:600;">${customerName}</div>
                </td>
                <td align="right" style="padding:2px 0;">
                  <span style="color:#6b6258;font-size:12px;">Total</span>
                  <div style="color:#d4a54a;font-size:20px;font-weight:800;">£${total.toFixed(2)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:2px 0;">
                  <span style="color:#6b6258;font-size:12px;">Type</span>
                  <div style="color:#f5f0eb;font-size:14px;text-transform:capitalize;">${orderType === 'delivery' ? '🚚 Delivery' : '🏪 Collection'}</div>
                </td>
              </tr>
              ${deliveryAddress && orderType === 'delivery' ? `
              <tr>
                <td style="padding:2px 0;" colspan="2">
                  <span style="color:#6b6258;font-size:12px;">Delivery Address</span>
                  <div style="color:#f5f0eb;font-size:13px;">${deliveryAddress.line1}${deliveryAddress.line2 ? `, ${deliveryAddress.line2}` : ''}, ${deliveryAddress.city}, ${deliveryAddress.postcode}</div>
                </td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <h3 style="margin:0 0 8px;color:#f5f0eb;font-size:14px;font-weight:700;">Items</h3>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="padding:6px 12px;text-align:left;color:#6b6258;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid rgba(212,165,74,0.2);">Item</th>
                  <th style="padding:6px 12px;text-align:right;color:#6b6258;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid rgba(212,165,74,0.2);">Price</th>
                </tr>
              </thead>
              <tbody>${itemsRows}</tbody>
            </table>
          </td>
        </tr>
        ${customerNotes ? `<tr><td style="padding:12px 0 0;color:#6b6258;font-size:13px;">📝 Customer Notes: <span style="color:#f5f0eb;">${customerNotes}</span></td></tr>` : ''}
        <tr>
          <td align="center" style="padding:24px 0 8px;">
            <a href="https://thekebablabonline.co.uk/admin/orders" style="display:inline-block;padding:14px 36px;background:#d4a54a;color:#08080e;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.5px;">View in Dashboard →</a>
          </td>
        </tr>
      </table>
    `,
  })
}
