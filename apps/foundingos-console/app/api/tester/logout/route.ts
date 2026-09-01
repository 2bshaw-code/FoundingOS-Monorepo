/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE } from '../../../tester/session'

// Single shared logout — clears both the tester and admin session cookies (whichever is
// present) using the same shared domain they were set with, so "manually logged out"
// actually works across every *.foundingos.com subdomain, not just this one.
//
// Supports both a plain HTML <form method="POST"> submission (the real logout buttons on
// every brand website's session bar) and a fetch-based caller: a browser's own top-level
// form navigation sends "Accept: text/html" first, so that case gets a real redirect back
// to the Quantum login; any other caller (a JSON fetch) gets the JSON response instead.
export async function POST(request: Request) {
  const wantsHtml = (request.headers.get('accept') ?? '').includes('text/html')
  const response = wantsHtml
    ? NextResponse.redirect('https://www.foundingos.com/')
    : NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', { path: '/', domain: '.foundingos.com', maxAge: 0 })
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', domain: '.foundingos.com', maxAge: 0 })
  return response
}
