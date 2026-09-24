/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Real Sales Pipeline for a signed-in FoundingOS account — proxies the console's own
// httpOnly session cookie to Core.Operations' tenant-scoped Lead endpoints, the exact same
// backend the mobile app's Sales Pipeline already uses for real
// (apps/foundingos-mobile/lib/core-operations-api.ts: fetchPipelineLeads/createPipelineLead).
// This is the console's first module backed by real, persisted data instead of demo/mock
// content. Deliberately unrelated to /api/crm/deals (legacy per-brand CRMBoard demo data).
function unauthorized() {
  return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
}

export async function GET() {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return unauthorized()

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/owner/pipeline`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return unauthorized()
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not load the pipeline.' }, { status: response.status })
  // Core.Operations wraps real responses as { success, data }; unwrap here so the client
  // component only ever deals with the plain pipelineSummary shape ({ leads, metrics, ... }).
  return NextResponse.json(data?.data ?? data)
}

export async function POST(request: NextRequest) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return unauthorized()

  const body = await request.json().catch(() => null) as { companyName?: unknown; contactName?: unknown; valuePence?: unknown; stage?: unknown } | null
  const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : ''
  if (!companyName) return NextResponse.json({ error: 'Company name is required.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/leads`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        companyName,
        contactName: typeof body?.contactName === 'string' ? body.contactName : undefined,
        valuePence: typeof body?.valuePence === 'number' ? body.valuePence : undefined,
        stage: typeof body?.stage === 'string' ? body.stage : undefined,
      }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return unauthorized()
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not create the lead.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
