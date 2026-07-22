/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ errors: [{ message: '请填写邮箱和密码' }] }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const result = await payload.login({
      collection: 'clients',
      data: {
        email,
        password,
      },
    })

    if (!result.user || !result.token) {
      return NextResponse.json({ errors: [{ message: '邮箱或密码错误' }] }, { status: 401 })
    }

    if ((result.user as any).active !== true) {
      return NextResponse.json({ errors: [{ message: '账号已被禁用，无法登录' }] }, { status: 403 })
    }

    const res = NextResponse.json({
      message: '登录成功',
      user: result.user,
      token: result.token,
    })

    // 1. 设置前台 Client 专有的 Cookie，绝对不覆盖 Admin 的 payload-token
    res.cookies.set('client-payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7200,
    })

    return res
  } catch (err: any) {
    return NextResponse.json({ errors: [{ message: err.message || '登录失败' }] }, { status: 400 })
  }
}
