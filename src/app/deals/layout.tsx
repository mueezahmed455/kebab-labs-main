import type { Metadata } from 'next'
import { BRAND } from '@/lib/data/brand'

export const metadata: Metadata = {
  title: 'Deals & Meal Deals',
  description: `Save big with The Kebab Lab meal deals, shawarma combos & sharing platters. From £9. Order online for delivery or collection in ${BRAND.city}.`,
  openGraph: {
    title: `Deals & Meal Deals | ${BRAND.name}`,
    description: `Shawarma meal deals, combos & sharing platters from £9. Order online for delivery in ${BRAND.city}.`,
    url: `${BRAND.website}/deals`,
    type: 'website',
  },
  alternates: {
    canonical: `${BRAND.website}/deals`,
  },
}

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
