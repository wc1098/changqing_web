import type { CollectionConfig, Payload, PayloadRequest, Where } from 'payload'

const getDramaId = (drama: unknown): string | null => {
  if (!drama) return null
  return typeof drama === 'object' && drama !== null && 'id' in drama
    ? String((drama as { id: unknown }).id)
    : String(drama)
}

const updateEpisodeCount = async (dramaId: string, payload: Payload, req: PayloadRequest) => {
  const result = await payload.find({
    collection: 'episodes',
    req,
    where: {
      and: [
        { drama: { equals: dramaId } },
        { enabled: { equals: true } },
      ],
    },
    limit: 0,
  })

  await payload.update({
    collection: 'dramas',
    id: dramaId,
    req,
    data: {
      episodeCount: result.totalDocs,
    },
  })
}

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  labels: {
    singular: {
      zh: '分集信息',
      en: 'Episode',
      ar: 'الحلقة',
      tr: 'Bölüm',
    },
    plural: {
      zh: '分集信息',
      en: 'Episodes',
      ar: 'الحلقات',
      tr: 'Bölümler',
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
    defaultColumns: ['title', 'episodeNumber', 'drama', 'enabled'],
  },
  access: {
    read: ({ req: { user } }) => {
      // 管理员可读所有
      if (user && user.collection === 'admins') {
        return true
      }
      return {
        and: [
          {
            enabled: {
              equals: true,
            },
          },
          {
            'drama._status': {
              equals: 'published',
            },
          },
        ],
      } as Where
    },
    create: ({ req: { user } }) => !!user && user.collection === 'admins',
    update: ({ req: { user } }) => !!user && user.collection === 'admins',
    delete: ({ req: { user } }) => !!user && user.collection === 'admins',
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const currentDramaId = getDramaId(doc.drama)
        const previousDramaId = previousDoc ? getDramaId(previousDoc.drama) : null

        if (currentDramaId) {
          await updateEpisodeCount(currentDramaId, req.payload, req)
        }
        if (previousDramaId && previousDramaId !== currentDramaId) {
          await updateEpisodeCount(previousDramaId, req.payload, req)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const dramaId = getDramaId(doc.drama)
        if (dramaId) {
          await updateEpisodeCount(dramaId, req.payload, req)
        }
      },
    ],
  },
  fields: [
    {
      name: 'drama',
      type: 'relationship',
      relationTo: 'dramas',
      required: true,
      label: {
        zh: '关联短剧',
        en: 'Related Drama',
        ar: 'المسلسل ذو الصلة',
        tr: 'İlişkili Dizi',
      },
    },
    {
      name: 'episodeNumber',
      type: 'number',
      required: true,
      label: {
        zh: '集号',
        en: 'Episode Number',
        ar: 'رقم الحلقة',
        tr: 'Bölüm Numarası',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate: async (val: any, options: any) => {
        const { siblingData, id, req } = options as { siblingData: Record<string, unknown>; id?: string | number; req: PayloadRequest }
        if (typeof val !== 'number') return 'Episode number must be a number'
        
        const dramaId = getDramaId(siblingData?.drama)
        if (!dramaId) return true // 会被 required: true 拦截

        const existing = await req.payload.find({
          collection: 'episodes',
          req,
          where: {
            and: [
              { drama: { equals: dramaId } },
              { episodeNumber: { equals: val } },
              id ? { id: { not_equals: id } } : {},
            ],
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          return `Episode number ${val} already exists for this drama`
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: {
        zh: '分集标题',
        en: 'Episode Title',
        ar: 'عنوان الحلقة',
        tr: 'Bölüm Başlığı',
      },
    },
    {
      name: 'videoAsset',
      type: 'relationship',
      relationTo: 'video-assets',
      label: {
        zh: '关联视频资产',
        en: 'Video Asset',
        ar: 'أصول الفيديو المرتبطة',
        tr: 'İlişkili Video Varlığı',
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: {
        zh: '时长 (秒)',
        en: 'Duration (Seconds)',
        ar: 'المدة (بالثواني)',
        tr: 'Süre (Saniye)',
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
  ],
}
