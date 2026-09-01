/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real, honest monetary layer — see schema.prisma's own comment on BrandSubscription/CrmDeal/
// BrandFinance/AccountingInvoice for the full rationale. Every read function here returns
// real DB rows only; every "default" value shown when no row exists yet is a real, honest
// zero (this product has no real paying customers yet — that's the truthful current state,
// not a placeholder to dress up). Nothing here is a payment processor: these are
// informational records only, set by a real admin action, never auto-charged or auto-billed.
import { getPrismaClient } from '@foundingos/db'
import { brands, type BrandSlug } from '@foundingos/config'
import { BASE_TIERS, INDUSTRY_PACKS, type BaseTierName } from '@foundingos/config/package-model-d'

export const REAL_BRAND_SLUGS: BrandSlug[] = ['retail', 'meat', 'foundthat', 'talent', 'crypto', 'finance', 'health', 'logistics']

// ---------------------------------------------------------------------------
// Package Model D — real, per-brand subscription state
// ---------------------------------------------------------------------------
export type RealBrandSubscription = {
  brandSlug: BrandSlug
  brandName: string
  baseTier: string | null
  industryPack: string | null
  price: number
  mrr: number
  arr: number
  currency: string
  status: string
}

export async function readAllBrandSubscriptions(): Promise<RealBrandSubscription[]> {
  const prisma = getPrismaClient()
  const rows = prisma ? await prisma.brandSubscription.findMany() : []
  const byBrand = new Map(rows.map((row) => [row.brandSlug, row]))
  return REAL_BRAND_SLUGS.map((slug) => {
    const row = byBrand.get(slug)
    return {
      brandSlug: slug,
      brandName: brands[slug]?.name ?? slug,
      baseTier: row?.baseTier ?? null,
      industryPack: row?.industryPack ?? null,
      price: row?.price ?? 0,
      mrr: row?.mrr ?? 0,
      arr: row?.arr ?? 0,
      currency: row?.currency ?? 'GBP',
      status: row?.status ?? 'none',
    }
  })
}

export async function readRealCommercialTotals(): Promise<{ totalMrr: number; totalArr: number; activeCount: number; currency: 'GBP' }> {
  const rows = await readAllBrandSubscriptions()
  const active = rows.filter((r) => r.status === 'active')
  return {
    totalMrr: Number(active.reduce((sum, r) => sum + r.mrr, 0).toFixed(2)),
    totalArr: Number(active.reduce((sum, r) => sum + r.arr, 0).toFixed(2)),
    activeCount: active.length,
    currency: 'GBP',
  }
}

// Real admin action — snapshots the tier/pack's current catalog price at assignment time
// (matching how real billing systems snapshot price at subscription time), stores real
// mrr/arr. This IS the "activation" package-model-d.ts's header says is currently only
// "tracked client-side" — now a real, persisted, server-side action.
export async function setBrandSubscription(brandSlug: BrandSlug, baseTierName: BaseTierName | null, industryPackName: string | null): Promise<RealBrandSubscription> {
  const prisma = getPrismaClient()
  if (!prisma) throw new Error('Database unavailable')
  const baseTier = baseTierName ? BASE_TIERS.find((t) => t.name === baseTierName) : null
  const industryPack = industryPackName ? INDUSTRY_PACKS.find((p) => p.name === industryPackName) : null
  const price = (baseTier?.monthlyPrice ?? 0) + (industryPack?.monthlyPrice ?? 0)
  const mrr = price
  const arr = Number((mrr * 12).toFixed(2))
  const status = price > 0 ? 'active' : 'none'
  const row = await prisma.brandSubscription.upsert({
    where: { brandSlug },
    update: { baseTier: baseTierName, industryPack: industryPackName, price, mrr, arr, status },
    create: { brandSlug, baseTier: baseTierName, industryPack: industryPackName, price, mrr, arr, status },
  })
  return {
    brandSlug,
    brandName: brands[brandSlug]?.name ?? brandSlug,
    baseTier: row.baseTier,
    industryPack: row.industryPack,
    price: row.price,
    mrr: row.mrr,
    arr: row.arr,
    currency: row.currency,
    status: row.status,
  }
}

