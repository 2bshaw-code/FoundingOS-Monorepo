/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { readSiteAccess, SITE_ACCESS_COOKIE } from '../../../../src/site-access'

export const dynamic = 'force-dynamic'

// Who this preview visitor is (investor, tester or guest), so SuperDash can open the investor
// preview and the workspace sign-in can prefill the email they already gave at the access page.
export function GET(request: NextRequest) {
  let access: ReturnType<typeof readSiteAccess> = null
  try { access = readSiteAccess(request.cookies.get(SITE_ACCESS_COOKIE)?.value) } catch { access = null }
  return NextResponse.json({ role: access?.role ?? null, email: access?.email ?? null }, { headers: { 'Cache-Control': 'no-store' } })
}
