/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Bulk assign/tag for the Pipeline's multi-select bulk action bar, proxying Core.Operations'
// real PATCH /leads/bulk endpoint (same authenticated pattern as every other console route).
export async function PATCH(request: NextRequest) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => null) as { ids?: unknown; assignedUserId?: unknown; tags?: unknown } | null
  const ids = Array.isArray(body?.ids) ? body.ids.map(String) : []
  if (!ids.length) return NextResponse.json({ error: 'Select at least one lead.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/leads/bulk`, {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ ids, ...(body?.assignedUserId !== undefined ? { assignedUserId: body.assignedUserId } : {}), ...(Array.isArray(body?.tags) ? { tags: body.tags } : {}) }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not update the selected leads.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}

// Permanently deletes the selected leads, proxying Core.Operations' real DELETE /leads/bulk.
export async function DELETE(request: NextRequest) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => null) as { ids?: unknown } | null
  const ids = Array.isArray(body?.ids) ? body.ids.map(String) : []
  if (!ids.length) return NextResponse.json({ error: 'Select at least one lead.' }, { status: 400 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/leads/bulk`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ ids }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not delete the selected leads.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
