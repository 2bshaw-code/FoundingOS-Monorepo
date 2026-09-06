/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getAISettings, updateAISettings, type AISettings } from '../../../../../../services/ai/settings/index.ts'
import { getSession } from '../../../lib/session-auth'

function parseSettingsUpdate(value: unknown): Partial<Omit<AISettings, 'tenantId'>> {
  if (!value || typeof value !== 'object') return {}
  const input = value as Partial<Omit<AISettings, 'tenantId'>>
  return {
    enabledDomains: Array.isArray(input.enabledDomains) ? input.enabledDomains : undefined,
    autonomousEnabled: typeof input.autonomousEnabled === 'boolean' ? input.autonomousEnabled : undefined,
    tone: input.tone === 'formal' || input.tone === 'friendly' || input.tone === 'direct' ? input.tone : undefined,
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  return NextResponse.json(getAISettings(session.id))
}

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.', detail: error instanceof Error ? error.message : 'Unknown parse error.' }, { status: 400 })
  }

  return NextResponse.json(updateAISettings(session.id, parseSettingsUpdate(body)))
}
