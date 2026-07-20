import type { CollectionConfig } from 'payload'

export const Genres: CollectionConfig = {
  slug: 'genres',
  labels: {
    singular: {
      zh: '题材分类',
      en: 'Genre',
      ar: 'التصنيف',
      tr: 'Tür',
    },
    plural: {
      zh: '题材分类',
      en: 'Genres',
      ar: 'التصنيفات',
      tr: 'Türler',
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
        zh: '题材代码',
        en: 'Genre Code',
        ar: 'رمز التصنيف',
        tr: 'Tür Kodu',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '题材名称',
        en: 'Genre Name',
        ar: 'اسم التصنيف',
        tr: 'Tür Adı',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      required: true,
      label: {
        zh: '启用状态',
        en: 'Enabled',
        ar: 'مفعل',
        tr: 'Etkin',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: {
        zh: '排序值',
        en: 'Sort Order',
        ar: 'ترتيب الفرز',
        tr: 'Sıralama',
      },
    },
  ],
}
