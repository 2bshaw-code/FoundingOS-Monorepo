/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { brandConfig } from '../../../brand-config'

// Real AI actions for the native app's AI tab — reuses this brand's own quickActions list
// (brand-config.ts) as plain-language action labels, plus real fetchPath-backed actions
// limited to ONLY the endpoints this specific app actually exposes (checked against its real
// app/api/** routes at generation time — not every brand app has dashboard/scrape/feeds/crypto
// endpoints, so this list is intentionally per-app, not a fixed generic set).
const REAL_FETCH_ACTIONS: { label: string; fetchPath: string }[] = [
    {
      "label": "Refresh my dashboard",
      "fetchPath": "/api/dashboard/refresh"
    },
    {
      "label": "Read live crypto snapshot",
      "fetchPath": "/api/crypto/poll"
    }
  ]

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const quickActions = (brandConfig.quickActions ?? []).map((label) => ({ label, fetchPath: null }))
  return NextResponse.json({ actions: [...quickActions, ...REAL_FETCH_ACTIONS] })
}
