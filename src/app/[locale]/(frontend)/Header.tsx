'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    dramas: 'Drama Library',
    news: 'News',
    contact: 'Contact Us',
  },
  zh: {
    home: '首页',
    about: '关于我们',
    services: '业务服务',
    dramas: '精品作品库',
    news: '新闻动态',
    contact: '联系我们',
  },
  ar: {
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'خدماتنا',
    dramas: 'مكتبة الأعمال',
    news: 'الأخبار',
    contact: 'اتصل بنا',
  },
  tr: {
    home: 'Ana Sayfa',
    about: 'Hakkımızda',
    services: 'Hizmetlerimiz',
    dramas: 'Dizi Kütüphanesi',
    news: 'Haberler',
    contact: 'İletişim',
  },
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '简体中文' },
  { code: 'ar', label: 'العربية' },
  { code: 'tr', label: 'Türkçe' },
]

export default function Header() {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const t = translations[locale as keyof typeof translations] || translations.en
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const getLanguagePath = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <header className="nav">
      <Link className="brand" href={`/${locale}`}>
        <img 
          src="/icons/icon-192.png" 
          alt="Eastern Vision Logo" 
          className="brand-logo-img" 
        />
        <span>
          <strong>
            {locale === 'zh' ? '东方视野影业' :
             locale === 'ar' ? 'إيسترن فيجن' :
             locale === 'tr' ? 'Doğu Vizyonu' :
             'EASTERN VISION'}
          </strong>
          <small>EASTERN VISION MEDIA</small>
        </span>
      </Link>
      
      <nav aria-label="main navigation" className="nav-links">
        <Link href={`/${locale}`}>{t.home}</Link>
        <Link href={`/${locale}/about`}>{t.about}</Link>
        <Link href={`/${locale}/services`}>{t.services}</Link>
        <Link href={`/${locale}/dramas`}>{t.dramas}</Link>
        <Link href={`/${locale}/news`}>{t.news}</Link>
        <Link href={`/${locale}/contact`}>{t.contact}</Link>
      </nav>

      <div className="language-selector">
        <button 
          className="language-btn" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
        >
          🌐 {languages.find(l => l.code === locale)?.label || 'English'}
        </button>
        {dropdownOpen && (
          <div className="language-dropdown">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={getLanguagePath(lang.code)}
                onClick={() => setDropdownOpen(false)}
                className={locale === lang.code ? 'active' : ''}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
