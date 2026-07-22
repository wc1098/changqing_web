/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const clientToken = cookieStore.get('client-payload-token')?.value || cookieStore.get('payload-token')?.value

    if (!clientToken) {
      return NextResponse.json({ user: null })
    }

    const payload = await getPayload({ config: configPromise })

    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${clientToken}`,
      }),
    })

    if (user && (user as any).collection === 'clients' && (user as any).active === true) {
      return NextResponse.json({ user })
    }

    return NextResponse.json({ user: null })
  } catch {
    return NextResponse.json({ user: null })
  }
}
