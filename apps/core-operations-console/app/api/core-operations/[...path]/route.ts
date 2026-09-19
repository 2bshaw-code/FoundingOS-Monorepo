/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const BACKEND_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-backend.vercel.app'
const TOKEN_COOKIE = 'fo_core_ops_console_token'
const TENANT_COOKIE = 'fo_core_ops_console_tenant'
const DEVICE_COOKIE = 'fo_core_ops_console_device'

function targetUrl(request: NextRequest, path: string[]) {
  const incoming = new URL(request.url)
  const target = new URL(`${BACKEND_BASE.replace(/\/+$/, '')}/api/v1/${path.join('/')}`)
  target.search = incoming.search
  return target
}

function filteredResponseHeaders(headers: Headers) {
  const next = new Headers()
  for (const [key, value] of headers.entries()) {
    if (['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) continue
    next.set(key, value)
  }
  return next
}

async function proxy(request: NextRequest, path: string[]) {
  const cookieStore = await cookies()
  if (path.join('/') === 'auth/logout') {
    cookieStore.delete(TOKEN_COOKIE)
    cookieStore.delete(TENANT_COOKIE)
    cookieStore.delete(DEVICE_COOKIE)
    return Response.json({ success: true })
  }

  const headers = new Headers(request.headers)
  for (const header of ['host', 'origin', 'referer', 'connection', 'content-length', 'if-none-match', 'if-modified-since']) headers.delete(header)
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  const tenantId = cookieStore.get(TENANT_COOKIE)?.value
  const deviceFingerprint = cookieStore.get(DEVICE_COOKIE)?.value
  if (!headers.get('authorization') && token) headers.set('authorization', `Bearer ${token}`)
  if (!headers.get('x-tenant-id') && tenantId) headers.set('x-tenant-id', tenantId)
  if (!headers.get('x-device-fingerprint') && deviceFingerprint) headers.set('x-device-fingerprint', deviceFingerprint)

  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text()
  const response = await fetch(targetUrl(request, path), {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  })
  const responseText = await response.text()

  if (path.join('/') === 'auth/login' && response.ok) {
    const payload = JSON.parse(responseText) as { token?: string; user?: { tenantId?: string | null } }
    const secure = process.env.NODE_ENV === 'production'
    if (payload.token) cookieStore.set(TOKEN_COOKIE, payload.token, { httpOnly: true, sameSite: 'lax', secure, path: '/' })
    if (payload.user?.tenantId) cookieStore.set(TENANT_COOKIE, payload.user.tenantId, { httpOnly: true, sameSite: 'lax', secure, path: '/' })
    const incomingFingerprint = request.headers.get('x-device-fingerprint')
    if (incomingFingerprint) cookieStore.set(DEVICE_COOKIE, incomingFingerprint, { httpOnly: true, sameSite: 'lax', secure, path: '/' })
  }

  return new Response(response.status === 304 ? null : responseText, { status: response.status, headers: filteredResponseHeaders(response.headers) })
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path)
}
