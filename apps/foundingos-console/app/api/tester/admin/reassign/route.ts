/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyToken } from '../../../../tester/session'
import { findModuleOption } from '../../../../tester/tester-data'
import { getTester, upsertTester } from '../../../../tester/store.server'

export async function POST(request: Request) {
  const token = cookies().get(ADMIN_COOKIE)?.value
  const adminId = token ? await verifyToken('admin', token) : null
  if (!adminId) return NextResponse.json({ error: 'Not authorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const testerId = typeof body?.testerId === 'string' ? body.testerId : ''
  const moduleId = typeof body?.moduleId === 'string' ? body.moduleId : ''

  const tester = getTester(testerId)
  if (!tester) return NextResponse.json({ error: 'Tester not found' }, { status: 404 })

  const moduleOption = findModuleOption(moduleId)
  if (!moduleOption) return NextResponse.json({ error: 'Unknown module' }, { status: 400 })

  // Reassignment starts a fresh working buffer for the new survey — completed run history is untouched.
  const updated = upsertTester(testerId, {
    moduleId: moduleOption.moduleId,
    moduleLabel: moduleOption.moduleLabel,
    surveyId: moduleOption.surveyId,
    currentAnswers: [],
  })

  return NextResponse.json({ ok: true, tester: updated })
}
