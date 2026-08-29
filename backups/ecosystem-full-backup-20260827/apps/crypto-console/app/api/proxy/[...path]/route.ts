/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest } from 'next/server'

const BACKEND = process.env.FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || 'http://localhost:5050/api/v1'

/**
 * Same-origin proxy for browser calls. Attaches the service token server-side
 * so it is never exposed to the client. Already behind the Basic Auth gate.
 */
async function forward(request: NextRequest, path: string[]) {
  const search = request.nextUrl.search
  const target = `${BACKEND.replace(/\/+$/, '')}/${path.join('/')}${search}`
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text()

  const response = await fetch(target, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.CONSOLE_SERVICE_TOKEN ? { 'x-service-token': process.env.CONSOLE_SERVICE_TOKEN } : {}),
      ...(process.env.CONSOLE_SERVICE_COMPANY ? { 'x-service-company': process.env.CONSOLE_SERVICE_COMPANY } : {}),
    },
    body: body || undefined,
    cache: 'no-store',
  })

  return new Response(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const GET = (req: NextRequest, ctx: { params: { path: string[] } }) => forward(req, ctx.params.path)
export const POST = (req: NextRequest, ctx: { params: { path: string[] } }) => forward(req, ctx.params.path)
export const PUT = (req: NextRequest, ctx: { params: { path: string[] } }) => forward(req, ctx.params.path)
export const DELETE = (req: NextRequest, ctx: { params: { path: string[] } }) => forward(req, ctx.params.path)
