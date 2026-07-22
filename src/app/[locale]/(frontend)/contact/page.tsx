'use client'

import React, { useState } from 'react'
import { MapPin, Building2, Mail, Phone } from 'lucide-react'
import { useParams } from 'next/navigation'

const translations = {
  en: {
    title: 'B2B Partnership',
    sub: 'Let us discuss licensing, local distribution, or custom co-production in the Middle East.',
    name: 'Your Name',
    email: 'Business Email',
    company: 'Company / Organization',
    message: 'Cooperation details / inquiry request...',
    submitBtn: 'Send Message',
    submitting: 'Sending...',
    success: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.',
    error: 'An error occurred. Please check your inputs and try again.',
    mapTitle: 'EASTERN VISION DUBAI HEADQUARTERS',
    mapLat: 'LATITUDE: 25.1232° N',
    mapLng: 'LONGITUDE: 55.3821° E',
    mapLoc: 'Dubai Silicon Oasis, UAE',
    hqTitle: 'HQ Address',
    hqMail: 'Business Email',
    hqPhone: 'Phone Office',
  },
  zh: {
    title: '商务合作洽谈',
    sub: '联系我们，探讨中东及北非地区的版权分发、联合制作或定制内容合作机会。',
    name: '您的姓名',
    email: '企业邮箱',
    company: '公司/机构名称',
    message: '具体合作意向、资源需求或其他留言内容...',
    submitBtn: '提交合作意向',
    submitting: '正在发送...',
    success: '感谢您的留言！我们已成功收到您的合作意向，团队会尽快与您联系。',
    error: '发送失败，请检查您的输入并重试。',
    mapTitle: '东方视野影业 迪拜总部',
    mapLat: '纬度：25.1232° N',
    mapLng: '经度：55.3821° E',
    mapLoc: '阿拉伯联合酋长国 迪拜硅谷绿洲',
    hqTitle: '总部地址',
    hqMail: '商务合作邮箱',
    hqPhone: '办公电话',
  },
  ar: {
    title: 'شراكة تجارية B2B',
    sub: 'دعنا نناقش الترخيص أو التوزيع المحلي أو الإنتاج المشترك المخصص في الشرق الأوسط.',
    name: 'الاسم الكريم',
    email: 'البريد الإلكتروني للعمل',
    company: 'اسم الشركة / المؤسسة',
    message: 'تفاصيل التعاون / طلب الاستفسار...',
    submitBtn: 'إرسال الرسالة',
    submitting: 'جاري الإرسال...',
    success: 'شكرًا لك! تم إرسال رسالتك بنجاح. سيتصل بك فريقنا قريبًا.',
    error: 'حدث خطأ. يرجى التحقق من المدخلات والمحاولة مرة أخرى.',
    mapTitle: 'مقر إيسترن فيجن في دبي',
    mapLat: 'خط العرض: 25.1232° N',
    mapLng: 'خط الطول: 55.3821° E',
    mapLoc: 'واحة دبي للسيليكون، الإمارات',
    hqTitle: 'عنوان المقر الرئيسي',
    hqMail: 'البريد الإلكتروني للعمل',
    hqPhone: 'هاتف المكتب',
  },
  tr: {
    title: 'B2B İş Ortaklığı',
    sub: 'Orta Doğu\'da lisanslama, yerel dağıtım veya özel ortak yapım konularını görüşelim.',
    name: 'Adınız',
    email: 'İş E-postası',
    company: 'Şirket / Kuruluş',
    message: 'İşbirliği detayları / talep talebi...',
    submitBtn: 'Mesaj Gönder',
    submitting: 'Gönderiliyor...',
    success: 'Teşekkürler! Mesajınız başarıyla gönderildi. Ekibimiz yakında sizinle iletişime geçecektir.',
    error: 'Bir hata oluştu. Lütfen girdilerinizi kontrol edip tekrar deneyin.',
    mapTitle: 'DOĞU VİZYONU DUBAI MERKEZİ',
    mapLat: 'ENLEM: 25.1232° N',
    mapLng: 'BOYLAM: 55.3821° E',
    mapLoc: 'Dubai Silicon Oasis, BAE',
    hqTitle: 'Merkez Adres',
    hqMail: 'İş E-postası',
    hqPhone: 'Ofis Telefonu',
  },
}

export default function ContactPage() {
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const t = translations[locale as keyof typeof translations] || translations.en

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setSuccess(false)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setName('')
        setEmail('')
        setCompany('')
        setMessage('')
      } else {
        setError(true)
      }
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container container-spacing">
      <div className="section-header centered">
        <span className="section-eyebrow">CONNECT WITH US</span>
        <h1 className="section-title large gold-gradient-text">{t.title}</h1>
        <p className="section-subtitle max-w-700">{t.sub}</p>
      </div>

      <div className="contact-layout">
        {/* Left Side: Form */}
        <div className="contact-form-box glass-panel">
          {success ? (
            <div className="success-overlay-box">
              <span className="success-icon">✨</span>
              <p>{t.success}</p>
              <button className="btn btn-secondary" onClick={() => setSuccess(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="b2b-contact-form">
              <div className="input-group">
                <label>{t.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="input-group">
                <label>{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="e.g. john@company.com"
                />
              </div>

              <div className="input-group">
                <label>{t.company}</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="form-input"
                  placeholder="e.g. Media FZCO"
                />
              </div>

              <div className="input-group">
                <label>{t.message}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="form-textarea"
                  rows={6}
                />
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn" disabled={loading}>
                {loading ? t.submitting : t.submitBtn}
              </button>

              {error && <p className="form-error-msg">⚠️ {t.error}</p>}
            </form>
          )}
        </div>

        {/* Right Side: Map & Address Cards */}
        <div className="contact-sidebar-box">
          {/* Real Interactive Dark Map of Headquarters */}
          <div className="digital-map-widget glass-panel">
            <iframe
              title="Dubai Headquarters Location Map"
              className="dark-map-iframe"
              src="https://www.openstreetmap.org/export/embed.html?bbox=55.3650%2C25.1100%2C55.4000%2C25.1360&amp;layer=mapnik&amp;marker=25.1232%2C55.3821"
              loading="lazy"
            />
            <div className="map-badge-overlay">
              <div className="map-badge-header">
                <span className="location-pin"><MapPin size={18} /></span>
                <div>
                  <h4>{t.mapTitle}</h4>
                  <p className="location-name">{t.mapLoc}</p>
                </div>
              </div>
              <div className="map-badge-coords">
                <span>{t.mapLat}</span>
                <span>•</span>
                <span>{t.mapLng}</span>
              </div>
            </div>
          </div>

          {/* Quick Details Cards */}
          <div className="office-info-cards">
            <div className="office-card glass-panel">
              <span className="card-icon"><Building2 size={20} /></span>
              <div>
                <h4>{t.hqTitle}</h4>
                <p>Dubai Silicon Oasis, DDP, Building A2, Dubai, United Arab Emirates</p>
              </div>
            </div>

            <div className="office-card glass-panel">
              <span className="card-icon"><Mail size={20} /></span>
              <div>
                <h4>{t.hqMail}</h4>
                <p>business@stellarblue.cn</p>
              </div>
            </div>

            <div className="office-card glass-panel">
              <span className="card-icon"><Phone size={20} /></span>
              <div>
                <h4>{t.hqPhone}</h4>
                <p>+971 50 881 7151 / +86 137 8358 1093</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