// ---------------------------------------------------------------------------
// CRM Deals — real per-brand deal records (schema-ready; not yet wired into CRMBoard's UI
// this pass — packages/ui/src/console.tsx's makeRows sample generator is unchanged so far).
// ---------------------------------------------------------------------------
const STAGE_PROBABILITY: Record<string, number> = { Discovery: 0.1, Qualified: 0.3, Proposal: 0.6, Won: 1, Lost: 0 }

export async function readCrmDeals(brandSlug: BrandSlug) {
  const prisma = getPrismaClient()
  return prisma ? prisma.crmDeal.findMany({ where: { brandSlug }, orderBy: { createdAt: 'desc' } }) : []
}

export async function createCrmDeal(brandSlug: BrandSlug, name: string, dealValue: number, currency: string, stage: string, owner?: string) {
  const prisma = getPrismaClient()
  if (!prisma) throw new Error('Database unavailable')
  const probability = STAGE_PROBABILITY[stage] ?? 0.3
  const expectedValue = dealValue
  const probabilityWeightedValue = Number((dealValue * probability).toFixed(2))
  return prisma.crmDeal.create({ data: { brandSlug, name, dealValue, currency, stage, expectedValue, probabilityWeightedValue, owner } })
}

// SuperDash cross-brand pipeline rollup — reads the same real CrmDeal rows every brand's own
// CRM would show, rather than a second duplicate table, so there's only ever one source of
// truth for "what is a deal worth".
export async function readRealPipelineRollup() {
  const prisma = getPrismaClient()
  const deals = prisma ? await prisma.crmDeal.findMany() : []
  return {
    totalDealValue: Number(deals.reduce((sum, d) => sum + d.dealValue, 0).toFixed(2)),
    totalExpectedValue: Number(deals.reduce((sum, d) => sum + d.expectedValue, 0).toFixed(2)),
    totalProbabilityWeightedValue: Number(deals.reduce((sum, d) => sum + d.probabilityWeightedValue, 0).toFixed(2)),
    dealCount: deals.length,
  }
}

// ---------------------------------------------------------------------------
// Finance module + Brand-console earnings — one real table serves both (see schema.prisma
// comment); not yet wired into the Finance module UI or brand console pages this pass.
// ---------------------------------------------------------------------------
export async function readBrandFinance(brandSlug: BrandSlug) {
  const prisma = getPrismaClient()
  const row = prisma ? await prisma.brandFinance.findUnique({ where: { brandSlug } }) : null
  return {
    brandSlug,
    revenue: row?.revenue ?? 0,
    expenses: row?.expenses ?? 0,
    profit: row?.profit ?? 0,
    // brandRevenue/brandProfit are the same real figures under the brand-console-facing name.
    brandRevenue: row?.revenue ?? 0,
    brandProfit: row?.profit ?? 0,
    currency: row?.currency ?? 'GBP',
  }
}

export async function setBrandFinance(brandSlug: BrandSlug, revenue: number, expenses: number, currency = 'GBP') {
  const prisma = getPrismaClient()
  if (!prisma) throw new Error('Database unavailable')
  const profit = Number((revenue - expenses).toFixed(2))
  return prisma.brandFinance.upsert({
    where: { brandSlug },
    update: { revenue, expenses, profit, currency },
    create: { brandSlug, revenue, expenses, profit, currency },
  })
}

// ---------------------------------------------------------------------------
// Accounting module — real invoices (schema-ready; not yet wired into the Accounting module
// UI this pass).
// ---------------------------------------------------------------------------
export async function readAccountingInvoices(brandSlug: BrandSlug) {
  const prisma = getPrismaClient()
  return prisma ? prisma.accountingInvoice.findMany({ where: { brandSlug }, orderBy: { createdAt: 'desc' } }) : []
}

export async function createAccountingInvoice(brandSlug: BrandSlug, invoiceNumber: string, invoiceAmount: number, paidAmount: number, currency = 'GBP') {
  const prisma = getPrismaClient()
  if (!prisma) throw new Error('Database unavailable')
  const outstandingAmount = Number((invoiceAmount - paidAmount).toFixed(2))
  const status = outstandingAmount <= 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'draft'
  return prisma.accountingInvoice.create({ data: { brandSlug, invoiceNumber, invoiceAmount, paidAmount, outstandingAmount, currency, status } })
}
