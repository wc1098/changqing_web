import type { CollectionConfig } from 'payload'

export const VideoAssets: CollectionConfig = {
  slug: 'video-assets',
  labels: {
    singular: {
      zh: '视频资产',
      en: 'Video Asset',
      ar: 'أصول الفيديو',
      tr: 'Video Varlığı',
    },
    plural: {
      zh: '视频资产',
      en: 'Video Assets',
      ar: 'أصول الفيديو',
      tr: 'Video Varlıkları',
    },
  },
  admin: {
    useAsTitle: 'objectKey',
    group: {
      zh: '内容管理',
      en: 'Content',
      ar: 'إدارة المحتوى',
      tr: 'İçerik',
    },
  },
  access: {
    // 限制只有管理员能进行增删改查
    read: ({ req: { user } }) => !!user && user.collection === 'admins',
    create: ({ req: { user } }) => !!user && user.collection === 'admins',
    update: ({ req: { user } }) => !!user && user.collection === 'admins',
    delete: ({ req: { user } }) => !!user && user.collection === 'admins',
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'aliyun-oss',
      required: true,
      options: [
        { label: 'Aliyun OSS', value: 'aliyun-oss' },
      ],
      label: {
        zh: '服务商',
        en: 'Provider',
        ar: 'مزود الخدمة',
        tr: 'Sağlayıcı',
      },
    },
    {
      name: 'objectKey',
      type: 'text',
      required: true,
      label: {
        zh: 'OSS 对象路径',
        en: 'OSS Object Key',
        ar: 'مفتاح كائن OSS',
        tr: 'OSS Nesne Anahtarı',
      },
    },
    {
      name: 'format',
      type: 'select',
      defaultValue: 'hls',
      required: true,
      options: [
        { label: 'HLS', value: 'hls' },
        { label: 'MP4', value: 'mp4' },
      ],
      label: {
        zh: '视频格式',
        en: 'Video Format',
        ar: 'تنسيق الفيديو',
        tr: 'Video Formatı',
      },
    },
    {
      name: 'transcodeStatus',
      type: 'select',
      defaultValue: 'ready',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Ready', value: 'ready' },
        { label: 'Failed', value: 'failed' },
      ],
      label: {
        zh: '转码状态',
        en: 'Transcode Status',
        ar: 'حالة تحويل الترميز',
        tr: 'Kod Dönüştürme Durumu',
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: {
        zh: '视频时长 (秒)',
        en: 'Duration (Seconds)',
        ar: 'المدة (بالثواني)',
        tr: 'Süre (Saniye)',
      },
    },
    {
      name: 'size',
      type: 'number',
      label: {
        zh: '文件大小 (Bytes)',
        en: 'File Size (Bytes)',
        ar: 'حجم الملف (بايت)',
        tr: 'Dosya Boyutu (Bayt)',
      },
    },
  ],
}
