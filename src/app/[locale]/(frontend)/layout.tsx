import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '@/app/(frontend)/styles.css'

export const metadata = {
  description: 'Eastern Vision Media & IP Management FZCO - Premium Drama Distribution in MENA',
  title: 'Eastern Vision | 东方视野影业',
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props
  const { locale } = await props.params
  const isRtl = locale === 'ar'

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#07090c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EasternVision" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <div className="site-shell">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
