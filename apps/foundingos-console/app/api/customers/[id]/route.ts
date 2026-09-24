/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../../lib/tenant-session'

export const dynamic = 'force-dynamic'

// Real customer detail + conversation history, for the Sales Pipeline's "View conversation"
// action — proxies Core.Operations' GET /customers/:id, which already includes the
// customer's real WhatsApp/messaging history (CustomerMessage rows) alongside their leads
// and orders. FoundingOS is a messaging-first operating system, so a lead that has been
// converted to a customer should let you see its real conversation thread from the same
// place you manage the deal, not just a bare deal record.
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  let response: Response
  try {
    response = await fetch(`${apiRoot}/ops/customers/${encodeURIComponent(params.id)}`, {
      headers: { authorization: 'Bearer ' + token },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ error: 'Cannot reach FoundingOS right now.' }, { status: 502 })
  }
  if (response.status === 401) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: data?.message || 'Could not load that conversation.' }, { status: response.status })
  return NextResponse.json(data?.data ?? data)
}
