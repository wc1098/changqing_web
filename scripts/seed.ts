import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function seed() {
  console.log('Connecting to database and seeding admin, clients, and multi-language dictionary data...')
  const payload = await getPayload({ config })

  // 1. Check or create Super Admin
  const existingAdmins = await payload.find({
    collection: 'admins',
    limit: 1,
  })

  if (existingAdmins.docs.length === 0) {
    const admin = await payload.create({
      collection: 'admins',
      data: {
        email: 'admin@easternvision.com',
        password: 'password123',
        name: 'Super Admin',
        role: 'super-admin',
        active: true,
      },
    })
    console.log('✓ Created default super admin:', admin.email, '(password: password123)')
  } else {
    console.log('ℹ Admin user already exists:', existingAdmins.docs[0].email)
  }

  // 2. Check or create Client Account
  const existingClients = await payload.find({
    collection: 'clients',
    limit: 1,
  })

  if (existingClients.docs.length === 0) {
    const client = await payload.create({
      collection: 'clients',
      data: {
        email: 'client-active@easternvision.com',
        password: 'password123',
        company: 'Eastern Vision FZCO',
        active: true,
      },
    })
    console.log('✓ Created default active client:', client.email, '(password: password123)')
  }

  // 3. Seed Genres (题材分类) - Both ZH and EN
  const defaultGenres = [
    { code: 'ceo', zh: '霸道总裁', en: 'CEO & Billionaire', sortOrder: 1 },
    { code: 'romance', zh: '浪漫甜宠', en: 'Romance & Love', sortOrder: 2 },
    { code: 'revenge', zh: '逆袭复仇', en: 'Revenge & Counterattack', sortOrder: 3 },
    { code: 'werewolf', zh: '狼人吸血鬼', en: 'Werewolf & Vampire', sortOrder: 4 },
    { code: 'palace', zh: '宫斗宅斗', en: 'Palace & Family Drama', sortOrder: 5 },
    { code: 'urban', zh: '都市情感', en: 'Urban & Modern', sortOrder: 6 },
    { code: 'suspense', zh: '悬疑推理', en: 'Suspense & Mystery', sortOrder: 7 },
    { code: 'fantasy', zh: '玄幻奇幻', en: 'Fantasy & Magic', sortOrder: 8 },
  ]

  for (const g of defaultGenres) {
    const found = await payload.find({
      collection: 'genres',
      where: { code: { equals: g.code } },
    })
    let docId: string
    if (found.docs.length === 0) {
      const created = await payload.create({
        collection: 'genres',
        locale: 'zh',
        data: {
          code: g.code,
          name: g.zh,
          enabled: true,
          sortOrder: g.sortOrder,
        },
      })
      docId = created.id
    } else {
      docId = found.docs[0].id
      await payload.update({
        collection: 'genres',
        id: docId,
        locale: 'zh',
        data: { name: g.zh, enabled: true, sortOrder: g.sortOrder },
      })
    }
    // Update EN locale
    await payload.update({
      collection: 'genres',
      id: docId,
      locale: 'en',
      data: { name: g.en },
    })
  }
  console.log('✓ Seeded & Fixed Genres dictionary (题材分类 - 包含中英文多语言)')

  // 4. Seed Languages (配音/字幕版本) - Both ZH and EN
  const defaultLanguages = [
    { code: 'ar-dub', zh: '阿拉伯语配音', en: 'Arabic Dubbed' },
    { code: 'ar-sub', zh: '阿拉伯语字幕', en: 'Arabic Subtitled' },
    { code: 'en-sub', zh: '英文字幕', en: 'English Subtitled' },
    { code: 'en-dub', zh: '英语配音', en: 'English Dubbed' },
    { code: 'tr-dub', zh: '土耳其语配音', en: 'Turkish Dubbed' },
    { code: 'tr-sub', zh: '土耳其字幕', en: 'Turkish Subtitled' },
    { code: 'zh-orig', zh: '中文原声', en: 'Chinese Original' },
  ]

  for (const l of defaultLanguages) {
    const found = await payload.find({
      collection: 'languages',
      where: { code: { equals: l.code } },
    })
    let docId: string
    if (found.docs.length === 0) {
      const created = await payload.create({
        collection: 'languages',
        locale: 'zh',
        data: {
          code: l.code,
          name: l.zh,
        },
      })
      docId = created.id
    } else {
      docId = found.docs[0].id
      await payload.update({
        collection: 'languages',
        id: docId,
        locale: 'zh',
        data: { name: l.zh },
      })
    }
    // Update EN locale
    await payload.update({
      collection: 'languages',
      id: docId,
      locale: 'en',
      data: { name: l.en },
    })
  }
  console.log('✓ Seeded & Fixed Languages dictionary (配音/字幕版本 - 包含中英文多语言)')

  // 5. Seed Markets (目标市场) - Both ZH and EN
  const defaultMarkets = [
    { code: 'mena', zh: '中东非市场 (MENA)', en: 'MENA Region' },
    { code: 'gcc', zh: '海湾合作委员会国家 (GCC)', en: 'GCC Countries' },
    { code: 'sa', zh: '沙特阿拉伯', en: 'Saudi Arabia' },
    { code: 'ae', zh: '阿联酋 (迪拜)', en: 'UAE (Dubai)' },
    { code: 'sea', zh: '东南亚市场', en: 'Southeast Asia' },
    { code: 'global', zh: '全球发行', en: 'Worldwide' },
  ]

  for (const m of defaultMarkets) {
    const found = await payload.find({
      collection: 'markets',
      where: { code: { equals: m.code } },
    })
    let docId: string
    if (found.docs.length === 0) {
      const created = await payload.create({
        collection: 'markets',
        locale: 'zh',
        data: {
          code: m.code,
          name: m.zh,
        },
      })
      docId = created.id
    } else {
      docId = found.docs[0].id
      await payload.update({
        collection: 'markets',
        id: docId,
        locale: 'zh',
        data: { name: m.zh },
      })
    }
    // Update EN locale
    await payload.update({
      collection: 'markets',
      id: docId,
      locale: 'en',
      data: { name: m.en },
    })
  }
  console.log('✓ Seeded & Fixed Markets dictionary (目标市场 - 包含中英文多语言)')

  // 6. Seed Platforms (适配平台) - Both ZH and EN
  const defaultPlatforms = [
    { code: 'tiktok', zh: 'TikTok 短剧频道', en: 'TikTok Series' },
    { code: 'shahid', zh: 'Shahid VIP 视频', en: 'Shahid VIP' },
    { code: 'starzplay', zh: 'Starzplay 中东', en: 'Starzplay Arabia' },
    { code: 'youtube', zh: 'YouTube 短视频', en: 'YouTube Shorts' },
    { code: 'snapchat', zh: 'Snapchat 探索频道', en: 'Snapchat Discover' },
    { code: 'facebook', zh: 'Facebook 视频专区', en: 'Facebook Watch' },
    { code: 'kwai', zh: '快手中东版 (Kwai)', en: 'Kwai Middle East' },
    { code: 'dramabox', zh: 'DramaBox 短剧', en: 'DramaBox' },
    { code: 'reelshort', zh: 'ReelShort 独立剧', en: 'ReelShort' },
  ]

  for (const p of defaultPlatforms) {
    const found = await payload.find({
      collection: 'platforms',
      where: { code: { equals: p.code } },
    })
    let docId: string
    if (found.docs.length === 0) {
      const created = await payload.create({
        collection: 'platforms',
        locale: 'zh',
        data: {
          code: p.code,
          name: p.zh,
        },
      })
      docId = created.id
    } else {
      docId = found.docs[0].id
      await payload.update({
        collection: 'platforms',
        id: docId,
        locale: 'zh',
        data: { name: p.zh },
      })
    }
    // Update EN locale
    await payload.update({
      collection: 'platforms',
      id: docId,
      locale: 'en',
      data: { name: p.en },
    })
  }
  console.log('✓ Seeded & Fixed Platforms dictionary (适配平台 - 包含中英文多语言)')

  console.log('🎉 Multi-language Seed finished successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Failed to seed database:', err)
  process.exit(1)
})
