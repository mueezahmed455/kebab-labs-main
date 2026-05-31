import type { Metadata } from 'next'
import { BRAND } from '@/lib/data/brand'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about The Kebab Lab — ${BRAND.city}'s premium clay oven specialist. Our story, values, and commitment to authentic Middle Eastern cooking.`,
  openGraph: {
    title: `About Us | ${BRAND.name}`,
    description: `${BRAND.city}'s premium clay oven specialist. Authentic kebabs, shawarma & pizza.`,
    url: `${BRAND.website}/about`,
    type: 'website',
  },
  alternates: {
    canonical: `${BRAND.website}/about`,
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
