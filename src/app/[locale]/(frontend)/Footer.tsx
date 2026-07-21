'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const translations = {
  en: {
    address: 'Dubai Silicon Oasis, DDP, Building A2, Dubai, UAE',
    email: 'Email: contact@easternvision.ae',
    phone: 'Phone: +971 4 123 4567',
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    dramas: 'Drama Library',
    news: 'News',
    contact: 'Contact Us',
  },
  zh: {
    address: '阿联酋迪拜硅谷绿洲 DDP A2栋',
    email: '邮箱：contact@easternvision.ae',
    phone: '电话：+971 4 123 4567',
    rights: '版权所有。',
    privacy: '隐私政策',
    terms: '服务条款',
    home: '首页',
    about: '关于我们',
    services: '业务服务',
    dramas: '精品作品库',
    news: '新闻动态',
    contact: '联系我们',
  },
  ar: {
    address: 'واحة دبي للسيليكون، مبنى A2، دبي، الإمارات العربية المتحدة',
    email: 'البريد الإلكتروني: contact@easternvision.ae',
    phone: 'الهاتف: +971 4 123 4567',
    rights: 'جميع الحقوق محفوظة.',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'خدماتنا',
    dramas: 'مكتبة الأعمال',
    news: 'الأخبار',
    contact: 'اتصل بنا',
  },
  tr: {
    address: 'Dubai Silicon Oasis, DDP, A2 Binası, Dubai, BAE',
    email: 'E-posta: contact@easternvision.ae',
    phone: 'Telefon: +971 4 123 4567',
    rights: 'Tüm hakları saklıdır.',
    privacy: 'Gizlilik Politikası',
    terms: 'Kullanım Koşulları',
    home: 'Ana Sayfa',
    about: 'Hakkımızda',
    services: 'Hizmetlerimiz',
    dramas: 'Dizi Kütüphanesi',
    news: 'Haberler',
    contact: 'İletişim',
  },
}

export default function Footer() {
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-info">
          <h3>
            {locale === 'zh' ? '东方视野影业' :
             locale === 'ar' ? 'إيسترن فيجن' :
             locale === 'tr' ? 'Doğu Vizyonu' :
             'EASTERN VISION'}
          </h3>
          <p>{t.address}</p>
          <p>{t.email}</p>
          <p>{t.phone}</p>
        </div>
        <div className="footer-links">
          <Link href={`/${locale}`}>{t.home}</Link>
          <Link href={`/${locale}/about`}>{t.about}</Link>
          <Link href={`/${locale}/services`}>{t.services}</Link>
          <Link href={`/${locale}/dramas`}>{t.dramas}</Link>
          <Link href={`/${locale}/news`}>{t.news}</Link>
          <Link href={`/${locale}/contact`}>{t.contact}</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Eastern Vision Media & IP Management FZCO. {t.rights}</span>
        <div className="policy-links">
          <a href="#">{t.privacy}</a>
          <a href="#">{t.terms}</a>
        </div>
      </div>
    </footer>
  )
}
