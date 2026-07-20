import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: {
    singular: {
      zh: '管理员',
      en: 'Administrator',
      ar: 'المسؤول',
      tr: 'Yönetici',
    },
    plural: {
      zh: '管理员',
      en: 'Administrators',
      ar: 'المسؤولون',
      tr: 'Yöneticiler',
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
    // 只有管理员自身且 active 的管理员能进入后台
    admin: ({ req: { user } }) => {
      return !!user && user.collection === 'admins' && user.active === true
    },
    read: ({ req: { user } }) => {
      // 只有登录的 admin 可以读
      return !!user && user.collection === 'admins'
    },
    create: ({ req: { user } }) => {
      return !!user && user.collection === 'admins'
    },
    update: ({ req: { user } }) => {
      return !!user && user.collection === 'admins'
    },
    delete: ({ req: { user } }) => {
      return !!user && user.collection === 'admins'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        zh: '姓名',
        en: 'Name',
        ar: 'الاسم',
        tr: 'İsim',
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      label: {
        zh: '角色',
        en: 'Role',
        ar: 'دور',
        tr: 'Rol',
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
  ],
}
