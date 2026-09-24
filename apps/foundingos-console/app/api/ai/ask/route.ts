/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Proxies Core.Operations' POST /ai/ask. Accepts an optional customerId so FoundAI can be
// asked "about this conversation" from the Pipeline's conversation panel — the backend
// grounds its answer in that customer's real WhatsApp/messaging history when it's supplied.
export async function POST(request: Request) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/ai/ask`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify({
        question: body?.question,
        workspace: body?.workspace,
        module: body?.module,
        customerId: body?.customerId,
      }),
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundAI right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'FoundAI could not answer that.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
