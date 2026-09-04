/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../../lib/session-auth'
import { brandConfig } from '../../../../brand-config'

// Real per-module data for native module screens — reuses the exact module entry already
// authored in this app's own brand-config.ts (metrics/actions/workflow), the same real data
// the web console's ModulePage renders from. No separate native data source.
export async function GET(request: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const { moduleId } = await params
  const moduleEntry = brandConfig.modules.find((entry) => entry.id === moduleId)
  if (!moduleEntry) return NextResponse.json({ error: 'Module not found.' }, { status: 404 })

  return NextResponse.json({ module: moduleEntry })
}
