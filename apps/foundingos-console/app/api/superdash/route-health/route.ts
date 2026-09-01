/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { checkAllBrandRouteHealth } from '../../../superdashboard/route-health.server'

export const dynamic = 'force-dynamic'

// Real broken-route detection across all 8 brand websites' survey flows. Runs server-side
// (not in the browser) specifically so it isn't subject to CORS — a server-to-server fetch
// to another app's domain is unrestricted, whereas a client-side fetch from the SuperDash
// page to a different origin would be blocked by the browser.
export async function GET() {
  const results = await checkAllBrandRouteHealth()
  return NextResponse.json({ results })
}
