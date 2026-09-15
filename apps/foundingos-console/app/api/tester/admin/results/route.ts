/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyToken } from '../../../../tester/session'
import { readTesters } from '../../../../tester/store.server'

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE)?.value
  const adminId = token ? await verifyToken('admin', token) : null
  if (!adminId) return NextResponse.json({ error: 'Not authorized' }, { status: 401 })

  return NextResponse.json({ testers: Object.values(readTesters()) })
}
