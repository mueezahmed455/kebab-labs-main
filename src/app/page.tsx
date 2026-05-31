import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { FeaturesBar } from '@/components/home/FeaturesBar'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { PopularItems } from '@/components/home/PopularItems'
import { WhyUs } from '@/components/home/WhyUs'
import { Testimonials } from '@/components/home/Testimonials'
import { FindUs } from '@/components/home/FindUs'
import { PageTransition } from '@/components/common/PageTransition'

export const metadata: Metadata = {
  title: 'The Kebab Lab — Premium Clay Oven Kebabs, Pizza & Shawarma | Burnley',
  description:
    'Order online from The Kebab Lab — Burnley\'s premium clay oven specialist. Kebabs, shawarma, stone-baked pizzas, and sharing platters. Delivery & collection available.',
}

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <FeaturesBar />
      <CategoryGrid />
      <PopularItems />
      <Testimonials />
      <WhyUs />
      <FindUs />
    </PageTransition>
  )
}
