import type { CollectionConfig } from 'payload'

export const Platforms: CollectionConfig = {
  slug: 'platforms',
  labels: {
    singular: {
      zh: '适配平台',
      en: 'Platform',
      ar: 'المنصة',
      tr: 'Platform',
    },
    plural: {
      zh: '适配平台',
      en: 'Platforms',
      ar: 'المنصات',
      tr: 'Platformlar',
    },
  },
  admin: {
    useAsTitle: 'name',
    group: {
      zh: '字典数据',
      en: 'Dictionaries',
      ar: 'بيانات القاموس',
      tr: 'Sözlük Verileri',
    },
  },
  access: {
    read: () => true,
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
        zh: '平台代码',
        en: 'Platform Code',
        ar: 'رمز المنصة',
        tr: 'Platform Kodu',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '平台名称',
        en: 'Platform Name',
        ar: 'اسم المنصة',
        tr: 'Platform Adı',
      },
    },
  ],
}
