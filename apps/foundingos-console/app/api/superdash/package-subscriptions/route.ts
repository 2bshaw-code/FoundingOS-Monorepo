/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyToken } from '../../../tester/session'
import { readAllBrandSubscriptions, readRealCommercialTotals, setBrandSubscription, REAL_BRAND_SLUGS } from '../../../superdashboard/monetary-store.server'
import type { BrandSlug } from '@foundingos/config'
import type { BaseTierName } from '@foundingos/config/package-model-d'

export const dynamic = 'force-dynamic'

// Real, read-only for anyone who can already see SuperDash — GET has no side effects, just
// reflects real DB rows (defaulting to real zero/none per brand, never fabricated).
export async function GET() {
  const [subscriptions, totals] = await Promise.all([readAllBrandSubscriptions(), readRealCommercialTotals()])
  return NextResponse.json({ subscriptions, totals })
}

// Admin-only real write — the one real "activation" action referenced in package-model-d.ts's
// own header ("activation is tracked client-side" -> now a real, persisted, server-side row).
// Still no payment processor: this only records what tier/pack a brand is real-assigned to and
// snapshots its real catalog price; nothing is charged.
export async function POST(request: Request) {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (adminId !== 'super-founder-admin') return NextResponse.json({ error: 'Admin session required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const brandSlug = body?.brandSlug as BrandSlug | undefined
  if (!brandSlug || !REAL_BRAND_SLUGS.includes(brandSlug)) return NextResponse.json({ error: 'Invalid brandSlug' }, { status: 400 })

  const baseTier = (body?.baseTier ?? null) as BaseTierName | null
  const industryPack = (body?.industryPack ?? null) as string | null
  const updated = await setBrandSubscription(brandSlug, baseTier, industryPack)
  return NextResponse.json({ subscription: updated })
}
