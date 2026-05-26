export const BUSINESS_CONFIG = {
  name: 'The Kebab Lab',
  phone: '01282 454 626',
  address: '123 Colne Road, Burnley, BB10 1LN',
  postcode: 'BB10 1LN',
  coordinates: { lat: 53.789, lng: -2.247 },

  openingHours: {
    0: { open: '16:00', close: '00:40', isOpen: true },
    1: { open: '16:00', close: '00:40', isOpen: true },
    2: { open: null,    close: null,    isOpen: false },
    3: { open: '16:00', close: '00:40', isOpen: true },
    4: { open: '16:00', close: '00:40', isOpen: true },
    5: { open: '16:00', close: '00:40', isOpen: true },
    6: { open: '16:00', close: '00:40', isOpen: true },
  },

  delivery: {
    minimumOrder: 12.00,
    fee: 1.99,
    radiusMiles: 3,
    estimatedTime: 45,
  },

  collection: {
    estimatedTime: 20,
  },

  orderNumberPrefix: 'KBL',
} as const

export const DELIVERY_POSTCODE_PREFIXES = ['BB10', 'BB11', 'BB12']
