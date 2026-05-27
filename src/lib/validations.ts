import { z } from 'zod'

// 07xxx xxxxxx or 01/02 0xxxx xxxxxx or +447xxx xxxxxx
export const ukPhoneSchema = z.string().regex(
  /^(?:(?:\+44)|(?:0))(?:\d\s?){9,10}$/,
  'Valid UK phone number required'
).transform((v) => v.replace(/\s+/g, ''))

export const ukPostcodeSchema = z.string().regex(
  /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  'Valid UK postcode required'
)

export const addressSchema = z.object({
  line1: z.string().min(3, 'Address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  postcode: ukPostcodeSchema,
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Full name required'),
  phone: ukPhoneSchema,
  email: z.string().email('Valid email required'),
})

export const orderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  name: z.string(),
  variantLabel: z.string().optional(),
  quantity: z.number().int().min(1).max(50),
  unitPrice: z.number().positive(),
  options: z.array(z.object({
    groupId: z.number(),
    optionId: z.number(),
    name: z.string(),
    priceDelta: z.number(),
  })).optional(),
  notes: z.string().max(500).optional(),
})

export const createOrderSchema = z.object({
  orderType: z.enum(['delivery', 'collection']),
  contact: contactSchema,
  deliveryAddress: addressSchema.optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item required'),
  subtotal: z.number().positive(),
  deliveryFee: z.number().min(0),
  total: z.number().positive(),
  paymentMethod: z.enum(['card', 'cash']),
  customerNotes: z.string().max(1000).optional(),
  promoCode: z.string().optional(),
  discount: z.number().min(0).optional(),
  privacyConsent: z.literal(true, { message: 'You must accept the privacy policy' }),
})

export const orderStatusSchema = z.object({
  status: z.enum(['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']),
  note: z.string().max(500).optional(),
  estimatedTime: z.number().int().min(5).max(120).optional(),
})

export const deliveryCheckSchema = z.object({
  postcode: ukPostcodeSchema,
})

export const createPaymentIntentSchema = z.object({
  orderId: z.string().uuid(),
})

export const menuItemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  basePrice: z.number().positive(),
  categorySlug: z.string(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})
