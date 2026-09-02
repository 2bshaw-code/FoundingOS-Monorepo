/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../../../tester/session'
import { readAccountingInvoices, createAccountingInvoice, REAL_BRAND_SLUGS } from '../../../superdashboard/monetary-store.server'
import type { BrandSlug } from '@foundingos/config'

export const dynamic = 'force-dynamic'

// Real, database-backed invoices — same CORS/auth pattern as /api/crm/deals (see that route's
// comment for the full rationale): read public, write requires any real session.
function jsonWithCors(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { ...(init?.headers ?? {}), 'Access-Control-Allow-Origin': '*' } })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}

export async function GET(request: Request) {
  const brandSlug = new URL(request.url).searchParams.get('brandSlug') as BrandSlug | null
  if (!brandSlug || !REAL_BRAND_SLUGS.includes(brandSlug)) return jsonWithCors({ error: 'Invalid brandSlug' }, { status: 400 })
  const invoices = await readAccountingInvoices(brandSlug)
  const totalInvoiceAmount = Number(invoices.reduce((sum, i) => sum + i.invoiceAmount, 0).toFixed(2))
  const totalPaidAmount = Number(invoices.reduce((sum, i) => sum + i.paidAmount, 0).toFixed(2))
  const totalOutstandingAmount = Number(invoices.reduce((sum, i) => sum + i.outstandingAmount, 0).toFixed(2))
  return jsonWithCors({ invoices, totals: { totalInvoiceAmount, totalPaidAmount, totalOutstandingAmount, count: invoices.length } })
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
  const invoiceNumber = typeof body?.invoiceNumber === 'string' && body.invoiceNumber.trim() ? body.invoiceNumber.trim() : `INV-${Date.now()}`
  const invoiceAmount = Number(body?.invoiceAmount)
  const paidAmount = Number(body?.paidAmount ?? 0)
  if (!Number.isFinite(invoiceAmount) || invoiceAmount < 0 || !Number.isFinite(paidAmount) || paidAmount < 0) {
    return jsonWithCors({ error: 'invoiceAmount and paidAmount must be non-negative numbers' }, { status: 400 })
  }
  const currency = typeof body?.currency === 'string' ? body.currency : 'GBP'

  const invoice = await createAccountingInvoice(brandSlug, invoiceNumber, invoiceAmount, paidAmount, currency)
  return jsonWithCors({ invoice })
}
