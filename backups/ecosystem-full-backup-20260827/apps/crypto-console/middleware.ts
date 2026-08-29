/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { NextRequest } from 'next/server'
import { checkAccess } from '@foundingos/ui/access-gate'

export function middleware(request: NextRequest) {
  const result = checkAccess(request, request.nextUrl.pathname)
  return result.allowed ? undefined : result.response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
