import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/lib/theme-provider'
import { Toaster } from 'sonner'
import { BRAND } from '@/lib/data/brand'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thekebablabonline.co.uk'),
  title: {
    default: 'The Kebab Lab — Clay Oven Specialist | Burnley',
    template: '%s | The Kebab Lab',
  },
  description:
    'Premium clay oven kebabs, authentic shawarma, stone-baked pizzas and sharing platters. Order online for delivery or collection in Burnley, Lancashire. Open 6 days a week, 4pm–12:40am.',
  keywords: [
    'kebab', 'kebab shop', 'Burnley', 'clay oven', 'shawarma', 'pizza', 'takeaway',
    'online ordering', 'halal', 'kebab delivery', 'Lancashire',
  ],
  authors: [{ name: 'The Kebab Lab' }],
  creator: 'The Kebab Lab',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://thekebablabonline.co.uk',
    siteName: 'The Kebab Lab',
    title: 'The Kebab Lab — Clay Oven Specialist | Burnley',
    description:
      'Premium clay oven kebabs, authentic shawarma & stone-baked pizzas. Order online for delivery across Burnley.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'The Kebab Lab — Clay Oven Specialist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Kebab Lab — Clay Oven Specialist',
    description: 'Premium clay oven kebabs, authentic shawarma & stone-baked pizzas. Order online.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/icons/icon-192.svg', apple: '/icons/icon-192.svg' },
  alternates: { canonical: 'https://thekebablabonline.co.uk' },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Kebab Lab' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#080a0f' },
    { media: '(prefers-color-scheme: light)', color: '#f5f2ed' },
  ],
  width: 'device-width',
  initialScale: 1,
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/<\//g, '<\\/')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: BRAND.name,
    description: 'Premium clay oven kebabs, authentic shawarma and stone-baked pizzas in Burnley.',
    url: 'https://thekebablabonline.co.uk',
    telephone: BRAND.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Colne Road',
      addressLocality: 'Burnley',
      postalCode: 'BB10 1LN',
      addressCountry: 'GB',
    },
    geo: { '@type': 'GeoCoordinates', latitude: BRAND.coordinates.lat, longitude: BRAND.coordinates.lng },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '16:00', closes: '00:40' },
    ],
    servesCuisine: ['Kebab', 'Pizza', 'Burgers', 'Middle Eastern'],
    priceRange: '££',
    hasMenu: 'https://thekebablabonline.co.uk/menu',
    acceptsReservations: false,
    image: 'https://thekebablabonline.co.uk/og-image.jpg',
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('kebab-lab-theme');if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add('dark')}})()`
        }} />
        <script type="application/ld+json" suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-brand-card)',
                border: '1px solid var(--color-brand-green)',
                color: 'var(--color-brand-text)',
                borderColor: 'color-mix(in srgb, var(--color-brand-green) 25%, transparent)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
