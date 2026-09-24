/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Converts a lead into a real Customer — proxies Core.Operations' existing
// POST /leads/:id/convert. Once converted, the lead has a customerId and its real
// WhatsApp/messaging history (CustomerMessage rows) becomes available, so the Pipeline
// board opens the conversation panel for it immediately after this succeeds.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/leads/${encodeURIComponent(params.id)}/convert`, {
      method: 'POST',
      headers: { authorization: 'Bearer ' + token },
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not convert this lead.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
