/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../../../tester/session'
import { readBrandFinance, setBrandFinance, REAL_BRAND_SLUGS } from '../../../superdashboard/monetary-store.server'
import type { BrandSlug } from '@foundingos/config'

export const dynamic = 'force-dynamic'

// Real, database-backed brand finance (revenue/expenses/profit, aliased as
// brandRevenue/brandProfit for the brand-console-facing panel) — same CORS/auth pattern as
// /api/crm/deals.
function jsonWithCors(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { ...(init?.headers ?? {}), 'Access-Control-Allow-Origin': '*' } })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}

export async function GET(request: Request) {
  const brandSlug = new URL(request.url).searchParams.get('brandSlug') as BrandSlug | null
  if (!brandSlug || !REAL_BRAND_SLUGS.includes(brandSlug)) return jsonWithCors({ error: 'Invalid brandSlug' }, { status: 400 })
  const finance = await readBrandFinance(brandSlug)
  return jsonWithCors({ finance })
}

export async function POST(request: Request) {
  const sessionToken = cookies().get(SESSION_COOKIE)?.value
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (!testerId && !adminId) return jsonWithCors({ error: 'Sign in required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const brandSlug = body?.brandSlug as BrandSlug | undefined
  if (!brandSlug || !REAL_BRAND_SLUGS.includes(brandSlug)) return jsonWithCors({ error: 'Invalid brandSlug' }, { status: 400 })
  const revenue = Number(body?.revenue)
  const expenses = Number(body?.expenses)
  if (!Number.isFinite(revenue) || revenue < 0 || !Number.isFinite(expenses) || expenses < 0) {
    return jsonWithCors({ error: 'revenue and expenses must be non-negative numbers' }, { status: 400 })
  }
  const currency = typeof body?.currency === 'string' ? body.currency : 'GBP'

  const finance = await setBrandFinance(brandSlug, revenue, expenses, currency)
  return jsonWithCors({ finance })
}
