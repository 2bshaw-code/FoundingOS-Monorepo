/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { buildContext } from '../../../../../services/ai/orchestrator/context-builder.ts'
import { runAAL } from '../../../../../services/ai/orchestrator/index.ts'
import { routeAIRequest } from '../../../../../services/ai/orchestrator/Orchestrator.ts'
import type { AALDomain, AALIntent } from '../../../../../services/ai/events/event-bus.ts'
import { getSession } from '../../lib/session-auth'

async function parseBody(request: NextRequest) {
  if (request.method === 'GET') return Object.fromEntries(request.nextUrl.searchParams.entries())
  try {
    const parsed = await request.json()
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown parse error.')
  }
}

export async function runAALRequest(request: NextRequest, domain: AALDomain, intent: AALIntent, defaults: Record<string, unknown> = {}) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await parseBody(request)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.', detail: error instanceof Error ? error.message : 'Unknown parse error.' }, { status: 400 })
  }

  const result = runAAL({ ...defaults, ...body, actorId: session.id, domain, intent, channel: 'api' })
  return NextResponse.json(result, { status: result.ok ? 200 : 403 })
}

export async function runAIActionRequest(request: NextRequest, domain: AALDomain, action: string, defaults: Record<string, unknown> = {}) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await parseBody(request)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.', detail: error instanceof Error ? error.message : 'Unknown parse error.' }, { status: 400 })
  }

  const context = buildContext({ ...defaults, ...body, actorId: session.id, tenantId: session.id, domain, channel: 'api' })
  const result = await routeAIRequest(domain, action, { ...defaults, ...body }, context)
  return NextResponse.json(result, { status: result.success ? 200 : 403 })
}
