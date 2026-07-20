import React from 'react'

const translations = {
  en: {
    title: 'OUR SERVICES',
    sub: 'Industrialized Full-Chain Content Services',
    desc: 'Eastern Vision operates a highly optimized B2B pipeline, coordinating production, licensing, localization, and marketing. We offer end-to-end services tailored for global content creators and Middle Eastern platforms.',
    step1Num: '01',
    step1Title: 'Full-Scale Drama Production',
    step1Desc: 'We handle everything from initial script translation, local casting, production setup in Dubai, filming, to editing and post-production, delivering cinema-quality short dramas.',
    step2Num: '02',
    step2Title: 'MENA Market Distribution',
    step2Desc: 'Connecting Chinese producers with Middle Eastern streaming giants (Shahid, Starzplay), local channels, and social media networks. We handle rights clearance, content review, and release planning.',
    step3Num: '03',
    step3Title: 'Localized Dubbing & Adaptation',
    step3Desc: 'Providing high-fidelity translation, professional Arabic (classical & Gulf dialects) voice dubbing, Turkish dubbing, and high-quality subtitle synchronization to match local viewing habits.',
    step4Num: '04',
    step4Title: 'IP Incubation & Customization',
    step4Desc: 'Co-producing tailored content by blending global premium IP concepts with Middle Eastern storytelling values to guarantee massive local audience engagement.',
    processTitle: 'Our Cooperation Workflow',
    processSub: 'A seamless, professional journey from contract to delivery.',
    pStep1: '1. Assessment',
    pStep1Desc: 'Evaluate content suitability, market potential, and rights feasibility in the MENA market.',
    pStep2: '2. Localization',
    pStep2Desc: 'Translation, adaptation, subtitle rendering, and professional voice dubbing.',
    pStep3: '3. Compliance',
    pStep3Desc: 'Reviewing contents against Middle East cultural standards and licensing policies.',
    pStep4: '4. Distribution',
    pStep4Desc: 'Deploying content to major platforms and executing marketing campaigns.',
  },
  zh: {
    title: '业务服务',
    sub: '短剧出海全链路工业化服务',
    desc: '东方视野影业提供全方位的 B2B 内容出海解决方案，涵盖制作、版权分发、深度本地化及宣发运营，协助内容出海伙伴在中东及全球市场建立长期商业优势。',
    step1Num: '01',
    step1Title: '短剧全链条制作',
    step1Desc: '涵盖阿语剧本改写、迪拜本地剧组搭建、外籍演员海选、专业化拍摄及高质量后期剪辑，提供影视级短剧成片。',
    step2Num: '02',
    step2Title: '中东市场分发',
    step2Desc: '无缝对接中东头部流媒体平台（Shahid, Starzplay）和主流社媒，提供版权引入、代理发行、合规审核及分发排期服务。',
    step3Num: '03',
    step3Title: '配音与本地化翻译',
    step3Desc: '顶尖配音演员进行阿拉伯语（标准阿语及海湾方言）、土耳其语的高保真配音，并制作专业字幕，契合本地文化氛围。',
    step4Num: '04',
    step4Title: 'IP 孵化与定制',
    step4Desc: '结合中东及北非观众的独特审美，将国内爆款题材进行本土化定制及IP联合开发，保障内容高转化率。',
    processTitle: '商务合作流程',
    processSub: '高效专业的合作闭环，为您的内容保驾护航。',
    pStep1: '1. 内容评估',
    pStep1Desc: '评估短剧在中东市场的受众吸引力、版权完整度及合规性。',
    pStep2: '2. 本地化译配',
    pStep2Desc: '专业阿语/土语翻译，搭配当地配音团队进行精细化译制和合成。',
    pStep3: '3. 平台合规审查',
    pStep3Desc: '确保内容符合中东和北非地区的宗教、文化及法律规范。',
    pStep4: '4. 全渠道上线宣发',
    pStep4Desc: '多平台矩阵同步分发，并结合本地社媒资源进行宣发造势。',
  },
  ar: {
    title: 'خدماتنا',
    sub: 'خدمات محتوى صناعية متكاملة السلسلة',
    desc: 'تقدم إيسترن فيجن حلاً كاملاً للشركات في مجال إنتاج وترخيص وتكييف وتسويق المحتوى الرقمي في منطقة الشرق الأوسط وشمال أفريقيا.',
    step1Num: '٠١',
    step1Title: 'إنتاج درامي متكامل',
    step1Desc: 'نتولى كل شيء من ترجمة السيناريو الأولية، واختيار الممثلين المحليين، والإنتاج في دبي، والتصوير، حتى المونتاج وما بعد الإنتاج.',
    step2Num: '٠٢',
    step2Title: 'التوزيع في سوق الشرق الأوسط',
    step2Desc: 'ربط المنتجين العالميين مع عمالقة البث في الشرق الأوسط (شاهد، ستارزبلاي)، القنوات المحلية، وشبكات التواصل الاجتماعي.',
    step3Num: '٠٣',
    step3Title: 'الدبلجة والتكيف المحلي',
    step3Desc: 'تقديم ترجمة عالية الدقة، ودبلجة صوتية احترافية باللغة العربية (الفصحى واللهجات الخليجية)، والدبلجة التركية، ومزامنة الترجمة.',
    step4Num: '٠٤',
    step4Title: 'حضانة وتخصيص الملكية الفكرية',
    step4Desc: 'إنتاج محتوى مخصص يمزج بين مفاهيم الملكية الفكرية العالمية المتميزة وقيم القصص في الشرق الأوسط لضمان تفاعل كبير.',
    processTitle: 'سير عمل التعاون',
    processSub: 'رحلة سلسة واحترافية من العقد إلى التسليم.',
    pStep1: '١. التقييم',
    pStep1Desc: 'تقييم ملاءمة المحتوى، وإمكانيات السوق، وجدوى الحقوق في منطقة الشرق الأوسط وشمال أفريقيا.',
    pStep2: '٢. التكيف المحلي',
    pStep2Desc: 'الترجمة والتكيف وتقديم العناوين والدبلجة الصوتية الاحترافية.',
    pStep3: '٣. الامتثال',
    pStep3Desc: 'مراجعة المحتوى وفقاً للمعايير الثقافية وسياسات الترخيص في الشرق الأوسط.',
    pStep4: '٤. التوزيع',
    pStep4Desc: 'نشر المحتوى على المنصات الرئيسية وتنفيذ الحملات التسويقية.',
  },
  tr: {
    title: 'HİZMETLERİMİZ',
    sub: 'Endüstriyel Tam Zincir İçerik Hizmetleri',
    desc: 'Eastern Vision, yapım, lisanslama, yerelleştirme ve pazarlama süreçlerini koordine eden son derece optimize edilmiş bir B2B süreç yönetimi sunar.',
    step1Num: '01',
    step1Title: 'Tam Kapsamlı Yapım',
    step1Desc: 'Senaryo çevirisi, yerel oyuncu seçimi, Dubai\'de yapım kurulumu, çekimler ve kurgu dahil olmak üzere sinema kalitesinde kısa diziler sunuyoruz.',
    step2Num: '02',
    step2Title: 'MENA Pazarı Dağıtımı',
    step2Desc: 'Yapımcıları Orta Doğu\'nun yayın devleri (Shahid, Starzplay), yerel kanallar ve sosyal medya ağlarıyla buluşturuyoruz.',
    step3Num: '03',
    step3Title: 'Yerel Seslendirme & Uyarlama',
    step3Desc: 'Orta Doğu ve Türk izleyicilerinin izleme alışkanlıklarına uygun profesyonel Arapça (Klasik ve Körfez lehçeleri) ve Türkçe seslendirme.',
    step4Num: '04',
    step4Title: 'IP Kuluçka & Özelleştirme',
    step4Desc: 'Küresel seçkin IP konseptlerini Orta Doğu anlatı değerleriyle harmanlayarak yerel izleyicilere hitap eden özel içerikler üretiyoruz.',
    processTitle: 'İşbirliği İş Akışımız',
    processSub: 'Sözleşmeden teslimata sorunsuz ve profesyonel bir süreç.',
    pStep1: '1. Değerlendirme',
    pStep1Desc: 'MENA pazarındaki içerik uygunluğunun, pazar potansiyelinin ve hakların fizibilitesinin değerlendirilmesi.',
    pStep2: '2. Yerelleştirme',
    pStep2Desc: 'Çeviri, uyarlama, altyazı oluşturma ve profesyonel seslendirme süreçleri.',
    pStep3: '3. Uyumluluk',
    pStep3Desc: 'İçeriklerin Orta Doğu kültürel standartlarına ve lisans politikalarına uygunluğunun denetimi.',
    pStep4: '4. Dağıtım',
    pStep4Desc: 'İçeriğin büyük platformlarda yayına alınması ve pazarlama kampanyalarının yürütülmesi.',
  },
}

