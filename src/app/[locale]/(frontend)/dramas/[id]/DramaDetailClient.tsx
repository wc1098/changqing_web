'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, Zap, LogOut, Lock, FileText, ShieldCheck, Share2 } from 'lucide-react'
import VideoPlayer from './VideoPlayer'

const translations = {
  en: {
    loginTitle: 'B2B Client Access Required',
    loginDesc: 'This content is restricted to authorized partners. Please enter your client credentials to watch.',
    email: 'Email Address',
    password: 'Password',
    loginBtn: 'Log In & Watch',
    loading: 'Loading...',
    logoutBtn: 'Logout Partner Account',
    detailsTitle: 'Drama Specifications',
    code: 'Drama Code',
    epCount: 'Total Episodes',
    genres: 'Genres',
    langs: 'Languages',
    markets: 'Target Markets',
    platforms: 'Platforms',
    releaseDate: 'Release Date',
    rightsTitle: 'Rights & Licensing',
    rightsOwner: 'Rights Owner',
    licensePeriod: 'License Period',
    allowedTrailers: 'Trailers Allowed',
    allowedFull: 'Full Episodes Allowed',
    yes: 'Yes',
    no: 'No',
    epListTitle: 'Episode Index',
    watchNow: 'Click Episode to Play',
    playStatusReady: 'Signed HLS Play URL generated successfully.',
    duration: 'Duration',
    sec: 'sec',
    provider: 'Storage CDN',
    transcode: 'Transcoding Status',
    unauthorized: 'You must be logged in to view signed video assets.',
    invalidCredentials: 'Login failed. Please check email or password.',
    shareText: 'Share with Partners on WhatsApp',
    shareMsg: 'Hi, check out this premium B2B drama on Eastern Vision Media: "{title}" at {url}',
  },
  zh: {
    loginTitle: '需 B2B 客户登录授权',
    loginDesc: '本剧集视频资产仅限授权合作伙伴预览。请输入由管理员分发的客户账号登录观看。',
    email: '电子邮箱',
    password: '密码',
    loginBtn: '登录并播放',
    loading: '加载中...',
    logoutBtn: '登出客户账号',
    detailsTitle: '短剧规格',
    code: '短剧编码',
    epCount: '总集数',
    genres: '题材类型',
    langs: '语言版本',
    markets: '授权市场',
    platforms: '适配平台',
    releaseDate: '上线日期',
    rightsTitle: '版权及授权信息',
    rightsOwner: '版权所有者',
    licensePeriod: '授权期限',
    allowedTrailers: '允许播放预告片',
    allowedFull: '允许播放整集',
    yes: '是',
    no: '否',
    epListTitle: '剧集分集列表',
    watchNow: '点击对应集数进行在线播放',
    playStatusReady: '防盗链临时播放地址签发成功',
    duration: '时长',
    sec: '秒',
    provider: '存储服务商',
    transcode: '视频转码状态',
    unauthorized: '您尚未登录，视频地址获取被拦截。',
    invalidCredentials: '登录失败，请检查您的邮箱或密码。',
    shareText: '在 WhatsApp 分享给合作伙伴',
    shareMsg: '您好，向您推荐一部来自东方视野影业的中东精品短剧：《{title}》，详情请见：{url}',
  },
  ar: {
    loginTitle: 'مطلوب تسجيل دخول العميل B2B',
    loginDesc: 'هذا المحتوى مقيد للشركاء المعتمدين. يرجى إدخال بيانات اعتماد العميل للمشاهدة.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'تسجيل الدخول والمشاهدة',
    loading: 'جاري التحميل...',
    logoutBtn: 'تسجيل الخروج من حساب الشريك',
    detailsTitle: 'مواصفات المسلسل',
    code: 'كود المسلسل',
    epCount: 'إجمالي الحلقات',
    genres: 'التصنيف',
    langs: 'اللغات',
    markets: 'الأسواق المستهدفة',
    platforms: 'المنصات',
    releaseDate: 'تاريخ الإصدار',
    rightsTitle: 'الحقوق والترخيص',
    rightsOwner: 'مالك الحقوق',
    licensePeriod: 'فترة الترخيص',
    allowedTrailers: 'يسمح بالإعلانات الترويجية',
    allowedFull: 'يسمح بالحلقات الكاملة',
    yes: 'نعم',
    no: 'لا',
    epListTitle: 'فهرس الحلقات',
    watchNow: 'انقر فوق الحلقة للتشغيل',
    playStatusReady: 'تم إنشاء عنوان URL لتشغيل HLS الموقع بنجاح.',
    duration: 'المدة',
    sec: 'ثانية',
    provider: 'خادم CDN',
    transcode: 'حالة تحويل الترميز',
    unauthorized: 'يجب تسجيل الدخول لعرض أصول الفيديو الموقعة.',
    invalidCredentials: 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني أو كلمة المرور.',
    shareText: 'مشاركة مع الشركاء على WhatsApp',
    shareMsg: 'مرحباً، تحقق من هذا المسلسل المميز B2B على Eastern Vision Media: "{title}" الرابط: {url}',
  },
  tr: {
    loginTitle: 'B2B Müşteri Girişi Gerekli',
    loginDesc: 'Bu içerik yetkili ortaklarla sınırlandırılmıştır. İzlemek için lütfen müşteri bilgilerinizi girin.',
    email: 'E-posta Adresi',
    password: 'Şifre',
    loginBtn: 'Giriş Yap ve İzle',
    loading: 'Yükleniyor...',
    logoutBtn: 'Ortak Hesabından Çıkış Yap',
    detailsTitle: 'Dizi Detayları',
    code: 'Dizi Kodu',
    epCount: 'Toplam Bölüm',
    genres: 'Türler',
    langs: 'Diller',
    markets: 'Hedef Pazarlar',
    platforms: 'Platformlar',
    releaseDate: 'Yayın Tarihi',
    rightsTitle: 'Haklar & Lisanslama',
    rightsOwner: 'Hak Sahibi',
    licensePeriod: 'Lisans Dönemi',
    allowedTrailers: 'Fragmana İzin Verilir',
    allowedFull: 'Tam Bölümlere İzin Verilir',
    yes: 'Evet',
    no: 'Hayır',
    epListTitle: 'Bölüm Listesi',
    watchNow: 'Oynatmak için Bölüme Tıklayın',
    playStatusReady: 'İmzalı HLS yayın adresi başarıyla oluşturuldu.',
    duration: 'Süre',
    sec: 'sn',
    provider: 'Depolama CDN',
    transcode: 'Dönüştürme Durumu',
    unauthorized: 'İmzalı video varlıklarını görüntülemek için giriş yapmalısınız.',
    invalidCredentials: 'Giriş başarısız. Lütfen e-posta adresini veya şifreyi kontrol edin.',
    shareText: 'WhatsApp\'ta Ortaklarla Paylaş',
    shareMsg: 'Merhaba, Eastern Vision Media\'daki bu seçkin B2B dizisine göz atın: "{title}" - {url}',
  },
}

