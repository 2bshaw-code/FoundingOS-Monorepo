/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../../../tester/session'
import { readCrmDeals, createCrmDeal, REAL_BRAND_SLUGS } from '../../../superdashboard/monetary-store.server'
import type { BrandSlug } from '@foundingos/config'

export const dynamic = 'force-dynamic'

// Real, database-backed CRM deals — read is public (matches CRM's existing open-by-design
// access), write requires any real signed-in session (tester or admin), matching this OS's
// general trust model rather than opening an unauthenticated public write endpoint. CORS-open
// because CRMBoard (packages/ui/src/console.tsx) is rendered on all 9 app domains and this
// route only ever lives in foundingos-console — same pattern already proven by /api/fx/rates.
function jsonWithCors(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { ...(init?.headers ?? {}), 'Access-Control-Allow-Origin': '*' } })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}

export async function GET(request: Request) {
  const brandSlug = new URL(request.url).searchParams.get('brandSlug') as BrandSlug | null
  if (!brandSlug || !REAL_BRAND_SLUGS.includes(brandSlug)) return jsonWithCors({ error: 'Invalid brandSlug' }, { status: 400 })
  const deals = await readCrmDeals(brandSlug)
  const totalDealValue = Number(deals.reduce((sum, d) => sum + d.dealValue, 0).toFixed(2))
  const totalExpectedValue = Number(deals.reduce((sum, d) => sum + d.expectedValue, 0).toFixed(2))
  const totalWeightedValue = Number(deals.reduce((sum, d) => sum + d.probabilityWeightedValue, 0).toFixed(2))
  return jsonWithCors({ deals, totals: { totalDealValue, totalExpectedValue, totalWeightedValue, count: deals.length } })
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
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const dealValue = Number(body?.dealValue)
  if (!name || !Number.isFinite(dealValue) || dealValue < 0) return jsonWithCors({ error: 'name and a non-negative dealValue are required' }, { status: 400 })
  const currency = typeof body?.currency === 'string' ? body.currency : 'GBP'
  const stage = typeof body?.stage === 'string' ? body.stage : 'New'
  const owner = typeof body?.owner === 'string' ? body.owner : undefined

  const deal = await createCrmDeal(brandSlug, name, dealValue, currency, stage, owner)
  return jsonWithCors({ deal })
}
