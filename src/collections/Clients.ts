import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: {
      zh: '前台客户',
      en: 'B2B Client',
      ar: 'عميل B2B',
      tr: 'B2B Müşteri',
    },
    plural: {
      zh: '前台客户',
      en: 'B2B Clients',
      ar: 'عملاء B2B',
      tr: 'B2B Müşteriler',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: {
      zh: '系统管理',
      en: 'System',
      ar: 'إدارة النظام',
      tr: 'Sistem',
    },
  },
  auth: true,

  access: {
    // 客户账号绝对不能登录 /admin 后台
    admin: () => false,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'admins') return true
      if (user.collection === 'clients') {
        // 允许 clients 读取自身的信息
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
      // 只有后台管理员可以创建客户
      return !!user && user.collection === 'admins'
    },
    update: ({ req: { user } }) => {
      // 只有后台管理员可以更新客户
      return !!user && user.collection === 'admins'
    },
    delete: ({ req: { user } }) => {
      // 只有后台管理员可以删除客户
      return !!user && user.collection === 'admins'
    },
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
      label: {
        zh: '客户公司',
        en: 'Company Name',
        ar: 'اسم الشركة',
        tr: 'Şirket Adı',
      },
    },
    {
      name: 'contactName',
      type: 'text',
      label: {
        zh: '联系人姓名',
        en: 'Contact Name',
        ar: 'اسم جهة الاتصال',
        tr: 'İletişim Kişisi',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      required: true,
      label: {
        zh: '启用状态',
        en: 'Active Status',
        ar: 'حالة النشاط',
        tr: 'Aktif Durum',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        zh: '备注',
        en: 'Notes',
        ar: 'ملاحظات',
        tr: 'Notlar',
      },
    },
  ],
}
