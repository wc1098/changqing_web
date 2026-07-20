import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    singular: {
      zh: '合作留言',
      en: 'Inquiry',
      ar: 'استفسار تجاري',
      tr: 'İşbirliği Mesajı',
    },
    plural: {
      zh: '合作留言',
      en: 'Inquiries',
      ar: 'الاستفسارات التجارية',
      tr: 'İşbirliği Mesajları',
    },
  },
  admin: {
    useAsTitle: 'company',
    group: {
      zh: '商务管理',
      en: 'Business',
      ar: 'إدارة الأعمال',
      tr: 'İş Yönetimi',
    },
    defaultColumns: ['company', 'name', 'email', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user && user.collection === 'admins',
    create: () => true, // Anyone can submit inquiries
    update: ({ req: { user } }) => !!user && user.collection === 'admins',
    delete: ({ req: { user } }) => !!user && user.collection === 'admins',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        zh: '联系人姓名',
        en: 'Contact Name',
        ar: 'الاسم',
        tr: 'İletişim Kurulacak Kişi',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: {
        zh: '邮箱地址',
        en: 'Email Address',
        ar: 'البريد الإلكتروني',
        tr: 'E-posta Adresi',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: {
        zh: '公司名称',
        en: 'Company Name',
        ar: 'الشركة',
        tr: 'Şirket Adı',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: {
        zh: '留言内容',
        en: 'Message / Details',
        ar: 'تفاصيل الرسالة',
        tr: 'Mesaj İçeriği',
      },
    },
  ],
}
