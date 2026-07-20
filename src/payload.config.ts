import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import { tr } from '@payloadcms/translations/languages/tr'
import { zh } from '@payloadcms/translations/languages/zh'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
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
      connectionString: process.env.DATABASE_URL || '',
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
  plugins: [],
  endpoints: [
    {
      path: '/video-assets/sign-play-url',
      method: 'get',
      handler: async (req) => {
        const { user, payload } = req
        
        // 1. 鉴权校验：必须为登录的且启用状态为 true 的 admin 或 client
        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const isUserActive = user.active === true
        const isClient = user.collection === 'clients'
        const isAdmin = user.collection === 'admins'

        if (!isUserActive || (!isClient && !isAdmin)) {
          return Response.json({ error: 'Access denied: account is disabled or unauthorized' }, { status: 403 })
        }

        // 2. 参数校验
        if (!req.url) {
          return Response.json({ error: 'Missing request URL' }, { status: 400 })
        }
        const url = new URL(req.url)
        const episodeId = url.searchParams.get('episodeId')
        if (!episodeId) {
          return Response.json({ error: 'Missing episodeId parameter' }, { status: 400 })
        }

        try {
          // 3. 查找分集
          const episode = await payload.findByID({
            collection: 'episodes',
            id: episodeId,
          })

          if (!episode) {
            return Response.json({ error: 'Episode not found' }, { status: 404 })
          }

          // 4. 判断该剧集是否启用 (游客或客户只能播放启用的剧集)
          if (!episode.enabled && !isAdmin) {
            return Response.json({ error: 'Episode is disabled' }, { status: 403 })
          }

          // 5. 获取关联的视频资产
          let videoAsset: any = episode.videoAsset
          if (typeof videoAsset === 'string') {
            videoAsset = await payload.findByID({
              collection: 'video-assets',
              id: videoAsset,
            })
          }

          if (!videoAsset) {
            return Response.json({ error: 'Video asset not found' }, { status: 404 })
          }

          // 6. 生成临时播放签名 URL（第一阶段闭环进行模拟签名，可于之后对接阿里云 OSS SDK）
          // 格式为：https://mock-oss.com/dramas/...?expires=xxx&signature=xxx
          const expires = Math.floor(Date.now() / 1000) + 3600 // 1小时有效
          const mockSignature = Buffer.from(`${videoAsset.objectKey}-${expires}-${user.id}`).toString('base64').substring(0, 16)
          const signedUrl = `https://mock-oss.com/${videoAsset.objectKey}?provider=${videoAsset.provider}&expires=${expires}&signature=${mockSignature}`

          return Response.json({
            url: signedUrl,
            format: videoAsset.format,
            duration: videoAsset.duration,
            provider: videoAsset.provider,
            transcodeStatus: videoAsset.transcodeStatus,
          })
        } catch (err: any) {
          const isNotFound =
            err.name === 'NotFound' ||
            err.status === 404 ||
            err.message?.includes('not found') ||
            err.message?.includes('invalid input syntax') ||
            err.message?.includes('cast')
          if (isNotFound) {
            return Response.json({ error: 'Episode not found' }, { status: 404 })
          }
          return Response.json({ error: err.message || 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
})

