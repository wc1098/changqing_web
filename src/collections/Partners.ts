import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: {
      zh: '合作方',
      en: 'Partner',
      ar: 'شريك',
      tr: 'Ortak',
    },
    plural: {
      zh: '合作方',
      en: 'Partners',
      ar: 'الشركاء',
      tr: 'Ortaklar',
    },
  },
  admin: {
    useAsTitle: 'name',
    group: {
      zh: '系统管理',
      en: 'System',
      ar: 'إدارة النظام',
      tr: 'Sistem',
    },
    defaultColumns: ['name', 'sortOrder', 'enabled'],
  },
  access: {
    read: () => true, // Everyone can read partners list
    create: ({ req: { user } }) => !!user && user.collection === 'admins',
    update: ({ req: { user } }) => !!user && user.collection === 'admins',
    delete: ({ req: { user } }) => !!user && user.collection === 'admins',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '合作方名称',
        en: 'Partner Name',
        ar: 'اسم الشريك',
        tr: 'Ortak Adı',
      },
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: {
        zh: '合作方 Logo',
        en: 'Partner Logo',
        ar: 'شعار الشريك',
        tr: 'Ortak Logosu',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: {
        zh: '官方网址',
        en: 'Website Link',
        ar: 'موقع الويب',
        tr: 'Web Sitesi',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: {
        zh: '展示排序',
        en: 'Sort Order',
        ar: 'ترتيب العرض',
        tr: 'Görüntüleme Sırası',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      label: {
        zh: '启用状态',
        en: 'Enabled Status',
        ar: 'حالة التفعيل',
        tr: 'Etkinlik Durumu',
      },
    },
  ],
}
