import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: {
      zh: '新闻动态',
      en: 'News Article',
      ar: 'خبر صحفى',
      tr: 'Haber Yazısı',
    },
    plural: {
      zh: '新闻动态',
      en: 'News & Press',
      ar: 'الأخبار والفعاليات',
      tr: 'Haberler ve Basın',
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
    defaultColumns: ['title', 'category', 'publishDate'],
  },
  access: {
    read: () => true, // Everyone can read news
    create: ({ req: { user } }) => !!user && user.collection === 'admins',
    update: ({ req: { user } }) => !!user && user.collection === 'admins',
    delete: ({ req: { user } }) => !!user && user.collection === 'admins',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '文章标题',
        en: 'Title',
        ar: 'العنوان',
        tr: 'Başlık',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: '公司新闻 / Company', value: 'company' },
        { label: '行业资讯 / Industry', value: 'industry' },
        { label: '活动动态 / Activity', value: 'activity' },
      ],
      label: {
        zh: '文章分类',
        en: 'Category',
        ar: 'الفئة',
        tr: 'Kategori',
      },
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: {
        zh: '发布时间',
        en: 'Publish Date',
        ar: 'تاريخ النشر',
        tr: 'Yayın Tarihi',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: {
        zh: '摘要',
        en: 'Summary',
        ar: 'الملخص',
        tr: 'Özet',
      },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      label: {
        zh: '封面图',
        en: 'Cover Image',
        ar: 'صورة الغلاف',
        tr: 'Kapak Görseli',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: {
        zh: '文章正文',
        en: 'Content Body',
        ar: 'محتوى المقال',
        tr: 'Makale İçeriği',
      },
    },
  ],
}
