/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE } from '../../../tester/session'

// Single shared logout — clears both the tester and admin session cookies (whichever is
// present) using the same shared domain they were set with, so "manually logged out"
// actually works across every *.foundingos.com subdomain, not just this one.
export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', { path: '/', domain: '.foundingos.com', maxAge: 0 })
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', domain: '.foundingos.com', maxAge: 0 })
  return response
}
