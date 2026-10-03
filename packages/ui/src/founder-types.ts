/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Founder SuperDash payloads, shared by web and the mobile app.
export type FounderOverview = {
  generatedAt: string
  subscriptions: { customers: number; paying: number; free: number; new7d: number; new30d: number; active7d: number; byPlan: Array<{ plan: string; name: string; customers: number; mrrGbp: number }>; workspaceAdoption: Array<{ workspace: string; customers: number }>; signupsByDay: Array<{ date: string; count: number }> }
  finance: { mrrGbp: number; arrGbp: number; arpuGbp: number; boltOns: Array<{ workspace: string; customers: number; mrrGbp: number }>; billingLive: boolean; note: string }
  monitoring: { apiOk: boolean; dbLatencyMs: number; aiConfigured: boolean; emailConfigured: boolean; upgradeEmailsConfigured: boolean; lastAutopilotRunAt: string | null; aiRequests24h: number; autopilotActions24h: number; recordsCreated24h: number; integrationsConnected: number; integrationsFailing: Array<{ business: string; provider: string; status: string }> }
  upgradeRequests: Array<{ id: string; tenantId: string; business: string; ownerEmail: string; requested: string[]; pending: string[]; note: string; createdAt: string }>
  ratings?: { count: number; average: number | null; distribution: Array<{ score: number; count: number }>; recent: Array<{ id: string; tenantId: string; business: string; score: number; surface: string; page: string; comment: string; createdAt: string }> }
  tenants: Array<{ tenantId: string; businessName: string; ownerName: string; ownerEmail: string; plan: string; planName: string; workspaces: string[]; seats: number; monthlyValueGbp: number; status: string; createdAt: string; lastActiveAt: string | null }>
}
export type LedgerEntry = { id: string; label: string; kind: string; category: string; recurring: boolean; date: string; amountGbp: number; note: string }
export type PnlRow = { month: string; subscriptions: number; otherIncome: number; revenue: number; costs: number; net: number }
export type FounderFinance = {
  mrrGbp: number; arrGbp: number; arpuGbp: number; payingCustomers: number; billingLive: boolean; recurringCostsGbp: number
  thisMonth: PnlRow; cashGbp: number | null; cashAsOf: string | null; monthlyBurnGbp: number; runwayMonths: number | null
  pnl: PnlRow[]; byCategory: Array<{ category: string; monthlyGbp: number }>; topCustomers: Array<{ business: string; plan: string; monthlyGbp: number }>
  entries: LedgerEntry[]; categories: string[]; note: string
}
export type Post = { id: string; title: string; status: string; channel: string; text: string; hashtags: string; dueDate: string | null; campaign: string; publishedUrl: string | null; publishedAt: string | null; updatedAt: string; previewImage?: string }
export type FounderMarketing = {
  funnel: { signups30d: number; signups7d: number; customers: number; paying: number; conversionPct: number; upgradeRequests90d: number; active7d: number; signupsByWeek: Array<{ weekOf: string; signups: number }> }
  channels: { facebookInstagram: boolean; linkedin: boolean }
  posts: Post[]
  campaigns: Array<{ id: string; name: string; status: string; summary: string; updatedAt: string }>
}
