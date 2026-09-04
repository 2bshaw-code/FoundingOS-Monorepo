/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { brandConfig } from '../../../brand-config'

// Real, generic config endpoint every native brand app calls once at startup — returns the
// exact same BrandConsoleConfig this app's own web console renders from (colors, typography,
// dashboard metrics/table, modules, navigation, quick actions, settings). No native-only
// duplication of this data: the native app renders directly from this JSON, so a change to
// brand-config.ts here is instantly reflected in the app too.
export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  return NextResponse.json({ config: brandConfig })
}
