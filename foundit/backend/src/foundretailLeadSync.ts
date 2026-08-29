/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'

type LeadItem = { id: string; url: string; title: string; tenantId: string | null; merchantName: string | null; companyName: string | null; contactEmail: string | null; contactPhone: string | null; listingFeePence: number; placementFeePence: number; deliveryFeePence: number; premiumFeePence: number }

export const pushScrapedLeadToFoundRetailWithAuthorization = async (authorization: string, item: LeadItem) => {
  if (!item.tenantId || !(item.companyName || item.merchantName)) return null
  const response = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}/leads`, {
    method: 'POST',
    headers: { Authorization: authorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: item.tenantId, source: 'foundit', sourceRef: `foundit:${item.id}`, sourceUrl: item.url, companyName: item.companyName || item.merchantName, contactName: item.merchantName, email: item.contactEmail, phone: item.contactPhone, itemTitle: item.title, valuePence: item.listingFeePence + item.placementFeePence + item.deliveryFeePence + item.premiumFeePence }),
    signal: AbortSignal.timeout(8_000),
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || `FoundRetail lead sync returned HTTP ${response.status}`)
  const lead = body.data as { id: string }
  const conversion = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}/leads/${encodeURIComponent(lead.id)}/convert`, {
    method: 'POST',
    headers: { Authorization: authorization, 'Content-Type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(8_000),
  })
  const conversionBody = await conversion.json().catch(() => null)
  if (!conversion.ok) throw new Error(conversionBody?.message || `FoundRetail customer sync returned HTTP ${conversion.status}`)
  return { ...lead, stage: 'converted', customerId: conversionBody.data?.id as string | undefined }
}

export const pushScrapedLeadToFoundRetail = (request: Request, item: LeadItem) => pushScrapedLeadToFoundRetailWithAuthorization(request.get('authorization') || '', item)