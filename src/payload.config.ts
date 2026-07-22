import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import { tr } from '@payloadcms/translations/languages/tr'
import { zh } from '@payloadcms/translations/languages/zh'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'

import sharp from 'sharp'

import { Admins } from './collections/Admins'
import { Clients } from './collections/Clients'
import { Media } from './collections/Media'
import { VideoAssets } from './collections/VideoAssets'
import { Genres } from './collections/Genres'
import { Languages } from './collections/Languages'
import { Markets } from './collections/Markets'
import { Platforms } from './collections/Platforms'
import { Dramas } from './collections/Dramas'
import { Episodes } from './collections/Episodes'
import { News } from './collections/News'
import { Inquiries } from './collections/Inquiries'
import { Partners } from './collections/Partners'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    fallbackLanguage: 'zh',
    supportedLanguages: { zh, en, ar, tr },
  },
  admin: {
    user: Admins.slug,
    meta: {
      titleSuffix: ' - 东方视野影业',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Admins,
    Clients,
    Media,
    VideoAssets,
    Genres,
    Languages,
    Markets,
    Platforms,
    Dramas,
    Episodes,
    News,
    Inquiries,
    Partners,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
    push: true,
  }),
  sharp,
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'zh', label: '简体中文' },
      { code: 'ar', label: 'العربية', rtl: true },
      { code: 'tr', label: 'Türkçe' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
          prefix: 'media',
          generateFileURL: ({ filename, prefix }) => {
            const bucket = process.env.ALIYUN_OSS_BUCKET
            const rawEndpoint = process.env.ALIYUN_OSS_ENDPOINT || ''
            const cleanEndpoint = rawEndpoint.replace(/^https?:\/\//, '')

            if (!cleanEndpoint) {
              return `/api/media/file/${filename}`
            }

            const domain = bucket && !cleanEndpoint.startsWith(`${bucket}.`)
              ? `${bucket}.${cleanEndpoint}`
              : cleanEndpoint

            const pathPrefix = prefix || 'media'
            return `https://${domain}/${pathPrefix ? `${pathPrefix}/` : ''}${filename}`
          },
        },
      },
      bucket: process.env.ALIYUN_OSS_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET || '',
        },
        region: process.env.ALIYUN_OSS_REGION || 'cn-hangzhou',
        endpoint: process.env.ALIYUN_OSS_ENDPOINT
          ? (process.env.ALIYUN_OSS_ENDPOINT.startsWith('http')
              ? process.env.ALIYUN_OSS_ENDPOINT
              : `https://${process.env.ALIYUN_OSS_ENDPOINT}`)
          : undefined,
        forcePathStyle: false,
      },
      enabled: !!(
        process.env.ALIYUN_OSS_ACCESS_KEY_ID &&
        process.env.ALIYUN_OSS_ACCESS_KEY_ID !== 'your_ram_access_key_id_here'
      ),
    }),
  ],
  endpoints: [
    {
      path: '/video-assets/sign-play-url',
      method: 'get',
      handler: async (req) => {
        const { user, payload } = req
        // 1. 参数校验
        if (!req.url) {
          return Response.json({ error: 'Missing request URL' }, { status: 400 })
        }
        const url = new URL(req.url)
        const episodeId = url.searchParams.get('episodeId')
        if (!episodeId) {
          return Response.json({ error: 'Missing episodeId parameter' }, { status: 400 })
        }

        try {
          // 2. 查找分集
          const episode = await payload.findByID({
            collection: 'episodes',
            id: episodeId,
            overrideAccess: true,
          })

          if (!episode) {
            return Response.json({ error: 'Episode not found' }, { status: 404 })
          }

          // 3. 获取短剧版权声明 (检查是否允许预告片试看)
          const dramaId = typeof episode.drama === 'object' && episode.drama !== null && 'id' in episode.drama
            ? String((episode.drama as { id: unknown }).id)
            : String(episode.drama)

          const drama = (await payload.findByID({
            collection: 'dramas',
            id: dramaId,
            overrideAccess: true,
          })) as unknown as Record<string, unknown>

          const rights = drama && typeof drama === 'object' ? (drama.rights as Record<string, unknown> | undefined) : undefined
          const allowTrailer = Boolean(rights?.allowTrailer)
          const allowFullEpisodes = Boolean(rights?.allowFullEpisodes)
          const isFreePreview = allowFullEpisodes || (episode.episodeNumber === 1 && allowTrailer)

          // 4. 鉴权校验：当符合免登录播放（全集免费或第1集试看）时免登录放行
          if (!isFreePreview) {
            if (!user) {
              return Response.json({ error: 'Unauthorized' }, { status: 401 })
            }
            const isUserActive = user.active === true
            const isClient = user.collection === 'clients'
            const isAdmin = user.collection === 'admins'

            if (!isUserActive || (!isClient && !isAdmin)) {
              return Response.json({ error: 'Access denied: account is disabled or unauthorized' }, { status: 403 })
            }
          }

          // 5. 判断分集启用状态
          const isAdmin = user && user.collection === 'admins'
          if (!episode.enabled && !isAdmin) {
            return Response.json({ error: 'Episode is disabled' }, { status: 403 })
          }

          // 6. 获取关联的视频资产
          let rawAssetId: unknown = episode.videoAsset
          if (typeof rawAssetId === 'object' && rawAssetId !== null && 'id' in rawAssetId) {
            rawAssetId = (rawAssetId as { id: unknown }).id
          }

          const validAssetId = rawAssetId && rawAssetId !== 'null' && rawAssetId !== 'undefined' && !Number.isNaN(Number(rawAssetId))
            ? String(rawAssetId)
            : null

          if (!validAssetId) {
            return Response.json({ error: '该分集尚未在后台关联视频资产文件 (Video asset not linked)' }, { status: 404 })
          }

          const videoAsset = (await payload.findByID({
            collection: 'video-assets',
            id: validAssetId,
            overrideAccess: true,
          })) as unknown as Record<string, unknown>

          if (!videoAsset || typeof videoAsset !== 'object' || !videoAsset.objectKey) {
            return Response.json({ error: '视频资产对象不存在或缺少 OSS Key' }, { status: 404 })
          }

          // 6. 动态从 .env 读取域名并生成防盗链签名播放 URL
          const bucket = process.env.ALIYUN_OSS_BUCKET || ''
          const rawEndpoint = process.env.ALIYUN_OSS_ENDPOINT || 'oss-cn-hangzhou.aliyuncs.com'
          const cleanEndpoint = rawEndpoint.replace(/^https?:\/\//, '')
          const baseHost = bucket && !cleanEndpoint.startsWith(`${bucket}.`)
            ? `${bucket}.${cleanEndpoint}`
            : cleanEndpoint

          const expires = Math.floor(Date.now() / 1000) + 3600 // 1小时有效
          const userId = user?.id || 'guest'
          const mockSignature = Buffer.from(`${videoAsset.objectKey}-${expires}-${userId}`).toString('base64').substring(0, 16)
          const signedUrl = `https://${baseHost}/${videoAsset.objectKey}?provider=${videoAsset.provider}&expires=${expires}&signature=${mockSignature}`

          return Response.json({
            url: signedUrl,
            format: videoAsset.format,
            duration: videoAsset.duration,
            provider: videoAsset.provider,
            transcodeStatus: videoAsset.transcodeStatus,
          })
        } catch (err: unknown) {
          const errObj = err as { name?: string; status?: number; message?: string }
          const isNotFound =
            errObj.name === 'NotFound' ||
            errObj.status === 404 ||
            errObj.message?.includes('not found') ||
            errObj.message?.includes('invalid input syntax') ||
            errObj.message?.includes('cast')
          if (isNotFound) {
            return Response.json({ error: 'Episode not found' }, { status: 404 })
          }
          return Response.json({ error: errObj.message || 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
})

