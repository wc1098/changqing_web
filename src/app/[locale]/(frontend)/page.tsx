/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'
import Link from 'next/link'
import config from '@/payload.config'

const translations = {
  en: {
    heroSub: 'DUBAI · MENA · GLOBAL CONTENT',
    heroTitle: 'Bring Premium Chinese Dramas to ',
    heroTitleHighlight: 'the MENA Region',
    heroDesc: 'Driven by premium content supply and deep localization, we build a complete loop for drama production, distribution, and monetization in the Middle East and North Africa.',
    ctaDramas: 'Browse Drama Library',
    ctaContact: 'Contact Us',
    servicesTitle: 'OUR SERVICES',
    servicesSub: 'Full-Chain Content Solutions',
    featuredTitle: 'FEATURED STORIES',
    featuredSub: 'Premium Drama Selection',
    partnersTitle: 'OUR PARTNERS',
    partnersSub: 'Collaborations Across the Globe',
    ctaSectionTitle: 'READY FOR THE NEXT BIG HIT?',
    ctaSectionDesc: 'Contact us today to explore partnership, distribution, or customized co-production opportunities in the Middle East.',
    ctaBtn: 'Start B2B Cooperation',
    dramasCount: 'Total Dramas',
    countriesCount: 'MENA Countries',
    partnersCount: 'Platform Partners',
    usersReach: 'Total Reach',
    emptyDramas: 'No featured dramas found. Please add dramas in the admin dashboard and mark them as "Featured on Homepage".',
    episodes: 'Episodes',
    status: 'Published',
  },
  zh: {
    heroSub: '迪拜 · 中东北非 · 全球内容',
    heroTitle: '让中国精品短剧走向',
    heroTitleHighlight: '中东与北非市场',
    heroDesc: '以优质内容输出与本地化深度适配为双轮驱动，构建短剧制作、发行与运营的完整闭环。',
    ctaDramas: '查看精品作品库',
    ctaContact: '联系我们',
    servicesTitle: '业务服务',
    servicesSub: '覆盖内容出海全链路',
    featuredTitle: '精选作品',
    featuredSub: '热门优质短剧展示',
    partnersTitle: '合作伙伴',
    partnersSub: '与全球顶级渠道深度合作',
    ctaSectionTitle: '开启您的短剧出海之旅',
    ctaSectionDesc: '联系我们，共同发掘中东地区的版权发行、联合制作与定制化内容服务的新机遇。',
    ctaBtn: '开始商务合作',
    dramasCount: '精品短剧数',
    countriesCount: '覆盖国家及地区',
    partnersCount: '已对接流媒体平台',
    usersReach: '累计触达用户',
    emptyDramas: '暂无推荐短剧。请在后台录入短剧并勾选“首页推荐”。',
    episodes: '集数',
    status: '已发布',
  },
  ar: {
    heroSub: 'دبي · الشرق الأوسط وشمال أفريقيا · محتوى عالمي',
    heroTitle: 'جلب المسلسلات الصينية المميزة إلى ',
    heroTitleHighlight: 'الشرق الأوسط وشمال أفريقيا',
    heroDesc: 'نحن نبني حلقة كاملة لإنتاج وتوزيع المسلسلات وتشغيلها في منطقة الشرق الأوسط وشمال أفريقيا، مدفوعين بإنتاج المحتوى عالي الجودة والتكيف المحلي العميق.',
    ctaDramas: 'تصفح مكتبة الأعمال',
    ctaContact: 'اتصل بنا',
    servicesTitle: 'خدماتنا',
    servicesSub: 'حلول المحتوى عبر السلسلة بأكملها',
    featuredTitle: 'الأعمال المختارة',
    featuredSub: 'عرض المسلسلات القصيرة الرائجة والمميزة',
    partnersTitle: 'شركاؤنا',
    partnersSub: 'تعاون وثيق مع أفضل القنوات العالمية',
    ctaSectionTitle: 'هل أنت جاهز للنجاح الكبير القادم؟',
    ctaSectionDesc: 'اتصل بنا اليوم لاستكشاف فرص الشراكة والتوزيع أو الإنتاج المشترك المخصص في الشرق الأوسط.',
    ctaBtn: 'بدء التعاون التجاري',
    dramasCount: 'إجمالي المسلسلات',
    countriesCount: 'تغطية دول الشرق الأوسط',
    partnersCount: 'منصات الشركاء',
    usersReach: 'إجمالي الوصول للمستخدمين',
    emptyDramas: 'لم يتم العثور على مسلسلات مميزة. يرجى إضافة أعمال في لوحة التحكم وتفعيل خيار "مميز على الصفحة الرئيسية".',
    episodes: 'حلقة',
    status: 'منشور',
  },
  tr: {
    heroSub: 'DUBAI · MENA · KÜRESEL İÇERİK',
    heroTitle: 'Seçkin Çin Dizilerini ',
    heroTitleHighlight: 'MENA Bölgesine Getirin',
    heroDesc: 'Seçkin içerik sunumu ve derin yerelleştirme ile Orta Doğu ve Kuzey Afrika\'da dizi yapımı, dağıtımı ve ticarileştirilmesi için eksiksiz bir döngü oluşturuyoruz.',
    ctaDramas: 'Dizi Kütüphanesine Göz At',
    ctaContact: 'İletişim',
    servicesTitle: 'HİZMETLERİMİZ',
    servicesSub: 'Tüm İçerik Süreçlerinde Çözümler',
    featuredTitle: 'ÖNE ÇIKAN HİKAYELER',
    featuredSub: 'Seçkin Dizi Koleksiyonu',
    partnersTitle: 'ORTAKLARIMIZ',
    partnersSub: 'Küresel Çapta İşbirlikleri',
    ctaSectionTitle: 'BİR SONRAKİ BÜYÜK BAŞARIYA HAZIR MISINIZ?',
    ctaSectionDesc: 'Orta Doğu\'da ortaklık, dağıtım veya özel ortak yapım fırsatlarını keşfetmek için bugün bizimle iletişime geçin.',
    ctaBtn: 'B2B İşbirliği Başlat',
    dramasCount: 'Toplam Dizi',
    countriesCount: 'Kapsanan Ülkeler',
    partnersCount: 'Kanal Ortakları',
    usersReach: 'Toplam Erişim',
    emptyDramas: 'Öne çıkan dizi bulunamadı. Lütfen yönetim panelinden dizi ekleyin ve "Ana Sayfada Öne Çıkarılan" olarak işaretleyin.',
    episodes: 'Bölüm',
    status: 'Yayınlandı',
  },
}