export default async function ServicesPage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const t = translations[locale as keyof typeof translations] || translations.en

  const services = [
    { num: t.step1Num, title: t.step1Title, desc: t.step1Desc },
    { num: t.step2Num, title: t.step2Title, desc: t.step2Desc },
    { num: t.step3Num, title: t.step3Title, desc: t.step3Desc },
    { num: t.step4Num, title: t.step4Title, desc: t.step4Desc },
  ]

  const workflow = [
    { title: t.pStep1, desc: t.pStep1Desc },
    { title: t.pStep2, desc: t.pStep2Desc },
    { title: t.pStep3, desc: t.pStep3Desc },
    { title: t.pStep4, desc: t.pStep4Desc },
  ]

  return (
    <div className="page-container container-spacing">
      <div className="section-header centered">
        <span className="section-eyebrow">WHAT WE DO</span>
        <h1 className="section-title large gold-gradient-text">{t.title}</h1>
        <p className="section-subtitle max-w-700">{t.desc}</p>
      </div>

      <div className="services-detailed-grid">
        {services.map((svc) => (
          <div key={svc.num} className="service-detail-card glass-panel">
            <div className="service-detail-header">
              <span className="num gold-gradient-text">{svc.num}</span>
              <h2>{svc.title}</h2>
            </div>
            <p>{svc.desc}</p>
            <div className="card-bg-gradient" />
          </div>
        ))}
      </div>

      <section className="workflow-section glass-panel">
        <div className="workflow-header">
          <h2>{t.processTitle}</h2>
          <p>{t.processSub}</p>
        </div>
        <div className="workflow-steps">
          {workflow.map((step, idx) => (
            <div key={idx} className="workflow-step-card">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {idx < workflow.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
