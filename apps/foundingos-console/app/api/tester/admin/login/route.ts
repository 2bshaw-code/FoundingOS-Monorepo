/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, signToken } from '../../../../tester/session'

const ADMIN_PASSCODE = process.env.TESTER_ADMIN_PASSCODE ?? 'founderos-admin-review'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const passcode = typeof body?.passcode === 'string' ? body.passcode : ''

  if (passcode !== ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Incorrect passcode.' }, { status: 401 })
  }

  const token = await signToken('admin', 'admin')
  const response = NextResponse.json({ ok: true, redirect: '/tester/admin' })
  response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 4 })
  return response
}