const servicesData = {
  en: [
    ['01', 'Full-Scale Production', 'Complete drama production chain from script writing to editing and final delivery.'],
    ['02', 'MENA Distribution', 'Connecting premium IP and content with local Middle East streaming platforms.'],
    ['03', 'Localized Marketing', 'Subtitling, dubbing, and targeted promotional campaigns tailored for Arabic cultures.'],
    ['04', 'IP Customization', 'Co-production and content adaptation to build global franchises.'],
  ],
  zh: [
    ['01', '短剧全链条制作', '涵盖剧本创作、外景拍摄、后期剪辑直至成片交付的完整工业化生产线。'],
    ['02', '中东发行渠道', '链接中国优质短剧版权，与中东本地主流流媒体及社交平台深度对接。'],
    ['03', '本地化适配营销', '提供专业的阿语/土语翻译、本地化配音及精准的目标市场社媒推广。'],
    ['04', 'IP 孵化与定制', '与当地资本和制作团队联合开发，根据 MENA 市场喜好定制本土化内容。'],
  ],
  ar: [
    ['٠١', 'إنتاج متكامل', 'سلسلة إنتاج درامي كاملة من كتابة السيناريو والتصوير الخارجي والمونتاج حتى التسليم النهائي.'],
    ['٠٢', 'التوزيع في الشرق الأوسط', 'ربط حقوق الملكية الفكرية المميزة والمحتوى مع منصات البث المحلية الرائدة.'],
    ['٠٣', 'التسويق والتكيف المحلي', 'تقديم خدمات الترجمة والدبلجة الاحترافية وحملات الترويج المخصصة للثقافة العربية.'],
    ['٠٤', 'حضانة وتخصيص IP', 'التعاون مع رأس المال المحلي وفرق الإنتاج لتطوير محتوى مخصص لمنطقة الشرق الأوسط.'],
  ],
  tr: [
    ['01', 'Tam Kapsamlı Yapım', 'Senaryo yazımından kurguya ve nihai teslimata kadar eksiksiz dizi yapım zinciri.'],
    ['02', 'MENA Dağıtımı', 'Seçkin IP ve içerikleri Orta Doğu\'daki yerel dijital platformlarla buluşturma.'],
    ['03', 'Yerelleştirilmiş Pazarlama', 'Arap ve Türk kültürlerine uygun altyazı, dublaj ve hedef odaklı sosyal medya pazarlaması.'],
    ['04', 'IP Kuluçka & Uyarlama', 'MENA pazarı tercihlerine göre yerel ekiplerle ortak yapım ve özelleştirilmiş içerik.'],
  ],
}

