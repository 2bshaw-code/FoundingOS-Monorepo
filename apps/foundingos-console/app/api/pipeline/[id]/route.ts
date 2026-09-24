/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Updates a single lead's pipeline stage — mirrors the mobile app's
// updatePipelineLeadStage(id, stage) against the same real backend endpoint.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => null) as { stage?: unknown } | null
  const stage = typeof body?.stage === 'string' ? body.stage : ''
  if (!stage) return NextResponse.json({ error: 'A stage is required.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/leads/${encodeURIComponent(params.id)}`, {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ stage }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not update the lead.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
