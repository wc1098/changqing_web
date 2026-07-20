import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: {
      zh: '媒体资源',
      en: 'Media',
      ar: 'وسائط',
      tr: 'Medya',
    },
    plural: {
      zh: '媒体资源',
      en: 'Media',
      ar: 'الوسائط',
      tr: 'Medya',
    },
  },
  admin: {
    group: {
      zh: '内容管理',
      en: 'Content',
      ar: 'إدارة المحتوى',
      tr: 'İçerik',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: {
        zh: '替代文本',
        en: 'Alternative text',
        ar: 'النص البديل',
        tr: 'Alternatif metin',
      },
      localized: true,
      required: true,
    },
  ],
  upload: true,
}
