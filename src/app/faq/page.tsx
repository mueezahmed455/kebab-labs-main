import type { Metadata } from 'next'
import { BRAND } from '@/lib/data/brand'
import { FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/SEO'
import { FAQContent } from '@/components/seo/FAQContent'

const FAQ_ITEMS = [
  {
    q: 'What are The Kebab Lab opening hours?',
    a: `We're open 6 days a week from 4:00 PM to 12:40 AM — Monday, Wednesday, Thursday, Friday, Saturday, and Sunday. We are closed on Tuesdays. Last orders are taken at 12:00 AM.`,
  },
  {
    q: 'Do you offer delivery?',
    a: `Yes! We deliver within a 3-mile radius of our ${BRAND.city} restaurant at ${BRAND.address}. Delivery is free on orders over £25, otherwise a flat fee of £2.49 applies. The minimum order for delivery is £12.`,
  },
  {
    q: 'What is the minimum order for delivery?',
    a: 'The minimum order amount for delivery is £12.00. Delivery fees are £2.49 for orders under £25, and free for orders over £25.',
  },
  {
    q: 'Can I collect my order instead of getting delivery?',
    a: 'Absolutely. Select "Collection" at checkout and your order will be ready for pickup in approximately 15–20 minutes. Collection is free with no minimum order.',
  },
  {
    q: 'Do you use a clay oven?',
    a: 'Yes! The Kebab Lab is built around a traditional clay oven. All our kebabs, shawarma, and pizzas are cooked over real clay oven coals — no gas, no shortcuts. This gives our food its signature char and smoky depth.',
  },
  {
    q: 'What is kobeda?',
    a: 'Kobeda is our hand-crafted minced beef kebab, seasoned with a signature Middle Eastern spice blend and flame-grilled over clay oven coals. It\'s our signature item and a customer favourite.',
  },
  {
    q: 'Do you have vegetarian or vegan options?',
    a: 'Yes. Our menu includes vegetarian options such as the Veg Kebab, Veggie Pizza, Vegetarian Burger, and various sides. Ask about vegan options when ordering.',
  },
  {
    q: 'What size pizzas do you offer?',
    a: 'Our stone-baked pizzas are available in four sizes: 10", 12", 14", and 16". We offer classics like Margherita and Pepperoni, plus signature options like the Kebab Lab Special and Shawarma Pizza.',
  },
  {
    q: 'Can I create my own pizza?',
    a: 'Yes! Our "Create Your Own Pizza" option lets you pick any 5 toppings. Available in all sizes from 10" to 16".',
  },
  {
    q: 'Do you have sharing platters?',
    a: 'Yes! We have a range of sharing platters from the Duo Platter (£22, serves 2) to the Kebab Lab Special (£34, serves 4–5) and the Jumbo Size (£45, serves 5–6). Perfect for groups and family meals.',
  },
  {
    q: 'Do you offer meal deals?',
    a: 'We have two types of meal deals: Shawarma Meal Deals (mix & match shawarma combos from £12) and Kebab Lab Meal Deals (includes small chips & a drink, from £9). Great value for solo or group orders.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept card payments (via Stripe), cash on delivery, and online payments. All card transactions are securely processed.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order is confirmed, you\'ll receive a tracking link via email or SMS. You can also visit /track/[order-id] to see real-time status updates powered by Supabase Realtime.',
  },
  {
    q: 'Can I place an order over the phone?',
    a: `Yes. Call us on ${BRAND.phone} to place an order for collection or delivery. Online ordering is also available 24/7 at ${BRAND.website}.`,
  },
  {
    q: 'Where are you located?',
    a: `We're located at ${BRAND.address}. You can find us on Google Maps — search for "The Kebab Lab" or "clay oven kebab Burnley".`,
  },
  {
    q: 'Are your ingredients halal?',
    a: 'We source our meats from trusted halal-certified suppliers. If you have specific dietary requirements, please ask when ordering.',
  },
]

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Frequently asked questions about The Kebab Lab — opening hours, delivery, menu, payment & more. ${BRAND.city}'s premium clay oven kebab shop.`,
  openGraph: {
    title: `FAQ | ${BRAND.name}`,
    description: `Got questions? Find answers about our menu, delivery, opening hours & more.`,
    url: `${BRAND.website}/faq`,
    type: 'website',
  },
  alternates: {
    canonical: `${BRAND.website}/faq`,
  },
}

export default function FAQPage() {
  const breadcrumbs = [
    { name: 'Home', url: BRAND.website },
    { name: 'FAQ', url: `${BRAND.website}/faq` },
  ]

  return (
    <>
      <FAQJsonLd
        items={FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a }))}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <FAQContent items={FAQ_ITEMS} />
    </>
  )
}
