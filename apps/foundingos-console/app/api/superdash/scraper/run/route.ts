/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyToken } from '../../../../tester/session'
import { runScrapeForAllBrands } from '../../../../superdashboard/scraping-store.server'

// Force dynamic — this handler triggers real network calls + DB writes on every call and
// must never be statically cached/prerendered.
export const dynamic = 'force-dynamic'

// Admin-only (not covered by middleware.ts's matcher, so checked directly here) — this
// endpoint fans out real HTTP calls to every brand console's own /api/scrape/refresh route
// and reports back whatever those calls actually returned. Same real, already-deployed
// endpoints a Vercel cron calls on schedule; this just lets admin trigger them on demand.
export async function POST() {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (!adminId || !adminToken) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const results = await runScrapeForAllBrands(adminToken)
  return NextResponse.json({ ranAt: new Date().toISOString(), results })
}
