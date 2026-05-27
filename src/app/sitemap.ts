import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://thekebablabonline.co.uk'
  const now = new Date()

  return [
    { url: base,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/menu`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/deals`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/checkout`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
