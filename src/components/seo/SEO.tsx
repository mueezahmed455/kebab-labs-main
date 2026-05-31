import type { ReactNode } from 'react'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface FAQJsonLdProps {
  items: { question: string; answer: string }[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}

interface LocalBusinessJsonLdProps {
  name: string
  description: string
  url: string
  telephone: string
  address: {
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  geo: { latitude: number; longitude: number }
  openingHoursSpecification: {
    dayOfWeek: string[]
    opens: string
    closes: string
  }[]
  priceRange?: string
  image?: string
}

export function LocalBusinessJsonLd(props: LocalBusinessJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: props.name,
        description: props.description,
        url: props.url,
        telephone: props.telephone,
        address: {
          '@type': 'PostalAddress',
          ...props.address,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: props.geo.latitude,
          longitude: props.geo.longitude,
        },
        openingHoursSpecification: props.openingHoursSpecification.map((spec) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: spec.dayOfWeek,
          opens: spec.opens,
          closes: spec.closes,
        })),
        priceRange: props.priceRange,
        image: props.image,
      }}
    />
  )
}

interface MenuJsonLdProps {
  name: string
  description: string
  url: string
  items: {
    name: string
    description?: string
    price: number
    currency?: string
    image?: string
    category?: string
  }[]
}

export function MenuJsonLd({ name, description, url, items }: MenuJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Menu',
        name,
        description,
        url,
        hasMenuSection: items.length > 0
          ? [
              {
                '@type': 'MenuSection',
                name,
                hasMenuItem: items.map((item) => ({
                  '@type': 'MenuItem',
                  name: item.name,
                  description: item.description,
                  offers: {
                    '@type': 'Offer',
                    price: item.price,
                    priceCurrency: item.currency || 'GBP',
                  },
                  ...(item.image ? { image: item.image } : {}),
                  ...(item.category ? { category: item.category } : {}),
                })),
              },
            ]
          : [],
      }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}

interface OrganizationJsonLdProps {
  name: string
  url: string
  logo?: string
  sameAs?: string[]
}

export function OrganizationJsonLd({ name, url, logo, sameAs }: OrganizationJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        ...(logo ? { logo } : {}),
        ...(sameAs ? { sameAs } : {}),
      }}
    />
  )
}
