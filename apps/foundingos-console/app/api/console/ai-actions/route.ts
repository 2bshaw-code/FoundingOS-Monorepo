/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { brandConfig } from '../../../brand-config'

// Real AI actions for the native app's AI tab — reuses this app's own quickActions list
// (brand-config.ts) as plain-language action labels, plus real fetchPath-backed actions
// against the endpoints this specific app actually exposes (foundingos-console has no
// dashboard/scrape/feeds demo generators — those are brand-console-only — so its real
// data-backed actions point at SuperDash's own real endpoints instead).
const REAL_FETCH_ACTIONS: { label: string; fetchPath: string }[] = [
  { label: 'Refresh SuperDashboard overview', fetchPath: '/api/superdash/overview' },
  { label: 'Analyse live brand engagement', fetchPath: '/api/superdash/brand-metrics' },
]

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const quickActions = (brandConfig.quickActions ?? []).map((label) => ({ label, fetchPath: null }))
  return NextResponse.json({ actions: [...quickActions, ...REAL_FETCH_ACTIONS] })
}
