import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const locales = ['en', 'zh', 'ar', 'tr']

  // Static pages
  const staticPaths = ['', '/about', '/services', '/contact', '/dramas', '/news']
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static paths for each locale
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      })
    })
  })

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // 1. Fetch all published dramas
    try {
      const dramasRes = await payload.find({
        collection: 'dramas',
        where: {
          _status: { equals: 'published' },
        },
        limit: 100,
      })

      dramasRes.docs.forEach((drama) => {
        locales.forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/dramas/${drama.id}`,
            lastModified: drama.updatedAt ? new Date(drama.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        })
      })
    } catch (error) {
      console.error('Error generating sitemap dramas:', error)
    }

    // 2. Fetch all published news
    try {
      const newsRes = await payload.find({
        collection: 'news',
        limit: 100,
      })

      newsRes.docs.forEach((newsItem) => {
        locales.forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/news/${newsItem.id}`,
            lastModified: newsItem.updatedAt ? new Date(newsItem.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          })
        })
      })
    } catch (error) {
      console.error('Error generating sitemap news:', error)
    }
  } catch (error) {
    console.warn('Payload DB connection skipped during sitemap build generation:', error)
  }

  return sitemapEntries
}
