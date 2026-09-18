import { NextRequest, NextResponse } from 'next/server'
import { SITE_ACCESS_COOKIE } from '../../../../src/site-access'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/access', request.url), 303)
  response.cookies.set(SITE_ACCESS_COOKIE, '', { expires: new Date(0), path: '/' })
  return response
}
