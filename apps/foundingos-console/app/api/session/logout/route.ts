/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { coreOperationsApiRoot, TENANT_REFRESH_COOKIE, TENANT_SESSION_COOKIE } from '../../../lib/tenant-session'

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(TENANT_REFRESH_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (refreshToken && apiRoot) {
    fetch(`${apiRoot}/auth/logout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-refresh-token': refreshToken },
      signal: AbortSignal.timeout(5_000),
    }).catch(() => {})
  }

  const result = NextResponse.json({ success: true })
  result.cookies.delete(TENANT_SESSION_COOKIE)
  result.cookies.delete(TENANT_REFRESH_COOKIE)
  return result
}
