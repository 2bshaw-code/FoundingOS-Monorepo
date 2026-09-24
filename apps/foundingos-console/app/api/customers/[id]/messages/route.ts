/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Quick-reply from the Pipeline's conversation panel — proxies Core.Operations'
// POST /customers/:id/messages, which sends a real WhatsApp message via the Cloud API and
// records it as an outbound CustomerMessage so it shows up in the same thread immediately.
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/customers/${encodeURIComponent(params.id)}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify({ text: body?.text }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not send that message.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