const partnerLogos = [
  { name: 'TikTok MENA', logo: '/icons/tiktok.jpg', link: 'https://www.tiktok.com' },
  { name: 'Shahid VIP', logo: '/icons/shahid.jpg', link: 'https://shahid.mbc.net' },
  { name: 'Starzplay Arabia', logo: '/icons/Starzplay.jpg', link: 'https://starzplay.com' },
  { name: 'Viu OTT', logo: '/icons/viu.jpg', link: 'https://www.viu.com' },
  { name: 'WeTV Arabia', logo: '/icons/wetv.jpg', link: 'https://wetv.vip' },
  { name: 'YouTube MENA', logo: '/icons/youtube.jpg', link: 'https://www.youtube.com' },
  { name: 'Snapchat Discover', logo: '/icons/Snapchat.jpg', link: 'https://www.snapchat.com' },
  { name: 'Facebook Watch', logo: '/icons/Facebook.jpg', link: 'https://www.facebook.com' },
]

export default async function HomePage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const t = translations[locale as keyof typeof translations] || translations.en
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let featuredDramas: any[] = []

  try {
    const res = await payload.find({
      collection: 'dramas',
      locale: locale as any,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { featured: { equals: true } },
        ]
      },
      limit: 6,
      sort: '-releaseDate',
    })
    featuredDramas = res.docs
    
    // Fallback: If no featured, get any published dramas
    if (featuredDramas.length === 0) {
      const fallbackRes = await payload.find({
        collection: 'dramas',
        locale: locale as any,
        where: {
          _status: { equals: 'published' }
        },
        limit: 6,
        sort: '-releaseDate',
      })
      featuredDramas = fallbackRes.docs
    }
  } catch (error) {
    console.error('Error loading featured dramas:', error)
  }

  let dbPartners: any[] = []
  try {
    const res = await payload.find({
      collection: 'partners',
      locale: locale as any,
      where: {
        enabled: { equals: true },
      },
      sort: 'sortOrder',
      limit: 24,
      overrideAccess: true,
    })
    dbPartners = res.docs
  } catch (error) {
    console.error('Error loading partners from CMS:', error)
  }

  return (
    <div className="home-container">
      {/* 1. 全屏品牌主视觉 */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow fade-in">{t.heroSub}</div>
          <h1 className="fade-in">
            {t.heroTitle}
            <span className="gold-gradient-text">{t.heroTitleHighlight}</span>
          </h1>
          <p className="hero-desc fade-in">{t.heroDesc}</p>
          <div className="hero-actions fade-in">
            <Link className="btn btn-primary" href={`/${locale}/dramas`}>
              {t.ctaDramas}
            </Link>
            <Link className="btn btn-secondary" href={`/${locale}/contact`}>
              {t.ctaContact}
            </Link>
          </div>
        </div>
        <div className="orb-decoration" aria-hidden="true">
          <div className="orb-inner">東</div>
        </div>
        <div className="hero-glow" aria-hidden="true" />
      </section>

      {/* 2. 数据亮点 */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number gold-gradient-text">1,000+</div>
            <div className="stat-label">{t.dramasCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gold-gradient-text">15+</div>
            <div className="stat-label">{t.countriesCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gold-gradient-text">10+</div>
            <div className="stat-label">{t.partnersCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gold-gradient-text">100M+</div>
            <div className="stat-label">{t.usersReach}</div>
          </div>
        </div>
      </section>

      {/* 3. 业务服务概览 */}
      <section className="services-section" id="services">
        <div className="section-header">
          <span className="section-eyebrow">{t.servicesTitle}</span>
          <h2 className="section-title">{t.servicesSub}</h2>
        </div>
        <div className="service-grid">
          {services.map(([number, title, desc]) => (
            <article className="service-card glass-panel" key={number}>
              <div className="service-number">{number}</div>
              <h3 className="service-title">{title}</h3>
              <p className="service-desc">{desc}</p>
              <div className="service-glow" />
            </article>
          ))}
        </div>
      </section>

      {/* 4. 精选作品展示 */}
      <section className="featured-section">
        <div className="section-header">
          <span className="section-eyebrow">{t.featuredTitle}</span>
          <h2 className="section-title">{t.featuredSub}</h2>
        </div>

        {featuredDramas.length > 0 ? (
          <div className="drama-grid">
            {featuredDramas.map((drama) => (
              <Link 
                href={`/${locale}/dramas/${drama.id}`} 
                key={drama.id} 
                className="drama-card glass-panel"
              >
                <div className="drama-card-image-wrapper">
                  {drama.poster && typeof drama.poster === 'object' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={drama.poster.url || '/api/placeholder/400/600'} 
                      alt={drama.title} 
                      className="drama-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="drama-card-placeholder">
                      <span>{drama.title.substring(0, 2)}</span>
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
        ) : (
          <div className="empty-state glass-panel">
            <p>{t.emptyDramas}</p>
          </div>
        )}
      </section>

      {/* 5. 合作方 Logo 墙 */}
      <section className="partners-section">
        <div className="section-header">
          <span className="section-eyebrow">{t.partnersTitle}</span>
          <h2 className="section-title">{t.partnersSub}</h2>
        </div>
        <div className="partners-wall">
          {dbPartners.length > 0 ? (
            dbPartners.map((partner) => {
              const hasLogo = partner.logo && typeof partner.logo === 'object' && partner.logo.url
              return partner.link ? (
                <a 
                  key={partner.id} 
                  href={partner.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="partner-logo-tile glass-panel"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {hasLogo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={partner.logo.url} 
                      alt={partner.name} 
                      style={{ maxHeight: '36px', maxWidth: '85%', objectFit: 'contain' }} 
                      loading="lazy"
                    />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </a>
              ) : (
                <div 
                  key={partner.id} 
                  className="partner-logo-tile glass-panel"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {hasLogo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={partner.logo.url} 
                      alt={partner.name} 
                      style={{ maxHeight: '36px', maxWidth: '85%', objectFit: 'contain' }} 
                      loading="lazy"
                    />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </div>
              )
            })
          ) : (
            partnerLogos.map((partner, index) => (
              <a
                key={index}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-logo-tile glass-panel"
                title={partner.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo-img"
                  loading="lazy"
                />
              </a>
            ))
          )}
        </div>
      </section>

      {/* 6. CTA（联系我们） */}
      <section className="cta-banner glass-panel">
        <div className="cta-banner-content">
          <h2>{t.ctaSectionTitle}</h2>
          <p>{t.ctaSectionDesc}</p>
          <Link href={`/${locale}/contact`} className="btn btn-primary btn-large">
            {t.ctaBtn}
          </Link>
        </div>
        <div className="cta-glow" />
      </section>
    </div>
  )
}
