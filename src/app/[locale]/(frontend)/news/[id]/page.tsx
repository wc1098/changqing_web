import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import config from '@/payload.config'

interface NewsDetailPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

const translations = {
  en: {
    backBtn: 'Back to News',
    published: 'Published on',
    category: 'Category',
    company: 'Company News',
    industry: 'Industry Insights',
    activity: 'Events & Activities',
  },
  zh: {
    backBtn: '返回新闻列表',
    published: '发布时间',
    category: '文章分类',
    company: '公司新闻',
    industry: '行业资讯',
    activity: '活动动态',
  },
  ar: {
    backBtn: 'العودة إلى الأخبار',
    published: 'نُشر في',
    category: 'الفئة',
    company: 'أخبار الشركة',
    industry: 'رؤى الصناعة',
    activity: 'الأنشطة والفعاليات',
  },
  tr: {
    backBtn: 'Haberlere Dön',
    published: 'Yayınlanma',
    category: 'Kategori',
    company: 'Şirket Haberleri',
    industry: 'Sektör Analizleri',
    activity: 'Etkinlikler & Aktiviteler',
  },
}

interface LexicalNode {
  type: string
  text?: string
  format?: number | string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  listType?: 'number' | string
  children?: LexicalNode[]
  fields?: {
    url?: string
  }
}

interface NewsArticleType {
  id: string | number
  title: string
  summary?: string | null
  category: 'company' | 'industry' | 'activity'
  publishDate: string
  createdAt: string
  updatedAt: string
  coverImage?: {
    url?: string | null
  } | number | null
  content?: {
    root?: LexicalNode | null
  } | null
}

// Simple recursive renderer for Lexical JSON output
function renderLexicalNode(node: LexicalNode, index: number): React.ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    const text = node.text
    const formatVal = typeof node.format === 'number' ? node.format : 0
    if (formatVal & 1) { // Bold
      return <strong key={index}>{text}</strong>
    }
    if (formatVal & 2) { // Italic
      return <em key={index}>{text}</em>
    }
    return <span key={index}>{text}</span>
  }

  const children = node.children ? node.children.map((child, i) => renderLexicalNode(child, i)) : null

  switch (node.type) {
    case 'root':
      return <div key={index} className="lexical-root">{children}</div>
    case 'paragraph':
      return <p key={index} className="lexical-paragraph">{children}</p>
    case 'heading':
      const Tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return <Tag key={index} className={`lexical-${Tag}`}>{children}</Tag>
    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return <ListTag key={index} className="lexical-list">{children}</ListTag>
    case 'listitem':
      return <li key={index} className="lexical-listitem">{children}</li>
    case 'quote':
      return <blockquote key={index} className="lexical-blockquote">{children}</blockquote>
    case 'link':
      return (
        <a key={index} href={node.fields?.url || '#'} target="_blank" rel="noopener noreferrer" className="lexical-link">
          {children}
        </a>
      )
    default:
      // Fallback
      if (children) {
        return <div key={index} className={`lexical-block-${node.type}`}>{children}</div>
      }
      return null
  }
}

import { Metadata } from 'next'

export async function generateMetadata(props: NewsDetailPageProps): Promise<Metadata> {
  const { locale, id } = await props.params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const article = await payload.findByID({
      collection: 'news',
      id: id,
      locale: locale as 'en' | 'zh' | 'ar' | 'tr',
    })

    if (!article) return {}

    const title = `${article.title} | Eastern Vision News`
    const description = article.summary || ''
    const imageUrl = article.coverImage && typeof article.coverImage === 'object' && 'url' in article.coverImage ? (article.coverImage.url || '') : ''

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: article.publishDate,
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

export default async function NewsDetailPage(props: NewsDetailPageProps) {
  const { locale, id } = await props.params
  const t = translations[locale as keyof typeof translations] || translations.en

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let article: NewsArticleType | null = null

  try {
    article = await payload.findByID({
      collection: 'news',
      id: id,
      locale: locale as 'en' | 'zh' | 'ar' | 'tr',
    })
  } catch (error) {
    console.error('Error fetching news article:', error)
    return notFound()
  }

  if (!article) {
    return notFound()
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'company': return t.company
      case 'industry': return t.industry
      case 'activity': return t.activity
      default: return cat
    }
  }

  // Schema.org NewsArticle JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.summary || '',
    'image': article.coverImage && typeof article.coverImage === 'object' && 'url' in article.coverImage && article.coverImage.url ? [article.coverImage.url] : [],
    'datePublished': article.publishDate || article.createdAt,
    'dateModified': article.updatedAt || article.publishDate || article.createdAt,
    'author': {
      '@type': 'Organization',
      'name': 'Eastern Vision Media & IP Management FZCO',
      'logo': {
        '@type': 'ImageObject',
        'url': `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/icons/icon-512.png`
      }
    }
  }

  return (
    <div className="page-container container-spacing">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="news-detail-container glass-panel">
        {/* Back Link */}
        <Link href={`/${locale}/news`} className="back-news-btn">
          &larr; {t.backBtn}
        </Link>

        {/* Cover Image */}
        {article.coverImage && typeof article.coverImage === 'object' && 'url' in article.coverImage && (
          <div className="article-cover-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.coverImage.url || ''} alt={article.title} className="article-cover-img" />
          </div>
        )}

        <header className="article-header">
          <div className="article-meta">
            <span className="category-badge">{getCategoryLabel(article.category)}</span>
            <span className="publish-date">{t.published}: {new Date(article.publishDate).toLocaleDateString()}</span>
          </div>
          <h1 className="article-title gold-gradient-text">{article.title}</h1>
          {article.summary && <p className="article-summary-lead">{article.summary}</p>}
        </header>

        <hr className="article-divider" />

        {/* Content Body */}
        <div className="article-body">
          {article.content && typeof article.content === 'object' && article.content.root ? (
            renderLexicalNode(article.content.root, 0)
          ) : (
            <p className="fallback-text">No content available.</p>
          )}
        </div>
      </div>
    </div>
  )
}
