import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/checkout', '/confirmation'] },
    ],
    sitemap: 'https://thekebablabonline.co.uk/sitemap.xml',
  }
}
