import { getPayload, type Where } from 'payload'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import config from '@/payload.config'
import type { News } from '@/payload-types'

const translations = {
  en: {
    title: 'News & Press',
    sub: 'Keep up with our latest announcements, industrial events, and short drama insights.',
    all: 'All News',
    company: 'Company News',
    industry: 'Industry Insights',
    activity: 'Events & Activities',
    readMore: 'Read Article',
    published: 'Published on',
    emptyNews: 'No news articles found. Check back later!',
  },
  zh: {
    title: '新闻动态',
    sub: '了解我们最新的企业动态、行业观察与短剧出海相关活动资讯。',
    all: '全部动态',
    company: '公司新闻',
    industry: '行业资讯',
    activity: '活动动态',
    readMore: '阅读全文',
    published: '发布时间',
    emptyNews: '暂无新闻动态发布。请在后台添加文章！',
  },
  ar: {
    title: 'الأخبار والفعاليات',
    sub: 'تابع آخر إعلاناتنا وفعالياتنا الصناعية ورؤى حول المسلسلات القصيرة.',
    all: 'كل الأخبار',
    company: 'أخبار الشركة',
    industry: 'رؤى الصناعة',
    activity: 'الأنشطة والفعاليات',
    readMore: 'اقرأ المقال',
    published: 'نُشر في',
    emptyNews: 'لم يتم العثور على مقالات إخبارية. يرجى زيارتنا لاحقاً!',
  },
  tr: {
    title: 'Haberler & Basın',
    sub: 'En son duyurularımızı, sektörel etkinlikleri ve kısa dizilerle ilgili gelişmeleri takip edin.',
    all: 'Tüm Haberler',
    company: 'Şirket Haberleri',
    industry: 'Sektör Analizleri',
    activity: 'Etkinlikler & Aktiviteler',
    readMore: 'Devamını Oku',
    published: 'Yayınlanma',
    emptyNews: 'Yayınlanmış haber bulunamadı. Lütfen daha sonra tekrar kontrol edin!',
  },
}

export default async function NewsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cat?: string }>
}) {
  const { locale } = await props.params
  const searchParams = await props.searchParams
  const activeCategory = searchParams.cat || ''

  const t = translations[locale as keyof typeof translations] || translations.en

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const queryConditions: Where[] = []
  if (activeCategory) {
    queryConditions.push({ category: { equals: activeCategory } })
  }

  let newsList: News[] = []
  try {
    const newsRes = await payload.find({
      collection: 'news',
      locale: locale as 'en' | 'zh' | 'ar' | 'tr',
      where: queryConditions.length > 0 ? { and: queryConditions } : undefined,
      sort: '-publishDate',
      limit: 100,
    })
    newsList = newsRes.docs
  } catch (error) {
    console.error('Error fetching news:', error)
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'company': return t.company
      case 'industry': return t.industry
      case 'activity': return t.activity
      default: return cat
    }
  }

  return (
    <div className="page-container container-spacing">
      <div className="section-header">
        <span className="section-eyebrow">EV PRESSROOM</span>
        <h1 className="section-title gold-gradient-text">{t.title}</h1>
        <p className="section-subtitle">{t.sub}</p>
      </div>

      {/* Category Tabs */}
      <div className="news-filter-tabs">
        <Link href={`/${locale}/news`} className={`tab-btn ${!activeCategory ? 'active' : ''}`}>
          {t.all}
        </Link>
        <Link href={`/${locale}/news?cat=company`} className={`tab-btn ${activeCategory === 'company' ? 'active' : ''}`}>
          {t.company}
        </Link>
        <Link href={`/${locale}/news?cat=industry`} className={`tab-btn ${activeCategory === 'industry' ? 'active' : ''}`}>
          {t.industry}
        </Link>
        <Link href={`/${locale}/news?cat=activity`} className={`tab-btn ${activeCategory === 'activity' ? 'active' : ''}`}>
          {t.activity}
        </Link>
      </div>

      {/* News Cards Grid */}
      {newsList.length > 0 ? (
        <div className="news-grid">
          {newsList.map((item) => (
            <article key={item.id} className="news-card glass-panel">
              <div className="news-card-image-wrapper">
                {item.coverImage && typeof item.coverImage === 'object' && item.coverImage.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.coverImage.url} alt={item.title} className="news-card-img" loading="lazy" />
                ) : (
                  <div className="news-card-placeholder">
                    <Newspaper size={36} color="var(--gold-light)" />
                  </div>
                )}
                <span className="news-card-tag">{getCategoryLabel(item.category)}</span>
              </div>
              <div className="news-card-content">
                <span className="news-card-date">{t.published}: {new Date(item.publishDate).toLocaleDateString()}</span>
                <h2 className="news-card-title">{item.title}</h2>
                <p className="news-card-summary">{item.summary}</p>
                <Link href={`/${locale}/news/${item.id}`} className="news-card-link">
                  {t.readMore} &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel centered-text">
          <p>{t.emptyNews}</p>
        </div>
      )}
    </div>
  )
}
