import type { CollectionConfig } from 'payload'

export const Languages: CollectionConfig = {
  slug: 'languages',
  labels: {
    singular: {
      zh: '配音/字幕版本',
      en: 'Language Version',
      ar: 'نسخة اللغة',
      tr: 'Dil Sürümü',
    },
    plural: {
      zh: '配音/字幕版本',
      en: 'Language Versions',
      ar: 'نسخ اللغة',
      tr: 'Dil Sürümleri',
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
        zh: '语言代码',
        en: 'Language Code',
        ar: 'رمز اللغة',
        tr: 'Dil Kodu',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '语言名称',
        en: 'Language Name',
        ar: 'اسم اللغة',
        tr: 'Dil Adı',
      },
    },
  ],
}
