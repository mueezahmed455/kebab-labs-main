import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; total_price: number }>,
  total: number,
  orderType: string
) {
  const itemsHtml = items
    .map((item) => `<tr><td>${item.quantity}x ${item.name}</td><td style="text-align:right">£${item.total_price.toFixed(2)}</td></tr>`)
    .join('')

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'orders@thekebablabonline.co.uk',
    to: email,
    subject: `Order Confirmed — ${orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h1 style="color:#84cc16">Order Confirmed! 🎉</h1>
        <p>Thanks for ordering from <strong>The Kebab Lab</strong>.</p>
        <p style="color:#64748b">Order Reference: <strong>${orderNumber}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <thead><tr><th style="text-align:left;border-bottom:2px solid #e2e8f0;padding:8px">Item</th><th style="text-align:right;border-bottom:2px solid #e2e8f0;padding:8px">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr><td style="padding:8px;font-weight:bold">Total</td><td style="padding:8px;text-align:right;font-weight:bold">£${total.toFixed(2)}</td></tr></tfoot>
        </table>
        <p style="color:#64748b">${orderType === 'delivery' ? 'Your order is being prepared for delivery.' : 'Ready for collection.'}</p>
        <p style="color:#94a3b8;font-size:12px">The Kebab Lab — 123 Colne Road, Burnley, BB10 1LN</p>
      </div>
    `,
  })
}
