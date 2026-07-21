/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect, afterAll } from 'vitest'

let payload: Payload
let testAdmin: any
let testActiveClient: any
let testDisabledClient: any
let dramaGenre: any
let dramaLanguage: any
let dramaMarket: any
let dramaPlatform: any
let publishedDrama: any
let draftDrama: any
let videoAsset: any
let episode1: any

describe('Data Closed Loop and Access Control', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // 1. 清理以往测试数据，确保环境干净
    await payload.delete({ collection: 'episodes', where: {} })
    await payload.delete({ collection: 'dramas', where: {} })
    await payload.delete({ collection: 'video-assets', where: {} })
    await payload.delete({ collection: 'genres', where: {} })
    await payload.delete({ collection: 'languages', where: {} })
    await payload.delete({ collection: 'markets', where: {} })
    await payload.delete({ collection: 'platforms', where: {} })
    await payload.delete({ collection: 'clients', where: {} })
    await payload.delete({ collection: 'admins', where: {} })

    // 2. 创建测试管理员
    testAdmin = await payload.create({
      collection: 'admins',
      data: {
        email: 'admin-test@easternvision.com',
        password: 'password123',
        name: 'Test Administrator',
        role: 'super-admin',
        active: true,
      },
    })

    // 3. 创建测试客户账号
    testActiveClient = await payload.create({
      collection: 'clients',
      data: {
        email: 'client-active@easternvision.com',
        company: 'Active Client FZCO',
        password: 'password123',
        active: true,
      },
    })

    testDisabledClient = await payload.create({
      collection: 'clients',
      data: {
        email: 'client-disabled@easternvision.com',
        company: 'Disabled Client FZCO',
        password: 'password123',
        active: false,
      },
    })

    // 4. 创建题材、语言、市场、平台字典
    dramaGenre = await payload.create({
      collection: 'genres',
      data: { code: 'romance', name: '浪漫爱情', enabled: true },
    })

    dramaLanguage = await payload.create({
      collection: 'languages',
      data: { code: 'ar-dubai', name: '阿拉伯语(迪拜)' },
    })

    dramaMarket = await payload.create({
      collection: 'markets',
      data: { code: 'mena', name: '中东非市场' },
    })

    dramaPlatform = await payload.create({
      collection: 'platforms',
      data: { code: 'tiktok-mena', name: 'TikTok MENA' },
    })

    // 5. 创建私有视频资产
    videoAsset = await payload.create({
      collection: 'video-assets',
      data: {
        provider: 'aliyun-oss',
        objectKey: 'dramas/EV-001/episodes/01/master.m3u8',
        format: 'hls',
        transcodeStatus: 'ready',
        duration: 120,
        size: 5048576,
      },
      // 使用 admin 身份绕过权限限制
      user: testAdmin,
    })
  })

  // 清理数据
  afterAll(async () => {
    await payload.delete({ collection: 'episodes', where: {} })
    await payload.delete({ collection: 'dramas', where: {} })
    await payload.delete({ collection: 'video-assets', where: {} })
    await payload.delete({ collection: 'genres', where: {} })
    await payload.delete({ collection: 'languages', where: {} })
    await payload.delete({ collection: 'markets', where: {} })
    await payload.delete({ collection: 'platforms', where: {} })
    await payload.delete({ collection: 'clients', where: {} })
    await payload.delete({ collection: 'admins', where: {} })
  })

  it('verifies drama draft and publish access controls', async () => {
    // 1. 创建已发布的短剧
    publishedDrama = await payload.create({
      collection: 'dramas',
      data: {
        code: 'EV-001',
        slug: 'ev-001-slug',
        title: '我的中东豪门生活',
        summary: '一部关于迪拜豪门的短剧。',
        genres: [dramaGenre.id],
        languages: [dramaLanguage.id],
        markets: [dramaMarket.id],
        platforms: [dramaPlatform.id],
        releaseDate: new Date().toISOString(),
        _status: 'published',
      },
      user: testAdmin,
    })

    // 2. 创建草稿状态的短剧
    draftDrama = await payload.create({
      collection: 'dramas',
      data: {
        code: 'EV-002',
        slug: 'ev-002-slug',
        title: '未发布新剧草稿',
        summary: '草稿简介。',
        _status: 'draft',
      },
      user: testAdmin,
    })

    expect(publishedDrama.id).toBeDefined()
    expect(draftDrama.id).toBeDefined()

    // 3. 验证管理员可以查看到两者
    const allDramasForAdmin = await payload.find({
      collection: 'dramas',
      overrideAccess: false,
      user: testAdmin,
    })
    expect(allDramasForAdmin.docs.length).toBe(2)

    // 4. 验证游客/未登录用户只能看到 published 状态
    const allDramasForGuest = await payload.find({
      collection: 'dramas',
      overrideAccess: false,
    })
    expect(allDramasForGuest.docs.length).toBe(1)
    expect(allDramasForGuest.docs[0].id).toBe(publishedDrama.id)

    // 5. 验证 B2B 客户也只能看到 published 状态
    const allDramasForClient = await payload.find({
      collection: 'dramas',
      overrideAccess: false,
      user: testActiveClient,
    })
    expect(allDramasForClient.docs.length).toBe(1)
  })

  it('verifies unique episode numbers and automatic episode count updates', async () => {
    // 1. 创建第一个有效分集
    episode1 = await payload.create({
      collection: 'episodes',
      data: {
        drama: publishedDrama.id,
        episodeNumber: 1,
        title: '第一集：初到迪拜',
        videoAsset: videoAsset.id,
        duration: 120,
        enabled: true,
      },
      user: testAdmin,
    })
    expect(episode1.id).toBeDefined()

    // 验证 drama 中的 episodeCount 自动更新为 1
    const dramaUpdate1 = await payload.findByID({
      collection: 'dramas',
      id: publishedDrama.id as string,
      user: testAdmin as any,
    })
    expect(dramaUpdate1.episodeCount).toBe(1)

    // 2. 尝试创建同部剧相同集号的分集，应当抛出验证错误
    await expect(
      payload.create({
        collection: 'episodes',
        data: {
          drama: publishedDrama.id,
          episodeNumber: 1,
          title: '重复的第一集',
          enabled: true,
        },
        user: testAdmin as any,
      })
    ).rejects.toThrow()

    // 3. 创建第二个有效分集
    const episode2 = await payload.create({
      collection: 'episodes',
      data: {
        drama: publishedDrama.id,
        episodeNumber: 2,
        title: '第二集：豪门风云',
        enabled: true,
      },
      user: testAdmin as any,
    })
    expect(episode2.id).toBeDefined()

    // 验证 count 增加至 2
    const dramaUpdate2 = await payload.findByID({
      collection: 'dramas',
      id: publishedDrama.id as string,
      user: testAdmin as any,
    })
    expect(dramaUpdate2.episodeCount).toBe(2)

    // 4. 删除第二个分集，验证 count 回退到 1
    await payload.delete({
      collection: 'episodes',
      id: episode2.id,
      user: testAdmin as any,
    })

    const dramaUpdate3 = await payload.findByID({
      collection: 'dramas',
      id: publishedDrama.id as string,
      user: testAdmin as any,
    })
    expect(dramaUpdate3.episodeCount).toBe(1)
  })

  it('verifies video asset is restricted from guest read', async () => {
    // 1. 尝试以游客身份直接读取 video-assets
    await expect(
      payload.find({
        collection: 'video-assets',
        overrideAccess: false,
      })
    ).rejects.toThrow()

    // 2. 尝试以客户身份读取 video-assets
    await expect(
      payload.find({
        collection: 'video-assets',
        overrideAccess: false,
        user: testActiveClient as any,
      })
    ).rejects.toThrow()

    // 3. 管理员应当可以读取
    const assets = await payload.find({
      collection: 'video-assets',
      overrideAccess: false,
      user: testAdmin,
    })
    expect(assets.docs.length).toBeGreaterThan(0)
  })

  it('verifies sign-play-url custom endpoint access control', async () => {
    const payloadConfig = await config
    const endpoint = payloadConfig.endpoints?.find(
      (e) => e.path === '/video-assets/sign-play-url'
    )
    expect(endpoint).toBeDefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const handler = endpoint!.handler as Function

    // 1. 游客访问（user 未定义），应返回 401
    const resGuest = await handler({
      user: null,
      payload,
      url: `http://localhost:3000/api/video-assets/sign-play-url?episodeId=${episode1.id}`,
    })
    expect(resGuest.status).toBe(401)

    // 2. 禁用的 client 访问，应返回 403
    const resDisabled = await handler({
      user: testDisabledClient,
      payload,
      url: `http://localhost:3000/api/video-assets/sign-play-url?episodeId=${episode1.id}`,
    })
    expect(resDisabled.status).toBe(403)

    // 3. 活跃的 client 访问，应返回 200，并返回签名 URL，且不暴露原始 key
    const resActive = await handler({
      user: testActiveClient,
      payload,
      url: `http://localhost:3000/api/video-assets/sign-play-url?episodeId=${episode1.id}`,
    })
    expect(resActive.status).toBe(200)
    const dataActive = await resActive.json()
    expect(dataActive.url).toContain('https://mock-oss.com/')
    expect(dataActive.url).toContain('master.m3u8')
    expect(dataActive.url).toContain('signature=')
    expect(dataActive.format).toBe('hls')

    // 4. 模拟访问不存在的剧集，应返回 404
    const resNotFound = await handler({
      user: testActiveClient,
      payload,
      url: `http://localhost:3000/api/video-assets/sign-play-url?episodeId=000000000000000000000000`,
    })
    expect(resNotFound.status).toBe(404)
  })
})
