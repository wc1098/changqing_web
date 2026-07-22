import { getPayload, type Where } from 'payload'
import Link from 'next/link'
import { Film, ChevronLeft, ChevronRight, SlidersHorizontal, Globe, Tv, Layers, ArrowUpDown, RotateCcw, Sparkles } from 'lucide-react'
import config from '@/payload.config'
import type { Genre, Language, Market, Platform, Drama } from '@/payload-types'

const translations = {
  en: {
    title: 'Drama Content Library',
    sub: 'Explore our B2B Chinese drama catalog with deep localization support.',
    filterGenre: 'Genre',
    filterLang: 'Language',
    filterMarket: 'Market',
    filterPlatform: 'Platform',
    filterEpisodes: 'Episodes',
    filterSort: 'Sort Order',
    all: 'All',
    epRange1: '1-10 Ep',
    epRange2: '11-30 Ep',
    epRange3: '30+ Ep',
    sortLatest: 'Latest Released',
    sortOldest: 'Oldest Released',
    totalFound: 'Dramas found',
    episodes: 'Episodes',
    status: 'Published',
    emptyList: 'No dramas match your current selection filter. Try clearing some filters.',
    clearFilters: 'Clear Filters',
    prevPage: 'Previous',
    nextPage: 'Next',
  },
  zh: {
    title: '精品短剧作品库',
    sub: '探索我们面向 B2B 客户的优质海外版权短剧矩阵。',
    filterGenre: '题材分类',
    filterLang: '配音字幕',
    filterMarket: '授权市场',
    filterPlatform: '适配平台',
    filterEpisodes: '集数范围',
    filterSort: '上线时间',
    all: '全部',
    epRange1: '1-10集',
    epRange2: '11-30集',
    epRange3: '30集以上',
    sortLatest: '最新上架',
    sortOldest: '更早发布',
    totalFound: '部作品符合条件',
    episodes: '集数',
    status: '已发布',
    emptyList: '暂无符合当前筛选条件的短剧。请尝试调整筛选选项。',
    clearFilters: '重置筛选',
    prevPage: '上一页',
    nextPage: '下一页',
  },
  ar: {
    title: 'مكتبة الأعمال الدرامية',
    sub: 'استكشف مسلسلاتنا الصينية القصيرة المتميزة مع دعم التكيف المحلي الكامل.',
    filterGenre: 'التصنيف',
    filterLang: 'اللغة / الترجمة',
    filterMarket: 'المنطقة المرخصة',
    filterPlatform: 'المنصة المتوافقة',
    filterEpisodes: 'عدد الحلقات',
    filterSort: 'تاريخ الإصدار',
    all: 'الكل',
    epRange1: '١-١٠ حلقات',
    epRange2: '١١-٣٠ حلقة',
    epRange3: '٣٠+ حلقة',
    sortLatest: 'الأحدث إصداراً',
    sortOldest: 'الأقدم إصداراً',
    totalFound: 'عمل درامي مطابق',
    episodes: 'حلقة',
    status: 'منشور',
    emptyList: 'لا توجد أعمال تطابق خيارات التصفية الحالية. يرجى تجربة إعادة ضبط التصفية.',
    clearFilters: 'إعادة ضبط التصفية',
    prevPage: 'السابق',
    nextPage: 'التالي',
  },
  tr: {
    title: 'Dizi İçerik Kütüphanesi',
    sub: 'B2B Çin dizilerimizden oluşan yerelleştirilmiş içerik ağımızı keşfedin.',
    filterGenre: 'Tür',
    filterLang: 'Dil / Altyazı',
    filterMarket: 'Yetkili Pazar',
    filterPlatform: 'Uyumlu Platform',
    filterEpisodes: 'Bölüm Sayısı',
    filterSort: 'Yayın Tarihi',
    all: 'Tümü',
    epRange1: '1-10 Bölüm',
    epRange2: '11-30 Bölüm',
    epRange3: '30+ Bölüm',
    sortLatest: 'En Yeni',
    sortOldest: 'En Eski',
    totalFound: 'Dizi bulundu',
    episodes: 'Bölüm',
    status: 'Yayınlandı',
    emptyList: 'Seçtiğiniz filtrelere uygun dizi bulunamadı. Filtreleri sıfırlamayı deneyin.',
    clearFilters: 'Filtreleri Temizle',
    prevPage: 'Önceki',
    nextPage: 'Sonraki',
  },
}

