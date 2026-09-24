/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Real, generic Records module for a signed-in FoundingOS account — proxies to
// Core.Operations' generic workspace-record endpoints
// (/api/v1/ops/platform/workspaces/:workspace/:module/records), the same backend every
// module screen in the mobile app already reads/writes for real
// (apps/foundingos-mobile/lib/core-operations-api.ts: fetchWorkspaceRecords/createWorkspaceRecord).
// No per-module backend work is required — any (workspace, module) pair the tenant has
// enabled works the same way.
function unauthorized() {
  return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return unauthorized()

  const { searchParams } = new URL(request.url)
  const workspace = searchParams.get('workspace') || ''
  const module = searchParams.get('module') || ''
  if (!workspace || !module) return NextResponse.json({ error: 'workspace and module are required.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/platform/workspaces/${encodeURIComponent(workspace)}/${encodeURIComponent(module)}/records`, {
      headers: { authorization: 'Bearer ' + token },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return unauthorized()
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not load those records.' }, { status: response.status })
  return NextResponse.json({ records: data?.data ?? [] })
}

export async function POST(request: NextRequest) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return unauthorized()

  const body = await request.json().catch(() => null) as { workspace?: unknown; module?: unknown; reference?: unknown; name?: unknown; status?: unknown; valuePence?: unknown } | null
  const workspace = typeof body?.workspace === 'string' ? body.workspace : ''
  const module = typeof body?.module === 'string' ? body.module : ''
  const reference = typeof body?.reference === 'string' ? body.reference.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const status = typeof body?.status === 'string' ? body.status.trim() : ''
  if (!workspace || !module) return NextResponse.json({ error: 'workspace and module are required.' }, { status: 400 })
  if (!reference || !name || !status) return NextResponse.json({ error: 'Reference, name, and status are required.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/platform/workspaces/${encodeURIComponent(workspace)}/${encodeURIComponent(module)}/records`, {
      method: 'POST',
      headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
      body: JSON.stringify({
        reference,
        name,
        status,
        valuePence: typeof body?.valuePence === 'number' ? body.valuePence : undefined,
      }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return unauthorized()
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not create that record.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
