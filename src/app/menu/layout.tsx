import type { Metadata } from 'next'
import { BRAND } from '@/lib/data/brand'

export const metadata: Metadata = {
  title: 'Menu',
  description: `Explore The Kebab Lab menu — clay oven kebabs, authentic shawarma, donner, mixed combos, stone-baked pizzas, sharing platters, sides & desserts. Order online for delivery or collection in ${BRAND.city}.`,
  openGraph: {
    title: `Menu | ${BRAND.name}`,
    description: `Browse our full menu — clay oven kebabs, shawarma, pizza & more. Order online for delivery in ${BRAND.city}.`,
    url: `${BRAND.website}/menu`,
    type: 'website',
  },
  alternates: {
    canonical: `${BRAND.website}/menu`,
  },
}

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
