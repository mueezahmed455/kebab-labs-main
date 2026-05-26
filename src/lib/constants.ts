import { BRAND } from '@/lib/data/brand'

// Derived from BRAND — single source of truth
export const BUSINESS_CONFIG = {
  name: BRAND.name,
  phone: BRAND.phoneRaw,
  address: BRAND.address,
  postcode: BRAND.postcode,
  coordinates: BRAND.coordinates,

  openingHours: {
    0: { open: '16:00', close: '00:40', isOpen: true },
    1: { open: '16:00', close: '00:40', isOpen: true },
    2: { open: null as string | null, close: null as string | null, isOpen: false },
    3: { open: '16:00', close: '00:40', isOpen: true },
    4: { open: '16:00', close: '00:40', isOpen: true },
    5: { open: '16:00', close: '00:40', isOpen: true },
    6: { open: '16:00', close: '00:40', isOpen: true },
  },

  delivery: {
    minimumOrder: BRAND.delivery.minimumOrder,
    fee: BRAND.delivery.fee,
    radiusMiles: BRAND.delivery.radiusMiles,
    estimatedTime: 45,
  },

  collection: {
    estimatedTime: 20,
  },

  orderNumberPrefix: 'KBL',
} as const

export const DELIVERY_POSTCODE_PREFIXES = ['BB10', 'BB11', 'BB12']
