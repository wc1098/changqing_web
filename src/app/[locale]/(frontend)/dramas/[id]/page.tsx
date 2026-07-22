/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import DramaDetailClient from './DramaDetailClient'
import type { Metadata } from 'next'

interface DramaPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata(props: DramaPageProps): Promise<Metadata> {
  const { locale, id } = await props.params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const drama = await payload.findByID({
      collection: 'dramas',
      id: id,
      locale: locale as 'en' | 'zh' | 'ar' | 'tr',
    })

    if (!drama || drama._status !== 'published') {
      return {}
    }

    const title = `${drama.title} | Eastern Vision Media`
    const description = drama.summary || ''
    const imageUrl = drama.poster && typeof drama.poster === 'object' && 'url' in drama.poster ? (drama.poster.url || '') : ''

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'video.other',
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function DramaDetailPage(props: DramaPageProps) {
  const { locale, id } = await props.params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let drama: Record<string, unknown> | null = null
  let episodes: Record<string, unknown>[] = []

  try {
    // 1. Fetch Drama by ID
    drama = (await payload.findByID({
      collection: 'dramas',
      id: id,
      locale: locale as 'en' | 'zh' | 'ar' | 'tr',
    })) as unknown as Record<string, unknown>

    if (!drama || drama._status !== 'published') {
      return notFound()
    }

    // 2. Fetch Episodes for this Drama
    const episodesRes = await payload.find({
      collection: 'episodes',
      locale: locale as 'en' | 'zh' | 'ar' | 'tr',
      where: {
        and: [
          { drama: { equals: id } },
          { enabled: { equals: true } }
        ]
      },
      sort: 'episodeNumber',
      limit: 100,
    })
    episodes = episodesRes.docs as unknown as Record<string, unknown>[]
  } catch (error) {
    console.error('Error fetching drama detail page data:', error)
    return notFound()
  }

  // Schema.org structured data markup
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    'name': drama.title,
    'description': drama.summary,
    'image': drama.poster && typeof drama.poster === 'object' && 'url' in drama.poster ? drama.poster.url : undefined,
    'datePublished': drama.releaseDate,
    'productionCompany': {
      '@type': 'Organization',
      'name': 'Eastern Vision Media & IP Management FZCO',
      'logo': {
        '@type': 'ImageObject',
        'url': `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/icons/icon-512.png`
      }
    },
    'workExample': episodes.map((ep) => ({
      '@type': 'VideoObject',
      'name': `${drama.title} - Ep ${ep.episodeNumber}: ${ep.title}`,
      'position': ep.episodeNumber,
      'thumbnailUrl': drama.poster && typeof drama.poster === 'object' && 'url' in drama.poster ? drama.poster.url : undefined,
      'uploadDate': ep.createdAt || new Date().toISOString()
    }))
  }

  return (
    <div className="page-container drama-detail-wrapper">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <DramaDetailClient 
        locale={locale} 
        drama={drama as any} 
        episodes={episodes as any} 
      />
    </div>
  )
}
