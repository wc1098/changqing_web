import type { CollectionConfig } from 'payload'

export const Dramas: CollectionConfig = {
  slug: 'dramas',
  labels: {
    singular: {
      zh: '短剧作品',
      en: 'Drama',
      ar: 'مسلسل قصير',
      tr: 'Kısa Dizi',
    },
    plural: {
      zh: '短剧作品',
      en: 'Dramas',
      ar: 'مسلسلات قصيرة',
      tr: 'Kısa Diziler',
    },
  },
  admin: {
    useAsTitle: 'title',
    group: {
      zh: '内容管理',
      en: 'Content',
      ar: 'إدارة المحتوى',
      tr: 'İçerik',
    },
    defaultColumns: ['title', 'code', 'episodeCount', 'featured', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      // 管理员可以查看全部（包括草稿）
      if (user && user.collection === 'admins') {
        return true
      }
      // 游客及客户只允许查看发布状态的数据
      return {
        _status: {
          equals: 'published',
        },
      }
    },
    create: ({ req: { user } }) => !!user && user.collection === 'admins',
    update: ({ req: { user } }) => !!user && user.collection === 'admins',
    delete: ({ req: { user } }) => !!user && user.collection === 'admins',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: {
        zh: '短剧编码',
        en: 'Drama Code',
        ar: 'كود المسلسل',
        tr: 'Dizi Kodu',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: {
        zh: '英文 Slug',
        en: 'English Slug',
        ar: 'Slug بالإنجليزية',
        tr: 'İngilizce Slug',
      },
      admin: {
        description: '用作前端 URL，多语言共用同一个 Slug',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '短剧名称',
        en: 'Drama Title',
        ar: 'عنوان المسلسل',
        tr: 'Dizi Adı',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: {
        zh: '剧集简介',
        en: 'Summary',
        ar: 'ملخص',
        tr: 'Özet',
      },
    },
    {
      name: 'poster',
      type: 'relationship',
      relationTo: 'media',
      label: {
        zh: '海报封面',
        en: 'Poster Cover',
        ar: 'غلاف الملصق',
        tr: 'Afiş Kapağı',
      },
    },
    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
      label: {
        zh: '题材分类',
        en: 'Genres',
        ar: 'التصنيفات',
        tr: 'Türler',
      },
    },
    {
      name: 'languages',
      type: 'relationship',
      relationTo: 'languages',
      hasMany: true,
      label: {
        zh: '配音/字幕版本',
        en: 'Languages',
        ar: 'اللغات',
        tr: 'Diller',
      },
    },
    {
      name: 'markets',
      type: 'relationship',
      relationTo: 'markets',
      hasMany: true,
      label: {
        zh: '授权市场',
        en: 'Authorized Markets',
        ar: 'الأسواق المرخصة',
        tr: 'Yetkili Pazarlar',
      },
    },
    {
      name: 'platforms',
      type: 'relationship',
      relationTo: 'platforms',
      hasMany: true,
      label: {
        zh: '适配平台',
        en: 'Suitable Platforms',
        ar: 'المنصات المتوافقة',
        tr: 'Uyumlu Platformlar',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      label: {
        zh: '上线时间',
        en: 'Release Date',
        ar: 'تاريخ الإصدار',
        tr: 'Yayın Tarihi',
      },
    },
    {
      name: 'episodeCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: '由分集数据钩子自动维护统计',
      },
      label: {
        zh: '总集数',
        en: 'Total Episodes',
        ar: 'إجمالي الحلقات',
        tr: 'Toplam Bölüm',
      },
    },
    {
      name: 'translationStatus',
      type: 'group',
      label: {
        zh: '多语言翻译状态',
        en: 'Translation Status',
        ar: 'حالة الترجمة',
        tr: 'Çeviri Durumu',
      },
      fields: [
        {
          name: 'zh',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Translated', value: 'translated' },
            { label: 'Reviewed', value: 'reviewed' },
          ],
          label: {
            zh: '中文 (简体)',
            en: 'Chinese',
            ar: 'الصينية',
            tr: 'Çince',
          },
        },
        {
          name: 'ar',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Translated', value: 'translated' },
            { label: 'Reviewed', value: 'reviewed' },
          ],
          label: {
            zh: '阿拉伯语',
            en: 'Arabic',
            ar: 'العربية',
            tr: 'Arapça',
          },
        },
        {
          name: 'tr',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Translated', value: 'translated' },
            { label: 'Reviewed', value: 'reviewed' },
          ],
          label: {
            zh: '土耳其语',
            en: 'Turkish',
            ar: 'التركية',
            tr: 'Türkçe',
          },
        },
      ],
    },
    {
      name: 'rights',
      type: 'group',
      label: {
        zh: '版权与展示权限',
        en: 'Rights & Permissions',
        ar: 'الحقوق والأذونات',
        tr: 'Haklar ve İzinler',
      },
      fields: [
        {
          name: 'rightsOwner',
          type: 'text',
          label: {
            zh: '版权所有者',
            en: 'Rights Owner',
            ar: 'مالك الحقوق',
            tr: 'Hak Sahibi',
          },
        },
        {
          name: 'licenseStart',
          type: 'date',
          label: {
            zh: '授权开始时间',
            en: 'License Start Date',
            ar: 'تاريخ بدء الترخيص',
            tr: 'Lisans Başlangıç Tarihi',
          },
        },
        {
          name: 'licenseEnd',
          type: 'date',
          label: {
            zh: '授权结束时间',
            en: 'License End Date',
            ar: 'تاريخ انتهاء الترخيص',
            tr: 'Lisans Bitiş Tarihi',
          },
        },
        {
          name: 'authorizedMarkets',
          type: 'relationship',
          relationTo: 'markets',
          hasMany: true,
          label: {
            zh: '授权地区',
            en: 'Authorized Areas',
            ar: 'المناطق المرخصة',
            tr: 'Yetkili Bölgeler',
          },
        },
        {
          name: 'allowTrailer',
          type: 'checkbox',
          defaultValue: true,
          label: {
            zh: '允许播放预告片',
            en: 'Allow Trailer',
            ar: 'السماح بالإعلان الترويجي',
            tr: 'Fragmana İzin Ver',
          },
        },
        {
          name: 'allowFullEpisodes',
          type: 'checkbox',
          defaultValue: false,
          label: {
            zh: '允许播放全集',
            en: 'Allow Full Episodes',
            ar: 'السماح بجميع الحلقات',
            tr: 'Tüm Bölümlere İzin Ver',
          },
        },
        {
          name: 'proofDocument',
          type: 'relationship',
          relationTo: 'media',
          label: {
            zh: '版权证明文件',
            en: 'Proof of Rights Document',
            ar: 'وثيقة إثبات الحقوق',
            tr: 'Hak Kanıtı Belgesi',
          },
        },
        {
          name: 'internalNotes',
          type: 'textarea',
          label: {
            zh: '内部备注',
            en: 'Internal Notes',
            ar: 'ملاحظات داخلية',
            tr: 'Dahili Notlar',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: {
        zh: '首页推荐',
        en: 'Featured on Homepage',
        ar: 'مميز على الصفحة الرئيسية',
        tr: 'Ana Sayfada Öne Çıkarılan',
      },
    },
  ],
}
