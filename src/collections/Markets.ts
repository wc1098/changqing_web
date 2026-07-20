import type { CollectionConfig } from 'payload'

export const Markets: CollectionConfig = {
  slug: 'markets',
  labels: {
    singular: {
      zh: '目标市场',
      en: 'Target Market',
      ar: 'السوق المستهدفة',
      tr: 'Hedef Pazar',
    },
    plural: {
      zh: '目标市场',
      en: 'Target Markets',
      ar: 'الأسواق المستهدفة',
      tr: 'Hedef Pazarlar',
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
        zh: '市场代码',
        en: 'Market Code',
        ar: 'رمز السوق',
        tr: 'Pazar Kodu',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '市场名称',
        en: 'Market Name',
        ar: 'اسم السوق',
        tr: 'Pazar Adı',
      },
    },
  ],
}
