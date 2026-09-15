/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, signToken } from '../../../tester/session'
import { findCredentialByPassword } from '../../../tester/tester-data'
import { getTester, upsertTester } from '../../../tester/store.server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password.trim() : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and access code are required.' }, { status: 400 })
  }

  const credential = findCredentialByPassword(password)
  if (!credential) {
    return NextResponse.json({ error: 'That access code is not recognized.' }, { status: 401 })
  }

  const existing = getTester(credential.id)
  const tester = upsertTester(credential.id, {
    email: existing?.email || email,
    moduleId: credential.moduleId,
    moduleLabel: credential.moduleLabel,
    surveyId: credential.surveyId,
    status: existing?.status ?? 'registered',
    currentAnswers: existing?.currentAnswers ?? [],
    runs: existing?.runs ?? [],
  })

  const token = await signToken('tester', tester.id)
  const response = NextResponse.json({ ok: true, redirect: '/tester/dashboard' })
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
