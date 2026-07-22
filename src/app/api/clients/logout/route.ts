import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: '已登出' })
  // 清理 Client 专属 Cookie，绝对不影响 Admin 登录态
  res.cookies.delete('client-payload-token')
  return res
}