export default async function DramasPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    genre?: string
    lang?: string
    market?: string
    platform?: string
    episodes?: string
    sort?: string
    page?: string
  }>
}) {
  const { locale } = await props.params
  const searchParams = await props.searchParams

  const activeGenreCode = searchParams.genre || ''
  const activeLangCode = searchParams.lang || ''
  const activeMarketCode = searchParams.market || ''
  const activePlatformCode = searchParams.platform || ''
  const activeEpRange = searchParams.episodes || ''
  const activeSort = searchParams.sort || '-releaseDate'
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10))

  const t = translations[locale as keyof typeof translations] || translations.en

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 1. Fetch filter options (Metadata lists)
  let genres: Genre[] = []
  let languages: Language[] = []
  let markets: Market[] = []
  let platforms: Platform[] = []

  const currentLocale = locale as 'en' | 'zh' | 'ar' | 'tr'

  try {
    const genresRes = await payload.find({ collection: 'genres', locale: currentLocale, limit: 100 })
    genres = genresRes.docs as Genre[]

    const langsRes = await payload.find({ collection: 'languages', locale: currentLocale, limit: 100 })
    languages = langsRes.docs as Language[]

    const marketsRes = await payload.find({ collection: 'markets', locale: currentLocale, limit: 100 })
    markets = marketsRes.docs as Market[]

    const platformsRes = await payload.find({ collection: 'platforms', locale: currentLocale, limit: 100 })
    platforms = platformsRes.docs as Platform[]
  } catch (error) {
    console.error('Error prefetching filters:', error)
  }

  // 2. Build where filter clauses
  const queryConditions: Where[] = [
    { _status: { equals: 'published' } }
  ]

  if (activeGenreCode) {
    queryConditions.push({ 'genres.code': { equals: activeGenreCode } })
  }
  if (activeLangCode) {
    queryConditions.push({ 'languages.code': { equals: activeLangCode } })
  }
  if (activeMarketCode) {
    queryConditions.push({ 'markets.code': { equals: activeMarketCode } })
  }
  if (activePlatformCode) {
    queryConditions.push({ 'platforms.code': { equals: activePlatformCode } })
  }

  if (activeEpRange) {
    if (activeEpRange === '1-10') {
      queryConditions.push({ episodeCount: { greater_than_equal: 1 } })
      queryConditions.push({ episodeCount: { less_than_equal: 10 } })
    } else if (activeEpRange === '11-30') {
      queryConditions.push({ episodeCount: { greater_than_equal: 11 } })
      queryConditions.push({ episodeCount: { less_than_equal: 30 } })
    } else if (activeEpRange === '30+') {
      queryConditions.push({ episodeCount: { greater_than_equal: 31 } })
    }
  }

  // 3. Fetch matching dramas with pagination
  let dramas: Drama[] = []
  let totalPages = 1
  let totalDocs = 0
  let hasPrevPage = false
  let hasNextPage = false

  try {
    const dramasRes = await payload.find({
      collection: 'dramas',
      locale: currentLocale,
      where: {
        and: queryConditions
      },
      sort: activeSort as string,
      limit: 12,
      page: currentPage,
    })
    dramas = dramasRes.docs
    totalPages = dramasRes.totalPages || 1
    totalDocs = dramasRes.totalDocs || 0
    hasPrevPage = dramasRes.hasPrevPage || false
    hasNextPage = dramasRes.hasNextPage || false
  } catch (error) {
    console.error('Error fetching filtered dramas:', error)
  }

  // Helper function to build dynamic link hrefs preserving other active search parameters
  const getFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    
    // Copy existing search params
    if (activeGenreCode) params.set('genre', activeGenreCode)
    if (activeLangCode) params.set('lang', activeLangCode)
    if (activeMarketCode) params.set('market', activeMarketCode)
    if (activePlatformCode) params.set('platform', activePlatformCode)
    if (activeEpRange) params.set('episodes', activeEpRange)
    if (activeSort && activeSort !== '-releaseDate') params.set('sort', activeSort)

    if (value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    const queryStr = params.toString()
    return `/${locale}/dramas${queryStr ? '?' + queryStr : ''}`
  }

  // Helper to build page URL
  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (activeGenreCode) params.set('genre', activeGenreCode)
    if (activeLangCode) params.set('lang', activeLangCode)
    if (activeMarketCode) params.set('market', activeMarketCode)
    if (activePlatformCode) params.set('platform', activePlatformCode)
    if (activeEpRange) params.set('episodes', activeEpRange)
    if (activeSort && activeSort !== '-releaseDate') params.set('sort', activeSort)
    if (pageNum > 1) params.set('page', pageNum.toString())

    const queryStr = params.toString()
    return `/${locale}/dramas${queryStr ? '?' + queryStr : ''}`
  }

  return (
    <div className="page-container container-spacing">
      {/* Page Header */}
      <div className="section-header">
        <span className="section-eyebrow">B2B CONTENT MATRICES</span>
        <h1 className="section-title gold-gradient-text">{t.title}</h1>
        <p className="section-subtitle">{t.sub}</p>
      </div>

      {/* Six-Dimensional Filter Panels */}
      <div className="filter-system glass-panel">
        {/* Genre */}
        <div className="filter-row">
          <span className="filter-label"><SlidersHorizontal size={14} /> {t.filterGenre}:</span>
          <div className="filter-options">
            <Link href={getFilterUrl('genre', '')} className={`filter-opt-btn ${!activeGenreCode ? 'active' : ''}`}>
              {t.all}
            </Link>
            {genres.map((g) => (
              <Link key={g.id} href={getFilterUrl('genre', g.code)} className={`filter-opt-btn ${activeGenreCode === g.code ? 'active' : ''}`}>
                {g.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="filter-row">
          <span className="filter-label"><Globe size={14} /> {t.filterLang}:</span>
          <div className="filter-options">
            <Link href={getFilterUrl('lang', '')} className={`filter-opt-btn ${!activeLangCode ? 'active' : ''}`}>
              {t.all}
            </Link>
            {languages.map((l) => (
              <Link key={l.id} href={getFilterUrl('lang', l.code)} className={`filter-opt-btn ${activeLangCode === l.code ? 'active' : ''}`}>
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Market */}
        <div className="filter-row">
          <span className="filter-label"><Sparkles size={14} /> {t.filterMarket}:</span>
          <div className="filter-options">
            <Link href={getFilterUrl('market', '')} className={`filter-opt-btn ${!activeMarketCode ? 'active' : ''}`}>
              {t.all}
            </Link>
            {markets.map((m) => (
              <Link key={m.id} href={getFilterUrl('market', m.code)} className={`filter-opt-btn ${activeMarketCode === m.code ? 'active' : ''}`}>
                {m.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="filter-row">
          <span className="filter-label"><Tv size={14} /> {t.filterPlatform}:</span>
          <div className="filter-options">
            <Link href={getFilterUrl('platform', '')} className={`filter-opt-btn ${!activePlatformCode ? 'active' : ''}`}>
              {t.all}
            </Link>
            {platforms.map((p) => (
              <Link key={p.id} href={getFilterUrl('platform', p.code)} className={`filter-opt-btn ${activePlatformCode === p.code ? 'active' : ''}`}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Episodes Count Range */}
        <div className="filter-row">
          <span className="filter-label"><Layers size={14} /> {t.filterEpisodes}:</span>
          <div className="filter-options">
            <Link href={getFilterUrl('episodes', '')} className={`filter-opt-btn ${!activeEpRange ? 'active' : ''}`}>
              {t.all}
            </Link>
            <Link href={getFilterUrl('episodes', '1-10')} className={`filter-opt-btn ${activeEpRange === '1-10' ? 'active' : ''}`}>
              {t.epRange1}
            </Link>
            <Link href={getFilterUrl('episodes', '11-30')} className={`filter-opt-btn ${activeEpRange === '11-30' ? 'active' : ''}`}>
              {t.epRange2}
            </Link>
            <Link href={getFilterUrl('episodes', '30+')} className={`filter-opt-btn ${activeEpRange === '30+' ? 'active' : ''}`}>
              {t.epRange3}
            </Link>
          </div>
        </div>

        {/* Sort Order */}
        <div className="filter-row">
          <span className="filter-label"><ArrowUpDown size={14} /> {t.filterSort}:</span>
          <div className="filter-options">
            <Link href={getFilterUrl('sort', '-releaseDate')} className={`filter-opt-btn ${activeSort === '-releaseDate' ? 'active' : ''}`}>
              {t.sortLatest}
            </Link>
            <Link href={getFilterUrl('sort', 'releaseDate')} className={`filter-opt-btn ${activeSort === 'releaseDate' ? 'active' : ''}`}>
              {t.sortOldest}
            </Link>
          </div>
        </div>

        {/* Clear Filters Option */}
        {(activeGenreCode || activeLangCode || activeMarketCode || activePlatformCode || activeEpRange) && (
          <div className="filter-summary-row">
            <span>{totalDocs} {t.totalFound}</span>
            <Link href={`/${locale}/dramas`} className="clear-filters-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <RotateCcw size={13} /> {t.clearFilters}
            </Link>
          </div>
        )}
      </div>

      {/* Drama Card Grid */}
      {dramas.length > 0 ? (
        <>
          <div className="drama-grid">
            {dramas.map((drama) => (
              <Link 
                href={`/${locale}/dramas/${drama.id}`} 
                key={drama.id} 
                className="drama-card glass-panel"
              >
                <div className="drama-card-image-wrapper">
                  {drama.poster && typeof drama.poster === 'object' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={(drama.poster.url ?? undefined) || '/api/placeholder/400/600'} 
                      alt={drama.title} 
                      className="drama-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="drama-card-placeholder">
                      <Film size={36} color="var(--gold-light)" />
                    </div>
                  )}
                  <div className="drama-card-tag">{t.status}</div>
                </div>
                <div className="drama-card-content">
                  <span className="drama-card-code">{drama.code}</span>
                  <h3 className="drama-card-title">{drama.title}</h3>
                  <p className="drama-card-summary">{drama.summary}</p>
                  <div className="drama-card-footer">
                    <span>{t.episodes}: <strong>{drama.episodeCount}</strong></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <Link
                href={hasPrevPage ? getPageUrl(currentPage - 1) : '#'}
                className={`pagination-btn ${!hasPrevPage ? 'disabled' : ''}`}
                tabIndex={hasPrevPage ? 0 : -1}
              >
                <ChevronLeft size={16} /> {t.prevPage}
              </Link>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={getPageUrl(p)}
                    className={`pagination-num ${p === currentPage ? 'active' : ''}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
              <Link
                href={hasNextPage ? getPageUrl(currentPage + 1) : '#'}
                className={`pagination-btn ${!hasNextPage ? 'disabled' : ''}`}
                tabIndex={hasNextPage ? 0 : -1}
              >
                {t.nextPage} <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state glass-panel centered-text">
          <p>{t.emptyList}</p>
          <Link href={`/${locale}/dramas`} className="btn btn-secondary">
            {t.clearFilters}
          </Link>
        </div>
      )}
    </div>
  )
}