interface DramaDetailClientProps {
  locale: string
  drama: {
    id: string
    title: string
    code: string
    summary?: string | null
    poster?: {
      url?: string | null
    } | null
    episodeCount: number
    genres?: Array<{ id: string; name: string }> | null
    languages?: Array<{ id: string; name: string }> | null
    markets?: Array<{ id: string; name: string }> | null
    platforms?: Array<{ id: string; name: string }> | null
    releaseDate?: string | null
    rights?: {
      rightsOwner?: string | null
      licenseStart?: string | null
      licenseEnd?: string | null
      allowTrailer?: boolean | null
      allowFullEpisodes?: boolean | null
    } | null
  }
  episodes: Array<{
    id: string
    episodeNumber: number
    title: string
    duration?: number | null
  }>
}

export default function DramaDetailClient({ locale, drama, episodes }: DramaDetailClientProps) {
  const t = translations[locale as keyof typeof translations] || translations.en

  const [currentUser, setCurrentUser] = useState<{ email: string; company?: string; active?: boolean } | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  
  const [activeEpisodeId, setActiveEpisodeId] = useState('')
  const [signedUrlData, setSignedUrlData] = useState<{ url: string; format: string; duration?: number; provider?: string; transcodeStatus?: string } | null>(null)
  const [fetchUrlLoading, setFetchUrlLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href
      setTimeout(() => {
        setShareUrl(currentUrl)
      }, 0)
    }
  }, [])

  // 1. Check if B2B Client is already logged in
  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/clients/me')
      if (res.ok) {
        const data = await res.json()
        if (data && data.user) {
          setCurrentUser(data.user)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      checkLoginStatus()
      if (episodes.length > 0) {
        setActiveEpisodeId(episodes[0].id)
      }
    }, 0)
  }, [episodes])

  // 2. Trigger fetch playback URL when episode changes or user logs in
  const fetchPlayUrl = useCallback(async (episodeId: string) => {
    if (!episodeId) return
    setFetchUrlLoading(true)
    setErrorMsg('')
    setSignedUrlData(null)
    try {
      const res = await fetch(`/api/video-assets/sign-play-url?episodeId=${episodeId}`)
      const data = await res.json()
      if (res.ok) {
        setSignedUrlData(data)
      } else {
        throw new Error(data.error || (res.status === 401 ? t.unauthorized : '请求视频播放资源失败'))
      }
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Error fetching stream url')
    } finally {
      setFetchUrlLoading(false)
    }
  }, [t.unauthorized])

  const allowTrailer = Boolean(drama.rights?.allowTrailer)
  const allowFullEpisodes = Boolean(drama.rights?.allowFullEpisodes)

  useEffect(() => {
    if (activeEpisodeId) {
      const currentEp = episodes.find(ep => ep.id === activeEpisodeId)
      const isFreePreview = allowFullEpisodes || (currentEp?.episodeNumber === 1 && allowTrailer)
      if (currentUser || isFreePreview) {
        setTimeout(() => {
          fetchPlayUrl(activeEpisodeId)
        }, 0)
      }
    }
  }, [currentUser, activeEpisodeId, allowTrailer, allowFullEpisodes, episodes, fetchPlayUrl])

  // 3. Handle Client Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/clients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || t.invalidCredentials)
      }
      await checkLoginStatus()
      setLoginModalOpen(false)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 4. Handle Logout
  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/clients/logout', { method: 'POST' })
      setCurrentUser(null)
      setSignedUrlData(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const activeEpisode = episodes.find(ep => ep.id === activeEpisodeId)
  const canPlayActiveEpisode = currentUser || allowFullEpisodes || (allowTrailer && activeEpisode?.episodeNumber === 1)

  return (
    <div className="drama-detail-layout">
      {/* Upper Area: Video Player & Episode List */}
      <div className="drama-player-container glass-panel">
        <div className="player-left-main">
          {canPlayActiveEpisode ? (
            <div className="video-player-wrapper">
              {fetchUrlLoading ? (
                <div className="player-message-overlay">
                  <div className="spinner" />
                  <p>{t.loading}</p>
                </div>
              ) : errorMsg ? (
                <div className="player-message-overlay error">
                  <AlertTriangle size={24} color="var(--gold)" />
                  <p>{errorMsg}</p>
                </div>
              ) : signedUrlData ? (
                <div className="player-active-screen">
                  <VideoPlayer 
                    url={signedUrlData.url}
                    format={signedUrlData.format}
                    poster={drama.poster?.url || ''}
                    clientEmail={currentUser?.email || 'Guest Preview'}
                  />
                  <div className="signed-url-meta">
                    <p className="url-banner" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} color="var(--gold-light)" /> {t.playStatusReady}</p>
                    <div className="meta-grid">
                      <div>{t.duration}: <strong>{signedUrlData.duration || activeEpisode?.duration || '120'} {t.sec}</strong></div>
                      <div>{t.provider}: <strong>{signedUrlData.provider || 'Aliyun OSS'}</strong></div>
                      <div>{t.transcode}: <strong>{signedUrlData.transcodeStatus || 'Ready'}</strong></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="player-message-overlay">
                  <p>{t.watchNow}</p>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="player-locked-preview" 
              style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative', 
                cursor: 'pointer',
                backgroundImage: drama.poster?.url ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${drama.poster.url})` : 'linear-gradient(135deg, #11151a, #07090c)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'grid',
                placeItems: 'center'
              }}
              onClick={() => setLoginModalOpen(true)}
            >
              <div style={{ textAlign: 'center' }}>
                <div className="play-button-trigger-glow">▶</div>
                <p style={{ marginTop: '15px', fontSize: '14px', color: 'var(--gold-light)', letterSpacing: '0.05em' }}>
                  {t.watchNow}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Episode Selector */}
        <div className="player-right-sidebar">
          <h3>{t.epListTitle}</h3>
          <div className="episodes-list-scroll">
            {episodes.map((ep) => {
              const isFreePreview = allowFullEpisodes || (ep.episodeNumber === 1 && allowTrailer)
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    if (!currentUser && !isFreePreview) {
                      setLoginModalOpen(true)
                    } else {
                      setActiveEpisodeId(ep.id)
                    }
                  }}
                  className={`ep-select-btn ${activeEpisodeId === ep.id ? 'active' : ''}`}
                >
                  <span className="num">{ep.episodeNumber}</span>
                  <span className="title">{ep.title} {isFreePreview && !currentUser ? '(Preview)' : ''}</span>
                </button>
              )
            })}
          </div>
          {currentUser && (
            <button className="logout-btn-sidebar" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <LogOut size={14} /> {t.logoutBtn} ({currentUser.email})
            </button>
          )}
        </div>
      </div>

      {/* Floating B2B Login Modal Popup */}
      {loginModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setLoginModalOpen(false)}>
          <div className="modal-window glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setLoginModalOpen(false)}>✕</button>
            <div className="lock-box">
              <span className="lock-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Lock size={28} color="var(--gold-light)" /></span>
              <h3>{t.loginTitle}</h3>
              <p>{t.loginDesc}</p>
              
              <form onSubmit={handleLogin} className="lock-login-form">
                <input
                  type="email"
                  placeholder={t.email}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder={t.password}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? t.loading : t.loginBtn}
                </button>
              </form>
              {errorMsg && <p className="lock-error-msg" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14} color="#f87171" /> {errorMsg}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Lower Area: Info Panels */}
      <div className="drama-info-grid">
        <div className="info-main glass-panel">
          <h1>{drama.title}</h1>
          <p className="summary-p">{drama.summary}</p>

          <div className="specs-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={18} color="var(--gold-light)" /> {t.detailsTitle}</h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>{t.code}</td>
                  <td><strong>{drama.code}</strong></td>
                </tr>
                <tr>
                  <td>{t.epCount}</td>
                  <td>{drama.episodeCount}</td>
                </tr>
                <tr>
                  <td>{t.genres}</td>
                  <td>{drama.genres?.map((g) => g.name).join(', ')}</td>
                </tr>
                <tr>
                  <td>{t.langs}</td>
                  <td>{drama.languages?.map((l) => l.name).join(', ')}</td>
                </tr>
                <tr>
                  <td>{t.markets}</td>
                  <td>{drama.markets?.map((m) => m.name).join(', ')}</td>
                </tr>
                <tr>
                  <td>{t.platforms}</td>
                  <td>{drama.platforms?.map((p) => p.name).join(', ')}</td>
                </tr>
                {drama.releaseDate && (
                  <tr>
                    <td>{t.releaseDate}</td>
                    <td>{new Date(drama.releaseDate).toLocaleDateString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="info-rights glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={18} color="var(--gold-light)" /> {t.rightsTitle}</h3>
          <div className="rights-details">
            <div className="rights-row">
              <span>{t.rightsOwner}:</span>
              <strong>{drama.rights?.rightsOwner || 'Eastern Vision Media'}</strong>
            </div>
            {drama.rights?.licenseStart && (
              <div className="rights-row">
                <span>{t.licensePeriod}:</span>
                <strong>
                  {new Date(drama.rights.licenseStart).toLocaleDateString()} ~ {drama.rights.licenseEnd ? new Date(drama.rights.licenseEnd).toLocaleDateString() : 'N/A'}
                </strong>
              </div>
            )}
            <div className="rights-status-box">
              <div className="status-item">
                <span className={`status-indicator ${drama.rights?.allowTrailer ? 'yes' : 'no'}`} />
                <span>{t.allowedTrailers}: <strong>{drama.rights?.allowTrailer ? t.yes : t.no}</strong></span>
              </div>
              <div className="status-item">
                <span className={`status-indicator ${drama.rights?.allowFullEpisodes ? 'yes' : 'no'}`} />
                <span>{t.allowedFull}: <strong>{drama.rights?.allowFullEpisodes ? t.yes : t.no}</strong></span>
              </div>
            </div>
            
            <div className="share-whatsapp-wrapper" style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '15px' }}>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  (t.shareMsg || '')
                    .replace('{title}', drama.title || '')
                    .replace('{url}', shareUrl)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-share-btn"
              >
                <Share2 size={15} />
                {t.shareText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
