import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { ThemeProvider } from '@/lib/theme-provider'
import { Toaster } from 'sonner'
import { BRAND } from '@/lib/data/brand'
import { StoreHydrator } from '@/components/common/StoreHydrator'
import { PWAInstallPrompt } from '@/components/common/PWAInstallPrompt'
import { MobileFloatingCart } from '@/components/cart/MobileFloatingCart'
import { BackToTop } from '@/components/common/BackToTop'
import { PromoBanner } from '@/components/common/PromoBanner'
import { QuickOrderFAB } from '@/components/common/QuickOrderFAB'

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
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0b' },
    { media: '(prefers-color-scheme: light)', color: '#f5f3f0' },
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
          <StoreHydrator />
          <PWAInstallPrompt />
          <MobileFloatingCart />
          <PromoBanner />
          <Navbar />
          <main className="pb-28 md:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <BottomTabBar />
          <BackToTop />
          <QuickOrderFAB />
          <a
            href={`https://wa.me/44${BRAND.phoneRaw.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            className="fixed bottom-24 md:bottom-6 right-6 z-30 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
            style={{ background: '#25D366' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
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
