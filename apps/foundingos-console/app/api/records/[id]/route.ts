/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Updates a single workspace record's status (optimistic concurrency via `version`, exactly
// like the mobile app's updateWorkspaceRecord) against the same real backend endpoint.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => null) as { version?: unknown; status?: unknown } | null
  const version = typeof body?.version === 'number' ? body.version : undefined
  const status = typeof body?.status === 'string' ? body.status : ''
  if (version === undefined || !status) return NextResponse.json({ error: 'version and status are required.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/platform/records/${encodeURIComponent(params.id)}`, {
      method: 'PATCH',
      headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
      body: JSON.stringify({ version, status }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not update that record.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
