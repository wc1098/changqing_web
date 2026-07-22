import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { headers, cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const authHeaders = await headers()
    let { user } = await payload.auth({ headers: authHeaders })

    if (!user) {
      const cookieStore = await cookies()
      const clientToken = cookieStore.get('client-payload-token')?.value
      if (clientToken) {
        const authRes = await payload.auth({
          headers: new Headers({
            Authorization: `JWT ${clientToken}`,
          }),
        })
        user = authRes.user
      }
    }

    const url = new URL(req.url)
    const episodeId = url.searchParams.get('episodeId')
    if (!episodeId) {
      return NextResponse.json({ error: 'Missing episodeId parameter' }, { status: 400 })
    }

    const episode = await payload.findByID({
      collection: 'episodes',
      id: episodeId,
      overrideAccess: true,
    })

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    // 3. 获取短剧版权声明 (检查是否允许预告片试看/全集免费)
    const dramaId = typeof episode.drama === 'object' && episode.drama !== null && 'id' in episode.drama
      ? String((episode.drama as { id: unknown }).id)
      : String(episode.drama || '')

    let drama: Record<string, unknown> | null = null
    if (dramaId) {
      drama = (await payload.findByID({
        collection: 'dramas',
        id: dramaId,
        overrideAccess: true,
      })) as unknown as Record<string, unknown>
    }

    const rights = drama && typeof drama === 'object' ? (drama.rights as Record<string, unknown> | undefined) : undefined
    const allowTrailer = Boolean(rights?.allowTrailer)
    const allowFullEpisodes = Boolean(rights?.allowFullEpisodes)
    const isFreePreview = allowFullEpisodes || (episode.episodeNumber === 1 && allowTrailer)

    // 4. 鉴权校验：符合免登录播放时免登录放行
    if (!isFreePreview) {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const isUserActive = user.active === true
      const isClient = user.collection === 'clients'
      const isAdmin = user.collection === 'admins'
      if (!isUserActive || (!isClient && !isAdmin)) {
        return NextResponse.json({ error: 'Access denied: account is disabled or unauthorized' }, { status: 403 })
      }
    }

    // 5. 分集启用状态判断
    if (!episode.enabled) {
      const isAdmin = user && user.collection === 'admins'
      if (!isAdmin) {
        return NextResponse.json({ error: 'Episode is disabled' }, { status: 403 })
      }
    }

    // 6. 获取关联视频资产
    let rawAssetId: unknown = episode.videoAsset
    if (typeof rawAssetId === 'object' && rawAssetId !== null && 'id' in rawAssetId) {
      rawAssetId = (rawAssetId as { id: unknown }).id
    }

    const validAssetId = rawAssetId && rawAssetId !== 'null' && rawAssetId !== 'undefined' && !Number.isNaN(Number(rawAssetId))
      ? String(rawAssetId)
      : null

    if (!validAssetId) {
      return NextResponse.json({ error: '该分集尚未在后台关联视频资产文件 (Video asset not linked)' }, { status: 404 })
    }

    const videoAsset = (await payload.findByID({
      collection: 'video-assets',
      id: validAssetId,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>

    if (!videoAsset || typeof videoAsset !== 'object' || !videoAsset.objectKey) {
      return NextResponse.json({ error: '视频资产对象不存在或缺少 OSS Key' }, { status: 404 })
    }

    // 7. 生成签名 URL
    const bucket = process.env.ALIYUN_OSS_BUCKET || ''
    const rawEndpoint = process.env.ALIYUN_OSS_ENDPOINT || 'oss-cn-hangzhou.aliyuncs.com'
    const cleanEndpoint = rawEndpoint.replace(/^https?:\/\//, '')
    const baseHost = bucket && !cleanEndpoint.startsWith(`${bucket}.`)
      ? `${bucket}.${cleanEndpoint}`
      : cleanEndpoint

    const expires = Math.floor(Date.now() / 1000) + 3600
    const userId = user?.id || 'guest'
    const mockSignature = Buffer.from(`${videoAsset.objectKey}-${expires}-${userId}`).toString('base64').substring(0, 16)
    const signedUrl = `https://${baseHost}/${videoAsset.objectKey}?provider=${videoAsset.provider}&expires=${expires}&signature=${mockSignature}`

    return NextResponse.json({
      url: signedUrl,
      format: videoAsset.format,
      duration: videoAsset.duration,
      provider: videoAsset.provider,
      transcodeStatus: videoAsset.transcodeStatus,
    })
  } catch (err: unknown) {
    const error = err as { name?: string; status?: number; message?: string }
    const isNotFound =
      error.name === 'NotFound' ||
      error.status === 404 ||
      error.message?.includes('未找到') ||
      error.message?.includes('not found') ||
      error.message?.includes('invalid input syntax')
    if (isNotFound) {
      return NextResponse.json({ error: '分集不存在或已下架 (Episode not found)' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
